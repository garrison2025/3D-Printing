// Stable production canonical. Cloudflare CF_PAGES_URL points to each deployment URL
// and must not be used as the SEO canonical for every build.
export const CURRENT_PUBLIC_ORIGIN='https://3d-printing-1r7.pages.dev';
export function resolveSiteConfig(env={}){
  const isCloudflare=env.CF_PAGES==='1';
  const isProductionBranch=isCloudflare && env.CF_PAGES_BRANCH==='main';
  const isPreviewBranch=isCloudflare && env.CF_PAGES_BRANCH!=='main';
  const raw=(env.SITE_URL?.trim() || (isProductionBranch?CURRENT_PUBLIC_ORIGIN:'http://localhost:4173'));
  let url;
  try{url=new URL(raw)}catch{throw Error('SITE_URL must be a complete http(s) origin')}
  if(!['https:','http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname!=='/'){
    throw Error('SITE_URL must be an http(s) origin without credentials, path, query or hash');
  }
  const isLocal=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  // Local builds and Cloudflare preview branches always remain noindex.
  const live=url.protocol==='https:' && !isLocal && !isPreviewBranch;
  return {site:url.origin,live,reason:isPreviewBranch?'cloudflare-preview':live?'production':'local-preview'};
}
