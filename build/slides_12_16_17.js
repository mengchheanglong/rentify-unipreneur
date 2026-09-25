// Slides 12 (projection), 16 (market math) and 17 (financial detail), updated for the
// Free / Starter $5 / Pro $10 model and the MoC + census market data. One file per slide.
// Run: node build/slides_12_16_17.js
const path = require('path');
const pptxgen = require('pptxgenjs');

const ROOT = path.resolve(__dirname, '..');
const DR = path.join(ROOT, 'output', 'drafts');
require('fs').mkdirSync(DR, { recursive: true });

const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', pale: 'F1F5F9', mint: 'A7F3D0', green: '16A34A', red: 'D64545' };
const F = 'Arial';

function deck() { const p = new pptxgen(); p.layout = 'LAYOUT_WIDE'; return p; }
function helpers(pres, s) {
  const T = (text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.size || 16,
    bold: !!o.bold, color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0,
    isTextBox: true, charSpacing: o.cs });
  const sh = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.14, blur: 8, offset: 3, angle: 90 });
  return { T, sh };
}
const hdr = (t, al = 'left') => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.navy }, align: al } });

(async () => {
  // ================= Slide 12: three-year projection =================
  {
    const pres = deck(); const s = pres.addSlide(); s.background = { color: 'F8FAFC' };
    const { T, sh } = helpers(pres, s);
    T('Three-year projection', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });
    T('Bootstrapped: team unpaid in Year 1, then paid from profit · subscriptions only', 0.6, 1.0, 12.13, 0.4, { size: 15, color: C.muted, align: 'center' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.6, w: 7.55, h: 5.0, rectRadius: 0.2, fill: { color: C.white }, line: { color: C.line, width: 1 }, shadow: sh() });
    s.addChart(pres.charts.BAR, [
      { name: 'Running costs + tax', labels: ['Year 1', 'Year 2', 'Year 3'], values: [2905, 6734, 16251] },
      { name: 'Team pay (from profit)', labels: ['Year 1', 'Year 2', 'Year 3'], values: [0, 9426, 26741] },
      { name: 'Kept in the company', labels: ['Year 1', 'Year 2', 'Year 3'], values: [236, 6687, 18594] },
    ], {
      x: 0.75, y: 1.75, w: 7.15, h: 4.7, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 55,
      chartColors: ['64748B', C.blue, C.teal], showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: F,
      showValue: true, dataLabelPosition: 'ctr', dataLabelFormatCode: '[>=1000]$#,##0;""', dataLabelFontSize: 11, dataLabelFontFace: F,
      dataLabelColor: C.white, catAxisLabelFontSize: 13, catAxisLabelFontFace: F, catAxisLabelColor: C.ink,
      valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
      showTitle: true, title: 'Where each year\'s revenue goes', titleFontSize: 13, titleFontFace: F, titleColor: C.muted,
    });
    const K = [
      ['$61.6K', 'Year 3 revenue after 10% VAT', C.pale, C.ink, C.muted],
      ['Year 1', 'covers its own costs, team unpaid', C.navy, C.white, C.mint],
      ['~110', 'paying shops cover all running costs', 'DCFCE7', C.green, C.muted],
      ['$1.1K', 'cash needed to start', C.pale, C.ink, C.muted],
    ];
    for (let i = 0; i < 4; i++) {
      const y = 1.6 + i * 1.28;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.4, y, w: 4.35, h: 1.12, rectRadius: 0.16, fill: { color: K[i][2] }, line: { type: 'none' } });
      T(K[i][0], 8.65, y, 1.8, 1.12, { size: 26, bold: true, color: K[i][3] });
      T(K[i][1], 10.45, y, 2.2, 1.12, { size: 13, color: K[i][4] });
    }
    T('Team pay per founder: $0 → ~$150 → ~$420 a month (half of profit, max $500). With 3% commission the team reaches $500 in Year 3 and $27.0K is kept. After 10% VAT and Cambodian taxes. All inputs to validate in the pilot.',
      0.6, 6.85, 12.1, 0.45, { size: 9.5, color: C.muted, valign: 'top' });
    s.addNotes(`[4:00–4:18]
We are bootstrapped. Five founders do everything themselves, with AI-assisted development and servers that cost about 50 dollars a month. About 110 paying shops cover all our running costs, so Rentify pays for itself from Year 1. We work unpaid that year, then pay ourselves from profit: about 150 dollars a month each in Year 2 and 420 in Year 3, while still keeping 18,600 dollars in the company. Marketplace commission is upside on top.
(Q&A: rule = half of each year's profit goes to the team, capped at $500 per founder; the rest is reserve. Marketing is 10% of revenue; growth is founder-led. We need about $1.1K to start: registration and pilot servers. About 765 paying shops would pay all five of us the full $500. Model: docs/rentify-financial-model.xlsx.)`);
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide12_projection.pptx') });
  }

  // ================= Slide 16: market sizing math (appendix) =================
  {
    const pres = deck(); const s = pres.addSlide(); s.background = { color: C.white };
    const { T } = helpers(pres, s);
    T('Market sizing: how we counted', 0.6, 0.4, 12.1, 0.7, { size: 30, bold: true });
    s.addTable([
      [hdr(''), hdr('Shops'), hdr('Basis'), hdr('× US$60 / yr')],
      ['TAM', '410,623', 'All retail establishments, ISIC division 47, excluding fuel stations (4730)', 'US$24.6M'],
      ['SAM', '65,433', 'Specialized non-food retail, ISIC 4741–4774: fashion, cosmetics, electronics, household, books, toys, sports, second-hand', 'US$3.9M'],
      ['SOM', '≈1,129', 'Year 3 subscription revenue (US$67,744) ÷ US$60 — average paying shops in the team model', 'US$67.7K'],
    ], { x: 0.6, y: 1.35, w: 12.13, colW: [1.1, 1.6, 7.3, 2.13], fontFace: F, fontSize: 13.5, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: 'D7E1ED' }, rowH: [0.5, 0.8, 0.9, 0.8], valign: 'middle', margin: 0.1 });
    const notes = [
      ['Why US$60?', 'The $5 average plan × 12 months. Free-plan shops pay no subscription.'],
      ['Market context', 'Cambodian e-commerce: US$1.51B (2024) → US$1.78B (2025, projected), +17.9% a year. Fashion 37% and beauty 20% of online purchases. This is sales value, not Rentify revenue.'],
      ['Small businesses', '49% of Cambodian establishments have only one employee (Economic Census 2022).'],
      ['Not counted', 'Marketplace commission, and home-based Facebook sellers the census barely captures (only 162 establishments list internet retail as their main activity).'],
    ];
    notes.forEach(([h, b], i) => T([{ text: h + '  ', options: { bold: true } }, { text: b }], 0.6, 4.65 + i * 0.5, 12.1, 0.48, { size: 12.5 }));
    T('Sources: NIS Economic Census 2022 (final report Table 2.10; leaflet); Ministry of Commerce iTrade Bulletin, March 2025.', 0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted });
    s.addNotes('Recalculate if the average plan price changes after pilot testing.');
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide16_market-math.pptx') });
  }

  // ================= Slide 17: financial detail (appendix) =================
  {
    const pres = deck(); const s = pres.addSlide(); s.background = { color: C.white };
    const { T } = helpers(pres, s);
    T('Financial detail (bootstrapped model)', 0.6, 0.4, 12.1, 0.7, { size: 30, bold: true });
    const b = (t, al = 'right') => ({ text: t, options: { bold: true, align: al, fill: { color: C.pale } } });
    const r = (t) => ({ text: t, options: { align: 'right' } });
    s.addTable([
      [hdr('US$'), hdr('Year 1', 'right'), hdr('Year 2', 'right'), hdr('Year 3', 'right'), hdr('Assumption')],
      ['Subscription revenue', r('3,142'), r('22,846'), r('61,586'), 'Paying shops 58 → 419 → 1,129 × $5 plan; 10% VAT removed'],
      ['Cost of service', r('687'), r('1,569'), r('3,013'), 'Servers, database, storage, email ($50 → $225 / month) + 14% withholding'],
      ['Sales & marketing', r('472'), r('2,646'), r('6,869'), '10% of revenue + referral credits; growth is founder-led'],
      ['Software, office, legal', r('1,687'), r('847'), r('1,721'), 'Shared AI tools, registration (~$840), patent tax; no office rent'],
      [b('Profit before team pay', 'left'), b('295'), b('17,784'), b('49,983'), { text: 'Team works for equity until this is positive', options: { fill: { color: C.pale } } }],
      ['Team pay (incl. NSSF)', r('0'), r('9,426'), r('26,741'), 'Unpaid in Year 1; then half of profit, max $500 / founder / month'],
      ['Tax on profit', r('59'), r('1,672'), r('4,648'), '1% monthly prepayment; 20% profit tax'],
      [b('Kept in the company', 'left'), b('236'), b('6,687'), b('18,594'), { text: 'Reserve for growth and bad months', options: { fill: { color: C.pale } } }],
      ['Pay per founder / month', r('$0'), r('~$148'), r('~$417'), '5 founders, all doing product, sales and support'],
      ['With 3% commission: kept', r('399'), r('8,349'), r('27,018'), 'Team reaches the $500 cap in Year 3'],
    ], { x: 0.6, y: 1.35, w: 12.13, colW: [2.6, 1.3, 1.3, 1.3, 5.63], fontFace: F, fontSize: 13, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: 'D7E1ED' }, rowH: 0.46, valign: 'middle', margin: 0.08 });
    T('About 110 paying shops cover running costs; about 765 would pay all 5 founders $500 / month (1.2% of the 65,433-store SAM). Cash needed to start: about $1.1K. Tax rules and prices checked Sept 2026; confirm with an accountant. Model: docs/rentify-financial-model.xlsx.',
      0.6, 6.85, 12.1, 0.45, { size: 10, color: C.muted, valign: 'top' });
    s.addNotes('Figures from docs/rentify-financial-model.xlsx (build/financial_model.py). Paying-shop numbers are unchanged from the team 36-month model; costs are rebuilt bottom-up. All inputs are assumptions to validate in the pilot.');
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide17_financial-detail.pptx') });
  }
  console.log('done');
})();
