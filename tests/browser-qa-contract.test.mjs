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
test('desktop quick-start layout has three equal columns',()=>{
 const css=fs.readFileSync(new URL('../src/assets/finish.css',import.meta.url),'utf8');
 assert.match(css,/scenario-options \{/);
 assert.match(css,/grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
 assert.match(script,/desktop example scenarios are not on one row/);
});
