import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
for(const file of ['browser-qa.mjs','webkit-acceptance.mjs']){
 const js=fs.readFileSync(new URL('../scripts/'+file,import.meta.url),'utf8');
 test(file+' does not reject an owner-approved production release as staging noindex',()=>{
  assert.match(js,/manifest\.indexable\?'index,follow':'noindex,nofollow'/);
  assert.match(js,/await expectedRobots\(\)/);
  assert.doesNotMatch(js,/getAttribute\('content'\),'noindex,nofollow'/);
 });
}
