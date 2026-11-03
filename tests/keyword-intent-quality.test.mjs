import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {calculate,DEFAULTS} from '../src/lib/calculations.mjs';
import {computeUseCases,costUseCasesHtml} from '../scripts/cost-use-cases.mjs';
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const pages=fs.readFileSync(new URL('../scripts/seo-pages.mjs',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../src/assets/pricing-quote.mjs',import.meta.url),'utf8');

test('small, larger and batch 3D printing examples are direct engine results with honest assumptions',()=>{
 const cases=computeUseCases();
 assert.equal(cases.length,3);
 for(const x of cases){
  assert.equal(x.result.ok,true);
  assert.equal(x.result.costPerUnit,calculate({...DEFAULTS,usedGrams:x.usedGrams,hours:x.hours,unitsPerPlate:x.unitsPerPlate}).costPerUnit);
 }
 const html=costUseCasesHtml();
 for(const t of ['Small single part','One larger part','Four parts on one plate','not commercial service quotes','not a guaranteed supplier price'])
  assert.ok(html.includes(t),t);
 assert.match(build,/costUseCasesHtml\(\)/);
});
test('official dated PLA/PETG retail snapshot never masquerades as live pricing',()=>{
 assert.match(pages,/checked November 4, 2026/);
 assert.match(pages,/eSUN official US storefront/);
 for(const price of ['$12.99','$15.99','$14.99','$0.01299','$0.01599','$0.01499'])assert.ok(pages.includes(price),price);
 assert.match(pages,/not live quotes, market-wide averages/);
 assert.match(pages,/do not automatically scrape or refresh/);
});
test('Bambu Studio preview guide gives actionable material and waste input rules',()=>{
 assert.match(build,/id="bambu-studio-cost-inputs"/);
 assert.match(build,/Slice plate/);
 assert.match(build,/Total filament in grams/);
 assert.match(build,/do not add purge waste again/);
 assert.match(build,/independent and is not affiliated with Bambu Lab/);
});
test('known-cost seller estimate can export CSV and print without transmitting personal data',()=>{
 assert.match(pages,/id=\\?"quote-download-csv/);
 assert.match(pages,/id=\\?"quote-print/);
 assert.match(pages,/id=\\?"quote-print-sheet/);
 assert.match(pages,/projectReference/);
 assert.match(js,/priceKnownCost/);
 assert.match(js,/URL\.createObjectURL/);
 assert.match(js,/window\.print\(\)/);
 assert.match(js,/safeCsvCell/);
 assert.match(js,/neutralized/);
 assert.doesNotMatch(js,/fetch\(|innerHTML\s*=/);
 assert.match(pages,/seller-controlled quotation calculator/);
});
