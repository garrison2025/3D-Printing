import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright-core';

const origin=new URL(process.argv[2]||'https://3d-printing-1r7.pages.dev').origin;
if(!origin.startsWith('https://'))throw Error('HTTPS preview required');
fs.mkdirSync('qa-screenshots',{recursive:true});
const results=[],errors=[];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({acceptDownloads:true});
const page=await context.newPage();page.setDefaultTimeout(13000);
page.on('pageerror',e=>errors.push(e.message));
async function run(name,fn){try{await fn();results.push({name,ok:true});console.log('PASS '+name)}catch(e){results.push({name,ok:false,error:e.message});console.error('FAIL '+name+': '+e.message)}}
async function visit(route){await page.goto(new URL(route,origin).href,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(150)}
async function noOverflow(){const a=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth,form:document.querySelector('#cost-form')?.getBoundingClientRect().width}));assert.ok(a.scroll<=a.w+2,'horizontal overflow '+a.scroll+' > '+a.w);if(a.form!=null)assert.ok(a.form>Math.min(280,a.w*.68),'form width '+a.form)}
async function shot(name){await page.screenshot({path:'qa-screenshots/'+name+'.png',fullPage:true,animations:'disabled'})}
try{
 for(const width of [360,390,768,1024,1440])await run('Homepage '+width+'px responsive',async()=>{
  await page.setViewportSize({width,height:width>=1000?900:844});await visit('/');await noOverflow();
  await page.waitForFunction(()=>document.querySelector('#result-focus-value')?.textContent?.startsWith('$'));
  if(width===390||width===1440)await shot('home-'+width);
 });
 await page.setViewportSize({width:390,height:844});await visit('/');
 await run('Real-time calculation',async()=>{const before=await page.locator('#result-focus-value').innerText();await page.locator('input[name="usedGrams"]').fill('145');await page.waitForFunction(x=>document.querySelector('#result-focus-value')?.textContent!==x,before)});
 await run('Selling-price mode',async()=>{await page.locator('[data-mode="pricing"]').click();assert.equal(await page.locator('[data-mode="pricing"]').getAttribute('aria-pressed'),'true')});
 await run('Batch quote rows',async()=>{
  await page.locator('#batch-quote summary').click();
  const rows=await page.locator('#batch-quote-rows tr').allTextContents();
  assert.equal(rows.length,4);for(const qty of ['1','5','10','25'])assert.ok(rows.some(x=>x.trim().startsWith(qty)));
 });
 await run('Batch CSV downloads',async()=>{
  const pending=page.waitForEvent('download');await page.locator('#export-batch-csv').click();const d=await pending;
  assert.equal(d.suggestedFilename(),'printcost-order-size-comparison.csv');
  const csv=fs.readFileSync(await d.path(),'utf8');assert.ok(csv.includes('Quantity')&&csv.includes('25'));
 });
 await run('Invalid input prevents export',async()=>{await page.locator('input[name="usedGrams"]').fill('-1');await page.waitForFunction(()=>document.querySelector('#export-csv')?.disabled===true)});
 await run('Reset recovers defaults',async()=>{await page.locator('#reset-button').click();assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'100');assert.equal(await page.locator('#export-csv').isEnabled(),true)});
 await run('Pricing deep-link',async()=>{await visit('/#pricing');await page.waitForFunction(()=>document.querySelector('[data-mode="pricing"]')?.getAttribute('aria-pressed')==='true')});
 await run('Dual-filament calculator',async()=>{
  await visit('/filament-cost-calculator/');await noOverflow();
  await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('Combined material cost'));
  await page.locator('.seo-tool-advanced summary').click();await page.locator('input[name="secondUsedGrams"]').fill('25');
  await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('$3.125'));await shot('filament-390');
 });
 await run('Dual-filament validation',async()=>{await page.locator('input[name="secondSpoolGrams"]').fill('0');await page.waitForFunction(()=>document.querySelector('#seo-result')?.hasAttribute('data-error'))});
 await run('Hourly cost calculator',async()=>{
  await visit('/3d-printing-cost-per-hour/');await noOverflow();
  await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('$0.1216'));
  await page.locator('input[name="maintenancePerHour"]').fill('2');
  await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('$2.1216'));await shot('hourly-390');
 });
 await run('Desktop dedicated tools',async()=>{
  await page.setViewportSize({width:1440,height:900});
  for(const route of ['/filament-cost-calculator/','/3d-printing-cost-per-hour/']){await visit(route);await noOverflow()}
 });
 await run('No JavaScript crashes',async()=>assert.deepEqual(errors,[]));
}finally{await context.close();await browser.close()}
const passed=results.filter(x=>x.ok).length;
const report=['# Browser QA on deployed Cloudflare Pages','Checked '+origin,'Passed '+passed+'/'+results.length,...results.map(x=>(x.ok?'PASS':'FAIL')+' — '+x.name+(x.error?': '+x.error:''))].join('\n');
console.log(report);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report+'\n');
if(passed!==results.length)process.exitCode=1;
