import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  console.log('Navigating...');
  try {
    await page.goto('http://localhost:5173');
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.error('Nav error:', err);
  }
  
  await browser.close();
  console.log('Done.');
})();
