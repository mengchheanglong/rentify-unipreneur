# Rewrites the speaker notes of the 13 main slides in build/v6/td (unpacked Rentify_Uniprenuer.pptx)
# with one coherent script and time stamps in presentation order. Creates notes where a slide has none.
import re, os
from xml.sax.saxutils import escape

TD = 'C:/Users/User/Downloads/rentify-national-challenge/build/v6/td'

# slide file -> (time stamp, spoken lines, Q&A reminder or None), in presentation order
SCRIPT = [
    ('slide1.xml', '0:00–0:15', 'Cambodian merchants sell in many places — Facebook, marketplaces and their own shop. Rentify lets them sell everywhere and manage once.', None),
    ('slide2.xml', '0:15–0:40', 'But their tools don’t connect. Orders arrive on Telegram, products sit on Facebook and Khmer24, stock lives in a notebook, and sales happen on a separate POS. So when the last item sells at the counter, Facebook still says it’s in stock. The result: an apology, a refund, a lost customer.', 'Illustrative scenario and AI-generated image.'),
    ('slide3.xml', '0:40–1:00', 'Today merchants use a different tool for each piece: Facebook for their own page, Khmer24, VTENH or Smile Shop for a marketplace, and a POS app or cash box at the counter. Rentify brings all three onto one stock.', 'Khmum is the closest competitor — see the appendix.'),
    ('slide4.xml', '1:00–1:20', 'Here is how it works. The merchant adds a product once — name, price and stock. It appears on their own storefront, in our marketplace and in their POS. Same price, same stock, everywhere.', None),
    ('slide5.xml', '1:20–1:45', 'And it works today. Our demo store had forty bottles of this perfume. We sold one at the counter. Seconds later, the marketplace and the merchant dashboard both showed thirty-nine. One sale, updated everywhere.', 'Demo data in our development build, not customer orders.'),
    ('slide6.xml', '1:45–2:10', 'Three things make Rentify different. Start anywhere — begin on the marketplace and add a storefront and POS later, without re-listing. One stock everywhere, as you just saw. And fair pricing — nothing on the merchant’s own sales; we only earn when our marketplace brings the sale.', 'Tesla wasn’t the first electric car either — we aim to be the platform merchants don’t have to stitch together.'),
    ('slide8.xml', '2:10–2:30', 'We serve two merchants first. The Facebook seller starts free on our marketplace. The small shop starts on Starter with a storefront and POS. We begin in Phnom Penh — home to one in five Cambodian businesses — with fashion and beauty, the two biggest online categories.', None),
    ('slide7.xml', '2:30–2:55', 'So what does it cost a merchant to start? Nothing. [pause] On our Free plan, any shop can sell on the Rentify Marketplace at no cost. We only take a tiny 3%, and only when our marketplace brings them a sale. No sale, no fee. When they’re ready for their own storefront and a POS at the counter, it’s five dollars a month, or ten for Pro. And on their own channels, they keep 100% of every sale. We only earn when our merchants earn.', 'Prices and the 3% rate are proposals to test in the pilot. At launch orders are cash on delivery, so revenue is subscriptions; commission starts with online payments.'),
    ('slide9.xml', '2:55–3:20', 'The market is growing: Cambodian e-commerce was 1.51 billion dollars in 2024, up about 18% a year. Counting from the ground up, there are about 410,000 retail shops — a 22 million dollar subscription market. We focus on 65,000 specialised stores, and aim for about 1,100 paying shops by Year 3.', '$1.51B is total e-commerce sales value, not our revenue. Values use the $5 plan with 10% VAT removed.'),
    ('slide10.xml', '3:20–3:45', 'We go merchants first. This quarter we bring ten pilot shops through market visits, Facebook groups and UniPreneur. In 2027 those shops bring their own customers through storefront links. Then buyers discover more shops in the marketplace — and more buyers bring more shops.', 'Pilot passes if 7 of 10 shops stay active, stock is at least 99% accurate, and 6 of 10 will pay.'),
    ('slide11.xml', '3:45–4:05', 'We are bootstrapped. Year 1 covers its own costs with the team unpaid. Revenue grows to about 62,000 dollars in Year 3. About 110 paying shops cover all running costs, and we need only about 1,100 dollars to start.', 'All inputs are assumptions to validate in the pilot. Detail in the appendix.'),
    ('slide12.xml', '4:05–4:25', '[MOCK — replace with what validators really said.] We have already spoken with merchants and an advisor. Here is what they told us.', 'Do not present mock quotes as real feedback.'),
    ('slide13.xml', '4:25–4:45', 'We are five students who have already built this platform. Our next step is ten pilot shops in Phnom Penh, starting this quarter. Rentify: sell everywhere, manage once. Thank you.', 'Stop here and keep this slide up for Q&A.'),
]


def para(text, italic=False):
    i = ' i="1"' if italic else ''
    return f'<a:p><a:r><a:rPr lang="en-US"{i}/><a:t>{escape(text)}</a:t></a:r></a:p>'


template = open(f'{TD}/ppt/notesSlides/notesSlide1.xml', encoding='utf8').read()
ct_path = f'{TD}/[Content_Types].xml'
ct = open(ct_path, encoding='utf8').read()
existing = [int(n) for n in re.findall(r'notesSlide(\d+)\.xml', ' '.join(os.listdir(f'{TD}/ppt/notesSlides')))]
next_n = max(existing) + 1

for slide, ts, spoken, qa in SCRIPT:
    rels_path = f'{TD}/ppt/slides/_rels/{slide}.rels'
    rels = open(rels_path, encoding='utf8').read()
    m = re.search(r'Target="\.\./notesSlides/(notesSlide\d+\.xml)"', rels)
    if m:
        notes_file = m.group(1)
        x = open(f'{TD}/ppt/notesSlides/{notes_file}', encoding='utf8').read()
    else:
        notes_file = f'notesSlide{next_n}.xml'; next_n += 1
        x = template
        open(f'{TD}/ppt/notesSlides/_rels/{notes_file}.rels', 'w', encoding='utf8').write(
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Target="../notesMasters/notesMaster1.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster"/>'
            f'<Relationship Id="rId2" Target="../slides/{slide}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide"/></Relationships>')
        rels = rels.replace('</Relationships>',
            f'<Relationship Id="rIdNotes1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide" Target="../notesSlides/{notes_file}"/></Relationships>')
        open(rels_path, 'w', encoding='utf8').write(rels)
        ct = ct.replace('</Types>', f'<Override ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml" PartName="/ppt/notesSlides/{notes_file}"/></Types>')
    # replace the body placeholder's paragraphs
    body = para(f'[{ts}]') + para(spoken) + (para(f'(Q&A: {qa})', italic=True) if qa else '')
    x = re.sub(r'(<p:ph type="body"[^>]*/>.*?<a:lstStyle/>).*?(</p:txBody>)', lambda mm: mm.group(1) + body + mm.group(2), x, count=1, flags=re.S)
    open(f'{TD}/ppt/notesSlides/{notes_file}', 'w', encoding='utf8').write(x)
    print(slide, notes_file, ts)

open(ct_path, 'w', encoding='utf8').write(ct)
