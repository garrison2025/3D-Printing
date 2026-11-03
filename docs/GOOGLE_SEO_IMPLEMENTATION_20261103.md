# Google SEO implementation — 2026-11-03

## Research evidence and scope
- Owner-supplied Semrush US export dated 2026-11-02: 131 unique terms. 25 P0 + 62 P1 = 87 prioritized / actively mapped query terms; 7 P2 and 37 EXCLUDE retained without creating arbitrary landing pages.
- Exactly 20 supplied price, pricing, quote, and selling terms previously mapped to homepage's \`/#pricing\` mode; now mapped to a **distinct functional** \`/3d-print-pricing-calculator/\` page. The source keyword strings, volumes, difficulty, and ranking fields are unchanged.
- The dedicated page solves a **known unit-cost quote**, unlike the existing home tool, which computes production costs from slicer weight/time and hardware inputs.
- This is a content-and-intent mapping exercise, NOT evidence of Google indexing, rankings or a forecast from summing search volumes.

## Implemented
- Separate mobile-friendly, browser-only USD pricing calculator: unit cost, whole order quantity, percentage and fixed payment fees, per-order packaging/design/shipping expense, charged shipping and target margin.
- Validated calculations with upward per-item whole-cent rounding, order revenue, fees, profit and achieved margin; conservative handling of invalid input and no fabricated fee rates.
- 3 distinct illustrative examples / explanatory sections on fees, shipping, margin vs markup, and order quantity, plus content links to cost estimator, filament, hourly cost, pricing guide, methodology and Excel.
- Unique indexable-route candidate with title, description, visible H1, breadcrumbs, JSON-LD WebApplication + BreadcrumbList, crosslinks, canonical and sitemap entry when enabled on the verified owned domain.
- Homepage's illustrative checkout charge fixed to $11.44 (rather than displaying $11.43 theoretical rounding as an actually chargeable amount).
- Zero new runtime dependencies, server processes, tracking, paid APIs or mass-produced keyword pages.
- Existing staging \`noindex,nofollow\`, empty preview sitemap, and exact-domain \`ENABLE_INDEXING=1\` gate remain.

## Technical release prerequisites
- External fetches of \`https://3dprintcostcalculator.org/\`, \`/robots.txt\` and \`/sitemap.xml\` could not be confirmed today. Domain ownership and Cloudflare account DNS binding alone do not establish a serving Pages custom domain.
- In Cloudflare Pages production set \`SITE_URL=https://3dprintcostcalculator.org\`. Enable \`ENABLE_INDEXING=1\` only after checking the domain serves the expected canonical, valid HTTPS, and real page output.
- To avoid Pages alias duplicate content, use Cloudflare Bulk Redirects to 301 the existing \`3d-printing-1r7.pages.dev\` alias to the official origin (preserve path and query), *after* the custom domain is active. Cloudflare official guide: https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/
- Then use Search Console to verify the domain and submit \`https://3dprintcostcalculator.org/sitemap.xml\`; manually inspect key URLs over time. No programmatic GSC submission or indexing is falsely claimed.
- This SEO iteration does not include mailbox reception tests, per explicit owner request.

## Google Search Central guidance used
- Helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Canonical consistency: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Software app structured data (no invented star ratings): https://developers.google.com/search/docs/appearance/structured-data/software-app
- Title link hygiene: https://developers.google.com/search/docs/appearance/title-link
