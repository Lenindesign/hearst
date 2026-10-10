# Hearst+ typography system: design

Hearst+ uses one app-level headline face, Schibsted Grotesk, for its shell (titled headings in the masthead area, section and module titles, rails, sidebars, footer group titles) in every destination, and for story headlines on the Hearst+ All feed and the newsstand. Inside a destination, story headlines keep that destination's own headline font, and the story reader follows the same split: Hearst+ chrome in Schibsted Grotesk, the article headline in the destination or publication font. Inter remains the body and UI font everywhere. Headline weight is assigned by role (display 800, title 700, compact 600) through new role tokens that default to each theme's single existing weight, so only Hearst+ changes; untagged headlines get the title role. Schibsted Grotesk is preloaded from the root layout in weights 600, 700 and 800. Nothing in this document beyond the base font swap (Schibsted Grotesk 800 on `hearst-all`, committed as `99cb2eb`) is implemented yet.

## Terms

- **Headline font**: the theme's `fontHeadline`, applied through `--font-headline` and the shared `.headline` style. For Hearst+ (`hearst-all`) it is Schibsted Grotesk.
  Avoid: display font, title font, primary font.
- **Body and UI font**: the theme's body and interface face, used for navigation, buttons, labels, summaries and article text. Inter in every theme.
  Avoid: secondary font, text font.
- **Hearst+ shell**: the chrome shared by every Hearst+ destination: masthead, section and category navigation, section titles, sidebars and rails, footer.
  Avoid: frame, wrapper, layout.
- **Destination**: a themed section of Hearst+ with its own type: Lifestyle (Newsreader), Autos (Barlow Condensed), Fashion and Luxury (Modern MT Pro), Enthusiast and Wellness (Knockout Condensed, proprietary asset pending, League Gothic / Barlow Condensed fallback).
  Avoid: vertical, channel, section brand.
- **Headline role**: one of three tags on a headline that selects its weight: **display** (hero and large display headlines), **title** (story and card titles), **compact** (rail, sidebar and small list titles).
  Avoid: headline size, heading level.

## Why

The goal was to settle the full Hearst+ type system around the new Schibsted Grotesk headlines: the body and UI font, weights and sizes, where Newsreader and the destination fonts still belong, and how destinations inherit it. Schibsted Grotesk had just replaced Newsreader as the Hearst+ headline font because Hearst+ is positioned as a cross-brand app, not a magazine, and Newsreader read as a publication serif. The swap applied only to the `hearst-all` theme at one weight, which left open how far the new face reaches, what it pairs with, and how its weight behaves across very different headline sizes.

## Locked decisions

### 1. Schibsted Grotesk sets the Hearst+ shell everywhere; story headlines keep the destination font (Q1: B)

Schibsted Grotesk is used for the Hearst+ shell's titled headings in every destination (All, Lifestyle, Autos, Fashion and Luxury, Enthusiast and Wellness, Local News, A&E Family). Story headlines inside a destination keep that destination's headline font. On the All feed and the newsstand (`hearst-all`), story headlines are Schibsted Grotesk too, since that theme's headline font is Schibsted Grotesk.

Why: one recognizable frame as people move between destinations, which an aggregator app needs, while each destination keeps its personality so Autos does not look like Fashion.

Rejected:
- **A, All feed and newsstand only (the state after the swap):** the shell changes font on every destination switch, so the app reads as several sites stitched together.
- **C, Schibsted Grotesk for every Hearst+ headline in every destination, destination and publication fonts only on brand pages and the publication reader:** the strongest single voice, but it erases the destination identities the theme system exists to express, and it is the hardest of the three to reverse.

### 2. Inter stays the body and UI font (Q2: A)

Inter remains the body and UI font everywhere, including article text and the Hearst+ Editorial column.

Why: Inter is already tuned across every theme, reader and component and is among the most readable screen faces at small sizes. Schibsted Grotesk at heavy weights is distinct enough from Inter that the pairing reads as deliberate contrast rather than a near-miss.

Rejected:
- **B, Schibsted Grotesk for UI and body too (400 to 600 for text):** the most coherent look, but it touches every surface and every destination at once, and Schibsted's text weights are less proven for long reading.
- **C, Schibsted Grotesk for UI chrome only, Inter for summaries and article text:** splits the UI between two similar grotesks, which is the near-miss look to avoid.

### 3. The story reader: Hearst+ chrome in Schibsted Grotesk, article headline in the destination or publication font (Q5: A)

In the story reader, the Hearst+ chrome's titled headings (context rail titles, recommendation titles, other titled reader modules) use Schibsted Grotesk, following the shell rule in routine choice 1. The article headline keeps the destination font, or the publication font for brand-origin readers, as `STYLE.md` describes today. The reader's navigation labels stay Inter (routine choice 1).

Why: it applies decision 1 consistently: Hearst+ frames the content, the content keeps its own voice. Readers moving from the feed into an article keep the same chrome type, and the article still feels like Esquire or Delish.

Rejected:
- **B, the whole reader follows the destination or publication font (today):** simplest, but the reader's chrome changes font on every destination and publication, breaking the one-app frame.
- **C, the whole reader in Schibsted Grotesk, article headlines included:** contradicts decision 1's choice to keep story headlines in destination fonts.

## Routine choices

1. **Which shell text switches (Q4: A):** only titled headings (module and section headings such as Trending, Local News, Join groups, plans and footer group titles) switch to Schibsted Grotesk. Uppercase eyebrow labels (for example TRENDING ACROSS BRANDS), category and destination navigation, and the utility bar (Newsletter, Sign in / Sign up) stay Inter. The masthead wordmark is an SVG logo and is unaffected. Shell heading color still comes from `--hp-sidebar-heading`. Rejected: headings plus navigation (B), which splits navigation from the eyebrows beside it; and all shell text (C), which cramps small caps labels.
2. **Weight by size (Q3: B):** 800 for hero and display headlines, 700 for story and card titles, 600 for rail and sidebar titles. Rejected: 800 at every size (A, small titles get heavy and dark) and 700 at every size (C, the hero loses its punch).
3. **How weights are assigned (Q6: A):** add role tokens `--font-headline-weight-display`, `--font-headline-weight-title` and `--font-headline-weight-compact`. Every theme's tokens default to its existing single `fontHeadlineWeight`, so other destinations are unchanged; the `hearst-all` theme sets them to 800, 700 and 600. Each `.headline` use is tagged with its role. Rejected: size thresholds in the `.headline` style (B, breaks when a title is resized responsively) and per-component hand-set weights (C, scatters the rule and breaks the `STYLE.md` rule against hardcoding fonts in shared components).
4. **Default role for an untagged headline (Q8: A):** title (700). Display and compact are opt-in, so the common case (story and card titles) is right without tagging; only heroes (the carousel lead, the newsstand hero) and rails need a tag. Rejected: display default (B, keeps small titles heavy until each is tagged) and compact default (C, untagged card titles look too light next to the hero).
5. **Loading (Q7: A):** preload Schibsted Grotesk from the root layout. Weights to load follow from routine choice 2: 600, 700 and 800, Latin subset. Rejected: keeping preload off with `display: swap` (B, risks a visible swap on the largest text on Hearst+ pages) and a Hearst+-only route layout that preloads it (C, a new layout layer for a gain limited to the few non-Hearst+ routes).

## Verified facts

Established by reading the codebase, not by asking:

- Headlines get their font from the theme: `brandToCssVars` in `src/lib/theme-css-vars.ts` maps `fontHeadline` to `--font-headline` through `runtimeFontStacks`, and `--font-headline-weight` from `fontHeadlineWeight`. The shared `.headline` style in `src/app/globals.css` reads both.
- The Hearst+ (`hearst-all`) theme lives in `src/lib/theme-options.ts`, the app-only composition file. `scripts/build-from-tokens.ts` regenerates only `brands.ts` and `tokens.css`, so theme-options changes are not overwritten by the token build.
- Schibsted Grotesk is loaded in `src/app/layout.tsx` through `next/font/google` with variable `--font-schibsted-grotesk`, weights 700 and 800, `display: "swap"` and `preload: false`, like Newsreader, Livvic and Petrona. There is no Hearst+-specific layout; fonts are global.
- `--hp-font-headline` (set in `globals.css` and `src/lib/hearst-plus-theme.ts`) is defined but not consumed by any component.
- Destination headline fonts (from `BRAND_STYLES.md` Typography): Lifestyle Newsreader 700 (Editorial Newsreader), Autos Barlow Condensed 700, Fashion and Luxury Modern MT Pro 400 (Editorial Newsreader), Enthusiast and Wellness Knockout Condensed 900 (proprietary asset pending, League Gothic / Barlow Condensed fallback). All use Inter for body and UI.
- The reader follows the active article section by default, and brand-origin readers inherit the publication's headline and body fonts (`STYLE.md`, reader rules).
- About 79 headline uses of the shared `.headline` style exist across `src/components`.

## Implementation notes

Current state after `99cb2eb`: Schibsted Grotesk 800 is the `hearst-all` headline font at one weight; other destinations and the reader are unchanged. To reach this design:

1. `layout.tsx`: load Schibsted Grotesk weights 600, 700 and 800 and set `preload: true`.
2. Theme types and `theme-css-vars.ts`: add the three headline-role weight tokens, each defaulting to the theme's `fontHeadlineWeight`; set them to 800, 700 and 600 on `hearst-all`.
3. `.headline` reads the title-role token by default; add display and compact modifiers (for example `.headline-display` and `.headline-compact`) that read their role tokens.
4. Add a shell headline font token (for example `--font-shell-headline`, Schibsted Grotesk in every destination) and point the shell's titled headings at it, using the compact or title role as fits. Repurpose the unused `--hp-font-headline` for this rather than adding a second name.
5. Reader: point the reader chrome's titled headings at the shell headline token; leave the article headline on `--font-headline`.
6. Tag the hero headlines (carousel lead, newsstand hero, destination heroes) display, and rail and sidebar titles compact.
7. Update `BRAND_STYLES.md` Typography (Hearst+ row and a shell headline note) and `STYLE.md` (shell versus content type rule, reader split), and add a decision-log entry.

## Risks

- **Role tagging is incremental:** until the about 79 headline uses are reviewed, heroes that are not tagged render at title weight (700) on Hearst+, lighter than today's 800.
- **Mixed faces within one destination page:** shell headings in Schibsted Grotesk sit next to story headlines in, for example, Newsreader or Barlow Condensed. This is intended, but each destination should get a visual check, especially Fashion and Luxury (Modern MT Pro 400, much lighter than Schibsted at 600 to 800).
- **Enthusiast and Wellness fallback:** its headline font is still a fallback (League Gothic / Barlow Condensed) until Knockout Condensed lands, so its pairing with the Schibsted shell will change again then.
- **Global preload cost:** preloading three weights from the root layout adds requests on non-Hearst+ routes such as the design-system docs.
- **Reader brand-origin pages:** the reader inherits publication fonts for brand-origin entries; the shell-versus-article split must be checked there too, so a publication's chrome does not unexpectedly switch font.

## Deferred

None. Every question was answered.

## Open threads

None. No discussion threads were opened during the session.
