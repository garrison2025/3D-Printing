import fs from 'node:fs';import {inflateRawSync} from 'node:zlib';
const data=fs.readFileSync(new URL('../src/downloads/3d-print-cost-calculator-template.xlsx',import.meta.url));
const files={};let pos=0;
while(pos+30<=data.length&&data.readUInt32LE(pos)===0x04034b50){
 const method=data.readUInt16LE(pos+8),size=data.readUInt32LE(pos+18),ns=data.readUInt16LE(pos+26),extra=data.readUInt16LE(pos+28);
 const name=data.subarray(pos+30,pos+30+ns).toString(),start=pos+30+ns+extra,raw=data.subarray(start,start+size);
 files[name]=(method===8?inflateRawSync(raw):raw).toString();pos=start+size;
}
const sheet=files['xl/worksheets/sheet1.xml'],batch=files['xl/worksheets/sheet2.xml'];
function formulas(xml,refs){return Object.fromEntries(refs.map(ref=>{const c=xml.match(new RegExp('<x:c r="'+ref+'"[^>]*>[\\s\\S]*?<\\/x:c>'))?.[0]||'';return [ref,{formula:c.match(/<x:f>([^<]+)<\/x:f>/)?.[1]||null,cell:c.slice(0,250)}]}))}
console.log('WORKBOOK_FORMULA_AUDIT '+JSON.stringify({main:formulas(sheet,['G9','G11','G12','G14','G15','G16','G17','G18','G19','G20','G21','G22','G23']),batch:formulas(batch,['B5','C5','D5','E5','F5','B6','E6']),lastSheetRow:[...sheet.matchAll(/<x:row r="(\d+)"/g)].map(x=>Number(x[1])).at(-1)}));

console.log('WORKBOOK_INPUT_ROW_STRUCTURE '+JSON.stringify([25,26,27,28].map(n=>{const r=[...sheet.matchAll(new RegExp('<x:row r="'+n+'"[^>]*>[\\s\\S]*?<\\/x:row>','g'))].map(x=>x[0]);return {row:n,count:r.length,cells:r.flatMap(xml=>[...xml.matchAll(/<x:c r="([A-Z]+[0-9]+)"/g)].map(x=>x[1])),samples:r.map(x=>x.slice(0,420))}}))));
