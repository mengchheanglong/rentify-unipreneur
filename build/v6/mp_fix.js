const { chromium } = require('C:/Users/User/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 await p.goto('http://localhost:4500/product/d7777777-7777-4777-8777-777777777777',{waitUntil:'networkidle'}); await p.waitForTimeout(3000);
 const n=await p.evaluate(()=>{const re=/\d+ items in stock/i;
  const all=[...document.querySelectorAll('body *')].filter(e=>re.test(e.textContent)&&e.offsetParent!==null);
  const els=all.filter(e=>![...e.children].some(c=>re.test(c.textContent)));
  for(const e of els){e.style.outline='4px solid #F59E0B';e.style.outlineOffset='3px';e.style.borderRadius='4px';e.style.background='#FEF3C7';} return els.length;});
 console.log('marked',n);
 await p.screenshot({path:'C:/Users/User/Downloads/rentify-national-challenge/assets/v6/r2/mp-after.png'});
 await b.close();
})();
