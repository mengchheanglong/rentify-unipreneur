// Merged slide: add once + sell at POS + every channel syncs. Real screens from the redesign build.
// Run: node build/slide_sync.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const A = (f) => path.join(ROOT, 'assets', 'v6', f);
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_slide04_sync.pptx');
const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'CBD5E1', bar: 'E2E8F0', red: 'D64545', mint: 'A7F3D0' };
const F = 'Arial';

async function icon(name, color) {
  const inner = lucide[name].map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  const s = pres.addSlide(); s.background = { color: 'F8FAFC' };
  const sh = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.16, blur: 8, offset: 3, angle: 90 });
  const T = (t, x, y, w, h, o = {}) => s.addText(t, { x, y, w, h, fontFace: F, fontSize: o.size || 14, bold: !!o.bold,
    color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0, isTextBox: true, charSpacing: o.cs });
  const pill = (t, x, y, w, col, fill, size = 13) => s.addText(t, { x, y, w, h: 0.4, shape: pres.shapes.ROUNDED_RECTANGLE,
    rectRadius: 0.2, fill: { color: fill }, line: { color: col, width: 2 }, fontFace: F, fontSize: size, bold: true, color: col,
    align: 'center', valign: 'middle', margin: 0, isTextBox: true, shadow: sh() });
  const screen = (file, pw, ph, x, y, w, col, alt) => {
    const bar = 0.22, ih = w * ph / pw;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: ih + bar, rectRadius: 0.07, fill: { color: C.white }, line: { color: col, width: 2 }, shadow: sh() });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.02, y: y + 0.02, w: w - 0.04, h: bar - 0.02, fill: { color: C.bar }, line: { type: 'none' } });
    ['F87171', 'FBBF24', '34D399'].forEach((c, k) => s.addShape(pres.shapes.OVAL, { x: x + 0.1 + k * 0.14, y: y + 0.07, w: 0.08, h: 0.08, fill: { color: c }, line: { type: 'none' } }));
    s.addImage({ path: A(file), x: x + 0.02, y: y + bar, w: w - 0.04, h: ih - 0.02, altText: alt });
    return ih + bar;
  };

  T('Add once. Sell once. Every channel in sync.', 0.6, 0.3, 12.13, 0.7, { size: 32, bold: true, align: 'center' });

  // ---- left: the sale on the POS (big) ----
  const px = 0.55, py = 1.55, pw = 5.6;
  T('1', px, py - 0.45, 0.36, 0.36, { size: 14, bold: true, color: C.white, align: 'center' });
  s.addShape(pres.shapes.OVAL, { x: px, y: py - 0.45, w: 0.36, h: 0.36, fill: { color: C.navy }, line: { type: 'none' } });
  T('1', px, py - 0.45, 0.36, 0.36, { size: 14, bold: true, color: C.white, align: 'center' });
  T('Sold at the POS', px + 0.48, py - 0.47, 3.5, 0.4, { size: 16, bold: true });
  const posH = screen('r2/c-pos-pay.png', 1830, 1030, px, py, pw, C.teal, 'Rentify POS completing a cash sale of the perfume');
  s.addText('−1', { x: px + pw - 0.45, y: py - 0.22, w: 0.62, h: 0.62, shape: pres.shapes.OVAL, fill: { color: C.red },
    line: { color: C.white, width: 2 }, fontFace: F, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0, isTextBox: true, shadow: sh() });

  // "added once" strip under the POS
  const ay0 = py + posH + 0.3;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: ay0, w: pw, h: 1.0, rectRadius: 0.14, fill: { color: C.white }, line: { color: 'E2E8F0', width: 1 } });
  s.addImage({ path: A('s4-product-perfume.png'), x: px + 0.2, y: ay0 + 0.15, w: 0.7, h: 0.7, rounding: true, altText: 'Perfume' });
  T([{ text: 'BEFORE THE SALE · ADDED ONCE', options: { bold: true, color: C.teal, fontSize: 10, charSpacing: 1, breakLine: true } },
     { text: 'Yes I Am The Queen · Stock 40', options: { bold: true, color: C.ink, fontSize: 13 } }], px + 1.05, ay0, 3.05, 1.0, {});
  const chip = [[C.orange, 'ShoppingBag'], [C.blue, 'Globe'], [C.teal, 'Store']];
  for (let k = 0; k < 3; k++) {
    const cx = px + pw - 1.55 + k * 0.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: ay0 + 0.3, w: 0.4, h: 0.4, rectRadius: 0.09, fill: { color: chip[k][0] }, line: { type: 'none' } });
    s.addImage({ data: await icon(chip[k][1], C.white), x: cx + 0.1, y: ay0 + 0.4, w: 0.2, h: 0.2 });
  }
  T('live on all three', px + pw - 1.6, ay0 + 0.72, 1.5, 0.22, { size: 9.5, color: C.muted, align: 'center' });

  // ---- center: one stock hub ----
  const hx = px + pw + 0.3, hw = 1.55, hy = py + posH / 2 - 1.05;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: hx, y: hy, w: hw, h: 2.1, rectRadius: 0.16, fill: { color: C.navy }, line: { type: 'none' }, shadow: sh() });
  s.addImage({ path: A('s4-product-perfume.png'), x: hx + hw / 2 - 0.35, y: hy + 0.15, w: 0.7, h: 0.7, rounding: true, altText: 'Perfume' });
  T('ONE STOCK', hx, hy + 0.9, hw, 0.26, { size: 10, bold: true, color: C.mint, align: 'center', cs: 1 });
  T([{ text: '40 ', options: { strike: 'sngStrike', color: '9FB3CF' } }, { text: '→ 39', options: { color: C.white } }],
    hx, hy + 1.18, hw, 0.45, { size: 22, bold: true, align: 'center' });
  s.addImage({ data: await icon('RefreshCw', C.mint), x: hx + hw / 2 - 0.15, y: hy + 1.68, w: 0.3, h: 0.3 });
  // arrow POS -> hub
  s.addShape(pres.shapes.LINE, { x: px + pw + 0.02, y: hy + 1.05, w: 0.26, h: 0, line: { color: C.teal, width: 2.5, endArrowType: 'triangle' } });

  // ---- right: channels updated ----
  const rx = hx + hw + 0.45, rw = 13.333 - 0.55 - rx;
  T('2', rx, py - 0.45, 0.36, 0.36, { size: 14, bold: true, color: C.white, align: 'center' });
  s.addShape(pres.shapes.OVAL, { x: rx, y: py - 0.45, w: 0.36, h: 0.36, fill: { color: C.teal }, line: { type: 'none' } });
  T('2', rx, py - 0.45, 0.36, 0.36, { size: 14, bold: true, color: C.white, align: 'center' });
  T('Every channel updates', rx + 0.48, py - 0.47, 3.5, 0.4, { size: 16, bold: true });
  const items = [['r2/c-mp-after.png', 2160, 1215, C.orange, 'Marketplace', '39 in stock'],
                 ['r2/c-sf-after.png', 1760, 990, C.blue, 'Own storefront', 'In stock'],
                 ['r2/c-dash-after.png', 1676, 943, C.teal, 'Dashboard', 'Stock 39']];
  const sw = 2.35, gapY = 0.14;
  let y = py;
  for (const [file, iw, ih, col, label, badge] of items) {
    const h = screen(file, iw, ih, rx, y, sw, col, label + ' after the sale');
    T(label, rx + sw + 0.18, y + 0.18, rw - sw - 0.2, 0.32, { size: 14, bold: true, color: col });
    pill(badge, rx + sw + 0.18, y + 0.58, 1.55, col, C.white, 12);
    // arrow hub -> channel
    const ay = y + h / 2, x1 = hx + hw, x2 = rx - 0.04, y1 = hy + 1.05;
    s.addShape(pres.shapes.LINE, { x: x1, y: Math.min(y1, ay), w: x2 - x1, h: Math.abs(ay - y1) || 0.001, flipV: ay < y1,
      line: { color: col, width: 2, endArrowType: 'triangle' } });
    y += h + gapY;
  }

  T('Real screens: one cash sale on Rentify POS, captured in our development build (demo store: Aura Botanicals). No second update was made.',
    0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted });

  s.addNotes(`[1:00–1:45]
Here is Rentify working. The merchant adds a product once, and it's live on their storefront, in our marketplace and in their POS. Now a customer buys one bottle at the counter. We had forty. The moment the sale completes, the stock drops to thirty-nine everywhere — the marketplace shows thirty-nine, the merchant dashboard shows thirty-nine, and the storefront stays in stock. One sale, one stock, every channel in sync. No second update.
(Q&A: real screens from our development build with demo data, not customer orders.)`);

  await pres.writeFile({ fileName: OUT }); console.log('wrote', OUT);
})();
