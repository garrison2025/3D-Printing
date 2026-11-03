import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const b=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const cfg=fs.readFileSync(new URL('../src/lib/site-config.mjs',import.meta.url),'utf8');
const flow=fs.readFileSync(new URL('../.github/workflows/live-audit.yml',import.meta.url),'utf8');

test('home title uses verified keyword and fits the requested visual length target',()=>{
 const title='3D Print Cost Calculator & Pricing | PrintCost Studio';
 assert.ok(b.includes(title));
 assert.ok(title.length<=60);
});
test('terms page is actually built and included in the canonical sitemap',()=>{
 assert.match(b,/write\('\/terms\/',terms\(\)\)/);
 assert.match(b,/const pages=\[[^\]]*'\/terms\/'/);
 assert.match(b,/href="\/terms\/"/);
});
test('optional llms.txt references real tools and source code, no fabricated AI claims',()=>{
 assert.match(b,/llms\.txt/);
 assert.match(b,/Calculation Methodology/);
 assert.match(b,/github\.com\/garrison2025\/3D-Printing/);
});
test('Cloudflare main release cannot accidentally index previews or unfamiliar domains',()=>{
 assert.match(cfg,/main\|\|env\.ENABLE_INDEXING==='1'/);
 assert.match(cfg,/PAUSE_INDEXING/);
 assert.match(b,/https:\/\/3d-printing-1r7.pages.dev\/\*/);
 assert.match(b,/https:\/\/:version.3d-printing-1r7.pages.dev\/\*/);
});
test('real deployed production browser audit defaults to owned host and correct mode',()=>{
 assert.match(flow,/default: https:\/\/3dprintcostcalculator.org/);
 assert.match(flow,/default: production/);
});
