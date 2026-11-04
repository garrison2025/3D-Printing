# GSC round 2: Pricing, Filament and Cost Guide (evidence gate)

Updated: 2026-11-04. This is an **execution protocol**, not a report of Google Search Console results. No Search Console click, ranking, impression, query or indexed-URL data has been supplied or imported. Do not substitute Semrush competitor estimates for GSC performance.

## Frozen scope

Keep the 2026-11-02 Semrush US snapshot and the 131-keyword research matrix intact: 25 P0, 62 P1, seven P2, 37 excluded. **94 mapped source queries do not mean 94 indexable URLs** and do not imply traffic. The production sitemap currently contains 13 task-distinct routes; this round creates **no new SEO landing pages**.

| Landing page | Existing source phrases to review in GSC, not keywords to repeat mechanically | Task to protect |
| --- | --- | --- |
| `/3d-print-pricing-calculator/` | `prices for 3d printing` (US Vol 2,900, KD 23), `price to 3d print` (2,400, 19), `3d printing price calculator` (880, 21), `3d print price calculator` (590, 20) | A known-cost seller quote, correct margin/fees and whole-cent pricing; live quantity comparison |
| `/filament-cost-calculator/` | `filament cost calculator` (320, 28), `filament calculator` (260, 12), `3d filament calculator` (170, 9), `pla cost per gram` (110, 12), `how much does 3d printer filament cost` (480, 6) | Material-only cost/gram and plate, dual materials and an **alternative-purchase** comparison |
| `/how-much-does-3d-printing-cost/` | `cost of printing 3d` (2,400, 21), `how much does 3d printing cost` (1,600, 19), `how much does it cost to 3d print` (880, 21), `how much does a 3d print cost` (720, 28) | Explain input assumptions, show reproducible finished-item cost and failure sensitivity |

All search volumes and KD above are **2026-11-02 competitor-research estimates**, never traffic/ranking evidence for this website.

## Required real Search Console evidence

1. Verify ownership of the final indexed domain; ensure URLs are individually eligible and check **Pages** indexing, sitemap processing, canonical selection and any manual actions. Fetching a valid URL with `index,follow` is **not** proof of indexing.
2. Under **Performance > Search results**, select Search type **Web**, country **United States**, and record the exact start/end dates and timezone. Use the last complete 28-day window once enough data exists; for a new domain, record the smaller available window truthfully.
3. For each of the three precise landing-page URLs, apply a **Page = exact URL** filter, then export its **Queries** table with query, clicks, impressions, CTR and average position; retain the full unmodified CSV. Record page-level totals separately because anonymized queries can make the sum of displayed query rows smaller than page totals.
4. Save an unfiltered Pages export too, and a second equal-length comparison window only when available. Keep all GSC exports private, local and separate from the public keyword map.
5. Do not call zero impressions a ranking failure: distinguish not indexed, no visible impressions, mismatched page intent and data not yet available.

## Decision logic for the next edit

- **Indexing before CTR:** fix wrong canonical/noindex/crawl/404/duplicate page selection before rewriting titles.
- **Impressions but weak clicks:** inspect exact query intent, snippet, title/H1 alignment and SERP appearance; compare pages in **similar position bands** rather than using one universal CTR target. Avoid clickbait titles promising live prices or service quotations that the site cannot give.
- **Position ~8–20 with meaningful real impressions:** strengthen the same page's explanatory example, first-screen task completion and internal anchors based on that query. "Meaningful" must be based on observed impressions and sampling uncertainty, not invented thresholds.
- **Wrong landing page showing for a known query:** refine internal anchor text and differentiate **known-cost price**, **filament-only cost**, and **full print cost**. Do not instantly split near-synonym terms into new pages.
- **No GSC evidence or very short baseline:** do not pretend an SEO intervention worked. Check real indexability and wait for a comparable query/page sample.

## Change tracking

For every modification record: source CSV filenames, page URL, exact query, clicks/impressions/CTR/position, GSC window, suspected mismatch, concrete on-page edit, deployed commit, next comparable observation window, and whether the change also passed functional/mathematical/browser QA. Prefer one focused edit per page per observation period.

### Current gate status

- Existing source query mapping: **94 active P0/P1/P2** / 37 excluded; verification by repository keyword audit, not GSC.
- Pricing, Filament and Cost Guide content/function improvements: committed to repository; CI, Cloudflare deployment and live browser checks must be inspected independently.
- Google index coverage and GSC query performance: **NOT VERIFIED — no GSC export available in this task**.
