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
for name in ['index.html','app.js','hall.js','columns.js','read.js','universe.js','styles.css']:
 shutil.copyfile(ROOT/'web'/name,OUT/name)
content={}
for kind in ['chapters','places','details','lessons','guides','features']:
 content[kind]=[read(p) for p in sorted((ROOT/'content'/kind).glob('*.json'))]
content['sources']=read(ROOT/'content/sources.json')['sources']
content['media']=read(ROOT/'content/media.json')['media']
content['glossary']=read(ROOT/'content/glossary.json')
import re, unicodedata
def glyph(code):
 m=re.fullmatch(r'([A-Za-z]+)(\d+)([A-Za-z]?)',code)
 name='EGYPTIAN HIEROGLYPH '+(m.group(1)+m.group(2).zfill(3)+m.group(3)).upper()
 return unicodedata.lookup(name)
gmap={}
def conv(codes):
 out=[]
 for c in codes:
  gmap[c]=glyph(c); out.append(gmap[c])
 return out
rd={k:read(ROOT/'content/reading'/(k+'.json')) for k in ['signs','names','phrases','scene','practice','alphabet']}
for s in rd['signs']['signs']: s['glyphs']=conv(s['code'].split('-'))
for p in rd['phrases']['phrases']: p['glyphs']=conv(p['glyphs'])
for k in rd['names']['kings']:
 for part in ('throne','birth'):
  if k[part].get('glyphs'): k[part]['glyphs']=conv(k[part]['glyphs'])
  if k[part].get('quads'): k[part]['quads']=[[conv(row) for row in q] for q in k[part]['quads']]
conv(['M23','X1','L2','G39','N5'])
for l in rd['alphabet']['letters']+rd['alphabet']['extra']: l['glyphs']=conv(l['code'].split('-'))
rd['alphabet']['nameTool']['glyphs']={k:conv(v.split('-')) for k,v in rd['alphabet']['nameTool']['map'].items()}
rd['glyphMap']=gmap
content['reading']=rd
fontsrc=ROOT/'assets/fonts'
if fontsrc.exists():
 shutil.copytree(fontsrc,OUT/'fonts',dirs_exist_ok=True)
(OUT/'assets').mkdir(exist_ok=True)
for m in content['media']:
 source=ROOT/m['path'];target=(OUT/'assets'/source.name).with_suffix('.jpg')
 if not target.exists() or target.stat().st_mtime<source.stat().st_mtime:
  with Image.open(source) as im:
   im=im.convert('RGB');im.thumbnail((1600,1600));im.save(target,quality=88,optimize=True)
 m['webPath']='assets/'+target.name
 with Image.open(target) as im2: m['width'],m['height']=im2.size
 m['changes'] += ' Review-site copy proportionally resized to at most 1600px and JPEG recompressed; no editorial crop. Card layouts may crop the display; enlarge for the full image.'
payload=json.dumps(content,ensure_ascii=False)
(OUT/'data.json').write_text(payload+'\n',encoding='utf-8')
(OUT/'data.js').write_text('window.KARNAK_DATA='+payload+';\n',encoding='utf-8')
stops=sum(len(g.get('stops',[])) for g in content['guides'])
print(f'Built {len(content["chapters"])} chapters, {len(content["places"])} places, {len(content["guides"])} guide ({stops} stops) and {len(content["media"])} images in {OUT}')
print(f'Open {OUT/"index.html"} in a browser.')
