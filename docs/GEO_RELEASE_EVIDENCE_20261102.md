# GEO / answer-engine readiness — implementation evidence

Status: Code implemented, prelaunch preview only. No claim of Google AI Overview, AI Mode, ChatGPT, Perplexity or other AI engine citation, rankings, referral traffic or impressions.

## Policy and evidence

- Google Search Central: https://developers.google.com/search/docs/appearance/ai-features
- Google generative AI optimization guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google SoftwareApplication schema: https://developers.google.com/search/docs/appearance/structured-data/software-app
- Engineering standard: https://github.com/chenmu2024/Website-Starter-Standard/blob/main/TRUST-AND-STRUCTURED-DATA-GATE.md

Google's guidance does **not** require an llms.txt, special GEO schema, hidden AI-only pages or arbitrary paragraph chunking. We intentionally did not add those.

## What changed

1. Original human-readable quick answers and worked examples on five task pages, including exclusions and a link to full methodology.
2. `/calculation-methodology/` as an inspectable explanation of true in-code formula behavior, units, cost model, assumptions, simple calculated examples, seller pricing limitations and links to exact repository modules. No fictional market prices, independent certifications or claims of verified savings.
3. Common structured graph IDs: WebSite -> WebPage -> (where applicable) WebApplication and BreadcrumbList. Uses actual page labels, links, free functionality; no fake Organization, Person, aggregateRating, Review, FAQPage rich-result promises or automatic freshness date.
4. Real HTML body text and normal crawlable `<a>` internal links, not JSON-LD-only information. Existing core calculator and 131 keyword research map preserved.
5. Dedicated `tests/geo-content.test.mjs` and static audit checks for visible answers, documented methodology, exact canonical relationships and schema reference consistency.

## Verified locally (2026-11-02)

- 29/29 Node tests passed.
- Preview build static audit: 351 assertions passed. Preview HTML `noindex,nofollow`; sitemap has no loc entries.
- Simulated owner-approved HTTPS custom domain with `ENABLE_INDEXING=1`: static audit 360 assertions passed, index/follow HTML and nine sitemap routes.
- Core calculation modules unchanged.

## Deferred / limitations

- Live `pages.dev` HTTP headers, current build deployment commit, Cloudflare status: NOT VERIFIED here.
- Lighthouse, real Core Web Vitals and mobile-device cross-browser: NOT RUN for this change.
- Search Console indexing, Google generative AI citation metrics, Bing/AI engine referrals: NOT AVAILABLE while intentionally noindex.
- Final domain is unknown; no external search submission, crawl-request or index-activation action was attempted.

## After purchasing a real domain

1. Bind and verify the HTTPS domain, set `SITE_URL=https://REAL_DOMAIN` and `ENABLE_INDEXING=1` on Cloudflare main, rebuild.
2. Verify domain canonical, robots, sitemap, source HTML, relevant schema validity and actual indexability. Keep `pages.dev` preview noindex.
3. Run Google Search Console inspection and monitor organic/AI traffic based on actual available reporting, not a speculative GEO score.
4. Review content changes and pricing formula test cases before publishing; remove or revise unsupported claims rather than adding fake citations.
