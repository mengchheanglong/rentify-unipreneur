// Rentify UniPreneur pitch v6 — rebuilds the team's Canva v2 as an editable, evidence-checked deck.
// Run: node build/build_deck_v6.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('./node_modules/sharp');
const lucide = require('./node_modules/lucide');

const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const A = (f) => path.join(ROOT, 'assets', f);
const OUT = path.join(ROOT, 'output', 'Rentify_UniPreneur_Pitch_v6.pptx');

const C = {
  navy: '111D35', navy2: '1A2A4A', blue: '2463E8', teal: '0AA7A2', ink: '15243A',
  muted: '52637A', pale: 'F5F8FC', white: 'FFFFFF', line: 'D7E1ED',
  lightBlue: 'DCEBFF', lightTeal: 'D6F4F0', amber: 'F59E0B', lightAmber: 'FEF3C7',
  red: 'D64545', soft: '9FB3CF',
};
const F = 'Arial';
const W = 13.333, H = 7.5;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Rentify — UniPreneur pitch v6';
pres.author = 'Rentify team';

// ---------- helpers ----------
async function icon(name, color, px = 256) {
  const node = lucide[name];
  if (!node) throw new Error('missing icon ' + name);
  const inner = node.map(([tag, attrs]) =>
    `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="#${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}
function T(slide, text, x, y, w, h, o = {}) {
  slide.addText(text, {
    x, y, w, h, fontFace: F, fontSize: o.size || 16, color: o.color || C.ink, bold: !!o.bold,
    italic: !!o.italic, align: o.align || 'left', valign: o.valign || 'top', margin: o.margin ?? 0,
    isTextBox: true, lineSpacingMultiple: o.lsm || 1.0, paraSpaceAfter: o.psa || 0, charSpacing: o.cs,
    fit: 'none', ...(o.extra || {}),
  });
}
function title(slide, text, dark = false, sub) {
  T(slide, text, 0.6, 0.45, 12.1, 0.8, { size: 34, bold: true, color: dark ? C.white : C.ink });
  if (sub) T(slide, sub, 0.6, 1.22, 12.1, 0.45, { size: 17, color: dark ? C.soft : C.muted });
}
function box(slide, x, y, w, h, fill, o = {}) {
  slide.addShape(o.round ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: fill, transparency: o.tr || 0 },
    line: o.line ? { color: o.line, width: o.lw || 1 } : { type: 'none' },
    rectRadius: o.round ? (o.r ?? 0.12) : undefined,
    shadow: o.shadow ? { type: 'outer', color: '1A2A4A', opacity: 0.12, blur: 8, offset: 2, angle: 90 } : undefined,
  });
}
function circle(slide, x, y, d, fill) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' } });
}
async function iconDot(slide, name, x, y, d, bg, fg) {
  circle(slide, x, y, d, bg);
  const pad = d * 0.24;
  slide.addImage({ data: await icon(name, fg), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad });
}
function foot(slide, text, dark = false, n) {
  T(slide, text, 0.6, 6.95, 11.4, 0.3, { size: 10, color: dark ? C.soft : C.muted });
  if (n) T(slide, String(n).padStart(2, '0'), 12.25, 6.95, 0.5, 0.3, { size: 10, color: dark ? C.soft : C.muted, align: 'right' });
}
function img(slide, file, x, y, w, h, o = {}) {
  slide.addImage({ path: A(file), x, y, w, h, altText: o.alt || '', sizing: o.sizing, rounding: o.rounding });
}
// Image placed to fit a box without distortion, given its pixel size.
function fitImg(slide, file, px, py, bx, by, bw, bh, o = {}) {
  const r = Math.min(bw / px, bh / py);
  const w = px * r, h = py * r;
  img(slide, file, bx + (bw - w) / 2, by + (bh - h) / 2, w, h, o);
  return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h };
}

(async () => {
  // =============== 1. COVER ===============
  {
    const s = pres.addSlide(); s.background = { color: C.navy };
    img(s, 'rentify-logo.png', 0.7, 0.6, 0.75, 0.75, { alt: 'Rentify logo' });
    T(s, 'Rentify', 1.6, 0.72, 5, 0.6, { size: 30, bold: true, color: C.white });
    T(s, 'Sell everywhere.\nManage once.', 0.7, 2.0, 7.6, 2.3, { size: 60, bold: true, color: C.white, lsm: 0.95 });
    T(s, 'One store behind your own website, a shared marketplace and your shop counter — built for Cambodian merchants.',
      0.7, 4.45, 6.9, 0.9, { size: 19, color: C.lightTeal, lsm: 1.1 });
    const chips = [['Globe', 'Own storefront'], ['ShoppingBag', 'Shared marketplace'], ['Store', 'In-store POS']];
    for (let i = 0; i < 3; i++) {
      const x = 0.7 + i * 2.5;
      box(s, x, 5.75, 2.35, 0.62, C.navy2, { round: true, r: 0.31 });
      s.addImage({ data: await icon(chips[i][0], C.teal), x: x + 0.2, y: 5.9, w: 0.32, h: 0.32 });
      T(s, chips[i][1], x + 0.6, 5.75, 1.72, 0.62, { size: 13.5, color: C.white, valign: 'middle' });
    }
    // right: three real screens stacked
    box(s, 7.72, 0.95, 5.06, 2.9, C.white, { round: true, r: 0.08 });
    img(s, 'v6/crop-marketplace.png', 7.8, 1.03, 4.9, 2.74, { alt: 'Rentify Marketplace product page' });
    box(s, 8.42, 3.62, 4.36, 2.55, C.white, { round: true, r: 0.08, shadow: true });
    img(s, 'v6/crop-pos.png', 8.5, 3.7, 4.2, 2.39, { alt: 'Rentify POS screen' });
    s.addNotes(`[0:00–0:15]
Cambodian merchants sell in many places — Facebook, marketplaces and their own shop counter. Rentify lets them sell everywhere and manage once.`);
  }

  // =============== 2. PROBLEM ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Merchants have tools. None of them connect.');
    const rows = [
      ['MessageCircle', 'Facebook page', 'posts, Live and inbox'],
      ['Send', 'Telegram', 'customer orders'],
      ['LayoutGrid', 'Marketplace listing', 'a second copy of products'],
      ['NotebookPen', 'Notebook or Excel', 'the “real” stock count'],
      ['Calculator', 'Cash box or POS app', 'counter sales'],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 1.6 + i * 0.78;
      box(s, 0.6, y, 5.9, 0.64, C.pale, { round: true, r: 0.1 });
      await iconDot(s, rows[i][0], 0.72, y + 0.1, 0.44, C.lightBlue, C.blue);
      T(s, rows[i][1], 1.32, y, 2.55, 0.64, { size: 16, bold: true, valign: 'middle' });
      T(s, rows[i][2], 3.95, y, 2.5, 0.64, { size: 14, color: C.muted, valign: 'middle' });
    }
    T(s, 'Every new channel adds another list to update by hand.', 0.6, 5.62, 5.9, 0.9, { size: 20, bold: true, color: C.blue, lsm: 1.05 });
    img(s, 'merchant-problem-illustration.png', 6.95, 1.6, 5.78, 3.25, { alt: 'Illustration of a shopkeeper checking her phone at a counter' });
    box(s, 6.95, 5.0, 5.78, 1.5, C.navy, { round: true, r: 0.1 });
    T(s, 'The last item sells at the counter.\nFacebook still says “in stock”.', 7.2, 5.12, 5.3, 0.8, { size: 17, bold: true, color: C.white, lsm: 1.05 });
    T(s, 'Result: an apology, a refund, a lost customer.', 7.2, 5.95, 5.3, 0.4, { size: 14, color: C.lightTeal });
    foot(s, 'Illustrative scenario and AI-generated image. How often this happens will be measured in our first merchant pilots.', false, 2);
    s.addNotes(`[0:15–0:40]
But their tools don't connect. Orders arrive on Telegram, stock lives in a notebook, and cash sits at the counter. So when the last item sells in the shop, Facebook still says it's in stock. The result is an apology, a refund and a lost customer.
(Evidence: illustrative scenario. Replace with real merchant quotes once pilot conversations happen.)`);
  }

  // =============== 3. GAP ===============
  {
    const s = pres.addSlide(); s.background = { color: C.pale };
    title(s, 'Every option today solves one piece', false, 'We are not the first. We aim to be the one merchants don’t have to stitch together.');
    const cards = [
      ['ShoppingBag', 'Marketplaces', 'Khmer24 · Smile Shop · VTENH', 'Bring buyers to listings.',
        'Listings live on their platform, separate from the merchant’s own brand and counter.'],
      ['Globe', 'Global store builders', 'Shopify', 'Online store and POS in sync.',
        'No shared Cambodian buyer marketplace; setup and plans are built for global merchants.'],
      ['Store', 'Local all-in-one', 'Khmum eShop', 'Marketplace, merchant tools and POS.',
        'Closest to our idea. We compete on setup speed, brand-first storefronts and fairer pricing.'],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.1;
      box(s, x, 2.0, 3.85, 4.3, C.white, { round: true, r: 0.12, shadow: true });
      await iconDot(s, cards[i][0], x + 0.3, 2.3, 0.62, i === 2 ? C.lightTeal : C.lightBlue, i === 2 ? C.teal : C.blue);
      T(s, cards[i][1], x + 0.3, 3.08, 3.3, 0.45, { size: 21, bold: true });
      T(s, cards[i][2], x + 0.3, 3.52, 3.3, 0.35, { size: 13, color: C.muted });
      T(s, 'What works', x + 0.3, 4.05, 3.3, 0.3, { size: 11, bold: true, color: C.teal, cs: 1 });
      T(s, cards[i][3], x + 0.3, 4.32, 3.3, 0.6, { size: 15 });
      T(s, i === 2 ? 'Our angle' : 'What’s missing', x + 0.3, 5.0, 3.3, 0.3, { size: 11, bold: true, color: i === 2 ? C.blue : C.red, cs: 1 });
      T(s, cards[i][4], x + 0.3, 5.27, 3.3, 0.95, { size: 14, color: C.ink, lsm: 1.05 });
    }
    foot(s, 'Public product descriptions checked 24–25 Sep 2026 (khmer24.com, vtenh.com, shopify.com/pos, Khmum on startupcambodia.gov.kh). Detailed comparison in appendix.', false, 3);
    s.addNotes(`[0:40–1:05]
Existing options each solve one piece. Marketplaces bring buyers but live apart from the merchant's shop. Shopify syncs a store and POS but has no Cambodian marketplace. Khmum is closest to us, and we respect it. Tesla wasn't the first electric car. We aim to be the platform merchants don't have to stitch together.`);
  }

  // =============== 4. SOLUTION ===============
  {
    const s = pres.addSlide(); s.background = { color: C.navy };
    title(s, 'Rentify: one store behind every channel', true);
    // center store box
    box(s, 3.2, 1.55, 6.93, 1.65, C.navy2, { round: true, r: 0.14, line: C.teal, lw: 1.5 });
    s.addImage({ data: await icon('Boxes', C.teal), x: 3.5, y: 1.8, w: 0.55, h: 0.55 });
    T(s, 'ONE MERCHANT STORE', 4.3, 1.8, 5.6, 0.4, { size: 15, bold: true, color: C.lightTeal, cs: 2 });
    T(s, 'Products · Prices · Stock · Orders', 4.3, 2.2, 5.7, 0.5, { size: 22, bold: true, color: C.white });
    T(s, 'Entered once. Always the same everywhere.', 4.3, 2.7, 5.6, 0.35, { size: 13, color: C.soft });
    // connectors
    s.addShape(pres.shapes.LINE, { x: 6.665, y: 3.2, w: 0, h: 0.45, line: { color: C.teal, width: 2 } });
    s.addShape(pres.shapes.LINE, { x: 2.35, y: 3.65, w: 8.63, h: 0, line: { color: C.teal, width: 2 } });
    const ch = [
      ['Globe', 'Own storefront', 'The merchant’s brand, template and link to share on Facebook and Telegram.'],
      ['ShoppingBag', 'Shared marketplace', 'Buyers discover products from many Cambodian stores in one place.'],
      ['Store', 'In-store POS', 'Counter sales, cash and receipts, using the same stock count.'],
    ];
    for (let i = 0; i < 3; i++) {
      const cx = 2.35 + i * 4.315;
      s.addShape(pres.shapes.LINE, { x: cx, y: 3.65, w: 0, h: 0.4, line: { color: C.teal, width: 2 } });
      const x = cx - 1.9;
      box(s, x, 4.05, 3.8, 2.35, C.white, { round: true, r: 0.12 });
      await iconDot(s, ch[i][0], x + 0.25, 4.3, 0.58, C.lightBlue, C.blue);
      T(s, ch[i][1], x + 1.0, 4.3, 2.7, 0.58, { size: 19, bold: true, valign: 'middle' });
      T(s, ch[i][2], x + 0.25, 5.07, 3.35, 1.2, { size: 14, color: C.muted, lsm: 1.08 });
    }
    foot(s, 'Start with any channel. Add the others later without re-listing a single product.', true, 4);
    s.addNotes(`[1:05–1:25]
Rentify puts one store at the centre. Products, prices, stock and orders are entered once, then sold through the merchant's own storefront, our shared marketplace and our POS.`);
  }

  // =============== 5. WHAT'S NEW ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'What makes Rentify different', false, 'Three ideas we build on and will prove with merchants');
    const ideas = [
      ['01', 'Sprout', 'Start anywhere, grow without re-listing',
        'Begin as a marketplace seller with no website. Add a branded storefront or POS later — the same products and stock move with you.'],
      ['02', 'RefreshCw', 'One sale updates everywhere',
        'A sale at the counter, on the storefront or in the marketplace changes one stock count, so no channel oversells.'],
      ['03', 'Scale', 'Fair channel pricing',
        'A subscription pays for the tools. Commission applies only to orders our marketplace brings — never to the merchant’s own storefront or counter sales.'],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.58;
      box(s, 0.6, y, 12.13, 1.38, i === 1 ? C.lightTeal : C.pale, { round: true, r: 0.12 });
      T(s, ideas[i][0], 0.9, y, 1.0, 1.38, { size: 40, bold: true, color: i === 1 ? C.teal : C.blue, valign: 'middle' });
      await iconDot(s, ideas[i][1], 2.05, y + 0.37, 0.64, C.white, i === 1 ? C.teal : C.blue);
      T(s, ideas[i][2], 3.0, y + 0.2, 3.9, 1.0, { size: 21, bold: true, valign: 'middle', lsm: 1.0 });
      T(s, ideas[i][3], 7.05, y + 0.18, 5.45, 1.05, { size: 15, color: C.ink, valign: 'middle', lsm: 1.08 });
    }
    foot(s, 'Idea 02 is already working in our development build (next slide). Ideas 01 and 03 are designed into the platform; merchant acceptance is tested in pilots.', false, 5);
    s.addNotes(`[1:25–1:50]
Three ideas make us different. Start anywhere: sell on the marketplace first and add a storefront later without re-listing. One sale updates everywhere. And fair pricing: commission only on sales our marketplace brings, never on the merchant's own sales.`);
  }

  // =============== 6. PROOF ===============
  {
    const s = pres.addSlide(); s.background = { color: C.pale };
    title(s, 'Working today: one sale, updated everywhere', false, 'Aura Botanicals demo store · Deep Barrier Hydrating Cream · starting stock 40');
    const cols = [
      ['1', 'Sold at the counter', 'POS sale: 1 unit, paid in cash', 'v6/crop-pos.png', 1760, 1000, 'Rentify POS with the cream in the cart'],
      ['2', 'Own storefront', 'Now shows “Maximum: 39 units”', 'v6/crop-storefront.png', 2220, 1230, 'Aura Botanicals storefront showing 39 units'],
      ['3', 'Shared marketplace', 'Now shows “39 items in stock”', 'v6/crop-marketplace.png', 2560, 1450, 'Rentify Marketplace showing 39 items in stock'],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.1;
      box(s, x, 1.85, 3.85, 3.75, C.white, { round: true, r: 0.12, shadow: true });
      circle(s, x + 0.25, 2.05, 0.5, i === 0 ? C.navy : C.teal);
      T(s, cols[i][0], x + 0.25, 2.05, 0.5, 0.5, { size: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
      T(s, cols[i][1], x + 0.9, 2.02, 2.8, 0.36, { size: 18, bold: true });
      T(s, cols[i][2], x + 0.9, 2.37, 2.85, 0.3, { size: 12.5, color: i === 0 ? C.muted : C.teal, bold: i !== 0 });
      fitImg(s, cols[i][3], cols[i][4], cols[i][5], x + 0.15, 2.85, 3.55, 2.6, { alt: cols[i][6] });
      if (i < 2) s.addImage({ data: await icon('ChevronRight', C.blue), x: x + 3.86, y: 3.5, w: 0.24, h: 0.44 });
    }
    box(s, 0.6, 5.8, 12.13, 0.95, C.navy, { round: true, r: 0.12 });
    T(s, [{ text: '40 → 39', options: { bold: true, color: C.teal, fontSize: 30 } }, { text: '   on every channel, from one counter sale. No second update.', options: { color: C.white, fontSize: 19, bold: true } }],
      0.9, 5.8, 11.6, 0.95, { valign: 'middle' });
    foot(s, 'Captured 25 Sep 2026 from Rentify’s working development build with seeded demo data (not customer orders). Live demo available in Q&A.', false, 6);
    s.addNotes(`[1:50–2:15]
This already works. Our demo store had forty units of this cream. We sold one at the counter. Seconds later, the storefront and the marketplace both showed thirty-nine. One sale, updated everywhere.
(Q&A: seeded demo data in the development build, captured 25 Sep 2026 — not customer orders.)`);
  }

  // =============== 7. TARGET CUSTOMER ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Who we serve first');
    const P = [
      ['v6/persona-facebook.png', 'The Facebook seller', 'Sells through posts, Live and inbox. No shop, or a small one.',
        'Starts on the marketplace plus a shareable storefront link.'],
      ['v6/persona-shop.png', 'The small retail shop', 'Sells at a counter and increasingly online.',
        'Starts with POS plus a storefront, joins the marketplace in one click.'],
    ];
    for (let i = 0; i < 2; i++) {
      const x = 0.6 + i * 4.2;
      box(s, x, 1.5, 3.95, 5.1, i === 0 ? C.lightBlue : C.lightTeal, { round: true, r: 0.14 });
      img(s, P[i][0], x + 0.25, 1.62, 1.72, 2.15, { alt: P[i][1] });
      T(s, P[i][1], x + 2.12, 1.95, 1.75, 1.0, { size: 19, bold: true, lsm: 1.0 });
      T(s, P[i][2], x + 0.3, 3.95, 3.4, 0.95, { size: 14.5, color: C.ink, lsm: 1.08 });
      T(s, 'HOW THEY START', x + 0.3, 4.95, 3.4, 0.3, { size: 11, bold: true, color: i === 0 ? C.blue : C.teal, cs: 1 });
      T(s, P[i][3], x + 0.3, 5.25, 3.4, 1.0, { size: 14.5, bold: true, lsm: 1.08 });
    }
    // beachhead
    box(s, 9.1, 1.5, 3.63, 5.1, C.navy, { round: true, r: 0.14 });
    s.addImage({ data: await icon('Crosshair', C.teal), x: 9.4, y: 1.8, w: 0.5, h: 0.5 });
    T(s, 'BEACHHEAD', 9.4, 2.45, 3.1, 0.3, { size: 11, bold: true, color: C.lightTeal, cs: 2 });
    T(s, 'Phnom Penh retailers who sell online and at a counter', 9.4, 2.8, 3.1, 1.3, { size: 19, bold: true, color: C.white, lsm: 1.05 });
    T(s, 'Fashion · Beauty · Electronics · Home goods', 9.4, 4.2, 3.1, 0.7, { size: 14, color: C.lightTeal, lsm: 1.1 });
    T(s, 'They already have customers, physical stock and a daily sales routine we can observe and improve.', 9.4, 5.0, 3.1, 1.3, { size: 13, color: C.soft, lsm: 1.1 });
    foot(s, 'Persona photos are illustrative. Phnom Penh holds 20% of Cambodia’s establishments (Economic Census 2022).', false, 7);
    s.addNotes(`[2:15–2:35]
We start with two merchants: the Facebook seller, who begins on our marketplace, and the small shop, which begins with POS and a storefront. Our beachhead is Phnom Penh retailers in fashion, beauty, electronics and home goods.`);
  }

  // =============== 8. MARKET ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'A bottom-up market we can reach', false, 'Counted from Cambodia’s 2022 Economic Census × US$60 a year (US$5 average monthly plan)');
    const M = [
      ['TAM', '410,600', 'retail shops in Cambodia', 'US$24.6M / year', 7.0, C.lightBlue, C.blue],
      ['SAM', '65,400', 'specialized non-food stores: fashion, beauty, electronics, home and more', 'US$3.9M / year', 5.8, C.lightTeal, C.teal],
      ['SOM', '≈1,130', 'avg. paying merchants in Year 3 (1.7% of SAM)', 'US$67.7K / year', 4.6, 'FFE9C2', 'B7791F'],
    ];
    // nested bars
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.45;
      const w = M[i][4];
      box(s, 0.6, y, w, 1.25, M[i][5], { round: true, r: 0.12 });
      T(s, M[i][0], 0.85, y, 1.0, 1.25, { size: 22, bold: true, color: M[i][6], valign: 'middle' });
      T(s, M[i][1], 1.85, y + 0.12, w - 1.4, 0.55, { size: 26, bold: true });
      T(s, M[i][2], 1.85, y + 0.66, w - 1.4, 0.55, { size: 12.5, color: C.muted, lsm: 1.0 });
      T(s, M[i][3], 7.85, y, 2.6, 1.25, { size: 20, bold: true, color: M[i][6], valign: 'middle' });
    }
    box(s, 10.5, 1.95, 2.23, 4.15, C.navy, { round: true, r: 0.12 });
    T(s, 'ON TOP', 10.72, 2.2, 1.8, 0.3, { size: 11, bold: true, color: C.lightTeal, cs: 2 });
    T(s, 'Marketplace commission', 10.72, 2.5, 1.85, 0.8, { size: 16, bold: true, color: C.white, lsm: 1.0 });
    T(s, 'Not counted here. Cambodia’s e-commerce market was US$1.51B in 2024.', 10.72, 3.35, 1.85, 1.3, { size: 12, color: C.soft, lsm: 1.1 });
    T(s, 'Facebook-only sellers are largely outside the census — also upside.', 10.72, 4.7, 1.85, 1.2, { size: 12, color: C.soft, lsm: 1.1 });
    foot(s, 'Sources: NIS Economic Census 2022, Table 2.10 (ISIC 47 excl. fuel; ISIC 4741–4774); Ministry of Commerce 2024. SOM from the team’s 3-year model (slide 12).', false, 8);
    s.addNotes(`[2:35–2:58]
Counting from the 2022 Economic Census, Cambodia has about 410,000 retail shops — a 24.6 million dollar subscription market. We focus on 65,000 specialised stores, worth 3.9 million a year, and aim for about 1,100 paying merchants by Year 3. Commission is on top.
(Q&A: US$1.51B is total 2024 e-commerce value — context, not our revenue.)`);
  }

  // =============== 9. BUSINESS MODEL ===============
  {
    const s = pres.addSlide(); s.background = { color: C.pale };
    title(s, 'How Rentify makes money', false, 'A subscription for the tools, plus commission only where our marketplace creates the sale');
    const tiers = [
      ['Starter', '$3', ['Storefront (Khmer / English)', 'Marketplace listing', 'POS for one counter', 'Up to 100 products']],
      ['Growth', '$5', ['Everything in Starter', 'Up to 500 products', 'Sales analytics', 'Up to 3 staff accounts']],
      ['Pro', '$10', ['Everything in Growth', 'Unlimited products', 'Marketing tools', 'Up to 10 staff accounts']],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 2.62;
      const hl = i === 1;
      box(s, x, 1.95, 2.45, 4.45, hl ? C.navy : C.white, { round: true, r: 0.12, shadow: true });
      if (hl) {
        box(s, x + 0.55, 1.8, 1.35, 0.32, C.teal, { round: true, r: 0.16 });
        T(s, 'MOST MERCHANTS', x + 0.55, 1.8, 1.35, 0.32, { size: 9, bold: true, color: C.white, align: 'center', valign: 'middle' });
      }
      T(s, tiers[i][0], x + 0.25, 2.25, 2.0, 0.4, { size: 18, bold: true, color: hl ? C.white : C.ink });
      T(s, [{ text: tiers[i][1], options: { fontSize: 38, bold: true } }, { text: ' /month', options: { fontSize: 13 } }],
        x + 0.25, 2.7, 2.1, 0.7, { color: hl ? C.white : C.ink, valign: 'bottom' });
      for (let j = 0; j < 4; j++) {
        const y = 3.65 + j * 0.64;
        s.addImage({ data: await icon('Check', hl ? C.teal : C.blue), x: x + 0.25, y: y + 0.03, w: 0.22, h: 0.22 });
        T(s, tiers[i][2][j], x + 0.55, y, 1.8, 0.55, { size: 12.5, color: hl ? C.white : C.ink, lsm: 1.0 });
      }
    }
    // commission panel
    box(s, 8.6, 1.95, 4.13, 4.45, C.white, { round: true, r: 0.12, shadow: true });
    await iconDot(s, 'Percent', 8.85, 2.2, 0.58, C.lightTeal, C.teal);
    T(s, 'Marketplace commission', 9.6, 2.2, 3.0, 0.58, { size: 18, bold: true, valign: 'middle' });
    T(s, 'A small share of orders the marketplace brings in, deducted when buyers pay online.', 8.85, 2.95, 3.65, 0.95, { size: 14, lsm: 1.08 });
    box(s, 8.85, 3.95, 3.65, 0.75, C.lightTeal, { round: true, r: 0.1 });
    T(s, '0% on the merchant’s own storefront and counter sales', 9.0, 3.95, 3.4, 0.75, { size: 13.5, bold: true, color: C.ink, valign: 'middle', lsm: 1.0 });
    T(s, 'Starts with online payments (2027). Rate set after pilot testing.', 8.85, 4.9, 3.65, 0.7, { size: 13, color: C.muted, lsm: 1.08 });
    T(s, 'Launch revenue = subscriptions only', 8.85, 5.7, 3.65, 0.5, { size: 13, bold: true, color: C.blue });
    foot(s, 'Proposed prices, to be tested with pilot merchants. Commission rate not yet set.', false, 9);
    s.addNotes(`[2:58–3:20]
Merchants pay three, five or ten dollars a month for storefront, marketplace listing and POS. We add a commission only on marketplace orders, once buyers pay online in 2027. Their own storefront and counter sales stay commission-free.
(Q&A: prices are proposals to test; commission cannot be deducted from cash on delivery.)`);
  }

  // =============== 10. GO-TO-MARKET ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Go-to-market: merchants first, buyers follow', false, 'Merchants join for the tools. Their customers bring the first marketplace traffic.');
    const steps = [
      ['Footprints', 'Phase 1 · Q4 2026', '10 pilot merchants', ['Shop visits in Phnom Penh markets', 'Facebook seller groups', 'UniPreneur introductions']],
      ['Share2', 'Phase 2 · 2027', 'Merchant-led buyers', ['Merchants share storefront links', 'Referral credit for merchants', 'Cross-store discovery in the marketplace']],
      ['Handshake', 'Phase 3 · 2027+', 'Partners at scale', ['SME associations and business desks', 'Delivery partner bundles', 'Category campaigns (e.g. festivals)']],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 3.05;
      box(s, x, 1.95, 2.85, 4.55, i === 0 ? C.navy : C.pale, { round: true, r: 0.12 });
      await iconDot(s, steps[i][0], x + 0.25, 2.2, 0.56, i === 0 ? C.navy2 : C.lightBlue, i === 0 ? C.teal : C.blue);
      T(s, steps[i][1], x + 0.25, 2.95, 2.4, 0.3, { size: 11, bold: true, color: i === 0 ? C.lightTeal : C.teal, cs: 1 });
      T(s, steps[i][2], x + 0.25, 3.25, 2.45, 0.5, { size: 18, bold: true, color: i === 0 ? C.white : C.ink });
      T(s, steps[i][3].map((t, j) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < 2 } })),
        x + 0.25, 3.9, 2.45, 1.9, { size: 13, color: i === 0 ? C.white : C.ink, psa: 8, lsm: 1.0 });
    }
    // pilot success metrics
    box(s, 9.85, 1.95, 2.88, 4.55, C.lightTeal, { round: true, r: 0.12 });
    T(s, 'PILOT PASSES IF', 10.1, 2.2, 2.5, 0.3, { size: 11, bold: true, color: C.teal, cs: 1 });
    const mets = [['7 of 10', 'merchants still active after 30 days'], ['≥99%', 'stock accuracy across channels'], ['6 of 10', 'willing to pay a subscription']];
    for (let j = 0; j < 3; j++) {
      const y = 2.65 + j * 1.25;
      T(s, mets[j][0], 10.1, y, 2.5, 0.45, { size: 22, bold: true, color: C.ink });
      T(s, mets[j][1], 10.1, y + 0.45, 2.5, 0.5, { size: 12, color: C.muted, lsm: 1.0 });
    }
    foot(s, 'Proposed targets, set before the pilot starts. Marketplace-discovered orders are measured separately from merchants’ own customers.', false, 10);
    s.addNotes(`[3:20–3:45]
We go merchants first. We recruit ten pilot shops through market visits, Facebook seller groups and UniPreneur introductions; their customers bring the first buyers. The pilot passes if seven of ten stay active, stock stays 99% accurate, and six of ten will pay.`);
  }

  // =============== 11. ROADMAP ===============
  {
    const s = pres.addSlide(); s.background = { color: C.pale };
    title(s, 'Roadmap');
    const R = [
      ['Built · 2026', 'Working build', ['Storefront templates', 'Shared marketplace', 'POS and invoices', 'One store catalog and stock'], C.navy],
      ['Q4 2026', 'Pilot', ['10 merchants in Phnom Penh', 'Measure setup time and stock accuracy', 'Test prices'], C.blue],
      ['H1 2027', 'Public launch', ['Seller approval and buyer support', 'Delivery partner options', 'KHQR online payments'], C.blue],
      ['H2 2027', 'Marketplace revenue', ['Commission on marketplace orders', 'Merchant analytics', 'Multi-staff roles'], C.teal],
      ['2028+', 'Scale', ['Multi-branch stock', 'Deeper delivery integrations', 'Explore nearby ASEAN markets'], C.teal],
    ];
    s.addShape(pres.shapes.LINE, { x: 0.9, y: 1.85, w: 11.5, h: 0, line: { color: C.line, width: 3 } });
    for (let i = 0; i < 5; i++) {
      const x = 0.6 + i * 2.45;
      circle(s, x + 0.12, 1.65, 0.4, R[i][3]);
      if (i === 0) s.addImage({ data: await icon('Check', C.white), x: x + 0.21, y: 1.74, w: 0.22, h: 0.22 });
      T(s, R[i][0], x, 2.25, 2.3, 0.3, { size: 12, bold: true, color: R[i][3], cs: 1 });
      T(s, R[i][1], x, 2.55, 2.3, 0.75, { size: 18, bold: true, lsm: 0.95 });
      box(s, x, 3.4, 2.3, 3.1, i === 0 ? C.navy : C.white, { round: true, r: 0.1 });
      T(s, R[i][2].map((t, j, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < a.length - 1 } })),
        x + 0.15, 3.55, 2.05, 2.85, { size: 13, color: i === 0 ? C.white : C.ink, psa: 8, lsm: 1.0 });
    }
    foot(s, 'Built items run in our development build; production launch, payments and commission are planned.', false, 11);
    s.addNotes(`[3:45–4:00]
The platform works in development today. We pilot this quarter, launch publicly with KHQR payments in 2027, then add marketplace commission and multi-branch stock.`);
  }

  // =============== 12. FINANCIALS ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Three-year projection', false, 'Lean scenario · subscriptions only · marketplace commission not included');
    s.addChart(pres.charts.BAR, [
      { name: 'Revenue', labels: ['Year 1', 'Year 2', 'Year 3'], values: [3456, 25131, 67744] },
      { name: 'Total cost', labels: ['Year 1', 'Year 2', 'Year 3'], values: [30258, 61879, 93819] },
    ], {
      x: 0.6, y: 1.85, w: 7.3, h: 4.6, barDir: 'col', barGapWidthPct: 60,
      chartColors: [C.teal, 'B8C4D6'], showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: F,
      showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '$#,##0', dataLabelFontSize: 11, dataLabelFontFace: F,
      dataLabelColor: C.ink, catAxisLabelFontSize: 13, catAxisLabelFontFace: F, catAxisLabelColor: C.ink,
      valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
      showTitle: false,
    });
    const K = [
      ['US$67.7K', 'Year 3 revenue'], ['–US$26.1K', 'Year 3 net result; losses narrow after Year 2'],
      ['1,895', 'paying merchants to break even'], ['US$5', 'average plan per merchant each month'],
    ];
    for (let i = 0; i < 4; i++) {
      const y = 1.9 + i * 1.12;
      box(s, 8.3, y, 4.43, 0.98, i === 2 ? C.navy : C.pale, { round: true, r: 0.1 });
      T(s, K[i][0], 8.55, y, 1.95, 0.98, { size: 22, bold: true, color: i === 2 ? C.white : C.ink, valign: 'middle' });
      T(s, K[i][1], 10.5, y, 2.1, 0.98, { size: 12.5, color: i === 2 ? C.lightTeal : C.muted, valign: 'middle', lsm: 1.0 });
    }
    foot(s, 'Team 36-month model (lean cost base). Price, conversion, churn and cost inputs are assumptions to validate in the pilot. Full table in appendix.', false, 12);
    s.addNotes(`[4:00–4:18]
Our lean model counts subscriptions only. Revenue grows to 68,000 dollars in Year 3 and we break even at about 1,900 paying merchants. Commission is upside.
(Q&A: all inputs are assumptions to validate in the pilot.)`);
  }

  // =============== 13. TEAM + ASK ===============
  {
    const s = pres.addSlide(); s.background = { color: C.navy };
    title(s, 'The team behind Rentify', true);
    const team = [
      ['team-v2-1.png', 'Long Mengchheng', 'Team Lead', 'Developer · Management'],
      ['team-v2-2.png', 'Hong Thanbrathna', 'Idea Founder', 'Developer'],
      ['team-v2-3.png', 'Khemrak Pasey', 'Business Lead', 'Advisor outreach · Strategy'],
      ['team-v2-4.png', 'Mom Sothireak', 'Pitch Lead', 'Presenter · Brand story'],
      ['team-v2-5.png', 'Vy Seoul', 'Developer', 'UX/UI design'],
    ];
    for (let i = 0; i < 5; i++) {
      const x = 0.6 + i * 1.62;
      fitImg(s, 'v6/' + team[i][0], [316,315,316,316,315][i], [346,343,360,356,369][i], x + 0.1, 1.5, 1.3, 1.45, { alt: team[i][1] });
      T(s, team[i][1], x - 0.05, 3.05, 1.6, 0.35, { size: 12.5, bold: true, color: C.white, align: 'center' });
      T(s, team[i][2], x - 0.05, 3.38, 1.6, 0.3, { size: 11.5, color: C.lightTeal, align: 'center' });
      T(s, team[i][3], x - 0.05, 3.66, 1.6, 0.5, { size: 10.5, color: C.soft, align: 'center', lsm: 1.0 });
    }
    // ask
    box(s, 8.95, 1.5, 3.78, 4.9, C.white, { round: true, r: 0.14 });
    T(s, 'OUR ASK', 9.25, 1.75, 3.2, 0.3, { size: 12, bold: true, color: C.teal, cs: 2 });
    const asks = [['Store', '10 retailer introductions', 'shops that sell online and at a counter'], ['Users', 'Mentors', 'in retail, payments and marketplaces'], ['Rocket', 'Pilot support', 'to run and measure the Q4 pilot']];
    for (let j = 0; j < 3; j++) {
      const y = 2.2 + j * 1.2;
      await iconDot(s, asks[j][0], 9.25, y + 0.05, 0.5, C.lightTeal, C.teal);
      T(s, asks[j][1], 9.9, y, 2.7, 0.4, { size: 15, bold: true });
      T(s, asks[j][2], 9.9, y + 0.38, 2.7, 0.6, { size: 12.5, color: C.muted, lsm: 1.0 });
    }
    T(s, 'Sell everywhere. Manage once.', 0.6, 4.75, 8.0, 0.7, { size: 30, bold: true, color: C.white });
    T(s, 'Rentify — one store behind every way a Cambodian merchant sells.', 0.6, 5.45, 8.0, 0.5, { size: 16, color: C.lightTeal });
    foot(s, 'Thank you.', true, 13);
    s.addNotes(`[4:18–4:45]
We are five students who have already built this platform. We ask UniPreneur for introductions to ten retailers, mentors in retail and payments, and support for our pilot. Rentify: sell everywhere, manage once. Thank you.
[Stop here. Keep this slide up for Q&A.]`);
  }

  // =============== APPENDIX DIVIDER ===============
  {
    const s = pres.addSlide(); s.background = { color: C.navy };
    T(s, 'Appendix', 0.6, 2.7, 12, 1.0, { size: 48, bold: true, color: C.white });
    T(s, 'Competitors · Market math · Financial detail · Business model canvas · Delivery partners · Build status',
      0.6, 3.75, 12, 0.5, { size: 16, color: C.lightTeal });
    s.addNotes('Use appendix slides only when a question calls for them.');
  }

  // =============== A1. COMPETITORS ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Competitor evidence');
    const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.navy } } });
    const rows = [
      [hdr('Alternative'), hdr('Publicly described offer'), hdr('What we compare in pilots')],
      ['Khmer24', 'Broad listings across goods, property, jobs and services', 'Seller workflow for stock and orders'],
      ['Smile Shop', 'Multi-merchant app with delivery, payment and returns', 'Merchant brand and storefront control'],
      ['VTENH', 'Marketplace with nationwide delivery, card and ABA payments', 'Seller terms and total cost'],
      ['Shopify', 'Online store and POS with synced inventory', 'Local fit, setup effort and cost'],
      ['Khmum eShop', 'Marketplace, merchant tools, POS and white-label (closest)', 'Setup time, storefront, stock accuracy'],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.5, w: 12.13, colW: [2.2, 5.3, 4.63], fontFace: F, fontSize: 14, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: C.line }, rowH: 0.62, valign: 'middle', margin: 0.1,
    });
    foot(s, 'Public descriptions checked 24–25 Sep 2026: khmer24.com, khsmileshop.com, vtenh.com, shopify.com/pos, startupcambodia.gov.kh (Khmum). Not a hands-on feature audit.', false, 15);
    s.addNotes('Khmum overlaps with our concept. Our advantage must be proven through merchant tasks: setup time, stock accuracy and total cost. Do not claim we are cheaper or better until pilots measure it.');
  }

  // =============== A2. MARKET MATH ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Market sizing: how we counted');
    const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.navy } } });
    const rows = [
      [hdr(''), hdr('Merchants'), hdr('Basis'), hdr('× US$60 / year')],
      ['TAM', '410,623', 'All retail establishments, ISIC division 47, excluding fuel stations (4730)', 'US$24.6M'],
      ['SAM', '65,433', 'Specialized non-food retail, ISIC 4741–4774: electronics, clothing, cosmetics, household, books, toys, sports, second-hand', 'US$3.9M'],
      ['SOM', '≈1,129', 'Year 3 subscription revenue (US$67,744) ÷ US$60 — average paying merchants in the team model', 'US$67.7K'],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.5, w: 12.13, colW: [1.1, 1.7, 7.2, 2.13], fontFace: F, fontSize: 14, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: C.line }, rowH: [0.5, 0.85, 0.95, 0.85], valign: 'middle', margin: 0.1,
    });
    T(s, [
      { text: 'Why not US$1.51B? ', options: { bold: true } },
      { text: 'That is the 2024 value of all Cambodian e-commerce (Ministry of Commerce). It is market context, not revenue Rentify can capture.', options: {} },
    ], 0.6, 5.0, 12.1, 0.6, { size: 14 });
    T(s, [
      { text: 'Not counted: ', options: { bold: true } },
      { text: 'marketplace commission, and home-based Facebook sellers, which the census barely captures (only 162 establishments list internet retail as their main activity).', options: {} },
    ], 0.6, 5.65, 12.1, 0.8, { size: 14 });
    foot(s, 'Source: NIS, National Report on Final Census Results, Economic Census of Cambodia 2022, Table 2.10. US$60 = US$5 average plan × 12.', false, 16);
    s.addNotes('Recalculate if the average plan price changes after pilot testing.');
  }

  // =============== A3. FINANCIAL DETAIL ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Financial detail (team model, lean scenario)');
    const hdr = (t, al = 'right') => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.navy }, align: al } });
    const b = (t, al = 'right') => ({ text: t, options: { bold: true, align: al, fill: { color: C.pale } } });
    const r = (t) => ({ text: t, options: { align: 'right' } });
    const rows = [
      [hdr('US$', 'left'), hdr('Year 1'), hdr('Year 2'), hdr('Year 3'), hdr('Assumption', 'left')],
      ['Subscription revenue', r('3,456'), r('25,131'), r('67,744'), 'US$5 average plan across tiers'],
      ['Commission revenue', r('0'), r('0'), r('0'), 'Excluded from this scenario (upside)'],
      ['Cost of service', r('1,543'), r('8,939'), r('21,669'), '$0.30 per active + $0.75 per paying merchant / month'],
      [b('Gross profit', 'left'), b('1,913'), b('16,193'), b('46,074'), { text: '', options: { fill: { color: C.pale } } }],
      ['Team', r('20,250'), r('35,300'), r('46,000'), 'Founders, lean hiring path'],
      ['Sales & marketing', r('4,110'), r('10,450'), r('16,450'), 'Field onboarding, referrals, paid ads'],
      ['Software, office, legal', r('4,355'), r('7,190'), r('9,700'), 'Fixed lean overhead'],
      [b('Net result', 'left'), b('–26,802'), b('–36,747'), b('–26,076'), { text: 'No tax while loss-making', options: { fill: { color: C.pale } } }],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.4, w: 12.13, colW: [2.6, 1.35, 1.35, 1.35, 5.48], fontFace: F, fontSize: 13, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: C.line }, rowH: 0.5, valign: 'middle', margin: 0.08,
    });
    foot(s, 'Break-even: about 1,895 paying merchants (Month-36 operating cost ÷ contribution per merchant). All inputs are assumptions to validate.', false, 17);
    s.addNotes('Figures reproduced from the team’s 36-month model (Rentify_36_Month_Financial_Model.xlsx, Base-Lean sheet) as shown in the v2 deck. Totals were checked: gross profit and net result add up within US$1 rounding.');
  }

  // =============== A4. BUSINESS MODEL CANVAS ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Business model canvas');
    const cell = (x, y, w, h, head, body, tint) => {
      box(s, x, y, w, h, tint || C.pale, { round: true, r: 0.08 });
      T(s, head, x + 0.15, y + 0.12, w - 0.3, 0.3, { size: 12, bold: true, color: C.blue });
      T(s, body, x + 0.15, y + 0.45, w - 0.3, h - 0.55, { size: 11.5, color: C.ink, lsm: 1.05 });
    };
    const x0 = 0.6, cw = 2.35, g = 0.095, top = 1.4, hh = 3.6, half = (hh - g) / 2;
    cell(x0, top, cw, hh, 'Key partners', 'Pilot merchants\nDelivery carriers\nPayment provider (online payments, 2027)\nSME associations');
    cell(x0 + (cw + g), top, cw, half, 'Key activities', 'Build and run the platform\nOnboard and approve sellers\nBuyer support and moderation');
    cell(x0 + (cw + g), top + half + g, cw, half, 'Key resources', 'One-store catalog and stock\nStorefront templates, marketplace, POS');
    cell(x0 + 2 * (cw + g), top, cw, hh, 'Value proposition', 'Merchants: sell on their own storefront, the marketplace and at the counter from one store.\n\nBuyers: products from many Cambodian stores with clear seller and delivery details.', C.lightTeal);
    cell(x0 + 3 * (cw + g), top, cw, half, 'Relationships', 'Assisted onboarding\nKhmer and English support');
    cell(x0 + 3 * (cw + g), top + half + g, cw, half, 'Channels', 'Shop visits, Facebook seller groups\nMerchant storefront links, referrals');
    cell(x0 + 4 * (cw + g), top, cw, hh, 'Customer segments', 'Facebook sellers\nSmall retail shops selling online and at a counter\nBuyers in Cambodia');
    cell(x0, top + hh + g, 6.02, 1.6, 'Cost structure', 'Engineering and hosting · Seller onboarding and moderation · Buyer support · Sales and marketing');
    cell(x0 + 6.02 + g, top + hh + g, 6.015, 1.6, 'Revenue streams', 'Subscriptions: Starter $3, Growth $5, Pro $10 per month (proposed)\nMarketplace commission on marketplace-sourced online orders (from 2027, rate to be set)');
    foot(s, 'Update each block with what the pilot shows.', false, 18);
    s.addNotes('Consistent with slides 9–11: subscription revenue at launch; commission starts only with online payments.');
  }

  // =============== A5. DELIVERY PARTNERS ===============
  {
    const s = pres.addSlide(); s.background = { color: C.white };
    title(s, 'Cambodia delivery partner options');
    const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.navy } } });
    const rows = [
      [hdr('Carrier'), hdr('Publicly described offer'), hdr('Confirm before pilot')],
      ['Vireak Buntham', 'Parcels, tracking, COD, insurance', 'Routes, prices, remittance'],
      ['J&T Express', 'Cambodia parcel booking and tracking', 'Local COD, returns, insurance'],
      ['ZTO Cambodia', 'Domestic parcels; business inquiry', 'Quotes, COD and data link'],
      ['Grab for Business', 'Urban parcel booking and tracking', 'Area, size limit and COD'],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.5, w: 12.13, colW: [2.8, 4.9, 4.43], fontFace: F, fontSize: 15, color: C.ink,
      border: { type: 'solid', pt: 0.75, color: C.line }, rowH: 0.66, valign: 'middle', margin: 0.1,
    });
    foot(s, 'All candidates are prospective. Compare identical parcels; no carrier terms are signed.', false, 19);
    s.addNotes('Merchants fulfil their own orders at launch. Delivery partnerships are options to evaluate, not agreements.');
  }

  // =============== A6. BUILD STATUS ===============
  {
    const s = pres.addSlide(); s.background = { color: C.pale };
    title(s, 'What is built and what comes next');
    const L = ['Merchant sign-up and one store per merchant', 'Store catalog with shared price and stock', 'Two storefront templates', 'Shared marketplace with seller approval', 'POS with cash sales and receipts', 'Marketplace checkout with cash on delivery', 'Admin console for sellers, products and reviews'];
    const Rr = ['10-merchant pilot and real usage data', 'Production hosting, backups and rollback drills', 'Merchant custom domains', 'KHQR and online payments', 'Marketplace commission and seller payouts', 'Restricted-product and returns policies'];
    box(s, 0.6, 1.4, 5.95, 5.0, C.white, { round: true, r: 0.12 });
    await iconDot(s, 'CircleCheck', 0.85, 1.62, 0.5, C.lightTeal, C.teal);
    T(s, 'Working in development', 1.5, 1.62, 4.8, 0.5, { size: 19, bold: true, valign: 'middle' });
    T(s, L.map((t, j) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < L.length - 1 } })), 0.9, 2.35, 5.4, 3.9, { size: 14, psa: 7 });
    box(s, 6.78, 1.4, 5.95, 5.0, C.white, { round: true, r: 0.12 });
    await iconDot(s, 'Hourglass', 7.03, 1.62, 0.5, C.lightBlue, C.blue);
    T(s, 'Next', 7.68, 1.62, 4.8, 0.5, { size: 19, bold: true, valign: 'middle' });
    T(s, Rr.map((t, j) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < Rr.length - 1 } })), 7.08, 2.35, 5.4, 3.9, { size: 14, psa: 7 });
    foot(s, 'Status as of 25 Sep 2026 from the Rentify repository. Demo data is seeded; there are no customer orders yet.', false, 20);
    s.addNotes('Answer "what is built today?" precisely from this slide. Do not call seeded demo orders customer orders.');
  }

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
