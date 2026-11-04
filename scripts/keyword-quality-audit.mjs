import fs from 'node:fs';
import path from 'node:path';

/**
 * An explicit 94-term, search-intent review. This checks research provenance and
 * implemented landing-page contracts; it CANNOT certify rankings, GSC, SERP fit,
 * indexing or actual live browser behavior.
 */
const source=JSON.parse(fs.readFileSync('src/content/keyword-intent-map.json','utf8')).keywords;
const approved=source.filter(r=>['P0','P1','P2'].includes(r.priority));
const expectedHeaders=['keyword','priority','us_volume_20261102','kd_20261102','mapped_page','assessment','scope_gap','next_action','gsc_verified'];
const statuses=new Set(['IMPLEMENTATION_FIT_UNVERIFIED','INTENT_AMBIGUITY','EVIDENCE_GAP','INTENT_MISMATCH_RISK']);
function csvParse(input){
 const result=[]; let row=[],value='',quoted=false;
 for(let i=0;i<input.length;i++){
  const char=input[i];
  if(char==='"'){
   if(quoted&&input[i+1]==='"'){value+='"';i++}else quoted=!quoted;
  }else if(char===','&&!quoted){row.push(value);value=''}
  else if((char==='\n'||char==='\r')&&!quoted){
   if(char==='\r'&&input[i+1]==='\n')i++;
   if(row.length||value){row.push(value);result.push(row);row=[];value=''}
  }else value+=char;
 }
 if(quoted)throw Error('Unterminated CSV quoting');
 if(row.length||value){row.push(value);result.push(row)}
 return result;
}
const raw=csvParse(fs.readFileSync('data/keyword-intent-review.csv','utf8'));
if(JSON.stringify(raw[0])!==JSON.stringify(expectedHeaders))throw Error('Review CSV header drift');
const review=raw.slice(1).map(values=>{
 if(values.length!==expectedHeaders.length)throw Error('Review CSV column count '+values.length);
 return Object.fromEntries(expectedHeaders.map((k,i)=>[k,values[i]]));
});
const errors=[];
const assert=(ok,message)=>{if(!ok)errors.push(message)};
assert(approved.length===94,'Source should contain 94 approved mapped queries');
assert(review.length===approved.length,'Every approved keyword needs one human-readable review row');
const sourceMap=new Map(approved.map(x=>[x.keyword,x]));
const seen=new Set(),categoryCounts={},routeCounts={},riskRows=[];
const evidence={
 '/':['id="cost-form"','id="pricing"'],
 '/3d-print-pricing-calculator/':['data-pricing-calculator','id="price-quote-results"','data-quote-intent-switch'],
 '/filament-cost-calculator/':['data-seo-calculator="filament"','id="seo-result"'],
 '/3d-printing-cost-per-hour/':['data-seo-calculator="hourly"','id="seo-result"'],
 '/how-much-does-3d-printing-cost/':['id="cost-by-example"','Worked example'],
 '/how-to-price-3d-prints/':['Margin','Markup'],
 '/3d-print-cost-calculator-excel/':['download="3d-print-cost-calculator-template.xlsx"'],
 '/calculation-methodology/':['data-cost-comparison'],
 '/es/calculadora-precios-impresion-3d/':['data-es-price-calculator']
};
const pageCache=new Map();
for(const row of review){
 const keyword=row.keyword.trim(),sourceRow=sourceMap.get(keyword);
 assert(Boolean(sourceRow),'No approved source row for '+keyword);
 assert(!seen.has(keyword),'Duplicate review for '+keyword);seen.add(keyword);
 if(!sourceRow)continue;
 assert(row.priority===sourceRow.priority,'Priority drift for '+keyword);
 assert(row.mapped_page===sourceRow.destination,'Destination drift for '+keyword);
 assert(Number(row.us_volume_20261102)===sourceRow.us_volume,'Semrush volume drift for '+keyword);
 assert(Number(row.kd_20261102)===sourceRow.kd,'Semrush KD drift for '+keyword);
 assert(statuses.has(row.assessment),'Unknown intent-review state for '+keyword);
 assert(row.scope_gap.length>20&&row.next_action.length>20,'Review needs reason and next step: '+keyword);
 assert(row.gsc_verified==='NOT_VERIFIED','GSC is not connected here: do not mark a keyword verified without evidence: '+keyword);
 categoryCounts[row.assessment]=(categoryCounts[row.assessment]||0)+1;
 routeCounts[row.mapped_page]=(routeCounts[row.mapped_page]||0)+1;
 const markers=evidence[row.mapped_page];
 assert(Boolean(markers),'Missing route-specific implementation contract for '+keyword);
 if(markers){
  if(!pageCache.has(row.mapped_page)){
   const file=path.join('dist',row.mapped_page.slice(1),'index.html');
   pageCache.set(row.mapped_page,fs.existsSync(file)?fs.readFileSync(file,'utf8'):null);
  }
  const html=pageCache.get(row.mapped_page);
  assert(Boolean(html),'Built landing page missing for '+keyword);
  if(html){
   assert(/<h1(?:\s|>)/i.test(html),'Missing H1 for '+keyword);
   assert(html.includes('<link rel="canonical"'),'Missing canonical for '+keyword);
   assert(html.includes('<meta name="description"'),'Missing description for '+keyword);
   for(const marker of markers)assert(html.toLowerCase().includes(marker.toLowerCase()),'Task evidence missing: '+keyword+' :: '+marker);
  }
 }
 if(row.assessment!=='IMPLEMENTATION_FIT_UNVERIFIED')riskRows.push(row);
}
for(const row of approved)assert(seen.has(row.keyword),'Unreviewed approved keyword: '+row.keyword);
for(const keyword of ['3d printer price calculator','3d print cost calculator app']){
 const flagged=review.find(x=>x.keyword===keyword);
 assert(flagged?.assessment==='INTENT_MISMATCH_RISK','Do not silently approve product-vs-service or downloadable-app search intent: '+keyword);
}
const md=[
 '# Keyword intent implementation review — source snapshot 2026-11-02',
 '',
 '**Audit type:** static implementation contract + editorial search-intent risk triage. **NOT** GSC performance, indexing, live rank or Google SERP validation.',
 '',
 'Approved mapped keyword strings: '+approved.length+' (P0 25, P1 62, P2 7). No new routes or keywords were added.',
 '',
 '## Provisional classifications',
 '',
 '| Classification | Count | Meaning |',
 '|---|---:|---|',
 ...[...statuses].map(s=>'| '+s+' | '+(categoryCounts[s]||0)+' | '+(s==='IMPLEMENTATION_FIT_UNVERIFIED'?'Task-aligned in current implementation; still requires GSC/SERP evidence.':'Needs a targeted question or stronger external evidence before claiming full intent coverage.')+' |'),
 '',
 '## Existing destination allocation',
 '',
 '| Existing route | Queries |',
 '|---|---:|',
 ...Object.entries(routeCounts).sort((a,b)=>b[1]-a[1]).map(([route,count])=>'| `'+route+'` | '+count+' |'),
 '',
 '## Review queue — flagged individual queries',
 '',
 '| Exact source query | Volume (US estimate) | Route | Classification | Reason and next step |',
 '|---|---:|---|---|---|',
 ...riskRows.sort((a,b)=>Number(b.us_volume_20261102)-Number(a.us_volume_20261102)).map(r=>'| '+r.keyword.replaceAll('|','/')+' | '+r.us_volume_20261102+' | `'+r.mapped_page+'` | '+r.assessment+' | '+r.scope_gap.replaceAll('|','/')+' '+r.next_action.replaceAll('|','/')+' |'),
 '',
 'Complete one-to-one 94-row list: `data/keyword-intent-review.csv`.',
 '',
 '## Evidence gate',
 '',
 '- The `data/keyword-intent-review.csv` classification is a **provisional editorial audit** based on source terms and actual page scope; it is not an observed Google SERP or a survey.',
 '- Volume/KD come from the supplied **2026-11-02 Semrush US snapshot of competitor queries**, not from this site’s own traffic.',
 '- `NOT_VERIFIED` under GSC is intentional until the domain/account supplies Search Console evidence.',
 '- Priority: avoid misleading promises of a live print-shop quote, a downloadable application, a machine purchase-price estimator or a researched universal market average.',
 '- Keep the same nine task-distinct mapped routes. Revise existing pages only after measuring actual query/page mismatch.',
 '',
 '## CI',
 '',
 'Errors: '+errors.length,
 ...errors.map(e=>'- '+e),
 ''
].join('\n');
fs.mkdirSync('qa-seo',{recursive:true});
fs.writeFileSync('qa-seo/keyword-intent-review.md',md);
console.log('# 94-query static quality audit');
console.log('mapped='+approved.length+' routes='+Object.keys(routeCounts).length+' classifications='+JSON.stringify(categoryCounts)+' errors='+errors.length);
for(const problem of errors)console.error('FAIL '+problem);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,md.slice(0,11000)+'\n');
if(errors.length)process.exitCode=1;
