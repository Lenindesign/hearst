---
status: historical
snapshot_date: 2026-07-23
superseded_by: APP_RULES.md, DECISION_LOG.md
---

# Hearst+ Prioritized Improvement Plan

> Historical plan based on the dated application audit. It is not a current backlog or authorization to implement.

This plan is based on `APP_AUDIT.md`. It does not authorize implementation or deployment. P0 work should begin only after product/security/accessibility owners agree on the intended prototype boundary. Large and architectural work requires approval.

## Priority order

### Phase 0: Gate unsafe or inaccessible behavior

#### P0-01 — Remove credential-like local authentication

**Outcome**

The prototype no longer asks readers to enter a real email/password into browser-local storage.

**Files to change**

- `src/components/home-page.tsx`
- `src/components/reader-account-ui.tsx`
- `src/components/reader-account.tsx`
- `src/app/hearst-product-blueprint/page.tsx`
- `PRODUCT.md`
- `APP_RULES.md`

**Recommended implementation**

- Replace “Create Account,” “Sign In,” and “Create Free Account” with:
  - `Use for this session`
  - `Save a local profile`
  - `Resume local profile`
- Store only a non-sensitive nickname, preferences, saves, and comments.
- Do not collect email or password.
- Add a clear `Delete local data` action.
- If production identity is required, design and review a separate server-backed system; do not evolve the local provider into production.

**Regression risks**

- Existing browser-local demo accounts become unreadable.
- Stakeholder demos that rely on the fake Google/account flow change.
- Saved collections/comments may lose their current owner key.

**Required tests**

1. New profile requires no email/password.
2. Profile survives refresh in the same browser when explicitly saved.
3. Session-only preferences do not persist after local data is cleared.
4. Delete removes every Hearst+ storage key.
5. Existing legacy storage is migrated or safely ignored without crashing.
6. Screen-reader copy states “browser-local” before any data entry.
7. No password/email values exist in localStorage, sessionStorage, logs, or analytics.

#### P0-02 — Make video content accessible

**Outcome**

Every eligible prerecorded video has synchronized captions and an accessible transcript.

**Files to change**

- `src/components/adaptive-video.tsx`
- `src/components/home-page.tsx`
- `src/components/lifestyle-river-types.ts`
- `src/lib/live-feed-types.ts`
- `src/lib/personalize-live-feed.ts`
- `src/app/api/video-feed/route.ts`
- feed fixture/data generation scripts under `scripts/`
- video-related Storybook stories/fixtures under `src/stories/`

**Recommended implementation**

- Add caption URL, language, label, and transcript fields to the feed contract.
- Require captions for production eligibility.
- Render `<track kind="captions" default>` when appropriate.
- Provide a transcript disclosure next to the player.
- Expose caption availability in cards/search before open.
- Keep an explicit unavailable state for prototype videos without captions.

**Regression risks**

- Video inventory may shrink sharply.
- HLS sources may expose captions differently from MP4.
- Transcript content may change card/reader height.
- Autoplay behavior may conflict with caption defaults.

**Required tests**

1. Keyboard can enable/disable captions.
2. Captions are synchronized and readable at 320/375/768/1440px.
3. Transcript is reachable, structured, and follows video order.
4. Caption language/label is announced correctly.
5. Missing-caption videos are gated or clearly unavailable.
6. HLS and MP4 paths both work.
7. Reduced motion, data saver, and playback error states remain usable.
8. WCAG 1.2.2 review with Deaf/HoH participants or specialist validation.

## Phase 1: Fix serious usability, accessibility, and performance issues

### P1-01 — Demand-driven feed pagination

**Status: implemented 2026-07-23**

**Files changed**

- `src/components/home-page.tsx`
- `src/components/hearst-plus/use-progressive-feed.ts`
- `APP_RULES.md`
- `DECISION_LOG.md`
- `src/app/hearst-product-blueprint/page.tsx`
- `src/app/why-hearst-plus/page.tsx`
- `APP_AUDIT.md`
- `IMPROVEMENT_PLAN.md`

**Implemented**

- Retained the compact initial server payload.
- Requests another page only when the real river sentinel is visible and the loaded buffer is nearly exhausted.
- Pauses when hidden/offline and aborts on route/filter change.
- Deduplicates pages by canonical story identity and rejects non-advancing cursors.
- Does not load video pages outside the Videos experience.
- Shows a partial-feed message and Retry action after request failures.

**Regression risks**

- Search and reader queues currently assume broad inventory.
- Brand switching may show fewer immediate stories.
- Related-story and Ambient Reader queues may need separate bounded prefetch.
- Long user-driven sessions still require virtualization before old rendered pages can be evicted safely.

**Validation completed**

- Home, Saved empty, and Videos each made zero pagination requests before scrolling.
- Repeated sentinel demand produced one editorial offset-0 request; offset 80 was requested only after the first added page was consumed.
- Mobile Videos requested only the video endpoint after demand.
- Non-advancing cursors stop in the shared loader.
- Filter/route changes and hidden/offline state abort stale work.
- Slow/500 responses use the visible partial-feed Retry state.
- TypeScript and the focused new loader lint check pass.
- The production build passes.
- Responsive browser checks pass at 390px and 1280px.

**Follow-up test**

- Measure heap and scroll stability under 20 demanded pages before introducing virtualization or page eviction.

### P1-02 — Deduplicate article requests

**Status: implemented 2026-07-23**

**Files changed**

- `src/components/home-page.tsx`
- `src/lib/live-article-client-cache.ts`
- `src/lib/live-article-client-cache.test.ts`
- `APP_RULES.md`
- `DECISION_LOG.md`
- `APP_AUDIT.md`
- `IMPROVEMENT_PLAN.md`

**Implemented**

- Canonicalizes source URLs without collapsing meaningful paths or query values.
- Stores one in-flight promise and one resolved value per source URL.
- Lets previews, reader, gallery, reader preloads, and Ambient Reader share it.
- Bounds resolved memory to 32 least-recently-used articles.
- Removes failed entries so a later request can retry.
- Leaves server cache headers unchanged until freshness requirements are agreed.

**Regression risks**

- Over-caching stale articles.
- Cache key collisions after URL normalization.
- Shared requests intentionally continue after one consumer unmounts.

**Validation completed**

- Concurrent preview and reader consumers produced one fetch in unit coverage.
- A resolved article was reused without a second fetch.
- Failed requests were retried successfully.
- Canonical fragments and query order resolve to one cache key.
- The cache evicted least-recently-used entries beyond 32 resolved articles.
- A previewed mobile gallery opened in the reader with one request per source.
- The referenced Harper’s Bazaar desktop reader made exactly one article request.
- TypeScript and focused lint pass.
- The production build passes.
- Responsive reader checks pass at 390px and 1280px.

### P1-03 — One accessible modal system

**Status: Completed for the audited search, mobile menu, onboarding, account/profile, reader, Ambient Reader, and fullscreen gallery surfaces on 2026-07-23.**

**Files to change**

- `src/components/home-page.tsx`
- `src/components/reader-account-ui.tsx`
- `src/components/ui/use-modal-isolation.ts`
- `src/components/ui/button.tsx` if close-size defaults change
- all modal Storybook stories/tests

**Surfaces**

- Search
- Mobile menu
- Onboarding
- Account/profile
- Story reader
- Ambient reader
- Fullscreen gallery
- Delish Shorts
- Games

**Plan**

- Portal to one app-level overlay root.
- Prefer native `<dialog>` where compatible.
- Inert all outside content.
- Support nested overlays.
- Focus a logical initial element.
- Trap and restore focus.
- Support Escape and visible close.
- Keep one accessible close control.
- Prevent background scroll without resetting prior styles.

**Regression risks**

- Reader route transitions and focus restoration.
- Nested gallery/ambient overlays.
- iOS viewport and body-scroll behavior.
- Stacking order with sticky masthead/dev controls.

**Required tests**

- Tab and Shift+Tab never leave each modal.
- Background is absent from accessibility tree and pointer-inert.
- Escape closes only the topmost overlay.
- Focus returns to the exact opener after close and route changes.
- Search, reader, gallery, and onboarding work at all required widths.
- Browser Back remains correct.

### P1-04 — Carousel accessibility

**Status: Completed and live-DOM verified on 2026-07-23.**

**Files to change**

- `src/components/home-page.tsx`
- proposed new: `src/components/hearst-plus/featured-carousel.tsx`
- related Storybook stories/tests

**Plan**

- Keep only the active slide operable/exposed.
- Preserve pause and reduced-motion behavior.
- Announce user-initiated slide changes without announcing every autoplay tick.
- Retain swipe without blocking vertical scroll.

**Regression risks**

- CSS transitions may depend on all slides remaining rendered.
- Preloading and swipe gestures may regress.

**Required tests**

- Screen reader sees one slide.
- Inactive slides cannot receive focus.
- Pause stops movement.
- Reduced motion prevents autoplay.
- Swipe does not open the story.
- Vertical scrolling still works.

### P1-05 — Search relevance

**Status: Completed on 2026-07-23.**

**Files to change**

- `src/components/home-page.tsx`
- proposed new: `src/lib/story-search.ts`
- proposed new: `src/lib/story-search.test.ts`

**Plan**

- Tokenize on Unicode word boundaries.
- Normalize accents and punctuation.
- Rank exact title, title token, brand, topic, then tag.
- Add carefully bounded prefix/fuzzy behavior.
- Track zero-result and result-selection rank without storing raw queries.

**Regression risks**

- Reduced recall for compounds, names, typos, and partial words.
- Different locale behavior.

**Required tests**

- `Audi` does not match `Audience`, `Saudi`, or `Audiobooks`.
- Exact title ranks first.
- Brand and topic matches rank predictably.
- Apostrophes, accents, hyphens, and plural forms work.
- Keyboard selection follows visual active result.
- Zero-result state remains announced.

### P1-06 — Correct onboarding inventory and controls

**Status: Inventory, zero-state behavior, and page-control target fixes completed on 2026-07-23. Prototype identity language remains tracked separately as audit finding P1-07.**

**Files to change**

- `src/components/home-page.tsx`
- `src/lib/hearst-destination-data.ts`
- `src/lib/hearst-destination-data-types.ts`
- feed validation scripts under `scripts/`
- `PRODUCT.md`
- `APP_RULES.md`

**Plan**

- Derive brand counts from the merged eligible catalog used by the reader.
- Hide or disable brands with no eligible stories.
- Explain how a selected brand changes the feed.
- Rename the flow and all actions to local/session language.
- Make pagination targets 24×24px minimum.

**Regression risks**

- Count changes as live inventory resolves.
- Different destinations may legitimately have zero scoped stories.
- Brand order may shift after filtering.

**Required tests**

- Every enabled brand has at least one eligible story.
- Selected brands boost visible content after completion.
- Count updates do not reset selection/focus.
- Pagination is keyboard and touch accessible.
- “Continue without account” creates no persistent identity.

### P1-07 — Reader mobile chrome

**Status: Completed on 2026-07-23. This plan item corresponds to audit finding P1-08.**

**Files to change**

- `src/components/home-page.tsx`
- proposed new: `src/components/hearst-plus/story-reader-modal.tsx`
- `src/app/read/[storyId]/page.tsx`

**Plan**

- Render one reader header and one contextual category row.
- Hide app-level chrome while the reader is open.
- Preserve source logo, destination switch, close, and reader queue.

**Regression risks**

- Direct/shared reader URLs.
- Brand/destination queue switching.
- Sticky header offsets and progress tracking.

**Required tests**

- 320/375px article begins without duplicate navigation.
- Close, Escape, Back, and direct URL all return correctly.
- Active category remains visible.
- Queue navigation and URL replacement remain correct.

### P1-08 — Saved first-use state

**Files to change**

- `src/components/home-page.tsx`
- proposed new: `src/components/hearst-plus/river-empty-state.tsx`

**Plan**

- Render a direct Browse For You CTA.
- Remove empty Trending and debug cards.
- Show one compact example of how saving works.

**Regression risks**

- Stakeholder diagnostic data becomes less visible.

**Required tests**

- Empty Saved shows no blank modules.
- CTA navigates to For You and receives focus correctly.
- Saving a story removes the empty state immediately.
- Removing the final saved story restores it.

### P1-09 — Establish working quality gates

**Status: implemented for the audited Hearst+ surface 2026-07-23**

**Files to change**

- `package.json`
- `eslint.config.mjs`
- CI workflow files under `.github/workflows/` if present/approved
- new tests colocated with extracted modules

**Implemented**

- Focused lint now passes with zero errors and zero warnings without suppressing React rules.
- `npm run test:unit` discovers and passes 11 application utility tests.
- Added stable feed-order coverage alongside the existing article-request and search suites.
- TypeScript and the production build pass.
- Verified onboarding reset at 320px and complete-article reader rendering at 1280px with no console errors.

**Remaining follow-up**

- Add component tests for authentication/profile draft reset and filter scope changes.
- Add a route-level Playwright suite for onboarding, reader switching, modal focus, and feed pagination.
- Wire the focused lint, unit tests, and route tests into CI after workflow scope is approved.

**Regression risks**

- Refactoring state resets may alter timing.
- CI time may increase.

**Required tests**

- Focused lint has zero errors.
- Production build passes when configured Google Fonts are reachable.
- Unit suite runs deterministically; component/E2E suites remain follow-up work.

## Phase 2: Product clarity and resilience

### Error and offline handling

**Files**

- `src/components/home-page.tsx`
- all three API route files under `src/app/api/`
- proposed new `src/components/hearst-plus/feed-status-notice.tsx`

Add stable error contracts, retry actions, timeout behavior, offline messaging, and partial-feed disclosure.

### Semantic shell and touch polish

**Files**

- `src/components/home-page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- shared nav/button/link components

Add skip link, `header`, named nav landmarks, 24px target floor, 44px preferred touch target, edge fades, and tested focus styles.

### Font resilience

**Files**

- `src/app/layout.tsx`
- `src/app/globals.css`
- local font assets/configuration

Self-host and subset the minimum fonts needed for Hearst+ above the fold.

## Phase 3: Architecture and measurement (approval required)

### Extract the monolith

**Status: In progress. The 2026-07-23 first extraction reduced `home-page.tsx` from 503,880 to 489,984 bytes and removed Babel’s deoptimization warning. Utility navigation plus the stakeholder rules/technology guides now have explicit modules. Continue one tested capability at a time.**

Proposed files:

- `src/components/hearst-plus/utility-bar.tsx` — completed
- `src/components/hearst-plus/lifestyle-technology-guide.tsx` — completed
- `src/components/hearst-plus/search-dialog.tsx`
- `src/components/hearst-plus/onboarding-modal.tsx`
- `src/components/hearst-plus/story-reader-modal.tsx`
- `src/components/hearst-plus/featured-carousel.tsx`
- `src/components/hearst-plus/river.tsx`
- `src/components/hearst-plus/video-feed.tsx`
- `src/components/hearst-plus/prototype-controls.tsx`
- `src/components/hearst-plus/use-progressive-feed.ts`
- `src/lib/story-search.ts`
- `src/lib/live-article-client-cache.ts`

Extract one boundary at a time and preserve existing props/routes until its tests pass.

### Analytics

Files depend on the approved vendor. At minimum:

- `src/app/layout.tsx`
- proposed `src/lib/analytics/events.ts`
- proposed `src/lib/analytics/client.ts`
- proposed `src/app/web-vitals.tsx`

No direct identifiers, comments, passwords, full queries, or article text may be collected.

## Exact existing files likely to change

1. `src/components/home-page.tsx`
2. `src/components/adaptive-video.tsx`
3. `src/components/reader-account.tsx`
4. `src/components/reader-account-ui.tsx`
5. `src/components/lifestyle-river-types.ts`
6. `src/lib/live-feed-types.ts`
7. `src/lib/personalize-live-feed.ts`
8. `src/lib/hearst-destination-data.ts`
9. `src/lib/hearst-destination-data-types.ts`
10. `src/lib/hearst-live-article.ts`
11. `src/app/api/story-feed/route.ts`
12. `src/app/api/video-feed/route.ts`
13. `src/app/api/live-article/route.ts`
14. `src/app/hearst-plus/page.tsx`
15. `src/app/hearst-plus/[categorySlug]/page.tsx`
16. `src/app/read/[storyId]/page.tsx`
17. `src/app/layout.tsx`
18. `src/app/globals.css`
19. `src/components/ui/button.tsx`
20. `src/components/ui/input.tsx`
21. `package.json`
22. `PRODUCT.md`
23. `APP_RULES.md`

## Approval checkpoints

Approval is required before:

- Removing or migrating existing local profile data.
- Changing video eligibility/inventory.
- Replacing modal architecture.
- Changing pagination/search data architecture.
- Splitting `home-page.tsx`.
- Adding production analytics, identity, consent, or deployment.

Low-risk copy, target-size, semantic backdrop, skip-link, and Saved-empty-state fixes can be implemented independently after approval of this plan.
