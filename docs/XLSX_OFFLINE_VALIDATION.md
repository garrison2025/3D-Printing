# Offline Excel validation — build-time safety control

The published example XLSX is assembled from the repository's existing Office workbook and hardened automatically during static build. Original sample values, formulas, workbook styles and named sheets remain; there are no new server dependencies.

A clear INPUT STATUS formula checks all 20 user-controlled numeric fields, nonnegative value limits, spool/lifetime denominators, whole-item counts 1–100,000, failed-plate rate 0–95%, and fee rate plus target margin strictly below 100%. When any constraint fails, all 18 computed outputs and batch-quote formulas return blank instead of misleading '$0.00'. Restoring a valid input immediately restores calculations in compatible spreadsheet software. Full calculation on open is enabled.

The main browser calculator validates the same constraints and only allows personalization for valid inputs. GitHub source tests now check the actual hardened OOXML and personalized workbook structure. Deployed Chrome tests assert that both guide links download workbooks containing the validation formula. Zero paid API, no new SEO URL, Pages preview remains noindex.

Known limitation: formulas and normal spreadsheet input guardrails are not tamper-proof; a user can delete them in Excel. The workbook is a cost-estimate aid, not a tax/accounting guarantee.