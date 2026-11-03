import test from 'node:test';
import assert from 'node:assert/strict';
import {priceKnownCost} from '../src/lib/seo-calculations.mjs';
const base={unitCost:6.79,quantity:1,feePercent:8,marginPercent:30,feeFixed:.30,
 packagingPerOrder:0,designPerOrder:0,shippingCostPerOrder:0,shippingChargedPerOrder:0};
test('a $6.79 known cost produces a whole-cent $11.44 quote with target margin',()=>{
 const r=priceKnownCost(base);assert.equal(r.ok,true);assert.equal(r.unitPrice,11.44);
 assert.equal(r.orderGross,11.44);assert.ok(r.actualMargin>=.3);
 assert.ok(Math.abs(r.netProfit-3.4348)<1e-9);
});
test('five units allocate the fixed fee once and charge every unit at $16.23',()=>{
 const r=priceKnownCost({...base,unitCost:10,quantity:5});
 assert.equal(r.ok,true);assert.equal(r.unitPrice,16.23);assert.equal(r.orderGross,81.15);
 assert.ok(r.actualMargin>=.3);assert.ok(Math.abs(r.platformFees-6.792)<1e-9);
});
test('charged shipping counts toward gross while carrier shipping is an expense',()=>{
 const r=priceKnownCost({...base,unitCost:12,quantity:2,shippingChargedPerOrder:5,
  shippingCostPerOrder:7,designPerOrder:3,packagingPerOrder:1});
 assert.equal(r.ok,true);assert.equal(r.totalExpenses,35);
 assert.equal(r.orderGross,r.unitPrice*2+5);assert.ok(r.actualMargin>=.3-1e-10);
});
test('bad percentages, quantities, blanks, negative values and huge prices are rejected',()=>{
 for(const x of [{quantity:1.5},{quantity:0},{feePercent:80,marginPercent:30},
 {marginPercent:100},{unitCost:''},{unitCost:-1},{feeFixed:1e12}]){
  assert.equal(priceKnownCost({...base,...x}).ok,false,JSON.stringify(x));
 }
});
test('a zero-cost zero-fee quote is permitted without a fictional margin',()=>{
 const r=priceKnownCost({...base,unitCost:0,feeFixed:0,feePercent:0,marginPercent:0});
 assert.equal(r.ok,true);assert.equal(r.unitPrice,0);assert.equal(r.actualMargin,null);
});
