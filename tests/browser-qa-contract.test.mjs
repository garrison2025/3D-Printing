import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const script=fs.readFileSync(new URL('../scripts/browser-qa.mjs',import.meta.url),'utf8');
const workflow=fs.readFileSync(new URL('../.github/workflows/live-audit.yml',import.meta.url),'utf8');
test('deployed browser QA covers all critical calculations and download',()=>{
for(const item of ['#batch-quote-rows','secondUsedGrams','maintenancePerHour','export-batch-csv','/#pricing','reset-button','pageerror'])assert.ok(script.includes(item),item);
});
test('live browser QA follows HTTP deploy verification and uploads screenshots',()=>{
assert.ok(workflow.indexOf('node scripts/live-audit.mjs')<workflow.indexOf('node scripts/browser-qa.mjs'));
assert.match(workflow,/upload-artifact@v4/);
});