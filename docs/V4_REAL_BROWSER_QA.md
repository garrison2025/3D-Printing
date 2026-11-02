# V4 Chromium responsive QA — November 2, 2026

Scope: locally built self-contained `preview-offline.html` from the existing static source. This is **not** a live Cloudflare browser test. Online host resolution was blocked.

## Root cause and fix

At 390px the calculator form was only approximately 2px wide while the desktop results column remained 335px: a later unscoped `.workspace-grid` desktop rule in `polish.css` defeated the earlier mobile media query in `site.css`. The last stylesheet now explicitly forces one grid column under 931px, form above full results, with proper sizing for both. Form CSS and numerical functions are otherwise preserved.

A second mobile issue was triggered by changing the mini-estimate panel from sticky to relative on input focus and back on blur. That layout shift could make a user click Reset while validation errors were showing, but miss the button. It now remains sticky in layout and is hidden / non-interactive when an input has focus.

## Local Chromium outcomes

| Viewport | Document width | Form width | Result width | Script errors |
|---|---:|---:|---:|---|
| 360x800 | 360px | 324px | 324px | None |
| 390x844 | 390px | 354px | 354px | None |
| 768x1024 | 768px | 720px | 720px | None |
| 1024x768 | 1024px | 516px | 440px | None |
| 1440x900 | 1440px | 627px | 535px | None |

Local interaction validation at 390px: switching scenarios and pricing mode, Edit Fees expanding and focusing the field, changing grams, invalid negative input disabling exports, Reset restoring the sample, and mobile focus summary behavior. Browser validation uses Chromium with Playwright `page.set_content` on the single-file preview, because direct HTTP navigation is restricted in this runtime.

Executed: `SITE_URL=https://3d-printing-1r7.pages.dev npm run build`, `npm test` (15/15 pass), `node scripts/audit.mjs` (144/144 pass), Chromium 5-viewport layout and mobile interaction checks.

Not run: remote Cloudflare deployment verification, actual device screenshots, Lighthouse / real field Web Vitals. Do not claim production acceptance until these are checked.
