// Competition slide: comparison rows using the deck's channel tiles.
// Run: node build/slide_competition.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_slide06_competition.pptx');
const C = { navy: '111D35', ink: '15243A', muted: '52637A', blue: '2463E8', orange: 'F97316', teal: '0AA7A2',
  white: 'FFFFFF', grid: 'E2E8F0', off: 'E2E8F0', offIcon: '94A3B8', mint: 'A7F3D0' };
const F = 'Arial';
const CH = [[C.orange, 'ShoppingBag', 'Marketplace'], [C.blue, 'Globe', 'Storefront'], [C.teal, 'Store', 'POS']];

async function icon(name, color) {
  const inner = lucide[name].map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="#${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  const s = pres.addSlide(); s.background = { color: 'F8FAFC' };
  const T = (t, x, y, w, h, o = {}) => s.addText(t, { x, y, w, h, fontFace: F, fontSize: o.size || 14, bold: !!o.bold,
    color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0, isTextBox: true, charSpacing: o.cs });
  const tile = async (x, y, d, k, on) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: d, h: d, rectRadius: d * 0.22, fill: { color: on ? CH[k][0] : C.off }, line: { type: 'none' } });
    s.addImage({ data: await icon(CH[k][1], on ? C.white : C.offIcon), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5 });
  };

  T('How Rentify compares', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });

  const x0 = 0.6, W = 12.13, nameW = 3.1, colW = 1.25, edgeX = x0 + nameW + 3 * colW + 0.2;
  // column headers
  T('WHAT THEY OFFER', x0 + nameW, 1.2, 3 * colW, 0.3, { size: 11, bold: true, color: C.muted, align: 'center', cs: 1 });
  CH.forEach(([col, , label], k) => T(label, x0 + nameW + k * colW, 1.5, colW, 0.3, { size: 12, bold: true, color: col, align: 'center' }));
  T('WHY CHOOSE RENTIFY', edgeX, 1.35, W - (edgeX - x0), 0.3, { size: 11, bold: true, color: C.teal, cs: 1 });

  const rows = [
    ['Khmer24 · VTENH', 'Marketplaces', [1, 0, 0], 'Your own brand too'],
    ['Facebook page', 'Social selling', [0, 1, 0], 'Real stock and checkout'],
    ['POS apps', 'Counter only', [0, 0, 1], 'Sell online, same stock'],
    ['Shopify', 'Global store builder', [0, 1, 1], 'Cambodian marketplace built in'],
    ['Khmum', 'Contact form to join · no public prices', [1, 1, 1], 'Sign up yourself · free start'],
  ];
  const rh = 0.6, gap = 0.08, y0 = 1.85, d = 0.4;
  for (let i = 0; i < rows.length; i++) {
    const [name, sub, on, edge] = rows[i], y = y0 + i * (rh + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y, w: W, h: rh, rectRadius: 0.12, fill: { color: C.white }, line: { color: C.grid, width: 1 } });
    T(name, x0 + 0.25, y + 0.05, nameW - 0.3, 0.32, { size: 14, bold: true });
    T(sub, x0 + 0.25, y + 0.35, nameW - 0.1, 0.24, { size: 10.5, color: C.muted });
    for (let k = 0; k < 3; k++) await tile(x0 + nameW + k * colW + (colW - d) / 2, y + (rh - d) / 2, d, k, on[k]);
    T(edge, edgeX, y, W - (edgeX - x0) - 0.2, rh, { size: 14, color: C.ink });
  }
  // Rentify row, highlighted
  const ry = y0 + rows.length * (rh + gap) + 0.04, rrh = 0.72;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y: ry, w: W, h: rrh, rectRadius: 0.14, fill: { color: C.navy }, line: { type: 'none' },
    shadow: { type: 'outer', color: '1A2A4A', opacity: 0.2, blur: 8, offset: 3, angle: 90 } });
  s.addImage({ path: path.join(ROOT, 'assets', 'rentify-logo.png'), x: x0 + 0.22, y: ry + 0.17, w: 0.5, h: 0.5, altText: 'Rentify logo' });
  T('Rentify', x0 + 0.85, ry, nameW - 0.9, rrh, { size: 18, bold: true, color: C.white });
  for (let k = 0; k < 3; k++) await tile(x0 + nameW + k * colW + (colW - 0.52) / 2, ry + (rrh - 0.52) / 2, 0.52, k, true);
  T('All three · one stock · free to start', edgeX, ry, W - (edgeX - x0) - 0.2, rrh, { size: 14, bold: true, color: C.mint });

  const ty = ry + rrh + 0.18;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y: ty, w: W, h: 0.55, rectRadius: 0.12, fill: { color: 'ECFDF5' }, line: { color: C.teal, width: 1 } });
  T([{ text: 'Khmum proves Cambodian merchants want this. ', options: { bold: true, color: C.ink } },
     { text: 'Rentify makes it simple enough for any small shop to start today, for free.', options: { color: C.ink } }],
    x0 + 0.3, ty, W - 0.6, 0.55, { size: 14, align: 'center' });
  T('Lit tiles = channels each alternative publicly offers (checked Sep 2026). Khmum shops sell as a page in the Khmum app or via a custom white-label app. Full comparison in appendix.',
    0.6, 6.95, 12.1, 0.3, { size: 10, color: C.muted });

  s.addNotes(`[Competition]
Merchants already have options — but most cover only one piece. Marketplaces like Khmer24 and VTENH bring buyers, but no brand of your own. A Facebook page has no real stock or checkout. POS apps only work at the counter. Shopify has no Cambodian marketplace. Khmum is closest to us — they offer all three, and they prove Cambodian merchants want this. The difference is how you get it: Khmum merchants join through their sales team and sell inside the Khmum app. With Rentify, any shop signs up itself, starts free, and gets its own storefront website in minutes — all on one stock.
(Q&A: lit tiles reflect public descriptions, not a hands-on audit. Against Khmum we will compare setup time, stock accuracy and total cost in the pilot.)`);

  await pres.writeFile({ fileName: OUT }); console.log('wrote', OUT);
})();
