# The Hearst Design System (HDS) Design Constitution

> **Canonical Authority**: This document establishes the foundational design laws, architectural standards, token rules, and anti-slop guidelines for all human designers, product managers, software engineers, and AI agents operating on the Hearst platform.

---

## Preamble

The Hearst Design System (HDS) powers the digital publishing experience across 29+ iconic media brands (including *Cosmopolitan*, *Car and Driver*, *Delish*, *Elle*, *Esquire*, *House Beautiful*, and *Good Housekeeping*).

The purpose of this Constitution is to guarantee **uncompromised editorial integrity, unified multi-brand scalability, and zero generic "AI slop"**. Every interface created by human or artificial intelligence must conform to these eight immutable articles.

---

## Article I: The 5-Layer System Stack

Every surface in HDS is constructed through a strictly ordered 5-layer hierarchy. Boundaries must never be breached:

```
┌────────────────────────────────────────────────────────┐
│ Layer 05: 29+ Brand Themes (data-brand overrides)      │
├────────────────────────────────────────────────────────┤
│ Layer 04: 2 Page Archetypes (Home/Index vs. Article)   │
├────────────────────────────────────────────────────────┤
│ Layer 03: Global Modules (UtilityBar, NavBar, Footer)  │
├────────────────────────────────────────────────────────┤
│ Layer 02: UI Primitives (shadcn/Radix foundations)     │
├────────────────────────────────────────────────────────┤
│ Layer 01: Design Tokens (JSON source of truth)         │
└────────────────────────────────────────────────────────┘
```

1. **Tokens (`tokens/`)**: Core scales (color, type, space, radius) compiled via Style Dictionary.
2. **Primitives (`src/components/ui/`)**: Pure components without business logic or hardcoded brand styles.
3. **Global Modules (`src/components/hearst-plus/`)**: Universal shell and state providers across all routes.
4. **Archetypes (`src/components/`)**: The two fundamental templates (Home/Index and Article/Detail).
5. **Brand Themes (`tokens/brands/`)**: Typography and color identities applied dynamically via `data-brand`.

---

## Article II: The Editorial Aesthetic Law (Zero "AI Slop")

AI models unconstrained by tokens default to generic SaaS tropes. The following laws are strictly enforced:

### 1. Banned Anti-Patterns ("AI Slop"):
- ❌ **No Pastel Rainbow Cards**: Never wrap adjacent cards in random alternating pastel borders (cyan, purple, pink, teal, amber).
- ❌ **No Saturated Neon Badges**: Never use neon pill fills or gradient glow effects.
- ❌ **No Generic Format Chips**: Never render redundant pills like `[ARTICLE]`, `[WATCH]`, or `[READ]` on cards.
- ❌ **No Unstyled Cards**: Never render cards without brand kickers, bylines, or typographic hierarchy.

### 2. Mandated Editorial Standards:
- ✅ **Monochromatic Slate Grids**: Multi-card matrices must use single-pixel slate borders (`grid gap-px bg-slate-200` with `bg-white p-6` cards).
- ✅ **Hearst Editorial Palette**:
  - Deep Hearst Navy (`#102A43`) for solid primary headers and structural anchors.
  - Hearst Blue (`#2D75B9`) for section eyebrows, category kickers, and subtle accent rules.
  - Slate neutrals (`#F8FAFC`, `slate-200`, `slate-600`) for structural framing.
- ✅ **Editorial Section Rules**: All major sections must begin with a top 2px solid navy rule (`border-t-2 border-[#102A43] pt-6`).
- ✅ **Newsreader Serif Headlines**: Headlines use high-contrast serif typography with calibrated optical line-heights and tight tracking (`tracking-[-0.02em]`).

---

## Article III: The Two Master Page Archetypes

The entire Hearst platform flows through two fundamental templates. Creating parallel rogue templates is forbidden.

### Template 1: Home Page & Index Pages Archetype
* **Primary Role**: Content discovery, algorithmic and curated feeds, multi-brand exploration.
* **Layout Variants**:
  1. *Curator Mode*: Lead Big Story hero + 3-story cluster + 9:16 Shorts carousel + 4-across grid.
  2. *Mosaic Mode*: 5-image composite gallery cards + visual spotlights.
  3. *Stream Mode*: High-density chronological feed for fast scanning.
  4. *Editorial Mode*: Structured magazine front with section dividers and pull quotes.
* **Companion Sidebar Rails**: Discovery Filter Sidebar, Trending Rail, Local News TV Rail, Your Daily Habit.

### Template 2: Article Page & Detail Pages Archetype
* **Primary Role**: Distraction-free reading, longform essays, commerce product recommendations.
* **Reading Modes**:
  1. *Standard Longform*: 8+4 grid with reading column, floating action bar, and context rail.
  2. *Immersive Feature*: Full-bleed widescreen hero, visual scenes, and fact sheet overlays.
  3. *Ambient Reader ('P' key)*: Full-screen horizontal snap track with airy typography.
  4. *Slide-Over Dialog Shell*: Seamless modal reader over the river without losing scroll position.
* **Companion Rails**: Author Bio Context Rail, Fact Sheets (`<FactRail />`), Display Ad Slots.

---

## Article IV: Content Card & Media Contracts

Every card model must adhere to exact component contracts:

| Card Model | Aspect Ratio | Headline Rule | Key Features |
| :--- | :--- | :--- | :--- |
| **Standard River Card** | 16:9 (or 3:2) | Max 3 lines clamped | Topic kicker + dot + brand name, 3-line dek, author byline, timestamp, bookmark action. |
| **Rich Photo Gallery** | 6-col 2-row composite | Above media grid | Automatically upgrades on &ge;5 images. 5th slot shows `+X Photos` dark overlay. |
| **16:9 Adaptive Video** | 16:9 widescreen | Max 2 lines clamped | Playable `<AdaptiveVideo />`, bottom-right exact duration timestamp (`14:28`), channel attribution. |
| **9:16 Delish Shorts** | 9:16 portrait | Max 2 lines clamped | Vertical looping reel, recipe step preview, sound toggle (`<Volume2 />`), direct reader link. |
| **Big Story Cover** | Split cover (desktop) | 36px-48px Serif | Oversized headline, expanded 4-line dek, cover feature badge. |
| **Ambient Commerce** | 1:1 product cutout | Display title | Lab test winner badge, price, retailer, structured Pros & Cons lists, verified shop link. |

---

## Article V: Multi-Brand Token Governance

1. **Tokens as Code**: All brand tokens are authored in JSON and compiled by Style Dictionary into CSS custom properties.
2. **Runtime Theme Injection**: Themes are activated via the DOM attribute `data-brand="{brandSlug}"` on the root container.
3. **No Hardcoded Hex Values**: Component code must reference CSS variables (`var(--primary)`, `var(--font-headline)`) or semantic Tailwind classes (`text-primary`, `bg-card`).
4. **Backwards Compatibility**: Deprecated token aliases must never be removed without automated migration scripts and review.

---

## Article VI: Feed Orchestration & Deduplication

1. **Deterministic Inventory Allocation**: High-value slots claim stories in strict sequence to prevent duplicates:
   `1. Today's Picks (5 Slides) ➔ 2. Today's Edit ➔ 3. Daily Habit ➔ 4. Trending ➔ 5. River Sentinel`
2. **3-Source Blend Guardrails**:
   - Baseline: Curated editorial RSS snapshot.
   - Dynamic: Personalize live recommendations (capped at &lt; 30% of total feed).
   - Video: Validated H.264 MP4 / HLS streams.
3. **Demand-Driven Loading**: Appends exactly 4 ranked cards on scroll sentinel proximity. Never loads full catalogs on idle.

---

## Article VII: Accessibility & Performance

1. **Contrast Standards**: All text tokens must achieve WCAG AA contrast (4.5:1 for normal text, 3:1 for large display).
2. **Dialog & Focus Traps**: Slide-over modals must trap keyboard focus, bind `Escape` dismissal, and apply `aria-modal="true"`.
3. **Semantic Landmarks**: Use `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, and `<footer>` landmarks.
4. **Reduced Motion**: All animations must respect `prefers-reduced-motion: reduce`.

---

## Article VIII: The Agentic Operating Rules for Teams

When product managers, designers, or engineers prompt AI agents:

1. **Constrain, Don't Ask for Inspiration**: Always supply the target component contract, typography role (Newsreader vs. Livvic), and palette tokens (`#102A43` / `#2D75B9`).
2. **Keep the Source of Truth Deterministic**: Use AI agents to write code, tests, and living docs; keep the token JSON schema governed by humans and CI.
3. **Breadth for Agents, Depth for Humans**: Designers craft the signature editorial hero; agents scale it to the remaining 28 publication themes.
4. **Mandatory CI Validation**: All agent-generated code must pass `npx tsc --noEmit` and `next build` before PR merge.
