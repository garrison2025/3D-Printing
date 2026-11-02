import test from 'node:test';
import assert from 'node:assert/strict';
import {ANSWERS, answerPanel, methodologyPage} from '../scripts/geo-content.mjs';

const routes=['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/'];
test('five real search-intent pages have self-contained readable answers',()=>{
 assert.equal(Object.keys(ANSWERS).length,5);
 for(const route of routes){const a=ANSWERS[route];assert.ok(a.question.length>20);assert.ok(a.answer.length>130);assert.ok(a.detail.length>90);assert.match(answerPanel(route),/href="\/calculation-methodology\/"/);}
});
test('methodology gives reproducible, bounded examples and traceable code',()=>{
 const html=methodologyPage();
 for(const term of ['5.9728','6.7871579','11.4308998','0.1216','full-plate','margin','successful-item cost','src/lib/calculations.mjs','src/lib/seo-calculations.mjs']) assert.ok(html.toLowerCase().includes(term.toLowerCase()),term);
 assert.ok(!/not independently checked|industry average price/i.test(html));
});
test('no special machine-only payload or fabricated SEO proof',()=>{
 const html=methodologyPage();
 assert.ok(!html.includes('llms.txt'));
 assert.ok(!html.includes('guaranteed rankings'));
 assert.ok(!html.includes('user reviews'));
});
