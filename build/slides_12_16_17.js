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
    T('Base case: subscriptions only, founders on equity · commission is upside', 0.6, 1.0, 12.13, 0.4, { size: 15, color: C.muted, align: 'center' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.6, w: 7.55, h: 5.0, rectRadius: 0.2, fill: { color: C.white }, line: { color: C.line, width: 1 }, shadow: sh() });
    s.addChart(pres.charts.BAR, [
      { name: 'Revenue', labels: ['Year 1', 'Year 2', 'Year 3'], values: [3456, 25131, 67744] },
      { name: 'Total cost', labels: ['Year 1', 'Year 2', 'Year 3'], values: [7255, 19039, 45607] },
    ], {
      x: 0.75, y: 1.75, w: 7.15, h: 4.7, barDir: 'col', barGapWidthPct: 60,
      chartColors: [C.teal, 'C7D2E0'], showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: F,
      showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '$#,##0', dataLabelFontSize: 11, dataLabelFontFace: F,
      dataLabelColor: C.ink, catAxisLabelFontSize: 13, catAxisLabelFontFace: F, catAxisLabelColor: C.ink,
      valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    });
    const K = [
      ['$67.7K', 'Year 3 revenue', C.pale, C.ink, C.muted],
      ['Year 2', 'first profit: +$6.1K', C.navy, C.white, C.mint],
      ['~670', 'paying shops to break even (1% of our market)', 'DCFCE7', C.green, C.muted],
      ['$3.8K', 'funding needed before profit', C.pale, C.ink, C.muted],
    ];
    for (let i = 0; i < 4; i++) {
      const y = 1.6 + i * 1.28;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.4, y, w: 4.35, h: 1.12, rectRadius: 0.16, fill: { color: K[i][2] }, line: { type: 'none' } });
      T(K[i][0], 8.65, y, 1.8, 1.12, { size: 26, bold: true, color: K[i][3] });
      T(K[i][1], 10.45, y, 2.2, 1.12, { size: 13, color: K[i][4] });
    }
    T('Net result −$3.8K, +$6.1K, +$22.1K (Years 1–3). With 3% marketplace commission: −$3.5K, +$10.6K, +$38.4K. Costs priced bottom-up (DigitalOcean, Resend, MoC fees); shop numbers from the team model. Full detail in appendix; all inputs to validate in the pilot.',
      0.6, 6.85, 12.1, 0.45, { size: 9.5, color: C.muted, valign: 'top' });
    s.addNotes(`[4:00–4:18]
We run lean: three founders who hold equity, AI-assisted development, and cloud servers that cost about 50 dollars a month at launch. Counting subscriptions only, revenue reaches 68,000 dollars in Year 3, we turn profitable in Year 2, and we break even at about 670 paying shops — around 1% of the stores we target. Marketplace commission is upside on top.
(Q&A: founders take a small allowance, $100 rising to $500 a month; even at a $1,000 market salary, Year 3 is still about +$7.7K. We need about $3.8K before we turn profitable. Model: docs/rentify-financial-model.xlsx.)`);
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
    T('Financial detail (bottom-up model)', 0.6, 0.4, 12.1, 0.7, { size: 30, bold: true });
    const b = (t, al = 'right') => ({ text: t, options: { bold: true, align: al, fill: { color: C.pale } } });
    const r = (t) => ({ text: t, options: { align: 'right' } });
    s.addTable([
      [hdr('US$'), hdr('Year 1', 'right'), hdr('Year 2', 'right'), hdr('Year 3', 'right'), hdr('Assumption')],
      ['Subscription revenue', r('3,456'), r('25,131'), r('67,744'), 'Paying shops 58 → 419 → 1,129 (team model) × $5 average plan'],
      ['Cost of service', r('603'), r('1,376'), r('2,643'), 'Servers, database, photo storage, email: $50 → $225 / month'],
      [b('Gross profit', 'left'), b('2,853'), b('23,755'), b('65,101'), { text: '', options: { fill: { color: C.pale } } }],
      ['Team', r('3,600'), r('10,800'), r('24,000'), '3 founders on equity, $100 → $500 / month allowance; 1 support hire in Year 3'],
      ['Sales & marketing', r('1,458'), r('4,961'), r('9,710'), 'Facebook ads $100 → $600 / month, QR stands, festival campaigns, referral credit'],
      ['Software, office, legal', r('1,560'), r('1,320'), r('3,720'), 'AI tools, company registration (~$840), accountant, coworking in Year 3'],
      ['Tax', r('35'), r('582'), r('5,534'), '1% minimum tax; 20% profit tax after earlier losses'],
      [b('Net result', 'left'), b('–3,799'), b('6,092'), b('22,137'), { text: 'Base case: subscriptions only', options: { fill: { color: C.pale } } }],
      ['With 3% commission', r('–3,543'), r('10,563'), r('38,395'), 'Half of shops get 2 → 4 marketplace orders / month at $15'],
    ], { x: 0.6, y: 1.35, w: 12.13, colW: [2.6, 1.3, 1.3, 1.3, 5.63], fontFace: F, fontSize: 13, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: 'D7E1ED' }, rowH: 0.5, valign: 'middle', margin: 0.08 });
    T('Break-even: about 670 paying shops at Year-3 costs (1.0% of the 65,433-store SAM). If founders earned $1,000 / month, Year 3 would still be about +$7.7K. Prices: DigitalOcean, Resend, Ministry of Commerce, checked Sept 2026. Model: docs/rentify-financial-model.xlsx.',
      0.6, 6.85, 12.1, 0.45, { size: 10, color: C.muted, valign: 'top' });
    s.addNotes('Figures from docs/rentify-financial-model.xlsx (build/financial_model.py). Paying-shop numbers are unchanged from the team 36-month model; costs are rebuilt bottom-up. All inputs are assumptions to validate in the pilot.');
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide17_financial-detail.pptx') });
  }
  console.log('done');
})();
