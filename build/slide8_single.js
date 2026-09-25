// Slide 8 ("who we serve first") as a single-slide draft for review.
// Run: node build/slide8_single.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const A = (f) => path.join(ROOT, 'assets', f);
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_v6_slide08_customers.pptx');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });

const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', green: '16A34A', mint: 'A7F3D0', soft: '9FB3CF', fb: '1877F2', tg: '27A7E7', grey: '64748B' };
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
  const tile = async (x, y, d, col, ic) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: d, h: d, rectRadius: d * 0.22, fill: { color: col }, line: { type: 'none' } });
    s.addImage({ data: await icon(ic, C.white), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
  };
  const round = async (x, y, d, col, mark) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: col }, line: { type: 'none' } });
    if (mark === 'f') T('f', x, y + d * 0.05, d, d, { size: Math.round(d * 44), bold: true, color: C.white, align: 'center' });
    else s.addImage({ data: await icon(mark, C.white), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5 });
  };

  T('Who we serve first', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });

  const personas = [
    { img: 'v6/persona-facebook.png', name: 'Facebook seller', tint: 'FFEDD5',
      today: [[C.fb, 'f'], [C.tg, 'Send']], start: [[C.orange, 'ShoppingBag', 'Marketplace']], plan: ['Free', C.orange, 'FFEDD5'] },
    { img: 'v6/persona-shop.png', name: 'Small shop', tint: 'DBEAFE',
      today: [[C.grey, 'Calculator'], [C.grey, 'NotebookPen']], start: [[C.blue, 'Globe', 'Storefront'], [C.teal, 'Store', 'POS']], plan: ['Starter', C.white, C.navy] },
  ];
  const cw = 4.1, gap = 0.3, x0 = 0.55, cy = 1.35, ch = 5.25;
  for (let i = 0; i < 2; i++) {
    const p = personas[i], x = x0 + i * (cw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: cw, h: ch, rectRadius: 0.2, fill: { color: C.white },
      line: { color: C.line, width: 1 }, shadow: sh() });
    // photo on a tinted circle
    s.addShape(pres.shapes.OVAL, { x: x + cw / 2 - 1.0, y: cy + 0.35, w: 2.0, h: 2.0, fill: { color: p.tint }, line: { type: 'none' } });
    s.addImage({ path: A(p.img), x: x + cw / 2 - 0.95, y: cy + 0.15, w: 1.9, h: 2.37, altText: p.name + ' (illustrative persona)' });
    T(p.name, x, cy + 2.6, cw, 0.45, { size: 22, bold: true, align: 'center' });
    // Today row
    T('TODAY', x + 0.35, cy + 3.4, 1.4, 0.3, { size: 11, bold: true, color: C.muted, cs: 1 });
    for (let k = 0; k < p.today.length; k++) await round(x + 1.75 + k * 0.62, cy + 3.32, 0.46, p.today[k][0], p.today[k][1]);
    // On Rentify row
    T('ON RENTIFY', x + 0.35, cy + 4.3, 1.4, 0.3, { size: 11, bold: true, color: C.teal, cs: 1 });
    let tx = x + 1.75;
    for (const [col, ic, label] of p.start) {
      await tile(tx, cy + 4.05, 0.62, col, ic);
      T(label, tx - 0.2, cy + 4.7, 1.02, 0.25, { size: 10, bold: true, color: col, align: 'center' });
      tx += 0.95;
    }
    s.addText(p.plan[0] + ' plan', { x: x + cw - 1.6, y: cy + 0.3, w: 1.3, h: 0.4, shape: pres.shapes.ROUNDED_RECTANGLE,
      rectRadius: 0.2, fill: { color: p.plan[2] }, line: { type: 'none' }, fontFace: F, fontSize: 13, bold: true,
      color: p.plan[1], align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  }

  // Beachhead
  const bx = x0 + 2 * (cw + gap), bw = 13.333 - 0.55 - bx;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: cy, w: bw, h: ch, rectRadius: 0.2, fill: { color: C.navy },
    line: { type: 'none' }, shadow: sh() });
  T('WE START IN', bx + 0.35, cy + 0.3, bw - 0.7, 0.3, { size: 11, bold: true, color: C.mint, cs: 2 });
  s.addImage({ data: await icon('MapPin', 'F87171'), x: bx + 0.3, y: cy + 0.72, w: 0.55, h: 0.55 });
  T('Phnom Penh', bx + 0.95, cy + 0.68, bw - 1.1, 0.62, { size: 24, bold: true, color: C.white });
  // big fact
  T('1 in 5', bx + 0.35, cy + 1.35, bw - 0.7, 0.6, { size: 34, bold: true, color: C.mint });
  T('Cambodian businesses are here', bx + 0.35, cy + 1.92, bw - 0.7, 0.3, { size: 12, color: C.soft });
  s.addShape(pres.shapes.LINE, { x: bx + 0.35, y: cy + 2.4, w: bw - 0.7, h: 0, line: { color: '2A3B5C', width: 1 } });
  T('FIRST CATEGORIES', bx + 0.35, cy + 2.55, 2.2, 0.3, { size: 11, bold: true, color: C.mint, cs: 2 });
  const cats = [['Shirt', 'Fashion', 'EC4899', '37%'], ['Sparkles', 'Beauty', 'A855F7', '20%'], ['Smartphone', 'Electronics', '3B82F6', null], ['Sofa', 'Home', 'F59E0B', null]];
  const d = 0.64, colW = (bw - 0.7) / 2;
  for (let k = 0; k < 4; k++) {
    const cx2 = bx + 0.35 + (k % 2) * colW + (colW - d) / 2, cyy = cy + 3.12 + Math.floor(k / 2) * 1.02;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx2, y: cyy, w: d, h: d, rectRadius: 0.16, fill: { color: cats[k][2] }, line: { type: 'none' } });
    s.addImage({ data: await icon(cats[k][0], C.white), x: cx2 + 0.16, y: cyy + 0.16, w: 0.32, h: 0.32 });
    if (cats[k][3]) s.addText(cats[k][3], { x: cx2 + d - 0.28, y: cyy - 0.18, w: 0.6, h: 0.32, shape: pres.shapes.ROUNDED_RECTANGLE,
      rectRadius: 0.16, fill: { color: C.white }, line: { type: 'none' }, fontFace: F, fontSize: 11, bold: true, color: cats[k][2],
      align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    T(cats[k][1], cx2 - 0.4, cyy + d + 0.04, d + 0.8, 0.26, { size: 12, bold: true, color: C.white, align: 'center' });
  }

  T('Persona photos are illustrative. Sources: NIS Economic Census 2022 (Phnom Penh has 20% of establishments); Ministry of Commerce iTrade Bulletin, March 2025 (37% / 20% = share of online purchases).',
    0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted });

  s.addNotes(`[2:35–2:55]
We serve two merchants first. The Facebook seller sells through posts and Telegram today; they start free on our marketplace. The small shop runs a cash box and a notebook today; they start on Starter with their own storefront and POS. We begin in Phnom Penh, home to one in five Cambodian businesses, with fashion, beauty, electronics and home goods.`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
