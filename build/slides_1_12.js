// Slide 1 (cover) and slide 12 (team + ask), restyled to match slides 2–11.
// Run: node build/slides_1_12.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const A = (f) => path.join(ROOT, 'assets', f);
const DR = path.join(ROOT, 'output', 'drafts');
require('fs').mkdirSync(DR, { recursive: true });

const C = { navy: '111D35', navy2: '1A2A4A', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', mint: 'A7F3D0', soft: '9FB3CF' };
const F = 'Arial';
const CHANNELS = [[C.orange, 'ShoppingBag', 'Marketplace'], [C.blue, 'Globe', 'Storefront'], [C.teal, 'Store', 'POS']];

async function icon(name, color) {
  const inner = lucide[name].map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}
function setup() {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  const s = pres.addSlide(); s.background = { color: C.navy };
  const T = (text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.size || 16,
    bold: !!o.bold, color: o.color || C.white, align: o.align || 'left', valign: o.valign || 'middle', margin: 0,
    isTextBox: true, charSpacing: o.cs });
  const tile = async (x, y, d, col, ic) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: d, h: d, rectRadius: d * 0.22, fill: { color: col }, line: { type: 'none' } });
    s.addImage({ data: await icon(ic, C.white), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
  };
  return { pres, s, T, tile };
}

(async () => {
  // ================= Slide 1: cover =================
  {
    const { pres, s, T, tile } = setup();
    const W = 13.333;
    s.addImage({ path: A('rentify-logo.png'), x: (W - 1.45) / 2, y: 1.3, w: 1.45, h: 1.45, altText: 'Rentify logo' });
    T('Rentify', 0, 2.9, W, 1.0, { size: 60, bold: true, align: 'center' });
    T('Sell everywhere. Manage once.', 0, 3.9, W, 0.6, { size: 26, color: C.mint, align: 'center' });
    // the three channels, joined as one store
    const d = 0.78, gap = 1.25, total = 3 * d + 2 * gap, x0 = (W - total) / 2, y = 5.05;
    s.addShape(pres.shapes.LINE, { x: x0 + d / 2, y: y + d / 2, w: total - d, h: 0, line: { color: '2A3B5C', width: 2, dashType: 'dash' } });
    for (let k = 0; k < 3; k++) {
      const x = x0 + k * (d + gap);
      await tile(x, y, d, CHANNELS[k][0], CHANNELS[k][1]);
      T(CHANNELS[k][2], x - 0.5, y + d + 0.1, d + 1.0, 0.3, { size: 13, bold: true, color: C.soft, align: 'center' });
    }
    s.addNotes(`[0:00–0:15]
Cambodian merchants sell in many places — Facebook, marketplaces and their own shop counter. Rentify lets them sell everywhere and manage once: one store behind their marketplace listing, their own storefront and their POS.`);
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide01_cover.pptx') });
  }

  // ================= Slide 12: team + ask =================
  {
    const { pres, s, T, tile } = setup();
    T('The team behind Rentify', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });
    const team = [
      ['team-v2-1.png', 316, 346, 'Long Mengchheng', 'Team Lead', 'Builds and runs the team'],
      ['team-v2-2.png', 315, 343, 'Hong Thanbrathna', 'Idea Founder', 'Builds the platform'],
      ['team-v2-3.png', 316, 360, 'Khemrak Pasey', 'Business Lead', 'Outreach and strategy'],
      ['team-v2-4.png', 316, 356, 'Mom Sothireak', 'Pitch Lead', 'Presents our brand story'],
      ['team-v2-5.png', 315, 369, 'Vy Seoul', 'Developer', 'Designs the UX/UI'],
    ];
    const cw = 2.3, gap = 0.16, x0 = (13.333 - (5 * cw + 4 * gap)) / 2, cy = 1.3, ch = 2.95;
    for (let i = 0; i < 5; i++) {
      const [file, pw, ph, name, role, sub] = team[i];
      const x = x0 + i * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: cw, h: ch, rectRadius: 0.18, fill: { color: C.navy2 }, line: { type: 'none' } });
      s.addShape(pres.shapes.OVAL, { x: x + cw / 2 - 0.72, y: cy + 0.22, w: 1.44, h: 1.44, fill: { color: '24365A' }, line: { type: 'none' } });
      s.addImage({ path: A('v6/' + file.replace('team-v2-', 'team-sq-')), x: x + cw / 2 - 0.69, y: cy + 0.25, w: 1.38, h: 1.38, rounding: true, altText: name });
      T(name, x + 0.1, cy + 1.8, cw - 0.2, 0.35, { size: 14, bold: true, align: 'center' });
      s.addText(role, { x: x + cw / 2 - 0.8, y: cy + 2.17, w: 1.6, h: 0.32, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.16,
        fill: { color: '17404A' }, line: { type: 'none' }, fontFace: F, fontSize: 11.5, bold: true, color: C.mint,
        align: 'center', valign: 'middle', margin: 0, isTextBox: true });
      T(sub, x + 0.1, cy + 2.55, cw - 0.2, 0.28, { size: 11, color: C.soft, align: 'center' });
    }

    // closing: channel tiles, tagline, one-line ask — all centred
    const W = 13.333, d = 0.46, tg = 0.18, tx0 = (W - (3 * d + 2 * tg)) / 2;
    for (let k = 0; k < 3; k++) await tile(tx0 + k * (d + tg), 4.85, d, CHANNELS[k][0], CHANNELS[k][1]);
    T('Sell everywhere. Manage once.', 0, 5.5, W, 0.75, { size: 36, bold: true, align: 'center' });
    T('Thank you.', 0.6, 6.95, 4, 0.3, { size: 11, color: C.soft });
    s.addNotes(`[4:18–4:45]
We are five students who have already built this platform. Our next step is ten pilot shops in Phnom Penh, starting this quarter. Rentify: sell everywhere, manage once. Thank you.
[Stop here. Keep this slide up for Q&A.]`);
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide12_team.pptx') });
  }
  console.log('done');
})();
