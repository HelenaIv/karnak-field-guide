# Research and content architecture

## Scope and release gates

The location is the entry point; chronological, royal, religious and inscription indexes provide alternative paths. Start with the Amun precinct; keep Mut precinct, Montu precinct, eastern Aten temples, Luxor Temple and the west bank as explicit later coverage or external relationships. Ancient ritual routes and proposed modern walks are distinct datasets.

All entries remain research drafts until source review, copy review, epigraphic review where needed, and field/access review pass independently. A source check establishes that a statement is supported by a cited source, not that competing scholarship has been exhausted.

## Data contract (additive version 2)

Existing place/detail/lesson/route records remain valid. `content/index.json` is the inventory; paths are derived from the declared record kind and stable ID. No display-name joins.

| Record | Purpose | Required scholarly information |
|---|---|---|
| place | Monument, precinct or architectural unit | orientation, phases, observations, interpretation, caveats, details, source IDs |
| detail | A specific physical feature | parentPlace, identifiable location, evidence and review state |
| inscription | Research dossier for a text/scene | placeId, surface, edition target, translation status; no invented text |
| person | Ruler or other historical actor | aliases, periodId, roles linked to place IDs and citations |
| period | Chronological grouping | approximate range, dating convention, associated person IDs |
| theme | Religious or architectural explanation | linked places, sourced claims, interpretive limits |
| route | Editorial sequence | ordered place IDs, purpose, access state, optional detours; no implied traversable edges |
| relationship | Directed archaeological relation | from/to place, controlled predicate, evidence locator, uncertainty |
| source | Bibliographic authority | author/project, title, URL, kind, access date, consultation scope |

New `claims` arrays hold `{id, text, certainty, citations:[{sourceId, locator}]}`. `certainty` is `established` (reported without qualification in consulted research), `interpretation` (inference), `disputed` (documented alternative), or `unknown` (unresolved). This is independent of editorial `status`. Locators use stable section names or published pages/plates; web line numbers are not archival identifiers. Existing grouped citations are retained but need gradual claim-level migration.

New records include `personIds` and `periodIds` where applicable. Period boundaries are approximate editorial labels; do not calculate a building date from a ruler's accession. Store proposed reign dates only with a named chronology. Separate construction, decoration, restoration, reuse, excavation and modern reconstruction in future phase expansion.

## Spatial model

Use descriptive orientation now; coordinates and polygons stay absent until a licensed, georeferenced archaeological plan is available. Future geometry needs CRS, source, uncertainty radius, survey date and rights. Modern display position and ancient original position must be separate (especially museum chapels and fallen obelisks).

Controlled predicates: `contains`, `west_of`, `north_of`, `replaced_by`, `blocks_reused_in`, `ritually_related`. An inverse relation can be derived; it is not an additional independent piece of evidence. None of these predicates grants pedestrian access. Each future walkable edge needs field-checked endpoints, barriers, steps, surface, width, date and authority.

## Research workflow

1. Identify the precise monument and distinguish present remains from model reconstruction.
2. Read an institutional monument account; capture claim/section and qualifiers.
3. Follow its bibliography to excavation reports or epigraphic editions. Record whether full text, catalogue metadata or only a secondary citation was consulted.
4. Seek independent corroboration for disputed attribution, dates and precise scene placement. Preserve alternative hypotheses with named publications; do not flatten disagreement into a confidence score.
5. Write original short synthesis, linking each factual claim to a source locator. No unlicensed illustrations or facsimiles.
6. Validate IDs, manifest, citations, graph and route references before committing a coherent batch. Push each completed stage; never rely on chat as the research archive.
7. Record unverified claims and source defects in research logs; publication requires human scholarly and field review.

## Prioritised coverage

- Western ensemble: First Pylon, Great Court, kiosk, Sety II shrine, Ramesses III temple, Bubastite Portal and Second Pylon.
- Main axis: Hypostyle Hall, Third/Fourth Pylons, Hatshepsut's Wadjet obelisks, central bark shrine and Akhmenu. Fifth/Sixth Pylons and Thutmose I obelisks require dedicated dossiers.
- Water and ancillary cult: Sacred Lake, Khonsu and Opet temples; extend to Ptah, Osiris chapels, southern pylons and associated processional ways.
- Museum: White and Red Chapels, explicitly reconstructed and relocated.
- Epigraphy: begin with source-led surface dossiers. Add scene numbers, plates and translations only after inspecting the edition, not from a catalogue table of contents.

## Visitor presentation

Each stop should answer: Where am I? What survives? Who changed it? What should I inspect? What did it mean? What is uncertain? What connects to this place? Show citations beside claims and a visible evidence label for interpretations. Provide optional depth rather than a single long historical essay. Avoid modern folklore presented as ancient practice and promises about access or opening hours.

## Reading chapters added

`content/chapters/` contains developed English narratives with placeId, heroMediaId (nullable where an honest image gap remains), topics, sections with paragraph text and source locators, relatedDetailIds and separate review status. They are distinct from concise place records. The review website consumes the same source data; no CMS-specific numeric identity is introduced.
