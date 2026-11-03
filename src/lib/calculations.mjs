/** PrintCost Studio calculation engine. No I/O, browser APIs or rounding of intermediate values. */
export const DEFAULTS = Object.freeze({
  spoolPrice:25, spoolGrams:1000, usedGrams:100, hours:8, unitsPerPlate:1,
  watts:120, energyRate:0.18, machineCost:400, lifeHours:4000,
  prepMinutes:10, laborRate:15, failRate:0.05, finishPerUnit:0.5,
  feeRate:0.08, feeFixed:0.3, margin:0.30,
  unitsPerOrder:1, shippingCostPerOrder:0, shippingChargedPerOrder:0,
  packagingPerOrder:0,
  maintenancePerHour:0, designCostPerOrder:0,
});

const NONNEGATIVE = [
  'spoolPrice','usedGrams','hours','watts','energyRate','machineCost',
  'prepMinutes','laborRate','finishPerUnit','feeFixed',
  'shippingCostPerOrder','shippingChargedPerOrder','packagingPerOrder',
  'maintenancePerHour','designCostPerOrder'
];

export function validateInputs(x) {
  const errs={};
  for (const k of [...Object.keys(DEFAULTS)]) {
    if(typeof x[k] !== 'number'||!Number.isFinite(x[k])) errs[k]='Enter a valid number.';
    else if(x[k]<0) errs[k]='Must be zero or higher.';
    else if(x[k]>1e10) errs[k]='Value is too large.';
  }
  for(const k of NONNEGATIVE) {if(x[k]>=0&&x[k]<=1e10)delete errs[k];}
  for(const k of ['spoolGrams','lifeHours']) if(Number.isFinite(x[k])&&x[k]<=0) errs[k]='Must be greater than zero.';
  for(const k of ['unitsPerPlate','unitsPerOrder']) {
    if(!Number.isSafeInteger(x[k])||x[k]<1||x[k]>100000) errs[k]='Enter a whole number from 1 to 100,000.';
  }
  for(const k of ['failRate','feeRate','margin']) if(Number.isFinite(x[k])&&(x[k]<0||x[k]>=1)) errs[k]='Must be between 0% and less than 100%.';
  if(Number.isFinite(x.failRate)&&x.failRate>0.95) errs.failRate='Maximum supported rate is 95%.';
  if(Number.isFinite(x.feeRate)&&Number.isFinite(x.margin)&&x.feeRate+x.margin>=1) {
    errs.margin='Target margin plus percentage fees must be below 100%.';
    errs.feeRate='Target margin plus percentage fees must be below 100%.';
  }
  return errs;
}

export function calculate(input){
  const x={...DEFAULTS,...input};
  const errors=validateInputs(x);
  if(Object.keys(errors).length)return {ok:false,errors};
  const materialPerPlate=x.usedGrams*x.spoolPrice/x.spoolGrams;
  const energyPerPlate=x.hours*(x.watts/1000)*x.energyRate;
  const machinePerPlate=x.hours*(x.machineCost/x.lifeHours);
  const prepPerPlate=(x.prepMinutes/60)*x.laborRate;
  const maintenancePerPlate=x.hours*x.maintenancePerHour;
  const attemptCost=materialPerPlate+energyPerPlate+machinePerPlate+prepPerPlate+maintenancePerPlate;
  const expectedPlateCost=attemptCost/(1-x.failRate);
  const productionPerUnit=expectedPlateCost/x.unitsPerPlate;
  const costPerUnit=productionPerUnit+x.finishPerUnit;
  const orderProductionCost=costPerUnit*x.unitsPerOrder;
  const orderExpenses=orderProductionCost+x.shippingCostPerOrder+x.packagingPerOrder+x.designCostPerOrder;
  const requiredOrderGross=(orderExpenses+x.feeFixed)/(1-x.feeRate-x.margin);
  // Customer-paid shipping is part of total order revenue; it reduces item price but not required gross.
  const recommendedPrice=Math.max(0,(requiredOrderGross-x.shippingChargedPerOrder)/x.unitsPerOrder);
  const orderGross=recommendedPrice*x.unitsPerOrder+x.shippingChargedPerOrder;
  const platformFees=x.feeRate*orderGross+x.feeFixed;
  const netProfit=orderGross-orderExpenses-platformFees;
  const actualMargin=orderGross>0?netProfit/orderGross:null;
  const profitPerUnit=netProfit/x.unitsPerOrder;
  const costPerGram=x.spoolPrice/x.spoolGrams;
  const machineHourly=x.machineCost/x.lifeHours;
  const electricityHourly=x.watts/1000*x.energyRate;
  const result={ok:true,inputs:x,materialPerPlate,energyPerPlate,machinePerPlate,prepPerPlate,attemptCost,
    expectedPlateCost,productionPerUnit,costPerUnit,maintenancePerPlate,orderProductionCost,orderExpenses,requiredOrderGross,
    recommendedPrice,orderGross,platformFees,netProfit,actualMargin,profitPerUnit,
    costPerGram,machineHourly,electricityHourly,
    markupOnProductionCost:costPerUnit>0?profitPerUnit/costPerUnit:null,
    costBreakdown:[
      {name:'Material',value:materialPerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Electricity',value:energyPerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Machine wear',value:machinePerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Maintenance reserve',value:maintenancePerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Preparation labor',value:prepPerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Finishing / per-item packing',value:x.finishPerUnit},
    ]
  };
  if(!Object.values(result).filter(v=>typeof v==='number').every(Number.isFinite))return {ok:false,errors:{_global:'The result exceeds the supported numeric range. Use smaller inputs.'}};
  return result;
}

/** Quote unlike items as ONE order subtotal. It deliberately does not invent per-SKU selling prices.
 * Costs are supplied per finished item, e.g. from separate slicer jobs or this site's main calculator.
 */
export function calculateMixedOrder(input={}){
 const errors={};
 const items=input.items;
 if(!Array.isArray(items)||items.length<1||items.length>25)
  return {ok:false,errors:{items:'Enter 1 to 25 different parts.'}};
 const vars=['feeRate','feeFixed','margin','packagingPerOrder','shippingCostPerOrder','shippingChargedPerOrder','designCostPerOrder'];
 const x={};for(const name of vars){
  const value=input[name]??0;
  if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>1e10)errors[name]='Enter a valid nonnegative amount.';
  x[name]=value;
 }
 if(Number.isFinite(x.feeRate)&&x.feeRate>=1)errors.feeRate='Percentage fee must be below 100%.';
 if(Number.isFinite(x.margin)&&x.margin>=1)errors.margin='Margin must be below 100%.';
 if(Number.isFinite(x.feeRate)&&Number.isFinite(x.margin)&&x.feeRate+x.margin>=1)errors.margin='Fee plus margin must be below 100%.';
 let totalParts=0,partsCost=0;
 for(const [i,item] of items.entries()){
  const count=item?.quantity,unitCost=item?.unitCost;
  if(!Number.isSafeInteger(count)||count<1||count>100000)errors['quantity'+i]='Quantity must be a positive whole number.';
  if(typeof unitCost!=='number'||!Number.isFinite(unitCost)||unitCost<0||unitCost>1e10)errors['cost'+i]='Unit cost must be a valid nonnegative amount.';
  if(!errors['quantity'+i]&&!errors['cost'+i]){totalParts+=count;partsCost+=unitCost*count;}
 }
 if(Object.keys(errors).length)return {ok:false,errors};
 const orderExpenses=partsCost+x.packagingPerOrder+x.shippingCostPerOrder+x.designCostPerOrder;
 const requiredGross=(orderExpenses+x.feeFixed)/(1-x.feeRate-x.margin);
 const theoreticalItemSubtotal=Math.max(0,requiredGross-x.shippingChargedPerOrder);
 const rawCents=theoreticalItemSubtotal*100;
 if(!Number.isFinite(rawCents)||!Number.isSafeInteger(Math.ceil(rawCents))||totalParts>1000000)
  return {ok:false,errors:{_global:'This mixed quote is outside the supported numeric range.'}};
 let cents=Math.max(0,Math.ceil(rawCents-1e-9));
 let itemSubtotal=cents/100,orderGross=itemSubtotal+x.shippingChargedPerOrder;
 if(orderGross+Math.abs(requiredGross)*1e-13<requiredGross){
  cents++;itemSubtotal=cents/100;orderGross=itemSubtotal+x.shippingChargedPerOrder;
 }
 const fees=x.feeRate*orderGross+x.feeFixed,netProfit=orderGross-orderExpenses-fees;
 if(![orderExpenses,requiredGross,itemSubtotal,orderGross,fees,netProfit].every(Number.isFinite))
  return {ok:false,errors:{_global:'The order values are too large.'}};
 return {ok:true,items:items.map(({name='',quantity,unitCost})=>({name:String(name).slice(0,80),quantity,unitCost,lineCost:unitCost*quantity})),
  totalParts,partsCost,orderExpenses,requiredGross,theoreticalItemSubtotal,
  itemSubtotal,shippingChargedPerOrder:x.shippingChargedPerOrder,orderGross,
  fees,netProfit,actualMargin:orderGross>0?netProfit/orderGross:null};
}
