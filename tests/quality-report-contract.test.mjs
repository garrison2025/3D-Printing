import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const flow=fs.readFileSync(new URL('../.github/workflows/live-audit.yml',import.meta.url),'utf8');
const qa=fs.readFileSync(new URL('../scripts/browser-qa.mjs',import.meta.url),'utf8');
const report=fs.readFileSync(new URL('../scripts/lighthouse-report.mjs',import.meta.url),'utf8');
test('real browser scans WCAG A and AA using axe-core',()=>{
 assert.match(qa,/axe\.run/);for(const x of ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'])assert.ok(qa.includes(x));
 assert.match(flow,/axe-core@4\.14\.0/);
});
test('Lighthouse measures mobile/desktop and avoids staging SEO score conflation',()=>{
 assert.match(flow,/home-mobile\.json/);assert.match(flow,/home-desktop\.json/);
 assert.match(flow,/lighthouse@13\.6\.0/);assert.match(report,/temporary preview has noindex/);
});

test('fixed unit symbols and batch hints have accessible contrast overrides',()=>{
 const css=fs.readFileSync(new URL('../src/assets/finish.css',import.meta.url),'utf8');
 assert.match(css,/\.field-control \.unit/);
 assert.match(css,/#batch-quote summary span \{color:#354b65!important\}/);
});
