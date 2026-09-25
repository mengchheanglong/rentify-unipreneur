// Slide 9 ("how Rentify makes money": free marketplace, paid own channels) as a single-slide draft.
// Run: node build/slide9_single.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_v6_slide07_business.pptx');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });

const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', green: '16A34A', off: 'E2E8F0', offIcon: '94A3B8', mint: 'A7F3D0' };
const F = 'Arial';

async function icon(name, color) {
  const inner = lucide[name].map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  const s = pres.addSlide();
  s.background = { color: 'F8FAFC' };
  const sh = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.14, blur: 8, offset: 3, angle: 90 });
  const T = (text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.size || 16,
    bold: !!o.bold, color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0,
    isTextBox: true, charSpacing: o.cs });
  const tile = async (x, y, d, col, ic, on) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: d, h: d, rectRadius: d * 0.22,
      fill: { color: on ? col : C.off }, line: { type: 'none' } });
    s.addImage({ data: await icon(ic, on ? C.white : C.offIcon), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
  };

  T('Start free. Upgrade when you grow.', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });

  const chans = [[C.orange, 'ShoppingBag'], [C.blue, 'Globe'], [C.teal, 'Store']];
  const tiers = [
    { name: 'Free', price: '$0', per: '', on: [true, false, false], h: 3.25,
      tag: ['small % on marketplace sales', C.orange, 'FFEDD5'] },
    { name: 'Starter', price: '$5', per: ' /mo', on: [true, true, true], h: 3.85, best: true,
      tag: ['0% on your own sales', C.green, 'DCFCE7'] },
    { name: 'Pro', price: '$10', per: ' /mo', on: [true, true, true], h: 4.5,
      tag: ['0% on your own sales', C.green, 'DCFCE7'],
      extras: [['Link', 'Own domain'], ['Users', 'Staff'], ['ChartColumn', 'Insights']] },
  ];
  const cw = 3.75, gap = 0.3, x0 = (13.333 - (3 * cw + 2 * gap)) / 2, bottom = 6.6;
  for (let i = 0; i < 3; i++) {
    const t = tiers[i], x = x0 + i * (cw + gap), top = bottom - t.h, hl = !!t.best;
    const fg = hl ? C.white : C.ink;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: top, w: cw, h: t.h, rectRadius: 0.2,
      fill: { color: hl ? C.navy : C.white }, line: hl ? { type: 'none' } : { color: C.line, width: 1 }, shadow: sh() });
    if (hl) s.addText('MOST SHOPS', { x: x + cw / 2 - 0.8, y: top - 0.17, w: 1.6, h: 0.34, shape: pres.shapes.ROUNDED_RECTANGLE,
      rectRadius: 0.17, fill: { color: C.teal }, line: { type: 'none' }, fontFace: F, fontSize: 10, bold: true,
      color: C.white, align: 'center', valign: 'middle', margin: 0, isTextBox: true, charSpacing: 1 });
    T(t.name, x + 0.35, top + 0.28, 1.6, 0.4, { size: 18, bold: true, color: fg });
    T([{ text: t.price, options: { fontSize: 36, bold: true } }, { text: t.per, options: { fontSize: 14 } }],
      x + 1.6, top + 0.15, cw - 1.9, 0.7, { color: fg, align: 'right', valign: 'bottom' });
    // channels unlocked, big
    const d = 0.84, tx0 = x + (cw - (3 * d + 2 * 0.22)) / 2;
    const names = ['Marketplace', 'Storefront', 'POS'];
    for (let k = 0; k < 3; k++) {
      await tile(tx0 + k * (d + 0.22), top + 1.05, d, chans[k][0], chans[k][1], t.on[k]);
      T(names[k], tx0 + k * (d + 0.22) - 0.15, top + 1.95, d + 0.3, 0.28,
        { size: 10.5, bold: true, align: 'center', color: t.on[k] ? (hl ? C.mint : chans[k][0]) : C.offIcon });
    }
    // Pro extras as small icons
    if (t.extras) {
      for (let k = 0; k < 3; k++) {
        const ex = tx0 + k * (d + 0.22), ey = top + 2.5;
        s.addShape(pres.shapes.OVAL, { x: ex + d / 2 - 0.3, y: ey, w: 0.6, h: 0.6, fill: { color: 'EEF2FF' }, line: { type: 'none' } });
        s.addImage({ data: await icon(t.extras[k][0], '4F46E5'), x: ex + d / 2 - 0.16, y: ey + 0.14, w: 0.32, h: 0.32 });
        T(t.extras[k][1], ex - 0.15, ey + 0.65, d + 0.3, 0.3, { size: 11, bold: true, color: C.muted, align: 'center' });
      }
    }
    // commission tag
    s.addText(t.tag[0], { x: x + 0.3, y: bottom - 0.8, w: cw - 0.6, h: 0.5, shape: pres.shapes.ROUNDED_RECTANGLE,
      rectRadius: 0.25, fill: { color: t.tag[2] }, line: { type: 'none' }, fontFace: F, fontSize: 13, bold: true,
      color: t.tag[1], align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  }

  T('Proposed prices, tested in our pilot. At launch (cash on delivery) revenue is subscriptions; commission starts with online marketplace payments.',
    0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted });

  s.addNotes(`[2:58–3:20]
Merchants start free. Selling on the Rentify Marketplace costs nothing upfront — we only take a small commission when our marketplace brings the sale. When a merchant wants their own storefront and a POS at the counter, they upgrade to Starter for five dollars a month, and Pro adds a custom domain, staff accounts and analytics. On their own storefront and counter, they never pay commission.
(Q&A: prices are proposals to test. At launch, orders are cash on delivery, so revenue comes from subscriptions; commission starts when marketplace payments go online in 2027.)`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
