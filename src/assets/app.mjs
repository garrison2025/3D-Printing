import {DEFAULTS,calculate} from './calculations.mjs';
const form=document.querySelector('#cost-form');
if(form){
 const $=(id)=>document.getElementById(id);
 const exampleScenarios={
  one:{...DEFAULTS},
  batch:{...DEFAULTS,usedGrams:180,hours:12,unitsPerPlate:4,unitsPerOrder:8,prepMinutes:12,finishPerUnit:0.35,packagingPerOrder:2,shippingCostPerOrder:6,shippingChargedPerOrder:6},
  seller:{...DEFAULTS,usedGrams:90,hours:6,unitsPerOrder:3,feeRate:0.11,margin:0.35,packagingPerOrder:1.5,shippingCostPerOrder:5,shippingChargedPerOrder:5}
 };
 const storageKey='printcost.studio.settings.v1';
 let mode='cost', lastValid=null, valueMotion=null;
 const money=(n)=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n):'—';
 const pct=(n)=>Number.isFinite(n)?`${(n*100).toFixed(1)}%`:'—';
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
 function saveInput(){try{localStorage.setItem(storageKey,JSON.stringify(stateFromInputs()));showValue('saved-message','● Saved on this device');}catch{showValue('saved-message','Cannot save in this browser');}}
 function inputValuesSet(obj){for(const name of names){const el=form.elements.namedItem(name),v=obj?.[name];if(typeof v==='number' && Number.isFinite(v))el.value=String(el.dataset.percent==='true'?Number((v*100).toFixed(5)):v);}}
 function setMode(next){mode=next;document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));
  if(mode==='pricing')$('pricing-details').open=true;
  if(mode==='filament')$('advanced-details').open=false;
  render();
 }
 function exportSummary(r){return [
  '3D Printing Cost & Pricing — Local Estimate',
  `Expected cost per successful item: ${money(r.costPerUnit)}`,
  `Recommended item price: ${money(r.recommendedPrice)}`,
  `Items per order: ${r.inputs.unitsPerOrder}`,
  `Expected total order revenue: ${money(r.orderGross)}`,
  `Included transaction fees: ${money(r.platformFees)}`,
  `Estimated order profit before income tax: ${money(r.netProfit)}`,
  `Margin on customer revenue: ${pct(r.actualMargin)}`,
  `Profit divided by item production cost: ${pct(r.markupOnProductionCost)}`,
  `Filament per gram: ${moneyPerGram(r.costPerGram)} (4-decimal unit price)`,
  'Assumption: failed print attempts consume an entire plate cost. Business overhead and taxes not automatically included.'
 ].join('\n')}
 function renderPrint(r){const lines=[['Expected successful item cost',money(r.costPerUnit)],['Items per order',r.inputs.unitsPerOrder],['Item selling price',money(r.recommendedPrice)],['Customer-paid shipping',money(r.inputs.shippingChargedPerOrder)],['Order gross revenue',money(r.orderGross)],['Production and order expenses',money(r.orderExpenses)],['Included fees',money(r.platformFees)],['Estimated pre-income-tax profit',money(r.netProfit)],['Margin after included expenses',pct(r.actualMargin)]];
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
   for(const text of [current?quantity+' (current)':String(quantity),money(estimate.recommendedPrice),money(estimate.orderGross),money(estimate.netProfit),pct(estimate.actualMargin)]){
    const td=document.createElement('td');td.textContent=text;tr.append(td);
   }
   target.append(tr);
  }
 }
 function render(){const inputs=stateFromInputs(),r=calculate(inputs);
  if(!r.ok){showValue('cost-insight-text','Check your values to see which cost component is largest.');setFieldErrors(r.errors);if(Object.keys(r.errors).some(k=>['watts','energyRate','machineCost','lifeHours','prepMinutes','laborRate','failRate','finishPerUnit'].includes(k)))$('advanced-details').open=true;if(Object.keys(r.errors).some(k=>['unitsPerOrder','feeRate','feeFixed','margin','packagingPerOrder','shippingCostPerOrder','shippingChargedPerOrder'].includes(k)))$('pricing-details').open=true;const first=Object.values(r.errors)[0]||'Check invalid inputs.';showValue('result-alert',first);showValue('result-focus-value','—');showValue('quote-assumptions','—');showValue('mobile-estimate-value','—');showValue('mobile-estimate-side-value','—');for(const id of ['metric-a','metric-b','order-gross','platform-fees','machine-hourly','achieved-margin','effective-markup'])showValue(id,'—');const comparison=$('batch-quote-rows');if(comparison)comparison.replaceChildren();$('copy-result').disabled=$('export-csv').disabled=$('print-quote').disabled=true;if($('download-current-xlsx'))$('download-current-xlsx').disabled=true;lastValid=null;return;}
  setFieldErrors({});showValue('result-alert','');showValue('quote-assumptions',`${(inputs.margin*100).toFixed(1)}% target margin · ${(inputs.feeRate*100).toFixed(1)}% fees · ${money(inputs.feeFixed)} per order`);$('copy-result').disabled=$('export-csv').disabled=$('print-quote').disabled=false;if($('download-current-xlsx'))$('download-current-xlsx').disabled=false;lastValid=r;
  let focusLabel,focusVal,focusContext,aLabel,aVal,bLabel,bVal;
  if(mode==='cost') {focusLabel='EXPECTED COST PER ITEM';focusVal=money(r.costPerUnit);focusContext='Expected cost of one successful finished item';aLabel='Suggested item price';aVal=money(r.recommendedPrice);bLabel='Profit / item, before income tax*';bVal=money(r.profitPerUnit);}
  else if(mode==='pricing'){focusLabel='RECOMMENDED SELLING PRICE / ITEM';focusVal=money(r.recommendedPrice);focusContext=`For ${r.inputs.unitsPerOrder} item(s) per order and ${pct(r.actualMargin)} target margin`;aLabel='Unit production cost';aVal=money(r.costPerUnit);bLabel='Profit / order, before income tax*';bVal=money(r.netProfit);}
  else {focusLabel='FILAMENT COST PER GRAM';focusVal=moneyPerGram(r.costPerGram);focusContext=`Based on ${money(r.inputs.spoolPrice)} per ${r.inputs.spoolGrams} g net spool`;aLabel='Material per print plate';aVal=money(r.materialPerPlate);bLabel='Full cost per item';bVal=money(r.costPerUnit);}
  for(const [id,text] of Object.entries({'mobile-estimate-label':focusLabel.replaceAll(' / ',' ').toLowerCase(),'mobile-estimate-value':focusVal,'mobile-estimate-side-label':aLabel,'mobile-estimate-side-value':aVal,'result-focus-label':focusLabel,'result-focus-value':focusVal,'result-focus-context':focusContext,'metric-a-label':aLabel,'metric-a':aVal,'metric-b-label':bLabel,'metric-b':bVal,'order-gross':money(r.orderGross),'platform-fees':money(r.platformFees),'machine-hourly':money(r.machineHourly),'achieved-margin':pct(r.actualMargin),'effective-markup':pct(r.markupOnProductionCost)}))showValue(id,text);
  const ul=$('breakdown');ul.replaceChildren();const bar=$('cost-bar');const spans=[...bar.children];
  const total=r.costBreakdown.reduce((n,item)=>n+item.value,0);
  r.costBreakdown.forEach((item,i)=>{spans[i].style.width=total>0?`${100*item.value/total}%`:'0%';const li=document.createElement('li');const name=document.createElement('span');name.className='name';const sw=document.createElement('i');sw.className='swatch';sw.style.background=['#65b9ff','#7991ff','#9de1cd','#e5b679','#d0a4e5'][i];name.append(sw,document.createTextNode(item.name));const value=document.createElement('b');value.textContent=money(item.value);li.append(name,value);ul.append(li);});
  const driver=r.costBreakdown.reduce((winner,item)=>item.value>winner.value?item:winner,r.costBreakdown[0]);
  const driverHints={'Material':'filament grams and spool price','Electricity':'power draw and electricity rate','Machine wear':'printer lifetime and machine cost','Preparation labor':'setup minutes and hourly rate','Finishing / per-item packing':'finishing and supplies per item'};
  showValue('cost-insight-text',`Top cost driver: ${driver.name} (${money(driver.value)} per item). Review ${driverHints[driver.name]}.`);
  renderPrint(r);
  renderBatch(inputs);
  const value=$('result-focus-value');
  if(value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && document.activeElement?.matches('input[name]') && typeof value.animate==='function'){
   valueMotion?.cancel();valueMotion=value.animate([{opacity:.67,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:190,easing:'ease-out'});
  }
 }
 function announce(msg){showValue('action-status',msg);}
 form.addEventListener('input',(evt)=>{if(!evt.target.matches('input'))return;scenarioSet('');render();saveInput();});
 scenarioButtons.forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.scenario,values=exampleScenarios[key];if(!values)return;
  inputValuesSet(values);scenarioSet(key);render();saveInput();
  announce(`Loaded ${button.textContent.trim()} example. You can change any value.`);
 }));
 form.addEventListener('submit',e=>e.preventDefault());
 form.addEventListener('focusin',event=>{if(event.target.matches('input[name]'))form.classList.add('mobile-input-active')});
 form.addEventListener('focusout',event=>{if(event.target.matches('input[name]'))form.classList.remove('mobile-input-active')});
 $('edit-price-inputs')?.addEventListener('click',()=>{const details=$('pricing-details');details.open=true;setMode('pricing');const target=$('input-feeRate');target?.focus({preventScroll:false});announce('Pricing details expanded. Edit fees and margin below.');});
 document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
 $('reset-button').addEventListener('click',()=>{scenarioSet('');inputValuesSet(DEFAULTS);try{localStorage.removeItem(storageKey);}catch{}setMode('cost');announce('Reset to example values; saved data cleared.');showValue('saved-message','Example values restored');});
 $('copy-result').addEventListener('click',async()=>{if(!lastValid)return;try{await navigator.clipboard.writeText(exportSummary(lastValid));announce('Summary copied.');}catch{
   const field=document.createElement('textarea');field.value=exportSummary(lastValid);field.style.position='fixed';field.style.left='-9999px';document.body.appendChild(field);field.select();try{const ok=document.execCommand('copy');announce(ok?'Summary copied.':'Copy unavailable—use Export CSV.');}catch{announce('Copy unavailable—use Export CSV.')}field.remove();}
 });
 $('export-csv').addEventListener('click',()=>{if(!lastValid)return;const r=lastValid;const rows=[['Key','Value','Unit'],...Object.entries(r.inputs).map(([k,v])=>[k,v,'input']),['costPerUnit',r.costPerUnit,'USD/item'],['recommendedPrice',r.recommendedPrice,'USD/item'],['orderGross',r.orderGross,'USD/order'],['orderExpenses',r.orderExpenses,'USD/order'],['platformFees',r.platformFees,'USD/order'],['netProfit',r.netProfit,'USD/order'],['actualMargin',r.actualMargin??'undefined','fraction'],['profitOverProductionCost',r.markupOnProductionCost??'undefined','fraction']];
   const csv=rows.map(cells=>cells.map(c=>'"'+String(c).replaceAll('"','""')+'"').join(',')).join('\r\n');const blob=new Blob(["\ufeff",csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='printcost-studio-estimate.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('CSV exported using current input values.');
 });
 $('export-batch-csv')?.addEventListener('click',()=>{
  if(!lastValid)return;
  const rows=[['Quantity','Unit price USD','Order revenue USD','Order costs USD','Platform fees USD','Pre-tax profit USD','Achieved margin']];
  for(const {quantity,estimate} of quoteScenarios(lastValid.inputs)){
   if(estimate.ok)rows.push([quantity,estimate.recommendedPrice,estimate.orderGross,estimate.orderExpenses,estimate.platformFees,estimate.netProfit,estimate.actualMargin??'']);
  }
  const csv=rows.map(cells=>cells.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const blob=new Blob(["\ufeff",csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob),el=document.createElement('a');
  el.href=url;el.download='printcost-order-size-comparison.csv';
  document.body.appendChild(el);el.click();el.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  announce('Order size comparison exported as CSV.');
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
   announce('Excel workbook saved with your current inputs. Blue cells can be edited.');
  }catch(err){
   console.error('Excel export failed:',err);
   announce('Could not personalize Excel. Use the example template link below instead.');
  }finally{button.disabled=!lastValid}
 });
 $('print-quote').addEventListener('click',()=>{if(!lastValid)return;renderPrint(lastValid);window.print();announce('Opened your browser print dialog. Choose “Save as PDF” if available.');});
 const filLink=$('filament-link');if(filLink)filLink.addEventListener('click',()=>setMode('filament'));
 // Hash anchors select an existing interaction mode, not a competing SEO route.
 function modeFromHash(){if(location.hash==='#pricing'||location.hash==='#batch-quote'){setMode('pricing');if(location.hash==='#batch-quote')$('batch-quote').open=true;}else if(location.hash==='#filament-mode')setMode('filament');}
 window.addEventListener('hashchange',modeFromHash);
 try{const stored=JSON.parse(localStorage.getItem(storageKey)||'null');if(stored && typeof stored==='object') inputValuesSet({...DEFAULTS,...stored});}catch{}
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