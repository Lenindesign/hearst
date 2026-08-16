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
- AutoWeek is a documented exception: editorial and module-title text on light surfaces uses dark neutral `#242424`. AutoWeek yellow remains an accent for utility surfaces, active states, badges, and indicators.
- Hearst+ Videos is a scoped dark-mode exception. Its navigation, masthead, feed, sidebars, and section titles use the dark video tokens, including light-blue `--hp-sidebar-heading: #BDDDFC` and a white Hearst+ masthead logo.
- Video caption caveats live as footer fine print on the dark video surface, not as blocking card chrome.
- A theme exception must not leak into another tab, destination, RSS/story page, or reader.
- Body copy and metadata must meet WCAG AA contrast. In the Hearst+ light shell, primary text accents and muted metadata must clear 4.5:1 against `#F4F2EE`; use `#2B6FAF` for the shared blue accent and `#5F6B7A` for subtle text fallbacks unless a brand-specific token is independently verified.
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

- Editorial story links change the headline to the active theme primary color on hover and keyboard focus.
- Do not underline editorial story links on hover or focus.
- Keep the existing visible focus ring for keyboard accessibility.
- When a story appears as a row, make the complete row the click target rather than linking only the headline.
- Equivalent story rows use the same complete-row visual and focus treatment. `APP_RULES.md` owns their reader destination behavior.
- Utility links may retain an underline when the underline is required to distinguish inline text from surrounding prose. This exception does not apply to editorial headlines or story rows.

## Masthead logos

- Normalize the visual height of the `HEARST` wordmark across Hearst+, Lifestyle, Fashion & Luxury, Enthusiast & Wellness, and Autos mastheads.
- Qualifiers such as `Lifestyle`, `Fashion & Luxury`, `Enthusiast & Wellness`, and `Autos` may vary in width, but they must not scale down the Hearst wordmark.
- Align wordmark cap height and baseline consistently across destination mastheads.
- Generated Hearst destination masthead logos use the active destination primary color on light surfaces.
- The generated A&E Family destination masthead uses the A&E Family primary color on the dark entertainment landing masthead.
- Publication, station, newspaper, and channel mastheads preserve official/native logo coloring unless a dark-surface white treatment is explicitly scoped.
- Preserve theme-specific logo colors. Dark surfaces use the documented white logo treatment.
- Publication-brand masthead logos render 25% larger than their previous shared regular and compact sizes. This scale applies only when a publication brand is active; destination and section mastheads retain their normalized dimensions.

## Carousels and sliders

- Carousel headlines display no more than three lines and use an ellipsis when truncated.
- Carousel descriptions display no more than two lines and use an ellipsis when truncated.
- The carousel must remain responsive without clipping text at supported breakpoints.
- Mixed-format carousels may contain contextual articles and playable API videos, following the eligibility and personalization rules in `APP_RULES.md`.
- Video controls, duration, and play affordances remain visible and distinct from headline metadata.
- Delish Shorts use portrait `9:16` cards, horizontal snap scrolling, and compact desktop controls. The Videos view keeps the dark canvas visible between cards; river variants use light semantic surfaces. The fullscreen viewer keeps story chrome secondary through a compact bottom fade, quiet metadata, and a restrained two-line headline. `APP_RULES.md` owns eligibility, placement, playback, and navigation behavior.

## Cards and river modules

- Delish featured-story indicators map in order to Delish palette colors 1–5. Changing the active story changes only the indicator width; it does not move the colors between positions. All other brands and destination-wide rivers retain the shared primary/muted indicator treatment.
- River-card summaries display no more than three lines with an ellipsis. Shorter existing limits may remain.
- Do not show generic `Article`, `Gallery`, or `Watch` chips on river cards.
- Video cards place the source brand icon immediately before the brand and topic metadata.
- Preserve source-specific formats such as galleries and videos through imagery and interaction, not generic type labels.
- Rich photo-gallery river cards place story identity, headline, and summary before a two-large and three-small image mosaic. The final tile shows the remaining photo count. Preserve shared actions, focus treatment, semantic surfaces, typography, and brand theme. `APP_RULES.md` owns gallery eligibility and loading behavior.
- Use consistent hover, focus, save, comment, hide, and open-reader behavior across card variants.

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
- Standard-reader advertisements use the fixed 300px complementary desktop rail, preserve visible disclosure and sponsor identity, and disappear below the desktop breakpoint. River advertisements retain the story-card width and stack below 640px. Links keep a 44px minimum target. `APP_RULES.md` owns campaign eligibility, destination, and disclosure behavior.
- Brand Spotlight retains the river-card width. Its header pairs the publication logo with one label and one concise topic sentence. At large widths, place one featured story beside the secondary stack; below the large breakpoint, stack them in reading order. Keep the publication link at least 44px tall, story buttons fluid, summaries clamped to three lines, and the 320px document free of horizontal overflow. `APP_RULES.md` owns selection and ranking behavior.
- Reader recommendation links follow the same color-only hover behavior used by destination story links.
- Keep article prose unclamped. Line limits apply to discovery surfaces, not the full reader story.

## Responsive behavior

- Treat responsive behavior structurally: stack or collapse columns, preserve readable widths, and keep interaction targets accessible.
- The stakeholder personalization console is a full-screen diagnostic overlay. At phone widths, its control groups stack in document order, content scrolls inside the dialog, and controls remain at least 44px. `APP_RULES.md` owns its state, focus, and availability behavior.
- Personalization onboarding uses the editorial image-and-form split only at desktop widths and omits the decorative image on smaller screens. Keep the phone interest picker horizontally scrollable, the publication picker in a bounded grid, publication names visible in full, and controls at least 44px. The modal must not create horizontal overflow at 320px or 390px. `APP_RULES.md` owns onboarding steps, limits, state, and focus behavior.
- Never allow headline or summary text to crop because a card or carousel uses a fixed height without a matching line clamp.
- Preserve a minimum comfortable touch target for buttons and complete-row links.
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
