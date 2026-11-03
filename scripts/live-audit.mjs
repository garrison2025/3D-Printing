import fs from 'node:fs';
const origin=new URL(process.argv[2]||'https://3d-printing-1r7.pages.dev').origin;
const mode=process.argv[3]||'staging';
if(!['staging','production'].includes(mode))throw Error('Mode must be staging or production');
const staging=mode==='staging';
const previewAlias=staging&&new URL(origin).hostname.endsWith('.pages.dev');
const allowedCanonicalOrigins=previewAlias?[origin,'https://3dprintcostcalculator.org']:[origin];
if(!staging && new URL(origin).hostname.endsWith('.pages.dev'))throw Error('Refusing production indexing audit on a temporary pages.dev domain. Use staging mode.');
if(!origin.startsWith('https://'))throw Error('Live audit needs a public HTTPS URL');
const routes=['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/3d-print-pricing-calculator/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/','/calculation-methodology/','/3d-print-cost-calculator-excel/','/about/','/privacy/','/contact/'];
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
  check(r.content.includes(staging?'content="noindex,nofollow"':'content="index,follow"'),route+' has correct indexability for '+mode);
  check(staging?/noindex/i.test(r.response.headers.get('x-robots-tag')||''):!/noindex/i.test(r.response.headers.get('x-robots-tag')||''),route+' header matches '+mode);
  const m=r.content.match(/<link rel="canonical" href="([^"]+)"/i);
  check(allowedCanonicalOrigins.some(x=>m?.[1]===x+route),route+' canonical points to an approved origin');
  if(route==='/')check(r.content.includes('id="cost-form"'), 'home page includes calculator');
  if(route==='/3d-print-pricing-calculator/')check(r.content.includes('data-pricing-calculator')&&r.content.includes('id="price-quote-results"'),'dedicated price tool has actual form and live results');
  const graphMatch=r.content.match(/<script type="application\/ld\+json">([^<]+)<\/script>/i);
  try{
   const graph=JSON.parse(graphMatch?.[1]||'{}')['@graph'];
   check(Array.isArray(graph)&&graph.some(x=>x['@type']==='WebPage'&&x.url===m?.[1]),route+' has real WebPage schema');
  }catch{check(false,route+' has parseable JSON-LD')}
  if(route==='/calculation-methodology/'){
   check(r.content.includes('expected successful-plate cost'),'methodology shows actual failure model');
   check(r.content.includes('github.com/garrison2025/3D-Printing/blob/main/src/lib/calculations.mjs'),'methodology links to source');
  }
  if(route==='/contact/'){
   check(r.content.includes('github.com/garrison2025/3D-Printing/issues/new'),'real support link published');
   check(!r.content.includes('Pre-launch note:'),'no prelaunch placeholder');
   check(r.content.includes('mailto:contact@3dprintcostcalculator.org'),'new domain email appears on contact route');
  }
 }catch(err){check(false,route+' fetch failed: '+err.message)}
}
try{
 const r=await request('/robots.txt');
 check(r.response.status===200,'robots responds HTTP 200');
 check(staging?!r.content.includes('Sitemap:'):r.content.includes('Sitemap: '+origin+'/sitemap.xml'),'robots sitemap matches '+mode);
 check(!/Disallow:\s*\/\s*$/m.test(r.content),'robots does not prohibit full site');
}catch(err){check(false,'robots fetch failed: '+err.message)}
try{
 const r=await request('/sitemap.xml');
 check(r.response.status===200,'sitemap responds HTTP 200');
 if(staging)check(!r.content.includes('<loc>'),'staging sitemap has no indexable URL');
 else for(const route of routes)check(r.content.includes('<loc>'+origin+route+'</loc>'),'sitemap lists '+route);
}catch(err){check(false,'sitemap fetch failed: '+err.message)}
for(const file of ['/assets/app.mjs','/assets/pricing-quote.mjs','/assets/mixed-order.mjs','/assets/quote-precision.mjs','/assets/calculations.mjs','/assets/xlsx-personalize.mjs','/assets/site.css','/assets/finish.css','/assets/site-bundle.css','/assets/3d-print-cost-calculator-template.xlsx','/favicon.svg']){
 try{const r=await request(file);check(r.response.status===200,file+' loads')}
 catch(err){check(false,file+' fetch failed: '+err.message)}
}
try{
 const r=await request('/nonexistent-qa-route-7f60ae72/');
 check(r.response.status===404,'unknown route returns real HTTP 404');
 check(r.content.includes('<meta name="robots" content="noindex,nofollow">'),'404 page is noindex');
}catch(err){check(false,'404 fetch failed: '+err.message)}
try{
 const r=await request('/build-manifest.json');
 check(r.response.status===200,'deployment manifest is accessible');
 const info=JSON.parse(r.content);
 check(allowedCanonicalOrigins.includes(info.canonicalOrigin),'deployment manifest origin matches canonical');
 check(info.indexable===!staging,'deployment indexability matches '+mode);
 const expected=(process.env.EXPECTED_COMMIT||'').trim();
 if(expected)check(info.commit===expected,'deployed SHA '+String(info.commit).slice(0,9)+' matches requested '+expected.slice(0,9));
}catch(err){check(false,'build-manifest verification failed: '+err.message)}

const passed=checks.filter(c=>c.ok).length;
const report=['# '+mode+' HTTP/SEO audit', 'Target: '+origin, 'Passed: '+passed+'/'+checks.length,'',...checks.map(c=>(c.ok?'PASS':'FAIL')+' — '+c.desc),''].join('\n');
console.log(report);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report);
if(passed!==checks.length)process.exitCode=1;
