const { chromium } = require('C:/Users/User/node_modules/playwright');
const OUT='C:/Users/User/Downloads/rentify-national-challenge/assets/v6';
const ID='b5555555-5555-4555-8555-555555555555';
const tag=process.argv[2]||'before';
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 for (const [name,url] of [['sf-product',`http://localhost:4700/product/${ID}`],['mp-product',`http://localhost:4500/product/${ID}`]]) {
  await p.goto(url,{waitUntil:'networkidle',timeout:90000}); await p.waitForTimeout(4000);
  await p.screenshot({path:`${OUT}/${name}-${tag}.png`});
  const t=(await p.innerText('body')).replace(/\s+/g,' ');
  const i=t.search(/stock|left|available/i); console.log(name, t.slice(0,200),' ... STOCK:', t.slice(Math.max(0,i-80),i+80));
 }
 await b.close();
})();
