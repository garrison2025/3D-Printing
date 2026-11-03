import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const map=JSON.parse(fs.readFileSync(new URL('../src/content/keyword-intent-map.json',import.meta.url),'utf8'));
test('twenty validated pricing/quote intents route to one functional dedicated page',()=>{
 assert.equal(map.keywords.filter(x=>x.destination==='/3d-print-pricing-calculator/'&&['P0','P1'].includes(x.priority)).length,20);
 assert.equal(map.keywords.filter(x=>x.destination==='/3d-print-pricing-calculator/').length,21,'one additional P2 intent uses the same functional page');
 assert.ok(!map.keywords.some(x=>x.destination==='/ (pricing mode)'));
 assert.match(build,/pricingQuotePage\(\)/);
 assert.match(build,/href="\/3d-print-pricing-calculator\/"/);
 assert.match(build,/pages=\[[^\n]+3d-print-pricing-calculator/);
});
test('quote calculator is shipped with its browser module, without unsafe HTML rendering',()=>{
 const source=fs.readFileSync(new URL('../src/assets/pricing-quote.mjs',import.meta.url),'utf8');
 assert.match(source,/priceKnownCost/);
 assert.match(source,/textContent/);
 assert.doesNotMatch(source,/innerHTML\s*=/);
 assert.match(build,/assets\/pricing-quote.mjs/);
});
