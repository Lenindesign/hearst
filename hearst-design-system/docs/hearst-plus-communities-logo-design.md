# Hearst+ Communities logo: design

The Communities masthead logo becomes a **Hearst+ feature lockup**: the HEARST+ wordmark followed by a "Communities" descriptor set in bold Schibsted Grotesk. It replaces today's destination-style "HEARST *Communities*" with its italic serif descriptor.

- **Color:** all Hearst+ blue `#2D75B9` on light surfaces and all white on dark ones.
- **Rendering:** the logo is registered in `src/lib/logos.ts` and rendered through `BrandLogo` with the shared masthead geometry, so its HEARST+ letters match every other page.
- **Phones:** the same lockup scales to fit, as long as the descriptor stays at least 12px tall.
- **Other features:** this "HEARST+ plus Schibsted descriptor" lockup becomes the rule for the next Hearst+ features (for example Newsstand, Shop and Games), recorded in `BRAND_STYLES.md`.

Superseded on 2026-10-11: Communities now uses the destination lockup (navy HEARST, a thin divider, letter-spaced Schibsted Grotesk Bold "Communities" in Hearst+ blue), regenerated as `public/logos/hearst-plus-communities.svg` and sized by the shared destination geometry; see `BRAND_STYLES.md`. The decisions below describe the earlier HEARST+ version.

## Terms

- **Wordmark**: the spaced HEARST letters (HEARST+ for the Hearst+ app logo).
  Avoid: logo text, brand name.
- **Descriptor**: the word set next to the wordmark that names the section, for example the italic "Autos" or "Communities".
  Avoid: tagline, subtitle, suffix.
- **Lockup**: the fixed arrangement of wordmark and descriptor as one logo asset.
  Avoid: combo, logo set.
- **Hearst+ feature lockup**: HEARST+ wordmark plus a Schibsted Grotesk descriptor, used for app-level features rather than content destinations.
  Avoid: sub-brand logo, section logo.

## Why

The goal was to settle what the Hearst+ Communities masthead logo should be: its lockup, type, sizing and phone behavior. The current logo has three problems:
- **It looks like a destination.** It uses the destination lockup style ("HEARST" plus an italic serif descriptor, like "HEARST Autos"), but Communities is a Hearst+ feature that hosts every brand.
- **It's sized differently.** It renders as a plain image at its own size, so its letters don't match other pages.
- **It overflows on phones.** It runs under the search button and widens the page.

## Locked decisions

### 1. Communities uses a Hearst+ lockup, HEARST+ plus "Communities" (Q1: A)

Why: Communities is part of the Hearst+ app rather than a content destination. The plus ties it to the product readers signed up for, and the descriptor still says where they are.

Rejected:
- **B, keep the destination family ("HEARST *Communities*"):** it reads as a fifth destination and invites the question of why Communities is missing from the destination switcher.
- **C, no separate logo (plain HEARST+ with a "Communities" page heading):** the simplest option, but the section loses its identity in shares and screenshots.

Cost: a new lockup asset, and a second Hearst+ lockup pattern that later features follow (see routine choice 5).

## Routine choices

1. **Sizing (Q2: A):** register the lockup in `src/lib/logos.ts` and render it through `BrandLogo` with the same masthead geometry as other lockups, normalized by visual height (the `BRAND_STYLES.md` rule).
   - **Result:** the HEARST+ letters come out the same size on every page, the compact and phone sizes the masthead already handles carry over, and the phone overflow is fixed.
   - **Prerequisite:** the SVG needs a viewBox tight to the artwork, like the other lockups.
   - **Rejected:** keeping the image but hand-tuning its height (B), which repeats the sizing rule and still needs its own phone sizes; leaving it as it is (C).
2. **Phones (Q3: A):** the same lockup, scaled to fit between the menu and search buttons, as long as the descriptor stays at least 12px tall. HEARST+ plus "Communities" should fit in about 260px.
   - **Rejected:** wordmark only on phones (B), which drops the section name; a stacked version (C), which needs a third asset and a taller masthead.
   - **Cost:** a longer descriptor later may not fit.
3. **Descriptor typeface (Q4: A):** Schibsted Grotesk bold, title case ("Communities"), sitting on the wordmark's baseline. The letters are converted to outlines in the SVG, so the logo never depends on the web font loading.
   - **Why:** it sets Hearst+ features apart from content destinations at a glance and matches the headings directly underneath.
   - **Rejected:** the destinations' italic serif (B), which undoes Q1; spaced capitals like the wordmark (C), which are too wide for phones.
4. **Color (Q5: A):** the whole lockup is Hearst+ blue `#2D75B9` on light surfaces and white on dark surfaces. The white version can reuse the masthead's existing `tone: "white"` approach.
   - **Rejected:** a near-black descriptor (B), which looks like body text; the descriptor in each page's destination color (C), which conflicts with the color design reserving destination colors for content accents.
5. **The pattern for other features (Q6: A):** "HEARST+ plus Schibsted descriptor" is recorded in `BRAND_STYLES.md` as the Hearst+ feature lockup and used for the next app features, such as Newsstand, Shop and Games. Features with long names need a short descriptor ("Shop" rather than "Shop the stories") to meet the phone rule.
   - **Rejected:** deciding each feature case by case (B).

## Verified facts

Established by reading the code, not by asking:

- **Current asset:** `public/logos/h-communities.svg`, a 573×47 viewBox, 19 paths, all filled `#2D75B9`.
- **How it renders:** `community-forums-page.tsx` passes it to `MainNav` as `mastheadLogoOverride` (`/logos/h-communities.svg`, label "Hearst+ Communities"). `MainNav` draws such overrides as an `<img>` at `h-[44px] max-w-[360px]`, or `h-[28px] max-w-[220px]` when compact.
- **Other lockups:**
  - **Hearst+:** `public/logos/hearst-plus.svg`, viewBox 326×36.
  - **Destinations:** `hearst-autos.svg` 368×36, `hearst-lifestyle.svg` 402×42, `hearst-fashion-luxury.svg` 516×42, `hearst-ew.svg` 367×36.
  - **Registration and rendering:** they are registered in `src/lib/logos.ts` (for example `"hearst-all": "/logos/hearst-plus.svg"`) and rendered by `BrandLogo` with `mastheadHearstGeometry` sizes. `MainNav` already switches to a compact mobile mark for destinations (`usesCompactMobileDestinationMark`).
- **Registry and rules:** `h-communities.svg` is not registered in `src/lib/logos.ts` or listed in `BRAND_STYLES.md`. `BRAND_STYLES.md` says to use registered SVGs without stretching and to normalize masthead logos by visual height, not total width.
- **Phone overflow:** on a 375px viewport the Communities page currently lays out 613px wide, and the masthead logo runs under the search button.

## Implementation notes

1. **New asset:** build `public/logos/hearst-plus-communities.svg`.
   - **Wordmark:** the HEARST+ paths from `hearst-plus.svg`, at their existing proportions.
   - **Descriptor:** "Communities" in Schibsted Grotesk bold, converted to outlines, on the wordmark's baseline.
   - **Spacing and size:** a gap of roughly one HEARST letter space; descriptor cap height about 60 to 70% of the wordmark's.
   - **Fill and viewBox:** fill `#2D75B9`, with a viewBox tight to the art.
2. **Register it:** add it to `src/lib/logos.ts`, with a key such as `"hearst-communities"` and the label "Hearst+ Communities".
3. **Render it:** in `community-forums-page.tsx`, replace the `mastheadLogoOverride` image with that registered logo (through `BrandLogo` and the shared geometry), keeping the white tone available for dark mastheads.
4. **Check sizes:** confirm at 1280, 768 and 375px that the HEARST+ letters match the Hearst+ home page, that the descriptor is at least 12px tall on phones, and that the page no longer overflows horizontally.
5. **Docs:** update `BRAND_STYLES.md` with an Identity row for Communities and a "Hearst+ feature lockup" rule (wordmark, Schibsted descriptor, one color, phone minimum, short descriptors). Add a decision-log entry.
6. **Retire the old asset:** remove `h-communities.svg` once nothing references it.

## Risks

- **Font licensing and outlines:** Schibsted Grotesk is open source (SIL OFL), so outlining it in a logo is fine, but the outlines must be regenerated if the face or weight changes.
- **Pattern pressure:** once this is the rule, every new feature wants its own lockup. Keep the descriptor to one short word.
- **Shared geometry:** if the masthead geometry is tuned for 36px-tall lockups, a wider asset may need its own maximum width so it doesn't crowd the search button on tablets.

## Deferred

None. Every question was answered.

## Open threads

None. No discussion threads were opened during the session.
