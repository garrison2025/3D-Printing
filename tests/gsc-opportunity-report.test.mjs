import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCsv,review} from '../scripts/gsc-opportunity-report.mjs';
test('quoted and CRLF CSV fields are parsed without network access',()=>{
 assert.equal(parseCsv('Page,Clicks,Impressions,Position\r\n"https://3dprintcostcalculator.org/",2,200,5.3\r\n')[0].page,'https://3dprintcostcalculator.org/');
 assert.equal(parseCsv('Query,Impressions\n"filament, grams",12')[0].query,'filament, grams');
});
test('pages data alone never fabricates query overlap or indexing state',()=>{
 const data='Page,Clicks,Impressions,Position\nhttps://3dprintcostcalculator.org/,0,120,7\n';
 const output=review(data);
 assert.match(output,/Inspect query intent and snippet/);
 assert.match(output,/cannibalization cannot be inferred/);
 assert.match(output,/NOT proof of non-indexing/);
});
test('joint Page+Query evidence flags possible overlap without claiming harmful cannibalization',()=>{
 const pages='Page,Clicks,Impressions,Position\nhttps://3dprintcostcalculator.org/,1,20,8\n';
 const joint='Page,Query,Impressions\nhttps://3dprintcostcalculator.org/,3d print price calculator,40\nhttps://3dprintcostcalculator.org/3d-print-pricing-calculator/,3d print price calculator,32\n';
 const output=review(pages,joint);
 assert.match(output,/3d print price calculator/);
 assert.match(output,/not automatically harmful/);
});
