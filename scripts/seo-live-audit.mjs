/**
 * Read-only live SEO route audit for the owned domain and Cloudflare preview.
 * Uses only built-in Node.js fetch; does not change Pages, DNS or Search Console.
 * Without --strict, deployment/indexing blockers are reported, not hidden by a
 * green code-build status. With --strict, blockers fail the audit.
 */
import fs from 'node:fs';
import {assessPreviewRoute} from './seo-preview-policy.mjs';

const ORIGIN='https://3dprintcostcalculator.org';
const PREVIEW='https://3d-printing-1r7.pages.dev';
const ROUTES=[
 '/','/filament-cost-calculator/','/3d-printing-cost-per-hour/',
 '/3d-print-pricing-calculator/','/how-much-does-3d-printing-cost/',
 '/how-to-price-3d-prints/','/calculation-methodology/',
 '/3d-print-cost-calculator-excel/','/about/','/privacy/','/terms/','/contact/'
];
const failures=[],blockers=[],warnings=[],details=[];
const fail=(why)=>failures.push(why);
const block=(why)=>blockers.push(why);
const warn=(why)=>warnings.push(why);
const extract=(html,re)=>html.match(re)?.[1]||'';
async function get(url,{redirect='follow'}={}){
 try{
  const response=await fetch(url,{
   redirect,signal:AbortSignal.timeout(17000),
   headers:{'User-Agent':'PrintCostOwnedDomainSEOAudit/1.0'}
  });
  return {status:response.status,url:response.url,
   xrobots:response.headers.get('x-robots-tag')||'',location:response.headers.get('location')||'',
   text:await response.text()};
 }catch(error){return {status:0,url,xrobots:'',text:'',error:String(error?.message||error)}}
}
const requests=[
 ...ROUTES.map(route=>ORIGIN+route),ORIGIN+'/robots.txt',
 ORIGIN+'/sitemap.xml',ORIGIN+'/build-manifest.json',
 ORIGIN+'/seo-audit-nonexistent-404-route/',
 PREVIEW+'/'
];
const fetched=await Promise.all(requests.map(get));
const manifestReply=fetched[ROUTES.length+2];
let manifest={};try{manifest=JSON.parse(manifestReply.text)}catch{fail('Build manifest is not valid JSON')}
const production=manifest.indexable===true&&manifest.kind==='production';
if(manifestReply.status!==200)fail('Missing build-manifest.json at owned domain');
if(manifest.canonicalOrigin!==ORIGIN)fail('Manifest canonical origin is not owned HTTPS domain');
if(!production)block('Owned domain still serves staging/noindex build: set Production SITE_URL and ENABLE_INDEXING=1, then redeploy (not a domain-binding issue)');
const titles=new Set(),descs=new Set();
for(let i=0;i<ROUTES.length;i++){
 const route=ROUTES[i], r=fetched[i],html=r.text;
 const canonical=extract(html,/<link rel="canonical" href="([^"]+)"/i);
 const title=extract(html,/<title>([^<]+)<\/title>/i);
 const description=extract(html,/<meta name="description" content="([^"]+)"/i);
 const robots=extract(html,/<meta name="robots" content="([^"]+)"/i);
 const h1=(html.match(/<h1(?:\s|>)/gi)||[]).length;
 let schemaOk=false;
 try{
  const schema=JSON.parse(extract(html,/<script type="application\/ld\+json">([^<]+)<\/script>/i));
  schemaOk=Array.isArray(schema['@graph'])&&schema['@graph'].some(x=>x['@type']==='WebPage'&&x.url===canonical);
 }catch{}
 if(r.status!==200||r.url!==ORIGIN+route)fail(route+' returns '+r.status+' or redirects unexpectedly ('+r.url+')');
 if(canonical!==ORIGIN+route)fail(route+' has mismatching canonical '+canonical);
 if(!title||titles.has(title))fail(route+' has empty or duplicate title');
 if(!description||descs.has(description))fail(route+' has empty or duplicate description');
 if(h1!==1)fail(route+' has '+h1+' H1 headings');
 if(!schemaOk)fail(route+' WebPage JSON-LD does not match canonical');
 if(production){
  if(robots!=='index,follow'||/noindex/i.test(r.xrobots))fail(route+' has active noindex despite production manifest');
 }else if(robots!=='noindex,nofollow'){
  fail(route+' staging HTML is not safely noindex');
 }
 if(title.length>72)warn(route+' title is long ('+title.length+' characters); snippet truncation varies by device, not a fixed ranking cutoff');
 if(description.length>165)warn(route+' description is long ('+description.length+' characters)');
 titles.add(title);descs.add(description);
 details.push({route,status:r.status,robots,canonical,head:title.length+' chars',schema:schemaOk?'yes':'no'});
}
const robot=fetched[ROUTES.length],map=fetched[ROUTES.length+1],notfound=fetched[ROUTES.length+3],preview=fetched[ROUTES.length+4];
if(robot.status!==200||/Disallow:\s*\/\s*$/m.test(robot.text))fail('robots.txt unavailable or blocks all crawlers');
if(map.status!==200)fail('sitemap.xml not HTTP 200');
const locs=[...map.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if(production){
 if(!robot.text.includes('Sitemap: '+ORIGIN+'/sitemap.xml'))fail('Production robots.txt missing official sitemap reference');
 if(locs.length!==ROUTES.length||new Set(locs).size!==ROUTES.length||ROUTES.some(r=>!locs.includes(ORIGIN+r)))fail('Production sitemap missing, duplicated or foreign canonical URLs');
}else if(locs.length)fail('Staging sitemap contains discoverable URLs; expected zero');
if(notfound.status!==404||!/noindex,nofollow/.test(notfound.text))fail('Unknown page must return actual HTTP 404 with noindex HTML');
const previewRoutes=['/','/filament-cost-calculator/'];
const previewDirect=await Promise.all(previewRoutes.map(route=>get(PREVIEW+route,{redirect:'manual'})));
const previewAssessments=previewDirect.map((reply,i)=>assessPreviewRoute(reply,PREVIEW,ORIGIN,previewRoutes[i]));
for(let i=0;i<previewAssessments.length;i++){
 const assessment=previewAssessments[i];
 if(!assessment.ok)fail('Unsafe preview alias '+previewRoutes[i]+': '+assessment.detail);
}

const report=[
 '# PrintCost Studio — real production-origin SEO inspection',
 'Origin: '+ORIGIN,'Live manifest commit: '+String(manifest.commit||'unknown'),
 'Detected release mode: '+(production?'production / indexable':'staging / NOINDEX'),
 'Routes inspected: '+ROUTES.length,
 'Technical failures: '+failures.length+'; release blockers: '+blockers.length+'; advisories: '+warnings.length,
 '',
 '| Route | HTTP | Robots meta | Canonical | Title length | JSON-LD WebPage |',
 '|---|---:|---|---|---|---|',
 ...details.map(d=>'| '+d.route+' | '+d.status+' | '+d.robots+' | '+(d.canonical===ORIGIN+d.route?'correct':'incorrect')+' | '+d.head+' | '+d.schema+' |'),
 '',
 'Sitemap URLs: '+locs.length+'; expected after release: '+ROUTES.length,
 'robots.txt includes production sitemap: '+robot.text.includes('Sitemap: '+ORIGIN+'/sitemap.xml'),
 'Preview aliases: '+previewAssessments.map((item,i)=>previewRoutes[i]+' '+(item.ok?'SAFE':'UNSAFE')+' ['+item.detail+']').join('; '),
 '',
 ...blockers.map(s=>'BLOCKER — '+s),
 ...failures.map(s=>'FAIL — '+s),
 ...warnings.map(s=>'ADVISORY — '+s),
 '',
 'This is a public HTTP/HTML audit, not proof of Google indexing, rankings, CTR, Search Console ownership, or Core Web Vitals.',
 'The Cloudflare custom domain can be Active even while the site remains noindex.',
 ''
].join('\n');
console.log(report);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report+'\n');
if(process.argv.includes('--strict')&&(failures.length||blockers.length))process.exitCode=1;
