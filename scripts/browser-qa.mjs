import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright-core';

const origin=new URL(process.argv[2]||'https://3d-printing-1r7.pages.dev').origin;
if(!origin.startsWith('https://')&&!/^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(origin))throw Error('HTTPS preview or loopback QA origin required');
fs.mkdirSync('qa-screenshots',{recursive:true});
const results=[],errors=[];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({acceptDownloads:true});
const page=await context.newPage();page.setDefaultTimeout(13000);
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().includes('/assets/')&&r.status()>=400)errors.push('Missing resource '+r.status()+' '+r.url());});
async function run(name,fn){try{await fn();results.push({name,ok:true});console.log('PASS '+name)}catch(e){results.push({name,ok:false,error:e.message});console.error('FAIL '+name+': '+e.message)}}
async function expectedRobots(){
 const manifest=await (await page.request.get(origin+'/build-manifest.json')).json();
 return manifest.indexable?'index,follow':'noindex,nofollow';
}
async function visit(route){await page.goto(new URL(route,origin).href,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(150)}
async function noOverflow(){const a=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth,form:document.querySelector('#cost-form')?.getBoundingClientRect().width}));const offenders=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2?[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+2&&r.width>0}).slice(0,8).map(el=>({tag:el.tagName,className:String(el.className).slice(0,80),right:Math.round(el.getBoundingClientRect().right)})):[]);assert.ok(a.scroll<=a.w+2,'horizontal overflow '+a.scroll+' > '+a.w+'; offenders='+JSON.stringify(offenders));if(a.form!=null)assert.ok(a.form>Math.min(280,a.w*.68),'form width '+a.form)}
async function shot(name){await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,left:0,behavior:'instant'})});await page.waitForTimeout(120);await page.screenshot({path:'qa-screenshots/'+name+'.png',fullPage:true,animations:'disabled'})}
try{
 for(const width of [360,390,768,1024,1440])await run('Homepage '+width+'px responsive',async()=>{
  await page.setViewportSize({width,height:width>=1000?900:844});await visit('/');await noOverflow();
  if(width>=1000){
   const top=await page.locator('[data-scenario]').evaluateAll(buttons=>buttons.map(el=>Math.round(el.getBoundingClientRect().top)));
   assert.ok(Math.max(...top)-Math.min(...top)<=4,'desktop example scenarios are not on one row: '+top.join(','));
  }
  await page.waitForFunction(()=>document.querySelector('#result-focus-value')?.textContent?.startsWith('$'));
  if(width===390||width===1440)await shot('home-'+width);
 });
 await page.setViewportSize({width:390,height:844});await visit('/');
 await run('Save-inputs preference disables persistence, clears saved inputs and restores opt-in',async()=>{
  await visit('/');await page.locator('#reset-button').click();
  const toggle=page.locator('#remember-inputs');assert.equal(await toggle.isChecked(),true);
  await page.locator('input[name="usedGrams"]').fill('188');
  assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('printcost.studio.settings.v1'))).usedGrams,188);
  await toggle.uncheck();
  assert.equal(await page.evaluate(()=>localStorage.getItem('printcost.studio.settings.v1')),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('printcost.studio.remember.v1')),'off');
  assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'188');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#remember-inputs').isChecked(),false);
  assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'100');
  await page.locator('input[name="usedGrams"]').fill('211');
  assert.equal(await page.evaluate(()=>localStorage.getItem('printcost.studio.settings.v1')),null);
  await page.locator('#remember-inputs').check();
  assert.equal(await page.evaluate(()=>localStorage.getItem('printcost.studio.remember.v1')),null);
  assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('printcost.studio.settings.v1'))).usedGrams,211);
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'211');
  await page.locator('#reset-button').click();
 });
 await run('Dedicated 3D print pricing tool calculates whole-cent customer quotes and rejects invalid margin',async()=>{
  await page.setViewportSize({width:1440,height:900});await visit('/3d-print-pricing-calculator/');
  assert.equal((await page.locator('#price-quote-unit').innerText()).trim(),'$11.44');
  assert.equal((await page.locator('#price-quote-total').innerText()).trim(),'$11.44');
  assert.equal((await page.locator('#price-quote-profit').innerText()).trim(),'$3.43');
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),await expectedRobots());
  const manifest=await (await page.request.get(origin+'/build-manifest.json')).json();
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),manifest.canonicalOrigin+'/3d-print-pricing-calculator/');
  const graph=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
  assert.ok(graph.some(x=>x['@type']==='WebApplication'&&x.url===manifest.canonicalOrigin+'/3d-print-pricing-calculator/'));
  await page.locator('[name="unitCost"]').fill('10');
  await page.locator('[name="quantity"]').fill('5');
  await page.waitForFunction(()=>document.querySelector('#price-quote-unit')?.textContent==='$16.23');
  assert.equal((await page.locator('#price-quote-total').innerText()).trim(),'$81.15');
  await page.locator('[name="feePercent"]').fill('80');
  await page.locator('[name="marginPercent"]').fill('30');
  assert.equal(await page.locator('#price-quote-results').isHidden(),true);
  assert.equal(await page.locator('#price-quote-error').isVisible(),true);
  await page.locator('[name="feePercent"]').fill('8');
  await page.waitForFunction(()=>!document.querySelector('#price-quote-results')?.hidden);
  await shot('pricing-quote-desktop-1440');
  await page.setViewportSize({width:390,height:844});await visit('/3d-print-pricing-calculator/');
  await noOverflow();await shot('pricing-quote-mobile-390');
 });
 await run('Industrial teal A: published social raster matches the new palette',async()=>{
  const response=await page.request.get(origin+'/og-card.png');
  assert.equal(response.status(),200);
  assert.equal(response.headers()['content-type']?.includes('image/png'),true);
  const data=await response.body();
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(data.readUInt32BE(16),1200);assert.equal(data.readUInt32BE(20),630);
 });
 await run('Industrial teal A: tokens, active tabs, price card, chart and buttons',async()=>{
  await page.setViewportSize({width:1440,height:900});await visit('/');
  const c=await page.evaluate(()=>{
   const style=el=>getComputedStyle(document.querySelector(el));
   const tokens=getComputedStyle(document.documentElement);
   const value=k=>tokens.getPropertyValue(k).trim().toUpperCase();
   return {
    primary:value('--pc-primary'),paper:value('--pc-paper'),
    body:style('body').backgroundImage,nav:style('.nav-cta').backgroundColor,
    text:style('.nav-cta').color,heading:style('.hero h1 span').backgroundImage,
    focus:style('.result-top').backgroundImage,primaryButton:style('.result-button.primary').backgroundColor,
    chart:[...document.querySelectorAll('#cost-bar span')].map(x=>getComputedStyle(x).backgroundColor),
    swatches:[...document.querySelectorAll('#breakdown .swatch')].map(x=>getComputedStyle(x).backgroundColor),
    theme:getComputedStyle(document.querySelector('.brand-accent')).color
   };
  });
  assert.equal(c.primary,'#155E75');assert.equal(c.paper,'#F5F7F7');
  assert.equal(c.nav,'rgb(21, 94, 117)');assert.equal(c.primaryButton,'rgb(21, 94, 117)');
  assert.equal(c.text,'rgb(255, 255, 255)');assert.equal(c.theme,'rgb(21, 94, 117)');
  assert.ok(c.heading.includes('rgb(21, 94, 117)'),'hero gradient is not teal '+c.heading);
  assert.ok(c.focus.includes('rgb(16, 45, 61)'),'quote header not slate-teal '+c.focus);
  assert.deepEqual(c.chart,[
    'rgb(21, 94, 117)','rgb(40, 126, 144)','rgb(15, 118, 110)',
    'rgb(101, 170, 154)','rgb(185, 134, 81)','rgb(135, 122, 164)'
  ]);
  assert.deepEqual(c.swatches,c.chart,'chart legend must use same six industrial palette tokens');
  const contrast=(a,b)=>{
   const rgb=s=>s.match(/\d+/g).slice(0,3).map(Number).map(x=>{
    const n=x/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;
   });
   const lum=s=>{const t=rgb(s);return .2126*t[0]+.7152*t[1]+.0722*t[2]};
   const [x,y]=[lum(a),lum(b)];return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
  };
  assert.ok(contrast(c.nav,c.text)>=7,'primary text contrast below AAA');
  await shot('industrial-teal-desktop-1440');
  await page.setViewportSize({width:390,height:844});await visit('/');await noOverflow();
  await shot('industrial-teal-mobile-390');
 });
 await run('Industrial teal A: focus, status and mobile segment colors remain consistent',async()=>{
  await visit('/');
  await page.locator('input[name="spoolPrice"]').click();
  await page.waitForTimeout(260); // Respect the existing native focus transition.
  const focusDetails=await page.locator('input[name="spoolPrice"]').evaluate(el=>({
   border:getComputedStyle(el).borderTopColor,active:document.activeElement===el,
   matches:el.matches('.workspace .field input:focus'),parent:el.parentElement?.parentElement?.className,
   input:el.outerHTML.slice(0,180),outline:getComputedStyle(el).outlineColor
  }));
  assert.equal(focusDetails.active,true,'focus not on spool input: '+JSON.stringify(focusDetails));
  assert.equal(focusDetails.border,'rgb(21, 94, 117)','focus border theme '+JSON.stringify(focusDetails));
  const m=await page.locator('#mobile-estimate').evaluate(el=>({
   background:getComputedStyle(el).backgroundImage,
   quote:getComputedStyle(el.querySelector('.mobile-estimate-value')).color
  }));
  assert.equal(m.quote,'rgb(21, 94, 117)');
  assert.ok(m.background.includes('rgb(230, 242, 242)'));
  await page.locator('[data-mode="pricing"]').click();
  await page.waitForTimeout(260);
  const selected=await page.locator('.mode-indicator').evaluate(el=>getComputedStyle(el).backgroundColor);
  assert.equal(selected,'rgb(21, 94, 117)');
  await visit('/');
 });
 await run('Industrial teal A: both SEO calculator tools and editorial pages use the palette',async()=>{
  for(const route of ['/filament-cost-calculator/','/3d-printing-cost-per-hour/']){
   await visit(route);
   const values=await page.evaluate(()=>({
    title:getComputedStyle(document.querySelector('.seo-tool-form>h2')).color,
    link:getComputedStyle(document.querySelector('.seo-breadcrumb a')).color,
    output:getComputedStyle(document.querySelector('.seo-tool-output')).backgroundImage,
    border:getComputedStyle(document.querySelector('.seo-tool-form')).borderTopColor
   }));
   assert.equal(values.title,'rgb(16, 45, 61)');
   assert.equal(values.link,'rgb(21, 94, 117)','SEO link theme '+route+' '+JSON.stringify(values));
   assert.equal(values.border,'rgb(220, 230, 232)');
   assert.ok(values.output.includes('rgb(233, 244, 244)'),'SEO tool output still old blue');
  }
  await visit('/how-to-price-3d-prints/');
  const breadcrumb=await page.locator('.breadcrumb-calculator').evaluate(el=>({
   color:getComputedStyle(el).color,markup:el.outerHTML,parent:el.parentElement?.outerHTML.slice(0,190)
  }));
  assert.equal(breadcrumb.color,'rgb(21, 94, 117)','editorial breadcrumb theme '+JSON.stringify(breadcrumb));
  assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'),'#F5F7F7');
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),await expectedRobots());
 });
 await run('V2.1 mode changes preserve manual advanced-setting accordion choices',async()=>{
  await visit('/');
  const advanced=page.locator('#advanced-details'),pricing=page.locator('#pricing-details');
  assert.equal(await advanced.getAttribute('open'),null);
  assert.equal(await pricing.getAttribute('open'),null);
  await page.locator('[data-mode="pricing"]').click();
  assert.equal(await pricing.getAttribute('open'),null,'mode selection unexpectedly expands pricing');
  await advanced.locator('summary').click();
  assert.notEqual(await advanced.getAttribute('open'),null);
  await page.locator('[data-mode="filament"]').click();
  assert.notEqual(await advanced.getAttribute('open'),null,'filament mode unexpectedly collapses manual advanced inputs');
  await page.locator('#edit-price-inputs').click();
  assert.notEqual(await pricing.getAttribute('open'),null,'explicit Edit fees must open pricing');
  await page.locator('[data-mode="cost"]').click();
  assert.notEqual(await pricing.getAttribute('open'),null,"returning to cost should preserve user-selected open sections");
  await visit('/');
 });
 await run('V2.1 mobile input focus retains stable sticky summary geometry and no click obstruction',async()=>{
  await page.setViewportSize({width:390,height:844});await visit('/');
  const first=await page.evaluate(()=>({
   height:document.querySelector('#cost-form').getBoundingClientRect().height,
   position:getComputedStyle(document.querySelector('#mobile-estimate')).position
  }));
  await page.locator('input[name="usedGrams"]').focus();
  const second=await page.evaluate(()=>({
   height:document.querySelector('#cost-form').getBoundingClientRect().height,
   position:getComputedStyle(document.querySelector('#mobile-estimate')).position,
   visibility:getComputedStyle(document.querySelector('#mobile-estimate')).visibility,
   pointer:getComputedStyle(document.querySelector('#mobile-estimate')).pointerEvents
  }));
  assert.equal(first.position,'sticky');assert.equal(second.position,'sticky');
  assert.equal(second.visibility,'hidden');assert.equal(second.pointer,'none');
  assert.ok(Math.abs(first.height-second.height)<2,'focus changed form height '+JSON.stringify({first,second}));
  await page.locator('input[name="spoolPrice"]').focus();
  await page.waitForTimeout(65);
  assert.equal(await page.locator('#cost-form').evaluate(el=>el.classList.contains('mobile-input-active')),true);
  await page.locator('[data-mode="cost"]').focus();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('#mobile-estimate')).visibility==='visible');
  await page.locator('#reset-button').click();
  assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'100');
 });
 await run('V2.1 reduced-motion prevents hover movement and smooth scrolling',async()=>{
  await visit('/');await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-scenario="batch"]').hover();
  const styles=await page.evaluate(()=>({
   hoverTransform:getComputedStyle(document.querySelector('[data-scenario="batch"]')).transform,
   hoverDuration:getComputedStyle(document.querySelector('[data-scenario="batch"]')).transitionDuration,
   scrolling:getComputedStyle(document.documentElement).scrollBehavior
  }));
  assert.equal(styles.hoverTransform,'none');
  assert.ok(styles.hoverDuration.split(',').every(x=>parseFloat(x)===0),'hover transition still animates');
  assert.equal(styles.scrolling,'auto');
  await page.emulateMedia({reducedMotion:'no-preference'});await visit('/');
 });
 await run('V2.1 action status gives success and error feedback without popups',async()=>{
  await visit('/');await page.locator('#reset-button').click();
  const dl=page.waitForEvent('download');
  await page.locator('#export-csv').click();await dl;
  assert.equal(await page.locator('#action-status').getAttribute('data-tone'),'success');
  assert.match(await page.locator('#action-status').innerText(),/CSV download started/);
  await page.route('**/assets/3d-print-cost-calculator-template.xlsx',route=>route.fulfill({
   status:200,contentType:'application/octet-stream',body:'not-a-workbook'
  }));
  await page.locator('#download-current-xlsx').click();
  await page.waitForFunction(()=>document.querySelector('#action-status')?.dataset.tone==='error');
  assert.match(await page.locator('#action-status').innerText(),/Could not personalize Excel/);
  await page.unroute('**/assets/3d-print-cost-calculator-template.xlsx');
  await page.locator('#reset-button').click();
  assert.equal(await page.locator('#action-status').getAttribute('data-tone'),'success');
  await visit('/');
 });
 await run('V2 mode slider aligns with the selected button on both mobile and desktop',async()=>{
  for(const width of [390,1280]){
   await page.setViewportSize({width,height:width>900?900:844});
   await visit('/');
   await page.locator('[data-mode="pricing"]').click();
   await page.waitForTimeout(275);
   const state=await page.evaluate(()=>{
    const bar=document.querySelector('.mode-bar'),i=bar?.querySelector('.mode-indicator'),tab=bar?.querySelector('[data-mode="pricing"]');
    if(!i||!tab)return {missing:true};
    const a=i.getBoundingClientRect(),b=tab.getBoundingClientRect();
    return {missing:false,left:Math.abs(a.left-b.left),width:Math.abs(a.width-b.width),pressed:tab.getAttribute('aria-pressed'),pointer:getComputedStyle(i).pointerEvents};
   });
   assert.equal(state.missing,false);
   assert.equal(state.pressed,'true');assert.equal(state.pointer,'none');
   assert.ok(state.left<2&&state.width<2,width+'px incorrect slider position '+JSON.stringify(state));
   if(width===1280)await shot('v2-desktop-pricing');
  }
  await page.setViewportSize({width:390,height:844});await visit('/');
 });
 await run('V2 quote and cost highlights remain numerically correct',async()=>{
  await page.locator('#reset-button').click();
  await page.locator('[data-mode="pricing"]').click();
  assert.equal((await page.locator('#result-focus-value').innerText()).trim(),'$11.44');
  await page.locator('input[name="usedGrams"]').fill('140');
  await page.waitForFunction(()=>document.querySelector('#result-focus-value')?.textContent!=='$11.44');
  assert.equal(await page.locator('#breakdown li').count(),6);
  assert.equal(await page.locator('#breakdown li.is-top-driver').count(),1);
 });
 await run('V2 reduced-motion disables decorative indicator and breakdown transitions',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-mode="filament"]').click();
  const styles=await page.evaluate(()=>({
   tab:getComputedStyle(document.querySelector('.mode-indicator')).transitionDuration,
   row:getComputedStyle(document.querySelector('#breakdown li')).transitionDuration
  }));
  assert.ok(styles.tab.split(',').every(v=>parseFloat(v)===0),'indicator still animates under reduced motion');
  assert.ok(styles.row.split(',').every(v=>parseFloat(v)===0),'cost row still animates under reduced motion');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('[data-mode="cost"]').click();
 });
 await run('V2 below-fold reveal animates only after scroll; readable before it starts',async()=>{
  await page.setViewportSize({width:390,height:844});await visit('/');
  const card=page.locator('.info-card').first();
  const first=await card.evaluate(el=>({display:getComputedStyle(el).display,opacity:getComputedStyle(el).opacity}));
  assert.notEqual(first.display,'none');
  assert.ok(Number(first.opacity)>.5,'SEO content hidden pending motion observer');
  await card.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('.info-card')?.classList.contains('in-view'));
  const animated=await card.evaluate(el=>getComputedStyle(el).animationName);
  assert.ok(animated.includes('pcs-v2-reveal'),'scroll did not activate subtle V2 entrance animation: '+animated);
  await page.screenshot({path:'qa-screenshots/v2-scroll-cards.png',fullPage:true,animations:'disabled'});
  await visit('/');
 });
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
 await run('Editable Excel workbook downloads as genuine XLSX',async()=>{
  const pending=page.waitForEvent('download');
  await page.locator('a.xlsx-download').click();
  const downloaded=await pending;
  assert.equal(downloaded.suggestedFilename(),'3d-print-cost-calculator-template.xlsx');
  const bin=fs.readFileSync(await downloaded.path());
  assert.equal(bin.subarray(0,4).toString('binary'),'PK\x03\x04');
  assert.ok(bin.length>5000,'Excel workbook unexpectedly small');
 });
 await run('Maintenance and design costs affect real checkout and personalized workbook',async()=>{
  await visit('/');
  const old=await page.locator('#order-gross').innerText();
  await page.locator('#advanced-details summary').click();
  await page.locator('input[name="maintenancePerHour"]').fill('0.25');
  await page.locator('#pricing-details summary').click();
  await page.locator('input[name="designCostPerOrder"]').fill('4');
  await page.waitForFunction(value=>document.querySelector('#order-gross')?.textContent!==value,old);
  const dl=page.waitForEvent('download');await page.locator('#download-current-xlsx').click();
  const data=fs.readFileSync(await (await dl).path()).toString('utf8');
  assert.match(data,/r="B26"[^>]*><x:v>0.25<\/x:v>/);
  assert.match(data,/r="B27"[^>]*><x:v>4<\/x:v>/);
 });
 await run('Different model types produce a separate cent-safe mixed order',async()=>{
  await visit('/');await page.locator('#mixed-quote>details>summary').click();
  const model=page.locator('#mixed-lines .mixed-line').first();
  await model.locator('input').nth(0).fill('Model A');
  await model.locator('input').nth(1).fill('5');
  await model.locator('input').nth(2).fill('2');
  const second=page.locator('#mixed-lines .mixed-line').nth(1);
  await second.locator('input').nth(0).fill('Model B');
  await second.locator('input').nth(1).fill('12');
  await second.locator('input').nth(2).fill('1');
  await page.waitForFunction(()=>document.querySelector('#mixed-results')?.textContent?.includes('Customer order total:'));
  const pending=page.waitForEvent('download');await page.locator('#mixed-export').click();
  const file=await pending;
  assert.equal(file.suggestedFilename(),'printcost-mixed-order.csv');
  const csv=fs.readFileSync(await file.path(),'utf8');assert.ok(csv.includes('Model A')&&csv.includes('Model B'));
 });
 await run('Invalid input prevents export',async()=>{await page.locator('input[name="usedGrams"]').fill('-1');await page.waitForFunction(()=>document.querySelector('#export-csv')?.disabled===true)});
 await run('Reset recovers defaults',async()=>{await page.locator('#reset-button').click();assert.equal(await page.locator('input[name="usedGrams"]').inputValue(),'100');assert.equal(await page.locator('#export-csv').isEnabled(),true)});
 await run('Pricing deep-link',async()=>{await visit('/#pricing');await page.waitForFunction(()=>document.querySelector('[data-mode="pricing"]')?.getAttribute('aria-pressed')==='true')});
 await run('Dual-filament calculator',async()=>{
  await visit('/filament-cost-calculator/');await noOverflow();
  await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('Combined material cost'));
  await page.locator('.seo-tool-advanced summary').first().click();await page.locator('input[name="secondUsedGrams"]').fill('25');
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

 await run('Pricing tool compares quantity, revenue and margin without fake discounts',async()=>{
  await page.setViewportSize({width:390,height:844});await visit('/3d-print-pricing-calculator/');
  assert.equal(await page.locator('#quote-size-rows tr').count(),4);
  await page.locator('[name="unitCost"]').fill('10');
  await page.locator('[name="quantity"]').fill('5');
  await page.waitForFunction(()=>document.querySelector('#price-quote-total')?.textContent==='$81.15');
  const current=page.locator('#quote-size-rows tr.quote-current-size');
  assert.match(await current.innerText(),/\$81\.15/);
  await page.locator('[name="quantity"]').fill('7');
  assert.equal(await page.locator('#quote-size-rows tr').count(),5);
  assert.match(await page.locator('#quote-size-rows tr.quote-current-size').innerText(),/7/);
  await noOverflow();
  await page.locator('[name="feePercent"]').fill('85');
  await page.locator('[name="marginPercent"]').fill('30');
  assert.equal(await page.locator('#quote-size-rows tr').count(),0,'Stale comparison must be removed for invalid inputs');
 });
 await run('Filament alternative spool is a substitution, not extra material',async()=>{
  await page.setViewportSize({width:390,height:844});await visit('/filament-cost-calculator/');
  await page.locator('#alternative-spool > summary').click();
  await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('Alternative spool price per gram'));
  assert.match(await page.locator('#seo-result').innerText(),/Alternative saves \$0\.60 per plate/);
  await page.locator('input[name="alternateSpoolGrams"]').fill('500');
  await page.waitForFunction(()=>document.querySelector('#seo-result')?.textContent?.includes('Alternative costs $1.30 more per plate'));
  await noOverflow();
  await page.locator('#alternative-spool > summary').click();
  assert.equal((await page.locator('#seo-result').innerText()).includes('Alternative cost comparison'),false);
 });
 await run('Cost guide has engine-computed failure sensitivity and no mobile overflow',async()=>{
  for(const width of [320,390,768]){
   await page.setViewportSize({width,height:844});await visit('/how-much-does-3d-printing-cost/');
   await noOverflow();
   const guide=await page.locator('#cost-by-example').innerText();
   assert.match(guide,/15%/);assert.match(guide,/\$7\.5268/);
   assert.equal(await page.locator('.cost-guide-table-scroll').count(),3);
  }
 });
 // Automated WCAG checks in CI Chrome; axe-core is never shipped to website visitors.
 await run('WCAG A/AA accessible markup check',async()=>{
  const violations=[];
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/','/calculation-methodology/','/3d-print-cost-calculator-excel/','/about/','/privacy/','/contact/']){
   await visit(route);
   await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
   const result=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
   for(const issue of result.violations){
    violations.push(route+' '+issue.id+' '+issue.impact+' '+issue.nodes.slice(0,35).map(n=>n.target.join(' ')+' ['+(n.failureSummary||'').replaceAll('\\n',' ').slice(0,90)+']').join(', '));
   }
  }
  if(violations.length)throw new Error(violations.join(' | '));
 });
 await run('Both pricing and cost guides offer a working editable spreadsheet',async()=>{
   for(const route of ['/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/']){
     await visit(route);
     const link=page.locator('a[href="/assets/3d-print-cost-calculator-template.xlsx"]');
     assert.equal(await link.count(),1,'Missing workbook link from '+route);
     const download=page.waitForEvent('download');
     await link.click();const file=await download;
     assert.equal(file.suggestedFilename(),'3d-print-cost-calculator-template.xlsx');
     const content=fs.readFileSync(await file.path());
     assert.equal(content.subarray(0,4).toString(),'PK\\x03\\x04'.replaceAll('\\x03','\x03').replaceAll('\\x04','\x04'));
     assert.ok(content.toString('utf8').includes('INVALID INPUTS - review blue cells'),'Downloaded workbook lacks validation');
   }
 });
 await run('Current-input Excel downloads real formulas with edited grams',async()=>{
  await visit('/');
  await page.locator('input[name="usedGrams"]').fill('145');
  const pending=page.waitForEvent('download');
  await page.locator('#download-current-xlsx').click();
  const file=await pending;
  assert.equal(file.suggestedFilename(),'printcost-studio-current-estimate.xlsx');
  const bytes=fs.readFileSync(await file.path()),content=bytes.toString('utf8');
  assert.equal(bytes.subarray(0,2).toString(),'PK');
  assert.match(content,/<x:c r="B8"[^>]*><x:v>145<\/x:v><\/x:c>/);
  assert.match(content,/<x:f>IF\(\$G\$26="VALID",IFERROR\(G11\/\(1-B17\),0\),""\)<\/x:f>/);
  assert.match(content,/r="G16"[^>]*><x:f>IF\(\$G\$26="VALID",ROUNDUP\(/);
  assert.match(content,/forceFullCalc="1"/);
 });
 await run('Quote rounding shows a cent-safe checkout amount',async()=>{
   await visit('/#pricing');
   await page.locator('#reset-button').click();
   await page.locator('[data-mode="pricing"]').click();
   assert.match(await page.locator('#cash-quote-note').innerText(),/\$11\.44/);
   assert.equal((await page.locator('#result-focus-value').innerText()).trim(),'$11.44');
   assert.equal((await page.locator('#order-gross').innerText()).trim(),'$11.44');
   await page.locator('input[name="usedGrams"]').fill('145');
   await page.waitForFunction(()=>document.querySelector('#cash-quote-note')?.textContent?.includes('checkout price'));
 });
 await run('No JavaScript crashes',async()=>assert.deepEqual(errors,[]));
}finally{await context.close();await browser.close()}
const passed=results.filter(x=>x.ok).length;
const report=['# Browser QA on deployed Cloudflare Pages','Checked '+origin,'Passed '+passed+'/'+results.length,...results.map(x=>(x.ok?'PASS':'FAIL')+' — '+x.name+(x.error?': '+x.error:''))].join('\n');
console.log(report);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report+'\n');
if(passed!==results.length)process.exitCode=1;
