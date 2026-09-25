// Slide 10 ("go-to-market": merchants first, their customers become the first buyers) as a single-slide draft.
// Run: node build/slide10gtm_single.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_v6_slide10_go-to-market.pptx');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });

const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', green: '16A34A', mint: 'A7F3D0', soft: '9FB3CF', fb: '1877F2', tg: '27A7E7',
  grey: '64748B', indigo: '4F46E5' };
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
  const round = async (x, y, d, col, mark) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: col }, line: { type: 'none' } });
    if (mark === 'f') T('f', x, y + d * 0.05, d, d, { size: Math.round(d * 44), bold: true, color: C.white });
    else s.addImage({ data: await icon(mark, C.white), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5 });
  };
  const pill = (text, x, y, w, h, fill, color, size = 12.5) => s.addText(text, { x, y, w, h,
    shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: h / 2, fill: { color: fill }, line: { type: 'none' },
    fontFace: F, fontSize: size, bold: true, color, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  const arrow = async (x, y, sz = 0.3) => s.addImage({ data: await icon('ArrowRight', C.muted), x, y, w: sz, h: sz });
  const badge = (text, x, y, col) => s.addText(text, { x, y, w: 0.46, h: 0.46, shape: pres.shapes.OVAL,
    fill: { color: C.white }, line: { color: col, width: 2 }, fontFace: F, fontSize: 12, bold: true, color: col,
    align: 'center', valign: 'middle', margin: 0, isTextBox: true });

  T('Merchants first. Their customers become our buyers.', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true });

  const cw = 3.75, gap = 0.55, x0 = (13.333 - (3 * cw + 2 * gap)) / 2, cy = 1.35, ch = 4.1;
  const cards = [
    ['01', 'Now · Q4 2026', C.teal, 'We bring shops', ['Goal: 10 pilot shops', 'CCFBF1', '0F766E']],
    ['02', '2027', C.blue, 'Shops bring customers', ['0% on their own sales', 'DCFCE7', C.green]],
    ['03', '2027+', C.orange, 'Buyers find more shops', ['Commission on marketplace sales', 'FFEDD5', 'C2410C']],
  ];
  for (let i = 0; i < 3; i++) {
    const x = x0 + i * (cw + gap), c = cards[i];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: cw, h: ch, rectRadius: 0.2, fill: { color: C.white },
      line: { color: C.line, width: 1 }, shadow: sh() });
    T(c[0], x + 0.3, cy + 0.25, 1, 0.4, { size: 14, bold: true, color: C.muted, align: 'left', cs: 2 });
    T(c[1].toUpperCase(), x + cw - 2.3, cy + 0.25, 2.0, 0.4, { size: 11, bold: true, color: c[2], align: 'right', cs: 1 });
    T(c[3], x + 0.2, cy + 2.6, cw - 0.4, 0.5, { size: 20, bold: true });
    pill(c[4][0], x + 0.35, cy + ch - 0.8, cw - 0.7, 0.44, c[4][1], c[4][2]);
    if (i < 2) await arrow(x + cw + gap / 2 - 0.17, cy + ch / 2 - 0.17, 0.34);
  }

  // 01: our three recruiting channels feed one pilot shop
  {
    const x = x0, d = 0.5, mx = x + cw / 2;
    const src = [[C.teal, 'MapPin', 'Markets'], [C.fb, 'f', 'FB groups'], [C.indigo, 'GraduationCap', 'UniPreneur']];
    for (let k = 0; k < 3; k++) {
      const sx = x + 0.45 + k * 1.1;
      await round(sx, cy + 0.8, d, src[k][0], src[k][1]);
      T(src[k][2], sx - 0.3, cy + 0.8 + d + 0.03, d + 0.6, 0.26, { size: 10.5, bold: true, color: C.grey });
      s.addShape(pres.shapes.LINE, { x: Math.min(sx + d / 2, mx), y: cy + 1.62, w: Math.abs(mx - (sx + d / 2)) || 0.001, h: 0.2,
        flipH: sx + d / 2 > mx, line: { color: C.line, width: 1.5 } });
    }
    await tile(mx - 0.36, cy + 1.83, 0.72, C.teal, 'Store');
    badge('10', mx + 0.18, cy + 1.66, C.teal);
  }

  // 02: shop shares its link on Facebook/Telegram, its own customers come in
  {
    const x = x0 + (cw + gap), y = cy + 1.2;
    await tile(x + 0.35, y, 0.72, C.teal, 'Store');
    await arrow(x + 1.12, y + 0.22, 0.28);
    await round(x + 1.45, y - 0.12, 0.44, C.fb, 'f');
    await round(x + 1.45, y + 0.4, 0.44, C.tg, 'Send');
    await arrow(x + 1.97, y + 0.22, 0.28);
    await tile(x + 2.32, y, 0.72, C.blue, 'Users');
    T('Store link', x + 1.2, y + 0.9, 1.0, 0.26, { size: 10.5, bold: true, color: C.grey });
    T('Customers', x + 2.12, y + 0.9, 1.12, 0.26, { size: 10.5, bold: true, color: C.blue });
  }

  // 03: marketplace hub linking many shops
  {
    const x = x0 + 2 * (cw + gap), mx = x + cw / 2, hy = cy + 0.75;
    await tile(mx - 0.4, hy, 0.8, C.orange, 'ShoppingBag');
    const d = 0.5, sy = cy + 1.85;
    for (let k = 0; k < 4; k++) {
      const sx = x + 0.55 + k * 0.72;
      s.addShape(pres.shapes.LINE, { x: Math.min(sx + d / 2, mx), y: hy + 0.8, w: Math.abs(mx - (sx + d / 2)) || 0.001,
        h: sy - hy - 0.8, flipH: sx + d / 2 > mx, line: { color: 'FED7AA', width: 1.5 } });
      await tile(sx, sy, d, k === 1 ? C.teal : 'CBD5E1', 'Store');
    }
  }

  // loop back from 03 to 01
  {
    const ly = cy + ch + 0.35, x1 = x0 + cw / 2, x3 = x0 + 2 * (cw + gap) + cw / 2;
    const ln = { color: C.indigo, width: 2, dashType: 'dash' };
    s.addShape(pres.shapes.LINE, { x: x3, y: cy + ch, w: 0.001, h: ly - cy - ch, line: ln });
    s.addShape(pres.shapes.LINE, { x: x1, y: ly, w: x3 - x1, h: 0.001, line: ln });
    s.addShape(pres.shapes.LINE, { x: x1, y: cy + ch + 0.03, w: 0.001, h: ly - cy - ch - 0.03, flipV: true,
      line: { ...ln, endArrowType: 'triangle' } });
    const pw = 3.6, px = (x1 + x3) / 2 - pw / 2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: ly - 0.22, w: pw, h: 0.44, rectRadius: 0.22,
      fill: { color: 'EEF2FF' }, line: { color: C.indigo, width: 1 } });
    s.addImage({ data: await icon('RefreshCw', C.indigo), x: px + 0.2, y: ly - 0.12, w: 0.24, h: 0.24 });
    T('More buyers bring more shops', px + 0.5, ly - 0.22, pw - 0.65, 0.44, { size: 12.5, bold: true, color: C.indigo });
  }

  // pilot pass targets
  {
    const py = 6.2, pw = 3 * cw + 2 * gap;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y: py, w: pw, h: 0.62, rectRadius: 0.16, fill: { color: C.navy }, line: { type: 'none' } });
    T('PILOT PASSES IF', x0 + 0.3, py, 1.9, 0.62, { size: 11, bold: true, color: C.mint, align: 'left', cs: 1 });
    const mets = [['Users', '7 of 10', 'shops stay active'], ['Boxes', '≥99%', 'stock accuracy'], ['Wallet', '6 of 10', 'will pay']];
    const mw = (pw - 2.3) / 3;
    for (let j = 0; j < 3; j++) {
      const mx = x0 + 2.3 + j * mw;
      s.addImage({ data: await icon(mets[j][0], C.mint), x: mx, y: py + 0.18, w: 0.26, h: 0.26 });
      T([{ text: mets[j][1] + '  ', options: { bold: true, fontSize: 18, color: C.white } },
        { text: mets[j][2], options: { fontSize: 12, color: C.soft } }], mx + 0.4, py, mw - 0.5, 0.62, { align: 'left' });
    }
  }

  T('Proposed pilot targets, agreed before the pilot starts. Marketplace-discovered orders are counted separately from shops’ own customers.',
    0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted, align: 'left' });

  s.addNotes(`[3:20–3:45]
How do we start a marketplace with no buyers? Merchants first. This quarter we sign ten pilot shops in Phnom Penh through market visits, Facebook seller groups and UniPreneur introductions. They join for the tools. Each shop then shares its Rentify link with its own customers, who become our first buyers. On the marketplace, those buyers discover other shops, and that brings more shops in. The pilot passes if seven of ten shops stay active, stock stays 99% accurate, and six of ten will pay.
(Q&A: targets are proposals agreed before the pilot. We count marketplace-discovered orders separately from each shop's own customers, because only those earn commission. Later growth channels: festival campaigns, SME associations, delivery partners, referral credit.)`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
