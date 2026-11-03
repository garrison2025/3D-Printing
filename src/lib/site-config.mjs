export const CURRENT_PUBLIC_ORIGIN='https://3d-printing-1r7.pages.dev';
export const OWNED_DOMAIN_ORIGIN='https://3dprintcostcalculator.org';
export const CONTACT_EMAIL='contact@3dprintcostcalculator.org';

/** Owner-approved publishing policy, 2026-11-03:
 * An actual Cloudflare Pages main-branch build for the exact owned site may be
 * indexed. A legacy SITE_URL pointing at the original Pages alias and a
 * previously configured ENABLE_INDEXING=0 no longer block that official release.
 * Pages preview hosts remain HTTP noindex via _headers, and feature branches
 * remain nonindexable. PAUSE_INDEXING=1 is the emergency override.
 */
export function resolveSiteConfig(env={}){
 const cf=env.CF_PAGES==='1',main=cf&&env.CF_PAGES_BRANCH==='main';
 const preview=cf&&!main;
 const raw=env.SITE_URL?.trim()||(main?OWNED_DOMAIN_ORIGIN:cf?CURRENT_PUBLIC_ORIGIN:'http://localhost:4173');
 let url;try{url=new URL(raw)}catch{throw Error('SITE_URL must be absolute')}
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('SITE_URL must be a clean origin');
 const isLocal=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 const ownerOrigin=url.origin===OWNED_DOMAIN_ORIGIN||(main&&url.origin===CURRENT_PUBLIC_ORIGIN);
 const site=ownerOrigin?OWNED_DOMAIN_ORIGIN:url.origin;
 const live=ownerOrigin&&(main||env.ENABLE_INDEXING==='1')&&!preview&&!isLocal&&env.PAUSE_INDEXING!=='1';
 return {site,live,reason:live?'owner-approved-production-indexing':'nonproduction-noindex'};
}
