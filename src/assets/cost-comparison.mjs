import {comparePrintCosts} from './cost-comparison-engine.mjs';
const form=document.getElementById('cost-compare-form');
if(form){
 const results=Object.fromEntries([['a','comparison-cost-a'],['b','comparison-cost-b'],['delta','comparison-delta'],['percent','comparison-percent']].map(([k,id])=>[k,document.getElementById(id)]));
 const error=document.getElementById('comparison-error');
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:4}).format(n);
 const calc=()=>{
  try{
   const d=new FormData(form),read=side=>{
    const obj={};
    for(const [name,key] of [['UsedGrams','usedGrams'],['Hours','hours'],['FailurePercent','failRate'],['UnitsPerPlate','unitsPerPlate']]){
     const raw=d.get(side+name);
     if(typeof raw!=='string'||raw.trim()==='')throw Error('Fill in all values for both scenarios.');
     const value=Number(raw);
     if(!Number.isFinite(value))throw Error('Enter valid numeric values.');
     obj[key]=key==='failRate'?value/100:value;
    }
    return obj;
   };
   const out=comparePrintCosts(read('A'),read('B'));
   if(!out.ok)throw Error('Check nonnegative grams/hours, integer finished pieces (at least 1) and a whole-plate failure rate between 0% and 95%.');
   results.a.textContent=money(out.a.costPerUnit);
   results.b.textContent=money(out.b.costPerUnit);
   results.delta.textContent=(out.delta>0?'+':'')+money(out.delta);
   results.percent.textContent=out.percentage===null?'Not defined (A is zero)':(out.percentage>0?'+':'')+out.percentage.toFixed(2)+'%';
   error.hidden=true;error.textContent='';
  }catch(e){
   error.textContent=e.message;error.hidden=false;
   for(const el of Object.values(results))el.textContent='—';
  }
 };
 form.addEventListener('input',calc);
 form.addEventListener('change',calc);
 form.addEventListener('reset',()=>queueMicrotask(calc));
 calc();
}
