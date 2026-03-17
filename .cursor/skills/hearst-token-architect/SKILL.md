---
name: hearst-token-architect
description: Manage Hearst design system tokens in Git. Edit token JSON files, run build-tokens, validate output, maintain the 3-layer architecture (core/semantic/brands). Use when editing tokens, adding brands, changing colors/fonts/spacing, or running build-tokens.
---

# Hearst Token Architect

**Working directory:** `hearst-design-system/` (run all commands from project root or `hearst-design-system/`)

## Source of Truth

- Git `tokens/` directory is the single source of truth
- **NEVER** edit `src/lib/brands.ts` or `src/lib/tokens.css` directly — they are generated

## Token Architecture (3 layers)

| Layer | Path | Purpose |
|-------|------|---------|
| **Core** | `tokens/core/global.json` | Global tokens shared across all brands (1600+ tokens: colors, spacing, borders, typography scales, component tokens, elevation, layout) |
| **Semantic** | `tokens/semantic/aliases.json` | Semantic references using `$brand-1` syntax. Currently: `background-brand` and `content-brand` both reference `$brand-1` |
| **Brands** | `tokens/brands/{slug}.json` | Per-brand overrides. Each file contains: `brand-1` through `brand-14`, `palette-brand-*`, `palette-primary-*`, `component-*` colors, `font-family-*`, `font-weight-*`, `typography-*` presets |
| **Meta** | `tokens/brands/_meta.json` | Font overrides per brand: `fontHeadline`, `fontHeadlineWeight`, `fontSecondary` |

## Brand Slugs (29 brands)

autoweek, best-products, bicycling, biography, car-and-driver, cosmopolitan, country-living, delish, elle, elle-decor, esquire, food-network, good-housekeeping, harpers-bazaar, hgtv, house-beautiful, marie-claire, mens-health, oprah-daily, popular-mechanics, prevention, road-and-track, runners-world, seventeen, town-and-country, veranda, womans-day, womens-health

## Token Types

| Type | Examples |
|------|----------|
| `color` | Hex: `#d70000`; Reference: `$brand-1` |
| `number` | Spacing (px), font sizes (rem), border radius, elevation z-index |
| `string` | Borders: `{"width":"1px","color":"#d6d6d6","style":"solid"}`; Typography presets: `{"fontSize":"1rem","fontFamily":"...","lineHeight":"145%","letterSpacing":"0.2px","fontWeight":"500"}`; Font families and weights as plain strings |

## Naming Conventions

- **Kebab-case:** `palette-brand-1`, `component-button-background-primary-solid-default`
- **Component tokens:** `component-{name}-{property}-{variant}-{state}` (e.g. `component-button-background-primary-solid-hover`)
- **Typography presets:** `typography-{context}-{size}-{weight}` or `typography-component-{name}-{element}-{size}`
- **Spacing:** `space-{size}` — none, 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 6xl
- **Font sizes:** `font-size-{size}` — 4xs through 15xl, values in **rem**

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run build-tokens` | Generates `brands.ts` and `tokens.css` from token JSON |
| `npx tsx scripts/build-from-tokens.ts` | Same as above |
| `npm run push-pencil` | Syncs tokens to Pencil `.pen` file |
| `npm run push-figma` | Syncs tokens to Figma variables |
| `npm run tokens:validate` | Validates token structure |

## Workflow

1. Edit token JSON files in `tokens/`
2. Run `npm run build-tokens` to regenerate code
3. Verify changes in dev server with multiple brands
4. After merge: run `push-figma` and `push-pencil` to sync consumers

## Rules

- **NEVER** edit `brands.ts` or `tokens.css` directly
- **ALWAYS** run `build-tokens` after editing token JSON
- **Adding a new brand:** Create `tokens/brands/{slug}.json`, add font overrides to `_meta.json`, run `build-tokens`
- Font size values are in **rem** (not px)
- The `$brand-1` syntax in aliases.json references the brand-specific `brand-1` value from the active brand file
