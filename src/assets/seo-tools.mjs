import {filamentEstimate,hourlyEstimate} from './seo-calculations.mjs';
const form=document.querySelector('[data-seo-calculator]');
if(form){
 const result=document.getElementById('seo-result');
 const usd=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:4}).format(n);
 const update=()=>{
  try{
   const input=Object.fromEntries(new FormData(form).entries());
   if(Object.values(input).some(v=>String(v).trim()===''))throw new Error('Complete all inputs');
   const x=form.dataset.seoCalculator==='filament'?filamentEstimate(input):hourlyEstimate(input);
   const list=form.dataset.seoCalculator==='filament'?[
    ['Primary filament price per gram',usd(x.perGram)],...(x.hasSecond?[['Second filament price per gram',usd(x.secondaryPerGram)],['Second filament cost per plate',usd(x.secondaryPerPlate)]]:[]),['Combined material cost per plate',usd(x.perPlate)],['Material cost per finished part',usd(x.perItem)],['Primary spool remaining after plate',x.remainingGrams.toFixed(1)+' g'],['Whole plates possible from starting spool(s)',x.fullPlates===null?'Not applicable':String(x.fullPlates)]
   ]:[['Machine cost per hour',usd(x.machine)],['Electricity per hour',usd(x.electricity)],['Maintenance reserve per hour',usd(x.maintenance)],['Active labor per hour',usd(x.operator)],['Total operating cost per hour',usd(x.total)]];
   result.replaceChildren(...list.map(([label,value])=>{const el=document.createElement('div');el.className='seo-row';const l=document.createElement('span');l.textContent=label;const v=document.createElement('strong');v.textContent=value;el.append(l,v);return el}));result.removeAttribute('data-error');
  }catch(err){result.textContent=err.message;result.setAttribute('data-error','true')}
 };
 form.addEventListener('input',update);update();
}