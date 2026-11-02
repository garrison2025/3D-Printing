import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const h=fs.readFileSync(new URL('../scripts/seo-pages.mjs',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/assets/seo-tools.css',import.meta.url),'utf8');
const script=fs.readFileSync(new URL('../src/assets/seo-tools.mjs',import.meta.url),'utf8');
test('standalone calculator form, fields and output have real CSS selectors',()=>{
 for(const name of ['seo-tool-form','seo-tool-fields','seo-tool-field','seo-tool-control','seo-tool-output','seo-explanation','seo-row']){
  assert.ok(h.includes('class="'+name)||script.includes("className='"+name)||h.includes(' '+name+'"'),name+' missing in markup');
  assert.ok(css.includes('.'+name),name+' missing in CSS');
 }
});
test('dual-material form and results use the same actual input names',()=>{
 for(const k of ['secondSpoolPrice','secondSpoolGrams','secondUsedGrams'])assert.ok(h.includes(k),k+' missing in form');
 assert.ok(script.includes('secondaryPerPlate'));
});
test('mobile forms do not preserve a desktop two-column field grid',()=>{
 assert.match(css,/@media\(max-width:560px\)/);
 assert.match(css,/grid-template-columns:minmax\(0,1fr\)/);
});
