import test from 'node:test';import assert from 'node:assert/strict';
import {resolveSiteConfig,CURRENT_PUBLIC_ORIGIN,OWNED_DOMAIN_ORIGIN,CONTACT_EMAIL} from '../src/lib/site-config.mjs';
test('local builds remain noindex',()=>assert.equal(resolveSiteConfig({}).live,false));
test('Cloudflare main stays noindex on pages.dev',()=>{const a=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main'});assert.equal(a.site,CURRENT_PUBLIC_ORIGIN);assert.equal(a.live,false)});
test('pages.dev stays noindex even with flag',()=>assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:CURRENT_PUBLIC_ORIGIN,ENABLE_INDEXING:'1'}).live,false));
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
test('malformed URL fails',()=>assert.throws(()=>resolveSiteConfig({SITE_URL:'https://example.org/path'})));
