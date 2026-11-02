export const CURRENT_PUBLIC_ORIGIN='https://3d-printing-1r7.pages.dev';
export function resolveSiteConfig(env={}){
 const cf=env.CF_PAGES==='1',preview=cf&&env.CF_PAGES_BRANCH!=='main';
 const raw=env.SITE_URL?.trim()||(cf?CURRENT_PUBLIC_ORIGIN:'http://localhost:4173');
 let url;try{url=new URL(raw)}catch{throw Error('SITE_URL must be absolute')}
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('SITE_URL must be a clean origin');
 const isLocal=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 const isPagesDev=url.hostname==='pages.dev'||url.hostname.endsWith('.pages.dev');
 const live=env.ENABLE_INDEXING==='1'&&url.protocol==='https:'&&!isLocal&&!isPagesDev&&!preview;
 return {site:url.origin,live,reason:live?'custom-domain-approved':'prelaunch-noindex'};
}
