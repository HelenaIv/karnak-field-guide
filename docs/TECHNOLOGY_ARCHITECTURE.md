# WordPress / JetEngine and an offline app

Status: design proposal, 2026-11-13. WordPress + JetEngine, cross-device access, downloaded content and future stores are confirmed requirements. Everything below describes an implementation proposal, not software already built or a framework already selected.

## Proposed flow

WordPress/JetEngine editorial records → validated immutable content release → downloadable language/media pack → app's local content store → device UI.

Readers use the local release, not a live WordPress request for each page. Git currently holds the research source. Once CMS authoring starts, define one editor of record per release: export the reviewed CMS state back into git, preserving IDs and diffs. Do not independently edit the same published release in both systems. WordPress database/uploads and JetEngine configuration will need their own backups; this repository cannot back up a site that does not yet exist.

## Backend mapping

Prefer JetEngine Custom Post Types for editorial entries that need normal WordPress revision/editor workflows; confirm revision behaviour for meta fields in the actual setup. Map place, detail, lesson, route, person, period, theme, inscription and bibliographic source to explicit content types. Prefix internal post-type keys, preserving globally stable guide IDs in a separate required unique field. Numeric WordPress post IDs must never replace guide IDs in the exported pack.

Suggested shared fields: guide_id, locale, translation_group, title, editorial_status, additional_checks, modified_at. Typed content fields mirror the repository, including claims with citation source/locator and certainty. Repeatable data can use JetEngine repeaters if their REST output is verified; otherwise use a documented export adapter. Sources, ordered routes and relationships must retain order, predicate, phase and evidence rather than becoming untyped hyperlinks.

Use locale-neutral identity for the monument; translated text has separate `en`/`uk` records and review status. Preserve scholarly transliteration, ruler aliases and original source titles. Source changes mark translations stale. No silent machine-translated Ukrainian in a reviewed release. A missing translation should display a clear English fallback, while a complete Ukrainian pack requires translated navigation, captions and credits too. Multilingual plugin selection remains open.

JetEngine can expose CPTs and CCT endpoints, but their exact payloads and relation endpoints depend on configuration. Do not invent a working endpoint for the future site. Enable only intentionally public, reviewed fields. Keep draft research, write endpoints and credentials out of the reader app. A small export layer should normalize the CMS into the versioned content contract and run validation before publication.

The export must fetch every page of each collection and validate its final counts; WordPress REST collections are paginated. Sanitize allowed rich text and resolve all internal references. A release is published only when every required record and eligible media asset is present.

## Offline release contract

Proposed manifest fields: schemaVersion, releaseId, locale, createdAt, minimumAppVersion, record counts, assets[{path, bytes, sha256, mimeType, attributionId}], pack size, content hash and release notes. These are proposed export fields, not fields a currently deployed API supports. Keep immutable pack URLs and a small current-release pointer; a failed update must never corrupt the active guide.

Download sequence:

1. Show full text/image coverage, language and expected size before downloading.
2. Check free capacity, then download to a staging area with progress and cancellation.
3. Verify files, checksums, references and schema compatibility. A cryptographic hash detects corruption; publisher authentication needs trusted HTTPS and, if added, signed manifests.
4. Atomically activate the completed release. Retain the prior release until successful activation.
5. Reopen in airplane mode and verify content, search, images, credits, map and animations. A failed or interrupted update retains the working old release.

The mandatory pack should include all guide texts, citations, attribution, a local site plan, local fonts if needed and sufficiently legible images. Optional higher-resolution images may be separate, clearly labelled downloads. The app must not claim “all information downloaded” when any required scene image or explanation is remote-only. External scholarly websites will still require internet; our explanatory text and source metadata should not.

Candidate web storage: IndexedDB for records/search metadata and Cache Storage for local assets plus a service worker for the app shell. Browser quotas and eviction vary: request persistence where available, show pack health, and support redownload. Do not promise browser storage can never be removed. A native storage adapter should use durable app data/files for store builds; choose and test its SQLite/filesystem plugins after the framework is chosen. Bookmarks and reading progress live separately from content packs, so updating or removing a pack does not erase them.

## Frontend and stores

Recommended evaluation: TypeScript responsive PWA with a Capacitor wrapper for Android and iOS. Capacitor supports web/iOS/Android; the frontend framework remains undecided. Bundle the executable app shell and use downloads for data/media. This is an app experience with local search, detail exploration, bookmarks, routes and accessible interactions, not a remote WordPress page opened in a shell.

Apple's 4.2 minimum-functionality guidance must inform the actual design; packaging alone does not guarantee acceptance. Verify current Google Play and Apple requirements, supported targets, privacy disclosures, signing and test-device behaviour before submission. Paid content, purchases and offline entitlements need a separate decision once the owner chooses the business model. Do not select a payment approach from assumptions.

Original explanatory animations should work offline and respect reduced-motion settings. Proposed first stories: a labelled raised/sunk cross-section; the column-to-roof load path; a scene overlay distinguishing royal name, act label and divine speech. Label schematics as explanations, not archaeological reconstructions. Do not animate a claimed historical construction sequence without evidence.

## First implementation acceptance checks

- A complete English pack can be downloaded, app closed/reopened, and all included features used in airplane mode.
- Interruption, corrupt file, insufficient space and incompatible schema retain the previous pack.
- Every detail, citation, source, image credit, route and internal link resolves locally.
- Small phone, tablet and desktop layouts; text scaling, keyboard/screen reader and reduced-motion checks.
- Export is complete across REST pagination; no drafts/private meta; no app-embedded CMS credentials.
- Ukrainian content has independent review/fallback and does not overwrite English identity.
- Native Android/iOS builds tested on real target devices before any store-readiness claim.

## Technical sources consulted 2026-11-13

- [Crocoblock: CPT overview](https://crocoblock.com/knowledge-base/features/custom-post-type-overview/) — CPTs and REST visibility.
- [Crocoblock: REST API overview](https://crocoblock.com/knowledge-base/features/rest-api-overview/) and [relation REST data](https://crocoblock.com/knowledge-base/jetengine/jetengine-getting-and-updating-relation-data-via-rest-api/) — CCT and relationship integration capabilities, not an existing project configuration.
- [WordPress REST pagination](https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/) — collection completeness.
- [Capacitor documentation](https://capacitorjs.com/docs) and [environment setup](https://capacitorjs.com/docs/getting-started/environment-setup) — cross-platform option and native build tooling.
- [WHATWG Storage Standard](https://storage.spec.whatwg.org/) and [MDN storage quotas/eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) — persistence design limits.
- [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/) — especially 4.2; [Google Play policy centre](https://play.google/developer-content-policy/) — assess again at submission.
