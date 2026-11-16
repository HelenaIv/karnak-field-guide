# Resume here after a lost chat

Last updated: 2026-11-15. Repository: HelenaIv/karnak-field-guide, branch main.

## Read first

1. `docs/PROJECT_REQUIREMENTS.md` — owner-confirmed decisions and questions that remain unanswered.
2. `docs/DETAIL_ENTRY_STANDARD.md` — detailed learning, not a generic highlights guide.
3. `docs/TECHNOLOGY_ARCHITECTURE.md` — confirmed WordPress/JetEngine backend and proposed offline/store architecture.
   Installable offline app (PWA for iPhone/Android/desktop) lives in the separate repo `../karnak-app`; it builds from this repo's `dist/`.
   WordPress implementation lives in the separate repo `../karnak-wp` (plan: `karnak-wp/docs/PLATFORM_PLAN.md`). Keep WP work out of this repo.
4. `docs/RESEARCH_ARCHITECTURE.md`, `docs/EDITORIAL_STANDARDS.md`, `research/2026-11-13-source-review.md`.
5. `content/index.json` and `docs/logs/2026-11-13.md`.

## Current state (2026-11-15)

Research and editorial review website in English and Ukrainian, built from `content/` by `python scripts/build_review_site.py` into `dist/`. GitHub Pages publishes the review site for phone preview. WordPress/JetEngine remains the confirmed backend; not built yet.

Full place guides (with `guide` block in `content/places/*.json`): First Pylon, Great Court, Second Pylon, Third Pylon, temple core (one article covering the Fourth Pylon to the Middle Kingdom court), Hatshepsut’s obelisks, Akhmenu, contra-temple and eastern temple, Aten temples, southern pylons (Seventh–Tenth), Temple of Khonsu (with Opet and Bab el-Amara), Temple of Ptah, Sacred Lake, Open Air Museum, Osiris chapels and catacombs, Precinct of Mut; the Great Hypostyle Hall has its own 14-stop guide (`content/guides/`). Big-picture pages: growth plan, timeline and kings, rituals and festivals, gods, construction, Thebes, life, afterlife. Read the walls section. Explore-places interactive map. Gallery includes the owner's own photos (`own-*`).

Latest work and decisions are in `docs/logs/` (newest file last). `git log` is the authoritative list of finished work.

## Owner rules (always follow)

- Ask the owner first instead of guessing; never present a guess as fact.
- Every fact is cited in the record (`claims`/`citations`, sources in `content/sources.json`). Original drawings only, no copied plans.
- Every English change gets its Ukrainian string in the same commit.
- Owner's photos: credit "Photo: Helena Ivanova"; originals in `E:\Karnak\images\own`, web copies `assets/photos/own-*`. Captions name a place only when it is confirmed; otherwise describe what is visible. Say what was edited.
- All downloaded or generated images go to `E:\Karnak\images`, never Downloads.
- Numbered images: tappable numbers and label-only numbers use clearly different styles (label-only = squares). Every number on a photo has a matching list item.
- Place sections use photos where possible. Controls must be synced and usable on a phone without sideways scrolling.
- Commit locally. The owner pushes from GitHub Desktop unless she asks the agent to push.

## Exact next work

1. Owner wants detail photos (walls, reliefs) for every finished article, like the Opet section: add 4–7 openly licensed photos per article via `mediaIds` (method in `docs/logs/2026-11-16.md`). Sacred Lake, Open Air Museum, Osiris chapels and Mut precinct guides done 2026-11-16 (still need extra detail photos). Only the Chapel of Hakoris (by the quay, west of the First Pylon) still lacks a guide; then detail photos per article. Ask the owner whether `own-pylon-seated-colossi-2023` is the Eighth Pylon. Small monuments inside a bigger place become sections of its article (`SM_IN` in `web/sitemap.js`, record reduced to a stub with `coveredIn`).
2. Optional: confirm places for own photos `own-court-with-painted-columns`, `own-painted-architrave-pillars`, `own-relief-king-and-isis`; add `placeIds` only when confirmed. `video-ruins-pan` not used (place unknown).
3. Second Pylon has no own photo; swap in one if the owner supplies it.
4. Platform: Hybrid site chosen; WordPress is the editable database only, existing build and interactive illustrations stay. Work continues in `../karnak-wp`. App/PWA work (phase 4) can start on git content without WordPress.
5. Older open items: see `docs/RESEARCH_BACKLOG.md` and `docs/HALL_WORKPLAN.md`.

## Validation and preservation

Run `python scripts/validate_content.py`, `python scripts/build_review_site.py`, `node --check web/app.js`, `node scripts/check_review_site.cjs` and `git diff --check`. The build needs Pillow, already available in this environment. The validator checks record inventory, IDs, status/certainty labels, references, claim citations, reciprocal detail ownership, research text withholding and media file hashes. It does not prove historical truth or visitor access.

Commit coherent completed stages, push main (or the active agreed branch), and compare local HEAD to the remote ref. Write logs before pushing, including limitations. Git is the durable project record; chat is not. Keep raw confidential material and credentials out of logs. GitHub cannot preserve conversation turns or work that was never recorded and pushed.

## Private review website

Published: https://karnak-field-guide-review.inventivefluke33.chatgpt.site

Site appgprj_6af75e7bc41481919c50a44465c967a3; deployment appgdep_6af7633c70388191bbca9a6f43671a42 reported succeeded. Published source commit 4627d12945704b623cebff2530b374b3016f4e1c in the Sites source repository is a snapshot of owner GitHub commit 4e22fcb701dbe8ea7db9e979af9e73a7025ec072. Subsequent owner-repository commits may update logs without changing the live website. Never substitute GitHub and Sites commit IDs when publishing.

`research/coverage.json` reports per-place chapters/details/media gaps. At this checkpoint, 26 of 35 place records lack a matched acquired image; the illustrated chapters are concentrated in selected areas. This is a review draft, not an illustrated-complete guide.

## Ukrainian version

- The review site has an EN / УКР switch in the header. The choice is remembered in the browser; `?lang=uk` opens the Ukrainian version directly.
- English content records stay the identity. Ukrainian text lives in `content/i18n/uk/<same path as the English file>` as a flat map of `path -> text` (paths use item ids, e.g. `stops[entrance]/look[0]`). Anything without a translation falls back to English.
- Interface strings rendered by `web/*.js` are translated by `content/i18n/uk/ui.json` (exact phrases plus patterns with Ukrainian plural forms), applied by `web/i18n.js`. Short translated content strings are reused automatically as interface phrases at build time.
- Kept in their original form: source titles, authors, image file names, credits and licences, transliterations, hieroglyphs and Gardiner codes.
- `python scripts/i18n.py status` shows coverage; `python scripts/i18n.py todo <file>` lists untranslated strings; `python scripts/i18n_merge.py <file>` merges a JSON map of new translations. `validate_content.py` runs `i18n.py check`, which fails if an English path a translation points to has gone or glossary links differ.
- When English text changes, update the matching Ukrainian string in the same commit.
