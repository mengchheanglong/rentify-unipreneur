// Redesigned-POS sale: capture before, sell 1 perfume (cash), capture after on every channel.
const { chromium } = require('C:/Users/User/node_modules/playwright');
const OUT='C:/Users/User/Downloads/rentify-national-challenge/assets/v6/r2';
const ID='d7777777-7777-4777-8777-777777777777', NAME='Yes I Am The Queen';
require('fs').mkdirSync(OUT,{recursive:true});
async function mark(p, src){ await p.evaluate((src)=>{const re=new RegExp(src,'i');
  const all=[...document.querySelectorAll('body *')].filter(e=>re.test(e.textContent)&&e.offsetParent!==null);
  for(const e of all.filter(e=>![...e.children].some(c=>re.test(c.textContent)))){e.style.outline='4px solid #F59E0B';e.style.outlineOffset='3px';e.style.borderRadius='4px';e.style.background='#FEF3C7';}}, src); }
(async()=>{
 const b=await chromium.launch({headless:true});
 const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5}); const p=await ctx.newPage();
 const shots=async(tag)=>{
   await p.goto(`http://localhost:4700/product/${ID}`,{waitUntil:'networkidle'}); await p.waitForTimeout(3000);
   if(tag==='after') await mark(p,'^\s*In stock\s*$'); await p.screenshot({path:`${OUT}/sf-${tag}.png`});
   await p.goto(`http://localhost:4500/product/${ID}`,{waitUntil:'networkidle'}); await p.waitForTimeout(3000);
   const t=(await p.innerText('body')).replace(/\s+/g,' '); const i=t.search(/items in stock/); console.log(tag,'mp:',t.slice(i-6,i+15));
   if(tag==='after') await mark(p,'\d+ items in stock'); await p.screenshot({path:`${OUT}/mp-${tag}.png`});
 };
 if(process.argv[2]!=='skipbefore') await shots('before');
 await p.goto('http://localhost:4300/login?returnUrl=http://localhost:4400/overview',{waitUntil:'domcontentloaded'});
 await p.fill('input[name="contact"]','merchant@rentify.local'); await p.fill('input[name="password"]','Merchant@12345');
 await p.click('button:has-text("Sign In")'); await p.waitForURL(u=>u.toString().includes(':4400'),{timeout:30000});
 await p.goto('http://localhost:4400/pos',{waitUntil:'networkidle'}).catch(()=>{}); await p.waitForTimeout(3000);
 await p.fill('input[placeholder*="Search products" i]', NAME); await p.waitForTimeout(1500);
 await p.screenshot({path:`${OUT}/pos-search.png`});
 // add: click the cart button inside the product card
 const card=p.locator(`text=${NAME}`).first().locator('xpath=ancestor::*[.//button][1]');
 await card.locator('button').last().click(); await p.waitForTimeout(1500);
 await p.screenshot({path:`${OUT}/pos-cart.png`});
 await p.click('button:has-text("Cash")').catch(()=>{}); await p.waitForTimeout(600);
 await p.screenshot({path:`${OUT}/pos-cash.png`});
 await p.click('button:has-text("Charge")'); await p.waitForTimeout(2500);
 const btns=await p.$$eval('button',els=>els.map(e=>e.innerText.trim().replace(/\s+/g,' ')).filter(Boolean)); console.log('after charge buttons', [...new Set(btns)].slice(-15));
 await p.screenshot({path:`${OUT}/pos-charge.png`});
 await p.click('button:has-text("Exact")'); await p.waitForTimeout(500);
 await p.screenshot({path:`${OUT}/pos-pay.png`});
 await p.click('button:has-text("Complete cash Payment")'); await p.waitForTimeout(3500);
 await p.screenshot({path:`${OUT}/pos-receipt.png`});
 const r=await (await fetch('http://localhost:4001/api/product/stores/ef94ec36-c9a8-4ce7-ab45-8dcced0d5052')).json();
 console.log('stock now', r.products.find(x=>x.name===NAME).stockQuantity);
 await p.goto('http://localhost:4400/products',{waitUntil:'networkidle'}).catch(()=>{}); await p.waitForTimeout(3000);
 const row=p.locator(`tr:has-text("${NAME}")`).first();
 if(await row.count()){ await row.evaluate(r=>{r.style.background='#FEF3C7'; r.style.outline='4px solid #F59E0B';}); console.log('row', (await row.innerText()).replace(/\s+/g,' ')); }
 await p.screenshot({path:`${OUT}/dash-after.png`});
 await shots('after');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
