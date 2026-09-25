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
  white: 'FFFFFF', line: 'E2E8F0', green: '16A34A', mint: 'A7F3D0', soft: 'CBD5E1' };
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
  const sh = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.12, blur: 8, offset: 3, angle: 90 });
  const T = (text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.size || 16,
    bold: !!o.bold, color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0,
    isTextBox: true, charSpacing: o.cs, paraSpaceAfter: o.psa });
  const pill = (text, x, y, w, h, fill, color, size = 12) => s.addText(text, { x, y, w, h,
    shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: h / 2, fill: { color: fill }, line: { type: 'none' },
    fontFace: F, fontSize: size, bold: true, color, align: 'center', valign: 'middle', margin: 0, isTextBox: true });

  T('Merchants first. Their customers become our buyers.', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });
  T('How we start a marketplace that has no buyers yet', 0.6, 1.02, 12.13, 0.4, { size: 16, color: C.muted, align: 'center' });

  const steps = [
    { n: '1', when: 'NOW · Q4 2026', head: 'We bring merchants', ic: 'Store', col: C.teal, tint: 'CCFBF1',
      pts: ['Visit shops in Phnom Penh markets', 'Join Facebook seller groups', 'UniPreneur introductions'],
      tag: ['Goal: 10 pilot shops', 'CCFBF1', '0F766E'] },
    { n: '2', when: '2027 · PUBLIC LAUNCH', head: 'Merchants bring their buyers', ic: 'Share2', col: C.blue, tint: 'DBEAFE',
      pts: ['Each shop shares its Rentify link on Facebook and Telegram', 'Its regular customers order through it'],
      tag: ['0% commission on their own sales', 'DCFCE7', C.green] },
    { n: '3', when: '2027 ONWARDS', head: 'Buyers discover more shops', ic: 'ShoppingBag', col: C.orange, tint: 'FFEDD5',
      pts: ['The marketplace shows products from every shop', 'Festival and category campaigns', 'SME associations and delivery partners'],
      tag: ['Marketplace sales earn commission', 'FFEDD5', 'C2410C'] },
  ];
  const cw = 3.7, gap = 0.6, x0 = (13.333 - (3 * cw + 2 * gap)) / 2, top = 1.7, ch = 3.55;
  for (let i = 0; i < 3; i++) {
    const t = steps[i], x = x0 + i * (cw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: top, w: cw, h: ch, rectRadius: 0.2,
      fill: { color: C.white }, line: { color: C.line, width: 1 }, shadow: sh() });
    // icon tile with step number badge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: top + 0.3, w: 0.72, h: 0.72, rectRadius: 0.16,
      fill: { color: t.col }, line: { type: 'none' } });
    s.addImage({ data: await icon(t.ic, C.white), x: x + 0.46, y: top + 0.46, w: 0.4, h: 0.4 });
    T(t.when, x + 1.2, top + 0.3, cw - 1.45, 0.3, { size: 10.5, bold: true, color: t.col, cs: 1 });
    T(`${t.n}. ${t.head}`, x + 1.2, top + 0.58, cw - 1.4, 0.5, { size: 17, bold: true });
    T(t.pts.map((p, j) => ({ text: p, options: { bullet: { indent: 14 }, breakLine: j < t.pts.length - 1 } })),
      x + 0.3, top + 1.25, cw - 0.55, 1.5, { size: 13, valign: 'top', psa: 6 });
    pill(t.tag[0], x + 0.3, top + ch - 0.72, cw - 0.6, 0.44, t.tag[1], t.tag[2]);
    // arrow to next step
    if (i < 2) s.addImage({ data: await icon('ArrowRight', C.muted), x: x + cw + gap / 2 - 0.2, y: top + ch / 2 - 0.2, w: 0.4, h: 0.4 });
  }

  // flywheel line under the steps
  const fy = top + ch + 0.22;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y: fy, w: 3 * cw + 2 * gap, h: 0.5, rectRadius: 0.25,
    fill: { color: 'EEF2FF' }, line: { type: 'none' } });
  s.addImage({ data: await icon('RefreshCw', '4F46E5'), x: x0 + 0.25, y: fy + 0.11, w: 0.28, h: 0.28 });
  T([{ text: 'The loop: ', options: { bold: true, color: '4F46E5' } },
    { text: 'more shops bring more buyers, and more buyers attract more shops. Shops also earn referral credit for inviting other shops.' }],
    x0 + 0.65, fy, 3 * cw + 2 * gap - 0.9, 0.5, { size: 13 });

  // pilot test
  const py = fy + 0.7, pw = 3 * cw + 2 * gap;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y: py, w: pw, h: 0.78, rectRadius: 0.18,
    fill: { color: C.navy }, line: { type: 'none' } });
  T('PILOT PASSES IF', x0 + 0.3, py, 1.9, 0.78, { size: 11, bold: true, color: C.mint, cs: 1 });
  const mets = [['7 of 10', 'shops active after 30 days'], ['≥99%', 'stock accuracy'], ['6 of 10', 'will pay a subscription']];
  const mw = (pw - 2.3) / 3;
  for (let j = 0; j < 3; j++) {
    const mx = x0 + 2.3 + j * mw;
    T([{ text: mets[j][0] + '  ', options: { bold: true, fontSize: 20, color: C.white } },
      { text: mets[j][1], options: { fontSize: 12, color: C.soft } }], mx, py, mw - 0.1, 0.78, {});
  }

  T('Proposed targets, agreed before the pilot starts. Marketplace-discovered orders are measured separately from shops’ own customers.',
    0.6, 7.0, 12.1, 0.3, { size: 10, color: C.muted, align: 'center' });

  s.addNotes(`[3:20–3:45]
How do we start a marketplace with no buyers? Merchants first. This quarter we sign ten pilot shops in Phnom Penh through market visits, Facebook seller groups and UniPreneur introductions. They join for the tools. Each shop then shares its Rentify link with its own customers, who become our first buyers. On the marketplace, those buyers discover other shops, and that brings more shops in. The pilot passes if seven of ten shops stay active, stock stays 99% accurate, and six of ten will pay.
(Q&A: targets are proposals agreed before the pilot. We count marketplace-discovered orders separately from each shop's own customers, because only those earn commission.)`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
