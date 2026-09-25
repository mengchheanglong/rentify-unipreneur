// Slide 6 ("what makes Rentify different") as a single-slide draft for review.
// Run: node build/slide6_single.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_v6_slide06_different.pptx');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });

const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', green: '16A34A', red: 'D64545' };
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
    bold: !!o.bold, color: o.color || C.ink, align: o.align || 'center', valign: o.valign || 'middle', margin: 0,
    isTextBox: true, charSpacing: o.cs });
  const tile = async (x, y, d, col, ic) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: d, h: d, rectRadius: d * 0.22, fill: { color: col }, line: { type: 'none' } });
    s.addImage({ data: await icon(ic, C.white), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5 });
  };

  T('What makes Rentify different', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true });

  const cw = 3.85, gap = 0.3, x0 = (13.333 - (3 * cw + 2 * gap)) / 2, cy = 1.45, ch = 5.05;
  const cards = [
    ['01', 'Start anywhere', 'Begin on the marketplace. Add your own store and POS later — no re-listing.'],
    ['02', 'One stock everywhere', 'Sell at the counter and every channel shows the new stock.'],
    ['03', 'Fair pricing', 'We only earn when our marketplace brings the sale.'],
  ];
  for (let i = 0; i < 3; i++) {
    const x = x0 + i * (cw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: cw, h: ch, rectRadius: 0.2, fill: { color: C.white },
      line: { color: C.line, width: 1 }, shadow: sh() });
    T(cards[i][0], x + 0.3, cy + 0.25, 1, 0.4, { size: 14, bold: true, color: C.muted, align: 'left', cs: 2 });
    // text block
    T(cards[i][1], x + 0.2, cy + 4.05, cw - 0.4, 0.6, { size: 22, bold: true });
  }

  const perfume = path.join(ROOT, 'assets', 'v6', 's4-product-perfume.png');
  const productBadge = (tx, ty) => {
    s.addShape(pres.shapes.OVAL, { x: tx - 0.03, y: ty - 0.03, w: 0.46, h: 0.46, fill: { color: C.white }, line: { color: C.line, width: 1 }, shadow: sh() });
    s.addImage({ path: perfume, x: tx + 0.02, y: ty + 0.02, w: 0.36, h: 0.36, rounding: true });
  };

  // 01 — staircase: marketplace, then website, then counter; the same product rides along
  {
    const x = x0, d = 0.82;
    const steps = [[C.orange, 'ShoppingBag', 'Marketplace'], [C.blue, 'Globe', 'Storefront'], [C.teal, 'Store', 'POS']];
    for (let k = 0; k < 3; k++) {
      const tx = x + 0.32 + k * 1.15, ty = cy + 2.6 - k * 0.78;
      await tile(tx, ty, d, steps[k][0], steps[k][1]);
      productBadge(tx + d - 0.25, ty - 0.2);
      T(steps[k][2], tx - 0.2, ty + d + 0.06, d + 0.4, 0.28, { size: 12, bold: true, color: steps[k][0] });
      if (k < 2) s.addImage({ data: await icon('ChevronRight', C.muted), x: tx + d + 0.08, y: ty - 0.05, w: 0.28, h: 0.28 });
    }
  }

  // 02 — one sale (-1) feeds every channel, all showing 39
  {
    const x = x0 + (cw + gap), d = 0.78, rx = x + cw / 2 - 0.42, ry = cy + 0.75;
    s.addShape(pres.shapes.OVAL, { x: rx, y: ry, w: 0.84, h: 0.84, fill: { color: C.navy }, line: { type: 'none' } });
    s.addImage({ data: await icon('Receipt', C.white), x: rx + 0.2, y: ry + 0.2, w: 0.44, h: 0.44 });
    s.addText('−1', { x: rx + 0.58, y: ry - 0.12, w: 0.46, h: 0.46, shape: pres.shapes.OVAL, fill: { color: C.red },
      line: { color: C.white, width: 2 }, fontFace: F, fontSize: 13, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    const ch3 = [[C.blue, 'Globe'], [C.orange, 'ShoppingBag'], [C.teal, 'Store']];
    for (let k = 0; k < 3; k++) {
      const tx = x + 0.45 + k * 1.1, ty = cy + 2.45;
      const x1 = x + cw / 2, x2 = tx + d / 2;
      s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: ry + 0.9, w: Math.abs(x2 - x1) || 0.001, h: ty - (ry + 0.9) - 0.04,
        flipH: x2 < x1, line: { color: ch3[k][0], width: 2, endArrowType: 'triangle' } });
      await tile(tx, ty, d, ch3[k][0], ch3[k][1]);
      s.addText('39', { x: tx + d - 0.3, y: ty - 0.17, w: 0.46, h: 0.46, shape: pres.shapes.OVAL, fill: { color: C.white },
        line: { color: ch3[k][0], width: 2 }, fontFace: F, fontSize: 12, bold: true, color: ch3[k][0], align: 'center',
        valign: 'middle', margin: 0, isTextBox: true });
    }
  }

  // 03 — own channels 0%, marketplace a small %
  {
    const x = x0 + 2 * (cw + gap), d = 0.66;
    const rows = [[[[C.blue, 'Globe'], [C.teal, 'Store']], '0%', C.green, 46], [[[C.orange, 'ShoppingBag']], 'small %', C.orange, 26]];
    for (let r = 0; r < 2; r++) {
      const ry = cy + 1.05 + r * 1.5;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: ry - 0.2, w: cw - 0.6, h: 1.1, rectRadius: 0.18,
        fill: { color: r === 0 ? 'DCFCE7' : 'FFEDD5' }, line: { type: 'none' } });
      const tiles = rows[r][0];
      for (let k = 0; k < tiles.length; k++) await tile(x + 0.5 + k * (d + 0.14), ry, d, tiles[k][0], tiles[k][1]);
      const ax = x + 0.5 + tiles.length * (d + 0.14) + 0.02;
      s.addImage({ data: await icon('ArrowRight', C.muted), x: ax, y: ry + d / 2 - 0.14, w: 0.28, h: 0.28 });
      T(rows[r][1], ax + 0.38, ry - 0.2, x + cw - 0.4 - (ax + 0.38), 1.1, { size: rows[r][3], bold: true, color: rows[r][2] });
    }
  }

  s.addNotes(`[1:50–2:15]
Three things make Rentify different. One: start anywhere — a merchant can begin on our marketplace and add their own store and POS later, without re-listing a single product. Two: one sale updates every channel, as you just saw. Three: fair pricing — merchants pay nothing on their own storefront and counter sales. We only earn when our marketplace brings the sale.`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
