// Slide 3 ("everyone solves one piece") as a single-slide draft for review.
// Run: node build/slide3_single.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_v6_slide03_gap.pptx');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });

const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', teal: '0AA7A2', white: 'FFFFFF',
  pale: 'F1F5F9', line: 'CBD5E1', lightTeal: 'D6F4F0' };
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
  const T = (text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.size || 16,
    bold: !!o.bold, color: o.color || C.ink, align: o.align || 'center', valign: o.valign || 'middle', margin: 0, isTextBox: true });

  T('Today, merchants use a different tool for each piece.', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true });

  const cols = [
    ['Globe', 'Your own store', ['Facebook page', 'Website builders'], '2463E8', 'DCEBFF'],
    ['ShoppingBag', 'Marketplace', ['Khmer24', 'VTENH', 'Smile Shop'], 'F97316', 'FFEDD5'],
    ['Store', 'Shop counter', ['POS apps', 'Cash box'], '0AA7A2', 'D6F4F0'],
  ];
  const cw = 3.7, gap = 0.45, x0 = (13.333 - (3 * cw + 2 * gap)) / 2;
  const sh = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.18, blur: 8, offset: 3, angle: 90 });
  const cx = [];
  for (let i = 0; i < 3; i++) {
    const [ic, label, tools, col, tint] = cols[i];
    const x = x0 + i * (cw + gap), mid = x + cw / 2;
    cx.push(mid);
    // solid colour tile with a white icon
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mid - 0.5, y: 1.3, w: 1.0, h: 1.0, rectRadius: 0.22,
      fill: { color: col }, line: { type: 'none' }, shadow: sh() });
    s.addImage({ data: await icon(ic, C.white), x: mid - 0.27, y: 1.53, w: 0.54, h: 0.54 });
    T(label, x, 2.42, cw, 0.45, { size: 21, bold: true });
    tools.forEach((name, j) => {
      s.addText(name, { x: x + 0.45, y: 3.0 + j * 0.56, w: cw - 0.9, h: 0.46, shape: pres.shapes.ROUNDED_RECTANGLE,
        rectRadius: 0.23, fill: { color: tint }, line: { type: 'none' }, fontFace: F, fontSize: 14, bold: true,
        color: col, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    });
  }
  for (let i = 1; i < 3; i++) {
    const x = x0 + i * (cw + gap) - gap / 2;
    s.addShape(pres.shapes.LINE, { x, y: 1.35, w: 0, h: 3.3, line: { color: C.line, width: 1.5, dashType: 'dash' } });
  }

  // three pieces flow into one Rentify card
  const cardW = 6.4, cardX = (13.333 - cardW) / 2, cardY = 5.45, cardH = 1.2;
  const ends = [cardX + 1.2, cardX + cardW / 2, cardX + cardW - 1.2];
  for (let i = 0; i < 3; i++) {
    const x1 = cx[i], x2 = ends[i], y1 = 4.75, y2 = cardY - 0.04;
    s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: y1, w: Math.abs(x2 - x1) || 0.001, h: y2 - y1,
      flipH: x2 < x1, line: { color: cols[i][3], width: 3, endArrowType: 'triangle' } });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cardX, y: cardY, w: cardW, h: cardH, rectRadius: 0.25,
    fill: { color: C.navy }, line: { type: 'none' }, shadow: sh() });
  s.addImage({ path: path.join(ROOT, 'assets', 'rentify-logo.png'), x: cardX + 0.25, y: cardY + 0.2, w: 0.8, h: 0.8, altText: 'Rentify logo' });
  s.addText([
    { text: 'Rentify', options: { bold: true, color: C.white, fontSize: 26, breakLine: true } },
    { text: 'All three. One stock.', options: { color: 'A7F3D0', fontSize: 16, bold: true } },
  ], { x: cardX + 1.25, y: cardY, w: 3.0, h: cardH, fontFace: F, valign: 'middle', margin: 0, isTextBox: true });
  for (let i = 0; i < 3; i++) {
    const d = 0.62, x = cardX + cardW - 0.3 - (3 - i) * (d + 0.14) + 0.14;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cardY + (cardH - d) / 2, w: d, h: d, rectRadius: 0.14,
      fill: { color: cols[i][3] }, line: { type: 'none' } });
    s.addImage({ data: await icon(cols[i][0], C.white), x: x + 0.15, y: cardY + (cardH - d) / 2 + 0.15, w: d - 0.3, h: d - 0.3 });
  }

  s.addText('Khmum eShop also combines several pieces; our comparison is in the appendix.',
    { x: 0.6, y: 6.95, w: 11.4, h: 0.3, fontFace: F, fontSize: 10, color: C.muted, isTextBox: true, margin: 0 });

  s.addNotes(`[0:40–1:05]
Merchants already have tools, and each solves one piece. A Facebook page or a website builder gives them their own store. Khmer24, VTENH and Smile Shop give them a marketplace. POS apps and cash boxes handle the counter. Khmum is the closest to combining them, and we respect it. Tesla wasn't the first electric car. Rentify brings all three pieces together on one stock — so merchants don't have to stitch them together.`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
