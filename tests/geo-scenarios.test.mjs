import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarioResults,scenarioEvidenceHtml} from '../scripts/geo-scenarios.mjs';
import {calculate,DEFAULTS} from '../src/lib/calculations.mjs';
test('first-party failure sensitivity matches exact production engine output',()=>{
 const r=scenarioResults();
 assert.deepEqual(r.failure.map(x=>x.rate),[0,.05,.2]);
 for(const v of r.failure){
  const d=calculate({...DEFAULTS,failRate:v.rate});
  assert.equal(d.ok,true);assert.equal(v.unitCost,d.costPerUnit);
  assert.ok(Math.abs(v.unitCost-d.attemptCost/(1-v.rate)-DEFAULTS.finishPerUnit)<1e-10);
 }
 assert.ok(r.failure[0].unitCost<r.failure[1].unitCost);
 assert.ok(r.failure[1].unitCost<r.failure[2].unitCost);
});
test('one fixed payment fee is charged once for ten-item order',()=>{
 const [one,ten]=scenarioResults().quantities;
 assert.equal(one.unitPrice,11.44);
 assert.equal(ten.unitPrice,11);
 assert.equal(ten.orderGross,110);
 assert.equal(one.netProfit.toFixed(2),'3.43');
 assert.equal(ten.netProfit.toFixed(2),'33.00');
});
test('duration effect and margin versus markup example are engine based',()=>{
 const r=scenarioResults();
 assert.ok(Math.abs(r.hours[0].costPerUnit-6.275157894736842)<1e-9);
 assert.ok(Math.abs(r.hours[1].costPerUnit-6.787157894736842)<1e-9);
 assert.equal(r.margin.unitPrice,14.29);
 assert.equal(r.markupPrice,13);
 assert.equal((r.markupMargin*100).toFixed(2),'23.08');
});
test('answer sources, cautions and anchored comparisons are rendered in HTML',()=>{
 const html=scenarioEvidenceHtml();
 for(const id of ['reproducible-scenarios','scenario-failure','scenario-order','scenario-hours','scenario-margin'])
  assert.ok(html.includes('id="'+id+'"'),id);
 for(const v of ['not measured market prices','not reliability benchmarks','not a measured printer profile','not independent endorsements']) assert.ok(html.includes(v),v);
 assert.ok(html.includes('github.com/garrison2025/3D-Printing'));
});
