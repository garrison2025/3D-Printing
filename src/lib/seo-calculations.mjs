const finite=(n,name,min=0)=>{const v=Number(n);if(!Number.isFinite(v)||v<min||v>1e10)throw new RangeError(name+' must be nonnegative');return v};
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