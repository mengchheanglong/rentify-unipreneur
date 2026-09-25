const { chromium } = require('C:/Users/User/node_modules/playwright');
const OUT='C:/Users/User/Downloads/rentify-national-challenge/assets/v6';
(async()=>{
 const b=await chromium.launch({headless:true});
 const p=await (await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5})).newPage();
 for (const port of [4700,4600]) {
  await p.goto(`http://localhost:${port}/`,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(4000);
  await p.screenshot({path:`${OUT}/sf${port}-top.png`});
  const t=await p.innerText('body'); console.log(port, t.slice(0,600).replace(/\s+/g,' '));
  const links=await p.$$eval('a',as=>as.map(a=>a.getAttribute('href')).filter(Boolean)); console.log([...new Set(links)].slice(0,30));
  await p.mouse.wheel(0,1100); await p.waitForTimeout(2500);
  await p.screenshot({path:`${OUT}/sf${port}-scroll.png`});
 }
 await b.close();
})();
