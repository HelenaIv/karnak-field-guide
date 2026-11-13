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
        return json.loads(path.read_text())
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
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f'Validated {len(records)} records, {len(sources)} sources and {len(graph)} relationships; references and media checksums passed.')
    return 0

if __name__ == '__main__':
    sys.exit(validate())
