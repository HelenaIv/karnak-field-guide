#!/usr/bin/env python3
"""Merge a JSON map of path -> translated text (stdin) into content/i18n/<lang>/<file>.

    python scripts/i18n_merge.py <file>              # Ukrainian (default)
    python scripts/i18n_merge.py --lang nb <file>    # Norwegian
"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import i18n
args = sys.argv[1:]
lang = 'uk'
if '--lang' in args:
    i = args.index('--lang'); lang = args[i + 1]; del args[i:i + 2]
if lang not in i18n.LANGS: sys.exit(f'Unknown language {lang}')
rel = Path(args[0])
new = json.loads(sys.stdin.read())
data = json.loads((i18n.CONTENT / rel).read_text(encoding='utf-8'))
valid = dict(i18n.strings(data, rel))
bad = [k for k in new if k not in valid]
if bad: sys.exit('Unknown paths: ' + ', '.join(bad[:10]))
for k, v in new.items():
    if valid[k].count('[[') != v.count('[['): sys.exit(f'Glossary markup count differs at {k}')
out = i18n.overlay(rel, lang); out.update(new)
order = [k for k in valid if k in out]
p = i18n.lang_dir(lang) / rel; p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(json.dumps({k: out[k] for k in order}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'{rel}: {len(order)}/{len(valid)} strings')
