import {DEFAULTS,calculate,calculateMixedOrder} from './calculations.mjs';
const host=document.getElementById('mixed-quote'),form=document.getElementById('cost-form');
if(host&&form){
 const lines=document.getElementById('mixed-lines'),output=document.getElementById('mixed-results');
 const add=document.getElementById('mixed-add'),useCurrent=document.getElementById('mixed-use-current');
 const exportButton=document.getElementById('mixed-export'),copyButton=document.getElementById('mixed-copy');
 const usd=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n):'—';
 let last=null,count=0;
 const input=(label,type,value,step='any')=>{
  const wrapper=document.createElement('label');
  wrapper.textContent=label;
  const field=document.createElement('input');
  field.type=type;field.value=value;field.setAttribute('aria-label',label);field.step=step;
  if(type==='number'){field.min='0';field.inputMode='decimal';}
  wrapper.append(field);return {wrapper,field};
 };
 function addRow(name='',unitCost='',quantity='1'){
  if(lines.children.length>=25)return;
  const row=document.createElement('div');row.className='mixed-line';row.dataset.line=String(++count);
  const title=input('Part / model name','text',name),cost=input('Cost per finished item (USD)','number',unitCost,'0.0001');
  const qty=input('Quantity','number',String(quantity),'1');
  const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label','Remove part row');
  remove.addEventListener('click',()=>{row.remove();render()});
  row.append(title.wrapper,cost.wrapper,qty.wrapper,remove);
  lines.append(row);render();
 }
 function rows(){
  return [...lines.children].map(row=>{
   const v=[...row.querySelectorAll('input')],name=v[0].value.trim(),raw=v[1].value.trim(),qty=v[2].value.trim();
   if(name===''&&raw==='')return null;
   return {name:name||'Unnamed part',unitCost:raw===''?NaN:Number(raw),quantity:qty===''?NaN:Number(qty)};
  }).filter(Boolean);
 }
 function currentPricing(){
  const val=(name)=>{const f=form.elements.namedItem(name);return f?Number(f.value)*(f.dataset.percent==='true'?.01:1):NaN};
  return Object.fromEntries(['feeRate','feeFixed','margin','packagingPerOrder','shippingCostPerOrder','shippingChargedPerOrder','designCostPerOrder'].map(name=>[name,val(name)]));
 }
 function render(){
  const items=rows();exportButton.disabled=copyButton.disabled=true;last=null;
  if(items.length===0){output.textContent='Enter the per-item cost and quantity for at least one different model.';output.removeAttribute('data-error');return}
  const result=calculateMixedOrder({items,...currentPricing()});
  if(!result.ok){output.textContent=Object.values(result.errors)[0]||'Correct invalid values.';output.setAttribute('data-error','true');return}
  output.removeAttribute('data-error');
  output.textContent='Parts: '+result.totalParts+' across '+items.length+' model line(s)\n'+
   'Combined successful-item cost: '+usd(result.partsCost)+'\n'+
   'Minimum checkout item subtotal: '+usd(result.itemSubtotal)+'\n'+
   'Shipping charged to customer: '+usd(result.shippingChargedPerOrder)+'\n'+
   'Customer order total: '+usd(result.orderGross)+'\n'+
   'Transaction fees: '+usd(result.fees)+'\n'+
   'Estimated pre-income-tax profit: '+usd(result.netProfit)+'\n'+
   'Actual margin: '+(result.actualMargin===null?'N/A':(result.actualMargin*100).toFixed(2)+'%');
  last=result;exportButton.disabled=copyButton.disabled=false;
 }
 add.addEventListener('click',()=>addRow());
 useCurrent.addEventListener('click',()=>{
  const values={};
  for(const name of Object.keys(DEFAULTS)){const f=form.elements.namedItem(name),raw=f?.value.trim()||'';
   values[name]=raw===''?NaN:Number(raw)*(f.dataset.percent==='true'?.01:1);
  }
  const estimate=calculate(values);
  if(!estimate.ok){output.textContent='Correct the main calculator inputs before importing the current part cost.';output.setAttribute('data-error','true');return}
  addRow('Current print',String(Number(estimate.costPerUnit.toFixed(6))),'1');
 });
 lines.addEventListener('input',render);form.addEventListener('input',render);
 function csv(rows){
  return rows.map(row=>row.map(v=>{
   const text=String(v),safe=/^[=+@\-\t\r]/.test(text)?"'"+text:text;
   return '"'+safe.replaceAll('"','""')+'"';
  }).join(',')).join('\r\n');
 }
 exportButton.addEventListener('click',()=>{
  if(!last)return;
  const table=[['Part','Quantity','Cost per part USD','Line cost USD'],...last.items.map(x=>[x.name,x.quantity,x.unitCost,x.lineCost]),
  ['Checkout item subtotal USD','',last.itemSubtotal,''],['Shipping charged USD','',last.shippingChargedPerOrder,''],
  ['Customer order total USD','',last.orderGross,''],['Fees USD','',last.fees,''],['Pre-tax profit USD','',last.netProfit,''],
  ['Actual margin fraction','',last.actualMargin??'','']];
  const blob=new Blob(['\ufeff',csv(table)],{type:'text/csv;charset=utf-8'});
  const u=URL.createObjectURL(blob),link=document.createElement('a');link.href=u;link.download='printcost-mixed-order.csv';
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);
 });
 copyButton.addEventListener('click',async()=>{
  if(!last)return;
  try{await navigator.clipboard.writeText(output.textContent);output.textContent+='\nCopied to clipboard.'}
  catch{output.textContent+='\nClipboard unavailable; use the CSV download.'}
 });
 addRow();addRow();
}
