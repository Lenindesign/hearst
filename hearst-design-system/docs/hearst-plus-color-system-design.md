# Hearst+ color system: design

Hearst+ separates color into two roles. The **Hearst+ shell** (navigation, active states, section and rail titles, footer) and every **primary action button** use **Hearst+ blue**, now set to `#2D75B9` to match the Hearst+ logo, in every destination. Each destination keeps its own **destination primary** for content accents only: topic labels, story-link hover and badges. The wiring keeps `--primary` as the destination primary, repoints the existing shell tokens (`--hp-nav`, `--hp-section-title`, `--hp-sidebar-heading`) to Hearst+ blue, adds only the missing shell steps (`--hp-shell-accent`, hover and active), and sets the HDS primary-solid button tokens to the shell accent in one shell-layer override. The page canvas is the warm paper `#F4F2EE` that already renders, with the theme token aligned to it. In dark mode, blue text and links use a lighter tint (around `#6FA8E0`) while filled buttons keep `#2D75B9`, and each destination's content accents use a light step of its own palette, checked for WCAG AA on the dark canvas. None of this is implemented yet.

## Terms

- **Hearst+ blue**: the Hearst+ brand blue, `#2D75B9` (the Hearst+ logo and `BRAND_STYLES.md` value). Before this design the `hearst-all` theme shipped `#2B6FAF`.
  Avoid: brand color, accent, primary blue.
- **Destination primary**: each destination's own theme primary: Lifestyle `#7A2E5D`, Autos `#245F86`, Fashion and Luxury `#292625`, Enthusiast and Wellness `#C94B3B`, Local News `#087A68`, A&E Family `#B9913F`.
  Avoid: section color, vertical color.
- **Page canvas**: the background behind feed cards and rails (`--background` / `--hp-background`).
  Avoid: page color, bg.
- **Hearst+ shell**: the chrome shared by every Hearst+ destination: masthead, section and category navigation, section titles, sidebars and rails, footer.
  Avoid: frame, wrapper, layout.
- **Content accent**: a color use that belongs to the content rather than the app: topic labels, story-link hover and focus color, badges.
  Avoid: highlight, brand accent.

## Why

The goal was to settle the Hearst+ color system: the brand blue, the page canvas, and how Hearst+ color relates to each destination's own palette. Hearst+ is positioned as one cross-brand app, but today the whole page recolors on every destination switch, because `STYLE.md` has every destination drive section titles, sidebar module titles, topic labels, active navigation, badges and story-link hover from its own primary. The Hearst+ blue itself also disagreed between the code and the logo, and the page canvas had two conflicting values. The parallel typography design (`docs/hearst-plus-typography-system-design.md`) had just settled the matching rule for type: Hearst+ frames the content, the content keeps its own voice.

## Locked decisions

### 1. The shell and actions are Hearst+ blue everywhere; destination primaries color content accents only (Q1: B)

In every destination, navigation, active navigation states, section titles and rail and sidebar titles use Hearst+ blue. Destination primaries remain only on content accents: topic labels, story-link hover and focus, badges. (Primary action buttons are covered by routine choice 3.)

Why: it matches the typography decision, so Hearst+ looks like one product while each destination keeps a recognizable tint.

Rejected:
- **A, the destination primary drives everything in its destination (today):** the page recolors wholesale between destinations, which reads as several sites.
- **C, Hearst+ blue everywhere, with destination colors only in destination logos and brand pages:** the most unified, but it throws away the destination palettes the theme system already maintains.

### 2. Shell tokens carry Hearst+ blue; `--primary` stays the destination primary (Q4: A)

Shell components read dedicated shell tokens set to Hearst+ blue. `--primary` keeps meaning the destination primary, so content accents and every destination theme keep working unchanged. Only shell components switch.

Why: the shell is a small, known set of components, so pointing them at shell tokens touches far fewer files than re-pointing the roughly 400 Tailwind `primary` utilities and about 40 direct `var(--primary)` uses across the components.

Rejected:
- **B, `--primary` becomes Hearst+ blue everywhere and a new `--destination-accent` carries content accents:** semantically cleaner (primary means the app), but every content accent in the app would have to move to the new token in the same change.
- **C, no new tokens, each component picks the Hearst+ or destination value itself:** breaks the `STYLE.md` rule against hardcoding brand color inside shared components.

## Routine choices

1. **Hearst+ blue value (Q2: B):** `#2D75B9`, matching the logo SVG (`public/logos/hearst-plus.svg`) and `BRAND_STYLES.md`. Retune the hover and active steps to match (the theme currently ships hover `#1F65A6` and active `#174C7D` around `#2B6FAF`). It clears AA for text on white (about 4.9:1). Rejected: keep `#2B6FAF` and only fix the docs (A, leaves logo and UI a shade apart); pick a new blue (C, reopens a brand decision this design did not need).
2. **Page canvas (Q3: A):** warm paper `#F4F2EE`, which renders today through `.hearst-plus-theme` in `globals.css` and `hearst-plus-theme.ts`. Align the `hearst-all` `palette-background-page` token (currently the cool blue tint `#F4F8FC`) to it, removing the conflict with no visual change. Rejected: the cool tint (B, casts photos and destination colors blue) and a neutral gray (C, reads like a dashboard).
3. **Primary action buttons (Q5: A):** Hearst+ blue in every destination (Follow, Sign up, Start free trial, Save in the reader). Actions belong to the app, and one action color teaches people where to tap. A blue button beside, for example, Lifestyle's plum topic labels is an intended contrast. Rejected: destination primary buttons (B, the same button changes color between sections) and neutral near-black buttons (C, less discoverable).
4. **Dark mode Hearst+ blue (Q6: A):** text and links in dark mode use a lighter tint, around `#6FA8E0` (about 7.5:1 on `#0d1014`); filled buttons keep `#2D75B9` with white text. `#2D75B9` on `#0d1014` is only about 3.8:1, below AA for body-size text. Rejected: `#2D75B9` everywhere (B, fails AA for blue text on dark) and the lighter tint for everything including buttons (C, washes out buttons and drifts from the logo blue).
5. **Shell token wiring (Q7: A):** repoint the existing shell tokens to Hearst+ blue (`--hp-nav`, `--hp-nav-translucent`, `--hp-section-title`, `--hp-sidebar-heading`) and add only the missing steps: `--hp-shell-accent`, `--hp-shell-accent-hover` and `--hp-shell-accent-active` (plus their dark-mode values). Shell components that already read these tokens change with no component edits. Rejected: a new full `--hp-shell-*` family with old names retired (B, touches every shell component for no visible difference).
6. **Where buttons get Hearst+ blue (Q8: A):** one override in the Hearst+ shell layer (`.hearst-plus-theme` in `globals.css` and `hearst-plus-theme.ts`) sets the HDS primary-solid button tokens (`--component-button-background-primary-solid-default`, hover and active, the matching border tokens, and `--component-button-content-primary-solid-default`) to the shell accent for every destination. New destinations inherit it automatically. Rejected: set them in each destination's theme composition in `theme-options.ts` (B, the same values repeated six times, and a destination theme should describe the destination, not the app's action color).
7. **Destination accents in dark mode (Q9: A):** each destination uses a light step of its own palette (for example its colors 2 or 4) for dark-mode content accents, each checked for AA on `#0d1014`. Rejected: fall back to the light Hearst+ blue tint (B, every destination looks the same in dark mode) and neutral near-white accents (C, no destination identity on dark surfaces such as the Videos tab).

## Verified facts

Established by reading the codebase, not by asking:

- The `hearst-all` theme in `src/lib/theme-options.ts` sets colors 1 `#2B6FAF`, 3 `#174C7D`, 9 `#1F65A6`, 2 `#DCEBFA`, 5 `#F4F8FC`, 6 `#EDF4FB`, and semantic colors including `palette-background-brand` `#2B6FAF`, `palette-background-page` `#F4F8FC` and `palette-content-brand` `#2B6FAF`.
- `BRAND_STYLES.md` Identity lists Hearst+ primary `#2D75B9`, secondary `#DCEBFA` and HDS page token `#F4F8FC`; the Hearst+ logo SVG uses `fill="#2D75B9"` throughout.
- `.hearst-plus-theme` in `src/app/globals.css` (mirrored in `src/lib/hearst-plus-theme.ts`) sets `--background` and `--hp-background` to `#F4F2EE`; this is the canvas that renders. Its dark mode (`.hearst-plus-theme[data-mode="dark"]`) sets `--background` `#0d1014`, and the Videos tab defaults to dark.
- `--hp-nav` and `--hp-nav-translucent` are `var(--primary)` today, so the navigation bar recolors per destination; `--hp-nav-text` is `#ffffff`; `--hp-sidebar-heading` comes from `--component-navigation-utility-content-accent`.
- The HDS Button default variant is painted in `globals.css` (`[data-slot="button"][data-variant="default"]`) from `--component-button-border-primary-solid-default`, `--component-button-background-primary-solid-default` and `--component-button-content-primary-solid-default`, with hover and active variants; it does not read `--primary` directly. Hand-styled buttons using `bg-foreground` (for example the newsstand's black buttons) are not affected.
- `src/components` has about 40 direct `var(--primary)` uses and about 400 Tailwind `primary` utilities (`text-primary`, `bg-primary`, `border-primary`).
- `STYLE.md` Theme and color: normal light destinations use their primary for section titles, sidebar module titles, topic labels, active navigation states, badges and story-link hover; editorial story links change the headline to the theme primary on hover and focus; generated destination masthead logos use the destination primary on light surfaces.

## Implementation notes

1. `theme-options.ts`: set the `hearst-all` blue steps to `#2D75B9` with retuned hover and active values, and set `palette-background-page` to `#F4F2EE`. Update `BRAND_STYLES.md` if any value changes.
2. `globals.css` and `hearst-plus-theme.ts` (light and dark blocks): add `--hp-shell-accent`, `-hover` and `-active` (dark mode: the lighter text tint around `#6FA8E0` for text and links, `#2D75B9` for fills); repoint `--hp-nav`, `--hp-nav-translucent`, `--hp-section-title` and `--hp-sidebar-heading` to the shell accent.
3. Same shell layer: override the HDS primary-solid button tokens (background, border, content, each with hover and active) to the shell accent.
4. Audit shell components that read `--primary` or `primary` utilities directly (masthead, category navigation active state, section and rail titles, footer) and point them at the shell tokens.
5. Dark mode: for each destination, choose the light palette step for content accents, check AA on `#0d1014`, and add it to that destination's dark-mode values.
6. Update `STYLE.md` Theme and color: split the destination-primary list into shell (Hearst+ blue) and content accents (destination primary); add the action-button rule and the dark-mode accent rule. Add a decision-log entry.
7. Visual check of every destination in light and dark mode, including the Videos tab.

## Risks

- **Hidden `--primary` reads in shell components:** any shell piece that reads `--primary` or a `primary` utility directly will keep the destination color until it is found in the audit (step 4).
- **Masthead logos:** `STYLE.md` says generated destination masthead logos use the destination primary on light surfaces. With a blue shell, a destination-colored logo inside blue navigation needs a visual check; this design does not change logo colors.
- **Button contrast in light themes:** white text on `#2D75B9` is about 4.9:1, which passes AA but leaves little margin; hover and active steps must stay at or above it.
- **Retuned blue steps:** moving from `#2B6FAF` to `#2D75B9` slightly lightens every Hearst+ blue surface, so existing screenshots and Storybook stories will shift.
- **Dark palette steps:** some destination palettes may not have a light step that clears AA on `#0d1014` and still reads as the destination color; those need a new value rather than an existing step.

## Deferred

None. Every question was answered.

## Open threads

None. No discussion threads were opened during the session.
