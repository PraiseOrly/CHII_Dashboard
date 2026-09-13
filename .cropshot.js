const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2];
  const outPath = process.argv[3];
  const x = parseInt(process.argv[4]), y = parseInt(process.argv[5]), w = parseInt(process.argv[6]), h = parseInt(process.argv[7]);
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: y + h + 100 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: outPath, clip: { x, y, width: w, height: h } });
  await browser.close();
  console.log('Saved:', outPath);
})();
