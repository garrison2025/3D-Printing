# 3D Printing — keyword intent / user-journey audit

**Input:** user-provided Semrush US Organic Positions export (2026-11-02), with 296 ranking records condensed to 131 unique keyword strings. This is historical third-party estimated data, not current GSC traffic.

| Priority | Terms | Handling |
|---|---:|---|
| P0 | 25 | Main cost calculator / existing selling-price mode |
| P1 | 62 | Cost, pricing, filament, hourly-cost tool or guide |
| P2 | 7 | Retain in research JSON, no speculative landing page |
| EXCLUDE | 37 | Not SEO targets (mostly printer-purchase intent) |

**Important:** Keywords sharing one intent are not separate pages; search volumes must not be summed to project traffic.

### Applied improvements
- The selling-price guide now links directly to `/#pricing`; the homepage selects its existing pricing mode on entry and hash changes. This is a UI state, not an additional indexable URL.
- Filament per-gram amounts display four decimal places (e.g. $0.0250/g), rather than misleading cent rounding to $0.03/g.
- Automated regression checks enforce 131 keyword rows, four priority counts, complete source metrics for P0/P1, valid page destinations, and working pricing deep-link contract.

### Outstanding (do not label complete)
- Confirm Cloudflare is serving the latest main commit; current agent environment cannot directly fetch the site.
- Run real deployed URL and device interaction audits, and Lighthouse when available.
- Validate content quality and query impressions after official domain purchase; do not expose temporary Pages preview for indexing.
- Distinguish generic buyer queries and device purchase-price queries from the cost-of-making-one-print intent.

No new pages, unverified keyword volume, paid APIs, or indexable previews were introduced.
