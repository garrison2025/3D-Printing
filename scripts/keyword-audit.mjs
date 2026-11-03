import fs from 'node:fs';
import path from 'node:path';
const map=JSON.parse(fs.readFileSync('src/content/keyword-intent-map.json','utf8'));
const rows=map.keywords;
const validRoutes=new Map([
 ['/',{kind:'home',marker:'id="cost-form"'}],
 ['/3d-print-pricing-calculator/',{kind:'pricing',marker:'data-pricing-calculator'}],
 ['/filament-cost-calculator/',{kind:'filament',marker:'data-seo-calculator="filament"'}],
 ['/3d-printing-cost-per-hour/',{kind:'hourly',marker:'data-seo-calculator="hourly"'}],
 ['/how-much-does-3d-printing-cost/',{kind:'cost-guide',marker:'Worked'}],
 ['/how-to-price-3d-prints/',{kind:'pricing-guide',marker:'margin'}],
 ['/3d-print-cost-calculator-excel/',{kind:'excel-template',marker:'download="3d-print-cost-calculator-template.xlsx"'}]
]);
const counts={P0:0,P1:0,P2:0,EXCLUDE:0};
const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message)};
assert(rows.length===131,'Expected 131 unique imported terms');
const unique=new Set(rows.map(r=>r.keyword.toLowerCase().trim()));
assert(unique.size===rows.length,'Duplicate keyword strings');
const homepage=fs.readFileSync('dist/index.html','utf8');
const app=fs.readFileSync('src/assets/app.mjs','utf8');
let active=0;
for(const row of rows){
 counts[row.priority]??=0;counts[row.priority]++;
 assert(Boolean(row.source),'Missing evidence source: '+row.keyword);
 if(!['P0','P1'].includes(row.priority))continue;
 active++;
 assert(Number.isFinite(row.us_volume),'No supplied volume for '+row.keyword);
 assert(Number.isFinite(row.kd),'No supplied keyword difficulty for '+row.keyword);
 const pricing=row.destination==='/3d-print-pricing-calculator/';
 const destination=row.destination;
 const spec=validRoutes.get(destination);
 assert(Boolean(spec),'No approved destination for '+row.keyword+' -> '+row.destination);
 if(!spec)continue;
 const built=path.join('dist',destination.slice(1),'index.html');
 assert(fs.existsSync(built),'Missing built page for '+row.keyword+' -> '+destination);
 if(!fs.existsSync(built))continue;
 const html=fs.readFileSync(built,'utf8');
 assert(html.includes('<h1'),'Missing real H1 on '+destination);
 assert(html.includes(spec.marker),'Missing '+spec.kind+' functionality on '+destination);
 assert(html.includes('<meta name="description"'),'Missing metadata on '+destination);
 if(pricing){
  assert(html.includes('id="price-quote-results"'),'Dedicated pricing results not found');
  assert(html.includes('href="/how-to-price-3d-prints/"'),'Pricing tool must link methodology guide');
 }
}

// Route verification is not search-intent validation. Require genuine, visible task evidence.
const excelTerms=rows.filter(x=>['3d printing cost calculator excel','3d printing pricing spreadsheet'].includes(x.keyword));
assert(excelTerms.length===2&&excelTerms.every(x=>x.destination==='/3d-print-cost-calculator-excel/'),'Two source P2 spreadsheet terms must map to live downloadable resource');
const intentProof={
 '/': ['id="cost-form"','id="pricing"','EXPECTED COST PER ITEM','Required order gross'],
 '/3d-print-pricing-calculator/': ['data-pricing-calculator','id="price-quote-results"','Required customer gross','whole-cent'],
 '/filament-cost-calculator/': ['data-seo-calculator="filament"','Material cost per gram','second filament','Material cost per item'],
 '/3d-printing-cost-per-hour/': ['data-seo-calculator="hourly"','Maintenance','Machine allocation per hour','electricity'],
 '/how-much-does-3d-printing-cost/': ['Worked example','slicer','Electricity','failed'],
 '/how-to-price-3d-prints/': ['Margin','Markup','Fixed','checkout'],
 '/3d-print-cost-calculator-excel/': ['download="3d-print-cost-calculator-template.xlsx"','Batch Quotes','22 editable inputs','whole-cent checkout']
};
for(const [route,markers] of Object.entries(intentProof)){
 const html=fs.readFileSync(path.join('dist',route.slice(1),'index.html'),'utf8').toLowerCase();
 for(const text of markers)assert(html.includes(text.toLowerCase()),'Missing real intent evidence on '+route+': '+text);
}

for(const [tier,count] of Object.entries({P0:25,P1:62,P2:7,EXCLUDE:37}))
 assert(counts[tier]===count,'Priority '+tier+': '+counts[tier]+' vs '+count);
assert(active===87,'Expected 87 approved active keyword mappings');
assert(rows.find(r=>r.keyword==='cost of pla per gram')?.destination==='/filament-cost-calculator/','PLA per-gram intent should go to dedicated tool');
const pricingMapped=rows.filter(r=>r.destination==='/3d-print-pricing-calculator/'&&['P0','P1'].includes(r.priority));
assert(pricingMapped.length===20,'Exactly 20 price/quote intents map to dedicated calculator');
assert(homepage.includes('href="/3d-print-pricing-calculator/"'),'Homepage links dedicated price calculator');
assert(app.includes("location.hash==='#pricing'"),'Original homepage pricing deep-link works');

const report=[
 '# Keyword implementation audit',
 'Imported: '+rows.length+' unique Semrush US query strings. Active mapped intent: '+active+' P0/P1 terms.',
 'P0 '+counts.P0+'; P1 '+counts.P1+'; P2 '+counts.P2+' deferred; '+counts.EXCLUDE+' excluded.',
 'Each active term is mapped to an EXISTING useful page or pricing mode. This does NOT prove that Google will rank it.',
 'Failures: '+errors.length,
 ...errors.map(e=>'- '+e)
].join('\n');
console.log(report);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report+'\n');
if(errors.length)process.exitCode=1;

