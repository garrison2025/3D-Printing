import test from 'node:test';
import assert from 'node:assert/strict';
import {assessPreviewRoute} from '../scripts/seo-preview-policy.mjs';
const preview='https://3d-printing-1r7.pages.dev',official='https://3dprintcostcalculator.org';
const html=path=>'<link rel="canonical" href="'+official+path+'">';

test('preview route can stay live only when it is nonindexable and has correct canonical',()=>{
 const t=assessPreviewRoute({status:200,xrobots:'noindex, nofollow',text:html('/')},preview,official,'/');
 assert.equal(t.ok,true);
 assert.equal(assessPreviewRoute({status:200,xrobots:'',text:html('/')},preview,official,'/').ok,false);
 assert.equal(assessPreviewRoute({status:200,xrobots:'noindex',text:html('/wrong/')},preview,official,'/').ok,false);
});
test('permanent preview 301 or 308 is valid only when it keeps the entire route',()=>{
 for(const status of [301,308])
  assert.equal(assessPreviewRoute({status,location:official+'/filament-cost-calculator/'},preview,official,'/filament-cost-calculator/').ok,true);
 assert.equal(assessPreviewRoute({status:301,location:official+'/'},preview,official,'/filament-cost-calculator/').ok,false);
 assert.equal(assessPreviewRoute({status:302,location:official+'/filament-cost-calculator/'},preview,official,'/filament-cost-calculator/').ok,false);
});
test('offsite redirects and missing Location do not pass preview safety gate',()=>{
 assert.equal(assessPreviewRoute({status:301,location:'https://example.org/'},preview,official,'/').ok,false);
 assert.equal(assessPreviewRoute({status:301},preview,official,'/').ok,false);
});
