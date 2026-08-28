# User Stories: Single-Brand Destinations — Hearst+ Platform

> **Brownfield project.** These user stories refine `vision-single-brand-destinations.md`
> into testable requirements for Requirements Analysis. They describe behavior for
> the single-brand destinations that reuse the existing Hearst+ `HomePageTemplate`.
> **Status** tags reflect the current branch: ✅ implemented & verified · 🔶 partial · ⬜ planned.
> Priority follows the vision MVP boundary (three pilot brands: Delish, Cosmopolitan, Redbook).

## Personas

| Persona | Description | Primary need |
|---|---|---|
| **Anonymous Reader** | A visitor with no account, arriving at one brand | Read that brand's content in a familiar, branded experience |
| **Returning Reader** | A reader who has signed in previously | Continue reading and keep saves/follows across visits |
| **Brand Editorial** | A brand's editorial team (secondary) | Their brand renders with its own identity, feed, and voice |
| **Design-System Maintainer** | Owns `HomePageTemplate` and the token pipeline (secondary) | Single-brand mode adds no risk to the aggregated `/hearst-plus` experience |

---

## Epic 1 — Enter and identify a single brand

### US-1.1 — Land on a single-brand destination · MVP · ✅
**As an** anonymous reader, **I want** to open a URL for one brand, **so that** I see only that brand's experience.
- **Given** I navigate to `/single-brand/delish` (or `/cosmopolitan`, `/redbook`)
- **When** the page loads
- **Then** the masthead shows that brand's logo (not "HEARST+"), the theme uses that brand's tokens/fonts, and only that brand's content is shown.
- *Traces to:* Brand masthead, brand theme, brand-scoped river.

### US-1.2 — Reject an unknown brand · MVP · ✅
**As a** reader, **I want** an invalid brand URL to 404, **so that** I don't see a broken page.
- **Given** I navigate to `/single-brand/<not-a-pilot-brand>`
- **Then** the app returns Not Found.

### US-1.3 — Discover the available single brands · MVP · ✅
**As a** reader, **I want** an index of single-brand destinations, **so that** I can choose one.
- **Given** I open `/single-brand`
- **Then** I see a list linking to each pilot brand.

### US-1.4 — Choose an entry model · Open question · ⬜
**As** Product, **I want** a decided entry/switching model (path vs. picker vs. subdomain; can a reader switch brands mid-session), **so that** navigation is coherent.
- *Feeds Requirements Analysis (see vision Open Questions).*

---

## Epic 2 — Read the single-brand river

### US-2.1 — See a brand-only river · MVP · ✅
**As a** reader, **I want** the river to show only the active brand's stories, **so that** the experience is truly single-brand.
- **Given** I am on a single-brand home
- **Then** every river card belongs to the active brand (real feed images/headlines/bylines), with no cross-brand blending.
- *Traces to:* brand-scoped river (`liveFeedData` + `liveFeedMode="replace"`).

### US-2.2 — See a featured lead · MVP · ✅
**As a** reader, **I want** a featured hero/carousel at the top, **so that** the brand's lead stories stand out.
- **Given** the home loads · **Then** a "Today's Picks" featured unit shows top brand stories.

### US-2.3 — No cross-brand promo/ad clutter · MVP · ✅
**As a** reader, **I want** the single-brand river free of cross-brand sponsor/promo/local-news modules, **so that** it reads as one brand.
- **Given** I scroll the single-brand river
- **Then** I see no in-river brand-promotion or cross-brand ad modules, no cross-brand studio right-rail ad, and no Local News rail.
- *Traces to:* single-brand chrome scoping (`singleBrandName`).

### US-2.4 — Editorial-first ordering · MVP · 🔶
**As an** anonymous reader, **I want** a sensible default order when there's no personalization signal, **so that** the river is useful on a cold start.
- **Given** I am anonymous · **Then** the river uses the brand's editorial/curated order (personalization is an enhancement, not required for launch).
- *Note:* currently sourced from static feed data; live single-brand personalization is Phase 2.

---

## Epic 3 — Read an article (modal reader + infinite scroll)

### US-3.1 — Open a story in the reader · MVP · ✅
**As a** reader, **I want** clicking a story to open it in the modal reader, **so that** I can read without leaving the brand.
- **Given** I click a river story · **Then** the full-screen reader opens with the article (hero, byline, body) themed to the brand.

### US-3.2 — Infinite "up next" scroll · MVP · ✅
**As a** reader, **I want** to keep scrolling to the next story, **so that** I can read continuously within the brand.
- **Given** the reader is open · **When** I scroll to the end of a story · **Then** the next same-brand story loads ("N of M stories loaded" advances) under an "Up next" divider.

### US-3.3 — Reader chrome is single-brand · MVP · ✅
**As a** reader, **I want** the reader's brand-switcher scoped to the active brand, **so that** I'm not offered sibling brands.
- **Given** the reader is open in a single-brand destination
- **Then** the brand-switcher row lists only the active brand (no Country Living / Good Housekeeping / etc.).
- *Traces to:* reader `singleBrandSlug` scoping.

### US-3.4 — Shareable article deep-link · MVP · ✅
**As a** reader, **I want** an article URL that opens directly into the reader, **so that** I can share/bookmark a story.
- **Given** I open `/single-brand/[brand]/article/[storyId]`
- **Then** the reader opens on that story, and closing it returns me to the brand home.

### US-3.5 — Same-brand recirculation · MVP · 🔶
**As a** reader, **I want** "more from this brand" while reading, **so that** I keep discovering the brand.
- **Given** the reader is open · **Then** the up-next queue and any recirculation are same-brand only (cross-brand recirculation is out of scope).

---

## Epic 4 — Reader controls and identity

### US-4.1 — Save / follow / hide / more-like-this · MVP · 🔶
**As a** reader, **I want** to save, follow, hide, and request more-like-this on stories, **so that** I can shape my reading.
- **Given** a story card or the reader · **When** I use a control · **Then** it responds immediately.
- *Note:* controls render and respond in-session; **persistence to the reader-profile API is Phase 2** (US-4.3).

### US-4.2 — Optional sign-in prompt · MVP · 🔶
**As an** anonymous reader, **I want** a contextual, dismissible sign-in prompt, **so that** I can opt into persistence.
- **Given** I engage with content · **Then** I may be offered optional Google sign-in; it is dismissible.

### US-4.3 — Persisted saves/follows across visits · Phase 2 · ⬜
**As a** returning reader, **I want** my saves/follows to persist, **so that** value carries across sessions.
- **Given** I signed in and saved stories · **When** I return · **Then** my saves/follows are restored (via the reader-profile API + `LifestyleRiverProfile`).

---

## Epic 5 — Platform safety (non-functional)

### US-5.1 — Aggregated experience unaffected · MVP · ✅
**As a** design-system maintainer, **I want** single-brand mode to not change `/hearst-plus`, **so that** the aggregated product is safe.
- **Given** the single-brand props are not set · **Then** `HomePageTemplate` behaves exactly as before (verified: `forceDestinationRiver`/`singleBrandName`/`singleBrandSlug` all default off).

### US-5.2 — No token/feed contract drift · MVP · ✅
**As a** maintainer, **I want** single-brand mode to consume the token pipeline and feed contract as-is, **so that** nothing downstream breaks.
- **Given** the feature is built · **Then** no changes to `tokens/`, `personalize-live-feed`, or `LiveFeedData`; `tokens:audit:ci` and the build pass.

---

## Out of scope (this iteration — from the vision)

- Additional brands beyond the three pilots · a new/custom layout · cross-brand aggregation or recirculation · HAPS production ranking · native apps · full Identity/CRM.

## Clarifying questions for Requirements Analysis

- Entry/switching model (US-1.4).
- Is personalization required for MVP, or is editorial-first sufficient at launch (US-2.4)?
- Which right-rail modules, if any, are appropriate for a single brand (currently suppressed entirely)?
- Does single-brand mode eventually replace the per-brand `ClassicHomepageBody` pages, or coexist?
- Live single-brand feed vs. the current static feed data for launch.
