---
name: hds-constitution
description: >-
  The official Hearst Design System (HDS) Design Constitution. Use whenever designing,
  scaffolding, reviewing, or proposing features, components, cards, layouts, tokens, or
  brand themes across the Hearst+ ecosystem to enforce editorial standards and eliminate AI slop.
---

# Hearst Design System (HDS) Design Constitution Skill

This skill enforces the official **HDS Design Constitution** across all product design, front-end development, and AI agent workflows.

## When to Activate This Skill
- Scaffolding new components, layout variants, sidebar rails, or card models.
- Auditing UI code for design system compliance and accessibility.
- Reviewing pull requests, feature proposals, or design specs.
- Propagating design tokens across the 29+ Hearst publication brands.
- Eliminating generic "AI slop" (rainbow borders, candy badges, unstyled cards) in favor of authentic Hearst editorial styling.

---

## The 8 Unbreakable Articles of the HDS Design Constitution

### Article I: The 5-Layer Architectural Hierarchy
Every surface in HDS must respect the strict 5-layer hierarchy:
1. **Layer 01: Token JSONs (`tokens/`)** — Canonical source of truth compiled by Style Dictionary.
2. **Layer 02: UI Primitives (`src/components/ui/`)** — Accessible shadcn/Radix foundations.
3. **Layer 03: Global Modules (`src/components/hearst-plus/`)** — UtilityBar, MainNav, ThemeProvider, ReaderAccountProvider, SiteFooter.
4. **Layer 04: Two Page Archetypes (`src/components/`)** — Template 1 (Home/Index) & Template 2 (Article/Detail).
5. **Layer 05: 29+ Brand Themes (`tokens/brands/`)** — Publication identities injected via `data-brand`.
*Rule: Primitives never reach across layer boundaries. Never hardcode brand-specific styling into core primitives.*

### Article II: The Editorial Aesthetic Law (Zero "AI Slop")
- **Forbidden Patterns**: Multi-colored pastel rainbow borders (cyan, purple, pink), saturated neon badge fills, candy pill buttons, generic drop shadows, and unstyled SaaS cards.
- **Mandated Editorial Standards**:
  - Deep Hearst Navy (`#102A43`) for solid primary headers and structural anchors.
  - Hearst Blue (`#2D75B9`) for section eyebrows, category kickers, and subtle accent rules.
  - Slate neutrals (`#F8FAFC`, `slate-200`, `slate-600`) with crisp single-pixel rules (`gap-px bg-slate-200` grids with `bg-white p-6` cards).
  - Editorial section dividers with top 2px solid navy rule (`border-t-2 border-[#102A43] pt-6`).
  - Newsreader serif headlines with calibrated line-heights and tight tracking (`tracking-[-0.02em]`).

### Article III: The Two Master Archetypes
1. **Template 1 (Home & Index Discovery)**:
   - Orchestrates multi-source feeds (Curated RSS, Personalize live feed, Playable HLS/MP4 video).
   - Layout variants: Curator (Lead Hero), Mosaic (5-image collage), Stream (chronological), Editorial (section fronts).
   - Companion rails: Discovery filter sidebar, Trending rail, Local News TV rail, Your Daily Habit.
2. **Template 2 (Article & Detail Reading)**:
   - Reading modes: Standard Longform (8+4 grid), Immersive Feature (full-bleed hero), Ambient Snap Track ('P' key), Slide-Over Dialog Shell.
   - Reading column: drop caps, pull quotes, verified commerce blocks (`<ImmersiveArticleProductReview />`), context rail (author bio & fact sheet).

### Article IV: Card Models & Media Contracts
- **Standard River Card**: 16:9 standard ratio (3:2 fallback), topic kicker + middle dot + publication name, max 3-line clamped headline, 3-line dek summary, byline, timestamp, bookmark action.
- **5-Image Mosaic Gallery**: Upgrades when &ge;5 images exist. 6-column composite grid (Row 1: 2 half-width images; Row 2: 3 images with "+X" count overlay on 5th slot).
- **16:9 Adaptive Video Card**: Strict 16:9 widescreen, duration badge (e.g. `14:28`), `<AdaptiveVideo />` player.
- **9:16 Delish Shorts Reel**: Exact 9:16 portrait ratio, looping reel player, audio controls.
- **Prohibited**: Generic `[ARTICLE]`, `[WATCH]`, or `[READ]` type chips. Format is communicated via brand kicker and media container.

### Article V: Multi-Brand Token Law
- All colors, fonts, line-heights, and radii must resolve through CSS custom properties (e.g., `var(--primary)`, `var(--font-headline)`).
- Never hardcode hex values like `#EC008C` directly in component JSX. Use `data-brand` scoping.

### Article VI: Feed Orchestration & Deduplication
- High-value slots receive prioritized inventory allocation: 1. Today's Picks &rarr; 2. Today's Edit &rarr; 3. Daily Habit &rarr; 4. Trending &rarr; 5. River Sentinel.
- Demand-driven progressive loading: Append 4 ranked cards on sentinel proximity; never download entire catalogs when idle.

### Article VII: Accessibility & Compliance
- WCAG AA contrast compliance across all 29+ brand themes.
- Dialog modals must trap focus, bind Escape key dismissal, and manage `aria-modal="true"`.
- Semantic landmark elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).

### Article VIII: Verification & CI
- Every agent change must pass `npx tsc --noEmit` and `next build` before deployment.
