// Go-to-market slide (single file): three steps + growth loop. No pilot band; "Referrals" instead of UniPreneur.
// Run: node build/slide_gtm.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_slide10_go-to-market.pptx');
const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', fb: '1877F2', tg: '27A7E7', violet: '6366F1', grey: 'CBD5E1', green: '16A34A' };
const F = 'Arial';

async function icon(name, color) {
  const inner = lucide[name].map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  const s = pres.addSlide(); s.background = { color: 'F8FAFC' };
  const T = (t, x, y, w, h, o = {}) => s.addText(t, { x, y, w, h, fontFace: F, fontSize: o.size || 14, bold: !!o.bold,
    color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0, isTextBox: true, charSpacing: o.cs });
  const circle = async (x, y, d, col, ic, mark) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: col }, line: { type: 'none' } });
    if (mark) T(mark, x, y + d * 0.04, d, d, { size: Math.round(d * 40), bold: true, color: C.white, align: 'center' });
    else s.addImage({ data: await icon(ic, C.white), x: x + d * 0.26, y: y + d * 0.26, w: d * 0.48, h: d * 0.48 });
  };
  const tile = async (x, y, d, col, ic) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: d, h: d, rectRadius: d * 0.2, fill: { color: col }, line: { type: 'none' } });
    s.addImage({ data: await icon(ic, C.white), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5 });
  };
  const pill = (t, x, y, w, fill, col) => s.addText(t, { x, y, w, h: 0.42, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.21,
    fill: { color: fill }, line: { type: 'none' }, fontFace: F, fontSize: 13, bold: true, color: col, align: 'center', valign: 'middle', margin: 0, isTextBox: true });

  T('Go-to-market: merchants first, buyers follow', 0.6, 0.45, 12.13, 0.7, { size: 30, bold: true, align: 'center' });

  const cw = 3.65, gap = 0.55, x0 = (13.333 - (3 * cw + 2 * gap)) / 2, cy = 2.0, ch = 3.75;
  const cards = [['01', 'NOW · Q4 2026', C.teal, 'We bring shops', 'Goal: 10 pilot shops', 'CCFBF1', '0F766E'],
                 ['02', '2027', C.blue, 'Shops bring customers', '0% on their own sales', 'DCFCE7', C.green],
                 ['03', '2027+', C.orange, 'Buyers find more shops', '3% on marketplace sales', 'FFEDD5', 'C2410C']];
  for (let i = 0; i < 3; i++) {
    const [n, when, col, head, tag, tagBg, tagCol] = cards[i], x = x0 + i * (cw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: cw, h: ch, rectRadius: 0.2, fill: { color: C.white }, line: { color: C.line, width: 1 } });
    T(n, x + 0.3, cy + 0.28, 0.6, 0.3, { size: 13, bold: true, color: C.muted, cs: 2 });
    T(when, x + cw - 2.3, cy + 0.28, 2.0, 0.3, { size: 11, bold: true, color: col, align: 'right', cs: 1 });
    T(head, x, cy + 2.35, cw, 0.5, { size: 20, bold: true, align: 'center' });
    pill(tag, x + 0.3, cy + 3.0, cw - 0.6, tagBg, tagCol);
    if (i < 2) s.addImage({ data: await icon('ArrowRight', C.muted), x: x + cw + 0.14, y: cy + ch / 2 - 0.2, w: 0.28, h: 0.28 });
  }

  // card 1: three channels feed one shop
  {
    const x = x0, mid = x + cw / 2, d = 0.52;
    const srcs = [[C.teal, 'MapPin', null, 'Markets'], [C.fb, null, 'f', 'FB groups'], [C.violet, 'Handshake', null, 'Referrals']];
    for (let k = 0; k < 3; k++) {
      const sx = x + 0.45 + k * 1.15;
      await circle(sx, cy + 0.72, d, srcs[k][0], srcs[k][1], srcs[k][2]);
      T(srcs[k][3], sx - 0.35, cy + 1.28, d + 0.7, 0.26, { size: 11, bold: true, color: C.muted, align: 'center' });
      s.addShape(pres.shapes.LINE, { x: Math.min(sx + d / 2, mid), y: cy + 1.56, w: Math.abs(mid - (sx + d / 2)) || 0.001, h: 0.2,
        flipH: sx + d / 2 > mid, line: { color: C.grey, width: 1 } });
    }
    await tile(mid - 0.34, cy + 1.62, 0.68, C.teal, 'Store');
    s.addText('10', { x: mid + 0.18, y: cy + 1.5, w: 0.44, h: 0.44, shape: pres.shapes.OVAL, fill: { color: C.white },
      line: { color: C.teal, width: 2 }, fontFace: F, fontSize: 12, bold: true, color: C.teal, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  }
  // card 2: shop -> store link -> customers
  {
    const x = x0 + cw + gap, y = cy + 0.95;
    await tile(x + 0.3, y, 0.8, C.teal, 'Store');
    s.addImage({ data: await icon('ArrowRight', C.muted), x: x + 1.18, y: y + 0.28, w: 0.24, h: 0.24 });
    await circle(x + 1.5, y - 0.2, 0.46, C.fb, null, 'f');
    await circle(x + 1.5, y + 0.36, 0.46, C.tg, 'Send');
    T('Store link', x + 1.15, y + 0.88, 1.2, 0.26, { size: 11, bold: true, color: C.muted, align: 'center' });
    s.addImage({ data: await icon('ArrowRight', C.muted), x: x + 2.05, y: y + 0.28, w: 0.24, h: 0.24 });
    await tile(x + 2.4, y, 0.8, C.blue, 'Users');
    T('Customers', x + 2.2, y + 0.88, 1.2, 0.26, { size: 11, bold: true, color: C.blue, align: 'center' });
  }
  // card 3: marketplace fans out to many shops
  {
    const x = x0 + 2 * (cw + gap), mid = x + cw / 2;
    await tile(mid - 0.4, cy + 0.6, 0.8, C.orange, 'ShoppingBag');
    for (let k = 0; k < 4; k++) {
      const sx = x + 0.45 + k * 0.72;
      s.addShape(pres.shapes.LINE, { x: Math.min(mid, sx + 0.25), y: cy + 1.42, w: Math.abs(sx + 0.25 - mid) || 0.001, h: 0.28,
        flipH: sx + 0.25 < mid, line: { color: 'FDBA74', width: 1 } });
      await tile(sx, cy + 1.72, 0.5, k === 1 ? C.teal : C.grey, 'Store');
    }
  }
  // growth loop
  const ly = cy + ch + 0.35, l1 = x0 + cw / 2, l3 = x0 + 2 * (cw + gap) + cw / 2;
  s.addShape(pres.shapes.LINE, { x: l1, y: cy + ch, w: 0, h: 0.56, line: { color: C.violet, width: 1.25, dashType: 'dash', beginArrowType: 'triangle' } });
  s.addShape(pres.shapes.LINE, { x: l3, y: cy + ch, w: 0, h: 0.56, line: { color: C.violet, width: 1.25, dashType: 'dash' } });
  s.addShape(pres.shapes.LINE, { x: l1, y: cy + ch + 0.56, w: l3 - l1, h: 0, line: { color: C.violet, width: 1.25, dashType: 'dash' } });
  s.addText('More buyers bring more shops', { x: 13.333 / 2 - 1.75, y: ly, w: 3.5, h: 0.42, shape: pres.shapes.ROUNDED_RECTANGLE,
    rectRadius: 0.21, fill: { color: 'EEF2FF' }, line: { color: C.violet, width: 1 }, fontFace: F, fontSize: 13, bold: true,
    color: '4338CA', align: 'center', valign: 'middle', margin: 0, isTextBox: true });

  s.addNotes(`[3:20–3:45]
Our first step is simple: ten pilot shops in Phnom Penh. We'll find them the way we found our first ones — visiting shops in person, Facebook seller groups, and referrals from shop owners we already know. Each shop brings its own customers through its storefront link. Those customers discover other shops on the marketplace — and every new shop brings more buyers for everyone.
(Q&A: the pilot passes if 7 of 10 shops stay active after a month, stock stays at least 99% accurate, and 6 of 10 are willing to pay.)`);

  await pres.writeFile({ fileName: OUT }); console.log('wrote', OUT);
})();
