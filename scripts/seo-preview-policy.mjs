/** Host-alias SEO safety: allow permanent redirects to the owned route,
 * or a still-reachable preview route only when noindex is delivered as an HTTP header.
 * This policy is independent of HTML meta robots on the owned production pages.
 */
export function assessPreviewRoute({status,location='',xrobots='',text=''},previewOrigin,ownedOrigin,path){
 const expected=new URL(path,ownedOrigin).href;
 if(status===301||status===308){
  let resolved='';
  try{resolved=new URL(location,new URL(path,previewOrigin)).href}catch{}
  return {ok:resolved===expected,kind:'permanent-redirect',
   detail:'HTTP '+status+' -> '+(resolved||'(missing Location)')};
 }
 if(status===200){
  const canon=text.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]||'';
  return {ok:/\bnoindex\b/i.test(xrobots)&&canon===expected,kind:'protected-preview',
   detail:'HTTP 200, X-Robots-Tag '+(xrobots||'(missing)')+', canonical '+canon};
 }
 return {ok:false,kind:'invalid-preview-response',detail:'HTTP '+status+'; expected 301/308 or protected 200'};
}
