const finite=(n,name,min=0)=>{const v=Number(n);if(!Number.isFinite(v)||v<min||v>1e10)throw new RangeError(name+' must be a number from '+min+' to 10,000,000,000.');return v};
export function filamentEstimate({spoolPrice,spoolGrams,usedGrams,itemsPerPlate=1,secondSpoolPrice=0,secondSpoolGrams=1000,secondUsedGrams=0}){
 const grams=finite(spoolGrams,'Spool grams',.000001),price=finite(spoolPrice,'Spool price'),used=finite(usedGrams,'Used grams'),items=finite(itemsPerPlate,'Items per plate',1);
 if(!Number.isInteger(items))throw new RangeError('Items per plate must be whole');
 const used2=finite(secondUsedGrams,'Second material grams');
 const price2=finite(secondSpoolPrice,'Second spool price');
 const grams2=finite(secondSpoolGrams,'Second spool grams',.000001);
 const perGram=price/grams,secondaryPerGram=price2/grams2;
 const primaryPerPlate=used*perGram,secondaryPerPlate=used2*secondaryPerGram;
 const perPlate=primaryPerPlate+secondaryPerPlate;
 const mainCapacity=used>0?Math.floor(grams/used):Infinity;
 const secondCapacity=used2>0?Math.floor(grams2/used2):Infinity;
 const fullPlates=used+used2>0?Math.min(mainCapacity,secondCapacity):null;
 const output={perGram,secondaryPerGram,primaryPerPlate,secondaryPerPlate,perPlate,
  perItem:perPlate/items,remainingGrams:Math.max(0,grams-used),
  secondRemainingGrams:Math.max(0,grams2-used2),fullPlates,hasSecond:used2>0};
 if(Object.values(output).some(v=>typeof v==='number'&&!Number.isFinite(v)))
  throw new RangeError('The estimated amount is too large');
 return output;
}
export function hourlyEstimate({printerPrice,lifeHours,watts,electricityRate,maintenancePerHour=0,operatorMinutesPerHour=0,laborRate=0}){
 const machine=finite(printerPrice,'Printer price')/finite(lifeHours,'Useful hours',.000001);
 const electricity=finite(watts,'Watts')/1000*finite(electricityRate,'Electricity rate');
 const maintenance=finite(maintenancePerHour,'Maintenance');
 const operator=finite(operatorMinutesPerHour,'Operator minutes')/60*finite(laborRate,'Labor rate');
 return {machine,electricity,maintenance,operator,total:machine+electricity+maintenance+operator};
}
/** Selling-price tool for a KNOWN cost per successfully finished part.
 * Unlike the full FDM estimator, does not calculate slicer-derived production costs.
 * Financial figures are estimates; excludes taxes and unentered expenses.
 */
export function priceKnownCost(input){
 const fields=['unitCost','quantity','feePercent','marginPercent','feeFixed','packagingPerOrder',
  'designPerOrder','shippingCostPerOrder','shippingChargedPerOrder'];
 const x={},errors={};
 for(const k of fields){
  const raw=input?.[k],v=raw===''||raw===null||raw===undefined?NaN:Number(raw);
  if(!Number.isFinite(v)||v<0||v>1e10)errors[k]='Enter a valid nonnegative amount.';
  x[k]=v;
 }
 if(Number.isFinite(x.quantity)&&(!Number.isSafeInteger(x.quantity)||x.quantity<1||x.quantity>100000))
  errors.quantity='Quantity must be a whole number from 1 to 100,000.';
 if(Number.isFinite(x.feePercent)&&x.feePercent>=100)errors.feePercent='Fee must be below 100%.';
 if(Number.isFinite(x.marginPercent)&&x.marginPercent>=100)errors.marginPercent='Margin must be below 100%.';
 if(Number.isFinite(x.feePercent)&&Number.isFinite(x.marginPercent)&&x.feePercent+x.marginPercent>=100)
  errors.marginPercent='Fee percentage plus target margin must be below 100%.';
 if(Object.keys(errors).length)return {ok:false,errors};
 const fee=x.feePercent/100,margin=x.marginPercent/100;
 const productionCost=x.unitCost*x.quantity;
 const totalExpenses=productionCost+x.packagingPerOrder+x.designPerOrder+x.shippingCostPerOrder;
 const requiredGross=(totalExpenses+x.feeFixed)/(1-fee-margin);
 const theoreticalUnitPrice=Math.max(0,(requiredGross-x.shippingChargedPerOrder)/x.quantity);
 if(![productionCost,totalExpenses,requiredGross,theoreticalUnitPrice].every(Number.isFinite)||
   !Number.isSafeInteger(Math.ceil(theoreticalUnitPrice*100)))
  return {ok:false,errors:{_global:'These amounts are outside the supported range.'}};
 let cents=Math.max(0,Math.ceil(theoreticalUnitPrice*100-1e-9));
 let unitPrice=cents/100,orderGross=unitPrice*x.quantity+x.shippingChargedPerOrder;
 if(orderGross+Math.abs(requiredGross)*1e-13<requiredGross){
  cents++;unitPrice=cents/100;orderGross=unitPrice*x.quantity+x.shippingChargedPerOrder;
 }
 const percentageFees=fee*orderGross,platformFees=percentageFees+x.feeFixed;
 const netProfit=orderGross-totalExpenses-platformFees;
 const actualMargin=orderGross>0?netProfit/orderGross:null;
 if(![unitPrice,orderGross,platformFees,netProfit].every(Number.isFinite))
  return {ok:false,errors:{_global:'Result exceeds the supported range.'}};
 return {ok:true,inputs:x,productionCost,totalExpenses,requiredGross,theoreticalUnitPrice,
  unitPrice,itemSubtotal:unitPrice*x.quantity,orderGross,percentageFees,platformFees,netProfit,
  actualMargin,profitPerItem:netProfit/x.quantity,markupOnProductionCost:productionCost>0?netProfit/productionCost:null};
}
