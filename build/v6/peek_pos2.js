const { chromium } = require('C:/Users/User/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 await p.goto('http://localhost:4300/login?returnUrl=http://localhost:4400/overview',{waitUntil:'domcontentloaded'});
 await p.fill('input[name="contact"]','merchant@rentify.local'); await p.fill('input[name="password"]','Merchant@12345');
 await p.click('button:has-text("Sign In")'); await p.waitForURL(u=>u.toString().includes(':4400'),{timeout:30000});
 await p.goto('http://localhost:4400/pos',{waitUntil:'networkidle'}).catch(()=>{});
 await p.waitForTimeout(4000);
 console.log('url', p.url());
 const btns=await p.$$eval('button',els=>els.map(e=>e.innerText.trim().replace(/\s+/g,' ')).filter(Boolean)); console.log('buttons',[...new Set(btns)].slice(0,40));
 const inputs=await p.$$eval('input',els=>els.map(e=>e.placeholder)); console.log('inputs',inputs);
 await p.screenshot({path:'peek-pos.png'});
 await b.close();
})();
