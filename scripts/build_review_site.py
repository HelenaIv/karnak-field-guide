#!/usr/bin/env python3
"""Build a portable, dependency-free review website from the research repository.

The output in dist/ can be opened directly (double-click dist/index.html): the content
is written both as data.json and as data.js, so no local web server is required.
"""
import json
from pathlib import Path
import shutil
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist'
OUT.mkdir(exist_ok=True)
def read(path):
 return json.loads(Path(path).read_text(encoding='utf-8'))
for name in ['index.html','app.js','hall.js','styles.css']:
 shutil.copyfile(ROOT/'web'/name,OUT/name)
content={}
for kind in ['chapters','places','details','lessons','guides']:
 content[kind]=[read(p) for p in sorted((ROOT/'content'/kind).glob('*.json'))]
content['sources']=read(ROOT/'content/sources.json')['sources']
content['media']=read(ROOT/'content/media.json')['media']
content['glossary']=read(ROOT/'content/glossary.json')
(OUT/'assets').mkdir(exist_ok=True)
for m in content['media']:
 source=ROOT/m['path'];target=(OUT/'assets'/source.name).with_suffix('.jpg')
 if not target.exists() or target.stat().st_mtime<source.stat().st_mtime:
  with Image.open(source) as im:
   im=im.convert('RGB');im.thumbnail((1600,1600));im.save(target,quality=88,optimize=True)
 m['webPath']='assets/'+target.name
 m['changes'] += ' Review-site copy proportionally resized to at most 1600px and JPEG recompressed; no editorial crop. Card layouts may crop the display; enlarge for the full image.'
payload=json.dumps(content,ensure_ascii=False)
(OUT/'data.json').write_text(payload+'\n',encoding='utf-8')
(OUT/'data.js').write_text('window.KARNAK_DATA='+payload+';\n',encoding='utf-8')
stops=sum(len(g.get('stops',[])) for g in content['guides'])
print(f'Built {len(content["chapters"])} chapters, {len(content["places"])} places, {len(content["guides"])} guide ({stops} stops) and {len(content["media"])} images in {OUT}')
print(f'Open {OUT/"index.html"} in a browser.')
