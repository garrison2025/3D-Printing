import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const method=fs.readFileSync(new URL('../scripts/geo-content.mjs',import.meta.url),'utf8');
const pricing=fs.readFileSync(new URL('../scripts/seo-pages.mjs',import.meta.url),'utf8');
test('publisher claims only the real brand and keeps verified source attribution',()=>{
 assert.match(build,/'@type':'Organization'/);
 assert.match(build,/publisher:\{'@id':publisherId\}/);
 assert.match(build,/does not claim registered corporate status/);
 assert.doesNotMatch(build,/aggregateRating:/);
});
test('home and quote page have different declared starting inputs',()=>{
 assert.match(build,/id="choose-calculator"/);
 assert.match(build,/Already know the cost per successfully finished item/);
 assert.match(pricing,/known-cost selling-price calculator/);
 assert.match(pricing,/does not take STL or G-code uploads/);
});
test('methodology separates first-party equations from source of slicer inputs',()=>{
 assert.match(method,/How to cite and independently check this method/);
 assert.match(method,/input collection method only/);
 assert.match(method,/public calculator source code/);
});
