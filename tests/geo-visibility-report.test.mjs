import test from 'node:test';
import assert from 'node:assert/strict';
import {visibilityReport} from '../scripts/geo-visibility-report.mjs';
test('untested rows never become fabricated zero-percent citation statistics',()=>{
 const r=visibilityReport('platform,query,status,observed_date,cited_url,evidence,notes\nChatGPT Search,"How much does one 3d print cost?",not_checked,,,,\n');
 assert.equal(r.counts['ChatGPT Search'].pending,1);
 assert.equal(r.counts['ChatGPT Search'].tested,0);
 assert.match(r.report,/Citation share is UNKNOWN/);
});
test('linked citations require source evidence, observed date and correct domain',()=>{
 const good=visibilityReport('platform,query,status,observed_date,cited_url,evidence,notes\nPerplexity,3d print calculator,cited,2026-11-03,https://3dprintcostcalculator.org/,local-screenshot.png,\n');
 assert.equal(good.counts.Perplexity.cited,1);
 assert.match(good.report,/100.0% \(1\/1\)/);
 const bad=visibilityReport('platform,query,status,observed_date,cited_url,evidence,notes\nChatGPT Search,3d print calculator,cited,2026-11-03,https://example.com/,screenshot.png,\n');
 assert.equal(bad.counts['ChatGPT Search'].cited,0);
 assert.equal(bad.invalid.length,1);
});
test('name-only brand mentions are never treated as linked citations',()=>{
 const x=visibilityReport('platform,query,status,observed_date,cited_url,evidence,notes\nClaude Search,pricing FDM prints,mentioned,2026-11-03,,local-evidence.png,\n');
 assert.equal(x.counts['Claude Search'].mentioned,1);
 assert.equal(x.counts['Claude Search'].cited,0);
});
