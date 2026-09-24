from pathlib import Path
from PIL import Image

assets = Path(r'C:\Users\User\Downloads\rentify-national-challenge\assets')
for i in range(1, 6):
    source = assets / f'team-{i}.png'
    image = Image.open(source).convert('RGBA')
    bounds = image.getchannel('A').getbbox()
    assert bounds, f'Portrait is fully transparent: {source.name}'
    image.crop(bounds).save(assets / f'team-{i}-cropped.png')
    print(f'{source.name}: {image.size} -> {image.crop(bounds).size}')
