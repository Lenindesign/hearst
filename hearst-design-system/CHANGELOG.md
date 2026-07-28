# Changelog

All notable design-system changes are recorded here. Entries should describe
reader and consumer impact, not only implementation details.

This project follows the change classifications in `CONTRIBUTING.md`. Until a
formal package release is established, changes remain under **Unreleased** and
must not be described as production-ready solely because Storybook builds.

## Unreleased

### Added

- A single `npm run quality` gate for token integrity, unit tests, Storybook
  interaction and accessibility tests, carousel keyboard checks, and local
  visual-regression baselines.
- Storybook coverage for saved-list empty state, search empty state, and feed
  loading, terminal, and retryable-error states.
- Direct production-backed Storybook coverage for the HOT ROD event hub, Power
  Tour detail, Drag Week detail, and their mobile states.
- A published-Storybook provenance artifact and bounded release verifier that
  compare the deployed revision and catalog counts with the reviewed build.
- Contributor, ownership, release-classification, and deprecation guidance.

### Changed

- Storybook indexes every MDX and story file under `src/stories`.
- Storybook-safe public environment guards prevent Node-only `process` access
  from breaking browser stories.
- Onboarding journey documentation stacks at narrow widths.
- Publication section navigation exposes named landmarks and motion-safe
  overflow cues while preserving native horizontal scrolling.
- Featured Story Carousel documentation now records its production ownership,
  token contract, direct Storybook evidence, and deterministic-fixture boundary.
- Token validation now fails for key drift and known naming regressions.
- Rendering components now consume semantic tokens or scoped theme variables;
  cinematic article, Ambient Reader campaign, HOT ROD event, destination, and
  publication palettes each have one explicit configuration owner.

### Fixed

- Reader overlays restore focus to the visible opener after closing.
- Historical token spelling errors and Car and Driver palette key drift.
- All 689 component-level hard-coded-color, raw-color-function, and
  non-semantic-Tailwind baseline findings; the token audit now reports zero
  known violations and zero regressions.
- Duplicate Typography story keys and asynchronous Search story warnings.
- HOT ROD event hero images use the current eager preload contract in both the
  routed application and direct Storybook specifications.

### Deprecated

- None.

### Removed

- None.

## Release checklist

For each release:

1. Move relevant Unreleased entries into a dated version heading.
2. Confirm version impact from public API and canonical token changes.
3. Run `npm run quality` and `npm run build`.
4. Attach Storybook and responsive evidence to the release review.
5. Publish only after the accountable reviewers in `CONTRIBUTING.md` approve.
6. Verify the published artifact and its exact source revision before marking
   the release complete.
