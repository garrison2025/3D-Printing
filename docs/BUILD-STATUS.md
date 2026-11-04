# Verified build and release gates — PrintCost Studio

Production baseline checked 2026-11-04: [3dprintcostcalculator.org](https://3dprintcostcalculator.org/) served commit `4db2f07` with 13 canonical, indexable routes. The Pages alias remains excluded by its HTTP robots header. Search Console indexation and mailbox delivery require separate verification.

The following table records the historical preview acceptance snapshot.

| Gate | Last verified full release evidence |
|---|---|
| Unit/math, deterministic build, keyword and link audits | PASS — GitHub Actions 41570545329 |
| Cloudflare deployment SHA, HTTP headers, canonical, robots, sitemap and real 404 | PASS — 96/96 checks, GitHub Actions 41570574159 |
| Independent Chrome quote/fees, CSV, PDF, XLSX, mixed order, mobile viewports | PASS — 9/9 cases, GitHub Actions 41570574159 |
| Chromium accessibility and no JS crashes | PASS — automated WCAG A/AA, GitHub Actions 41570574159 |
| Real Excel XML structure on both served workbook and personalized export | PASS — 10 internal OOXML components parsed, GitHub Actions 41570574159 |
| LibreOffice Calc open, edit, calculateAll, save and impossible-input rejection | PASS — genuine UNO app test, GitHub Actions 41570574159. **Not** a Microsoft Excel Desktop test |
| iPhone-size Safari engine approximation | PASS — WebKit 8/8, GitHub Actions 41570574159. **Not** a physical iPhone test |
| PNG sharing file and metadata | PASS — 1200×630 image at /og-card.png, published Open Graph and X metadata. Platform-side scraped preview not verified |
| Mobile/desktop Lighthouse | PASS — Perf/A11Y/Best Practices 100/100 laboratory scores, not real-user CrUX/CWV |
| Production hostname, Search Console, indexing and ads | NOT CONFIGURED — waiting on owner's formal domain |
| Later local-saving preference and first-paint corrections | Implemented after the above snapshot; check current CI/live run before claiming a new green release gate |

Links: https://github.com/garrison2025/3D-Printing/actions/runs/41570574159 .

Runtime is browser-only for calculations; no authentication, paid API, server-uploaded print files, or persistent application backend. Hosting still receives normal HTTP metadata. Revenue, site traffic and Google rankings have **not** been established. No fake freshness or automated SEO page generation.
