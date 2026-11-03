# November 3, 2026 implementation improvements — staged before domain purchase

- Kept owner-approved static Cloudflare Pages architecture, US-English single canonical intent groups and `noindex` preview behavior.
- Customer-facing quotes now use the minimum whole-cent price that preserves the selected margin, with checkout revenues, fees and profit computed from the same amount.
- Editable Excel files are hardened to use `ROUNDUP(...,2)` in the unit-price formula (and quote-quantity comparisons); full-precision required gross remains available for audits.
- Main calculator and matching offline Excel formulas now have dedicated optional inputs for maintenance reserve per printer-hour and CAD/design overhead per order, separate from machine purchase allocation and packing costs.
- Five CSS source layers remain editable in original order but are shipped as a single `site-bundle.css`; browser and offline page use the same cascade.
- Keyword checks now require real, visible formula/tool/guide evidence on each of the five distinct intent pages. This does not establish SERP rankings.
- Source/CI syntax validation added. Live device/browser, accessibility, Lighthouse and deployed Git SHA are required release evidence.

Still intentionally deferred: multi-model order quote, STL slicing, resin mode, market-rate APIs, final domain/indexing, advertising and external analytics. Do not invent separate SEO landing pages to target those terms.
