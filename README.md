# PrintCost Studio — 3D Printing Cost & Pricing Tools

A complete **zero-dependency, static** English-language 3D printing cost and pricing website, implemented from the owner's November 2, 2026 V1.1 plan. All calculation logic runs in the browser; no database, login, payment, paid APIs, or hosted runtime is needed.

## Run it

Requires Node.js 20+ only; **no npm install required**.

```bash
npm test
npm run build
npm run preview
```

Open `http://localhost:4173/`. Windows alternative: `py -m http.server 4173 --directory dist`.

### Cloudflare Pages build settings

- Framework preset: **None (static site)**
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable `SITE_URL`: **the actual final published origin**, e.g. `https://your-real-domain.example` (replace with your OWN verified domain). This variable controls canonical/OG/sitemap URLs.
- No database, API keys, secrets, backend functions, redirects, or additional runtime services.

The current `pages.dev` hostname is **preview-only and noindex**. The build defaults to noindex in every environment. Future indexable publishing requires both `SITE_URL=https://your-verified-custom-domain` and `ENABLE_INDEXING=1` on the Cloudflare `main` deployment. Do not enable before the owner purchases and verifies the domain.

**Deviation from recommended stack:** the owner spec recommends Astro, but npm registry access was unavailable in the execution environment. To provide an actually runnable, verified build rather than untested Astro source, this implementation uses a zero-dependency Node static generator. The output still has pre-rendered HTML, correct internal links, a client-only computation module, mobile CSS, and Cloudflare Pages compatibility. Replacing the build generator with Astro later is optional, not required for SEO.

## Routes

- `/` — the complete FDM cost/pricing/filament calculator; one canonical tool page
- `/how-much-does-3d-printing-cost/` — unique explanatory cost guide
- `/how-to-price-3d-prints/` — unique seller pricing guide
- `/filament-cost-calculator/` — real per-gram/material cost tool
- `/3d-printing-cost-per-hour/` — real per-hour electricity and machine allocation tool
- `/calculation-methodology/` — transparent formula reference, assumptions and inspectable source links
- `/about/`, `/privacy/`, `/contact/` — site support and truthful policies

No generated near-duplicate landing pages. Search-intent assignments for 131 exact US keyword strings, including source metrics and competitor ranking fields, are in `src/content/keyword-intent-map.json` and described in `docs/RESEARCH-HANDOFF.md`.

## Product details

The form supports: spool price/net weight, slicer material usage, print time, items per plate, electricity, printer useful-life allocation, active preparation labor, conservative whole-plate failures, per-unit finishing, units per order, packaging, shipping expense, customer-paid shipping, fixed per-order fees, percentage fees and target margin.

Result: cost per successful item, suggested item selling price, full order gross, included order fees, estimated pre-income-tax order profit, filament cost per gram, hourly machine wear and transparent cost breakdown. Copy summary, CSV export, print/PDF and localStorage remember/reset are wired.

No STL/G-code accuracy claims, no invented testimonials, no paid subscriptions, no code copied from competitor sites.

## Verification

- `npm test`: mathematical, quote, prelaunch indexability, UI and GEO explanation checks; see current CI for test counts.
- `node scripts/audit.mjs`: checks generated routes, unique titles/H1, canonicals, internal links, static FAQ/guide copy, structured data, sitemap and privacy controls.
- `docs/BUILD-STATUS.md` and `docs/GEO_RELEASE_EVIDENCE_20261102.md`: actual checks versus unverified live SEO and AI search results.

**The site is deliberately not public for search indexing** until the final domain is purchased and approved. GitHub Issues is a public support route, but owner/contact/legal details and real-domain verification remain release gates. No AI-search citation or GSC results have been claimed.
