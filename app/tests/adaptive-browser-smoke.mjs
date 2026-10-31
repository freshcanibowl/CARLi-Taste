import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const base=process.env.SMOKE_BASE_URL||'http://127.0.0.1:3127';
 const payload={status:'CULTURAL_CANDIDATES_UNVERIFIED',notice:'No venue is approved for a pet visit.',candidates:[
  {id:'alpha',name:'Generic Hall',category:'urn:entity',petPolicy:'UNVERIFIED',actionable:false},
  {id:'beta',name:'Jazz Music Hall',category:'urn:entity',petPolicy:'UNVERIFIED',actionable:false},
  {id:'gamma',name:'Community Garden',category:'urn:entity',petPolicy:'UNVERIFIED',actionable:false}
 ]};
 let bodySent;
 await page.route('**/api/recommend',async route=>{bodySent=JSON.parse(route.request().postData()||'{}');await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(payload)})});
 await page.goto(base+'/',{waitUntil:'networkidle'});
 assert.equal(await page.getByLabel('Use my local Journey ratings and venue feedback to reorder results').isChecked(),false);
 await page.getByRole('button',{name:'Explore cultural matches'}).click();
 let cards=page.locator('article');
 await cards.first().waitFor();
 assert.match(await cards.first().innerText(),/Generic Hall/);
 assert.ok(!JSON.stringify(bodySent).includes('journey'));
 assert.equal(await page.getByText('Category: Cultural place').count(),3);
 await page.getByLabel('Use my local Journey ratings and venue feedback to reorder results').check();
 await page.getByRole('button',{name:'Like Community Garden'}).click();
 assert.match(await cards.first().innerText(),/Community Garden/);
 assert.match(await cards.first().innerText(),/Local adjustment: 10/);
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.getByLabel('Use my local Journey ratings and venue feedback to reorder results').isChecked(),true);
 await page.getByRole('button',{name:'Explore cultural matches'}).click();
 await cards.first().waitFor();
 assert.match(await cards.first().innerText(),/Community Garden/);
 assert.match(await cards.first().innerText(),/UNVERIFIED/);
 assert.ok(!JSON.stringify(bodySent).includes('gamma'));
 page.once('dialog',d=>d.accept());
 await page.getByRole('button',{name:'Delete local taste feedback'}).click();
 assert.equal(await page.getByLabel('Use my local Journey ratings and venue feedback to reorder results').isChecked(),false);
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.getByLabel('Use my local Journey ratings and venue feedback to reorder results').isChecked(),false);
 console.log('ADAPTIVE_BROWSER_SMOKE_PASS');
}finally{await browser.close()}
