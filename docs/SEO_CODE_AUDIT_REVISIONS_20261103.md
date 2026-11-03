# 3D Print Cost Calculator — source SEO audit and regression repairs (2026-11-03)

## Scope
Inspected the real static generator (\`scripts/build.mjs\`, \`scripts/seo-pages.mjs\`), JSON-LD, sitemap builder, keyword landing-route mapping, and live SEO validator. The live owned domain is connected; **do not list domain binding as unresolved**.

## Changes made in this revision
1. Fixed a rounding/precision disclosure in the seller pricing guide: the displayed **$6.79** successful-item cost is **$6.7871579** at full precision; the theoretical selling price **$11.4309** uses the full-precision amount, not an already-rounded $6.79.
2. Corrected the Excel template guide's text link to the dedicated \`/3d-print-pricing-calculator/\` tool rather than the old home \`/#pricing\` deep-link. Keep the home integrated pricing mode available because its different workflow starts with detailed print-production inputs.
3. Strengthened static schema checks: one \`WebSite\`, one \`WebPage\`, a single real \`WebApplication\` with free offer on functional tool routes, and a 2-step \`BreadcrumbList\` pointing to real canonical URLs.
4. Strengthened cross-page social metadata QA: \`og:url\` matches each canonical; OG image always uses the owned domain; Twitter card is present.
5. Fixed preview-alias SEO test logic. The old validator followed redirects and could misclassify an eventual legitimate 301 to the owned domain as unsafe. The new helper checks direct HTTP statuses: only **301/308 to the same canonical path** or **200 with HTTP X-Robots-Tag noindex AND matching canonical** is allowed. It checks homepage and filament tool independently.
6. All changes use Node built-ins, do not add runtime analytics/tracking/third-party calls, and do not change production indexing flags.

## Do not confuse the following
- Code-level SEO and pre-release checks may pass while production HTML still advertises \`noindex\`. These are separate signals.
- SEO title length in characters is only a diagnostic; Google snippets truncate dynamically and titles are not guaranteed to be displayed verbatim.
- Search-volume/KD metrics in \`src/content/keyword-intent-map.json\` are the owner-supplied Semrush US snapshot (2026-11-02), not Google Search Console traffic.
- No bulk-generated near-duplicate page creation or invented schema \`AggregateRating\`/\`Review\`.

## Key references
- Cloudflare absolute-URL \`_headers\` and \`:version\` placeholder syntax: https://developers.cloudflare.com/pages/configuration/headers/
- Cloudflare Pages to owned domain redirects: https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/
- Google breadcrumb markup: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb

## Cross-check added: sitemap ↔ validators ↔ keyword route registry
A regression test now compares all 11 routes found in the site builder's sitemap, static generated-HTML SEO audit, and real hosted-domain SEO audit. This prevents the common issue where a new useful page is generated but silently absent from the sitemap or from technical inspection. It also requires every imported P0/P1 keyword destination to be a real published route and locks in both Cloudflare preview-alias noindex host rules.

The original 131 keyword records and estimated US search metrics are not changed. This test is a code consistency guarantee, not evidence of organic rankings or indexing.

## Independent standard auditor now part of every quality run

The project's original spec explicitly requires running `Website-Starter-Standard/tools/seo_audit.py`. CI now checks out **the public standard repository at pinned commit `e633805e57e18d4a11cc65966739de886f5a2b87`** and runs that unmodified script against the locally generated **production-indexable simulation** under the real owned origin.

Command: `python3 _site-standard/tools/seo_audit.py --site-dir dist --base-url https://3dprintcostcalculator.org --output qa-seo/standard-audit.json --fail-on error`

The detailed JSON artifact is retained for 14 days in GitHub Actions. Warnings (such as intentionally noindexed 404s or known download links that the generic scanner categorizes as HTML links) are reviewed rather than equated to Google's ranking rules; `error` findings fail the job. This step **does not** claim the Cloudflare production environment has indexing enabled, nor that Search Console has indexed the pages.
