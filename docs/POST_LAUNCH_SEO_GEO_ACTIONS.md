# PrintCost Studio — remaining account-level SEO / GEO actions

Official canonical: https://3dprintcostcalculator.org/ . The custom domain is already active, HTTPS works, and the owned-host release is indexable. Do not rebind it.

## Cloudflare redirect consistency (account-level; not completed in GitHub)

- www: Cloudflare dashboard → Bulk Redirects; create 301 for `www.3dprintcostcalculator.org` to `https://3dprintcostcalculator.org`. Enable `Subpath matching`, `Preserve path suffix`, `Preserve query string`; ensure a proxied DNS `A` record for `www` using Cloudflare's documented dummy `192.0.2.1` only for the redirect hostname.
- Pages alias: Bulk Redirect `3d-printing-1r7.pages.dev` → `https://3dprintcostcalculator.org`, status 301, preserving path/query. Current preview host is HTTP noindex with the correct canonical, which already prevents duplicate indexing, so a 301 is a consolidation improvement rather than a critical bug.
- After rules are active, check real HTTP status/Location for `www` and `pages.dev` homepage and deeper paths. Do not infer host redirects from a Pages `_redirects` file; hostname redirects are not supported there.
- Official instructions: https://developers.cloudflare.com/pages/how-to/www-redirect/ and https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/ .

## Google Search Console (requires real domain-property access)

- Verify Search Console domain property; submit `https://3dprintcostcalculator.org/sitemap.xml`.
- Use URL Inspection on the homepage, pricing, filament, hourly and informational guides. Record Google-selected canonical and indexed/nonindexed reasons, not only site-declared `index,follow`.
- Export Search Results → Pages CSV by a recorded 7/14/28-day period. Run `node scripts/gsc-opportunity-report.mjs --pages pages.csv` to prioritize by real impressions/CTR. Joint page-query reports are needed to support any keyword-overlap claim.
- Do not publish or commit private GSC files to this public repository.

## Genuine, not manufactured, offsite citations

- The public method is now reproducible at https://3dprintcostcalculator.org/calculation-methodology/ and the open source implementation is at https://github.com/garrison2025/3D-Printing.
- Prepare accurate descriptions for 3D printing communities/tools directories only where their editorial rules permit useful free calculator links. No paid placements, link exchanges, automated forum spam, or claims of a published backlink before a link is visible.
- If a community member shares one of the example calculations, include the user-specific inputs and link the methodology rather than stating a universal filament cost.

## AI crawler and result visibility

- The production `robots.txt` uses `User-agent: *` with `Allow: /`. A static rule does not guarantee that a platform will crawl, index, cite or rank the website; Cloudflare bot controls and actual server responses must also permit access.
- Google Search Central explicitly says no special `llms.txt` or AI-only markup is required for AI Overviews/AI Mode. The optional existing `llms.txt` is descriptive, not evidence of inclusion.
- Existing known facts, visible calculations, real citations, internal links and structured data should remain consistent. No fabricated publisher credentials, reviews, prices or update timestamps.

## Completion status

| Item | Status | Evidence |
|---|---|---|
| Real tools, indexability, canonicals and 12-URL sitemap | Done | Hosted SEO checks |
| Clear cost-versus-quote intent, public methods and publishing-brand attribution | In GitHub; deploy/CI verification needed | 2026-11-03 changes |
| GSC property, index coverage, genuine clicks and query impressions | Not verified | Requires Search Console authorization/data |
| WWW / pages.dev 301 redirect | Not changed | Requires Cloudflare account-level Bulk Redirect configuration |
| Third-party backlinks / external AI citations | Not verified | Requires independently observable placements |

Google guidance: https://developers.google.com/search/docs/appearance/ai-features
