#!/usr/bin/env python3
"""Build a portable, dependency-free review website from the research repository."""
import json
from pathlib import Path
import shutil
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist'
OUT.mkdir(exist_ok=True)
for name in ['index.html','app.js','styles.css']:
 shutil.copyfile(ROOT/'web'/name,OUT/name)
content={}
for kind in ['chapters','places','details','lessons']:
 content[kind]=[json.loads(p.read_text()) for p in sorted((ROOT/'content'/kind).glob('*.json'))]
content['sources']=json.loads((ROOT/'content/sources.json').read_text())['sources']
content['media']=json.loads((ROOT/'content/media.json').read_text())['media']
for m in content['media']:
 source=ROOT/m['path'];target=OUT/'assets'/source.name
 target.parent.mkdir(exist_ok=True)
 with Image.open(source) as im:
  im=im.convert('RGB');im.thumbnail((1600,1600));im.save(target.with_suffix('.jpg'),quality=88,optimize=True)
 m['webPath']='assets/'+target.with_suffix('.jpg').name
 m['changes'] += ' Review-site copy proportionally resized to at most 1600px and JPEG recompressed; no editorial crop. Card layouts may crop the display; enlarge for the full image.'
(OUT/'data.json').write_text(json.dumps(content,ensure_ascii=False)+'\n')
print(f'Built {len(content["chapters"])} chapters, {len(content["places"])} places and {len(content["media"])} images in {OUT}')
