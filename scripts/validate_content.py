#!/usr/bin/env python3
"""Validate content structure, scholarly references and cross-record integrity (stdlib only)."""
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
KINDS = {'place': 'places', 'detail': 'details', 'lesson': 'lessons', 'route': 'routes',
         'person': 'people', 'period': 'periods', 'theme': 'themes', 'inscription': 'inscriptions', 'chapter': 'chapters'}
STATUS = {'source_checked', 'needs_source_check', 'needs_epigraphic_review', 'needs_field_check', 'ready'}
CERTAINTY = {'established', 'interpretation', 'disputed', 'unknown'}
PREDICATES = {'contains', 'west_of', 'north_of', 'replaced_by', 'blocks_reused_in', 'ritually_related'}
errors = []
def check(test, message):
    if not test:
        errors.append(message)
def load(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (ValueError, OSError) as exc:
        errors.append(f'{path.relative_to(ROOT)}: {exc}')
        return {}

def validate():
    index = load(ROOT / 'content/index.json')
    sources = load(ROOT / 'content/sources.json').get('sources', [])
    source_ids = {s['id'] for s in sources}
    check(len(source_ids) == len(sources), 'Duplicate source IDs')
    records = {}
    by_kind = {}
    for kind, folder in KINDS.items():
        items = {}
        for path in sorted((ROOT / 'content' / folder).glob('*.json')):
            d = load(path)
            ident = d.get('id', '')
            check(ident == path.stem and bool(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', ident)), f'{path}: invalid ID')
            check(ident not in records, f'Duplicate record ID: {ident}')
            check(d.get('type') == kind, f'{ident}: incorrect type')
            check(bool(d.get('title')), f'{ident}: missing title')
            check(d.get('status') in STATUS, f'{ident}: invalid status')
            check(bool(d.get('sources')), f'{ident}: missing sources')
            records[ident] = d
            items[ident] = d
        by_kind[kind] = items
        declared = index.get(kind + 'Ids', [])
        check(len(declared) == len(set(declared)), f'Duplicate {kind} manifest entries')
        check(set(declared) == set(items), f'Manifest mismatch: {kind}')

    def refs(values, kind, owner):
        for ident in values:
            check(ident in by_kind[kind], f'{owner}: unknown {kind} {ident}')
    def citations(values, owner):
        check(bool(values), f'{owner}: missing citations')
        for c in values:
            check(c.get('sourceId') in source_ids, f'{owner}: unknown citation source {c.get("sourceId")}')
            check(bool(c.get('locator')), f'{owner}: missing source locator')
    for ident, d in records.items():
        for s in d.get('sources', []):
            check(s in source_ids, f'{ident}: unknown source {s}')
        for kind in KINDS:
            if kind + 'Id' in d:
                refs([d[kind + 'Id']], kind, ident)
            refs(d.get(kind + 'Ids', []), kind, ident)
        refs(d.get('linkedPlaces', []), 'place', ident)
        refs(d.get('optionalPlaceIds', []), 'place', ident)
        refs(d.get('details', []), 'detail', ident)
        for detail_id in d.get('details', []):
            check(by_kind['detail'].get(detail_id, {}).get('placeId') == ident, f'{ident}: incorrect detail parent {detail_id}')
        for status in d.get('additionalChecks', []):
            check(status in STATUS, f'{ident}: invalid additional check')
        claim_ids = set()
        for section in d.get('sections', []):
            check(bool(section.get('heading')) and bool(section.get('paragraphs')), f'{ident}: incomplete section')
            citations(section.get('citations', []), ident)
        refs(d.get('relatedDetailIds', []), 'detail', ident)
        for c in d.get('claims', []):
            check(bool(c.get('text')), f'{ident}: empty claim')
            check(c.get('id') not in claim_ids, f'{ident}: duplicate claim ID')
            claim_ids.add(c.get('id'))
            check(c.get('certainty') in CERTAINTY, f'{ident}: invalid certainty')
            citations(c.get('citations', []), ident)
            for ref in c.get('citations', []):
                check(ref.get('sourceId') in d.get('sources', []), f'{ident}: claim source absent from record source list')
        if d['type'] == 'detail':
            parent = by_kind['place'].get(d.get('placeId'), {})
            check(ident in parent.get('details', []), f'{ident}: absent from parent details')
        if d['type'] == 'inscription' and d.get('translationStatus') == 'withheld_pending_edition_check':
            check(d.get('translation') is None and d.get('transliteration') is None, f'{ident}: unreviewed text must be withheld')
    graph = load(ROOT / 'content/relationships.json').get('relationships', [])
    check(len({e.get('id') for e in graph}) == len(graph), 'Duplicate relationship IDs')
    for edge in graph:
        refs([edge.get('from'), edge.get('to')], 'place', edge.get('id'))
        check(edge.get('predicate') in PREDICATES, f'Unknown relationship predicate: {edge}')
        check(edge.get('certainty') in CERTAINTY, f'Unknown relationship certainty: {edge}')
        citations(edge.get('citations', []), edge.get('id'))
    media_file = ROOT / 'content/media.json'
    if media_file.exists():
        media = load(media_file).get('media', [])
        check(len({m.get('id') for m in media}) == len(media), 'Duplicate media IDs')
        for m in media:
            path = ROOT / m['path']
            check(path.is_file(), f'Missing media file: {path}')
            if path.is_file():
                check(hashlib.sha256(path.read_bytes()).hexdigest() == m['sha256'], f'Media checksum mismatch: {path}')
            for field in ['creator', 'sourcePage', 'license', 'licenseUrl', 'attribution', 'retrieved']:
                check(bool(m.get(field)), f'{m["id"]}: missing {field}')
            refs(m.get('placeIds', []), 'place', m['id'])
    guides = sorted((ROOT / 'content/guides').glob('*.json'))
    media_ids = {m.get('id') for m in load(media_file).get('media', [])} if media_file.exists() else set()
    zones = {'interior', 'north-exterior', 'south-exterior'}
    facings = {'north', 'south', 'east', 'west'}
    diagrams = {'context', 'section', 'roof', 'relief', 'names', 'ritual', 'grammar', 'purification', 'bark', 'recut', 'registers', 'geography', 'campaigns', 'palimpsest'}
    stop_count = 0
    glossary = load(ROOT / 'content/glossary.json') if (ROOT / 'content/glossary.json').exists() else {'terms': []}
    term_ids = {t.get('id') for t in glossary.get('terms', [])}
    check(len(term_ids) == len(glossary.get('terms', [])), 'Duplicate glossary IDs')
    for t in glossary.get('terms', []):
        check(bool(t.get('term')) and bool(t.get('definition')), f"glossary/{t.get('id')}: incomplete term")
        citations(t.get('citations', []), 'glossary/' + str(t.get('id')))
    def term_refs(text, owner):
        for ref in re.findall(r'\[\[([a-z0-9-]+)', text or ''):
            check(ref in term_ids, f'{owner}: unknown glossary term {ref}')
    for path in guides:
        g = load(path)
        gid = g.get('id', '')
        check(gid == path.stem and g.get('type') == 'guide', f'{path}: invalid guide ID or type')
        check(g.get('status') in STATUS, f'{gid}: invalid status')
        citations(g.get('planCitations', []), gid + ' plan')
        stops = g.get('stops', [])
        check(bool(stops), f'{gid}: no stops')
        check(len({s.get('id') for s in stops}) == len(stops), f'{gid}: duplicate stop IDs')
        check([s.get('number') for s in stops] == list(range(1, len(stops) + 1)), f'{gid}: stops must be numbered 1..n in order')
        for s in stops:
            owner = f"{gid}/{s.get('id')}"
            v2 = s.get('format') == 2
            for field in ['title', 'location', 'stand', 'look', 'story' if v2 else 'blocks', 'transition']:
                check(bool(s.get(field)), f'{owner}: missing {field}')
            if v2:
                parts = list(s.get('story', [])) + [x for x in (s.get('lookCloser'), s.get('readIt')) if x] + list(s.get('more', []))
                for x in parts:
                    check(bool(x.get('text')), f'{owner}: empty text section')
                    citations(x.get('citations', []), owner)
                    term_refs(x.get('text'), owner)
                    if x.get('mediaId'):
                        check(x['mediaId'] in media_ids, f'{owner}: unknown media {x["mediaId"]}')
                for t in [s.get('stand'), s.get('transition')] + list(s.get('look', [])):
                    term_refs(t, owner)
            check(s.get('zone') in zones, f'{owner}: unknown zone')
            check(s.get('facing') in facings, f'{owner}: unknown facing')
            check(s.get('diagram') in diagrams or (v2 and s.get('diagram') is None), f'{owner}: unknown diagram {s.get("diagram")}')
            pos = s.get('position', {})
            check(0 <= pos.get('x', -1) <= 720 and 0 <= pos.get('y', -1) <= 820, f'{owner}: position outside plan')
            citations(s.get('citations', []), owner)
            for b in ([] if v2 else s.get('blocks', [])):
                check(bool(b.get('heading')) and bool(b.get('text')), f'{owner}: incomplete block')
                check(b.get('certainty') in CERTAINTY, f'{owner}: invalid certainty')
                citations(b.get('citations', []), owner)
            for f in s.get('figures', []):
                check(f.get('mediaId') in media_ids, f'{owner}: unknown media {f.get("mediaId")}')
                check(bool(f.get('caption')), f'{owner}: figure without caption')
                for a in f.get('annotations', []):
                    check(0 <= a.get('x', -1) <= 100 and 0 <= a.get('y', -1) <= 100 and bool(a.get('label')), f'{owner}: invalid annotation')
            stop_count += 1
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f'Validated {len(records)} records, {len(guides)} guide ({stop_count} stops), {len(sources)} sources and {len(graph)} relationships; references and media checksums passed.')
    return 0

if __name__ == '__main__':
    sys.exit(validate())
