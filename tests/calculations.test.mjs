import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DEFAULTS,calculate,validateInputs} from '../src/lib/calculations.mjs';
const fixtures=JSON.parse(fs.readFileSync(new URL('../data/calculation-fixtures.json',import.meta.url),'utf8'));
for(const c of fixtures.cases) test(c.name,()=>{
 const r=calculate(c.inputs); if('error' in c.expected){assert.equal(r.ok,false);return;} assert.equal(r.ok,true,JSON.stringify(r.errors));
 const aliases={costPerUnit:'costPerUnit',recommendedPrice:'recommendedPrice',platformFees:'platformFees',netProfit:'netProfit',actualMargin:'actualMargin'};
 for(const [k,v] of Object.entries(c.expected)) {
  const actual=r[aliases[k]||k]; assert.ok(Math.abs(actual-v)<1e-6,`${k}: ${actual} != ${v}`);
 }
});
test('per-order fixed fee charged once when unitsPerOrder increases',()=>{
 const a=calculate({...DEFAULTS,unitsPerOrder:1});const b=calculate({...DEFAULTS,unitsPerOrder:2});
 assert.ok(b.ok&&a.ok);assert.ok(b.recommendedPrice<a.recommendedPrice);
 assert.ok(Math.abs((b.platformFees-b.inputs.feeRate*b.orderGross)-b.inputs.feeFixed)<1e-9);
});
test('shipping charged enters revenue; shipping cost enters expense',()=>{
 const r=calculate({...DEFAULTS,shippingChargedPerOrder:3,shippingCostPerOrder:4});assert.ok(r.ok);
 assert.ok(Math.abs(r.actualMargin-.3)<1e-10);
});
test('invalid rates, amounts and quantities blocked',()=>{
 for(const patch of [{margin:.95,feeRate:.1},{spoolGrams:0},{unitsPerPlate:0},{failRate:1},{hours:-1},{feeRate:.999,margin:.1}]) assert.equal(calculate({...DEFAULTS,...patch}).ok,false);
});
test('zero cost and zero margin is safe',()=>{
 const r=calculate({...DEFAULTS,spoolPrice:0,usedGrams:0,hours:0,machineCost:0,prepMinutes:0,finishPerUnit:0,feeFixed:0,feeRate:0,margin:0});
 assert.equal(r.ok,true);assert.equal(r.recommendedPrice,0);assert.equal(r.actualMargin,null);
});
