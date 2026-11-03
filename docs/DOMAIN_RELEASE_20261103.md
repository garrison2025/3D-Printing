# PrintCost Studio — production domain and contact, 2026-11-03

## Owner-supplied verified facts
- Purchased domain: `3dprintcostcalculator.org`
- Intended primary HTTPS origin: `https://3dprintcostcalculator.org` (no `www`)
- Owner-provided contact address: `contact@3dprintcostcalculator.org`
- Owner reports the domain is connected to Cloudflare.
- GitHub source: `https://github.com/garrison2025/3D-Printing`
- Cloudflare Pages preview: `https://3d-printing-1r7.pages.dev/`

**Verified by GitHub-hosted public-network probe (2026-11-03):** DNS answers for the owned apex; HTTPS GET / returns HTTP 200; official origin advertises the owned-domain canonical and a deployment manifest for commit `b3ab130`. This is evidence of live site content, not a Cloudflare dashboard **Active** screenshot.
**Not verified or not required for SEO release:** mailbox sending/receiving. Cloudflare may obfuscate `mailto:` in public source HTML; the visibility check decodes the protected address rather than testing email transport.

## Current code release guard
- Canonicals, OG/Twitter URLs, WebPage/WebApplication/Breadcrumb schema, robots and XML sitemap use build-time `SITE_URL`.
- The published contact/privacy/about links now expose the owner-provided email using `mailto:`. GitHub public issue tracker remains as an alternative.
- `src/lib/site-config.mjs` refuses indexing for any URL other than the **exact** apex `https://3dprintcostcalculator.org`, for Pages preview branches, or without explicit `ENABLE_INDEXING=1`.
- A staging build has noindex HTML/HTTP headers and an empty sitemap.
- The local production **simulation** can test indexable HTML before deploying: `SITE_URL=https://3dprintcostcalculator.org ENABLE_INDEXING=1 npm run build && node scripts/audit.mjs`; simulation is not proof of live publication.
- Domain ownership is not evidence of successful GSC indexing.

## Finish Cloudflare Pages configuration
1. Open Cloudflare dashboard > **Workers & Pages** > project `3d-printing-1r7` > **Custom domains**. The apex `3dprintcostcalculator.org` must be listed as **Active** (not Pending, Verifying, or only present under Websites/DNS). Cloudflare documents this separately from the DNS zone.
2. Check `https://3dprintcostcalculator.org/`, `/contact/`, `/robots.txt`, `/sitemap.xml` and `/build-manifest.json` through a normal browser. Check 200 OK, HTTPS padlock and no browser security warning.
3. Under Pages > Settings > Environment variables, set on **Production**:
   `SITE_URL=https://3dprintcostcalculator.org`
   `ENABLE_INDEXING=0` **until live domain verification has passed**. Save and redeploy main. If staging HTML still shows an old `pages.dev` canonical, inspect an older `SITE_URL` override.
4. Before releasing indexing, ensure any `www` alias resolves or permanently redirects to the apex. Do not add a competing canonical `www` destination. Consider Cloudflare Bulk Redirects for `3d-printing-1r7.pages.dev` to the apex (preserve path and query), and check it only after the apex is stable. See Cloudflare Pages custom-domains and redirect docs.
5. When production domain health, correct domain canonical and real support address are verified, set **Production-only** `ENABLE_INDEXING=1`, redeploy and rerun `node scripts/live-audit.mjs https://3dprintcostcalculator.org production` on a network with domain access. The audit asserts all routes, 200 status, canonical/schema, robots, sitemap and indexability. Run Chrome, WebKit and mobile+desktop Lighthouse on this **production origin** (GitHub Actions `Audit live Cloudflare Pages` workflow_dispatch with `site_url=https://3dprintcostcalculator.org`, `mode=production`).
6. Submit `https://3dprintcostcalculator.org/sitemap.xml` to Google Search Console after verifying ownership. Confirm index coverage over time; no guaranteed ranking or traffic.

## Contact mailbox checks (separate from website deployment)
- An email address visible on a website does not prove email reception works. Cloudflare DNS needs correct MX records per the chosen mail provider. Test by sending from an unrelated mailbox, checking inbox/spam and replying.
- If using Cloudflare Email Routing: it **forwards incoming mail**; it does not alone provide a sending mailbox. Configure a sending provider / appropriate verified sender, or clearly disclose no reply capability.
- Check SPF, DKIM and DMARC per the actual mail provider. Do not invent MX destinations or DKIM keys.
- No backend form, third-party email API, payment subscription or new mandatory cost has been added.

## Production verification status
- Source / build configuration: updated for owned domain and support email.
- **Production site publicly reachable and verified:** yes, HTTPS 200 and official-domain canonical in the 2026-11-03 GitHub-hosted probe; indexing still off.
- **Inbox receives mail:** not tested; intentionally outside the Google SEO release gate.
- **Indexing:** deliberately gated pending active custom-domain verification.
