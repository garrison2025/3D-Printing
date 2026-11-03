import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const htmlSource=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');

test('seller guide quotes with the full precision FDM example and rounds fees/profit consistently',()=>{
 const material=100*(25/1000);
 const electricity=8*(120/1000)*0.18;
 const machine=8*(400/4000);
 const setup=10/60*15;
 const cost=(material+electricity+machine+setup)/0.95+0.5;
 assert.ok(Math.abs(cost-6.787157894736842)<1e-8);
 const price=Math.ceil((cost+0.3)/(1-0.08-0.30)*100)/100;
 assert.equal(price,11.44);
 const fees=price*0.08+0.30;
 const profit=price-cost-fees;
 assert.equal(fees.toFixed(2),'1.22');
 assert.equal(profit.toFixed(2),'3.44');
 assert.match(htmlSource,/<td>Estimated transaction fees<\/td><td>\$1\.22<\/td>/);
 assert.match(htmlSource,/<td>Estimated order profit, before income tax<\/td><td>\$3\.44<\/td>/);
 assert.match(htmlSource,/unrounded \$6\.7871579 production cost throughout/);
});
test('known-cost quote example retains its different 6.79-dollar starting input',()=>{
 const entered=6.79;
 const price=Math.ceil((entered+0.30)/(1-0.08-0.30)*100)/100;
 assert.equal(price,11.44);
 assert.equal((price-entered-(price*0.08+0.30)).toFixed(2),'3.43');
});
