// Validator feedback slide with MOCK quotes (replace before presenting).
// Run: node build/slide_validators.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const ROOT = 'C:/Users/User/Downloads/rentify-national-challenge';
const A = (f) => path.join(ROOT, 'assets', 'v6', 'validators', f);
const OUT = path.join(ROOT, 'output', 'drafts', 'Rentify_slide12_validators.pptx');
const C = { ink: '15243A', muted: '52637A', teal: '0AA7A2', white: 'FFFFFF', line: 'E2E8F0', amber: 'B45309', amberBg: 'FEF3C7', violet: '6D28D9' };
const F = 'Arial';
(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  const s = pres.addSlide(); s.background = { color: 'F8FAFC' };
  const T = (t, x, y, w, h, o = {}) => s.addText(t, { x, y, w, h, fontFace: F, fontSize: o.size || 14, bold: !!o.bold, italic: !!o.italic,
    color: o.color || C.ink, align: o.align || 'left', valign: o.valign || 'middle', margin: 0, isTextBox: true, charSpacing: o.cs });
  const sh = () => ({ type: 'outer', color: '1A2A4A', opacity: 0.12, blur: 8, offset: 3, angle: 90 });
  T('What merchants told us', 0.6, 0.35, 12.13, 0.7, { size: 32, bold: true, align: 'center' });
  s.addText('MOCK QUOTES — replace with real feedback before presenting', { x: 3.9, y: 1.02, w: 5.5, h: 0.34,
    shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.17, fill: { color: C.amberBg }, line: { color: 'F59E0B', width: 1 },
    fontFace: F, fontSize: 11, bold: true, color: C.amber, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  const v = [
    ['eolra.jpeg', 'Elora', 'Perfume store', 'MERCHANT', true, '“I sell on Facebook and in my shop. Keeping stock the same in both is my biggest headache.”'],
    ['kour-manith.jpeg', 'Kour Manith', 'Coffee shop & restaurant', 'MERCHANT', '“A POS that also puts my menu online would save me hours every week.”'],
    ['apsara-fairy.png', 'Apsara Fairy', 'Restaurant & coffee', 'MERCHANT', '“If it is free to start, I would try the marketplace this month.”'],
    ['hyper-tech.jpeg', 'Hyper-Tech Store', 'Electronics store', 'MERCHANT', true, '“Customers ask on Telegram if items are in stock. I have to check by hand.”'],
    ['po-sovinda.png', 'Dr. Po Sovinda', 'Senior Lecturer, Strategy', 'ADVISOR', '“Prove it with a small pilot first. Measure stock accuracy and repeat use.”'],
  ];
  const cw = 3.9, ch = 2.5, gx = 0.25, gy = 0.25;
  const pos = [[0, 0], [1, 0], [2, 0], [0.5, 1], [1.5, 1]];
  const x0 = (13.333 - (3 * cw + 2 * gx)) / 2, y0 = 1.6;
  v.forEach(([img, name, role, tag, a5, a6], i) => {
    const pilot = a5 === true; const quote = pilot ? a6 : a5;
    const x = x0 + pos[i][0] * (cw + gx), y = y0 + pos[i][1] * (ch + gy), adv = tag === 'ADVISOR';
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.18, fill: { color: C.white }, line: { color: C.line, width: 1 }, shadow: sh() });
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.8, h: 0.8, fill: { color: 'F1F5F9' }, line: { color: C.line, width: 1 } });
    s.addImage({ path: A(img), x: x + 0.29, y: y + 0.29, w: 0.72, h: 0.72, rounding: true, altText: name });
    T(name, x + 1.2, y + 0.3, cw - 1.4, 0.35, { size: 15, bold: true });
    T(role, x + 1.2, y + 0.65, cw - 1.4, 0.3, { size: 11.5, color: C.muted });
    s.addText(tag, { x: x + cw - 1.15, y: y + 0.12, w: 0.95, h: 0.24, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12,
      fill: { color: adv ? 'EDE9FE' : 'CCFBF1' }, line: { type: 'none' }, fontFace: F, fontSize: 8.5, bold: true,
      color: adv ? C.violet : C.teal, align: 'center', valign: 'middle', margin: 0, isTextBox: true, charSpacing: 1 });
    T(quote, x + 0.25, y + 1.2, cw - 0.5, 1.1, { size: 13, italic: true, valign: 'top' });
    if (pilot) s.addText('✓ Will use Rentify at launch', { x: x + 0.25, y: y + ch - 0.48, w: 2.55, h: 0.3,
      shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.15, fill: { color: '0AA7A2' }, line: { type: 'none' },
      fontFace: F, fontSize: 10.5, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  });
  T('Mock quotes for layout only. Replace with each validator’s real words and confirm permission to show names and logos.',
    0.6, 6.95, 12.1, 0.3, { size: 10, color: C.amber });
  s.addNotes('[MOCK] Replace these quotes with what each validator actually said. Do not present mock quotes as real feedback.');
  await pres.writeFile({ fileName: OUT }); console.log('wrote', OUT);
})();
