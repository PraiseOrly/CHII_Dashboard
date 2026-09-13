const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2];
  const outPath = process.argv[3];
  const buttonText = process.argv[4];
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: buttonText, exact: true }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();
  console.log('Saved:', outPath);
})();
