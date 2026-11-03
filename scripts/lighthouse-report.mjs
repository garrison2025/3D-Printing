import fs from 'node:fs';
const score=x=>x==null?null:Math.round(x*100);
const format=x=>x==null?'N/A':String(x);
const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
const checks=[
 ['home-mobile','Mobile sample 1'],
 ['home-mobile-2','Mobile sample 2'],
 ['home-mobile-3','Mobile sample 3'],
 ['home-desktop','Desktop']
];
const report=['# Lighthouse laboratory report — PrintCost Studio','',
 'Source: actual Chrome Lighthouse CLI against Cloudflare Pages staging. Not field Core Web Vitals.',
 'SEO scores intentionally excluded: temporary preview has noindex, per owner request.',
 'Mobile: three independent lab runs; use the median as the performance release gate to reduce transient CI noise.',''];
function metric(a,k){const n=a?.[k]?.numericValue;return n==null?'N/A':k==='cumulative-layout-shift'?n.toFixed(3):Math.round(n)+' ms'}
const rows=[];
for(const [file,label] of checks){
 const filename='qa-lighthouse/'+file+'.json';
 if(!fs.existsSync(filename))throw Error('Missing lighthouse JSON '+filename);
 const lhr=JSON.parse(fs.readFileSync(filename,'utf8'));
 if(lhr.runtimeError||!lhr.audits?.['largest-contentful-paint'])throw Error('Invalid Lighthouse run '+filename+': '+JSON.stringify(lhr.runtimeError));
 const cats=lhr.categories||{};
 const performance=score(cats.performance?.score),accessibility=score(cats.accessibility?.score),best=score(cats['best-practices']?.score);
 rows.push({file,label,performance,accessibility,best});
 report.push('## '+label+': performance '+format(performance)+'/100, accessibility '+format(accessibility)+'/100, best practices '+format(best)+'/100');
 report.push('FCP '+metric(lhr.audits,'first-contentful-paint')+'; LCP '+metric(lhr.audits,'largest-contentful-paint')+'; TBT '+metric(lhr.audits,'total-blocking-time')+'; CLS '+metric(lhr.audits,'cumulative-layout-shift'));
 report.push('Version '+String(lhr.lighthouseVersion||'unknown')+', final URL '+String(lhr.finalDisplayedUrl));
 const issues=Object.entries(lhr.audits).filter(([,v])=>v?.score!=null&&v.score<.9&&v.details?.type==='opportunity')
  .sort((a,b)=>(b[1].details.overallSavingsMs||0)-(a[1].details.overallSavingsMs||0)).slice(0,5);
 for(const [key,v] of issues)report.push('- Improvement: '+(v.title||key)+' '+(v.displayValue||'see JSON'));
 if(label.startsWith('Mobile')&&(lhr.audits?.['total-blocking-time']?.numericValue||0)>250){
  const tasks=lhr.audits?.['long-tasks']?.details?.items||[];
  report.push('- Long tasks: '+tasks.slice(0,4).map(x=>String(Math.round(x.duration||0))+'ms '+String(x.url||'inline')).join('; '));
 }
 report.push('');
}
const mobile=rows.filter(x=>x.label.startsWith('Mobile')).map(x=>x.performance);
const mobileMedian=mobile.every(x=>x!=null)?median(mobile):null;
const desktop=rows.find(x=>x.label==='Desktop');
report.push('## Mobile median: performance '+format(mobileMedian)+'/100 (raw samples: '+mobile.map(format).join(', ')+')');
report.push('## Desktop: performance '+format(desktop?.performance)+'/100, accessibility '+format(desktop?.accessibility)+'/100, best practices '+format(desktop?.best)+'/100');
report.push('Release threshold: mobile median >=95; desktop >=95; all measured accessibility and best-practices scores >=95.','');
const healthy=mobileMedian!=null&&mobileMedian>=95&&desktop?.performance>=95&&rows.every(x=>x.accessibility!=null&&x.accessibility>=95&&x.best!=null&&x.best>=95);
report.push(healthy?'PERFORMANCE RELEASE GATE PASSED':'PERFORMANCE RELEASE GATE FAILED');
const content=report.join('\n')+'\n';
fs.writeFileSync('qa-lighthouse/summary.md',content);console.log(content);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,content);
if(!healthy)process.exitCode=1;
