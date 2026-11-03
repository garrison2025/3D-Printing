import {DEFAULTS,calculate} from './calculations.mjs';
import {practicalUsdQuote} from './quote-precision.mjs';
const form=document.querySelector('#cost-form');
if(form){
 const $=(id)=>document.getElementById(id);
 const exampleScenarios={
  one:{...DEFAULTS},
  batch:{...DEFAULTS,usedGrams:180,hours:12,unitsPerPlate:4,unitsPerOrder:8,prepMinutes:12,finishPerUnit:0.35,packagingPerOrder:2,shippingCostPerOrder:6,shippingChargedPerOrder:6},
  seller:{...DEFAULTS,usedGrams:90,hours:6,unitsPerOrder:3,feeRate:0.11,margin:0.35,packagingPerOrder:1.5,shippingCostPerOrder:5,shippingChargedPerOrder:5}
 };
 const storageKey='printcost.studio.settings.v1';
 const rememberKey='printcost.studio.remember.v1';
 const rememberToggle=$('remember-inputs');
 let rememberInputs=true;
 try{rememberInputs=localStorage.getItem(rememberKey)!=='off';if(!rememberInputs)localStorage.removeItem(storageKey)}catch{}
 if(rememberToggle)rememberToggle.checked=rememberInputs;
 let mode='cost', lastValid=null, valueMotion=null;
 const modeBar=$('pricing');
 let modeIndicator=null,indicatorFrame=0;
 const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Measure selected-tab geometry only when mode or viewport changes, never on every keystroke.
 function updateModeIndicator(){
  if(!modeBar)return;
  const selected=modeBar.querySelector('.mode-button[aria-pressed="true"]');
  if(!selected)return;
  if(!modeIndicator){
   modeIndicator=document.createElement('span');
   modeIndicator.className='mode-indicator';
   modeIndicator.setAttribute('aria-hidden','true');
   modeBar.prepend(modeIndicator);
  }
  const parent=modeBar.getBoundingClientRect(),rect=selected.getBoundingClientRect();
  modeIndicator.style.width=rect.width+'px';
  modeIndicator.style.height=rect.height+'px';
  modeIndicator.style.transform='translate3d('+(rect.left-parent.left)+'px,'+(rect.top-parent.top)+'px,0)';
  modeBar.classList.add('has-indicator');
 }
 function scheduleModeIndicator(){
  if(!modeBar||!('requestAnimationFrame' in window))return;
  cancelAnimationFrame(indicatorFrame);
  indicatorFrame=requestAnimationFrame(updateModeIndicator);
 }
 window.addEventListener('resize',scheduleModeIndicator,{passive:true});

 const money=(n)=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n):'—';
 const pct=(n)=>Number.isFinite(n)?`${(n*100).toFixed(1)}%`:'—';
  const theoreticalMoney=(n)=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:4,maximumFractionDigits:4}).format(n):'—';
  const moneyPerGram=(n)=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:4,maximumFractionDigits:4}).format(n):'—';
 const allFields=[...form.querySelectorAll('input[name]')];
 const scenarioButtons=[...document.querySelectorAll('[data-scenario]')];
 let exampleSelection='';
 function scenarioSet(name){exampleSelection=name;scenarioButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scenario===name)));}

 const names=Object.keys(DEFAULTS);
 const stateFromInputs=()=>{
  const result={};
  for(const name of names){const el=form.elements.namedItem(name);const raw=el.value.trim();result[name]=raw!==''?Number(raw)*(el.dataset.percent==='true'?0.01:1):NaN;}
  return result;
 };
 const showValue=(id,v)=>{const el=$(id);if(el)el.textContent=v;};
 const setFieldErrors=(errors={})=>{
  for(const el of allFields){const name=el.name, err=errors[name]||'';el.setAttribute('aria-invalid',String(Boolean(err)));showValue('error-'+name,err);}
 };
 function saveInput(){
  if(!rememberInputs){showValue('saved-message','Saving off · this tab only');return}
  try{localStorage.setItem(storageKey,JSON.stringify(stateFromInputs()));showValue('saved-message','● Saved on this device')}
  catch{showValue('saved-message','Cannot save in this browser')}
 }
 function inputValuesSet(obj){for(const name of names){const el=form.elements.namedItem(name),v=obj?.[name];if(typeof v==='number' && Number.isFinite(v))el.value=String(el.dataset.percent==='true'?Number((v*100).toFixed(5)):v);}}
 function setMode(next){mode=next;document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));
  scheduleModeIndicator();
  render('mode');
 }
 function exportSummary(r){const actual=practicalUsdQuote(r);return [
  '3D Printing Cost & Pricing — Local Estimate',
  `Expected cost per successful item: ${money(r.costPerUnit)}`,
  `Actual checkout price per item: ${money(actual?.unitPrice)}`,
  `Full-precision mathematical unit price (reference): ${theoreticalMoney(r.recommendedPrice)}`,
  `Items per order: ${r.inputs.unitsPerOrder}`,
  `Actual checkout revenue: ${money(actual?.orderGross)}`,
  `Transaction fees on checkout: ${money(actual?.platformFees)}`,
  `Pre-tax profit on checkout: ${money(actual?.netProfit)}`,
  `Actual checkout margin: ${pct(actual?.actualMargin)}`,
  `Profit divided by production cost (profitOverProductionCost): ${pct(actual&&r.costPerUnit>0?actual.netProfit/r.inputs.unitsPerOrder/r.costPerUnit:null)}`,
  `Filament per gram: ${moneyPerGram(r.costPerGram)}`,
  'Assumptions: failed attempts consume a full plate; unentered overhead and taxes are excluded.'
 ].join('\n')}
 function renderPrint(r){const actual=practicalUsdQuote(r);if(!actual)return;
  const lines=[['Expected successful item cost',money(r.costPerUnit)],['Items per order',r.inputs.unitsPerOrder],['Actual checkout selling price',money(actual.unitPrice)],
    ['Customer-paid shipping',money(r.inputs.shippingChargedPerOrder)],['Actual checkout order gross',money(actual.orderGross)],
    ['Production and order expenses',money(r.orderExpenses)],['Fees on checkout revenue',money(actual.platformFees)],
    ['Estimated pre-income-tax profit',money(actual.netProfit)],['Actual checkout margin',pct(actual.actualMargin)],
    ['Full-precision theoretical unit price (reference)',theoreticalMoney(r.recommendedPrice)]];
  const tbl=$('print-table');tbl.replaceChildren();for(const [label,value] of lines){const row=document.createElement('tr');for(const s of [label,String(value)]){const td=document.createElement('td');td.textContent=s;row.append(td);}tbl.append(row);}
 }
 function quoteScenarios(inputs){
  const quantities=[...new Set([1,5,10,25,inputs.unitsPerOrder])].sort((x,y)=>x-y);
  return quantities.map(quantity=>({quantity,current:quantity===inputs.unitsPerOrder,
   estimate:calculate({...inputs,unitsPerOrder:quantity})}));
 }
 function renderBatch(inputs){
  const target=$('batch-quote-rows');if(!target)return;
  target.replaceChildren();
  for(const {quantity,current,estimate} of quoteScenarios(inputs)){
   if(!estimate.ok)continue;
   const tr=document.createElement('tr');if(current)tr.className='is-current';
   const actual=practicalUsdQuote(estimate);
    for(const text of [current?quantity+' (current)':String(quantity),money(actual?.unitPrice),money(actual?.orderGross),money(actual?.netProfit),pct(actual?.actualMargin)]){
    const td=document.createElement('td');td.textContent=text;tr.append(td);
   }
   target.append(tr);
  }
 }
 function render(reason='init'){const previousFocus=$('result-focus-value')?.textContent;const inputs=stateFromInputs(),r=calculate(inputs);
  if(!r.ok){showValue('cost-insight-text','Check your values to see which cost component is largest.');setFieldErrors(r.errors);if(Object.keys(r.errors).some(k=>['watts','energyRate','machineCost','lifeHours','prepMinutes','laborRate','failRate','finishPerUnit','maintenancePerHour'].includes(k)))$('advanced-details').open=true;if(Object.keys(r.errors).some(k=>['unitsPerOrder','feeRate','feeFixed','margin','packagingPerOrder','shippingCostPerOrder','shippingChargedPerOrder','designCostPerOrder'].includes(k)))$('pricing-details').open=true;const first=Object.values(r.errors)[0]||'Check invalid inputs.';showValue('result-alert',first);showValue('result-focus-value','—');showValue('quote-assumptions','—');showValue('cash-quote-note','Correct inputs to calculate a checkout price.');showValue('mobile-estimate-value','—');showValue('mobile-estimate-side-value','—');for(const id of ['metric-a','metric-b','order-gross','platform-fees','machine-hourly','achieved-margin','effective-markup'])showValue(id,'—');const comparison=$('batch-quote-rows');if(comparison)comparison.replaceChildren();$('copy-result').disabled=$('export-csv').disabled=$('print-quote').disabled=true;if($('download-current-xlsx'))$('download-current-xlsx').disabled=true;lastValid=null;return;}
  setFieldErrors({});showValue('result-alert','');
  const cashQuote=practicalUsdQuote(r);
  showValue('cash-quote-note',cashQuote?
    'Actual checkout price: '+money(cashQuote.unitPrice)+' per item. Margin at checkout: '+
    pct(cashQuote.actualMargin)+'. The mathematical quote is '+theoreticalMoney(r.recommendedPrice)+'; Excel workbook uses the same cent-safe checkout charge; the intermediate required gross remains full-precision.':
    'A safe whole-cent checkout quote is unavailable for this numeric range.');
  showValue('quote-assumptions',`${(inputs.margin*100).toFixed(1)}% target margin · ${(inputs.feeRate*100).toFixed(1)}% fees · ${money(inputs.feeFixed)} per order`);$('copy-result').disabled=$('export-csv').disabled=$('print-quote').disabled=!cashQuote;if($('download-current-xlsx'))$('download-current-xlsx').disabled=!cashQuote;lastValid=cashQuote?r:null;
  let focusLabel,focusVal,focusContext,aLabel,aVal,bLabel,bVal;
  if(mode==='cost') {focusLabel='EXPECTED COST PER ITEM';focusVal=money(r.costPerUnit);focusContext='Expected cost of one successful finished item';aLabel='Actual checkout price';aVal=money(cashQuote?.unitPrice);bLabel='Profit / item, before income tax*';bVal=money(cashQuote?.netProfit/r.inputs.unitsPerOrder);}
  else if(mode==='pricing'){focusLabel='ACTUAL CHECKOUT SELLING PRICE / ITEM';focusVal=money(cashQuote?.unitPrice);focusContext=`For ${r.inputs.unitsPerOrder} item(s) per order and ${pct(cashQuote?.actualMargin)} achieved margin`;aLabel='Unit production cost';aVal=money(r.costPerUnit);bLabel='Profit / order, before income tax*';bVal=money(cashQuote?.netProfit);}
  else {focusLabel='FILAMENT COST PER GRAM';focusVal=moneyPerGram(r.costPerGram);focusContext=`Based on ${money(r.inputs.spoolPrice)} per ${r.inputs.spoolGrams} g net spool`;aLabel='Material per print plate';aVal=money(r.materialPerPlate);bLabel='Full cost per item';bVal=money(r.costPerUnit);}
  for(const [id,text] of Object.entries({'mobile-estimate-label':focusLabel.replaceAll(' / ',' ').toLowerCase(),'mobile-estimate-value':focusVal,'mobile-estimate-side-label':aLabel,'mobile-estimate-side-value':aVal,'result-focus-label':focusLabel,'result-focus-value':focusVal,'result-focus-context':focusContext,'metric-a-label':aLabel,'metric-a':aVal,'metric-b-label':bLabel,'metric-b':bVal,'order-gross':money(cashQuote?.orderGross),'platform-fees':money(cashQuote?.platformFees),'machine-hourly':money(r.machineHourly),'achieved-margin':pct(cashQuote?.actualMargin),'effective-markup':pct(cashQuote&&r.costPerUnit>0?cashQuote.netProfit/r.inputs.unitsPerOrder/r.costPerUnit:null)}))showValue(id,text);
  const ul=$('breakdown'),bar=$('cost-bar'),spans=[...bar.children];
  const total=r.costBreakdown.reduce((n,item)=>n+item.value,0);
  const driver=r.costBreakdown.reduce((winner,item)=>item.value>winner.value?item:winner,r.costBreakdown[0]);
  // Reuse visual nodes: replacing the whole list on each keypress prevents smooth transitions.
  if(ul.children.length!==r.costBreakdown.length){
   ul.replaceChildren();
   for(const item of r.costBreakdown){
    const li=document.createElement('li'),name=document.createElement('span'),sw=document.createElement('i'),value=document.createElement('b');
    name.className='name';sw.className='swatch';name.append(sw,document.createTextNode(item.name));li.append(name,value);ul.append(li);
   }
  }
  r.costBreakdown.forEach((item,i)=>{
   const percent=total>0?100*item.value/total:0;
   spans[i].style.width=percent+'%';
   spans[i].classList.toggle('is-leading',item.name===driver.name&&item.value>0);
   const li=ul.children[i];
   li.classList.toggle('is-top-driver',item.name===driver.name&&item.value>0);
   li.querySelector('.name').lastChild.textContent=item.name;
   li.querySelector('.swatch').style.background=['#65b9ff','#7991ff','#70b59c','#9de1cd','#e5b679','#d0a4e5'][i];
   li.querySelector('b').textContent=money(item.value);
  });
  const driverHints={'Material':'filament grams and spool price','Electricity':'power draw and electricity rate','Machine wear':'printer lifetime and purchase price','Maintenance reserve':'maintenance reserve per machine hour','Preparation labor':'setup minutes and hourly rate','Finishing / per-item packing':'finishing and supplies per item'};
  showValue('cost-insight-text',`Top cost driver: ${driver.name} (${money(driver.value)} per item). Review ${driverHints[driver.name]}.`);
  renderPrint(r);
  renderBatch(inputs);
  const value=$('result-focus-value');
  if(reason!=='init' && previousFocus!==focusVal && !reducedMotion() && typeof value?.animate==='function'){
   valueMotion?.cancel();
   valueMotion=value.animate([{opacity:.68,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'ease-out'});
   if(reason==='mode'||reason==='scenario'){
    for(const id of ['result-focus-label','result-focus-context','metric-a','metric-b','mobile-estimate-value']){
     const el=$(id);
     if(el&&typeof el.animate==='function')el.animate([{opacity:.78,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:185,easing:'ease-out'});
    }
   }
  }
 }
 function announce(msg,tone='info'){const status=$('action-status');if(!status)return;status.textContent=msg;status.dataset.tone=tone;}
 form.addEventListener('input',(evt)=>{if(!evt.target.matches('input[name]'))return;scenarioSet('');render('input');saveInput();});
 rememberToggle?.addEventListener('change',()=>{
  rememberInputs=rememberToggle.checked;
  try{
   if(rememberInputs){localStorage.removeItem(rememberKey);saveInput();announce('Saving input values on this device is on.','success')}
   else{localStorage.setItem(rememberKey,'off');localStorage.removeItem(storageKey);showValue('saved-message','Saving off · this tab only');announce('Saved inputs cleared. Changes in this tab will not persist.','success')}
  }catch{showValue('saved-message','Browser storage unavailable');announce('Cannot change saving preference in this browser.','error')}
 });
 scenarioButtons.forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.scenario,values=exampleScenarios[key];if(!values)return;
  inputValuesSet(values);scenarioSet(key);render('scenario');saveInput();
  announce(`Loaded ${button.textContent.trim()} example. You can change any value.`,'success');
 }));
 form.addEventListener('submit',e=>e.preventDefault());
 form.addEventListener('focusin',event=>{
  if(event.target.matches('input[name]'))form.classList.add('mobile-input-active');
 });
 form.addEventListener('focusout',event=>{
  if(!event.target.matches('input[name]'))return;
  requestAnimationFrame(()=>{
   if(!form.contains(document.activeElement)||!document.activeElement.matches('input[name]'))
    form.classList.remove('mobile-input-active');
  });
 });
 $('edit-price-inputs')?.addEventListener('click',()=>{const details=$('pricing-details');details.open=true;setMode('pricing');const target=$('input-feeRate');target?.focus({preventScroll:false});announce('Pricing details expanded. Edit fees and margin below.');});
 document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
 $('reset-button').addEventListener('click',()=>{scenarioSet('');inputValuesSet(DEFAULTS);try{localStorage.removeItem(storageKey);}catch{}setMode('cost');announce('Reset to example values; saved data cleared.','success');showValue('saved-message',rememberInputs?'Example values restored':'Saving off · this tab only');});
 $('copy-result').addEventListener('click',async()=>{if(!lastValid)return;try{await navigator.clipboard.writeText(exportSummary(lastValid));announce('Summary copied.','success');}catch{
   const field=document.createElement('textarea');field.value=exportSummary(lastValid);field.style.position='fixed';field.style.left='-9999px';document.body.appendChild(field);field.select();try{const ok=document.execCommand('copy');announce(ok?'Summary copied.':'Copy unavailable—use Export CSV.',ok?'success':'error');}catch{announce('Copy unavailable—use Export CSV.','error')}field.remove();}
 });
 $('export-csv').addEventListener('click',()=>{if(!lastValid)return;const r=lastValid;const rows=[['Key','Value','Unit'],...Object.entries(r.inputs).map(([k,v])=>[k,v,'input']),['costPerUnit',r.costPerUnit,'USD/item'],['checkoutPricePerItem',practicalUsdQuote(r)?.unitPrice??'undefined','USD/item'],['checkoutOrderGross',practicalUsdQuote(r)?.orderGross??'undefined','USD/order'],['orderExpenses',r.orderExpenses,'USD/order'],['checkoutPlatformFees',practicalUsdQuote(r)?.platformFees??'undefined','USD/order'],['checkoutNetProfit',practicalUsdQuote(r)?.netProfit??'undefined','USD/order'],['checkoutMargin',practicalUsdQuote(r)?.actualMargin??'undefined','fraction'],['theoreticalUnitPrice',r.recommendedPrice,'USD/item'],['theoreticalOrderGross',r.orderGross,'USD/order'],['theoreticalNetProfit',r.netProfit,'USD/order'],['theoreticalMargin',r.actualMargin??'undefined','fraction'],['checkoutProfitOverProductionCost',r.costPerUnit>0?(practicalUsdQuote(r)?.netProfit/r.inputs.unitsPerOrder)/r.costPerUnit:'undefined','fraction'],['theoreticalProfitOverProductionCost',r.markupOnProductionCost??'undefined','fraction'],['minimumWholeCentPrice',practicalUsdQuote(r)?.unitPrice??'undefined','USD/item'],['marginAtWholeCentCharge',practicalUsdQuote(r)?.actualMargin??'undefined','fraction']];
   const csv=rows.map(cells=>cells.map(c=>'"'+String(c).replaceAll('"','""')+'"').join(',')).join('\r\n');const blob=new Blob(["\ufeff",csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='printcost-studio-estimate.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('CSV download started using current inputs.','success');
 });
 $('export-batch-csv')?.addEventListener('click',()=>{
  if(!lastValid)return;
  const rows=[['Quantity','Theoretical unit price USD','Theoretical order revenue USD','Order costs USD','Platform fees USD','Theoretical pre-tax profit USD','Model margin','Minimum checkout price USD','Margin at checkout price']];
  for(const {quantity,estimate} of quoteScenarios(lastValid.inputs)){
   const actual=practicalUsdQuote(estimate);
   if(estimate.ok&&actual)rows.push([quantity,estimate.recommendedPrice,estimate.orderGross,estimate.orderExpenses,estimate.platformFees,estimate.netProfit,estimate.actualMargin??'',actual.unitPrice,actual.actualMargin]);
  }
  const csv=rows.map(cells=>cells.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const blob=new Blob(["\ufeff",csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob),el=document.createElement('a');
  el.href=url;el.download='printcost-order-size-comparison.csv';
  document.body.appendChild(el);el.click();el.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  announce('Order-size CSV download started.','success');
 });
 $('download-current-xlsx')?.addEventListener('click',async()=>{
  if(!lastValid)return;
  const button=$('download-current-xlsx');button.disabled=true;
  try{
   const response=await fetch('/assets/3d-print-cost-calculator-template.xlsx');
   if(!response.ok)throw Error('Example workbook unavailable');
   const {personalizeWorkbook,workbookMime}=await import('./xlsx-personalize.mjs');
   const result=await personalizeWorkbook(await response.arrayBuffer(),lastValid.inputs,calculate);
   const blob=new Blob([result],{type:workbookMime});
   const url=URL.createObjectURL(blob),link=document.createElement('a');
   link.href=url;link.download='printcost-studio-current-estimate.xlsx';
   document.body.appendChild(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
   announce('Excel download started with your current inputs. Blue cells remain editable.','success');
  }catch(err){
   console.error('Excel export failed:',err);
   announce('Could not personalize Excel. Use the example template link below instead.','error');
  }finally{button.disabled=!lastValid}
 });
 $('print-quote').addEventListener('click',()=>{if(!lastValid)return;renderPrint(lastValid);window.print();announce('Print dialog opened. Choose “Save as PDF” in your browser if available.');});
 const filLink=$('filament-link');if(filLink)filLink.addEventListener('click',()=>setMode('filament'));
 // Hash anchors select an existing interaction mode, not a competing SEO route.
 function modeFromHash(){if(location.hash==='#pricing'||location.hash==='#batch-quote'){setMode('pricing');if(location.hash==='#batch-quote')$('batch-quote').open=true;}else if(location.hash==='#filament-mode')setMode('filament');}
 window.addEventListener('hashchange',modeFromHash);
 scheduleModeIndicator();
 if(rememberInputs){try{const stored=JSON.parse(localStorage.getItem(storageKey)||'null');if(stored && typeof stored==='object') inputValuesSet({...DEFAULTS,...stored})}catch{}}
 else showValue('saved-message','Saving off · this tab only');
 render();
 modeFromHash();
}

// Optional reveal effects below the tool; raw HTML stays visible without JavaScript.
if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 const sections=[...document.querySelectorAll('.info-card, .long-section')];
 if(sections.length){
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}},{threshold:0.08,rootMargin:'0px 0px 36px 0px'});
  sections.forEach(section=>observer.observe(section));
  window.addEventListener('pagehide',()=>{observer.disconnect();document.documentElement.classList.remove('motion-ready')},{once:true});
 }
}
