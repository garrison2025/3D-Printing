import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../scripts/live-audit.mjs',import.meta.url),'utf8');
test('live audit includes all ten published page templates',()=>{
 const list=source.match(/const routes=\[([^\]]+)\]/)?.[1]||'';
 assert.equal((list.match(/'\/[^']*'/g)||[]).length,10);
 for(const path of ['/','/calculation-methodology/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-to-price-3d-prints/'])assert.ok(list.includes("'"+path+"'"),path);
});
test('never treat pages.dev as an indexable production domain',()=>{
 assert.match(source,/Refusing production indexing audit on a temporary pages\.dev domain/);
});
test('live audit confirms methodology and schema are visible',()=>{
 assert.match(source,/methodology links to source/);
 assert.match(source,/has real WebPage schema/);
 assert.match(source,/parseable JSON-LD/);
});

test('deployment manifest enforces actual Cloudflare commit parity',()=>{
 const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 assert.match(build,/CF_PAGES_COMMIT_SHA/);
 assert.match(build,/build-manifest\.json/);
 assert.match(source,/EXPECTED_COMMIT/);
 assert.match(source,/deployment manifest origin matches canonical/);
});
