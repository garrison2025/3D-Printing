import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/assets/app.mjs',import.meta.url),'utf8');
const browser=fs.readFileSync(new URL('../scripts/webkit-acceptance.mjs',import.meta.url),'utf8');

test('mode tab highlight is placed immediately on selection and remeasured after paint',()=>{
 const start=source.indexOf('function setMode(next)');
 assert.ok(start>=0);
 const fn=source.slice(start,source.indexOf('function exportSummary',start));
 const pressed=fn.indexOf("setAttribute('aria-pressed'");
 const immediate=fn.indexOf('updateModeIndicator();');
 const scheduled=fn.indexOf('scheduleModeIndicator();');
 assert.ok(pressed>=0&&immediate>pressed&&scheduled>immediate);
});
test('Safari-like iPhone QA verifies selected-tab physical alignment and reduced motion',()=>{
 assert.match(browser,/Safari mode indicator misaligned/);
 assert.match(browser,/Math\.abs\(alignment\.diff\)<2/);
 assert.match(browser,/reducedMotion:'reduce'/);
});
