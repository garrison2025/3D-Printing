/**
 * Release network contract: only first-party requests and the officially
 * documented Cloudflare Web Analytics beacon are expected. Do not weaken
 * the policy to allow arbitrary third-party scripts.
 */
export function classifyNetworkRequest(value,siteOrigin){
 let parsed,origin;
 try{parsed=new URL(value);origin=new URL(siteOrigin).origin}catch{return 'unknown-external'}
 if(parsed.origin===origin)return 'first-party';
 const validBeacon=parsed.origin==='https://static.cloudflareinsights.com'
  && /^\/beacon\.min\.js(?:\/v[0-9a-f]+)?$/i.test(parsed.pathname)
  && !parsed.search;
 return validBeacon?'cloudflare-web-analytics':'unknown-external';
}
