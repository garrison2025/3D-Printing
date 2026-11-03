/** Compare two production scenarios using the same tested FDM calculator model. */
import {calculate,DEFAULTS} from './calculations.mjs';
export function comparePrintCosts(scenarioA={},scenarioB={}){
 const run=x=>calculate({...DEFAULTS,...x});
 const a=run(scenarioA),b=run(scenarioB);
 if(!a.ok||!b.ok)return {ok:false,errors:{A:a.ok?null:a.errors,B:b.ok?null:b.errors}};
 const delta=b.costPerUnit-a.costPerUnit;
 return {ok:true,a,b,delta,percentage:a.costPerUnit===0?null:100*delta/a.costPerUnit};
}
