const { chromium } = require('C:/Users/User/node_modules/playwright');
(async()=>{ const b=await chromium.launch({headless:true}); const p=await b.newPage();
 await p.goto('https://rentify-market.mekhla.digital/stores',{waitUntil:'networkidle',timeout:60000}); await p.waitForTimeout(3000);
 const t=(await p.innerText('body')); console.log('Elora on /stores:', /elora/i.test(t)); console.log(t.replace(/\s+/g,' ').slice(0,400)); await b.close(); })();
