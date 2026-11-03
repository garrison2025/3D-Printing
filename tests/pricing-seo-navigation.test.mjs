import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const keywords=JSON.parse(fs.readFileSync(new URL('../src/content/keyword-intent-map.json',import.meta.url),'utf8')).keywords;

test('primary navigation links to the actual pricing tool, not only an explanatory guide',()=>{
 const header=build.split('\n').find(line=>line.startsWith('const header='))||'';
 assert.match(header,/href="\/3d-print-pricing-calculator\/"[^\n]*>Price calculator<\/a>/);
 assert.doesNotMatch(header,/href="\/how-to-price-3d-prints\/"[^\n]*>Pricing guide<\/a>/);
});
test('seller guide main CTA opens the canonical price calculator URL',()=>{
 assert.match(build,/route==='\/how-to-price-3d-prints\/'\?'\/3d-print-pricing-calculator\/'/);
});
test('pricing, costs and materials remain separate keyword intents with one canonical tool each',()=>{
 assert.equal(keywords.filter(k=>['P0','P1'].includes(k.priority)).length,87);
 assert.equal(keywords.filter(k=>['P0','P1'].includes(k.priority)&&k.destination==='/3d-print-pricing-calculator/').length,20);
 assert.equal(keywords.filter(k=>['P0','P1'].includes(k.priority)&&k.destination==='/filament-cost-calculator/').length,23);
 assert.equal(keywords.filter(k=>['P0','P1'].includes(k.priority)&&k.destination==='/').length,19);
});
