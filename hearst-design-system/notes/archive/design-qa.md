---
status: historical
coverage_end: 2026-07-21
superseded_by: STYLE.md, APP_RULES.md
---

# Hearst+ Slider and Reader Inset Design QA

> Historical visual QA evidence. Screenshot paths and findings belong to the dated implementation and must be revalidated before reuse.

## Comparison Target

- Source visual truth: `/var/folders/_d/80dnzm6d2_q7p38m8n9nc42h0000gn/T/codex-clipboard-acb48e98-1fc4-4fda-bfd0-e9bddb2f8b1b.png`
- Slider implementation screenshot: `output/playwright/cls-fix-2026-07-19/cars-slider-card-1375x981.png`
- Full-view slider screenshot: `output/playwright/cls-fix-2026-07-19/cars-slider-1375x981.png`
- Reader inset screenshots: `output/playwright/cls-fix-2026-07-19/reader-inset-1375x981.png` and `output/playwright/cls-fix-2026-07-19/reader-inset-640x900.png`
- Viewports: 1375×981, 1135×981, 768×1024, 640×900, 390×844, and 320×844
- Slider state: fresh guest Cars feed, first active story, reduced-motion capture
- Reader state: direct Cosmopolitan story-reader route, light theme

## Comparison Evidence

- Full and focused slider comparison: `output/playwright/cls-fix-2026-07-19/slider-reference-comparison.png`
- The focused component comparison is sufficient because the source visual is itself a single slider composition rather than a full-page design.
- Quantitative slider evidence: `output/playwright/cls-fix-2026-07-19/verification-results.json`
- Interaction evidence: `output/playwright/cls-fix-2026-07-19/slider-interaction-results.json`
- Reader inset evidence: `output/playwright/cls-fix-2026-07-19/reader-inset-results.json`

## Findings

No actionable P0, P1, or P2 visual mismatch remains for the requested slider background treatment or reader side gutters.

The source mock and implementation use different editorial photography and titles, but the intended composition matches: clear image above, a black-to-transparent transition over the lower image edge, and a separate solid-black lower frame supporting the unchanged text treatment.

## Required Fidelity Surfaces

### Fonts and typography

- Passed. Brand reference, headline, and subheadline retain their original component order, font families, sizes, line heights, spacing, and clamps.
- The earlier compact text experiment was removed after annotation feedback.
- Headline placement begins 63% into the desktop gradient and at least 60% into the phone gradient, keeping the original white type in the dark portion of the transition.

### Spacing and layout rhythm

- Passed. Desktop and tablet photography renders at 16:9; phone keeps the established taller responsive crop so the unchanged large headline and subheadline remain legible.
- The solid black editorial frame is 144px from the small breakpoint upward and 112px on phones.
- The reader surface has 24px top, left, and right gutters from the 640px inset breakpoint upward. At 639px and below it remains full screen.
- No document or slider-action overflow was measured at 1375, 768, 390, or 320 widths.

### Colors and visual tokens

- Passed. The transition runs from transparent through restrained black opacity to true black and joins a true-black lower frame without a seam.
- Existing Hearst+ surface, border, focus, and action-row tokens remain unchanged.

### Image quality and asset fidelity

- Passed. Existing real editorial images remain in use with the established `object-cover` focal-position logic.
- No replacement illustration, placeholder, synthetic image, or custom SVG was introduced.
- The desktop image measures exactly 16:9 in browser geometry.

### Copy and content

- Passed. Brand reference, headline, summary, control labels, and editorial copy are unchanged on desktop.
- On phones, only the action-row presentation is compacted: icons are hidden and the visible follow label becomes “Follow,” while its accessible label retains the full brand name.

### Responsiveness, behavior, and accessibility

- Passed. Previous/next restored the expected slide index, mobile horizontal swipe advanced the carousel, and Save changed from false to true while keeping the active story stable.
- Exactly one featured-story control is active and tabbable; all four inactive slide controls are hidden, inert, and `tabIndex=-1`.
- The mobile action row has zero internal overflow and no controls outside the card at 320px and 390px.
- The reader close control is visible at every tested width, Escape closes the reader, and no horizontal overflow occurs.

### Layout stability

- Passed. Fifteen clean cold-load runs stayed below the 0.10 CLS target.
- Observed ranges:
  - Hearst+ 1135×981: 0.03440–0.03441
  - Cars 1375×981: 0.05988–0.06033
  - Cars 768×1024: 0.03791–0.03793
  - Cars 390×844: 0.00011–0.00012
  - Cars 320×844: 0.02058–0.02188

## Comparison History

1. Initial reference translation changed both the background and the content hierarchy.
   - Earlier finding: P1 typography/content drift and P2 compact-phone action overflow.
   - Fix: restored the original brand, headline, and subheadline markup and styling; confined the redesign to the image, gradient, and black frame.
2. First responsive pass exposed inactive slides to assistive technology and clipped the action row at narrow widths.
   - Earlier finding: P2 accessibility and responsive containment.
   - Fix: made inactive slides inert and non-tabbable; compacted only the phone action controls.
3. Final pass adopted the requested 16:9 desktop/tablet photo and preserved the taller phone crop.
   - Post-fix evidence: exact 1.7778 image aspect ratio at desktop/tablet, zero action overflow, one active accessible slide, and passing CLS across all measured widths.
4. Reader inset annotation required equal top and side gutters when the modal begins resizing.
   - Earlier finding: P2 horizontal gutter mismatch caused by max-width-only centering.
   - Fix: applied a uniform 24px inset at the 640px breakpoint while preserving the full-screen phone state.

## Resolved Product Issue From This QA Thread

The selected Road & Track McLaren gallery article now loads through the complete reader path. `www.roadandtrack.com` is supported, source-backed gallery/listicle slide payloads resolve into inline reader blocks, and the broader source-host coverage pass now verifies one representative article from each allowed host through `/api/live-article`.

## Follow-up Polish

- P3: A later iteration could tune gradient height per headline length, but the current fixed treatment provides stable contrast and preserves the original text behavior without title-specific layout rules.

final result: passed

---

# Hearst+ Delish Shorts Carousel Design QA

## Comparison Target

- Source visual truth: `output/playwright/delish-shorts-carousel-2026-07-19/reference-youtube-shorts.png`
- Implementation screenshots: `output/playwright/delish-shorts-carousel-2026-07-19/desktop.png` and `output/playwright/delish-shorts-carousel-2026-07-19/mobile-390.png`
- Combined comparison: `output/playwright/delish-shorts-carousel-2026-07-19/reference-comparison.png`
- Viewports: 1280×720 desktop, 390×844 mobile, plus measured containment at 320×844
- State: Hearst+ Videos all-brand feed after progressive live-video delivery; carousel at its initial position

## Full-view and Focused Comparison Evidence

- The combined comparison places the supplied YouTube Shorts reference and the rendered Hearst+ component in one normalized 1369px-wide image.
- A focused component comparison is sufficient because the source visual is a single horizontal portrait-video rail rather than a full-page layout.
- The implementation preserves the source hierarchy: compact title row, uninterrupted black canvas, repeated `9:16` imagery, short clamped titles, muted metadata, and a partially visible next card.
- Hearst+ intentionally substitutes the registered Delish brand icon, real Delish recipe media, and existing Hearst typography and semantic tokens for YouTube-specific branding and view counts.

## Findings

No actionable P0, P1, or P2 mismatch remains.

## Required Fidelity Surfaces

### Fonts and typography

- Passed. The rail uses the existing Hearst+ UI type, a compact bold module title, two-line card-title clamps, and muted source metadata.
- Long source titles truncate with an ellipsis without increasing card height.

### Spacing and layout rhythm

- Passed. Cards use a consistent 12px gap, 8px image radius, true `9:16` frames, snap alignment, and open black space rather than a dashboard panel.
- Desktop reveals three full cards plus the next card; mobile reveals two cards plus the next edge as a clear horizontal-scroll affordance.
- No document overflow was measured at 390px or 320px; `document.scrollWidth` matched the viewport width at both sizes.

### Colors and visual tokens

- Passed. The component inherits the scoped Hearst+ Videos black surface, white headline text, muted gray metadata, semantic borders, controls, and focus color.
- No new publication color or parallel token system was introduced.

### Image quality and asset fidelity

- Passed. Every card uses its real production Delish poster and the selected production transcoding dimensions.
- No placeholder imagery, generated imagery, custom SVG, CSS illustration, or synthetic brand asset was introduced.

### Copy and content

- Passed. The module identifies itself as “Delish Shorts,” reports the live portrait inventory count, and preserves source video titles, topic, and duration.
- The current production inventory resolves to 19 portrait Delish videos.

### Responsiveness, behavior, and accessibility

- Passed. Desktop previous/next controls move the native horizontal scroller and correctly update their disabled states.
- Mobile horizontal scrolling moved the rail back to its first snap point without moving the page sideways.
- A carousel card now opens the dedicated immersive Delish Shorts viewer on the current Videos route; standard video cards still open the existing story reader.
- The region, list, list items, controls, and story buttons have explicit accessible names; focus rings remain visible.
- Final browser console check found no errors.

## Comparison History

1. Initial implementation visually matched the reference composition but the first long title occupied three lines.
   - Earlier finding: P2 inconsistent card height caused by a display utility overriding the two-line clamp.
   - Fix: removed the conflicting display utility so the existing line-clamp behavior controls title height.
   - Post-fix evidence: desktop and mobile captures show the first title capped at two lines with an ellipsis and aligned metadata.

## Follow-up Polish

- P3: If future brands contribute enough portrait inventory, the same data-driven rail pattern could become a reusable multi-brand module; this iteration remains intentionally scoped to Delish.

final result: passed

# 2026-07-19 — Delish Shorts immersive viewer

- Confirmed the Delish Shorts rail reports 19 current portrait videos and opens its own full-screen viewer without changing the `/hearst-plus/videos/` route.
- Desktop: verified centered `9:16` playback, black immersive canvas, Delish identity, title and duration, close, previous/next, save, mute, and play/pause controls.
- Interaction: verified next moves from item 1 to item 2, keyboard and vertical swipe handlers are present, body scrolling is locked while open, and close restores focus to the originating carousel card.
- Responsive contract: the viewer uses the full dynamic viewport on phones, keeps controls within the portrait frame, and hides the adjacent desktop control rail below the small breakpoint.
- Validation: targeted ESLint passed and the production build completed successfully.

## 2026-07-19 — Vertical swipe hardening

- Upward pointer or touch drags advance to the next Delish Short; downward drags return to the previous short.
- Gesture recognition uses pointer capture, distance and velocity thresholds, vertical-axis intent detection, and boundary resistance.
- The complete portrait frame follows the drag and snaps back, making the swipe affordance visible instead of invisible.
- Trackpad vertical swipes use the same next/previous behavior with a short navigation cooldown.
- A completed swipe suppresses the video click, preventing an accidental play/pause toggle.
- Browser verification at the default desktop viewport advanced `2/19 → 3/19` with an upward drag and returned `3/19 → 2/19` with a downward drag while playback remained active.
- Browser verification at `390 × 844` advanced `3/19 → 4/19` with an upward drag and returned `4/19 → 3/19` with a downward drag. No browser console errors were reported.
- Implementation evidence: `output/playwright/delish-shorts-swipe-2026-07-19/implementation-desktop.png` and `output/playwright/delish-shorts-swipe-2026-07-19/implementation-mobile-390x844.png`.
- Full-view comparison evidence: `output/playwright/delish-shorts-swipe-2026-07-19/reference-vs-implementation.png`. A focused still-image comparison is not needed because the requested change is motion behavior; the live gesture was tested directly at desktop and phone sizes.

final result: passed

# 2026-07-19 — Delish Shorts light river and directional video transition

- Added the dimension-verified live Delish portrait inventory directly below the lead story on `/lifestyle/delish/` in a white, token-driven publication card.
- Desktop visual QA at `1156 × 981` confirms the light module fits the existing center river between the featured story and the first standard card, with no page-level horizontal overflow.
- Mobile visual QA at `390 × 844` confirms two useful portrait cards remain visible, the rail stays contained at `358px` inside the `390px` viewport, and the page has no horizontal overflow.
- Opening a light-variant card keeps the user on `/lifestyle/delish/` and reuses the immersive viewer.
- Upward navigation now animates two live video panes together: the current pane exits through the top while the incoming pane rises from below. Downward navigation mirrors that movement. A mid-transition browser measurement found the outgoing next pane at `-822.516px` and the incoming pane at `150.459px` within the `949px` portrait surface, confirming both panes are visibly moving in the requested directions.
- Pointer swipe verification moved to the next item and a downward swipe returned to the prior item. Keyboard and button alternatives use the same directional transition function; reduced-motion preference bypasses the animation.
- Targeted ESLint and whitespace validation passed. Evidence is stored in `output/playwright/delish-shorts-light-river-2026-07-19/`.

final result: passed

# 2026-07-19 — Delish palette indicator exception and complete lazy river

- Source visual truth: the five palette swatches supplied in the browser comment (`#004685`, `#ffc035`, `#ff553e`, `#adcf21`, `#66cecf`) and the selected Delish featured-story indicator row.
- Implementation evidence: `output/playwright/delish-indicator-palette-2026-07-19/delish-desktop.png`; desktop viewport `1321 × 981`; Delish publication route with featured story 3 selected.
- Focused color verification measured the five Delish indicators as `rgb(0, 70, 133)`, `rgb(255, 192, 53)`, `rgb(255, 85, 62)`, `rgb(173, 207, 33)`, and `rgb(102, 206, 207)`, exactly matching the supplied palette. Selecting story 3 changed only its width from `16px` to `32px`; all colors remained assigned to their original positions.
- Regression correction: `/lifestyle/good-housekeeping/` initially showed five publication palette colors. The exception is now gated to the Delish slug; Good Housekeeping and every other publication again use the original active-primary plus muted-inactive indicator treatment, without changing their action controls or broader theme.
- Lazy-river verification on Cosmopolitan began with 4 main-column articles, increased to 30 while scrolling, and completed at 35 eligible main-column articles with the “caught up” state visible and the fallback load-more control removed. The complete river remained contained at the `1321px` viewport width.
- Fonts and typography, card spacing, imagery, copy, hero layout, controls, and interaction behavior are unchanged. The change is limited to indicator color sourcing and progressive river readiness.
- Targeted ESLint, whitespace validation, browser console review, and production build passed.

final result: passed

# 2026-07-21 — Rich photo-gallery river card

- Source visual truth: `/var/folders/_d/80dnzm6d2_q7p38m8n9nc42h0000gn/T/codex-clipboard-8f771982-b670-4d5e-8c24-bd69e74e91e6.png`.
- Implementation evidence: `output/playwright/rich-gallery-card-2026-07-21/desktop.png` at `1369 × 981` and `output/playwright/rich-gallery-card-2026-07-21/mobile.png` at `390 × 844`.
- Side-by-side comparison: `output/playwright/rich-gallery-card-2026-07-21/reference-vs-implementation.png`.
- The river preserves the reference composition: two prominent images across the first row, three supporting images below, and a remaining-photo count on the final tile. Hearst story metadata, headline, summary, semantic color tokens, typography, radius, and existing river actions replace the source network's social chrome.
- Rich treatment is data-driven and limited to explicit gallery stories with at least five distinct source images. The tested Car and Driver story resolved 20 real photos and displayed five preview images with `+15`; smaller or unavailable galleries retain the standard river card.
- Responsive QA found no horizontal overflow at `390px` (`scrollWidth: 390`, `clientWidth: 390`). The five-image hierarchy and action row remain readable without changing the ranked river position.
- Interaction QA confirmed the gallery card opens the existing story reader and the close control returns to the river. Desktop and mobile browser console checks reported no errors.
- Focused lint, TypeScript/build validation, and whitespace validation passed.

## Comparison History

1. Initial implementation matched the requested mosaic structure and source-count behavior.
2. Desktop and mobile inspection confirmed that the denser image treatment remains legible within the existing three-column and single-column river layouts; no follow-up visual correction was required.

final result: passed
