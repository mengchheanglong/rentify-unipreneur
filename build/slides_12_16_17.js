// Slides 12 (projection), 16 (market math) and 17 (financial detail), updated for the
// Free / Starter $5 / Pro $10 model and the MoC + census market data. One file per slide.
// Run: node build/slides_12_16_17.js
const path = require('path');
const pptxgen = require('pptxgenjs');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
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
    T('Subscriptions only · marketplace commission not included', 0.6, 1.0, 12.13, 0.4, { size: 15, color: C.muted, align: 'center' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.6, w: 7.55, h: 5.0, rectRadius: 0.2, fill: { color: C.white }, line: { color: C.line, width: 1 }, shadow: sh() });
    s.addChart(pres.charts.BAR, [
      { name: 'Revenue', labels: ['Year 1', 'Year 2', 'Year 3'], values: [3456, 25131, 67744] },
      { name: 'Total cost', labels: ['Year 1', 'Year 2', 'Year 3'], values: [30258, 61879, 93819] },
    ], {
      x: 0.75, y: 1.75, w: 7.15, h: 4.7, barDir: 'col', barGapWidthPct: 60,
      chartColors: [C.teal, 'C7D2E0'], showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: F,
      showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '$#,##0', dataLabelFontSize: 11, dataLabelFontFace: F,
      dataLabelColor: C.ink, catAxisLabelFontSize: 13, catAxisLabelFontFace: F, catAxisLabelColor: C.ink,
      valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    });
    const K = [
      ['$67.7K', 'Year 3 revenue', C.pale, C.ink, C.muted],
      ['1,895', 'paying shops to break even', C.navy, C.white, C.mint],
      ['2.9%', 'of our 65,400-store market', 'DCFCE7', C.green, C.muted],
      ['$5', 'average plan (Starter $5, Pro $10)', C.pale, C.ink, C.muted],
    ];
    for (let i = 0; i < 4; i++) {
      const y = 1.6 + i * 1.28;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.4, y, w: 4.35, h: 1.12, rectRadius: 0.16, fill: { color: K[i][2] }, line: { type: 'none' } });
      T(K[i][0], 8.65, y, 1.8, 1.12, { size: 26, bold: true, color: K[i][3] });
      T(K[i][1], 10.45, y, 2.2, 1.12, { size: 13, color: K[i][4] });
    }
    T('Team 36-month model, lean cost base. Net result −$26.8K, −$36.7K, −$26.1K (Years 1–3). Prices, conversion, churn and costs are assumptions to validate in the pilot.',
      0.6, 6.85, 12.1, 0.45, { size: 9.5, color: C.muted, valign: 'top' });
    s.addNotes(`[4:00–4:18]
Our lean model counts subscriptions only. Revenue grows to 68,000 dollars in Year 3. We break even at about 1,900 paying shops — under 3% of the 65,000 specialised stores we target. Marketplace commission, once online payments launch, is upside on top.
(Q&A: the $5 average is conservative — Starter is $5 and Pro is $10; Free-plan shops pay no subscription and are not counted as paying. All inputs will be updated with pilot data.)`);
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
    T('Financial detail (team model, lean scenario)', 0.6, 0.4, 12.1, 0.7, { size: 30, bold: true });
    const b = (t, al = 'right') => ({ text: t, options: { bold: true, align: al, fill: { color: C.pale } } });
    const r = (t) => ({ text: t, options: { align: 'right' } });
    s.addTable([
      [hdr('US$'), hdr('Year 1', 'right'), hdr('Year 2', 'right'), hdr('Year 3', 'right'), hdr('Assumption')],
      ['Subscription revenue', r('3,456'), r('25,131'), r('67,744'), 'Starter $5 / Pro $10; $5 average per paying shop; Free plan pays none'],
      ['Commission revenue', r('0'), r('0'), r('0'), 'Not modelled; starts with online marketplace payments (2027)'],
      ['Cost of service', r('1,543'), r('8,939'), r('21,669'), '$0.30 per active + $0.75 per paying shop / month'],
      [b('Gross profit', 'left'), b('1,913'), b('16,193'), b('46,074'), { text: '', options: { fill: { color: C.pale } } }],
      ['Team', r('20,250'), r('35,300'), r('46,000'), 'Founders, lean hiring path'],
      ['Sales & marketing', r('4,110'), r('10,450'), r('16,450'), 'Field onboarding, referrals, paid ads'],
      ['Software, office, legal', r('4,355'), r('7,190'), r('9,700'), 'Fixed lean overhead'],
      [b('Net result', 'left'), b('–26,802'), b('–36,747'), b('–26,076'), { text: 'No tax while loss-making', options: { fill: { color: C.pale } } }],
    ], { x: 0.6, y: 1.35, w: 12.13, colW: [2.6, 1.3, 1.3, 1.3, 5.63], fontFace: F, fontSize: 13, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: 'D7E1ED' }, rowH: 0.52, valign: 'middle', margin: 0.08 });
    T('Break-even: about 1,895 paying shops (Month-36 operating cost ÷ contribution per shop) — 2.9% of the 65,433-store SAM. All inputs are assumptions to validate in the pilot.',
      0.6, 6.85, 12.1, 0.45, { size: 10, color: C.muted, valign: 'top' });
    s.addNotes('Figures from the team 36-month model (lean cost base) as shown in the v2 deck; only the assumption labels were updated for the Free / Starter / Pro pricing.');
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide17_financial-detail.pptx') });
  }
  console.log('done');
})();
