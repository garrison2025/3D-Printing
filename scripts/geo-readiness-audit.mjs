/** Generated HTML GEO consistency audit. Not a live citation or bot access test. */
import fs from 'node:fs';
import path from 'node:path';
const root='dist',origin='https://3dprintcostcalculator.org';
const results=[],check=(good,description)=>results.push({good:Boolean(good),description});
const read=route=>fs.readFileSync(path.join(root,route==='/'?'':route.slice(1),'index.html'),'utf8');
const home=read('/'),method=read('/calculation-methodology/'),quote=read('/3d-print-pricing-calculator/');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'build-manifest.json'),'utf8'));
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
check(manifest.indexable===true&&manifest.canonicalOrigin===origin,'production build is owner-domain indexable');
check(/User-agent:\s*\*/.test(robots)&&/Allow:\s*\//.test(robots)&&!/^Disallow:\s*\/\s*$/m.test(robots),'robots allows generic search crawlers');
check(robots.includes('Sitemap: '+origin+'/sitemap.xml'),'robots announces canonical sitemap');
check((sitemap.match(/<loc>/g)||[]).length===12,'sitemap includes all 12 canonical pages');
for(const id of ['reproducible-scenarios','scenario-failure','scenario-order','scenario-hours','scenario-margin'])
 check(method.includes('id="'+id+'"'),'methodology has source-driven comparison anchor '+id);
check(home.includes('/calculation-methodology/#reproducible-scenarios'),'homepage links comparison evidence');
check(quote.includes('/calculation-methodology/#scenario-order'),'quoting tool links order-size evidence');
check(method.includes('src/lib/calculations.mjs')&&method.includes('src/lib/seo-calculations.mjs'),'methodology links exact source');
for(const route of ['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/3d-print-pricing-calculator/']){
 const html=read(route);
 let graph=[];try{graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1]||'{}')['@graph']||[]}catch{}
 const publisher=graph.find(x=>x['@type']==='Organization');
 const site=graph.find(x=>x['@type']==='WebSite');
 const page=graph.find(x=>x['@type']==='WebPage');
 check(Boolean(publisher)&&publisher.name==='PrintCost Studio'&&site?.publisher?.['@id']===publisher?.['@id']&&page?.publisher?.['@id']===publisher?.['@id'],'publisher graph consistent '+route);
 check(html.includes('name="robots" content="index,follow"'),'page permits indexing '+route);
}
const failures=results.filter(r=>!r.good);
const report=['# Generated GEO evidence quality gate','Assertions '+results.length+', failures '+failures.length,...failures.map(x=>'FAIL '+x.description),
 'This checks first-party HTML only, not third-party AI citations, traffic or verified crawler requests.'].join('\n');
console.log(report);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report+'\n');
if(failures.length)process.exitCode=1;
