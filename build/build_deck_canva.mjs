import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const SKILL_DIR = 'C:/Users/User/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const RUNTIME_PYTHON = 'C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const FINAL = path.join(ROOT, 'output', 'Rentify_UniPreneur_Canva_Import.pptx');
const W = 1280, H = 720;
const C = {
  navy: '#111D35', blue: '#2463E8', teal: '#0AA7A2', ink: '#15243A',
  muted: '#52637A', pale: '#F5F8FC', white: '#FFFFFF', line: '#D7E1ED',
  lightBlue: '#DCEBFF', lightTeal: '#D6F4F0', gold: '#F8C66C'
};
const p = Presentation.create({ slideSize: { width: W, height: H } });
const fonts = ['Arial'];

function text(slide, value, x, y, w, h, size=28, color=C.ink, bold=false, align='left') {
  const s = slide.shapes.add({ geometry: 'textbox', position: { left:x, top:y, width:w, height:h }, fill:'none', line:{fill:'none',width:0} });
  s.text = value;
  s.text.style = { typeface:'Arial', fontSize:size, bold, color, alignment:align, autoFit:'none' };
  return s;
}
function rect(slide,x,y,w,h,fill) { return slide.shapes.add({ geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0} }); }
function rule(slide,x,y,w,fill=C.line) { rect(slide,x,y,w,2,fill); }
function base(bg=C.white) { const s=p.slides.add(); s.background.fill=bg; return s; }
function title(slide, v, dark=false) { text(slide,v,72,56,1136,92,44,dark?C.white:C.ink,true); }
function small(slide,v,x,y,w,color=C.muted) { text(slide,v,x,y,w,34,17,color,false); }
function notes(slide,v) { slide.speakerNotes.textFrame.setText(v); }
async function picture(slide,file,x,y,w,h,alt,fit='cover') {
  const blob=await fs.readFile(path.join(ROOT,'assets',file));
  slide.images.add({blob,contentType:'image/png',alt,fit,position:{left:x,top:y,width:w,height:h}});
}


// 1. Cover
{
  const s=base(C.navy);
  await picture(s,'rentify-logo.png',76,68,92,92,'Rentify logo');
  text(s,'Rentify',190,84,600,76,48,C.white,true);
  text(s,'Unified selling for Cambodian merchants',78,214,1100,54,29,C.lightTeal);
  text(s,'One catalog.\nThree ways to sell.',76,304,1100,198,68,C.white,true);
  rule(s,78,547,1130,C.teal);
  text(s,'Personal storefront',78,584,390,50,29,C.white);
  text(s,'Shared marketplace',478,584,390,50,29,C.white);
  text(s,'In-store POS',927,584,280,50,29,C.white);
}

// 2. Problem
{
  const s=base(); title(s,'One sale can leave three records out of step');
  text(s,'The last item sells\nat the counter.',72,188,535,155,46,C.ink,true);
  text(s,'Online still says\n“in stock.”',72,363,535,133,44,C.blue,true);
  rule(s,72,535,520,C.blue);
  text(s,'Extra work. Missed orders.\nCustomer frustration.',72,560,525,84,28,C.muted);
  await picture(s,'merchant-problem-illustration.png',650,168,558,450,'AI-generated illustration of a shopkeeper checking her phone');
  small(s,'Illustrative scenario. AI-generated image.',650,634,558);
}

// 3. Solution
{
  const s=base(C.navy); title(s,'One catalog connects every sale',true);
  text(s,'ONE MERCHANT WORKSPACE',72,175,1136,54,29,C.lightTeal,true,'center');
  text(s,'Products     Prices     Stock     Orders',72,254,1136,65,38,C.white,true,'center');
  rect(s,638,333,3,39,C.teal); rule(s,246,370,790,C.teal);
  for(const x of [246,639,1036])rect(s,x,370,3,52,C.teal);
  const xs=[72,466,860];
  ['PERSONAL STOREFRONT','SHARED MARKETPLACE','IN-STORE POS'].forEach((v,i)=>text(s,v,xs[i],445,348,75,28,C.white,true,'center'));
  ['Build their brand','Reach shared buyers','Sell at the counter'].forEach((v,i)=>text(s,v,xs[i],543,348,55,26,C.lightTeal,false,'center'));
  small(s,'Full product workflow',72,650,1100,C.lightTeal);
}

// 4. Product preview
{
  const s=base(); title(s,'The storefront, marketplace and POS experience');
  const xs=[56,459,862], w=362;
  ['PERSONAL STOREFRONT','SHARED MARKETPLACE','IN-STORE POS'].forEach((v,i)=>text(s,v,xs[i],181,w,45,23,C.blue,true));
  await picture(s,'storefront-local.png',xs[0],252,w,224,'NexTech merchant storefront template screen','contain');
  await picture(s,'marketplace-user-2026-09-24.png',xs[1],252,w,224,'User-provided Rentify Marketplace home screen','contain');
  await picture(s,'pos-marketing-preview.png',xs[2],252,w,224,'User-provided POS product preview from the marketing site','contain');
  ['Their own online shop','A place to find more buyers','Products, cart and checkout'].forEach((v,i)=>text(s,v,xs[i],506,w,74,27,C.ink,true));
  rule(s,72,605,1136);
  small(s,'Development storefront and marketplace screens. POS product preview.',72,632,1136);
}

// 5. Market and initial segment
{
  const s=base(C.pale); title(s,'Target retailers sell online and in person');
  text(s,'Small Cambodian retailers',72,193,600,55,33,C.ink,true);
  text(s,'Online\nand at the counter',72,276,615,147,50,C.blue,true);
  text(s,'Existing customers.\nPhysical stock.\nA daily sales workflow.',72,467,580,144,29,C.muted);
  rect(s,716,185,2,401,C.line);
  text(s,'US$1.51B',779,246,429,100,66,C.teal,true);
  text(s,'Cambodian e-commerce\nmarket value in 2024',779,364,423,110,30,C.ink);
  text(s,'First milestone: 10 pilot retailers',779,514,423,97,27,C.blue,true);
  small(s,'Market context. Sources: Cambodia Ministry of Commerce and U.S. ITA.',72,647,1136);
}

// 6. Competition and positioning
{
  const s=base(); title(s,'Where Rentify competes');
  text(s,'MERCHANT ALTERNATIVES',72,179,555,44,23,C.muted,true);
  const rows=[['Khmer24','Broad listings and discovery'],['Shopify','Online store and POS'],['Khmum','Marketplace, merchant tools and POS']];
  rows.forEach((r,i)=>{const y=254+i*112;text(s,r[0],72,y,180,44,29,C.ink,true);text(s,r[1],261,y,370,82,25,C.muted); if(i<2)rule(s,72,y+89,553);});
  rect(s,680,177,2,395,C.line);
  text(s,'RENTIFY’S FOCUS',736,179,472,44,23,C.blue,true);
  text(s,'Their brand.\nShared buyer reach.\nOne selling workflow.',736,258,472,232,39,C.ink,true);
  text(s,'For small Cambodian retailers',736,536,472,67,26,C.blue);
  small(s,'Pilot comparison: setup effort, stock accuracy and total merchant cost.',72,647,1136);
}

// 7. Business model
{
  const s=base(C.navy); title(s,'Two ways Rentify earns revenue',true);
  text(s,'SUBSCRIPTION',72,198,500,52,25,C.lightTeal,true);
  text(s,'Personal storefront\nand POS tools',72,273,510,134,44,C.white,true);
  text(s,'Recurring value for daily operations',72,437,505,100,28,C.lightTeal);
  rect(s,635,200,2,337,C.teal);
  text(s,'COMMISSION',690,198,518,52,25,C.lightTeal,true);
  text(s,'Completed marketplace\norders',690,273,518,134,42,C.white,true);
  text(s,'Revenue grows with marketplace sales',690,437,518,100,28,C.lightTeal);
  rule(s,72,580,1136,C.teal);
  text(s,'Planned model. Pricing and commission rates will be tested with merchants.',72,613,1136,61,24,C.white);
}

// 8. Go to market
{
  const s=base(C.pale); title(s,'Our launch plan: 10 retailers and their buyers');
  const rows=[['01','Recruit merchants','Founder shop visits and merchant referrals'],['02','Bring first buyers','Merchant-shared store links and social posts'],['03','Earn repeat use','Track orders, stock accuracy and willingness to pay']];
  rows.forEach((r,i)=>{let y=188+i*143;text(s,r[0],72,y,92,68,46,C.blue,true);text(s,r[1],187,y,970,52,32,C.ink,true);text(s,r[2],187,y+56,1000,69,27,C.muted);if(i<2)rule(s,187,y+126,1021);});
  small(s,'Proposed pilot plan. Merchant traction has not yet been verified.',72,651,1136);
}

// 9. Team and closing ask
{
  const s=base(C.navy); title(s,'The team behind Rentify',true);
  const names=['Long\nMengchheng','Hong\nThanbrathna','Khemrak Pasey','Mom Sothireak','Vy Seoul'];
  const roles=['Team / Product lead','Idea founder','Business lead','Pitch lead','Team operations'];
  for(let i=0;i<5;i++){
    const x=72+i*233;
    await picture(s,`team-${i+1}-cropped.png`,x-8,156,210,212,`Portrait of ${names[i].replace('\n',' ')}`,'contain');
    text(s,names[i],x,380,210,65,23,C.white,true);
    text(s,roles[i],x,454,210,48,20,C.lightTeal);
  }
  rule(s,72,526,1136,C.teal);
  text(s,'Help us meet 10 pilot retailers.',72,550,1136,72,46,C.white,true);
  text(s,'One catalog. Three ways to sell.',72,635,1136,50,28,C.lightTeal);
}

// Appendix 10. Market sizing
{
  const s=base(); title(s,'Appendix: market sizing approach');
  const labels=['TAM','SAM','SOM']; const colors=[C.blue,C.teal,C.blue];
  const rows=[['Eligible Cambodian retailers','Annual subscription opportunity + commission on relevant order value'],['Launch segment and service area','Apply the same model to the retailers we can serve'],['Merchants we can acquire and retain','Build from outreach, conversion, retention and buyer orders']];
  rows.forEach((r,i)=>{let y=187+i*142;text(s,labels[i],72,y,160,59,40,colors[i],true);text(s,r[0],258,y,950,56,31,C.ink,true);text(s,r[1],258,y+59,950,69,24,C.muted);if(i<2)rule(s,72,y+127,1136);});
  small(s,'Use one annual revenue basis. Eligible merchant counts and pricing remain to be validated.',72,647,1136);
  notes(s,'Q&A: market size. The 2024 US$1.51B figure is transaction market context, not software TAM. Annual revenue opportunity = eligible subscribing merchants × annual subscription price + relevant annual completed marketplace order value × take rate. Narrow the same definition consistently for SAM and SOM. Do not multiply all businesses by a guessed price. The 2022 census counted 753,670 establishments across all sectors, broader than our target. Source: https://nis.gov.kh/nis/EC2022/Leaflet.pdf . The workshop Discuss..pdf page 3 asks for bottom-up sizing. Merchant count, launch geography, attainable conversion, retention and pricing are still open.');
}

// Appendix 11. Competitor evidence
{
  const s=base(C.pale); title(s,'Appendix: competitor evidence');
  const rows=[['Alternative','Publicly described offer','Rentify comparison to test'],['Khmer24','Broad listings and product discovery','Work needed to manage sales'],['Smile Shop','Marketplace, delivery and payments','Brand ownership and buyer reach'],['Shopify','Online store and POS inventory sync','Local fit and total cost'],['Khmum eShop','Marketplace, merchant tools and POS','Setup, storefront and stock workflow']];
  // Canva import copy: use editable text boxes and simple rectangles instead of a PowerPoint table.
  const widths=[205,465,466], xPositions=[72,277,742], tableTop=188, rowH=75.2;
  rows.forEach((row,r)=>{
    let x=xPositions[0], y=tableTop+r*rowH;
    row.forEach((value,c)=>{
      const fill=r===0?C.navy:C.pale;
      rect(s,x,y,widths[c],rowH,fill);
      text(s,value,x+14,y+13,widths[c]-26,rowH-19,22,r===0?C.white:C.ink,r===0);
      x+=widths[c];
    });
  });
  for(let r=0;r<=5;r++)rect(s,72,tableTop+r*rowH,1136,1,C.line);
  for(const x of [72,277,742,1208])rect(s,x,tableTop,1,rowH*5,C.line);
  text(s,'Khmum overlaps with the concept. Rentify’s advantage must come from execution and merchant fit.',72,598,1136,81,25,C.muted);
  notes(s,'Q&A: uniqueness. We do not claim to be the first or only platform in these categories. Khmum is the closest local benchmark among the sources reviewed. Public descriptions do not establish current service quality, exact prices or absent features. Sources checked 24 September 2026: https://www.khmer24.com/en ; https://www.shopify.com/pos ; https://www.khmersme.gov.kh/service_provider/khmum-technology-co-ltd/ ; https://h5.khsmileshop.com/ . Test the same merchant tasks and cost assumptions before claiming superiority.');
}

// Appendix 12. Economics
{
  const s=base(); title(s,'Appendix: illustrative monthly economics');
  small(s,'Scenario only. These are unvalidated inputs, not announced prices or a forecast.',72,159,1136);
  text(s,'Subscriptions',72,230,510,50,29,C.blue,true);
  text(s,'100 merchants × US$8',72,296,510,56,33,C.ink,true);
  text(s,'US$800 / month',72,365,510,66,43,C.blue,true);
  rect(s,635,220,2,225,C.line);
  text(s,'Marketplace commissions',691,230,517,50,29,C.teal,true);
  text(s,'US$20,000 order value × 3%',691,296,517,56,31,C.ink,true);
  text(s,'US$600 / month',691,365,517,66,43,C.teal,true);
  rule(s,72,473,1136);
  text(s,'US$1,400',72,503,386,84,55,C.ink,true);
  text(s,'Monthly revenue before costs',478,523,730,66,30,C.ink);
  text(s,'Deduct support, hosting, payment costs and acquisition. Test retention before scaling.',72,622,1136,67,24,C.muted);
  notes(s,'Q&A: revenue mechanics. Illustrative arithmetic only: 100 average paying subscribers × US$8 per month = US$800. US$20,000 of eligible completed marketplace order value after cancellations/refunds × 3% = US$600. Total US$1,400 monthly platform revenue before costs and taxes. GMV belongs to merchants and is not Rentify revenue. Inputs are invented sensitivity assumptions, not actual traction, validated prices, or a projection. Profit requires actual payment and support costs, hosting, acquisition and staffing. The workshop requests a three-year plan; build each year from average paid merchants, retention, annual GMV and costs before calling it a forecast. Avoid annualizing a year-end merchant count as if all merchants paid for all twelve months.');
}

// Appendix 13. Product status
{
  const s=base(C.pale); title(s,'Appendix: product status and next proof');
  text(s,'DEVELOPMENT TODAY',72,184,520,52,25,C.blue,true);
  text(s,'Merchant dashboard and catalog',72,272,513,92,29,C.ink);
  text(s,'Storefront and marketplace interfaces',72,379,513,101,29,C.ink);
  text(s,'POS interface and order modules',72,494,513,96,29,C.ink);
  rect(s,635,182,2,412,C.line);
  text(s,'NEXT PROOF',690,184,518,52,25,C.teal,true);
  text(s,'One complete sale with correct shared stock',690,272,518,101,29,C.ink);
  text(s,'Merchant repeat use and paid conversion',690,379,518,101,29,C.ink);
  text(s,'Reliable payments, refunds and settlement',690,494,518,96,29,C.ink);
  small(s,'Pre-pilot stage. POS visual on slide 4 is a product preview.',72,647,1136);
  notes(s,'Q&A: current status. No verified merchant traction or revenue. Local development surfaces and Commerce modules exist. Opening a screen or adding an item to a cart does not prove a completed sale, live payment or correct inventory across every channel. The storefront product section was empty in the prior local review. The user selected the polished POS image displayed on the marketing page. Do not imply a bank partnership or live settlement. Sources: C:/Users/User/rentify/README.md; C:/Users/User/rentify/docs/migration-plan.md; browser observations documented in docs/demo-runbook.md. Current architecture snapshot predates later migration progress, so current README and migration status take precedence for this summary.');
}

// Presenter scripts and evidence notes share one source with the rehearsal guide.
const pitchContent=JSON.parse(await fs.readFile(path.join(ROOT,'build','pitch-content-v5.json'),'utf8'));
for(const item of pitchContent){
  notes(p.slides.items[item.slide-1],`SLIDE ${item.slide} | ${item.seconds} seconds

SAY
${item.script}

EVIDENCE AND Q&A
${item.evidence}`);
}
for(let i=0;i<p.slides.items.length;i++){
  const dark=[0,2,6,8].includes(i);
  text(p.slides.items[i],String(i+1).padStart(2,'0'),1213,687,42,22,13,dark?C.lightTeal:C.muted,false,'right');
}

// Export, validate and keep the final file separate from the build directory.
const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR,'container_tools/artifact_tool_utils.mjs')).href);
const stage=path.join(ROOT,'build','.codex-finalizer');
await fs.mkdir(stage,{recursive:true});
await fs.mkdir(path.dirname(FINAL),{recursive:true});
const candidate=path.join(stage,'candidate-canva.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
const result=await finalizePresentation({
  workspaceDir:ROOT,candidatePath:candidate,finalPath:FINAL,pythonExecutable:RUNTIME_PYTHON,
  integrityValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
  requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],
  fontPolicy:{basis:'design',families:fonts},verifyArtifactToolImport:true,
  receiptPath:path.join(stage,'Rentify_UniPreneur_Canva_Import.validation.json')
});
console.log(JSON.stringify({final:FINAL,result},null,2));
