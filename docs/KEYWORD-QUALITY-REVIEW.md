# 94 mapped keyword intents: independent second-pass review

**Snapshot:** 2026-11-04. **Source:** `src/content/keyword-intent-map.json` (owner-provided Semrush US export dated 2026-11-02); the exact **94-row review** is in `data/keyword-intent-review.csv`.

This is an implementation-and-intent risk review, **not** verified Google rankings, GSC metrics, an observed SERP intent distribution or a claim of indexation.

## Results: do not mistake mapping for optimization

| Provisional assessment | Exact term count | Interpretation |
| --- | ---: | --- |
| IMPLEMENTATION_FIT_UNVERIFIED | 67 | Assigned page's available task broadly fits the query, but per-query SERP and GSC outcomes remain untested |
| INTENT_AMBIGUITY | 16 | Search may be for a third-party print shop quote, broader total cost or a differently scoped product |
| EVIDENCE_GAP | 9 | Search may require sourced current prices or market averages; hypothetical examples alone cannot establish them |
| INTENT_MISMATCH_RISK | 2 | Search may mean printer purchase price or a downloadable standalone app rather than this website |
| **Total** | **94** | All 94 have a page in the current mapping; 27 have a documented review flag |

Research counts remain P0 25 / P1 62 / P2 7 / EXCLUDE 37 (131 original terms, 94 active). **No new landing pages.**

## Existing route allocation (94)

| Route | Mapped queries | User task |
| --- | ---: | --- |
| `/` | 20 | Slice-derived full FDM production costing |
| `/3d-print-pricing-calculator/` | 21 | Seller quote starting from known per-item production cost |
| `/filament-cost-calculator/` | 23 | Filament material cost per gram, per plate and per item |
| `/how-much-does-3d-printing-cost/` | 18 | Formula and worked cost guide |
| `/how-to-price-3d-prints/` | 7 | Seller pricing guide |
| `/3d-printing-cost-per-hour/` | 1 | Hourly machine, power and operator cost |
| `/3d-print-cost-calculator-excel/` | 2 | Editable offline workbook |
| `/calculation-methodology/` | 1 | Explicit side-by-side cost comparison |
| `/es/calculadora-precios-impresion-3d/` | 1 | Actual Spanish quote calculator |

## High-priority verification queue

**1. Service quotes vs seller quoting (search intent).** Terms such as `3d printer printing price` (US estimated volume 3,600, KD 31), `prices for 3d printing` (2,900, KD 23), `price to 3d print` (2,400, KD 19), `3d print quote` and `3d printing service cost` are currently mapped to a seller calculator that requires a **known cost per item**. A searcher wanting a print shop to price an uploaded STL, live regional service rates or real purchasing quotes may not be fully satisfied. Do not imply that the site offers an actual service marketplace, upload-based geometry quote, or verified rates. Check actual SERP before moving terms or editing titles; improve first-screen scope and guide comparison on existing pages if evidence supports it.

**2. Average / current price evidence.** `average cost of 3d printing`, `3d printing average cost`, `how much does 3d printer filament cost`, `how much does filament cost`, `pla cost` and similar terms can ask for **sourced market benchmarks** rather than model calculations. The dated retail example is not a live price feed. Retain per-gram math and dated-source labeling; only make market-wide claims if sourced and comparable.

**3. Potential meaning mismatch.** P2 `3d printer price calculator` could mean hardware purchase pricing; P2 `3d print cost calculator app` could mean an installable mobile or desktop product. Neither should be marked intent-matched merely because the site has a web calculator. Treat both as SERP verification candidates, not instructions to add downloadable applications.

**4. Other scope ambiguity.** `3d printing cost per gram` may mean **full printing cost per gram**, not just filament purchased per gram. `how much to 3d print` may be a buyer-cost query whereas it is mapped to a seller pricing guide. Reassess using GSC page/query evidence and real SERP intent.

## CI evidence and deployment gates

- `node scripts/keyword-audit.mjs` verifies that 94 exact source terms map to existing page/function structures.
- `node scripts/keyword-quality-audit.mjs` now independently enforces a one-to-one review, source Volume/KD consistency, explicit risk labels, and the matching built page's visible static task markers; outputs `qa-seo/keyword-intent-review.md`.
- GitHub Actions uploads `printcost-94-keyword-intent-review` as a test artifact. These checks **do not** certify that Google ranks any term.
- Most recent local and Cloudflare browser checks must be judged from their actual current workflow runs and deployed commit, not an old PASS summary. There is no acceptable basis to assert all 94 are production-verified until current CI/live checks complete.
- GSC queries, clicks, impressions, CTR and indexed-URL evidence **not connected or supplied** as of this report; follow `docs/GSC-ROUND-2-EXECUTION.md` before quantitative optimization. Do not fabricate traffic and do not let hypothetical source volumes masquerade as GSC performance.

## Decision rule

Keep the same high-value pages. Resolve technical CI blockers, then use actual 28-day GSC query+page exports (or the available shorter window) and real SERP review to prioritize one specific improvement per page. **No keyword expansion solely to increase page count.**
