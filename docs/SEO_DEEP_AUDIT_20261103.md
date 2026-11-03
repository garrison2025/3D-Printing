# SEO deep audit — PrintCost Studio — 2026-11-03

## Scope and evidence
Live crawl of `https://3dprintcostcalculator.org/` and 11 other published HTML routes. Reviewed `scripts/build.mjs`, `scripts/seo-pages.mjs`, `src/content/keyword-intent-map.json`, structured-data graph builder, site configuration, sitemap, robots, test workflows and GitHub CI. Cross-checked Google Search Central and two official slicer product guides. 131 historical competitor keywords from the owner-supplied Semrush US export dated 2026-11-02 remain a **snapshot**, not this site's search performance.

## What passed
- 12/12 live canonical URLs returned HTML and `index,follow` with unique titles and descriptions; owner canonical matched every URL.
- Public build manifest shows `indexable:true`, `kind:production`.
- Sitemap publishes 12 unique canonical pages and robots.txt links to it.
- Pages preview hosts use the HTTP `X-Robots-Tag: noindex` guard; the hosted acceptance test validated this.
- True unknown page returns HTTP 404 in hosted audit.
- Latest successful production workflow 41606565255 passed 124/124 HTTP+SEO, 9/9 independent quote/Excel/print acceptance and lab Lighthouse 100/100 mobile/desktop. These are CI/lab results, **not** field INP or Google indexing.
- 87 prioritized P0/P1 terms are mapped to existing routes. The remaining 44 historical records include P2 and deliberately excluded terms. These counts do not imply 87 separately valuable pages.

## Important gaps and recommendations
| Priority | Finding | Status |
|---|---|---|
| P0 (external dependency) | Actual Google Search Console ownership, Sitemap acceptance, inspected indexed/nonindexed URLs, clicks and query CTR have not been verified. | Owner action or connect supported account |
| P1 | Three key tools rely heavily on brief examples and lack explicit "where to get grams/time" help. | Fixed in this commit with official PrusaSlicer / UltiMaker references and practical plate-level guidance |
| P1 | About, Privacy, Terms and Contact descriptions repeat generic boilerplate. | Fixed with accurately differentiated descriptions |
| P1 | New domain has not demonstrated independent references/backlinks or actual query impressions. Keyword mapping alone is not ranking evidence. | Growth measurement and genuine outreach |
| P1 | Homepage integrated pricing mode and separate known-cost pricing page both discuss pricing. Distinct inputs justify two pages, but review Google Search Console queries for possible cannibalization. | Monitor |
| P2 | `https://www.3dprintcostcalculator.org/` could not be resolved by the tested browser fetcher; the non-www owned domain is fine. Add a canonical redirect only if the owner wants to accept the www variant. | Optional account-level Cloudflare setting |
| P2 | Some commercial-intent keywords such as `price to 3d print` can mean "price from a slicer file", while the standalone quote tool requires a known cost. | Validate actual SERP and GSC intent; don't promise file-to-price conversion without real parsing |
| P2 | Software-app structured data has real `name` and `offers.price:0` but no verified user review/aggregateRating; Google says one of those is necessary for its software app rich result eligibility. | Do not fabricate ratings |
| Not needed | Auto-refresh dates, speculative FAQ spam, automatic translations, large numbers of variant URLs, stuffed meta keywords, artificial `sameAs` social accounts. | Avoid |

## Corrective changes in this commit
1. Added a practical, sourced homepage guide on reading total plate grams and printing time from actual slicer previews, including support-material counts and per-plate division.
2. Added narrower, task-specific source-backed help on the filament-cost and printer-hour tool pages.
3. Rewrote four generic trust-page Meta Descriptions to reflect actual content. No owner identity or qualifications were invented.
4. Added focused source regression tests. No API, paid service, additional indexable URL or extra external script introduced.

## Verified external references
- https://developers.google.com/search/docs/essentials
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/structured-data/software-app
- https://help.prusa3d.com/article/first-print-with-prusaslicer-3-0-0_1079761
- https://help.prusa3d.com/article/faq-prusaslicer_1789
- https://support.ultimaker.com/articles/Knowledge/000003132

## Validation follow-ups
1. Re-run Code, math and SEO quality and live Cloudflare Pages audit on the exact commit, not an older commit.
2. In Google Search Console, verify domain property, submit `https://3dprintcostcalculator.org/sitemap.xml`, inspect core tool routes, and review observed indexing/CTR/per-page queries in 7/14/28 days. Only real GSC data can answer "which terms Google shows us for".
3. After initial 2–4 weeks of indexed data, refine the titles and intent split; do not rewrite every title merely to satisfy fixed-length plugin heuristics.
