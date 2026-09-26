const { chromium } = require('C:/Users/User/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 await p.goto('https://rentify.mekhla.digital/',{waitUntil:'networkidle',timeout:60000}); await p.waitForTimeout(4000);
 await p.screenshot({path:'C:/Users/User/Downloads/rentify-national-challenge/assets/v6/live-rentify.png'});
 console.log((await p.title()), (await p.innerText('body')).replace(/\s+/g,' ').slice(0,300));
 await b.close();
})();
