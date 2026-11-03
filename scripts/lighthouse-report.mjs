import fs from 'node:fs';
const plans=[['home-mobile','Mobile'],['home-desktop','Desktop']];
const rows=[];
const score=x=>x==null?'N/A':String(Math.round(x*100));
function metric(a,k){const n=a?.[k]?.numericValue;return n==null?'N/A':k==='cumulative-layout-shift'?n.toFixed(3):Math.round(n)+' ms'}
const report=['# Lighthouse laboratory report — PrintCost Studio','','Source: actual Chrome Lighthouse CLI against Cloudflare Pages staging. Not field Core Web Vitals.','SEO scores intentionally excluded: temporary preview has noindex, per owner request.',''];
for(const [file,label] of plans){
 const filename='qa-lighthouse/'+file+'.json';
 if(!fs.existsSync(filename))throw Error('Missing lighthouse JSON '+filename);
 const lhr=JSON.parse(fs.readFileSync(filename,'utf8'));
 if(lhr.runtimeError || !lhr.audits?.['largest-contentful-paint'])throw Error('Invalid Lighthouse run '+filename+': '+JSON.stringify(lhr.runtimeError));
 const cats=lhr.categories||{};
 const performance=score(cats.performance?.score),accessibility=score(cats.accessibility?.score),best=score(cats['best-practices']?.score);
 rows.push({label,performance,accessibility,best});
 report.push('## '+label+': performance '+performance+'/100, accessibility '+accessibility+'/100, best practices '+best+'/100');
 report.push('FCP '+metric(lhr.audits,'first-contentful-paint')+'; LCP '+metric(lhr.audits,'largest-contentful-paint')+'; TBT '+metric(lhr.audits,'total-blocking-time')+'; CLS '+metric(lhr.audits,'cumulative-layout-shift'));
 report.push('Version '+String(lhr.lighthouseVersion||'unknown')+', final URL '+String(lhr.finalDisplayedUrl));
 const issues=Object.entries(lhr.audits).filter(([,v])=>v?.score!=null&&v.score<.9&&v.details?.type==='opportunity')
  .sort((a,b)=>(b[1].details.overallSavingsMs||0)-(a[1].details.overallSavingsMs||0)).slice(0,5);
 for(const [key,v] of issues)report.push('- Improvement: '+(v.title||key)+' '+(v.displayValue||'see JSON'));
 report.push('');
}
const content=report.join('\n')+'\n';fs.writeFileSync('qa-lighthouse/summary.md',content);console.log(content);
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,content);
if(rows.some(r=>r.performance==='N/A'))process.exitCode=1;
