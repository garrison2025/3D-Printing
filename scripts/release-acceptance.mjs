import assert from 'node:assert/strict';
import fs from 'node:fs';
import {inflateRawSync} from 'node:zlib';
import {chromium} from 'playwright-core';
import {classifyNetworkRequest} from './network-request-policy.mjs';

const origin=new URL(process.argv[2]||'https://3d-printing-1r7.pages.dev').origin;
const mode=process.argv[3]||process.env.MODE||'staging';
const officialOrigin='https://3dprintcostcalculator.org';
if(!['staging','production'].includes(mode))throw Error('Expected staging or production audit mode');
if(!origin.startsWith('https:'))throw Error('Real deployed HTTPS target required');
if(mode==='production'&&new URL(origin).hostname.endsWith('.pages.dev'))throw Error('Production audit cannot target a temporary pages.dev URL');
// Preview pages carry an owned-domain canonical, but must remain noindex.
// A production audit requires the actual official domain and indexable content.
const canonicalOrigin=mode==='staging'&&new URL(origin).hostname.endsWith('.pages.dev')?officialOrigin:origin;
const robotsValue=mode==='staging'?'noindex,nofollow':'index,follow';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({acceptDownloads:true,viewport:{width:1280,height:900}});
const page=await context.newPage();page.setDefaultTimeout(12000);
const passed=[],failed=[],crashes=[],network=[];
page.on('pageerror',e=>crashes.push(e.message));
page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(origin))network.push(r.url())});
async function check(name,fn){try{await fn();passed.push(name);console.log('PASS acceptance — '+name)}catch(e){failed.push(name+': '+e.message);console.error('FAIL acceptance — '+name+': '+e.message)}}
async function visit(p='/'){const r=await page.goto(new URL(p,origin).href,{waitUntil:'domcontentloaded',timeout:30000});assert.equal(r.status(),200);await page.waitForTimeout(180)}
async function fresh(){await visit('/');await page.locator('#reset-button').click()}
async function fill(name,value){
 const q=page.locator('input[name="'+name+'"]');assert.equal(await q.count(),1,'field '+name);
 const closed=await q.evaluate(el=>{const d=el.closest('details');return d&&!d.open?d.id:null});
 if(closed)await page.locator('#'+closed+' > summary').click();
 await q.fill(String(value));
}
async function download(button){const wait=page.waitForEvent('download');await page.locator(button).click();const f=await wait;return {filename:f.suggestedFilename(),bytes:fs.readFileSync(await f.path())}}
function unzip(buffer){
 let i=0;const files=new Map();
 while(i+30<=buffer.length&&buffer.readUInt32LE(i)===0x04034b50){
  const method=buffer.readUInt16LE(i+8),size=buffer.readUInt32LE(i+18),nameLength=buffer.readUInt16LE(i+26),extraLength=buffer.readUInt16LE(i+28);
  const name=buffer.subarray(i+30,i+30+nameLength).toString('utf8'),start=i+30+nameLength+extraLength,bytes=buffer.subarray(start,start+size);
  files.set(name,(method===8?inflateRawSync(bytes):bytes).toString('utf8'));
  i=start+size;
 }return files;
}
function cell(xml,ref){
 const data=xml.match(new RegExp('<x:c r="'+ref+'"[^>]*>[\\s\\S]*?<\\/x:c>'))?.[0];
 assert.ok(data,'Workbook missing '+ref);return {cached:Number(data.match(/<x:v>([^<]+)<\/x:v>/)?.[1]),formula:data.match(/<x:f>([^<]+)<\/x:f>/)?.[1]||''};
}
const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);
function independent(x){
 const attempts=x.usedGrams*x.spoolPrice/x.spoolGrams+x.hours*x.watts/1000*x.energyRate+x.hours*x.machineCost/x.lifeHours+x.prepMinutes/60*x.laborRate+x.hours*x.maintenancePerHour;
 const item=attempts/(1-x.failRate)/x.unitsPerPlate+x.finishPerUnit;
 const orderExpenses=item*x.unitsPerOrder+x.packagingPerOrder+x.shippingCostPerOrder+x.designCostPerOrder;
 const grossRequired=(orderExpenses+x.feeFixed)/(1-x.feeRate-x.margin);
 let unit=Math.max(0,Math.ceil(((grossRequired-x.shippingChargedPerOrder)/x.unitsPerOrder)*100-1e-9))/100;
 if(unit*x.unitsPerOrder+x.shippingChargedPerOrder+1e-10<grossRequired)unit=Math.round(unit*100+1)/100;
 const gross=unit*x.unitsPerOrder+x.shippingChargedPerOrder;
 const fee=gross*x.feeRate+x.feeFixed;
 return {item,orderExpenses,unit,gross,fee,profit:gross-orderExpenses-fee};
}
await check('Live version, HTTPS, canonical and indexing mode remain consistent',async()=>{
 const r=await page.request.get(origin+'/build-manifest.json'),m=await r.json();
 assert.equal(r.status(),200);
 assert.equal(m.indexable,mode==='production','Manifest must match explicit release mode');
 assert.equal(m.kind,mode);
 assert.equal(m.canonicalOrigin,canonicalOrigin,'Canonical must be the owner domain even on Pages preview');
 await visit('/');
 assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),robotsValue);
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),canonicalOrigin+'/');
});
await check('Independent default cent-safe unit quote, CSV fee/profit and cost calculation',async()=>{
 await fresh();await page.locator('[data-mode="pricing"]').click();
 assert.equal((await page.locator('#result-focus-value').innerText()).trim(),'$11.44');
 const expected=independent({spoolPrice:25,spoolGrams:1000,usedGrams:100,hours:8,watts:120,energyRate:.18,machineCost:400,lifeHours:4000,prepMinutes:10,laborRate:15,maintenancePerHour:0,failRate:.05,unitsPerPlate:1,finishPerUnit:.5,unitsPerOrder:1,packagingPerOrder:0,shippingCostPerOrder:0,designCostPerOrder:0,shippingChargedPerOrder:0,feeFixed:.3,feeRate:.08,margin:.3});
 assert.equal(expected.unit,11.44);
 assert.equal((await page.locator('#order-gross').innerText()).trim(),money(expected.gross));
 const d=await download('#export-csv');assert.equal(d.filename,'printcost-studio-estimate.csv');
 const rows=d.bytes.toString('utf8').replace(/^\uFEFF/,'').split(/\r?\n/);
 const values=new Map(rows.slice(1).map(line=>{const m=line.match(/^"([^"]+)","([^"]*)","([^"]*)"$/);return m?[m[1],m[2]]:[null,null]}).filter(x=>x[0]));
 for(const [k,val] of [['costPerUnit',expected.item],['checkoutPricePerItem',expected.unit],['checkoutOrderGross',expected.gross],['checkoutPlatformFees',expected.fee],['checkoutNetProfit',expected.profit]]){
  assert.ok(Math.abs(Number(values.get(k))-val)<1e-8,k+' mismatch');
 }
 assert.ok(Math.abs(Number(values.get('checkoutMargin'))-expected.profit/expected.gross)<1e-8);
});
await check('Customized fees, shipping, maintenance, failure and design match independent model',async()=>{
 await fresh();const values={usedGrams:150,hours:7.5,unitsPerPlate:3,unitsPerOrder:5,maintenancePerHour:.22,designCostPerOrder:6.4,packagingPerOrder:1.8,shippingCostPerOrder:7,shippingChargedPerOrder:4.5,failRate:10,feeRate:10,margin:35};
 for(const [key,val] of Object.entries(values))await fill(key,val);
 await page.locator('[data-mode="pricing"]').click();
 const x=independent({spoolPrice:25,spoolGrams:1000,usedGrams:150,hours:7.5,watts:120,energyRate:.18,machineCost:400,lifeHours:4000,prepMinutes:10,laborRate:15,maintenancePerHour:.22,failRate:.1,unitsPerPlate:3,finishPerUnit:.5,unitsPerOrder:5,packagingPerOrder:1.8,shippingCostPerOrder:7,designCostPerOrder:6.4,shippingChargedPerOrder:4.5,feeFixed:.3,feeRate:.1,margin:.35});
 assert.equal((await page.locator('#result-focus-value').innerText()).trim(),money(x.unit));
 assert.equal((await page.locator('#order-gross').innerText()).trim(),money(x.gross));
 const d=await download('#download-current-xlsx');assert.equal(d.filename,'printcost-studio-current-estimate.xlsx');
 fs.mkdirSync('qa-fixtures',{recursive:true});fs.writeFileSync('qa-fixtures/edited-current-inputs.xlsx',d.bytes);
 assert.equal(d.bytes.subarray(0,2).toString(),'PK');
 const parts=unzip(d.bytes);assert.ok(parts.has('xl/workbook.xml'));
 const xml=parts.get('xl/worksheets/sheet1.xml');
 for(const [ref,value] of [['B8',150],['B9',7.5],['B10',3],['B22',5],['B26',.22],['B27',6.4],['G13',x.item],['G14',x.orderExpenses],['G16',x.unit],['G17',x.gross],['G18',x.fee],['G19',x.profit]]){
  assert.ok(Math.abs(cell(xml,ref).cached-value)<1e-7,ref+' cached amount differs');
 }
 assert.ok(cell(xml,'G16').formula.includes('ROUNDUP('),'Real Excel charge must round upwards');
 assert.ok(cell(xml,'G11').formula.includes('B26'),'Maintenance needs real recalculating formula');
 assert.ok(cell(xml,'G14').formula.includes('B27'),'Design overhead needs real recalculating formula');
 assert.match(parts.get('xl/workbook.xml'),/forceFullCalc="1"/);
});
await check('Print quote is real and matches customer checkout, including printable PDF',async()=>{
 await fresh();
 await page.evaluate(()=>{window.__printRequested=false;window.print=()=>{window.__printRequested=true}});
 await page.locator('#print-quote').click();
 assert.equal(await page.evaluate(()=>window.__printRequested),true);
 const text=await page.locator('#print-table').innerText();
 assert.match(text,/Actual checkout selling price\s*\$11\.44/);
 assert.match(text,/Actual checkout order gross\s*\$11\.44/);
 assert.match(text,/Fees on checkout revenue\s*\$1\.22/);
 assert.ok(!text.includes('$11.43\n'));
 await page.emulateMedia({media:'print'});
 const visibility=await page.evaluate(()=>({print:getComputedStyle(document.querySelector('#print-sheet')).display,form:getComputedStyle(document.querySelector('#cost-form')).display}));
 assert.notEqual(visibility.print,'none');assert.equal(visibility.form,'none');
 const pdf=await page.pdf({format:'A4',printBackground:true});assert.equal(pdf.subarray(0,4).toString(),'%PDF');assert.ok(pdf.length>4000);
 await page.emulateMedia({media:'screen'});
});
await check('Mixed models use one fixed transaction fee and export safe CSV',async()=>{
 await fresh();await page.locator('#mixed-quote > details > summary').click();
 const r=page.locator('#mixed-lines .mixed-line');
 for(const [i,name,unit,quantity] of [[0,'=2+2',5,2],[1,'Model B',12,1]]){
  const f=r.nth(i).locator('input');await f.nth(0).fill(name);await f.nth(1).fill(String(unit));await f.nth(2).fill(String(quantity));
 }
 const text=await page.locator('#mixed-results').innerText();
 // One order: (2*5+1*12+$0.30 fee) / (1-.08-.30) = $35.9677 -> $35.97.
 assert.match(text,/Combined successful-item cost:\s+\$22\.00/);
 assert.match(text,/Customer order total:\s+\$35\.97/);
 const d=await download('#mixed-export');assert.equal(d.filename,'printcost-mixed-order.csv');
 const content=d.bytes.toString('utf8');assert.ok(content.includes("'=2+2"),'CSV injection not escaped');
 assert.ok(content.includes('"Model B","1","12","12"'));
});
await check('Invalid margins, failure rate and count block downloads, reset recovers',async()=>{
 await fresh();await fill('margin',95);await fill('feeRate',10);
 assert.equal(await page.locator('#export-csv').isDisabled(),true);
 await fill('margin',30);await fill('feeRate',8);await fill('failRate',96);
 assert.equal(await page.locator('#download-current-xlsx').isDisabled(),true);
 await fill('failRate',5);await fill('unitsPerPlate',1.5);
 assert.equal(await page.locator('#print-quote').isDisabled(),true);
 await page.locator('#reset-button').click();
 assert.equal(await page.locator('#export-csv').isEnabled(),true);
 assert.equal(await page.locator('input[name="unitsPerPlate"]').inputValue(),'1');
});
await check('Saved settings persist locally and reset deletes them',async()=>{
 await fresh();await fill('usedGrams',191);
 await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'191');
 const key=await page.evaluate(()=>localStorage.getItem('printcost.studio.settings.v1'));
 assert.ok(key&&JSON.parse(key).usedGrams===191);
 await page.locator('#reset-button').click();await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'100');
 assert.equal(await page.evaluate(()=>localStorage.getItem('printcost.studio.settings.v1')),null);
});
await check('320/390/768/1024px layout has no horizontal overflow and accessible inputs',async()=>{
 for(const width of [320,390,768,1024]){
  await page.setViewportSize({width,height:844});await fresh();
  const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,form:document.querySelector('#cost-form').getBoundingClientRect().width,button:document.querySelector('#export-csv').getBoundingClientRect().height}));
  if(sizes.scroll>sizes.inner+2){
   const offenders=await page.evaluate(()=>[...document.querySelectorAll('*')].map(el=>({tag:el.tagName.toLowerCase(),id:el.id,cls:String(el.className).slice(0,90),right:Math.round(el.getBoundingClientRect().right),left:Math.round(el.getBoundingClientRect().left),w:Math.round(el.getBoundingClientRect().width)})).filter(x=>x.right>innerWidth+2&&x.w>0).slice(0,30));
   throw Error(width+'px overflow '+JSON.stringify(sizes)+' offenders '+JSON.stringify(offenders));
  }
  assert.ok(sizes.form>=width*(width>=931?.34:.65),width+'px squeezed form '+JSON.stringify(sizes));
  assert.ok(sizes.button>=40,width+'px too small button');
 }
});
await check('Spanish P2 pricing and two-scenario FDM cost comparison really calculate in the browser',async()=>{
 await visit('/es/calculadora-precios-impresion-3d/');
 assert.equal(await page.locator('html').getAttribute('lang'),'es');
 assert.equal(await page.locator('link[hreflang="en"]').getAttribute('href'),officialOrigin+'/3d-print-pricing-calculator/');
 await page.waitForFunction(()=>document.querySelector('[data-es-output="unitPrice"]')?.textContent?.includes('11,44'));
 await page.locator('#es-quantity').fill('10');
 await page.waitForFunction(()=>document.querySelector('[data-es-output="unitPrice"]')?.textContent?.includes('11,00'));
 await page.locator('#es-currency').selectOption('USD');
 await page.waitForFunction(()=>document.querySelector('[data-es-output="unitPrice"]')?.textContent?.includes('USD'));
 await page.locator('#es-marginPercent').fill('99');
 await page.waitForFunction(()=>document.getElementById('es-quote-error')?.hidden===false);
 await visit('/calculation-methodology/');
 await page.waitForFunction(()=>document.getElementById('comparison-cost-a')?.textContent?.includes('6.2752'));
 await page.waitForFunction(()=>document.getElementById('comparison-cost-b')?.textContent?.includes('6.7872'));
 await page.locator('#compare-B-Hours').fill('4');
 await page.waitForFunction(()=>document.getElementById('comparison-delta')?.textContent?.includes('0.00'));
});
await check('Published routes, download link, disclosed Cloudflare analytics and no unknown external requests',async()=>{
 await page.setViewportSize({width:1280,height:900});
 const routes=['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/','/calculation-methodology/','/3d-print-cost-calculator-excel/','/es/calculadora-precios-impresion-3d/','/about/','/privacy/','/terms/','/contact/'];
 for(const p of routes){
  await visit(p);
  assert.ok(await page.locator('h1').count()===1,p+' heading');
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),robotsValue,p+' index safety');
 }
 await visit('/3d-print-cost-calculator-excel/');
 assert.match(await page.locator('body').innerText(),/22 editable inputs/);
 const a=page.locator('a[href="/assets/3d-print-cost-calculator-template.xlsx"]');assert.equal(await a.count(),1);
 const template=await page.request.get(origin+'/assets/3d-print-cost-calculator-template.xlsx');
 assert.equal(template.status(),200);assert.equal((await template.body()).subarray(0,2).toString(),'PK');
 const unexpected=[...new Set(network.filter(url=>classifyNetworkRequest(url,origin)==='unknown-external'))];
 assert.deepEqual(unexpected,[],'Unexpected undisclosed remote requests');
 const known=network.filter(url=>classifyNetworkRequest(url,origin)==='cloudflare-web-analytics');
 if(known.length)console.log('NOTE — Cloudflare official Web Analytics beacon observed and disclosed in the privacy policy');
 assert.deepEqual(crashes,[],'Uncaught browser exception');
});
await context.close();await browser.close();
const summary='# Independent real-site acceptance: '+passed.length+'/'+(passed.length+failed.length)+' passed\n'+passed.map(x=>'PASS '+x).join('\n')+(failed.length?'\n'+failed.map(x=>'FAIL '+x).join('\n'):'');
console.log(summary);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary+'\n');
if(failed.length)process.exitCode=1;
