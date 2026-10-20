"""Read-only pixel audit; contact sheets are diagnostic previews, not site assets."""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

root = Path('public/catalog-normalized')
report = []
for path in sorted(root.glob('*.jpg')):
    im = Image.open(path).convert('RGB')
    im.thumbnail((300, 300))
    a = np.asarray(im).astype(float)
    edge = np.concatenate([a[:3].reshape(-1,3),a[-3:].reshape(-1,3),a[:,:3].reshape(-1,3),a[:,-3:].reshape(-1,3)])
    bg = np.median(edge, axis=0)
    mask = (np.linalg.norm(a-bg,axis=2)>45) & ((a.max(axis=2)-a.min(axis=2)>18) | (a.mean(axis=2)<bg.mean()-40))
    ys,xs=np.where(mask)
    box = [float(xs.min()/im.width),float(ys.min()/im.height),float((xs.max()+1)/im.width),float((ys.max()+1)/im.height)] if len(xs) else [0,0,1,1]
    report.append(dict(file=path.name,background=bg.tolist(),box=box,needs_white=bool(bg.min()<245 or bg.max()-bg.min()>6)))
out=Path('tmp-image-audit');out.mkdir(exist_ok=True)
(out/'audit.json').write_text(json.dumps(report,indent=2))
for page in range((len(report)+39)//40):
    sheet=Image.new('RGB',(1200,1000),'white');draw=ImageDraw.Draw(sheet)
    for i,item in enumerate(report[page*40:(page+1)*40]):
        im=Image.open(root/item['file']).convert('RGB');im.thumbnail((145,165))
        x=(i%8)*150;y=(i//8)*200
        sheet.paste(im,(x,y));draw.text((x,y+166),item['file'][:24],fill='red' if item['needs_white'] else 'black')
    sheet.save(out/f'contact-{page+1}.jpg')
print(json.dumps({'total':len(report),'needs_white':[r['file'] for r in report if r['needs_white']]}))
