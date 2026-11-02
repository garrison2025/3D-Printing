const finite=(n,name,min=0)=>{const v=Number(n);if(!Number.isFinite(v)||v<min)throw new RangeError(name+' must be nonnegative');return v};
export function filamentEstimate({spoolPrice,spoolGrams,usedGrams,itemsPerPlate=1}){
 const grams=finite(spoolGrams,'Spool grams',.000001),price=finite(spoolPrice,'Spool price'),used=finite(usedGrams,'Used grams'),items=finite(itemsPerPlate,'Items per plate',1);
 if(!Number.isInteger(items))throw new RangeError('Items per plate must be whole');
 const perGram=price/grams,perPlate=used*perGram;
 return {perGram,perPlate,perItem:perPlate/items,remainingGrams:Math.max(0,grams-used),fullPlates:used?Math.floor(grams/used):null};
}
export function hourlyEstimate({printerPrice,lifeHours,watts,electricityRate,maintenancePerHour=0,operatorMinutesPerHour=0,laborRate=0}){
 const machine=finite(printerPrice,'Printer price')/finite(lifeHours,'Useful hours',.000001);
 const electricity=finite(watts,'Watts')/1000*finite(electricityRate,'Electricity rate');
 const maintenance=finite(maintenancePerHour,'Maintenance');
 const operator=finite(operatorMinutesPerHour,'Operator minutes')/60*finite(laborRate,'Labor rate');
 return {machine,electricity,maintenance,operator,total:machine+electricity+maintenance+operator};
}