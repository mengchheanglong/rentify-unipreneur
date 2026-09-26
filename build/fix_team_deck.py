# Applies review fixes directly to output/Rentify_Uniprenuer.pptx (unpacked in build/v6/td).
# - slide 5: replaced by the perfume proof slide (same layout as slide 4)
# - slide 12: validator slide with MOCK quotes (clearly labelled)
# - slide 11: clean chart image
# - slides 9, 18: market values on the same after-VAT basis as the financial model
# - slide 19: current pricing; slide 14: remove "Build status"
import os, re, shutil

ROOT = 'C:/Users/User/Downloads/rentify-national-challenge'
TD = ROOT + '/build/v6/td'
DR = ROOT + '/build/v6/dr'
SCALE = 18288000 / 12192000  # draft 13.333in -> team deck 20in


def scale_xml(x):
    s = lambda m: f'{m.group(1)}"{round(int(m.group(2)) * SCALE)}"'
    x = re.sub(r'(<a:(?:off|chOff) x=)"(-?\d+)"', s, x)
    x = re.sub(r'(<a:(?:off|chOff) x="-?\d+" y=)"(-?\d+)"', s, x)
    x = re.sub(r'(<a:(?:ext|chExt) cx=)"(\d+)"', s, x)
    x = re.sub(r'(<a:(?:ext|chExt) cx="\d+" cy=)"(\d+)"', s, x)
    x = re.sub(r'(\bsz=)"(\d+)"', s, x)
    x = re.sub(r'(<a:ln w=)"(\d+)"', s, x)
    x = re.sub(r'(\b(?:blurRad|dist|lIns|tIns|rIns|bIns)=)"(\d+)"', s, x)
    x = re.sub(r'(<a:spcPts val=)"(\d+)"', s, x)
    return x


def transplant(draft_dir, n, tag):
    src = open(f'{draft_dir}/ppt/slides/slide1.xml', encoding='utf8').read()
    src_rels = open(f'{draft_dir}/ppt/slides/_rels/slide1.xml.rels', encoding='utf8').read()
    old_rels = open(f'{TD}/ppt/slides/_rels/slide{n}.xml.rels', encoding='utf8').read()
    layout = re.search(r'Target="(\.\./slideLayouts/[^"]+)"', old_rels).group(1)
    notes = re.search(r'Target="(\.\./notesSlides/[^"]+)"', old_rels)
    rels = []
    for rid, target in re.findall(r'Id="(rId\d+)"[^>]*Target="\.\./media/([^"]+)"', src_rels):
        new = f'{tag}-{target}'
        shutil.copy(f'{draft_dir}/ppt/media/{target}', f'{TD}/ppt/media/{new}')
        rels.append(f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/{new}"/>')
    rels.append(f'<Relationship Id="rIdL1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="{layout}"/>')
    if notes:
        rels.append(f'<Relationship Id="rIdN1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide" Target="{notes.group(1)}"/>')
    open(f'{TD}/ppt/slides/_rels/slide{n}.xml.rels', 'w', encoding='utf8').write(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + ''.join(rels) + '</Relationships>')
    open(f'{TD}/ppt/slides/slide{n}.xml', 'w', encoding='utf8').write(scale_xml(src))


def edit(path, pairs):
    p = f'{TD}/{path}'
    x = open(p, encoding='utf8').read()
    for a, b in pairs:
        assert a in x, (path, a[:60])
        x = x.replace(a, b)
    open(p, 'w', encoding='utf8').write(x)


transplant(f'{DR}/proof', 5, 'proof')
transplant(f'{DR}/val', 12, 'val')
shutil.copy(f'{ROOT}/build/v6/chart11.png', f'{TD}/ppt/media/image49.png')

edit('ppt/notesSlides/notesSlide4.xml', [
    ('Our demo store had forty units of this cream.', 'Our demo store had forty bottles of this perfume.'),
    ('Seconds later, the storefront and the marketplace both showed thirty-nine.',
     'Seconds later, the marketplace and the merchant dashboard both showed thirty-nine, and the storefront stayed in stock.'),
])
# Market values on the same basis as the financial model: $5 plan with 10% VAT removed = US$54.5 / shop / year
edit('ppt/slides/slide9.xml', [
    ('$24.6M / yr', '$22.4M / yr'), ('$3.9M / yr', '$3.6M / yr'), ('$67.7K / yr', '$61.6K / yr'),
    ('$ = shops × US$60/yr subscription; SOM from team model;',
     'Value = shops × US$54.5/yr ($5 plan, 10% VAT removed); SOM from team model;'),
])
edit('ppt/slides/slide18.xml', [
    ('× US$60 / yr', '× US$54.5 / yr'), ('US$24.6M', 'US$22.4M'), ('US$3.9M', 'US$3.6M'),
    ('Year 3 subscription revenue (US$67,744) ÷ US$60 — average paying shops in the team model',
     'Year 3 subscription revenue (US$61,586) ÷ US$54.5 — average paying shops in the team model'),
    ('US$67.7K', 'US$61.6K'), ('Why US$60?  ', 'Why US$54.5?  '),
    ('The $5 average plan × 12 months. Free-plan shops pay no subscription.',
     'The $5 average plan × 12 months, with 10% VAT removed. Free-plan shops pay no subscription.'),
])
edit('ppt/slides/slide19.xml', [
    ('Subscriptions: Starter $3, Growth $5, Pro $10 per month (proposed)',
     'Subscriptions: Free, Starter $5, Pro $10 per month (proposed)'),
    ('Marketplace commission on marketplace-sourced online orders proposed 3%, from 2027)',
     'Marketplace commission: proposed 3% on marketplace sales, from 2027; 0% on own storefront and POS'),
])
edit('ppt/slides/slide14.xml', [
    (' · Delivery partners · Build status', ' · Delivery partners'),
])
print('fixed')
