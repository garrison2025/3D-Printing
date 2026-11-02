import test from 'node:test';import assert from 'node:assert/strict';import{filamentEstimate,hourlyEstimate}from '../src/lib/seo-calculations.mjs';
test('filament dollar-per-gram and four part model',()=>{let x=filamentEstimate({spoolPrice:25,spoolGrams:1000,usedGrams:100,itemsPerPlate:4});assert.equal(x.perGram,.025);assert.equal(x.perItem,.625);assert.equal(x.fullPlates,10)});
test('filament rejects invalid unit base',()=>assert.throws(()=>filamentEstimate({spoolPrice:25,spoolGrams:0,usedGrams:100})));
test('hourly printer cost plus electricity',()=>{let x=hourlyEstimate({printerPrice:400,lifeHours:4000,watts:120,electricityRate:.18});assert.ok(Math.abs(x.total-.1216)<1e-9)});
test('hourly rate includes optional active labor',()=>{let x=hourlyEstimate({printerPrice:400,lifeHours:4000,watts:120,electricityRate:.18,maintenancePerHour:.05,operatorMinutesPerHour:10,laborRate:15});assert.ok(Math.abs(x.total-2.6716)<1e-9)});

test('dual-filament prints sum independently priced materials and identify limiting spool',()=>{
 const r=filamentEstimate({spoolPrice:25,spoolGrams:1000,usedGrams:100,itemsPerPlate:2,secondSpoolPrice:50,secondSpoolGrams:500,secondUsedGrams:25});
 assert.equal(r.primaryPerPlate,2.5);assert.equal(r.secondaryPerPlate,2.5);
 assert.equal(r.perPlate,5);assert.equal(r.perItem,2.5);assert.equal(r.fullPlates,10);assert.equal(r.hasSecond,true);
});
test('a second material may be unused without affecting the original result',()=>{
 const r=filamentEstimate({spoolPrice:25,spoolGrams:1000,usedGrams:100,itemsPerPlate:4});
 assert.equal(r.hasSecond,false);assert.equal(r.perPlate,2.5);assert.equal(r.perItem,.625);
});
test('reject invalid second material denominators and non-finite values',()=>{
 assert.throws(()=>filamentEstimate({spoolPrice:25,spoolGrams:1000,usedGrams:100,secondSpoolGrams:0,secondUsedGrams:5}));
 assert.throws(()=>filamentEstimate({spoolPrice:25,spoolGrams:1000,usedGrams:100,secondSpoolPrice:Infinity}));
});
