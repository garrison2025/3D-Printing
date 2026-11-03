/** Non-blocking HTTPS/DNS verification for the OWNER domain (not an email check).
 * Reads only public web endpoints. Does not mutate DNS, GSC or Cloudflare settings.
 */
import dns from 'node:dns/promises';
import fs from 'node:fs';
const origin='https://3dprintcostcalculator.org';
const checks=[];
const add=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail).slice(0,180)});
try{
 const ips=await dns.lookup('3dprintcostcalculator.org',{all:true});
 add('DNS resolves publicly',ips.length>0,ips.map(x=>x.address).join(', '));
}catch(e){add('DNS resolves publicly',false,e.code||e.message)}
async function fetchPath(path){
 try{
  const res=await fetch(origin+path,{signal:AbortSignal.timeout(9000),redirect:'follow',headers:{'user-agent':'PrintCostDomainReleaseReadiness/1.0'}});
  const body=await res.text();
  return {ok:res.ok,status:res.status,url:res.url,body,headers:res.headers};
 }catch(e){return {ok:false,status:0,url:'',body:'',headers:new Headers(),error:String(e?.message||e)}}
}
const home=await fetchPath('/');
add('HTTPS homepage serves HTTP 200',home.ok&&home.url===origin+'/',home.error||home.status+' '+home.url);
const canonical=home.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1]||'';
add('Homepage canonical points to owner domain',canonical===origin+'/',canonical||'(missing)');
const robots=home.body.match(/<meta name="robots" content="([^"]+)"/)?.[1]||'';
add('Homepage indexing is active',robots==='index,follow'&&!/noindex/i.test(home.headers.get('x-robots-tag')||''),robots||'(missing)');
const contact=await fetchPath('/contact/');
const mailInRawHtml=contact.body.includes('mailto:contact@3dprintcostcalculator.org');
const cfEmailObfuscation=/cdn-cgi\/l\/email-protection|__cf_email__|data-cfemail/i.test(contact.body);
const pageTitle=contact.body.match(/<title>([^<]+)/i)?.[1]||'(no title)';
add('Contact page loads and displays configured email',contact.ok&&mailInRawHtml,
 contact.error||('HTTP '+contact.status+'; title='+pageTitle+'; CF email obfuscation='+cfEmailObfuscation+'; raw mailto='+mailInRawHtml));
const robot=await fetchPath('/robots.txt');
add('Robots advertises the owned-domain sitemap',robot.ok&&robot.body.includes('Sitemap: '+origin+'/sitemap.xml'),robot.error||robot.status);
const sitemap=await fetchPath('/sitemap.xml');
add('Sitemap lists the homepage on owner domain',sitemap.ok&&sitemap.body.includes('<loc>'+origin+'/</loc>'),sitemap.error||sitemap.status);
const manifest=await fetchPath('/build-manifest.json');
let parsed={};try{parsed=JSON.parse(manifest.body)}catch{}
add('Deployed manifest serves owner-domain build',manifest.ok&&parsed.canonicalOrigin===origin,manifest.error||JSON.stringify(parsed));
add('Production manifest explicitly indexable',parsed.indexable===true,JSON.stringify({indexable:parsed.indexable,commit:parsed.commit}));
const total=checks.filter(x=>x.ok).length;
const report=['# Owned domain Google indexing readiness','Target: '+origin,'Checks passed: '+total+'/'+checks.length,
 'Diagnostic only — no DNS, mailbox or Google Search Console changes.',
 ...checks.map(x=>(x.ok?'PASS':'PENDING')+' — '+x.name+(x.detail?' ('+x.detail+')':'')),
 '','Recommended: only submit sitemap to Search Console after HTTPS, canonical, robots and manifest all match.',
 ''];
console.log(report.join('\n'));
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report.join('\n'));
const strict=process.argv.includes('--strict');
if(strict&&total!==checks.length)process.exitCode=1;
