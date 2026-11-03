# Client-side Excel export with current calculator inputs

The main calculator has a new **Download Excel with my current inputs** action. It fetches the existing static example workbook and modifies its numerical cells locally in the browser, including all 20 cost/fee/margin input cells and current-value formula caches in both Cost Calculator and Batch Quotes. Workbook formulas and styling remain intact; Excel is instructed to recalculate upon opening. Batch quantities are 1, 5, 10, 25, plus the user's entered quantity. No API, upload, backend, account or paid service.

The original sample XLSX remains available directly below the button. Invalid form inputs disable current-value export. Browser support requires DecompressionStream('deflate-raw'); on an unsupported browser the sample file is still downloadable. These files model FDM and explicitly exclude unentered overhead/tax.

The site is still preview-only and noindex on pages.dev; no duplicate keyword route is generated.