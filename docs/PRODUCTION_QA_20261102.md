# Production quality and rollout checks — November 2, 2026

Scope: GitHub main source and local production-style build for https://3d-printing-1r7.pages.dev.

## Completed locally

- Node computation/config/UI tests: 20/20 PASS.
- Static build and SEO/link audit: 144/144 PASS.
- Chromium browser local self-contained preview at 360, 390, 768, 1024 and 1440px: no detected horizontal overflow and no page-level JavaScript exceptions.
- Chromium 390px: scenario change, grams update, Edit Fees focus, invalid failure rate, Reset to valid example passed.
- Cloudflare main build with no SITE_URL now outputs stable https://3d-printing-1r7.pages.dev canonical, robots allow and index,follow.
- Local preview and CF preview branches stay noindex. 404 page is noindex.
- Contact now links to actual enabled GitHub Issues.

## NOT RUN / not verified

- Remote Cloudflare HTTP status, current deployment SHA, actual server headers and indexing. This runtime could not resolve pages.dev. Use GitHub Actions live audit after deployment.
- Real mobile/desktop Core Web Vitals or Lighthouse scores. Offline responsive browser QA is not Lighthouse.
- Google Search Console property verification or actual indexing.

## Production follow-up

1. Confirm Cloudflare deploy contains latest main commit.
2. Run GitHub Actions "Audit live Cloudflare Pages" manually. Checks six routes, indexability, canonical, sitemap, robots, JS/CSS and 404.
3. In GSC inspect the homepage and two guides, then submit /sitemap.xml after verifying ownership.
4. Once a custom domain is purchased, set SITE_URL to exact HTTPS origin, redeploy, and rerun the live audit before switching canonical.
