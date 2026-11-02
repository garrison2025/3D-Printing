import fs from 'node:fs';
const origin=new URL(process.argv[2]||'https://3d-printing-1r7.pages.dev').origin;
if(!origin.startsWith('https://'))throw Error('Live audit needs a public HTTPS URL');
const routes=['/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/','/about/','/privacy/','/contact/'];
const checks=[];
const check=(ok,desc)=>checks.push({ok:Boolean(ok),desc});
async function request(path){
 const target=new URL(path,origin),start=performance.now();
 const response=await fetch(target,{redirect:'follow',signal:AbortSignal.timeout(18000),headers:{'user-agent':'PrintCostProductionAudit/1.0'}});
 const content=await response.text();
 console.log(response.status+' '+path+' '+Math.round(performance.now()-start)+'ms');
 return {response,content,target:target.href};
}
for(const route of routes){
 try{
  const r=await request(route);
  check(r.response.status===200,route+' returns HTTP 200');
  check(r.response.url===r.target,route+' has no unexpected redirect');
  check(/<h1(?:\s|>)/i.test(r.content),route+' has H1');
  check(r.content.includes('<meta name="robots" content="index,follow">'),route+' is marked index,follow');
  check(!/noindex/i.test(r.response.headers.get('x-robots-tag')||''),route+' has no blocking X-Robots-Tag');
  const m=r.content.match(/<link rel="canonical" href="([^"]+)"/i);
  check(m?.[1]===origin+route,route+' canonical points to production URL');
  if(route==='/')check(r.content.includes('id="cost-form"'), 'home page includes calculator');
  if(route==='/contact/'){
   check(r.content.includes('github.com/garrison2025/3D-Printing/issues/new'),'real support link published');
   check(!r.content.includes('Pre-launch note:'),'no prelaunch placeholder');
  }
 }catch(err){check(false,route+' fetch failed: '+err.message)}
}
try{
 const r=await request('/robots.txt');
 check(r.response.status===200,'robots responds HTTP 200');
 check(r.content.includes('Sitemap: '+origin+'/sitemap.xml'),'robots sitemap URL correct');
 check(!/Disallow:\s*\/\s*$/m.test(r.content),'robots does not prohibit full site');
}catch(err){check(false,'robots fetch failed: '+err.message)}
try{
 const r=await request('/sitemap.xml');
 check(r.response.status===200,'sitemap responds HTTP 200');
 for(const route of routes)check(r.content.includes('<loc>'+origin+route+'</loc>'),'sitemap lists '+route);
}catch(err){check(false,'sitemap fetch failed: '+err.message)}
for(const file of ['/assets/app.mjs','/assets/site.css','/assets/finish.css','/favicon.svg']){
 try{const r=await request(file);check(r.response.status===200,file+' loads')}
 catch(err){check(false,file+' fetch failed: '+err.message)}
}
try{
 const r=await request('/nonexistent-qa-route-7f60ae72/');
 check(r.response.status===404,'unknown route returns real HTTP 404');
 check(r.content.includes('<meta name="robots" content="noindex,nofollow">'),'404 page is noindex');
}catch(err){check(false,'404 fetch failed: '+err.message)}
const passed=checks.filter(c=>c.ok).length;
const report=['# Production HTTP/SEO audit', 'Target: '+origin, 'Passed: '+passed+'/'+checks.length,'',...checks.map(c=>(c.ok?'PASS':'FAIL')+' — '+c.desc),''].join('\n');
console.log(report);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report);
if(passed!==checks.length)process.exitCode=1;
