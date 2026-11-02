# Order-size quote comparison — feature and intent implementation
This is a new on-page action of the existing homepage pricing mode, not a duplicate indexable SEO page.

- It compares order quantities 1, 5, 10 and 25, plus the actual current quantity when different.
- Each row uses the same FDM calculation engine and current input set; fixed payment fees, shipping and packaging remain per order. Production and finishing costs scale with quantity.
- CSV export includes quantity, selling price, gross revenue, production/order costs, platform fees, pre-income-tax estimated profit and achieved margin.
- The extra profit ÷ production-cost ratio is explicitly distinguished from revenue margin and excludes unrelated business overhead from the denominator.
- The staging environment remains noindex. No keyword search-volume or ranking promises are introduced.

To verify: successful GitHub Actions build; actual Cloudflare build commit; mobile functionality/CSV via Chrome; deployment response and staging robots; Lighthouse later. Not equivalent to real Google indexing.
