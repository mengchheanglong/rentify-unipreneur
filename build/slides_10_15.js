// Appendix slide 14 ("how we grow": paying shops by year, Q&A backup for go-to-market) and appendix slide 15 (competitor evidence).
// Run: node build/slides_10_15.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = path.resolve(__dirname, '..');
const DR = path.join(ROOT, 'output', 'drafts');
require('fs').mkdirSync(DR, { recursive: true });

const C = { navy: '111D35', navy2: '1A2A4A', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', line: 'E2E8F0', pale: 'F1F5F9', mint: 'A7F3D0', soft: '9FB3CF', green: '16A34A' };
const F = 'Arial';

async function icon(name, color) {
  const inner = lucide[name].map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}
function setup() {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  const s = pres.addSlide();
  const T = (text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.size || 16,
    bold: !!o.bold, color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0,
    isTextBox: true, charSpacing: o.cs });
  const sh = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.12, blur: 8, offset: 3, angle: 90 });
  return { pres, s, T, sh };
}

(async () => {
  // ================= Appendix slide 14: How we grow =================
  {
    const { pres, s, T, sh } = setup();
    s.background = { color: 'F8FAFC' };
    T('From 10 shops to profit', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });

    const steps = [
      ['NOW · Q4 2026', '10', 'pilot shops', 'Footprints', 'Shop visits, Facebook groups'],
      ['YEAR 1 · 2027', '~60', 'paying shops', 'Globe', 'Public launch + KHQR'],
      ['YEAR 2 · 2028', '~420', 'paying shops', 'Share2', 'Shops bring their buyers'],
      ['YEAR 3 · 2029', '~1,130', 'paying shops', 'Handshake', 'Referrals and partners'],
      ['YEAR 3 PROFIT', '+$4K', 'net result', 'Target', 'Break-even at ~1,040 shops'],
    ];
    const cw = 2.3, gap = 0.16, x0 = (13.333 - (5 * cw + 4 * gap)) / 2, ch = 2.3;
    // growth arrow behind the steps
    s.addShape(pres.shapes.LINE, { x: x0 + 0.6, y: 1.55, w: 5 * cw + 4 * gap - 1.2, h: 4.4, flipV: true,
      line: { color: 'CCFBF1', width: 14, endArrowType: 'triangle' } });
    for (let k = 0; k < 5; k++) {
      const [tag, num, unit, ic, how] = steps[k];
      const x = x0 + k * (cw + gap), y = 4.35 - k * 0.62, last = k === 4, first = k === 0;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.18,
        fill: { color: last ? C.navy : C.white }, line: last ? { type: 'none' } : { color: C.line, width: 1 }, shadow: sh() });
      T(tag, x + 0.2, y + 0.18, cw - 0.4, 0.28, { size: 10.5, bold: true, color: last ? C.mint : (first ? C.teal : C.muted), cs: 1 });
      T(num, x + 0.2, y + 0.5, cw - 0.4, 0.65, { size: 34, bold: true, color: last ? C.white : C.ink });
      T(unit, x + 0.2, y + 1.12, cw - 0.4, 0.3, { size: 12.5, bold: true, color: last ? C.mint : C.muted });
      s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: y + 1.6, w: 0.42, h: 0.42, fill: { color: last ? C.teal : 'CCFBF1' }, line: { type: 'none' } });
      s.addImage({ data: await icon(ic, last ? C.white : C.teal), x: x + 0.29, y: y + 1.69, w: 0.24, h: 0.24 });
      T(how, x + 0.7, y + 1.52, cw - 0.8, 0.6, { size: 11, color: last ? C.white : C.ink });
    }

    T('Paying shops = yearly average from the team’s financial model. Pilot passes if 7 of 10 shops stay active, stock is ≥99% accurate and 6 of 10 will pay.',
      0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted });
    s.addNotes(`[Appendix — Q&A backup for the go-to-market slide]
Here is our growth plan. We start now with ten pilot shops in Phnom Penh, found through shop visits and Facebook seller groups. In 2027 we launch publicly with KHQR payments and reach about 60 paying shops. In year two, shops bring their own buyers through their storefront links and we grow to about 420. In year three, referrals and partners take us to about 1,100. We break even at about 1,040 paying shops — under 2% of the stores we target — so we turn profitable in Year 3.
(Q&A: numbers are yearly averages from our model. The pilot passes if 7 of 10 shops stay active, stock stays 99% accurate, and 6 of 10 will pay. Marketplace commission starts when online payments launch.)`);
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide14_grow.pptx') });
  }

  // ================= Appendix slide 15: Competitor evidence =================
  {
    const { pres, s, T } = setup();
    s.background = { color: C.white };
    T('Competitor evidence', 0.6, 0.4, 12.1, 0.7, { size: 30, bold: true });
    T('Public descriptions, not a hands-on audit. Every Rentify difference is a claim we will test side by side in the pilot.',
      0.6, 1.02, 12.1, 0.35, { size: 13, color: C.muted });
    const H = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.navy } } });
    const K = (t) => ({ text: t, options: { bold: true, fill: { color: 'CCFBF1' } } });
    const k = (t) => ({ text: t, options: { fill: { color: 'CCFBF1' } } });
    const rows = [
      [H('Alternative'), H('What they offer'), H('Where Rentify aims to be different')],
      [{ text: 'Khmer24', options: { bold: true } }, 'Broad classifieds and product listings', 'Own branded storefront and POS on one stock'],
      [{ text: 'Smile Shop', options: { bold: true } }, 'Multi-merchant app with delivery, payment, returns', 'Merchant keeps their own brand and storefront'],
      [{ text: 'VTENH', options: { bold: true } }, 'Marketplace with nationwide delivery, card and ABA pay', 'Storefront and POS for the same shop, one stock'],
      [{ text: 'Shopify', options: { bold: true } }, 'Online store and POS with synced inventory', 'Built-in Cambodian marketplace; Khmer storefronts; free start'],
      [K('Khmum eShop (closest)'), k('Marketplace, merchant tools, POS, white-label'), k('Start free on the marketplace; 0% on own sales; faster setup')],
    ];
    s.addTable(rows, { x: 0.6, y: 1.6, w: 12.13, colW: [2.6, 4.6, 4.93], fontFace: F, fontSize: 14, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: 'D7E1ED' }, rowH: 0.7, valign: 'middle', margin: 0.12 });
    T('Checked 24–25 Sep 2026: khmer24.com, khsmileshop.com, vtenh.com, shopify.com/pos, startupcambodia.gov.kh (Khmum).',
      0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted });
    s.addNotes('Q&A backup. If asked "why not Khmum?": they are the closest and we respect them. Our bet is a free marketplace start, 0% on the merchant\'s own storefront and POS sales, and faster setup — and we will compare the same merchant tasks side by side in the pilot.');
    await pres.writeFile({ fileName: path.join(DR, 'Rentify_v6_slide15_competitors.pptx') });
  }
  console.log('done');
})();
