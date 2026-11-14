#!/usr/bin/env python3
"""Merge a JSON map of path -> Ukrainian text (stdin) into content/i18n/uk/<file>."""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import i18n
rel = Path(sys.argv[1])
new = json.loads(sys.stdin.read())
data = json.loads((i18n.CONTENT / rel).read_text(encoding='utf-8'))
valid = dict(i18n.strings(data, rel))
bad = [k for k in new if k not in valid]
if bad: sys.exit('Unknown paths: ' + ', '.join(bad[:10]))
for k, v in new.items():
    if valid[k].count('[[') != v.count('[['): sys.exit(f'Glossary markup count differs at {k}')
out = i18n.overlay(rel); out.update(new)
order = [k for k in valid if k in out]
p = i18n.UK / rel; p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(json.dumps({k: out[k] for k in order}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'{rel}: {len(order)}/{len(valid)} strings')
