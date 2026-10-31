import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({headless:true});
try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const origin = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3127';
  await page.goto(origin + '/journey', {waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'Seven days of better discovery'}).waitFor();
  assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'0');
  await page.getByLabel('I completed this activity').check();
  await page.getByLabel('Optional reflection (max 300 characters)').fill('Loved trying jazz after breakfast.');
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.getByLabel('I completed this activity').isChecked(),true);
  assert.equal(await page.getByLabel('Optional reflection (max 300 characters)').inputValue(),'Loved trying jazz after breakfast.');
  assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'1');
  await page.getByRole('button',{name:/Day 2:/}).click();
  assert.equal(await page.getByRole('heading',{name:'Morning Ritual'}).isVisible(),true);
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'Delete my journey data'}).click();
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'0');
  assert.equal(await page.getByLabel('Optional reflection (max 300 characters)').inputValue(),'');
  assert.equal(await page.getByLabel('I completed this activity').isChecked(),false);
  const before=await page.evaluate(()=>Object.keys(localStorage));
  assert.equal(before.includes('carli-taste-journey-v1'),true);
  console.log('JOURNEY_BROWSER_SMOKE_PASS');
} finally { await browser.close(); }
