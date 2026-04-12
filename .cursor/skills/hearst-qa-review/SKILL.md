---
name: hearst-qa-review
description: Verify brand colors, fonts, and layouts across all 29 Hearst brands. Validate token consistency, review Storybook stories, audit accessibility, check visual regression. Use when verifying brand rendering, after deployments, or before releases.
---

# Hearst QA / Review Agent

**Working directory:** `hearst-design-system/` (run all commands from project root or `hearst-design-system/`)

## Scope

Verify that all 29 brands render correctly with proper colors, fonts, spacing, and layouts.

## Brand Slugs (29 brands)

autoweek, best-products, bicycling, biography, car-and-driver, cosmopolitan, country-living, delish, elle, elle-decor, esquire, food-network, good-housekeeping, harpers-bazaar, hgtv, house-beautiful, marie-claire, mens-health, oprah-daily, popular-mechanics, prevention, road-and-track, runners-world, seventeen, town-and-country, veranda, womans-day, womens-health

---

## Brand Verification Checklist

For each brand, verify:

1. **`brand-1` color** displays correctly (primary brand color)
2. **Headline font** matches `_meta.json` override (`fontHeadline`, `fontHeadlineWeight`)
3. **Secondary font** matches if specified (`fontSecondary`)
4. **Primary font** (`font-family-default`) from brand JSON
5. **Component colors** derive from brand-1 (buttons, badges, links, eyebrows)
6. **No hardcoded colors** leaking through

---

## Key Brand Colors (spot-check these)

| Brand | brand-1 | Hex |
|-------|---------|-----|
| Cosmopolitan | red | `#d70000` |
| Esquire | black | `#000000` |
| Elle | black | `#000000` |
| Good Housekeeping | red | `#c8102e` |
| Harper's Bazaar | black | `#000000` |
| Car and Driver | yellow | `#ffd100` |
| Popular Mechanics | black | `#000000` |

---

## Font Verification

Check `_meta.json` overrides are applied:

| Brand | Headline | Secondary |
|-------|----------|-----------|
| Car and Driver | Inter w800 | Barlow Semi Condensed |
| Cosmopolitan | Chronicle Display w600 | — |
| Esquire | Lausanne w400 | — |
| Good Housekeeping | Barlow Semi Condensed w800 | — |
| Harper's Bazaar | NewParis Text w400 | — |

---

## Visual Dictionary / Token Inspector

- **Component:** `src/components/token-inspector.tsx`
- **Toggle:** "Visual Dictionary" button
- **Shows on hover:** font family, size, weight, line-height, color, background, padding, margin, dimensions
- **Also shows:** design token names (CSS variables) bound to elements

---

## Validation Scripts

| Command | Purpose |
|---------|---------|
| `npm run tokens:validate` | Validates token JSON structure |
| `npm run build-tokens` | If this fails, tokens are malformed |
| `npm run audit` | Scans components for hardcoded colors, non-semantic Tailwind, and token violations |
| `npm run audit:json` | Saves full audit report to `reports/token-audit.json` |
| `npm run index` | Generates component relationship map at `reports/component-index.json` |

---

## Testing Tools

| Tool | Purpose |
|------|---------|
| **Vitest + Playwright** | Component testing |
| **Storybook** | Visual review across brands |
| **Dev server** (`npm run dev`) | Interactive testing |

---

## Common Issues

| Issue | Check |
|-------|-------|
| Brand colors not displaying | `brand-1` set in brand JSON file |
| Wrong font | `_meta.json` overrides and that `build-tokens` was run |
| Layout breaks | Responsive breakpoints and spacing token resolution |
| Storybook not showing latest | Clear cache and rebuild |

---

## Accessibility Checks

- **Color contrast:** brand-1 on white background (WCAG AA minimum 4.5:1 for text)
- **Font sizes:** minimum 0.75rem (12px) for body text
- **Focus indicators:** visible on all interactive elements
- **Semantic HTML:** headings, landmarks, ARIA labels

---

## Component Metadata

Components can have `.metadata.ts` files alongside them that provide AI-readable specs:
- **Schema:** `src/lib/component-metadata.ts` — defines `ComponentMetadata` interface
- **Location:** `src/components/ui/button.metadata.ts`, `src/components/ui/card.metadata.ts`, etc.
- **Contents:** when to use, token references, dependencies, variants, violations, caveats
- **Run `npm run index`** to auto-generate the full dependency graph

## Rules

1. **Test with at least 3 brands** from different categories (e.g. Cosmopolitan, Car and Driver, Esquire)
2. **After any token change:** verify the change propagates to CSS variables, Storybook, and the main app
3. **Report issues** with: specific brand slug, expected value, and actual value
4. **Run `npm run audit`** before any release to check for token violations
5. **After adding a new component:** create a `.metadata.ts` file following the schema
