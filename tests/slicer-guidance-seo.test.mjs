import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const pages=fs.readFileSync(new URL('../scripts/seo-pages.mjs',import.meta.url),'utf8');

test('real owner-page descriptions differ by purpose and avoid repetitive SEO boilerplate',()=>{
 for(const path of ['/about/','/privacy/','/terms/','/contact/'])
  assert.ok(build.includes("'"+path+"':"),path);
 assert.match(build,/description:supportDescriptions\[route\]/);
 assert.doesNotMatch(build,/\$\{title\} information for the PrintCost Studio/);
});
test('slicer-data tutorial cites only verified Prusa and UltiMaker documentation',()=>{
 assert.match(build,/id="slicer-estimates"/);
 assert.match(build,/Where to find filament weight and printing time/);
 assert.match(build,/help\.prusa3d\.com\/article\/first-print-with-prusaslicer-3-0-0_1079761/);
 assert.match(build,/support\.ultimaker\.com\/articles\/Knowledge\/000003132/);
 assert.match(build,/PrusaSlicer FAQ/);
});
test('material and hourly tools give a practical path to actual slicer inputs',()=>{
 assert.match(pages,/Where to find accurate filament grams/);
 assert.match(pages,/What if estimated print hours differ from real printer time/);
 assert.match(pages,/used-material estimate here, not the 1 kg/);
 assert.match(pages,/does not claim to measure your printer/);
});
