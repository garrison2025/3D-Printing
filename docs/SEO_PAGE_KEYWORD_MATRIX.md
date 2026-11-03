# PrintCost Studio — deployed search intent map (2026-11-03)

## Data provenance
The only keyword metrics used here are from the owner's Semrush US Organic Positions exports (2026-11-02), preserved in `src/content/keyword-intent-map.json`. There are **131 exact keyword strings**: P0 25, P1 62, P2 7, EXCLUDE 37. This is not an exhaustive market inventory. Volume, KD and estimated competitor traffic are third-party estimates, not actual site clicks or promised traffic.

## Primary canonical destinations
| Canonical route | Approved P0/P1 terms | Why this is distinct |
| --- | ---: | --- |
| `/` | 19 | Compute cost of an FDM plate from actual slicer grams/time, power, machine use, labor and failures |
| `/3d-print-pricing-calculator/` | 20 | Quote known finished-item costs, order quantity, fees, shipping and margin without running the production estimator |
| `/filament-cost-calculator/` | 23 | Material-only cost/gram, plate and item; optional second filament |
| `/3d-printing-cost-per-hour/` | 1 | Machine depreciation, average electricity, maintenance and active operator cost per hour |
| `/how-much-does-3d-printing-cost/` | 17 | Informational cost explanation with a worked full-price example |
| `/how-to-price-3d-prints/` | 7 | Seller pricing method and margin versus markup discussion |

The 87 approved P0/P1 strings sum across the rows above as **mapping counts only**, not 87 distinct pages. **Do not sum their search volumes as site traffic forecasts**: variants overlap and may be served by the same SERP.

## Additional live content and completed P2 terms
- `/3d-print-cost-calculator-excel/`: real editable workbook landing page. Two P2 spreadsheet-related terms are mapped here; this does not make them validated P0/P1 opportunities.
- `/calculation-methodology/`: formulas, exclusions and source-code links for credibility and answer retrieval; no invented search volume.
- `/about/`, `/privacy/`, `/contact/`: real supporting content; no mass-produced SEO copy.
- Remaining P2 terms and all EXCLUDE terms are not a mandate to publish new pages. Purchasing-price or model-download intents are outside this calculator's scope.
- `/es/` is a research-only possible future locale. Do not deploy translations without locale-level keyword and SERP evidence.

## Important concrete query evidence (US monthly search estimates / KD)
- `3d print cost calculator` **2,400 / 18** → `/`
- `calculate cost of 3d printing` **1,900 / 18** → `/`
- `3d printing cost calculator` **1,600 / 13** → `/`
- `3d printing price calculator` **880 / 21** → `/3d-print-pricing-calculator/`
- `3d print price calculator` **590 / 20** → `/3d-print-pricing-calculator/`
- `prices for 3d printing` **2,900 / 23** → `/3d-print-pricing-calculator/`
- `filament calculator` **260 / 12** → `/filament-cost-calculator/`
- `how much does 3d printing cost` **1,600 / 19** → informational guide
- `how to price 3d printed items` **170 / 18** → seller guide
- `3d printing cost per hour` **50 / 2** → hourly tool

Numbers above are preserved, not refreshed. The decisive post-launch evidence must come from GSC landing-page impressions, clicks, query data, CTR and indexing diagnostics.

## SEO architecture controls
1. Link prominently to the actual pricing calculator from the home navigation, not only to an explanation of pricing.
2. The seller guide's primary CTA must point to `/3d-print-pricing-calculator/` while its explanatory links can continue pointing to the full FDM tool.
3. Keep one canonical per distinct user task, with readable first-load HTML, direct functional output, unique title/H1, internal links and accurate assumptions.
4. Only index pages when `SITE_URL=https://3dprintcostcalculator.org` and `ENABLE_INDEXING=1` are set in Cloudflare **Production**, and public deployment checks pass.
5. Preserve Pages preview `noindex` headers and redirect the `pages.dev` alias after the official domain is stable.

**2026-11-03 P2 completion:** Seven P2 terms now have real canonical destinations: price-calculator intent → `/3d-print-pricing-calculator/`; calculator-app intent → `/`; two spreadsheet intents → `/3d-print-cost-calculator-excel/`; printing-cost information → `/how-much-does-3d-printing-cost/`; side-by-side printing-cost comparison → the live comparator at `/calculation-methodology/#cost-comparison-tool`; Spanish price intent → `/es/calculadora-precios-impresion-3d/` with a working quote engine and bidirectional hreflang. See `docs/KEYWORD_DEPLOYMENT_TRACEABILITY.md` for all 131 exact mappings. The original P0/P1 count remains 87; mapped P2 increases the total mapped search intents to 94.
