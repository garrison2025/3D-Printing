# PrintCost Studio — 3D Printing Cost & Pricing Tools

A complete **zero-dependency, static** English-first 3D printing cost and pricing website with a real Spanish-language pricing calculator, implemented from the owner's November 2, 2026 V1.1 plan. All calculation logic runs in the browser; no database, login, payment, paid APIs, or hosted runtime is needed.

**New P2 tools:** [Interactive FDM cost comparison](https://3dprintcostcalculator.org/calculation-methodology/#cost-comparison-tool) · [Calculadora de precios de impresión 3D](https://3dprintcostcalculator.org/es/calculadora-precios-impresion-3d/) (español). All seven original P2 terms now map to functional pages or genuinely relevant existing content, without mass-producing duplicate keyword pages.

**Official calculators:** [FDM production cost](https://3dprintcostcalculator.org/) · [Known-cost selling price](https://3dprintcostcalculator.org/3d-print-pricing-calculator/) · [Filament per gram](https://3dprintcostcalculator.org/filament-cost-calculator/) · [Machine hour](https://3dprintcostcalculator.org/3d-printing-cost-per-hour/) · [Free Excel template](https://3dprintcostcalculator.org/3d-print-cost-calculator-excel/).

**Reproducible methodology and attribution:** [Inputs, formulas, assumptions and how to cite](https://3dprintcostcalculator.org/calculation-methodology/). PrintCost Studio is the first-party publishing brand, not a claim of independent laboratory validation or manufacturer affiliation.

**Original GEO-ready comparisons:** [Failure-rate sensitivity](https://3dprintcostcalculator.org/calculation-methodology/#scenario-failure) · [One vs ten item orders](https://3dprintcostcalculator.org/calculation-methodology/#scenario-order) · [Four vs eight print hours](https://3dprintcostcalculator.org/calculation-methodology/#scenario-hours) · [Margin vs markup](https://3dprintcostcalculator.org/calculation-methodology/#scenario-margin). All outcomes come from this repository's real formulas under explicitly hypothetical inputs, not a market survey.

**AI search verification:** [Cloudflare AI Crawl Control and evidence-based visibility checklist](docs/GEO_AI_CRAWL_AND_VISIBILITY.md) · [25 unmeasured search prompts](data/geo-visibility-template.csv) · Run `node scripts/geo-visibility-report.mjs data/geo-visibility-template.csv` for a truthful offline report. No AI citation or crawl allow-list status is claimed without actual provider evidence.

## Run it

Requires Node.js 20+ only; **no npm install required**.

```bash
npm test
npm run build
npm run preview
```

Open `http://localhost:4173/`. Windows alternative: `py -m http.server 4173 --directory dist`.

### Cloudflare Pages build settings

- Framework preset: **None (static site)**
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable `SITE_URL`: `https://3dprintcostcalculator.org` for the verified production Pages branch. This variable controls canonical, JSON-LD, OG and sitemap URLs.
- No database, API keys, secrets, backend functions, redirects, or additional runtime services.

**Official production:** [3dprintcostcalculator.org](https://3dprintcostcalculator.org/) is HTTPS-enabled and publishes 13 canonical, indexable site pages. The old Pages alias stays HTTP `noindex`. This is search-engine eligibility, not proof of Google indexing or GSC clicks. Mailbox delivery has not been tested; `PAUSE_INDEXING=1` can pause the live indexable build.

**Deviation from recommended stack:** the owner spec recommends Astro, but npm registry access was unavailable in the execution environment. To provide an actually runnable, verified build rather than untested Astro source, this implementation uses a zero-dependency Node static generator. The output still has pre-rendered HTML, correct internal links, a client-only computation module, mobile CSS, and Cloudflare Pages compatibility. Replacing the build generator with Astro later is optional, not required for SEO.

## Routes

- `/` — the complete FDM cost/pricing/filament calculator; one canonical tool page
- `/how-much-does-3d-printing-cost/` — unique explanatory cost guide
- `/how-to-price-3d-prints/` — unique seller pricing guide
- `/3d-print-pricing-calculator/` — independent known-unit-cost calculator for customer quote, quantity, fees, shipping and margin
- `/filament-cost-calculator/` — real per-gram/material cost tool
- `/3d-printing-cost-per-hour/` — real per-hour electricity and machine allocation tool
- `/calculation-methodology/` — transparent formula reference, assumptions and inspectable source links
- `/3d-print-cost-calculator-excel/` — distinct editable offline XLSX download and usage guide (two source P2 intents)
- `/about/`, `/privacy/`, `/terms/`, `/contact/` — site support and truthful policies

No generated near-duplicate landing pages. The new pricing calculator covers 20 existing price/quote keyword intents while the homepage retains distinct slicer-based FDM production cost estimation. Search-intent assignments for 131 exact US keyword strings, including source metrics and competitor ranking fields, are in `src/content/keyword-intent-map.json` and described in `docs/RESEARCH-HANDOFF.md`.

**94-phrase quality audit:** [Exact per-query assessment (CSV)](data/keyword-intent-review.csv) · [Editorial risk queue](docs/KEYWORD-QUALITY-REVIEW.md) · [GSC round-two protocol](docs/GSC-ROUND-2-EXECUTION.md). The review distinguishes 67 provisional fits, 16 ambiguous queries, nine evidence gaps and two potential intent mismatches. It is a static implementation review, **not** proof of rankings or GSC traffic. Run `node scripts/keyword-quality-audit.mjs` after `npm run build` to generate the independent CI review report. Real, private page-filtered GSC CSVs can be compared without an API using `node scripts/gsc-query-review.mjs` (see GSC protocol).

## Product details

The form supports: spool price/net weight, slicer material usage, print time, items per plate, electricity, printer useful-life allocation, optional maintenance reserve per print hour, active preparation labor, conservative whole-plate failures, per-unit finishing, units per order, packaging and a separate optional design/one-time overhead per order, shipping expense, customer-paid shipping, fixed per-order fees, percentage fees and target margin.

Result: cost per successful item, whole-cent checkout selling price, full order gross, included order fees, estimated pre-income-tax order profit, filament cost per gram, hourly machine wear and transparent cost breakdown. An optional mixed-part order panel accepts cost and quantity per distinct model and exports a separate order-level CSV, without inventing individual selling prices. Copy summary, CSV export, print/PDF and localStorage remember/reset are wired.

No STL/G-code accuracy claims, no invented testimonials, no paid subscriptions, no code copied from competitor sites.

## Verification

- `npm test`: mathematical, quote, prelaunch indexability, UI and GEO explanation checks; see current CI for test counts.
- `node scripts/audit.mjs`: checks generated routes, unique titles/H1, canonicals, internal links, static FAQ/guide copy, structured data, sitemap and privacy controls.
- `docs/BUILD-STATUS.md` and `docs/GEO_RELEASE_EVIDENCE_20261102.md`: actual checks versus unverified live SEO and AI search results.

**The custom domain and production indexing release are live and verified.** GitHub Issues is a public support route, but owner/contact/legal details and real-domain verification remain release gates. No AI-search citation or GSC results have been claimed.

### Editable Excel calculator template

A downloadable genuine `.xlsx` workbook is generated from the audited template in `src/downloads/3d-print-cost-calculator-template.xlsx` and copied to `/assets/3d-print-cost-calculator-template.xlsx` during `npm run build`. It includes **Cost Calculator** (22 editable inputs and live formulas), **Batch Quotes** (quantities 1/5/10/25 and current quantity), and **Read Me**. Defaults reproduce the main website formula, including whole-plate failure probability, per-order fees, margin, shipping and zero-floor behavior. Unlike an exported CSV, changing input cells automatically recalculates results in Excel. Checkout unit prices use Excel `ROUNDUP(...,2)` so a real two-decimal charge does not accidentally fall below the target margin.

This optional static download contains **sample inputs**, not the user's current browser calculation. It does not upload orders or use a paid API. This serves both approved P2 Excel/spreadsheet search intents without generating a duplicate SEO landing page. Staging remains `noindex`.

## Source documentation protection

`npm run build` writes only generated `dist` files and the untracked offline preview. It does not overwrite the tracked `docs/SEO-GEO-PROJECT-BRIEF.md`. Share metadata uses a real 1200×630 OG PNG and Twitter Card fields.
