# Four reproducible first-party GEO comparisons

The canonical https://3dprintcostcalculator.org/calculation-methodology/#reproducible-scenarios contains four evidence tables. Values are computed directly from the exact FDM and known-cost quote functions, not copied from a competitor or purported market research.

1. Whole-plate failed attempt risk: 0%, 5%, 20%, same 100 g and 8-hour plate.
2. One versus ten identical parts in one order: known cost $6.79, fee 8% + $0.30 per order, target profit margin 30%, zero other expenses.
3. Four versus eight print hours with unchanged 100 g material and all other settings.
4. Known cost $10, target 30% margin (minimum $14.29) vs 30% markup ($13.00, 23.08% actual margin) without fees.

All data is **hypothetical controlled scenario output**, never claimed to be real-world printer failure or surveyed prices. Source: \`src/lib/calculations.mjs\` and \`src/lib/seo-calculations.mjs\`. Source-consistent values have automatic checks in \`tests/geo-scenarios.test.mjs\`. No new indexable routes or paid runtime dependencies.
