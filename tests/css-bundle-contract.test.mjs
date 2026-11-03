import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const offline=fs.readFileSync(new URL('../scripts/offline-preview.mjs',import.meta.url),'utf8');
test('CSS preserves visual cascade order while shipping one browser stylesheet',()=>{
 assert.match(build,/cssFiles=/);
 for(const file of ['site.css','polish.css','refinement.css','finish.css','seo-tools.css','theme-industrial.css'])assert.ok(build.includes(file));
 assert.ok(build.includes('href="/assets/site-bundle.css"'));
 assert.ok(offline.includes('dist/assets/site-bundle.css'));
});
 
test('industrial teal A is the final and only additional build-time CSS layer',()=>{
 const mark=build.match(/const cssFiles=\[([^\]]+)\]/);
 assert.ok(mark,'CSS bundle configuration not found');
 assert.ok(mark[1].trim().endsWith('"theme-industrial.css"'),'theme must override old blue layers last');
 const theme=fs.readFileSync(new URL('../src/assets/theme-industrial.css',import.meta.url),'utf8');
 const app=fs.readFileSync(new URL('../src/assets/app.mjs',import.meta.url),'utf8');
 for(const token of ['--pc-paper:#F5F7F7','--pc-primary:#155E75','--pc-navy:#102D3D','--pc-teal:#0F766E',
  '--pc-chart-1','#DCE6E8','--pc-chart-6'])assert.ok(theme.includes(token),'missing token '+token);
 assert.match(app,/var\(--pc-chart-/);
 assert.match(build,/class="brand-accent"/);
 assert.match(build,/content="#F5F7F7"/);
 assert.ok(!theme.includes('@import'),'palette must not add network CSS');
});
