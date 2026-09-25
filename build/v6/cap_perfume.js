// Captures the "Yes I Am The Queen" demo product on every channel (tag: before|after).
const { chromium } = require('C:/Users/User/node_modules/playwright');
const OUT='C:/Users/User/Downloads/rentify-national-challenge/assets/v6';
const ID='d7777777-7777-4777-8777-777777777777', NAME='Yes I Am The Queen';
const tag=process.argv[2]||'before';
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 for (const [name,url] of [['q-sf',`http://localhost:4700/product/${ID}`],['q-mp',`http://localhost:4500/product/${ID}`]]) {
  await p.goto(url,{waitUntil:'networkidle',timeout:90000}); await p.waitForTimeout(3500);
  await p.screenshot({path:`${OUT}/${name}-${tag}.png`});
  const t=(await p.innerText('body')).replace(/\s+/g,' ');
  const i=t.search(/in stock|left|available|units/i); console.log(name, '...', t.slice(Math.max(0,i-120),i+60));
 }
 await p.goto('http://localhost:4300/login?returnUrl=http://localhost:4400/overview',{waitUntil:'domcontentloaded'});
 await p.fill('input[name="contact"]','merchant@rentify.local'); await p.fill('input[name="password"]','Merchant@12345');
 await p.click('button[type="submit"]'); await p.waitForURL(u=>u.toString().includes(':4400'),{timeout:20000});
 await p.goto('http://localhost:4400/pos',{waitUntil:'networkidle'}).catch(()=>{});
 await p.waitForSelector('button:has-text("Add")',{timeout:20000});
 await p.fill('input[placeholder*="Search products" i]', NAME); await p.waitForTimeout(1200);
 const card=await p.$(`.group.relative.overflow-hidden:has-text("${NAME}")`);
 await (await card.$('button:has-text("Add")')).click(); await p.waitForTimeout(1200);
 await p.screenshot({path:`${OUT}/q-pos-${tag}.png`});
 if (tag==='sell') {
  await p.click('button:has-text("Proceed to Checkout")'); await p.waitForTimeout(1200);
  const cash=await p.$('button:has-text("Cash"), button:has-text("Pay with cash")'); if(cash){await cash.click(); await p.waitForTimeout(400);}
  const exact=await p.$('button:has-text("Exact")'); if(exact){await exact.click(); await p.waitForTimeout(400);}
  const done=await p.$('button:has-text("Complete cash Payment"), button:has-text("Pay $"), button:has-text("Complete Payment")');
  await done.click(); await p.waitForTimeout(3500);
  await p.screenshot({path:`${OUT}/q-pos-receipt.png`});
 }
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
