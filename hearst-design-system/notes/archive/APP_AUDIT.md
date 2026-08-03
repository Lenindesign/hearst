---
status: historical
snapshot_date: 2026-07-23
superseded_by: APP_RULES.md, PRODUCT.md, STYLE.md
---

# Hearst+ Application Audit

> Historical audit snapshot. Findings reflect the implementation and environment on the snapshot date. Revalidate against current code before acting on them.

Audit date: 2026-07-23

Target: local repository at `/Users/leninaviles/Projects/hearst/hearst-design-system`

Primary route: `/hearst-plus/`

Audit target: WCAG 2.2 AA, reader usefulness, trust, performance, maintainability, and conversion to a repeat reading habit

## Executive summary

Hearst+ is a working personalized editorial-reader prototype. It combines public Hearst story metadata, live article/video recommendations, a cross-brand feed, search, saved stories, preference onboarding, and an in-app reader. It is designed for readers who want useful stories organized by interests rather than by publisher.

The product is strongest when it behaves like a tuned magazine: editorial imagery is prominent, story provenance is visible, responsive layouts do not create page-level overflow, browser Back returns from a story to the originating feed, focus returns to the story opener, the page keeps one `main` and one H1, and sampled text on solid backgrounds met AA contrast.

It is not ready to present as a trustworthy production account or fully accessible video product. The two P0 findings are:

1. The prototype asks for an email and password, hashes the password once with SHA-256, and stores the account record and hash in `localStorage`. This is not a secure identity model and invites users to enter real credentials into a browser-local demo.
2. The core video experience provides no caption or transcript implementation. The UI itself admits that caption and transcript coverage remains a production requirement.

The largest P1 engineering issue is unbounded progressive loading. A single visit automatically fetched 13 editorial pages and 9 video pages—effectively the whole catalog—even on the empty Saved route. Opening one article also issued the same full-article request twice. This creates avoidable network, parsing, memory, server, and battery cost.

The largest UX mismatch is that reader-facing surfaces expose stakeholder/debug language and prototype mechanics. The Saved page shows “Story Source,” inventory counts, feed status, and “Why Your River Looks Like This” even when it has no saved stories. Onboarding alternates between accurate “local demo profile” copy and production-like “Create Account,” “Sign In,” and “Create Free Account” labels.

No application code was changed during this audit.

## Evidence and method

### Product and code evidence

- Read `PRODUCT.md` and `APP_RULES.md` as the current product contract.
- Inspected the Next.js 16 / React 19 source, route handlers, identity storage, search, onboarding, reader, video player, responsive classes, and error/loading paths.
- Ran the optimized production build.
- Ran focused ESLint over the audited route and supporting components.
- Inspected live DOM structure, focus behavior, landmarks, names, target sizes, image alternatives, contrast samples, overflow, modal state, and navigation.
- Exercised Home, Search, onboarding, Saved, Videos, and the story reader.
- Tested viewport widths at 320, 375, 768, 1024, 1280, and 1440 CSS pixels.

### Validation result

- Production build: **passed** after allowing the build to fetch its configured Google Fonts.
- Focused ESLint originally failed with 24 errors and 2 warnings, and Babel reported that `home-page.tsx` exceeded its 500 KB deoptimization threshold. **Resolved 2026-07-23:** the affected Hearst+ page, account dialogs, extracted modules, and supporting utilities lint with zero errors and zero warnings; `home-page.tsx` remains below the threshold at 491,645 bytes.
- Automated test inventory originally found no application tests. **Resolved for the audited utilities 2026-07-23:** `npm run test:unit` now discovers and passes 11 request-cache, search, and stable-feed-order tests. Broader component and journey coverage remains required.
- True production Core Web Vitals were not available from the local development run. LCP, INP, and CLS therefore require a production-like measurement run; no numeric CWV claims are made here.

### Screenshots

#### Responsive home

| Width | Evidence |
| --- | --- |
| 320px | ![Hearst+ home at 320px](output/audit-2026-07-23/02-home-mobile-320.png) |
| 375px | ![Hearst+ home at 375px](output/audit-2026-07-23/03-home-mobile-375.png) |
| 768px | ![Hearst+ home at 768px](output/audit-2026-07-23/04-home-tablet-768.png) |
| 1024px | ![Hearst+ home at 1024px](output/audit-2026-07-23/05-home-small-desktop-1024.png) |
| 1280px | ![Hearst+ home at 1280px](output/audit-2026-07-23/01-home-desktop-1280.png) |
| 1440px | ![Hearst+ home at 1440px](output/audit-2026-07-23/06-home-wide-1440.png) |

#### Key journeys

| Journey | Evidence |
| --- | --- |
| Search | ![Search at 375px](output/audit-2026-07-23/07-search-mobile-375.png) |
| Search zero results | ![Search zero results at 375px](output/audit-2026-07-23/08-search-no-match-mobile-375.png) |
| Search relevance | ![Audi search at 375px](output/audit-2026-07-23/09-search-audi-mobile-375.png) |
| Story reader | ![Story reader at 375px](output/audit-2026-07-23/10-story-reader-mobile-375.png) |
| Onboarding start | ![Onboarding start at 375px](output/audit-2026-07-23/11-onboarding-step1-mobile-375.png) |
| Interest selection | ![Interest selection at 375px](output/audit-2026-07-23/12-onboarding-interests-mobile-375.png) |
| Brand selection | ![Brand selection at 375px](output/audit-2026-07-23/13-onboarding-brands-mobile-375.png) |
| Account choice | ![Account choice at 375px](output/audit-2026-07-23/14-onboarding-account-choice-mobile-375.png) |
| Saved empty state | ![Saved empty state at 375px](output/audit-2026-07-23/15-saved-empty-mobile-375.png) |
| Video feed | ![Video feed at 375px](output/audit-2026-07-23/16-videos-mobile-375.png) |

## 1. Product understanding

### What the application does

Hearst+ is a personalized cross-brand discovery and reading experience. It blends editorial stories and videos from Hearst brands into a topic-led “For You” feed. Readers can search, save, follow brands, signal “More like this,” select interests, read complete articles in an overlay, and move into destination-specific feeds such as Autos or Lifestyle.

### Primary users

Hearst readers who want one useful daily destination for food, home, wellness, shopping, entertainment, cars, technology, and culture. The experience assumes readers care first about the need or interest, then about the publication.

### Main journeys

1. Enter the For You feed and scan the daily edit.
2. Open a story or video and continue reading inside Hearst+.
3. Search by title, brand, topic, or tag.
4. Save a story and return to it later.
5. Personalize the feed by interests and brands.
6. Move between destination or category feeds.
7. Use feedback actions to influence future recommendations.

### Primary success actions

- Complete a meaningful story read.
- Return for another daily session.
- Save or follow content that improves future relevance.
- Open a second story in the same session.
- Successfully find a known story or topic through search.

### Value proposition currently communicated

“Your daily Hearst feed, tuned to you,” backed by trusted Hearst brands, cross-brand discovery, and an in-product reading experience.

### Assumptions

- This audit treats the repository’s `PRODUCT.md` and `APP_RULES.md` as intended behavior.
- The product remains a prototype; production identity, consent, analytics, experimentation, and cross-device sync are not assumed.
- Public story content can change. Search examples and feed counts are evidence from this audit run only.

### Intended product vs. delivered experience

The intent is a reader-facing, habitual magazine product. The delivered feed often achieves that, especially in the featured story and river. The mismatch appears in secondary surfaces:

- Saved and personalization sidebars expose system state and inventory instead of helping a reader act.
- Account language implies a production identity flow despite browser-local storage.
- Video is presented as a core mode without production-required captions or transcripts.
- The app downloads whole catalogs in the background, behaving more like a stakeholder demo that wants every scenario available than a user product that loads only what the reader needs.

## 2–5. Experience, usability, visual system, and content audit

### Entry and homepage

**What works**

- Editorial imagery leads the page.
- Brand, topic, author, and recommendation context are present.
- The featured story clearly dominates at all tested widths.
- There was no page-level horizontal overflow at 320, 375, 768, 1024, 1280, or 1440px.
- Mobile primary carousel controls measured 44px high.
- The page maintained one H1 and one `main`.

**Problems**

- At 320px the destination and category navigation are horizontally clipped with no strong affordance that they scroll. This is especially easy to miss above a large feature card.
- The first screen contains two horizontal navigation systems before content. On a phone, this spends scarce vertical space before the main reading choice.
- All five feature slides remain exposed in the accessibility tree, including five H2 headings and full slide content, even though one slide is visually active. A screen-reader user must traverse duplicate/inactive content.
- Sidebar titles such as “Your Daily Habit,” “Trending Across Brands,” “Story Source,” and “Why Your River Looks Like This” create a dashboard tone that conflicts with the stated magazine-like product.

**Recommendation**

- Keep the top destination switcher, but reduce the category rail to a compact scrollable control with edge fade and current-position cue on phones.
- Give inactive feature slides `inert` and `aria-hidden="true"` or render only the active slide plus an announced count. Preserve the pause control and reduced-motion behavior.
- Move feed mechanics and inventory into a prototype/debug drawer gated from reader-facing routes.

### Search and discovery

**What works**

- Search opens in a responsive dialog and moves focus to the combobox.
- It supports Arrow Up/Down and Enter.
- Search exposes a clear zero-result state with a query-specific message.
- Results include image, title, source, category, and byline.

**Problems**

- Matching uses raw substring checks. Searching `Audi` returned “Audience,” “Saudi,” and “Audiobooks.” The screenshot shows “Queen Letizia … for an Audience” as the fifth result.
- The backdrop is an accessible button named “Close search,” while the visible close button has the same name. Screen readers encounter two indistinguishable close controls.
- The background page remains exposed in the accessibility tree while `aria-modal="true"` is set. Focus is manually trapped, but semantic isolation is incomplete.

**Recommendation**

- Normalize text into word tokens and score word-boundary matches. Permit fuzzy matching only after exact token/title/brand/topic matches.
- Make the backdrop non-semantic (`aria-hidden`, no button role) and keep one visible close button.
- Use the native `<dialog>` element or a shared modal primitive that makes all outside content inert.

### Onboarding and local profile

**What works**

- The five-step sequence is understandable.
- Requirements (“choose at least 3,” “pick at least 2”) are explicit.
- Selected topics use `aria-pressed`.
- Step headings receive focus.
- Mobile content scrolls independently while actions remain available.
- The fourth step finally explains browser-local storage accurately.

**Problems**

- The persistent eyebrow says “Create Account” on every step, including after “Continue without account.”
- Step 4 offers “Sign In” and “Create Free Account,” then opens a browser-local form for name, email, password, Terms acceptance, and a demo Google profile.
- The account code stores email, profile data, comments, collections, preferences, and a single SHA-256 password hash in `localStorage`.
- Country Living, Delish, Good Housekeeping, House Beautiful, and other major brands displayed “0 stories,” even though the live feed contained stories from some of those brands.
- Zero-story brands can still be selected to satisfy the minimum, creating an expectation the product cannot honor.
- Brand pagination dots are 8px targets placed close together. They do not meet the WCAG 2.2 AA 24px target-size requirement or its spacing exception.

**Recommendation**

- Rename the flow “Personalize this browser” and remove password/email entry from the prototype.
- Offer only “Use for this session” and “Save a local profile,” with a plain-language storage/delete disclosure before collection.
- Compute brand inventory from the same merged catalog used by the feed. Hide or disable zero-inventory brands with an explanation.
- Make pagination dots at least 24×24px interactive targets while keeping an 8px visual indicator inside.

### Story reader

**What works**

- Opening a story updates to a shareable `/read/{storyId}/?from=...` route.
- Browser Back returned to `/hearst-plus/`.
- Focus returned to the exact story opener.
- Escape closed the reader.
- One H1 describes the active story.
- The reader preserves source branding, byline, date, save/comment actions, and complete body.

**Problems**

- On mobile, the app-level utility, logo, and category chrome remain visible alongside reader chrome. Two category rows are visible in the reader screenshot. This consumes about 170px before article content and makes it unclear which navigation controls the reader.
- The reader sets `aria-modal="true"` but only marks siblings inside the reader’s immediate parent inert. Global header/navigation outside that parent remain exposed.
- One pointer test of the visible close button did not close the reader; Escape did. This requires reproduction across pointer/touch browsers before being promoted beyond “possible issue.”
- A duplicate full-article request was observed when one article opened.

**Recommendation**

- Portal the reader to a single app-level overlay root and fully cover or remove app chrome while open.
- Use one shared modal isolation primitive.
- Retest the close button with real touch/pointer automation and add a regression test.
- Centralize article fetches in a request cache keyed by canonical source URL.

### Saved, empty, loading, success, and error states

**What works**

- Loading state uses `aria-busy`, a polite live region, skeletons, one main landmark, and one H1.
- Search has an explicit zero-result message.
- The end-of-river state says the reader is caught up.
- Video playback failure provides “Try again.”

**Problems**

- The Saved empty state says “Clear a brand filter or switch back to For You” even when no brand filter is active.
- It provides no direct Browse/For You call to action.
- “Trending Across Brands” renders as an empty card on the empty Saved route.
- “Story Source” and “Why Your River Looks Like This” dominate the screen instead of helping the reader save a first story.
- Progressive feed failures are only logged to the console; the user receives no partial-data/retry state.
- Full-article failure has no visible retry path in the audited reader code.

**Recommended copy**

- Heading: `Nothing saved yet`
- Body: `Save any story to build a reading list for later.`
- Primary action: `Browse For You`
- Secondary action: `Explore topics`
- Progressive failure: `You’re seeing a partial feed. Some stories couldn’t load.` / `Try again`
- Article failure: `We couldn’t load the full story.` / `Try again` / `Return to the feed`

### Visual system

**Strengths**

- 8px radii, borders, white/warm surfaces, blue accents, and typography roles are applied consistently.
- The product uses existing component primitives and token variables rather than scattered hex values in most audited reader surfaces.
- The feed maintains a clear image/headline/metadata/action hierarchy.
- Dark video treatment is visually coherent.
- Sampled small text on solid backgrounds produced no contrast ratios below 4.5:1.

**Inconsistencies to standardize**

- Modal implementations are duplicated across onboarding, search, account, reader, gallery, shorts, and games.
- Close buttons range from 28px to 44px.
- Focus styles vary between rings, outlines, color-only states, and explicit removal.
- Reader-facing cards and stakeholder/debug cards share the same visual prominence.
- Save, follow, more-like-this, and comment actions use several icon/text layouts and target sizes.

**Design-system recommendations**

- Standardize `ModalFrame`, `ScrollableDialog`, `StoryActionBar`, `EmptyState`, `HorizontalNav`, `CarouselSlide`, `FeedStatusNotice`, and `PrototypeDisclosure`.
- Define target-size tokens: 24px WCAG floor, 44px product default for primary touch controls.
- Define one focus-ring token with at least 2px visible stroke and sufficient non-text contrast.
- Separate “reader surface” from “prototype/debug surface” tokens and never render debug surfaces by default.

## 6. Accessibility audit

This is not a conformance statement. Findings combine current DOM/code evidence with manual keyboard and responsive checks. VoiceOver, NVDA, JAWS, TalkBack, high-contrast mode, 200%/400% zoom, and captions were not fully tested.

### Critical accessibility blockers

#### A11Y-P0-01: Prerecorded video has no captions or transcript

- **Where:** `AdaptiveVideo` and all video cards/readers.
- **Evidence:** `adaptive-video.tsx` renders a `<video>` without `<track>` support; the footer explicitly says caption and transcript coverage remains a production requirement.
- **Impact:** Deaf and hard-of-hearing readers cannot access spoken information. This conflicts with WCAG 1.2.2 and the product’s core video mode.
- **Fix:** Require a caption asset and transcript metadata before a video is eligible. Render `<track kind="captions">`, a transcript disclosure, and caption status. Gate or label videos that lack them.

### Serious issues

#### A11Y-P1-01: Modal background isolation is incomplete

- **Where:** Search, onboarding, account, and story reader.
- **Evidence:** DOM snapshots included background navigation/footer after the dialog. Search/onboarding do not set outside content inert. The reader only inerts siblings of its immediate parent, leaving global header/navigation outside that scope.
- **Impact:** Screen-reader and keyboard users can encounter content that sighted users perceive as unavailable. This creates confusion about reading order and modality.
- **Fix:** Portal all modal surfaces to an app-level root and use native `<dialog>.showModal()` or one tested primitive that inerts all outside content, traps focus, restores focus, and handles nested overlays.

This follows the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), which expects content outside an active modal to be inert.

#### A11Y-P1-02: Inactive carousel slides remain exposed

- **Where:** Featured stories on Home.
- **Evidence:** The DOM exposed five full slide buttons and five H2s while one slide was visually active.
- **Impact:** Screen-reader users must traverse stale/invisible content and may open a story they cannot see.
- **Fix:** Set inactive slides `inert` and `aria-hidden`, or render one active slide. Announce `Story X of Y` in a polite live region only after user-initiated changes.

#### A11Y-P1-03: Brand page dots are undersized

- **Where:** Onboarding step 3.
- **Evidence:** Source uses `h-2` / `w-2` for adjacent interactive page buttons.
- **Impact:** Fails WCAG 2.5.8 unless sufficient 24px spacing exists; the current 4px gap does not provide it.
- **Fix:** Use a minimum 24×24px button with the 8px dot as a child. This follows [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).

### Moderate issues

- No skip link was found.
- The masthead is not wrapped in a `header` landmark.
- Some source-brand links are only 17px high. They may qualify for the inline exception, but 24px minimum height is preferable on touch devices.
- Search exposes two “Close search” controls.
- Horizontal nav relies on clipping/scroll without an explicit edge cue.
- Validation errors use `role="alert"`, but inputs are not wired with `aria-invalid` and `aria-describedby`.
- The terms checkbox is 16×16px; the enclosing label expands the practical hit area, but this should be verified at 320px.

### Minor improvements

- Add `aria-label` to unlabeled navigation landmarks.
- Add current-position text to carousels and brand pagination that is not dependent on visual dots.
- Ensure every focusable element scrolled under sticky onboarding/footer chrome remains visible (WCAG 2.4.11).
- Test forced-colors mode for image-overlaid buttons and focus indicators.

### Confirmed strengths

- One `main` and one H1 on the tested feed route.
- No missing `alt` attributes in the sampled home DOM.
- No unnamed controls in the sampled home DOM.
- Search moves focus to the combobox.
- Onboarding moves focus to each step heading.
- Escape closes tested overlays.
- Browser Back and focus return worked for a story opened from Home.
- Reduced-motion handling exists globally and in major animated surfaces.
- Loading state uses `aria-busy` and polite announcements.

## 7. Responsive and cross-device audit

| Width | Observed behavior | Recommendation |
| --- | --- | --- |
| 320px | No page-level overflow. Destination/category rails clip horizontally. Feature card and 44px controls fit. Utility/profile control is only 24px high. | Add edge fades and auto-scroll active tabs into view. Preserve 44px masthead/search/menu targets. |
| 375px | Feed and dialogs fit. Story reader shows duplicated app/reader navigation. Search and onboarding are usable. | Make reader truly fullscreen; keep only reader-specific header and one category row. |
| 768px | No overflow. Continue-reading rail intentionally reveals partial next content. Feature becomes full-width and image-led. | Add explicit carousel semantics and preserve next-card cue. |
| 1024px | Three-column layout appears; center feature is narrow and headlines clamp aggressively. | Keep sidebars narrower or collapse one sidebar until more center width is available. |
| 1280px | Balanced three-column composition. | Preserve as the reference desktop breakpoint. |
| 1440px+ | Strong editorial scale and whitespace. | Cap line length and avoid increasing sidebars beyond current widths. |

### Component behavior requirements

- **Masthead:** 44px phone controls, one horizontally scrollable category row, active item automatically visible.
- **Feature carousel:** one accessible active slide; 44px controls on touch; pause auto-advance; no accidental open after swipe.
- **River cards:** one column through phone, image/headline hierarchy retained, action bar wraps without truncating labels.
- **Sidebars:** stack after the river on phone/tablet. Hide debug-only cards from reader routes.
- **Search:** 12–16px viewport inset, one visible close control, result list owns remaining height.
- **Onboarding:** scrollable content plus non-obscuring sticky action bar; 44px primary actions; page dots use 24px targets.
- **Reader:** full viewport, one header, body width capped for readable line length, route and Back behavior preserved.

## 8. Performance audit

### Confirmed findings

#### Full-catalog progressive loading

The client loops until `hasMore` is false:

- Editorial: 80 stories per request, observed offsets 0 through 960 (13 requests).
- Video: 36 videos per request, observed offsets 0 through 288 (9 requests).
- The same loading occurred on the empty Saved route.

Impact:

- More API work, JSON transfer, parsing, normalization, ranking, and React state updates than the visible experience requires.
- Higher mobile data and battery use.
- Memory growth from retaining complete editorial/video arrays.
- More opportunities for partial failures.

Fix:

- Fetch the first page only.
- Fetch subsequent pages from a real sentinel tied to visible demand.
- Stop prefetching when the tab is hidden, the route changes, or the active filter does not need the data.
- Build search on a server endpoint or a compact index rather than hydrating the whole catalog.
- Cache pages by destination/filter and cap retained pages.

#### Duplicate article fetch

Opening one Elle story issued the same `/api/live-article/?url=...` request twice.

Fix:

- Use one request cache keyed by canonical source URL.
- Share resolved article state between preview, reader, preload, and ambient reader.
- Abort only when no consumer remains.

#### Client module size

At audit time, `home-page.tsx` was 11,783 lines and exceeded 500 KB, causing Babel to deoptimize code generation. **Resolved threshold breach 2026-07-23:** the module is now 11,439 lines and 489,984 bytes after capability-based extraction. It remains a large client module and should continue to be reduced incrementally.

Fix:

- Split by user capability, not arbitrary line count.
- Dynamically import onboarding, search, reader, gallery, shorts, games, and prototype controls.
- Keep server-derived feed composition out of the primary client module.

#### Fonts

The build requires live Google Fonts fetches for five families. The first sandboxed build failed when those requests were unavailable.

Fix:

- Self-host approved font assets or commit a reliable local font package.
- Keep `font-display: swap`.
- Preload only the default UI/headline faces needed above the fold.

### Quick wins

- Stop whole-catalog loading on Saved and non-video routes.
- Deduplicate live-article requests.
- Lazy-load non-open overlays.
- Replace two raw `<img>` usages reported by lint with `next/image` where appropriate.
- Add a user-visible partial-feed retry state instead of console-only warnings.

### Metrics requiring a production-like run

- LCP by route and content type.
- INP for carousel, save, search typing, dialog open, and reader navigation.
- CLS during image/font hydration and progressive feed insertion.
- JavaScript transferred/executed by route.
- Heap size after five minutes of progressive loading.
- API request count and bytes per session.

## 9. Frontend code-quality audit

### Major issues

#### Monolithic client component

- **File:** `src/components/home-page.tsx`
- **Original problem:** 11,783 lines combined navigation, search, onboarding, feed ranking, video, carousel, article fetching, modal focus, reader, gallery, comments, games, prototype controls, and progressive data loading.
- **Current state:** 11,439 lines and 489,984 bytes. Utility navigation and the self-contained stakeholder rules/technology guides now have explicit feature modules. Babel no longer deoptimizes the file.
- **Remaining risk:** The reader, search, onboarding, carousel, video, games, and river still create high regression probability and difficult ownership inside one client boundary.
- **Incremental change:** Continue extracting one tested user capability at a time behind unchanged props.

#### Lint is not a working quality gate

- **Evidence:** 18 current errors, mainly synchronous state updates inside effects, plus two warnings after the first feature extraction.
- **Risk:** Cascading renders and performance regressions can merge despite a passing build.
- **Change:** Establish a route-focused lint target in CI; fix by feature extraction rather than blanket rule suppression.

#### No application tests

- **Evidence:** no `*.test.*` or `*.spec.*` files were found.
- **Risk:** Router, focus restoration, personalization, local storage, progressive loading, and reader queue behavior are fragile.
- **Change:** Add unit tests for pure ranking/search helpers, component tests for overlays/forms, and Playwright journeys.

#### API error handling

- `story-feed` and `video-feed` route handlers do not wrap upstream failures.
- The client catches progressive failures but only logs warnings.
- Add stable error responses, request IDs, safe logging, retry/backoff policy, and UI partial-state handling.

#### Prototype identity model

- Password-derived data is stored in localStorage and “Google” creates a hard-coded local identity.
- This must remain demo-only and should not imitate production authentication.

### Example implementation directions

```ts
// Search: prefer whole-word token scoring.
const queryTokens = tokenize(query);
const titleTokens = tokenize(story.title);
const exactTokenMatches = intersection(queryTokens, titleTokens).length;
const prefixMatches = queryTokens.filter((queryToken) =>
  titleTokens.some((titleToken) => titleToken.startsWith(queryToken))
).length;
```

```ts
// Feed: page only when the real sentinel is reached.
if (!sentinelVisible || !page.hasMore || requestInFlight) return;
loadNextPage({ destination, filter, cursor: page.nextOffset });
```

```tsx
// Video eligibility.
if (!story.captions?.src || !story.transcript) {
  return <VideoUnavailableReason reason="Captions are not available for this prototype video." />;
}
```

## 10. Functional QA matrix

| Area | Happy path | Edge/failure cases | Current status |
| --- | --- | --- | --- |
| Feed entry | Load first usable stories | upstream failure, slow feed, stale cache | Happy path passed; partial failure has no UI |
| Search | Query and open result | punctuation, word fragments, zero results, keyboard wrap | Zero state passed; relevance failed for `Audi` |
| Onboarding | Select 3 interests + 2 brands | zero-count brands, skip each step, close/reopen, Back | Core path passed; data/trust issues found |
| Local profile | Create/resume/delete | duplicate email, bad password, storage blocked, corrupted JSON | Code handles mismatch/corrupt JSON; sensitive-data model is unacceptable |
| Saved | Save then revisit | empty state, removed source story, multi-tab changes | Empty state reviewed; multi-tab sync untested |
| Reader | Open, scroll, close, Back | source fetch failure, direct URL, rapid story switching | Back/Escape/focus return passed; close pointer requires retest |
| Video | Play, pause, retry | missing captions, HLS failure, data saver, reduced motion | Playback card present; captions/transcript absent |
| Gallery | Open, swipe, close | single image, failed image, zoom, orientation | Requires dedicated test |
| Multiple tabs | Save/profile in two tabs | storage event conflict, stale session | Untested; current code has no storage-event synchronization |
| Offline | Cached shell/feed | reader open, save, recovery | Untested; no offline strategy found |
| Large data | Paginate progressively | memory growth, duplicate pages, non-advancing cursor | Cursor guard exists; current loop eagerly loads all pages |
| Auth expiry | Resume local profile | cleared storage, mismatched session ID | Local-only; no production session |
| Unauthorized | Protected actions | profile-only comment/collection | Prototype-only; requires production design |
| Accessibility | Keyboard and screen-reader path | modal isolation, inactive slides, captions | Several serious blockers found |

## 11. Trust, privacy, and security review

### Confirmed findings

- Email, names, comments, collections, preferences, and password hash are stored in browser `localStorage`.
- Password hashing is a single SHA-256 digest without salt or work factor.
- The UI requires Terms/Privacy acceptance for a local-only profile, but those links are not connected in the checkbox copy.
- The prototype note exists below the form and in the footer, after production-like account labels have already set expectations.
- The live-article API validates source URLs before server-side fetch, which is a positive SSRF boundary.
- Reader return URLs are normalized to safe in-app paths.

### Risks requiring technical verification

- Content Security Policy, frame restrictions, permissions policy, cookie settings, and production response headers.
- Abuse prevention for comments if a server-backed identity/community system is added.
- Rate limiting and caching on feed/article APIs.
- Source HTML sanitization guarantees in the live-article extraction/rendering pipeline.
- Third-party media privacy behavior and tracking.

### Recommendation

For the prototype, collect no real credentials. Use a local nickname and an optional non-sensitive demo identifier. If production identity is introduced later, replace the local provider completely with a server-backed, reviewed authentication and consent architecture.

## 12. Product and conversion audit

### Value and differentiation

The best differentiation is not “many Hearst brands.” It is a high-quality daily reading package that explains why each story fits, keeps the reader inside a complete article experience, and lets them tune the feed without managing publishers.

### Conversion friction

- Five onboarding steps are defensible only if recommendations visibly change afterward.
- Brand counts of zero reduce confidence before the value is demonstrated.
- Asking for a password in a prototype is disproportionate friction and risk.
- Saved lacks a purposeful first-use path.
- Search false positives weaken confidence in a large content catalog.

### Retention opportunities

- Show a concise “Your feed changed” confirmation after onboarding with three examples.
- Make Continue Reading the strongest returning-user cue.
- Offer one daily-edition timestamp and a clear “new since your last visit” marker.
- Let readers edit interests at any time without entering account UI.
- Explain recommendations inline, but keep stakeholder scoring details behind a debug mode.

### Avoid

- Streak pressure, artificial urgency, manipulative notifications, or forced account creation.
- Brand-count vanity metrics in place of reader value.
- Hiding prototype limitations below the fold.

## 13. Analytics and measurement recommendations

The prototype currently has no production analytics integration.

### Metrics

- **Primary success metric:** weekly retained readers with at least three qualified reads (for example, ≥50% article progress or ≥60 seconds active reading) across two or more sessions.
- **Supporting:** second-story rate, save rate, search success, onboarding completion, follow/edit rate, video completion, and return-to-continue-reading.
- **Guardrails:** p75 LCP/INP/CLS, API error rate, zero-result rate, caption availability, keyboard completion, modal escape rate, privacy-disclosure comprehension, and user-reported relevance.

### Event plan

| Event | Trigger | Important properties | Why |
| --- | --- | --- | --- |
| `feed_viewed` | Stable first feed render | destination, filter, signed-in mode, story_count, source_state | Denominator for discovery |
| `story_impression` | Story meaningfully visible | story_id, rank, module, reason, brand, topic | Ranking exposure |
| `story_opened` | Reader opens | story_id, origin, rank, media_type | Entry conversion |
| `reader_progressed` | 25/50/75/100% | story_id, percent, active_seconds | Qualified reading |
| `reader_closed` | Close/Back/Escape | method, progress, next_story_opened | Exit quality |
| `search_submitted` | Debounced query produces results | query_length, token_count, result_count | Search health without raw query retention |
| `search_result_selected` | Result opens | result_rank, match_type, result_count | Relevance |
| `search_zero_results` | No result state | token_count, category_context | Taxonomy gaps |
| `onboarding_started` | Step 1 opens | origin, destination | Funnel entry |
| `onboarding_step_completed` | Continue action | step, selection_count | Drop-off |
| `onboarding_abandoned` | Close/skip | step, method | Friction |
| `preference_changed` | Follow/more-like/hide | action, topic_or_brand, origin | Explicit tuning |
| `save_toggled` | Save/remove | state, story_id, origin | Library adoption |
| `video_started` | Playback starts | story_id, caption_available, autoplay | Video access |
| `video_completed` | ≥90% | story_id, caption_used, duration | Video value |
| `feed_page_requested` | Pagination request | destination, offset, reason, visible_sentinel | Detect runaway loading |
| `api_failed` | User-impacting API failure | endpoint_family, status, retry_count | Reliability |
| `web_vital` | Web-vitals callback | metric, value, route, device_class | Performance guardrail |
| `a11y_client_error` | Focus trap/label invariant fails | component, invariant | Regression signal, not conformance proof |

Do not send email, passwords, full search strings, comments, or source article content to analytics.

## 14. Competitor and best-practice comparison

### Apple News

[Apple News](https://www.apple.com/apple-news/) communicates trusted sources, personalized interests, on-device recommendation privacy, and a clear privacy promise. Hearst+ already has stronger visible recommendation controls (“More like this,” follow, save), but its local-account presentation is less trustworthy because it imitates production identity.

Appropriate pattern:

- Put a plain-language privacy/personalization promise near the first decision.

Avoid:

- Copying a generic news hierarchy; Hearst+ should remain practical and lifestyle-led rather than breaking-news-led.

### Flipboard

[Flipboard](https://about.flipboard.com/how-it-works/) makes topic following, tuning, “why am I seeing this,” and daily editions explicit. Its [personalization guidance](https://about.flipboard.com/inside-flipboard/how-to-personalize-flipboard/) also makes “why am I seeing this” and “show less like this” explicit. Hearst+ already has comparable ingredients, but scatters them between onboarding, debug cards, and action rows.

Appropriate patterns:

- Make tuning always available from the feed.
- Explain recommendations in reader language.
- Keep a distinct daily package plus topic feeds.

Avoid:

- Social/community complexity unless moderation, abuse controls, identity, and governance exist.

### Google personalized recommendations

[Google’s personalized recommendations documentation](https://support.google.com/websearch/answer/17026260?hl=en) connects personalized feeds to account activity and settings. Hearst+ should be more explicit because its state is local and temporary.

### Differentiation opportunity

Hearst+ can outperform broad aggregators through:

- Complete, high-quality in-app article reading.
- Brand-native visual identity without brand-first navigation.
- Useful lifestyle “missions” such as dinner, wellness, home, style, and buying decisions.
- Strong editorial curation plus understandable personalization.

## 15. Prioritized findings

| ID | Area | Page or component | Finding | Evidence | User impact | Recommendation | Severity | Effort | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0-01 | Trust/security | Local profile/auth | Production-like email/password flow stores a single SHA-256 hash and account data in localStorage | `reader-account.tsx:6-8,78-97,123-152`; screenshot 14 | Users may enter reused credentials into an insecure demo | Remove password/email auth from prototype; use non-sensitive local profile | P0 | Medium | Confirmed |
| P0-02 | Accessibility | Video player/feed | No captions or transcript implementation | `adaptive-video.tsx:135-146`; prototype note | Deaf/HoH users cannot access core video content | Require captions/transcript for eligibility and render controls | P0 | Large | Confirmed |
| P1-01 | Performance | Progressive feed loading | **Resolved 2026-07-23:** whole editorial and video catalogs previously loaded automatically in 22 requests | `home-page.tsx`; `hearst-plus/use-progressive-feed.ts`; local request-budget trace | Removed automatic data, battery, CPU, memory, and API cost | Demand-driven pagination is implemented; bounded DOM/cache virtualization remains a follow-up for unusually long sessions | P1 | Medium | Confirmed |
| P1-02 | Performance | Article reader | **Resolved 2026-07-23:** gallery preview and reader previously requested the same full article twice | Shared-cache unit tests; mobile preview-to-reader and desktop direct-reader traces | Removed duplicate transfer, parsing, upstream work, and request races | Shared bounded request cache keyed by canonical source URL | P1 | Medium | Confirmed |
| P1-03 | Accessibility | Search/onboarding/account/reader dialogs | **Resolved 2026-07-23:** backgrounds previously remained semantically exposed while `aria-modal=true` | Live DOM checks at 390px; shared isolation stack; nested reader-layer implementation | Background content is now pointer-, keyboard-, and screen-reader-inert while the top layer remains operable | Shared body-level portal target and nested modal isolation stack | P1 | Large | Confirmed |
| P1-04 | Accessibility | Featured carousel | **Resolved/verified 2026-07-23:** inactive slides are `inert`, `aria-hidden`, and removed from sequential focus | Live five-slide DOM check at 390px: one exposed slide, four inert slides with `tabIndex=-1` | Screen readers and keyboard users encounter only the active story | Preserve current active-slide semantics in regression tests | P1 | Medium | Confirmed |
| P1-05 | Search | Search dialog | **Resolved 2026-07-23:** raw substring matching previously returned `Audience`, `Saudi`, and `Audiobooks` for `Audi` | Search unit tests and live query returned only `2026 Audi Q3 Overview` | Search results now align with word-level intent | Unicode token scoring ranked title, brand, topic, then tag with bounded long-prefix support | P1 | Medium | Confirmed |
| P1-06 | Onboarding | Brand selection | **Resolved 2026-07-23:** capped page data previously showed false zero inventory | Full generated-catalog counts; live onboarding check showed real counts across 29 brands | Readers can make an informed brand choice without selecting empty sources | Use the full static eligible inventory without adding background feed requests; disable true zero-inventory brands | P1 | Medium | Confirmed |
| P1-07 | Trust/content | Onboarding | “Create Account,” “Sign In,” “Create Free Account” conflict with local-demo truth | `home-page.tsx:1464-1469,1686-1689,1761-1779`; screenshots 11/14 | Hesitation and false trust signals | Rename to local/session actions | P1 | Small | Confirmed |
| P1-08 | Responsive UX | Mobile reader | **Resolved 2026-07-23:** the inline reader previously allowed app chrome to remain exposed | Live geometry: reader root and surface both 320×700 at 320px; desktop surface remains inset at 1440px | Mobile now has one clear reader navigation layer and the full viewport for reading | Reader is a body-level full-screen portal on mobile with isolated app chrome | P1 | Medium | Confirmed |
| P1-09 | Product/content | Saved | Empty state has no CTA and is followed by empty/debug cards | `home-page.tsx:10886-10994`; screenshot 15 | New users cannot build saving habit | Purpose-built empty state; hide debug cards | P1 | Small | Confirmed |
| P1-10 | Accessibility | Brand pagination | **Resolved 2026-07-23:** brand-page dots now use 24×24px controls around the visual indicator | Onboarding DOM and source inspection | Pagination is easier to operate by touch and for users with limited dexterity | Preserve 24px minimum control target | P1 | Small | Confirmed |
| P1-11 | Maintainability | HomePageTemplate | **Threshold breach resolved 2026-07-23:** reduced from 503,880 bytes/11,742 current pre-extraction lines to 489,984 bytes/11,439 lines; Babel no longer deoptimizes code generation | `wc -l -c`; repeated ESLint path; passing production build | Removes immediate toolchain deoptimization and creates explicit utility/stakeholder feature boundaries | Continue incremental capability extraction; do not treat the remaining 11K-line module as finished architecture | P1 | Large | Confirmed |
| P1-12 | Quality | Audited route | **Resolved 2026-07-23:** focused lint now reports zero errors and zero warnings; an explicit unit-test command discovers and passes 11 tests | ESLint, Node test, TypeScript, production build, and live browser output | State-reset, cache, search, and stable-order regressions now have enforceable local gates | Preserve the focused lint and `test:unit` gates; add component/E2E coverage incrementally | P1 | Large | Confirmed |
| P2-01 | Error recovery | Progressive feed | Failures are console-only | `home-page.tsx:11348-11353,11429-11434` | Partial feed is unexplained | Visible partial-feed state + retry | P2 | Medium | Confirmed |
| P2-02 | Accessibility | Page shell | No skip link and no `header` landmark found | DOM audit | Extra navigation effort | Add skip link and semantic header | P2 | Small | Confirmed |
| P2-03 | Responsive | Mobile nav | Scrollable navigation clips without strong cue | screenshots 02/03 | Categories are undiscoverable | Edge fade and active-item positioning | P2 | Small | Confirmed |
| P2-04 | Accessibility | Search dialog | Two identical “Close search” controls | DOM snapshot; `home-page.tsx:2334-2364` | Ambiguous screen-reader control | Make backdrop non-semantic | P2 | Small | Confirmed |
| P2-05 | Forms | Local profile | Errors are alerts but fields lack `aria-invalid`/describedby | `reader-account-ui.tsx:175-200,277-321` | Harder error recovery | Per-field errors and focus first invalid | P2 | Medium | Confirmed |
| P2-06 | Reliability | Feed APIs | Story/video API routes lack stable catch/error response | API route source | Uncontrolled 500s | Structured errors, cache, timeouts | P2 | Medium | High confidence |
| P2-07 | Performance | Fonts | Build depends on five live Google Font fetches | `layout.tsx`; first build failure | Build/network fragility | Self-host and subset fonts | P2 | Medium | Confirmed |
| P2-08 | Navigation | Reader close | One pointer click did not close; Escape did | Browser reproduction | Possible abandonment | Reproduce on touch/pointer and test | P2 | Requires investigation | Requires testing |
| P3-01 | Polish | Touch targets | Several metadata/footer links are under 24px high | DOM measurement | Fine-motor friction | Increase target padding where not inline | P3 | Small | High confidence |
| P3-02 | Measurement | Whole product | No production analytics implementation | Code search and product blueprint | Product value cannot be measured | Privacy-safe event plan | P3 | Large | Confirmed |

## 16. Action plan

### Top 10 issues

1. Remove password/email credential collection from the browser-local prototype.
2. Add captions and transcripts or remove ineligible videos from core surfaces.
3. Stop automatic full-catalog story/video loading. **Completed 2026-07-23.**
4. Deduplicate full-article fetches. **Completed 2026-07-23.**
5. Fix modal semantic isolation and focus containment.
6. Hide inactive feature slides from assistive technology.
7. Replace substring search with token-aware relevance.
8. Correct onboarding brand inventory.
9. Make the mobile reader truly fullscreen with one navigation layer.
10. Replace Saved debug panels with an actionable empty state.

### Quick wins (one day or less each)

- Rewrite account/local-profile labels.
- Add a Browse For You CTA to Saved.
- Hide empty Trending and debug cards on Saved.
- Increase brand pagination hit areas to 24px.
- Make search backdrop non-semantic.
- Add a skip link and `header` landmark.
- Add `aria-invalid` and field error associations.
- Stop video pagination on non-video filters.

### 30-day plan

Week 1:

- Resolve both P0s or explicitly gate the affected features.
- Add modal, search, Saved, and onboarding regression tests.
- Correct local-profile copy and brand counts.

Week 2:

- ~~Change catalog loading to demand-driven pages.~~ Completed 2026-07-23.
- Add request deduplication and visible partial-feed recovery.
- Measure request/byte/heap reduction.

### 2026-07-23 implementation record: P1-01

- Removed both browser-idle loops that continued until editorial and video `hasMore` became false.
- Added a shared demand-driven loader with cursor validation, request deduplication, route/filter cancellation, hidden/offline abort behavior, and retryable error state.
- Connected server pagination to the existing river sentinel. Pages load only when fewer than nine loaded stories remain beyond the rendered batch.
- Disabled editorial pagination for empty Saved and disabled video pagination outside the Videos experience.
- Verified zero pagination requests before scrolling on Home, Saved, and Videos.
- Verified the first editorial demand requested offset `0`, a second request did not occur until the added page was consumed, and the next request advanced to offset `80`.
- Verified the mobile Videos river requested `/api/video-feed/` only after sentinel demand.
- Verified responsive rendering at 390px and 1280px.
- TypeScript, the focused loader lint check, and the production build pass.

**Files changed**

- `src/components/home-page.tsx`
- `src/components/hearst-plus/use-progressive-feed.ts`
- `APP_RULES.md`
- `DECISION_LOG.md`
- `src/app/hearst-product-blueprint/page.tsx`
- `src/app/why-hearst-plus/page.tsx`
- `APP_AUDIT.md`
- `IMPROVEMENT_PLAN.md`

**Remaining regression watch**

- Very long sessions still retain every user-requested page because removing already-rendered stories would disturb scroll position and reader queues. Add virtualization only with dedicated reader/search regression coverage.

### 2026-07-23 implementation record: P1-02

- Replaced independent gallery-preview and reader-queue network calls with one client article loader.
- Canonicalizes source URLs by removing fragments and sorting query parameters.
- Shares one in-flight promise across concurrent consumers and reuses resolved articles.
- Keeps the 32 most recently used resolved articles and evicts older entries.
- Does not cache failed requests, allowing later consumers to retry.
- Prevents component cleanup from canceling shared work still needed by another consumer.
- Verified four focused cache tests: canonicalization, concurrent deduplication and reuse, failure retry, and bounded eviction.
- Verified a previewed gallery opened in the mobile reader with one request per source.
- Verified the referenced Harper’s Bazaar desktop reader requested its article exactly once.
- Verified responsive reader rendering at 390px and 1280px.
- TypeScript, focused cache lint, and the production build pass.

**Files changed**

- `src/components/home-page.tsx`
- `src/lib/live-article-client-cache.ts`
- `src/lib/live-article-client-cache.test.ts`
- `APP_RULES.md`
- `DECISION_LOG.md`
- `APP_AUDIT.md`
- `IMPROVEMENT_PLAN.md`

**Regression watch**

- The cache deliberately does not cancel in-flight article requests after the initiating component unmounts because another consumer may still need the same promise. The 32-entry resolved limit bounds retained content; production telemetry should confirm the chosen limit under long reader sessions.

### 2026-07-23 implementation record: P1-03, P1-04, P1-05, P1-06, P1-08, and P1-10

- Added one shared modal-isolation stack for search, the mobile menu, onboarding, account/profile, the standard reader, Ambient Reader, and the fullscreen gallery.
- Portaled onboarding, account/profile, and the standard reader directly to `document.body`; only the top modal layer remains exposed and the prior body overflow and background semantics are restored after close.
- Removed semantic backdrop buttons so search and other overlays expose one named close control.
- Kept the mobile reader surface flush to the 320px and 390px viewports while preserving the inset, 1360px-max desktop reader at 1440px.
- Verified the existing featured carousel exposes exactly one active slide; four inactive slides are `inert`, `aria-hidden`, and `tabIndex=-1`.
- Replaced substring search with normalized Unicode word tokens and deterministic title, brand, topic, and tag ranking. `Audi` now returns the Audi story without `Audience`, `Saudi`, or `Audiobooks` false positives.
- Derived onboarding counts from the full generated eligible catalog, avoiding any additional live-feed requests at modal open. True zero-inventory brands are disabled and explained.
- Increased onboarding brand pagination controls to 24×24px targets.
- Passed eight focused request-cache/search tests, TypeScript, focused lint for the new shared utilities, and the production build.

**Files changed**

- `src/components/home-page.tsx`
- `src/components/reader-account-ui.tsx`
- `src/components/ui/use-modal-isolation.ts`
- `src/lib/story-search.ts`
- `src/lib/story-search.test.ts`
- `src/lib/hearst-story-inventory.ts`
- `src/app/hearst-plus/page.tsx`
- `src/app/hearst-destination-category-page.tsx`
- `src/app/hearst-section-brand-page.tsx`
- `src/app/hearst-lifestyle/page.tsx`
- `src/app/hearst-autos/page.tsx`
- `src/app/hearst-flux/page.tsx`
- `src/app/hearst-ew/page.tsx`
- `APP_AUDIT.md`
- `IMPROVEMENT_PLAN.md`
- `APP_RULES.md`
- `DECISION_LOG.md`

**Regression watch**

- Escape and focus restoration must continue to close only the top layer when the fullscreen gallery is opened from Ambient Reader.
- iOS Safari body-locking and the 100dvh reader surface still require physical-device testing.
- Word-boundary matching intentionally reduces recall for short prefixes and typos; search telemetry and usability testing should determine whether a bounded typo strategy is needed.
- Onboarding counts represent the generated eligible catalog and can change after catalog refreshes; selection must remain stable if the displayed count changes between visits.

### 2026-07-23 implementation record: P1-11 module-size threshold

- Extracted utility navigation into `src/components/hearst-plus/utility-bar.tsx`, including its account state, destination-state mapping, and destination-link definitions.
- Extracted the self-contained personalization-rules and technology guides into `src/components/hearst-plus/lifestyle-technology-guide.tsx`.
- Removed direct package-manifest ownership from `home-page.tsx`; the technology guide now owns the dependency-version labels it renders.
- Reduced `home-page.tsx` from 503,880 to 489,984 bytes and from 11,742 to 11,439 lines in the current working tree.
- Re-ran the same ESLint path and confirmed Babel no longer reports deoptimized code generation.
- Passed TypeScript, lint for both extracted modules, eight focused tests, and the optimized production build.
- Verified utility navigation, active destination state, search, reader geometry, and the extracted stakeholder guides at 320px and 1440px.

**Files changed for this extraction**

- `src/components/home-page.tsx`
- `src/components/hearst-plus/utility-bar.tsx`
- `src/components/hearst-plus/lifestyle-technology-guide.tsx`
- `APP_AUDIT.md`
- `IMPROVEMENT_PLAN.md`
- `DECISION_LOG.md`

**Regression watch**

- Destination selection in the utility bar must remain correct on every destination and publication route.
- Package dependency names used by the technology guide remain compile-time contracts; renaming or removing one must update the guide.
- The threshold warning is resolved, but `home-page.tsx` remains an 11K-line client module. Search, onboarding, reader, gallery, video, games, and river extraction remain architectural work, not optional polish.

### 2026-07-23 implementation record: P1-12 quality gate

- Removed the remaining synchronous state resets from onboarding, search, gallery preview, featured stories, Delish Shorts, comments, reader routing, profile/account dialogs, brand filters, and visible-feed pagination.
- Replaced prop-to-state synchronization with scoped state or remount boundaries so a changed story, route, account, filter, or dialog session starts from the correct value without a cascading effect render.
- Preserved loaded story positions with a tested stable-order merge that appends new IDs without reshuffling existing cards.
- Replaced two unoptimized profile-library `<img>` elements with explicit-size Next images.
- Added `npm run test:unit`; it discovers and passes 11 cache, search, and stable-order tests.
- Focused ESLint passes with zero errors and zero warnings. TypeScript and the optimized production build pass.
- Live verification at 320px confirmed onboarding advances to step 2, closes, and reopens at step 1. At 1280px, a complete article opened in the isolated reader with no browser errors.

**Files changed for this fix**

- `src/components/home-page.tsx`
- `src/components/reader-account-ui.tsx`
- `src/lib/stable-story-order.ts`
- `src/lib/stable-story-order.test.ts`
- `package.json`
- `APP_AUDIT.md`
- `IMPROVEMENT_PLAN.md`
- `DECISION_LOG.md`

**Regression watch**

- Closing authentication or profile dialogs now intentionally discards unsaved draft fields because each open is a new dialog session.
- Changing route, account, or filter scope now derives the new initial state immediately; future persistence work must not reuse state from the previous scope.
- The stable-order merge must continue appending new feed pages without re-ranking cards already visible to the reader.

Week 3:

- Consolidate modal behavior and fix carousel accessibility.
- Simplify mobile reader chrome.
- Run keyboard, VoiceOver, NVDA, TalkBack, zoom, and forced-colors checks.

Week 4:

- Establish route-focused CI lint/test gates.
- Instrument privacy-safe prototype analytics in a non-production test environment.
- Run five moderated usability sessions focused on first-use value, personalization trust, Saved, and search.

### 60–90-day plan

- Extract search, onboarding, reader, gallery, video, and prototype/debug controls from `home-page.tsx`.
- Define a production identity/consent plan before introducing real accounts.
- Build a compact server-side search index and ranking evaluation set.
- Define caption/transcript ingestion and video eligibility contracts.
- Add production-like Web Vitals and network budgets.
- Establish feed-quality monitoring: empty brands, stale feeds, duplicates, missing bylines/media/captions, and ranking diversity.

### Recommended tests

#### Usability

- Five first-time readers: explain what Hearst+ is after 10 seconds.
- Complete personalization without facilitator help.
- Find and save a known story, then return to it.
- Interpret “why this story” and change a recommendation.
- Compare current and simplified mobile reader chrome.

#### Accessibility

- Keyboard-only journeys for search, onboarding, Saved, reader, gallery, and profile.
- VoiceOver/Safari, NVDA/Firefox or Chrome, TalkBack/Chrome.
- 200% and 400% zoom/reflow.
- Reduced motion and forced colors.
- Captions/transcript completeness and synchronization.

#### Technical

- Pagination request budget per route.
- Heap growth after 10 minutes.
- Duplicate-request assertions.
- Offline/slow 3G/upstream 500/partial response.
- Route Back/Forward, refresh while reader is open, direct shared reader URL.
- Multiple tabs and local-storage conflict.

#### Experiments

- Three-step personalization versus five-step flow.
- Interest-first onboarding with brands deferred until after first value.
- Reader-facing “why this story” versus current debug/sidebar explanation.
- Saved empty-state CTA variants.

### Strengths to preserve

- Image-led editorial hierarchy.
- Complete in-app article reading.
- Visible brand/topic/byline provenance.
- Topic-first navigation.
- Safe reader return URLs and Back behavior.
- Focus restoration to the story opener.
- Clear search zero-result messaging.
- One main/H1 feed structure.
- No tested page-level overflow.
- AA-readable sampled text colors.
- Reduced-motion support.
- Honest prototype disclosure—moved earlier and made consistent.

## Challenge to this audit

The following conclusions need more evidence before final implementation decisions:

- The visible reader close-button failure reproduced once; it needs cross-browser pointer/touch confirmation.
- Local development request timing is not production timing. Request count and duplication are confirmed, but LCP/INP/CLS impact must be measured in a production-like build.
- The “0 stories” brand count is confirmed in the UI and code path, but the correct source-of-truth inventory must be agreed with editorial/data owners.
- Hiding all zero-inventory brands may reduce awareness of future catalog breadth; user research should compare hidden, disabled, and “coming soon” treatments.
- A shorter onboarding is likely better, but the minimum number of preference signals needed for ranking quality requires an offline relevance evaluation.
- Removing debug cards improves the reader experience, but stakeholders may still need them. A gated prototype/debug mode is preferable to deleting them.
- Search tokenization will improve precision for `Audi`, but recall for compounds, accents, pluralization, and typos needs a test query set.
- Competitor patterns are context, not proof. Hearst+ should preserve its editorial and practical lifestyle differentiation rather than copy a generic news aggregator.
