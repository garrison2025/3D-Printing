import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveSiteConfig,CURRENT_PUBLIC_ORIGIN} from '../src/lib/site-config.mjs';

test('local builds remain noindex',()=>{
 const x=resolveSiteConfig({});
 assert.equal(x.site,'http://localhost:4173');assert.equal(x.live,false);
});
test('Cloudflare main falls back to stable published origin and is indexable',()=>{
 const x=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',CF_PAGES_URL:'https://randomhash.3d-printing-1r7.pages.dev'});
 assert.equal(x.site,CURRENT_PUBLIC_ORIGIN);assert.equal(x.live,true);
});
test('owner-supplied custom domain overrides stable Pages fallback',()=>{
 const x=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'main',SITE_URL:'https://example.org/'});
 assert.equal(x.site,'https://example.org');assert.equal(x.live,true);
});
test('Cloudflare preview branch is always noindex even with explicit production SITE_URL',()=>{
 const x=resolveSiteConfig({CF_PAGES:'1',CF_PAGES_BRANCH:'feature',SITE_URL:'https://example.org'});
 assert.equal(x.live,false);
});
test('malformed SITE_URL with path or hash is rejected',()=>{
 assert.throws(()=>resolveSiteConfig({SITE_URL:'https://example.com/extra'}));
 assert.throws(()=>resolveSiteConfig({SITE_URL:'https://example.com/#foo'}));
});
