# Cloudflare Web Analytics disclosure and release network QA — 2026-11-03

During the first owner-approved **production** browser acceptance, the official domain loaded one unexpected script:
\`https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092\`.

Cloudflare documents automatic Web Analytics beacon injection for Cloudflare Pages/Cloudflare-proxied sites and uses the documented \`static.cloudflareinsights.com/beacon.min.js\` resource. This was introduced by hosting configuration, **not** application source code. The earlier privacy notice said no analytics, which was no longer true. It has been corrected to disclose the host-controlled Cloudflare performance monitoring without claiming that print form inputs are transmitted.

The independent acceptance still prohibits every **other** unexpected third-party request. A narrow pure helper recognizes only first-party URLs and the documented Cloudflare beacon path on its exact official HTTPS host, with unit tests rejecting lookalike domains and query variants. This is not blanket allowlisting or a bypass of a failed customer quote test.

Cloudflare Web Analytics can be switched off from Cloudflare dashboard > Web Analytics > Manage Site > Disable if desired. The production site remains indexable independently of this setting. Cloudflare says its beacon does not use cookies and its web metrics are privacy-focused, but this is the provider's statement, not an independent audit.

Sources:
- https://developers.cloudflare.com/pages/how-to/web-analytics/
- https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/
- https://developers.cloudflare.com/web-analytics/get-started/
