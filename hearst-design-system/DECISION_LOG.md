# Hearst Prototype Decision Log

Use this file for concise, dated context behind product and design decisions. Durable rules must also be added to `STYLE.md`, `BRAND_STYLES.md`, or `APP_RULES.md`.

## 2026-07-25: Add Redbook to the video index

- **Context:** The Personalize video service accepts `redbookmag` and returns 20 readable exact `16:9` videos, but Redbook was not included in the configured video-brand registry.
- **Decision:** Add Redbook to the all-brand and Lifestyle video scopes, using the existing `redbook` publication slug and `trending_now` recommendation request. This makes Redbook available in the `Videos by brand` filter and the unfiltered global video feed without creating a separate presentation pattern.
- **Scope:** Hearst+ global Videos tab, Lifestyle video feeds, and Redbook video brand filtering.
- **Canonical rule:** `APP_RULES.md` video-feed behavior.

# 2026-07-25: Durable cross-device reader libraries

- **Context:** Reader profiles stored only saved story IDs, so refreshed catalogs produced anonymous unavailable rows. Google profile writes also replaced the complete server record, allowing one device to overwrite another device's newer saves or removals.
- **Decision:** Save a bounded editorial snapshot and canonical source URL with each library item, reconcile legacy IDs against the complete portfolio inventory, and show one explicit cleanup action for IDs that cannot be recovered. Google profile writes now send the device's prior and next state so the server can apply field and collection deltas to the current profile; signed-in devices refresh the server profile on load and focus.
- **Scope:** Reader account persistence, Google profile sync, saved-story and collection reconciliation, and the Profile Library and account-status copy.
- **Regression boundary:** Browser-local email profiles remain intentionally limited to one browser. The Google credential remains verified server-side and is never persisted.
- **Canonical rule:** `APP_RULES.md` account and identity behavior.

## 2026-07-25: Complete landscape and portrait video inventory within the supported response

- **Context:** Accepting every taller-than-wide frame allowed square-adjacent and `4:5` media into a viewer designed for `9:16`. Personalize rejects request sizes above 25 with HTTP 400, and common pagination parameters return the same first 25 IDs.
- **Decision:** Request the supported maximum of 25 current video recommendations per configured brand, preserve recommendation order, and retain every exact `16:9` and exact `9:16` video in that response. Exclude all other aspect ratios from the dedicated video feed, and revisit a larger inventory when upstream pagination exists.
- **Scope:** Production Personalize video-feed pagination and the portrait-video carousel eligibility check. Article feeds and standard source-page media are unchanged.
- **Canonical rule:** `APP_RULES.md` video-feed behavior.

## 2026-07-25: Stable Shorts snap playback

- **Context:** Changing the selected Short during an in-progress snap also changed the adaptive player's autoplay prop, which tore down the outgoing source and could let its pause event overwrite the incoming player's state. Mobile browsers then produced inconsistent autoplay across otherwise compatible portrait videos.
- **Decision:** Keep preloaded Shorts media elements mounted for the viewer session, commit selection only after the native snap settles, pause outgoing players without accepting their media events as active state, and autoplay a newly active Short only while the viewer is muted. Show story metadata briefly when a Short becomes active, then let it recede until hover, touch, or keyboard focus requests it again.
- **Scope:** The full-screen Delish Shorts viewer on phone and desktop. Standard landscape video cards and story-reader playback are unchanged.
- **Canonical rule:** `APP_RULES.md` Delish Shorts behavior.

## 2026-07-23: Capability-based HomePageTemplate extraction

- **Context:** `home-page.tsx` reached 503,880 bytes and Babel deoptimized code generation above its 500 KB threshold. Moving arbitrary constants would silence the warning without improving ownership.
- **Decision:** Begin the monolith reduction with low-coupling, behavior-preserving capability boundaries. Utility navigation now owns its destination/account presentation and the stakeholder personalization/technology guides own their static explanation and package-version presentation. Keep the existing public props and visible behavior unchanged.
- **Measured result:** `home-page.tsx` is 489,984 bytes and 11,439 lines. The repeated ESLint path no longer emits Babel’s deoptimization warning; TypeScript, extracted-module lint, focused tests, the production build, and responsive browser journeys pass.
- **Scope:** First architectural extraction only. Search, onboarding, reader, gallery, video, games, and river remain in the client module and require separate tested extractions.
- **Regression boundary:** Preserve utility active-destination behavior across general and publication routes, and keep stakeholder guide content available inside the personalization dialog.

## 2026-07-23: Accessible overlay stack, reader chrome, search, and onboarding inventory

- **Context:** Search, onboarding, account, and reader overlays did not consistently isolate background semantics; nested reader layers could expose the layer beneath them; mobile reader chrome duplicated the app navigation; substring search produced false positives; and onboarding counted a capped preview instead of the eligible catalog.
- **Decision:** Portal audited overlays to direct body-level layers and use one nested isolation stack so only the top layer remains operable. Make the standard reader flush to the mobile viewport while preserving the inset desktop surface. Search normalized Unicode word tokens with deterministic field ranking and bounded long-prefix matching. Compute onboarding brand counts from the full generated catalog without additional feed requests, disable true zero-inventory choices, and retain 24px pagination targets.
- **Scope:** Search, mobile menu, onboarding, account/profile, standard reader, Ambient Reader, fullscreen gallery, featured carousel verification, and onboarding across Hearst destination/category/publication routes.
- **Regression boundary:** Delish Shorts, games, and future overlay surfaces must adopt the shared isolation primitive before being considered part of the unified modal system.
- **Canonical rule:** `APP_RULES.md` onboarding/search/modal rules, Reader modal behavior, and Featured carousel behavior.

## 2026-07-23: Shared client article requests

- **Context:** Rich-gallery preview loading and the reader queue independently requested the same complete article, causing two `/api/live-article/` calls when a previewed story opened.
- **Decision:** Use one canonical source-URL cache for gallery previews, the standard reader, reader preloads, and Ambient Reader. Share in-flight promises and resolved articles, evict least-recently-used results beyond the bounded limit, and remove failed requests so later consumers can retry. Consumers ignore results after unmount rather than canceling shared work.
- **Scope:** Client-side complete-article loading across Hearst+ reader and gallery surfaces. Server extraction and source freshness behavior are unchanged.
- **Canonical rule:** `APP_RULES.md` Reader modal behavior.

## 2026-07-23: Demand-driven catalog pagination

- **Context:** Browser-idle pagination fetched the full editorial and video catalogs on every visit, producing 22 background requests even when the active Saved view was empty.
- **Decision:** Keep the compact initial catalog, but request subsequent editorial or video pages only when the shared river sentinel is approached and its loaded buffer is nearly exhausted. Allow one in-flight request, require an advancing cursor, abort stale/hidden/offline work, and show retry feedback for partial-feed failures. Do not paginate videos outside the Videos experience unless a visible module explicitly requests them.
- **Scope:** Hearst+ destination, category, publication, and Videos rivers. Targeted reader brand switching retains its separate bounded request.
- **Supersedes:** The background full-catalog merge portion of the 2026-07-19 complete-lazy-rivers decision. The compact initial render and four-card DOM batches remain.
- **Canonical rule:** `APP_RULES.md` progressive river behavior.

## 2026-07-21: Cross-device video playback

- **Context:** Some Personalize videos played on desktop but failed on phones because resolution-first selection could choose HEVC while H.264 was available, and HLS URLs containing an earlier `.mp4` path segment were misclassified as direct MP4 files.
- **Decision:** Prefer direct H.264/AVC MP4 transcodings, identify media by the final URL extension, and route every video surface through one adaptive player. Use native HLS where supported, `hls.js` elsewhere, bounded recovery for network or media failures, and a visible retry state when playback cannot recover. When a selected HLS master omits dimensions, retain orientation from a dimension-bearing alternate transcoding so portrait collections remain complete.
- **Scope:** Featured, river, reader, and immersive Delish Shorts video playback across desktop and mobile.
- **Canonical rule:** `APP_RULES.md` video-feed behavior.

## 2026-07-21: Premium reader eligibility for galleries

- **Context:** Image-led source galleries can contain a complete visual story but fewer text blocks than a standard article, leaving the premium-reader action disabled even when the gallery body and images loaded successfully.
- **Decision:** Preserve the four-text-block threshold for standard articles, and treat a source gallery as complete when it contains at least two non-image content blocks and three gallery images.
- **Scope:** Premium Ambient Reader eligibility across source-backed Hearst galleries.
- **Canonical rule:** `APP_RULES.md` Reader modal behavior.

## 2026-07-21: App-wide source bylines

- **Context:** Writer names were available on source pages but appeared only after opening some articles, while compact story modules and refreshed catalogs fell back to publication editors.
- **Decision:** Use one byline resolver across story cards, search, sidebars, carousels, video modules, related stories, and readers. Capture RSS creator fields during import, enrich remaining source-backed stories from article metadata or JSON-LD, and validate minimum byline coverage after every refresh. Preserve the publication-editors fallback only when the source provides no writer.
- **Scope:** All Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, and cross-Hearst story surfaces.
- **Canonical rule:** `APP_RULES.md` feed refresh and story-card behavior.

## 2026-07-20: Source-backed reader timestamps

- **Context:** The reader did not expose article publication dates, which made fresh daily-feed stories harder to verify and reduced editorial trust.
- **Decision:** Move the publication icon and brand name beside the editorial signal above the standard-reader headline, leaving topic, source-page writer byline, follow state, date, and story actions below. Resolve the writer from source metadata or JSON-LD before falling back to imported or publication-editor attribution, label it `By {writer}`, and render the date at the same type size. Show the source publication date as an unlabeled absolute date, and replace the Ambient Reader hero's estimated read time with that date beside the author. Prefer source-page metadata or JSON-LD, fall back to the imported RSS `pubDate`, and show an updated timestamp only when the source reports a modification at least fifteen minutes after publication. Importers reject missing, invalid, or materially future dates instead of substituting the current time or sitemap modification time.
- **Scope:** All source-backed Lifestyle, Autos, Fashion & Luxury, and Enthusiast & Wellness reader articles.
- **Exceptions:** Stories without a valid source publication timestamp omit the date rather than inventing one.
- **Canonical rule:** `APP_RULES.md` Reader modal behavior.

## 2026-07-19: Global publication story inventory

- **Context:** Publication pages expanded only the active brand while their shared brand module displayed the small sibling preview loaded into that river, making counts such as six Delish stories look like complete catalog totals.
- **Decision:** On publication routes, reuse the shared sidebar module as a cached, section-wide story inventory. Count each sibling brand from the deduplicated full editorial, current article, and playable-video catalog, while retaining canonical brand navigation and the active publication state.
- **Scope:** Every Lifestyle, Autos, Fashion & Luxury, and Enthusiast & Wellness publication route. Destination-wide filters and the Videos index keep their contextual count behavior.
- **Canonical rule:** `APP_RULES.md` publication-river behavior.

## 2026-07-23: Scoped UI state and executable unit tests

- **Context:** Focused lint exposed cascading renders caused by synchronously copying props and route state inside effects, while application utility tests existed but were not discoverable through a package command.
- **Decision:** Reset transient dialog sessions through keyed remount boundaries, derive route/account/filter state from explicit scope keys, and preserve progressively loaded feed order through a pure tested merge. Expose all current utility tests through `npm run test:unit`; do not suppress React lint rules.
- **Scope:** Hearst+ onboarding, authentication/profile dialogs, reader and gallery state, search selection, carousel and Shorts sessions, brand filters, visible-feed pagination, article cache, story search, and feed ordering.
- **Exceptions:** Unsaved authentication/profile drafts are intentionally discarded when their dialog closes. Component and route-level browser suites remain follow-up coverage.
- **Canonical rule:** `APP_RULES.md` modal, reader, and progressive-river behavior.

## 2026-07-19: Delish indicator palette exception and complete lazy rivers

- **Context:** Delish requested a five-color hero-indicator exception, while every other publication must retain the established primary/muted indicators. Separately, the editorial hydration gate could wait for all progressive feed pages even though the river already renders cards incrementally.
- **Decision:** Feed Delish palette colors 1–5 only into the Delish hero indicators, preserving position and active-width behavior. Render publication rivers immediately, continue merging every editorial page in the background, and let the existing sentinel append four ranked cards per batch until the active river is complete.
- **Scope:** The color exception is limited to `/lifestyle/delish/`. Progressive river loading applies across publication routes. Every other publication and destination-wide river retains the shared indicator treatment.
- **Canonical rule:** `APP_RULES.md` progressive river and publication behavior; `STYLE.md` carousel indicators and river modules.

## 2026-07-19: Delish portrait-video rail

- **Context:** The Hearst+ Videos index mixes landscape and portrait source media in one stacked queue, while Delish currently supplies a meaningful set of short-form `9:16` recipe videos.
- **Decision:** Promote dimension-verified Delish portrait videos into a swipeable Delish Shorts carousel directly below the featured video, using the live feed rather than a hand-maintained story list. Reuse that inventory and interaction directly below the lead story on the Delish publication river, with a light token-driven container that belongs to the river. Open only these cards in a route-preserving, full-screen short-form viewer with real portrait playback, directional two-video slide transitions, vertical navigation, playback controls, save, reduced-motion fallback, and focus restoration.
- **Scope:** The Hearst+ home Videos category in its all-brand and Delish-filtered states, plus the `/lifestyle/delish/` publication river.
- **Exceptions:** Other brand filters hide the Delish module, the standalone source-focused video QA route keeps its existing structure, and standard video cards continue to open the existing story reader.
- **Canonical rule:** `APP_RULES.md` video-feed behavior and `STYLE.md` carousels and sliders.

## 2026-07-18: Documentation source hierarchy and font availability

- `DESIGN-SYSTEM-SPEC.md` is the canonical HDS foundation reference and precedes application-level documentation.
- Publication token JSON is canonical; generated TypeScript and CSS are outputs, while `theme-options.ts` owns app-only destination compositions.
- The brand registry distinguishes HDS page tokens from the application canvas override and documents runtime font availability.
- Historical Markdown is labeled and linked separately so Obsidian search does not present it as current guidance.
- Open-source configured fonts are loaded globally. Knockout Condensed remains an explicit pending proprietary asset with a documented fallback.

## 2026-07-18: Hearst Design System foundation

- The Hearst+ application and destination prototypes are built on top of the Hearst Design System.
- Application patterns compose the design system's foundations, components, semantic tokens, typography roles, icons, and brand themes.
- Product-specific patterns and documented exceptions may extend the system, but they must not create a parallel component or token system.
- Canonical rule: `PRODUCT.md` Design System Architecture and `STYLE.md` Native foundation and brand inheritance.
- `DESIGN.md` provides the concise context automatically loaded by Impeccable and points to the detailed vault rules.

## 2026-07-18: Project knowledge vault

- The `hearst-design-system` project root is the Obsidian vault.
- Repository Markdown is the canonical shared memory for the product.
- `PRODUCT.md`, `STYLE.md`, `BRAND_STYLES.md`, and `APP_RULES.md` remain separate by responsibility and are linked from `VAULT_HOME.md`.
- Codex memory is supporting context, not the product source of truth.

## Decision template

### YYYY-MM-DD: Decision title

- **Context:** What prompted the decision.
- **Decision:** What the team agreed to do.
- **Scope:** Which destinations, brands, components, or readers are affected.
- **Exceptions:** Any intentionally different behavior.
- **Canonical rule:** Link to the section in `STYLE.md`, `BRAND_STYLES.md`, or `APP_RULES.md`.
