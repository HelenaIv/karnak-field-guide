#!/usr/bin/env python3
"""Ukrainian (uk) translation overlays.

English records stay the identity. Each content file may have an overlay at
content/i18n/uk/<same relative path>, a flat JSON map of  path -> Ukrainian text.
Paths use list item ids where present, e.g. "stops[entrance]/look[0]".
Strings without a translation fall back to English.

  python scripts/i18n.py status            # coverage per file
  python scripts/i18n.py todo <file> [n]   # untranslated strings as JSON (path -> English)
  python scripts/i18n.py check             # stale paths or mismatched glossary links (run by validate_content.py)
"""
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content'
UK = CONTENT / 'i18n' / 'uk'
# Languages besides English, each with overlays in content/i18n/<lang>/. English stays the identity.
LANGS = ['uk', 'nb']
NAMES = {'uk': 'Ukrainian', 'nb': 'Norwegian (Bokmål)'}
def lang_dir(lang):
    return CONTENT / 'i18n' / lang
# Display text only. Identifiers, transliteration, hieroglyph codes, citations, source titles,
# credits and licences are never translated.
KEYS = {'text','title','name','label','meaning','look','caption','where','heading','alt','why','date',
 'paragraphs','today','role','summary','orientation','term','definition','evidenceLabel','lookFor','sound',
 'object','topics','intro','architecture','reign','dynasty','spot','inHallNote','built','tells','steps',
 'position','location','stand','transition','question','explanation','dek','short','teaser','answer',
 'observation','interpretation','limits','body','approximateRange','datingNote','caveats','uncertainties',
 'home','imageGap','builtIntro','eyebrow','drawingNote','accessNote','planNote','surface','researchQuestion',
 'early','description','note','lookCloser','more','story','blocks','figures','readIt','items','cards','lede',
 'subtitle','hint','when','time','after','extra','stations','readyExamples','open','notImplemented','reviewNote','prompt','options','feedback','tip','tips','legend','sections','points','facts','pages','oil','lake','wall','see','photos','years','value'}
# Internal values and enums, never translated even inside a translatable block.
NEVER = {'certainty','status','type','zone','facing','diagram','format','kind','category','level','additionalChecks',
 'consultation','reviewNote','positionMode','link','colour','era','period','group','area','drawing','predicate',
 'language','accessed','retrieved','updated','locator','sourceId','citations','sources','glyphs','quads','translit',
 'mdc','code','reading','say','path','url','rights','attribution','creator','license','licenseUrl','sourcePage'}
SKIP_FILES = {'relationships.json', 'index.json'}
# Files where only a few fields are display text (titles of sources and image file names stay as they are).
FILE_KEYS = {'media.json': {'caption', 'alt', 'changes', 'identificationStatus'},
             'sources.json': {'kind', 'consultation', 'note'}}

def files():
    for p in sorted(CONTENT.rglob('*.json')):
        rel = p.relative_to(CONTENT)
        if rel.parts[0] == 'i18n' or rel.name in SKIP_FILES:
            continue
        yield rel

def seg(i, x):
    return f'[{x["id"]}]' if isinstance(x, dict) and isinstance(x.get('id'), str) else f'[{i}]'

def strings(obj, rel, path='', key=None, live=False):
    """Yield (path, text) for every translatable string."""
    keys = FILE_KEYS.get(rel.name, KEYS)
    if isinstance(obj, str):
        if live and re.search(r'[A-Za-z]', obj) and not (re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', obj) and ('-' in obj or key in ('kings', 'king', 'places', 'details', 'stops'))) and not obj.startswith(('http', '#', 'assets/')):
            yield path, obj
    elif isinstance(obj, list):
        for i, x in enumerate(obj):
            yield from strings(x, rel, path + seg(i, x), key, live)
    elif isinstance(obj, dict):
        for k, v in obj.items():
            if k == 'id' or k.endswith(('Id', 'Ids')) or (k in NEVER and k not in FILE_KEYS.get(rel.name, ()) and not (k == 'sources' and rel.name == 'sources.json' and not path)):
                continue
            yield from strings(v, rel, (path + '/' if path else '') + k, k, live or k in keys)

def overlay(rel, lang='uk'):
    p = lang_dir(lang) / rel
    return json.loads(p.read_text(encoding='utf-8')) if p.exists() else {}

def apply(obj, rel, tr, path=''):
    """Return a copy of obj with translations applied."""
    if isinstance(obj, str):
        return tr.get(path, obj)
    if isinstance(obj, list):
        return [apply(x, rel, tr, path + seg(i, x)) for i, x in enumerate(obj)]
    if isinstance(obj, dict):
        return {k: apply(v, rel, tr, (path + '/' if path else '') + k) for k, v in obj.items()}
    return obj

def localized(path, data, lang='uk'):
    """Apply a language overlay for a content file, given its parsed English data."""
    rel = Path(path).resolve().relative_to(CONTENT)
    tr = overlay(rel, lang)
    return apply(data, rel, tr) if tr else data

if __name__ == '__main__':
    args = sys.argv[1:]
    lang = 'uk'
    if '--lang' in args:
        i = args.index('--lang'); lang = args[i + 1]; del args[i:i + 2]
        if lang not in LANGS: sys.exit(f'Unknown language {lang}; known: {LANGS}')
    sys.argv = [sys.argv[0]] + args
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    if cmd == 'status':
        tw = dw = 0
        for rel in files():
            data = json.loads((CONTENT / rel).read_text(encoding='utf-8'))
            tr = overlay(rel, lang); s = dict(strings(data, rel))
            w = sum(len(v.split()) for v in s.values()); d = sum(len(v.split()) for k, v in s.items() if k in tr)
            tw += w; dw += d
            stale = [k for k in tr if k not in s]
            if w: print(f'{d:6}/{w:<6} {rel}' + (f'  STALE {len(stale)}' if stale else ''))
        print(f'TOTAL {dw}/{tw} words ({NAMES[lang]})')
    elif cmd == 'check':
        # Fails on translated strings whose English path no longer exists, or whose glossary links differ. Checks every language.
        problems = []
        for rel in files():
            data = json.loads((CONTENT / rel).read_text(encoding='utf-8')); src = dict(strings(data, rel))
            for lg in LANGS:
                for k, v in overlay(rel, lg).items():
                    if k not in src: problems.append(f'{lg}/{rel}: stale path {k}')
                    elif re.findall(r'\[\[([a-z0-9-]+)', src[k]) != re.findall(r'\[\[([a-z0-9-]+)', v): problems.append(f'{lg}/{rel}: glossary links differ at {k}')
        print('\n'.join(problems) or 'Translation overlays (' + ', '.join(LANGS) + '): all paths current, glossary links match.')
        sys.exit(1 if problems else 0)
    elif cmd == 'todo':
        rel = Path(sys.argv[2]); n = int(sys.argv[3]) if len(sys.argv) > 3 else 10**9
        data = json.loads((CONTENT / rel).read_text(encoding='utf-8')); tr = overlay(rel, lang)
        todo = {k: v for k, v in strings(data, rel) if k not in tr}
        print(json.dumps(dict(list(todo.items())[:n]), ensure_ascii=False, indent=0))
        print(f'# {len(todo)} remaining', file=sys.stderr)
