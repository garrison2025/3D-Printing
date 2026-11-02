## Browser-based deployment QA

GitHub Actions runs actual headless Google Chrome tests **after** the real Cloudflare commit and 83 HTTP/SEO checks pass. The browser checks 360/390/768/1024/1440 responsive width, real cost edits, pricing mode and hash, order-size comparison and CSV, validation/reset, dual-filament, hourly costs, and uncaught JS errors. Screenshots are stored for 7 days as Actions artifacts.

Playwright-core is installed only in CI; no production dependency, user analytics, paid API or external database. Running the workflow uses included GitHub Actions minutes, subject to the account allowance. This is not a Lighthouse or Google-indexing claim.
