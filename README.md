# Karnak Field Guide

A scholarly, site-specific digital field guide to the Karnak temple complex at Luxor, Egypt. The project prioritizes the monuments visitors encounter, with architectural history, identifiable reliefs and inscriptions, royal cartouches, elementary hieroglyph reading, and features easy to miss.

## Project stage

**Research and content foundation (in progress).** This repository does **not** yet contain an application. Content is original editorial synthesis based on the sources credited in `content/sources.json`; it is not a peer-reviewed epigraphic edition.

## Confirmed direction

WordPress + JetEngine backend, with a separate app; English first and Ukrainian planned. Text, images and selected animations, without audio. Downloadable content for offline use, with future Google Play and Apple App Store distribution in mind. No WordPress site or frontend implementation exists yet. Framework and packaging choices remain proposals.

**Resume after a lost chat:** read [docs/RECOVERY.md](docs/RECOVERY.md). Confirmed requirements are in [docs/PROJECT_REQUIREMENTS.md](docs/PROJECT_REQUIREMENTS.md); implementation proposal in [docs/TECHNOLOGY_ARCHITECTURE.md](docs/TECHNOLOGY_ARCHITECTURE.md).

The core product is **close observation and explanation**, not a generic monument walk. See [docs/DETAIL_ENTRY_STANDARD.md](docs/DETAIL_ENTRY_STANDARD.md).

## Scope of v1

- Responsive mobile, tablet, and desktop web experience
- Offline-readable content after first download / installation
- Browsable, non-GPS site plan and location-based interpretive entries
- Detailed, source-referenced scenes, cartouches and learning modules
- Searchable place, theme and ruler indexes
- **Out of scope:** GPS positioning, audio tours, automated hieroglyph translation and unsourced sign facsimiles

## Repository structure

- `docs/CONTENT_STRUCTURE.md` — navigation, taxonomy, records and relationships
- `docs/EDITORIAL_STANDARDS.md` — source requirements, confidence and verification rules
- `docs/RESEARCH_BACKLOG.md` — research and implementation queue
- `content/index.json` — manifest for app consumption
- `content/sources.json` — bibliography and reference registry
- `content/places/` — structure-by-structure field guide entries
- `content/details/` — individual scenes, carvings and visual features
- `content/lessons/` — location-linked reading guides
- `content/routes/` — editorial suggested walks (not live directions)

Additional research data: `content/people/`, `content/periods/`, `content/themes/`, `content/inscriptions/` and `content/relationships.json`. Rights-cleared research photos and credits are in `assets/`; provenance in `content/media.json` and `research/media-provenance/`. Daily work logs are in `docs/logs/`.

## Validation

Run `python scripts/validate_content.py` and `git diff --check` before commits. No additional dependencies required. Validation checks data integrity, not historical accuracy.

## Reading this repository

Each place or detail has an explicit source list. Distinguish **what survives**, **the ancient evidence**, **scholarly interpretation**, and **open questions**. A citation supports the stated claim; it does not authorize image reuse. On-site access, line of sight, lighting and condition need in-person verification.

See `docs/EDITORIAL_STANDARDS.md` before adding inscriptions or translations.

## Core research partners and published sources

Digital Karnak (UCLA / UC Santa Cruz), the Karnak Great Hypostyle Hall Project (University of Memphis / UQAM), the CFEETK–CNRS Projet Karnak, and University of Chicago's *The Great Hypostyle Hall* (OIP 142). Detailed URLs and references are in `content/sources.json`.
