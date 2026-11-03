# PrintCost Studio — owned-domain Google SEO release checklist (2026-11-03)

Official domain: https://3dprintcostcalculator.org/
GitHub: https://github.com/garrison2025/3D-Printing
Cloudflare Pages preview alias: https://3d-printing-1r7.pages.dev/

## Status that has actually been observed
A GitHub-hosted public-network domain probe on 2026-11-03 returned HTTPS 200, an owner-domain canonical, and a live build manifest. The same probe observed `noindex,nofollow`, an empty Sitemap and `indexable:false`. **The owner domain being deployed is not equivalent to enabling Google indexing.** We cannot claim that Search Console has verified ownership or indexed anything. Mailbox delivery is outside this SEO gate.

## Steps in Cloudflare Pages — required before Google submission
1. In **Workers & Pages → 3d-printing-1r7 → Custom domains**, ensure `3dprintcostcalculator.org` is connected and serving the correct project.
2. In **Settings → Environment variables → Production**, explicitly set:
   `SITE_URL=https://3dprintcostcalculator.org`
   `ENABLE_INDEXING=1`
   Do this **only when you intend to publish indexable content**. Staging/preview should remain `noindex`. Save and redeploy the `main` branch. An accidental `pages.dev` SITE_URL does not pass the index gate.
3. On the owned domain inspect `/`, `/3d-print-pricing-calculator/`, `/filament-cost-calculator/`, `/robots.txt`, `/sitemap.xml`, and `/build-manifest.json`. Expect: HTTP 200, correct official canonical, HTML `index,follow`, no `X-Robots-Tag: noindex`, sitemap with **11 owned-domain routes**, and manifest `indexable:true`.
4. GitHub Actions → **Audit live Cloudflare Pages** → Run workflow → `site_url=https://3dprintcostcalculator.org`, `mode=production`. An audit of `pages.dev` in production mode is intentionally refused. Check the output logs rather than treating build simulation as a live pass.
5. Configure a 301 redirect from `https://3d-printing-1r7.pages.dev/*` to `https://3dprintcostcalculator.org/*`. Cloudflare's documented approach is **Bulk Redirects** (preserve query string, preserve path suffix, subpath matching). This is an account-level configuration; the site's static `_redirects` file cannot match by hostname. Confirm `www`, if configured, permanently redirects to the apex and that there are no loops.

## Google Search Console
1. Open https://search.google.com/search-console and verify the domain property `3dprintcostcalculator.org` using DNS verification. Do not claim this was done without an actual Console state.
2. Under **Sitemaps**, submit `https://3dprintcostcalculator.org/sitemap.xml` once, after the production audit passes.
3. Use **URL Inspection** on the homepage and the core pricing, filament and hourly pages; check user-declared canonical versus Google-selected canonical, crawling/indexability, renderability and live test. Request indexing for the most important unique URLs if necessary.
4. Over the following 7/14/28 days, record *observed* per-page clicks, impressions, CTR, average position, indexed/not indexed diagnostics, and top queries. Compare GSC data separately with the 2026-11-02 Semrush query snapshot; never call projected search volume actual website traffic.
5. Prioritize content changes based on genuine impressions and intent gaps, not bulk-generated pages or copied competitor copy.

## SEO QA release gates
- All 11 published HTML pages have a single appropriate H1, original content or real tool, unique title/description and correct canonical.
- All key topic clusters point to the right single canonical, including the new `/3d-print-pricing-calculator/` page.
- No fabricated `Review`, `AggregateRating`, `Organization`, fast-changing third-party prices, or unsupported promises of revenue.
- Mobile navigation reaches the tools, all calculators actually work, first-load HTML contains crawlable links and explanatory content.
- A true 404 is returned for unknown paths.
- No indexing activation is performed solely by a documentation or code audit.

## Sources
- Google crawl/indexing: https://developers.google.com/search/docs/crawling-indexing
- Google sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google recrawl: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Cloudflare domain-level redirects: https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/
- Cloudflare Pages headers: https://developers.cloudflare.com/pages/configuration/headers/
