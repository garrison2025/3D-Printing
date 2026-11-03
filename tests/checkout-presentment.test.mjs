import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DEFAULTS,calculate} from '../src/lib/calculations.mjs';
import {practicalUsdQuote} from '../src/lib/quote-precision.mjs';
const code=fs.readFileSync(new URL('../src/assets/app.mjs',import.meta.url),'utf8');
test('whole-cent default charge meets target margin',()=>{const r=calculate(DEFAULTS),v=practicalUsdQuote(r);assert.equal(v.unitPrice,11.44);assert.ok(v.netProfit/v.orderGross>=DEFAULTS.margin);assert.notEqual(Number(r.recommendedPrice.toFixed(2)),v.unitPrice)});
test('checkout figures appear in UI, print and exports',()=>{for(const t of ['focusVal=money(cashQuote?.unitPrice)','money(actual.unitPrice)','money(actual.platformFees)','money(actual.netProfit)','checkoutPricePerItem','Actual checkout selling price','theoreticalMoney(r.recommendedPrice)'])assert.ok(code.includes(t),t)});
