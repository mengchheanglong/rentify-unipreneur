// "Try it yourself" slide: QR code to the live Rentify Marketplace + live screenshot.
// Run: node build/slide_qr.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const A = (f) => path.join(ROOT, 'assets', 'v6', f);
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_slide_try-it_QR.pptx');
const C = { navy: '111D35', navy2: '1A2A4A', ink: '15243A', muted: '52637A', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', mint: 'A7F3D0', soft: '9FB3CF', bar: 'E2E8F0' };
const F = 'Arial';

async function icon(name, color) {
  const inner = lucide[name].map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  const s = pres.addSlide(); s.background = { color: C.navy };
  const T = (t, x, y, w, h, o = {}) => s.addText(t, { x, y, w, h, fontFace: F, fontSize: o.size || 14, bold: !!o.bold,
    color: o.color || C.white, align: o.align || 'left', valign: o.valign || 'middle', margin: 0, isTextBox: true, charSpacing: o.cs });

  // left: headline + steps
  T('TRY IT YOURSELF', 0.7, 0.85, 5.5, 0.35, { size: 13, bold: true, color: C.mint, cs: 3 });
  T('Rentify is live.\nTry it now.', 0.7, 1.25, 6.2, 1.6, { size: 40, bold: true });
  const steps = [['ScanLine', 'Scan the QR code with your phone camera'], ['LayoutTemplate', 'Explore templates and the live demo'], ['Rocket', 'Start free, no credit card needed']];
  for (let k = 0; k < 3; k++) {
    const y = 3.2 + k * 0.78;
    s.addShape(pres.shapes.OVAL, { x: 0.7, y, w: 0.56, h: 0.56, fill: { color: k === 0 ? C.orange : C.navy2 }, line: { color: C.teal, width: 1 } });
    s.addImage({ data: await icon(steps[k][0], C.white), x: 0.84, y: y + 0.14, w: 0.28, h: 0.28 });
    T(steps[k][1], 1.45, y, 5.0, 0.56, { size: 17 });
  }
  s.addText('rentify.mekhla.digital', { x: 0.7, y: 5.75, w: 4.6, h: 0.5, shape: pres.shapes.ROUNDED_RECTANGLE,
    rectRadius: 0.25, fill: { color: C.navy2 }, line: { color: C.teal, width: 1 }, fontFace: F, fontSize: 16, bold: true,
    color: C.mint, align: 'center', valign: 'middle', margin: 0, isTextBox: true });

  // right: live screenshot in a browser frame, QR card overlapping
  const bx = 6.75, by = 1.0, bw = 5.95, bar = 0.28, ih = bw * 1350 / 2160;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: by, w: bw, h: ih + bar, rectRadius: 0.08, fill: { color: C.white }, line: { type: 'none' },
    shadow: { type: 'outer', color: '000000', opacity: 0.35, blur: 12, offset: 4, angle: 90 } });
  s.addShape(pres.shapes.RECTANGLE, { x: bx + 0.02, y: by + 0.02, w: bw - 0.04, h: bar - 0.02, fill: { color: C.bar }, line: { type: 'none' } });
  ['F87171', 'FBBF24', '34D399'].forEach((c, k) => s.addShape(pres.shapes.OVAL, { x: bx + 0.12 + k * 0.16, y: by + 0.09, w: 0.1, h: 0.1, fill: { color: c }, line: { type: 'none' } }));
  s.addImage({ path: A('live-rentify.png'), x: bx + 0.02, y: by + bar, w: bw - 0.04, h: ih - 0.02, altText: 'Live Rentify website home page' });

  const qs = 2.45, qx = bx + bw - qs - 0.05, qy = 3.85;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: qx - 0.18, y: qy - 0.18, w: qs + 0.36, h: qs + 0.75, rectRadius: 0.16, fill: { color: C.white },
    line: { color: C.teal, width: 3 }, shadow: { type: 'outer', color: '000000', opacity: 0.35, blur: 12, offset: 4, angle: 90 } });
  s.addImage({ path: A('qr-rentify.png'), x: qx, y: qy, w: qs, h: qs, altText: 'QR code to rentify.mekhla.digital' });
  T('Scan to try Rentify', qx, qy + qs + 0.05, qs, 0.4, { size: 16, bold: true, color: C.ink, align: 'center' });

  s.addNotes(`[Q&A / demo]
Rentify is live. Scan the QR code to explore our templates, try the live demo, and start free, with no credit card needed.
(Before presenting: open rentify.mekhla.digital once to make sure it is up. Keep this slide on screen during Q&A so judges can scan it.)`);

  await pres.writeFile({ fileName: OUT }); console.log('wrote', OUT);
})();
