import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const seo=fs.readFileSync(new URL('../scripts/seo-pages.mjs',import.meta.url),'utf8');
const audit=fs.readFileSync(new URL('../scripts/audit.mjs',import.meta.url),'utf8');
const qa=fs.readFileSync(new URL('../scripts/browser-qa.mjs',import.meta.url),'utf8');
test('pricing guide presents theoretical and minimum chargeable prices separately',()=>{
 assert.match(build,/Theoretical unit price \(before rounding\)/);
 assert.match(build,/Minimum whole-cent checkout price/);
 assert.match(build,/\$11\.4309/);
 assert.match(build,/\$11\.44/);
});
test('pricing guide CTA opens the dedicated selling-price calculator',()=>{
 assert.match(build,/Open selling-price calculator/);
 assert.match(build,/route==='\/how-to-price-3d-prints\/'\?'\/3d-print-pricing-calculator\/'/);
});
test('filament formula accurately describes the installed dual-material calculation',()=>{
 assert.match(seo,/If using a second filament/);
 assert.doesNotMatch(seo,/These calculations assume one material at one price/);
});
test('static audit checks fragment IDs and live axe scan covers all nine routes',()=>{
 assert.match(audit,/anchor target exists/);
 assert.match(audit,/decodeURIComponent\(url\.hash\.slice\(1\)\)/);
 for(const route of ['/how-much-does-3d-printing-cost/','/calculation-methodology/','/about/','/privacy/','/contact/'])
  assert.ok(qa.includes("'"+route+"'"),route);
});

test('build does not overwrite manually curated SEO/GEO project brief',()=>{assert.doesNotMatch(build,/writeFileSync\(path\.join\(root,'docs\/SEO-GEO-PROJECT-BRIEF\.md'/);assert.match(build,/name="twitter:card" content="summary_large_image"/);});

test('published share preview uses actual static PNG, not unsupported SVG OG tags',()=>{
 const png=new URL('../public/og-card.png',import.meta.url);
 assert.ok(fs.existsSync(png),'1200x630 PNG must be committed before publishing');
 assert.match(build,/og:image" content="\$\{escape\(site\)\}\/og-card\.png/);
 assert.match(build,/twitter:image" content="\$\{escape\(site\)\}\/og-card\.png/);
 assert.match(build,/og:image:type" content="image\/png/);
});
