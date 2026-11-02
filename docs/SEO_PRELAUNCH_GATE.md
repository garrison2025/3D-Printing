# SEO staging: domain not yet purchased
Currently https://3d-printing-1r7.pages.dev is strictly PREVIEW. It must remain noindex until the real domain has been purchased and explicitly approved. HTML robots and Cloudflare HTTP X-Robots-Tag use noindex. The staging robots.txt permits Google to fetch the page so it can see noindex, and staging sitemap has no URL entries.

To publish later: configure Cloudflare Pages production environment variables SITE_URL=https://actual-owned-domain and ENABLE_INDEXING=1 and deploy main; verify custom domain canonical, real sitemap, robots allow, and pages.dev host-specific noindex. Only then submit the custom-domain sitemap to Google Search Console. Do not request indexing or build backlinks to the temporary preview domain.
