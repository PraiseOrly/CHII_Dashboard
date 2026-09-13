const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2];
  const outPath = process.argv[3];
  const width = parseInt(process.argv[4] || '1440', 10);
  const height = parseInt(process.argv[5] || '900', 10);
  const fullPage = process.argv[6] === 'full';

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(String(err)));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: outPath, fullPage });
  await browser.close();
  if (errors.length) {
    console.log('CONSOLE ERRORS:');
    errors.forEach(e => console.log(' -', e));
  } else {
    console.log('No console errors.');
  }
  console.log('Saved:', outPath);
})();
