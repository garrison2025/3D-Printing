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
 const rows=computeUseCases().map(x=>{
  const plate=x.result;
  const failureAllowance=plate.expectedPlateCost-plate.attemptCost;
  return '<tr><th scope="row">'+x.label+'</th><td>'+x.usedGrams+' g</td><td>'+x.hours+' h</td><td>'+x.unitsPerPlate+'</td><td>$'+plate.attemptCost.toFixed(2)+'</td><td>$'+failureAllowance.toFixed(2)+'</td><td>$'+plate.costPerUnit.toFixed(2)+'</td></tr>';
 }).join('');
 const sensitivity=[0,.05,.15].map(rate=>{
  const r=calculate({...DEFAULTS,usedGrams:100,hours:8,unitsPerPlate:1,failRate:rate});
  if(!r.ok)throw Error('Failure-rate example must remain calculable');
  return '<tr><th scope="row">'+Math.round(rate*100)+'%</th><td>$'+r.attemptCost.toFixed(4)+'</td><td>$'+(r.expectedPlateCost-r.attemptCost).toFixed(4)+'</td><td>$'+r.costPerUnit.toFixed(4)+'</td></tr>';
 }).join('');
 return '<section id="cost-by-example">'+
 '<h2>What does it cost to 3D print small, large or batch parts?</h2>'+
 '<p>There is no verified universal average price. These three <strong>hypothetical FDM jobs</strong> show how the same cost model changes with sliced weight, duration and items per plate. All rows use a $25/1,000 g spool, 120 W at $0.18/kWh, a $400 printer over 4,000 productive hours, 10 minutes of preparation at $15/hour <em>per attempted plate</em>, a 5% chance of an entire plate failing and $0.50 finishing per successful item. These are mathematical scenarios, not measurements from real print orders.</p>'+
 '<div class="cost-guide-table-scroll" role="region" aria-label="Cost for three 3D print scenarios" tabindex="0"><table class="compare-table"><caption>Reproducible FDM examples. Attempt and failure allowance are per plate; the final cost is per successfully finished item.</caption><thead><tr><th scope="col">Job</th><th scope="col">Sliced weight</th><th scope="col">Plate time</th><th scope="col">Items / plate</th><th scope="col">Attempt cost / plate</th><th scope="col">Failure allowance / plate</th><th scope="col">Expected cost / item</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
 '<p><strong>How to read the table:</strong> The attempt cost includes material, electricity, machine allocation and preparation labor. The failure allowance is the additional expected cost from repeats: attempt cost ÷ (1 − failure probability) minus attempt cost. Divide the sum by usable items per plate, then add $0.50 finishing per item. No payment fees or target sales margin are included.</p>'+
 '<h2>How much does a failed print change the real cost?</h2>'+
 '<p>The next table keeps the exact <strong>100 g, eight-hour, one-item plate</strong> and all other example inputs constant; only the whole-plate failure probability changes. The assumption is deliberately conservative: every failed attempt loses a full plate of material, time and preparation.</p>'+
 '<div class="cost-guide-table-scroll" role="region" aria-label="Failure rate cost sensitivity table" tabindex="0"><table class="compare-table"><caption>Failure-rate sensitivity calculated with the published site cost formula (USD)</caption><thead><tr><th scope="col">Failed plate probability</th><th scope="col">One attempt</th><th scope="col">Expected failure allowance</th><th scope="col">Finished cost / item</th></tr></thead><tbody>'+sensitivity+'</tbody></table></div>'+
 '<p>The failure allowance is an expected-value estimate, not an observed defect rate or a promise that 15% of your prints will fail. A print that stops early may consume less than the full-plate cost. For partially successful plates, count the usable finished items and actual lost material instead of treating every plate as an all-or-nothing failure.</p>'+
 '<p>Compare <a href="/calculation-methodology/#cost-comparison-tool">two input sets interactively</a>, price the material in the <a href="/filament-cost-calculator/">filament-only tool</a>, or enter your own measurements in the <a href="/">FDM production cost calculator</a>. These tables are not commercial service quotes.</p></section>';
}
