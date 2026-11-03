import test from 'node:test';
import assert from 'node:assert/strict';
import {ownerEmailVisible} from '../scripts/owner-email-visibility.mjs';
const owner='contact@3dprintcostcalculator.org';
function encodeCF(email,key=0x42){
 const raw=new TextEncoder().encode(email);
 return key.toString(16).padStart(2,'0')+[...raw].map(b=>(b^key).toString(16).padStart(2,'0')).join('');
}
test('plain published mailto is visible',()=>{
 assert.equal(ownerEmailVisible('<a href="mailto:'+owner+'">contact</a>',owner),true);
});
test('Cloudflare data-cfemail encoded public address is recognized',()=>{
 assert.equal(ownerEmailVisible('<span class="__cf_email__" data-cfemail="'+encodeCF(owner)+'">[email protected]</span>',owner),true);
});
test('Cloudflare email-protection link form is recognized',()=>{
 assert.equal(ownerEmailVisible('<a href="/cdn-cgi/l/email-protection#'+encodeCF(owner)+'">protected</a>',owner),true);
});
test('incorrect or malformed obfuscated emails do not pass',()=>{
 assert.equal(ownerEmailVisible('<span data-cfemail="'+encodeCF('other@example.org')+'"></span>',owner),false);
 assert.equal(ownerEmailVisible('<span data-cfemail="gg"></span>',owner),false);
 assert.equal(ownerEmailVisible('',owner),false);
});
