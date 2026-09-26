const { chromium } = require('C:/Users/User/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 await p.goto('http://localhost:4300/login?returnUrl=http://localhost:4400/overview',{waitUntil:'domcontentloaded'});
 await p.waitForTimeout(2500);
 const inputs=await p.$$eval('input',els=>els.map(e=>e.name+'|'+e.type+'|'+e.placeholder)); console.log('login inputs',inputs);
 const btns=await p.$$eval('button',els=>els.map(e=>e.innerText.trim()).filter(Boolean)); console.log('login buttons',btns.slice(0,10));
 await p.screenshot({path:'peek-login.png'});
 await b.close();
})();
