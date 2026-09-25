const { chromium } = require('C:/Users/User/node_modules/playwright');
const OUT='C:/Users/User/Downloads/rentify-national-challenge/assets/v6';
const ID='d7777777-7777-4777-8777-777777777777', NAME='Yes I Am The Queen';
async function mark(p, src){ await p.evaluate((src)=>{const re=new RegExp(src,'i');
  const all=[...document.querySelectorAll('body *')].filter(e=>re.test(e.textContent)&&e.offsetParent!==null);
  const els=all.filter(e=>![...e.children].some(c=>re.test(c.textContent)));
  for(const e of els){e.style.outline='4px solid #F59E0B';e.style.outlineOffset='3px';e.style.borderRadius='4px';e.style.background='#FEF3C7';}
  return els.length;}, src); }
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 // storefront: look for any stock number
 await p.goto(`http://localhost:4700/product/${ID}`,{waitUntil:'networkidle'}); await p.waitForTimeout(3000);
 const html=await p.content(); console.log('sf has 39:', /\b39\b/.test(await p.innerText('body')), 'max attr:', (html.match(/max="?(\d+)/)||[])[1]);
 await mark(p,'^\s*In stock\s*$'); await p.screenshot({path:`${OUT}/q-sf-after.png`});
 await p.goto(`http://localhost:4500/product/${ID}`,{waitUntil:'networkidle'}); await p.waitForTimeout(3000);
 await mark(p,'39 items in stock'); await p.screenshot({path:`${OUT}/q-mp-after.png`});
 // merchant inventory
 await p.goto('http://localhost:4300/login?returnUrl=http://localhost:4400/overview',{waitUntil:'domcontentloaded'});
 await p.fill('input[name="contact"]','merchant@rentify.local'); await p.fill('input[name="password"]','Merchant@12345');
 await p.click('button[type="submit"]'); await p.waitForURL(u=>u.toString().includes(':4400'),{timeout:20000});
 await p.goto('http://localhost:4400/products',{waitUntil:'networkidle'}).catch(()=>{}); await p.waitForTimeout(3000);
 const row=await p.$(`tr:has-text("${NAME}")`); console.log('row:', row? (await row.innerText()).replace(/\s+/g,' '):'none');
 if(row){ await row.evaluate(r=>{r.style.background='#FEF3C7'; r.style.outline='4px solid #F59E0B';}); }
 await p.screenshot({path:`${OUT}/q-inv-after.png`});
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
