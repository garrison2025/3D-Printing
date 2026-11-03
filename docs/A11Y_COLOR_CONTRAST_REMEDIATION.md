# WCAG contrast regression, detected on deployed Chrome

The first real axe-core run (November 3, 2026) identified serious color-contrast violations on the main calculator, independent filament and hourly tools, and pricing guide. Typical selectors: scenario notes, form helper descriptions, breadcrumb, editorial introduction.

These are genuine a11y defects, not an excuse to disable checks. This patch applies darker body/secondary text (#3d526b or equivalent) against pale backgrounds. The checker still tests all four pages under WCAG 2.0/2.1/2.2 A/AA; it now lists failing nodes rather than truncating to three. Lighthouse runs independently after successful deploy verification even if WCAG rules fail, allowing an evidence-based remediation cycle. No external service is used in the published app.

Automated accessibility checks do not cover keyboard and screen reader usability in full. Treat any new violation as a release issue.