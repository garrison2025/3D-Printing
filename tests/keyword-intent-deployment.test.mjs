import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const {keywords}=JSON.parse(fs.readFileSync(new URL('../src/content/keyword-intent-map.json',import.meta.url),'utf8'));
test('PLA price per gram query resolves to an actual material calculator',()=>{
 const entry=keywords.find(r=>r.keyword==='cost of pla per gram');
 assert.equal(entry.priority,'P1');
 assert.equal(entry.destination,'/filament-cost-calculator/');
});
test('all priority 0 and 1 keywords have an implemented on-site destination',()=>{
 const valid=new Set(['/','/3d-print-pricing-calculator/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/']);
 for(const r of keywords.filter(x=>x.priority==='P0'||x.priority==='P1'))
  assert.ok(valid.has(r.destination),r.keyword+': '+r.destination);
});
test('four priority groups remain exactly 131 original Semrush terms',()=>{
 for(const [p,count] of Object.entries({P0:25,P1:62,P2:7,EXCLUDE:37}))
  assert.equal(keywords.filter(r=>r.priority===p).length,count);
 assert.equal(new Set(keywords.map(r=>r.keyword.toLowerCase())).size,131);
});
