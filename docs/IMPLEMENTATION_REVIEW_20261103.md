# November 3, 2026 implementation improvements — staged before domain purchase

- Kept owner-approved static Cloudflare Pages architecture, US-English single canonical intent groups and `noindex` preview behavior.
- Customer-facing quotes now use the minimum whole-cent price that preserves the selected margin, with checkout revenues, fees and profit computed from the same amount.
- Editable Excel files are hardened to use `ROUNDUP(...,2)` in the unit-price formula (and quote-quantity comparisons); full-precision required gross remains available for audits.
- Main calculator and matching offline Excel formulas now have dedicated optional inputs for maintenance reserve per printer-hour and CAD/design overhead per order, separate from machine purchase allocation and packing costs.
- Five CSS source layers remain editable in original order but are shipped as a single `site-bundle.css`; browser and offline page use the same cascade.
- Keyword checks now require real, visible formula/tool/guide evidence on each of the five distinct intent pages. This does not establish SERP rankings.
- Source/CI syntax validation added. Live device/browser, accessibility, Lighthouse and deployed Git SHA are required release evidence.

A new genuine Excel resource page addresses two source P2 download/spreadsheet searches. Metrics are unchanged (US 70/KD18 and US 50/KD21); public SERP review was conducted 2026-11-03, without treating rankings as guaranteed.

A separate, non-indexable mixed-part quote panel on the homepage handles distinct models through manual cost-per-part and quantity entries, shared order fees and a cent-safe order subtotal. It is not a slicer and deliberately does not allocate prices per SKU. Mixed-order CSV is separate from the single-model Excel sheet.

Still intentionally deferred: STL slicing, resin mode, market-rate APIs, final domain/indexing, advertising and external analytics. Do not invent separate SEO landing pages to target those terms.

- Build no longer rewrites committed SEO/GEO brief, preventing documentation drift. Added Twitter Card and image dimensions with SVG social-preview fallback; PNG preview conversion remains optional.

- Narrow 320px viewport overflow was independently reproduced and traced to the redundant home navigation link beside the home-branded logo; limited display override keeps task links visible. Checkout and theoretical profit-over-cost ratios are explicitly separated in single-quote CSV.

- Converted existing in-repo 1200×630 SVG sharing artwork to a real static PNG using a one-time free CI conversion; both Open Graph and Twitter metadata now publish the PNG, with SVG retained for fallback. Cross-platform social crawler preview acceptance is distinct from image endpoint/meta checks.

- V2 UI motion polish (2026-11-03): native JS/CSS sliding active-mode indicator, small focused quote transitions for changed values, persistent 6-row cost breakdown highlighting the dominant cost, lightweight accordion/open and scroll-reveal animations that do not hide indexable content by default, and mobile focus-sticky moderation. Respect reduced-motion and print. New Chrome/WebKit UI regression checks are required before claiming the release validated.

- V2.1 UI interaction closeout: selecting Cost/Price/Filament modes no longer implicitly opens/closes the user's advanced panels; Edit fees and field-validation still open the necessary panel explicitly. Mobile focus preserves the summary's sticky layout geometry, with delayed blur handling across adjacent inputs. Uniform CSS reduced-motion also covers hover transforms, smooth scrolling and entry effects. Subtle inline success/error feedback clarifies download initiation vs completed local save. Removed contradictory mobile position declarations and the obsolete, hidden-until-scrolled CSS layer. Current Chrome/WebKit acceptance gates specifically exercise these behaviors. The preview remains noindex.
