import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,DEFAULTS} from '../src/lib/calculations.mjs';
import {CASE_INPUTS,computeUseCases,costUseCasesHtml} from '../scripts/cost-use-cases.mjs';

test('three worked cost-guide examples are derived from the production calculator',()=>{
 const examples=computeUseCases();
 assert.equal(examples.length,3);
 for(const example of examples){
  const live=calculate({...DEFAULTS,usedGrams:example.usedGrams,hours:example.hours,unitsPerPlate:example.unitsPerPlate});
  assert.equal(live.ok,true);
  assert.equal(example.result.costPerUnit,live.costPerUnit);
  assert.equal(example.result.expectedPlateCost,live.expectedPlateCost);
 }
 assert.deepEqual(CASE_INPUTS.map(x=>x.id),['small','standard','batch']);
});

test('failure allowance and 0 / 5 / 15 percent examples do not double count finishing',()=>{
 const zero=calculate({...DEFAULTS,usedGrams:100,hours:8,unitsPerPlate:1,failRate:0});
 const five=calculate({...DEFAULTS,usedGrams:100,hours:8,unitsPerPlate:1,failRate:.05});
 const fifteen=calculate({...DEFAULTS,usedGrams:100,hours:8,unitsPerPlate:1,failRate:.15});
 assert.ok(zero.ok&&five.ok&&fifteen.ok);
 assert.ok(Math.abs(zero.costPerUnit-6.4728)<1e-8);
 assert.ok(Math.abs(five.costPerUnit-6.787157894736842)<1e-8);
 assert.ok(Math.abs(fifteen.costPerUnit-7.526823529411764)<1e-8);
 assert.ok(zero.costPerUnit<five.costPerUnit&&five.costPerUnit<fifteen.costPerUnit);
 const html=costUseCasesHtml();
 assert.match(html,/\$7\.5268/);
 assert.match(html,/\$6\.7872/);
 assert.equal((html.match(/cost-guide-table-scroll/g)||[]).length,2);
 assert.match(html,/not measurements from real print orders/);
});
