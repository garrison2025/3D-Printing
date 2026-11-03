import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const audit=fs.readFileSync(new URL('../scripts/geo-readiness-audit.mjs',import.meta.url),'utf8');
const workflow=fs.readFileSync(new URL('../.github/workflows/quality.yml',import.meta.url),'utf8');
const doc=fs.readFileSync(new URL('../docs/GEO_AI_CRAWL_AND_VISIBILITY.md',import.meta.url),'utf8');
test('production GEO gate checks answer evidence and live-publisher structure rather than ranking guesses',()=>{
 for(const text of ['reproducible-scenarios','scenario-failure','scenario-order','scenario-hours','scenario-margin','publisher graph','src/lib/calculations.mjs','robots'])assert.ok(audit.includes(text),text);
 assert.match(workflow,/node scripts\/geo-readiness-audit\.mjs/);
 assert.match(audit,/not third-party AI citations/);
});
test('Cloudflare runbook distinguishes search, user agents and model training',()=>{
 for(const text of ['Search to Allow','Agent to Allow','Training is a separate','OAI-SearchBot','ChatGPT-User','GPTBot','Claude-SearchBot','AI Crawl Control'])assert.ok(doc.includes(text),text);
 assert.match(doc,/never user-agent strings alone/);
});
