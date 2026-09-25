const { chromium } = require('C:/Users/User/node_modules/playwright');
const OUT='C:/Users/User/Downloads/rentify-national-challenge/assets/v6';
const ID='b5555555-5555-4555-8555-555555555555';
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1280,height:800},deviceScaleFactor:2})).newPage();
 async function mark(re){
   await p.evaluate((src)=>{const re=new RegExp(src,'i');
     const all=[...document.querySelectorAll('body *')].filter(e=>re.test(e.textContent)); const els=all.filter(e=>![...e.children].some(c=>re.test(c.textContent)));
     for(const e of els){e.style.outline='3px solid #F59E0B';e.style.outlineOffset='3px';e.style.borderRadius='4px';e.style.background='#FEF3C7';}
   }, re.source);
 }
 await p.goto(`http://localhost:4700/product/${ID}`,{waitUntil:'networkidle'}); await p.waitForTimeout(3500);
 await mark(/Maximum:\s*\d+/); await p.screenshot({path:`${OUT}/proof-storefront.png`});
 await p.goto(`http://localhost:4500/product/${ID}`,{waitUntil:'networkidle'}); await p.waitForTimeout(3500);
 await mark(/\d+ items in stock/); await p.screenshot({path:`${OUT}/proof-marketplace.png`});
 await b.close();
})();
