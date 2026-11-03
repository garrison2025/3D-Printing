import assert from 'node:assert/strict';
import fs from 'node:fs';
import {webkit,devices} from 'playwright-core';
const origin=new URL(process.argv[2]||'https://3d-printing-1r7.pages.dev').origin;
const browser=await webkit.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13'],acceptDownloads:true});
const page=await context.newPage();page.setDefaultTimeout(15000);
const errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
async function check(name,task){
 try{await task();results.push({name,ok:true});console.log('PASS WebKit — '+name)}
 catch(e){results.push({name,ok:false,error:e.message});console.error('FAIL WebKit — '+name+': '+e.message)}
}
async function visit(route){
 const r=await page.goto(new URL(route,origin).href,{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(r.status(),200,route);await page.waitForTimeout(150);
}
async function noOverflow(){
 const sizes=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
 assert.ok(sizes.scroll<=sizes.inner+2,'iPhone WebKit overflow '+JSON.stringify(sizes));
}
await check('iPhone-sized WebKit homepage paints and defaults to real checkout',async()=>{
 await visit('/');await page.locator('#reset-button').click();
 await page.locator('[data-mode="pricing"]').click();
 await page.waitForFunction(()=>document.querySelector('#result-focus-value')?.textContent==='$11.44');
 await noOverflow();
 assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
});
await check('iPhone touch text input changes quote, then reset restores values',async()=>{
 await page.locator('input[name="usedGrams"]').fill('180');
 await page.waitForFunction(()=>document.querySelector('#result-focus-value')?.textContent!=='$11.44');
 await page.locator('#reset-button').click();
 assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'100');
});
await check('iPhone WebKit can turn local input saving off and on',async()=>{
 await visit('/');await page.locator('#reset-button').click();
 await page.locator('input[name="usedGrams"]').fill('189');
 await page.locator('#remember-inputs').uncheck();
 assert.equal(await page.evaluate(()=>localStorage.getItem('printcost.studio.settings.v1')),null);
 await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#remember-inputs').isChecked(),false);
 assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'100');
 await page.locator('#remember-inputs').check();
 await page.locator('#reset-button').click();
});
await check('iPhone WebKit batch CSV download is real and contains calculated amounts',async()=>{
 await page.locator('#batch-quote > summary').click();
 const pending=page.waitForEvent('download');
 await page.locator('#export-batch-csv').click();
 const file=await pending;assert.equal(file.suggestedFilename(),'printcost-order-size-comparison.csv');
 assert.match(fs.readFileSync(await file.path(),'utf8'),/Quantity/);
});
await check('iPhone WebKit Excel generated with currently edited input values',async()=>{
 await page.locator('input[name="usedGrams"]').fill('155');
 const pending=page.waitForEvent('download');
 await page.locator('#download-current-xlsx').click();
 const file=await pending;assert.equal(file.suggestedFilename(),'printcost-studio-current-estimate.xlsx');
 const data=fs.readFileSync(await file.path());assert.equal(data.subarray(0,2).toString(),'PK');
 assert.ok(data.toString('utf8').includes('<x:v>155</x:v>'));
});
await check('iPhone WebKit dual-filament and hourly tools actually recalculate',async()=>{
 await visit('/filament-cost-calculator/');
 await page.locator('.seo-tool-advanced > summary').click();
 await page.locator('input[name="secondUsedGrams"]').fill('25');
 await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('$3.125'));
 await noOverflow();
 await visit('/3d-printing-cost-per-hour/');
 await page.locator('input[name="maintenancePerHour"]').fill('2');
 await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('$2.1216'));
 await noOverflow();
});
await check('iPhone WebKit mixed model checkout retains real order totals',async()=>{
 await visit('/');await page.locator('#mixed-quote > details > summary').click();
 const rows=page.locator('#mixed-lines .mixed-line');
 for(const [i,cost,qty] of [[0,5,2],[1,12,1]]){
  const inputs=rows.nth(i).locator('input');
  await inputs.nth(0).fill('Part '+i);
  await inputs.nth(1).fill(String(cost));
  await inputs.nth(2).fill(String(qty));
 }
 await page.waitForFunction(()=>document.querySelector('#mixed-results')?.textContent?.includes('$35.97'));
});
await check('320px narrow Safari-like viewport does not scroll horizontally',async()=>{
 await page.setViewportSize({width:320,height:700});await visit('/');await noOverflow();
 await page.setViewportSize({width:390,height:844});await visit('/');await noOverflow();
});
await check('iPhone WebKit social image URL is accessible and metadata present',async()=>{
 await visit('/');
 const meta=await page.locator('meta[property="og:image"]').getAttribute('content');
 const card=await page.locator('meta[name="twitter:card"]').getAttribute('content');
 assert.equal(card,'summary_large_image');
 const response=await page.request.get(meta);assert.equal(response.status(),200);
 assert.ok((response.headers()['content-type']||'').includes('image/'));
 console.log('SHARE_IMAGE_EVIDENCE '+JSON.stringify({url:meta,contentType:response.headers()['content-type'],isRasterPng:meta.endsWith('.png')}));
});
fs.mkdirSync('qa-screenshots',{recursive:true});await page.screenshot({path:'qa-screenshots/iphone-webkit.png',fullPage:true});
assert.deepEqual(errors,[],'WebKit page JS errors');
await context.close();await browser.close();
console.log('# WebKit iPhone-size acceptance '+results.filter(x=>x.ok).length+'/'+results.length);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'WebKit iPhone-sized '+results.filter(x=>x.ok).length+'/'+results.length+'\n');
if(results.some(x=>!x.ok))process.exitCode=1;
