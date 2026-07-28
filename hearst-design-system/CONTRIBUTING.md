# Contributing to the Hearst Design System

This repository contains both a reusable design system and the Hearst+ reader
prototype. A change is ready for review only when its code, Storybook
specification, and automated evidence agree.

## Ownership and required review

Every pull request must identify the affected surface and request the matching
review role. Repository administrators should map these roles to real GitHub
users or teams in `CODEOWNERS`; this document deliberately does not invent
handles.

| Area | Accountable review |
| --- | --- |
| Canonical tokens and publication themes | Design-system design and design-system engineering |
| Shared components and public exports | Design-system engineering |
| Hearst+ journeys, reader behavior, and editorial fixtures | Hearst+ product design and Hearst+ engineering |
| Accessibility behavior or exceptions | Accessibility review |
| Storybook configuration and quality gates | Design-system engineering |

## Change workflow

1. Read `PRODUCT.md`, `DESIGN.md`, `STYLE.md`, `BRAND_STYLES.md`, and the
   relevant rules in `APP_RULES.md`.
2. Change the smallest reusable component or token that owns the behavior.
3. Add or update Storybook stories in the same pull request.
4. Run `npm run quality` and `npm run build`.
5. In the pull request, list tested viewports and any remaining evidence gaps.

Generated files are outputs, not editing surfaces. When canonical files under
`tokens/` change, run `npm run build-tokens`; do not hand-edit
`src/lib/brands.ts` or `src/lib/tokens.css`.

`npm run quality` also runs a no-regression token audit. The checked-in
`reports/token-audit-baseline.json` retains the original 689 findings as a
historical regression ledger; the current component audit resolves all 689 and
reports zero known violations. New or reintroduced hard-coded styling fails
the gate. Do not refresh the baseline to excuse new violations. Run
`npm run audit:json` for current line-level evidence.

Scoped art direction is configuration, not a reason to embed raw colors in a
rendering component. Keep publication values in canonical brand tokens,
destination compositions in `src/lib/theme-options.ts`, cinematic editorial
palettes in `src/lib/article-editorial-themes.ts`, campaign palettes in
`src/lib/ambient-interstitial-themes.ts`, reader surfaces in
`src/lib/ambient-reader-theme.ts` and `src/lib/content-reader-theme.ts`, and named route exceptions in their
own domain configuration. Components consume these through semantic roles or
scoped CSS variables.

## Story acceptance criteria

A reusable interactive component must document all applicable states:

- default, hover, focus-visible, active or selected;
- disabled and permission-restricted;
- loading, empty, error, retry, and success;
- destructive confirmation and recovery where data can be removed;
- light and dark modes when supported;
- 320px, 390px, tablet, and desktop behavior.

Each important interaction should have a Storybook `play` assertion. Dialogs,
menus, drawers, and reader overlays must assert initial focus, keyboard escape,
focus trapping where applicable, and focus restoration. New stories are
automatically indexed from `src/stories/**/*.stories.tsx` and
`src/stories/**/*.mdx`; do not add hand-maintained allowlists.
The quality gate loads every indexed documentation page at 390px and desktop,
rejecting render errors, browser errors, missing page headings, and horizontal
page overflow.

Only production-backed components, compositions, states, and foundation
documentation belong in `src/stories`. A product story must import the same
component or composition used by the application, name the production source
or route in its description, and avoid story-local replicas. Keep unverified
or exploratory work in `src/storybook-candidates` until production evidence
exists; that directory is intentionally not indexed.

Stable visual changes must update the repository baselines with
`npm run test:visual:update`. Review the resulting PNG changes as part of the
pull request; do not update a baseline merely to make CI green.

## Accessibility and responsive evidence

- Use semantic names and roles that remain useful without visible context.
- Preserve a visible focus indicator and a minimum 44 by 44 CSS-pixel target
  for primary touch controls.
- Respect reduced-motion preferences and do not use motion as the only state
  cue.
- Test at 200% browser zoom and at 320px and 390px without horizontal page
  scrolling.
- Treat automated accessibility checks as a floor; keyboard and screen-reader
  review is still required for changed journeys.

## Public API changes

Public components and helpers are exported from `src/components/hearst-plus`.
Prefer additive, typed props with documented defaults. Do not expose fixture
shape or page-specific state when a semantic component contract will work.

Classify each public change in the pull request:

- **Patch:** compatible bug fix, documentation, or token correction.
- **Minor:** backward-compatible component, prop, token, or variant.
- **Major:** removed or renamed export, prop, behavior, or token.

## Deprecation policy

Do not remove a public component, prop, story ID, or canonical token in the
same release that deprecates it.

1. Mark the API deprecated in its TypeScript documentation and Storybook docs.
2. Provide the replacement and a copyable migration example.
3. Add the change to `CHANGELOG.md`.
4. Keep the compatibility path for at least one minor release and 30 days,
   unless security or data integrity requires an emergency removal.
5. Announce the removal release in advance, then delete the compatibility path
   only in a major release.

## Pull-request evidence

Include:

- the issue and user impact;
- affected components, tokens, routes, and brands;
- Storybook links or numbered screenshots;
- keyboard and viewport checks performed;
- quality/build command results;
- migration and rollback notes for public API changes.
