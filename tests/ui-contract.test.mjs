import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../src/assets/app.mjs',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/assets/finish.css',import.meta.url),'utf8');
const offline=fs.readFileSync(new URL('../scripts/offline-preview.mjs',import.meta.url),'utf8');

test('result assumptions and working edit-fees action are wired',()=>{
 assert.match(build,/id="quote-assumptions"/);
 assert.match(build,/id="edit-price-inputs"/);
 assert.match(app,/showValue\('quote-assumptions'/);
 assert.match(app,/\$\('edit-price-inputs'\)\?\.addEventListener/);
});
test('mobile input focus avoids floating summary click obstruction',()=>{
 assert.match(app,/mobile-input-active/);
 assert.match(css,/\.workspace \.mobile-input-active \.mobile-estimate \{/);
 assert.match(css,/visibility: hidden/);
 assert.match(css,/pointer-events: none/);
});

test('mobile and tablet force a one-column calculator workspace',()=>{
 assert.match(css,/@media \(max-width: 930px\)/);
 assert.match(css,/\.workspace \.workspace-grid \{/);
 assert.match(css,/grid-template-columns: minmax\(0, 1fr\)/);
 assert.match(css,/\.workspace \.workspace-grid > \.form-panel/);
});

test('number transitions avoid synchronous forced layout',()=>{
 assert.doesNotMatch(app,/offsetWidth/);
 assert.match(app,/valueMotion\?\.cancel\(\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test('new style is included in normal and offline builds',()=>{
 assert.match(build,/assets\/site-bundle\.css/);
 assert.match(build,/src\/assets\/finish\.css/);
 assert.match(offline,/dist\/assets\/site-bundle\.css/);
});

test('selling-price mode has responsive batch quote rows and CSV export',()=>{
 assert.match(build,/id="batch-quote-rows"/);
 assert.match(build,/id="export-batch-csv"/);
 assert.match(build,/Packaging and shipping expenses remain/);
 assert.match(app,/quoteScenarios\(inputs\)/);
 assert.match(app,/unitsPerOrder:quantity/);
 assert.match(app,/renderBatch\(inputs\)/);
 assert.match(app,/printcost-order-size-comparison\.csv/);
});
test('profit over production cost is disclosed separately from revenue margin',()=>{
 assert.match(build,/id="effective-markup"/);
 assert.match(app,/markupOnProductionCost/);
 assert.match(app,/profitOverProductionCost/);
});

test('build includes every local JavaScript module and offline preview resolves quote code',()=>{
 assert.match(build,/src\/lib\/quote-precision\.mjs/);
 assert.match(offline,/dist\/assets\/quote-precision\.mjs/);
 assert.match(fs.readFileSync(new URL('../scripts/audit.mjs',import.meta.url),'utf8'),/resolves local JavaScript import/);
 assert.match(fs.readFileSync(new URL('../scripts/live-audit.mjs',import.meta.url),'utf8'),/\/assets\/quote-precision\.mjs/);
});

test('320px header does not demand three redundant navigation links',()=>{
 const css=fs.readFileSync(new URL('../src/assets/finish.css',import.meta.url),'utf8');
 assert.match(css,/@media \(max-width:350px\)/);
 assert.match(css,/\.site-header \.nav-links > a\[href="\/"\]\{display:none\}/);
});

test('privacy-saving toggle is live, clearable, documented and in first-paint HTML',()=>{
 assert.ok(build.includes('id="remember-inputs"'));
 assert.ok(build.includes('id="metric-b">$3.44'));
 assert.ok(build.includes('id="platform-fees">$1.22'));
 assert.ok(build.includes('printcost.studio.remember.v1'));
 assert.match(app,/rememberToggle\?\.addEventListener\('change'/);
 assert.match(app,/localStorage\.removeItem\(storageKey\)/);
 assert.match(app,/if\(rememberInputs\)\{try\{const stored=/);
 assert.match(css,/\.remember-control/);
});

test('V2 animations favor user feedback and preserve visible content at rest',()=>{
 assert.match(app,/scheduleModeIndicator\(\)/);
 assert.match(app,/valueMotion\?\.cancel\(\)/);
 assert.match(app,/r\.costBreakdown\.forEach/);
 assert.match(app,/is-top-driver/);
 assert.match(css,/\.mode-bar \.mode-indicator/);
 assert.match(css,/pcs-v2-open/);
 assert.match(css,/pcs-v2-reveal/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/animation:none!important/);
 assert.doesNotMatch(css,/\.motion-ready \.long-section\.in-view\{opacity:0/);
});
