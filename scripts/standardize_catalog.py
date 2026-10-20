"""Rebuild white, consistently framed catalog photos; originals stay untouched."""
from pathlib import Path
import json
import os
import time
import numpy as np
from PIL import Image, ImageOps
from rembg import remove, new_session

root = Path('public').resolve()
originals = {p.stem: p for p in (root/'catalog-original').iterdir() if p.suffix.lower() in {'.png','.jpg','.jpeg','.webp','.avif'}}
report = []
session = new_session('u2net')
for dest in sorted((root/'catalog-normalized').glob('*.jpg')):
    if dest.name < os.environ.get('CATALOG_START',''):
        continue
    source = originals.get(dest.stem, dest)
    im = ImageOps.exif_transpose(Image.open(source)).convert('RGBA')
    im.thumbnail((1600,1600),Image.Resampling.LANCZOS)
    im = remove(im,session=session)
    alpha = np.asarray(im.getchannel('A'))
    ys, xs = np.where(alpha>20)
    if not len(xs):
        raise RuntimeError(f'Empty product mask: {source}')
    box = (max(0,int(xs.min())-8),max(0,int(ys.min())-8),min(im.width,int(xs.max())+9),min(im.height,int(ys.max())+9))
    im = im.crop(box)
    white = Image.new('RGBA', im.size, 'white')
    white.alpha_composite(im)
    im = white.convert('RGB')
    a = np.asarray(im).copy()
    # Only clean almost-white neutral background, never beige leather.
    neutral = (a.min(axis=2)>242) & (a.max(axis=2).astype(int)-a.min(axis=2)<9)
    a[neutral] = 255
    im = Image.fromarray(a)
    scale=1020/max(im.size)
    im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
    canvas = Image.new('RGB',(1200,1200),'white')
    canvas.paste(im,((1200-im.width)//2,(1200-im.height)//2))
    for attempt in range(3):
        try:
            canvas.save(dest,quality=92,optimize=True,progressive=True)
            break
        except OSError:
            if attempt==2:
                raise
            time.sleep(1)
    report.append({'file':dest.name,'source':str(source),'box':box})
    print(dest.name,flush=True)
Path('tmp-image-audit/standardization.json').write_text(json.dumps(report,indent=2))
print(f'Standardized {len(report)} photos')
