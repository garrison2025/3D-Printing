# Evidence-based GSC performance review (offline)

1. In Google Search Console → Performance → Search results, select a specific date range and export Pages as CSV.
2. CSV needs Page, Clicks, Impressions and Position columns. CTR is optional.
3. Run: `node scripts/gsc-opportunity-report.mjs --pages pages.csv`
4. If you have a genuine joint Page + Query CSV from authorized GSC data access, add `--pairs joint-page-query.csv`.

Note: GSC's separate Queries and Pages exports are both aggregates; combining these two files does not identify query/page overlap. This tool intentionally does not attempt such a join.

The script marks high-impression no-click opportunities, possible weak CTR, and broader page-query gaps. A missing page from the export is never equated with Google non-indexing. Check URL Inspection for actual indexability.

Do not commit private Search Console exports into public GitHub. The tool uses only local file reads: zero paid API, network calls, or background dependencies.

Google official documentation: https://support.google.com/webmasters/answer/7576553
