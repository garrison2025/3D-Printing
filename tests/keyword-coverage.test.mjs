import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const keywords=JSON.parse(fs.readFileSync(new URL('../src/content/keyword-intent-map.json',import.meta.url),'utf8')).keywords;
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../src/assets/app.mjs',import.meta.url),'utf8');

test('all 131 imported Semrush keywords remain unique and have source data',()=>{
 assert.equal(keywords.length,131);
 assert.equal(new Set(keywords.map(x=>x.keyword.toLowerCase().trim())).size,131);
 for(const item of keywords) {
  assert.ok(item.keyword && item.source && item.destination);
  assert.ok(['P0','P1','P2','EXCLUDE'].includes(item.priority));
  if(['P0','P1'].includes(item.priority)) {
   assert.ok(Number.isFinite(item.us_volume),item.keyword+' lacks US search estimate');
   assert.ok(Number.isFinite(item.kd),item.keyword+' lacks KD');
  }
 }
});

test('approved priority totals do not inflate target-page count',()=>{
 for(const [p,n] of Object.entries({P0:25,P1:62,P2:7,EXCLUDE:37})) {
  assert.equal(keywords.filter(x=>x.priority===p).length,n);
 }
});

test('P0 and P1 intent destinations map to real pages or the existing pricing mode',()=>{
 const pages=new Set(['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/']);
 for(const item of keywords.filter(x=>['P0','P1'].includes(x.priority))) {
  const dest=item.destination.replace(/ \(pricing mode\)$/,'');
  assert.ok(pages.has(dest),item.keyword+' maps to undeveloped route: '+item.destination);
 }
});

test('pricing-guide CTA opens actual pricing mode on home without an extra canonical',()=>{
 assert.match(build,/id="pricing" role="group"/);
 assert.match(build,/href="\/#pricing">free cost and pricing calculator/);
 assert.match(app,/location\.hash==='#pricing'/);
 assert.match(app,/window\.addEventListener\('hashchange',modeFromHash\)/);
 assert.match(app,/modeFromHash\(\)/);
});

test('filament unit price uses four decimal places instead of two-cent rounding',()=>{
 assert.match(app,/const moneyPerGram=/);
 assert.match(app,/minimumFractionDigits:4,maximumFractionDigits:4/);
 assert.match(app,/focusVal=moneyPerGram\(r\.costPerGram\)/);
 assert.match(app,/Filament per gram: \$\{moneyPerGram\(r\.costPerGram\)\}/);
});
