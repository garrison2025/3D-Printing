/** Original, reproducible application cases; not survey-based average cost. */
import {calculate,DEFAULTS} from '../src/lib/calculations.mjs';
export const CASE_INPUTS=Object.freeze([
 {id:'small',label:'Small single part',usedGrams:20,hours:2,unitsPerPlate:1},
 {id:'standard',label:'One larger part',usedGrams:100,hours:8,unitsPerPlate:1},
 {id:'batch',label:'Four parts on one plate',usedGrams:160,hours:10,unitsPerPlate:4}
]);
export function computeUseCases(){
 return CASE_INPUTS.map(x=>{
  const result=calculate({...DEFAULTS,usedGrams:x.usedGrams,hours:x.hours,unitsPerPlate:x.unitsPerPlate});
  if(!result.ok)throw Error('Cost use-case failed validation '+x.id);
  return {...x,result};
 });
}
export function costUseCasesHtml(){
 const rows=computeUseCases().map(x=>'<tr><th scope="row">'+x.label+'</th><td>'+x.usedGrams+' g</td><td>'+x.hours+' h</td><td>'+x.unitsPerPlate+'</td><td>$'+x.result.materialPerPlate.toFixed(2)+'</td><td>$'+x.result.costPerUnit.toFixed(2)+'</td></tr>').join('');
 return '<section id="cost-by-example">'+
 '<h2>What does it cost to 3D print small, large or batch parts?</h2>'+
 '<p>There is no verified universal average price. These three <strong>hypothetical FDM jobs</strong> show how the same cost model changes with sliced weight, duration and items per plate. All rows use a $25/1,000 g spool, 120 W at $0.18/kWh, a $400 printer over 4,000 productive hours, 10 minutes of preparation at $15/hour <em>per attempted plate</em>, a 5% chance of an entire plate failing and $0.50 finishing per successful item. They are not measurements from real customer orders or a specific printer.</p>'+
 '<table class="compare-table"><caption>Calculated examples from the first-party FDM formula; not commercial service quotes</caption><thead><tr><th>Hypothetical job</th><th>Sliced plate weight</th><th>Plate time</th><th>Usable parts</th><th>Material/plate</th><th>Expected cost/part</th></tr></thead><tbody>'+rows+'</tbody></table>'+
 '<p>The calculation allocates whole-plate attempts and failures across each successful plate. The batch case therefore has a different per-item cost even though the plate weighs and prints more. The estimate excludes income tax, customer shipping and unentered expenses; it is not a guaranteed supplier price. Recalculate with <a href="/">your own plate inputs</a>, or use the <a href="/calculation-methodology/#cost-comparison-tool">interactive scenario comparison</a>.</p></section>';
}
