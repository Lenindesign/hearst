---
name: hearst-frontend-component
description: Build React components for the Hearst design system using tokens via CSS variables and Tailwind. Implement responsive layouts, brand theming, and Next.js patterns. Use when building components, fixing layout/styling, or implementing designs from Pencil specs.
---

# Hearst Frontend Component Agent

**Working directory:** `hearst-design-system/` (run all commands from project root or `hearst-design-system/`)

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Shadcn components (via class-variance-authority, clsx, tailwind-merge)
- Lucide React icons

## Theme System

- **ThemeProvider** (`src/components/theme-provider.tsx`) sets CSS custom properties per brand
- **useTheme()** hook returns `{ brand, setBrand }` where `brand` has: `slug`, `name`, `colors`, `fonts`, `semanticColors`, `componentTokens`, etc.
- **ThemeContext** is exported for use in Storybook decorators (e.g. `ThemeDecorator.tsx`)

## CSS Variable Naming

Components consume tokens via:

- **Tailwind utilities:** `bg-primary`, `text-primary`, `font-brand`, `text-primary-foreground`
- **CSS variables:** `var(--palette-neutral-200)`, `var(--font-primary)`
- **`.headline` utility class:** applies `font-headline` + weight (in `globals.css`)

Key CSS variables set by ThemeProvider:

| Category | Variables |
|----------|-----------|
| Shadcn/Tailwind slots | `--primary`, `--secondary`, `--accent`, `--primary-foreground`, `--secondary-foreground`, `--accent-foreground`, `--ring`, `--chart-1` through `--chart-5` |
| Fonts | `--font-brand`, `--font-brand-secondary`, `--font-headline`, `--font-headline-weight` |
| Palette | `--palette-brand-1` through `--palette-brand-14`, `--palette-neutral-*`, `--palette-primary-*` |
| Spacing / Typography | `--space-*`, `--font-size-*`, `--font-line-height-*` |

## Key Components

| Component | Path | Purpose |
|-----------|------|---------|
| HomePageTemplate / BrandHomePage | `src/components/home-page.tsx` | Content-only template vs. full page with NavBar |
| NavBar | `src/components/nav-bar.tsx` | Brand navigation |
| BrandSwitcher | `src/components/brand-switcher.tsx` | Brand selector dropdown |
| TokenInspector | `src/components/token-inspector.tsx` | Visual Dictionary overlay (computed styles + tokens on hover) |
| ThemeProvider | `src/components/theme-provider.tsx` | Theme context and CSS variable injection |

## Component Patterns

- Use `var(--token-name, #fallback)` for all token references in CSS
- Use Tailwind utilities where possible (`bg-primary`, `text-primary-foreground`)
- For brand-specific fonts: `font-brand` (primary), `font-brand-secondary`, `.headline` class
- Responsive: use Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)
- All components must work across 29 brands without hardcoded values
- Use `cn()` from `src/lib/utils.ts` for conditional class merging

## File Structure

```
hearst-design-system/
  src/
    components/     # React components
    components/ui/   # Shadcn-style primitives (button, card, input, etc.)
    lib/
      brands.ts     # GENERATED brand metadata (do not edit)
      tokens.css    # GENERATED CSS custom properties (do not edit)
      utils.ts      # cn(), etc.
    stories/        # Storybook stories
    app/            # Next.js app router pages
```

## Component Metadata

Every new component should get a `.metadata.ts` file alongside it:

```
src/components/ui/button.tsx           ← component
src/components/ui/button.metadata.ts   ← AI-readable spec
```

- **Schema:** `src/lib/component-metadata.ts`
- **Contents:** name, description, atomic level, whenToUse/whenNotToUse, token references, dependencies, variants, caveats
- Read existing metadata files before building similar components to understand patterns and token usage

## Instrumentation Scripts

| Command | Purpose |
|---------|---------|
| `npm run audit` | Scan for hardcoded colors and token violations |
| `npm run audit:json` | Save full report to `reports/token-audit.json` |
| `npm run index` | Generate component dependency graph at `reports/component-index.json` |

## Rules

- **NEVER** hardcode brand colors — use CSS variables or Tailwind tokens
- **NEVER** edit `brands.ts` or `tokens.css` — they are generated from `tokens/`
- **ALWAYS** test with at least 3 different brands in dev server (`npm run dev`)
- **ALWAYS** create a `.metadata.ts` file when adding a new component
- **ALWAYS** run `npm run audit` after creating components to verify no hardcoded values
- Use `cn()` from `src/lib/utils.ts` for conditional class merging
- For Storybook: wrap stories with `ThemeProvider` or `ThemeDecorator` for brand switching
