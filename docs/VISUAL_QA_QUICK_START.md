# Screenshot-driven visual change: desktop quick-start scenarios

Prior actual Chromium screenshot from the deployed page at 1440px revealed that three "Quick start" example buttons wrapped into a vertical list in the left calculator panel because the inline notes consumed the row's width. Their actions worked but they occupied unnecessary vertical space.

The desktop breakpoint now uses a compact two-row CSS grid: label and hint first, then three equal-width scenario buttons. Smaller screens preserve the existing responsive layout. The live browser QA checks the three buttons' actual vertical coordinates at 1024 and 1440 pixels, not only their CSS selectors.

Full-page screenshots now scroll to the top and blur previously focused inputs before capture to avoid misleading sticky-header/skip-link artifacts. The live tests still check the original main calculator, order comparison, specialized tools and staging noindex. Browser screenshots remain in GitHub Actions artifacts.

This is a screenshot-backed fix, not a Lighthouse or Google ranking claim.