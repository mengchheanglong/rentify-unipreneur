from pathlib import Path
import json
import zipfile
import xml.etree.ElementTree as ET
from reportlab.pdfgen import canvas
from pypdf import PdfReader

root = Path(r'C:\Users\User\Downloads\rentify-national-challenge')
slides = root / 'build' / 'rendered-v5-team-cropped'
out = root / 'output' / 'Rentify_UniPreneur_Pitch_v5.pdf'
pitch = json.loads((root / 'build' / 'pitch-content-v5.json').read_text(encoding='utf-8'))
titles = [row['title'] for row in pitch] + ['Market sizing', 'Competitor comparison', 'Illustrative revenue mechanics', 'Product status and next proof']
c = canvas.Canvas(str(out), pagesize=(960, 540))
c.setTitle('Rentify - UniPreneur Pitch')
c.setAuthor('Rentify')
c.setSubject('Offline visual backup; nine pitch slides and four Q&A slides')
for n, title in enumerate(titles, 1):
    c.drawImage(str(slides / f'slide-{n}.png'), 0, 0, width=960, height=540)
    c.bookmarkPage(f'slide{n}')
    c.addOutlineEntry(f'{n}. {title}', f'slide{n}', level=0)
    c.showPage()
c.save()
r = PdfReader(out)
assert len(r.pages) == 13
assert all(float(p.mediabox.width) == 960 and float(p.mediabox.height) == 540 for p in r.pages)

# Verify the exported PowerPoint notes include every scripted paragraph.
ns = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
with zipfile.ZipFile(root / 'output' / 'Rentify_UniPreneur_Pitch_v5.pptx') as z:
    for row in pitch:
        note = ET.fromstring(z.read(f"ppt/notesSlides/notesSlide{row['slide']}.xml"))
        text = ' '.join(t.text or '' for t in note.findall('.//a:t', ns))
        assert row['script'] in text, f"Speaker script mismatch: slide {row['slide']}"
print(f'Created {out}: 13 pages at 16:9. Verified all nine speaker scripts in PPTX notes.')
