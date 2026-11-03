/** First-party model comparisons: all examples originate in real calculator engines. */
import {calculate,DEFAULTS} from '../src/lib/calculations.mjs';
import {priceKnownCost} from '../src/lib/seo-calculations.mjs';

const usd=n=>'$'+n.toFixed(2);
const exact=n=>'$'+n.toFixed(4);
function production(other){
 const result=calculate({...DEFAULTS,...other});
 if(!result.ok)throw Error('Invalid first-party scenario');
 return result;
}
function pricedOrder(quantity){
 const r=priceKnownCost({unitCost:6.79,quantity,feePercent:8,marginPercent:30,feeFixed:0.30,
  packagingPerOrder:0,designPerOrder:0,shippingCostPerOrder:0,shippingChargedPerOrder:0});
 if(!r.ok)throw Error('Invalid known-cost scenario');
 return r;
}
export function scenarioResults(){
 const failure=[0,.05,.20].map(rate=>({rate,unitCost:production({failRate:rate}).costPerUnit}));
 const quantities=[pricedOrder(1),pricedOrder(10)];
 const hours=[production({hours:4}),production({hours:8})];
 const margin=priceKnownCost({unitCost:10,quantity:1,feePercent:0,marginPercent:30,feeFixed:0,
  packagingPerOrder:0,designPerOrder:0,shippingCostPerOrder:0,shippingChargedPerOrder:0});
 if(!margin.ok)throw Error('Invalid margin scenario');
 return {failure,quantities,hours,margin,markupPrice:13,markupMargin:3/13,baseline:production({})};
}
export function scenarioEvidenceHtml(){
 const d=scenarioResults();
 const failureRows=d.failure.map(x=>'<tr><td>'+(100*x.rate).toFixed(0)+'% lost-plate assumption</td><td>'+exact(x.unitCost)+'</td></tr>').join('');
 const batchRows=d.quantities.map(x=>'<tr><td>'+x.inputs.quantity+' item'+(x.inputs.quantity===1?'':'s')+'</td><td>'+usd(x.unitPrice)+'</td><td>'+usd(x.orderGross)+'</td><td>'+usd(x.platformFees)+'</td><td>'+usd(x.netProfit)+'</td></tr>').join('');
 const hourRows=d.hours.map((x,i)=>'<tr><td>'+(i===0?4:8)+' hours</td><td>'+exact(x.energyPerPlate)+'</td><td>'+exact(x.machinePerPlate)+'</td><td>'+exact(x.costPerUnit)+'</td></tr>').join('');
 return [
 '<section id="reproducible-scenarios" aria-labelledby="scenario-heading">',
 '<h2 id="scenario-heading">Four original, reproducible FDM cost and pricing comparisons</h2>',
 '<p><strong>These results come from the published calculator engine, not measured market prices, actual customer orders or industry failure statistics.</strong> Each comparison changes only its stated assumption. The inputs and formula links below let you reproduce every value; intermediate math retains full precision.</p>',
 '<section id="scenario-failure"><h3>1. What happens when more print plates fail?</h3>',
 '<p>Assume one part per plate, 100 g from a $25 / 1,000 g spool, 8 hours, 120 W at $0.18/kWh, a $400 printer spread across 4,000 hours, 10 minutes of prep at $15/hour and $0.50 finishing. Each attempt costs <strong>'+exact(d.baseline.attemptCost)+'</strong>. Only the probability of losing an entire plate changes.</p>',
 '<table class="compare-table"><caption>Hypothetical lost-plate rates; not reliability benchmarks</caption><thead><tr><th>Loss probability</th><th>Expected cost / successful part</th></tr></thead><tbody>',failureRows,'</tbody></table>',
 '<p>Expected cost = attempted plate cost ÷ (1 − whole-plate loss probability) + finishing. This model assumes independently repeated attempts with unchanged inputs. <a href="/">Use your own failure allowance in the full cost calculator</a>.</p></section>',
 '<section id="scenario-order"><h3>2. Why can a 10-item order have a lower per-item quote?</h3>',
 '<p>Assume a known cost of $6.79 per finished item, an 8% fee, one $0.30 fee per <em>order</em>, 30% pre-income-tax margin and no other expenses. The 10 units are purchased in a single transaction, not ten separate checkouts.</p>',
 '<table class="compare-table"><caption>Modeled checkout results from the real known-cost quote engine</caption><thead><tr><th>Quantity</th><th>Unit price</th><th>Checkout</th><th>Order fees</th><th>Profit</th></tr></thead><tbody>',batchRows,'</tbody></table>',
 '<p>The fixed $0.30 fee represents $0.30 per part for one item but $0.03 per part for a single ten-item order. No bulk discount or production cost reduction is assumed. <a href="/3d-print-pricing-calculator/">Calculate your selling quote</a>.</p></section>',
 '<section id="scenario-hours"><h3>3. What if print time doubles but the plate still uses 100 g?</h3>',
 '<p>Keep all default inputs unchanged except print duration (4 versus 8 hours): 100 g material, 5% assumed failed plates, the same machine, same preparation work and $0.50 finishing. This comparison isolates time-related electricity and machine allocation.</p>',
 '<table class="compare-table"><caption>Illustrative same-material plates, not a measured printer profile</caption><thead><tr><th>Time</th><th>Electricity/plate</th><th>Machine/plate</th><th>Expected cost/item</th></tr></thead><tbody>',hourRows,'</tbody></table>',
 '<p>The expected per-item difference is <strong>'+exact(d.hours[1].costPerUnit-d.hours[0].costPerUnit)+'</strong>. Actual slicer jobs can change weight as well as duration; recheck both values. <a href="/3d-printing-cost-per-hour/">Check your printer-hour inputs</a>.</p></section>',
 '<section id="scenario-margin"><h3>4. Is 30% markup the same as 30% profit margin?</h3>',
 '<p>No. For a known $10 cost with zero payment fees and extra expenses, a 30% pre-tax target margin requires at least <strong>'+usd(d.margin.unitPrice)+'</strong> at whole-cent precision. A 30% markup gives <strong>'+usd(d.markupPrice)+'</strong> and only <strong>'+(d.markupMargin*100).toFixed(2)+'%</strong> profit margin on revenue.</p>',
 '<p>Profit margin = profit ÷ revenue; markup = profit ÷ cost. Real fees and shipping change the needed quote. <a href="/how-to-price-3d-prints/">Read the seller pricing guide</a>.</p></section>',
 '<p><strong>Verify the arithmetic:</strong> see <a href="https://github.com/garrison2025/3D-Printing/blob/main/src/lib/calculations.mjs">FDM costing source code</a> and <a href="https://github.com/garrison2025/3D-Printing/blob/main/src/lib/seo-calculations.mjs">known-cost quote source code</a>. These are first-party implementations, not independent endorsements or performance studies.</p>',
 '</section>'
 ].join('');
}
