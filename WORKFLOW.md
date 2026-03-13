# Hearst Design System — Workflow Guide

## Architecture Overview

```
Token Studio API (source of truth)
        │
        ├── npm run sync-tokens ──► brands.ts + tokens.css + pencil-variables.json
        │
        ├── npm run sync-to-pencil ──► hearst-brands.pen (direct .pen write)
        │
        └── hearst-brands.pen ──► npm run sync-pencil ──► brands.ts + tokens.css
```

**Three sync scripts, one source of truth:**

| Script | Direction | What it does |
|---|---|---|
| `npm run sync-tokens` | Token Studio API → Code + Pencil JSON | Fetches API, generates `brands.ts`, `tokens.css`, `pencil-variables.json` |
| `npm run sync-to-pencil` | Token Studio API → .pen file | Fetches API, writes variables directly into `hearst-brands.pen` |
| `npm run sync-pencil` | Pencil → Code | Reads `pencil-variables.json`, generates `brands.ts` and `tokens.css` |

---

## Quick Start

```bash
cd hearst-design-system

# Pull latest tokens from Token Studio API into code files
npm run sync-tokens

# Update the Pencil design file with latest tokens
npm run sync-to-pencil

# Start the dev server to preview
npm run dev
```

---

## Workflows by Role

### Token Manager

You maintain the design token system. When Token Studio API changes upstream:

1. **Pull latest tokens into code:**
   ```bash
   cd hearst-design-system
   npm run sync-tokens
   ```
   This updates:
   - `src/lib/brands.ts` — TypeScript brand data (29 brands, colors, fonts, semantic colors, component tokens)
   - `src/lib/tokens.css` — CSS custom properties (`:root` globals + `[data-brand]` overrides)
   - `src/lib/pencil-variables.json` — Pencil-format variable definitions

2. **Update the Pencil design file:**
   ```bash
   npm run sync-to-pencil
   ```
   This writes all 963 variables directly into `hearst-brands.pen`.

3. **Verify in the browser:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` and use the brand switcher to test all 29 brands.

4. **Verify in Pencil:**
   Open `hearst-brands.pen` in Cursor. Use the Variables panel to browse tokens by brand.

5. **Commit:**
   ```bash
   git add -A && git commit -m "sync: update tokens from Token Studio API"
   ```

### Designer

You create and update components and pages in Pencil.

1. **Open the design file:**
   Open `hearst-brands.pen` in Cursor's Pencil editor.

2. **Reference tokens in your designs:**
   Use `$variable-name` syntax to bind to design tokens. For example:
   - `$palette-brand-1` — primary brand color
   - `$font-family-default` — brand default font
   - `$space-md` — 16px spacing
   - `$palette-neutral-500` — mid-gray

3. **Switch brand themes:**
   Use the brand theme axis in the Variables panel to preview how your design looks across all 29 brands.

4. **Use AI assistance:**
   Ask Cursor's AI to help with designs:
   - "Apply the Car and Driver theme to this page"
   - "Create a card component using our design tokens"
   - "Audit this frame for hardcoded colors"

5. **Validate visually:**
   Use `get_screenshot` in the Pencil MCP to capture screenshots of your designs.

6. **Push changes to code:**
   ```bash
   cd hearst-design-system
   npm run sync-pencil
   npm run dev
   ```
   Preview your changes in the browser at `http://localhost:3000`.

7. **Commit:**
   ```bash
   git add -A && git commit -m "design: update component specs"
   ```

### Developer

You build components in code using the design tokens.

1. **Get the latest tokens:**
   ```bash
   git pull
   cd hearst-design-system
   npm run dev
   ```

2. **Use tokens in CSS/components:**
   ```css
   .card {
     background: var(--component-card-background-default);
     border: 1px solid var(--component-card-border-default);
     border-radius: var(--border-radius-2xs);
     padding: var(--space-md);
   }

   .card-title {
     color: var(--palette-content-default);
     font-family: var(--font-family-default);
   }
   ```

3. **Use the brand switcher:**
   The app at `http://localhost:3000` has a brand switcher. Test your component across all 29 brands.

4. **Inspect the design spec:**
   If you need to check the designer's intent:
   - Open `hearst-brands.pen` in Cursor
   - Use `batch_get` to find specific components
   - Use `get_screenshot` to see the intended design
   - Check `BRAND-VARIABLES.md` for the full token reference

5. **Commit:**
   ```bash
   git add -A && git commit -m "feat: implement card component"
   ```

---

## Token Reference

### Where tokens live

| File | Format | Purpose |
|---|---|---|
| `src/lib/tokens.css` | CSS custom properties | Runtime styling via `var(--token-name)` |
| `src/lib/brands.ts` | TypeScript | Brand data for ThemeProvider and JS logic |
| `src/lib/pencil-variables.json` | JSON | Pencil variable definitions |
| `hearst-brands.pen` | Pencil file | Design file with embedded variables |
| `BRAND-VARIABLES.md` | Markdown | Human-readable full token reference |
| `brand-variables-reference.json` | JSON | Machine-readable full token reference |

### Token naming convention

Tokens follow a hierarchical naming pattern:

```
category-subcategory-variant-state
```

Examples:
- `palette-neutral-500` — neutral gray at 500 weight
- `palette-brand-1` — primary brand color
- `component-button-background-primary-solid-default` — button bg, primary variant, solid style, default state
- `font-size-md` — medium font size
- `space-lg` — large spacing (20px)
- `typography-size-md-regular` — composite: medium size, regular weight

### Token categories

| Prefix | Count | Description |
|---|---|---|
| `palette-*` | ~130 | Colors (neutral, alert, primary, brand, content, background) |
| `component-*` | ~320 | Component-specific tokens (button, card, badge, input, etc.) |
| `typography-*` | ~255 | Typography composites (font size + family + weight + line-height) |
| `font-*` | ~60 | Font sizes, weights, letter-spacing, line-heights, families |
| `space-*` | 12 | Spacing scale (none through 6xl) |
| `layout-*` | 17 | Breakpoints, viewports, gutters, max-widths |
| `border-*` | 11 | Border widths, radii, composite borders |
| `elevation-*` | 9 | Z-index layers (base through gate) |
| `sizing-*` | 8 | Icon and component sizing |

---

## Sending Designs to Figma

If you need to push designs from Pencil to Figma (for stakeholder review, etc.):

1. **Start the WebSocket bridge:**
   ```bash
   bunx cursor-talk-to-figma-socket@latest
   ```

2. **In Figma:** Install and open the "Cursor Talk to Figma" plugin. Note the channel ID.

3. **In Cursor:** Use the Talk-to-Figma MCP tools:
   ```
   join_channel → create_frame → create_text → set_fill_color → ...
   ```

4. **Or use the Figma REST API MCP** for reading Figma files:
   ```
   getfile → getfilenodes → getlocalvariables → ...
   ```

---

## Adding a New Brand

1. The brand must first be added to the Token Studio API (upstream).

2. Run the sync pipeline:
   ```bash
   npm run sync-tokens      # pulls new brand into code
   npm run sync-to-pencil   # updates .pen file
   ```

3. The new brand will automatically appear in:
   - The app's brand switcher
   - Pencil's brand theme axis
   - All generated CSS and TypeScript files

---

## Troubleshooting

### "Pencil variables file not found"
Run `npm run sync-tokens` first to generate `pencil-variables.json`.

### Tokens look stale in the browser
1. Run `npm run sync-tokens` to pull latest from API
2. Restart the dev server: `npm run dev`

### Pencil file won't open
The `.pen` file must be opened in Cursor's Pencil editor, not a text editor. If it's corrupted, re-run `npm run sync-to-pencil` to regenerate the variables section.

### Brand switcher missing a brand
Run `npm run sync-tokens` — new brands from the API are automatically discovered.

### CSS variable not working
Check that:
1. The token exists in `tokens.css` (search for `--your-token-name`)
2. The `data-brand` attribute is set on a parent element
3. For brand-themed tokens, the value may differ per brand — check `BRAND-VARIABLES.md`
