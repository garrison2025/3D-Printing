import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const workflow=fs.readFileSync(new URL('../.github/workflows/quality.yml',import.meta.url),'utf8');

test('quality pipeline independently audits generated production HTML with pinned public standard',()=>{
 assert.match(workflow,/repository: chenmu2024\/Website-Starter-Standard/);
 assert.match(workflow,/ref: e633805e57e18d4a11cc65966739de886f5a2b87/);
 assert.match(workflow,/python3 _site-standard\/tools\/seo_audit\.py --site-dir dist --base-url https:\/\/3dprintcostcalculator\.org/);
 assert.match(workflow,/--fail-on error/);
 assert.match(workflow,/printcost-standard-seo-audit/);
});
test('the independent standard runs after the owner-domain production output simulation',()=>{
 const production=workflow.indexOf('Custom-domain publication simulation (not deployed)');
 const independent=workflow.indexOf('Independent static SEO audit under Website Starter Standard');
 assert.ok(production>=0&&independent>production);
 assert.match(workflow,/SITE_URL=https:\/\/3dprintcostcalculator\.org ENABLE_INDEXING=1 npm run build/);
});
