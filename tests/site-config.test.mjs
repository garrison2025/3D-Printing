import test from 'node:test';import assert from 'node:assert/strict';
import {resolveSiteConfig,CURRENT_PUBLIC_ORIGIN,OWNED_DOMAIN_ORIGIN,CONTACT_EMAIL} from '../src/lib/site-config.mjs';
test('local builds remain noindex',()=>assert.equal(resolveSiteConfig({}).live,false));
test('Cloudflare main defaults canonicals to purchased domain but stays noindex without release flag',()=>{const a=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main'});assert.equal(a.site,OWNED_DOMAIN_ORIGIN);assert.equal(a.live,false)});
test('stale Cloudflare pages.dev origin is normalized but never indexable even with flag',()=>{
 const a=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:CURRENT_PUBLIC_ORIGIN,ENABLE_INDEXING:'1'});
 assert.equal(a.site,OWNED_DOMAIN_ORIGIN);assert.equal(a.live,false);
});
test('custom domain without owner flag stays noindex',()=>assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:'https://example.org'}).live,false));
test('only the owned exact domain permits indexing with a deliberate flag',()=>{
 assert.equal(OWNED_DOMAIN_ORIGIN,'https://3dprintcostcalculator.org');
 assert.equal(CONTACT_EMAIL,'contact@3dprintcostcalculator.org');
 assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:OWNED_DOMAIN_ORIGIN,ENABLE_INDEXING:'1'}).live,true);
 for(const other of ['https://example.org','https://www.3dprintcostcalculator.org',CURRENT_PUBLIC_ORIGIN]){
   assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:other,ENABLE_INDEXING:'1'}).live,false,'non-canonical host must not be indexable: '+other);
 }
});
test('preview branch stays noindex',()=>assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'feature',SITE_URL:OWNED_DOMAIN_ORIGIN,ENABLE_INDEXING:'1'}).live,false));
test('Cloudflare preview branch still defaults to temporary alias',()=>{
 const x=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'feature'});assert.equal(x.site,CURRENT_PUBLIC_ORIGIN);assert.equal(x.live,false);
});
test('malformed URL fails',()=>assert.throws(()=>resolveSiteConfig({SITE_URL:'https://example.org/path'})));
