---
name: hearst-grid-system
description: Implement and audit layout using the Hearst responsive grid (PageContainer, Grid, Col), breakpoints 4/8/12, overlap patterns, and GridOverlay. Use when building pages/templates, fixing alignment to the grid, Grid System Storybook work, or avoiding ad-hoc grid utilities.
---

# Hearst Grid System Agent

**Working directory:** `hearst-design-system/` (commands from repo root or `hearst-design-system/`)

## When to use this skill

User mentions **grid**, **columns**, **PageContainer**, **layout system**, **4/8/12**, **overlap**, **Foundation / Grid System**, **spatial contract**, or **full-width vs content width**.

## Source of truth

| Artifact | Location |
|----------|----------|
| Primitives | `src/components/ui/grid.tsx` |
| Metadata / guardrails | `src/components/ui/grid.metadata.ts` |
| Overview MDX | `src/stories/GridSystem.mdx` (includes **Cursor agents and skills** section) |
| Interactive stories | `src/stories/Grid.stories.tsx` (`Foundation/Grid System`) |

**Storybook:** Foundation → Grid System (Overview + anatomy stories). Production: `/storybook/` on Netlify when deployed; local: `npm run storybook` → http://localhost:6006

## The contract

- **Columns:** **4** (mobile / base through `sm`) → **8** (`md` tablet) → **12** (`lg+` desktop). Do **not** switch column count at `sm` (640px); that is intentional.
- **Primitives:**
  - **`PageContainer`** — max width via `--width-content-max`, responsive **outer padding** (`px-4 md:px-6 lg:px-12`). Props: `bleed`, `width` (`content` \| `narrow` \| `full`).
  - **`Grid`** — the **track**; default columns 4/8/12. Props: `columns` (number or `{ base, md, lg }`), `gap` (`default` \| `tight` \| `loose` \| `none`), `alignStart`.
  - **`Col`** — **span** / **start** at breakpoints: `span`, `spanMd`, `spanLg`, `startMd`, `startLg`, optional **overlap** via `rowStart*`, `offsetYMd` / `offsetYLg`, `raised`.
- **`GridOverlay`** — debug/visual guide (12 columns); use inside a **`relative`** parent, often with `PageContainer`. `aria-hidden`.
- **`useBreakpoint`** — rare; prefer Tailwind responsive classes. For docs/debug only per file comments.

## Rules (non-negotiable)

1. **Prefer `PageContainer` → `Grid` → `Col`** for page-level and template layouts instead of raw `grid grid-cols-*` on arbitrary wrappers.
2. **`Col` span/start values must be literal unions** encoded in `grid.tsx` — Tailwind must see static class strings at build time. **Do not** pass dynamic numbers from props unless you extend the lookup tables in `grid.tsx`.
3. **Brand-aware styling** belongs on **children / tokens**, not on swapping grid mechanics — grid primitives are **not** brand-themed (`brandAware: false` in metadata).
4. **Inner components** (cards, inputs): use local flex/grid if the layout is **component-internal**; do not wrap every molecule in `PageContainer`.

## Tokens (reference)

Spacing contract ties to CSS variables (see `globals.css` + metadata):

- `--width-content-max`, `--breakpoint-*`
- Grid gutters / margins: `--grid-gutter-*`, `--grid-margin-*` (aligned with `Grid` gap and `PageContainer` padding)

Use existing Tailwind tokens/utilities from the design system; do not invent one-off pixel grids.

## Implementation checklist

- [ ] Outer frame: `PageContainer` with correct `width` / `bleed` for the template (article vs marketing vs full bleed).
- [ ] `Grid` `gap` matches density (default vs tight vs none for mosaics).
- [ ] `Col` spans specified per breakpoint where layout changes (mobile-first literals).
- [ ] Overlap sections: use documented `offsetY*` / `raised` patterns; verify in Storybook overlap story.
- [ ] No new column counts outside **4 / 8 / 12** unless product explicitly extends `resolveColumns` and stories.

## Coordination with other skills

- **`hearst-frontend-component`** — UI implementation, ThemeProvider, tokens on **content inside** cells.
- **`adapt`** — viewport/breakpoint behavior when refining responsive behavior beyond grid defaults.
- **`layout`** — composition and rhythm; grid supplies the **column math**, layout skill supplies hierarchy and spacing intent.

## Anti-patterns

- Hand-rolling `max-w-*` + manual padding that duplicates `PageContainer`.
- Using `sm:` to change column count for the **system grid** (breaks the 4-until-md rule).
- Dynamic `col-span-${n}` strings — breaks Tailwind JIT.
