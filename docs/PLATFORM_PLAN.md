# Platform plan: WordPress/JetEngine backend, live app and public site

Status: plan, 2026-11-16. Builds on `TECHNOLOGY_ARCHITECTURE.md` (offline pack contract, store notes), which still applies. Nothing here is built yet. Items marked **Owner decision** must be answered before the dependent phase starts; the rest are technical recommendations.

## 1. Starting point

- Content lives in git as JSON: 39 places, 14 details, 7 chapters, 1 hall guide, 3 lessons, 16 people, 5 periods, 2 routes, 1 theme, 1 inscription, reading pages, glossary, 147 media records, sources. Ukrainian is a separate `path -> text` map per file.
- `scripts/validate_content.py` is the quality gate (IDs, references, claim citations, media hashes, i18n paths).
- `scripts/build_review_site.py` already compiles everything into one bundle (`dist/data.json`, `data.js`, `data-uk.js`) consumed by vanilla JS in `web/`. That bundle is, in practice, the first version of the offline content pack.
- The review site is a single-page app: good for the app, weak for search engines (one HTML file, no per-place URLs that crawlers see).
- Content is still being written. The plan must not slow that down.

## 2. Shape of the system

```
 Editors ──► WordPress + JetEngine (admin only: records, media, relations, translations)
                     │  REST (read, authenticated export user)
                     ▼
            scripts/wp_export.py  ──►  content/*.json  (git)  ──► validate_content.py
                                                                 │
                                       build ────────────────────┤
                                                                 ▼
                                    release pack: manifest + data + images (static hosting/CDN)
                                         │                                   │
                                         ▼                                   ▼
                               App (PWA → Capacitor Android/iOS)     Public website
```

Principles:

1. **Git JSON stays the release contract.** WordPress is the editing tool; every release goes WP → export → git → validate → build. The validator and the build stay as they are, so no quality check is lost.
2. **Readers never hit WordPress live.** The app and site read a built, versioned pack from static hosting. WordPress can be slow, offline or mid-edit without breaking the guide.
3. **One editor of record at a time.** Until the switch (phase 3), git is the editor of record and WordPress is a mirror rebuilt by the importer. After the switch, WordPress is the editor of record and git receives exports. Never edit the same field in both.
4. **Stable `guide_id`s**, never WordPress numeric post IDs, in exported data.
5. **No credentials in git or the app.** The export uses a WordPress application password from an environment variable / GitHub secret.

## 3. JetEngine data model

### Post types (prefix `kfg_`)

| CPT | From | Notes |
|---|---|---|
| `kfg_place` | `content/places` | incl. the `guide` block (glance, sections, questions) |
| `kfg_detail` | `content/details` | parent place is a relation |
| `kfg_chapter` | `content/chapters` | |
| `kfg_guide` | `content/guides` | Great Hypostyle Hall stops |
| `kfg_lesson`, `kfg_route`, `kfg_theme`, `kfg_inscription` | same folders | route stop order kept as an ordered field, not a relation |
| `kfg_person`, `kfg_period` | `content/people`, `periods` | |
| `kfg_source` | `content/sources.json` | one post per source |
| `kfg_term` | `content/glossary.json` | |
| Media | `content/media.json` | WordPress attachments plus meta: guide_id, creator, licence, licence URL, source page, commercial-reuse note, attribution, sha256, placeIds |

Reading pages (`content/reading`) and `features` contain interactive data for custom JS; keep them in git at first, move later only if editors need them.

### Shared meta box on every CPT

`guide_id` (required, unique), `status` and `additional_checks` (JetEngine glossaries mirroring the validator's allowed values), `modified_at`.

### Claims, citations and nested blocks

JetEngine repeaters are flat (one level), but the records nest: claims → citations, guide sections → paragraphs + citations. Recommended handling:

- Claims: repeater `claims` with `claim_id`, `text`, `certainty` (glossary select) and `citations` as a text field, one `sourceId | locator` per line.
- Guide sections: repeater with `section_id`, `heading`, `paragraphs` (one per line or WYSIWYG, see sanitising below) and `citations` in the same line format.
- The exporter parses the line format, and `validate_content.py` rejects unknown source IDs exactly as now.

Alternative if editors find the line format painful: claims as a Custom Content Type (CCT) related to the record. That is more clicks per claim and harder to export in order; try the repeater first.

### Relations (JetEngine Relations module)

place ↔ detail (one-to-many), place ↔ person, place ↔ period, record ↔ media, content ↔ `content/relationships.json` predicates. Relations that need a predicate, phase or evidence use relation meta; where JetEngine relation meta is not exposed in REST on the installed version, keep them as typed repeater fields instead. Verify on the real install before relying on either.

### Ukrainian

**Owner decision:** how translations are edited.

- A. A multilingual plugin (WPML or Polylang) with a linked `uk` post per record. Familiar editing UI, but the plugin determines REST shape and must be tested with JetEngine meta and repeaters.
- B. No plugin: `uk` meta fields beside English (`title_uk`, `summary_uk`, a `uk` column in repeaters). Simplest export, mirrors the current `path -> text` maps, but the edit screen gets long.

Recommendation: B for the backend, since the site and app render language from the pack, not from WordPress. Choose A if the public website is rendered by WordPress (see section 5).

## 4. Sync scripts

- `scripts/wp_import.py` (git → WP): idempotent upsert by `guide_id`; uploads media once by sha256; creates relations. Used while git is the editor of record and to fill a fresh staging site.
- `scripts/wp_export.py` (WP → git): reads every REST page of every collection (WordPress paginates), checks counts, writes `content/` in the current format, sanitises rich text to the allowed tags, then runs the validator.
- Acceptance test: import into an empty site, export, and `git diff content/` is empty. Phase 3 does not start until this round trip is clean.

## 5. Public website

**Owner decision:** who renders it.

| | A. Headless: the app is the site | B. WordPress renders the site | C. Hybrid |
|---|---|---|---|
| What | Deploy the built app to the domain, with prerendered HTML per place/chapter for SEO and sharing | JetEngine listings + theme templates (CrocoBuilder) render each record; interactive parts embedded | WordPress for home, about, articles and SEO landing pages; "Open the guide" goes to the app |
| Frontends to maintain | one | two (WP templates + app) | one main + light WP pages |
| Interactive map, hall guide, reading tools | as today | port to blocks/shortcodes or embed the app's JS | in the app |
| SEO | needs a prerender step in the build | native | native for landing pages |
| Fits paid content | easy to limit what is public | harder: full articles are public | easy |

Recommendation: **C**. Interactive close reading is the product and should exist once; WordPress does what it is good at (pages, SEO, blog, later shop/account if the business model needs it). If you want the full articles public and indexed, add a prerender step to A for those pages rather than rebuilding them in templates.

Related owner decisions: domain, hosting, and whether full articles are free on the web (affects the paid-download model, still unanswered in `PROJECT_REQUIREMENTS.md`).

## 6. App

Reuse the existing `web/` code rather than starting a new framework: it already renders every content type from one bundle.

1. **PWA**: web app manifest, service worker for the app shell, pack download to Cache Storage + IndexedDB, persistent-storage request, pack health screen, update with staging and atomic switch (contract in `TECHNOLOGY_ARCHITECTURE.md`).
2. **Pack builder**: extend `build_review_site.py` to emit `manifest.json` (releaseId, schemaVersion, per-asset bytes and sha256, counts) and immutable release folders, plus a small `current.json` pointer.
3. **Capacitor wrapper** for Android and iOS; native file storage adapter; real-device testing.
4. TypeScript and a framework only if the code starts to hurt; not needed to ship.

Bookmarks and reading progress stay on the device, separate from packs (no accounts in v1).

## 7. Hosting and release pipeline

- WordPress: managed host with staging; nightly backups of database and uploads; JetEngine licence. Admin behind strong passwords and 2FA; REST write access only for the import user.
- Packs and app: static hosting with a CDN (GitHub Pages works for the review stage; Cloudflare Pages/R2 or similar for production image volume).
- GitHub Actions: on a manual "release" run, export from WP (after phase 3), validate, build pack, publish, keep the previous release.

## 8. Phases

| Phase | Work | Needs |
|---|---|---|
| 0 | Answer the owner decisions above | owner |
| 1 | Staging WordPress + JetEngine; create CPTs, meta boxes, glossaries, relations (JetEngine MCP can do this once it connects) | host, licence |
| 2 | `wp_import.py` + `wp_export.py`, clean round trip; content work continues in git meanwhile | phase 1 |
| 3 | Switch editor of record to WordPress; editors' guide for the repeater formats | clean round trip, owner OK |
| 4 | PWA + release packs + offline tests (airplane mode, interrupted update, low space) | can start in parallel with 1–2 |
| 5 | Public website per section 5 | decision 5 |
| 6 | Capacitor builds, device tests, store listings, business model | business-model decision |

Phase 4 does not depend on WordPress, so app work can start now on the current git content.

## 9. Owner decisions (summary)

1. Website rendering: A, B or C.
2. Ukrainian editing: multilingual plugin or `uk` fields.
3. When to switch the editor of record to WordPress (recommended: after the round trip is clean and the remaining place guides are written).
4. Hosting/domain, and whether a WordPress site already exists (a `jetengine` MCP server is configured on this machine but failed its TLS handshake on 2026-11-16).
5. Free vs paid content on the web and in the stores (already open).
