const { chromium } = require('C:/Users/User/node_modules/playwright');
const OUT='C:/Users/User/Downloads/rentify-national-challenge/assets/v6';
const NAME='Deep Barrier Hydrating Cream';
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 await p.goto('http://localhost:4300/login?returnUrl=http://localhost:4400/overview',{waitUntil:'domcontentloaded'});
 await p.fill('input[name="contact"]','merchant@rentify.local'); await p.fill('input[name="password"]','Merchant@12345');
 await p.click('button[type="submit"]'); await p.waitForURL(u=>u.toString().includes(':4400'),{timeout:20000});
 await p.goto('http://localhost:4400/pos',{waitUntil:'networkidle'}).catch(()=>{});
 await p.waitForSelector('button:has-text("Add")',{timeout:20000});
 await p.fill('input[placeholder*="Search products" i]', NAME); await p.waitForTimeout(1000);
 const card=await p.$(`.group.relative.overflow-hidden:has-text("${NAME}")`);
 await (await card.$('button:has-text("Add")')).click(); await p.waitForTimeout(1000);
 await p.screenshot({path:`${OUT}/pos-sale-cart.png`});
 await p.click('button:has-text("Proceed to Checkout")'); await p.waitForTimeout(1200);
 const cash=await p.$('button:has-text("Cash"), button:has-text("Pay with cash")'); if(cash){await cash.click(); await p.waitForTimeout(400);}
 const exact=await p.$('button:has-text("Exact")'); if(exact){await exact.click(); await p.waitForTimeout(400);}
 await p.screenshot({path:`${OUT}/pos-sale-pay.png`});
 const done=await p.$('button:has-text("Complete cash Payment"), button:has-text("Pay $"), button:has-text("Complete Payment")');
 await done.click(); await p.waitForTimeout(3500);
 await p.screenshot({path:`${OUT}/pos-sale-receipt.png`});
 const r=await (await fetch('http://localhost:4001/api/product/stores/ef94ec36-c9a8-4ce7-ab45-8dcced0d5052')).json();
 console.log('stock now', r.products.find(x=>x.name===NAME).stockQuantity);
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
