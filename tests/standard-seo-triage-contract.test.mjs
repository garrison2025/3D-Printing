import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const flow=fs.readFileSync(new URL('../.github/workflows/quality.yml',import.meta.url),'utf8');
const triage=fs.readFileSync(new URL('../scripts/seo-standard-triage.py',import.meta.url),'utf8');
test('independent standard audit does not hide future findings behind a permissive warning count',()=>{
 assert.match(flow,/python3 scripts\/seo-standard-triage\.py qa-seo\/standard-audit\.json dist/);
 assert.match(triage,/if unexpected:/);
 assert.match(triage,/raise SystemExit\(1\)/);
});
test('only known verified 404 and real local Excel resource are scanner exceptions',()=>{
 assert.match(triage,/CANONICAL_NONSELF/);
 assert.match(triage,/SITEMAP_PAGE_NOT_LISTED/);
 assert.match(triage,/EXPECTED_DOWNLOAD = "\/assets\/3d-print-cost-calculator-template\.xlsx"/);
 assert.match(triage,/\.is_file\(\)/);
});
