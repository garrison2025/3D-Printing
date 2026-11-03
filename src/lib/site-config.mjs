export const CURRENT_PUBLIC_ORIGIN='https://3d-printing-1r7.pages.dev';
export const OWNED_DOMAIN_ORIGIN='https://3dprintcostcalculator.org';
export const CONTACT_EMAIL='contact@3dprintcostcalculator.org';
export function resolveSiteConfig(env={}){
 const cf=env.CF_PAGES==='1',preview=cf&&env.CF_PAGES_BRANCH!=='main';
 // A main-branch Pages deployment represents the owned site, even when an older
 // Cloudflare SITE_URL environment value still names the temporary pages.dev alias.
 // Locally built preview and non-main branches remain separate and non-indexable.
 const raw=env.SITE_URL?.trim()||(cf&&!preview?OWNED_DOMAIN_ORIGIN:cf?CURRENT_PUBLIC_ORIGIN:'http://localhost:4173');
 let url;try{url=new URL(raw)}catch{throw Error('SITE_URL must be absolute')}
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('SITE_URL must be a clean origin');
 const isLocal=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 const isPagesDev=url.hostname==='pages.dev'||url.hostname.endsWith('.pages.dev');
 // Main builds always advertise the owned canonical URL; only an explicitly
 // owner-domain-configured build with ENABLE_INDEXING=1 becomes indexable.
 // An outdated pages.dev SITE_URL can never accidentally enable indexing.
 const site=cf&&!preview&&url.origin===CURRENT_PUBLIC_ORIGIN?OWNED_DOMAIN_ORIGIN:url.origin;
 const live=env.ENABLE_INDEXING==='1'&&url.origin===OWNED_DOMAIN_ORIGIN&&!isLocal&&!isPagesDev&&!preview;
 return {site,live,reason:live?'custom-domain-approved':'prelaunch-noindex'};
}
