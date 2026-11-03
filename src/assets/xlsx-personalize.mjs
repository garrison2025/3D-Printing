/** Client-only Excel personalization. Preserves Office formulas and existing workbook styling. */
const encoder=new TextEncoder(),decoder=new TextDecoder();
export const workbookMime='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const inputCells={spoolPrice:'B6',spoolGrams:'B7',usedGrams:'B8',hours:'B9',unitsPerPlate:'B10',watts:'B11',energyRate:'B12',machineCost:'B13',lifeHours:'B14',prepMinutes:'B15',laborRate:'B16',failRate:'B17',finishPerUnit:'B18',feeRate:'B19',feeFixed:'B20',margin:'B21',unitsPerOrder:'B22',packagingPerOrder:'B23',shippingCostPerOrder:'B24',shippingChargedPerOrder:'B25'};
function changeCell(xml,ref,value){
 if(typeof value!=='number'||!Number.isFinite(value))throw Error('Invalid Excel cell '+ref);
 const re=new RegExp('<x:c\\s+[^>]*\\br="'+ref+'"[^>]*>[\\s\\S]*?<\\/x:c>');
 let hit=0;
 const changed=xml.replace(re,cell=>{
  hit++;
  const next=cell.replace(/<x:v>[^<]*<\/x:v>/,'<x:v>'+value+'</x:v>');
  if(!next.includes('<x:v>'+value+'</x:v>'))throw Error('Invalid template cell '+ref);
  return next;
 });
 if(hit!==1)throw Error('Missing template cell '+ref);
 return changed;
}
function crc32(bytes){let c=0xffffffff;for(const n of bytes){c^=n;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
async function unzip(buffer){
 const b=buffer instanceof Uint8Array?buffer:new Uint8Array(buffer),v=new DataView(b.buffer,b.byteOffset,b.byteLength);
 const list=[];let i=0;
 while(i+4<=b.length&&v.getUint32(i,true)===0x04034b50){
  const flags=v.getUint16(i+6,true),method=v.getUint16(i+8,true),size=v.getUint32(i+18,true);
  if(flags&8||![0,8].includes(method))throw Error('Unsupported template ZIP format');
  const nameSize=v.getUint16(i+26,true),extra=v.getUint16(i+28,true),name=decoder.decode(b.subarray(i+30,i+30+nameSize));
  const start=i+30+nameSize+extra,end=start+size;
  if(end>b.length)throw Error('Corrupt template ZIP');
  const part=b.subarray(start,end);
  const data=method===0?part.slice():new Uint8Array(await new Response(new Blob([part]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
  if(data.length!==v.getUint32(i+22,true))throw Error('Invalid XLSX member size');
  list.push({name,data});i=end;
 }
 if(list.length<3)throw Error('Invalid Excel template');
 return list;
}
function zip(files){
 const local=[],central=[],u16=(v,i,x)=>v.setUint16(i,x,true),u32=(v,i,x)=>v.setUint32(i,x,true);let offset=0;
 for(const {name,data} of files){
  const n=encoder.encode(name),size=data.length,checksum=crc32(data);
  if(n.length>65535||size>0xffffffff)throw Error('Excel workbook too large');
  const lh=new Uint8Array(30),l=new DataView(lh.buffer);
  u32(l,0,0x04034b50);u16(l,4,20);u32(l,14,checksum);u32(l,18,size);u32(l,22,size);u16(l,26,n.length);local.push(lh,n,data);
  const ch=new Uint8Array(46),c=new DataView(ch.buffer);
  u32(c,0,0x02014b50);u16(c,4,20);u16(c,6,20);u32(c,16,checksum);u32(c,20,size);u32(c,24,size);u16(c,28,n.length);u32(c,42,offset);central.push(ch,n);
  offset+=30+n.length+size;
 }
 const centralSize=central.reduce((s,b)=>s+b.length,0);
 if(files.length>65535||offset+centralSize>0xffffffff)throw Error('Excel ZIP too large');
 const last=new Uint8Array(22),v=new DataView(last.buffer);
 u32(v,0,0x06054b50);u16(v,8,files.length);u16(v,10,files.length);u32(v,12,centralSize);u32(v,16,offset);
 const out=new Uint8Array(offset+centralSize+22);let pos=0;
 for(const item of [...local,...central,last]){out.set(item,pos);pos+=item.length}
 return out;
}
/** Entire operation is local: no customer inputs are sent to the server. */
export async function personalizeWorkbook(template,inputs,calculate){
 const current=calculate(inputs);
 if(!current.ok)throw Error('Correct invalid inputs before exporting Excel');
 const parts=await unzip(template),get=name=>{const item=parts.find(x=>x.name===name);if(!item)throw Error('Missing workbook part '+name);return item};
 const main=get('xl/worksheets/sheet1.xml'),batch=get('xl/worksheets/sheet2.xml');
 let m=decoder.decode(main.data),b=decoder.decode(batch.data);
 for(const [key,cell] of Object.entries(inputCells))m=changeCell(m,cell,current.inputs[key]);
 const calculated={G6:current.costPerGram,G7:current.materialPerPlate,G8:current.energyPerPlate,G9:current.machinePerPlate,G10:current.prepPerPlate,G11:current.attemptCost,G12:current.expectedPlateCost,G13:current.costPerUnit,G14:current.orderExpenses,G15:current.requiredOrderGross,G16:current.recommendedPrice,G17:current.orderGross,G18:current.platformFees,G19:current.netProfit,G20:current.actualMargin??0,G21:current.profitPerUnit,G22:current.markupOnProductionCost??0,G23:current.machineHourly+current.electricityHourly};
 for(const [cell,value] of Object.entries(calculated))m=changeCell(m,cell,value);
 [1,5,10,25,current.inputs.unitsPerOrder].forEach((quantity,i)=>{
  const v=calculate({...current.inputs,unitsPerOrder:quantity});
  if(!v.ok)throw Error('Invalid Excel batch quote');
  const r=i+5;
  for(const [col,value] of Object.entries({A:quantity,B:v.recommendedPrice,C:v.orderGross,D:v.platformFees,E:v.netProfit,F:v.actualMargin??0}))b=changeCell(b,col+r,value);
 });
 main.data=encoder.encode(m);batch.data=encoder.encode(b);
 const book=get('xl/workbook.xml'),xml=decoder.decode(book.data);
 book.data=encoder.encode(xml.replace('</x:workbook>','<x:calcPr fullCalcOnLoad="1" forceFullCalc="1" /></x:workbook>'));
 return zip(parts);
}