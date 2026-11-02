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
test('mobile input focus removes floating summary obstruction',()=>{
 assert.match(app,/mobile-input-active/);
 assert.match(css,/\.mobile-input-active \.mobile-estimate\{position:relative/);
});
test('number transitions avoid synchronous forced layout',()=>{
 assert.doesNotMatch(app,/offsetWidth/);
 assert.match(app,/valueMotion\?\.cancel\(\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test('new style is included in normal and offline builds',()=>{
 assert.match(build,/assets\/finish\.css/);
 assert.match(build,/src\/assets\/finish\.css/);
 assert.match(offline,/dist\/assets\/finish\.css/);
});
