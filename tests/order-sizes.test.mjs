import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULTS,calculate} from '../src/lib/calculations.mjs';
test('batch-quote comparison uses the same per-order fee once at each quantity',()=>{
 const quantities=[1,5,10,25];
 const results=quantities.map(q=>calculate({...DEFAULTS,unitsPerOrder:q,packagingPerOrder:1.5,shippingCostPerOrder:4,shippingChargedPerOrder:0}));
 for(let i=0;i<results.length;i++){
  const r=results[i];assert.equal(r.ok,true);
  assert.ok(Math.abs(r.actualMargin-DEFAULTS.margin)<1e-10);
  assert.ok(Math.abs((r.platformFees-DEFAULTS.feeRate*r.orderGross)-DEFAULTS.feeFixed)<1e-10);
  if(i>0)assert.ok(r.recommendedPrice<results[i-1].recommendedPrice);
 }
});
test('actual customer shipping is counted toward gross, not removed from cost twice',()=>{
 const r=calculate({...DEFAULTS,unitsPerOrder:5,shippingChargedPerOrder:4,shippingCostPerOrder:4});
 assert.equal(r.ok,true);
 assert.ok(Math.abs(r.actualMargin-DEFAULTS.margin)<1e-10);
});
