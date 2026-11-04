import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('offline GSC review matches exact existing query and catches route mismatch (synthetic fixture only)',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'printcost-gsc-synthetic-'));
 try{
  const file=path.join(dir,'synthetic.csv');
  fs.writeFileSync(file,[
   'Top queries,Clicks,Impressions,CTR,Position',
   '3d printing price calculator,3,12,25%,9',
   'filament cost calculator,1,5,20%,18',
   'unmapped synthetic query,0,100,0%,3'
  ].join('\n'));
  const args=['scripts/gsc-query-review.mjs','--csv',file,'--page','/3d-print-pricing-calculator/','--period','2026-10-01..2026-10-28','--country','US'];
  const p=spawnSync(process.execPath,args,{encoding:'utf8'});
  assert.equal(p.status,0,p.stderr);
  assert.match(p.stdout,/Exported queries: 3; matched source keywords: 2; mapped to this page: 1; observed on the wrong mapped page: 1/);
  assert.match(p.stdout,/3d printing price calculator \| 3 \| 12 \| 25% \| 9/);
  assert.match(p.stdout,/filament cost calculator \| \/filament-cost-calculator\/ \| 5/);
  const invalid=spawnSync(process.execPath,['scripts/gsc-query-review.mjs','--csv',file,'--page','/not-a-page/','--period','2026-10-01..2026-10-28','--country','US'],{encoding:'utf8'});
  assert.notEqual(invalid.status,0);
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
