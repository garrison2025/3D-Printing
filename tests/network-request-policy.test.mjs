import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {classifyNetworkRequest} from '../scripts/network-request-policy.mjs';
const origin='https://3dprintcostcalculator.org';
test('first-party site assets and officially documented Cloudflare beacon are allowed',()=>{
 assert.equal(classifyNetworkRequest(origin+'/assets/app.mjs',origin),'first-party');
 assert.equal(classifyNetworkRequest('https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092',origin),'cloudflare-web-analytics');
});
test('unknown third-party analytics and deceptive or unrelated Cloudflare resources are rejected',()=>{
 for(const url of ['https://google-analytics.com/analytics.js','https://static.cloudflareinsights.com.evil.test/beacon.min.js','https://static.cloudflareinsights.com/unknown.js','https://static.cloudflareinsights.com/beacon.min.js?token=foo','https://bad.example/']){
  assert.equal(classifyNetworkRequest(url,origin),'unknown-external',url);
 }
});
test('privacy page discloses the real Cloudflare-injected resource rather than claiming no analytics',()=>{
 const src=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
 assert.match(src,/Cloudflare Web Analytics is currently enabled/);
 assert.match(src,/static\.cloudflareinsights\.com\/beacon\.min\.js/);
 assert.doesNotMatch(src,/This version has no analytics/);
});
