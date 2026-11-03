# Prelaunch Lighthouse and WCAG quality gate

Cloudflare real deployed-SHA and nine-route HTTP/SEO checks must pass first. GitHub Actions then runs real Chrome interaction QA with axe-core 4.14.0 for WCAG 2.0/2.1/2.2 A/AA checks on the homepage, two calculators and pricing guide. Lighthouse 13.6.0 measures the homepage in mobile and desktop lab configurations. The runner saves JSON and summary artifacts with exact performance, accessibility, best-practices, FCP, LCP, TBT and CLS measurements.

SEO scoring is deliberately excluded while the pages.dev preview remains noindex; site is not launched to search. Do not call a lab score real-user CWV/INP. Modules are installed only on GitHub's CI runner (which uses Actions minutes), not shipped in site assets. No database or paid API.
