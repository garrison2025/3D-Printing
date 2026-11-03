# SEO / GEO implementation brief — PrintCost Studio

US-English site for FDM/FFF printing cost and selling-price estimates. This is an unmonetized SEO opportunity, **not** evidence of search traffic, ad income or rankings. Original 2026-11-02 user Semrush evidence: 131 exact deduplicated queries in `src/content/keyword-intent-map.json` (P0 25, P1 62, P2 7, EXCLUDE 37), with their supplied metrics intact.

## Distinct page-to-intent map

- `/`: main FDM cost estimator, pricing/filament UI modes, expandable distinct-model mixed-order tool (one canonical URL).
- `/filament-cost-calculator/`: working one/two-material cost tool.
- `/3d-printing-cost-per-hour/`: working power, depreciation and maintenance hourly calculator.
- `/how-much-does-3d-printing-cost/`: cost guide, transparent reproducible worked example.
- `/how-to-price-3d-prints/`: seller margin, markup, shipping and fees guide.
- `/calculation-methodology/`: explicit formulas, assumptions and linked source.
- `/3d-print-cost-calculator-excel/`: formula workbook, instructions and real P2 Excel/spreadsheet query intent (no mass page generation).
- `/about/`, `/privacy/`, `/contact/`: genuine support and trust information, not keyword pages.

No thin pages for synonyms, unsupported STL slicing, resin mode, speculative brands, or excluded buying-intent keywords. Do not sum all search volumes to predict visits. No fabricated Organization, authors, reviews, ranking, testimonials or rich-result promises.

## Publication boundary

Current preview: `https://3d-printing-1r7.pages.dev/`; page-level and HTTP `noindex,nofollow`; no staging sitemap URLs. The preview is **not** a production launch. Official owner-approved custom domain required before configuring `SITE_URL=https://<verified-domain>` and `ENABLE_INDEXING=1`, redeploying and checking canonical, host-specific preview noindex, robots and sitemap. Then verify domain in Google Search Console; SEO and actual GSC data cannot be assessed beforehand.

Web tool performs all calculations locally. User controls whether browser inputs are retained via an explicit opt-out; Reset clears remembered input values. Normal hosting requests still expose standard HTTP request metadata. Privacy and consent disclosures must be reviewed before any future advertising/analytics integrations. Browser and Lighthouse CI are lab tests; no measured field Web Vitals or revenue are claimed.
