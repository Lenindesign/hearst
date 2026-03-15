# Hearst Design System — Unified Specification

> Single source of truth for designers, developers, and LLMs.
> Every token, variable, component, and workflow is defined here.

---

## 1. Architecture Overview

### Three tools, three roles

| Tool | Who uses it | Role |
|------|------------|------|
| **Figma** | Designers | Design exploration, layouts, new component concepts, prototyping |
| **Pencil** (.pen files) | Designers + Developers | Handoff layer — approved components built with production tokens |
| **Git** (token JSON files) | Developers + LLMs + CI | Single source of truth for all token values |

### Single Source of Truth: Git

The **token JSON files in `tokens/`** are the single source of truth for all design token values. Everything else — Pencil, CSS, React — is generated or synced from them.

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   FIGMA  (design exploration)                                       │
│     │                                                               │
│     │  Designer approves a component                                │
│     ▼                                                               │
│   PENCIL  (handoff layer)                                           │
│     │  Component rebuilt with production tokens                     │
│     │  Developers + LLMs reference Pencil for specs                 │
│     │                                                               │
│   ──────────────────────────────────────────────────────────────    │
│                                                                     │
│   GIT  tokens/  ← SINGLE SOURCE OF TRUTH                           │
│   ├── core/global.json       ← Global tokens (spacing, borders)    │
│   ├── semantic/aliases.json  ← Semantic references ($brand-1)      │
│   ├── brands/{slug}.json     ← Per-brand values (29 brands)        │
│   └── brands/_meta.json      ← Font overrides (headline, secondary)│
│         │                                                           │
│         ├──► npm run build-tokens                                   │
│         │     ├──► src/lib/brands.ts      (React brand metadata)   │
│         │     └──► src/lib/tokens.css     (CSS custom properties)  │
│         │                                                           │
│         ├──► npm run push-pencil                                    │
│         │     └──► hearst-brands.pen      (Pencil stays in sync)   │
│         │                                                           │
│         └──► npm run push-figma                                     │
│               └──► Figma Variables        (designers see tokens)    │
│                                                                     │
│   ThemeProvider reads brands.ts and sets:                           │
│     • --primary, --secondary, --accent  (Shadcn/Tailwind)          │
│     • --font-brand, --font-brand-secondary, --font-headline        │
│                                                                     │
│   Components consume via:                                           │
│     • Tailwind utilities  (bg-primary, text-primary, font-brand)   │
│     • CSS variables       (var(--palette-neutral-200))             │
│     • .headline utility   (font-headline + weight)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Why Git as source of truth (not Figma, not Pencil)?

| | Git | Figma | Pencil |
|---|---|---|---|
| **Version control** | Full history, diffs, blame | Version history (limited) | Binary .pen, opaque |
| **Code review** | PRs with reviewable JSON | No PR workflow | No PR workflow |
| **CI/CD** | Validate tokens in pipeline | Requires plugin/API | Requires MCP |
| **Collaboration** | Any editor, any tool | Figma-only | Pencil MCP-only |
| **Rollback** | `git revert` | Restore version | Manual |
| **Auditability** | Who, what, when, why | Limited | Limited |

### Where each tool fits

```
                    ┌── push-figma ────► Figma Variables
                    │                    (designers use tokens in Figma)
                    │
Git tokens/ ────────┼── build-tokens ──► brands.ts + tokens.css
(source of truth)   │                    (production code)
                    │
                    └── push-pencil ───► hearst-brands.pen
                                         (handoff specs for developers)

Figma ──design──► Pencil ──handoff──► Code
(exploration)      (approved specs)    (implementation)
```

### Figma remains essential for:
- Visual exploration and iteration
- Prototyping and user testing
- Stakeholder reviews and approvals
- Design system documentation (component galleries)
- Collaboration between designers
- **Using production tokens** via Figma Variables (pushed from git)

### Figma Variables stay in sync because:
- `npm run push-figma` pushes all git tokens to Figma as variables
- One variable collection: "Hearst Design System"
- One mode per brand (29 modes) — designers switch brands in the variable panel
- Colors, spacing, fonts, and component tokens are all available
- Each variable includes `codeSyntax.WEB` so developers see the CSS variable name

### Pencil is the bridge because:
- It uses the **exact same tokens** as production code
- Developers and LLMs can read component specs via MCP tools
- Components in Pencil are pixel-identical to what ships
- It eliminates the "Figma says one thing, code does another" problem

### What designers should NOT do:
- Define new token values in Figma and expect them to reach production (request via team)
- Use Figma inspect spacing/color values as source of truth (use the Figma Variables instead)
- Edit Figma Variables directly (they are pushed from git, not the other way)

---

## 2. Token File Structure

### Directory layout

```
tokens/
├── core/
│   └── global.json            # 401 tokens — spacing, borders, palette, elevation
├── semantic/
│   └── aliases.json           # Semantic references (e.g. content-brand → $brand-1)
└── brands/
    ├── _meta.json             # Font overrides per brand (headline, secondary)
    ├── white-label.json       # 595 tokens
    ├── cosmopolitan.json      # 595 tokens
    ├── car-and-driver.json    # 595 tokens
    └── ... (29 brand files)
```

### Token JSON format

Each token file is a flat object of `{ name: { type, value } }`:

```json
{
  "palette-neutral-200": { "type": "color", "value": "#ededed" },
  "space-md": { "type": "number", "value": 16 },
  "font-family-default": { "type": "string", "value": "Inter" }
}
```

### Brand meta format (`_meta.json`)

```json
{
  "overrides": {
    "cosmopolitan": {
      "fontHeadline": "Chronicle Display",
      "fontHeadlineWeight": 600,
      "fontSecondary": "Chronicle Display"
    }
  }
}
```

---

## 3. Token Naming Convention

### Three layers

| Layer | Purpose | Prefix | Used in components? |
|-------|---------|--------|---------------------|
| **Core** | Raw palette values | `palette-*`, `brand-*`, `space-*`, `border-*` | Only via `var()` with fallbacks |
| **Semantic** | Purpose-driven aliases | `content-*`, `background-*` | Yes — preferred |
| **Component** | Scoped to a UI component | `component-*` | Yes — for component-specific styling |

### Complete naming patterns

| Category | Pattern | Examples |
|----------|---------|----------|
| Brand colors | `brand-{1-6}` | `brand-1` (primary), `brand-2` |
| Palette brand | `palette-brand-{1-14}` | `palette-brand-1` through `palette-brand-14` |
| Palette neutral | `palette-neutral-{shade}` | `palette-neutral-100`, `palette-neutral-lightest` |
| Palette alert | `palette-alert-{status}-{shade}` | `palette-alert-danger-100` |
| Content | `palette-content-{variant}` | `palette-content-default`, `palette-content-brand` |
| Background | `palette-background-{variant}` | `palette-background-subtle-brand` |
| Component | `component-{name}-{property}-{state}` | `component-button-background-primary-solid-default` |
| Spacing | `space-{size}` | `space-xs`, `space-md`, `space-2xl` |
| Border radius | `border-radius-{size}` | `border-radius-2xs` |
| Border width | `border-width-{size}` | `border-width-sm` |
| Font family | `font-family-{role}` | `font-family-default`, `font-family-serif` |
| Typography | `typography-{component}-{property}` | `typography-card-product-content-title-lg` |
| Layout | `layout-{property}` | `layout-gutter-lg`, `layout-maxwidth-xl` |
| Elevation | `elevation-{level}` | `elevation-base`, `elevation-floating` |

---

## 4. CSS Variable Mapping

### Token → CSS → Tailwind

| Token (in JSON) | CSS Variable | Tailwind Class | Usage |
|-----------------|-------------|----------------|-------|
| `brand-1` | `--brand-primary` | — | Brand accent color |
| `palette-neutral-200` | `--palette-neutral-200` | — | Light backgrounds |
| `palette-neutral-600` | `--palette-neutral-600` | — | Secondary text |
| `palette-content-default` | `--palette-content-default` | — | Body text |
| `palette-background-subtle-brand` | `--palette-background-subtle-brand` | — | Newsletter bg |
| `font-family-default` | `--font-brand-sans` | — | (tokens.css) |
| `font-family-serif` | `--font-brand-serif` | — | (tokens.css) |
| (from _meta.json) | `--font-brand` | `font-brand` | Body font (ThemeProvider) |
| (from _meta.json) | `--font-brand-secondary` | `font-brand-secondary` | Eyebrows (ThemeProvider) |
| (from _meta.json) | `--font-headline` | `.headline` | Headlines (ThemeProvider) |
| `brand.colors["1"]` | `--primary` | `bg-primary`, `text-primary` | Shadcn components (ThemeProvider) |

### Quick reference

```
Brand accent color    → var(--brand-primary)
Body text color       → var(--palette-content-default, #121212)
Subtle background     → var(--palette-background-subtle-brand, #f5f0e8)
Neutral border        → var(--palette-neutral-300, #d6d6d6)
Secondary text        → var(--palette-neutral-600, #757575)
Body font             → className="font-brand"
Headline font         → className="headline"
Secondary font        → className="font-brand-secondary"
Shadcn primary button → className="bg-primary"
Shadcn primary text   → className="text-primary"
```

### Spacing scale

| Token | Value | Tailwind |
|-------|-------|----------|
| `space-3xs` | 2px | `gap-0.5` |
| `space-2xs` | 4px | `gap-1` |
| `space-xs` | 8px | `gap-2` |
| `space-sm` | 12px | `gap-3` |
| `space-md` | 16px | `gap-4` |
| `space-lg` | 20px | `gap-5` |
| `space-xl` | 24px | `gap-6` |
| `space-2xl` | 32px | `gap-8` |
| `space-3xl` | 48px | `gap-12` |
| `space-4xl` | 64px | `gap-16` |
| `space-6xl` | 80px | `gap-20` |

---

## 5. Brand Theming

### How brand switching works

1. User selects a brand from the `BrandSwitcher` dropdown
2. `ThemeProvider` sets `data-brand="{slug}"` on the wrapper div
3. `tokens.css` activates the matching `[data-brand="{slug}"]` CSS block
4. `ThemeProvider` sets inline CSS vars for Tailwind bridge (`--primary`, `--font-brand`, etc.)
5. Google Fonts are loaded dynamically for the brand's fonts
6. All components re-render with new token values

### Two token delivery systems (by design)

| System | What it sets | How | Used by |
|--------|-------------|-----|---------|
| **tokens.css** | `--palette-*`, `--component-*`, `--space-*`, `--brand-primary` | `[data-brand="slug"]` CSS selectors | Components via `var()` |
| **ThemeProvider** | `--primary`, `--secondary`, `--accent`, `--font-brand`, `--font-headline` | Inline `style={}` on wrapper div | Tailwind classes (`bg-primary`, `font-brand`, `.headline`) |

### Currently supported brands (29)

White Label, Autoweek, Best Products, Bicycling, Biography, Car and Driver, Cosmopolitan, Country Living, Delish, ELLE, ELLE Decor, Esquire, Food Network, Fre, Good Housekeeping, Harper's BAZAAR, HGTV, House Beautiful, Marie Claire, Men's Health, Oprah Daily, Popular Mechanics, Prevention, Redbook, Road & Track, Runner's World, Seventeen, The Pioneer Woman, Town & Country, Veranda, Woman's Day, Women's Health

---

## 6. Atomic Design Structure

### Atoms → Molecules → Organisms → Templates

| Level | Examples | Key Tokens |
|-------|----------|------------|
| **Atoms** | Text, Icon, Image, Button, Badge, Input, Link, Divider | `--font-brand`, `--palette-content-default`, `--component-button-*` |
| **Molecules** | Newsletter Promo, Article Card, Right Rail Card, Trending Card | Composed from atoms |
| **Organisms** | Hero Section, Collection List, Right Rail, Trending, Newsletter, Nav, Footer | Composed from molecules |
| **Templates** | Brand Home Page | Nav → Hero + Collection → Right Rail → Newsletter → Trending → Footer |

### Pencil component naming

```
Component/{Category}/{Name}
  Component/Button/Primary
  Component/Card/Vertical
  Component/Badge/Primary
  Molecule: Newsletter Promo
```

---

## 7. Workflows

### A. Designer workflow: New component (Figma → Pencil)

```
1. FIGMA: Design the component
   - Explore layouts, colors, typography
   - Get stakeholder approval
   - Finalize the design

2. PENCIL: Rebuild the approved component with production tokens
   - Open hearst-brands.pen
   - Use MCP batch_design to create the component
   - Use ONLY existing token variables ($brand-1, $content-default, $space-md, etc.)
   - Name it: Component/{Category}/{Name}
   - Verify with get_screenshot

3. HANDOFF: Developer references Pencil for implementation
   - Developer uses MCP batch_get to read component structure
   - Developer uses get_screenshot for visual reference
   - Pencil tokens map 1:1 to CSS variables (see Section 4)
```

### B. Designer workflow: Requesting a token change

```
1. Designer identifies a need (e.g. "Cosmo needs a new accent color")
2. Designer files a request (Slack, Jira, etc.)
3. Developer edits the token JSON in git (see workflow D below)
4. After merge, developer runs push-pencil to sync Pencil
5. Designer sees the updated token in Pencil automatically
```

### C. Designer workflow: Theming a new brand

```
1. Designer creates the brand's visual identity in Figma
2. Designer provides: brand colors (1-14), default font, serif font
3. Developer creates tokens/brands/{new-slug}.json with the values
4. Developer adds font overrides to tokens/brands/_meta.json
5. Developer adds @font-face rules to globals.css
6. npm run build-tokens → commit → push-pencil
```

### D. Developer workflow: Adding or changing a token

```
1. Edit the JSON file in tokens/
   - Global token → tokens/core/global.json
   - Brand-specific → tokens/brands/{slug}.json
   - Font override → tokens/brands/_meta.json

2. Build generated files
   npm run build-tokens

3. Verify in the app (dev server auto-reloads)

4. Commit all changes (JSON + generated files)
   git add tokens/ src/lib/brands.ts src/lib/tokens.css
   git commit -m "tokens: update brand-1 for cosmopolitan"

5. After merge, push to consumers:
   npm run push-figma    → Figma Variables (designers see the change)
   npm run push-pencil   → Pencil .pen file (handoff specs update)
```

### E. Developer workflow: Building a new component

```
1. Check Pencil for the approved design
   - MCP batch_get to read component structure
   - MCP get_screenshot for visual reference

2. Create src/components/ui/{name}.tsx
   - Use tokens from the mapping table (Section 4)
   - Always include var() fallbacks: var(--token-name, #fallback)

3. Add Storybook story: src/stories/{Name}.stories.tsx

4. Verify with 3+ brands by switching in the app
```

### F. LLM workflow: Making design system changes

```
1. Read this spec (DESIGN-SYSTEM-SPEC.md)
2. Check Pencil via MCP tools for current component state
3. Edit token JSON files in tokens/ (NEVER edit brands.ts or tokens.css)
4. Run npm run build-tokens
5. Verify TypeScript compiles (npx tsc --noEmit)
6. Commit token JSON + generated files together
```

### G. Importing from Token Studio API (one-time / rare)

```bash
npm run tokens:pipeline
# Fetches from https://figma-connector.kubeprod.hearstapps.com/token-studio/tokens
# Normalizes into tokens/ structure
# Runs Style Dictionary build
```

### H. Legacy: Syncing from Pencil (old workflow, still available)

```bash
npm run sync-pencil
# Reads pencil-variables.json → brands.ts + tokens.css
# Use only if Pencil has changes not yet in git
```

---

## 8. Style Dictionary

Style Dictionary is used **only** for the Token Studio API legacy path. It is **not** part of the primary git-first workflow.

```bash
npm run tokens:pipeline    # Full: import → validate → build
npm run tokens:import      # Fetch from Token Studio API
npm run tokens:validate    # Check references
npm run tokens:build       # Style Dictionary → dist/
```

### When to use Style Dictionary

| Scenario | Use Style Dictionary? |
|----------|-----------------------|
| Normal development | No — use `npm run build-tokens` |
| Importing from Token Studio API | Yes |
| Adding a new brand | No — create `tokens/brands/{slug}.json` |
| Changing a color | No — edit the JSON, run `build-tokens` |
| Generating outputs for other platforms | Yes — configure in `style-dictionary.config.mjs` |

---

## 9. File Structure

```
hearst/
├── hearst-brands.pen                    # Pencil design file (synced FROM git)
├── hearst-design-system/
│   ├── DESIGN-SYSTEM-SPEC.md            # This document
│   ├── tokens/                          # ★ SOURCE OF TRUTH ★
│   │   ├── core/global.json             # Global tokens (401)
│   │   ├── semantic/aliases.json        # Semantic references
│   │   └── brands/
│   │       ├── _meta.json               # Font overrides
│   │       ├── cosmopolitan.json        # Per-brand tokens (595 each)
│   │       ├── car-and-driver.json
│   │       └── ... (29 brand files)
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css              # @font-face, Tailwind theme, .headline
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/                      # Atomic components
│   │   │   ├── home-page.tsx            # Brand home page template
│   │   │   ├── theme-provider.tsx       # Brand switching + CSS variable injection
│   │   │   ├── brand-switcher.tsx       # Brand dropdown
│   │   │   └── token-inspector.tsx      # Dev tool: token names on hover
│   │   ├── lib/
│   │   │   ├── brands.ts               # GENERATED from tokens/
│   │   │   ├── tokens.css               # GENERATED from tokens/
│   │   │   └── pencil-variables.json    # Legacy Pencil export (kept for compat)
│   │   └── stories/                     # Storybook stories
│   ├── scripts/
│   │   ├── build-from-tokens.ts         # ★ PRIMARY: tokens/ → brands.ts + tokens.css
│   │   ├── push-to-figma.ts             # tokens/ → Figma Variables
│   │   ├── push-to-pencil.ts            # tokens/ → Pencil .pen file
│   │   ├── sync-from-pencil.ts          # Legacy: pencil-variables.json → code
│   │   ├── sync-tokens.ts              # Legacy: Token Studio API → code
│   │   └── sync-to-pencil.ts           # Legacy: Token Studio → .pen
│   ├── style-dictionary.config.mjs      # Style Dictionary (Token Studio path only)
│   └── netlify.toml
```

### Generated files (do not edit manually)

- `src/lib/brands.ts` — generated by `build-from-tokens.ts`
- `src/lib/tokens.css` — generated by `build-from-tokens.ts`

### Source files (edit these)

- `tokens/core/global.json` — global tokens
- `tokens/brands/{slug}.json` — per-brand tokens
- `tokens/brands/_meta.json` — font overrides

---

## 10. npm Scripts Reference

| Command | Purpose | When to use |
|---------|---------|-------------|
| `npm run build-tokens` | Build brands.ts + tokens.css from tokens/ | After editing any token JSON |
| `npm run push-figma` | Push tokens to Figma Variables | After token changes, so designers see updates |
| `npm run push-pencil` | Generate Pencil payload from tokens/ | After token changes, to sync Pencil |
| `npm run dev` | Start Next.js dev server | Development |
| `npm run build` | Production build | CI/CD |
| `npm run storybook` | Start Storybook | Component development |
| `npm run sync-pencil` | Legacy: Pencil → code | Only if Pencil has unsynced changes |
| `npm run tokens:pipeline` | Legacy: Token Studio API → code | One-time imports |

---

## 11. Rules by Role

### For Designers

**DO:**
- Design freely in Figma — it's your primary tool
- When a component is approved, rebuild it in Pencil using production tokens
- Use Pencil variables (`$brand-1`, `$content-default`, `$space-md`) for all values
- Request token changes through the team (developer edits git, syncs to Pencil)
- Reference Storybook to see how components render in code

**DON'T:**
- Define new token values in Figma and expect them to reach production
- Hardcode hex values in Pencil — always use variables
- Treat Figma inspect as the source of truth for spacing/color values

### For Developers

**DO:**
- Edit token JSON files in `tokens/` — they are the source of truth
- Run `npm run build-tokens` after editing token files
- Use CSS variables with fallbacks: `var(--token-name, #fallback)`
- Reference Pencil (via MCP) for approved component specs
- Commit both token JSON changes AND generated files together
- Run `npm run push-pencil` after merging token changes

**DON'T:**
- Edit `src/lib/brands.ts` or `src/lib/tokens.css` directly — they are generated
- Hardcode hex colors without a `var()` wrapper
- Use Tailwind arbitrary values like `text-[#1B5F8A]` for brand colors
- Skip fallback values in `var()` calls

### For LLMs (Cursor, Claude, etc.)

**DO:**
- Read this spec before making design system changes
- Edit token JSON files in `tokens/`
- Run `npm run build-tokens` after editing token files
- Use `.headline` for article titles, `font-brand` for body, `font-brand-secondary` for eyebrows
- Follow atomic design: atoms → molecules → organisms → templates
- Check Pencil via MCP tools for component specs before building

**DON'T:**
- Edit generated files (`brands.ts`, `tokens.css`)
- Treat Pencil as the source of truth — git is the source, Pencil is a consumer
- Create new CSS variables without first adding them to `tokens/`

### Pencil MCP tools reference

| Tool | Purpose | Used by |
|------|---------|---------|
| `get_variables` | Read current Pencil token state | Developers, LLMs |
| `set_variables` | Push git tokens to Pencil | Developers, LLMs |
| `batch_get` | Read component structure for specs | Developers, LLMs |
| `batch_design` | Create or modify Pencil components | Designers (via LLM), LLMs |
| `get_screenshot` | Visually verify designs | Everyone |
| `get_editor_state` | Check current file and selection | LLMs |

---

## 12. Production Verification

### Colors — compare against live API
```bash
curl -s https://figma-connector.kubeprod.hearstapps.com/token-studio/tokens | python3 -m json.tool
```

### Fonts — CDN pattern
```
https://www.{brand-domain}.com/_assets/design-tokens/{brand}/static/fonts/{FontName}_{style}_{weight}.{hash}.woff2
```

### Images — Hearst CDN
```
https://hips.hearstapps.com/hmg-prod/images/{image-id}?resize=980:*
```

---

## 13. Known Issues & Debt

| Issue | Status | Resolution |
|-------|--------|------------|
| `--brand-primary` is a synthetic alias for `palette-brand-1` | Documented | Keep for backward compat |
| Font names in Pencil vs production CDN differ | Handled | `_meta.json` overrides bridge the gap |
| Typos in source data (`dager`, `kockout`, `backgroud`) | Auto-fixed | `fixTypos()` in build script |
| `font-family-serif` = "SF Pro" for many brands | Handled | `_meta.json` overrides correct this |
| Dual token systems (Shadcn + Hearst) | By design | ThemeProvider bridges both |
| Figma variables not synced to git | By design | Figma is for exploration; git is for production tokens |

---

## 14. End-to-End Workflow: Conception → Production

### High-level flow

```
 CONCEPTION                    DESIGN                        DEVELOPMENT                    PRODUCTION
 ──────────                    ──────                        ───────────                    ──────────

 ┌──────────────┐         ┌──────────────┐             ┌──────────────────┐          ┌──────────────┐
 │  Stakeholder │         │    Figma     │             │   Git (tokens/)  │          │   Netlify    │
 │   Request    │────────►│  Exploration │             │  Source of Truth │          │  Production  │
 └──────────────┘         └──────┬───────┘             └────────┬─────────┘          └──────────────┘
                                 │                              │                           ▲
                          Design freely                        │                           │
                          Iterate with                          │                           │
                          stakeholders                         │                           │
                                 │                              │                           │
                                 ▼                              │                           │
                          ┌──────────────┐                     │                           │
                          │   Approved   │                     │                           │
                          │    Design    │                     │                           │
                          └──────┬───────┘                     │                           │
                                 │                              │                           │
                    ┌────────────┴────────────┐                │                           │
                    ▼                         ▼                │                           │
             ┌─────────────┐          ┌─────────────┐         │                           │
             │ New tokens  │          │ Component   │         │                           │
             │  needed?    │          │ handoff to  │         │                           │
             └──────┬──────┘          │   Pencil    │         │                           │
                    │                 └──────┬──────┘         │                           │
                    │ YES                    │                 │                           │
                    ▼                        │                 │                           │
             ┌─────────────┐                │                 │                           │
             │  Developer  │                │                 │                           │
             │ edits token │                │                 │                           │
             │ JSON in git │◄───────────────┘                 │                           │
             └──────┬──────┘                                  │                           │
                    │                                          │                           │
                    ▼                                          │                           │
             ┌─────────────────────────────────────────────────┘                           │
             │                                                                             │
             │  npm run build-tokens                                                       │
             │  ├── brands.ts    (React brand metadata)                                   │
             │  └── tokens.css   (CSS custom properties)                                  │
             │                                                                             │
             │  git add + git commit + git push                                           │
             │                                                                             │
             │  ┌─────────────────────────────────────────────┐                           │
             │  │  PR Review  →  Merge to main                │───────────────────────────┘
             │  └─────────────────────────────────────────────┘
             │                                                 
             │  Post-merge sync (keeps consumers up to date):  
             │  ├── npm run push-figma   → Figma Variables     
             │  └── npm run push-pencil  → hearst-brands.pen   
             │                                                 
             └─────────────────────────────────────────────────
```

### Detailed swimlane diagram

```
 ┌─────────┬───────────────┬────────────────┬──────────────────┬───────────────┐
 │  PHASE  │   DESIGNER    │   DEVELOPER    │      CI/CD       │  CONSUMERS    │
 ├─────────┼───────────────┼────────────────┼──────────────────┼───────────────┤
 │         │               │                │                  │               │
 │    1    │  Explore in   │                │                  │               │
 │ CONCEPT │  Figma        │                │                  │               │
 │         │  (wireframes, │                │                  │               │
 │         │   layouts,    │                │                  │               │
 │         │   colors)     │                │                  │               │
 │         │       │       │                │                  │               │
 │         │       ▼       │                │                  │               │
 │         │  Stakeholder  │                │                  │               │
 │         │  review &     │                │                  │               │
 │         │  approval     │                │                  │               │
 │         │       │       │                │                  │               │
 ├─────────┼───────┼───────┼────────────────┼──────────────────┼───────────────┤
 │         │       │       │                │                  │               │
 │    2    │       ▼       │                │                  │               │
 │ HANDOFF │  Rebuild in   │                │                  │               │
 │         │  Pencil with  │                │                  │               │
 │         │  production   │                │                  │               │
 │         │  tokens       │                │                  │               │
 │         │  ($brand-1,   │                │                  │               │
 │         │   $space-md)  │                │                  │               │
 │         │       │       │                │                  │               │
 │         │       ▼       │                │                  │               │
 │         │  Request new  │  Receive       │                  │               │
 │         │  tokens if ──►│  request       │                  │               │
 │         │  needed       │       │        │                  │               │
 │         │               │       ▼        │                  │               │
 ├─────────┼───────────────┼───────┼────────┼──────────────────┼───────────────┤
 │         │               │       │        │                  │               │
 │    3    │               │  Edit token    │                  │               │
 │ TOKENS  │               │  JSON files:   │                  │               │
 │         │               │  tokens/       │                  │               │
 │         │               │  brands/*.json │                  │               │
 │         │               │  _meta.json    │                  │               │
 │         │               │       │        │                  │               │
 │         │               │       ▼        │                  │               │
 │         │               │  build-tokens  │                  │               │
 │         │               │  ├─ brands.ts  │                  │               │
 │         │               │  └─ tokens.css │                  │               │
 │         │               │       │        │                  │               │
 ├─────────┼───────────────┼───────┼────────┼──────────────────┼───────────────┤
 │         │               │       │        │                  │               │
 │    4    │               │  Build React   │                  │               │
 │  CODE   │               │  component     │                  │               │
 │         │               │  using Pencil  │                  │               │
 │         │               │  specs + token │                  │               │
 │         │               │  CSS vars      │                  │               │
 │         │               │       │        │                  │               │
 │         │               │       ▼        │                  │               │
 │         │               │  Verify with   │                  │               │
 │         │               │  3+ brands     │                  │               │
 │         │               │  in dev server │                  │               │
 │         │               │       │        │                  │               │
 │         │               │       ▼        │                  │               │
 │         │               │  Add Storybook │                  │               │
 │         │               │  story         │                  │               │
 │         │               │       │        │                  │               │
 ├─────────┼───────────────┼───────┼────────┼──────────────────┼───────────────┤
 │         │               │       │        │                  │               │
 │    5    │  Review in    │  Open PR       │                  │               │
 │ REVIEW  │  Storybook ◄──  with token    │                  │               │
 │         │  and staging  │  JSON + code   │                  │               │
 │         │               │       │        │                  │               │
 │         │  Approve ─────►  Merge to main │                  │               │
 │         │               │       │        │                  │               │
 ├─────────┼───────────────┼───────┼────────┼──────────────────┼───────────────┤
 │         │               │       │        │                  │               │
 │    6    │               │       └────────►  Netlify build   │               │
 │ DEPLOY  │               │                │  next build      │               │
 │         │               │                │  Deploy to prod ─►  Live site    │
 │         │               │                │                  │               │
 ├─────────┼───────────────┼───────┼────────┼──────────────────┼───────────────┤
 │         │               │       │        │                  │               │
 │    7    │               │  Post-merge:   │                  │               │
 │  SYNC   │               │       │        │                  │               │
 │         │  Figma vars ◄─┤  push-figma    │                  │  Figma file   │
 │         │  update       │       │        │                  │  updated      │
 │         │               │       │        │                  │               │
 │         │  Pencil vars ◄┤  push-pencil   │                  │  .pen file    │
 │         │  update       │       │        │                  │  updated      │
 │         │               │       │        │                  │               │
 └─────────┴───────────────┴───────┴────────┴──────────────────┴───────────────┘
```

### Data flow summary

```
                         ┌─────────────────────────────────┐
                         │         TOKEN STUDIO API         │
                         │  (legacy import, one-time use)   │
                         └────────────────┬────────────────┘
                                          │ npm run tokens:pipeline
                                          ▼
┌──────────┐  design   ┌──────────┐  handoff  ┌──────────────────────────────┐
│  FIGMA   │──────────►│  PENCIL  │──────────►│    GIT  tokens/              │
│          │           │ .pen file│           │    ★ SOURCE OF TRUTH ★       │
│ explore  │           │          │           │                              │
│ iterate  │  ◄────────┤ approved │           │  core/global.json            │
│ approve  │ push-figma│ specs    │◄──────────│  brands/{slug}.json          │
│          │           │          │push-pencil│  brands/_meta.json           │
└──────────┘           └──────────┘           └──────────────┬───────────────┘
     ▲                                                       │
     │                                                       │ npm run build-tokens
     │                                                       ▼
     │                                        ┌──────────────────────────────┐
     │                                        │  GENERATED CODE              │
     │  push-figma                            │                              │
     └────────────────────────────────────────│  src/lib/brands.ts           │
                                              │  src/lib/tokens.css          │
                                              └──────────────┬───────────────┘
                                                             │
                                              ┌──────────────┼───────────────┐
                                              │              │               │
                                              ▼              ▼               ▼
                                        ThemeProvider   CSS vars        Tailwind
                                        (--primary,    (--palette-*)   (bg-primary,
                                         --font-brand)                  font-brand)
                                              │              │               │
                                              └──────────────┼───────────────┘
                                                             │
                                                             ▼
                                              ┌──────────────────────────────┐
                                              │     REACT COMPONENTS         │
                                              │  (29 brands, auto-themed)    │
                                              └──────────────┬───────────────┘
                                                             │
                                                             ▼
                                              ┌──────────────────────────────┐
                                              │     NETLIFY PRODUCTION       │
                                              │  hearst-design-system.app    │
                                              └──────────────────────────────┘
```

### Quick reference: Who does what

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  DESIGNER                        DEVELOPER                    CI/CD          │
│  ─────────                       ──────────                   ─────          │
│                                                                              │
│  Figma  ──explore──►             tokens/ ──edit──►                           │
│  Pencil ──handoff──►             build-tokens ──generate──►                  │
│  Review ──approve──►             PR ──merge──►               Netlify ──►prod │
│                                  push-figma ──sync──►  Figma vars           │
│                                  push-pencil ──sync──► .pen file            │
│                                                                              │
│  NEVER edit:                     NEVER edit:                                 │
│  × Figma Variables directly      × brands.ts directly                       │
│  × Token JSON files              × tokens.css directly                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

*Last updated: March 2026*
*Maintained by: Hearst Design System Team*
