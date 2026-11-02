import test from 'node:test';import assert from 'node:assert/strict';
import {resolveSiteConfig,CURRENT_PUBLIC_ORIGIN} from '../src/lib/site-config.mjs';
test('local builds remain noindex',()=>assert.equal(resolveSiteConfig({}).live,false));
test('Cloudflare main stays noindex on pages.dev',()=>{const a=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main'});assert.equal(a.site,CURRENT_PUBLIC_ORIGIN);assert.equal(a.live,false)});
test('pages.dev stays noindex even with flag',()=>assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:CURRENT_PUBLIC_ORIGIN,ENABLE_INDEXING:'1'}).live,false));
test('custom domain without owner flag stays noindex',()=>assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:'https://example.org'}).live,false));
test('approved custom domain permits indexing',()=>assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:'https://example.org',ENABLE_INDEXING:'1'}).live,true));
test('preview branch stays noindex',()=>assert.equal(resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'feature',SITE_URL:'https://example.org',ENABLE_INDEXING:'1'}).live,false));
test('malformed URL fails',()=>assert.throws(()=>resolveSiteConfig({SITE_URL:'https://example.org/path'})));
