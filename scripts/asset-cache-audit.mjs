import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

// Verify that the exact stylesheet bytes are uniquely addressed by content.
// Old HTML may cache old styles; new HTML must never reference those old bytes.
const dist='dist',assets=path.join(dist,'assets');
const homepage=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const link=homepage.match(/<link rel="stylesheet" href="(\/assets\/site-bundle\.([0-9a-f]{12})\.css)">/);
assert.ok(link,'Homepage must reference a fingerprinted CSS bundle');
const cssFile=path.join(dist,link[1].slice(1));
assert.ok(fs.existsSync(cssFile),'Fingerprint CSS file must exist in generated deployment');
const css=fs.readFileSync(cssFile);
const hash=createHash('sha256').update(css).digest('hex').slice(0,12);
assert.equal(hash,link[2],'CSS fingerprint must be derived from actual file bytes');
assert.equal(css.compare(fs.readFileSync(path.join(assets,'site-bundle.css'))),0,'Legacy CSS copy must match the fingerprinted bundle');
const headers=fs.readFileSync(path.join(dist,'_headers'),'utf8');
assert.match(headers,/\/assets\/\*\s+Cache-Control: public, no-cache, must-revalidate/,'Unversioned JS modules must revalidate after deploy');
const all=[];
function walk(folder){
 for(const item of fs.readdirSync(folder,{withFileTypes:true})){
  const file=path.join(folder,item.name);
  if(item.isDirectory())walk(file);
  else if(item.name==='index.html')all.push(file);
 }
}
walk(dist);
assert.ok(all.length>=13,'Expected 13 generated page templates');
for(const file of all){
 const html=fs.readFileSync(file,'utf8');
 assert.ok(html.includes('<link rel="stylesheet" href="'+link[1]+'">'),'HTML stylesheet version drift: '+file);
}
console.log('PASS CSS fingerprint='+link[2]+' '+all.length+' generated pages, all unversioned assets revalidate');
