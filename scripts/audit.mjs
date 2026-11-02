import fs from 'node:fs';import path from 'node:path';
const base=path.resolve('dist');let count=0;
const routes=['/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/','/about/','/privacy/','/contact/'];
function pass(c,msg){count++;if(!c)throw new Error('FAIL '+msg)}
const titles=new Set();
for(const route of routes){
 const file=path.join(base,route.slice(1),'index.html');pass(fs.existsSync(file),'exists '+file);
 const html=fs.readFileSync(file,'utf8');pass((html.match(/<h1(?: |>|\n)/g)||[]).length===1,'single H1 '+route);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];pass(!!title,'title '+route);pass(!titles.has(title),'unique title '+route);titles.add(title);
 pass(/<meta name="description" content="[^"]+"/.test(html),'meta description '+route);
 pass(/<link rel="canonical" href="https?:\/\//.test(html),'absolute canonical '+route);
 pass(/<script type="application\/ld\+json">/.test(html),'jsonld '+route);
 const schema=html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];pass(!!JSON.parse(schema),'parse jsonld '+route);
 for(const a of html.matchAll(/href="(\/[^"?#]*)[^"]*"/g)){
  const dest=a[1];if(dest.startsWith('/assets/'))continue;
  pass(fs.existsSync(path.join(base,dest.slice(1),dest.endsWith('/')?'index.html':''))||fs.existsSync(path.join(base,dest.slice(1))),'internal link '+route+' → '+dest);
 }
 if(route==='/')pass(html.includes('id="cost-form"')&&html.includes('id="result-focus-value"'),'interactive placeholders');
}
pass(fs.existsSync(path.join(base,'404.html')),'real 404 page');
pass(fs.existsSync(path.join(base,'sitemap.xml')),'sitemap');
pass(fs.existsSync(path.join(base,'robots.txt')),'robots');
pass(fs.existsSync(path.join(base,'assets/calculations.mjs')),'calculation module');
const map=JSON.parse(fs.readFileSync('src/content/keyword-intent-map.json','utf8'));
pass(map.keywords.length===131,'131 source keywords');
for(const group of ['P0','P1','P2','EXCLUDE'])pass(map.keywords.some(k=>k.priority===group),'group '+group);
console.log('PASS',count,'static build assertions');
