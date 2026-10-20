"""Remove only outer white canvas margins for an edge-to-edge full photo view."""
from pathlib import Path
import sys
import numpy as np
from PIL import Image

output = Path('public/catalog-zoom').resolve()
output.mkdir(exist_ok=True)
for source in Path('public/catalog-normalized').resolve().glob('*.jpg'):
    if len(sys.argv)>1 and source.name not in sys.argv[1:]:
        continue
    # This photograph has fine chains that segmentation can mistake for background.
    original = Path('public/catalog-original/bolsa-chanel-pp.png') if source.stem=='bolsa-chanel-pp' else source
    with Image.open(original) as opened:
        im = opened.convert('RGB')
    a = np.asarray(im)
    ys, xs = np.where(a.min(axis=2)<240)
    if not len(xs):
        raise RuntimeError(f'No visible product: {source}')
    pad=max(3,round(max(xs.max()-xs.min(),ys.max()-ys.min())*.015))
    box = (max(0,int(xs.min())-pad),max(0,int(ys.min())-pad),min(im.width,int(xs.max())+pad+1),min(im.height,int(ys.max())+pad+1))
    tight=im.crop(box)
    scale=1020/max(tight.size)
    tight=tight.resize((round(tight.width*scale),round(tight.height*scale)),Image.Resampling.LANCZOS)
    tight.save(output/source.name,quality=94,optimize=True,progressive=True)
    canvas=Image.new('RGB',(1200,1200),'white')
    canvas.paste(tight,((1200-tight.width)//2,(1200-tight.height)//2))
    temporary=source.with_suffix('.tmp.jpg')
    canvas.save(temporary,quality=92,optimize=True,progressive=True)
    temporary.replace(source)
print('Zoom images prepared')
