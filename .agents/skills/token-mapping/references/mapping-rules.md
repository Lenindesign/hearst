# Mapping rules

Agreed for the Hearst Design System (2026-11-12). Tolerances and categories are design.how's defaults; the HDS changes are the Scoped class, scopes alongside modes, and the extra Not mapped cases.

## Classes

One class per row per mode and scope (the brand or destination wrapper). Purpose is checked first, then value. A value that equals a token but serves another job is never a match. It becomes ambiguous or a gap, and the token goes in Do not use.

**Not mapped** (counted in the Summary, no row): a role token with alpha applied (`color-mix()` over its `var()`, a utility's alpha modifier); values in the `graphic` category (logo art, illustrations, decorative gradient stops, map tiles); audit false positives that are not colours (HTML entities such as `&#215;`, comments); and values in code nothing renders (say which).

**Scoped** (its own class, counted apart from gaps): deliberate art direction for one route, module or campaign. Name the scoped configuration it belongs in (an entry in `src/lib/brand-banners.ts`, `theme-options.ts`, a module's named config); `BRAND_STYLES.md` says shared components carry no raw palette values.

If the list states no purposes at all, the run matches values only. Each reason begins "Value only", Do not use stays empty because it cannot be checked, and the report adds Consistency by role. A palette-only list (`gray-500` with no roles) makes almost every palette row Exact by definition, so Consistency by role becomes the main output and the table keeps only rows that are not Exact.

## Categories

A candidate belongs to the same category as the row's job.

- Colour by role: surface, text, border, icon, action, focus, status.
- Spacing by job: inset (inside a component) and gap (between items). One scale often serves both, so record which job the row does.
- Size, radius, border width, typography (family, size, weight, line height, letter spacing), shadow (each part its own row), opacity, motion (duration, easing), z-index.

A row whose job cannot be read is ambiguous when the jobs it might do give two or more candidates, and a gap marked "job unread" otherwise.

## Normalising

- Lengths to px. A 16 px root for `rem` unless the project sets another. Line height to a unitless ratio.
- Colours to OKLCH plus alpha. `build-design-system/scripts/oklch.mjs` reads hex (3, 4, 6, 8 digits), `rgb()`, `hsl()`, `hwb()`, `oklch()`, `oklab()` and the CSS named colours, each with its alpha, and prints the OKLCH. It does not read `color()`, `lab()`, `lch()`, `color-mix()` or a relative colour. Resolve those with a browser's computed style, and say so in Source. Compare by delta E OK (OKLab distance times 100), which `oklch.mjs --delta` prints. Under 0.5 is identical, which absorbs 8-bit rounding.
- Alpha is part of the colour. `#0F172A` at 80% is not `#0F172A`: `--delta` prints both alphas and says `alpha differs` past the opacity tolerance, and such a pair is never Exact.

## Tolerances

Applied only after purpose fits, and never turn a wrong-purpose token into a match. A difference equal to the limit is inside it.

| Category | Limit |
|---|---|
| Colour | delta E OK 2 |
| Spacing, size, radius | 2 px |
| Font size | 1 px |
| Line height | 0.05 as a ratio |
| Letter spacing | 0.01 em |
| Opacity | 0.02 |
| Duration | 30 ms |
| Border width, weight, family, easing | none |

## Consistency by role

Written when the list states no purposes or the ask is about consistency. Group every colour row by role. For each role give the distinct values with counts, their spread in delta E OK, and near pairs (under 5) that likely mean one thing.

```
Text: 6 values over 200 rows. gray-500 (80), gray-600 (60), #666 (10) sit within delta E OK 4 and likely mean one muted text.
```

## Source conflicts

Two sources that disagree on a value go in Source with both sides. A project rule that says which wins is quoted. Otherwise neither is chosen and the question goes to For a person to decide.
