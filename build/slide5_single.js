// Slide 5 ("sell once, updated everywhere") as a single-slide draft for review.
// Run: node build/slide4_single.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const A = (f) => path.join(ROOT, 'assets', f);
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_v6_slide04_proof.pptx');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });

const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'CBD5E1', bar: 'E2E8F0' };
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
  const sh = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.18, blur: 8, offset: 3, angle: 90 });
  const T = (text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.size || 16,
    bold: !!o.bold, color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0, isTextBox: true, charSpacing: o.cs });

  T('Sell one at the counter. Every channel knows.', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });

  // The single product, entered once
  const cw = 4.9, cx = (13.333 - cw) / 2, cy = 1.2, ch = 1.7;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: cw, h: ch, rectRadius: 0.18, fill: { color: C.white },
    line: { color: C.line, width: 1 }, shadow: sh() });
  s.addImage({ path: A('v6/s4-product-perfume.png'), x: cx + 0.18, y: cy + 0.18, w: ch - 0.36, h: ch - 0.36, rounding: false,
    altText: 'Product photo: perfume bottle' });
  const tx = cx + ch + 0.05;
  T('SOLD 1 AT THE COUNTER', tx, cy + 0.2, 3, 0.3, { size: 11, bold: true, color: C.teal, cs: 2 });
  T('Yes I Am The Queen', tx, cy + 0.5, cw - ch - 0.2, 0.45, { size: 17, bold: true });
  T([{ text: 'Stock ', options: { bold: true, color: C.ink } }, { text: '40', options: { bold: true, color: C.muted, strike: 'sngStrike' } }, { text: '  →  39', options: { bold: true, color: 'D64545' } }],
    tx, cy + 1.0, 3, 0.4, { size: 17 });

  // Three real channel screens
  const sw = 3.95, sgap = 0.24, sx0 = (13.333 - (3 * sw + 2 * sgap)) / 2, sy = 3.5, bar = 0.26;
  const screens = [
    ['v6/s5q-storefront.png', 1760, 990, 'Own storefront', C.blue, 'Globe', 'Still in stock'],
    ['v6/s5q-marketplace.png', 2160, 1215, 'Marketplace', C.orange, 'ShoppingBag', 'Stock 39'],
    ['v6/s5q-dashboard.png', 1676, 943, 'Merchant dashboard', C.teal, 'LayoutDashboard', 'Stock 39'],
  ];
  for (let i = 0; i < 3; i++) {
    const [file, pw, ph, label, col, ic, badgeText] = screens[i];
    const x = sx0 + i * (sw + sgap);
    const ih = sw * ph / pw;
    // arrow from the product card to this channel
    const x1 = cx + cw / 2 + (i - 1) * 1.2, x2 = x + sw / 2 - 0.55, y1 = cy + ch + 0.05, y2 = sy - 0.06;
    s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: y1, w: Math.abs(x2 - x1) || 0.001, h: y2 - y1,
      flipH: x2 < x1, line: { color: col, width: 3, endArrowType: 'triangle' } });
    // browser-style frame
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: sy, w: sw, h: ih + bar, rectRadius: 0.08, fill: { color: C.white },
      line: { color: col, width: 2 }, shadow: sh() });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.02, y: sy + 0.02, w: sw - 0.04, h: bar - 0.02, fill: { color: C.bar }, line: { type: 'none' } });
    ['F87171', 'FBBF24', '34D399'].forEach((c, k) =>
      s.addShape(pres.shapes.OVAL, { x: x + 0.12 + k * 0.16, y: sy + 0.08, w: 0.1, h: 0.1, fill: { color: c }, line: { type: 'none' } }));
    s.addImage({ path: A(file), x: x + 0.02, y: sy + bar, w: sw - 0.04, h: ih - 0.02, altText: label + ' screen' });
    // same price and stock on every channel
    s.addText([{ text: badgeText, options: { bold: true, color: col } }], {
      x: x + sw - 1.78, y: sy - 0.22, w: 1.72, h: 0.42, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.21,
      fill: { color: C.white }, line: { color: col, width: 2 }, fontFace: F, fontSize: 13, align: 'center', valign: 'middle',
      margin: 0, isTextBox: true, shadow: sh() });
    // label pill
    const lw = 2.7, ly = sy + ih + bar + 0.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + (sw - lw) / 2, y: ly, w: lw, h: 0.48, rectRadius: 0.24, fill: { color: col }, line: { type: 'none' } });
    s.addImage({ data: await icon(ic, C.white), x: x + (sw - lw) / 2 + 0.18, y: ly + 0.1, w: 0.28, h: 0.28 });
    T(label, x + (sw - lw) / 2 + 0.52, ly, lw - 0.62, 0.48, { size: 15, bold: true, color: C.white });
  }

  T('Real screens captured after one POS cash sale in Rentify’s development build (demo store: Aura Botanicals).', 0.6, 6.95, 11.4, 0.3,
    { size: 10, color: C.muted, valign: 'top' });

  s.addNotes(`[1:25–1:50]
Now we sell one bottle at the counter with Rentify POS. Stock was 40. Seconds later the marketplace shows 39 in stock, the merchant dashboard shows 39, and the storefront stays live with the right stock. One sale, updated everywhere — no notebook, no second update.
(Q&A: demo data in the development build, not customer orders.)`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
