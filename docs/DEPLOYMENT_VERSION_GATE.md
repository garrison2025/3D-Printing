# Zero-cost production/staging deployment verification

## Automatic on every successful push

1. `.github/workflows/quality.yml` tests, builds and audits the source.
2. A successful quality workflow on `main` triggers `.github/workflows/live-audit.yml` automatically.
3. The Cloudflare Pages build writes `/build-manifest.json` containing its deployed git SHA, current canonical origin and indexable boolean.
4. The live workflow retries up to six times, 30 seconds apart, to allow Cloudflare deployment to complete.
5. The remote test confirms the exact GitHub commit SHA, nine functional routes, 404, assets, real schema, staging robots/indexability and the supported issue channel.
6. `pages.dev` is staging only; production indexability requires a verified custom domain and `ENABLE_INDEXING=1`.

Manual rerun remains possible in GitHub Actions. This process has no ongoing paid API or database. A successful source CI job is not evidence that the Cloudflare live audit passed: check both jobs separately.

The manifest contains no users, IP addresses, secrets, API keys or statistics. Its commit hash is public in the repository. Actual browser interaction/Lighthouse still needs separate QA.
