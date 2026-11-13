# Content structure and navigation

## Visitor information architecture

1. **Start here** — how Karnak grew; site orientation; reading an Egyptian temple; practical caveats.
2. **Explore the site** — browse by physical area, monument, and architectural component.
3. **Look closely** — located scenes, relief techniques, cartouches, traces of alteration, overlooked details.
4. **Read the walls** — short guided lessons connected to places and verifiable text samples.
5. **Routes** — sequences of stops, without real-time location tracking.
6. **People, gods and eras** — browse pharaohs, deities, dynasties, building campaigns.
7. **References** — source credits, uncertainties, bibliography, correction history.

## Hierarchical site areas (initial)

- **Arrival / western entrance**: sphinx avenue, first pylon, great court, shrines and kiosk.
- **Monumental western interior**: second pylon, Great Hypostyle Hall, third pylon.
- **Central temple**: obelisks and courts, sanctuary, historic core.
- **Eastern temple**: Akhmenu / Festival Hall, associated chambers and reliefs.
- **Southern / ancillary areas**: Sacred Lake and neighbouring monuments; southern processional axis (later scope).
- **Optional museum extension**: Open Air Museum, subject to ticketing and access research.

These are editorial areas, **not** a precise archaeological GIS or claims about permitted visitor access.

## Records and relationships

- **place**: stable id, title, area, chronological phases, location description, visitor orientation, architecture, interpretation, observations, sources, review status, child-detail ids.
- **detail**: stable id, parent place, precise wall/column/side/register if established, scene/object type, description, cultural interpretation, what to inspect, epigraphic evidence, source references, uncertainties and review status.
- **lesson**: concept, prerequisites, location links, examples with verified signs/text, learning points, references.
- **route**: ordered place ids, accessibility caveats, estimated time only after validation.
- **source**: stable id, authors, title, year, publisher/project, url/doi, source type, permissions notes, date accessed.
- **media** (future): creator, attribution, licence, file path, depiction subject, exact position, source.

## IDs and cross-linking

Use lowercase ASCII slugs: `hypostyle-hall`, `hypostyle-central-columns`. Never use display names as keys. Reference source IDs from `content/sources.json`. Use IDs in `content/index.json` so the app can resolve records without filesystem inference.

## Minimal editorial statuses

- `source_checked`: claim checked against linked cited source; **not** expert peer review or onsite validation.
- `needs_source_check`: preliminary research.
- `needs_epigraphic_review`: text/sign/cartouche interpretation not yet ready for publication.
- `needs_field_check`: physical accessibility, exact viewpoint or preservation needs onsite confirmation.
- `ready`: only after editorial, source, epigraphic (where relevant) and field checks.

## App architecture recommendation (not yet implemented)

Store editorial data as versioned JSON/Markdown in git, validate with a schema before build, compile into a static offline content bundle, and make media optional/lazy-loaded for storage. The v1 app should support bookmarking and search locally without accounts. Avoid external services that break offline reading.
