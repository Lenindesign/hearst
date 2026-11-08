# Hearst Prototype Style Rules

This file owns durable shared visual hierarchy, responsive presentation, accessibility, and interaction styling for the Hearst reader prototypes. It does not own content eligibility, ranking, navigation state, data loading, or reader workflow behavior; those belong in `APP_RULES.md`.

Use semantic design-system tokens and shared components wherever possible. Do not solve a local styling problem with a one-off value when an existing theme token represents the intended role.

The complete brand registry is documented in `BRAND_STYLES.md`. Canonical HDS publication values originate in `tokens/brands/`; the registry records how those values and app-level destination themes are composed in this prototype.

## Rule ownership

- `PRODUCT.md` defines the product purpose, audience, and design principles.
- `STYLE.md` defines visual hierarchy, responsive behavior, interaction styling, and theme consistency.
- `APP_RULES.md` defines product behavior, personalization, content rules, readers, feeds, and scoped exceptions.
- `BRAND_STYLES.md` defines brand identity values, inheritance, routes, typography, and logo assets.
- `DESIGN.md` is a short tooling bridge and is not a canonical rule owner.
- If two rules conflict, follow the more specific rule. A documented exception must remain scoped to the surface named by that exception.

## Theme and color

- Normal light destinations use their active theme primary color for section titles, sidebar module titles, topic labels, active navigation states, badges, and interactive story-link hover states.
- Use `--hp-section-title` for destination section headings and `--hp-sidebar-heading` for sidebar module titles and topic labels. Their normal value is the active `--primary` token.
- In the dark utility bar, weather icon, temperature, and location use `--component-navigation-utility-content-knockout`, including while the bar is transparent over a banner. Do not use `--primary-foreground` there because a light theme accent can resolve to dark text.
- AutoWeek is a documented exception: editorial and module-title text on light surfaces uses dark neutral `#242424`. AutoWeek yellow remains an accent for utility surfaces, active states, badges, and indicators.
- Hearst+ Videos is a scoped dark-mode exception. Its navigation, masthead, feed, sidebars, and section titles use the dark video tokens, including light-blue `--hp-sidebar-heading: #BDDDFC` and a white Hearst+ masthead logo.
- Video caption caveats live as footer fine print on the dark video surface, not as blocking card chrome.
- A theme exception must not leak into another tab, destination, RSS/story page, or reader.
- Overlays portaled to `<body>` (dialogs, sheets, viewers) sit outside the themed page wrapper, so they must carry the theme with them: render an in-place anchor and apply `useInheritedThemeScope` (inline theme variables, `hearst-plus-theme`, `data-brand`) to the portal root, or set `brandToCssVars` on the root directly as the reader dialog does. A portaled HDS `Button` with empty `--component-button-*` tokens loses its fill and radius.
- Body copy and metadata must meet WCAG AA contrast. In the Hearst+ light shell, primary text accents and muted metadata must clear 4.5:1 against `#ECE9E3`; use `#5B6676` for subtle text fallbacks. The shared blue accent `#2B6FAF` clears 4.5:1 on white modules but only 4.34:1 on the canvas, so keep blue text inside modules unless a brand-specific token is independently verified.
- On the Hearst+ home the all-brands logo-wall banner runs up behind the top utility bar, which is transparent at the top of the page and fills with the logo navy `#012247` (`--hp-utility-bar`) once the page scrolls; the logo's blue plus stays the header's only bright blue. Communities shares that banner and utility bar, using the white spaced HEARST wordmark with an italic `Communities` descriptor. Destination sections use compact section-color banners with their publication-logo walls and centered section lockups; Local News uses the shared HEARST wordmark with an italic `Local News` descriptor over its station logo wall, while A&E retains its channel wall and registered lockup. Publication-brand pages use the original compact masthead row with the registered brand logo and no photo banner. Newsstand uses the solid navy bar. Sections and brand pages keep a bar in their own primary color; dark-mode pages (Fashion & Luxury, Videos) keep their dark bar. On phones, section banners use a 5:1 crop so the overlaid menu and search controls fit.
- Compact mobile utility controls may stay visually small, but their interactive box must be at least 24px high at 320px and 390px viewport widths.
- Executive and product-reference status labels use restrained Hearst navy, Hearst blue, and neutral slate with unboxed inline markers. Do not use pastel success, warning, or information badges, and do not use traffic-light color semantics for documentation status. Authored interface and strategy copy does not use em dashes; use a colon, comma, semicolon, or sentence break instead. Preserve source punctuation only when reproducing published editorial content outside a strategy-document sample.

## Native foundation and brand inheritance

- The Hearst Design System is the foundation beneath this application. Use its components, semantic tokens, typography roles, icons, spacing, and responsive conventions before introducing an app-specific primitive.
- App-specific patterns compose Hearst Design System primitives. They must not fork a shared component solely to create a local visual variation that can be expressed through an existing variant or semantic token.
- Every destination and publication starts from the native Hearst foundation: shared component anatomy, spacing, responsive structure, accessibility, interaction behavior, content hierarchy, and semantic token roles.
- A brand style guide is an override layer, not a separate component system. It may replace colors, font families and weights, logo assets, and explicitly documented theme treatments while preserving the native foundation.
- Components consume semantic roles such as `--primary`, `--font-brand`, `--font-brand-secondary`, `--font-headline`, `--hp-section-title`, and `--hp-sidebar-heading`. Do not hardcode a publication color or font inside a shared component.
- Canonical HDS publication values come from `tokens/brands/{slug}.json` and `tokens/brands/_meta.json`. `src/lib/brands.ts` and `src/lib/tokens.css` are generated outputs. App-only destination compositions come from `src/lib/theme-options.ts`; logo and icon assets come from `src/lib/logos.ts`.
- When a brand value is missing, fall back to the native foundation for that role. Never silently substitute another publication's color, font, logo, or icon.
- A documented destination or surface exception is applied after the brand layer and must remain limited to its named scope.

## Editorial links and clickable rows

- Editorial headlines keep their text color on hover and keyboard focus; underline is the consistent link cue.
- Underline editorial headline links on pointer hover and keyboard focus, with a visible focus ring for keyboard accessibility.
- When a story appears as a row, make the complete row the click target rather than linking only the headline.
- Equivalent story rows use the same complete-row visual and focus treatment. `APP_RULES.md` owns their reader destination behavior.
- Utility links may also use an underline when needed to distinguish inline text from surrounding prose.

## Masthead logos

- Normalize the visual height of the `HEARST` wordmark across Hearst+, Lifestyle, Fashion & Luxury, Enthusiast & Wellness, and Autos mastheads.
- Qualifiers such as `Lifestyle`, `Fashion & Luxury`, `Enthusiast & Wellness`, and `Autos` may vary in width, but they must not scale down the Hearst wordmark.
- Align wordmark cap height and baseline consistently across destination mastheads.
- Destination banners for Lifestyle, Autos, Fashion & Luxury, and Enthusiast & Wellness share one standalone HEARST SVG and separately rendered Newsreader 600 italic descriptors. Keep their wordmark dimensions and descriptor font size identical across all four at each responsive breakpoint.
- The Local News rail places its verified Hearst station ZIP at the right of the title; use station address metadata and do not infer or fabricate a postal code.
- Generated Hearst destination masthead logos use the active destination primary color on light surfaces.
- The A&E Family destination masthead lockup has a white HEARST wordmark with the divider and `A&E Family` in the A&E Family gold on the dark entertainment landing masthead.
- Publication, station, newspaper, and channel mastheads preserve official/native logo coloring unless a dark-surface white treatment is explicitly scoped.
- Preserve theme-specific logo colors. Dark surfaces use the documented white logo treatment.
- Publication-brand masthead logos render 25% larger than their previous shared regular and compact sizes. This scale applies only when a publication brand is active; destination and section mastheads retain their normalized dimensions.

## Communities

- Community thread, group and card titles use the shared `.headline` style (the theme headline font, Schibsted Grotesk on Hearst+); do not hard-code a community display font.
- Community reactions are a single `Helpful` heart toggle with a count; never show up or down vote arrows or a net score.
- Host content carries the `{Brand} host` badge (shield icon, primary tint). A reader's pending post carries an amber `Waiting for host review · only you can see it` label.

## Carousels and sliders

- Carousel headlines display no more than three lines and use an ellipsis when truncated.
- Carousel descriptions display no more than two lines and use an ellipsis when truncated.
- The carousel must remain responsive without clipping text at supported breakpoints.
- Mixed-format carousels may contain contextual articles and playable API videos, following the eligibility and personalization rules in `APP_RULES.md`.
- Video controls, duration, and play affordances remain visible and distinct from headline metadata.
- Delish Shorts use portrait `9:16` cards, horizontal snap scrolling, and compact desktop controls. The Videos view keeps the dark canvas visible between cards; river variants use light semantic surfaces. The fullscreen viewer keeps story chrome secondary through a compact bottom fade, quiet metadata, and a restrained two-line headline. `APP_RULES.md` owns eligibility, placement, playback, and navigation behavior.

## Cards and river modules

- Hearst+ modules (cards, rails, sidebar modules, ads, community panels) have no outline stroke. The card shadow (`--hp-shadow-card`) and surface color separate them from the page; a theme rule in `globals.css` makes the border of any `hp-shadow-card` surface transparent, including on hover and focus. Do not add outline borders to module surfaces or to the photos inside them; inner dividers between rows are allowed. Focus stays visible through rings.
- Delish featured-story indicators map in order to Delish palette colors 1–5. Changing the active story changes only the indicator width; it does not move the colors between positions. All other brands and destination-wide rivers retain the shared primary/muted indicator treatment.
- River-card summaries display no more than three lines with an ellipsis. Shorter existing limits may remain.
- Do not show generic `Article`, `Gallery`, or `Watch` chips on river cards.
- Video cards place the source brand icon immediately before the brand and topic metadata.
- Preserve source-specific formats such as galleries and videos through imagery and interaction, not generic type labels.
- Rich photo-gallery river cards place story identity, headline, and summary before a two-large and three-small image mosaic. The final tile shows the remaining photo count. Preserve focus treatment, semantic surfaces, typography, and brand theme. `APP_RULES.md` owns gallery eligibility and loading behavior.
- Use consistent hover, focus, and open-reader behavior across card variants. Content cards (story, photo-gallery, lead video and video index cards) do not show a per-card action row (Save, More like this, comments, Hide, Open story) or a bottom summary strip (shopping picks, recipe stats, vehicle specs); the card surface opens the story, and Save, More like this and comments live in the reader action bar. The featured carousel keeps only its Follow brand control.

## Sidebars and rankings

- Sidebar module titles and topic labels use `--hp-sidebar-heading`.
- Story rows in sidebars and rankings are interactive across their full width.
- Ranked badges remain visible when a row changes color on hover or focus.
- Sidebar modules must not introduce an interaction pattern that differs from equivalent story rows elsewhere in the app.

## Reader

- The reader action bar appears directly under the headline and story identity metadata.
- Reader theme follows the active article section by default. Brand-origin entries inherit the active publication's registered logo, colors, headline font, body font, and semantic controls while preserving the shared reader structure.
- In the desktop reader masthead, align every active publication logo to the left edge of the shared brand slot while preserving its natural aspect ratio and normalized visual height.
- Ambient Reader composes the shared reader behavior as a premium full-screen publication layer: immersive branded opening spread, calm long-form column, publication typography and color through semantic brand variables, neutral accessible reading surfaces, visible progress, and compact shared controls. It must not replace or restyle the standard reader underneath it.
- Ambient Reader opening spreads are destination-aware without becoming separate readers: Fashion & Luxury uses a split cover, Autos uses a cinematic image-first deck, Enthusiast & Wellness uses a reverse kinetic split, and Lifestyle uses a spacious inset-image spread. The publication theme remains the identity layer inside each composition.
- On phones, Ambient Reader interstitial ads keep the complete branded creative inside one swipe page: the compact copy panel occupies roughly 55% of the viewport and the image or video remains visible in the lower 45%. Tighten the logo, headline, supporting copy, and CTA rhythm without reducing close or CTA touch targets below 44px; desktop retains the spacious side-by-side composition.
- Standard-reader advertisements use the fixed 300px complementary desktop rail, preserve visible disclosure and accessible sponsor identity, omit visible sponsor/campaign eyebrows, and disappear below the desktop breakpoint. River advertisements retain the story-card width and stack below 640px. Links keep a 44px minimum target. `APP_RULES.md` owns campaign eligibility, destination, and disclosure behavior.
- Brand Spotlight retains the river-card width. Its header pairs the publication logo with one label and one concise topic sentence. At large widths, place one featured story beside the secondary stack; below the large breakpoint, stack them in reading order. Keep the publication link at least 44px tall, story buttons fluid, summaries clamped to three lines, and the 320px document free of horizontal overflow. `APP_RULES.md` owns selection and ranking behavior.
- Reader recommendation links follow the same color-only hover behavior used by destination story links.
- Keep article prose unclamped. Line limits apply to discovery surfaces, not the full reader story.

## Type metrics

- Editorial text follows the type metrics standard UI-TYPE-001 (`/type-specs/`, drawing and film in `public/specs/type-*`). Line height is `4 · round(size · ratio ÷ 4)`: text roles use the HDS `font.line-height` token for their size, headlines use the headline ratio (1.25 at 16 down to 1.08 at 48). Standard roles: T1 48/52 (base 32/36), T2 32/36 (24/28), T4 subhead 28/32 (22/28), T3 card headline 24/28 (20/24), T5 16/20, T6 14/20, D1 reader deck 20/28, B1 body 18/28, D2 card deck 16/24, B2 UI text 14/20, M1 byline and M2 date 12/16, C1 caption 12/16, K1 caps eyebrow 11/16.
- Letter spacing uses the HDS `font.letter-spacing` token for the size; all-caps labels use +0.1em and display headlines of 40 px and up use −0.01em. No other tracking values.
- Roles on one row share one line height. Spacing between roles is S1–S9 on the 4 px grid (8 · 8 · 12 · 16 · 16 · 24 · 24 · 40 · 12). Kerning stays on; dates, times and counts use tabular figures; headlines balance and body and decks wrap pretty.
- Migration status: the standard is specified but not yet applied; components still use one-off `leading-*` and `tracking-*` classes. New and edited components should use the standard values.

## Responsive behavior

- Treat responsive behavior structurally: stack or collapse columns, preserve readable widths, and keep interaction targets accessible. Breakpoints are the min-width set 640 · 768 · 1024 · 1280 with a 1360 content maximum (2xl is retired; sm never changes column count). Rail layouts follow `RAIL_LAYOUT` in `ui/grid.tsx`: one gutter `--layout-gap` (16), one rail width `--layout-rail` (300), container padding 16 · 24 · 48. Pages add the right rail at md and the left rail at xl; a left rail that holds controls with no fallback elsewhere may join at lg. The reader adds its ad rail at lg and context rail at xl. Block grids follow their container (2 · 3 · 4 columns at 536 · 812 · 1088). See `/layout-specs/`.
- The stakeholder personalization console is a full-screen diagnostic overlay. At phone widths, its control groups stack in document order, content scrolls inside the dialog, and controls remain at least 44px. `APP_RULES.md` owns its state, focus, and availability behavior.
- Personalization onboarding uses the editorial image-and-form split only at desktop widths and omits the decorative image on smaller screens. Keep the phone interest picker horizontally scrollable, the publication picker in a bounded grid, publication names visible in full, and controls at least 44px. The modal must not create horizontal overflow at 320px or 390px. `APP_RULES.md` owns onboarding steps, limits, state, and focus behavior.
- Never allow headline or summary text to crop because a card or carousel uses a fixed height without a matching line clamp.
- Preserve a minimum comfortable touch target for buttons and complete-row links.
- CTA labels use sentence case by default and start with a clear action verb. Use Title Case only when preserving a proper name or a brand-approved label; reserve ALL CAPS for short utility actions explicitly required by a brand or a compact control, and never use lowercase for general actions. Do not apply CSS text transforms to user-facing CTA copy. Use semantic button/link variants and active-theme component tokens for color; navigation uses links, state changes use buttons, icon-only controls have an accessible name, keyboard focus remains visible, and touch actions meet the 44px minimum. The shared `Button` size variants below 44px are for dense desktop contexts only unless the surrounding target is expanded. See `/cta-specs/` for the code audit, casing guide, dimensions, colors, and states.
- CTA labels name the outcome and its object in 1–4 words with no trailing punctuation or "please" (`Read the review`, `See all Esquire videos`, `Explore Porsche`), never `Click here`. When repeated generic labels such as `Read more` remain on one page, give each a unique accessible name that includes its target. Labels stay on one line at 320px.
- Each card, modal, rail module, or advertisement shows at most one primary (solid) button; other actions use outline, secondary, ghost, or link variants. Dialog actions are end-aligned with the primary last; when actions stack on phones, the primary comes first and stacked buttons span the full width. Destructive actions use the `destructive` variant, require confirmation, and never receive default focus.
- Reuse one approved label per intent: `Sign up` for newsletters, `Start free trial` for paid trials, `Save story` / `Saved` for saving, `Watch video` for playback, and `See all {thing}` for module overflow links. Do not introduce synonyms such as `Sign Me Up` or `Subscribe now` for the same intent.
- Open a new tab only for third-party destinations (advertisers, ticketing, social embeds). New-tab links use `rel="noopener noreferrer"` and tell the reader, either with a visible external icon or with screen-reader text `(opens in a new tab)`.
- Paid and advertiser links use `rel="sponsored noopener noreferrer"`. Advertisement CTAs use the active theme's button tokens and the same casing rules as editorial CTAs, and must not imitate editorial navigation.
- Asynchronous actions use the `Button` `loading` prop with `loadingText` so the width holds and repeat activation is blocked. Toggle actions reflect their state in both the visible label and `aria-pressed` (`Save` → `Saved`, `Follow` → `Following`). Prefer an enabled control that explains what is missing over a disabled one; when a control must be disabled, adjacent text says why.
- Text CTAs use the shared `Button` primitive, or `buttonVariants` on a link for navigation. Reserve raw `<button>` elements for non-CTA hit areas such as whole-card targets, media stages, and gesture surfaces. Do not override a `Button`'s radius, height, or color through `className`: use `size="touch"` for 44px targets and change component tokens when a brand needs a different shape or color. A theme that sets a solid button background must set its label color in the same layer; `brandToCssVars` enforces this by replacing any label below 4.5:1 with white, near-black, or black.
- A trailing chevron marks only CTAs that navigate; an icon never replaces the visible label on a primary CTA. Keep at least 8px between adjacent touch targets.
- For compact buttons and pills, opt short labels without descender glyphs into cap-height alignment with the shared `.hds-cap-aligned-label` utility or the `Button` primitive's `capAlignedLabel` prop. `Button` defaults to `capAlignedLabel="auto"`, which applies the trim only to plain-text labels without descender glyphs and leaves other labels on normal metrics; pass `capAlignedLabel={false}` only when a label must keep line-box metrics. Use it for all-caps labels and other confirmed no-descender text; leave labels containing descenders (lowercase `g`, `j`, `p`, `q`, `y`, or uppercase `J` and `Q`) on normal line-box metrics so their glyphs never get clipped. Supported browsers trim the label to `cap alphabetic`; browsers without text-box trimming keep the default alignment.
- Test desktop and mobile when changing shared mastheads, carousels, sidebars, cards, or readers.

## Implementation checklist

Before considering a UI change complete:

1. Confirm the change uses the shared semantic token or component.
2. Check normal light destinations and any relevant brand theme.
3. Check the Hearst+ Videos dark exception when shared navigation, sidebars, or links changed.
4. Verify hover and keyboard focus behavior.
5. Verify text clamps at desktop and mobile widths.
6. Confirm the change does not leak into RSS/story pages or readers unless requested.
7. Update this file when a visual or interaction decision becomes a durable cross-app rule.
