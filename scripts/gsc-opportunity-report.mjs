import fs from 'node:fs';
import path from 'node:path';
// Offline-only GSC Pages export review. No APIs or private data uploads.
const origin='https://3dprintcostcalculator.org';
const canon=['/','/3d-print-pricing-calculator/','/filament-cost-calculator/','/3d-printing-cost-per-hour/','/how-much-does-3d-printing-cost/','/how-to-price-3d-prints/','/calculation-methodology/','/3d-print-cost-calculator-excel/','/about/','/privacy/','/terms/','/contact/'];
export function parseCsv(s){
 const rows=[];let cols=[],cell='',quote=false;
 s=String(s).replace(/^\uFEFF/,'');
 for(let i=0;i<s.length;i++){
  const c=s[i];
  if(c==='"'){if(quote&&s[i+1]==='"'){cell+='"';i++}else quote=!quote}
  else if(c===','&&!quote){cols.push(cell.trim());cell=''}
  else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&s[i+1]==='\n')i++;cols.push(cell.trim());if(cols.some(Boolean))rows.push(cols);cols=[];cell=''}
  else cell+=c;
 }
 if(quote)throw Error('Invalid CSV quote');
 cols.push(cell.trim());if(cols.some(Boolean))rows.push(cols);
 const header=(rows.shift()||[]).map(k=>k.toLowerCase().replace(/[^a-z]/g,''));
 return rows.map(r=>Object.fromEntries(header.map((k,i)=>[k,r[i]||''])));
}
export function review(pagesCsv,pairsCsv=''){
 const pageRows=parseCsv(pagesCsv),pairRows=pairsCsv?parseCsv(pairsCsv):[];
 if(!pageRows.length)throw Error('No GSC Page data supplied; index coverage unknown.');
 const pageStats=new Map(),overlap=new Map();let ignored=0;
 function clean(url){
  try{const u=new URL(url,origin);return u.origin===origin?(u.pathname.endsWith('/')?u.pathname:u.pathname+'/'):null}catch{return null}
 }
 for(const r of pageRows){
  const p=clean(r.page||r.pages||r.url||'');
  const impressions=Number(r.impressions),clicks=Number(r.clicks),position=Number(r.position);
  if(!canon.includes(p)||!Number.isFinite(impressions)||!Number.isFinite(clicks)||!Number.isFinite(position)||impressions<0||clicks<0||clicks>impressions){ignored++;continue}
  pageStats.set(p,{impressions,clicks,position,ctr:impressions?100*clicks/impressions:0});
 }
 for(const r of pairRows){
  const p=clean(r.page||r.pages||r.url||''),q=(r.query||r.queries||'').toLowerCase().trim(),n=Number(r.impressions);
  if(!canon.includes(p)||!q||!Number.isFinite(n)||n<10)continue;
  if(!overlap.has(q))overlap.set(q,new Map());
  overlap.get(q).set(p,n);
 }
 const out=['# Evidence-based Search Console review','', '| Page | Clicks | Impressions | CTR | Position | Priority |','|---|---:|---:|---:|---:|---|'];
 for(const p of canon){
  const x=pageStats.get(p);
  if(!x){out.push('| '+p+' | — | — | — | — | Missing from export; NOT proof of non-indexing |');continue}
  const status=x.impressions>=50&&x.clicks===0?'Inspect query intent and snippet':x.impressions>=50&&x.position<=10&&x.ctr<2?'Review snippet CTR':x.impressions>=50&&x.position>10?'Improve page-query fit':'Monitor';
  out.push('| '+p+' | '+x.clicks+' | '+x.impressions+' | '+x.ctr.toFixed(2)+'% | '+x.position.toFixed(1)+' | '+status+' |');
 }
 out.push('','Ignored rows: '+ignored,'.');
 if(!pairsCsv){out.push('No joint Page+Query data provided: cannibalization cannot be inferred from separate aggregate exports.')}
 else{
  const multi=[...overlap].filter(([q,v])=>v.size>=2).sort((a,b)=>[...b[1].values()].reduce((x,y)=>x+y,0)-[...a[1].values()].reduce((x,y)=>x+y,0)).slice(0,20);
  out.push('','## Potential shared-query page impressions');
  if(!multi.length)out.push('No shared query with >=10 impressions per page.');
  for(const [q,items] of multi)out.push('- '+q+': '+[...items].map(([p,n])=>p+' '+n).join(' | '));
  out.push('Shared queries are not automatically harmful. Verify actual intent and ranking changes before combining pages.');
 }
 out.push('This does not establish indexed status. Check GSC Page Indexing and URL Inspection independently.');
 return out.join('\n')+'\n';
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
 const ix=process.argv.indexOf('--pages'),px=process.argv.indexOf('--pairs');
 if(ix<0||!process.argv[ix+1]){console.error('Usage: node scripts/gsc-opportunity-report.mjs --pages pages.csv [--pairs joint-page-query.csv]');process.exitCode=1}
 else try{console.log(review(fs.readFileSync(process.argv[ix+1],'utf8'),px>0?fs.readFileSync(process.argv[px+1],'utf8'):''))}catch(e){console.error(e.message);process.exitCode=1}
}
