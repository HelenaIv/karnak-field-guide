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
import sys
sys.path.insert(0,str(ROOT/'scripts'))
import i18n
LANG='en'
def read(path):
 data=json.loads(Path(path).read_text(encoding='utf-8'))
 return i18n.localized(path,data) if LANG=='uk' else data
for name in ['index.html','app.js','hall.js','columns.js','read.js','universe.js','basics.js','styles.css','i18n.js']:
 shutil.copyfile(ROOT/'web'/name,OUT/name)
import re, unicodedata
fontsrc=ROOT/'assets/fonts'
if fontsrc.exists():
 shutil.copytree(fontsrc,OUT/'fonts',dirs_exist_ok=True)
def build_content():
 content={}
 for kind in ['chapters','places','details','lessons','guides','features']:
  content[kind]=[read(p) for p in sorted((ROOT/'content'/kind).glob('*.json'))]
 content['sources']=read(ROOT/'content/sources.json')['sources']
 content['media']=read(ROOT/'content/media.json')['media']
 content['glossary']=read(ROOT/'content/glossary.json')
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
 (OUT/'assets').mkdir(exist_ok=True)
 for m in content['media']:
  if m.get('type')=='video':
   for k in ('path','poster'):
    src=ROOT/m[k];dst=OUT/'assets'/src.name
    if not dst.exists() or dst.stat().st_mtime<src.stat().st_mtime: shutil.copyfile(src,dst)
   m['videoPath']='assets/'+(ROOT/m['path']).name;m['webPath']='assets/'+(ROOT/m['poster']).name
   with Image.open(ROOT/m['poster']) as im2: m['width'],m['height']=im2.size
   continue
  source=ROOT/m['path'];target=(OUT/'assets'/source.name).with_suffix('.jpg')
  if not target.exists() or target.stat().st_mtime<source.stat().st_mtime:
   with Image.open(source) as im:
    im=im.convert('RGB');im.thumbnail((1600,1600));im.save(target,quality=88,optimize=True)
  m['webPath']='assets/'+target.name
  with Image.open(target) as im2: m['width'],m['height']=im2.size
  m['changes'] += (' Копію для сайту пропорційно зменшено до 1600 px і повторно стиснуто в JPEG; редакційного обрізання немає. Картки можуть обрізати зображення; збільште його, щоб побачити повністю.' if LANG=='uk' else ' Review-site copy proportionally resized to at most 1600px and JPEG recompressed; no editorial crop. Card layouts may crop the display; enlarge for the full image.')
 return content
content=build_content()
LANG='uk'
content_uk=build_content()
LANG='en'
payload=json.dumps(content,ensure_ascii=False)
(OUT/'data.json').write_text(payload+'\n',encoding='utf-8')
(OUT/'data.js').write_text('window.KARNAK_DATA='+payload+';\n',encoding='utf-8')
(OUT/'data-uk.js').write_text('window.KARNAK_DATA='+json.dumps(content_uk,ensure_ascii=False)+';\n',encoding='utf-8')
ui=ROOT/'content/i18n/uk/ui.json'
uidict=json.loads(ui.read_text(encoding='utf-8')) if ui.exists() else {}
# Short translated content strings double as interface phrases (titles reused in links, labels, buttons).
auto={}
def pairs(a,b):
 if isinstance(a,str) and isinstance(b,str):
  if a!=b and len(a)<=80 and '[[' not in a: auto.setdefault(a.strip(),b.strip())
 elif isinstance(a,list) and isinstance(b,list):
  for x,y in zip(a,b): pairs(x,y)
 elif isinstance(a,dict) and isinstance(b,dict):
  for k in a:
   if k in b: pairs(a[k],b[k])
pairs(content,content_uk)
uidict['auto']=auto
(OUT/'ui-uk.js').write_text('window.KARNAK_UI_UK='+json.dumps(uidict,ensure_ascii=False)+';\n',encoding='utf-8')
stops=sum(len(g.get('stops',[])) for g in content['guides'])
print(f'Built {len(content["chapters"])} chapters, {len(content["places"])} places, {len(content["guides"])} guide ({stops} stops) and {len(content["media"])} images in {OUT}')
# Cache-busting: tag each CSS/JS reference with a short content hash so browsers load fresh files after every deploy.
import hashlib
_idx=OUT/'index.html';_html=_idx.read_text(encoding='utf-8')
def _ver(m):
 f=OUT/m.group(2)
 return m.group(0) if not f.exists() else f'{m.group(1)}="{m.group(2)}?v={hashlib.sha1(f.read_bytes()).hexdigest()[:10]}"'
_html=re.sub(r'(src|href)="([\w.-]+\.(?:js|css))"',_ver,_html)
for _f in ('data.js','data-uk.js','ui-uk.js'):
 _html=_html.replace('{{'+_f+'}}',f'{_f}?v={hashlib.sha1((OUT/_f).read_bytes()).hexdigest()[:10]}')
_idx.write_text(_html,encoding='utf-8')
print(f'Open {OUT/"index.html"} in a browser.')
