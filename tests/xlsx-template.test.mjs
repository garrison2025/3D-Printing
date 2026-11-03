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
