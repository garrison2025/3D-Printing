# 2026-11-03 Real domain SEO verification — PrintCost Studio

## Verified account and live website facts

- Owner-provided Cloudflare screenshot: Workers & Pages project **3d-printing**, Custom domains: \`3dprintcostcalculator.org\` **Active**, **SSL enabled**. This is complete; do NOT keep asking owner to bind the domain.
- Independent public website fetch: apex homepage, standalone pricing and filament calculators all serve English HTML with distinct titles, descriptions, correct owned-domain canonicals, and OG metadata.
- Live \`/robots.txt\` serves \`User-agent: *\` and \`Allow: /\`.
- Live \`/sitemap.xml\` is a valid but empty URL set.
- Live HTML of the checked routes advertises \`noindex,nofollow\`.
- Live \`/build-manifest.json\` at the observed deployment is \`indexable:false\`, \`kind:"staging"\`, and \`canonicalOrigin:"https://3dprintcostcalculator.org"\`.
- Live \`https://3d-printing-1r7.pages.dev/\` is still accessible with \`noindex,nofollow\` and official canonical; redirect to apex has not been verified.
- Source-build and real browser CI passed for the last observed revision. CI passing doesn't mean the production domain is indexable.

## Root cause and release path

Cloudflare custom-domain **Active** and SSL-enabled do not switch the static site into index mode. The site generator in \`src/lib/site-config.mjs\` requires \`SITE_URL=https://3dprintcostcalculator.org\` and \`ENABLE_INDEXING=1\` in the **Production** build environment. Only after explicitly enabling release and redeploying \`main\` does the generator output indexable HTML, an 11-URL sitemap, a canonical Sitemap directive in robots.txt, and a manifest with \`indexable:true\`.

Do not simulate production in a local build and claim Google can index the live origin; verify network responses. Keep preview branch/alias protected. Set up Cloudflare Bulk Redirects from \`3d-printing-1r7.pages.dev\` to the owner apex, preserving path/query, after the official origin is stable. The Pages \`_redirects\` file cannot perform hostname-based redirects.

After redeploy, run:

\`node scripts/seo-live-audit.mjs --strict\`

Run GitHub Actions \`Audit live Cloudflare Pages\` with \`site_url=https://3dprintcostcalculator.org\` and \`mode=production\`. When the full live audit is green, verify GSC ownership and submit \`https://3dprintcostcalculator.org/sitemap.xml\`. GSC outcomes are not yet verified.

## Page-level improvements in this revision

- Shortened overlong headings in tool/guide metadata without changing their actual calculation formulas or underlying user-intent targets.
- Removed redundant brand repetition from the About page's title.
- Added a read-only 11-route live SEO audit checking canonicals, titles, descriptions, headers/meta robots, JSON-LD, 404, Sitemap, and Pages alias.
- No fabricated schema reviews, no bulk-generated low-value keyword pages, and no newly paid runtime dependencies.

## Priority order

1. **P0**: Enable indexable production build only on the official domain, then confirm all live 11 route tags plus sitemap.
2. **P0**: Confirm preview hostname cannot be indexed by inspecting its actual HTTP \`X-Robots-Tag\` header, or redirect it permanently to the official domain.
3. **P1**: Verify Google Search Console property and Sitemap submission; record actual impressions and indexing status, not Semrush estimates.
4. **P1**: Refine titles, copy, and page interlinks based on observed query/page performance.
5. **P2**: Publish new dedicated tool pages only where a distinct function, source keyword demand and unique worked examples justify them.

Sources:
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
