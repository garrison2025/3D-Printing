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
- Environment variable `SITE_URL`: `https://3dprintcostcalculator.org` for the verified production Pages branch. This variable controls canonical, JSON-LD, OG and sitemap URLs.
- No database, API keys, secrets, backend functions, redirects, or additional runtime services.

The `pages.dev` hostname remains a **preview alias**. The site owner's domain is `https://3dprintcostcalculator.org` and the contact address is `contact@3dprintcostcalculator.org`. The owner has purchased the domain and linked it to Cloudflare, **but Cloudflare Pages custom-domain activation, TLS and MX/email delivery have not yet been independently verified**. The build stays noindex unless both `SITE_URL=https://3dprintcostcalculator.org` and `ENABLE_INDEXING=1` are explicitly configured. Noncanonical hostnames and Pages preview branches cannot pass this release gate. Follow `docs/DOMAIN_RELEASE_20261103.md` before changing `ENABLE_INDEXING` to `1`.

**Deviation from recommended stack:** the owner spec recommends Astro, but npm registry access was unavailable in the execution environment. To provide an actually runnable, verified build rather than untested Astro source, this implementation uses a zero-dependency Node static generator. The output still has pre-rendered HTML, correct internal links, a client-only computation module, mobile CSS, and Cloudflare Pages compatibility. Replacing the build generator with Astro later is optional, not required for SEO.

## Routes

- `/` — the complete FDM cost/pricing/filament calculator; one canonical tool page
- `/how-much-does-3d-printing-cost/` — unique explanatory cost guide
- `/how-to-price-3d-prints/` — unique seller pricing guide
- `/filament-cost-calculator/` — real per-gram/material cost tool
- `/3d-printing-cost-per-hour/` — real per-hour electricity and machine allocation tool
- `/calculation-methodology/` — transparent formula reference, assumptions and inspectable source links
- `/3d-print-cost-calculator-excel/` — distinct editable offline XLSX download and usage guide (two source P2 intents)
- `/about/`, `/privacy/`, `/contact/` — site support and truthful policies

No generated near-duplicate landing pages. Search-intent assignments for 131 exact US keyword strings, including source metrics and competitor ranking fields, are in `src/content/keyword-intent-map.json` and described in `docs/RESEARCH-HANDOFF.md`.

## Product details

The form supports: spool price/net weight, slicer material usage, print time, items per plate, electricity, printer useful-life allocation, optional maintenance reserve per print hour, active preparation labor, conservative whole-plate failures, per-unit finishing, units per order, packaging and a separate optional design/one-time overhead per order, shipping expense, customer-paid shipping, fixed per-order fees, percentage fees and target margin.

Result: cost per successful item, whole-cent checkout selling price, full order gross, included order fees, estimated pre-income-tax order profit, filament cost per gram, hourly machine wear and transparent cost breakdown. An optional mixed-part order panel accepts cost and quantity per distinct model and exports a separate order-level CSV, without inventing individual selling prices. Copy summary, CSV export, print/PDF and localStorage remember/reset are wired.

No STL/G-code accuracy claims, no invented testimonials, no paid subscriptions, no code copied from competitor sites.

## Verification

- `npm test`: mathematical, quote, prelaunch indexability, UI and GEO explanation checks; see current CI for test counts.
- `node scripts/audit.mjs`: checks generated routes, unique titles/H1, canonicals, internal links, static FAQ/guide copy, structured data, sitemap and privacy controls.
- `docs/BUILD-STATUS.md` and `docs/GEO_RELEASE_EVIDENCE_20261102.md`: actual checks versus unverified live SEO and AI search results.

**Site ownership is confirmed; search indexing stays gated until Cloudflare Pages custom-domain HTTPS and published metadata are independently verified.** GitHub Issues is a public support route, but owner/contact/legal details and real-domain verification remain release gates. No AI-search citation or GSC results have been claimed.

### Editable Excel calculator template

A downloadable genuine `.xlsx` workbook is generated from the audited template in `src/downloads/3d-print-cost-calculator-template.xlsx` and copied to `/assets/3d-print-cost-calculator-template.xlsx` during `npm run build`. It includes **Cost Calculator** (20 editable inputs and 18 formula results), **Batch Quotes** (quantities 1/5/10/25 and current quantity), and **Read Me**. Defaults reproduce the main website formula, including whole-plate failure probability, per-order fees, margin, shipping and zero-floor behavior. Unlike an exported CSV, changing input cells automatically recalculates results in Excel. Checkout unit prices use Excel `ROUNDUP(...,2)` so a real two-decimal charge does not accidentally fall below the target margin.

This optional static download contains **sample inputs**, not the user's current browser calculation. It does not upload orders or use a paid API. This serves the deferred Excel/spreadsheet research intent without generating a duplicate SEO landing page. Staging remains `noindex`.

## Source documentation protection

`npm run build` writes only generated `dist` files and the untracked offline preview. It does not overwrite the tracked `docs/SEO-GEO-PROJECT-BRIEF.md`. Share metadata has an OG SVG fallback and Twitter Card fields; the static file is not yet a cross-platform PNG preview image.
