import fs from 'node:fs';import path from 'node:path';
const base=path.resolve('dist');let count=0;
const routes=['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/','/calculation-methodology/','/3d-print-cost-calculator-excel/','/about/','/privacy/','/contact/'];
function pass(c,msg){count++;if(!c)throw new Error('FAIL '+msg)}
function canonicalOriginFor(route,html){return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]}
const titles=new Set();
for(const route of routes){
 const file=path.join(base,route.slice(1),'index.html');pass(fs.existsSync(file),'exists '+file);
 const html=fs.readFileSync(file,'utf8');pass((html.match(/<h1(?: |>|\n)/g)||[]).length===1,'single H1 '+route);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];pass(!!title,'title '+route);pass(!titles.has(title),'unique title '+route);titles.add(title);
 pass(/<meta name="description" content="[^"]+"/.test(html),'meta description '+route);
 pass(/<link rel="canonical" href="https?:\/\//.test(html),'absolute canonical '+route);
 pass(/<script type="application\/ld\+json">/.test(html),'jsonld '+route);
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1]||'{}')['@graph'];
 pass(Array.isArray(graph),'schema has @graph '+route);
 const website=graph.find(x=>x['@type']==='WebSite');
 const webpage=graph.find(x=>x['@type']==='WebPage');
 pass(!!website && website['@id']===canonicalOriginFor('/',fs.readFileSync(path.join(base,'index.html'),'utf8'))+'#website','schema website ID '+route);
 pass(!!webpage && webpage.url===canonicalOriginFor(route,html),'schema webpage canonical URL '+route);
 pass(webpage?.isPartOf?.['@id']===website?.['@id'],'WebPage points to website entity '+route);
 if(['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/'].includes(route)){
  const application=graph.find(x=>x['@type']==='WebApplication');
  pass(!!application && application.url===webpage.url && webpage.mainEntity?.['@id']===application['@id'],'WebApplication matches visible calculator '+route);
 }
 if(['/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/'].includes(route)){
  pass(html.includes('class="geo-answer"'),'readable answer block '+route);
  pass(html.includes('href="/calculation-methodology/"'),'visible methodology link '+route);
 }
 if(['/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/','/calculation-methodology/','/3d-print-cost-calculator-excel/'].includes(route)){
  const breadcrumb=graph.find(x=>x['@type']==='BreadcrumbList');
  pass(!!breadcrumb && breadcrumb.itemListElement?.length===2,'breadcrumb markup backed by visible navigation '+route);
 }

 const schema=html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];pass(!!JSON.parse(schema),'parse jsonld '+route);
 for(const a of html.matchAll(/href="(\/[^"?#]*)[^"]*"/g)){
  const dest=a[1];if(dest.startsWith('/assets/'))continue;
  pass(fs.existsSync(path.join(base,dest.slice(1),dest.endsWith('/')?'index.html':''))||fs.existsSync(path.join(base,dest.slice(1))),'internal link '+route+' → '+dest);
 }
 if(route==='/')pass(html.includes('id="cost-form"')&&html.includes('id="result-focus-value"'),'interactive placeholders');
}
pass(fs.existsSync(path.join(base,'404.html')),'real 404 page');
pass(fs.existsSync(path.join(base,'sitemap.xml')),'sitemap');
pass(fs.readFileSync(path.join(base,'index.html'),'utf8').includes('name="twitter:card" content="summary_large_image"'),'social card metadata')
for(const route of ['/filament-cost-calculator/','/3d-printing-cost-per-hour/']){const html=fs.readFileSync(path.join(base,route.slice(1),'index.html'),'utf8');pass(html.includes('data-seo-calculator='),'operable specialized calculator '+route);pass(html.includes('Calculation formula'),'visible formula '+route)}
const methods=fs.readFileSync(path.join(base,'calculation-methodology/index.html'),'utf8');
for(const phrase of ['Whole-plate failure','one-attempt cost','Required order gross','source code','not complete net business income']){
 pass(methods.toLowerCase().includes(phrase.toLowerCase()),'method page explains '+phrase);
}
pass(!methods.includes('"@type":"Organization"'),'no fabricated organization entity');
pass(fs.existsSync(path.join(base,'robots.txt')),'robots');
pass(fs.existsSync(path.join(base,'assets/calculations.mjs')),'calculation module');
pass(fs.existsSync(path.join(base,'index.html'))&&fs.readFileSync(path.join(base,'index.html'),'utf8').includes('id="mixed-quote"')&&fs.existsSync(path.join(base,'assets/mixed-order.mjs')),'real mixed order interface and module');
pass(fs.existsSync(path.join(base,'assets/seo-calculations.mjs')),'specialized calculator library');
const map=JSON.parse(fs.readFileSync('src/content/keyword-intent-map.json','utf8'));
pass(map.keywords.length===131,'131 source keywords');
for(const group of ['P0','P1','P2','EXCLUDE'])pass(map.keywords.some(k=>k.priority===group),'group '+group);
// Production and preview indexability gates: audit generated bytes, not configuration alone.
const homepage=fs.readFileSync(path.join(base,'index.html'),'utf8');
const notFound=fs.readFileSync(path.join(base,'404.html'),'utf8');
const contactHtml=fs.readFileSync(path.join(base,'contact/index.html'),'utf8');
const robotText=fs.readFileSync(path.join(base,'robots.txt'),'utf8');
const sitemapText=fs.readFileSync(path.join(base,'sitemap.xml'),'utf8');
const canonicalOrigin=homepage.match(/<link rel="canonical" href="(https?:\/\/[^/]+)\/"/)?.[1];
pass(Boolean(canonicalOrigin),'homepage canonical origin parsed');
pass(notFound.includes('<meta name="robots" content="noindex,nofollow">'),'404 is noindex');
pass(homepage.includes('class="skip-link" href="#main-content"'),'accessible skip-to-main link');
pass(contactHtml.includes('https://github.com/garrison2025/3D-Printing/issues/new'),'real support link');
pass(!contactHtml.includes('Pre-launch note:'),'no public placeholder support copy');
if(homepage.includes('<meta name="robots" content="index,follow">')){
 pass(robotText.includes('Sitemap: '+canonicalOrigin+'/sitemap.xml'),'published robots sitemap matches canonical');
 pass(!/Disallow:\s*\/\s*$/m.test(robotText),'published robots allows crawling');
 pass(sitemapText.includes('<loc>'+canonicalOrigin+'/</loc>'),'published sitemap home matches canonical');
 pass(!fs.readFileSync(path.join(base,'_headers'),'utf8').split('/assets/*')[0].includes('X-Robots-Tag: noindex'),'published default headers have no blanket noindex');
 for(const route of routes)pass(sitemapText.includes('<loc>'+canonicalOrigin+route+'</loc>'),'published sitemap includes '+route);
}else{
 pass(homepage.includes('<meta name="robots" content="noindex,nofollow">'),'preview noindex in HTML');
 pass(!/Disallow:\s*\/\s*$/m.test(robotText),'staging allows crawler to discover noindex');
 pass(!/<loc>/.test(sitemapText),'staging sitemap is empty');
 pass(fs.readFileSync(path.join(base,'_headers'),'utf8').includes('X-Robots-Tag: noindex, nofollow'),'staging sends noindex HTTP header');
}
// Guard actual rendered fragment IDs, not only route existence.
// This catches broken guide navigation such as a missing /#pricing anchor.
for(const route of routes){
 const source=fs.readFileSync(path.join(base,route.slice(1),'index.html'),'utf8');
 for(const [,href] of source.matchAll(/href="([^"]+)"/g)){
  if(!href.includes('#')||/^[a-z][a-z\d+.-]*:/i.test(href))continue;
  if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const url=new URL(href,'https://local.test'+route);
  if(!url.hash||url.hash==='#')continue;
  const anchor=decodeURIComponent(url.hash.slice(1));
  const target=path.join(base,url.pathname.slice(1),'index.html');
  pass(fs.existsSync(target),'anchor route exists '+route+' → '+href);
  const targetHTML=fs.readFileSync(target,'utf8');
  pass(targetHTML.includes('id="'+anchor+'"'),'anchor target exists '+route+' → '+href);
 }
}
// Verify emitted source-module graph to detect missing assets before deployment.
for(const file of fs.readdirSync(path.join(base,'assets')).filter(x=>x.endsWith('.mjs'))){
 const full=path.join(base,'assets',file),js=fs.readFileSync(full,'utf8');
 for(const [,rel] of js.matchAll(/\b(?:from\s*|import\s*\(\s*)['"](\.[^'"]+)['"]/g))
  pass(fs.existsSync(path.resolve(path.dirname(full),rel)),file+' resolves local JavaScript import '+rel);
}
console.log('PASS',count,'static build assertions');
