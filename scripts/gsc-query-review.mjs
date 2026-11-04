import fs from 'node:fs';
import path from 'node:path';
// Read only: joins one real, page-filtered GSC Queries CSV with existing 94 source keywords.
// Never use this script with invented sample metrics for release evidence.
function csvRows(s){
 const out=[];let row=[],field='',q=false;s=s.replace(/^\uFEFF/,'');
 for(let i=0;i<s.length;i++){const c=s[i];
  if(c==='"'){if(q&&s[i+1]==='"'){field+='"';i++}else q=!q}
  else if(c===','&&!q){row.push(field);field=''}
  else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&s[i+1]==='\n')i++;if(row.length||field){row.push(field);out.push(row);row=[];field=''}}
  else field+=c
 }
 if(q)throw Error('Invalid CSV quoting');
 if(row.length||field){row.push(field);out.push(row)}
 return out;
}
const arg=k=>{const i=process.argv.indexOf(k);return i<0?'':process.argv[i+1]||''};
const file=arg('--csv'),page=arg('--page'),period=arg('--period'),country=arg('--country');
if(!file||!page||!period||!country){
 console.error('Usage: node scripts/gsc-query-review.mjs --csv gsc-private/pricing.csv --page /3d-print-pricing-calculator/ --period YYYY-MM-DD..YYYY-MM-DD --country US');
 process.exit(2);
}
if(!/^\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}$/.test(period))throw Error('Supply the real GSC period');
if(!/^[A-Z]{2}$/.test(country))throw Error('Supply the actual GSC country filter');
if(!path.resolve(file).includes('/gsc-private/'))console.warn('Privacy: place GSC exports under gitignored gsc-private/');
const original=JSON.parse(fs.readFileSync('src/content/keyword-intent-map.json','utf8')).keywords.filter(r=>r.priority!=='EXCLUDE');
if(!original.some(r=>r.destination===page))throw Error('Unknown existing mapped page');
const key=s=>String(s).trim().toLowerCase().replace(/\s+/g,' ');
const known=new Map(original.map(r=>[key(r.keyword),r]));
const input=csvRows(fs.readFileSync(file,'utf8'));
const header=input.shift()?.map(x=>x.trim().toLowerCase())||[];
const find=(...names)=>names.map(n=>header.indexOf(n)).find(i=>i>=0);
const id={q:find('top queries','query','search query'),clicks:find('clicks'),impr:find('impressions'),ctr:find('ctr'),pos:find('position','average position')};
if(Object.values(id).some(x=>x===undefined))throw Error('Expected GSC columns: Top queries, Clicks, Impressions, CTR, Position');
const num=(value,label)=>{const n=Number(String(value).replaceAll(',',''));if(!Number.isFinite(n)||n<0)throw Error('Invalid '+label+': '+value);return n};
const observed=input.filter(x=>x[id.q]?.trim()).map(x=>({
 query:x[id.q].trim(), clicks:num(x[id.clicks],'clicks'), impressions:num(x[id.impr],'impressions'), ctr:x[id.ctr], position:num(x[id.pos],'position'), term:known.get(key(x[id.q]))
}));
for(const r of observed)if(r.clicks>r.impressions)throw Error('Clicks exceed impressions for '+r.query);
const mapped=observed.filter(x=>x.term),right=mapped.filter(x=>x.term.destination===page),wrong=mapped.filter(x=>x.term.destination!==page);
const q=s=>String(s).replaceAll('|','/').replaceAll('\n',' ');
const rows=right.filter(x=>x.impressions>0&&x.position>=8&&x.position<=20).sort((a,b)=>b.impressions-a.impressions);
const report=['# GSC per-page review — private real CSV only','',
 'Page: '+page+' | GSC period: '+period+' | country: '+country,
 'Source: '+path.basename(file)+'; no numbers inferred or fabricated.','',
 'Exported queries: '+observed.length+'; matched source keywords: '+mapped.length+'; mapped to this page: '+right.length+'; observed on the wrong mapped page: '+wrong.length,'',
 '## Position 8–20: inspect exact search intent and snippet; do not assume a CTR gain','',
 '| Exact query | Clicks | Impressions | GSC CTR | Average position |','|---|---:|---:|---:|---:|',
 ...rows.map(x=>'| '+q(x.query)+' | '+x.clicks+' | '+x.impressions+' | '+q(x.ctr)+' | '+x.position+' |'),'',
 '## Queries currently mapped to a different page','',
 '| Query | Mapped route | Impressions |','|---|---|---:|',
 ...wrong.map(x=>'| '+q(x.query)+' | '+x.term.destination+' | '+x.impressions+' |'),'',
 'Caveat: anonymized GSC queries may be omitted from this export; rows need not sum to page totals. No website changes or API calls were made.'].join('\n');
console.log(report);
