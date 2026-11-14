# Hearst Prototype Decision Log

Use this file for concise, dated context behind product and design decisions. Durable rules must also be added to `STYLE.md`, `BRAND_STYLES.md`, or `APP_RULES.md`.

## 2026-11-14: The daily feed publishes itself

- **Context:** The daily feed workflow ran, but each edition waited in a pull request for owner approval, so the live catalog fell behind whenever no one merged it.
- **Decision:** After import, validation and build pass, the workflow pushes the edition to `main` with a write deploy key (`FEED_DEPLOY_KEY`), which the `Protect main` ruleset already lets bypass review. The pull request is kept as the record and shows as merged.
- **Scope:** Only the generated feed files the workflow commits.
- **Exceptions:** Without the key, or when the edition conflicts with `main`, the pull request stays open for manual approval.
- **Canonical rule:** `APP_RULES.md` (daily RSS refresh).

## 2026-11-13: The app does not use the Design Brain

- **Context:** The system spec (finding F5) asked whether the Hearst+ vault should link to the separate Hearst-wide Design Brain vault.
- **Decision:** No. Agents must not read, search, cite or copy from the Design Brain or any knowledge base outside the repository. Missing rules are added to the repository vault. This also settles F1: the repository's token JSON is the only authority for token values, and the Design Brain's AI Enabler token sync does not apply.
- **Scope:** Every agent and collaborator working in this repository.
- **Exceptions:** None.
- **Canonical rule:** `AGENTS.md`; token authority in `AIDLC-docs/DESIGN-SYSTEM-SPEC.md`.

## 2026-11-13: One specifications page

- **Context:** The specs lived on nine separate pages in two looks (four app routes and five static HTML files), so the header had nine spec links and the documents drifted apart.
- **Decision:** Every spec is a chapter of `/specs/`, built from one spec kit (`src/components/specs/spec-kit.tsx`). The header links to the chapter anchors; Storybook stays its own site. Films load nothing until played. The old URLs redirect permanently to their chapter (`netlify.toml` and `next.config.ts`).
- **Scope:** CTAs, breakpoints and grid, type, tokens and brands, blocks, nav, reader, carousel, system. Full drawing sheets (`/specs/*-drawing.html`) stay standalone.
- **Exceptions:** None.
- **Canonical rule:** `AGENTS.md` › Working with collaborators.

## 2026-11-12: Featured carousel scroll parallax

- **Context:** The owner asked for a subtle, refined parallax on the carousel text panel across the app.
- **Decision:** The panel drifts up to 28px and the photo sinks up to about 11px (inside 12px of overscan) while the carousel scrolls through the viewport, eased and one-directional so the panel never clips at the track's bottom padding. Off for reduced motion and the list layout. An earlier 16px panel-only version read as too faint.
- **Scope:** Every featured carousel in card layout (Hearst+ home, destinations, sections, publication pages).
- **Canonical rule:** `STYLE.md`, Carousels and sliders.

## 2026-11-12: Loading skeleton matches the loaded layout

- **Context:** The river's loading skeleton drew a 16:9 bordered hero, no river cards and short rail boxes, so the page jumped when the feed arrived (the main column changed height, for example 549 → 595px at 1440 and 738 → 423px at 390).
- **Decision:** The skeleton mirrors the loaded cards layout box for box at every breakpoint, and the carousel parallax rests at its designed position on load so the skeleton and the loaded panel agree. A regression (`npm run test:skeleton-match`) fails on any box that moves more than 1px.
- **Canonical rule:** `STYLE.md` › Loading states.

## 2026-11-12: Stories open in place

- **Context:** Opening a river story flickered and closing it landed somewhere else. Opening did a full `router.push` to the server-rendered `/read/` route, so the reader drew twice and its images reloaded. Closing pushed the feed route again, which refetched and rebuilt the river from its first batch, and the scroll restore then jumped three times (2600 → 748 → 616 → 438px).
- **Decision:** In-app surfaces open the reader as a layer and change only the address with a shallow history entry; Close and Back step back to the page's entry. Added open and close motion, focus return without scrolling, and instant display of cached story images.
- **Scope:** Every reader opened through `openStory` (river, carousel, rails, search). Direct `/read/` visits keep the server route.
- **Canonical rule:** `APP_RULES.md` › Story routes; `STYLE.md` › Reader.

## 2026-11-11: Left rail joins at 1140px

- **Context:** A 1280px laptop at 150% Windows scaling reports about 1265px of page width, so index pages lost their left rail on common laptops.
- **Decision:** Rail layouts add the left rail at a `rail` breakpoint of 1140px, 240px wide (`--layout-rail-compact`), and widen it to the standard 300px at `rail-full` (1200px). The river is 520px at both joins. Blocks that switch to two columns at 536px of container width stay single-column just after each join.
- **Scope:** Destination, section, and publication indexes, plus the Local News newspapers, TV, Events, Games, and feed loading states. The reader's context rail stays at xl.
- **Canonical rule:** `STYLE.md` responsive rules; `APP_RULES.md` For You rail breakpoints.

## 2026-11-11: Carousel text card takes the banner color; vault audit

- **Context:** The featured carousel's text card was black on every page, so it never matched the section or brand around it. An audit of the vault's canonical files against the shipped app also found stale values (utility-bar navy, Hearst+ blue, E&W and publication fonts, Road & Track color), retired modules still described as live (Today's Edit, carousel indicators and Follow row, Global Story Inventory), and wrong layout breakpoints.
- **Decision:** The card takes the page's banner color through `getFeaturedCardColors`: the Hearst+ brand-wall navy on the home, the section banner on destinations, the brand's bar color (`palette-background-utility`) on publication pages. White text sits on the color darkened to 5.5:1; light brand colors keep their color with `#121212` text. The canonical files were corrected to describe the app as shipped, and superseded log entries carry a dated status line.
- **Scope:** `featured-story-carousel.tsx`, `brand-banners.ts`, the three home-page carousels; `STYLE.md`, `BRAND_STYLES.md`, `APP_RULES.md`, `PRODUCT.md`, `VAULT_HOME.md`, `DESIGN.md`, `AGENTS.md`, `AIDLC-docs/DESIGN-SYSTEM-SPEC.md`.
- **Canonical rule:** `STYLE.md` featured carousel panel rule.

## 2026-11-06: Bookmark is the save icon

- **Context:** Save used a heart, which readers associate with liking a story, while the surrounding language is about keeping stories for later ("Save story", "Save stories to build your reading list", Library, Read Later). The HDS Constitution's river card contract also names a bookmark action.
- **Decision:** Save and saved-item affordances use the bookmark (outline unsaved, filled saved). The heart is reserved for reactions and favorites such as community likes. Library navigation moves from the bookmark to the books icon so the two never look alike.
- **Scope:** Story card save, story action row, reader action bar, Shorts viewer, fullscreen image viewer, Saved Items module headings and suggestions, and the account Library navigation.
- **Canonical rule:** `APP_RULES.md` save icon rule.

## 2026-10-11: Preview-first Newsstand landing page

- **Context:** The landing page split attention between the trial and Preview, ran about eight screens of brand panels before the offer, and ended on a plans card with the rack poking out around it.
- **Decision:** Preview the app is the page's main action and the trial its follow-up. Three brand panels, one per section (Good Housekeeping, Harper's Bazaar, Car and Driver). Preview goes to the brand in view, otherwise the home feed. The page ends on a solid white full-bleed plans section. In the app, a soft trial banner follows after about three stories (its placement is still open).
- **Status (2026-11-11 audit):** Superseded in part: the page now has six brand panels (`FEATURED_SLUGS` in `newsstand-catalog.ts`).
- **Scope:** `/hearst-plus/newsstand/` and its title modal; the in-app trial banner is not built yet.
- **Canonical rule:** `APP_RULES.md` Newsstand rules; design in `docs/landing-page-design.md`.

## 2026-10-11: Navy utility bar

- **Context:** The bright Hearst+ blue utility bar sat above the navy Hearst+ banner and matched the logo's plus, so the header carried two strong blues and the plus competed with the bar.
- **Decision:** On the Hearst+ home the banner extends up behind a transparent utility bar, which fills with the logo navy `#012247` (`--hp-utility-bar`) once the page scrolls, so the header reads as one navy block and the plus is its one bright blue.
- **Status (2026-11-11 audit):** The filled bar renders `#03112B` (`--hp-utility-bar` → `--palette-alert-info-1000`), deeper than the logo navy `#012247`. The Communities home also uses the transparent-over-banner bar.
- **Scope:** The utility bar on the Hearst+ home (`All`) only.
- **Exceptions:** Sections, Local News, A&E and brand pages keep a bar in their own primary color, which reads better over their colored banners; dark-mode pages keep the dark knockout bar.
- **Canonical rule:** `STYLE.md` Hearst+ shell styling.

## 2026-10-11: Darker page canvas

- **Context:** With module outlines removed, white cards on the `#F4F2EE` canvas separated only by a faint shadow, so the page read as flat.
- **Decision:** Darken the warm canvas to `#ECE9E3` so white modules stand out, keeping its warm hue. Subtle text darkens from `#5F6B7A` to `#5B6676` to keep 4.5:1 on the new canvas.
- **Scope:** Every Hearst+ light page (`.hearst-plus-theme` in `globals.css`, `hearst-plus-theme.ts`).
- **Exceptions:** The shared blue `#2B6FAF` is unchanged; it reaches only 4.34:1 on the canvas, so blue text stays inside white modules.
- **Canonical rule:** `APP_RULES.md` page canvas; `STYLE.md` contrast.

## 2026-10-11: New Hearst+ logo and destination lockups

- **Context:** A new two-tone Hearst+ logo (navy HEARST, blue plus) replaced the single-color one, and the destination lockups (HEARST plus an italic serif section name) no longer matched it.
- **Decision:** Use the new Hearst+ logo everywhere, keeping its two colors except on knockout surfaces. Rebuild the Lifestyle, Autos, Fashion & Luxury and Enthusiast & Wellness lockups as navy HEARST, a thin divider and the section name in letter-spaced Schibsted Grotesk Bold, with the divider and name in the destination primary.
- **Status (2026-11-11 audit):** Superseded in part: destination banners now draw the white HEARST+ knockout (`hearst-all-knockout`) with a live-text italic descriptor instead of letter-spaced section-name lockups.
- **Scope:** Every Hearst+ and destination masthead and footer that renders these logos.
- **Canonical rule:** `BRAND_STYLES.md` Brand application rules.

## 2026-10-11: Hearst+ feature lockup for Communities

- **Context:** The Communities logo used the destination family (HEARST + italic serif "Communities") as a plain image at its own size, so it read as a fifth destination, its letters did not match other pages and it overflowed on phones.
- **Decision:** A Hearst+ feature lockup: HEARST+ wordmark plus "Communities" in outlined Schibsted Grotesk Bold, all Hearst+ blue (white on dark), registered as `hearst-communities` and sized by the shared masthead geometry. The same pattern applies to later Hearst+ features.
- **Status (2026-11-11 audit):** Superseded: `hearst-communities` stays registered but the Communities masthead renders the white HEARST+ knockout with an italic `Communities` descriptor (`mastheadDescriptorOverride`).
- **Scope:** Communities masthead; the rule for future Hearst+ feature mastheads.
- **Canonical rule:** `BRAND_STYLES.md` Brand application rules; design in `docs/hearst-plus-communities-logo-design.md`.

## 2026-10-11: Communities is brand-hosted conversation

- **Context:** Communities mixed brand-seeded groups and editor threads with Reddit-style reader-made communities, `c/` names and up and down votes that did nothing, plus three overlapping navigations.
- **Decision:** Every group belongs to a Hearst brand with its editors as hosts; readers post on a trust ladder (first three posts reviewed); one positive `Helpful` reaction; one job per navigation control; host-picked story threads linked from the reader; Hearst+ identity with host badges; in-app Activity only.
- **Scope:** `/communities/` and its brand, group, post and thread routes, plus the story reader's context rail.
- **Canonical rule:** `APP_RULES.md` Communities; design in `docs/hearst-plus-communities-design.md`.

## 2026-10-10: New destination primaries

- **Context:** The four main destinations needed a palette that reads as one family: carmine, olive, dark Tyrian blue and slate.
- **Decision:** Lifestyle `#A62C37`, Autos `#819238`, Fashion & Luxury `#12354E`, Enthusiast & Wellness `#34454C`, each with derived hover, active and light tint steps and a curated dark-mode primary. Autos olive is only about 3.4:1 on white, so its link, content-brand and button tokens use darker olive steps (`#5A6627` text, `#6E7C30` buttons) to clear WCAG AA; Lifestyle keeps its teal, amber and sage secondary accents.
- **Status (2026-11-11 audit):** Corrected after this entry: Autos is slate `#34454C` and Enthusiast & Wellness is olive `#819238` with the AA olive steps (`theme-options.ts`).
- **Scope:** `lifestyleTheme`, `hearstPlusTheme` (Autos), `fluxTheme` and `ewTheme` in `src/lib/theme-options.ts`. Official destination logo SVGs are unchanged.
- **Canonical rule:** `BRAND_STYLES.md` Identity.

## 2026-10-10: Hearst+ headline font is Schibsted Grotesk

- **Context:** Hearst+ is positioned as a cross-brand app rather than a magazine; Newsreader read as a publication serif. Space Grotesk was tried briefly and felt too technical for a daily reading feed.
- **Decision:** The Hearst+ (`hearst-all`) headline font is Schibsted Grotesk 800, a grotesk designed for a news publisher, loaded through `next/font/google` (open source, no license purchase). Body and UI stay Inter.
- **Scope:** Surfaces themed `hearst-all` (Hearst+ home, newsstand). Lifestyle and other destinations keep their own headline fonts.
- **Canonical rule:** `BRAND_STYLES.md` Typography.

## 2026-10-09: Newsstand promotes the app, not the magazines

- **Context:** The newsstand page sold "every Hearst magazine, one subscription", with per-title tags, "Included" lines and a pick-your-magazines list. Hearst+ is a cross-brand aggregator app, and the app is the product being promoted.
- **Decision:** Lead with "Every Hearst brand. One app." Remove topic tags, "Included" lines and the whole `My newsstand` picking flow (panel and modal toggles, pill, fly-to-pill, plans-grid picks, confirmation pile). Every title modal and brand panel offers `Start free trial` and `Preview in Hearst+`; print remains as a quiet subscription link for titles still in print.
- **Status (2026-11-11 audit):** Superseded in part: brand panels no longer carry a trial button; title modals do.
- **Scope:** `/hearst-plus/newsstand/` only.
- **Canonical rule:** `APP_RULES.md` navigation rules (newsstand entries).

## 2026-10-04: Quieter river cards

- **Context:** The Save / More like this / comments / Hide row under every river card added too much information to the feed.
- **Decision:** Remove the per-card action row from every content card: standard and photo-gallery river cards, the lead video card, and video index cards (including their Open story button). The featured carousel drops Save and More like this and keeps Follow brand. River cards also drop the bottom summary strip (shopping picks, recipe stats, vehicle specs); the story reader keeps it. Readers reach Save, More like this and comments in the story reader's action bar.
- **Status (2026-11-11 audit):** Superseded in part: the carousel's Follow brand row is hidden too; it shows no per-card controls.
- **Scope:** `LifestyleRiverCard`, `RichPhotoGalleryCard`, `VideoFeedLeadCard`, `VideoIndexCard` and `FeaturedStoryCarousel` everywhere they render.
- **Consequence:** Hide existed only on cards, so readers can no longer hide stories. Previously hidden stories stay hidden.
- **Canonical rule:** `STYLE.md` card rules.

## 2026-10-04: Newsstand conversion and load pass

- **Context:** The handoff version scrolled about ten screens before the only sign-up point, showed bracketed pricing placeholders, and loaded three.js plus 3.6 MB of cover art before the rack appeared.
- **Decision:** Every brand panel carries a trial button and an "Add to my newsstand" toggle, brand sections are shortened to about one screen, and the hero links straight to plans. Readers can click covers on the rack or logos in the plans grid to build a "My newsstand" list that carries into an in-page confirmation. The offer is one editable config marked as prototype pricing. Covers ship as WebP (small for the rack, 2x only for the five featured titles), logo C2PA metadata is stripped, covers stream in instead of blocking the rack, and the scene loads after idle.
- **Status (2026-11-11 audit):** Superseded by the 2026-10-09 and 2026-10-11 entries: the newsstand picking flow and the hero-to-plans link were removed.
- **Scope:** `/hearst-plus/newsstand/` only.
- **Exceptions:** Trial buttons do not hand off to checkout or onboarding yet.
- **Canonical rule:** `APP_RULES.md` navigation rules.

## 2026-10-04: Hearst+ Newsstand landing page

- **Context:** A developer handoff delivered a scroll-driven three.js magazine rack that presents every Hearst title under one subscription.
- **Decision:** Ship it at `/hearst-plus/newsstand/` and link it as `Newsstand` in the shared site footer's `Discover Hearst+` group. Pricing, trial length, and brand copy remain placeholders pending editorial approval; trial buttons are not yet wired to checkout.
- **Scope:** Hearst+ product prototype footer and the new newsstand route. Adds the `three` dependency, loaded client-side only.
- **Exceptions:** The route is not a feed category and is excluded from destination category navigation.
- **Canonical rule:** `APP_RULES.md` navigation rules.

## 2026-08-02: Restrained product-document status language

- **Context:** Pastel green, blue, and amber status badges made the Article Experience Blueprint read like a generic generated dashboard instead of a Hearst executive reference.
- **Decision:** Product-reference pages use unboxed inline status markers in Hearst navy, Hearst blue, and neutral slate. They do not use traffic-light status palettes or em dashes in authored interface and strategy copy. Strategy-document samples normalize source-title em dashes to colons while canonical story routes and source content remain unchanged.
- **Scope:** Hearst executive narratives, product blueprints, architecture references, and their embedded presentation samples.
- **Canonical rule:** `STYLE.md` Theme and color.

## 2026-08-02: Library unsave behavior

- **Context:** The account Library exposed collection assignment for saved stories but no direct way to unsave one from the master list.
- **Decision:** Give every saved-story row a visible Remove action. One removal atomically clears the story from saved preferences, the internal Read Later collection, every reader-created collection, and retained snapshots when no other reference remains. After removal, focus moves to the next available Remove action or the Saved stories heading.
- **Scope:** Hearst+ account Library for browser-local and Google-synced prototype profiles.
- **Canonical rule:** `APP_RULES.md` navigation and branding behavior.

## 2026-08-02: Compact profile preferences and fresh recommendations

- **Context:** The account For You settings rendered every topic and brand at once, which made the modal difficult to scan and pushed useful content below the first viewport.
- **Decision:** Show six options per preference group using current catalog popularity and freshness signals, then place the remaining options in accessible disclosures that retain selection state. Add a Recommended account section with up to six recent, unsaved, non-hidden stories ranked from the reader's actual followed topics and brands.
- **Scope:** Hearst+ account Profile and For You settings across destinations.
- **Canonical rule:** `APP_RULES.md` navigation and branding behavior.

## 2026-07-25: Add Redbook to the video index

- **Context:** The Personalize video service accepts `redbookmag` and returns 20 readable exact `16:9` videos, but Redbook was not included in the configured video-brand registry.
- **Decision:** Add Redbook to the all-brand and Lifestyle video scopes, using the existing `redbook` publication slug and `trending_now` recommendation request. This makes Redbook available in the `Videos by brand` filter and the unfiltered global video feed without creating a separate presentation pattern.
- **Scope:** Hearst+ global Videos tab, Lifestyle video feeds, and Redbook video brand filtering.
- **Canonical rule:** `APP_RULES.md` video-feed behavior.

## 2026-07-25: Durable cross-device reader libraries

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

## 2026-07-23: Scoped UI state and executable unit tests

- **Context:** Focused lint exposed cascading renders caused by synchronously copying props and route state inside effects, while application utility tests existed but were not discoverable through a package command.
- **Decision:** Reset transient dialog sessions through keyed remount boundaries, derive route/account/filter state from explicit scope keys, and preserve progressively loaded feed order through a pure tested merge. Expose all current utility tests through `npm run test:unit`; do not suppress React lint rules.
- **Scope:** Hearst+ onboarding, authentication/profile dialogs, reader and gallery state, search selection, carousel and Shorts sessions, brand filters, visible-feed pagination, article cache, story search, and feed ordering.
- **Exceptions:** Unsaved authentication/profile drafts are intentionally discarded when their dialog closes. Component and route-level browser suites remain follow-up coverage.
- **Canonical rule:** `APP_RULES.md` modal, reader, and progressive-river behavior.

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

## 2026-07-19: Delish indicator palette exception and complete lazy rivers

- **Context:** Delish requested a five-color hero-indicator exception, while every other publication must retain the established primary/muted indicators. Separately, the editorial hydration gate could wait for all progressive feed pages even though the river already renders cards incrementally.
- **Decision:** Feed Delish palette colors 1–5 only into the Delish hero indicators, preserving position and active-width behavior. Render publication rivers immediately, continue merging every editorial page in the background, and let the existing sentinel append four ranked cards per batch until the active river is complete.
- **Status (2026-11-11 audit):** Superseded in part: featured-carousel dot indicators are hidden, so the Delish indicator palette is dormant.
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
