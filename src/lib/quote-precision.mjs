/** Separate theoretical FDM margin from a USD quote charged in whole cents. */
export function practicalUsdQuote(r){
 if(!r?.ok||!Number.isFinite(r.recommendedPrice)||r.recommendedPrice<0)return null;
 if(!Number.isSafeInteger(Math.ceil(r.recommendedPrice*100)))return null;
 const x=r.inputs;
 let cents=Math.max(0,Math.ceil(r.recommendedPrice*100-1e-9));
 let unitPrice=cents/100,orderGross=unitPrice*x.unitsPerOrder+x.shippingChargedPerOrder;
 if(orderGross+Math.abs(r.requiredOrderGross)*1e-13<r.requiredOrderGross){
  cents++;unitPrice=cents/100;orderGross=unitPrice*x.unitsPerOrder+x.shippingChargedPerOrder;
 }
 const platformFees=x.feeRate*orderGross+x.feeFixed;
 const netProfit=orderGross-r.orderExpenses-platformFees;
 return {unitPrice,orderGross,platformFees,netProfit,
  actualMargin:orderGross>0?netProfit/orderGross:null,
  differenceFromTheoretical:unitPrice-r.recommendedPrice};
}
