---
status: historical
snapshot_date: 2026-07-16
audited_commit: dd98fb5
---

# Hearst Design System and Reader App — Extensive QA Audit

> [!note] Historical audit snapshot
> Findings describe the dated commit and environment below. Revalidate current behavior before using any finding as an active requirement.

**Audit date:** July 16, 2026
**Audited commit:** `dd98fb5` (`Feature fashion lead in live feed`)
**Environment:** production build served locally at `http://localhost:3100`
**Scope:** the full design-system site, all Hearst reader destinations, live feed, brand routes, story reader, media viewer, component documentation, canonical routes, and legacy redirects.

## Anti-pattern verdict

**Pass with minor reservations (3/4).** The product does not read as generic AI-generated UI. Its editorial typography, destination-specific mastheads, content density, photography, and contextual light/dark behavior are distinctive and intentional. The main anti-pattern risk is not visual sameness; it is the accumulation of tiny pill-like controls, undersized carousel indicators, and several oversized source modules that make the implementation harder to maintain and the interface harder to operate accessibly.

## Scorecard

| Area | Score | Assessment |
|---|---:|---|
| Accessibility | 1/4 | Major keyboard, semantic, caption, contrast, and target-size failures remain. |
| Performance | 1/4 | Lighthouse performance is 64–68; multi-megabyte source images and poor LCP dominate. |
| Responsive behavior | 2/4 | Hearst+ and live feed are solid, but destination logos and the token tabs overflow narrow screens. |
| Theming and brand fidelity | 4/4 | Destination themes, contextual story-reader modes, and modal destination switching work well. |
| Anti-pattern avoidance | 3/4 | Strong editorial identity; minor control-density and maintainability concerns. |
| **Total** | **11/20** | **Needs improvement before broad release.** |

## Executive summary

- **P0:** 0
- **P1:** 6
- **P2:** 8
- **P3:** 2
- **Route health:** 90/90 public, canonical, and legacy route checks resolve correctly. All 29 legacy brand URLs redirect exactly once to their canonical destination.
- **Build health:** production build and TypeScript pass; 92 static pages are generated. ESLint fails with 17 errors and 210 warnings.
- **Runtime health:** no reproducible page errors or broken media on the primary destination routes. The content-carousel documentation has two dead image URLs.
- **Highest-risk defects:** story-reader focus escapes the modal, story cards contain nested controls inside a button-like container, shared form controls are not programmatically labelled, videos lack captions, destination mastheads cause mobile page overflow, and oversized images produce slow LCP.

## Test coverage and method

- Built the production application and ran TypeScript, ESLint, diff-integrity, and static source checks.
- Smoke-tested 61 static/canonical routes and 29 legacy routes.
- Exercised 25 representative routes at desktop size, then all primary destinations at 390×844 and 320×568.
- Audited Hearst+, live feed, Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, tokens, input documentation, and the product story with axe WCAG 2.0/2.1 A/AA rules.
- Ran Lighthouse against Hearst+, live feed, and Fashion & Luxury on mobile and Hearst+ on desktop.
- Tested keyboard focus, Escape handling, theme switching, destination switching inside the reader, touch swiping, story opening, video playback, and full-screen image navigation.
- Visually inspected desktop and mobile screenshots. Evidence is stored under [`output/playwright/qa-audit`](output/playwright/qa-audit/).

## Detailed findings

### P1 — Story reader does not contain or restore keyboard focus

**Category:** Accessibility / keyboard / modal behavior
**Location:** `src/components/home-page.tsx:4267`, `src/components/home-page.tsx:4347`
**Evidence:** Opening a story leaves focus on the underlying “Open story” trigger. Repeated Tab presses move into the background page. Escape closes the reader, but there is no initial-focus move, focus trap, background `inert`/hiding, or focus restoration in the reader effect.
**Impact:** Keyboard and assistive-technology users can lose context and interact with obscured content.
**Standard:** WCAG 2.4.3 Focus Order; WCAG 2.1.2 No Keyboard Trap; WAI-ARIA modal dialog pattern.
**Recommendation:** Reuse the robust focus-management pattern already present in the account/onboarding dialog: focus the close button or heading, trap Tab/Shift+Tab, mark the background inert, and restore focus to the opener.
**Suggested command:** `$impeccable harden`

### P1 — Story cards use a button role around nested interactive controls

**Category:** Accessibility / semantics
**Location:** `src/components/home-page.tsx:2970`, `src/components/home-page.tsx:3020`
**Evidence:** Each article is `role="button"` and keyboard focusable while containing Save, More like this, comment, Hide, and source controls. Axe reports serious `nested-interactive` failures on three cards across every destination.
**Impact:** Screen-reader output and activation behavior are ambiguous; keyboard events can trigger the wrong action.
**Standard:** WCAG 4.1.2 Name, Role, Value; HTML interactive-content rules.
**Recommendation:** Make the title/image a real link or button and keep secondary actions as sibling controls inside a non-interactive article container.
**Suggested command:** `$impeccable harden`

### P1 — Shared input and brand-switcher controls are not programmatically named

**Category:** Accessibility / forms
**Location:** `src/components/ui/input.tsx:55`, `src/components/ui/input.tsx:79`, `src/components/ui/input.tsx:89`, `src/components/brand-switcher.tsx:11`
**Evidence:** Labels have no `htmlFor`, inputs have no generated IDs, required state is decorative only, help/error content is not connected through `aria-describedby`, the clear button has no accessible name and is removed from Tab order, and the brand `<select>` has no label. Axe reports critical `button-name` and `select-name` failures; all 18 inspected inputs had no label association.
**Impact:** Form fields and actions are unclear or unnamed to screen-reader users.
**Standard:** WCAG 1.3.1 Info and Relationships; 3.3.2 Labels or Instructions; 4.1.2 Name, Role, Value.
**Recommendation:** Generate stable IDs, bind labels, forward native required state, connect help/error text, name the clear action, and add a visible or visually hidden label to the switcher.
**Suggested command:** `$impeccable harden`

### P1 — Playable videos do not provide captions

**Category:** Accessibility / media
**Location:** `src/components/home-page.tsx:2816`, `src/components/home-page.tsx:4475`
**Evidence:** Both video renderers provide controls and labels but no `<track kind="captions">`. The tested Hearst CDN video loaded completely (`readyState=4`, 168.9 seconds) and played after user activation, so this is a captioning—not playback—failure. Axe flags `video-caption` as critical incomplete.
**Impact:** Deaf and hard-of-hearing readers cannot access spoken content.
**Standard:** WCAG 1.2.2 Captions (Prerecorded).
**Recommendation:** Add language-specific VTT caption tracks and expose caption availability in live-feed metadata; avoid publishing playable video without a caption asset.
**Suggested command:** `$impeccable harden`

### P1 — Destination mastheads cause mobile page-level overflow

**Category:** Responsive layout
**Location:** `src/components/home-page.tsx:1575`, `src/components/home-page.tsx:1659`
**Evidence:** At 390px, Fashion & Luxury overflows by 27px and Enthusiast & Wellness by 137px. At 320px, Lifestyle overflows by 10px, Autos by 31px, Fashion & Luxury by 97px, and Enthusiast & Wellness by 207px. The intrinsic SVG widths are not constrained by the masthead container. See [E&W evidence](output/playwright/qa-audit/mobile-hearst-ew-overflow.png) and [Fashion & Luxury evidence](output/playwright/qa-audit/mobile-hearst-flux-overflow.png).
**Impact:** Users can pan the entire page horizontally; content and controls drift off screen on common mobile widths.
**Standard:** WCAG 1.4.10 Reflow.
**Recommendation:** Constrain the logo wrapper and SVG with `min-width:0`, `max-width:100%`, and viewport-aware maximums; verify all supplied brand SVG viewBoxes at 320px.
**Suggested command:** `$impeccable adapt`

### P1 — Oversized source images make the first experience slow

**Category:** Performance
**Location:** `src/components/home-page.tsx:1895`
**Evidence:** Lighthouse performance scores range from 64 to 68. Hearst+ mobile reports FCP 4.5s and LCP 52.9s in the audit run; desktop LCP is 7.1s. One 2.79MB, 6000×4124 image is displayed around 704×484 desktop or 378×520 mobile. A second 1.57MB image is rendered as small as 176×229. Lighthouse estimates 4.39–4.60MB of image-delivery savings on Hearst+. Total transferred content reaches about 12MB.
**Impact:** Slow visual completion, excessive data use, and poor performance on constrained devices and networks.
**Standard:** Core Web Vitals LCP target ≤2.5s; responsive-image best practices.
**Recommendation:** Serve destination/CDN transforms at rendered dimensions, use responsive `srcset`/`sizes`, modern formats, and preload only the actual LCP candidate.
**Suggested command:** `$impeccable optimize`

### P2 — Repeated color-contrast failures across navigation and footer text

**Category:** Accessibility / visual
**Location:** `src/components/fre/site-footer.tsx:54`, `src/components/fre/site-footer.tsx:104`, `src/components/home-page.tsx:920`
**Evidence:** Axe finds 2–11 serious contrast failures per destination. Measured examples include footer text at 4.15:1, copyright at 2.62:1, E&W utility navigation at 4.04:1, and destination pills at 4.34:1, below the 4.5:1 requirement for normal text.
**Impact:** Low-vision users and readers in low-quality displays or bright environments may not be able to read secondary navigation and legal content.
**Standard:** WCAG 1.4.3 Contrast (Minimum).
**Recommendation:** Raise destination-aware muted-text tokens and remove opacity stacking from footer/legal links.
**Suggested command:** `$impeccable polish`

### P2 — Carousel indicators and compact controls miss minimum target size

**Category:** Accessibility / touch
**Location:** `src/components/home-page.tsx:3284`
**Evidence:** Featured-story indicators are 16×6px or 32×6px. The mobile Filter Brands disclosure measures 16×16px. Lighthouse fails target-size checks.
**Impact:** Touch users with limited dexterity can miss controls or activate adjacent targets.
**Standard:** WCAG 2.2 2.5.8 Target Size (Minimum), 24×24 CSS pixels or adequate spacing.
**Recommendation:** Preserve the small visual indicator but wrap it in a minimum 24×24 hit area with visible focus styling.
**Suggested command:** `$impeccable harden`

### P2 — Scrollable regions are not keyboard focusable

**Category:** Accessibility / keyboard
**Location:** `src/components/home-page.tsx:5660`, `src/components/product-story-shell.tsx:263`
**Evidence:** Axe reports `scrollable-region-focusable` for the sticky trending rail. The product journey matrix uses horizontal overflow without a focusable wrapper or keyboard cue.
**Impact:** Keyboard-only users cannot reliably reach or scroll overflow content.
**Standard:** WCAG 2.1.1 Keyboard; 2.4.7 Focus Visible.
**Recommendation:** Give independently scrollable regions a meaningful label and `tabIndex=0`, with visible focus and gradient/scroll affordances.
**Suggested command:** `$impeccable harden`

### P2 — Token-reference tabs overflow mobile screens

**Category:** Responsive layout
**Location:** `src/components/tokens-page.tsx:320`
**Evidence:** The inline tabs are 467px wide. Root overflow is 101px at 390px and 171px at 320px; the final Usage Guide tab leaves the viewport. See [token evidence](output/playwright/qa-audit/mobile-tokens-overflow.png).
**Impact:** The reference page is difficult to navigate on mobile and introduces page-level horizontal panning.
**Standard:** WCAG 1.4.10 Reflow.
**Recommendation:** Contain the tabs in an explicit horizontal scroller with edge affordances or switch to a compact select/segmented layout at narrow widths.
**Suggested command:** `$impeccable adapt`

### P2 — Visible search and footer navigation affordances are inert

**Category:** Functional / navigation / SEO
**Location:** `src/components/home-page.tsx:1675`, `src/components/fre/site-footer.tsx:56`, `src/components/fre/site-footer.tsx:89`, `src/components/fre/site-footer.tsx:107`
**Evidence:** The masthead Search button has no handler. Clicking it produces no UI change. Social, Subscribe, and legal link components have no `href`; utility Shop/Newsletter links point to `#`. Lighthouse fails crawlable-anchor checks and SEO scores 91.
**Impact:** Prominent controls appear actionable but do nothing, reducing trust and keyboard/navigation reliability.
**Standard:** WCAG 2.4.4 Link Purpose; functional consistency; crawlable-link SEO guidance.
**Recommendation:** Implement the intended behavior or render unavailable items as non-interactive labels; use real destination URLs for links.
**Suggested command:** `$impeccable harden`

### P2 — Auto-advancing featured stories ignore reduced-motion preference

**Category:** Accessibility / motion
**Location:** `src/components/home-page.tsx:3099`
**Evidence:** The featured carousel advances every 6.5 seconds whenever it is not paused or dragged. CSS disables some transitions under reduced motion, but the interval itself does not check `prefers-reduced-motion`.
**Impact:** Motion-sensitive users still experience automatic content changes after requesting reduced motion.
**Standard:** WCAG 2.2.2 Pause, Stop, Hide; user motion preference.
**Recommendation:** Default the carousel to paused when reduced motion is requested and announce manual slide changes without forcing automatic updates.
**Suggested command:** `$impeccable harden`

### P2 — Content-carousel documentation contains broken media

**Category:** Functional / content integrity
**Location:** `src/app/components/content-carousel/page.tsx:8`, `src/app/components/content-carousel/page.tsx:9`
**Evidence:** Two Unsplash URLs return HTTP 404 with `text/html`, generating `ERR_BLOCKED_BY_ORB`. Navigating the sample reveals a broken-image icon and clipped alt text. See [broken slide evidence](output/playwright/qa-audit/mobile-content-carousel-broken-slide.png).
**Impact:** The component example cannot be trusted as a visual reference and appears broken to users.
**Recommendation:** Replace the dead assets with durable local fixtures or validated CDN URLs and add a broken-image smoke test to documentation routes.
**Suggested command:** `$impeccable polish`

### P2 — ESLint quality gate fails

**Category:** Code quality / release confidence
**Location:** `src/stories/FRE.stories.tsx`, `src/stories/Grid.stories.tsx`, `src/components/token-inspector.tsx`, `src/components/visual-inspector.tsx`, `src/components/nav-bar.tsx`, `scripts/check-tokens.ts`, `scripts/audit-tokens.ts`
**Evidence:** `npm run lint` exits 1 with 17 errors and 210 warnings. Errors include explicit `any`, unescaped entities, state updates inside effects, and unused variables. Vendor Impeccable scripts account for 109 warnings, but all 17 errors remain in application/repository code.
**Impact:** The repository cannot enforce its current quality gate and genuine regressions are hidden in noise.
**Recommendation:** Exclude generated/vendor audit code from application lint, then resolve the 17 repository errors before making lint required in CI.
**Suggested command:** `$impeccable harden`

### P3 — Design-system routes expose multiple level-one headings

**Category:** Accessibility / document structure / SEO
**Location:** `src/components/nav-bar.tsx`, individual design-system page headings
**Evidence:** Representative component and token pages expose both “Hearst Design System” and the page title as `h1`.
**Impact:** Page hierarchy is less clear to assistive technology and search engines.
**Standard:** Consistent semantic document outline.
**Recommendation:** Render the shell brand as a non-heading or make the route title the single page-level heading.
**Suggested command:** `$impeccable harden`

### P3 — Core reader module and client payload are too large

**Category:** Maintainability / performance
**Location:** `src/components/home-page.tsx`
**Evidence:** The reader component is 6,181 lines and 262KB of source. Its main built chunk is about 644KB and embeds large destination/story datasets; another live-feed chunk is about 236KB.
**Impact:** Changes carry a broad regression surface, code review is harder, and readers download more JavaScript/data than needed for the current route.
**Recommendation:** Split header, river, story cards, modal reader, fullscreen gallery, and destination data into route-aware modules loaded only when needed.
**Suggested command:** `$impeccable optimize`

## Systemic patterns

1. **Accessibility is strongest in newer isolated dialogs and weakest in the large reader module.** Account/onboarding and fullscreen-gallery focus behavior is solid; the story reader and feed cards need the same rigor.
2. **Responsive defects come from intrinsic-width children, not the grid system.** Main content columns behave well; destination SVGs and inline tabs escape their containers.
3. **Performance is image-bound before it is JavaScript-bound.** Fixing image sizing and delivery will produce the largest immediate gain; module splitting is the second step.
4. **Secondary UI uses opacity as a styling shortcut.** That is the recurring source of contrast failures across otherwise well-designed themes.
5. **The shared primitives need stronger semantics.** Input, Link, tabs, and scrollable-region defaults should prevent downstream pages from recreating the same defects.

## What is working well

- All 90 route/redirect checks pass; missing routes correctly return 404 and invalid live-article requests return structured 400 responses.
- Production build, TypeScript, and diff-integrity checks pass; 92 static routes are generated.
- Primary desktop routes show no root overflow, duplicate IDs, broken images, or reproducible console/page errors.
- Hearst+, live feed, Lifestyle, and representative brand routes reflow correctly at 390px; actual touch swiping advances the featured story without accidentally opening it, while taps open the story.
- Destination-aware modal navigation updates both content and theme correctly: Fashion & Luxury remains dark, while Autos and Lifestyle switch to light reader treatment.
- Theme toggle changes the page palette correctly.
- Hearst CDN video loads and plays after user interaction.
- Fullscreen gallery moves focus to Close, supports Arrow navigation, `+/-`, Escape, counters, thumbnails, captions/actions, and returns to the story reader.
- Account and onboarding dialogs correctly move, trap, and restore focus.
- Layout stability is excellent in the Lighthouse runs (`CLS=0`) and total blocking time remains low (0–90ms).
- The local API key file is ignored by Git and the key is read from the environment rather than committed to source.

## Recommended action order

1. Run `$impeccable harden` for the story-reader focus model, card semantics, form labels, captions, target sizes, scrollable regions, reduced motion, and inert controls.
2. Run `$impeccable adapt` for destination mastheads and token tabs, then retest 320, 390, 768, and desktop widths.
3. Run `$impeccable optimize` for responsive CDN images and route-aware code/data splitting.
4. Run `$impeccable polish` for contrast tokens and durable documentation media.
5. Restore a clean ESLint gate and add automated checks for axe, root overflow, broken images, and modal focus containment.

You can ask me to run these one at a time, all at once, or in any order you prefer.

Re-run `$impeccable audit` after fixes to see your score improve.
