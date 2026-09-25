// Slide 2 ("the messy merchant") as a single-slide draft for review.
// Run: node build/slide2_single.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_v6_slide02_problem.pptx');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });

const C = { ink: '15243A', muted: '52637A', red: 'D64545', green: '16A34A', white: 'FFFFFF',
  yellow: 'FEF08A', chat: 'E0F2FE', chatLine: '7DD3FC', cardLine: 'E2E8F0', fb: '1877F2', tg: '27A7E7' };
const F = 'Arial', HAND = 'Segoe Print';

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
  const shadow = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.18, blur: 6, offset: 3, angle: 90 });

  function note(x, y, w, h, rot, runs, o = {}) {
    s.addText(runs, {
      x, y, w, h, rotate: rot, shape: o.shape || pres.shapes.ROUNDED_RECTANGLE, rectRadius: (o.shape && o.shape !== pres.shapes.ROUNDED_RECTANGLE) ? undefined : 0.12,
      fill: { color: o.fill || C.white }, line: o.line ? { color: o.line, width: 1 } : { type: 'none' },
      shadow: shadow(), fontFace: o.font || F, fontSize: o.size || 16, color: C.ink,
      align: 'center', valign: 'middle', margin: 0.08, isTextBox: true, fit: 'none',
    });
  }
  // Round logo "sticker" that overlaps a card corner.
  async function logo(x, y, d, color, rot, mark) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, rotate: rot, fill: { color }, line: { color: C.white, width: 3 }, shadow: shadow() });
    if (mark === 'f') {
      s.addText('f', { x, y: y + d * 0.06, w: d, h: d, rotate: rot, fontFace: F, fontSize: Math.round(d * 50), bold: true,
        color: C.white, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    } else {
      const p = d * 0.24;
      s.addImage({ data: await icon(mark, C.white), x: x + p - d * 0.03, y: y + p + d * 0.02, w: d - 2 * p, h: d - 2 * p, rotate: rot });
    }
  }
  const small = (t) => ({ text: t, options: { fontSize: 14, color: C.muted, breakLine: true } });
  const big = (t, color) => ({ text: t, options: { fontSize: 30, bold: true, color } });

  s.addText('One merchant. Too many places to update.', { x: 0.6, y: 0.35, w: 12.13, h: 0.7, fontFace: F,
    fontSize: 32, bold: true, color: C.ink, align: 'center', isTextBox: true, margin: 0 });

  // Merchant in the middle
  s.addShape(pres.shapes.OVAL, { x: 4.55, y: 1.75, w: 4.2, h: 4.2, fill: { color: 'FDE2E2' }, line: { type: 'none' } });
  s.addImage({ path: path.join(ROOT, 'assets/v6/stressed-merchant.png'), x: 4.17, y: 1.3, w: 5.0, h: 5.0,
    altText: 'Illustration of a stressed shop owner in an apron grabbing her head' });

  // Left: online channels that still show the old state
  note(0.9, 1.45, 3.2, 1.2, -5, [small('Facebook'), big('IN STOCK', C.green)], { line: C.cardLine });
  await logo(0.55, 1.15, 0.7, C.fb, -5, 'f');
  note(1.05, 3.2, 3.05, 1.2, 4, [small('Khmer24 listing'), big('OLD PRICE', 'D97706')], { line: C.cardLine });
  await logo(0.7, 2.9, 0.68, 'F97316', 4, 'ShoppingBag');
  note(0.9, 4.95, 3.1, 1.15, -3, [small('Telegram'), { text: '27 new orders', options: { fontSize: 22, bold: true, color: C.ink } }], { line: C.cardLine });
  await logo(0.55, 4.65, 0.66, C.tg, -3, 'Send');

  // Right: the shop, where the sale actually happened
  note(9.3, 1.75, 3.1, 1.25, 6, [small('POS at the counter'), big('SOLD OUT', C.red)], { line: C.cardLine });
  await logo(12.05, 1.45, 0.68, '334155', 6, 'Store');
  note(9.5, 4.1, 2.8, 1.2, -6, [{ text: 'Stock: 3? 5? 0?', options: { fontSize: 22, bold: true } }], { fill: C.yellow, shape: pres.shapes.RECTANGLE, font: HAND });
  note(7.7, 1.2, 2.3, 0.72, -5, 'Where’s my order??', { shape: pres.shapes.ROUNDED_RECTANGULAR_CALLOUT, fill: C.chat, line: C.chatLine, size: 15 });

  s.addText('?', { x: 4.6, y: 1.2, w: 0.6, h: 0.8, rotate: -15, fontFace: F, fontSize: 44, bold: true, color: C.red, isTextBox: true, margin: 0 });
  s.addText('??', { x: 7.65, y: 2.2, w: 0.9, h: 0.8, rotate: 12, fontFace: F, fontSize: 36, bold: true, color: C.red, isTextBox: true, margin: 0 });

  s.addText('Illustrative scenario and AI-generated image. How often this happens will be measured in our first merchant pilots.',
    { x: 0.6, y: 6.95, w: 11.4, h: 0.3, fontFace: F, fontSize: 10, color: C.muted, isTextBox: true, margin: 0 });

  s.addNotes(`[0:15–0:40]
But their tools don't connect. Orders arrive on Telegram, products are listed on Facebook and Khmer24, stock lives in a notebook, and sales happen on a separate POS. So when the last item sells at the counter, Facebook still says it's in stock and Khmer24 shows the old price. The result is an apology, a refund and a lost customer.
(Evidence: illustrative scenario. Replace with real merchant quotes once pilot conversations happen.)`);

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
