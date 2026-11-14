# Great Hypostyle Hall: finalisation work plan

Started 2026-11-13. This file is the hand-over point for any device, agent or session. Read it together with `docs/PROJECT_REQUIREMENTS.md` and the latest file in `docs/logs/`.

## Owner decisions (2026-11-13)

- **Goal.** A site and an app that work as a handy guide to Karnak, like a tour with the best Egyptologist guide: interesting and accurate, but not heavy or academic. Visitors learn to read walls and shapes, and find out what they are looking at, why it was depicted, who the kings were, why they built it and why these gods.
- **Order of work.** Finish the Great Hypostyle Hall first. When its structure is polished, move on to other halls and temples using the same structure.
- **Voice.** Plain language, normal human tone. No cheesy “AI-style” hooks, no promotional headings, no dramatic teasers. Write the way a knowledgeable guide talks to an interested adult.
- **Length.** About 2–3 minutes of reading per stop on a phone, with optional “more” sections that expand.
- **Stops.** 14 is a small number for this hall, not a ceiling. Add stops where the Hall has more to show. Cut a stop only if it doesn't make sense.
- **Images.** Research and use images, preferably ones licensed for commercial apps. A missing matching photo is not a reason to drop a stop: look for a photo, a historical drawing, a plate or other illustration. The owner may add her own photos, but only where nothing usable exists online.
- **Supporting content.** A glossary, timelines and temple plans, plus explanations of the kings and gods.
- **Illustrations (2026-11-14).** The owner wants much more illustration everywhere: photos, plus drawings like the Memphis column diagrams. Original redrawn or generated explanatory diagrams are welcome; copyrighted drawings are not copied.
- **Preservation.** Keep logs and details in GitHub so the work can be resumed from another device, agent or incognito session.
- **Local only (2026-11-14).** The owner is keeping the project in the local repository for now. Commit locally; do not push.

## Writing rules for each stop

Each stop uses the same shape:

1. **Title.** Says what you will see. Not a teaser.
2. **Where to stand.** One or two sentences.
3. **What to look at.** Three or four concrete steps.
4. **What it is and why it is here.** Two or three short paragraphs: who made it, what it shows, why this king and this god.
5. **Look closer (optional).** One small detail most visitors miss.
6. **Read it yourself (optional).** One sign or name a visitor can learn on the spot.
7. **More (collapsed).** Background for readers who want it.
8. **Sources (collapsed).** Claim-level citations, kept out of the main text.

Caution goes in one plain sentence, and only where it changes what the reader should believe. Glossary terms are linked rather than explained again in every stop.

## Image rules

- Acceptable for the commercial app: public domain, CC0, CC BY and CC BY-SA (the last two with attribution, and share-alike for BY-SA adaptations). Record each file in `content/media.json` and `research/media-provenance/`, following `docs/MEDIA_POLICY.md`.
- Not for the app: NC and ND licences, “all rights reserved”, or academic images whose reuse terms are unknown. These can be cited as references only.
- Good public-domain sources for drawings: 19th-century epigraphic publications (e.g. Lepsius, *Denkmäler*; Champollion; *Description de l'Égypte*), checked plate by plate before a drawing is said to show a particular scene.
- A photo or drawing is only called “this scene” when it has been matched to the published scene reference. Otherwise the caption says it is a comparable example.

## Phases

1. **Sample for approval.** Fact-check and rewrite stop 1 and stop 6 (the four-jar purification, B92) in the new voice, with images and a sample glossary. The owner approves the voice and depth.
2. **Full Hall.** Rewrite and check the remaining stops; add stops where the Hall warrants them; kings, gods, glossary and timeline records; improved Hall plan and whole-temple locator.
3. **Final check.** A separate review pass of facts against sources; a check log; rebuild, commit and push.

## Working constraints found 2026-11-13

- The agent shells in this setup cannot reach github.com or Wikimedia. Work is committed to the local repository only (owner decision, 2026-11-14).
- Line endings: `.gitattributes` sets `* text=auto`, so Windows CRLF working copies no longer show as modified.
- Images are downloaded through the browser on the owner's computer and then moved into `assets/photos/` with checksums.

## Status

See the latest `docs/logs/` entry. The phase-1 sample is in progress.

## Site sections (as of 2026-11-14)

- Hall guide (`#hall`), Read the walls (`#read`), The big picture (`#basics`, includes the temple-as-cosmos page `#universe`), Explore places, Image collection, Glossary, Misc.
- The big picture is the context layer for the whole temple, not just the Hall: timeline and kings, interactive growth plan, gods, construction, Thebes, daily and festival life, after the pharaohs. New halls and temples should link into it (plan element ids in web/basics.js `BS_GEO`).
