// Captures fresh Rentify screenshots for the v6 deck from the local stack.
const { chromium } = require('C:/Users/User/node_modules/playwright');
const OUT = 'C:/Users/User/Downloads/rentify-national-challenge/assets/v6';
const fs = require('fs');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  const only = process.argv[2];

  if (!only || only === 'storefront') {
    await page.goto('http://localhost:4600/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${OUT}/storefront-hero.png` });
    await page.goto('http://localhost:4600/shop', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${OUT}/storefront-shop.png` });
  }

  if (!only || only === 'marketplace') {
    await page.goto('http://localhost:4500/', { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `${OUT}/marketplace-home.png` });
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${OUT}/marketplace-scroll.png` });
  }

  if (!only || only === 'pos') {
    await page.goto('http://localhost:4300/login?returnUrl=http://localhost:4400/overview', { waitUntil: 'domcontentloaded' });
    await page.fill('input[name="contact"]', 'merchant@rentify.local');
    await page.fill('input[name="password"]', 'Merchant@12345');
    await page.click('button[type="submit"]');
    await page.waitForURL(u => u.toString().includes(':4400'), { timeout: 20000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${OUT}/merchant-overview.png` });
    await page.goto('http://localhost:4400/products', { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${OUT}/merchant-products.png` });
    await page.goto('http://localhost:4400/pos', { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForSelector('button:has-text("Add")', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const adds = await page.$$('button:has-text("Add")');
    for (const b of adds.slice(0, 2)) { await b.click().catch(() => {}); await page.waitForTimeout(500); }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/pos-cart.png` });
  }
  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
