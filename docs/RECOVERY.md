# Resume here after a lost chat

Last updated: 2026-11-13. Repository: HelenaIv/karnak-field-guide, branch main.

## Read first

1. `docs/PROJECT_REQUIREMENTS.md` — owner-confirmed decisions and questions that remain unanswered.
2. `docs/DETAIL_ENTRY_STANDARD.md` — detailed learning, not a generic highlights guide.
3. `docs/TECHNOLOGY_ARCHITECTURE.md` — confirmed WordPress/JetEngine backend and proposed offline/store architecture.
4. `docs/RESEARCH_ARCHITECTURE.md`, `docs/EDITORIAL_STANDARDS.md`, `research/2026-11-13-source-review.md`.
5. `content/index.json` and `docs/logs/2026-11-13.md`.

## Current state

Research/content repository; **no app and no WordPress site yet**. English content only so far; Ukrainian is planned. Backend choice confirmed; frontend framework and native packaging not selected. Three acquired commercial-reuse-eligible photographs with provenance are preserved separately from scholarly source rights.

Corpus: 18 places, 6 details, 2 lessons, 2 research routes, 16 people, 5 period groups, 1 theme and 1 inscription research dossier. 29 bibliography sources and 11 typed relationships. These are source-supported research drafts, not a complete guide or fully checked epigraphic corpus. Source anomalies and unconsulted bibliographic leads are logged. No exact transcription is represented as checked when it isn't.

## Exact next work

1. Inspect OIP 142's plate/commentary for the deified Sety I scene; resolve the plate-48 lead and annotate the life sign only after confirmation.
2. Select and verify one photographed raised/sunk comparison, one cartouche pair and one bark detail. Add exact surface/scene references and short English teaching entries.
3. Acquire rights-cleared detail photographs matching those examples. Current photos give architectural context, not verified close-up text samples.
4. Continue monument-specific primary-source checks: museum chapels, obelisks, sanctuary, southern axis, Ptah/Mut/Montu and later phases; see backlog.
5. Prepare schematic animation storyboards, preserving evidence versus illustration. No audio.
6. Ask owner about audience/reading level, commercial model and design before dependent implementation decisions. Do not ask again about confirmed languages/backend/audio.
7. When backend implementation is requested, get the WordPress URL/configuration from the owner; map verified fields and export a complete versioned pack. No CMS credentials in git.

## Validation and preservation

Run `python scripts/validate_content.py` and `git diff --check`. The validator checks record inventory, IDs, status/certainty labels, references, claim citations, reciprocal detail ownership, research text withholding and media file hashes. It does not prove historical truth or visitor access.

Commit coherent completed stages, push main (or the active agreed branch), and compare local HEAD to the remote ref. Write logs before pushing, including limitations. Git is the durable project record; chat is not. Keep raw confidential material and credentials out of logs. GitHub cannot preserve conversation turns or work that was never recorded and pushed.
