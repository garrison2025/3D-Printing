import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {inflateRawSync} from 'node:zlib';
const file=new URL('../src/downloads/3d-print-cost-calculator-template.xlsx',import.meta.url);
const data=fs.readFileSync(file);
function unzipLocalEntries(buf){
 const files=new Map();let pos=0;
 while(pos+30<=buf.length && buf.readUInt32LE(pos)===0x04034b50){
  const method=buf.readUInt16LE(pos+8),len=buf.readUInt32LE(pos+18);
  const nLen=buf.readUInt16LE(pos+26),eLen=buf.readUInt16LE(pos+28);
  const path=buf.subarray(pos+30,pos+30+nLen).toString();
  const start=pos+30+nLen+eLen;
  const bytes=buf.subarray(start,start+len);
  files.set(path,method===8?inflateRawSync(bytes):bytes);
  pos=start+len;
 }
 return files;
}
test('spreadsheet is a genuine Office XLSX ZIP with editable formula sheets',()=>{
 assert.ok(data.length>5000);
 assert.equal(data.readUInt32LE(0),0x04034b50);
 const parts=unzipLocalEntries(data);
 const names=['xl/workbook.xml','xl/worksheets/sheet1.xml','xl/worksheets/sheet2.xml','xl/worksheets/sheet3.xml'];
 for(const path of names)assert.ok(parts.has(path),'Missing '+path);
 const main=parts.get(names[1]).toString(),batch=parts.get(names[2]).toString();
 assert.ok((main.match(/<x:f>/g)||[]).length>=18,'Main sheet has no working formulas');
 assert.ok((batch.match(/<x:f>/g)||[]).length>=25,'Batch sheet has no formulas');
 assert.match(main,/6\.787157894/);
 assert.match(batch,/11\.430899830/);
});
test('actual site publishes the nonindexable template download from its own origin',()=>{
 const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 assert.match(build,/href="\/assets\/3d-print-cost-calculator-template\.xlsx"/);
 assert.match(build,/src\/downloads\/3d-print-cost-calculator-template\.xlsx/);
});

test('cost and price guides link the actual editable Excel template with truthful limitations',()=>{
 const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 assert.equal(build.split('href="/assets/3d-print-cost-calculator-template.xlsx"').length-1,3);
 assert.match(build,/9\. Common quoting mistakes/);
 assert.match(build,/does not copy the current inputs from your browser/);
 const qa=fs.readFileSync(new URL('../scripts/browser-qa.mjs',import.meta.url),'utf8');
 assert.match(qa,/Both pricing and cost guides offer a working editable spreadsheet/);
});

test('client-side Excel export preserves editable formulas and includes changed inputs',async()=>{
 const {calculate,DEFAULTS}=await import('../src/lib/calculations.mjs');
 const {personalizeWorkbook}=await import('../src/assets/xlsx-personalize.mjs');
 const personalized=await personalizeWorkbook(data,{...DEFAULTS,usedGrams:145,unitsPerOrder:9,shippingCostPerOrder:4},calculate);
 const content=Buffer.from(personalized).toString('utf8');
 assert.match(content,/<x:c r="B8"[^>]*><x:v>145<\/x:v><\/x:c>/);
 assert.match(content,/<x:c r="B22"[^>]*><x:v>9<\/x:v><\/x:c>/);
 assert.match(content,/<x:c r="A9"[^>]*><x:f>[^<]+<\/x:f><x:v>9<\/x:v><\/x:c>/);
 assert.match(content,/<x:f>IFERROR\(G11\/\(1-B17\),0\)<\/x:f>/);
 assert.match(content,/forceFullCalc="1"/);
});
test('client-side Excel export rejects impossible profit assumptions',async()=>{
 const {calculate,DEFAULTS}=await import('../src/lib/calculations.mjs');
 const {personalizeWorkbook}=await import('../src/assets/xlsx-personalize.mjs');
 await assert.rejects(personalizeWorkbook(data,{...DEFAULTS,feeRate:0.8,margin:0.3},calculate),/invalid inputs/i);
});

test('published workbook has editable offline input validation and no misleading zero quote',async()=>{
 const {hardenWorkbookTemplate,personalizeWorkbook}=await import('../src/assets/xlsx-personalize.mjs');
 const {DEFAULTS,calculate}=await import('../src/lib/calculations.mjs');
 const hardened=Buffer.from(await hardenWorkbookTemplate(data));
 const parts=unzipLocalEntries(hardened);
 const main=parts.get('xl/worksheets/sheet1.xml').toString();
 const batch=parts.get('xl/worksheets/sheet2.xml').toString();
 const book=parts.get('xl/workbook.xml').toString();
 assert.match(main,/r="G26"[^>]*><x:f>IF\(AND\(COUNT\(B6:B25\)=20/);
 assert.match(main,/INVALID INPUTS - review blue cells/);
 assert.match(main,/<x:f>IF\(\$G\$26="VALID",IFERROR\(G11\/\(1-B17\),0\),""\)<\/x:f>/);
 assert.match(batch,/<x:f>IF\('Cost Calculator'!\$G\$26="VALID"/);
 assert.match(book,/fullCalcOnLoad="1"/);
 assert.match(main,/r="G16"[^>]*><x:f>IF\(\$G\$26="VALID",ROUNDUP\(/);
 const personalized=Buffer.from(await personalizeWorkbook(hardened,{...DEFAULTS,usedGrams:145},calculate));
 const rep=unzipLocalEntries(personalized);
 assert.match(rep.get('xl/worksheets/sheet1.xml').toString(),/r="B8"[^>]*><x:v>145<\/x:v>/);
 assert.equal((rep.get('xl/workbook.xml').toString().match(/<x:calcPr /g)||[]).length,1);
});
