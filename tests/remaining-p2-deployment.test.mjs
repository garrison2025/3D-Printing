import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {comparePrintCosts} from '../src/lib/cost-comparison.mjs';
import {calculate,DEFAULTS} from '../src/lib/calculations.mjs';
import {priceKnownCost} from '../src/lib/seo-calculations.mjs';
import {spanishPricePage,spanishPriceRoute} from '../scripts/spanish-price.mjs';
import {compareSectionHtml} from '../scripts/cost-comparison-section.mjs';
const keywords=JSON.parse(fs.readFileSync(new URL('../src/content/keyword-intent-map.json',import.meta.url),'utf8')).keywords;
test('all seven original P2 keyword intents have appropriate actual page destinations',()=>{
 const p2=keywords.filter(x=>x.priority==='P2');
 assert.equal(p2.length,7);
 assert.ok(p2.every(x=>x.destination.startsWith('/')&&!x.destination.includes('future')));
 const expect={
  '3d printer price calculator':'/3d-print-pricing-calculator/',
  '3d print cost calculator app':'/',
  '3d printing cost calculator excel':'/3d-print-cost-calculator-excel/',
  '3d printer printing cost':'/how-much-does-3d-printing-cost/',
  '3d printing pricing spreadsheet':'/3d-print-cost-calculator-excel/',
  '3d printing cost comparison':'/calculation-methodology/',
  'calculadora precios impresion 3d':spanishPriceRoute
 };
 for(const row of p2)assert.equal(row.destination,expect[row.keyword],row.keyword);
});
test('real FDM engine compares two different hypothetical plates without unsupported averages',()=>{
 const a={usedGrams:100,hours:4,failRate:.05,unitsPerPlate:1};
 const b={usedGrams:100,hours:8,failRate:.05,unitsPerPlate:1};
 const v=comparePrintCosts(a,b);
 assert.ok(v.ok);
 assert.equal(v.a.costPerUnit,calculate({...DEFAULTS,...a}).costPerUnit);
 assert.equal(v.b.costPerUnit,calculate({...DEFAULTS,...b}).costPerUnit);
 assert.ok(Math.abs(v.delta-.512)<1e-9);
 assert.equal(v.percentage>0,true);
 const bad=comparePrintCosts({...a,unitsPerPlate:0},b);
 assert.equal(bad.ok,false);
});
test('comparison page has two independent editable scenarios and actual result UI',()=>{
 assert.match(compareSectionHtml,/data-cost-comparison/);
 for(const field of ['AUsedGrams','BUsedGrams','AHours','BHours','AFailurePercent','BFailurePercent','AUnitsPerPlate','BUnitsPerPlate'])
  assert.ok(compareSectionHtml.includes('name="'+field+'"'),field);
 assert.match(compareSectionHtml,/id="comparison-cost-a"/);
 assert.match(compareSectionHtml,/not retail selling prices/);
});
test('fully Spanish localized quote uses actual calculator and gives correct cents for 1 versus 10 pieces',()=>{
 const page=spanishPricePage();
 assert.equal(page.lang,'es');
 assert.equal(page.route,spanishPriceRoute);
 assert.match(page.main,/data-es-price-calculator/);
 assert.match(page.main,/Calcula cuánto cobrar/);
 assert.match(page.main,/no convierte divisas/);
 assert.match(page.main,/src="\/assets\/precios-es.mjs"/);
 const defaultValues={unitCost:6.79,quantity:1,feePercent:8,marginPercent:30,feeFixed:.30,packagingPerOrder:0,designPerOrder:0,shippingCostPerOrder:0,shippingChargedPerOrder:0};
 assert.equal(priceKnownCost(defaultValues).unitPrice,11.44);
 assert.equal(priceKnownCost({...defaultValues,quantity:10}).unitPrice,11);
});
test('real Spanish UI imports the existing quote engine and has no price-conversion dependency',()=>{
 const client=fs.readFileSync(new URL('../src/assets/precios-es.mjs',import.meta.url),'utf8');
 assert.match(client,/priceKnownCost/);
 assert.match(client,/Intl\.NumberFormat/);
 assert.match(client,/No aplicable/);
 assert.doesNotMatch(client,/fetch\(/);
});
