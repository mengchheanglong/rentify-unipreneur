// Slide 9 ("market") as a single-slide draft for review.
// Run: node build/slide9_single.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_v6_slide09_market.pptx');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });

const C = { navy: '111D35', navy2: '1A2A4A', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', mint: 'A7F3D0', soft: '9FB3CF' };
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

  T('A growing market, counted from the ground up', 0.6, 0.35, 12.13, 0.7, { size: 30, bold: true, align: 'center' });

  // ---------- Left: the market is growing ----------
  const lx = 0.55, ly = 1.35, lw = 5.4, lh = 5.25;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: lx, y: ly, w: lw, h: lh, rectRadius: 0.2, fill: { color: C.navy }, line: { type: 'none' }, shadow: sh() });
  T('CAMBODIA E-COMMERCE', lx + 0.35, ly + 0.3, lw - 0.7, 0.3, { size: 11, bold: true, color: C.mint, cs: 2 });
  const bars = [['2024', 1.51, '$1.51B', C.teal], ['2025*', 1.78, '$1.78B', C.mint]];
  const maxW = lw - 2.3;
  bars.forEach(([yr, v, label, col], k) => {
    const by = ly + 0.8 + k * 0.8, bw = maxW * v / 1.78;
    T(yr, lx + 0.35, by, 0.7, 0.55, { size: 14, bold: true, color: C.soft });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: lx + 1.05, y: by + 0.05, w: bw, h: 0.45, rectRadius: 0.1, fill: { color: col }, line: { type: 'none' } });
    T(label, lx + 1.05 + bw - 1.25, by + 0.05, 1.15, 0.45, { size: 16, bold: true, color: C.navy, align: 'right' });
  });
  s.addText('+17.9% a year', { x: lx + 0.35, y: ly + 2.45, w: 1.9, h: 0.42, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.21,
    fill: { color: C.navy2 }, line: { color: C.teal, width: 1 }, fontFace: F, fontSize: 13, bold: true, color: C.mint,
    align: 'center', valign: 'middle', margin: 0, isTextBox: true });

  // what Cambodians buy and how they pay
  T('TOP ONLINE PURCHASES', lx + 0.35, ly + 3.15, 3.1, 0.3, { size: 11, bold: true, color: C.mint, cs: 2 });
  const stats = [['Shirt', '37%', 'Fashion', 'EC4899'], ['Sparkles', '20%', 'Beauty', 'A855F7'], ['QrCode', '47%', 'pay by QR', C.teal]];
  for (let k = 0; k < 3; k++) {
    const sx = lx + 0.35 + k * 1.62 + (k === 2 ? 0.1 : 0), sy = ly + 3.6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: sx, y: sy, w: 0.56, h: 0.56, rectRadius: 0.13, fill: { color: stats[k][3] }, line: { type: 'none' } });
    s.addImage({ data: await icon(stats[k][0], C.white), x: sx + 0.13, y: sy + 0.13, w: 0.3, h: 0.3 });
    T(stats[k][1], sx + 0.65, sy - 0.05, 0.95, 0.4, { size: 20, bold: true, color: C.white });
    T(stats[k][2], sx + 0.65, sy + 0.33, 0.95, 0.28, { size: 11, color: C.soft });
  }
  T('HOW THEY PAY', lx + 0.35 + 2 * 1.62 + 0.1, ly + 3.15, 1.6, 0.3, { size: 11, bold: true, color: C.mint, cs: 2 });
  s.addShape(pres.shapes.LINE, { x: lx + 0.35 + 2 * 1.62 - 0.08, y: ly + 3.2, w: 0, h: 1.05, line: { color: '2A3B5C', width: 1 } });
  T('Our first categories are the two biggest.', lx + 0.35, ly + 4.45, lw - 0.7, 0.5, { size: 13, bold: true, color: C.white });

  // ---------- Right: bottom-up TAM / SAM / SOM, numbers inside the circles ----------
  const base = 6.6, ccx = 9.55;
  const circles = [
    ['TAM', 'all retail shops', 5.1, 'DBEAFE', C.blue, '410,600', '$24.6M / yr'],
    ['SAM', 'specialized stores', 3.45, 'CCFBF1', C.teal, '65,400', '$3.9M / yr'],
    ['SOM', 'by Year 3', 1.8, 'FFEDD5', C.orange, '≈1,130', '$67.7K / yr'],
  ];
  circles.forEach(([, , d, fill]) => {
    s.addShape(pres.shapes.OVAL, { x: ccx - d / 2, y: base - d, w: d, h: d, fill: { color: fill }, line: { color: C.white, width: 2 } });
  });
  const band = (i, top, big) => {
    const [k, desc, , , col, num, usd] = circles[i];
    T([{ text: k, options: { bold: true, color: col } }, { text: '  ·  ' + desc, options: { color: C.muted } }],
      ccx - 1.6, top, 3.2, 0.28, { size: big ? 11.5 : 10, align: 'center' });
    T(num, ccx - 1.6, top + 0.26, 3.2, 0.5, { size: big ? 26 : 20, bold: true, align: 'center' });
    T(usd, ccx - 1.6, top + (big ? 0.76 : 0.68), 3.2, 0.3, { size: big ? 14 : 12, bold: true, color: col, align: 'center' });
  };
  band(0, base - 5.1 + 0.3, true);
  band(1, base - 3.45 + 0.27, true);
  band(2, base - 1.8 + 0.35, false);

  T('*2025 projected. Sources: Ministry of Commerce iTrade Bulletin (Mar 2025); NIS Economic Census 2022. Value = shops × US$60/yr subscription; commission not included.',
    0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted });

  s.addNotes(`[2:55–3:20]
Cambodia's e-commerce market was 1.51 billion dollars in 2024 and is projected to reach 1.78 billion this year — growing about 18% a year. Fashion and beauty are the two biggest online categories, which is exactly where we start, and almost half of payments already use QR. From the ground up: Cambodia has about 410,000 retail shops — a 24.6 million dollar subscription market. We focus on 65,000 specialised stores, worth 3.9 million a year, and aim for about 1,100 paying shops by Year 3. Marketplace commission comes on top.
(Q&A: $1.51B is total e-commerce transaction value, not Rentify revenue. Half of Cambodian businesses have only one employee — our simple, low-cost plans fit them.)`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
