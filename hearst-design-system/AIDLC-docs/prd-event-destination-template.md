# PRD: Event Destination Template — FRE + Hearst Design System

> **Brownfield project.** A working reference implementation already exists
> (`src/components/hot-rod-events-page.tsx`). This PRD describes generalizing it into a
> **tokenized, rebrandable Event Destination Template** that runs on the FRE component
> surface and draws 100% of its visual values from HDS tokens.
>
> **Format:** follows the AIDLC convention in `AIDLC-docs/` (Vision → User Stories →
> Technical Environment). Sections 1–7 are the Vision input; section 8 is the User Stories
> input; sections 9–13 are the Technical Environment input. Can be split into three tickets
> or filed as one.

| Field | Value |
|---|---|
| **Project name** | Event Destination Template |
| **Project type** | Brownfield (extract + generalize an existing route composition) |
| **Design system** | [Media-Platforms/hearst-design-system](https://github.com/Media-Platforms/hearst-design-system) |
| **Reference implementation** | `src/components/hot-rod-events-page.tsx` (911 lines), `src/lib/hot-rod-events.ts` (293 lines) |
| **Live reference routes** | `/autos/hot-rod/events/`, `/autos/hot-rod/events/power-tour/`, `/autos/hot-rod/events/drag-week/` |
| **Design reference** | [HOT ROD Events (Figma)](https://www.figma.com/design/hZKJEFBqDq2JB1HEpYVYU4/HOT-ROD-Events?node-id=0-1) |
| **Pilot brand** | HOT ROD (Power Tour, Drag Week) |
| **Target surface** | FRE (`src/components/fre/*`) |

---

## 1. Executive Summary

The **Event Destination Template** is a reusable, token-driven page template that enables
Hearst brand teams to launch a branded event destination — hero, series overview, route and
schedule, resources, coverage, and a multi-event calendar — **without writing new layout
code or introducing a new palette**.

It addresses the fact that today's HOT ROD Events experience is a one-off composition: it
hardcodes six hex values into route-scoped CSS custom properties, hardcodes its brand
identity and content into the component tree, and is explicitly marked in its own metadata as
**"approved only for HOT ROD."** Any other event — a Delish cook-off, a Runner's World race
series, a Popular Mechanics maker fair — requires forking 911 lines of TSX.

The expected outcome is that a new branded event destination can be stood up from **a content
record plus a brand token file**, with zero hardcoded color, type, or spacing values, and
that an AI-DLC agent can perform the rebrand from structured inputs alone.

---

## 2. Current State

### 2.1 What exists and works

The reference implementation is a genuinely good editorial composition and should be
**preserved in look and behavior**. It already does several things right:

- Uses the shared HDS 4 / 8 / 12 grid primitives (`PageContainer`, `Grid`, `Col` from
  `src/components/ui/grid.tsx`) rather than bespoke layout.
- Reuses the FRE footer (`@/components/fre/site-footer`) and the shared `Button`, `icons`,
  and `BrandLogo` primitives.
- Has a typed content model in `src/lib/hot-rod-events.ts`: `HotRodEvent`, `HotRodEventStop`,
  `HotRodEventResource`, `HotRodEventCoverage`, and a six-value `HotRodEventStatus` union.
- Ships five Storybook stories that import the exact routed exports
  (`src/stories/HearstPlusHotRodEvents.stories.tsx`) — no parallel template.
- Carries a component metadata record (`hot-rod-events-page.metadata.ts`) declaring its
  tokens, dependencies, variants, caveats, and known violations.
- Honors `prefers-reduced-motion` on the coverage card hover transform.
- Meets the 44px minimum target size (`min-h-11`) on essentially every interactive element.

### 2.2 What blocks reuse

These are the concrete, code-level reasons the template cannot be rebranded today.

**A. Hardcoded color — declared as a violation by the component's own metadata**

`src/lib/hot-rod-events.ts` defines a literal palette that
`hot-rod-events-page.tsx` injects as inline CSS custom properties on the page root:

```ts
export const hotRodEventTheme = {
  primary: "#c11b17",  primaryForeground: "#ffffff",
  red: "#c8101e",      redDark: "#991019",   redLight: "#ff6a73",
  black: "#111111",    asphalt: "#242424",   cream: "#f3ebdd",
  heroOverlay: "linear-gradient(90deg,rgba(0,0,0,0.93) 0%, …)",
  dragWeekOverlay: "linear-gradient(90deg,rgba(0,0,0,0.94) 0%, …)",
} as const;
```

Note `primary: "#c11b17"` and `red: "#c8101e"` are **two different reds** used for
overlapping purposes — an unintended inconsistency that tokenization will resolve.

**B. Typography is hardcoded at the page root**

```tsx
"--font-brand": "Geist, sans-serif",
"--font-headline": "\"Barlow Condensed\", sans-serif",
```

These bypass the brand token pipeline and `tokens/brands/_meta.json`, which is the documented
home for per-brand `fontHeadline` / `fontHeadlineWeight` / `fontSecondary` overrides.

**C. There is no `hot-rod` brand in the token pipeline**

`tokens/manifest.json` lists 28 `brandSlugs`; `hot-rod` is not among them, and
`tokens/brands/hot-rod.json` does not exist. The route borrows `hearst-plus` theming
(`<ThemeProvider defaultBrandSlug="hearst-plus">`) and paints over it with scoped variables.

**D. Brand identity is hardcoded in the component tree**

```tsx
<UtilityBar selectedBrand={{ name: "HOT ROD", slug: "hot-rod" }} … />
<MainNav brandSlug="hearst-plus" activeFilter="Events"
         onFilterChange={(f) => router.push(`/autos/hot-rod/?section=…`)} />
<BrandLogo slug="hot-rod" … />
```

**E. Content is hardcoded where the data model already has a field**

The hero renders the literal string `"Power Tour"` and the literal location `"Route 66"`,
even though `powerTour2026.title` and `powerTour2026.locationLabel` exist. Both hero CTA
`href`s are literal deep links. `DragWeekTickets` defines its entire `ticketOptions` array
**inline in the component** rather than in the content model.

**F. The calendar grouping is not generalizable**

`EventCalendar` hardcodes three month buckets and filters by string prefix:

```tsx
const months = [
  { label: "June 2026",      events: events.filter(e => e.dateLabel.startsWith("June")) },
  { label: "September 2026", events: events.filter(e => e.dateLabel.startsWith("September")) },
  { label: "2027",           events: events.filter(e => e.edition === "2027") },
];
```

This cannot survive a different event set, and `dateLabel` is a display string, not a date.

**G. Module-level data coupling**

`AllEvents` reads the module constant `hotRodEvents` directly; `Hero`, `SeriesIntro`,
`RouteAndResources`, and `Coverage` read `powerTour2026` directly. No section accepts its
content as a prop, so nothing is reusable without editing the file.

**H. Arbitrary Tailwind values that bypass the token scale**

Representative, not exhaustive: `text-[clamp(3.75rem,10vw,8rem)]`, `tracking-[-0.035em]`,
`leading-[0.78]`, `min-h-[530px] md:min-h-[610px] lg:min-h-[650px]`, `text-[0.6875rem]`,
`tracking-[0.14em]`, `text-white/80`, `border-white/70`, `bg-black/55`, `border-black/15`,
`before:left-[19px]`, `max-w-[10ch]`.

**I. Duplication between hub and detail**

`HotRodEventsPage` and `HotRodDragWeekPage` duplicate an identical ~14-line inline `style`
block, an identical header, and an identical footer. `RouteAndResources` and
`DragWeekRouteAndResources` are near-identical (~80 lines each) differing only in copy, the
schedule index base (`index + 1` vs `index`), and one sidebar card.

### 2.3 Accessibility and correctness findings in the reference

These must be fixed in the template, not carried forward.

| # | Finding | Location | Severity |
|---|---|---|---|
| A1 | Edition selector uses `<button disabled aria-pressed>` for unavailable years. Disabled buttons are removed from the tab order, so a keyboard or screen-reader user cannot discover that 2024/2025/2027 archives exist. The only explanation is a `title` attribute, which is not reliably announced. | `SeriesIntro` | High |
| A2 | The calendar/list toggle is a bare `<div aria-label="Choose event view">` with no `role`. An `aria-label` on a generic `div` is not exposed, so the group is unnamed. | `AllEvents` | Medium |
| A3 | `<Image … preload loading="eager">` — `preload` is not a valid `next/image` prop (the prop is `priority`). The hero LCP image is very likely not being preloaded, and React will warn on the unknown attribute. **Verify before fixing.** | `Hero`, `DragWeekHero` | Medium |
| A4 | Focus ring color is hardcoded per-surface (`ring-white` on dark, `ring-[var(--hot-rod-events-red)]/45` on light). There is no single tokenized focus treatment, so a rebrand can silently produce an invisible focus ring. | throughout | Medium |
| A5 | Hero overlay opacity is fixed (`rgba(0,0,0,0.93)` → `0.13`). Contrast of white text over the right-hand light region of an arbitrary brand photo is unverified. | `Hero`, `DragWeekHero` | Medium |
| A6 | `EventCalendar` derives `id` via `month.label.replace(/\s+/g, "-")`, which can collide or produce invalid ids for arbitrary labels. | `EventCalendar` | Low |

---

## 3. Problem Statement

Hearst brands run recurring events, and each one currently needs bespoke front-end work. The
HOT ROD Events route proves the editorial pattern works, but it was built as a route-scoped
composition and is explicitly fenced off from reuse by its own metadata:

> `whenNotToUse: "Another publication needs an event template — this composition and its
> scoped palette are approved only for HOT ROD"`

The result: the pattern cannot be reused, the hardcoded palette is a standing token-audit
violation, and an AI-DLC agent has no structured contract to rebrand against — it would have
to rewrite TSX, which is exactly the failure mode AI-DLC is meant to remove.

---

## 4. Goals

| # | Goal | Success measure |
|---|---|---|
| G1 | Zero hardcoded visual values | `npm run tokens:audit:ci` passes with **no** `hardcoded-color` violation for the event template; `violations: []` in its metadata record |
| G2 | Rebrandable from data | A second brand's event destination ships with **no changes** to template TSX — only a content record + a brand token file |
| G3 | Runs on FRE | Template composes `src/components/fre/*` (`SiteHeader`, `SiteFooter`, `AdPlaceholder`, `RelatedArticles`) and `src/components/ui/*` primitives; no parallel component set |
| G4 | Visual parity with the reference | Storybook visual regression against the current HOT ROD routes shows no unintended diff at 375 / 768 / 1280 |
| G5 | AI-DLC operable | An agent can generate a new event destination from a filled content schema + brand tokens, with a documented, validated input contract |
| G6 | Accessible | WCAG 2.2 AA; findings A1–A6 resolved; axe clean in Storybook a11y runs |

### Non-goals (this iteration)

- Live ticketing, payment, or inventory integration. Ticket links remain outbound to the
  provider (TicketSpice today). **PCI-DSS stays Not Applicable** — see
  `security-compliance-matrix.md`.
- A CMS authoring UI. Content is a typed, checked-in record this iteration.
- Live organizer/event-API ingestion. The footer disclaimer pattern stays.
- Map rendering, GPS routing, or interactive route visualization. The route timeline remains
  the existing vertical stop list.
- Migrating the HOT ROD route off its current URLs.
- Building out archive editions (2024/2025). The selector must *expose* them correctly
  (A1); populating them is a later phase.

---

## 5. What We Are Adding

An **Event Destination Template**: one composition, three route modes, driven entirely by a
content record and brand tokens.

```
EventDestination (content record)  +  tokens/brands/<slug>.json  →  rendered destination
```

### 5.1 Route modes

| Mode | Purpose | Reference route |
|---|---|---|
| **Hub** | Series overview + full event calendar across editions | `/autos/hot-rod/events/` |
| **Series detail** | One recurring series, current edition, no global calendar | `…/events/power-tour/` |
| **Edition detail** | One event instance, with ticket tiers and access rules | `…/events/drag-week/` |

Today these are two exports (`HotRodEventsPage` with a `detailMode` boolean, and a wholly
separate `HotRodDragWeekPage`). The template replaces that with **one export plus a `mode`
discriminator**, and section-level composition driven by which content blocks are present.

### 5.2 Section inventory

Each section becomes an independently reusable, prop-driven component. "Optional" means the
section is omitted when its content block is absent — this is how modes differentiate.

| # | Section | Reference source | Required? | Notes |
|---|---|---|---|---|
| S1 | Event hero | `Hero` / `DragWeekHero` | Required | Full-bleed image, gradient scrim, eyebrow badge, kicker, display headline, date + location meta, status label, primary + secondary CTA, optional hub link |
| S2 | Series intro + edition selector | `SeriesIntro` | Optional | Two-column: series narrative + year selector |
| S3 | Route / schedule timeline | `RouteAndResources` (left col) | Optional | Numbered vertical timeline; configurable index base (0 or 1) |
| S4 | Resources rail | `RouteAndResources` (right col) | Optional | Outbound link list + one callout card |
| S5 | Coverage grid | `Coverage` | Optional | 3-up labeled cards (Gallery / Story / Guide) + "read the official story" link |
| S6 | Ticket tiers | `DragWeekTickets` | Optional | Tier list with price + a "before purchasing" rules card |
| S7 | Event calendar | `AllEvents` | Hub only | Calendar ⇄ list toggle over all editions |
| S8 | Cross-navigation | inline `<section>` in both exports | Required | "View all events" / "Explore the calendar" |
| S9 | Header + footer chrome | `HotRodEventsHeader`, `SiteFooter` | Required | Must accept brand identity as props |

---

## 6. Features In Scope

### 6.1 Generalized content model

Replace the HOT ROD–specific types in `src/lib/hot-rod-events.ts` with a brand-neutral model.
Field names below are the contract an AI-DLC agent fills.

```ts
// src/lib/event-destination.ts

export type EventStatus =
  | "coming-soon" | "registration-open" | "registration-closed"
  | "sold-out"    | "underway"          | "concluded";

export type EventStop = {
  /** Display label, e.g. "Day 1" or "Stage 3". */
  label: string;
  /** ISO 8601 date. REQUIRED — replaces the free-text `date` string so
   *  grouping, sorting, and <time> output are derivable. */
  date: string;
  /** Optional human override when ISO formatting is not what editorial wants. */
  dateLabel?: string;
  venue: string;
  location: string;
  note?: string;
};

export type EventResource  = { label: string; description: string; href: string };
export type EventCoverage  = { label: string; title: string; image: string; imageAlt?: string; href: string };
export type EventTicketTier = { title: string; price: string; detail: string; href?: string };

export type EventCta = {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary";
};

export type EventDestination = {
  slug: string;
  /** Brand slug — MUST resolve to tokens/brands/<brandSlug>.json. */
  brandSlug: string;
  series: string;
  edition: string;
  title: string;
  /** Display headline; falls back to `title`. Replaces the hardcoded "Power Tour". */
  displayTitle?: string;
  eyebrow: string;
  /** Badge above the kicker, e.g. "HOT ROD Events". */
  badge?: string;
  summary: string;
  /** ISO 8601. REQUIRED — `dateLabel` becomes presentation-only. */
  startDate: string;
  endDate?: string;
  dateLabel: string;
  locationLabel: string;
  /** Short hero location, e.g. "Route 66". Replaces the hardcoded string. */
  locationShort?: string;
  status: EventStatus;
  statusLabel?: string;
  hero: { image: string; alt: string; overlay?: "standard" | "strong" };
  href: string;
  sourceUrl: string;
  ctas?: EventCta[];               // replaces hardcoded hero CTA hrefs
  ticketUrl?: string;
  ticketProvider?: string;         // widened from the "TicketSpice" literal
  waitlistUrl?: string;
  schedule?: EventStop[];
  scheduleIndexBase?: 0 | 1;       // Drag Week starts at Day 0
  resources?: EventResource[];
  resourceCallout?: { title: string; body: string; cta?: EventCta };
  coverage?: EventCoverage[];
  ticketTiers?: EventTicketTier[]; // lifted out of DragWeekTickets
  ticketNotes?: string[];
  facts?: { label: string; body: string }[]; // the DragWeekIntro fact rail
};

export type EventSeries = {
  slug: string;
  brandSlug: string;
  title: string;
  kicker: string;
  narrative: string;
  /** Edition years, newest first; `available` drives the selector (see A1). */
  editions: { year: string; available: boolean; href?: string }[];
  events: EventDestination[];
};
```

**Requirements**

- R1.1 — `startDate` / `EventStop.date` are ISO 8601. Calendar grouping and sorting derive
  from these, never from `dateLabel` string prefixes. This retires finding F.
- R1.2 — Every string the reference hardcodes in TSX has a model field. No template file
  contains brand or event copy.
- R1.3 — The model is validated at build time. Extend `scripts/validate-*.ts` with an
  `events:validate` script wired into `npm run quality`.
- R1.4 — `ticketProvider` widens from the `"TicketSpice"` literal to `string`.
- R1.5 — `EventCoverage.imageAlt` is optional; when absent the image renders `alt=""` (it is
  decorative beside its heading, as in the reference).

### 6.2 Token remediation — the core of this ticket

Every scoped custom property becomes an HDS token. Following the documented component-token
pattern `component-{name}-{property}-{variant?}-{state?}-{size?}`, introduce a
`component-event-*` namespace in `tokens/`, resolved per brand through `brand-{n}` slots.

| Prototype variable | Literal | Proposed HDS token | Resolves to |
|---|---|---|---|
| `--hot-rod-events-red` | `#C8101E` | `component-event-accent-default` | `$brand-1` |
| `--hot-rod-events-red-dark` | `#991019` | `component-event-accent-hover` | `$palette-primary-800` |
| `--hot-rod-events-red-light` | `#FF6A73` | `component-event-accent-knockout` | `$palette-primary-400` |
| `--hot-rod-events-black` | `#111111` | `component-event-surface-background-inverse` | `$palette-neutral-1000` |
| `--hot-rod-events-asphalt` | `#242424` | `component-event-surface-background-inverse-subtle` | `$palette-neutral-900` |
| `--hot-rod-events-cream` | `#F3EBDD` | `component-event-surface-background-alt` | `$brand-3` |
| `--primary` (`#C11B17`) | — | **delete** — collapse into `component-event-accent-default` | resolves the two-reds inconsistency |
| `heroOverlay` gradient | inline | `component-event-hero-overlay-standard` | composed from `palette-neutral-*-alpha` |
| `dragWeekOverlay` gradient | inline | `component-event-hero-overlay-strong` | composed from `palette-neutral-*-alpha` |
| `--font-brand` (`Geist`) | inline | `font-family-default` | brand token |
| `--font-headline` (`Barlow Condensed`) | inline | `font-family-serif-primary` / `_meta.json` `fontHeadline` | brand token |

**Requirements**

- R2.1 — `src/components/event-destination-*.tsx` contains **no hex literal, no
  `rgba()`, and no inline `style` color block**. The page root sets no scoped color
  variables; theming arrives through `ThemeProvider` + the brand token file.
- R2.2 — Create `tokens/brands/hot-rod.json` and register `hot-rod` in
  `tokens/manifest.json` `brandSlugs` (currently 28 entries, no `hot-rod`). Populate
  `brand-1…brand-n`, and add `hot-rod` to `tokens/brands/_meta.json` with
  `fontHeadline: "Barlow Condensed"` plus its weight.
- R2.3 — Arbitrary Tailwind values (finding H) map to the token scale:
  `space-*`, `font-size-*`, `font-line-height-*`, `font-letter-spacing-*`,
  `layout-*`, `border-radius-*`, `palette-neutral-*-alpha`. Where a needed step genuinely
  does not exist, **add it to the core scale** — do not reintroduce a bracket value.
- R2.4 — Hero heights (`530 / 610 / 650px`) become
  `layout-component-event-hero-height-{sm|md|lg}`.
- R2.5 — Hero overlays become tokens with a `standard` / `strong` variant, selected by
  `hero.overlay` in the content model.
- R2.6 — One tokenized focus treatment (`component-event-focus-ring-*`) with an inverse
  variant for dark surfaces, replacing the per-surface hardcoded rings (A4).
- R2.7 — `npm run tokens:audit:ci` passes and the template's metadata record ships
  `violations: []`.

### 6.3 FRE surface alignment

- R3.1 — Compose `SiteHeader` and `SiteFooter` from `@/components/fre`. The reference already
  imports `fre/site-footer`; the header currently comes from `hearst-plus/utility-bar` +
  `home-page/MainNav` and must be evaluated against FRE `SiteHeader`. **If FRE `SiteHeader`
  cannot yet express the event nav, document the gap and raise it against FRE rather than
  forking a header into the template** (see Open Question Q2).
- R3.2 — Brand identity (`name`, `slug`, logo, nav targets) is passed as props. No literal
  `"HOT ROD"` or `/autos/hot-rod/` in the template (finding D).
- R3.3 — Reuse existing primitives: `Button`, `Grid`/`Col`/`PageContainer`, `icons`,
  `BrandLogo`. Add no parallel primitives. Per `AGENTS.md`: *"App-specific patterns may
  compose them but must not create a parallel design system."*
- R3.4 — Deduplicate `RouteAndResources` / `DragWeekRouteAndResources` into one prop-driven
  section (finding I), with `scheduleIndexBase` covering the 0-vs-1 difference.
- R3.5 — Keep the 4 / 8 / 12 grid contract and the documented column spans
  (`spanMd={5|6} spanLg={7}` content, `spanMd={3} spanLg={4} startLg={9}` rail).

### 6.4 Accessibility

- R4.1 — **(A1)** Unavailable editions stay focusable. Use `aria-disabled="true"` with
  `aria-current="true"` on the active year, or render unavailable years as non-interactive
  `<span>`s with visible text explaining availability. Do not rely on `title`. Do not use the
  `disabled` attribute for "archive not yet published."
- R4.2 — **(A2)** The view toggle gets `role="group"` (or a `tablist`/`tab` pairing) so its
  `aria-label` is exposed.
- R4.3 — **(A3)** Verify `preload` against the installed `next/image` API; use `priority` for
  the hero LCP image if confirmed.
- R4.4 — **(A5)** Hero text contrast ≥ 4.5:1 must be verified against each brand's hero image
  over the tokenized scrim. Add a Storybook story with a light hero image as the stress case.
- R4.5 — **(A6)** Derive section ids from stable slugs, not from `label.replace(/\s+/g, "-")`.
- R4.6 — Preserve what already works: `aria-labelledby` on every `<section>`, `min-h-11`
  targets, `aria-hidden` on decorative icons, `motion-reduce:` on the coverage hover
  transform, `rel="noopener noreferrer"` on every `target="_blank"`.
- R4.7 — Schedule timeline stays an `<ol>`; each stop's date renders as
  `<time dateTime={ISO}>`.
- R4.8 — Status labels do not rely on color alone — text is always present (the reference
  already does this; keep it).

### 6.5 Responsive

- R5.1 — Breakpoints stay `base / md 768 / lg 1024` per the grid contract. `sm` is
  intentionally skipped for column counts.
- R5.2 — Verified at 375, 768, 1280. Hero display type continues to scale fluidly, expressed
  through tokens rather than a bracket `clamp()`.
- R5.3 — Both distinct mobile compositions (hub and detail) keep dedicated stories, as the
  current metadata already notes.
- R5.4 — The horizontal nav's narrow-screen scroll is a **known open issue** carried from the
  reference caveats — active-item visibility and edge discoverability need review (Q3).

### 6.6 Status states

All six `EventStatus` values render distinctly, in both the dark (`dark` prop) and light
label treatments, and drive CTA labels. The reference's `EventAction` label logic
(`concluded` → "View event archive", `coming-soon` → "Follow updates",
`ticketUrl` present → "Buy tickets on {provider}") is correct behavior and must be preserved,
but with the provider name interpolated from the model.

---

## 7. Open Questions

| # | Question | Owner | Blocks |
|---|---|---|---|
| Q1 | Is `hot-rod` becoming a first-class publication in the token pipeline, or staying a route-scoped composition under Autos? R2.2 assumes first-class. This is the single biggest scoping decision. | Design System + Autos | R2.2 |
| Q2 | Can FRE `SiteHeader` express the event nav (brand switcher, section filters, Events active state), or does the template keep composing `hearst-plus/utility-bar` + `MainNav`? | FRE + Design System | R3.1 |
| Q3 | Accepted behavior for the horizontal nav on narrow screens (carried caveat)? | Design + A11y | R5.4 |
| Q4 | Which brand is pilot #2? Needed to prove G2 — one brand cannot demonstrate rebrandability. | Product | G2, acceptance |
| Q5 | Does the Figma file introduce anything not in the built reference? **I could not read it — the Figma MCP connector in this session is unauthenticated.** Needs a human or an authorized session to diff. | Design | Parity scope |
| Q6 | Do archive editions (2024/2025) get populated in this iteration, or does the selector only expose them correctly (A1)? Currently scoped as non-goal. | Product | Scope |
| Q7 | Is the target repo `Media-Platforms/hearst-design-system`? The local working copy's remote is `Lenindesign/hearst`. Confirm where the PR lands. | Eng | Delivery |

---

## 8. User Stories

Format matches `AIDLC-docs/user-stories-single-brand-destinations.md`.
Status: ✅ implemented · 🔶 partial · ⬜ planned.

### Personas

| Persona | Description | Primary need |
|---|---|---|
| **Event Attendee** | A reader planning to attend | Dates, route, tickets, and what to expect — fast, on a phone, often on-site |
| **Event Follower** | A reader tracking the series without attending | Coverage, results, and next-edition notice |
| **Brand Editorial** | The brand team running the event | Launch a destination that looks like their brand without front-end work |
| **Design-System Maintainer** | Owns HDS tokens and the component contract | No new hardcoded values; no parallel design system |
| **AI-DLC Agent** | Generates a new destination from structured inputs | A validated, complete content + token contract |

---

### Epic 1 — Render a branded event destination

**US-1.1 — Land on an event hub · MVP · ⬜**
**As an** event attendee, **I want** to open a brand's events URL, **so that** I see that
brand's events in that brand's identity.
- **Given** I navigate to an event hub route
- **When** the page loads
- **Then** the hero, accent color, headline typeface, logo, and footer all resolve from that
  brand's token file — and no value is hardcoded in template TSX.
- *Traces to:* R2.1, R2.2, R3.2.

**US-1.2 — Read the hero at a glance · MVP · ⬜**
**As an** event attendee, **I want** the event name, dates, location, and status visible
without scrolling, **so that** I can decide whether it's for me.
- **Given** the hero renders
- **Then** badge, kicker, display headline, date, location, and (when set) status label are
  all above the fold at 375px, and text contrast over the scrim is ≥ 4.5:1.
- *Traces to:* R4.4, R5.2.

**US-1.3 — Act from the hero · MVP · ⬜**
**As an** event attendee, **I want** a clear primary action, **so that** I can buy, register,
or read the recap.
- **Given** `ctas` are defined
- **Then** a primary and an optional secondary CTA render, external links carry an external
  icon plus `rel="noopener noreferrer"`, and every target is ≥ 44px.
- *Traces to:* §6.6, R4.6.

**US-1.4 — Omit sections that have no content · MVP · ⬜**
**As** Brand Editorial, **I want** sections to disappear when I leave their content empty,
**so that** I'm not forced to invent a schedule or ticket tiers.
- **Given** an `EventDestination` with no `ticketTiers` and no `coverage`
- **Then** those sections do not render, and no empty heading or divider is left behind.
- *Traces to:* §5.2.

---

### Epic 2 — Plan the event

**US-2.1 — Follow the route or schedule · MVP · ⬜**
**As an** event attendee, **I want** an ordered list of stops with dates, venues, and notes,
**so that** I can plan which day to join.
- **Given** `schedule` is populated
- **Then** stops render as an ordered timeline, numbered from `scheduleIndexBase`, each date
  as `<time dateTime>`, in an `<ol>`.
- *Traces to:* R4.7, R3.4.

**US-2.2 — Reach official resources · MVP · ⬜**
**As an** event attendee, **I want** maps, itineraries, and FAQs, **so that** I can prepare.
- **Given** `resources` are populated
- **Then** each renders label + description + external icon, opens in a new tab safely, and
  has a ≥ 44px target and a visible tokenized focus ring.
- *Traces to:* R2.6, R4.6.

**US-2.3 — Understand ticket options · MVP · ⬜**
**As an** event attendee, **I want** tiers, prices, and rules, **so that** I buy the right one.
- **Given** `ticketTiers` and `ticketNotes` are populated
- **Then** each tier shows title, price, and detail; notes render as a list; purchase CTAs go
  to `ticketUrl` with the provider named from `ticketProvider`.
- **And** the template performs no payment handling — links are outbound only.
- *Traces to:* R1.4, Non-goals.

**US-2.4 — Know where an event stands · MVP · ⬜**
**As an** event follower, **I want** accurate status, **so that** I don't try to buy a
sold-out ticket.
- **Given** any of the six `EventStatus` values
- **Then** the label renders with correct treatment on both light and dark surfaces, the CTA
  label matches the status, and status is never conveyed by color alone.
- *Traces to:* §6.6, R4.8.

---

### Epic 3 — Navigate editions and the calendar

**US-3.1 — Switch editions accessibly · MVP · ⬜**
**As an** event follower, **I want** to see which years exist and which I can open, **so that**
I can reach past coverage.
- **Given** the edition selector renders
- **Then** the current edition is `aria-current`, unavailable editions remain **focusable**
  with `aria-disabled="true"`, availability is explained in **visible text** (not `title`),
  and no unavailable edition uses the `disabled` attribute.
- *Traces to:* R4.1 (**fixes A1**).

**US-3.2 — Browse all events by calendar or list · MVP · ⬜**
**As an** event follower, **I want** to switch between calendar and list, **so that** I can
scan the way I prefer.
- **Given** the hub renders the calendar section
- **Then** the toggle exposes `role="group"` with an accessible name, `aria-pressed` reflects
  state, and both views render the same event set.
- *Traces to:* R4.2 (**fixes A2**).

**US-3.3 — Group the calendar from real dates · MVP · ⬜**
**As a** design-system maintainer, **I want** calendar buckets derived from `startDate`,
**so that** the template works for any event set.
- **Given** an arbitrary set of events
- **Then** buckets are computed from ISO dates, sorted chronologically, with no hardcoded
  month labels and no `dateLabel.startsWith()` filtering.
- **And** a month with no events renders the documented empty state.
- *Traces to:* R1.1 (**fixes finding F**).

---

### Epic 4 — Rebrand the template (the AI-DLC story)

**US-4.1 — Stand up a second brand without touching TSX · MVP · ⬜**
**As** Brand Editorial, **I want** a new event destination from content + tokens, **so that**
I don't need front-end work.
- **Given** a filled `EventSeries` record and a `tokens/brands/<slug>.json`
- **When** the route is registered
- **Then** a complete destination renders in that brand's identity
- **And** `git diff` shows **zero** changes to event template component files.
- *Traces to:* G2, R2.1, R3.2.

**US-4.2 — Fail loudly on bad input · MVP · ⬜**
**As an** AI-DLC agent, **I want** validation errors, **so that** I don't ship a broken page.
- **Given** a record missing a required field, with a non-ISO `startDate`, or with a
  `brandSlug` absent from `tokens/manifest.json`
- **Then** `events:validate` fails the build with a message naming the field and record.
- *Traces to:* R1.3.

**US-4.3 — Keep the token audit clean · MVP · ⬜**
**As a** design-system maintainer, **I want** no hardcoded values, **so that** the audit stays
green.
- **Given** the template is built
- **Then** `npm run tokens:audit:ci` passes, the metadata record carries `violations: []`, and
  the template contains no hex literal, `rgba()`, or inline color `style` block.
- *Traces to:* R2.1, R2.7 (**fixes the declared violation**).

**US-4.4 — Regenerate an edition year over year · Post-MVP · ⬜**
**As** Brand Editorial, **I want** to roll an event to next year by copying its record,
**so that** annual editions are cheap.
- **Given** the 2026 record
- **When** I copy it, update dates, and set `status: "coming-soon"`
- **Then** the new edition renders and joins the calendar and selector automatically.

---

### Epic 5 — Preserve what exists

**US-5.1 — No visual regression on HOT ROD · MVP · ⬜**
**As** the HOT ROD team, **I want** my live routes unchanged, **so that** tokenization is
invisible to readers.
- **Given** the three HOT ROD routes are migrated to the template
- **Then** visual regression at 375 / 768 / 1280 shows no unintended diff, and all existing
  URLs still resolve.
- *Traces to:* G4.

**US-5.2 — Keep Storybook as the executable spec · MVP · ⬜**
**As a** design-system maintainer, **I want** stories importing the routed exports, **so that**
there is no parallel template.
- **Given** the stories are updated
- **Then** they import the exact routed exports and cover hub, series detail, edition detail,
  calendar/list interaction, all six status values, both mobile compositions, and **at least
  two brands**.
- *Traces to:* G2, G5.

---

## 9. Technical Environment

### Existing stack (must be preserved)

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Language | TypeScript | 5.x | `strict: true`. No `.js` files. |
| Framework | Next.js (App Router) | 16.1.6 | RSC-first. |
| UI | React | 19.2.3 | |
| Styling | Tailwind CSS | v4 | Token-backed CSS variables. No CSS-in-JS. |
| Tokens | Style Dictionary | 5.3.x | `tokens/` → `src/lib/tokens.css`, `src/lib/brands.ts`. **Never hand-edit generated output.** |
| Storybook | Storybook | 8.6.x | Executable spec + test harness. |
| Test | Vitest + Playwright | 3.2.x | Stories run in Chromium. |
| Icons | @phosphor-icons/react | 2.x | `/dist/ssr` in server components. |
| Hosting | Netlify | — | `@netlify/plugin-nextjs`. Not AWS. |
| Runtime | Node.js | 22 (CI) | |

### Token architecture (authority order)

Per `AIDLC-docs/DESIGN-SYSTEM-SPEC.md` §1:

```
tokens/core/  →  tokens/semantic/  →  tokens/brands/<slug>.json
                                   ↓  style-dictionary build
                    src/lib/tokens.css + src/lib/brands.ts   ← generated, never hand-edited
```

Canonical token values live in `tokens/`. Figma and Pencil are **downstream consumers** and
do not override Git tokens or shipped behavior — so the Figma file (Q5) informs parity but is
not the source of truth.

### Files to add

```
src/lib/event-destination.ts                  # generalized model + validation types
src/lib/event-destination-data.ts             # HOT ROD records, migrated from hot-rod-events.ts
src/components/event-destination-page.tsx     # single export, mode discriminator
src/components/event-destination-sections/    # S1–S8 as prop-driven components
src/components/event-destination-page.metadata.ts
tokens/brands/hot-rod.json                    # new — see Q1
scripts/validate-events.ts                    # events:validate
src/stories/EventDestination.stories.tsx
```

### Files to change

- `tokens/manifest.json` — register `hot-rod` in `brandSlugs`.
- `tokens/brands/_meta.json` — add `hot-rod` font overrides.
- `tokens/core/`, `tokens/semantic/` — add the `component-event-*` namespace and any missing
  scale steps (R2.3).
- `src/app/autos/[brandSlug]/events/**` — three routes repoint to the new template.
- `package.json` — add `events:validate` to `quality`.
- `BRAND_STYLES.md` §"HOT ROD Events scoped composition" — rewrite: the palette is no longer
  a route-scoped exception but a brand token file. **Required by `AGENTS.md`:** *"When a user
  establishes a durable rule, update the appropriate canonical file in the same change."*
- `DESIGN-SYSTEM-SPEC.md` — document the template contract.
- `DECISION_LOG.md` — record the Q1 decision.

### Files to delete (after migration)

- `src/lib/hot-rod-events.ts`, `src/components/hot-rod-events-page.tsx`, and
  `src/components/hot-rod-events-page.metadata.ts` — superseded. Do not leave a fork.

---

## 10. Security & Compliance

Companion: `AIDLC-docs/security-compliance-matrix.md` (OWASP Top 10 2021 baseline).

| Concern | Position |
|---|---|
| **PCI-DSS** | **Not Applicable** — no payment handling. Ticket links are outbound to the provider. This must remain true; adding embedded checkout changes the compliance posture. |
| **A03 Injection** | Event content is checked-in structured data, not parsed feed HTML — this template does not inherit the RSS-parser risk. If event content later comes from a feed or CMS, it must route through the single escaped parser. |
| **A05 Misconfiguration** | Hero and coverage images are remote (`hips.hearstapps.com`). Every new brand's image host must be added to `next.config.ts` `remotePatterns` **over HTTPS only** — the matrix already flags an open `http` pattern for `*.h-cdn.co`. |
| **A10 SSRF** | Resource and ticket `href`s are outbound links rendered as anchors, never server-fetched. Keep it that way. |
| **Outbound links** | Every `target="_blank"` carries `rel="noopener noreferrer"` (reference already complies). |
| **Editorial disclaimer** | The footer `finePrintNote` telling readers to confirm with the organizer is a **required** field of the template, not optional copy. |

---

## 11. Definition of Done

- [ ] `EventDestination` / `EventSeries` model implemented, ISO dates, `events:validate` wired into `quality`
- [ ] `component-event-*` tokens added; `tokens/brands/hot-rod.json` created; `hot-rod` registered in `manifest.json` and `_meta.json`
- [ ] Template contains **zero** hex literals, `rgba()`, inline color `style` blocks, and no arbitrary Tailwind bracket values outside the token scale
- [ ] `npm run tokens:audit:ci` green; metadata record ships `violations: []`
- [ ] All three HOT ROD routes render from the template; old files deleted, not forked
- [ ] Visual regression at 375 / 768 / 1280 shows no unintended diff vs. the current routes
- [ ] A11y findings A1–A6 resolved; axe clean; keyboard walkthrough of hero → selector → timeline → resources → toggle → calendar
- [ ] Pilot brand #2 renders from content + tokens with **zero** template TSX changes (`git diff` proves it)
- [ ] Stories cover 3 modes × 6 statuses × 2 brands × 2 mobile compositions, importing routed exports
- [ ] `BRAND_STYLES.md`, `DESIGN-SYSTEM-SPEC.md`, `DECISION_LOG.md` updated in the same change
- [ ] `npm run quality` green

---

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Q1 unresolved (is `hot-rod` a real brand?) | Blocks R2.2 — the whole token plan | Decide at inception; it is the first agenda item |
| Tokenizing the hero `clamp()` loses the display-type feel | Visual regression on the signature element | Add the fluid step to the core scale rather than approximating with a fixed step |
| FRE `SiteHeader` can't express event nav | Template forks a header, violating G3 | Q2 at inception; raise a gap ticket against FRE rather than forking |
| One pilot brand only | G2 unprovable — "reusable" stays theoretical | Q4: commit to brand #2 before Construction |
| Hero contrast fails for a light-image brand | A11y failure post-launch | R4.4 stress story; consider a required minimum-scrim token |
| Scope creep into live ticketing | Changes PCI posture and timeline | Explicit non-goal; re-scope as its own project |

---

## 13. References

**Code**
- `src/components/hot-rod-events-page.tsx` — reference implementation (911 lines)
- `src/lib/hot-rod-events.ts` — reference content model (293 lines)
- `src/components/hot-rod-events-page.metadata.ts` — declares the violations this PRD closes
- `src/components/ui/grid.tsx` — 4 / 8 / 12 grid contract
- `src/components/fre/index.ts` — FRE surface
- `src/stories/HearstPlusHotRodEvents.stories.tsx` — existing stories

**Canonical docs** (ownership per `AGENTS.md`)
- `AIDLC-docs/DESIGN-SYSTEM-SPEC.md` — token architecture, authority order, component contract
- `BRAND_STYLES.md` §"HOT ROD Events scoped composition" — the exception this PRD retires
- `HEARST-TOKEN-NAMING-TAXONOMY.md` — `component-{name}-{property}-{variant}-{state}-{size}`
- `AIDLC-docs/security-compliance-matrix.md` — OWASP baseline
- `AIDLC-docs/vision-document-guide.md`, `technical-environment-guide.md` — AIDLC formats

**External**
- [Media-Platforms/hearst-design-system](https://github.com/Media-Platforms/hearst-design-system)
- [HOT ROD Events — Figma](https://www.figma.com/design/hZKJEFBqDq2JB1HEpYVYU4/HOT-ROD-Events?node-id=0-1) *(not reviewed — see Q5)*
