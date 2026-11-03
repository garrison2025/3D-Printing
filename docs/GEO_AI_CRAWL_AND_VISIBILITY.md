# PrintCost Studio | AI Crawler Access, GEO Evidence and Visibility

## Public-site release
The official domain https://3dprintcostcalculator.org is HTTPS and indexable, with 12 canonical URLs. This does not confirm access by verified AI crawlers or any live citation by an AI answer service.
The canonical method /calculation-methodology/#reproducible-scenarios contains four first-party model-generated comparisons. They are hypothetical simulations, not industry benchmarks or independent endorsements.

## Required Cloudflare account checks (not done via GitHub)
1. Go to https://dash.cloudflare.com/ and select the already-active domain 3dprintcostcalculator.org. Do NOT rebind, repurchase or redeploy the domain just to change bot policies.
2. Security > Settings > Bot traffic > AI Crawler and Agent access policies. For discovery, set Search to Allow (do not block). For user-request retrieval, set Agent to Allow (do not block). Check individual Personal Agent overrides.
3. Training is a separate content-use preference: choose Allow, Disallow, or Block based on the owner's preference. Training need NOT be allowed merely to seek AI Search visibility. Some mixed-purpose crawlers may also be affected, so inspect the real policy impact.
4. AI Crawl Control > Crawlers: inspect named crawlers, Request/Allowed/Unsuccessful counts and current action. Security Events: check whether other WAF/Bot settings challenge or deny verified AI crawlers. Only logged edge requests demonstrate their actual access.
5. For OpenAI, distinguish OAI-SearchBot (ChatGPT search) and ChatGPT-User (user-triggered browsing) from GPTBot (model-training crawler). For Anthropic, distinguish Claude-SearchBot and Claude-User from ClaudeBot (training). Other operators have their own documented identities. Verify bot requests using operator IP ranges and Cloudflare verification, never user-agent strings alone.
6. After changing access policy, fetch the actual robots.txt again and inspect Cloudflare Managed robots.txt / Bot Preference Sync. Blocking a bot through the WAF can override an Allow in the published robots.txt.

Official Cloudflare AI behavior documentation: https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/
Cloudflare AI Crawl Control: https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/
Cloudflare crawl analytics: https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/
OpenAI crawler identities: https://developers.openai.com/api/docs/bots
Anthropic crawler identities: https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler

## Evidence-only GEO observation
data/geo-visibility-template.csv contains 25 UNCHECKED rows: five real query intents times five AI search surfaces. These are NOT claimed as actual zero results.
Fill each row after manually running the specific query:
- cited: the generated answer contains a real clickable owner-domain URL; supply observed_date, cited_url and evidence (a saved screenshot location or answer-share link).
- mentioned: exact brand is referenced without a link; supply observed_date and evidence.
- not_cited: the query was actually tested, but yielded no citation; supply observed_date and evidence.
- not_checked: no observation (default); leave date and evidence blank.

Run the offline reporter: node scripts/geo-visibility-report.mjs data/geo-visibility-template.csv
Use a PRIVATE copy for screenshots and live observations. Do not commit private data to this public repository.
The cited share is computed only from valid, evidenced observations. A blank template reports UNKNOWN rather than fabricated 0%. These manual snapshots do not establish independent rankings, crawler access or referral traffic. Check Cloudflare AI Crawl Control, Google Search Console and actual referral sources separately.

## Independent citations / link-worthy assets
The public formulas, reproducible scenarios and source code make the site referenceable, but the owner has no verified third-party backlinks merely because these pages exist.
Only count a backlink after a third party publicly publishes a suitable link. When sharing a scenario in an authorized 3D printing community, disclose your association with PrintCost Studio; do not post automated spam, fabricate awards or pay for misleading reviews.

## Google AI discovery
No special AI schema, llms.txt file or fake modified dates are required for Google AI Overview or AI Mode eligibility. Keep crawlable HTML, truthful sources and genuinely distinctive calculations. llms.txt remains optional navigation.
Google documentation: https://developers.google.com/search/docs/appearance/ai-features

## Verification boundary
Github CI can establish source-to-build consistency but cannot read the owner's Cloudflare AI policy dashboard, confirm Google indexing or certify a citation in any proprietary AI search answer. These remain account/provider-evidence tasks.
