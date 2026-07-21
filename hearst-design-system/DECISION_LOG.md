# Hearst Prototype Decision Log

Use this file for concise, dated context behind product and design decisions. Durable rules must also be added to `STYLE.md`, `BRAND_STYLES.md`, or `APP_RULES.md`.

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
