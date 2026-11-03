import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {calculateMixedOrder} from '../src/lib/calculations.mjs';
test('two different models share fixed fees once and preserve target checkout margin',()=>{
 const r=calculateMixedOrder({items:[{name:'A',unitCost:5,quantity:2},{name:'B',unitCost:12,quantity:1}],feeRate:.08,feeFixed:.3,margin:.3,packagingPerOrder:1,shippingCostPerOrder:5,shippingChargedPerOrder:4,designCostPerOrder:2});
 assert.equal(r.ok,true);assert.equal(r.partsCost,22);assert.equal(r.orderExpenses,30);assert.equal(r.totalParts,3);assert.ok(r.actualMargin>=.3-1e-12);
 assert.equal(Math.round(r.itemSubtotal*100),r.itemSubtotal*100);
 assert.equal(r.orderGross,r.itemSubtotal+4);
});
test('mixed quote rejects bad data and does not invent per-model prices',()=>{
 for(const input of [{items:[]},{items:[{unitCost:2,quantity:0}]},{items:[{unitCost:-1,quantity:2}]},{items:[{unitCost:2,quantity:1}],feeRate:.8,margin:.3}])assert.equal(calculateMixedOrder(input).ok,false);
 const r=calculateMixedOrder({items:[{name:'X',unitCost:1,quantity:1}]});assert.equal(r.ok,true);assert.ok(!('pricePerItem' in r));
});
test('mixed order is an optional homepage panel with CSV and no new indexable route',()=>{
 const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 const app=fs.readFileSync(new URL('../src/assets/mixed-order.mjs',import.meta.url),'utf8');
 assert.match(build,/id="mixed-quote"/);assert.match(app,/printcost-mixed-order\.csv/);
 assert.match(app,/calculateMixedOrder/);assert.ok(!build.includes('write(\'/mixed-order/\''));
});
