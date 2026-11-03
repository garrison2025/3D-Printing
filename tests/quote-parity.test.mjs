import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DEFAULTS,calculate} from '../src/lib/calculations.mjs';
import {filamentEstimate,hourlyEstimate} from '../src/lib/seo-calculations.mjs';
import {personalizeWorkbook} from '../src/assets/xlsx-personalize.mjs';
import {practicalUsdQuote} from '../src/lib/quote-precision.mjs';
const original=fs.readFileSync(new URL('../src/downloads/3d-print-cost-calculator-template.xlsx',import.meta.url));
function getXml(buffer,name){
 const b=Buffer.from(buffer);let p=0;
 while(p+30<=b.length&&b.readUInt32LE(p)===0x04034b50){
  const length=b.readUInt32LE(p+18),ns=b.readUInt16LE(p+26),ex=b.readUInt16LE(p+28);
  const member=b.subarray(p+30,p+30+ns).toString(),start=p+30+ns+ex;
  if(member===name)return b.subarray(start,start+length).toString();
  p=start+length;
 }
 throw Error('Missing ZIP part '+name);
}
function value(xml,ref){
 const match=xml.match(new RegExp('<x:c r="'+ref+'"[^>]*>[\\s\\S]*?<\\/x:c>'))?.[0];
 if(!match)throw Error('Missing cell '+ref);
 return Number(match.match(/<x:v>([^<]+)<\/x:v>/)?.[1]);
}
const near=(actual,expected,label)=>assert.ok(Math.abs(actual-expected)<1e-8*Math.max(1,Math.abs(expected)),label+': '+actual+' != '+expected);
const cases=[
 ['defaults',{}],
 ['95% failure',{failRate:.95,usedGrams:75,unitsPerPlate:4,unitsPerOrder:37}],
 ['very tight margin',{margin:.89,feeRate:.1,feeFixed:.04,unitsPerOrder:2}],
 ['shipping exceeds quote',{shippingChargedPerOrder:100,shippingCostPerOrder:2}],
 ['batch with packing',{unitsPerPlate:7,unitsPerOrder:103,packagingPerOrder:4,shippingCostPerOrder:12,shippingChargedPerOrder:11,margin:.22,feeRate:.13,failRate:.3}],
 ['all-zero cost',{spoolPrice:0,usedGrams:0,hours:0,machineCost:0,prepMinutes:0,finishPerUnit:0,feeRate:0,feeFixed:0,margin:0}]
];
for(const [name,patch] of cases)test(name+': reconcile website, Excel and independent tools',async()=>{
 const inputs={...DEFAULTS,...patch},r=calculate(inputs);
 assert.equal(r.ok,true,JSON.stringify(r.errors));
 const f=filamentEstimate({spoolPrice:inputs.spoolPrice,spoolGrams:inputs.spoolGrams,usedGrams:inputs.usedGrams,itemsPerPlate:inputs.unitsPerPlate});
 const hourly=hourlyEstimate({printerPrice:inputs.machineCost,lifeHours:inputs.lifeHours,watts:inputs.watts,electricityRate:inputs.energyRate});
 near(f.perPlate,r.materialPerPlate,'filament');near(hourly.total,r.machineHourly+r.electricityHourly,'hourly');
 const bytes=await personalizeWorkbook(original,inputs,calculate);
 const main=getXml(bytes,'xl/worksheets/sheet1.xml'),batch=getXml(bytes,'xl/worksheets/sheet2.xml');
 for(const [cell,n] of Object.entries({G13:r.costPerUnit,G15:r.requiredOrderGross,G16:r.recommendedPrice,G17:r.orderGross,G18:r.platformFees,G19:r.netProfit,G20:r.actualMargin??0}))
  near(value(main,cell),n,'main '+cell);
 for(const [i,quantity] of [1,5,10,25,inputs.unitsPerOrder].entries()){
  const v=calculate({...inputs,unitsPerOrder:quantity}),row=i+5;
  near(value(batch,'A'+row),quantity,'quantity');
  near(value(batch,'B'+row),v.recommendedPrice,'price');
  near(value(batch,'E'+row),v.netProfit,'profit');
 }
 const cash=practicalUsdQuote(r);
 assert.ok(cash,'Should represent cash quote');
 assert.ok(cash.unitPrice+1e-10>=r.recommendedPrice,'Cash price below theoretical');
 if(cash.orderGross>0)assert.ok(cash.actualMargin+1e-10>=inputs.margin,'Cash price below target margin');
});
test('default displayed $11.43 needs $11.44 to meet target on real charge',()=>{
 const r=calculate(DEFAULTS),cash=practicalUsdQuote(r);
 assert.equal(cash.unitPrice,11.44);
 assert.ok(cash.actualMargin>=DEFAULTS.margin);
 const charge=11.43,fees=charge*DEFAULTS.feeRate+DEFAULTS.feeFixed;
 assert.ok((charge-r.orderExpenses-fees)/charge<DEFAULTS.margin);
});
test('invalid model cannot produce cash quote',()=>assert.equal(practicalUsdQuote(calculate({...DEFAULTS,feeRate:.8,margin:.3})),null));
