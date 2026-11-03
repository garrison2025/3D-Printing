import {priceKnownCost} from './seo-calculations.mjs';
const form=document.querySelector('[data-pricing-calculator]');
if(form){
 const results=document.getElementById('price-quote-results');
 const error=document.getElementById('price-quote-error');
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
 const show=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
 const update=()=>{
  const r=priceKnownCost(Object.fromEntries(new FormData(form).entries()));
  if(!r.ok){
   error.textContent=Object.values(r.errors)[0]||'Check the input values.';
   error.hidden=false;results.hidden=true;return;
  }
  error.hidden=true;error.textContent='';results.hidden=false;
  show('price-quote-unit',money(r.unitPrice));
  show('price-quote-subtotal',money(r.itemSubtotal));
  show('price-quote-total',money(r.orderGross));
  show('price-quote-costs',money(r.totalExpenses));
  show('price-quote-fees',money(r.platformFees));
  show('price-quote-profit',money(r.netProfit));
  show('price-quote-margin',r.actualMargin===null?'Not applicable':(r.actualMargin*100).toFixed(2)+'%');
 };
 form.addEventListener('input',update);update();
}
