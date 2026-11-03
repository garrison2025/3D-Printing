import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const offline=fs.readFileSync(new URL('../scripts/offline-preview.mjs',import.meta.url),'utf8');
test('CSS preserves visual cascade order while shipping one browser stylesheet',()=>{
 assert.match(build,/cssFiles=/);
 for(const file of ['site.css','polish.css','refinement.css','finish.css','seo-tools.css'])assert.ok(build.includes(file));
 assert.ok(build.includes('href="/assets/site-bundle.css"'));
 assert.ok(offline.includes('dist/assets/site-bundle.css'));
});
