const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2];
  const outPath = process.argv[3];
  const selector = process.argv[4];
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  const el = await page.locator(selector);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await el.screenshot({ path: outPath });
  await browser.close();
  console.log('Saved:', outPath);
})();
