import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const script=fs.readFileSync(new URL('../scripts/seo-live-audit.mjs',import.meta.url),'utf8');
test('production SEO check covers all eleven actual published routes and indexability',()=>{
 const routes=script.match(/const ROUTES=\[([\s\S]*?)\];/)?.[1]||'';
 assert.equal((routes.match(/'\/[^']*'/g)||[]).length,11);
 for(const route of ['/','/3d-print-pricing-calculator/','/filament-cost-calculator/','/how-much-does-3d-printing-cost/'])
  assert.ok(routes.includes("'"+route+"'"),route);
 for(const term of ['indexable','noindex','<loc>','canonical','WebPage','X-Robots-Tag'])assert.ok(script.includes(term)||script.toLowerCase().includes(term.toLowerCase()),term);
 assert.match(script,/process\.argv\.includes\('--strict'\)/);
});
test('the production SEO inspection is read-only and uses no paid service',()=>{
 assert.match(script,/Promise\.all\(requests\.map\(get\)\)/);
 assert.doesNotMatch(script,/\b(?:POST|PUT|PATCH|DELETE)\b/);
});
