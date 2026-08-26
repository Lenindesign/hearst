# Vision: Single-Brand Destinations — Hearst+ Platform

> **Brownfield project.** This document describes a change to an existing system.
> The Current State section is required. It gives AIDLC the context it needs to
> understand what already exists before generating requirements and design.

---

## Current State

Hearst+ is an existing personalized-content prototype built in TypeScript on
Next.js 16 / React 19, deployed on Netlify (the reference lives at `/hearst-plus`).
Its defining behavior is **aggregation**: `HomePageTemplate` (in
`src/components/home-page.tsx`) renders a single cross-brand river that blends
stories from many Hearst magazine brands, with brand/topic filtering, reader
controls (save / follow / hide / more-like-this), and a full-screen **modal story
reader** that supports infinite "up next" scrolling.

The platform already includes: a design-token pipeline (`tokens/` +
`style-dictionary`, validated by `tokens:audit:ci`) with per-brand color/type/logo
sets for 29 brands; a personalization/content layer (`personalize-live-feed.ts`
and the `api/*` route handlers) plus static feed data in `lifestyleRiverStories`;
and a shared UI primitive library (`src/components/ui/`).

Today `HomePageTemplate` only renders the **river-with-reader** layout for
*destination* slugs (`hearst-all`, `hearst-lifestyle`, `hearst-flux`, `hearst-ew`,
…). An individual brand renders `ClassicHomepageBody`, a static magazine grid with
**no story reader**. There is no mode where the entire experience — masthead,
river, and modal reader — is scoped to exactly one brand.

---

## What We Are Adding

**Single-brand destinations**: a set of routes that reuse the existing Hearst+
`HomePageTemplate` — the same layout and the same modal reader — but constrain the
whole experience to **one brand at a time**. The brand supplies the masthead logo,
the river content (its feed only), and the theme tokens. No new layout is created;
the existing template is limited to a single brand. Pilot cohort: Delish,
Cosmopolitan, Redbook.

---

## Features In Scope (this iteration)

- Per-brand routes: `/single-brand/[brandSlug]` (home) and an index at
  `/single-brand`, for Delish, Cosmopolitan, and Redbook.
- Brand-scoped river: the river shows **only the active brand's stories** (real
  feed data from `lifestyleRiverStories`, real Hearst CDN images), via
  `liveFeedData` + `liveFeedMode="replace"`.
- Brand masthead: the brand's logo replaces the "HEARST+" masthead
  (`mastheadLogoOverride`).
- Brand theme: brand tokens and web-fonts applied via the existing `ThemeProvider`.
- Article experience = the template's built-in **modal story reader with infinite
  scroll**, opened by clicking a river story; scoped to the active brand.
- Shareable article deep-link: `/single-brand/[brandSlug]/article/[storyId]` opens
  the modal reader on that story.
- An additive, opt-in `forceDestinationRiver` prop on `HomePageTemplate` so a single
  brand renders the river-with-reader layout instead of the static magazine grid.

## Features Explicitly Out of Scope (this iteration)

- Any new/custom layout — the single-brand experience is the existing Hearst+ river,
  not a bespoke design (rejected earlier in this initiative).
- The cross-brand aggregated river — `/hearst-plus` is unchanged and remains the
  separate aggregated mode.
- Additional brands beyond the three pilot brands (Phase 2).
- Sidebar-label polish: the left rail still reads "Trending across brands" and the
  reader's top tabs still list sibling lifestyle brands (Phase 2 — scope to brand).
- Removing lifestyle-destination rail modules (e.g. "Good Housekeeping Tested") that
  currently surface in the single-brand right rail (Phase 2).
- Persisting reader controls to the reader-profile API (Phase 2).
- HAPS production ranking — consume the existing feed/adapter as-is (Phase 2).
- Native apps; full Identity/CRM integration (Phase 2+).

---

## What Must Not Change

- `HomePageTemplate` default behavior — `forceDestinationRiver` defaults to `false`,
  so every existing caller (`/hearst-plus`, `/read/*`, brand pages) is byte-for-byte
  unchanged. Do not fork or rewrite the template.
- The design-token pipeline (`tokens/`, `style-dictionary`, `tokens:audit:ci`) —
  consume as-is; brand additions are additive tokens only.
- The personalization / feed data contract (`personalize-live-feed.ts`, the `api/*`
  response shapes, `LiveFeedData`) — consume as-is; do not change the schema.
- The shared UI primitive library (`src/components/ui/`) — reuse, do not fork.
- The existing `/hearst-plus` aggregated experience and the `/read/[storyId]` reader
  route — the single-brand routes are added alongside; do not break them.
- The Netlify + Storybook build/deploy configuration.

---

## Open Questions

- Should the single-brand left rail be scoped and relabeled ("Trending in {Brand}"
  instead of "Trending across brands"), and the reader's top brand tabs limited to
  the active brand — or is sibling-brand discovery acceptable inside a single-brand
  destination?
- Should single-brand mode eventually **replace** the per-brand `ClassicHomepageBody`
  pages, or coexist as a parallel `/single-brand/*` namespace?
- How does a reader enter a single brand and switch brands — path only, a brand
  picker, subdomains, or campaign deep links?
- Which right-rail modules are appropriate for a single brand (drop cross-brand
  studio/local-news modules, or keep them)?
- Is the static `lifestyleRiverStories` feed sufficient for launch, or must the
  single-brand river read the live personalization feed scoped to one brand?
