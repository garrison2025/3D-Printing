/** Spanish calculator UI: shares the real priceKnownCost engine with the English quote page. */
import {priceKnownCost} from './seo-calculations.mjs';
const form=document.getElementById('es-quote-form');
if(form){
 const error=document.getElementById('es-quote-error');
 const output=Object.fromEntries([...document.querySelectorAll('[data-es-output]')].map(el=>[el.dataset.esOutput,el]));
 const locales={EUR:'es-ES',USD:'es-ES',MXN:'es-MX'};
 const calculateQuote=()=>{
  const data=new FormData(form),currency=String(data.get('currency')||'EUR');
  try{
   if(!Object.hasOwn(locales,currency))throw Error('Selecciona una moneda válida.');
   const input={};
   for(const key of ['unitCost','quantity','feePercent','marginPercent','feeFixed','packagingPerOrder','designPerOrder','shippingCostPerOrder','shippingChargedPerOrder']){
    const raw=data.get(key);
    if(typeof raw!=='string'||!raw.trim())throw Error('Completa todos los campos.');
    input[key]=Number(raw);
    if(!Number.isFinite(input[key])||input[key]<0)throw Error('Introduce números válidos, iguales o superiores a cero.');
   }
   const result=priceKnownCost(input);
   if(!result.ok)throw Error('Revisa las cantidades y los porcentajes. Las unidades deben ser enteras y la suma de comisión y margen debe quedar por debajo del 100 %.');
   const money=new Intl.NumberFormat(locales[currency],{style:'currency',currency,minimumFractionDigits:2,maximumFractionDigits:2});
   for(const key of ['unitPrice','orderGross','totalExpenses','platformFees','netProfit'])
    output[key].textContent=money.format(result[key]);
   output.actualMargin.textContent=result.actualMargin===null?'No aplicable':new Intl.NumberFormat('es-ES',{style:'percent',minimumFractionDigits:2,maximumFractionDigits:2}).format(result.actualMargin);
   error.hidden=true;error.textContent='';
  }catch(e){
   error.hidden=false;error.textContent=e.message;
   for(const el of Object.values(output))el.textContent='—';
  }
 };
 form.addEventListener('input',calculateQuote);
 form.addEventListener('change',calculateQuote);
 form.addEventListener('reset',()=>queueMicrotask(calculateQuote));
 calculateQuote();
}
