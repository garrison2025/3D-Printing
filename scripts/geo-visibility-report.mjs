/** Offline snapshots of manually observed AI search results, never automatic claims. */
import fs from 'node:fs';
import {parseCsv} from './gsc-opportunity-report.mjs';
const SITE='https://3dprintcostcalculator.org';
const PLATFORMS=['ChatGPT Search','Google AI Overviews','Google AI Mode','Perplexity','Claude Search'];
const STATES=['not_checked','cited','mentioned','not_cited'];
function validDate(x){return /^\d{4}-\d{2}-\d{2}$/.test(x||'')&&!Number.isNaN(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;}
function canonicalUrl(u){try{const x=new URL(u);return x.origin===SITE&&!x.username&&!x.password&&x.protocol==='https:'}catch{return false}}
export function visibilityReport(raw){
 const rows=parseCsv(raw);
 if(!rows.length)throw Error('No rows: use the supplied GEO visibility CSV template.');
 const counts=Object.fromEntries(PLATFORMS.map(p=>[p,{tested:0,cited:0,mentioned:0,not_cited:0,pending:0}]));
 const invalid=[];const keys=new Set();
 rows.forEach((r,i)=>{
  const errors=[],status=r.status||'not_checked';
  if(!PLATFORMS.includes(r.platform))errors.push('unknown search surface');
  if(!r.query?.trim())errors.push('missing query');
  if(!STATES.includes(status))errors.push('unknown status');
  const checked=status!=='not_checked';
  if(checked){
   if(!validDate(r.observed_date))errors.push('missing/invalid observation date');
   if(!r.evidence?.trim())errors.push('missing screenshot or response permalink');
   if(status==='cited'&&!canonicalUrl(r.cited_url))errors.push('linked citation must be the real owned domain');
  }else if(r.cited_url?.trim())errors.push('unmeasured row cannot have cited URL');
  const key=[r.platform,r.query?.toLowerCase().trim(),r.observed_date||'pending'].join('|');
  if(keys.has(key))errors.push('duplicate surface/query/date');
  keys.add(key);
  if(errors.length){invalid.push({line:i+2,errors});return}
  const entry=counts[r.platform];
  if(status==='not_checked')entry.pending++;
  else{entry.tested++;entry[status]++}
 });
 const out=['# GEO search visibility: manual verified observations',
  'No AI search API, bot-identity verification, hidden ranking data, or automatic citation assumptions.',
  '',
  '| Search surface | Tested | Real links | Name only | Not cited | Pending |',
  '|---|---:|---:|---:|---:|---:|',
  ...Object.entries(counts).map(([p,c])=>'| '+p+' | '+c.tested+' | '+c.cited+' | '+c.mentioned+' | '+c.not_cited+' | '+c.pending+' |')
 ];
 const measured=Object.values(counts).reduce((a,c)=>a+c.tested,0);
 const cited=Object.values(counts).reduce((a,c)=>a+c.cited,0);
 out.push('',measured?'Observed citation share in this manual sample: '+(100*cited/measured).toFixed(1)+'% ('+cited+'/'+measured+').':'No verified observations. Citation share is UNKNOWN, not zero percent.');
 for(const r of invalid)out.push('INVALID line '+r.line+': '+r.errors.join(', '));
 out.push('Checked snapshots do not prove general AI search rank, crawl access, referral traffic or model training inclusion.');
 return {report:out.join('\n')+'\n',counts,invalid};
}
if(process.argv[1]?.endsWith('geo-visibility-report.mjs')){
 const p=process.argv[2];
 if(!p){console.error('Usage: node scripts/geo-visibility-report.mjs path/to/observations.csv');process.exitCode=1}
 else try{const result=visibilityReport(fs.readFileSync(p,'utf8'));console.log(result.report);if(result.invalid.length)process.exitCode=1}catch(e){console.error(e.message);process.exitCode=1}
}
