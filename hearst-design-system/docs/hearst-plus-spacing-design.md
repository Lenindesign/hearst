# Hearst+ spacing and padding: design

The HDS **space scale** becomes the vocabulary for Hearst+ spacing: it is exposed as named Tailwind utilities (`p-md`, `gap-sm`, `px-xl`) for new code, while the roughly 5,000 existing numeric utilities stay valid because they already sit on the same 4px grid. On top of the scale sit semantic density tokens. Three **insets** (compact 12px; card 16px on phones and 20px from `sm` up; panel 24px on phones and 32px from `md` up) are tokens that switch at their breakpoint, and five **gaps** paired with them (compact 8px, card 12px, feed 16px, panel 16px, section 24px) are tokens too, all exposed as utilities. Pages use breakpoint **page gutters** from the HDS gutter tokens (16px phones, 24px tablets, 32px desktop) with content capped at 1360px; only immersive full-screen layers and horizontally scrolling phone carousels may bleed past the gutter. A lint rule flags arbitrary spacing values such as `p-[18px]`. None of this is implemented yet.

## Terms

- **Space scale**: the HDS spacing tokens `--space-3xs` (2px), `2xs` (4), `xs` (8), `sm` (12), `md` (16), `lg` (20), `xl` (24), `2xl` (32), `3xl` (48), `4xl` (64), `6xl` (80).
  Avoid: spacing units, rhythm.
- **Inset**: the padding inside a component's box (card, panel, modal), on every side unless stated.
  Avoid: margin, spacing, gap.
- **Gap**: the space between sibling items in a stack or grid.
  Avoid: margin, gutter.
- **Page gutter**: the horizontal space between the viewport edge and page content (HDS `--layout-gutter-sm` 16px to `--layout-gutter-2xl` 80px).
  Avoid: side padding, margin.

## Why

The goal was to settle how Hearst+ spaces and pads its layouts and components: the source of truth for spacing, standard insets for cards and panels, and page gutters. The design system already defines a space scale and gutter tokens, but the app does not use them: components hand-pick Tailwind numeric utilities, so similar components end up padded and spaced slightly differently (story cards at 16/20px, panels at 24/32px, modals at 24/40px, sidebar modules anywhere from 12 to 20px), and page edges differ between destinations.

## Locked decisions

### 1. The HDS space scale is the source of truth, exposed as named utilities (Q1: A)

The HDS space scale is exposed as named Tailwind utilities (for example `p-md`, `gap-sm`, `px-xl`, `mt-2xl`) and new code uses them. Existing numeric utilities (`p-4`, `gap-3`) stay valid and render identically, because Tailwind's 4px grid already lands on the scale's values; they move to named utilities as files are touched.

Why: the design-system scale becomes the vocabulary going forward, so a value outside it stands out in review, with no visual change and no big-bang rewrite.

Rejected:
- **B, migrate every component to the space tokens now:** the purest result, but a very large, risky diff (about 5,000 utilities) with no visual change.
- **C, treat Tailwind's numeric scale as the source of truth and only document the mapping:** the least work, but it leaves the HDS scale as paperwork, against the rule that the app uses HDS foundations (including spacing) before its own primitives.

## Routine choices

1. **Standard insets (Q2: A):** three named insets. **Compact** 12px for rails, sidebar modules and list rows. **Card** 16px on phones and 20px from `sm` up for story cards (today's river card values). **Panel** 24px on phones and 32px from `md` up for panels, modals and the plans section. Rejected: one inset everywhere (B, 20px, 16px on phones), which cramps modals and over-pads rails; per-component insets that only ban off-scale values (C), which keeps the drift between similar components.
2. **Page gutters and content width (Q3: A):** breakpoint gutters from the HDS tokens, `--layout-gutter-sm` 16px on phones, `--layout-gutter-md` 24px on tablets and `--layout-gutter-lg` 32px on desktop, with content capped at `--layout-maxwidth-xl` 1360px (the existing `--width-content-max`). Rejected: fluid gutters of about 5vw clamped to 16 to 80px (B), whose edges drift between pages and are harder to verify; per-page gutters (C).
3. **Keeping new code on the scale (Q4: A):** a lint rule flags arbitrary spacing values in `className` strings (for example `p-[18px]`, `gap-[7px]`, `px-[6vw]`), plus a `STYLE.md` rule preferring named scale, inset and gap utilities. Fix the existing offenders (about 8) when the rule lands. Rejected: a style rule and review only (B), which lets drift creep back; also a codemod rewriting existing numeric utilities (C), which reopens the rewrite decision 1 chose not to do.
4. **How insets are expressed (Q5: A):** semantic inset tokens `--inset-compact`, `--inset-card` and `--inset-panel`, defined in the token layer with media queries so the card and panel values switch at their breakpoints, and exposed as utilities (`p-inset-compact`, `p-inset-card`, `p-inset-panel`, with `px-` and `py-` variants as needed). Rejected: writing scale utility pairs in each component (B, `p-md sm:p-lg`), which repeats the breakpoint rule across dozens of components.
5. **Standard gaps (Q6: A):** gaps paired with each inset. **Compact** 8px between rows. **Card** 12px inside a card. **Feed** 16px between cards (today's `space-y-4` in the story river). **Panel** 16px inside a panel. **Section** 24px between sections within a panel. Rejected: one 16px gap everywhere (B), which flattens the density hierarchy; per-component gaps on the scale (C), which keeps similar components spaced differently.
6. **Gap tokens (Q8: A):** semantic gap tokens `--gap-compact` (8px), `--gap-card` (12px), `--gap-feed` (16px), `--gap-panel` (16px) and `--gap-section` (24px), defined next to the inset tokens and exposed as utilities (`gap-card`, `space-y-feed`). Rejected: using the scale utilities directly (B), which leaves the inset-to-gap pairing only in documentation.
7. **Gutter exceptions (Q7: A and B):** two kinds of surface may bleed past the page gutter. **Immersive full-screen layers** (the newsstand 3D scene, Ambient Reader, the fullscreen gallery, the Delish Shorts viewer) are their own canvas. **Horizontally scrolling carousels on phones** (featured stories, Delish Shorts) run the track to the screen edge, with the first card aligned to the gutter. Not allowed: edge-to-edge lead images on phones (C), which break the card shape the feed is built on.

## Verified facts

Established by reading the codebase, not by asking:

- `src/lib/tokens.css` defines the space scale listed under Terms (12 tokens, `--space-none` 0px through `--space-6xl` 80px), layout widths (`--layout-sm` 320px through `--layout-4xl` 1600px), gutters (`--layout-gutter-sm` 16, `md` 24, `lg` 32, `xl` 40, `2xl` 80) and max widths (`--layout-maxwidth-xl` 1360px, `--layout-maxwidth-2xl` 1440px). `src/app/globals.css` sets `--width-content-max: 1360px`.
- There are zero `var(--space-*)` references in `src/components`; components use about 5,000 Tailwind numeric spacing utilities. In `home-page.tsx` the most common are `p-4`, `p-5`, `gap-3`, `gap-2`, `gap-4`, `gap-6`, `p-8` and `p-3`. About 8 arbitrary pixel spacing values exist (`p-[..px]`, `gap-[..px]`, `px-[..px]`).
- The story river stacks cards with `space-y-4` (16px). River story cards use `p-4` on phones and `p-5` from `sm` up; newsstand brand panels use `p-6 md:p-8`; the newsstand title modal uses `p-6 md:p-10`.
- Page horizontal padding is hand-set per page (`px-4`, `px-5` and `px-6` are the most common in `home-page.tsx`); the newsstand hero uses a fluid `px-[6vw]`.
- Lint is plain ESLint (`eslint.config.mjs`, `npm run lint`) with no Tailwind plugin. The app uses Tailwind v4.
- `STYLE.md` requires using HDS foundations, including spacing, before introducing app-specific primitives, and keeps several touch-target minimums (44px controls, 24px compact mobile utility controls).

## Implementation notes

1. Expose the space scale to Tailwind v4: in the `@theme` layer, define named spacing keys from the HDS tokens (for example `--spacing-xs: var(--space-xs)`, `--spacing-md: var(--space-md)`) so `p-md`, `gap-sm` and friends work. Check that the new names do not collide with existing utilities or container sizes.
2. Add the inset tokens (`--inset-compact` 12px; `--inset-card` 16px, 20px from `sm`; `--inset-panel` 24px, 32px from `md`) and the gap tokens (`--gap-compact` 8, `--gap-card` 12, `--gap-feed` 16, `--gap-panel` 16, `--gap-section` 24), with matching `@theme` spacing keys so `p-inset-card`, `gap-card` and `space-y-feed` work.
3. Add a shared page container (or update the existing one) that applies the breakpoint gutters and the 1360px cap; move pages onto it, keeping the two bleed exceptions.
4. Add a lint rule (a small custom ESLint rule or a Tailwind-aware plugin) that flags arbitrary spacing values in `className`; fix the existing offenders, including the newsstand hero's `px-[6vw]`.
5. Move components to the inset and gap utilities as they are touched, starting with river cards, sidebar modules, panels and modals.
6. Update `STYLE.md` (the space scale, insets, gaps, gutters and bleed exceptions) and `DESIGN-SYSTEM-SPEC.md` if the semantic tokens belong to HDS rather than only to Hearst+; add a decision-log entry.

## Risks

- **Two vocabularies during migration:** numeric and named utilities will coexist for a long time; reviewers need the mapping (for example `p-4` equals `p-md`) at hand.
- **Name collisions in Tailwind v4:** named spacing keys such as `md` or `xl` must not shadow or confuse other theme scales (containers, breakpoints); verify the generated utilities.
- **Visible changes:** sidebar modules and rails moving to the 12px compact inset, and modals moving from 40px to 32px on desktop, will shift existing layouts and screenshots slightly.
- **Touch targets:** tighter compact insets must not shrink interactive boxes below `STYLE.md`'s 44px (or 24px compact mobile utility) minimums.
- **Tokens' home:** if these semantic tokens are meant for every HDS consumer, they belong in the HDS token source rather than the app layer; deciding that wrongly makes them hard to move later.

## Deferred

None. Every question was answered.

## Open threads

None. No discussion threads were opened during the session.
