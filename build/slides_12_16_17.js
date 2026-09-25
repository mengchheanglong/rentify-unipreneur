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
    T('Base case: subscriptions only, 5 founders on equity, after VAT and taxes · commission is upside', 0.6, 1.0, 12.13, 0.4, { size: 15, color: C.muted, align: 'center' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.6, w: 7.55, h: 5.0, rectRadius: 0.2, fill: { color: C.white }, line: { color: C.line, width: 1 }, shadow: sh() });
    s.addChart(pres.charts.BAR, [
      { name: 'Revenue', labels: ['Year 1', 'Year 2', 'Year 3'], values: [3142, 22846, 61586] },
      { name: 'Total cost', labels: ['Year 1', 'Year 2', 'Year 3'], values: [11212, 28611, 57535] },
    ], {
      x: 0.75, y: 1.75, w: 7.15, h: 4.7, barDir: 'col', barGapWidthPct: 60,
      chartColors: [C.teal, 'C7D2E0'], showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: F,
      showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '$#,##0', dataLabelFontSize: 11, dataLabelFontFace: F,
      dataLabelColor: C.ink, catAxisLabelFontSize: 13, catAxisLabelFontFace: F, catAxisLabelColor: C.ink,
      valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    });
    const K = [
      ['$61.6K', 'Year 3 revenue after 10% VAT', C.pale, C.ink, C.muted],
      ['Year 3', 'first profit: +$4.1K', C.navy, C.white, C.mint],
      ['~1,040', 'paying shops to break even (1.6% of our market)', 'DCFCE7', C.green, C.muted],
      ['$13.8K', 'funding needed before profit', C.pale, C.ink, C.muted],
    ];
    for (let i = 0; i < 4; i++) {
      const y = 1.6 + i * 1.28;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.4, y, w: 4.35, h: 1.12, rectRadius: 0.16, fill: { color: K[i][2] }, line: { type: 'none' } });
      T(K[i][0], 8.65, y, 1.8, 1.12, { size: 26, bold: true, color: K[i][3] });
      T(K[i][1], 10.45, y, 2.2, 1.12, { size: 13, color: K[i][4] });
    }
    T('Net result −$8.1K, −$5.8K, +$4.1K (Years 1–3). With 3% marketplace commission: −$7.8K, −$0.8K, +$19.9K. Includes 10% VAT, 1% tax prepayment, patent tax, NSSF and 14% withholding on foreign services. Full detail in appendix; all inputs to validate in the pilot.',
      0.6, 6.85, 12.1, 0.45, { size: 9.5, color: C.muted, valign: 'top' });
    s.addNotes(`[4:00–4:18]
We run lean: five founders who hold equity, AI-assisted development, and cloud servers that cost about 50 dollars a month at launch. Counting subscriptions only and after VAT and taxes, revenue reaches 62,000 dollars in Year 3 and we turn profitable that year, breaking even at about 1,040 paying shops — under 2% of the stores we target. With a 3% marketplace commission, Year 3 profit rises to about 20,000 dollars.
(Q&A: founders take a small allowance, $100 rising to $500 a month. We need about $13.8K before we turn profitable — prize money, grants and savings. Taxes: 10% VAT is included in our $5 price; 20% profit tax only once past losses are used up. Model: docs/rentify-financial-model.xlsx.)`);
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
      ['Subscription revenue', r('3,142'), r('22,846'), r('61,586'), 'Paying shops 58 → 419 → 1,129 × $5 plan; 10% VAT removed'],
      ['Cost of service', r('687'), r('1,569'), r('3,013'), 'Servers, database, storage, email ($50 → $225 / month) + 14% withholding'],
      [b('Gross profit', 'left'), b('2,454'), b('21,277'), b('58,573'), { text: '', options: { fill: { color: C.pale } } }],
      ['Team', r('6,360'), r('19,080'), r('38,520'), '5 founders on equity, $100 → $500 / month allowance; support hire in Year 3; NSSF'],
      ['Sales & marketing', r('1,626'), r('5,465'), r('10,718'), 'Facebook ads $100 → $600 / month, QR stands, festival campaigns, referral credit'],
      ['Software, office, legal', r('2,508'), r('2,268'), r('4,668'), 'AI tools, registration (~$840), accountant, coworking, patent tax $300 / yr'],
      ['Tax on profit', r('31'), r('229'), r('616'), '1% monthly prepayment; 20% profit tax only after past losses are used'],
      [b('Net result', 'left'), b('–8,071'), b('–5,764'), b('4,051'), { text: 'Base case: subscriptions only', options: { fill: { color: C.pale } } }],
      ['With 3% commission', r('–7,843'), r('–789'), r('19,879'), 'Half of shops get 2 → 4 marketplace orders / month at $15'],
    ], { x: 0.6, y: 1.35, w: 12.13, colW: [2.6, 1.3, 1.3, 1.3, 5.63], fontFace: F, fontSize: 13, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: 'D7E1ED' }, rowH: 0.5, valign: 'middle', margin: 0.08 });
    T('Break-even: about 1,040 paying shops at Year-3 costs (1.6% of the 65,433-store SAM). Funding needed before profit: about $13.8K. Founders take low pay until the business grows. Tax rules and prices checked Sept 2026; confirm with an accountant. Model: docs/rentify-financial-model.xlsx.',
      0.6, 6.85, 12.1, 0.45, { size: 10, color: C.muted, valign: 'top' });
    s.addNotes('Figures from docs/rentify-financial-model.xlsx (build/financial_model.py). Paying-shop numbers are unchanged from the team 36-month model; costs are rebuilt bottom-up. All inputs are assumptions to validate in the pilot.');
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide17_financial-detail.pptx') });
  }
  console.log('done');
})();
