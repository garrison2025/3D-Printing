/** PrintCost Studio calculation engine. No I/O, browser APIs or rounding of intermediate values. */
export const DEFAULTS = Object.freeze({
  spoolPrice:25, spoolGrams:1000, usedGrams:100, hours:8, unitsPerPlate:1,
  watts:120, energyRate:0.18, machineCost:400, lifeHours:4000,
  prepMinutes:10, laborRate:15, failRate:0.05, finishPerUnit:0.5,
  feeRate:0.08, feeFixed:0.3, margin:0.30,
  unitsPerOrder:1, shippingCostPerOrder:0, shippingChargedPerOrder:0,
  packagingPerOrder:0,
});

const NONNEGATIVE = [
  'spoolPrice','usedGrams','hours','watts','energyRate','machineCost',
  'prepMinutes','laborRate','finishPerUnit','feeFixed',
  'shippingCostPerOrder','shippingChargedPerOrder','packagingPerOrder'
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
  const attemptCost=materialPerPlate+energyPerPlate+machinePerPlate+prepPerPlate;
  const expectedPlateCost=attemptCost/(1-x.failRate);
  const productionPerUnit=expectedPlateCost/x.unitsPerPlate;
  const costPerUnit=productionPerUnit+x.finishPerUnit;
  const orderProductionCost=costPerUnit*x.unitsPerOrder;
  const orderExpenses=orderProductionCost+x.shippingCostPerOrder+x.packagingPerOrder;
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
    expectedPlateCost,productionPerUnit,costPerUnit,orderProductionCost,orderExpenses,requiredOrderGross,
    recommendedPrice,orderGross,platformFees,netProfit,actualMargin,profitPerUnit,
    costPerGram,machineHourly,electricityHourly,
    markupOnProductionCost:costPerUnit>0?profitPerUnit/costPerUnit:null,
    costBreakdown:[
      {name:'Material',value:materialPerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Electricity',value:energyPerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Machine wear',value:machinePerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Preparation labor',value:prepPerPlate/(1-x.failRate)/x.unitsPerPlate},
      {name:'Finishing / per-item packing',value:x.finishPerUnit},
    ]
  };
  if(!Object.values(result).filter(v=>typeof v==='number').every(Number.isFinite))return {ok:false,errors:{_global:'The result exceeds the supported numeric range. Use smaller inputs.'}};
  return result;
}
