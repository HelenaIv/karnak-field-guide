# Resume here after a lost chat

Last updated: 2026-11-13. Repository: HelenaIv/karnak-field-guide, branch main.

## Read first

1. `docs/PROJECT_REQUIREMENTS.md` — owner-confirmed decisions and questions that remain unanswered.
2. `docs/DETAIL_ENTRY_STANDARD.md` — detailed learning, not a generic highlights guide.
3. `docs/TECHNOLOGY_ARCHITECTURE.md` — confirmed WordPress/JetEngine backend and proposed offline/store architecture.
4. `docs/RESEARCH_ARCHITECTURE.md`, `docs/EDITORIAL_STANDARDS.md`, `research/2026-11-13-source-review.md`.
5. `content/index.json` and `docs/logs/2026-11-13.md`.

## Current state

Research and editorial review website. **No WordPress site or native app yet.** A buildless responsive website is in `web/`, built from the content records by `python scripts/build_review_site.py`. WordPress/JetEngine remains the confirmed backend. English is being drafted; Ukrainian is planned. Current data: 35 place records, 14 details, 3 lessons, 7 reading chapters, 16 people, 5 periods, 1 theme and 1 inscription dossier; 53 sources, 11 relationships and 33 acquired images with provenance. These counts measure records, not finished publication-ready coverage.

The private review Site identity is in `.openai/hosting.json`. Publishing and verification details belong in `docs/logs/2026-11-13.md`. The local preview relay failed; do not claim browser/layout QA passed. Functional VM checks render 67 routes and validate local images/links; see the actual test output for final count.

## Exact next work

1. Part-2 commentary now confirms B92/plate 48 on p. 98. Obtain a securely matched photo/plate and rights-cleared image before transcribing or annotating the life sign.
2. Select and verify one photographed raised/sunk comparison, one cartouche pair and one bark detail. Add exact surface/scene references and short English teaching entries.
3. Acquire rights-cleared detail photographs matching those examples. Current photos include real carved details but are not sign-by-sign edition-matched samples.
4. Continue monument-specific primary-source checks: museum chapels, obelisks, sanctuary, southern axis, Ptah/Mut/Montu and later phases; see backlog.
5. Prepare schematic animation storyboards, preserving evidence versus illustration. No audio.
6. Ask owner about audience/reading level, commercial model and design before dependent implementation decisions. Do not ask again about confirmed languages/backend/audio.
7. When backend implementation is requested, get the WordPress URL/configuration from the owner; map verified fields and export a complete versioned pack. No CMS credentials in git.

## Validation and preservation

Run `python scripts/validate_content.py`, `python scripts/build_review_site.py`, `node --check web/app.js`, `node scripts/check_review_site.cjs` and `git diff --check`. The build needs Pillow, already available in this environment. The validator checks record inventory, IDs, status/certainty labels, references, claim citations, reciprocal detail ownership, research text withholding and media file hashes. It does not prove historical truth or visitor access.

Commit coherent completed stages, push main (or the active agreed branch), and compare local HEAD to the remote ref. Write logs before pushing, including limitations. Git is the durable project record; chat is not. Keep raw confidential material and credentials out of logs. GitHub cannot preserve conversation turns or work that was never recorded and pushed.
