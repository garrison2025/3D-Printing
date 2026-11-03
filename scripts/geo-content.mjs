// Human-readable, source-backed explanations of this site's own calculations.
// These are not special AI-only pages or hidden machine-readable payloads.
export const ANSWERS = Object.freeze({
  '/': {
    question: 'How is the cost of a 3D print calculated?',
    answer: 'For an FDM print, add filament, electricity, allocated printer usage and active preparation labor for one print attempt. Divide that attempt cost by (1 − whole-plate failure probability), divide by the successful items per plate, then add per-item finishing. Pricing also accounts for the quantity sold, order costs, platform fees and a chosen margin.',
    detail: 'A worked example using 100 g of a $25 / 1,000 g spool, 8 hours, 120 W, and the explicitly stated labor and failure assumptions gives $6.7872 per successful item before order-level fees.'
  },
  '/filament-cost-calculator/': {
    question: 'How do you calculate filament cost per gram and per 3D print?',
    answer: 'Divide the price paid for a spool by its net filament weight in grams. Multiply that per-gram cost by the slicer-estimated grams for the entire plate. If the plate makes several usable items, divide the plate material cost by the number of items.',
    detail: 'Example: $25 ÷ 1,000 g = $0.025/g; a 100 g plate costs $2.50 in material, or $0.625 per item when four items are printed successfully. Electricity, labor and failed prints are excluded.'
  },
  '/3d-printing-cost-per-hour/': {
    question: 'What does it cost to run a 3D printer for one hour?',
    answer: 'An hourly FDM operating-cost estimate adds machine allocation (printer purchase price ÷ assumed productive lifetime hours), electricity (average watts ÷ 1,000 × price per kWh), any maintenance allowance, and optional active labor (minutes ÷ 60 × labor rate).',
    detail: 'Example: a $400 printer over 4,000 print hours plus 120 W electricity at $0.18/kWh costs $0.1216 per operating hour before maintenance and active labor. This is not a commercial printing-service hourly rate.'
  },
  '/how-much-does-3d-printing-cost/': {
    question: 'How much does one FDM 3D print cost?',
    answer: 'There is no universal price per printed object. A useful estimate combines the object’s sliced material weight and printing time with electricity, allocated machine cost, hands-on labor, finishing and expected unsuccessful attempts. Actual cost depends on the user’s machine and assumptions.',
    detail: 'Illustrative example: a $5.9728 attempt cost, 5% whole-plate failure probability and $0.50 finishing produce $6.7872 expected cost for one successful print.'
  },
  '/how-to-price-3d-prints/': {
    question: 'How do you price 3D prints to achieve a target margin?',
    answer: 'First estimate successful-item production costs. Multiply by the number of items in the order, add packaging and delivery expenses, then add any fixed transaction fee. Divide by (1 − percentage selling fee − target margin) to determine the gross order revenue required. Separate customer-paid shipping from the item subtotal.',
    detail: 'Using $6.7872 production cost, an 8% fee, a $0.30 fixed order fee, no shipping, and a 30% target margin gives a theoretical one-item price of about $11.4309. The minimum whole-cent checkout amount is $11.44 to meet or exceed the 30% margin target. Margin means profit ÷ revenue; it is not markup.'
  }
});

export function answerPanel(route){
  const item=ANSWERS[route];
  if(!item) return '';
  return `<aside class="geo-answer" aria-label="Quick calculation answer"><p class="geo-eyebrow">THE SHORT ANSWER</p><h2>${item.question}</h2><p>${item.answer}</p><p class="geo-proof">${item.detail}</p><p class="geo-source">See the <a href="/calculation-methodology/">calculation methodology, full assumptions and reproducible examples</a>.</p></aside>`;
}

// This reference describes implemented formulas, not benchmarks or industry averages.
export function methodologyPage(){return `<div class="container"><article class="editorial geo-method-article">
  <div class="eyebrow">TRANSPARENT CALCULATION METHOD</div>
  <nav class="seo-breadcrumb" aria-label="Breadcrumb"><a href="/">3D Print Cost Calculator</a> / Calculation methodology</nav>
  <h1>3D Printing Cost Calculator: Methodology &amp; Assumptions</h1>
  <p class="intro"><strong>PrintCost Studio uses input-driven arithmetic, not a universal 3D printing price database.</strong> The FDM cost and quote tools estimate how much a specified print attempt costs, adjust for a user-entered whole-plate failure probability, and solve the selling price for a stated target margin. Every example below can be reproduced with the same numbers in the <a href="/#calculator">main calculator</a>.</p>
  <section class="geo-answer"><p class="geo-eyebrow">METHOD IN ONE PARAGRAPH</p><h2>How does the calculator work?</h2><p>Add the material, electricity, machine allocation and preparation labor for one plate. Divide by (1 − assumed whole-plate failure rate) to estimate the cost of obtaining a successful plate. Divide by usable items on the plate and add finishing per item. For an order, add item costs, shipping expense, packaging and one fixed transaction fee, then solve for gross revenue after percentage fees and the chosen pre-income-tax profit margin.</p><p class="geo-proof">The input numbers are illustrations, not live market prices or independently measured printer consumption.</p></section>
  <h2>1. What inputs are required?</h2>
  <table class="compare-table"><thead><tr><th>Input</th><th>Unit and meaning</th><th>Where to get it</th></tr></thead><tbody>
  <tr><td>Material per plate</td><td>Grams including supports</td><td>Slicer estimate for the actual print profile</td></tr>
  <tr><td>Spool purchase price / net weight</td><td>USD / usable filament grams</td><td>Your receipt and spool labeling</td></tr>
  <tr><td>Print time / power</td><td>Hours per plate / average watts</td><td>Slicer duration; preferably measured average watts</td></tr>
  <tr><td>Printer price / lifetime</td><td>USD / assumed productive hours</td><td>Your hardware cost and chosen allocation assumption</td></tr>
  <tr><td>Preparation and finishing</td><td>Minutes, labor rate, USD per successful item</td><td>Actual active time and supplies, not unattended hours</td></tr>
  <tr><td>Failure probability</td><td>Proportion of entire plates lost</td><td>Your own process estimate; not a claimed observed rate</td></tr>
  <tr><td>Order details</td><td>Items/order, fees, packing, shipping and target margin</td><td>Your specific order and payment arrangements</td></tr>
  </tbody></table>
  <h2>2. How are FDM production costs calculated?</h2>
  <div class="math-block">Material per plate = used filament grams × (spool price ÷ net spool grams)<br>Electricity per plate = print hours × (average watts ÷ 1,000) × electricity price per kWh<br>Machine allocation per plate = print hours × (printer price ÷ assumed lifetime hours)<br>Preparation labor per plate = active preparation minutes ÷ 60 × hourly labor rate<br>One-attempt cost = material + electricity + machine allocation + preparation labor<br>Expected successful-plate cost = one-attempt cost ÷ (1 − whole-plate failure probability)<br>Successful-item cost = expected successful-plate cost ÷ usable items per plate + finishing per item</div>
  <p>The full-plate failure model assumes attempts are independent with the same loss on every failed plate. A real failure may happen partway through a print; this simplified estimate can therefore overstate that particular loss. Do not apply an extra failure surcharge to a cost that has already been divided by the success probability.</p>
  <h2>3. Worked production example</h2>
  <table class="compare-table"><thead><tr><th>Calculation</th><th>Illustrative result</th></tr></thead><tbody>
  <tr><td>100 g of a $25/1,000 g spool</td><td>$2.5000 material</td></tr>
  <tr><td>8 h × 120 W × $0.18/kWh</td><td>$0.1728 electricity</td></tr>
  <tr><td>8 h × ($400 ÷ 4,000 h)</td><td>$0.8000 printer allocation</td></tr>
  <tr><td>10 minutes × $15/hour</td><td>$2.5000 preparation labor</td></tr>
  <tr><td>One plate attempt</td><td>$5.9728</td></tr>
  <tr><td>Divide by 0.95 assumed success rate</td><td>$6.2871579 expected successful-plate cost</td></tr>
  <tr><td>One usable print plus $0.50 finishing</td><td><strong>$6.7871579 per item</strong></td></tr>
  </tbody></table>
  <h2>4. How does commercial quote pricing work?</h2>
  <p>A per-order fixed fee is charged once per order, not once per printed object. Customer-paid shipping counts toward gross order revenue; the carrier cost paid by the seller belongs in expenses. The estimator calculates order-level gross revenue first, then the per-item price.</p>
  <div class="math-block">Order expenses = successful-item cost × items sold + packaging per order + seller-paid shipping<br>Required order gross = (order expenses + fixed payment fee) ÷ (1 − percentage payment fee − target margin)<br>Suggested item price = max(0, (required order gross − customer-paid shipping) ÷ items sold)<br>Estimated profit = actual gross order revenue − order expenses − (percentage fees × gross + fixed payment fee)<br>Actual margin = estimated profit ÷ actual gross order revenue, when revenue is positive</div>
  <p>The normal formula requires percentage fees plus target margin to be below 100%. If a customer shipping charge exceeds the necessary gross, the calculator floors the suggested item price at zero; the resulting actual margin may then differ from the target. The result is <strong>estimated profit after included expenses and before income tax</strong>, not complete net business income.</p>
  <h2>5. Worked selling-price example</h2>
  <p>With one successful item at $6.7871579 cost, no shipping or packing, a $0.30 fixed payment fee, an 8% percentage fee and a 30% target margin:</p>
  <div class="math-block">Required customer revenue = ($6.7871579 + $0.30) ÷ (1 − 0.08 − 0.30)<br>= $7.0871579 ÷ 0.62 = $11.4308998 theoretical; charge at least $11.44 if prices must be whole cents<br>Platform fees = ($11.4308998 × 8%) + $0.30 ≈ $1.2145<br>Profit after included expenses ≈ $3.4293, or 30% of gross revenue</div>
  <p>The model keeps full precision; real customer prices use whole cents. Rounding the theoretical quote to the nearest cent can slightly miss the target margin: use the minimum whole-cent checkout price on the live calculator, which rounds up. Summing separately rounded cost components may also differ by a cent. A 30% <em>markup</em> and 30% <em>margin</em> are different formulas; see <a href="/how-to-price-3d-prints/">the pricing guide</a>.</p>
  <h2>6. Dedicated calculators use narrower models</h2>
  <p>The <a href="/filament-cost-calculator/">filament cost calculator</a> computes spool price divided by net grams and multiplies it by the plate’s used grams. For a $25/1,000 g spool, material is $0.025/g and a 100 g plate costs $2.50. It excludes failure, energy, equipment and labor.</p>
  <p>The <a href="/3d-printing-cost-per-hour/">hourly running-cost calculator</a> adds $400 ÷ 4,000 h = $0.10/h for machine allocation and 120/1,000 × $0.18 = $0.0216/h for energy, for a $0.1216/h example before maintenance or labor. Neither result is a market service quote.</p>
  <h2>7. Limitations and verification</h2>
  <p>No slicer, smart meter, printer telemetry, payment gateway or carrier-rate service is connected. STL geometry alone does not determine actual print time, material supports or machine power. The site does not currently support resin print costing, automatic G-code pricing, tax calculations or guaranteed margin after expenses not entered. Electricity rates, marketplace fees and material prices are user inputs, not claims about current vendors.</p>
  <p>The calculation methods can be independently inspected in the public <a href="https://github.com/garrison2025/3D-Printing/blob/main/src/lib/calculations.mjs">FDM calculation source code</a> and <a href="https://github.com/garrison2025/3D-Printing/blob/main/src/lib/seo-calculations.mjs">filament/hourly calculation source code</a>. Our <a href="/about/">About page</a> explains the site's scope, while <a href="/contact/">Contact</a> provides a public issue-reporting channel. These references describe the implementation; they are not independent performance certifications.</p>
  <p>For practical examples, open <a href="/how-much-does-3d-printing-cost/">the 3D print cost guide</a> or <a href="/how-to-price-3d-prints/">the seller pricing guide</a>. All calculations run locally in the browser; see <a href="/privacy/">Privacy</a> for the full storage and hosting disclosure.</p>
</article></div>`;}
