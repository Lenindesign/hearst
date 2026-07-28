# Storybook Production-Fidelity Audit and Remediation

Date: 2026-07-26
Authority: current checkout and routed Hearst+ application components

## Outcome

The generated catalog now contains 139 entries: 122 executable stories and 17
documentation pages. Every visible story is under `Hearst Plus`, and all 122
stories pass the Chromium Storybook suite with accessibility failures configured
to fail the run.

The audit found that the previous catalog mixed production components with
Storybook-only product concepts. The most visible example, `Apps/Lifestyle
Destination`, rendered a separate mock ranking experience instead of the
`HomePageTemplate` used by `/hearst-lifestyle/`. The `FRE Components` file also
implemented production-looking modules inside the story file with stock images
and hard-coded styling.

## Remediation completed

| Previous catalog surface | Evidence | Action |
| --- | --- | --- |
| Lifestyle Destination | Story described itself as a “Storybook-first prototype”; production route uses `HomePageTemplate` in `src/app/hearst-lifestyle/page.tsx` | Rebuilt its stories around the production `HomePageTemplate`; retained the reviewed `apps-lifestyle-destination--weekend-discovery` URL |
| FRE Components | Most components were declared inside `FRE.stories.tsx`; only one imported a production module | Replaced the file with direct stories for app-used `BigStoryFeedStacked`, `BigStoryImageRight`, `FourAcrossGrid`, `BigStoryTextOnly`, and `SiteFooter` |
| Article Card | The Small story used the primitive’s showcase frame and synthetic author/category data | Switched to the production `FourAcrossGrid` compact composition and production river/feature compositions; removed controls that did not affect those APIs |
| Designer Principles | User requested that it be hidden | Moved to `src/storybook-candidates`; it is retained but not indexed |
| Article Page templates | No current application route imports the templates | Moved to `src/storybook-candidates` until route evidence exists |
| HDS HP Modules | Duplicated the feed wrapper without route-specific production data | Moved to `src/storybook-candidates` |
| Select | No application use site imports the primitive | Moved to `src/storybook-candidates` |
| Accordion, Pagination, Select taxonomy | Appeared outside the Hearst+ catalog hierarchy | Moved production-backed Accordion and Pagination under `Hearst Plus/HDS Primitives`; Select is not indexed |
| Story indexing | Temporary filename exclusions conflicted with automatic indexing guidance | Restored automatic globs; only `src/stories` is indexed and candidates live outside it |

## Current production-backed catalog

### Product and templates

- For You Feed and Feed use `HomePageTemplate`, the same component imported by
  `/hearst-plus/`, `/hearst-lifestyle/`, `/hearst-autos/`, `/hearst-flux/`, and
  `/hearst-ew/`.
- Lifestyle Destination uses `HomePageTemplate` with
  `initialBrandSlug="hearst-lifestyle"` and the checked-in destination fixture.
- Reader Overlays exercise the reader through `HomePageTemplate`, including
  focus entry and restoration.

### Components

- Navigation renders the production `MainNav`.
- Editorial Cards render `LifestyleRiverCard` and `RichPhotoGalleryCard`.
- Video Cards render `VideoFeedLeadCard`, `VideoIndexCard`, `VideoRailCard`, and
  `VerticalVideoCarousel`.
- Feed States render `LifestyleRiverLoadingState` and
  `ProgressiveFeedSentinelStatus`.
- Production Modules are restricted to FRE modules with application use sites.

### Foundations and primitives

- Colors, Typography, Tokens, Grid, and Icons read the checked-in token/theme or
  supported icon sources.
- Primitive stories render their source components directly. The visible
  catalog includes Accordion, Alert, Article Card compositions, Avatar, Badge,
  Button, Chip, Divider, Input, Link, Pagination, Switch, Textarea, and Toggle.
- Phosphor remains the documented official icon source through
  `src/components/ui/icons`.

## Verification evidence

- Generated catalog: 139 entries, 122 stories, 17 docs.
- Hidden-entry check: no Designer Principles, Article Page, HDS HP Modules, old
  FRE Components, or Select entries.
- Taxonomy check: no catalog title exists outside `Hearst Plus`.
- Storybook Chromium suite: 28 files and 122 stories passed.
- Static checks: ESLint, TypeScript, and whitespace validation passed.
- Production Storybook build passed.
- Visual regression: 11 cases passed with zero pixel drift after reviewed
  baseline creation.
- Responsive coverage includes 320px compact modules and river cards, 390px
  Lifestyle home and article card, 768px feature module, and 1280px Lifestyle
  home.
- Exact reviewed URL
  `apps-lifestyle-destination--weekend-discovery` renders the production
  Lifestyle shell, contains the production navigation, omits the former
  prototype heading, and emits no browser errors.

## Remaining evidence boundaries

- Storybook uses checked-in editorial fixtures because static Storybook cannot
  execute Next.js route handlers. Server-fetched ordering and failures remain
  integration-test concerns for the routed app.
- `src/storybook-candidates` retains the Article Page templates, HDS HP wrapper,
  Select primitive, and Designer Principles page. None should return to the
  catalog until it has a current application use site or explicit approved
  specification ownership.
- The audit verifies the current local production source and running app. It
  does not claim pixel parity with an external deployed Hearst property that was
  not available in this checkout.
