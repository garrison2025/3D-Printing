import {practicalUsdQuote} from '../lib/quote-precision.mjs';
/** Client-only Excel personalization. Preserves Office formulas and existing workbook styling. */
const encoder=new TextEncoder(),decoder=new TextDecoder();
export const workbookMime='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const inputCells={spoolPrice:'B6',spoolGrams:'B7',usedGrams:'B8',hours:'B9',unitsPerPlate:'B10',watts:'B11',energyRate:'B12',machineCost:'B13',lifeHours:'B14',prepMinutes:'B15',laborRate:'B16',failRate:'B17',finishPerUnit:'B18',feeRate:'B19',feeFixed:'B20',margin:'B21',unitsPerOrder:'B22',packagingPerOrder:'B23',shippingCostPerOrder:'B24',shippingChargedPerOrder:'B25',maintenancePerHour:'B26',designCostPerOrder:'B27'};
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
/** Wrap only the unit-price formula; every dependent order figure then recalculates from the customer charge.
 * On hardened sheets this must happen inside (not outside) the input-validation IF guard.
 */
function checkoutFormula(xml,cell){
 const re=new RegExp('<x:c\\s+[^>]*\\br="'+cell+'"[^>]*>[\\s\\S]*?<\\/x:c>');
 let found=0;
 const result=xml.replace(re,content=>{
  found++;
  if(content.includes('ROUNDUP('))return content;
  if(!/<x:f>[^<]+<\/x:f>/.test(content))throw Error('Missing checkout formula '+cell);
  return content.replace(/<x:f>([^<]+)<\/x:f>/,(_full,formula)=>'<x:f>ROUNDUP('+formula+',2)</x:f>');
 });
 if(found!==1)throw Error('Missing checkout cell '+cell);
 return result;
}
function modifyFormula(xml,cell,update){
 const re=new RegExp('<x:c\\s+[^>]*\\br="'+cell+'"[^>]*>[\\s\\S]*?<\\/x:c>');
 let hits=0;
 const changed=xml.replace(re,content=>{
  hits++;
  if(!/<x:f>[^<]+<\/x:f>/.test(content))throw Error('Missing formula for '+cell);
  return content.replace(/<x:f>([^<]+)<\/x:f>/,(_all,f)=>'<x:f>'+update(f)+'</x:f>');
 });
 if(hits!==1)throw Error('Missing formula cell '+cell);
 return changed;
}
function extendCostFormulas(m,b){
 m=modifyFormula(m,'G11',f=>f.includes('B26')?f:'('+f+')+B9*B26');
 m=modifyFormula(m,'G14',f=>f.includes('B27')?f:'('+f+')+B27');
 m=modifyFormula(m,'G23',f=>f.includes('B26')?f:'('+f+')+B26');
 for(let row=5;row<=9;row++){
  b=modifyFormula(b,'B'+row,f=>{
   const target="'Cost Calculator'!$B$24+";
   if(f.includes("'Cost Calculator'!$B$27"))return f;
   if(!f.includes(target))throw Error('Unexpected batch price formula '+row);
   return f.replace(target,target+"'Cost Calculator'!$B$27+");
  });
  b=modifyFormula(b,'E'+row,f=>{
   const target="'Cost Calculator'!B24)";
   if(f.includes("'Cost Calculator'!B27"))return f;
   if(!f.includes(target))throw Error('Unexpected batch profit formula '+row);
   return f.replace(target,"'Cost Calculator'!B24+'Cost Calculator'!B27)");
  });
 }
 return {m,b};
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
 // Original bundled template lacks B26/B27; first apply the same tested hardening as the public download.
 if(!m.includes('r="G26"'))return personalizeWorkbook(await hardenWorkbookTemplate(template),inputs,calculate);
 for(const [key,cell] of Object.entries(inputCells))m=changeCell(m,cell,current.inputs[key]);
 m=checkoutFormula(m,'G16');for(let row=5;row<=9;row++)b=checkoutFormula(b,'B'+row);
 const actual=practicalUsdQuote(current);if(!actual)throw Error('Cannot form a whole-cent checkout quote');
 const calculated={G6:current.costPerGram,G7:current.materialPerPlate,G8:current.energyPerPlate,G9:current.machinePerPlate,G10:current.prepPerPlate,G11:current.attemptCost,G12:current.expectedPlateCost,G13:current.costPerUnit,G14:current.orderExpenses,G15:current.requiredOrderGross,G16:actual.unitPrice,G17:actual.orderGross,G18:actual.platformFees,G19:actual.netProfit,G20:actual.actualMargin??0,G21:actual.netProfit/current.inputs.unitsPerOrder,G22:current.costPerUnit>0?actual.netProfit/current.inputs.unitsPerOrder/current.costPerUnit:0,G23:current.machineHourly+current.electricityHourly+current.inputs.maintenancePerHour};
 for(const [cell,value] of Object.entries(calculated))m=changeCell(m,cell,value);
 [1,5,10,25,current.inputs.unitsPerOrder].forEach((quantity,i)=>{
  const v=calculate({...current.inputs,unitsPerOrder:quantity});
  if(!v.ok)throw Error('Invalid Excel batch quote');const cash=practicalUsdQuote(v);if(!cash)throw Error('Invalid cent-safe Excel batch quote');
  const r=i+5;
  for(const [col,value] of Object.entries({A:quantity,B:cash.unitPrice,C:cash.orderGross,D:cash.platformFees,E:cash.netProfit,F:cash.actualMargin??0}))b=changeCell(b,col+r,value);
 });
 main.data=encoder.encode(m);batch.data=encoder.encode(b);
 const book=get('xl/workbook.xml'),xml=decoder.decode(book.data);
 book.data=encoder.encode(xml.includes('<x:calcPr')?xml.replace(/<x:calcPr[^>]*\/>/,'<x:calcPr fullCalcOnLoad="1" forceFullCalc="1" />'):xml.replace('</x:workbook>','<x:calcPr fullCalcOnLoad="1" forceFullCalc="1" /></x:workbook>'));
 return zip(parts);
}
/** Make downloaded example templates safe when edited offline in Excel/LibreOffice.
 * The template remains the original OOXML workbook with real user-editable formulas.
 * This operation is also run at build time, never on a remote service.
 */
export async function hardenWorkbookTemplate(sourceBytes){
 const parts=await unzip(sourceBytes);
 const find=name=>{const f=parts.find(p=>p.name===name);if(!f)throw Error('Template part missing '+name);return f};
 const main=find('xl/worksheets/sheet1.xml'),batch=find('xl/worksheets/sheet2.xml');
 let m=decoder.decode(main.data),b=decoder.decode(batch.data);
 if(m.includes('r="G26"'))throw Error('Template already contains validation; do not apply twice');
 // Reject missing/text entries, negative and excessive values, non-integer quantities,
 // invalid denominators, impossible failure rates and fee+margin combinations.
 const validation='IF(AND(COUNT(B6:B27)=22,MIN(B6:B27)>=0,MAX(B6:B27)<=10000000000,B7>0,B14>0,B10>=1,MOD(B10,1)=0,B10<=100000,B22>=1,MOD(B22,1)=0,B22<=100000,B17<=0.95,B19<1,B21<1,B19+B21<1),"VALID","INVALID INPUTS - review blue cells")';
 const inputStyle=m.match(/<x:c r="B25" s="(\d+)"/)?.[1]||'1';
 const row='<x:row r="26" ht="28" customHeight="1">'+
 '<x:c r="A26" t="str"><x:v>Maintenance reserve per hour USD</x:v></x:c>'+
 '<x:c r="B26" s="'+inputStyle+'" t="n"><x:v>0</x:v></x:c>'+
 '<x:c r="F26" s="10" t="str"><x:v>INPUT STATUS</x:v></x:c>'+
 '<x:c r="G26" t="str"><x:f>'+validation.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</x:f><x:v>VALID</x:v></x:c>'+
 '<x:c r="H26" t="str"><x:v>Invalid values make prices blank, never zero.</x:v></x:c>'+
 '</x:row><x:row r="27">'+
 '<x:c r="A27" t="str"><x:v>Design and order overhead USD</x:v></x:c>'+
 '<x:c r="B27" s="'+inputStyle+'" t="n"><x:v>0</x:v></x:c>'+ 
 '<x:c r="F27" t="str"><x:v>Fix blue fields before quoting.</x:v></x:c>'+
 '<x:c r="G27" t="str"><x:v>Failure 0-95%; item counts whole; fee + margin below 100%.</x:v></x:c></x:row>';
 if(!m.includes('<x:row r="28"'))throw Error('Template lacks insertion position');
 m=m.replace('<x:row r="28"',row+'<x:row r="28"');
 ({m,b}=extendCostFormulas(m,b));
 const wrap=(xml,cell,guard)=>{
  const re=new RegExp('<x:c\\s+[^>]*\\br="'+cell+'"[^>]*>[\\s\\S]*?<\\/x:c>');let found=0;
  const out=xml.replace(re,content=>{
   found++;
   if(!/<x:f>[^<]*<\/x:f>/.test(content))throw Error('Missing formula in '+cell);
   return content.replace(/<x:f>([^<]+)<\/x:f>/,(all,f)=>'<x:f>IF('+guard+','+f+',"")</x:f>');
  });
  if(found!==1)throw Error('Missing computed cell '+cell);
  return out;
 };
 m=checkoutFormula(m,'G16');for(let row=5;row<=9;row++)b=checkoutFormula(b,'B'+row);
 for(let row=6;row<=23;row++)m=wrap(m,'G'+row,'$G$26="VALID"');
 for(let row=5;row<=9;row++){
  if(row===9)b=wrap(b,'A9',"'Cost Calculator'!$G$26=\"VALID\"");
  for(const c of 'BCDEF')b=wrap(b,c+row,"'Cost Calculator'!$G$26=\"VALID\"");
 }
 main.data=encoder.encode(m);batch.data=encoder.encode(b);
 const book=find('xl/workbook.xml');
 let x=decoder.decode(book.data);
 if(!x.includes('<x:calcPr'))x=x.replace('</x:workbook>','<x:calcPr fullCalcOnLoad="1" forceFullCalc="1" /></x:workbook>');
 book.data=encoder.encode(x);
 return zip(parts);
}
