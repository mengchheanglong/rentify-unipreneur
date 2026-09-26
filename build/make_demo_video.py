# Builds output/Rentify_demo_one-sale.mp4 from real screens captured during the perfume POS sale
# (build/v6/cap_perfume.js, cap_after.js). Run: python build/make_demo_video.py [--sheet]
import subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = 'C:/Users/User/Downloads/rentify-national-challenge'
A = ROOT + '/assets/v6/'
OUT = ROOT + '/output/Rentify_demo_one-sale.mp4'
W, H, FPS = 1920, 1080, 30
NAVY, TEAL, MINT, WHITE, AMBER = (17, 29, 53), (10, 167, 162), (167, 243, 208), (255, 255, 255), (245, 158, 11)
F = 'C:/Windows/Fonts/'
font = lambda s, b=True: ImageFont.truetype(F + ('arialbd.ttf' if b else 'arial.ttf'), s)

# (kind, seconds, data)
SCENES = [
    ('card', 3.0, ('LIVE DEMO', 'One sale, updated everywhere', 'Demo store: Aura Botanicals · Development build')),
    ('shot', 4.0, ('q-mp-before.png', (1650, 1050), 'Marketplace', 'Yes I Am The Queen · 40 in stock', 1)),
    ('shot', 4.0, ('q-pos-before.png', (1700, 420), 'POS at the counter', 'A customer buys one bottle', 2)),
    ('shot', 3.5, ('q-pos-receipt.png', (1500, 500), 'POS at the counter', 'Paid in cash · receipt ready', 2)),
    ('shot', 4.0, ('q-mp-after.png', (1650, 1050), 'Marketplace', 'Now 39 in stock — automatically', 3)),
    ('shot', 3.5, ('q-inv-after.png', (1500, 800), 'Merchant dashboard', 'Stock 39 — no second update', 3, 'top')),
    ('card', 3.0, ('40 → 39', 'One sale. Every channel.', 'Rentify · Sell everywhere. Manage once.')),
]
FADE = 0.4


def cover(im, zoom, focus):
    """Crop a 16:9 window of the screenshot, zoomed toward a focus point."""
    iw, ih = im.size
    cw = iw / zoom; ch = cw * H / W
    if ch > ih: ch = ih; cw = ch * W / H
    fx, fy = focus
    x = min(max(fx - cw / 2, 0), iw - cw); y = min(max(fy - ch / 2, 0), ih - ch)
    x0 = min(max((iw - cw) / 2 + (x - (iw - cw) / 2) * (zoom - 1) / 0.25 if zoom > 1 else (iw - cw) / 2, 0), iw - cw)
    y0 = min(max((ih - ch) / 2 + (y - (ih - ch) / 2) * (zoom - 1) / 0.25 if zoom > 1 else (ih - ch) / 2, 0), ih - ch)
    return im.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.LANCZOS)


def caption(frame, step, label, text, pos='bottom'):
    d = ImageDraw.Draw(frame, 'RGBA')
    b = H - 50 if pos == 'bottom' else 190
    d.rounded_rectangle((60, b - 140, 60 + 1100, b), 28, fill=(17, 29, 53, 235))
    d.ellipse((95, b - 110, 175, b - 30), fill=TEAL)
    d.text((135, b - 70), str(step), font=font(44), fill=WHITE, anchor='mm')
    d.text((205, b - 120), label.upper(), font=font(26), fill=MINT)
    d.text((205, b - 78), text, font=font(42), fill=WHITE)
    d.rounded_rectangle((W - 470, 40, W - 50, 96), 28, fill=(17, 29, 53, 200))
    d.text((W - 260, 68), 'Development build · demo data', font=font(22, False), fill=WHITE, anchor='mm')
    return frame


def card(top, big, small):
    im = Image.new('RGB', (W, H), NAVY); d = ImageDraw.Draw(im)
    logo = Image.open(ROOT + '/assets/rentify-logo.png').convert('RGBA').resize((150, 150))
    im.paste(logo, (W // 2 - 75, 190), logo)
    d.text((W // 2, 420), top, font=font(40), fill=TEAL, anchor='mm')
    d.text((W // 2, 540), big, font=font(96), fill=WHITE, anchor='mm')
    d.text((W // 2, 660), small, font=font(36, False), fill=MINT, anchor='mm')
    cols = [(249, 115, 22), (36, 99, 232), TEAL]
    for k, c in enumerate(cols):
        x = W // 2 - 150 + k * 110; d.rounded_rectangle((x, 770, x + 80, 850), 18, fill=c)
    return im


def scene_frames(kind, secs, data):
    n = int(secs * FPS)
    if kind == 'card':
        base = card(*data)
        for i in range(n): yield base
        return
    file, focus, label, text, step = data[:5]; pos = data[5] if len(data) > 5 else 'bottom'
    im = Image.open(A + file).convert('RGB')
    for i in range(n):
        t = i / max(n - 1, 1)
        z = 1.0 + 0.25 * (t * t * (3 - 2 * t))  # ease-in-out zoom 1.0 -> 1.25
        yield caption(cover(im, z, focus), step, label, text, pos)


def frames():
    prev_tail = None
    for kind, secs, data in SCENES:
        buf = list(scene_frames(kind, secs, data))
        nf = int(FADE * FPS)
        if prev_tail is not None:
            for k in range(nf):
                yield Image.blend(prev_tail, buf[k], (k + 1) / (nf + 1))
            buf = buf[nf:]
        for f in buf[:-1]: yield f
        prev_tail = buf[-1]
    yield prev_tail


if '--sheet' in sys.argv:
    thumbs = []
    for kind, secs, data in SCENES:
        fr = list(scene_frames(kind, secs, data)); thumbs += [fr[0], fr[-1]]
    sheet = Image.new('RGB', (960 * 2, 540 * len(SCENES)), WHITE)
    for k, t in enumerate(thumbs): sheet.paste(t.resize((960, 540)), ((k % 2) * 960, (k // 2) * 540))
    sheet.resize((960, 270 * len(SCENES))).save(ROOT + '/build/v6/video-sheet.png'); print('sheet'); sys.exit()

p = subprocess.Popen(['ffmpeg', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', OUT],
                     stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
for f in frames(): p.stdin.write(f.tobytes())
p.stdin.close(); p.wait(); print('wrote', OUT)
