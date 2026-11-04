import {priceKnownCost} from './seo-calculations.mjs';
const form=document.querySelector('[data-pricing-calculator]');
if(form){
 const results=document.getElementById('price-quote-results');
 const error=document.getElementById('price-quote-error');
 const csvButton=document.getElementById('quote-download-csv');
 const printButton=document.getElementById('quote-print');
 const quantityPanel=document.getElementById('quote-size-compare');
 const quantityRows=document.getElementById('quote-size-rows');
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
 const show=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
 let current=null;
 const update=()=>{
  const input=Object.fromEntries(new FormData(form).entries());
  const r=priceKnownCost(input);
  current=r.ok?{result:r,reference:String(input.projectReference||'').trim().slice(0,80)}:null;
  for(const button of [csvButton,printButton])if(button)button.disabled=!current;
  for(const field of form.querySelectorAll('input[name]')){
   const invalid=!r.ok && (Object.hasOwn(r.errors,field.name) ||
    (field.name==='feePercent' && r.errors.marginPercent?.startsWith('Fee percentage plus')));
   if(invalid){
    field.setAttribute('aria-invalid','true');
    field.setAttribute('aria-errormessage',error.id);
   }else{
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-errormessage');
   }
  }
  if(!r.ok){
   error.textContent=Object.values(r.errors)[0]||'Check the input values.';
   error.hidden=false;results.hidden=true;
   if(quantityPanel)quantityPanel.hidden=true;
   if(quantityRows)quantityRows.replaceChildren();
   return;
  }
  error.hidden=true;error.textContent='';results.hidden=false;
  if(quantityPanel)quantityPanel.hidden=false;
  if(quantityRows){
   const quantities=[1,5,10,25,r.inputs.quantity].filter((n,i,a)=>a.indexOf(n)===i);
   const comparisonRows=quantities.map(quantity=>{
    const quote=priceKnownCost({...input,quantity});
    const values=quote.ok?[String(quantity),money(quote.unitPrice),money(quote.orderGross),money(quote.netProfit),quote.actualMargin===null?'N/A':(quote.actualMargin*100).toFixed(2)+'%']:[String(quantity),'Outside supported range','—','—','—'];
    const row=document.createElement('tr');
    for(const [i,value] of values.entries()){
     const cell=document.createElement(i===0?'th':'td');
     if(i===0)cell.scope='row';
     cell.textContent=value;
     row.appendChild(cell);
    }
    if(quantity===r.inputs.quantity)row.classList.add('quote-current-size');
    return row;
   });
   quantityRows.replaceChildren(...comparisonRows);
  }
  show('price-quote-unit',money(r.unitPrice));
  show('price-quote-subtotal',money(r.itemSubtotal));
  show('price-quote-total',money(r.orderGross));
  show('price-quote-costs',money(r.totalExpenses));
  show('price-quote-fees',money(r.platformFees));
  show('price-quote-profit',money(r.netProfit));
  show('price-quote-margin',r.actualMargin===null?'Not applicable':(r.actualMargin*100).toFixed(2)+'%');
  show('quote-print-date',new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}));
  show('quote-print-reference',current.reference||'Not specified');
  show('quote-print-quantity',String(r.inputs.quantity));
  show('quote-print-unit',money(r.unitPrice));
  show('quote-print-subtotal',money(r.itemSubtotal));
  show('quote-print-shipping',money(r.inputs.shippingChargedPerOrder));
  show('quote-print-total',money(r.orderGross));
 };
 // The project reference is user-supplied: neutralize spreadsheet formula prefixes.
 const safeCsvCell=(value)=>{
  const text=String(value??'');
  const neutralized=/^[\s]*[=+\-@]/.test(text)?"'"+text:text;
  return '"'+neutralized.replaceAll('"','""')+'"';
 };
 const download=()=>{
  if(!current)return;
  const {result:r,reference}=current;
  const data=[
   ['Document','3D printing estimate — nonbinding'],['Prepared',new Date().toISOString().slice(0,10)],
   ['Project reference',reference],['Quantity',r.inputs.quantity],
   ['Unit cost',r.inputs.unitCost],['Price per item',r.unitPrice],
   ['Item subtotal',r.itemSubtotal],['Customer shipping charge',r.inputs.shippingChargedPerOrder],
   ['Checkout total',r.orderGross],['Production and order costs',r.totalExpenses],
   ['Payment fees',r.platformFees],['Estimated profit before income tax',r.netProfit],
   ['Achieved margin percent',r.actualMargin===null?'':(r.actualMargin*100).toFixed(2)],
   ['Currency','USD'],['Disclaimer','Not an invoice or a guaranteed print-service quotation. Taxes and unentered costs excluded.']
  ];
  const csv='\uFEFF'+data.map(row=>row.map(safeCsvCell).join(',')).join('\r\n')+'\r\n';
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='3d-print-estimate.csv';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 csvButton?.addEventListener('click',download);
 printButton?.addEventListener('click',()=>{if(current)window.print()});
 form.addEventListener('input',update);
 form.addEventListener('change',update);
 update();
}
