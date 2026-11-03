import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveSiteConfig,CURRENT_PUBLIC_ORIGIN,OWNED_DOMAIN_ORIGIN,CONTACT_EMAIL} from '../src/lib/site-config.mjs';
const main=(opts={})=>({CF_PAGES:'1',CF_PAGES_BRANCH:'main',...opts});
test('local and unapproved builds are noindex',()=>{
 assert.equal(resolveSiteConfig({}).live,false);
 assert.equal(resolveSiteConfig({SITE_URL:CURRENT_PUBLIC_ORIGIN,ENABLE_INDEXING:'1'}).live,false);
});
test('Cloudflare main is indexable on approved owned canonical',()=>{
 const x=resolveSiteConfig(main());
 assert.equal(x.site,OWNED_DOMAIN_ORIGIN);
 assert.equal(x.live,true);
 assert.equal(CONTACT_EMAIL,'contact@3dprintcostcalculator.org');
});
test('old Pages-origin SITE_URL and old release flag cannot block owner-approved main',()=>{
 const x=resolveSiteConfig(main({SITE_URL:CURRENT_PUBLIC_ORIGIN,ENABLE_INDEXING:'0'}));
 assert.equal(x.site,OWNED_DOMAIN_ORIGIN);
 assert.equal(x.live,true);
});
test('other Cloudflare main hostnames cannot index',()=>{
 for(const SITE_URL of ['https://example.org','https://www.3dprintcostcalculator.org','https://else.pages.dev']){
  assert.equal(resolveSiteConfig(main({SITE_URL,ENABLE_INDEXING:'1'})).live,false,SITE_URL);
 }
});
test('preview branches remain noindex regardless of inherited indexing flags',()=>{
 for(const branch of ['feature','staging']){
  const x=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:branch,SITE_URL:OWNED_DOMAIN_ORIGIN,ENABLE_INDEXING:'1'});
  assert.equal(x.live,false);
 }
 const p=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'feature'});
 assert.equal(p.site,CURRENT_PUBLIC_ORIGIN);assert.equal(p.live,false);
});
test('emergency pause overrides production',()=>{
 const x=resolveSiteConfig(main({PAUSE_INDEXING:'1'}));
 assert.equal(x.site,OWNED_DOMAIN_ORIGIN);assert.equal(x.live,false);
});
test('local simulation can explicitly enable owned-origin production output',()=>{
 assert.equal(resolveSiteConfig({SITE_URL:OWNED_DOMAIN_ORIGIN,ENABLE_INDEXING:'1'}).live,true);
 assert.equal(resolveSiteConfig({SITE_URL:OWNED_DOMAIN_ORIGIN,ENABLE_INDEXING:'0'}).live,false);
});
test('malformed input fails',()=>assert.throws(()=>resolveSiteConfig({SITE_URL:'https://example.org/path'})));
