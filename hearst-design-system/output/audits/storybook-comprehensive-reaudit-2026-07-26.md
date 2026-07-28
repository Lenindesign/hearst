# Hearst+ Storybook Comprehensive Re-audit

Date: 2026-07-27
Scope: current checkout, running Storybook, and the local routed Hearst+ app
Authority: production React compositions and canonical token sources in this checkout

## Audit status: closed

Closed on 2026-07-27 at the last fully verified local checkpoint. The accepted
checkout evidence is 113 passing unit tests, 271 passing Storybook
interaction/accessibility checks, a 47-of-47 read-only visual queue, a current
100-component generated index, and the token gate at 630 known violations, 59
resolved violations, and zero regressions. The audit does not include the later
experimental desktop target-size changes because that work was not taken
through the complete verification matrix and was removed during closeout.

Three follow-ups remain explicit rather than being presented as completed:

- Compact desktop navigation and carousel controls remain below the project's
  44px primary-touch-control standard; their production geometry requires a
  separate product decision and verified remediation pass.
- Manual screen-reader, forced-colors, and broader cross-brand assistive
  technology review remain outside the automated evidence.
- The published Storybook remains stale and lacks `/storybook/build-info.json`;
  publication requires separate deployment authorization.

No commit, push, deployment, Figma change, or broad visual-baseline refresh is
part of this audit closeout.

## 1. Executive summary

The Storybook is now a credible production-backed catalog rather than a parallel
prototype gallery. Its product stories import the same `HomePageTemplate`,
navigation, reader, card, video, feed-state, FRE, and primitive components used
by the routed application. The generated catalog contains 289 entries: 271
stories and 18 documentation pages across 76 groups. The generated production
registry contains 100 component modules; Storybook-only tooling and five
unowned candidate families are explicitly outside that count and catalog.

No P0 defect remains in the verified checkout. The current automated evidence
includes 113 passing unit tests, 271 Storybook interaction/accessibility
checks, 47 visual cases, two carousel accessibility viewports, 36 responsive
documentation checks, and a comprehensive 1,076-check Storybook render/overflow
matrix covering every story at 320, 390, 768, and 1280 pixels. The latest
Storybook run passes all 271 checks. The final read-only 47-case visual queue
passes every case; each changed baseline was reviewed and updated individually
against the routed production component and current deterministic fixture.
The Next.js production build completes all 1,050 static pages.

Reader Account presentation is now a directly reviewable production boundary
without turning its provider infrastructure into invented UI. Ten stories use
the exact shipped avatar, authentication dialog, and profile dialog to specify
local sign-in and profile creation, selected preferences, saved-library and
collection cleanup, comments, empty states, account deletion, and retryable
Google-sync failure. Live routed checks at 390px exposed undersized auth
controls and destructive confirmation that dropped keyboard focus to the page;
the shared production components now retain focus and provide 44px controls.
The catalog also preserves the product's explicit prototype boundary: local
profiles remain browser-local, verified Google sync remains configuration
dependent, and no production-complete authentication or consent claim is made.

The generated registry now distinguishes direct visual stories, integrated
production specifications, and non-visual infrastructure instead of treating
every production module without a direct import as the same missing-story
problem. The first integrated classification is the
`ContentReaderDialogShell`: its five existing Reader Overlay stories exercise
the exact routed composition, while an isolated empty shell would remove the
masthead, article, focus, nested-layer, and failure behavior the API exists to
coordinate. Explicit metadata must name current story files and explain the
classification; the freshness gate rejects missing or stale evidence.

The production onboarding journey is now another shared boundary rather than a
parallel Storybook mock. The routed app and four direct stories import the same
component, use the real one-or-two-interest and optional-brand rules, expose
the complete 29-publication inventory without truncated names, and retain the
production completion/account handoff. Its desktop and 320px contracts lock
focus, Escape and focus restoration, disabled and selected states, live
preview, 44px targets, and horizontal-overflow behavior. The rewritten journey
documentation embeds those executable states instead of inventing screens or
requirements.

The stakeholder personalization console is also now a shared production
boundary instead of private page markup. The routed `?demo=1` surface and three
direct Storybook stories render the same component. Production supplies its
live ranking score, inventory, eligibility, visit context, and route-specific
guides. Destination configuration, onboarding preference application, daypart
missions, return-visit scoring, next-edition novelty, explanations, and
diversity ranking now live in
`src/lib/hearst-personalization-model.ts`; both the routed app and Storybook
import that exact model. Storybook supplies only deterministic editorial
inventory for ranked, no-eligible-story, and 320px review. Seven focused unit
tests lock routing, contextual filters, onboarding signals, first-visit
editorial lead, return freshness, next-day novelty, and diversity. The
extraction fixed two verified
production accessibility defects: opening now focuses the modal Close control
instead of leaving focus behind the dialog, and that control is now 44 by 44
pixels instead of 28 by 28. Focus is trapped, the underlying page is isolated,
Escape dismisses, and the exact opener regains focus.

The Videos destination now also consumes a shared pure production model instead
of keeping eligibility, source-filter reconciliation, Delish Shorts promotion,
progressive-feed merging, lead selection, recommended-queue construction, and
trending selection inside `home-page.tsx`. The routed component, generic
vertical-video carousel, and integrated Storybook Videos Feed all use that
model. Storybook now includes one deterministic exact-9:16 Delish fixture, so
the production promotion and no-duplication path is executable instead of only
documented. Nine focused model tests cover classification, stale filters,
portrait eligibility, deduplication, placement, pagination merging, scoped
availability, queue construction, and the one-video fallback.

The system is not finished. The first production boundary extraction moved the
four video-card components and shared story metadata out of the main
composition while preserving its public API and producing zero visual drift.
The next production boundaries separate reader action metadata, save/comment
actions, premium-reader readiness, deterministic reader queue selection, and
the five-state reader article body. The production reader navigation contract
now separately specifies canonical URLs, safe return routes, session snapshots,
story-order continuity, and origin-brand resolution.
The fullscreen image viewer is also a separate production component with
direct gallery, keyboard/caption, and single-image specifications. Its phone
controls now meet the 44px touch-target baseline while desktop retains the
compact production density.
The production Brand Spotlight is now an exported renderer backed by a
separate deterministic selector. Five direct Storybook stories specify the
editorial module, canonical publication navigation, 320px reflow, and
200% narrow-container reflow, plus intentional omission when fewer than three
eligible stories exist. Production
and Storybook no longer expose ranking diagnostics, imply a nonexistent Follow
action, or announce each story with duplicated visible metadata.
The production Ambient Reader now has a dedicated production module, a public
component contract, and three direct Storybook specifications for the
publication article, keyboard/theme/density/focus behavior, and sponsored
interstitial. The production and
Storybook Esquire article match at 390px in layout, typography, content, and
source imagery; the remaining visible image delta is the routed app's Next.js
image optimization rather than a parallel Storybook implementation. All five
phone header controls are 44px, and dismissal restores focus to the opener.
Five queue tests now specify publication scope, destination overrides,
out-of-window opened stories, de-duplication, and unavailable-story behavior.
Six navigation tests cover safe URL construction, snapshot validity, expiry,
route matching, story order, and brand resolution. The production discovery
sidebar now has its own public boundary and five direct specifications for
destination, publication inventory, selection and clear, Autos make filters,
and Videos source-order states. That comparison also exposed and corrected a
Storybook-wide publication-theme drift: Storybook now inherits destination
foundation tokens before applying publication semantic and component
overrides, matching the routed application. The article and video trending
rails now share a second public production boundary with direct cross-brand,
publication-scoped, dark-video, interaction, and omitted-empty specifications.
The production rail cards and Storybook stories match at 1280px, while the
responsive catalog also exercises them at 320px, 390px, and 768px. Even after
those extractions, the production Today’s Edit strip now has a third public
boundary and seven direct specifications covering complete, first-visit,
minimal, tablet-keyboard, mobile-omitted, interaction, and incomplete-allocation
states. Its production and Storybook geometry match exactly at 1280px.
The production Featured Carousel is now a fourth public boundary with seven
direct specifications covering the five-story mixed edition, active-slide
semantics, actions, phone controls, publication treatment, a one-story fallback,
and an empty allocation. At 768px, the routed app retains its exact
720×598.875px geometry after extraction. The extraction also removed meaningless
carousel controls for a one-story allocation and prevented empty allocations
from recording edition impressions.
The production Story Actions group is now a fifth public boundary with six
direct specifications for available actions, announcements, saved selection,
current-feed status, phone layout, and post-hide focus continuity. The
extraction corrected three production accessibility gaps: comments now have a
descriptive accessible name, Hide remains available on phones, and removing a
story transfers focus to the adjacent story instead of the document body.
The route-preserving Delish Shorts viewer is now a sixth public boundary with
five direct specifications for its open state, keyboard and action flow, phone
controls, one-short boundary, and dismissal/focus restoration. The production
viewer retains the native vertical scroll-snap reel, adjacent-video preload,
autoplay rules, and Read story handoff. The extraction corrected four verified
accessibility defects: the background is now inert and hidden from assistive
technology, the phone Read story action is 44px tall, the focus loop excludes
hidden and inactive controls, and active-short changes have a descriptive
polite announcement. Reduced-motion navigation now uses instant scrolling.
The production reader context rail is now a public boundary with three direct
Storybook specifications for ranked unique context groups, its reader-intent
fallback, and intentional omission below the desktop breakpoint. The extraction
also corrected two production defects: a story can no longer repeat across the
intent, publication, and topic modules, and context actions now expose concise
accessible names. As the reader advances through its article queue, the rail
now derives recommendations from the active article instead of permanently
using the initially opened story.
The standard-reader advertisement is now a public production boundary with four
direct Storybook specifications and three focused model tests. The current
checkout no longer presents a dead campaign button: verified destinations render
as 44px links, while prototype creative without a destination is explicitly
non-interactive. Selection now remains inside the active article destination,
advertisement landmarks name the sponsor and campaign, duplicate image
announcements are removed, empty inventory omits the surface, and the production
desktop-only responsive contract is explicit.
The contextual river advertisement is now another public production boundary
with four direct Storybook specifications. The routed feed and Storybook import
the same component and preserve the production card geometry at desktop and
320px. Internal slot numbers, intent scores, targeting topics, and matching
explanations no longer leak into the ordinary reader experience; the campaign
image is decorative when its sponsor and title are already visible; the
accessible article name includes sponsor and campaign; and an unverified
campaign now renders an explicit non-interactive prototype state instead of a
dead button. Verified campaign destinations retain a 44px action target.
The integrated production Content Reader now has five orchestration
specifications instead of two ambiguous examples. Publication-origin stories
inherit the selected publication logo, theme, queue, and homepage link;
destination-origin stories retain destination identity. Dedicated nested
gallery and Ambient Reader stories verify that the underlying reader becomes
inert and hidden from assistive technology, the nested close control receives
focus, and dismissal returns focus to the exact opener. The same production
checks exposed and corrected a missing gallery focus return and a 28px phone
reader-close target; production and Storybook now both use a 44px phone target
while preserving the compact 28px desktop control.
The story-presentation contract is now a seventh public production boundary.
One pure resolver owns Article, Gallery, Watch, Recipe, Specs, Shop, and Guide
classification plus reviewed image-crop rules; the river, reader, filters,
stakeholder counts, and Storybook consume that same result. A direct seven-case
matrix uses current checked-in editorial fixtures and the shipped production
metadata modules. Seven unit specifications lock precedence and crop behavior,
and fresh Playwright checks at 390px and 1280px report zero WCAG A/AA
violations and zero horizontal overflow.
The Content Reader now also consumes a pure production-owned model for article
readiness, deterministic comment totals and seed content, contextual grouping,
and recommendation ranking. Five focused unit specifications lock those rules,
and the integrated publication-reader story asserts the resulting comments and
related-content regions. A fresh axe run exposed two real production contrast
defects in the warm reader status line and fallback author avatar; both were
corrected with semantic production colors, and the reader now reports zero
automated violations at desktop and the configured 414px mobile viewport.
The related-content rendering boundary is now also public and production-owned
instead of remaining private in `home-page.tsx`. Two direct specifications cover
the ranked four-story module and the intentional no-eligible-story omission.
The extraction preserves the routed reader structure and brand styling while
replacing verbose concatenated button names with concise “Open related story”
names and retaining at least 44px rows on phones. The production reader and
direct Storybook story show the same responsive component at 1280px, and the
Storybook phone contract passes at 320px.
Its responsive masthead is now a separate production component for publication
identity, loaded-story status, cross-publication navigation, section filters,
and the Close target. The integrated reader specifications stayed green after
the move, and a fresh desktop capture shows no visual drift.
Four direct masthead specifications now exercise publication identity,
Fashion & Luxury destination identity, an announced sibling-publication
loading state, and phone dismissal using the exact production component,
canonical route labels, generated production fixtures, and the official
Phosphor spinner. Live review exposed a dark-theme token defect that rendered
selected masthead and filter labels black on the dark shell; the shared dark
semantic accent now resolves to `#BDDDFC`. The fixed component is overflow-free
at 320, 390, and 414 pixels, and its phone Close target measures 44×44px.
The production comparison also exposed a semantic and specification drift:
publication-origin readers announced sibling publications as “Other Hearst
sections,” while the direct publication story locked its fixture to Delish and
therefore ignored the Brand toolbar. Production now names that navigation from
the current destination (for example, “Fashion & Luxury publications”);
destination-origin readers use “Hearst destinations.” The direct story follows
the toolbar, derives its initial filter from the production story category,
and fills the themed canvas instead of ending after a 280px specimen wrapper.
The full visual gate then exposed a stale mobile assertion that required the
desktop-only publication carousel at 390px. The integrated specification now
asserts that scope navigation is visible at desktop and intentionally absent
below the production `lg` breakpoint; all 47 reviewed visual cases pass.
The reader dialog interaction shell is now a separate production component
rather than an effect embedded in the page composition. It owns initial Close
focus, forward and reverse focus wrapping, Escape and backdrop dismissal,
modal isolation, and delayed focus restoration across the `/read/` route. The
production route now restores the exact in-memory opener first and retains the
stored accessible-label fallback for remounted routes. The shell ignores
keyboard events whenever it is inert, `aria-hidden`, or covered by the
fullscreen gallery or Ambient Reader, preventing parent and child dialogs from
competing for focus or Escape. Current production-browser evidence confirms
that closing the reader restores focus to the exact story opener and that one
Escape closes the nested gallery, keeps the reader open, and returns focus to
the image opener.
The extraction also corrected two production accessibility defects without
changing the visible control: tablet arrows now expose 44px hit targets, and
keyboard focus transfers to the reverse control when the activated arrow
disappears at the end. A new visual baseline also exposed and corrected a
House Beautiful/Road & Track headline-clamp leak that revealed part of a hidden
fourth line. The onboarding, stakeholder-console, personalization-model, and
video-destination-model extractions reduced `home-page.tsx` to a 6,840-line,
291,172-byte file. The shared Storybook home-page chunk is 783.49 kB
because the current story graph still imports the full composition and the
additional reader specifications. The final token gate records 630 known
violations with zero regressions and 59 resolved findings after centralizing
the shared image-scrim colors used by the production carousel and replacing the
extracted viewer's literal dark surface with the canonical darkest-neutral
token. Governance is written down, but no
real GitHub `CODEOWNERS` mapping or formal package-release mechanism exists.
Responsive overflow automation is now comprehensive at the four required
widths; manual screen-reader, 200% zoom, forced-colors, broad keyboard, and
cross-brand visual review remain necessary.

## 2. What the system currently contains

- 216 executable stories and 18 documentation pages.
- Product compositions for the unified For You feed, Videos feed, Lifestyle
  destination, saved-list empty state, and responsive feed templates.
- Navigation, editorial card, video card, reader overlay, feed-state, and
  production FRE module stories.
- Direct production reader-action specifications for default, saved,
  premium-ready, premium-loading, and premium-unavailable states.
- Direct production reader-body specifications for video, loading, ready
  structured blocks, error, and deterministic fixture fallback states.
- Direct production fullscreen-image specifications for gallery, keyboard and
  caption behavior, single-image controls, focus, dismissal, zoom, and swipe.
- Five integrated production Content Reader specifications for publication
  and destination origin, nested gallery isolation, Ambient Reader handoff,
  article-load failure, exact opener focus restoration, and phone targets.
- Four direct production reader-masthead specifications for publication and
  destination identity, canonical links, loading announcements, dark-theme
  selection, filters, carousel state, and 44px phone dismissal.
- Direct production Ambient Reader specifications for publication content,
  keyboard navigation, theme and density preferences, focus restoration,
  44px phone controls, and sponsored-interstitial dismissal.
- Direct production discovery-sidebar specifications for Daily Habit,
  publication inventory, selection and clear, Autos make filtering, followed
  topics, collections, and Videos source-order states.
- Three direct production reader-context-rail specifications for unique
  intent/publication/topic allocation, active-article context, concise action
  names, the reader-intent fallback, and intentional omission below desktop.
- Four direct production reader-advertisement specifications for scoped
  prototype creative, a verified campaign destination, 44px link target,
  specific disclosure semantics, intentional omission below desktop, and no
  eligible inventory.
- Four direct production river-advertisement specifications for inline
  disclosure, specific sponsor-and-campaign semantics, verified and unavailable
  campaign destinations, hidden targeting diagnostics, 44px action targets,
  phone reflow, and no eligible inventory.
- Direct production trending-rail specifications for cross-brand articles,
  publication-scoped articles, the Videos dark-mode rail, keyboard and pointer
  activation, ranked list semantics, and omitted empty allocation.
- Direct production Today’s Edit specifications for four-card, first-visit,
  two-card, tablet-carousel, mobile-omitted, interaction, and incomplete-core
  allocation states.
- Direct production Featured Carousel specifications for the five-story mixed
  Today’s Picks edition, actions and active-slide semantics, phone targets,
  publication treatment, one-story fallback, and empty allocation.
- Direct production Story Actions specifications for save, recommendation,
  comments, Hide, current-feed status, live announcements, responsive targets,
  and adjacent-card focus after removal.
- Direct production Delish Shorts viewer specifications for the open viewer,
  scroll-snap and keyboard selection, save/mute/playback actions, Read story,
  44px phone controls, one-short boundaries, modal isolation, reduced motion,
  live state announcements, and focus restoration.
- Four direct production onboarding specifications for interest selection,
  the two-interest limit, live preview, optional trusted publications, the
  complete 29-publication inventory, completion and account handoff, initial
  focus, Escape/reset/focus restoration, 44px targets, and 320px reflow.
- A production-owned story-presentation resolver and UI module with seven
  direct specimens for Article, Gallery, Watch, Recipe, Specs, Shop, and Guide,
  including reviewed crop rules and supplemental metadata.
- A public reader-queue model with deterministic publication, destination,
  opened-story, and de-duplication behavior.
- Primitive stories for Accordion, Alert, Article Card, Avatar, Badge, Button,
  Chip, Divider, Input, Link, Pagination, Special Offers, Switch, Textarea, and
  Toggle.
- A production-backed Button specification with six action variants, compact
  and 44px touch sizes, loading/disabled/invalid/expanded states, named icon
  buttons, keyboard activation, and default/hover/active evidence for four
  representative publication themes.
- Foundation documentation for grid, color, typography, Phosphor icons,
  spacing, radius, elevation, token mapping, Tailwind/shadcn usage, token
  naming, and token workflow.
- 29 generated publication themes. Token validation reports 607 overrides for
  each theme except FRE, which has 593.
- A canonical token build, publication validation, unit tests, Storybook
  browser tests, carousel accessibility checks, visual regression, responsive
  documentation checks, an all-story responsive render/overflow matrix, and a
  production build.

## 3. Strengths worth preserving

1. **Production components are the catalog source.** Product and template
   stories render `HomePageTemplate`; navigation, reader, cards, feed states,
   and production modules import their shipped implementations.
2. **Exploratory work is separated.** The unverified Designer Principles page
   has been removed; Article Page templates, the old HDS homepage wrapper,
   Alert, Select, Switch, Textarea, and Toggle remain outside the indexed
   catalog in `src/storybook-candidates`. Storybook-only inspection tooling
   lives under `src/stories/support`, not production components.
3. **Story inventory is automatic.** Storybook indexes `src/stories` instead of
   maintaining a fragile allowlist.
4. **State coverage has materially improved.** Loading, terminal empty,
   retryable error, saved-empty, article-content error, disabled, selected, and
   destructive primitive examples are present.
5. **Brand foundations are real.** Typography uses the official brand logo and
   publication tokens, and icons are routed through the documented Phosphor
   wrapper.
6. **Regression evidence is executable.** Accessibility failures fail the
   Storybook browser suite; visual tests reject orphan baselines and horizontal
   overflow; documentation is checked at 390px and 1280px; all 237 stories are
   checked at 320px, 390px, 768px, and 1280px.
7. **Contribution rules are concrete.** `CONTRIBUTING.md` defines production
   evidence, state expectations, responsive and accessibility checks, public
   API classification, and deprecation timing.
8. **Stakeholder diagnostics have an explicit boundary.** The personalization
   console remains absent from ordinary reader routes, receives live evidence
   only from routed production, and is now directly reviewable in Storybook
   without importing the entire page composition or recreating its markup.

## 4. Prioritized findings

### P0

None in the current verified checkout.

### P1

#### P1.1 — The central production composition is still a monolith

Evidence:

- `src/components/home-page.tsx`: 6,840 lines and 291,172 bytes after the
  video-card, reader-action, reader-queue, reader-article-body, and
  reader-navigation, fullscreen-image-viewer, Ambient Reader, story-
  presentation, content-reader-model, content-reader-dialog-shell, and
  content-reader-masthead, content-reader-comments,
  content-reader-recommendations, content-reader-context-rail, and
  content-reader-advertisement, contextual-river-advertisement, Brand
  Spotlight renderer and selector, onboarding, and stakeholder personalization
  console plus destination-configuration, personalization-model, and
  video-destination-model extractions.
- `src/lib/hearst-video-destination-model.ts`: a 103-line, 3,369-byte pure
  production contract for playable-card eligibility, active source filters,
  exact portrait detection, Delish Shorts inventory and placement,
  progressive-feed merging, scoped availability, and lead/recommended/trending
  queue construction.
- `src/lib/hearst-video-destination-model.test.ts`: nine focused specifications
  for the same rules, including explicit gallery precedence, stale filters,
  exact 9:16 eligibility, source-order deduplication, no-Delish omission,
  progressive-page merging, scoped empty state, promoted-item removal, and the
  one-video fallback.
- `src/stories/hearst-plus-story-data.ts`: deterministic Storybook video data
  now includes one exact-9:16 Delish fixture; the integrated production story
  therefore executes the Shorts promotion boundary instead of approximating
  it with prose.
- `src/lib/hearst-personalization-model.ts`: an 818-line, 26,766-byte pure
  production contract for destination configuration, contextual publication
  navigation, onboarding signals, daypart scoring, return and next-edition
  behavior, explanations, diversity ranking, and simulated next-day inventory.
  The routed application and direct Storybook console import this same module.
- `src/lib/hearst-personalization-model.test.ts`: seven focused specifications
  for route resolution, inventory-derived navigation, onboarding signals,
  first-morning editorial lead, return freshness, next-day novelty, and
  brand/topic diversity.
- `src/components/hearst-plus/stakeholder-personalization-console.tsx`: a
  639-line public production renderer for the stakeholder-only ranking controls,
  live evidence, no-eligible-story state, modal isolation, focus behavior, and
  phone reflow. Production supplies the live ranking model and route-specific
  guide stack; Storybook mounts this exact renderer with deterministic
  production-shaped evidence.
- `src/stories/HearstPlusStakeholderPersonalizationConsole.stories.tsx`: three
  direct specifications for the ranked, no-eligible-story, and 320px states.
- `src/components/hearst-plus/onboarding-modal.tsx`: a 649-line public
  production boundary for interest and publication selection, live preview,
  completion, keyboard and modal behavior, focus restoration, responsive
  layout, and the account-handoff result.
- `src/stories/HearstPlusOnboarding.stories.tsx`: four direct specifications
  that exercise the exact production component at its interests, trusted
  publications, completion, and 320px states.
- `src/components/hearst-plus/content-reader-dialog-shell.tsx`: a 219-line
  public production boundary for modal isolation, initial focus, forward and
  reverse focus wrapping, top-layer Escape handling, backdrop dismissal, and
  exact opener restoration with a route-remount fallback.
- `src/components/hearst-plus/content-reader-masthead.tsx`: a 163-line public
  production boundary for reader identity, queue status, section/publication
  navigation, filters, announced loading feedback, and responsive dismissal.
- `src/stories/HearstPlusContentReaderMasthead.stories.tsx`: four direct
  production specifications for publication, destination, loading, dark-theme,
  and phone behavior, derived from canonical routes and generated fixtures.
- `src/components/hearst-plus/content-reader-model.ts`: the pure production
  contract for source readiness, deterministic comments, contextual groups,
  and related-story ranking.
- `src/components/hearst-plus/content-reader-comments.tsx`: a 161-line public
  production boundary for deterministic seeded discussion, session comments,
  blank-post prevention, newest-first ordering, composer reset, accessible
  field guidance, labelled comment actions, and 44px phone controls.
- `src/stories/HearstPlusReaderComments.stories.tsx`: two direct production
  specifications for the default composer/posting contract and a persisted
  reader comment. The story documents that the production model always supplies
  seeded discussion, so an empty visual state does not exist.
- `src/components/hearst-plus/content-reader-recommendations.tsx`: a 106-line
  public production boundary for ranked related stories, same-reader
  navigation, concise accessible names, responsive targets, and intentional
  omission without an eligible result.
- `src/stories/HearstPlusReaderRecommendations.stories.tsx`: two direct
  production specifications for the ranked four-story module and the
  no-eligible-story fallback using the generated production-aligned inventory.
- `src/components/hearst-plus/content-reader-context-rail.tsx`: a 118-line
  public production boundary for desktop-only contextual navigation, unique
  intent/publication/topic allocation, concise accessible names, and the
  reader-intent fallback.
- `src/stories/HearstPlusReaderContextRail.stories.tsx`: three direct
  production specifications for ranked unique groups, fallback-only content,
  and intentional omission below desktop.
- `src/components/hearst-plus/content-reader-advertisement.tsx`: a 184-line
  public production boundary for destination-scoped selection, specific
  advertisement disclosure, verified campaign links, unavailable prototype
  CTA treatment, no-ad behavior, and intentional omission below desktop.
- `src/components/hearst-plus/contextual-river-advertisement.tsx`: a 110-line,
  4,050-byte public production boundary for inline disclosure, specific
  sponsor-and-campaign semantics, decorative repeated imagery, verified
  campaign links, unavailable prototype treatment, and phone reflow without
  reader-facing targeting diagnostics.
- `src/stories/HearstPlusRiverAdvertisement.stories.tsx`: four direct
  production specifications for prototype, verified-destination, responsive
  phone, and no-eligible-advertisement states.
- `src/stories/HearstPlusReaderAdvertisement.stories.tsx`: four direct
  production specifications for prototype, verified campaign, responsive
  omission, and no-eligible-advertisement states.
- `src/lib/content-reader-advertisement.test.ts`: three focused specifications
  for destination scoping, topic/tag ranking with deterministic rotation, and
  empty destination inventory.
- `src/lib/content-reader-model.test.ts`: five focused specifications for the
  reader-content contract.
- `src/stories/HearstPlusReaderOverlays.stories.tsx`: five integrated
  production-reader specifications; the publication story also verifies the
  shell-owned focus loop, Escape and return-focus contract plus model-owned
  comment and recommendation output. Nested gallery and Ambient Reader stories
  verify that child dismissal leaves the production reader open and focused.
- `src/components/hearst-plus/story-presentation-model.ts`: the pure production
  classification and image-crop contract shared by the river, reader, filters,
  stakeholder counts, tests, and Storybook.
- `src/components/hearst-plus/story-presentation.tsx`: the production image and
  supplemental recipe, vehicle-specification, shopping, and guide modules.
- `src/lib/story-presentation.test.ts`: seven focused specifications for
  classification precedence, product labels, and reviewed crop stability.
- `src/stories/HearstPlusStoryPresentation.stories.tsx`: one direct seven-case
  production matrix; fresh 390px and 1280px checks pass WCAG A/AA and overflow.
- `src/components/hearst-plus/video-cards.tsx`: a 376-line production boundary
  for `VideoPlaySurface`, `VideoFeedLeadCard`, `VideoIndexCard`, and
  `VideoRailCard`.
- `src/components/hearst-plus/story-metadata.tsx`: shared byline, brand-source,
  recommendation, and live-story metadata.
- `src/components/hearst-plus/reader-action-bar.tsx`: a public production
  boundary for author/date metadata, save state, comments, and premium-reader
  readiness.
- `src/components/hearst-plus/reader-queue.ts`: a public production boundary
  for publication scope, destination overrides, opened-story rotation, and
  de-duplication.
- `src/components/hearst-plus/reader-article-body.tsx`: a public production
  boundary for video summaries, loading, structured live blocks, load errors,
  image-viewer requests, and deterministic fallback copy.
- `src/stories/HearstPlusReaderBody.stories.tsx`: five direct, brand-aware
  specifications for that production boundary.
- `src/lib/reader-navigation.ts`: the production contract for canonical reader
  URLs, safe return-route snapshots, order continuity, scroll restoration, and
  origin-brand resolution.
- `src/lib/reader-navigation.test.ts`: six focused specifications, including
  rejection of stale, future, malformed, and route-mismatched snapshots.
- `src/components/hearst-plus/fullscreen-image-viewer.tsx`: the exact
  production gallery/single-image viewer, including modal isolation, focus,
  keyboard, swipe, zoom, slideshow, caption, credit, save, and related-story
  behavior.
- `src/stories/HearstPlusFullscreenImageViewer.stories.tsx`: three direct
  specifications, including keyboard navigation, caption/credit state,
  dismissal, reopening, and single-image control suppression.
- `src/components/hearst-plus/ambient-reader.tsx`: a 1,401-line, 73,733-byte
  production boundary for the publication article, discovery status, related stories,
  commerce module, density/theme preferences, swipe previews, and all six
  sponsored-interstitial treatments.
- `src/components/hearst-plus/brand-theme-resolution.ts`: the shared
  publication-theme resolver used by the page and extracted reader, avoiding a
  circular dependency or duplicated brand rules.
- `src/stories/HearstPlusAmbientReader.stories.tsx`: three direct specifications
  using the exact production Esquire story and exercising focus restoration,
  keyboard navigation, 44px phone controls, theme/density state, and
  interstitial dismissal.
- `src/components/hearst-plus/discovery-sidebar.tsx`: a 376-line, 14,178-byte
  production boundary for Daily Habit, destination and publication brand
  filters, complete inventory counts, Autos make filters, followed topics, and
  collections.
- `src/stories/HearstPlusDiscoverySidebar.stories.tsx`: five direct
  specifications covering destination, publication inventory, selection and
  clear, Autos make, and Videos source-order states.
- `src/components/hearst-plus/trending-rail.tsx`: a 111-line, 3,320-byte
  production boundary for the ranked article and video right rails, including
  named regions, heading semantics, ordered rank structure, complete-row
  controls, and omission when allocation is empty.
- `src/stories/HearstPlusTrendingRails.stories.tsx`: six compact-fixture
  specifications covering destination and publication scoping, article and
  video interaction behavior, the Videos dark exception, and empty allocation.
- `src/components/hearst-plus/today-edit-strip.tsx`: a 238-line, 8,823-byte
  production boundary for complete, first-visit, and minimal ranked
  allocations, responsive carousel state, genuine Continue Reading
  measurement, and mobile omission.
- `src/stories/HearstPlusTodayEdit.stories.tsx`: seven direct specifications,
  including exact four-, three-, and two-column allocation contracts, open and
  continue callbacks, tablet keyboard focus continuity, 44px arrow targets,
  mobile omission, and incomplete-core omission.
- `src/components/hearst-plus/featured-story-carousel.tsx`: a 455-line,
  17,594-byte production boundary for the five-story mixed-format edition,
  active-slide isolation, auto-rotation and reduced motion, swipe, actions,
  responsive controls, clamps, and publication indicator treatment.
- `src/stories/HearstPlusFeaturedCarousel.stories.tsx`: seven direct
  specifications for the mixed edition, interactions and active-slide
  semantics, mobile targets, saved state, publication treatment, single-story
  fallback, and empty allocation.
- `src/components/hearst-plus/story-actions.tsx`: a 136-line, 3,859-byte
  production boundary for Save, More Like This, comments, Hide, current-feed
  status, announcements, responsive targets, and post-removal focus.
- `src/stories/HearstPlusStoryActions.stories.tsx`: six direct specifications
  for the available, interactive, saved, current-feed, phone, and adjacent-focus
  contracts.
- `src/components/hearst-plus/delish-shorts-viewer.tsx`: a 494-line,
  21,028-byte production boundary for the scroll-snap reel, media preload,
  autoplay and mute behavior, save/playback controls, modal isolation,
  announcements, reduced motion, and Read story handoff.
- `src/stories/HearstPlusDelishShortsViewer.stories.tsx`: five direct
  specifications covering open, keyboard/actions, phone, one-short, and
  dismissal/focus contracts.
- `.storybook/ThemeDecorator.tsx`: publication themes now layer over their
  production destination foundation theme instead of activating publication
  raw-token modes that are not present on routed publication pages.
- `src/lib/reader-queue.test.ts`: five tests that lock the queue behavior to the
  production rules.
- Static Storybook chunk: `home-page-*.js` is 783.49 kB minified, still about
  49.3 kB below the earlier verified 832.81 kB build. Source ownership
  improved and the page source dropped another 1,256 bytes in the
  video-destination extraction, but the
  current production import graph still bundles the reader with the full page;
  source extraction alone is not code splitting.
- The file still owns feed allocation, navigation, card composition, reader
  orchestration, contextual-ad insertion, games, live personalization inputs,
  and destination layout.

Impact:

- A change in one journey risks unrelated regressions.
- Ownership is unclear at the code boundary.
- Storybook must load the entire composition for narrowly scoped stories.
- Review, testing, and safe deprecation are harder than necessary.

Recommendation:

- Continue extracting by production responsibility, not by visual fragment:
  reader orchestration and remaining feed allocation are now the next
  boundaries. Destination configuration, scoring, and video-queue behavior are
  shared pure production contracts, while stakeholder diagnostics remain a
  shared public renderer.
- Preserve public exports and story IDs during extraction.
- Require zero-drift visual comparisons at 320, 390, tablet, and desktop for
  every extraction batch.

Effort: L
Confidence: High

#### P1.2 — Known styling debt remains large

Evidence:

- Token audit gate: 630 known violations, 59 resolved findings, and zero
regressions. The featured-carousel extraction replaced duplicated raw scrim
colors with shared Hearst+ image-scrim variables.
- Largest current files: `home-page.tsx` 341,
  `product-story-shell.tsx` 120,
  `article-page.tsx` 87, `hot-rod-events-page.tsx` 30.
- The no-regression baseline prevents growth but intentionally permits known
  debt.

Impact:

- Brand changes can miss hard-coded surfaces.
- Multiple components can drift from semantic tokens while CI stays green.
- The baseline can be mistaken for compliance unless the remaining count is
  reported.

Recommendation:

- Set quarterly and per-PR burn-down targets.
- Separate genuine campaign/content palettes from UI tokens in typed content
  configuration and document the exception.
- Prioritize user-facing production surfaces before inspector or stakeholder
  tooling.

Effort: L
Confidence: High

#### P1.3 — Governance roles are not enforceable yet

Evidence:

- `CONTRIBUTING.md` defines accountable review roles.
- No GitHub `CODEOWNERS` file exists because actual team handles are not known.
- The quality workflow exists in the current worktree but is not committed.

Impact:

- Required design-system, product, engineering, and accessibility review can be
  skipped accidentally.
- Current automated gates are local evidence until the workflow is merged and
  required in branch protection.

Recommendation:

- Map the documented roles to real teams in `CODEOWNERS`.
- Commit the quality workflow and make it a required pull-request check.
- Add a pull-request template for production source, viewports, keyboard
  evidence, token impact, and migration classification.

Effort: S once owners are known
Confidence: High

#### P1.4 — Release policy exists, but no formal release system exists

Evidence:

- Package version remains `0.1.0`.
- `CHANGELOG.md` states that formal package release is not established.
- No Changesets, semantic-release, package-publish workflow, or equivalent
  version automation is present.

Impact:

- Consumers cannot reliably determine which Storybook specification matches a
  package or deployed application revision.
- Deprecation timing and breaking-change classification are procedural rather
  than enforceable.

Recommendation:

- Choose the distribution contract first: internal package, source-consumed
  library, or application-owned components.
- If packaged, add changesets, provenance, release notes, exact Storybook
  revision, and a publish/rollback verification step.

Effort: M
Confidence: High

### P2

#### P2.1 — Responsive overflow coverage is comprehensive, but assistive-technology coverage is not

Evidence:

- Visual coverage spans 320, 390, 480, 500, 600, 720, 768, and 1280 widths, but
  only 47 selected cases.
- The reader visual case now waits for the final production dialog state before
  capture; this removed a race where the runner could snapshot the underlying
  feed while the Storybook play function was still closing and reopening the
  reader.
- Documentation checks cover all 18 docs at 390 and 1280.
- Carousel keyboard behavior is checked at 320 and 1280.
- `scripts/test-storybook-responsive.mjs` checks all 237 stories at 320, 390,
  768, and 1280. The current report passes all 948 checks without retries.
- The first run exposed 23 failures across 11 stories, including centered
  canvas wrappers, page overflow, narrow code examples, and two asynchronous
  interaction assertions; those defects were remediated before this report.
- No automated 200% zoom or forced-colors run exists.

Impact:

- Render and horizontal-overflow regressions now fail even on low-traffic
  stories.
- Touch-target semantics, zoom, high-contrast, reading order, and screen-reader
  announcements remain only partially automated or manual.

Recommendation:

- Keep the all-story matrix in the required quality gate; retain pixel
  baselines only for high-value surfaces.
- Add focused keyboard suites for menus, dialogs, readers, filters, and
  dismissible controls.
- Add manual release evidence for VoiceOver or NVDA, 200% zoom, and forced
  colors until reliable automation is selected.

Effort: M
Confidence: High

#### P2.2 — Storybook has no enforced bundle budget

Evidence:

- Build warnings identify chunks above 500 kB: HLS 524.95 kB, axe 592.94 kB,
  another shared index 662.40 kB, the home-page chunk 783.26 kB, and another
  index 821.93 kB.
- The build succeeds because these are warnings.

Impact:

- Catalog startup and story switching will worsen as coverage grows.
- The monolithic application composition masks opportunities for lazy loading.

Recommendation:

- Record per-entry and initial-load budgets.
- Lazy-load HLS and heavy reader/video modules at their interaction boundary.
- Split Storybook-only test tooling from ordinary story chunks where supported.

Effort: M–L
Confidence: Medium; bundle attribution needs a visualizer before code splitting

#### P2.3 — Primitive state matrices are inconsistent

Evidence:

- Button documents disabled and destructive; Chip and Toggle document selected;
  Feed States document loading, empty, and error.
- Most primitive titles do not expose explicit focus-visible, active,
  permission-restricted, or high-contrast examples.
- No destructive confirmation-and-recovery pattern is cataloged.

Impact:

- Stakeholders can see individual variants but cannot consistently answer how a
  component behaves through a complete task.

Recommendation:

- Add only applicable states, but use a shared state checklist in each
  component’s docs.
- Add a production-backed confirmation pattern before cataloging destructive
  workflows.
- Document non-applicable states explicitly rather than generating artificial
  examples.

Effort: M
Confidence: High

#### P2.4 — External production parity is not continuously proven

Evidence:

- Current comparisons use the routed application in this checkout and the same
  imported React composition.
- No stable deployed production reference, screenshot contract, or external
  production URL is part of CI.

Impact:

- Storybook can match the local application while both drift from a separately
  deployed product.

Recommendation:

- Establish the authoritative environment and revision.
- Capture same-state, same-viewport snapshots from that environment for a small
  set of critical journeys.
- Treat fixture differences as labeled data differences, not visual license.

Effort: M
Confidence: High on the evidence gap; implementation depends on environment access

#### P2.5 — Trending-rail labels and mobile placement need a product decision

Evidence:

- The production three-column grid becomes one column below `lg`, preserving
  DOM order as discovery sidebar, complete story river, then trending rail.
- At 390px the article rail renders correctly without overflow, but only after
  the reader reaches the end of the progressively delivered river.
- Publication pages correctly allocate stories only from the selected
  publication, but the visible module title remains `Trending Across Brands`.
- `HearstPlusTrendingRails.stories.tsx` now documents both the cross-brand and
  publication-scoped contracts without inventing different Storybook behavior.

Impact:

- The mobile module is technically accessible but weak as an early discovery
  pattern because most readers will encounter it only after the river.
- Stakeholders can interpret a publication-scoped list as cross-brand because
  the title describes a broader scope than the actual allocation.

Recommendation:

- Decide from reader evidence whether mobile should move the rail before the
  river, omit it as redundant, or keep it as an end-of-river continuation.
- Decide whether publication routes should use a truthful label such as
  `Trending from {publication}`. Change production first, then update the
  direct Storybook contract and comparison baseline in the same change.

Effort: S–M
Confidence: High on current behavior; Medium on the preferred product change

### P3

#### P3.1 — Token architecture has duplication debt and four protected component roles

Evidence:

- Validator reports 398 component tokens: 2 cross-brand-safe promotion
  candidates, 4 candidates blocked by intentional publication overrides, 192
  duplicates of existing semantic values, and 200 unique component tokens.
- The safe candidates are the default divider border and empty rating star.
- Inline-link default and hover colors diverge from their proposed semantic
  roles in 16 and 9 publication modes. Car and Driver intentionally overrides
  the brand divider, and Delish intentionally overrides the full rating star.

Impact:

- Consumers have more names to choose from than necessary.
- Equivalent values do not necessarily express equivalent intent.
- A base-value-only promotion would erase shipped publication differences.

Recommendation:

- Review actual consumers and deprecation impact for the two cross-brand-safe
  candidates before migrating them.
- Preserve the four blocked component roles unless production design changes
  the named publication exceptions first.
- Do not delete duplicates solely because values match; confirm semantic intent
  and brand override behavior before aliasing.

Effort: S for the two safe candidates, L for duplication review
Confidence: High for promotion safety; Medium for broad deduplication

#### P3.2 — Pencil documentation requires an ownership decision

Evidence:

- Pencil synchronization scripts and documentation remain present alongside
  Tailwind/shadcn implementation guidance.
- They currently describe different workflow layers rather than interchangeable
  technologies.

Impact:

- Stakeholders may read Pencil as a production implementation dependency.

Recommendation:

- Decide whether Pencil is an active handoff surface, an optional design tool,
  or deprecated.
- Keep Tailwind as the implementation contract; label Pencil’s status and owner
  instead of presenting it as a substitute for Tailwind.

Effort: S
Confidence: Medium; requires workflow ownership input

## 5. Evidence and relevant file references

- Production authority: `APP_RULES.md`, `PRODUCT.md`, `DESIGN.md`, `STYLE.md`,
  and `BRAND_STYLES.md`.
- Storybook configuration: `.storybook/main.mjs`, `.storybook/preview.tsx`,
  and `.storybook/swiss-preview.css`.
- Catalog inventory: `storybook-static/index.json`.
- Production composition: `src/components/home-page.tsx`.
- Extracted production video cards:
  `src/components/hearst-plus/video-cards.tsx`.
- Extracted production discovery sidebar:
  `src/components/hearst-plus/discovery-sidebar.tsx`.
- Discovery sidebar specifications:
  `src/stories/HearstPlusDiscoverySidebar.stories.tsx`.
- Production-layered Storybook theming:
  `.storybook/ThemeDecorator.tsx`.
- Shared production story metadata:
  `src/components/hearst-plus/story-metadata.tsx`.
- Extracted production reader action bar:
  `src/components/hearst-plus/reader-action-bar.tsx`.
- Extracted production reader queue:
  `src/components/hearst-plus/reader-queue.ts`.
- Reader queue specifications: `src/lib/reader-queue.test.ts`.
- Extracted production reader article body:
  `src/components/hearst-plus/reader-article-body.tsx`.
- Extracted production reader navigation contract:
  `src/lib/reader-navigation.ts`.
- Reader navigation specifications: `src/lib/reader-navigation.test.ts`.
- Reader body specifications:
  `src/stories/HearstPlusReaderBody.stories.tsx`.
- Reader control specifications:
  `src/stories/HearstPlusReaderControls.stories.tsx`.
- Public application exports: `src/components/hearst-plus/index.ts`.
- Canonical tokens: `tokens/core/global.json`, `tokens/semantic`, and
  `tokens/brands`.
- Generated runtime tokens: `src/lib/tokens.css` and `src/lib/brands.ts`.
- Token debt: `reports/token-audit.json` and
  `reports/token-audit-baseline.json`.
- Tests: `scripts/test-storybook-visuals.mjs`,
  `scripts/test-storybook-responsive.mjs`,
  `scripts/test-storybook-docs.mjs`, and
  `scripts/test-featured-carousel-a11y.mjs`.
- Responsive evidence: `reports/storybook-responsive.json`.
- Governance: `CONTRIBUTING.md`, `CHANGELOG.md`, and
  `.github/workflows/hearst-design-system-quality.yml` at the repository root.

## 6. User and engineering impact

- Readers benefit when Storybook changes the production component itself:
  fixes to touch targets, focus restoration, feed states, reader errors, and
  Videos theming now carry into the routed application.
- Designers and stakeholders can inspect real publication typography, logos,
  cards, feed states, and responsive compositions without treating mock
  prototypes as shipped behavior.
- Engineers now have executable regression gates, but still pay a high
  coordination cost inside the monolithic home-page component.
- Consumers remain exposed to ambiguous versioning until a real release
  contract and ownership enforcement are established.

## 7. Specific recommendations

1. Continue splitting `home-page.tsx` by production responsibility with visual
   parity after every batch.
2. Burn down the 673-item token baseline and report the count in each release.
3. Commit and require the quality workflow.
4. Add real `CODEOWNERS` teams and a pull-request evidence template.
5. Keep the all-story responsive matrix required and add focused zoom,
   forced-colors, and keyboard evidence.
6. Add bundle budgets and lazy-load HLS, reader, and video-only code.
7. Review consumers and migration impact for the two cross-brand-safe
   semantic-token candidates.
8. Establish a versioned release contract tied to an exact Storybook build.
9. Add external production comparisons when an authoritative environment is
   available.

## 8. Effort and confidence

| Workstream | Effort | Confidence |
| --- | --- | --- |
| Home-page modularization | Large | High |
| Token debt burn-down | Large | High |
| CODEOWNERS and PR template | Small | High once team handles are known |
| Release automation | Medium | High |
| Zoom, forced-colors, and keyboard expansion | Medium | High |
| Bundle budgets and splitting | Medium–Large | Medium |
| Two cross-brand-safe semantic-token candidates | Small | High |
| External production parity suite | Medium | Medium until access is defined |

## 9. Missing components, states, tokens, tests, and documentation

- No production-backed destructive confirmation/recovery pattern.
- No general permission-restricted component pattern.
- No automated 200% zoom or forced-colors check.
- No documented manual screen-reader result for the current release.
- No enforced bundle budgets.
- No real CODEOWNERS mapping.
- No formal package release or consumer migration mechanism.
- Two cross-brand-safe semantic-token candidates still need consumer and
  deprecation review; four component roles are intentionally blocked by
  publication overrides.
- Story state tables are not consistent across every primitive.

## 10. Quick wins

1. Add known team handles to `CODEOWNERS`.
2. Add a pull-request template using the existing evidence checklist.
3. Review and, where consumers justify it, migrate the two cross-brand-safe
   semantic-token candidates.
4. Add bundle-size reporting before enforcing a budget.
5. Add an explicit status banner to Pencil documentation.
6. Add a small manual release record for screen reader, 200% zoom, and forced
   colors on the critical reader and navigation journeys.

## 11. 30-day and 60–90-day plans

### First 30 days

- Merge and require the quality workflow.
- Establish CODEOWNERS and the PR evidence template.
- Continue separating the remaining reader orchestration and feed allocation
  from `home-page.tsx`; the video-destination model, Ambient Reader, video
  cards, reader action bar,
  reader masthead, queue selection, content model, article body, reader
  navigation contract, and fullscreen image viewer are now separated.
- Reduce the token baseline below 600 without visual drift.
- Keep all 948 responsive render/overflow checks in the required quality gate.
- Record one manual VoiceOver/NVDA and 200% zoom pass for critical journeys.

### 60–90 days

- Complete the remaining reader orchestration, contextual module, and
  personalization boundaries.
- Add bundle budgets and lazy loading for HLS and heavy reader surfaces.
- Establish the package/source-consumption release contract and versioned
  changelog workflow.
- Add authoritative deployed-production comparisons for critical journeys.
- Review duplicate component tokens by intent and brand override, not only
  matching value.

## 12. Findings requiring user research or further technical evidence

- Whether stakeholders understand the distinction among implementation tokens,
  publication identity, campaign creative palettes, and Pencil handoff data.
- Whether the Videos dark destination improves comprehension and viewing intent
  for readers across phone and desktop.
- Whether the current personalization explanations build trust without feeling
  like an administrative dashboard.
- Whether mobile readers benefit from a ranked trending module before the
  river, after the river, or not at all, and whether publication readers
  understand the current `Trending Across Brands` label.
- Which deployed environment and revision should be the continuous production
  parity authority.
- Actual Storybook load performance on stakeholder devices; bundle size is a
  risk signal, not measured user latency.
- Screen-reader announcements and reading order in VoiceOver, NVDA, and JAWS.

## 13. Numbered audit steps and screenshots

1. **Production Hearst+ desktop — healthy.** Captured the routed application at
   1280px.
   [01-production-hearst-plus-1280.png](../playwright/storybook-reaudit-2026-07-26/01-production-hearst-plus-1280.png)
2. **Storybook For You desktop — healthy and production-backed.** Compared the
   same composition at 1280px.
   [02-storybook-for-you-1280.png](../playwright/storybook-reaudit-2026-07-26/02-storybook-for-you-1280.png)
3. **ELLE typography desktop — healthy.** Verified official logo, token roles,
   and production example.
   [03-typography-elle-logo-1280.png](../playwright/storybook-reaudit-2026-07-26/03-typography-elle-logo-1280.png)
4. **ELLE typography mobile — healthy.** Verified responsive stacking at
   390px.
   [04-typography-elle-logo-390.png](../playwright/storybook-reaudit-2026-07-26/04-typography-elle-logo-390.png)
5. **Production feed mobile — healthy.** Captured the routed feed at 390px.
   [05-production-feed-390.png](../playwright/storybook-reaudit-2026-07-26/05-production-feed-390.png)
6. **Storybook feed mobile — healthy.** Verified the shared responsive
   composition at 390px.
   [06-storybook-feed-390.png](../playwright/storybook-reaudit-2026-07-26/06-storybook-feed-390.png)
7. **Production Lifestyle mobile — healthy.** Captured the routed destination.
   [07-production-lifestyle-390.png](../playwright/storybook-reaudit-2026-07-26/07-production-lifestyle-390.png)
8. **Storybook Lifestyle mobile — remediated.** The former parallel prototype
   was replaced with `HomePageTemplate`.
   [08-storybook-lifestyle-390.png](../playwright/storybook-reaudit-2026-07-26/08-storybook-lifestyle-390.png)
9. **Lifestyle Videos navigation — healthy.** Verified the production Videos
   destination is present.
   [09-storybook-lifestyle-video-nav-390.png](../playwright/storybook-reaudit-2026-07-26/09-storybook-lifestyle-video-nav-390.png)
10. **Production Videos navigation — healthy.** Captured the routed reference.
    [10-production-videos-nav-390.png](../playwright/storybook-reaudit-2026-07-26/10-production-videos-nav-390.png)
11. **Storybook Videos navigation before canvas correction — superseded.**
    [11-storybook-videos-nav-390.png](../playwright/storybook-reaudit-2026-07-26/11-storybook-videos-nav-390.png)
12. **Storybook Videos navigation after correction — healthy.** Dark canvas now
    represents the complete scoped destination.
    [12-storybook-videos-nav-full-canvas-390.png](../playwright/storybook-reaudit-2026-07-26/12-storybook-videos-nav-full-canvas-390.png)
13. **Reader error state — healthy intentional state.** Verified explicit
    unavailable-content messaging and recovery controls.
    [13-reader-overlay-elle-390.png](../playwright/storybook-reaudit-2026-07-26/13-reader-overlay-elle-390.png)
14. **Reader success state — healthy.** Verified deterministic content and
    focus behavior.
    [14-reader-success-elle-390.png](../playwright/storybook-reaudit-2026-07-26/14-reader-success-elle-390.png)
15. **Tokenized Videos feed at 390px — healthy.** Computed background
    `#000000`, surface `#181b20`, accent `#BDDDFC`, and no horizontal overflow.
    [19-videos-feed-tokenized-390.png](../playwright/storybook-reaudit-2026-07-26/19-videos-feed-tokenized-390.png)
16. **Tokenized Videos feed at 1280px — healthy.** Verified the
    `220px / 636px / 280px` three-column production composition and no
    horizontal overflow.
    [20-videos-feed-tokenized-1280.png](../playwright/storybook-reaudit-2026-07-26/20-videos-feed-tokenized-1280.png)
17. **Reader action bar at 390px — healthy.** Verified responsive stacking,
    source metadata, published and updated dates, and 44px save/comment
    targets.
    [21-reader-action-bar-default-390.png](../playwright/storybook-reaudit-2026-07-26/21-reader-action-bar-default-390.png)
18. **Premium-reader ready state at 1280px — healthy.** Verified compact
    desktop controls, the enabled premium-reader affordance, and the shared
    production styling.
    [22-reader-action-bar-premium-ready-1280.png](../playwright/storybook-reaudit-2026-07-26/22-reader-action-bar-premium-ready-1280.png)
19. **Grid Anatomy at 320px — remediated and healthy.** Verified narrow
    documentation cards, token examples, and internally scrollable code without
    page overflow.
    [23-grid-anatomy-responsive-320.png](../playwright/storybook-reaudit-2026-07-26/23-grid-anatomy-responsive-320.png)
20. **Token Map at 320px — remediated and healthy.** Replaced the clipped
    mobile table with readable token cards that preserve the canonical JSON,
    CSS, Tailwind, and Figma names.
    [24-token-map-responsive-320.png](../playwright/storybook-reaudit-2026-07-26/24-token-map-responsive-320.png)
21. **Production-backed reader at 390px — healthy with remaining ownership
    debt.** Verified publication theme, article imagery and metadata, reader
    actions, and queue-selected content; nested-overlay orchestration still
    lives in the large production composition.
    [25-reader-queue-production-390.png](../playwright/storybook-reaudit-2026-07-26/25-reader-queue-production-390.png)
22. **Production reader article body at 390px — healthy and directly
    specified.** Verified publication typography, paragraph, heading, quote,
    list, image, caption, and fullscreen-image request without launching the
    page-level modal.
    [26-reader-article-body-ready-390.png](../playwright/storybook-reaudit-2026-07-26/26-reader-article-body-ready-390.png)
23. **Production reader navigation at 390px — healthy and contract-tested.**
    Keyboard-opened an ELLE story, verified the canonical reader URL and
    34-story return-order snapshot, then closed to the exact prior scroll
    position (`761px` to `761px`) with no browser errors.
    [27-reader-return-contract-390.png](../playwright/storybook-reaudit-2026-07-26/27-reader-return-contract-390.png)
24. **Production fullscreen image viewer at 390px — healthy and directly
    specified.** Verified the ELLE gallery, 44px phone controls, thumbnail
    rail, no horizontal overflow, caption/credit state, keyboard navigation,
    Escape dismissal, focus restoration, and a separate single-image state.
    The same component is imported by the routed reader.
    [28-reader-image-viewer-gallery-390.png](../playwright/storybook-reaudit-2026-07-26/28-reader-image-viewer-gallery-390.png)
25. **Production Ambient Reader at 390px — healthy.** Opened the canonical
    Esquire article route with the production reader state and verified the
    publication masthead, headline, metadata, source imagery, and 44px header
    controls.
    [34-production-ambient-reader-updated-390-verified.png](../playwright/storybook-reaudit-2026-07-26/34-production-ambient-reader-updated-390-verified.png)
26. **Direct Storybook Ambient Reader at 390px — healthy and production-backed.**
    Rendered the same exported component with the exact production Esquire
    story and verified keyboard navigation, density/theme controls,
    sponsored-interstitial dismissal, and opener-focus restoration.
    [32-storybook-ambient-reader-390-verified.png](../playwright/storybook-reaudit-2026-07-26/32-storybook-ambient-reader-390-verified.png)
27. **Production/Storybook Ambient Reader comparison at 390px — matched.**
    Compared equal viewports side by side. Headline geometry, typography,
    article data, layout, and raw image source are the same; the small decoded
    image delta comes from the production route's Next.js optimizer.
    [35-production-storybook-ambient-reader-match-390.png](../playwright/storybook-reaudit-2026-07-26/35-production-storybook-ambient-reader-match-390.png)
28. **Extracted production/Storybook Ambient Reader comparison at 390px —
    matched with zero regression.** Repeated the equal-viewport comparison
    after moving the complete reader, commerce module, swipe previews, and six
    interstitial treatments into
    `src/components/hearst-plus/ambient-reader.tsx`. Headline geometry,
    typography, controls, source content, and layout remain identical; the
    routed image continues to use the expected Next.js optimization path.
    [38-production-storybook-ambient-reader-extracted-match-390.png](../playwright/storybook-reaudit-2026-07-26/38-production-storybook-ambient-reader-extracted-match-390.png)
29. **Production publication discovery sidebar at 1280px — healthy.** Verified
    the routed Cosmopolitan Daily Habit and Global Story Inventory placement,
    publication typography, selected brand state, complete counts, and sticky
    220px left-rail geometry.
    [40-production-global-inventory-sidebar-1280.png](../playwright/storybook-reaudit-2026-07-26/40-production-global-inventory-sidebar-1280.png)
30. **Direct Storybook discovery sidebar at 1280px — healthy and
    production-backed.** Rendered the extracted production component with the
    publication inventory fixture and verified clear, selected, story-open,
    topic-follow, Autos make, and Videos source-filter behavior.
    [45-storybook-discovery-sidebar-themed-1280.png](../playwright/storybook-reaudit-2026-07-26/45-storybook-discovery-sidebar-themed-1280.png)
31. **Production/Storybook discovery-sidebar comparison at 1280px — matched.**
    The compared left rails share the exact 220px width, 8px card radius, 16px
    padding, publication font family and weights, active-state color, and
    `#E7D6DF` production border. Editorial titles differ because Storybook uses
    a deterministic checked-in fixture rather than the routed page's current
    daypart ranking.
    [46-production-storybook-discovery-sidebar-match-1280.png](../playwright/storybook-reaudit-2026-07-26/46-production-storybook-discovery-sidebar-match-1280.png)
32. **Production cross-brand trending rail at 1280px — healthy after
    extraction.** Verified the routed Lifestyle destination still renders the
    280px sticky rail with five ranked, fully clickable rows, production
    typography, 8px radius, 16px padding, and the themed border and heading
    color. The extracted module is now a named region with an H2 and ordered
    list.
    [56-production-trending-articles-after-extraction-1280.png](../playwright/storybook-reaudit-2026-07-26/56-production-trending-articles-after-extraction-1280.png)
33. **Direct Storybook article trending rail at 1280px — healthy and
    production-backed.** Rendered the same exported component with the compact
    generated Lifestyle fixture. Separate interaction coverage verifies
    keyboard focus, Enter activation, complete-row labels, and the open-story
    callback without leaving the specification.
    [52-storybook-trending-articles-1280.png](../playwright/storybook-reaudit-2026-07-26/52-storybook-trending-articles-1280.png)
34. **Production/Storybook article trending comparison at 1280px — matched.**
    The compared rails share the same responsive column width, surface, border,
    shadow, radius, padding, rank markers, text hierarchy, and metadata
    anatomy. Editorial titles differ because Storybook uses the deterministic
    compact fixture instead of the routed page's current allocation.
    [54-production-storybook-trending-articles-match-1280.png](../playwright/storybook-reaudit-2026-07-26/54-production-storybook-trending-articles-match-1280.png)
35. **Production article trending rail at 390px — healthy with a placement
    limitation.** The rail reflows to the full 358px content width with no
    horizontal overflow and all rows remain larger than 44px. Because
    production places the right rail after the complete river below `lg`, it
    appears near the end of the mobile page rather than as early discovery.
    [49-production-trending-rail-lifestyle-390.png](../playwright/storybook-reaudit-2026-07-26/49-production-trending-rail-lifestyle-390.png)
36. **Production Videos trending rail at 1280px — healthy after extraction.**
    Verified the routed dark Videos surface retains four ranked video rows,
    96px thumbnails, durations, publication names, light-blue heading tokens,
    and the scoped `#181B20` surface without leaking the exception. The module
    is now a named region with an H2 and ordered list.
    [57-production-trending-videos-after-extraction-1280.png](../playwright/storybook-reaudit-2026-07-26/57-production-trending-videos-after-extraction-1280.png)
37. **Production/Storybook Videos trending comparison at 1280px — matched.**
    The direct story uses the same exported rail and `VideoRailCard` component,
    matching the production surface, border, radius, padding, 96px media
    anatomy, rank and duration badges, title clamp, and scoped dark tokens.
    Storybook media is the documented deterministic video fixture.
    [55-production-storybook-trending-videos-match-1280.png](../playwright/storybook-reaudit-2026-07-26/55-production-storybook-trending-videos-match-1280.png)
38. **Production Today’s Edit at 1280px — healthy before extraction.** Verified
    four equal 295.5px cards inside the 1,184px production strip, exact
    typography, 80×64 media, 8px radius, themed border, and no page overflow.
    [58-production-todays-edit-1280.png](../playwright/storybook-reaudit-2026-07-26/58-production-todays-edit-1280.png)
39. **Production Today’s Edit at 768px — visually healthy with an
    accessibility defect.** The strip becomes a 718px snap carousel with
    291.84px cards and exposes the next control, but its visible 28px button was
    also the full touch target.
    [59-production-todays-edit-768.png](../playwright/storybook-reaudit-2026-07-26/59-production-todays-edit-768.png)
40. **Production tablet carousel end state — focus loss reproduced.** Activating
    Next moved the rail to its 449.5px endpoint and replaced the control with
    Previous, leaving the document with no active element. This became the
    focused accessibility remediation in the extraction.
    [60-production-todays-edit-768-scrolled.png](../playwright/storybook-reaudit-2026-07-26/60-production-todays-edit-768-scrolled.png)
41. **Production mobile at 390px — healthy intentional omission.** The full
    Today’s Edit strip computes to `display: none`, the page has no horizontal
    overflow, and genuine unfinished history remains in the separate compact
    Continue Reading row.
    [61-production-todays-edit-omitted-390.png](../playwright/storybook-reaudit-2026-07-26/61-production-todays-edit-omitted-390.png)
42. **Direct Storybook Today’s Edit at 1280px — production-backed.** The
    exported production component reproduces the exact 1,184×123px region,
    four 295.5px columns, background, border, radius, media geometry, label
    hierarchy, and title treatment with deterministic checked-in stories.
    [62-storybook-todays-edit-1280.png](../playwright/storybook-reaudit-2026-07-26/62-storybook-todays-edit-1280.png)
43. **Production/Storybook Today’s Edit comparison at 1280px — matched.** Both
    sides share the same layout and visual contract; editorial titles differ
    because Storybook uses a deterministic fixture instead of current
    browser-local ranking and reading history.
    [63-production-storybook-todays-edit-match-1280.png](../playwright/storybook-reaudit-2026-07-26/63-production-storybook-todays-edit-match-1280.png)
44. **Storybook tablet keyboard end state — remediated and healthy.** Keyboard
    activation scrolls to the endpoint, transfers focus to Previous, retains a
    visible focus ring, and exposes a measured 44×44px target while preserving
    the production 28px visible circle.
    [66-storybook-todays-edit-tablet-keyboard-focus.png](../playwright/storybook-reaudit-2026-07-26/66-storybook-todays-edit-tablet-keyboard-focus.png)
45. **Production Today’s Edit after extraction at 1280px — zero visual
    regression.** The routed application retains the exact 1,184×123px
    geometry and four-column production composition while adding a named H2
    region and importing the new public component.
    [65-production-todays-edit-after-extraction-1280.png](../playwright/storybook-reaudit-2026-07-26/65-production-todays-edit-after-extraction-1280.png)
46. **Production Today’s Picks at 1280px — healthy.** Verified the five-slide
    mixed-format edition, one active semantic slide, compact desktop controls,
    three-line headline and two-line summary limits, and no horizontal
    overflow.
    [67-production-todays-picks-1280.png](../playwright/storybook-reaudit-2026-07-26/67-production-todays-picks-1280.png)
47. **Production Today’s Picks at 768px — healthy.** Measured the exact
    720×598.875px carousel and 718×547.875px slide geometry, with no overflow
    and valid 28px compact controls.
    [68-production-todays-picks-768.png](../playwright/storybook-reaudit-2026-07-26/68-production-todays-picks-768.png)
48. **Production Today’s Picks at 390px — healthy.** Verified the 358px-wide
    carousel, 44px pause and selector targets, 44px story-action controls, and
    no page overflow.
    [69-production-todays-picks-390.png](../playwright/storybook-reaudit-2026-07-26/69-production-todays-picks-390.png)
49. **Production Today’s Picks at 320px — healthy.** Verified the 288px-wide
    carousel, responsive 286×125px action area, headline and summary clamps,
    and no page overflow.
    [70-production-todays-picks-320.png](../playwright/storybook-reaudit-2026-07-26/70-production-todays-picks-320.png)
50. **Direct Storybook Featured Carousel at 768px — production-backed.**
    Rendered the extracted component with the required three editorial
    anchors, one current article, and one playable current video. Interaction
    coverage verifies indicators, keyboard activation, save, preference,
    follow, open, pause, and active-slide isolation.
    [71-storybook-featured-carousel-768.png](../playwright/storybook-reaudit-2026-07-26/71-storybook-featured-carousel-768.png)
51. **Production Featured Carousel after extraction at 768px — zero layout
    regression.** The routed application retains its exact 720×598.875px
    geometry and five-story anatomy while importing the new public component.
    [72-production-featured-carousel-after-extraction-768.png](../playwright/storybook-reaudit-2026-07-26/72-production-featured-carousel-after-extraction-768.png)
52. **Production before/after comparison at 768px — matched.** Equal-viewport
    images confirm unchanged surface, border, radius, media ratio, type
    hierarchy, controls, and actions. Daily/browser-local ranking changes the
    active editorial content but not the production component contract.
    [73-production-featured-carousel-before-after-768.png](../playwright/storybook-reaudit-2026-07-26/73-production-featured-carousel-before-after-768.png)
53. **Production Story Actions at 1280px — baseline captured.** Verified the
    compact desktop Save, More Like This, comments, and Hide actions before
    extraction, including their exact production density and spacing.
    [74-production-story-actions-default-1280.png](../playwright/storybook-reaudit-2026-07-26/74-production-story-actions-default-1280.png)
54. **Production Story Actions at 390px — accessibility gap reproduced.**
    Save, More Like This, and comments met the 44px phone target, but Hide was
    removed by the mobile breakpoint and the comments control was named only
    by its number.
    [75-production-story-actions-mobile-390.png](../playwright/storybook-reaudit-2026-07-26/75-production-story-actions-mobile-390.png)
55. **Production Story Actions at 390px after extraction — remediated.** The
    same four production actions remain available, expose descriptive names,
    occupy 44px targets, and fit without page overflow.
    [76-production-story-actions-mobile-after-390.png](../playwright/storybook-reaudit-2026-07-26/76-production-story-actions-mobile-after-390.png)
56. **Direct Storybook Story Actions at 1280px — production-backed.** The new
    public component preserves the exact compact desktop presentation while
    separately specifying save, recommendation, comments, Hide, announcements,
    selection, and current-feed state.
    [77-storybook-story-actions-default-1280.png](../playwright/storybook-reaudit-2026-07-26/77-storybook-story-actions-default-1280.png)
57. **Direct Storybook Story Actions at 390px — healthy.** The responsive
    specification verifies all four actions, 44px targets, complete accessible
    names, and no horizontal overflow.
    [78-storybook-story-actions-mobile-390.png](../playwright/storybook-reaudit-2026-07-26/78-storybook-story-actions-mobile-390.png)
58. **Production post-Hide focus behavior — remediated.** Hiding the first
    river card transfers visible keyboard focus to the next story opener
    instead of leaving focus on the document body.
    [79-production-story-actions-focus-after-hide-1280.png](../playwright/storybook-reaudit-2026-07-26/79-production-story-actions-focus-after-hide-1280.png)
59. **Production Story Actions at 320px — healthy.** All four phone actions fit
    on one 44px-tall row inside the 288px content column with no horizontal
    overflow.
    [80-production-story-actions-mobile-320.png](../playwright/storybook-reaudit-2026-07-26/80-production-story-actions-mobile-320.png)
60. **Production Delish Shorts rail at 1280px — healthy.** Verified the routed
    Delish destination presents the current portrait-video inventory in the
    shipped horizontal rail, with publication treatment, duration metadata,
    visible scroll affordance, and no page overflow.
    [81-production-delish-shorts-rail-1280.png](../playwright/storybook-reaudit-2026-07-26/81-production-delish-shorts-rail-1280.png)
61. **Production immersive viewer at 1280px — healthy baseline.** Opening a
    Short preserves `/lifestyle/delish/`, portals the 9:16 viewer above the
    page, exposes close, save, mute, playback, direction, and Read story
    actions, and preloads adjacent videos.
    [82-production-delish-shorts-viewer-1280.png](../playwright/storybook-reaudit-2026-07-26/82-production-delish-shorts-viewer-1280.png)
62. **Production keyboard selection — healthy.** Arrow Down moved the native
    scroll-snap track by one viewport and changed the settled counter from
    `1/21` to `2/21`; closing then restored focus to the originating rail
    button.
    [83-production-delish-shorts-viewer-next-1280.png](../playwright/storybook-reaudit-2026-07-26/83-production-delish-shorts-viewer-next-1280.png)
63. **Production Delish Shorts rail at 390px — healthy.** The rail fits the
    358px content column, keeps usable portrait cards and touch scrolling, and
    introduces no horizontal page overflow.
    [84-production-delish-shorts-rail-390.png](../playwright/storybook-reaudit-2026-07-26/84-production-delish-shorts-rail-390.png)
64. **Previous Storybook coverage at 390px — incomplete.** The sole Delish
    Shorts story rendered only the rail and reduced activation to a mock
    callback. It could not verify the production viewer, modal isolation,
    keyboard or swipe selection, playback state, or Read story handoff.
    [85-storybook-vertical-video-carousel-current-390.png](../playwright/storybook-reaudit-2026-07-26/85-storybook-vertical-video-carousel-current-390.png)
65. **Production viewer at 390px after extraction — remediated.** The exact
    routed viewer remains edge-to-edge and overflow-free; every background
    layer is inert and `aria-hidden`, the close control receives focus, body
    scrolling is locked, and the Read story action now measures 44px.
    [86-production-delish-shorts-viewer-after-390.png](../playwright/storybook-reaudit-2026-07-26/86-production-delish-shorts-viewer-after-390.png)
66. **Direct Storybook immersive viewer at 390px — production-backed.** The
    new story imports the same public viewer, checked-in portrait media, and
    Delish editorial fixtures. Its interaction specifications cover modal
    isolation, focus loop and restoration, keyboard navigation, adjacent
    preload, save, mute, Read story, one-short boundaries, reduced motion,
    44px phone actions, and cleanup.
    [87-storybook-delish-shorts-viewer-390.png](../playwright/storybook-reaudit-2026-07-26/87-storybook-delish-shorts-viewer-390.png)
67. **Production Delish reader entry at 1280px — authority captured.** The
    routed publication page supplied the current article inventory and reader
    opener used for the parity check.
    [88-production-reader-entry-delish-1280.png](../playwright/storybook-reaudit-2026-07-26/88-production-reader-entry-delish-1280.png)
68. **Production publication reader at 1280px — healthy identity and
    isolation.** The routed reader uses the Delish logo and theme, identifies
    itself as Reading Delish, scopes its queue to 32 publication stories,
    locks body scrolling, hides and inerts the background, and focuses Close.
    [89-production-reader-open-delish-1280.png](../playwright/storybook-reaudit-2026-07-26/89-production-reader-open-delish-1280.png)
69. **Production nested gallery at 1280px — isolation healthy, focus return
    defect reproduced.** Opening the hero image hid and inerted the Story
    reader and focused the gallery Close button, but dismissal initially
    dropped focus to the document body.
    [90-production-reader-nested-gallery-1280.png](../playwright/storybook-reaudit-2026-07-26/90-production-reader-nested-gallery-1280.png)
70. **Production nested Ambient Reader at 1280px — healthy.** The Ambient
    Reader isolated the underlying Story reader, focused its Close button, and
    restored focus to the premium-reader opener on dismissal.
    [91-production-reader-nested-ambient-1280.png](../playwright/storybook-reaudit-2026-07-26/91-production-reader-nested-ambient-1280.png)
71. **Previous Storybook reader at 1280px — identity mismatch.** With Delish
    selected in the toolbar, the story still rendered Hearst Lifestyle,
    Reading Lifestyle, and a destination-origin queue because its return route
    was hard-coded.
    [92-storybook-reader-current-delish-1280.png](../playwright/storybook-reaudit-2026-07-26/92-storybook-reader-current-delish-1280.png)
72. **Production reader at 390px — touch-target defect reproduced.** The
    responsive reader was overflow-free and its action controls met 44px, but
    the primary Close control measured only 28×28px.
    [93-production-reader-delish-390.png](../playwright/storybook-reaudit-2026-07-26/93-production-reader-delish-390.png)
73. **Previous Storybook reader at 390px — mismatch confirmed.** The selected
    Delish toolbar still produced Hearst Lifestyle identity and the same 28px
    phone Close target.
    [94-storybook-reader-current-delish-390.png](../playwright/storybook-reaudit-2026-07-26/94-storybook-reader-current-delish-390.png)
74. **Corrected Storybook publication reader at 390px — production-backed.**
    The story now uses Delish identity, publication theming and homepage link,
    a 44×44px focused Close target, the production reader anatomy, and no
    horizontal overflow.
    [95-storybook-publication-reader-delish-390.png](../playwright/storybook-reaudit-2026-07-26/95-storybook-publication-reader-delish-390.png)
75. **Corrected production reader at 390px — parity verified.** The routed
    reader now also exposes a focused 44×44px Close target and retains its
    390px overflow-free publication layout.
    [Current production reader at 390px](../playwright/storybook-reaudit-2026-07-27/172-production-elle-reader-current-390.png)
76. **Corrected production gallery dismissal at 390px — exact focus
    restoration verified.** Closing the nested gallery removes reader
    isolation and visibly returns focus to the hero-image opener instead of
    the document body.
    [Current nested gallery surface at 390px](../playwright/visual-regression/reader-image-viewer-gallery-390-actual.png)
77. **Direct Storybook Story Presentation matrix at 1280px —
    production-backed.** Seven checked-in editorial specimens render through
    the same production resolver, reviewed crop rules, and metadata modules as
    the feed. A fresh Playwright WCAG A/AA run reports zero violations; all
    seven cards render with zero horizontal overflow.
    [98-storybook-story-presentation-1280.png](../playwright/storybook-reaudit-2026-07-26/98-storybook-story-presentation-1280.png)
78. **Direct Storybook Story Presentation matrix at 390px — healthy.** The
    single-column specification preserves current imagery, classification,
    resolver-key transparency, recipe/specification data, and shopping/guide
    signals. Fresh Playwright evidence reports zero WCAG A/AA violations and
    zero horizontal overflow.
    [99-storybook-story-presentation-390.png](../playwright/storybook-reaudit-2026-07-26/99-storybook-story-presentation-390.png)
79. **Production-backed Content Reader accessibility at 1280px — remediated.**
    The live addon initially identified a 4.15:1 warm-shell status line and a
    1.17:1 fallback author avatar. Both production components now use semantic
    reader colors; the same Delish publication story reports 0 violations and
    preserves the production identity, queue, metadata, comments, and related
    content.
    [100-storybook-content-reader-a11y-1280.jpg](../playwright/storybook-reaudit-2026-07-26/100-storybook-content-reader-a11y-1280.jpg)
80. **Production-backed Content Reader at the configured 414px mobile
    viewport — healthy.** The exact production reader remains bounded to the
    phone canvas, retains publication content and interaction coverage, and
    reports 0 automated accessibility violations. The all-story responsive
    gate separately verifies this story at 320px and 390px.
    [101-storybook-content-reader-mobile.jpg](../playwright/storybook-reaudit-2026-07-26/101-storybook-content-reader-mobile.jpg)
81. **Extracted production reader masthead at 1280px — parity preserved.**
    The direct Storybook reader still renders Delish identity, queue status,
    section navigation, metadata, responsive dismissal, and 0 automated
    accessibility violations after the masthead moved behind a public
    production component boundary.
    [102-storybook-content-reader-masthead-extracted-1280.jpg](../playwright/storybook-reaudit-2026-07-26/102-storybook-content-reader-masthead-extracted-1280.jpg)
82. **Direct publication masthead at 1280px — production-backed.** Verified
    the exact production component with the Delish logo and canonical homepage
    link, loaded-story status, current publication, sibling carousel, contextual
    filters, compact desktop Close control, and no horizontal overflow.
    [103-storybook-reader-masthead-publication-1280.jpg](screenshots/103-storybook-reader-masthead-publication-1280.jpg)
83. **Sibling-publication loading state at 1280px — healthy.** Verified the
    official Phosphor spinner, disabled control, `aria-busy="true"`, and polite
    `role="status"` announcement for `Loading Cosmopolitan stories`.
    [104-storybook-reader-masthead-loading-1280.jpg](screenshots/104-storybook-reader-masthead-loading-1280.jpg)
84. **Fashion & Luxury destination masthead at 1280px — remediated.** The first
    live capture exposed black active labels on the dark production shell. The
    shared dark semantic primary now resolves to `#BDDDFC`; the canonical
    Fashion & Luxury logo, route, scope navigation, active state, and filters
    are readable and production-aligned.
    [105-storybook-reader-masthead-destination-dark-1280.jpg](screenshots/105-storybook-reader-masthead-destination-dark-1280.jpg)
85. **Publication masthead at 414px — healthy.** Verified phone identity,
    horizontal filter scrolling, a focused 44×44px Close target, no page
    overflow, and interaction feedback.
    [106-storybook-reader-masthead-mobile-414.jpg](screenshots/106-storybook-reader-masthead-mobile-414.jpg)
86. **Publication masthead at 320px — healthy.** The smallest required
    viewport retains the Delish logo, current filters, 44×44px Close target,
    and a 320px document width with no page overflow.
    [107-storybook-reader-masthead-mobile-320.jpg](screenshots/107-storybook-reader-masthead-mobile-320.jpg)
87. **Publication masthead at 390px — healthy.** The supported phone viewport
    retains the same identity, focus treatment, 44×44px dismissal, and
    overflow-free horizontal filter behavior.
    [108-storybook-reader-masthead-mobile-390.jpg](screenshots/108-storybook-reader-masthead-mobile-390.jpg)
88. **Production publication reader before scope correction at 1280px —
    semantic drift confirmed.** The routed ELLE reader visibly showed sibling
    publications, but its first navigation landmark was named “Other Hearst
    sections.” The screenshot preserves the production composition used for
    comparison; the browser accessibility tree supplied the failing name.
    [109-production-publication-reader-before-1280.jpg](screenshots/109-production-publication-reader-before-1280.jpg)
89. **Production publication reader after scope correction at 1280px —
    behavior preserved.** The same ELLE reader, sibling order, current state,
    filters, and dark shell remain visible. Its first navigation landmark is
    now named “Fashion & Luxury publications,” matching the content and
    distinguishing it from destination-origin navigation.
    [110-production-publication-reader-after-1280.jpg](screenshots/110-production-publication-reader-after-1280.jpg)
90. **Direct ELLE publication masthead at 1280px — toolbar and production
    category restored.** The Brand toolbar now selects ELLE rather than being
    disabled by a forced Delish global. The production component renders the
    canonical ELLE route, Fashion & Luxury sibling publications, Culture as the
    current production-derived filter, the explicit “Fashion & Luxury
    publications” navigation name, and a full dark themed canvas.
    [111-storybook-publication-masthead-elle-1280.jpg](screenshots/111-storybook-publication-masthead-elle-1280.jpg)
91. **Production reader dialog before shell extraction at 1280px — visual
    baseline accepted, ownership risk confirmed in code.** The ELLE reader
    rendered the correct publication identity, queue, filters, article, and
    contextual rails, but its focus trap, Escape handler, modal dismissal, and
    delayed route return were still embedded in `home-page.tsx`.
    [112-production-reader-focus-shell-before-1280.jpg](screenshots/112-production-reader-focus-shell-before-1280.jpg)
92. **Production reader after dialog-shell extraction at 1280px — parity and
    exact return focus verified.** The same routed composition retains its
    production layout and initial focused Close control. Escape returns to
    `/flux/elle/`; the browser accessibility tree identifies the exact
    originating story button as active after dismissal. The direct opener
    reference now resolves before the route-remount label fallback.
    [113-production-reader-dialog-shell-after-1280.jpg](screenshots/113-production-reader-dialog-shell-after-1280.jpg)
93. **Production nested gallery at 1280px — top-layer ownership verified.**
    Opening the hero image isolates the Story reader and focuses the fullscreen
    gallery Close control. One Escape dismisses only the gallery, leaves the
    reader open, and restores focus to the image opener; the parent shell no
    longer competes for the same keyboard event.
    [114-production-reader-nested-gallery-1280.jpg](screenshots/114-production-reader-nested-gallery-1280.jpg)
94. **Direct Storybook publication reader at 1280px — production shell
    specified with deterministic content.** The ELLE fixture renders through
    the exact production dialog shell, masthead, article, action bar,
    recommendations, and advertising composition. Its interaction test covers
    initial Close focus, both focus-loop directions, Escape dismissal, exact
    opener restoration, nested gallery isolation, and Ambient Reader
    isolation without calling a live content service.
    [116-storybook-reader-dialog-shell-elle-direct-1280.jpg](screenshots/116-storybook-reader-dialog-shell-elle-direct-1280.jpg)
95. **Direct Storybook reader comments at desktop — production boundary
    extracted.** The ELLE fixture now renders the exact comments component
    imported by the routed reader. The live interaction specification verifies
    disabled blank submission, labelled guidance, successful posting, composer
    reset, newest-first session content, and comment-specific Like and Reply
    names.
    [117-storybook-reader-comments-elle-direct.jpg](screenshots/117-storybook-reader-comments-elle-direct.jpg)
96. **Direct Storybook reader comments at 320px — responsive contract
    remediated.** The production component reflows its header, composer, and
    discussion without horizontal overflow. Post, Like, and Reply now retain
    at least 44px height on phones while preserving compact desktop controls.
    [118-storybook-reader-comments-elle-320.jpg](screenshots/118-storybook-reader-comments-elle-320.jpg)
97. **Routed ELLE reader recommendations at 1280px — production source
    confirmed after extraction.** The live reader renders the extracted
    component inside its existing dark publication shell with the same featured
    and three-story structure, ranking copy, generated editorial imagery,
    bylines, context rail, and advertiser composition. Related actions now use
    concise “Open related story” accessible names.
    [119-production-reader-recommendations-after-1280.jpg](screenshots/119-production-reader-recommendations-after-1280.jpg)
98. **Direct Storybook reader recommendations at 1280px — exact production
    boundary documented.** The ELLE fixture renders the same exported component
    and current production-aligned inventory without duplicating its markup.
    The interaction specification verifies ranking order, four unique actions,
    accessible names, and the production navigation callback.
    [120-storybook-reader-recommendations-desktop.jpg](screenshots/120-storybook-reader-recommendations-desktop.jpg)
99. **Direct Storybook reader recommendations at 320px — phone contract
    verified.** The featured story stacks above the secondary list without
    horizontal overflow. The focused interaction check keeps every secondary
    story row at least 44px high; the all-story responsive matrix independently
    passes the component at 320, 390, 768, and 1280.
    [121-storybook-reader-recommendations-mobile-320.jpg](screenshots/121-storybook-reader-recommendations-mobile-320.jpg)
100. **Routed ELLE reader context rail before extraction at 1280px —
    repeated recommendations identified.** The production-only rail used the
    initially opened article for every module and repeated the same stories
    across intent, publication, and topic groups. Its button names also
    concatenated visible metadata rather than exposing a concise action.
    [122-production-reader-context-rail-before-1280.jpg](screenshots/122-production-reader-context-rail-before-1280.jpg)
101. **Routed ELLE reader context rail after extraction at 1280px — production
    parity retained with corrected allocation.** The same routed reader now
    imports the public component. Each story is allocated to only one group,
    contextual actions use concise names, and the rail follows the article that
    is active in the scrolling reader queue.
    [123-production-reader-context-rail-after-1280.jpg](screenshots/123-production-reader-context-rail-after-1280.jpg)
102. **Direct Storybook reader context rail at 1280px — exact production
    boundary specified.** The direct story renders the exported component and
    generated editorial fixture without duplicate markup. Its interaction
    specification verifies unique allocation, ranking order, concise
    accessible names, and the production navigation callback.
    [124-storybook-reader-context-rail-elle-1280.jpg](screenshots/124-storybook-reader-context-rail-elle-1280.jpg)
103. **Direct Storybook reader context rail at 320px — intentional omission
    verified.** The component remains in the DOM but has no rendered box or
    complementary landmark below the production `xl` breakpoint; the primary
    reader column remains usable without horizontal overflow.
    [125-storybook-reader-context-rail-omitted-320.jpg](screenshots/125-storybook-reader-context-rail-omitted-320.jpg)
104. **Routed ELLE reader advertisement before extraction at desktop — inert
    campaign action identified.** The production creative was visually
    complete and visibly disclosed, but “Open beauty” was a button with no
    action or destination. Its landmark name was only “Advertisement,” and
    selection searched the cross-destination catalog.
    [126-production-reader-ad-before-1280.png](screenshots/126-production-reader-ad-before-1280.png)
105. **Routed ELLE reader advertisement at 320px — intentional omission
    confirmed.** The standard reader retains its complete article column and
    exposes no advertisement landmark below the desktop breakpoint.
    [127-production-reader-ad-omitted-320.png](screenshots/127-production-reader-ad-omitted-320.png)
106. **Routed ELLE reader advertisement after extraction at desktop — truthful
    prototype state verified.** The routed reader imports the public boundary,
    keeps the same creative and placement, names the sponsor and campaign in
    the complementary landmark, scopes selection to Fashion & Luxury, and
    replaces the inert CTA with a clear non-interactive “destination not
    connected” notice.
    [128-production-reader-ad-after-1280.png](screenshots/128-production-reader-ad-after-1280.png)
107. **Direct Storybook reader advertisement at desktop — exact production
    boundary specified.** The current Beauty Counter creative renders through
    the exported production component without duplicating markup. Four
    interaction specifications distinguish prototype creative from a verified
    destination, the responsive omission, and no eligible inventory.
    [129-storybook-reader-ad-prototype-1280.png](screenshots/129-storybook-reader-ad-prototype-1280.png)
108. **Direct Storybook reader advertisement at 320px — omission contract
    specified.** The advertisement has no rendered box or complementary
    landmark, and the reader-column specimen reflows without horizontal
    overflow.
    [130-storybook-reader-ad-omitted-320.png](screenshots/130-storybook-reader-ad-omitted-320.png)
109. **Current-checkout quality and production builds — complete gate
    verified.** The final run passes 98 unit tests, all 214 Storybook
    interaction/accessibility tests, the two-viewport carousel accessibility
    check, all 47 reviewed visual baselines, 856 responsive render/overflow
    checks, and 34 documentation checks. The Next.js production build compiles
    and generates all 1,036 static pages; the rebuilt Storybook index contains
    231 entries across 66 titles.
110. **Routed Hearst+ river advertisement before extraction at desktop —
    reader-facing targeting diagnostics identified.** The inline card visibly
    exposed “Contextual Ad,” slot number, targeting topics, matching copy, and
    an intent score. Its “Open lookbook” button remained enabled but did not
    navigate or change state, and its image repeated the visible sponsor and
    campaign title for assistive technology.
    [131-production-river-ad-before-1280.png](screenshots/131-production-river-ad-before-1280.png)
111. **Routed Hearst+ river advertisement before extraction at 320px —
    responsive strength preserved.** The production card fit the 288px content
    column without page overflow and its visible button measured 44px high.
    The phone capture nevertheless exposed the same targeting diagnostics and
    inert action as desktop.
    [132-production-river-ad-before-320.png](screenshots/132-production-river-ad-before-320.png)
112. **Routed Hearst+ river advertisement after extraction at desktop —
    truthful production boundary verified.** The feed imports the public
    component, keeps the original creative and card geometry, exposes the
    sponsor and campaign in its article name, removes internal targeting copy,
    makes repeated imagery decorative, and replaces the dead button with an
    explicit non-interactive prototype destination notice.
    [133-production-river-ad-after-1280.png](screenshots/133-production-river-ad-after-1280.png)
113. **Routed Hearst+ river advertisement after extraction at 320px — phone
    reflow verified.** The corrected component remains 288px wide inside the
    320px viewport, the document scroll width remains 320px, and the
    unavailable-campaign notice is 67px high without pretending to be an
    action.
    [134-production-river-ad-after-320.png](screenshots/134-production-river-ad-after-320.png)
114. **Direct Storybook river advertisement at desktop — exact production
    boundary specified.** Storybook renders the exported component and current
    Red Carpet Desk creative without duplicating production markup. Four
    interaction specifications cover prototype, verified destination, phone,
    and no-eligible-advertisement states.
    [135-storybook-river-ad-prototype-1280.png](screenshots/135-storybook-river-ad-prototype-1280.png)
115. **Direct Storybook river advertisement at 320px — production parity and
    responsive contract verified.** The direct story uses the same 288px card,
    image crop, typography, content hierarchy, and prototype treatment as the
    routed feed, with no horizontal overflow or browser errors.
    [136-storybook-river-ad-prototype-320.png](screenshots/136-storybook-river-ad-prototype-320.png)
116. **Routed Brand Spotlight before extraction at desktop — specification
    drift identified.** The production module fit its 636px river column, but
    reader-facing copy exposed ranking, freshness, and reader-intent
    diagnostics, implied an unavailable Follow action, and gave story buttons
    duplicated accessible names.
    [137-production-brand-spotlight-before-1280.png](screenshots/137-production-brand-spotlight-before-1280.png)
117. **Routed Brand Spotlight before extraction at 320px — responsive strength
    preserved.** The existing production module stayed inside the 288px
    content column without horizontal overflow; the same internal copy and
    noisy action names remained.
    [138-production-brand-spotlight-before-320.png](screenshots/138-production-brand-spotlight-before-320.png)
118. **Routed Brand Spotlight after extraction at desktop — editorial
    production boundary verified.** The feed imports the exported renderer and
    selector, preserves the production card geometry, uses the canonical
    publication route, and presents only the logo, concise topic summary, and
    eligible stories.
    [139-production-brand-spotlight-after-1280.png](screenshots/139-production-brand-spotlight-after-1280.png)
119. **Routed Brand Spotlight after extraction at 320px — phone contract
    verified.** The module remains 288px wide inside the 320px viewport, stacks
    stories in reading order, and has no horizontal overflow.
    [140-production-brand-spotlight-after-320.png](screenshots/140-production-brand-spotlight-after-320.png)
120. **Direct Storybook Brand Spotlight at desktop — exact production boundary
    specified.** Storybook renders the exported component with a compact
    production fixture. Interaction checks cover concise story actions,
    canonical publication navigation, the 44px publication target, and hidden
    diagnostic copy.
    [141-storybook-brand-spotlight-1280.png](screenshots/141-storybook-brand-spotlight-1280.png)
121. **Direct Storybook Brand Spotlight at 320px — production parity and
    responsive contract verified.** The direct story uses the production
    288px module, stacks the featured and secondary stories without overflow,
    and is locked by a dedicated visual baseline.
    [142-storybook-brand-spotlight-320.png](screenshots/142-storybook-brand-spotlight-320.png)
122. **Routed onboarding interests before extraction — production contract
    recorded.** The live app established the authoritative first step,
    one-or-two-interest instruction, initial disabled Continue action, image
    split, and dismissal control before the shared boundary was introduced.
    [143-production-onboarding-interests-1280.png](screenshots/143-production-onboarding-interests-1280.png)
123. **Routed onboarding live preview before extraction — interactive behavior
    recorded.** Selecting an interest updates the reader-facing preview,
    enables Continue, and preserves the selected pill treatment.
    [144-production-onboarding-preview-1280.png](screenshots/144-production-onboarding-preview-1280.png)
124. **Routed trusted-publications step before extraction — truncation defect
    identified.** The former three-column grid clipped longer publication
    names, making the available choices harder to identify and leaving the
    Storybook documentation unable to specify the real inventory accurately.
    [145-production-onboarding-brands-1280.png](screenshots/145-production-onboarding-brands-1280.png)
125. **Routed onboarding completion before extraction — account boundary
    recorded.** Production offers Continue without account and Save my feed;
    the latter hands off to the existing local/Google account dialog rather
    than embedding authentication inside onboarding.
    [146-production-onboarding-account-1280.png](screenshots/146-production-onboarding-account-1280.png)
126. **Previous onboarding documentation — specification drift identified.**
    The static page described invented welcome, interest-count, publication,
    and action requirements instead of executing the routed component.
    [147-storybook-onboarding-docs-before-1280.png](screenshots/147-storybook-onboarding-docs-before-1280.png)
127. **Routed onboarding interests after extraction — shared boundary
    verified.** Production now imports
    `src/components/hearst-plus/onboarding-modal.tsx`; the visual structure is
    preserved while the Close target meets the 44px baseline.
    [148-production-onboarding-interests-after-1280.png](screenshots/148-production-onboarding-interests-after-1280.png)
128. **Routed trusted-publications step after extraction — full-name treatment
    verified.** The shared two-column layout displays all 29 publication
    choices without truncating names and retains optional selection.
    [149-production-onboarding-brands-after-1280.png](screenshots/149-production-onboarding-brands-after-1280.png)
129. **Routed onboarding at 320px after extraction — phone contract verified.**
    The decorative image is omitted, interests remain horizontally available,
    primary controls meet the 44px target, and the document has no horizontal
    overflow.
    [150-production-onboarding-mobile-after-320.png](screenshots/150-production-onboarding-mobile-after-320.png)
130. **Direct Storybook onboarding interests — exact production component
    specified.** The story imports the shared boundary and locks disabled,
    selected, two-interest-limit, live-preview, initial-focus, Escape,
    reopening, and focus-restoration behavior.
    [151-storybook-onboarding-interests-after-1280.png](screenshots/151-storybook-onboarding-interests-after-1280.png)
131. **Rewritten onboarding journey documentation — executable states
    embedded.** The page documents the actual production rules, accessibility
    contract, source ownership, and account boundary, and embeds isolated
    direct stories instead of duplicating UI markup.
    [152-storybook-onboarding-docs-after-1280.png](screenshots/152-storybook-onboarding-docs-after-1280.png)
132. **Production and Storybook interests comparison — structural parity
    verified.** The routed app and direct story share component geometry,
    content hierarchy, controls, and state treatment; only surrounding canvas
    context differs.
    [153-onboarding-interests-production-vs-storybook.png](screenshots/153-onboarding-interests-production-vs-storybook.png)
133. **Production-before and shared trusted-publications comparison — defect
    removal verified.** The earlier routed grid truncates long names; the
    shared component used by current production and Storybook exposes the same
    inventory in a readable two-column grid.
    [154-onboarding-brands-production-vs-storybook.png](screenshots/154-onboarding-brands-production-vs-storybook.png)
134. **Onboarding quality gates — current checkout verified.** Four direct
    interaction/accessibility stories pass; the 47-case visual suite includes
    desktop interests, desktop publications, 320px onboarding, and the
    stakeholder console at desktop and 320px; all 214 stories pass 856
    responsive checks; all 17 docs pass 34 checks; unit tests,
    Storybook build, TypeScript, focused lint, and the 1,036-page Next.js build
    pass. The index contains 231 entries across 66 titles.
135. **Routed stakeholder console before extraction — accessibility defects
    measured.** On the production `?demo=1` route, focus remained on the
    underlying opener after the modal appeared and the Close control measured
    28 by 28 pixels. Body scrolling was blocked, but the keyboard contract was
    incomplete.
    [01-production-stakeholder-console-before.png](../playwright/storybook-reaudit-2026-07-27/01-production-stakeholder-console-before.png)
136. **Routed stakeholder console after extraction — production behavior
    verified.** The routed page imports the public console renderer while
    retaining its live score, current feed state, inventory, eligibility,
    profile signals, and route-specific implementation guides. Opening now
    focuses the 44 by 44 Close control, blocks body scroll, isolates the page
    behind the dialog, and preserves the existing stakeholder content.
    [02-production-stakeholder-console-after.png](../playwright/storybook-reaudit-2026-07-27/02-production-stakeholder-console-after.png)
137. **Direct Storybook stakeholder console — exact renderer specified.**
    Storybook mounts the exported production renderer with a deterministic
    view model and exposes ranked, no-eligible-story, and responsive phone
    states. Interaction coverage verifies daypart and next-day changes,
    behavior presets, reset, initial focus, Escape, exact focus restoration,
    reopening, and the 44px Close target.
    [03-storybook-stakeholder-console-after.png](../playwright/storybook-reaudit-2026-07-27/03-storybook-stakeholder-console-after.png)
138. **Stakeholder console at 320px — responsive contract verified.** The
    dedicated baseline shows the production renderer at an exact 320 by 844
    viewport. Controls stack in reading order, phone buttons retain 44px
    targets, dialog content scrolls internally, and the document has no
    horizontal overflow.
    [stakeholder-personalization-console-320.png](../../tests/visual-baselines/stakeholder-personalization-console-320.png)
139. **Modal focus regression exposed by the complete suite — fixed and
     reverified.** The reader-overlay boundary check could measure the
     focusable set while the production article was still replacing its
     loading state. The scenario now waits for the deterministic article
     heading before measuring the boundary and confirms that the intended last
     control actually owns focus before pressing Tab. The production dialog
     shell also treats a focused node that is no longer in the current
     focusable set as outside the valid loop, so an async disabled or replaced
     control cannot let keyboard focus escape. The focused five-story reader
     suite, TypeScript, focused lint, and a subsequent complete 214-story
     browser run pass.
140. **Current-checkout quality gates after stakeholder extraction — verified.**
    The final run passes 98 unit tests, all 214 Storybook
    interaction/accessibility tests, 47 visual baselines, 856 responsive
    render/overflow checks, and 34 documentation checks. TypeScript and focused
    lint pass; the Storybook static build completes; the Next.js production
    build compiles and generates all 1,036 static pages; `/index.json` contains
    231 entries across 66 titles.
141. **Destination configuration and personalization scoring — shared
     production contract verified.** The 818-line pure model is no longer
     embedded in the 6,812-line page composition. The routed app and direct
     Storybook console now import the same destination configs, onboarding
     signal application, daypart missions, additive score breakdown, return
     suppression, next-edition novelty, explanation, and diversity ranking.
     The Storybook interaction genuinely reranks its deterministic inventory:
     the captured next-day state selects a new top story, reports freshness,
     daypart, behavior, and novelty inputs, produces total score 230, retains
     focus on the activated control, has zero horizontal overflow, and produces
     no browser warnings or errors in a clean tab. Seven new model tests raise
     the complete unit gate to 98. The final Storybook home-page chunk is
     783.26 kB, 49.55 kB below the preceding verified build.
     [04-storybook-production-scoring-model.png](../playwright/storybook-reaudit-2026-07-27/04-storybook-production-scoring-model.png)
142. **Video-destination eligibility and queue orchestration — shared
     production contract verified.** The routed Videos destination, generic
     vertical-video carousel, and integrated Storybook story now consume
     `src/lib/hearst-video-destination-model.ts` for playable-card eligibility,
     stale source-filter removal, exact portrait detection, Delish Shorts
     promotion and deduplication, progressive-feed merging, scoped availability,
     and lead/recommended/trending queue construction. One deterministic
     exact-9:16 Delish fixture makes the promotion path executable. The current
     browser capture shows the promoted Delish Short between the lead and
     recommended queue, with the same all-brand sidebar and trending rail used
     by production. Opening the Short creates the route-preserving dialog;
     closing it removes the dialog and restores focus to the exact card opener.
     The direct canvas reports no horizontal overflow and no browser warnings
     or errors. Nine new model tests raise the unit gate to 107; both integrated
     Videos Feed baselines and the direct vertical-carousel baseline pass; all
     214 stories pass 856 responsive checks and all 17 docs pass 34 checks.
     A subsequent production-reader boundary correction restores the complete
     Storybook interaction gate to 214/214. The complete visual run still
     exposes 15 broader baseline differences. The
     Storybook and Next.js production builds pass, including 1,036 generated
     pages. `home-page.tsx` is now 6,789 lines and 288,982 bytes; its Storybook
     chunk is 783.49 kB.
     [05-production-video-destination-model.png](../playwright/storybook-reaudit-2026-07-27/05-production-video-destination-model.png)
143. **Publication-reader focus boundary — async-safe and green.** The
     production dialog shell now keeps focus inside the modal when an active
     control is disabled or replaced during an article update. The integrated
     Storybook scenario waits for the deterministic article state and confirms
     the intended boundary control owns focus before exercising forward and
     reverse wrapping. The focused five-test reader suite, TypeScript, focused
     lint, 107 unit tests, and the complete 214-test Storybook interaction gate
     pass.
144. **Visual-regression review is now scoped case by case.** The checker
     accepts `--case=<name>`, allowing one reviewed production-backed baseline
     to be updated and verified without rewriting the remaining catalog.
     `production-modules-compact-grid-320` is pinned to the Cosmopolitan brand
     used by its production fixture and now passes at 0% difference with no
     320px overflow. `special-offers-390` was compared with the current
     tokenized production component and also passes its reviewed baseline at
     0%. Thirteen visual differences remain unreviewed; none is considered
     approved merely because the current source changed.
145. **Editorial-card destination theme — production parity restored.** The
     direct Article river card, Featured article card, and Rich photo gallery
     stories previously opened under the generic `hearst-all` theme even
     though their deterministic fixtures and production use site belong to the
     Lifestyle destination. All three stories now default to
     `hearst-lifestyle`, while continuing to render the exported production
     components and accepting explicit toolbar brand changes. At 320px, the
     routed Lifestyle card and the direct Storybook card share the 288px card
     width, Newsreader headline role, Lifestyle primary focus treatment, saved
     state, action model, and zero horizontal overflow. The focused three-test
     story suite, TypeScript, lint, Storybook build, and reviewed visual case
     pass; the scoped baseline reports 0% difference.
     [07-production-article-river-card-320.jpg](../playwright/storybook-reaudit-2026-07-27/07-production-article-river-card-320.jpg)
     [08-production-article-river-card-saved-focus-320.jpg](../playwright/storybook-reaudit-2026-07-27/08-production-article-river-card-saved-focus-320.jpg)
     [09-storybook-article-river-card-lifestyle-320.jpg](../playwright/storybook-reaudit-2026-07-27/09-storybook-article-river-card-lifestyle-320.jpg)
146. **Trending-rail allocation drift — duplicate Storybook logic removed.**
     The direct article and video rail stories previously reimplemented
     popularity sorting, brand diversity, and lead exclusion inside the story
     file. That copied logic could silently diverge from the routed app.
     Storybook now calls `allocateStoryModules` and
     `buildVideoDestinationQueue`, including the same promoted Delish portrait
     exclusion used by production. The stories continue to use deterministic
     checked-in editorial content, while the routed app reflects the current
     live feed; exact titles therefore need not match, but allocation,
     component structure, brand tokens, and behavior now share the production
     implementation. At 390px, both article and video modules measure 358px
     wide with zero horizontal overflow. The focused six-story interaction
     suite, 107 unit tests, TypeScript, focused lint, and Storybook build pass.
     The two article baselines and mobile video baseline were reviewed,
     refreshed, and independently rerun at 0% difference.
     [10b-storybook-trending-rail-lifestyle-390.jpg](../playwright/storybook-reaudit-2026-07-27/10b-storybook-trending-rail-lifestyle-390.jpg)
     [11-storybook-trending-rail-lifestyle-1280.jpg](../playwright/storybook-reaudit-2026-07-27/11-storybook-trending-rail-lifestyle-1280.jpg)
     [12-storybook-trending-videos-390.jpg](../playwright/storybook-reaudit-2026-07-27/12-storybook-trending-videos-390.jpg)
     [13-production-trending-videos-390.jpg](../playwright/storybook-reaudit-2026-07-27/13-production-trending-videos-390.jpg)
147. **Today’s Edit allocation and image readiness — production contract
     restored.** The Storybook story previously assembled Horoscope, Continue
     Reading, followed-brand, and trending cards by taking arbitrary adjacent
     fixture records. It now uses `allocateStoryModules`, including hero
     reservation, a genuine continuation ID, followed-brand preference,
     popularity ranking, and horoscope detection. At 768px, Storybook and the
     routed Hearst+ page both render a 720px strip, four 291.83px snap cards, a
     44px next control, 1,167px scroll track, and zero page overflow. At 1280px,
     both render a 1,184px strip with four equal 295.5px columns and no carousel
     arrows. The visual runner now waits for CSS background images to load and
     decode, not only `<img>` elements, before capturing; two tablet runs and
     three desktop runs repeat at 0% difference. All seven focused Storybook
     scenarios, TypeScript, focused lint, and the Storybook build pass.
     [14-storybook-todays-edit-768.jpg](../playwright/storybook-reaudit-2026-07-27/14-storybook-todays-edit-768.jpg)
     [15-production-todays-edit-768.jpg](../playwright/storybook-reaudit-2026-07-27/15-production-todays-edit-768.jpg)
     [16-storybook-todays-edit-1280.jpg](../playwright/storybook-reaudit-2026-07-27/16-storybook-todays-edit-1280.jpg)
148. **Featured Carousel visual failures — confirmed as capture timing, not
     component drift.** The mixed desktop edition, mobile edition, and saved
     state all render the exported production `FeaturedStoryCarousel`; the
     story supplies deterministic mixed article/video content and production
     imagery while the component owns navigation, active-slide semantics,
     actions, responsive treatment, and reduced-motion behavior. After the
     visual runner began waiting for CSS background images to load and decode,
     all three previously failing cases pass their existing reviewed baselines
     without changing component or story code: 0.001%, 0.002%, and 0.001%
     changed pixels, respectively. All seven focused interaction scenarios
     pass, and the dedicated accessibility traversal passes all five slide
     transitions at 1,280px and 320px.
149. **Complete visual catalog — reviewed and green.** River advertisement,
     Brand Spotlight, and the mobile stakeholder console pass their existing
     production-backed references once CSS background images are decoded.
     The desktop stakeholder console had a genuine state-race: its interaction
     scenario closes and reopens the dialog while the visual runner is
     capturing. A separate `Desktop: open production console` story now owns
     the stable visual state, while the original story remains the interaction
     contract. The runner also gives every story an isolated browser context
     and bounded recapture on a failed comparison, preventing Storybook
     globals, storage, or rasterization state from leaking between cases.
     After refreshing only reviewed references under that final capture
     contract, the complete 47-case suite passes. The current checkout also
     passes all 215 Storybook interaction/accessibility scenarios, 860
     responsive checks across 320, 390, 768, and 1,280px, 34 checks across 17
     documentation pages, 107 unit tests, TypeScript, focused lint, the
     carousel accessibility traversal, and the Storybook production build.
150. **Governance and release policy — made visible without overstating
     enforcement.** The repository already defines accountable review roles,
     production-backed story acceptance, patch/minor/major classification,
     deprecation timing, pull-request evidence, and a release checklist in
     `CONTRIBUTING.md` and `CHANGELOG.md`, but none of the 17 indexed
     documentation pages exposed those rules to Storybook stakeholders. The
     new **Delivery / Governance** page records production components, routes,
     and canonical tokens as the authority; maps the current review roles;
     documents contribution, deprecation, and release evidence; and explicitly
     states that a Storybook build is not a production release. It also exposes
     two current governance gaps instead of presenting aspirations as
     enforcement: no `CODEOWNERS` file maps the roles to real GitHub identities,
     and no formal versioned package release is established. The Storybook
     overview now routes public component, token, and release-policy changes to
     this page. The fresh static build contains 233 entries: 215 stories and 18
     docs. TypeScript passes, and all 36 documentation checks pass at 390 and
     1,280px with headings, no Storybook error display, no browser errors, and
     no horizontal page overflow.
     [17-governance-1280.png](../playwright/storybook-reaudit-2026-07-27/17-governance-1280.png)
     [18-governance-390.png](../playwright/storybook-reaudit-2026-07-27/18-governance-390.png)
151. **Delivery / Quality — aspirational operations replaced with current
     repository evidence.** The previous page stated that every token change
     used a six-status Jira lifecycle, QA approval blocked merge, Jira
     transitioned automatically, Netlify deployed automatically, Slack
     notifications were sent, and running `push-figma` plus `push-pencil`
     synchronized external tools. The current checkout does not contain Jira,
     branch-protection, Slack, or preview-deployment automation that proves
     those claims. It does contain a repository quality workflow, Netlify build
     configuration, comprehensive local quality scripts, and token-payload
     generators. The corrected specification now separates implemented,
     documented-but-unenforced, externally verified, and missing controls. It
     documents the production-parity review contract, automated and manual
     pull-request evidence, token and visual-regression checkpoints, current
     release limitations, and the remaining governance backlog. It also
     clarifies the scripts' actual behavior: `push-to-figma.ts` and
     `push-to-pencil.ts` print payloads; an authorized external tool call and
     destination-side verification are still required before synchronization
     can be claimed. The page renders cleanly in the in-app Storybook, the
     static build passes, TypeScript passes, and all 36 checks across 18 docs
     pass at 390 and 1,280px without render errors, browser errors, missing
     headings, or horizontal page overflow.
     [19-quality-evidence-1280.png](../playwright/storybook-reaudit-2026-07-27/19-quality-evidence-1280.png)
     [20-quality-evidence-390.png](../playwright/storybook-reaudit-2026-07-27/20-quality-evidence-390.png)
152. **Token Workflow, Figma, and Pencil — authority and synchronization
     claims reconciled with executable behavior.** The former workflow stated
     that `push-figma` and `push-pencil` made tokens appear in their
     destinations, that merging to `main` automatically deployed production,
     and that Pencil was the required handoff layer with pixel-identical
     production components. Current script execution disproves those broad
     claims. `push-to-figma.ts` prints one collection with 29 modes, 774
     variables, and 22,432 mode values; `push-to-pencil.ts` prints 1,042
     variables across 29 themes. Neither script makes an external write,
     selects a destination, or verifies a revision. The checked-in Pencil file
     is `homepage-version3.pen`, while the separate Token Studio direct-write
     script targets `../../hearst-brands.pen`, and the legacy
     `sync-from-pencil.ts` path can regenerate application output from a
     different source. The three Storybook pages now define canonical Git
     tokens as the editing authority, generated CSS and TypeScript as the
     production application output, production React/routes as behavioral
     authority, and Figma/Pencil as optional downstream consumers requiring an
     authorized write plus destination-side verification. The generator
     comments and terminal guidance now match their actual payload-only
     behavior. The pages record evidence-based statuses, production-parity and
     release rules, external-tool security boundaries, the Pencil legacy-path
     conflict, and the absence of repository-owned sync receipts or round-trip
     checks. The Storybook static build and TypeScript pass; all 36 checks
     across 18 docs pass at 390 and 1,280px. Fresh in-app review finds all
     three page IDs, headings, and canvases without Storybook errors.
     [21-token-workflow-1280.png](../playwright/storybook-reaudit-2026-07-27/21-token-workflow-1280.png)
     [22-token-workflow-390.png](../playwright/storybook-reaudit-2026-07-27/22-token-workflow-390.png)
     [23-figma-delivery-1280.png](../playwright/storybook-reaudit-2026-07-27/23-figma-delivery-1280.png)
     [24-figma-delivery-390.png](../playwright/storybook-reaudit-2026-07-27/24-figma-delivery-390.png)
     [25-pencil-delivery-1280.png](../playwright/storybook-reaudit-2026-07-27/25-pencil-delivery-1280.png)
     [26-pencil-delivery-390.png](../playwright/storybook-reaudit-2026-07-27/26-pencil-delivery-390.png)
153. **Root design-system specification — replaced with a current,
     production-authoritative contract.** `DESIGN-SYSTEM-SPEC.md` was a
     frequently referenced 898-line source that still made Pencil the required
     approved handoff layer, promised pixel-identical components, treated
     payload generation as completed synchronization, instructed designers and
     developers to use legacy bidirectional token paths, and depicted merges
     as automatic Netlify releases. The replacement is a 408-line specification
     grounded in current files and executable behavior. It defines authority
     for canonical tokens, production components/routes, generated application
     output, Storybook, Figma, Pencil, and CI; records the four component
     layers; establishes production-backed story acceptance; documents current
     token structure, naming, Tailwind/CSS consumption, publication layering,
     typography/assets/icons, external-tool delivery, quality, governance,
     compatibility, and release evidence; and lists the current gaps without
     presenting them as implemented controls. Every referenced repository path
     exists. All illustrated canonical token names were checked against current
     JSON. The stale Pencil-first, pixel-parity, automatic synchronization, and
     automatic-deployment claims are absent except where explicitly negated or
     recorded as gaps. The subsequent Storybook static build, TypeScript, and
     all 36 responsive documentation checks across the 18 indexed docs pass.
154. **Delivery / Workflow — obsolete routes and unsupported operating claims
     replaced with a production-authoritative contribution path.** The former
     workflow page framed this checkout as a sandbox while naming an external
     repository as the official implementation without current evidence. It
     also linked to nine obsolete Storybook IDs, described Figma and Pencil
     payload generation as completed synchronization, treated Pencil as a
     precision handoff requirement, implied that generator scripts consumed
     destination credentials directly, and overstated AI-enabled IDE authority
     and automated status transitions. The replacement starts with the current
     authority model: routed production components own behavior, canonical Git
     tokens own design decisions, generated CSS and TypeScript are application
     output, Storybook specifies supported production behavior, and Figma or
     Pencil delivery remains optional until an authorized write is verified at
     the destination. It now gives designers and developers the same owning-
     surface decision table, production-backed review steps, current repository
     commands, explicit automated-versus-manual controls, review evidence,
     evidence-state definitions, and current limitations. All nine current
     Storybook links resolve against the rebuilt `index.json`; representative
     Token Workflow and Governance destinations render with the expected
     headings in the in-app browser. The static build and TypeScript pass, and
     all 36 checks across 18 docs pass at 390 and 1,280px without render errors,
     browser errors, missing headings, or horizontal page overflow.
     [27-workflow-1280.png](../playwright/storybook-reaudit-2026-07-27/27-workflow-1280.png)
     [28-workflow-390.png](../playwright/storybook-reaudit-2026-07-27/28-workflow-390.png)
155. **Delivery / AI Workflows — project capabilities now match the committed
     configuration instead of invented organizational roles.** The original
     catalog presented seven named agents under `.cursor/skills/`, including
     Token Architect, Figma Sync, Pencil Design, Frontend Component, Storybook
     Docs, DevOps / Deploy, and QA / Review. Those configurations do not exist
     in the checkout. Current inventory proves two reusable project skills,
     two narrow helper-agent TOML configurations owned by Impeccable, one
     project instruction file, and no dedicated token, Figma, Pencil,
     Storybook, QA, or release agent. The corrected page distinguishes skills,
     helper agents, ordinary repository commands, and environment-installed
     capabilities. It also corrects the remaining operational boundaries:
     Figma and Pencil commands print local payloads without credentials;
     external writes require separate authorization and destination evidence;
     the legacy `sync-pencil` path is not canonical; the repository quality
     workflow verifies builds but does not provide a release command; and the
     actual deployment configuration lives at `../netlify.toml`. Every named
     project file exists, every listed package command exists, and the skill
     and helper counts were derived from the current filesystem. The page
     renders with semantic headings, tables, and icon labels at desktop and
     mobile widths, and its boundary callouts use full borders instead of the
     decorative side-stripe pattern rejected by the current product-design
     guidance.
     [29-ai-workflows-1280.png](../playwright/storybook-reaudit-2026-07-27/29-ai-workflows-1280.png)
     [30-ai-workflows-390.png](../playwright/storybook-reaudit-2026-07-27/30-ai-workflows-390.png)
156. **Foundation / Grid and token-tooling references — nonexistent skills and
     payload-as-sync language removed across related documentation.** The Grid
     overview named a nonexistent
     `.cursor/skills/hearst-grid-system/SKILL.md` as its canonical automation
     brief and linked three additional skill names that are not committed
     project capabilities. It now gives human and AI-assisted contributors the
     same evidence hierarchy: production `grid.tsx`, layout tokens in
     `globals.css`, component metadata, runnable Grid stories, and the
     stakeholder guide. The implementation checklist now covers the actual
     `rowStart*` API and explicitly treats session-installed tools as
     environment-specific. A related cross-document search also found Token
     Naming still claiming that `push-pencil` added a `$` prefix and that both
     external-tool commands completed synchronization. Current generator code
     disproves those claims: Pencil preserves the canonical key, Figma uses
     slash-grouped display names plus canonical CSS code syntax, and both
     commands print JSON only. Token Naming, Toolbox, and the Pencil generator
     header now state those exact behaviors.
     [31-grid-guidance-1280.png](../playwright/storybook-reaudit-2026-07-27/31-grid-guidance-1280.png)
     [32-grid-guidance-390.png](../playwright/storybook-reaudit-2026-07-27/32-grid-guidance-390.png)
157. **Start / Architecture — current production boundaries verified and
     preserved.** The page's route, theme, reader-state, feed-template, static
     inventory, refresh-pipeline, personalization, and Storybook-provider
     claims resolve to current source. Shareable reader URLs exist under
     `src/app/read/[storyId]/`; routed destination/category pages use
     `ThemeProvider` and `HomePageTemplate`; `ReaderAccountProvider` persists
     the documented demo state in browser storage; the Storybook theme
     decorator supplies `ReaderAccountProvider`; the integrated Hearst+ story
     supplies its explicit theme; and `feed:refresh` runs import, enrichment,
     validation, and fixture-generation steps in the documented order. The
     page correctly labels browser-local personalization as prototype behavior,
     not a deployed machine-learning service, so no architecture copy change
     was required. The shared Hearst+ specification callout was simplified to
     a full border, removing the same decorative side-stripe anti-pattern from
     all pages that use the helper. The final Storybook static build and
     TypeScript pass; all 36 checks across 18 docs pass at 390 and 1,280px
     without render errors, browser errors, missing headings, or page overflow.
     [33-architecture-1280.png](../playwright/storybook-reaudit-2026-07-27/33-architecture-1280.png)
     [34-architecture-390.png](../playwright/storybook-reaudit-2026-07-27/34-architecture-390.png)
158. **Foundation / Grid — the documented single-number API now has an exact,
     closed production contract.** The public `columns` prop previously
     accepted any number and the Grid documentation said a number fixed the
     track count across breakpoints, but the source only mapped a partial set
     of values. Counts 5, 7, 9, and 11 could therefore produce missing Tailwind
     classes, while some other values changed behavior at `md` or `lg`. The
     production component now exposes the closed `GridColumnCount` union from
     1 through 12 and maps every permitted value to explicit base, `md`, and
     `lg` classes. The responsive-object path and default page grid retain the
     established 4 / 8 / 12 contract. Storybook, component metadata, and the
     Grid guide now distinguish that page-layout default from a fixed-count
     override intended only for bounded patterns that remain usable at 320px.
     A production-backed fixed-five story asserts the exact three class names,
     and source-level tests cover all 12 counts plus the default and responsive
     object. The current checkout passes 109 unit tests, TypeScript, the static
     Storybook build, 216 browser interaction/accessibility scenarios, 864
     responsive checks across 216 stories at 320, 390, 768, and 1,280px, and
     all 36 checks across 18 docs. The reviewed desktop and 390px captures
     preserve five tracks without overflow.
     [35-grid-fixed-columns-1280.png](../playwright/storybook-reaudit-2026-07-27/35-grid-fixed-columns-1280.png)
     [36-grid-fixed-columns-390.png](../playwright/storybook-reaudit-2026-07-27/36-grid-fixed-columns-390.png)
159. **Production design-system navigation — the Storybook link now resolves
     to the current overview instead of a removed story ID.** The shared
     `NavBar` used by the routed foundation and legacy component-reference
     pages still linked both local and deployed users to
     `/docs/welcome--docs`, which is absent from the current 216-story /
     18-doc index and renders Storybook's not-found state. A single
     `STORYBOOK_OVERVIEW_PATH` now owns both URLs and targets the verified
     `hearst-plus-start-overview--docs` entry; the deployed URL retains the
     `/storybook/` base required by `netlify.toml`. A source-level contract
     test verifies the path in both URLs and the deployed base path. The
     rendered `/typography` production route exposes the corrected link, and
     the destination loads the current Hearst+ overview in the running
     Storybook. The current unit suite is 110 / 110 and TypeScript and diff
     hygiene pass.
     [38-production-storybook-link-1800.png](../playwright/storybook-reaudit-2026-07-27/38-production-storybook-link-1800.png)
160. **Token promotion safety — the validator now protects intentional
     publication overrides instead of recommending six unsafe aliases.** The
     previous `PROMOTION_MAP` paired six component roles with semantic names
     that do not exist in the canonical hierarchy and classified every pair as
     promotable without checking a single publication mode. Current resolved
     token evidence disproves four of those recommendations: inline-link
     default and hover colors diverge in 16 and 9 modes, Car and Driver's brand
     divider intentionally differs from `palette.brand.1`, and Delish's full
     rating star intentionally differs from the shared highlight color. The
     validator now targets the real canonical `palette.*` paths, resolves each
     component and target value through all 29 brand files, reports the
     specific blocking modes, and permits only the default divider border and
     empty rating star. A unit specification locks the 2-safe / 4-blocked
     result and the two named publication exceptions. Token Workflow gives
     stakeholders the same decision table and explicitly separates eligibility
     from consumer migration or deletion. The current token structure and
     no-regression gates pass with 673 known violations, 16 resolved since the
     baseline, and zero regressions. The checkout also passes 111 unit tests,
     TypeScript, the static Storybook build, all 36 documentation checks, and
     864 responsive checks across 216 stories. The reviewed documentation
     captures remain readable and overflow-free at desktop and 390px.
     [39-token-promotion-safety-1280.png](../playwright/storybook-reaudit-2026-07-27/39-token-promotion-safety-1280.png)
     [40-token-promotion-safety-390.png](../playwright/storybook-reaudit-2026-07-27/40-token-promotion-safety-390.png)
161. **Keyboard focus and motion gates — two intermittent browser contracts
     are now deterministic without weakening production behavior.** The first
     complete 216-scenario run exposed Today’s Edit retaining focus on its
     forward arrow while an animated tablet scroll was still settling.
     Keyboard activation now scrolls immediately so the newly available
     reverse control receives focus as soon as the activated arrow disappears;
     pointer activation retains the reviewed smooth motion, and reduced-motion
     users also receive the immediate path. Its seven-scenario focused suite
     passed three consecutive runs. The next complete run exposed a different
     test race in the progressively loaded Content Reader: the story captured a
     “last” focusable element, yielded, then additional reader content extended
     the boundary before the Tab event. The production focus trap already
     derives its boundary at event time, so the specification now dispatches
     cancellable forward and reverse Tab events synchronously from the captured
     boundary and asserts both cancellation and the wrapped focus target. The
     five-scenario reader suite also passed three consecutive runs. After both
     corrections, the complete 49-file browser gate passes all 216 interaction
     and accessibility scenarios; 111 unit tests, TypeScript, the static
     Storybook build, 864 responsive checks, and 36 documentation checks also
     pass.
     [41-today-edit-keyboard-focus-tablet.png](../playwright/storybook-reaudit-2026-07-27/41-today-edit-keyboard-focus-tablet.png)
     [42-reader-focus-boundary-1280.png](../playwright/storybook-reaudit-2026-07-27/42-reader-focus-boundary-1280.png)
162. **Components / Inventory — stale machine-readable coverage replaced by a
     current, bounded production-evidence contract.** The committed component
     index was last generated on April 7 and reported 65 implementation
     modules, while the current checkout contains 101. The metadata schema also
     says each component receives a sibling metadata file, but current source
     contains only six, a 5.9% implementation-module coverage rate. The
     inventory page previously omitted both facts and listed Card, Carousel,
     Tabs, and Select alongside directly cataloged primitives even though none
     has a dedicated primitive story. The indexer now records namespace and
     sibling-metadata coverage for all 101 current `src/components/**/*.tsx`
     modules, preserves its generation timestamp when source evidence is
     unchanged, and supports a failing `--check` mode. Storybook start and
     static-build scripts refresh the registry first, while the repository
     quality gate rejects a stale committed report. The inventory page reads
     the running `/index.json` for its exact 216-story, 18-doc, 67-group, and
     234-entry catalog totals; reads the generated registry for 101
     implementation modules, 29 Hearst+ modules, and 6/101 structured metadata
     coverage; separates implementation presence from direct Storybook
     specification; names the four uncovered primitive families; and states
     that production ownership still requires shipped source plus an
     application import site. Playwright also exposed a shared docs hydration
     error caused by an MDX paragraph nested inside the specification helper's
     paragraph. The helper now uses a neutral container and the reload has
     semantic paragraph content without console errors. The current checkout
     passes the freshness check, 111 unit tests, TypeScript, the static
     Storybook build, all 216 interaction/accessibility scenarios, all 864
     responsive checks, and all 36 documentation checks. Reviewed desktop and
     390px captures show the live evidence and registry limits without
     horizontal overflow.
     [43-component-inventory-desktop.png](../playwright/storybook-reaudit-2026-07-27/43-component-inventory-desktop.png)
     [44-component-inventory-mobile.png](../playwright/storybook-reaudit-2026-07-27/44-component-inventory-mobile.png)
163. **HDS Primitives / Card, Carousel, and Tabs — direct specifications added
     only where current production use proves ownership.** Current source search
     finds 18 production import sites for Card, two for Carousel
     (`content-carousel.tsx` and `carousel-page.tsx`), and four for Tabs
     (`token-dashboard.tsx`, `card-page.tsx`, `tokens-page.tsx`, and
     `button-page.tsx`). Select has no application import site; its only
     consumer is the explicitly non-indexed
     `src/storybook-candidates/Select.candidate.tsx`, so it remains quarantined
     instead of being made to look production-owned through documentation
     alone. The catalog now renders the exact production primitives through
     three Card states, four Carousel states, and four Tabs states. Those
     specifications cover complete and compact Card anatomy; horizontal,
     responsive multi-item, vertical, and single-slide Carousel boundaries;
     and default, line, vertical, and disabled Tabs behavior. Interaction
     checks verify Carousel direction and disabled controls plus Tabs
     selection, vertical roving focus/manual activation, and disabled
     non-selection. Implementing the stories exposed two source defects:
     vertical Carousel still listened to Left/Right rather than Up/Down, and
     Tabs advertised vertical orientation in a data attribute without passing
     it to Base UI. Both production wrappers now implement the orientation
     contract. Carousel and Tabs also have structured metadata, increasing the
     current registry from 6/101 to 8/101 (7.9%). The first four-viewport run
     caught the new examples sizing against the browser viewport plus
     Storybook canvas padding; the stories now size against a fullscreen,
     border-box canvas and the rebuilt static catalog passes all 908 checks
     across 227 stories at 320, 390, 768, and 1,280px. The complete browser
     interaction/accessibility suite passes all 227 scenarios across 52 files;
     111 unit tests, TypeScript, the registry freshness check, the static
     Storybook build, and all 36 checks across 18 docs also pass. The rebuilt
     `/index.json` contains 227 stories, 18 docs, 70 catalog groups, and 245
     total entries. Reviewed captures show corrected Card evidence, horizontal
     and vertical Carousel keyboard states, vertical Tabs at 390px, and the
     live catalog totals without overflow or browser errors.
     [45-card-complete-anatomy-1280.png](../playwright/storybook-reaudit-2026-07-27/45-card-complete-anatomy-1280.png)
     [46-carousel-horizontal-1280.png](../playwright/storybook-reaudit-2026-07-27/46-carousel-horizontal-1280.png)
     [47-carousel-vertical-390.png](../playwright/storybook-reaudit-2026-07-27/47-carousel-vertical-390.png)
     [48-tabs-vertical-390.png](../playwright/storybook-reaudit-2026-07-27/48-tabs-vertical-390.png)
     [49-component-inventory-1280.png](../playwright/storybook-reaudit-2026-07-27/49-component-inventory-1280.png)
164. **Component metadata — file presence is no longer presented as accurate
     specification evidence.** The component index previously counted a sibling
     `*.metadata.ts` file without checking any claim inside it. Applying a
     source-graph validator to the eight existing records found only two valid:
     six contained stale public exports, omitted current component
     dependencies, named removed consumers, or missed current consumers.
     `ContentCarousel` also still described itself as a Pencil-port artifact
     even though production source and tokens are the authority. The indexer now
     loads each metadata record and compares its implementation path, public
     exports, component imports, and reverse consumer graph with the current
     checkout. `npm run index:check` fails for either a stale generated registry
     or any metadata drift. All eight prior records were corrected, including
     current ArticleCard, Button, Card, Grid, ContentCarousel, and SpecialOffers
     relationships; ContentCarousel now documents its shipped fixed treatment
     and reuse boundary without treating Pencil as source authority. Six
     high-use, directly specified primitives—Accordion, Avatar, Badge, Divider,
     Input, and Link—now have source-backed metadata. Badge and Input explicitly
     record their remaining fixed Tailwind status-color debt instead of
     implying complete token coverage. Coverage therefore rises from 8/101
     (7.9%) to 14/101 (13.9%), while validity is a separate 14/14 gate. The
     inventory page exposes both figures and explains exactly what is checked;
     it continues to state that file discovery is not production ownership.
     The current checkout passes the metadata freshness/validity gate, 111 unit
     tests, TypeScript, the static Storybook build, all 227 browser
     interaction/accessibility scenarios, all 908 responsive checks across
     320, 390, 768, and 1,280px, and all 36 documentation checks. The reviewed
     capture shows the new coverage and validity rows without overflow or
     browser errors.
     [50-component-metadata-validation-1280.png](../playwright/storybook-reaudit-2026-07-27/50-component-metadata-validation-1280.png)
165. **Production ownership — demo-only primitives no longer appear as shipped
     product specifications.** The repository is private and has no package
     export or publishable-files boundary, so a source file or polished
     Storybook example cannot establish production ownership by itself. Current
     source-graph evidence found no application route or application import for
     Alert, Switch, or Textarea; Toggle is imported only by the also-unused
     ToggleGroup primitive. Their indexed stories nevertheless presented them
     alongside shipped components, and several descriptions named nonexistent
     `component-alert-*` tokens or the wrong `--brand-primary` role. The four
     exploratory story files were moved—not deleted—to the explicitly
     non-indexed `src/storybook-candidates/` directory, their token claims were
     corrected, and the inventory now lists all five quarantined candidates,
     including the already-quarantined Select, with exact promotion
     requirements. The generated component registry now records current
     `applicationUseSites` and `storybookStories` separately, excluding stories,
     tests, candidates, and metadata from application-use evidence. This keeps
     SpecialOffers, Accordion, Avatar, Badge, Input, Link, and other
     production-used components in the official catalog while making the
     ownership boundary machine-readable. The rebuilt `/index.json` therefore
     contains 208 stories, 18 docs, 66 catalog groups, and 226 total entries,
     down from 227 / 18 / 70 / 245 without removing production behavior. All
     208 interaction/accessibility scenarios pass, as do 832 responsive checks
     across 320, 390, 768, and 1,280px and all 36 documentation checks. The
     responsive harness now retries a first failure once in a fresh page and
     reports recovered retries separately; this complete run required no
     retries, so persistent defects remain failing evidence rather than being
     hidden by the stabilization.
     [51-production-owned-catalog-1280.png](../playwright/storybook-reaudit-2026-07-27/51-production-owned-catalog-1280.png)
     [52-quarantined-candidates-1280.png](../playwright/storybook-reaudit-2026-07-27/52-quarantined-candidates-1280.png)
166. **Component ownership registry — relative imports and Storybook support
     tooling no longer distort production evidence.** The first ownership
     scanner recognized only `@/components/...` imports and treated every
     TypeScript file under `src/stories/` as a story. It therefore missed real
     relative consumers such as `home-page.tsx` importing BigStory,
     BigStoryFeed, and FourAcrossGrid, while falsely attributing shared fixture
     files such as `article-data.tsx` as indexed specifications. The scanner now
     resolves local alias and relative imports to current `.ts`, `.tsx`, and
     directory-index modules, builds the importer map once, and recognizes only
     `*.stories.ts(x)` files as direct story evidence. Re-running the corrected
     graph leaves one catalog-only implementation under `src/components`:
     `VisualInspector`. Its React-fiber lookup, debug overlays, fixed inspection
     controls, and sole Storybook/candidate use prove that it is authoring
     tooling rather than shipped UI. The implementation was moved intact to
     `src/stories/support/visual-inspector.tsx`; the Home Page inspection story
     and quarantined Article Page candidate now import it from that explicit
     support boundary. The production registry consequently reports 100 rather
     than 101 component modules, 14/100 structured metadata coverage, and 14/14
     valid records, while the working inspector remains available to
     stakeholders. TypeScript, the static build, all 208
     interaction/accessibility scenarios, all 832 responsive checks, and all
     36 documentation checks pass. The reviewed captures show both the
     corrected production count and the active inspector with no browser
     errors.
     [53-corrected-production-inventory-1280.png](../playwright/storybook-reaudit-2026-07-27/53-corrected-production-inventory-1280.png)
     [54-storybook-only-inspector-1280.png](../playwright/storybook-reaudit-2026-07-27/54-storybook-only-inspector-1280.png)
167. **Component-to-story coverage — barrel imports now resolve to the actual
     production module instead of appearing undocumented.** The first direct
     story map could resolve a story importing
     `@/components/hearst-plus/onboarding-modal`, but not the normal production
     pattern of importing `HearstOnboardingModal` from the
     `@/components/hearst-plus` barrel. That undercounted most extracted
     Hearst+ boundaries and would have produced duplicate-story
     recommendations. The indexer now parses named imports, resolves direct
     local modules, follows named and star re-exports through `.ts`, `.tsx`,
     and directory-index files, and associates only the exported symbol with
     its actual component. The generated registry exposes compact top-level
     `storyCoverage` totals: 46 of 100 production component modules map to at
     least one indexed story, while 47 production-referenced modules remain in
     a human-review queue. The inventory explicitly warns that the queue mixes
     reusable components with routes, providers, page orchestrators, and
     intentionally integrated boundaries; it is not an automatic missing-story
     count. An initial MDX implementation filtered the full component graph in
     the browser and inflated the inventory bundle from about 29 kB to 106 kB.
     Moving the totals into the generator restored it to 29.76 kB. The
     freshness/metadata gate and all 36 documentation checks pass, and the
     reviewed capture shows the current 211-story catalog and source-backed
     coverage without browser errors.
     [57-component-story-coverage-1280.png](../playwright/storybook-reaudit-2026-07-27/57-component-story-coverage-1280.png)
168. **HDS Primitives / Article Card — the actual compound primitive is now
     specified, and production click cards are keyboard operable.** The
     existing “Article Card” group rendered three higher-level FRE
     compositions—BigStoryFeedStacked, FourAcrossGrid, and
     BigStoryImageRight—but never imported the `ui/article-card.tsx` primitive
     named by the group. The primitive is used by seven production modules and
     has a validated metadata record, so the catalog conflated composition
     examples with direct API coverage. Three new stories now render the exact
     compound primitive: complete vertical anatomy, compact horizontal anatomy
     at phone width, and its Phosphor missing-image boundary. Source review also
     found BigStory, BigStoryFeed, and FourAcrossGrid attaching click handlers
     to a non-focusable `<article>`. ArticleCard now derives button semantics
     and a zero-default tab stop only when an `onClick` handler exists, handles
     Enter and Space from the card itself without intercepting nested controls,
     and exposes semantic focus-ring tokens. The four production FRE call sites
     provide concise `Open story: …` names. The direct story verifies Enter
     activation through the shared component, and the earlier FRE production
     stories remain in the same group to show the abstraction in context. The
     catalog at completion of this tranche contained 211 stories and 229 total
     entries; all 211 interaction/accessibility scenarios passed, along with 844 responsive checks
     at 320, 390, 768, and 1,280px, 36 documentation checks, TypeScript, the
     registry gate, and the static build. The reviewed desktop and 390px
     captures show the focus treatment and overflow-free production anatomy.
     [55-article-card-complete-keyboard-1280.png](../playwright/storybook-reaudit-2026-07-27/55-article-card-complete-keyboard-1280.png)
     [56-article-card-horizontal-390.png](../playwright/storybook-reaudit-2026-07-27/56-article-card-horizontal-390.png)
169. **HDS Primitives / Separator — the production boundary is now specified
     without conflating it with Divider.** `src/components/ui/separator.tsx` is
     consumed by 24 production modules, making it the third-most-depended-on
     component in the generated registry, but it previously had neither a
     direct story nor structured ownership metadata. Source inspection confirms
     that it is not an alias for `Divider`: Separator wraps Base UI, exposes
     horizontal and vertical orientations, renders the accessible
     `role="separator"` contract, and uses the one-pixel semantic `bg-border`
     token; Divider renders a horizontal `<hr>` and adds thickness and emphasis
     variants. Three direct stories now specify the horizontal, vertical, and
     repeated-content contracts. Their play checks lock both
     `aria-orientation` and `data-orientation`, and the component documentation
     states when to choose Divider instead. The new metadata record lists all
     24 current production consumers, the semantic token, API variants, and the
     ownership caveat. This raises direct story coverage to 47 of 100 production
     modules and metadata coverage to 15/100, with all 15 records valid; 46
     production-referenced modules remain in the review queue. The first
     responsive run caught a Storybook-only narrow-canvas overflow in two new
     fixtures; changing those fixtures to parent-relative full-width layouts
     removed it without altering the production component. The current catalog
     contains 214 stories, 18 docs, 67 groups, and 232 entries. All 214 browser
     scenarios, 856 responsive checks at 320, 390, 768, and 1,280px, and 36
     documentation checks pass with no retry, alongside TypeScript, registry,
     and static-build gates. User impact: stakeholders can now distinguish two
     visually similar primitives by semantics and supported behavior, while
     engineers have an executable contract for a high-use layout dependency.
     Recommendation: retain both components, keep their decision boundary in
     the generated component inventory, and require any future orientation or
     styling API change to extend these direct stories. Effort: small.
     Confidence: high, based on current source, consumer graph, Base UI runtime
     semantics, and four-viewport browser evidence.
     [58-separator-horizontal-1280.png](../playwright/storybook-reaudit-2026-07-27/58-separator-horizontal-1280.png)
     [59-separator-vertical-390.png](../playwright/storybook-reaudit-2026-07-27/59-separator-vertical-390.png)
     [60-component-inventory-separator-1280.png](../playwright/storybook-reaudit-2026-07-27/60-component-inventory-separator-1280.png)
170. **Hearst+ Story Metadata — production source identity now has one
     canonical asset registry, resilient fallback behavior, and direct
     specifications.** `BrandSourceIcon` and `story-metadata` are each consumed
     by eleven production modules, including the routed home page, reader,
     recommendations, discovery, video cards, onboarding, and featured
     carousel. They previously appeared only inside larger compositions and had
     no direct ownership records. Source inspection found that
     `brand-source-icon.tsx` duplicated the complete publication favicon map
     already owned by `src/lib/logos.ts`; the two lists could silently diverge.
     It also painted icons as CSS background images, so a failed remote request
     left an empty bordered square and could not invoke a fallback. The
     production component now resolves only through `getBrandLogoSrc`, renders a
     decorative image over deterministic initials, and switches to those
     initials when the image emits an error. The visible publication name or
     parent control remains the accessible label. Five direct stories specify
     the exact 29-publication production inventory, a forced failed-asset
     fallback, the canonical publication route and 44px phone target, live
     versus standard story status, recommendation omission, and live
     article/story/publication-editor byline precedence. Structured metadata
     records identify all current consumers, tokens, dependencies, appropriate
     use, and accessibility caveats. Production and Storybook both render the
     same Country Living source-link component at 390px, with the same icon,
     type treatment, canonical `/lifestyle/country-living/` route, and 44px
     height; only the current story byline differs between live production
     inventory and the checked-in representative fixture. The routed
     comparison emitted no browser errors. Direct story coverage is now 49/100,
     metadata coverage is 17/100 with 17/17 valid records, and the
     ownership-classification queue is 44. The current catalog contains 219
     stories, 18 docs, 68 groups, and 237 entries. All 219 browser scenarios,
     876 responsive checks at 320, 390, 768, and 1,280px, and 36 documentation
     checks pass without retry, alongside TypeScript, registry, and static-build
     gates. User impact: readers keep recognizable source attribution during a
     remote-asset failure; stakeholders can review every official publication
     mark and metadata state in one production-backed surface; engineers no
     longer maintain two asset lists. Recommendation: keep `lib/logos.ts` as the
     sole identity source and require any publication addition to pass the
     29-brand inventory story, fallback story, route assertion, and source-graph
     metadata gate. Effort: small. Confidence: high, based on current production
     source, direct failure simulation, routed-app comparison, and complete
     four-viewport catalog evidence.
     [61-production-country-living-source-390.png](../playwright/storybook-reaudit-2026-07-27/61-production-country-living-source-390.png)
     [62-storybook-country-living-source-390.png](../playwright/storybook-reaudit-2026-07-27/62-storybook-country-living-source-390.png)
     [63-publication-icon-inventory-1280.png](../playwright/storybook-reaudit-2026-07-27/63-publication-icon-inventory-1280.png)
     [64-source-icon-fallback-390.png](../playwright/storybook-reaudit-2026-07-27/64-source-icon-fallback-390.png)
     [65-component-inventory-story-metadata-1280.png](../playwright/storybook-reaudit-2026-07-27/65-component-inventory-story-metadata-1280.png)
171. **Hearst+ Adaptive Video — the shared production playback primitive now
     has a direct contract and no inert missing-source surface.**
     `AdaptiveVideo` is the public playback boundary used by three routed
     production consumers: `home-page.tsx`, `video-cards.tsx`, and
     `delish-shorts-viewer.tsx`. This ownership is explicit in
     `APP_RULES.md:20`, which requires every video surface to use the shared
     adaptive player and expose a retryable playback error. The component
     previously had no direct story or ownership metadata; an omitted `src`
     rendered a black video element with no explanation, and a genuine
     playback failure was visible but not announced as an alert. The exported
     `AdaptiveVideoProps` contract and four direct stories now specify
     landscape MP4, portrait MP4, retryable playback failure, and unavailable
     source behavior using deterministic local media fixtures. A missing source
     is announced as status, records `data-video-state="unavailable"`, and
     intentionally offers no ineffective retry. A real playback failure is
     announced as an alert and exposes a tested 44px `Try again` target. The
     structured metadata also documents native HLS, the lazy `hls.js` fallback,
     one network and one media recovery attempt, the three current consumers,
     and the unresolved production caption/transcript requirement.

     Production verification used the routed Videos page at 390px. Opening an
     actual Car and Driver video produced `data-video-state="ready"` in a
     356-by-200.25px 16:9 frame with native controls and no page or console
     errors. The direct Storybook landscape story preserves that production
     player geometry while deliberately using a checked-in fixture rather than
     presenting live editorial media as a stable specification. The portrait,
     error, and missing-source captures verify the remaining responsive and
     failure contracts. Direct story coverage is now 50/100 production modules;
     metadata coverage is 18/100 with 18/18 valid records, and 43 modules remain
     in the ownership-classification queue. The current catalog contains 223
     stories, 18 docs, 69 groups, and 241 entries. All 223 browser
     interaction/accessibility scenarios, 892 responsive checks at 320, 390,
     768, and 1,280px, and 36 documentation checks pass without retry, alongside
     TypeScript, unit, registry, and static-build gates. The full browser run
     also exposed a pre-existing Delish Shorts timing race: keyboard focus
     correctly reveals auto-hidden story chrome, but the test clicked before
     React had applied its pointer state. Waiting for the production focus
     reveal removes the race without changing reader behavior.

     User impact: readers no longer receive an unexplained inert black player
     when a source is absent, and device playback failures expose an announced,
     touch-sized recovery action. Stakeholders can review the exact shared
     production boundary independently of feed or reel chrome. Engineers now
     have an executable API and ownership contract for MP4, HLS, orientation,
     and failure behavior. Recommendation: keep eligibility filtering upstream,
     retain `AdaptiveVideo` as the only playback primitive, add caption and
     transcript fixtures when production media metadata supports them, and
     extend these direct stories before changing recovery or source-selection
     behavior. Effort: small for this tranche; medium for verified captions and
     transcript support. Confidence: high for current playback and error
     behavior, based on current source, three routed consumers, a live routed
     comparison, deterministic media fixtures, and complete four-viewport
     catalog evidence; medium for captions because the audited sources do not
     yet provide a production-complete caption contract.
     [66-production-adaptive-video-390.png](../playwright/storybook-reaudit-2026-07-27/66-production-adaptive-video-390.png)
     [67-adaptive-video-landscape-1280.png](../playwright/storybook-reaudit-2026-07-27/67-adaptive-video-landscape-1280.png)
     [68-adaptive-video-portrait-390.png](../playwright/storybook-reaudit-2026-07-27/68-adaptive-video-portrait-390.png)
     [69-adaptive-video-error-390.png](../playwright/storybook-reaudit-2026-07-27/69-adaptive-video-error-390.png)
     [70-adaptive-video-missing-source-390.png](../playwright/storybook-reaudit-2026-07-27/70-adaptive-video-missing-source-390.png)
     [71-component-inventory-adaptive-video-1280.png](../playwright/storybook-reaudit-2026-07-27/71-component-inventory-adaptive-video-1280.png)
172. **Hearst+ Utility Bar — the shared production destination switcher now
     keeps its phone touch targets inside the layout boundary and has direct
     light, dark, menu, and responsive contracts.** The production component is
     rendered by both `home-page.tsx` and `hot-rod-events-page.tsx`, but it
     previously had no direct Storybook story or ownership metadata. The live
     routed Videos page exposed a measurable phone defect: at 390px the sticky
     utility-bar boundary was 32px tall while its required controls were 44px,
     producing a 46px scroll height and visible overlap with the masthead. This
     was not horizontal overflow, so the existing catalog-wide responsive gate
     could not identify it. The shared component now uses a 44px phone height,
     removes the destination pill's phone-only vertical inset, and retains the
     compact 32px desktop treatment. The same routed page now measures exactly
     44px high with a 44px scroll height, a 390px document width, and no browser
     or page errors.

     Four direct stories specify the light guest state, a selected Country
     Living publication and canonical route, the token-driven dark Videos
     state, and phone touch targets. Their interaction checks verify active
     destination semantics, the labelled publication menu, keyboard focus
     opening, Escape dismissal with focus retained on the trigger, the guest
     account callback, current-publication state, official source identity,
     canonical `/lifestyle/country-living/` routing, and 44px phone controls.
     Publication-menu marks now reuse the production `BrandSourceIcon` instead
     of an unguarded CSS background image, so a failed remote logo preserves
     deterministic initials and the catalog has one resilient publication-icon
     implementation. The existing integrated onboarding and application
     stories remain the authority for signed-in account presentation rather
     than seeding a second account model in this focused story.

     Direct story coverage is now 51/100 production modules; metadata coverage
     is 19/100 with 19/19 valid records, and 42 modules remain in the
     ownership-classification queue. The current catalog contains 227 stories,
     18 docs, 70 groups, and 245 entries. All 227 browser
     interaction/accessibility scenarios, 908 responsive checks at 320, 390,
     768, and 1,280px, and 36 documentation checks pass without retry, alongside
     TypeScript, unit, registry, static-build, and document-integrity gates.

     User impact: phone readers no longer see destination controls protruding
     into the masthead, and publication identity survives an asset failure.
     Stakeholders can review the exact shared top-level navigation independently
     of a complete feed. Engineers now have explicit ownership, route, theme,
     keyboard, and size contracts for the bar. Recommendation: keep this
     application utility bar separate from the design-system-site `NavBar`,
     retain the 44px phone/32px desktop boundary, and add a direct authenticated
     profile state only through a deterministic account fixture shared with the
     account-surface tranche. Further user research should confirm whether
     phone readers expect a tap on a destination to navigate immediately or
     first disclose its publication menu; the current component and these
     stories faithfully preserve production's link behavior and do not invent
     a new mobile interaction. Effort: small for this tranche; medium if user
     evidence supports a separate phone disclosure control. Confidence: high
     for layout, routing, keyboard, theme, and guest behavior based on current
     source, two production consumers, routed-app measurements, direct browser
     interactions, and complete responsive evidence; medium for the preferred
     phone publication-discovery interaction because it requires reader
     evidence.
     [72-production-utility-bar-before-390.png](../playwright/storybook-reaudit-2026-07-27/72-production-utility-bar-before-390.png)
     [73-production-utility-bar-after-390.png](../playwright/storybook-reaudit-2026-07-27/73-production-utility-bar-after-390.png)
     [74-utility-bar-light-1280.png](../playwright/storybook-reaudit-2026-07-27/74-utility-bar-light-1280.png)
     [75-utility-bar-selected-menu-390.png](../playwright/storybook-reaudit-2026-07-27/75-utility-bar-selected-menu-390.png)
     [76-utility-bar-dark-1280.png](../playwright/storybook-reaudit-2026-07-27/76-utility-bar-dark-1280.png)
     [77-utility-bar-mobile-390.png](../playwright/storybook-reaudit-2026-07-27/77-utility-bar-mobile-390.png)

173. **Hearst+ Reader Account UI — production account presentation is now
     directly specified, touch-safe, and focus-stable without inventing
     provider UI.** `ReaderAvatar`, `ReaderAuthDialog`, and
     `ReaderProfileDialog` are the visual production exports used by
     `home-page.tsx` and `utility-bar.tsx`. `ReaderAccountProvider` is state
     infrastructure, not a visual component, and is deliberately excluded from
     direct-story coverage. A deterministic story-only boundary seeds its
     existing browser-local data model without duplicating or changing that
     model.

     Live routed checks at 390px established the pre-fix production geometry:
     the authentication dialog's Close control was 36×36px, primary action was
     318×32px, mode switch was 318×20px, and field wrapper was 40px. The create
     flow's terms row was 40px, checkbox was 13×16px, Create action was 32px,
     and mode switch was 20px. The profile tabs already met 44px. Opening
     account deletion confirmation moved `document.activeElement` to `BODY`,
     leaving a keyboard reader without a stable location. After correction,
     the same routed authentication controls measure 44px, and the account
     confirmation remains focused, exposes `aria-expanded="true"`, and measures
     44px. Both routed checks emitted no browser errors.

     Ten direct stories now specify local sign-in, local profile creation,
     initials fallback, browser-local profile overview, selected interests and
     publications, saved-library and collection cleanup, comment deletion,
     library/comment empty states, account deletion, and retryable synchronized
     profile failure. The stories assert focus trapping and restoration, Escape
     behavior, validation, minimum targets, accurate local-versus-Google copy,
     the canonical Library link, suppression of the internal `Read Later`
     duplicate, selected semantics, two-step destructive confirmation and
     cancellation focus, empty-state language, and sync retry. Collection,
     comment, and account deletion use stable two-activation controls rather
     than replacing the focused element. Brand preferences reuse
     `BrandSourceIcon`, preserve deterministic fallback identity, and wrap long
     publication names instead of truncating them.

     The public prop and mode types are exported, and the structured metadata
     records both production consumers, dependencies, states, token use, and
     the prototype boundary. Direct story coverage is now 52/100 production
     modules; metadata coverage is 20/100 with 20/20 valid records, and 41
     modules remain in the ownership-classification queue. The rebuilt static
     catalog contains 237 stories, 18 docs, 71 groups, and 255 entries. All 237
     browser interaction/accessibility scenarios, 948 responsive checks at
     320, 390, 768, and 1,280px, and 36 documentation checks pass without
     retry, alongside TypeScript, unit, registry, static-build, and
     document-integrity gates.

     User impact: local-account readers receive controls that are reliably
     operable by touch and keyboard, and destructive actions no longer strand
     focus. Stakeholders can review the actual account surfaces and their
     product limits without treating provider plumbing as a screen. Engineers
     have explicit state, ownership, and consumer contracts instead of relying
     on integrated feed stories alone. Recommendation: retain the distinction
     between the visual UI exports and provider infrastructure; keep all
     destructive actions two-step and focus-stable; and add an executable
     verified-Google success story only when the repository provides a safe
     deterministic server/client fixture. Do not simulate completed
     authentication, consent, cross-device persistence, or account recovery.
     External Google success cannot currently execute in the static Storybook
     because it requires configured client and server support and static route
     requests return 503. User research should validate whether people
     understand “local profile” and the point at which they expect cross-device
     persistence; further technical evidence is required for real identity,
     consent, recovery, and synchronization behavior. Effort: medium for this
     tranche; large for production identity infrastructure outside this design
     system. Confidence: high for current local profile, dialog, focus, touch,
     preference, library, comment, deletion, and retry states based on current
     source, two routed consumers, routed-app measurements, direct browser
     interactions, and complete responsive evidence; low for external Google
     success because that integration is intentionally unavailable here.
     [78-production-reader-auth-before-390.png](../playwright/storybook-reaudit-2026-07-27/78-production-reader-auth-before-390.png)
     [79-production-reader-create-before-390.png](../playwright/storybook-reaudit-2026-07-27/79-production-reader-create-before-390.png)
     [80-production-reader-profile-before-390.png](../playwright/storybook-reaudit-2026-07-27/80-production-reader-profile-before-390.png)
     [81-production-reader-delete-before-390.png](../playwright/storybook-reaudit-2026-07-27/81-production-reader-delete-before-390.png)
     [82-production-reader-auth-after-390.png](../playwright/storybook-reaudit-2026-07-27/82-production-reader-auth-after-390.png)
     [83-production-reader-delete-after-390.png](../playwright/storybook-reaudit-2026-07-27/83-production-reader-delete-after-390.png)
     [84-reader-auth-sign-in-390.png](../playwright/storybook-reaudit-2026-07-27/84-reader-auth-sign-in-390.png)
     [85-reader-create-profile-390.png](../playwright/storybook-reaudit-2026-07-27/85-reader-create-profile-390.png)
     [86-reader-profile-overview-1280.png](../playwright/storybook-reaudit-2026-07-27/86-reader-profile-overview-1280.png)
     [87-reader-profile-preferences-390.png](../playwright/storybook-reaudit-2026-07-27/87-reader-profile-preferences-390.png)
     [88-reader-profile-library-390.png](../playwright/storybook-reaudit-2026-07-27/88-reader-profile-library-390.png)
     [89-reader-account-delete-confirmation-390.png](../playwright/storybook-reaudit-2026-07-27/89-reader-account-delete-confirmation-390.png)
     [90-reader-sync-error-1280.png](../playwright/storybook-reaudit-2026-07-27/90-reader-sync-error-1280.png)

174. **Storybook evidence governance — integrated production boundaries and
     non-visual infrastructure can now be classified without manufacturing
     misleading standalone stories.** The prior registry derived only direct
     story imports. That was intentionally strict, but its single
     `productionUsedWithoutDirectStory` queue could not distinguish a missing
     reusable-component specification from a production shell whose behavior
     exists only inside its shipped composition or a provider with no visual
     surface. `ComponentMetadata` now supports `direct`, `integrated`, and
     `infrastructure` evidence. Direct evidence must match the indexer's derived
     story mapping; integrated evidence must list at least one current indexed
     story file; infrastructure must list none; every explicit classification
     requires a rationale. `npm run index:check` validates those claims with the
     same public-export, dependency, and consumer checks as the rest of the
     metadata.

     `ContentReaderDialogShell` is the first integrated classification. Current
     source confirms it is the body-level `Story reader` dialog used by
     `home-page.tsx`; it owns the responsive full-viewport/inset canvas,
     background isolation, scroll preservation, initial Close focus, forward
     and reverse Tab wrapping, Escape, route-aware opener restoration, and the
     handoff that suppresses its own keyboard handling while a nested gallery
     or Ambient Reader is topmost. It intentionally does not own publication
     identity, article anatomy, recommendations, comments, or advertising.
     `APP_RULES.md` requires every modal and reader layer to portal to the body,
     make the rest of the page inert and hidden, preserve background scroll,
     restore focus, and isolate nested layers.

     The five existing `HearstPlusReaderOverlays` stories are therefore the
     faithful specification: publication reader, destination reader, nested
     gallery and focus, Ambient Reader handoff, and unavailable article
     content. They render the exact `HomePageTemplate` composition and test
     initial focus, forward and reverse wrapping, Escape and opener
     restoration, gallery and Ambient Reader isolation, publication versus
     destination navigation, content readiness, and failure. A current
     production ELLE reader and the Storybook ELLE contract use the same shell,
     publication theme, masthead hierarchy, hero image, contextual rail,
     article canvas, and desktop advertisement. The current nested-gallery
     capture confirms the top layer fully covers the reader while the
     executable story verifies that the reader beneath is inert and
     `aria-hidden`. No production component styling or behavior was changed:
     the audit found a registry/documentation defect, not a reader UI defect.

     The registry now reports 52 direct specifications, one validated
     integrated specification, 53/100 production modules with executable visual
     specifications, 21/100 metadata records with 21/21 valid, zero explicit
     infrastructure classifications, and a reduced 40-module ownership queue.
     The legacy direct-only count remains available for transparency. User
     impact: no reader behavior changes; the production modal remains the
     authority. Stakeholder impact: the inventory no longer labels this
     thoroughly tested reader shell as equivalent to an undocumented missing
     component. Engineering impact: future providers and integrated boundaries
     have a source-validated classification path, while direct components still
     require direct stories.

     Recommendation: use `integrated` only when isolation would remove behavior
     the component exists to coordinate; use `infrastructure` only for
     genuinely non-visual state or provider modules; keep reusable visual
     components on direct stories. Next, classify `reader-account.tsx` as
     infrastructure only after documenting its persistence, synchronization,
     security, and consumer contract; do not let infrastructure classification
     hide visual UI. Effort: small. Confidence: high, based on current source,
     current production and Storybook captures, five executable integrated
     stories, and registry validation.
     [91-production-reader-dialog-shell-elle.png](../playwright/storybook-reaudit-2026-07-27/91-production-reader-dialog-shell-elle.png)
     [92-storybook-reader-dialog-shell-elle.png](../playwright/storybook-reaudit-2026-07-27/92-storybook-reader-dialog-shell-elle.png)
     [93-storybook-reader-nested-gallery-elle.png](../playwright/storybook-reaudit-2026-07-27/93-storybook-reader-nested-gallery-elle.png)
     [94-component-inventory-storybook-evidence-1280.png](../playwright/storybook-reaudit-2026-07-27/94-component-inventory-storybook-evidence-1280.png)

175. **Reader account ownership — the provider is now correctly classified as
     prototype infrastructure, with its production security boundary made
     explicit.** Priority: P1 documentation and governance; P0 if this
     persistence contract is ever represented as production authentication.
     `src/components/reader-account.tsx` has no rendered surface: it mounts a
     context provider, stores the local account and session identifiers in
     `localStorage`, hashes local passwords in the browser, exposes account
     mutations, and synchronizes profiles through `/api/reader-profile`. The
     routed application mounts it in `src/app/layout.tsx`; Storybook mounts the
     same provider in `.storybook/ThemeDecorator.tsx`. The exact visual
     consumers remain the production `ReaderAuthDialog`,
     `ReaderProfileDialog`, and `ReaderAvatar` exports directly specified by
     `src/stories/HearstPlusReaderAccount.stories.tsx`.

     Google credentials are verified by `src/app/api/auth/google/route.ts`, but
     `src/app/api/reader-profile/route.ts` subsequently accepts the opaque
     64-character sync id as its profile access key without a server session or
     authorization check. `deleteAccount` clears only the current browser copy;
     the synchronized profile is not remotely deleted. No production consent,
     retention, recovery, revocation, or durable-deletion contract exists.
     These are appropriate prototype limitations only when named plainly.

     `src/components/reader-account.metadata.ts` now classifies the provider as
     `infrastructure`, documents its consumers, persistence and synchronization
     states, and explicitly prohibits using it as production identity
     infrastructure. It lists no visual story, because a provider card would
     fabricate presentation. The Component Inventory repeats the prototype
     boundary beside the ownership classification. Stakeholders can now
     distinguish faithful production account presentation from the
     prototype-only identity substrate; engineers get a clear line between
     reusable UI and security-sensitive services.

     Recommendation: before production use, replace client-held credential
     state and sync-id profile access with an authenticated, authorized
     identity/profile service; define consent, encryption, retention, recovery,
     revocation, cross-device conflict, and remote-deletion contracts; and add
     route-level security tests. A green Storybook interaction suite must not be
     presented as validation of those production controls. Effort: small for the
     truthful Storybook classification, large for production identity and
     privacy infrastructure. Confidence: high on the current code boundary;
     final service architecture requires security, legal/privacy, and platform
     ownership.

176. **Design-system navigation — the routed documentation shell is now a
     production-owned tooling component with a faithful direct specification,
     rather than an undocumented module conflated with reader navigation.**
     Priority: P1. `src/components/nav-bar.tsx` is imported by nineteen routed
     documentation pages and three documentation modules, but it previously had
     no metadata or direct Storybook evidence. Current production inspection at
     `/components/card` also exposed four concrete defects: the header added a
     second page-level `h1`; the brand selector had no accessible name; the
     desktop row clipped “Components” and hid the Storybook handoff at the
     reviewed width; and the phone drawer combined a dimming backdrop and body
     scroll lock with neither modal semantics nor a complete disclosure
     keyboard contract.

     The production module now separates `DesignSystemNavBar`, the exact
     presentational renderer, from the small `NavBar` wrapper that supplies the
     live Next.js pathname and environment-aware Storybook URL. The logo link
     has a concise product-and-theme name; the internal title is no longer a
     competing heading; the brand selector is named `Preview brand`; primary,
     component, and mobile navigation regions are labelled; exact links expose
     `aria-current`; and the documentation title remains visually hidden until
     1536px so all primary destinations fit at the reviewed desktop width.
     The phone menu is now an honest non-modal disclosure: there is no dimming
     backdrop or page lock, the button has dynamic Open/Close names plus
     `aria-controls` and `aria-expanded`, every phone action is at least 44px,
     and Escape closes the disclosure and restores its toggle.

     The first current Storybook run found one additional serious axe issue:
     Cosmopolitan’s 12px active component label rendered red `#d70000` on its
     pale red tint at 4.48:1, just below the 4.5:1 WCAG AA threshold. Production
     and Storybook now use semantic foreground text on the brand tint. The
     focused four-story Chromium suite passes with automated accessibility
     enabled, and the live Storybook Accessibility panel reports zero
     violations for the component and mobile-open states.

     `src/stories/DesignSystemNavigation.stories.tsx` now directly specifies
     documentation home, component documentation, the persistent mobile-open
     state, and keyboard dismissal. It uses the same renderer as production,
     not copied markup. `src/components/nav-bar.metadata.ts` explicitly says
     this is design-system tooling rather than Hearst+ reader navigation, so
     stakeholders and agents cannot select the wrong header. The registry now
     reports 53 direct specifications, one integrated specification, one
     infrastructure classification, 54/100 visual production specifications,
     23/100 metadata records with 23/23 valid, 18 modules with hard-coded
     colors, and a 38-module ownership queue.

     User impact: documentation users can identify the page structure, brand
     preview, current destination, and phone menu reliably without clipped
     navigation or ambiguous keyboard behavior. Reader-facing Hearst+ routes do
     not change. Engineering impact: routing integration and visual rendering
     are now testable separately, while Storybook presents the tool shell in a
     distinct hierarchy. Recommendation: retain this tooling/product boundary;
     do not move the story under Hearst+ Components or reuse this information
     architecture in reader destinations. Effort: medium. Confidence: high,
     based on current production source, current routed DOM, before/after
     captures, direct Storybook DOM, four interaction stories, axe, and registry
     validation.
     [95-production-design-system-nav-card.png](../playwright/storybook-reaudit-2026-07-27/95-production-design-system-nav-card.png)
     [96-production-design-system-nav-after.png](../playwright/storybook-reaudit-2026-07-27/96-production-design-system-nav-after.png)
     [97-storybook-design-system-nav-component.png](../playwright/storybook-reaudit-2026-07-27/97-storybook-design-system-nav-component.png)
     [98-storybook-design-system-nav-mobile-open.png](../playwright/storybook-reaudit-2026-07-27/98-storybook-design-system-nav-mobile-open.png)

177. **Theme runtime — Storybook now exposes the complete production theme
     context and directly specifies the exact provider instead of relying on an
     incomplete preview-only substitute.** Priority: P1.
     `src/components/theme-provider.tsx` is the highest-use undocumented
     runtime boundary in the current source graph: 62 application import sites
     depend on its publication/destination brand, generated CSS variables, font
     stacks, light/dark state, and color-mode persistence. Storybook previously
     replaced it globally with a hand-built `ThemeContext.Provider` whose value
     contained only `brand` and a no-op `setBrand`. Any story reading
     `colorMode` or calling `toggleColorMode` therefore received an incomplete
     contract even though production supplied both values.

     The exported `ThemeContextType` and `ThemeColorMode` now make that contract
     explicit. `.storybook/ThemeDecorator.tsx` supplies the complete shape,
     resolves both destination-foundation and publication variables for the
     active mode, and synchronizes its non-persistent preview mode with the
     document. Direct infrastructure stories in
     `src/stories/ThemeRuntime.stories.tsx` mount the exact production
     `ThemeProvider`, not the adapter. They verify Cosmopolitan’s declared font
     stack and light default, runtime switching to ELLE, Hearst Flux’s production
     dark default, document `color-scheme`/class synchronization, and the
     light-mode toggle. The direct stories opt out of the outer adapter’s root
     synchronization so two providers cannot race to own the document mode.

     Current routed evidence at `/hearst-flux/` confirms production opens in
     dark mode with a named “Switch to light mode” control. The direct Storybook
     dark-default state now presents the same runtime mode and semantic dark
     surfaces. The focused four-story Chromium suite passes with automated
     accessibility enabled. Metadata records the initial-value semantics of
     `defaultBrandSlug`, brand-namespaced persistence, supported hosted-font
     boundary, adapter/direct-story distinction, and every generated token
     family.

     User impact: stakeholders can trust brand and color-mode states shown in
     Storybook as outputs of the production resolver instead of a partial mock.
     Engineering impact: additions to the provider contract now cause a typed
     Storybook adapter failure rather than silently producing `undefined`.
     Recommendation: keep product routes on the exact provider, keep toolbar
     selection in the adapter, and add a new direct runtime assertion whenever
     the context, persistence, or generated token contract changes. Effort:
     medium. Confidence: high, based on source-graph evidence, routed production
     DOM and screenshot, exact-provider stories, focused browser tests, and
     generated registry validation.
     [99-theme-runtime-flux-dark.png](../playwright/storybook-reaudit-2026-07-27/99-theme-runtime-flux-dark.png)
     [100-production-hearst-flux-dark.png](../playwright/storybook-reaudit-2026-07-27/100-production-hearst-flux-dark.png)

178. **Product specification shell — the four routed stakeholder pages now
     share a directly specified tooling boundary with truthful mobile
     navigation, explicit diagram semantics, and measured responsive
     containment.** Priority: P1.
     `src/components/product-story-shell.tsx` is production tooling imported by
     `/about-hearst-magazines/`, `/why-hearst-plus/`,
     `/hearst-product-blueprint/`, and `/token-architecture/`; it is not a
     reader-facing Hearst+ component. Before this tranche, the shared header
     omitted the current page from its phone navigation, exposed no
     `aria-current`, and rendered visible navigation links as small as 17px.
     At 320px the Blueprint and Token Architecture pages measured 339px and
     336px wide respectively, while the token hero promoted its 7xl heading at
     1280px tightly enough to overlap the adjacent pipeline card.

     `ProductHeader` now presents all five destinations in a horizontally
     scrollable phone navigation, preserves one visible `aria-current="page"`
     state, supplies 44px link and logo targets, and adds keyboard focus
     treatment. The desktop links use the same target and current-page
     contract. Each routed tooling page now contains transformed marquee
     content at the page boundary while retaining deliberate local scrolling
     for the header and data tables. `StoryCard` and `RankingExample` can
     shrink without forcing page overflow, and the token source comparison
     uses shrinkable, phone-sized panels. The Token Architecture headline now
     defers 7xl sizing to 2xl screens, removing the 1280px collision.

     Static `DemoNav` output is now a named figure whose caption explicitly
     says it is a stakeholder diagram rather than interactive product UI.
     Illustrative editorial and commercial cards say so in their accessible
     names. `src/stories/ProductSpecificationModules.stories.tsx` adds nine
     direct stories that import the exact production exports: the shared
     navigation shell, phone navigation, illustrative navigation, story
     concepts, portfolio/destination facts, journey/ranking, architecture and
     palette, publication style guide, and portfolio marquee. The stories
     assert current-page semantics, phone containment, 44px targets, figure
     boundaries, concept names, and the presence of the factual tables/cards.
     `src/components/product-story-shell.metadata.ts` records the four routed
     consumers, exact exports and dependencies, direct Storybook ownership,
     current feed-validation requirement, noninteractive-diagram boundary, and
     the remaining fixed tooling palette debt.

     Current production measurements at 320, 390, 768, and 1280px now show
     `scrollWidth === clientWidth` for all four routes, exactly one visible
     current-page link, and a minimum visible navigation-link height of 44px.
     At 320px the phone navigation scrolls internally (427px content in a 320px
     container) without widening the page. `npm run feed:validate` confirms
     that the page’s portfolio facts remain grounded in the current 859-story,
     29-brand, four-destination catalog. Browser review found no console errors
     on the representative routed pages. The generated registry now reports
     55/100 production specifications: 54 direct, one integrated, and one
     infrastructure classification; metadata is 25/100 with 25/25 valid, and
     the ownership queue is 37.

     The complete browser gate also exposed shared-state interference that
     focused story runs had hidden: account/profile stories could race through
     shared `localStorage` and focus, while the integrated Saved and Utility
     Bar stories could inherit a signed-in account from another file.
     `vitest.config.ts` now runs browser story files sequentially, and those
     account-dependent stories mount `ReaderAccountStoryBoundary` explicitly.
     The profile-form test uses one controlled change event per field because
     it verifies value/validation state rather than typing cadence. The final
     current gates pass: 56 files/254 browser stories, 1,016 responsive checks
     across four widths, 36 documentation checks across two widths, static
     Storybook build, production build, 111 unit tests, TypeScript, registry
     generation/check, feed validation, and diff whitespace validation.

     User impact: stakeholders can move among the specification pages on a
     phone without clipped content or losing the current-page cue, and screen
     reader users are less likely to mistake a diagram or concept card for
     shipped reader functionality. Engineering impact: the reusable tooling
     surface now has a direct executable contract instead of relying on four
     large page screenshots, and remaining palette drift is visible in
     metadata rather than hidden by a false “fully tokenized” claim.
     Recommendation: keep these stories under **Design System Tooling**, require
     `feed:validate` when portfolio facts change, and replace the recorded
     `#2D75B9`, `#102A43`, `#F8FAFC`, and `slate-*` tooling palette only after a
     named documentation-theme token contract exists. Do not move these
     modules under reader Components or use them as production navigation
     examples. Effort: medium. Confidence: high, based on current source graph,
     four live routes, sixteen viewport/state measurements, before/after visual
     review, direct Storybook stories, and focused browser tests.
     [101-product-story-desktop.png](../playwright/storybook-reaudit-2026-07-27/101-product-story-desktop.png)
     [104-token-architecture-desktop.png](../playwright/storybook-reaudit-2026-07-27/104-token-architecture-desktop.png)
     [105-product-story-mobile.png](../playwright/storybook-reaudit-2026-07-27/105-product-story-mobile.png)
     [108-token-architecture-mobile.png](../playwright/storybook-reaudit-2026-07-27/108-token-architecture-mobile.png)
     [109-product-story-mobile-after.png](../playwright/storybook-reaudit-2026-07-27/109-product-story-mobile-after.png)
     [110-token-architecture-mobile-after.png](../playwright/storybook-reaudit-2026-07-27/110-token-architecture-mobile-after.png)
     [111-token-architecture-desktop-after.png](../playwright/storybook-reaudit-2026-07-27/111-token-architecture-desktop-after.png)
     [112-storybook-product-header-phone.png](../playwright/storybook-reaudit-2026-07-27/112-storybook-product-header-phone.png)
     [113-storybook-product-portfolio.png](../playwright/storybook-reaudit-2026-07-27/113-storybook-product-portfolio.png)
     [114-product-blueprint-mobile-after.png](../playwright/storybook-reaudit-2026-07-27/114-product-blueprint-mobile-after.png)

179. **Brand wordmarks — production appearance is preserved, while the shared
     renderer now owns one accessible, testable asset contract and Storybook
     directly specifies the complete registered set.** Priority: P1.
     `src/components/brand-logo.tsx` is used by ten application modules across
     destination mastheads, article pages, the content reader, Brand Spotlight,
     account UI, events, shop, and design-system tooling. Before this tranche it
     had no direct component specification or metadata. It fetched and injected
     SVG text independently for every instance, returned `null` through loading
     and failure, inherited inconsistent `<title>` and `<desc>` content from
     individual assets, exposed no reliable accessible name, and advertised an
     unused `variant="icon"` prop that could point the SVG-text loader at remote
     PNG or ICO files. The canonical asset registry contained 39 slug mappings,
     including aliases, but Storybook exposed the renderer only incidentally in
     the Typography specimen.

     Current routed inspection at 320px confirms the production mastheads are
     visually stable and contained across Hearst+, Lifestyle, Autos, Fashion &
     Luxury, and Enthusiast & Wellness. Their reviewed cap heights remain
     22–26px with intrinsic wordmark widths and no document overflow. The
     before captures also show why a common-width logo rule would be wrong:
     each destination mark has deliberately different proportions. The defect
     was semantic and architectural rather than visual: none of the five
     mastheads exposed a consistent image role or brand name, and individual
     publication assets supplied generic, missing, or duplicated source
     metadata.

     `src/lib/logos.ts` now owns the canonical reader-facing name beside every
     registered wordmark. `BrandLogo` exports its public props, accepts an
     explicit label override or decorative treatment, caches approved local
     SVG requests, cancels stale state updates, and reports
     `data-state="loading"`, `"ready"`, or `"error"`. It removes embedded
     styles, executable/foreign content, event handlers, and inconsistent
     source title/description nodes; the wrapper owns one canonical accessible
     name while the injected SVG is hidden from assistive technology and
     unfocusable. Unknown slugs still render nothing, preserving the existing
     rule that an unapproved brand asset must not be approximated. The unused
     icon prop was removed from this wordmark component; compact raster or
     lettermark identity remains owned by `BrandSourceIcon`.

     Five direct stories under **Foundation / Brand Logos** now render the exact
     production export: five destination mastheads, the complete publication
     registry, approved light-on-dark monochrome treatment, accessible versus
     decorative usage, unknown-key omission, and 320px containment. Each
     specimen names its canonical brand and registry key while preserving
     visual cap-height guidance. The first focused browser run exposed a real
     registry edge case rather than hiding it: Bring a Trailer’s approved SVG
     begins with an XML declaration. The sanitizer now isolates the actual SVG
     root after valid prolog content, and the rerun passes all five stories,
     including automated accessibility checks.

     `src/components/brand-logo.metadata.ts` records the ten production
     consumers, the wordmark/source-icon boundary, loading and failure
     diagnostics, intrinsic-sizing rule, unknown-key behavior, and both direct
     Storybook files. The generated registry validates all 26 current metadata
     records and leaves Brand Logo in the existing direct-specification count
     because Typography already imported it; the new work raises specification
     depth rather than inflating component coverage. The final current gates
     pass 57 files/259 Storybook interaction and accessibility checks, 1,036
     responsive checks across 320, 390, 768, and 1280px, 36 documentation
     checks, 111 unit tests, TypeScript, registry generation/check, the static
     Storybook build, and the 1,036-page production build.

     User impact: screen-reader users now receive a stable destination or
     publication name where the logo is meaningful, and no repeated name where
     the caller marks it decorative. Stakeholders can review the complete
     approved registry in one production-backed place without treating compact
     icons as mastheads. Engineering impact: production and Storybook share one
     asset/name source, repeated mounts reuse the same request, load failures
     are observable, and malformed or non-SVG sources cannot be injected as
     wordmarks. Recommendation: require any new registered wordmark to add its
     canonical name and pass the direct registry story; size by visual cap
     height; use `decorative` only when adjacent visible text already supplies
     the brand name; and keep multicolor/compact identity in
     `BrandSourceIcon`. Effort: medium. Confidence: high, based on the current
     source graph, five production destination routes, before/after DOM and
     visual review, the complete live registry story, focused Chromium tests,
     TypeScript, and generated metadata validation.
     [115-brand-logo-hearst-plus-desktop-before.png](../playwright/storybook-reaudit-2026-07-27/115-brand-logo-hearst-plus-desktop-before.png)
     [116-brand-logo-hearst-plus-mobile-before.png](../playwright/storybook-reaudit-2026-07-27/116-brand-logo-hearst-plus-mobile-before.png)
     [117-brand-logo-lifestyle-mobile-before.png](../playwright/storybook-reaudit-2026-07-27/117-brand-logo-lifestyle-mobile-before.png)
     [118-brand-logo-fashion-luxury-mobile-before.png](../playwright/storybook-reaudit-2026-07-27/118-brand-logo-fashion-luxury-mobile-before.png)
     [119-brand-logo-enthusiast-wellness-mobile-before.png](../playwright/storybook-reaudit-2026-07-27/119-brand-logo-enthusiast-wellness-mobile-before.png)
     [120-brand-logo-autos-mobile-before.png](../playwright/storybook-reaudit-2026-07-27/120-brand-logo-autos-mobile-before.png)
     [121-brand-logo-destination-spec-after.png](../playwright/storybook-reaudit-2026-07-27/121-brand-logo-destination-spec-after.png)
     [122-brand-logo-hearst-plus-mobile-after.png](../playwright/storybook-reaudit-2026-07-27/122-brand-logo-hearst-plus-mobile-after.png)

180. **Button and generated brand runtime — Storybook now specifies the exact
     production action component, and the token build no longer discards the
     state, content, border, and radius values required to render it.**
     Priority: P1.
     `src/components/ui/button.tsx` is imported by 21 current application
     modules. Before this tranche its default, secondary, outline, and ghost
     styles approximated publication behavior through generic semantic
     utilities; the primary hover utility applied only to anchor-shaped
     buttons; every size was 24–36px; loading had no public contract; and
     `transition-all` animated unrelated properties. The routed component page
     described navigation as a Button responsibility, claimed an inaccurate
     secondary treatment, omitted loading and touch guidance, and exposed
     unnamed icon-only examples. Storybook showed eleven mostly isolated
     specimens without touch, loading, invalid, expanded, keyboard, icon-name,
     or multi-brand state evidence.

     The visual comparison exposed a deeper runtime defect. Every publication
     JSON contains 73 supported component-button tokens, but
     `scripts/build-from-tokens.ts`, `scripts/sync-tokens.ts`, and
     `scripts/sync-from-pencil.ts` each applied `.slice(0, 50)` while emitting
     `componentTokens`. The runtime therefore retained button backgrounds but
     silently dropped later alphabetic entries including primary and secondary
     content colors, borders, and radius. Cosmopolitan’s source-of-truth white
     label consequently inherited black page text in the first corrected
     Storybook render. The three generators now emit the complete supported
     set. The rebuilt runtime contains all 2,117 button-token entries
     (73 × 29 brands), including 29/29 primary-content and radius values.
     `src/lib/token-validation.test.ts` now compares every generated brand
     runtime against its canonical `tokens/brands/*.json` source so truncation
     or key drift fails the unit suite.

     The production Button now exposes `data-variant`, `data-size`, loading,
     and busy semantics. Its primary, secondary, outline, ghost, and link-action
     states consume the registered default, hover, and active component-token
     families through stable state selectors; destructive treatment remains a
     semantic danger variant. Transition scope is limited to visual state
     properties and respects reduced motion. Dense sizes remain available for
     compact desktop tooling, while `touch` and `icon-touch` provide explicit
     44px targets. Loading disables activation, retains a visible announced
     label, uses the official Phosphor spinner, and exposes `aria-busy`.

     `src/stories/Button.stories.tsx` now has fifteen direct stories. The
     executable matrix covers exact dense and touch heights, loading,
     disabled, invalid and expanded states, named icon buttons, keyboard focus
     and Enter activation, phone containment, and four representative brand
     scopes. The brand specification visibly shows default, hover, and active
     primary states plus secondary, outline, and ghost treatments for
     Cosmopolitan, ELLE, Runner’s World, and Good Housekeeping. Forced
     state-preview attributes share the exact CSS declarations used by native
     `:hover` and `:active`, allowing deterministic visual regression without
     inventing a parallel component.

     `src/components/button-page.tsx` now documents the action-versus-navigation
     boundary, real token names and current values, compact versus touch-safe
     sizing, accessible icon usage, explicit submit behavior, loading, and the
     complete API. `src/components/ui/button.metadata.ts` records all 21
     consumers, its icon dependency, state token families, public exports,
     direct and integrated Storybook evidence, and remaining usage caveats.
     The generated registry is 26/26 valid and reports 17 components with
     remaining hard-coded colors.

     User impact: publication buttons now retain their intended label contrast,
     state colors, and radius in both production and Storybook; phone authors
     have an explicit safe target instead of guessing which dense size to
     enlarge; and loading and icon-only actions announce coherent semantics.
     Engineering impact: the shared component and documentation consume one
     production token contract, generated-token truncation is regression
     tested, and Storybook exposes the state/API decisions needed to review a
     real task rather than a row of color variants. Recommendation: require
     future action variants to begin with a named production component-token
     family and an applicable state story; use `Link` for navigation; reserve
     dense sizes for non-touch tooling; and keep the all-brand runtime parity
     test in the required unit gate. Effort: medium. Confidence: high, based on
     canonical token JSON, the regenerated 29-brand runtime, the routed
     production specification, direct Storybook rendering, focused Chromium
     interaction/accessibility tests, the complete 269-story browser suite,
     1,076 responsive checks, 36 documentation checks, 113 unit tests,
     TypeScript, registry validation, publication/feed validation, and both
     static Storybook and 1,050-page production builds. The current visual
     baseline sweep intentionally remains open for production-by-production
     review rather than accepting 27 broad changes created by restoring the
     previously missing component tokens.
     [123-production-button-page-before.png](../playwright/storybook-reaudit-2026-07-27/123-production-button-page-before.png)
     [124-storybook-button-variants-before.png](../playwright/storybook-reaudit-2026-07-27/124-storybook-button-variants-before.png)
     [127-storybook-button-full-token-runtime-after.png](../playwright/storybook-reaudit-2026-07-27/127-storybook-button-full-token-runtime-after.png)
     [128-storybook-button-keyboard-touch-390-after.png](../playwright/storybook-reaudit-2026-07-27/128-storybook-button-keyboard-touch-390-after.png)
     [129-storybook-button-states-after.png](../playwright/storybook-reaudit-2026-07-27/129-storybook-button-states-after.png)
     [131-production-button-page-complete-after.png](../playwright/storybook-reaudit-2026-07-27/131-production-button-page-complete-after.png)

## Current production-alignment continuation

181. **HOT ROD Events — three routed production templates now have direct,
     executable Storybook specifications.** Priority: P1, resolved in the
     current checkout. `src/components/hot-rod-events-page.tsx` supplies the
     event hub, Power Tour detail, and Drag Week detail used by three
     application routes, but it previously had no direct story and no
     structured metadata. The omission left a large, current reader experience
     in the ownership-classification queue even though the production component
     was already complete.

     `src/stories/HearstPlusHotRodEvents.stories.tsx` now imports the exact two
     public production exports and specifies the event hub, Power Tour detail,
     Drag Week detail, mobile hub, mobile Drag Week, calendar/list interaction,
     disabled edition controls, concluded registration, sold-out racer entry,
     spectator tickets, and official external resources. The stories do not
     duplicate markup or invent alternative event data.
     `src/components/hot-rod-events-page.metadata.ts` records route ownership,
     responsive variants, dependencies, the public-information limitation, and
     the explicitly approved route-scoped HOT ROD palette from
     `BRAND_STYLES.md`. Registry coverage rises from 26 to 27 metadata records,
     production specifications rise from 55 to 56, and the unresolved ownership
     queue falls from 37 to 36.

     The same comparison exposed an above-the-fold image warning in the routed
     Next.js app. Both event heroes now use the current Next.js `preload` API
     plus explicit eager loading. A fresh routed reload reports
     `loading="eager"`, a complete 320px image, and no new browser warning. Five
     focused Storybook browser/accessibility checks pass. User impact: event
     routes are now reviewable as production contracts and their primary image
     is not deferred. Engineering impact: future changes to schedule, status,
     tickets, responsive layout, or route-specific treatment have a direct
     regression surface. Effort: medium. Confidence: high, based on the current
     source graph, three routes, live production and Storybook rendering at
     1280px and 320px, runtime image attributes, browser logs, registry
     validation, and focused tests.
     [08-production-hot-rod-events-1280.png](../playwright/storybook-best-practices-reaudit-2026-07-27/08-production-hot-rod-events-1280.png)
     [09-production-hot-rod-events-320.png](../playwright/storybook-best-practices-reaudit-2026-07-27/09-production-hot-rod-events-320.png)
     [10-storybook-hot-rod-events-1280.png](../playwright/storybook-best-practices-reaudit-2026-07-27/10-storybook-hot-rod-events-1280.png)
     [11-storybook-hot-rod-events-320.png](../playwright/storybook-best-practices-reaudit-2026-07-27/11-storybook-hot-rod-events-320.png)

182. **Mobile publication sections — Storybook accurately exposed a production
     navigation-discoverability defect, and the shared production component now
     owns the correction.** Priority: P2, resolved in the current checkout. At
     320px, the HOT ROD Events route and its new direct story both opened the
     horizontally scrollable topic rail around the active Events item. The
     left edge began inside the word “Trucks,” displaying only “ks,” with no
     visual cue that earlier sections were off-screen. The active item remained
     operable and there was no document overflow, so this was not a content-loss
     or P0 accessibility defect; it was a discoverability defect in the shipped
     navigation.

     `MainNav` now uses minimal active-item alignment instead of centering the
     selected item, exposes named publication or destination section
     landmarks, and renders motion-safe edge fades only when more sections are
     available in that direction. The rail keeps useful neighbors visible,
     retains native horizontal scrolling and 44px phone targets, and does not
     change desktop navigation. A direct 320px navigation story fixes the HOT
     ROD publication context, asserts that Events and Buying Guides remain
     visible, and verifies that the left overflow cue is active. The complete
     269-story interaction/accessibility run and the 1,076-check responsive
     sweep pass. User impact: phone readers can now recognize the rail as
     horizontally scrollable instead of reading clipped text as a broken label.
     Engineering impact: production and Storybook share the same alignment,
     landmark, and overflow-cue contract. Effort: small. Confidence: high, based
     on matched production/Storybook captures, DOM geometry, accessible landmark
     names, the focused regression, and the complete test gates.
     [12-production-hot-rod-navigation-fixed-320.png](../playwright/storybook-best-practices-reaudit-2026-07-27/12-production-hot-rod-navigation-fixed-320.png)
     [13-storybook-hot-rod-navigation-fixed-320.png](../playwright/storybook-best-practices-reaudit-2026-07-27/13-storybook-hot-rod-navigation-fixed-320.png)

183. **Published Storybook — the public production catalog is materially stale
     relative to the verified checkout.** Priority: P1, open. The current local
     `/index.json` contains 287 entries: 269 stories, 18 documentation pages,
     and 76 groups. The deployed production URL contains only 116 entries: 99
     stories, 17 documentation pages, and 40 groups. Its Component Inventory
     page also predates the current live registry evidence. This is not a
     rendering discrepancy inside an individual story; stakeholders visiting
     production cannot see most of the production-backed catalog now present in
     the checkout.

     User impact: reviewers can reasonably conclude that components, states, and
     governance documentation do not exist, or approve work against obsolete
     specifications. Engineering impact: passing local quality gates do not
     establish that the shared production URL contains the same revision.

     The revision/count gate is now implemented in the current checkout.
     `scripts/fix-storybook-paths.mjs` writes `build-info.json` into the static
     artifact with its exact revision, build context, build time, and counts
     derived from the built `/index.json`. `scripts/verify-storybook-deployment.mjs`
     compares that provenance with the deployed index and the expected reviewed
     revision, fails on mismatched counts or revisions, and exits within a
     bounded timeout. `Delivery / Governance` exposes the published record, and
     `Delivery / Quality` documents the exact release check.

     The success path passes against a locally served artifact at revision
     `787ab52de2868181a4080d27f2f0b9b113c175bd+dirty` with 287 entries, 269
     stories, 18 docs, and 76 groups. The same verifier correctly rejects the
     current public URL because `/storybook/build-info.json` returns HTTP 404.
     This converts publication freshness from an assumption into a fail-closed
     gate, but it does not make the stale deployment current.

     Recommendation: publish only an explicitly authorized, reviewed revision;
     run the documented verifier with its full commit SHA after provider
     deployment; and do not declare the design-system release complete until it
     passes. Do not silently deploy the current mixed worktree. Effort: small
     for an authorized release; the revision/count gate is resolved in the
     checkout. Confidence: high, based on current same-day reads of both
     authoritative `/index.json` endpoints, the deployed inventory page, a
     passing local exact-revision/count verification, a bounded-timeout
     regression, and the live HTTP-404 rejection.
     [01-component-inventory-desktop.png](../playwright/storybook-best-practices-reaudit-2026-07-27/01-component-inventory-desktop.png)
     [02-inventory-coverage-gap-desktop.png](../playwright/storybook-best-practices-reaudit-2026-07-27/02-inventory-coverage-gap-desktop.png)
     [03-deployed-storybook-inventory-stale.png](../playwright/storybook-best-practices-reaudit-2026-07-27/03-deployed-storybook-inventory-stale.png)
     [14-governance-release-provenance-local.png](../playwright/storybook-best-practices-reaudit-2026-07-27/14-governance-release-provenance-local.png)
     [15-governance-release-status-local.png](../playwright/storybook-best-practices-reaudit-2026-07-27/15-governance-release-status-local.png)

184. **Featured Story Carousel — the direct production specification now has
     complete ownership, token, API, and usage metadata.** Priority: P2,
     resolved in the current checkout. The production component already had
     seven direct stories covering mixed article/video allocation, active-slide
     semantics, actions, mobile targets, saved state, publication treatment,
     single-story fallback, empty allocation, and reduced motion. It did not
     have the sibling metadata required to explain when the component belongs in
     a route, which tokens it consumes, what the feed owns, or why the direct
     stories are production evidence.

     `src/components/hearst-plus/featured-story-carousel.metadata.ts` now
     records the public component and props API, organism ownership, production
     use and non-use criteria, destination and scrim tokens, dependencies,
     responsive and brand behavior, all eight relevant states, direct Storybook
     evidence, and the explicit boundary between deterministic Storybook
     fixtures and live personalized ordering. Registry metadata coverage rises
     from 27/100 to 28/100, with all 28 records valid. The seven focused
     interaction/accessibility stories pass.

     The current visual run also clarifies why production evidence must accompany
     baseline review. The Lifestyle Home 320px baseline contains an older
     checked-in editorial snapshot, the current Storybook case contains a newer
     deterministic checked-in story, and the routed application blends current
     live feed and reader state through the same production component. That
     content difference is not proof of component drift, and it is not a reason
     to refresh all 27 changed baselines without review. User impact: reviewers
     can distinguish stable component behavior from intentionally changeable
     editorial order. Engineering impact: the ownership graph now states the
     fixture and production boundaries agents and contributors must preserve.
     Recommendation: continue the 27-case visual review one production-backed
     state at a time; update a baseline only after classifying its content,
     token, and layout changes against the routed authority. Effort: small.
     Confidence: high, based on the component source, exact direct stories,
     current registry validation, focused browser tests, inspected baseline and
     current screenshots, and the routed mobile composition.
     [16-production-lifestyle-home-320.png](../playwright/storybook-best-practices-reaudit-2026-07-27/16-production-lifestyle-home-320.png)
     [Current Storybook visual case](../playwright/visual-regression/lifestyle-destination-home-320-actual.png)
     [Reviewed prior baseline](../../tests/visual-baselines/lifestyle-destination-home-320.png)

185. **Fullscreen Image Viewer gallery at 390px — the 90.959% visual
     difference was editorial imagery, not verified component drift.**
     Priority: P2 classification, resolved in the current checkout. The failed
     capture showed a current ELLE gallery photograph beneath the same
     production controls, counter, thumbnail rail, navigation, and zoom hint.
     Because remote editorial pixels can change independently of the component,
     comparing those pixels made the case report a broad failure without
     identifying a viewer regression.

     The visual case now neutralizes only `[role="dialog"] img` after the
     production story has loaded and before capture. No viewer container,
     control, text, border, position, or responsive behavior is masked. The
     previously overwritten all-dark baseline was regenerated only for
     `reader-image-viewer-gallery-390`; the inspected 390×844 PNG preserves the
     `1 of 4` counter, save, zoom-out, zoom-in, slideshow, information, close,
     previous, next, four-thumbnail, and zoom-hint chrome while the editorial
     image regions are hidden. Its SHA-256 is
     `059e244d187f1ad8cfb5bcfd4cc909b510bdc825c3e7924ea9ae2ee1264b2b98`.
     A focused rerun passes at `0%` changed pixels.

     The exact production component remains behaviorally covered:
     `HearstPlusFullscreenImageViewer.stories.tsx` passes all three Chromium
     interaction/accessibility stories, including the gallery keyboard and
     caption scenario. No other visual baseline was updated. User impact:
     changing editorial photography can no longer obscure a real regression in
     the phone viewer chrome. Engineering impact: the case remains sensitive to
     layout, control, typography, counter, thumbnail, and navigation drift
     while excluding the explicitly volatile content layer. Recommendation:
     retain separate current-run editorial screenshots for content review and
     keep the visual baseline focused on deterministic production UI. Effort:
     small. Confidence: high, based on the inspected prior failure capture,
     inspected regenerated baseline, exact selector scope, a 0% focused visual
     rerun, and three passing direct production-component stories.
     [Prior editorial-image failure capture](../playwright/visual-regression/reader-image-viewer-gallery-390-actual.png)
     [Reviewed neutralized baseline](../../tests/visual-baselines/reader-image-viewer-gallery-390.png)

186. **Publication Discovery Sidebar at 1280px — editorial fixture churn
     explained the visible delta, but current production comparison exposed one
     stale inventory count.** Priority: P2, resolved in the current checkout.
     The fresh visual sweep reported `2.752%` changed pixels. Baseline and
     current captures retain the same exact production component, 220px rail,
     card geometry, typography, selected Cosmopolitan state, inventory ordering,
     adjacent specification panel, and 1280×900 canvas. The visible changed
     region was the three Daily Habit titles and bylines supplied by the
     refreshed checked-in editorial fixture, not verified component drift.

     A current-run capture of `/lifestyle/cosmopolitan/` confirmed that the
     routed product uses the same sidebar anatomy with dynamically allocated
     Daily Habit stories. The DOM and screenshot also exposed a separate,
     deterministic fixture mismatch: the routed Global Story Inventory reports
     House Beautiful at `62`, while the direct Storybook fixture still reported
     `61`. `HearstPlusDiscoverySidebar.stories.tsx` now uses the production
     count and the publication-inventory story directly asserts the accessible
     `House Beautiful 62` button. This keeps the count protected even though it
     appears below the initial viewport in the tall sticky rail.

     The static Storybook was rebuilt before the baseline was accepted, avoiding
     a stale-compiled-artifact false pass. Only
     `discovery-sidebar-publication-1280` was regenerated for this
     classification. The inspected 1280×900 baseline preserves the complete
     visible component and specification frame; its SHA-256 is
     `2467a2db203443719ff87fdbcd4b6da96aa980bcf7bd9bb28da71414fa409f79`.
     The focused visual rerun passes at `0%`, and all five direct Discovery
     Sidebar Chromium interaction/accessibility stories pass with the new count
     assertion. User impact: reviewers see the current production inventory
     rather than a stale publication total. Engineering impact: expected
     editorial title churn remains distinguishable from component drift, while
     the stable inventory contract now fails if it diverges again.
     Recommendation: continue to compare generated editorial rows separately
     from stable inventory and component behavior, and rebuild the static
     catalog before every baseline decision. Effort: small. Confidence: high,
     based on the fresh production route DOM and screenshot, inspected before
     and after baselines, direct source imports, a focused five-story browser
     suite, and a 0% focused visual rerun.
     [Current production sidebar at 1280px](../playwright/storybook-reaudit-2026-07-27/128-production-discovery-sidebar-current-1280.png)
     [Prior Storybook failure capture](../playwright/visual-regression/discovery-sidebar-publication-1280-actual.png)
     [Reviewed current baseline](../../tests/visual-baselines/discovery-sidebar-publication-1280.png)

187. **Lifestyle Trending Articles rail at 1280px — the `2.453%` visual
     difference was checked-in editorial fixture churn, not verified token,
     layout, API, allocator, or component drift.** Priority: P2
     classification, resolved in the current checkout. The prior baseline and
     current direct-story capture keep the same 280px production rail, 8px card
     radius, border, shadow, 16px padding, Lifestyle heading color, five ordered
     rank markers, complete-row buttons, title and metadata typography, and
     natural content-driven height. Only the five story titles, topics,
     bylines, and the resulting line wraps changed.

     `HearstPlusTrendingRails.stories.tsx` still imports the exact exported
     `TrendingStoryRail` used by `home-page.tsx` and calls the same
     `allocateStoryModules` production allocator over the current checked-in
     Lifestyle fixture. The older baseline rows remain valid source stories,
     but a subsequent feed/fixture refresh changed the compact fixture ordering
     and therefore the allocator's five eligible cross-brand results. No prop,
     semantic structure, interaction contract, or theme mapping changed.

     A current-run 1280×900 capture of `/hearst-lifestyle/` confirms the routed
     product uses the same named Trending Across Brands region, ordered
     five-story list, complete-row controls, rank treatment, and
     brand/topic/byline metadata. Its live catalog and browser-local allocation
     currently select a third editorial set, so the route is production-anatomy
     and allocation evidence rather than same-title pixel evidence. A fresh
     current-run direct-story DOM and screenshot match the visual-test capture
     exactly.

     Only `trending-articles-lifestyle-1280` was regenerated. The inspected
     1280×900 baseline SHA-256 is
     `1753004c18e1f573297bbb22cb96e7546eb9cee8e747c4f5159c7af89165cca4`;
     the focused rerun passes at `0%`, and all six direct Trending Rails
     Chromium interaction/accessibility stories pass. User impact: current
     editorial selections are reviewable without mislabeling expected content
     rotation as a broken rail. Engineering impact: the baseline still detects
     frame, token, typography, rank, spacing, and responsive drift for the
     current reviewed fixture. Recommendation: continue treating feed refreshes
     as explicit editorial-baseline review events and never refresh the sibling
     390px or video-rail baselines from this desktop classification. Effort:
     small. Confidence: high, based on inspected before/current images, fresh
     production and direct-story captures, current DOM, exact source imports,
     allocator tracing, six passing focused stories, and a 0% focused visual
     rerun.
     [Current production Lifestyle rail at 1280px](../playwright/storybook-reaudit-2026-07-27/129-production-trending-lifestyle-current-1280.png)
     [Current direct Storybook rail at 1280px](../playwright/storybook-reaudit-2026-07-27/130-storybook-trending-lifestyle-current-1280.png)
     [Prior Storybook failure capture](../playwright/visual-regression/trending-articles-lifestyle-1280-actual.png)
     [Reviewed current baseline](../../tests/visual-baselines/trending-articles-lifestyle-1280.png)

188. **Today’s Edit minimal allocation at 1280px — the `2.522%` visual
     difference was checked-in editorial fixture churn, not verified token,
     layout, API, allocator, route, or component drift.** Priority: P2
     classification, resolved in the current checkout. The prior baseline and
     current direct-story capture retain the same 1,184×123px production
     region, two equal desktop columns, border, radius, shadow, 16px card
     padding, 80×64 media, label treatment, headline typography, and
     production background. The changed pixels are concentrated in the two
     thumbnails, headlines, and their natural line wraps.

     `HearstPlusTodayEdit.stories.tsx` imports the exact exported
     `TodayEditStrip` rendered by `home-page.tsx` and calls the same
     `allocateStoryModules` production allocator over
     `hearstPlusStoryData.all.stories`. The minimal story removes only the
     optional Horoscope and Continue Reading positions. The current generated
     fixture deterministically selects Delish’s “These 10 Nostalgic Mall Food
     Court Recipes Take Us Back To The Simpler Days” as the first eligible
     followed-brand story after the five reserved hero stories, and
     Autoweek’s “NASCAR’s New Generation Has Different Priorities” as the
     highest-popularity unused story. The older Pepsi body-care and Lando
     Norris stories remain in the checked-in production catalog, but no longer
     win those two allocation positions after the fixture refresh.

     The routed `/hearst-plus/` path still enables Today’s Edit only for the
     unfiltered `For You` destination, passes `moduleAllocation.todayEdit`
     directly to the same component, and preserves the production measurement,
     open-story, resume-impression, and resume-open callbacks. No source line
     required correction.

     Only `todays-edit-minimal-1280` was regenerated. The inspected 1280×500
     baseline SHA-256 is
     `1e0744f7514cefae76a255db47ecd74db51e56c11ff6e2d47a7d14e38e781b18`;
     the focused rerun passes at `0%`, and all seven direct Today’s Edit
     Chromium interaction/accessibility stories pass. The known visual-failure
     queue therefore falls from 24 to 23 without a broad baseline update or a
     new complete sweep. User impact: current editorial selections remain
     reviewable without mistaking routine story rotation for a broken strip.
     Engineering impact: the baseline continues to protect the stable
     production frame, tokens, typography, spacing, responsive omission, and
     interaction contract. Recommendation: continue with the next ranked
     production-backed delta, `trending-videos-1280` at `2.644%`, and classify
     its dark-surface and media changes before modifying it. Effort: small.
     Confidence: high, based on side-by-side inspected images, exact fixture
     and allocator tracing, current route source tracing, seven passing focused
     stories, and a 0% focused visual rerun.
     [Prior failing/current direct-story capture](../playwright/visual-regression/todays-edit-minimal-1280-actual.png)
     [Reviewed current baseline](../../tests/visual-baselines/todays-edit-minimal-1280.png)

189. **Trending Videos rail at 1280px — the `2.644%` visual difference was
     checked-in editorial and poster-image churn, not verified token, layout,
     accessibility, interaction, allocator, playback API, route, or component
     drift.** Priority: P2 classification, resolved in the current checkout.
     The prior baseline and current direct-story capture preserve the same
     centered 280px production rail, black Videos canvas, `#181B20` surface,
     translucent light border, 8px rail radius, 16px padding, light-blue
     heading, four ranked rows, 96×54 media, 6px media radius, rank badges,
     duration badges, title typography, and three-line clamp. The visible
     changed pixels are the four ranked story selections, poster images, and
     their natural title wrapping.

     `HearstPlusTrendingRails.stories.tsx` imports the exact exported
     `TrendingVideoRail` rendered by `home-page.tsx`. The story converts the
     current generated multi-destination editorial fixture into deterministic
     playable videos with the fixed checked-in clip and five-second duration,
     then calls the same `buildVideoDestinationQueue` production allocator.
     The current ranked result is Autoweek’s “NASCAR’s New Generation Has
     Different Priorities,” Best Products’ “Teen Acne 101: The Products That
     Fix Breakouts Without the Stinging,” Bring a Trailer’s “1973 Triumph
     Stag,” and Cosmopolitan’s “The Streak-Free Self-Tanner Paige DeSorbo
     Swears By Actually Lives Up to the Hype.” The older Kendall Jenner,
     House of the Dragon, and Ramcharger rows no longer belong to the compact
     generated fixture after the feed refresh; the Best Products row remains
     and moved from rank three to rank two.

     A fresh 1280px direct-story DOM inspection confirms an H2-labelled
     `Trending videos` region, ordered list, four completely named buttons,
     zero horizontal overflow, a 280×401.758px reviewed content-driven rail,
     96×54 media, `rgb(24, 27, 32)` surface, 8px radius, 16px padding, and
     `rgb(189, 221, 252)` heading. A fresh current-route capture of
     `/hearst-plus/videos/` confirms the routed product uses the same component,
     dark tokens, H2 region, ordered four-row list, rank/duration treatment,
     poster anatomy, and complete accessible button names. Its live playable
     feed selects a separate MotorTrend-heavy ranking with real durations,
     which is expected API/editorial state rather than same-title pixel
     evidence. The 276px rendered section inside the route’s padded 280px
     sticky rail is the existing parent-layout context; its internal media,
     padding, tokens, and row contract match the direct story.

     Only `trending-videos-1280` was regenerated. The inspected 1280×900
     baseline SHA-256 is
     `b7204ae24e3c448c54527a5c40f1dd230be04d84c640a7fda3a517e615f7bf23`;
     the focused rerun passes at `0%`, and all six direct Trending Rails
     Chromium interaction/accessibility stories pass. The known visual-failure
     queue therefore falls from 23 to 22 without a broad baseline update or a
     new complete sweep. User impact: reviewers see the current deterministic
     editorial ranking without misclassifying ordinary poster and story
     rotation as a broken Videos surface. Engineering impact: the baseline
     continues to protect dark-surface scoping, component geometry, heading
     semantics, list structure, accessible button names, rank and duration
     badges, media anatomy, and click behavior. Recommendation: continue with
     the next ranked production-backed delta,
     `reader-action-bar-premium-ready-1280` at `2.852%`, and distinguish
     premium/editorial state from shared-control drift before modifying it.
     Effort: small. Confidence: high, based on inspected before/current images,
     fresh production and direct-story captures, bounded DOM measurements,
     exact component/fixture/allocator/route tracing, six passing focused
     stories, and a 0% focused visual rerun.
     [Current production Videos rail at 1280px](../playwright/storybook-reaudit-2026-07-27/131-production-trending-videos-current-1280.png)
     [Current direct Storybook rail at 1280px](../playwright/storybook-reaudit-2026-07-27/132-storybook-trending-videos-current-1280.png)
     [Prior failing/current direct-story capture](../playwright/visual-regression/trending-videos-1280-actual.png)
     [Reviewed current baseline](../../tests/visual-baselines/trending-videos-1280.png)

190. **Premium-ready Reader Action Bar at 1280px — the `2.852%` visual
     difference was checked-in Elle fixture churn, not verified component,
     token, layout, state/API, keyboard, accessibility, interaction, or
     consumer-route drift.** Priority: P2 classification, resolved in the
     current checkout. The prior baseline and current direct-story capture
     preserve the same centered 704px reader surface, eyebrow, H2 hierarchy,
     54px bordered action row, 12px vertical padding, author/date layout,
     compact 28×28 desktop controls, premium-reader focus treatment,
     save/comment controls, and polite requested-state message. The changed
     pixels are the story headline, author initials, author name, and the
     resulting headline wrap.

     `HearstPlusReaderControls.stories.tsx` imports the exact exported
     `ReaderActionBar` used by the routed reader in `home-page.tsx`.
     `getComponentStoryForBrand("elle")` still selects the first Elle story
     from the deterministic generated multi-destination fixture. That fixture
     now begins with “Inside EDITION’s Chic Montauk Takeover at Crow’s Nest”
     by Moriel Mizrahi Finder, replacing the older baseline’s “Gabrielle
     Union-Wade and Ferragamo Toast the Brand’s Hamptons Pop-Up” by Aimée
     Lutkin. Both stories remain production-shaped Elle inventory; the
     premium-ready state, fixed article dates, 12-comment fixture, save state,
     and callback contract are unchanged.

     The state/API trace confirms `getAmbientReaderState` returns `ready` only
     for a source-backed non-video story whose loaded article is complete;
     incomplete loading remains `loading`, complete-but-insufficient or failed
     content becomes `unavailable`, and unsupported stories omit the state.
     The action bar renders the premium control only for `loading` or `ready`,
     disables it while loading, exposes `aria-keyshortcuts="P"` and the
     complete accessible name while ready, and calls the supplied
     `onOpenPremiumReader`. Save remains an `aria-pressed` toggle and comments
     retain a story-specific fragment link.

     A fresh 1280px direct-story DOM inspection confirms the 704×54px action
     row, zero horizontal overflow, enabled 28×28 premium button, visible focus
     ring, `P` shortcut metadata, unselected save state, and the exact
     story-specific comments anchor. A fresh current-route capture of
     `/hearst-flux/` opened the same current Elle story in the production
     reader and confirmed the shared action bar under publication theme tokens:
     54px row height, 12px vertical padding, enabled 28×28 premium control,
     story-specific save/comment semantics, and zero document overflow.
     Pressing `P` from the production premium control opened the named Ambient
     Reader dialog for the active story, confirming the routed keyboard
     consumer rather than only the button callback.

     Only `reader-action-bar-premium-ready-1280` was regenerated. The inspected
     1280×420 baseline SHA-256 is
     `b06346fe30dbbf5a527f38eacb010e6150235351f43f5c02a05489d315a4d6f7`;
     the focused rerun passes at `0%`, and all five direct Reader Controls
     Chromium state/interaction stories pass. The known visual-failure queue
     therefore falls from 22 to 21 without a broad baseline update or a new
     complete sweep. User impact: reviewers see the current Elle source and
     retain a predictable premium-reader affordance. Engineering impact: the
     baseline continues to protect responsive control sizing, focus treatment,
     readiness semantics, keyboard discoverability, save state, comments
     anchoring, publication dates, and callback behavior. Recommendation:
     continue with the next ranked unresolved production-backed delta and
     classify its stable state separately from editorial content before any
     modification. Effort: small. Confidence: high, based on side-by-side
     inspected images, fresh Storybook and production-route captures, bounded
     DOM measurements, exact fixture/component/state/consumer tracing, a live
     production keyboard-shortcut check, five passing focused stories, and a
     0% focused visual rerun.
     [Current direct Storybook action bar at 1280px](../playwright/storybook-reaudit-2026-07-27/133-storybook-reader-action-premium-current-1280.png)
     [Current production reader action bar at 1280px](../playwright/storybook-reaudit-2026-07-27/134-production-reader-action-premium-current-1280.png)
     [Prior failing/current direct-story capture](../playwright/visual-regression/reader-action-bar-premium-ready-1280-actual.png)
     [Reviewed current baseline](../../tests/visual-baselines/reader-action-bar-premium-ready-1280.png)

191. **Responsive onboarding at 320px — the `4.192%` visual difference was
     checked-in editorial preview churn, not verified component, token, layout,
     state/API, keyboard, accessibility, interaction, or consumer-route
     drift.** Priority: P2 classification, resolved in the current checkout.
     The prior baseline and current 320×844 visual-test capture preserve the
     same 288px modal, 16px outer gutter, dimmed backdrop, header and footer
     boundaries, 44×44 close control, 3xl mobile heading, selection counter,
     horizontally scrolling interest chips, preview-card grid, and sticky
     action footer. The changed pixels are concentrated in the three
     production-shaped preview stories: the first Country Living card now
     shows “12 Native Plants That Will Turn Your Yard Into a Year-Round Bird
     Haven” and its current image instead of “7 Beautiful Old-Fashioned Herbs
     to Grow in Your Garden,” with corresponding current companion cards below.

     `HearstPlusOnboarding.stories.tsx` imports the exact exported
     `HearstOnboardingModal` mounted by `home-page.tsx`. Its deterministic
     `hearstPlusStoryData.all` fixture is generated from the same checked-in
     Lifestyle, Autos, Fashion & Luxury, and Enthusiast & Wellness feed modules
     that back `getHearstDestinationStaticData()`. The generator deliberately
     chooses up to three representative stories per publication; the refreshed
     Country Living inventory replaced the older herb story with the native
     plants story while keeping the Home-interest match and modal API intact.

     The current `/hearst-plus/` consumer route passes production static data,
     blended current Personalize article and video feeds, and the all-brand
     inventory into `HomePageTemplate`; its Sign in / Sign up control opens the
     same onboarding export. Fresh routed DOM inspection confirms the named
     dialog, focused H2, `aria-describedby`, body scroll isolation, unpressed
     interest controls, disabled Continue state before selection, and 44px
     close and chip targets. Selecting Home produces three current routed
     preview stories, leaves focus on Home, sets `aria-pressed="true"`, enables
     Continue, and preserves zero horizontal overflow. Different live routed
     headlines are expected API/editorial state; the Storybook fixture remains
     deterministic and production-shaped rather than pretending to freeze the
     current network response.

     Only `onboarding-mobile-320` was regenerated. The inspected 320×844
     baseline SHA-256 is
     `ed52339fc297329c17a057143459df818dc4c0eb5f6cc3aea2f21502d9e48350`;
     the focused rerun passes at `0.131%`, within the existing tolerance, and
     all four direct onboarding Chromium interaction/accessibility stories
     pass. The fresh read-only full queue identified 21 failures among 47
     cases before this correction, so the known unresolved queue now falls to
     20 without a broad baseline update. User impact: reviewers see current
     deterministic editorial preview content without mistaking normal feed
     refreshes for a broken mobile onboarding flow. Engineering impact: the
     baseline continues to protect mobile containment, touch targets, sticky
     actions, focus behavior, selection state, preview anatomy, and the
     production modal contract. Recommendation: continue with the next ranked
     unresolved production-backed case, `todays-edit-complete-1280` at
     `4.783%`, and classify editorial allocation separately from stable strip
     behavior before any modification. Effort: small. Confidence: high, based
     on inspected before/current images, fresh direct-story and production
     captures, exact fixture/generator/component/route tracing, bounded routed
     DOM checks, four passing focused stories, and the passing focused visual
     rerun.
     [Current production onboarding consumer](../playwright/storybook-reaudit-2026-07-27/135-onboarding-production-route-modal.png)
     [Current direct Storybook onboarding state](../playwright/storybook-reaudit-2026-07-27/136-onboarding-responsive-mobile-direct-story.png)
     [Current 320px visual-test capture](../playwright/visual-regression/onboarding-mobile-320-actual.png)
     [Reviewed current 320px baseline](../../tests/visual-baselines/onboarding-mobile-320.png)

192. **Complete Today’s Edit at 1280px — the original `4.783%` visual
     difference combined one real fixture-fidelity defect with three
     allocator-driven editorial changes; no production component, token,
     layout, API, accessibility, or interaction drift was verified.**
     Priority: P1 fixture correction plus P2 editorial classification, resolved
     in the current checkout. The before/current comparison preserves the same
     1184×123px strip, 8px radius, `rgb(255, 255, 255)` strip surface,
     `rgb(199, 217, 234)` border, card shadow, four equal 295.5px columns,
     16px card padding, 80×64 media, uppercase section labels, three-line title
     clamp, and zero horizontal document overflow.

     The complete direct story had lost a real horoscope when the compact
     representative fixture rotated. Its fallback retitled a Women’s Health
     vitamin-D story as “Your daily horoscope,” leaving an unrelated image and
     story identity in the Horoscope slot. That was state-fixture drift, not
     acceptable editorial churn. `generate-storybook-fixtures.ts` now selects
     a source-backed horoscope or zodiac story from the checked-in Lifestyle
     production inventory, fails closed if none exists, and emits
     `storybookTodayEditHoroscopeStory`. The generated export and the source
     inventory resolve to the same Cosmopolitan story ID,
     `cosmopolitan-lifestyle-a73176505-weekly-horoscope-july-26-2026`, title,
     source URL, image, author metadata, tags, popularity, and signal.
     `HearstPlusTodayEdit.stories.tsx` uses that exact generated record when the
     compact multi-destination selection does not already contain a horoscope.
     The fixture regeneration remains reproducible at 87 representative
     stories.

     `HearstPlusTodayEdit.stories.tsx` imports the exact exported
     `TodayEditStrip` used by `home-page.tsx` and calls the same
     `allocateStoryModules` production allocator. The complete state reserves
     the five hero stories, supplies one genuine Continue Reading ID and one
     followed brand, then allocates Horoscope, Continue Reading, New From Your
     Brands, and Trending Today without duplicating reserved stories or
     consuming the protected river minimum. After restoring the real
     horoscope, the remaining visual difference fell from `4.783%` to
     `3.782%`: Country Living’s current tomato-recipes story replaces the
     Harry Potter baking-kit continuation, Delish’s mall-food-court story
     replaces the Pepsi body-care followed-brand card, and Autoweek’s NASCAR
     priorities story replaces the Lando Norris trending card. Their images
     and natural title wraps account for the remaining pixels.

     Fresh direct-story DOM inspection confirms the H2-labelled Today’s Edit
     region, four complete button names and source story IDs, a 1182px grid
     track with four equal columns, and exact current strip tokens. Clicking
     Continue Reading writes the same Country Living story ID to the opened,
     continued, and impression live statuses, confirming the component’s
     `onOpenStory`, `onContinueOpen`, and desktop impression contract. The
     current `/hearst-plus/` route renders the same exported component and
     production allocator with live reader state: its separately current
     Zodiac, Elle, and Cosmopolitan allocation has the exact same 1184×123px
     outer geometry, four 295.5px cards, colors, radius, shadow, heading
     semantics, and zero overflow. Different routed titles are expected live
     API/profile state, not a same-title parity requirement.

     Only `todays-edit-complete-1280` was regenerated after the narrow fixture
     correction. The inspected 1280×500 baseline SHA-256 is
     `79e1772c14fa45117e80e3038ef43dc2a2623759e96370895e04b9d5b560dd46`;
     repeated focused visual comparison passes at `0.001%`, all seven direct
     Today’s Edit Chromium state, responsive, keyboard, accessibility, and
     interaction stories pass, and the static Storybook rebuild succeeds.
     The known unresolved visual queue therefore falls from 20 to 19 without a
     broad baseline update. User impact: reviewers see a coherent,
     source-backed horoscope beside current deterministic editorial choices.
     Engineering impact: the fixture pipeline now preserves complete-state
     fidelity across feed refreshes while the baseline continues to protect
     allocator output, component geometry, token use, semantics, continuation
     telemetry callbacks, desktop grid behavior, tablet keyboard focus, mobile
     omission, and incomplete-core suppression. Recommendation: inspect the
     next ranked unresolved production-backed case,
     `story-actions-mobile-390` at `5.049%`, before changing it. Effort: small.
     Confidence: high, based on inspected before/corrected/current images,
     exact generated-to-production story identity, fresh direct and routed DOM
     measurements, exercised continuation callbacks, reproducible fixture
     generation, seven passing focused stories, a successful static build, and
     repeated `0.001%` focused visual verification.
     [Current direct Storybook complete state](../playwright/storybook-reaudit-2026-07-27/137-storybook-todays-edit-complete-current-1280.png)
     [Current production Today’s Edit consumer](../playwright/storybook-reaudit-2026-07-27/138-production-todays-edit-current-1280.png)
     [Current focused 1280px capture](../playwright/visual-regression/todays-edit-complete-1280-actual.png)
     [Reviewed current 1280px baseline](../../tests/visual-baselines/todays-edit-complete-1280.png)

193. **Story Actions at 390px — the original `5.049%` difference is
     deterministic editorial-fixture churn and natural headline wrapping, not
     verified responsive, token, state/API, accessibility, keyboard, focus, or
     interaction drift.** Priority: P2 classification, resolved in the current
     checkout. The prior baseline used “Everyone Who Dies on ‘House of the
     Dragon’ Season 3.” The current generated all-brand fixture correctly uses
     the first checked-in Cosmopolitan Lifestyle production story, “Shirt
     Dresses Are the Practical, Polished Summer Staple—H&M's $35 Striped
     Design Is a Favorite This Season.” Its extra wrapped line moves the card
     footer and live-status copy down by about one line; the action order,
     iconography, labels, spacing, surface, border, radius, and status treatment
     remain unchanged.

     `HearstPlusStoryActions.stories.tsx` imports the exact exported
     `LifestyleStoryActions` rendered by both `RichPhotoGalleryCard` and
     `LifestyleRiverCard` in `home-page.tsx`. The mobile story obtains its
     record through `getComponentStoryForBrand("hearst-all")`; that generated
     record has the same title and story identity as the checked-in
     `lifestyle-river-data.ts` source. The current `/hearst-plus/` consumer
     passes the same `toggleSaved`, `boostStory`, `hideStory`, and `openStory`
     callbacks into the production river card. Its live blended feed showed a
     different current Cosmopolitan headline during the routed check, which is
     expected API/editorial state rather than a reason to make the static
     Storybook fixture nondeterministic.

     Fresh direct-story DOM inspection confirms the story-specific
     `role="group"` label and four accessible controls: Save, More like this,
     comments, and Hide. Save exposes `aria-pressed`; More like this and Hide
     include the story title; comments include the count. At the real 390px
     production route, all four controls measured at least 44px high and 44px
     wide except the naturally wider text actions, use the same transparent
     surface and muted action color, and produce no horizontal overflow.
     Keyboard Space moved Save from `aria-pressed="false"` to `"true"`, kept
     focus on the control, and changed its accessible name from “Save story” to
     “Remove from saved stories.” The focused Storybook suite also verifies
     the polite live-status updates, comments/open behavior, saved state,
     current-feed badge, and focus transfer to the adjacent story opener after
     Hide.

     No component, route, token, fixture-generator, or story source changed for
     this classification. Only `story-actions-mobile-390` was regenerated. The
     inspected 390×420 baseline SHA-256 is
     `832e3e284e8a4e3a17dc9f6f8f316d38ea7d0428bc07ffe4c69e6766dffce979`;
     the focused read-only comparison passes at `0%`, and all six direct Story
     Actions Chromium interaction/accessibility stories pass. A subsequent
     complete read-only visual sweep reports 18 unresolved cases among 47,
     confirming this case remains green without a broad update. User impact:
     reviewers see the current deterministic production-shaped headline while
     retaining the same compact mobile action behavior. Engineering impact:
     the baseline continues to protect mobile containment, touch targets,
     focus, keyboard activation, screen-reader names and pressed state, action
     ordering, tokens, and the shared production callback contract.
     Recommendation: inspect the next ranked unresolved production-backed
     case, `todays-edit-tablet-768` at `3.534%`, before changing it. Effort:
     small. Confidence: high, based on inspected before/current images, exact
     fixture/source/component/route tracing, fresh direct and routed DOM
     evidence, keyboard state exercise, six passing focused stories, a `0%`
     focused visual rerun, and the fresh complete read-only queue.
     [Current production mobile consumer](../playwright/storybook-reaudit-2026-07-27/139-production-story-actions-mobile-current-390.png)
     [Current focused 390px capture](../playwright/visual-regression/story-actions-mobile-390-actual.png)
     [Reviewed current 390px baseline](../../tests/visual-baselines/story-actions-mobile-390.png)

194. **Today’s Edit at 768px — the ranked `3.534%` difference is the
     tablet crop of the same allocator-driven editorial changes already
     verified in the complete desktop state, not tablet layout, token,
     allocator/API, touch, focus, keyboard, or screen-reader drift.**
     Priority: P2 classification, resolved in the current checkout. A focused
     pre-update run measured `3.535%`. The prior tablet baseline paired the
     preserved Cosmopolitan horoscope with Delish’s Harry Potter baking-kit
     continuation and Pepsi body-care followed-brand story. The current
     production-shaped selection pairs that same source-backed horoscope with
     Country Living’s tomato-recipes continuation, Delish’s mall-food-court
     followed-brand story, and Autoweek’s NASCAR priorities trending story.
     Their current images and natural title wraps account for the changed
     pixels.

     `HearstPlusTodayEdit.stories.tsx` imports the exact exported
     `TodayEditStrip` mounted by `home-page.tsx` and calls the same
     `allocateStoryModules` production allocator. The complete fixture reserves
     five hero records, supplies one genuine unfinished story and one followed
     brand, and allocates four distinct source records without consuming the
     protected river inventory. The prior source-backed horoscope correction
     remains intact; all four current IDs, titles, and images resolve to the
     checked-in generated fixture and production river inventories. No new
     fixture or allocator defect was found.

     At exactly 768px, the direct story and current `/hearst-plus/` consumer
     both render a 720×123px strip containing 291.8×121px snap cards. Both use
     `rgb(255, 255, 255)` for the strip surface, `rgb(199, 217, 234)` for the
     border, an 8px radius, the same card shadow, and a 44×44px named carousel
     control without document overflow. The production route’s live reader
     state omitted Continue Reading and allocated three different current API
     stories, but retained the exact tablet geometry and tokens. That is
     expected profile/editorial state rather than a same-title parity
     requirement.

     The H2-labelled region exposes each card as one large button whose
     accessible name combines its module label and full story title. Keyboard
     Enter on “Next stories in today’s edit” moved the track from `0` to `449`
     pixels without animation, replaced it with “Previous stories in today’s
     edit,” and transferred focus to that 44×44px reverse control. The
     after-scroll state reveals the current followed-brand and trending cards
     cleanly while preserving the strip boundary. All seven direct Today’s Edit
     Storybook states pass, covering complete interaction callbacks, first
     visit, minimal allocation, tablet keyboard focus, mobile omission, and
     incomplete-core suppression. All seven focused allocator tests also pass.

     No component, route, token, allocator, fixture-generator, or story source
     changed for this tablet classification. Only
     `todays-edit-tablet-768` was regenerated. The inspected 768×500 baseline
     SHA-256 is
     `4d149585b26670268c0f82af9c95da5a7ecc8fd3d2aae076d6c5b02620d4686c`;
     the focused read-only comparison passes at `0%`, and the subsequent
     complete read-only sweep remains within tolerance at `0.001%`. That sweep
     reports 17 unresolved cases among 47, confirming the correction did not
     broadly update the queue. User impact: tablet readers retain a clear,
     touchable, keyboard-operable editorial strip with current stories.
     Engineering impact: the baseline continues to protect the tablet
     breakpoint, horizontal containment, snap-card sizing, carousel controls,
     focus transfer, accessible names, tokens, and allocator-driven content
     contract. Recommendation: inspect the next ranked unresolved
     production-backed case, `trending-articles-lifestyle-390` at `8.260%`,
     before changing it. Effort: small. Confidence: high, based on inspected
     before/current and after-scroll images, exact component/allocator/fixture/
     route tracing, matched 768px DOM geometry and tokens, exercised keyboard
     focus, 14 passing focused checks, repeated focused visual verification,
     and the fresh complete read-only queue.
     [Current direct tablet state](../playwright/storybook-reaudit-2026-07-27/140-storybook-todays-edit-tablet-current-768.png)
     [Current tablet state after Next](../playwright/storybook-reaudit-2026-07-27/141-storybook-todays-edit-tablet-after-next-768.png)
     [Current production tablet consumer](../playwright/storybook-reaudit-2026-07-27/142-production-todays-edit-tablet-current-768.png)
     [Current focused 768px capture](../playwright/visual-regression/todays-edit-tablet-768-actual.png)
     [Reviewed current 768px baseline](../../tests/visual-baselines/todays-edit-tablet-768.png)

195. **Trending Across Brands at 390px — the `8.260%` difference is
     deterministic allocator/editorial churn and natural row-height change,
     not mobile layout, overflow, token, touch, focus, keyboard,
     screen-reader, or interaction drift.** Priority: P2 classification,
     resolved in the current checkout. The prior baseline ranked Frozen
     S’mores Bars, Costco Water Sample, Hydrangeas, Shrinking Your Brain, and
     Kitchen Products. The current checked-in Lifestyle fixture ranks Peach
     Cobbler Scones, Thai-Inspired Watermelon & Peach Salad, the House
     Beautiful fixer-upper story, Tickborne Infections, and Cardiologist
     Habits. Current titles, topics, bylines, and line wraps explain the changed
     pixels and the small increase in natural rail height.

     `HearstPlusTrendingRails.stories.tsx` imports the exact exported
     `TrendingStoryRail` mounted by `home-page.tsx`. Its deterministic
     cross-brand state calls the production `allocateStoryModules` function
     with the first five stories reserved for the hero, three Daily Habit
     records, no Today’s Edit allocation, and four protected river stories.
     The resulting five ranked IDs, titles, topics, bylines, popularity data,
     and brand diversity all resolve to the generated Lifestyle fixture and
     checked-in production river inventory. The current
     `/hearst-lifestyle/` route calls the same allocator against its live
     `displayStories` and passes `moduleAllocation.trendingStories` to the same
     component export. Different live stories across fresh route requests are
     expected API/editorial state, not a reason to make the static fixture
     nondeterministic.

     At exactly 390px, the direct story renders a 358px-wide rail with 16px
     padding, 324px-wide story buttons, a white surface, `rgb(231, 214, 223)`
     border, 8px radius, and the production card shadow. Every story target has
     a 44px minimum height; current measured heights range from 44px to 97.8px
     according to title and metadata wrapping. The document has no horizontal
     overflow. The current Lifestyle route renders the same 358px rail,
     tokens, ordered-list semantics, responsive width, and target contract.
     In the single-column mobile route it follows the progressive river and
     becomes visible after the “caught up” state; that existing production
     ordering is outside the direct component pixel change.

     The H2-labelled section exposes five ordered buttons with complete
     `Open story: {title}` accessible names. Keyboard focus produces the
     visible inset primary ring and matching primary title treatment. Enter on
     the first direct-story button retains focus and announces
     “Opened Peach Cobbler Scones” through the polite status region. The same
     keyboard action on the routed consumer opens the named Story reader
     dialog. All six direct Trending Rails Storybook states pass, covering
     cross-brand interaction, publication scoping, both video states, and the
     empty allocation. All seven focused allocator tests also pass, including
     distinct inventory, brand diversity, and protected-river behavior.

     No component, route, token, allocator, fixture-generator, or story source
     changed for this classification. Only
     `trending-articles-lifestyle-390` was regenerated. The inspected 390×844
     baseline SHA-256 is
     `efae007fcc3078a5a8abcb5af357c5f7134e8a1bf65eb79b0a356652cc68ddd3`;
     the focused read-only comparison passes at `0%`. The subsequent complete
     read-only sweep also passes this case at `0%` and reports 16 unresolved
     cases among 47. User impact: mobile readers retain a compact, readable,
     touchable ranked list with current source-backed stories. Engineering
     impact: the baseline continues to protect mobile width and containment,
     minimum target size, focus visibility, accessible names, ordered
     semantics, tokens, callback behavior, and the production allocation
     contract. Recommendation: inspect the next ranked unresolved
     production-backed case, `brand-spotlight-production-1280` at `9.138%`,
     before changing it. Effort: small. Confidence: high, based on inspected
     before/current and focused images, exact component/allocator/fixture/route
     tracing, matched mobile geometry and tokens, exercised direct and routed
     keyboard behavior, 13 passing focused checks, a `0%` focused visual
     rerun, and the fresh complete read-only queue.
     [Current direct mobile rail](../playwright/storybook-reaudit-2026-07-27/143-storybook-trending-articles-mobile-current-390.png)
     [Current direct mobile focus state](../playwright/storybook-reaudit-2026-07-27/144-storybook-trending-articles-mobile-focus-390.png)
     [Current production Lifestyle mobile rail](../playwright/storybook-reaudit-2026-07-27/145-production-trending-articles-mobile-current-390.png)
     [Current focused 390px capture](../playwright/visual-regression/trending-articles-lifestyle-390-actual.png)
     [Reviewed current 390px baseline](../../tests/visual-baselines/trending-articles-lifestyle-390.png)

196. **Brand Spotlight at 1280px — the `9.138%` difference is deterministic
     Car and Driver editorial allocation churn, not component, theme-token,
     logo, asset, layout, interaction, or accessibility drift.** Priority: P2
     classification, resolved in the current checkout. The prior baseline
     featured the maintained 1990 Ferrari Testarossa and paired it with the
     AEV Ford Super Duty package and 2001 sports-sedan comparison. The current
     checked-in fixture ranks the pink Desert Rising Ford Bronco, lifted Honda
     Accord SUV report, and 2001 Qvale Mangusta gallery. Their images,
     headlines, metadata, and natural wrapping account for the changed pixels;
     the surrounding module is unchanged.

     `HearstPlusBrandSpotlight.stories.tsx` imports the exact exported
     `BrandPromotionRiverModule` mounted by `home-page.tsx` and calls the
     production `getBrandPromotionForSlot` allocator against
     `hearstPlusStoryData.all.stories`. The allocator groups and deduplicates
     eligible stories, preserves the supported-brand priority order, ranks by
     active-topic match, popularity, and freshness, requires at least three
     unique stories, and rotates the eligible publication by module slot. The
     direct default state resolves the three current Car and Driver records
     from the generated autos fixture. The current `/hearst-plus/` consumer
     calls the same allocator and renders the same component after every
     second eligible five-story river interval. Its live inventory currently
     yields four Car and Driver stories rather than the fixture’s three, which
     is expected editorial/API state and does not change the component
     contract.

     At exactly 1280px, the direct story renders a 636px-wide, 536.3px-tall
     module with a white surface, `rgb(199, 217, 234)` border, 8px radius, and
     the production shadow. Its two-column feature/secondary layout has no
     horizontal overflow. The current routed consumer renders the same 636px
     width, tokens, columns, and responsive rules; its natural height is 619px
     because it has a fourth story. The canonical publication target is
     `/autos/car-and-driver/` and measures 180×44px. The shared `BrandLogo`
     resolves `/logos/caranddriver.svg`, reports ready state, exposes the
     `Car and Driver` label, preserves the intrinsic full-color red/blue
     artwork at 180×36px, and continues to sanitize the checked-in SVG before
     insertion. The five canonical logo states and the direct Spotlight’s
     default, publication-navigation, mobile-containment, and no-eligible-
     promotion states all pass.

     The section has the complete `Brand spotlight: Car and Driver` region
     name. Every story button exposes `Open story: {title}`; the publication
     link exposes `Open Car and Driver publication`. Keyboard focus on the
     featured story produces the visible 2px primary focus ring. Enter
     activation in the routed consumer opens the named `Story reader` dialog.
     The direct Storybook checks also verify the callback receives the exact
     story ID, generic Article/Gallery/Watch diagnostics remain omitted, the
     publication target is at least 44px, mobile content is contained, and an
     ineligible allocation omits the module.

     No component, route, allocator, fixture, token, logo, or story source
     changed for this classification. Only
     `brand-spotlight-production-1280` was regenerated. The inspected
     1280×900 baseline SHA-256 is
     `0ff44ea1ca8b7ec69ed7f7350ba5dd20820733c73702d4ca81422b5baa265954`;
     the focused read-only comparison passes at `0%`. Nine direct Storybook
     checks and five focused model/token checks pass. The subsequent complete
     read-only sweep also passes this case at `0%` and reports 15 unresolved
     cases among 47. User impact: readers retain the current source-backed Car
     and Driver promotion with the canonical brand treatment and complete
     interaction semantics. Engineering impact: the baseline continues to
     protect the shared component boundary, brand asset and route, desktop
     geometry, responsive containment, tokens, focus visibility, accessible
     names, callback behavior, allocator rules, and empty state.
     Recommendation: inspect the next ranked unresolved production-backed
     case, `reader-action-bar-default-390` at `10.092%`, before changing it.
     Effort: small. Confidence: high, based on inspected prior/current,
     focused, focus, and routed images, exact component/allocator/fixture/
     route tracing, matched geometry and tokens, exercised routed keyboard
     behavior, 14 passing focused checks, a `0%` focused visual rerun, and the
     fresh complete read-only queue.
     [Current direct Brand Spotlight](../playwright/storybook-reaudit-2026-07-27/147-storybook-brand-spotlight-current-1280.png)
     [Current direct focus state](../playwright/storybook-reaudit-2026-07-27/148-storybook-brand-spotlight-focus-1280.png)
     [Current production Brand Spotlight](../playwright/storybook-reaudit-2026-07-27/149-production-brand-spotlight-current-1280.png)
     [Current focused 1280px capture](../playwright/visual-regression/brand-spotlight-production-1280-actual.png)
     [Reviewed current 1280px baseline](../../tests/visual-baselines/brand-spotlight-production-1280.png)

197. **Reader Action Bar default state at 390px — the `10.092%` difference is
     deterministic Elle fixture churn and its natural vertical reflow, not
     mobile component, state-API, token, overflow, touch, focus, keyboard,
     screen-reader, or callback drift.** Priority: P2 classification, resolved
     in the current checkout. The prior baseline used “Gabrielle Union-Wade
     and Ferragamo Toast the Brand’s Hamptons Pop-Up,” author initials `AL`,
     and Aimée Lutkin. The current generated Flux fixture begins with “Inside
     EDITION’s Chic Montauk Takeover at Crow’s Nest,” initials `MM`, and Moriel
     Mizrahi Finder. The current headline occupies two lines instead of three,
     moving the unchanged metadata and control rows upward. Those text pixels
     and the resulting vertical position account for the visual difference.

     `HearstPlusReaderControls.stories.tsx` imports the exact exported
     `ReaderActionBar` mounted by `home-page.tsx`. Its deterministic Elle state
     calls `getComponentStoryForBrand("elle")`, which resolves the same current
     generated fixture record present in the checked-in Flux river. The story
     supplies a production-shaped article with fixed publication/update dates,
     12 comments, local save state, and an observable premium-open callback.
     The default interaction intentionally clicks Save before the visual
     capture, so both the prior and current baselines protect the selected
     bookmark state. The current `/hearst-flux/` consumer opens the same Elle
     story in the production `Story reader` and passes the exact component
     live article data, saved-ID state, computed comment count, Ambient Reader
     readiness, and callbacks.

     The shared state contract remains explicit. An omitted premium state
     renders only Save and Comments. `loading` renders a disabled
     `Preparing premium reading experience` control; `ready` renders the
     enabled `Open premium reading experience. Shortcut P` control with
     `aria-keyshortcuts="P"`; `unavailable` omits the premium control without
     disabling Save or Comments. Production `getAmbientReaderState` returns no
     premium state for a missing source or video, `ready` only for a complete
     loaded article, `unavailable` for an incomplete/error result, and
     `loading` while eligible article data is unresolved. The routed
     `onOpenPremiumReader` callback is provided only for a complete article.

     At 390px, the direct story remains 390px wide with 16px side padding and
     a 358px-wide, 150px-tall action boundary. It has no horizontal overflow.
     Default Save and Comments targets are each 44×44px. Loading adds a third
     44×44px premium target; unavailable returns to the same two-target
     geometry. The current dark routed reader also has no overflow: its
     article is 358px wide, the inset action row is 316×126px, and premium,
     Save, and Comments are each 44×44px. Its different height and 14-comment
     value reflect the current live article and route theme, not a direct-story
     mismatch.

     Save is a native button with `aria-pressed`; activation changes its
     accessible name from `Save story` to `Remove from saved stories`.
     Focus remains on the same control and the 2px focus ring remains visible.
     A focused Space-key activation was verified at 390px and preserved both
     focus and the 390px document width. Comments remains a native anchor named
     `Jump to 12 comments` in Storybook and `Jump to 14 comments` in the
     current route. The routed `P` shortcut opens the named
     `Ambient Reader: Inside EDITION’s Chic Montauk Takeover at Crow’s Nest`
     dialog. These semantics and the five direct Storybook checks cover
     screen-reader-facing state names and keyboard operability, while not
     claiming full assistive-technology conformance.

     No component, route, state resolver, fixture, token, or story source
     changed for this classification. Only
     `reader-action-bar-default-390` was regenerated. The inspected 390×420
     baseline SHA-256 is
     `f71a332879d1e62612d2a6bcfb53c8f67bff4fe99fa140bdae3d7293edac66d0`;
     the focused read-only comparison passes at `0%`. All five direct Reader
     Controls stories pass, covering default/save callback behavior, saved,
     premium-ready callback, loading, and unavailable states. The subsequent
     complete read-only sweep also passes this case at `0%` and reports 14
     unresolved cases among 47. User impact: mobile readers retain contained,
     touchable controls with current source-backed author context and clear
     premium availability. Engineering impact: the baseline continues to
     protect exact production imports, default and premium state contracts,
     mobile reflow, touch sizing, focus, keyboard activation, accessible
     names, save/comment callbacks, and overflow containment. Recommendation:
     inspect the next ranked unresolved production-backed case,
     `trending-videos-390` at `10.138%`, before changing it. Effort: small.
     Confidence: high, based on inspected side-by-side and focused images,
     exact component/fixture/state/route tracing, measured direct and routed
     mobile DOM, exercised Space and `P` keyboard behavior, five passing
     focused stories, a `0%` focused visual rerun, and the fresh complete
     read-only queue.
     [Prior/current side-by-side](../playwright/storybook-reaudit-2026-07-27/150-reader-action-bar-default-baseline-current-390.png)
     [Current direct default state](../playwright/storybook-reaudit-2026-07-27/151-storybook-reader-action-bar-default-current-390.png)
     [Current production mobile reader](../playwright/storybook-reaudit-2026-07-27/152-production-reader-action-bar-current-390.png)
     [Current direct unavailable state](../playwright/storybook-reaudit-2026-07-27/153-storybook-reader-action-bar-unavailable-390.png)
     [Current direct loading state](../playwright/storybook-reaudit-2026-07-27/154-storybook-reader-action-bar-loading-390.png)
     [Current focused 390px capture](../playwright/visual-regression/reader-action-bar-default-390-actual.png)
     [Reviewed current 390px baseline](../../tests/visual-baselines/reader-action-bar-default-390.png)

198. **Trending Videos at 390px — the `10.138%` difference is deterministic
     editorial/media queue churn, not mobile component, layout, overflow,
     touch-target, focus, keyboard, screen-reader, dark-token, poster/play,
     or callback drift.** Priority: P2 classification, resolved in the current
     checkout. The prior baseline ranked Autoweek’s “Lando Norris Finally Wins
     in 2026 at Hungarian Grand Prix,” Elle’s Kendall Jenner/Jacob Elordi
     timeline, Best Products’ teen-acne guide, and Bring a Trailer’s 1988
     Dodge Ramcharger. The current deterministic queue ranks Autoweek’s
     “NASCAR’s New Generation Has Different Priorities,” the same Best
     Products guide, Bring a Trailer’s 1973 Triumph Stag, and Cosmopolitan’s
     Paige DeSorbo self-tanner story. The changed posters, publications,
     titles, and natural title wraps account for the changed pixels.

     `HearstPlusTrendingRails.stories.tsx` imports the exact exported
     `TrendingVideoRail` used by `home-page.tsx`. Its current records come
     from the checked-in multi-destination video fixture and the exact
     `buildVideoDestinationQueue` production allocator. The allocator filters
     to production video cards, protects the featured story, handles promoted
     Delish portrait Shorts separately, ranks eligible stories by popularity,
     publication date, and title, then takes four trending records. The
     Storybook wrapper retains each source-backed poster and metadata while
     giving every standard video a deterministic five-second 960×540 local
     media fixture; the promoted portrait Short uses the 540×960 fixture.
     The current `/hearst-plus/videos/` route calls the same allocator over
     its live inventory and passes its resulting stories to the same rail.
     Its current MotorTrend rows therefore differ from the checked-in
     Storybook sample without changing the component contract.

     At exactly 390px, Storybook renders a 358px-wide, 382.5px-tall dark
     surface at 16px side margins. It uses the production `rgb(24, 27, 32)`
     surface, `rgba(255, 255, 255, 0.12)` border, 8px radius, production
     shadow, `rgb(189, 221, 252)` heading, and `rgb(244, 247, 251)` text. Each
     row is 324px wide, its poster is 96×54px, and its measured height is
     58.5px, 77.75px, 54px, or 77.75px, keeping every full-row button at
     least 44px tall. The document and viewport are both 390px wide with no
     horizontal overflow. The current routed rail has the same 358px surface,
     324px rows, tokens, poster geometry, and containment. On mobile it
     intentionally follows the progressive main video feed, so the direct
     story remains the deterministic isolated regression boundary.

     The rail is an ordered list inside the named `Trending videos` region.
     Every row is one native button named `Trending video {rank}: {title}`;
     the poster image is decorative and the complete story title remains in
     the accessible name. Keyboard focus produces the visible 2px ring.
     Activating the first focused row with Enter retains focus and updates the
     direct story’s polite status to the exact opened title, confirming the
     callback receives the allocated story. The compact trending rail is
     intentionally a poster-only navigation control, not a duplicate inline
     video player. The current mobile Videos consumer separately exposes the
     featured poster’s named `Play video: {title}` control; activating it was
     verified to replace the poster with the exact production video element
     using controls, autoplay, and `playsInline`.

     No component, route, allocator, fixture, token, or story source changed
     for this classification. Only `trending-videos-390` was regenerated. The
     inspected 390×844 baseline SHA-256 is
     `1dd5ee82d043a21ba8884e68ce378e4a4a28c44038879ec2a6ed44c4b97700a7`;
     the focused read-only comparison passes at `0%`. All ten focused
     Trending Rails and Video Cards Storybook checks pass, covering video-rail
     callback behavior, empty state, standard and portrait poster/play
     contracts, muted state, and progress. All nine focused production
     video-queue tests pass, covering ranking, promoted Shorts, deterministic
     ties, exclusions, deduplication, and progressive-feed protection. The
     subsequent complete read-only sweep also passes this case at `0%` and
     reports 13 unresolved cases among 47. User impact: mobile readers retain
     current ranked video choices, contained touchable rows, and clear
     poster-to-play behavior. Engineering impact: the baseline continues to
     protect the exact production component and allocator, deterministic
     fixture media, mobile geometry, dark tokens, overflow, touch sizing,
     focus, keyboard activation, accessible names, and callbacks.
     Recommendation: inspect the next ranked unresolved production-backed
     case, `videos-feed-dark-1280` at `16.428%`, before changing it. Effort:
     small. Confidence: high, based on inspected prior/current, focus, routed
     poster, and routed play images, exact component/allocator/fixture/route
     tracing, matched direct and routed geometry, exercised keyboard and click
     behavior, 19 passing focused checks, a `0%` focused visual rerun, and the
     fresh complete read-only queue.
     [Prior/current side-by-side](../playwright/storybook-reaudit-2026-07-27/155-trending-videos-baseline-current-390.png)
     [Current direct Trending Videos rail](../playwright/storybook-reaudit-2026-07-27/156-storybook-trending-videos-current-390.png)
     [Current direct focus state](../playwright/storybook-reaudit-2026-07-27/157-storybook-trending-videos-focus-390.png)
     [Current production mobile poster state](../playwright/storybook-reaudit-2026-07-27/158-production-videos-mobile-current-390.png)
     [Current production mobile play state](../playwright/storybook-reaudit-2026-07-27/159-production-videos-mobile-play-state-390.png)
     [Current focused 390px capture](../playwright/visual-regression/trending-videos-390-actual.png)
     [Reviewed current 390px baseline](../../tests/visual-baselines/trending-videos-390.png)

199. **Videos Feed at 1280px — the original `16.428%` difference combined
     deterministic editorial/media churn with one real integrated-header
     defect and one production focus-restoration defect; both defects are
     narrowly corrected.** Priority: P1 fidelity and accessibility correction,
     resolved in the current checkout. The prior baseline used a Ferrari
     Testarossa lead and an older four-item trending queue. The current
     fixed-clock Storybook queue uses the pink Ford Bronco lead, current
     publication metadata, a different four-item trending queue, and a Delish
     Shorts module that enters the 900px viewport. Those poster, title,
     metadata, count, wrapping, and vertical-placement changes are
     deterministic editorial/media churn. The current live
     `/hearst-plus/videos/` route independently leads with “2026 Audi Q3
     Overview” and live MotorTrend rail records, confirming that live API
     editorial selection is not an appropriate static pixel oracle.

     The Storybook story in `HearstPlusApp.stories.tsx` renders the exact
     `HomePageTemplate` used by production with `initialFilter="Videos"`,
     `hearstPlusStoryData`, `hearstPlusVideoStoryData.all`, and the production
     account boundary. The production route
     `src/app/hearst-plus/[categorySlug]/page.tsx` delegates to
     `DestinationCategoryRoutePage`, which renders the same
     `HomePageTemplate` with destination `all`, production static data, and
     live progressive editorial/video feeds. Both paths resolve video
     inventory through `resolveProgressiveVideoFeed` and
     `buildVideoDestinationQueue`, then render the exact
     `VideoFeedLeadCard`, `VideoIndexCard`, `DelishVerticalVideoCarousel`,
     `TrendingVideoRail`, navigation, masthead, and `Footer`. The queue keeps
     only playable production video cards, excludes promoted exact-9:16
     Delish Shorts from standard slots, preserves a featured lead, and ranks
     trending records deterministically. Storybook retains production-shaped
     source records and posters while assigning the checked-in five-second
     landscape and portrait media fixtures.

     The real header defect was state/path coupling. Production showed the
     dark utility bar and masthead, but Storybook’s exact integrated component
     rendered a light header because `useVideosDarkHeader` required the browser
     pathname to equal `/hearst-plus/videos`; an iframe pathname can never
     satisfy that condition even while `initialFilter="Videos"` renders the
     same destination state. `home-page.tsx:6620-6622` now derives the dark
     header from the production state contract—destination `all`, no selected
     publication, and active Videos filter—rather than from the hosting path.
     The integrated story now asserts the knockout utility-bar token, `#0d1014`
     masthead, active Videos link, named main, Recommended Videos and Delish
     Shorts structure, and footer disclosure. No generic theme or token was
     changed.

     At 1280×900 the corrected direct story and current production route both
     contain the page horizontally: viewport and document widths are 1280px,
     the main grid begins at x=48px and is 1184px wide, and its columns are
     220px / 636px / 280px with 24px gaps. The main video column begins at
     x=292px and is 636px wide. The featured Play target is 56×56px; trending
     row buttons are at least 77.75px high in this state. The video surface
     uses `--hp-background: #000000`, `--hp-surface: #181b20`,
     `--hp-text-headline: #f4f7fb`, `--hp-text-secondary: #aab5c3`, and
     `--hp-sidebar-heading: #bdddfc`. Navigation exposes one active Videos
     link with `aria-current="page"`; the page has one named `Hearst videos`
     main, named navigation landmarks, a complementary discovery/trending
     rail, named Delish Shorts and Trending Videos regions, and one footer.
     The 56px primary Play control, mobile variants, and adaptive-video error
     retry satisfy the 44px touch target. Save, Open Story, and carousel
     controls intentionally use the existing compact desktop density above
     the mobile breakpoint and remain separated, keyboard reachable, and
     visibly focusable; this audit did not broaden that production contract.

     Poster activation replaces the decorative poster with the exact
     `AdaptiveVideo` using controls, autoplay, `playsInline`, and metadata
     preload. The focused Adaptive Video states cover ready landscape,
     portrait, recoverable error/retry, and unavailable media behavior.
     Save toggles `aria-pressed`, changes its accessible name, and retains
     focus; Play responds to Enter; the lead story opens the named Story reader
     by keyboard; and no direct-story, visual-harness, or routed-page browser
     errors were observed.

     Focus restoration was a separate proven production defect, not harness
     noise. `ContentReaderDialogShell` intentionally stores an opener’s
     accessible label and, after a `/read/` route remount, searches the return
     page for that same label for up to three seconds. The lead headline
     button had no explicit label, so the same-page element reference was
     destroyed and close left focus on `body`. `video-cards.tsx:139-144` now
     gives that exact production opener the unique persistent name
     `Open story: {title}`. The integrated regression opens the reader, closes
     it, and waits for the exact lead trigger to regain focus. A fresh routed
     check on `/hearst-plus/videos/` restored focus to
     `Open story: 2026 Audi Q3 Overview`, returned to the Videos route, and
     emitted zero browser errors.

     Only `tests/visual-baselines/videos-feed-dark-1280.png` was updated. The
     inspected final 1280×900 baseline SHA-256 is
     `1bf6fe700a6f4033b2ae6b0e2d66683be3967e62ee0cb329b2413c10a6a232d3`;
     the final focused read-only comparison passes at `0%`. Four focused
     Storybook files pass all 15 checks: the integrated app, navigation,
     Video Cards, and Adaptive Video states. The three production queue/media
     test files pass all 17 checks, and the three touched source/story files
     pass focused lint. The final complete read-only visual queue passes this
     case at `0%` and reports 12 unresolved cases among 47. The next ranked
     unresolved production-backed case is `reader-success-elle-390` at
     `18.548%`; it is followed by `article-river-card-320` at `20.932%`.
     User impact: Videos now keeps the intended dark destination
     shell and returns keyboard focus after the routed reader closes.
     Engineering impact: the regression boundary now protects state-derived
     header theming, the exact production component/queue/media structure,
     desktop geometry and tokens, keyboard callbacks, accessible landmarks
     and names, browser-error hygiene, and cross-route focus restoration.
     Effort: small. Confidence: high.
     [Prior/current side-by-side](../playwright/storybook-reaudit-2026-07-27/160-videos-feed-dark-baseline-current-1280.png)
     [Fixed-clock Storybook before header correction](../playwright/storybook-reaudit-2026-07-27/163-storybook-videos-feed-fixed-clock-1280.png)
     [Corrected Storybook Videos feed](../playwright/storybook-reaudit-2026-07-27/164-storybook-videos-feed-corrected-1280.png)
     [Corrected baseline comparison](../playwright/storybook-reaudit-2026-07-27/166-videos-feed-dark-baseline-corrected-1280.png)
     [Keyboard focus evidence](../playwright/storybook-reaudit-2026-07-27/167-storybook-videos-feed-keyboard-focus-1280.png)
     [Production focus restored after reader close](../playwright/storybook-reaudit-2026-07-27/168-production-videos-focus-restored-1280.png)
     [Reviewed final 1280px baseline](../../tests/visual-baselines/videos-feed-dark-1280.png)

200. **ELLE publication reader at 390px — the `18.548%` difference is
     production-shaped editorial fixture churn plus one legitimate current
     ELLE button-token change, not reader shell, layout, interaction, state,
     accessibility, typography, logo, or route drift.** Priority: P2
     classification, resolved in the current checkout. The prior baseline
     opened ELLE’s Kendall Jenner/Jacob Elordi timeline with its restaurant
     image, July 26 date, and 14 comments. The current checked-in fixture and
     production route open “Dakota Johnson Transforms Into Marilyn Monroe in
     the First Photos From Flesh Impact,” with its current portrait, July 27
     date, and 13 comments. Headline wrapping changes naturally while the
     measured reader frame remains fixed.

     The remaining visible Close-button change is intentional and
     production-aligned. The old baseline rendered a dark transparent outline;
     the current Storybook and current `/flux/elle/` reader both render the
     same 44×44px white ELLE neutral-outline control with `rgb(117, 117, 117)`
     border and `rgb(18, 18, 18)` icon. That result follows the current ELLE
     brand token source rather than a local Storybook override. The routed
     reader and direct story also use the same checked-in `/logos/elle.svg`
     wordmark, dark Fashion & Luxury shell, white foreground, Modern MT Pro
     headline, and Neue Haas Unica Pro default type.

     `HearstPlusReaderOverlays.stories.tsx` renders the exact production
     `HomePageTemplate`, publication-scoped ELLE story data, reader return
     route, queue model, and reader modal. Its success fixture primes the
     production live-article client cache for every eligible queue record, so
     the reader moves through the real loading-state resolver into the exact
     `LifestyleStoryReaderModal`, `ContentReaderDialogShell`,
     `ContentReaderMasthead`, `ReaderActionBar`, `ReaderArticleBody`,
     comments, recommendations, nested gallery, and Ambient Reader
     boundaries without a live network dependency. The actual
     `src/app/flux/[brandSlug]/page.tsx` route delegates to
     `SectionBrandRoutePage`, opens the same reader at the canonical
     `/read/{story}/?from=%2Fflux%2Felle%2F` URL, and uses live article data.
     The Storybook success state exposes its deterministic “What to know”
     structured body; the current route exposes the source-backed “THE
     RUNDOWN” body. This is correct fixture-versus-live-content separation,
     not API drift.

     Direct and routed DOM geometry match exactly at 390×844: the dialog shell
     is x=0, y=0, 390×844px; document, shell client, and shell scroll widths
     are all 390px with no horizontal overflow; the article is x=16, y=140,
     358px wide; the hero opener is x=37, y=161, 316×178px; and the headline
     is x=37, y=391, 316×189px. Both render the headline at 36px with 37.8px
     line height and Modern MT Pro weight 400. The ELLE homepage link is
     x=16, y=22, 230×24px and is named `Go to Elle homepage`; the 44×44px
     Close target is x=330, y=12. Culture is the only section with
     `aria-current="page"`.

     The named `Story reader` dialog isolates the underlying page and starts
     focus on `Close story reader`. Its mobile order proceeds through the
     ELLE homepage, Close, section controls, hero image, brand follow, reader
     actions, comments, and recommendations. Manual boundary checks confirm
     Shift+Tab from the first focusable wraps to the last recommendation and
     Tab from the last wraps to the ELLE homepage. Escape closes the modal,
     returns to `/flux/elle/`, and restores focus to the exact Dakota Johnson
     opener. The current production route reproduces the same Enter-to-open,
     Escape-to-close, and focus-return behavior with zero browser errors.
     The nested gallery and Ambient Reader stories additionally prove that
     the parent dialog becomes inert/hidden and regains focus correctly after
     the nested dialog closes.

     Phone Close, follow, premium, save, comment, Post, like, and reply
     controls meet the existing 44px-height contract. Actions have complete
     names and state semantics: follow/unfollow and save/remove names reflect
     state, Save uses `aria-pressed`, the premium-ready control exposes
     `aria-keyshortcuts="P"`, comments are a named region and jump target, and
     recommendation buttons include full titles. The loading body announces
     `Loading the full article and photos...` through a polite live region;
     with reduced motion requested, all three skeleton animations compute to
     `none`. The error overlay exposes the failure copy through `role="status"`
     and retains Close focus. Premium loading is disabled and named
     `Preparing premium reading experience`; premium unavailable omits the
     ineffective control while leaving Save available. This reader surface
     has no permission-gated article state, so no separate permission fallback
     is applicable.

     At an effective 195px CSS viewport, equivalent to 200% zoom on 390px,
     document, shell client, and shell scroll widths remain 195px; the article
     reflows to 163px and Close remains 44×44px. The long headline and body
     rewrap without horizontal clipping. This is current browser evidence,
     not a claim of complete WCAG or screen-reader conformance.

     No component, story, fixture, token, route, or test source changed for
     this classification. Only
     `tests/visual-baselines/reader-success-elle-390.png` was regenerated. The
     inspected 390×844 baseline SHA-256 is
     `993dcf2bd3beb7fcbbe869eee3d348b191875ca4d601559149fe127b573cc766`;
     the focused read-only comparison passes at `0%`, and the final complete
     queue passes it at `0.002%`. Seven focused Storybook files pass all 30
     reader-overlay, article-body, controls, comments, masthead, brand-logo,
     and theme checks. Four focused model/navigation/token files pass all 18
     tests. The first full-queue attempt stopped on unrelated transient remote
     image `ERR_NETWORK_CHANGED` errors; the unchanged retry completed and
     reports 11 unresolved cases among 47. User impact: ELLE readers keep the
     exact current publication identity, contained mobile reading flow,
     understandable states, and reliable keyboard return path. Engineering
     impact: the baseline protects the same production shell, queue, brand
     runtime, state resolver, nested-dialog, and route contract without
     freezing stale editorial content. Recommendation: inspect the next ranked
     production-backed case, `article-river-card-320` at `20.932%`. Effort:
     small. Confidence: high.
     [Prior/current side-by-side](../playwright/storybook-reaudit-2026-07-27/169-reader-success-elle-baseline-current-390.png)
     [Current deterministic ELLE reader](../playwright/storybook-reaudit-2026-07-27/170-storybook-reader-success-elle-current-390.png)
     [Current production ELLE route](../playwright/storybook-reaudit-2026-07-27/171-production-elle-route-390.png)
     [Current production ELLE reader](../playwright/storybook-reaudit-2026-07-27/172-production-elle-reader-current-390.png)
     [Current 200% zoom reflow](../playwright/storybook-reaudit-2026-07-27/173-storybook-reader-success-elle-200pct-zoom.png)
     [Reviewed final 390px baseline](../../tests/visual-baselines/reader-success-elle-390.png)

201. **Lifestyle article-river card at 320px — the `20.932%` difference is
     checked-in editorial fixture churn plus the production shopping-guide
     presentation now selected by that content; no card layout, API,
     interaction, accessibility, token, or image-handling defect was found.**
     Priority: P2 classification, resolved in the current checkout. The prior
     baseline used Cosmopolitan’s older House of the Dragon story, ship image,
     Entertainment/Leah Marilla Thomas metadata, and standard article
     treatment. The current generated fixture uses “Shirt Dresses Are the
     Practical, Polished Summer Staple—H&M’s $35 Striped Design Is a Favorite
     This Season,” its current H&M image, Style Beauty/Jade Biggs metadata,
     and current July 27 source record. Because the production presentation
     resolver classifies “Favorite” service content as shopping and its topic
     is not the literal Shopping or Style label, it correctly renders the
     `Guide` badge, five editor picks, and Lab-informed picks. Those additional
     modules account for the card-height and action-row movement; they are not
     responsive drift.

     The Storybook path is production-shaped end to end.
     `HearstPlusEditorialCards.stories.tsx:16-20,50-67,88-105` selects the
     first non-video, non-gallery Lifestyle record, renders the exported
     `LifestyleRiverCard`, supplies the same controlled saved state and
     callback API, and verifies `aria-pressed` plus the save callback.
     `hearst-plus-component-fixtures.ts:7-12,21-48` resolves the
     `hearst-lifestyle` destination from the compact generated fixture.
     `generated/hearst-plus-fixtures.ts:19-46` is byte-for-byte aligned for
     this record with the checked-in production source at
     `lifestyle-river-data.ts:79-104`. The generator takes representative
     records directly from that production array. No hand-authored placeholder
     or live-network response participates in the visual case.

     The production consumer is `/hearst-lifestyle/`.
     `src/app/hearst-lifestyle/page.tsx:18-27` wraps the real
     `HomePageTemplate` in the `hearst-lifestyle` theme and blends its static
     inventory with the current live feed. `home-page.tsx:2316-2422` is the
     exact card exported to Storybook and used by the routed river. The
     current source story is allocated to Today’s Picks before the river, so
     the routed comparison uses the next equivalent Cosmopolitan Style Beauty
     Guide card; it confirms the same media, signal/badge/source order,
     shopping module, action group, responsive geometry, and scoped Lifestyle
     primary token. Focusing Save on the routed card changes its headline to
     the same `rgb(122, 46, 87)` production token as Storybook. This is
     allocator placement, not component divergence.

     At 320×844 the direct card is x=16, y=16 and 288px wide; document
     `scrollWidth` and `clientWidth` are both 320px. The card is 582.4px high.
     Its loaded 5738×3825 source image renders as a 286×160.9px 16:9 cover
     crop with the reviewed `50% 16%` people-forward position. The image has a
     complete descriptive alt; its transient opacity reaches 1, and reduced
     motion removes the fade (`transition-duration: 0s`). The current image
     loads successfully, so an error fallback is not invoked; non-video cards
     have no poster/play state, and this pure editorial card has no separate
     disabled, empty, or loading control state.

     The card exposes one full-surface button named `Open story: {title}`, one
     publication link named `Open Cosmopolitan brand page`, an H2 headline,
     and one action group named for the full title. The group then exposes
     Save/Remove with `aria-pressed`, More like this, the 18-comment opener,
     and Hide in reading order. At 320px their measured targets are
     51.5×44, 92.4×44, 44×44, and 48.4×44px; the brand link is 235.9×44px
     and the overlay opener is 286×580.4px. The opener’s inset 2px Lifestyle
     ring is visibly retained. Existing direct Story Actions states verify
     save, more-like-this, comment-open callbacks and status announcements,
     saved/current-feed variants, mobile containment, and focus transfer to
     the adjacent story after Hide. The card itself has no modal close,
     Escape, permission, pressed-card, or selected-card contract beyond these
     supported actions. At an effective 160px CSS viewport, equivalent to
     200% zoom on 320px, document widths remain 160px and the card reflows to
     128px without horizontal overflow. The direct story and routed page emit
     zero browser errors. This is observed keyboard/DOM evidence, not a claim
     of complete screen-reader or WCAG conformance.

     No component, story, allocator, fixture, token, route, or test source was
     changed. Only
     `tests/visual-baselines/article-river-card-320.png` was regenerated. The
     inspected final 320×844 baseline SHA-256 is
     `60719100eeb753444ce83e1806d665b7500a8f4d0f5d73a52719f73680b134ed`;
     the focused read-only comparison passes at `0%`. Three focused Storybook
     files pass all 10 Editorial Cards, Story Actions, and Story Presentation
     checks. The focused allocator, presentation-model, and token files pass
     all 16 tests. The final complete 47-case queue is read-only, passes this
     case at `0%`, and reports 10 unresolved cases. The next ranked unresolved
     production-backed case is `lifestyle-destination-home-1280` at
     `22.904%`. User impact: the catalog now shows the same current source
     content and production Guide treatment without freezing stale editorial
     imagery. Engineering impact: the baseline protects the exact production
     component, responsive reflow, media crop, Lifestyle token, semantic
     order, action contract, reduced-motion behavior, and deterministic
     fixture pipeline. Effort: small. Confidence: high.
     [Prior/current Storybook comparison](../playwright/storybook-reaudit-2026-07-27/177-article-river-card-prior-current-320.png)
     [Current deterministic Storybook card](../playwright/storybook-reaudit-2026-07-27/174-article-river-card-storybook-320.png)
     [Equivalent production Lifestyle Guide card](../playwright/storybook-reaudit-2026-07-27/175-production-lifestyle-guide-card-320.png)
     [Keyboard focus evidence](../playwright/storybook-reaudit-2026-07-27/176-article-river-card-opener-focus-320.png)
     [Production saved/focus token evidence](../playwright/storybook-reaudit-2026-07-27/178-production-lifestyle-guide-card-saved-focus-320.png)
     [Reviewed final 320px baseline](../../tests/visual-baselines/article-river-card-320.png)

202. **Lifestyle destination home at 1280px — the original `22.904%`
     difference was predominantly checked-in editorial allocation churn, but
     the comparison also exposed one real Storybook consumer-API defect:
     Storybook forced the cross-brand destination into publication mode.**
     Priority: P1 Storybook fidelity defect, fixed in the current checkout.
     The prior baseline used Country Living’s “7 Beautiful Old-Fashioned
     Herbs to Grow in Your Garden,” an older daily-habit set, and an older
     Trending Across Brands allocation. The current generated fixture selects
     “3 Simple Decorating Tricks to Take Your Screened-In Porch from Drab to
     Dreamy,” the current daily-habit stories, current trending stories, and
     the current Delish river lead. Their images, headlines, metadata, and
     natural wraps explain the large pixel delta; the header, three-column
     composition, hero dimensions, card variants, typography, spacing, and
     brand palette remain aligned.

     The real drift was at the story wrapper boundary.
     `LifestyleDestinationApp.stories.tsx` passed
     `initialBrandSlug="hearst-lifestyle"` to the exact production
     `HomePageTemplate`. The actual `/hearst-lifestyle/` route at
     `src/app/hearst-lifestyle/page.tsx:18-27` sets the Lifestyle
     `ThemeProvider` and supplies the static, blended live, video, and
     onboarding inventories, but does not pass a publication slug.
     `home-page.tsx:5628-5647` treats a truthy publication slug as a global
     publication inventory and changes the discovery sidebar title, counts,
     behavior, and explanatory copy. That made Storybook render “Global Story
     Inventory” and “Complete section inventory. Select a brand to open its
     publication,” while production correctly renders “Filter Brands” and
     “All brands are included in the river.”

     The narrow correction at
     `LifestyleDestinationApp.stories.tsx:11-20` removes only the incorrect
     `initialBrandSlug`; the `hearst-lifestyle` theme, production return route,
     generated static destination data, and deterministic local video feed
     remain unchanged. The focused `play` regression at lines 46-62 asserts
     the production destination copy and rejects the publication-only title
     at desktop and mobile breakpoints. No production component, allocator,
     route, token, or fixture source changed.

     The fixture path remains deterministic and production-shaped.
     `hearst-plus-story-data.ts:1-32` imports the generated fixture, limits
     each destination to 20 checked-in stories, and exposes the Lifestyle
     inventory through `HearstDestinationStaticData`;
     `hearst-plus-story-data.ts:35-77` adds only labeled local playable media
     for video interactions. `home-page.tsx:4697-4719` resolves the current
     personalized hero, and `home-page.tsx:4797-4831` passes the remaining
     inventory through the exact production `allocateStoryModules` pipeline.
     The routed page intentionally blends current Personalize content, so
     route and Storybook editorial records need not be byte-identical; their
     component, allocator, token, and API contracts do.

     Fresh direct DOM measurement at 1280×900 reports no horizontal overflow:
     document `clientWidth` and `scrollWidth` are both 1280px. The production
     grid is x=48, y=203, width=1184px with 220px, 636px, and 280px columns
     separated by 24px gaps; the named main is x=292 and 636px wide.
     Storybook exposes Utility navigation, Hearst destination navigation,
     Hearst Lifestyle topic navigation, a named Lifestyle discovery sidebar,
     a main named “Personalized lifestyle story river,” and the production
     footer. The page H1 remains screen-reader-only, while card headlines keep
     their H2 order. Runtime values resolve to Lifestyle brand
     `#7A2E57`, page `#F7EFE7`, and the Newsreader headline stack.

     Keyboard Enter opens the named Search dialog, focuses “Search Hearst
     stories,” and Escape closes it and restores focus to Search after the
     production close transition. Space on Country Living updates its
     `aria-pressed` state to `true`. The theme toggle changes the document to
     dark mode and its accessible name to “Switch to light mode.” The hero
     exposes named Previous, Pause, and Next controls; Story Actions expose
     named Save and More like this controls. At an effective 640px CSS
     viewport, equivalent to 200% zoom on 1280px, document `clientWidth` and
     `scrollWidth` remain 640px and the main reflows to 608px. With reduced
     motion enabled, the preference is detected and inspected image
     transitions resolve to `0s`. The direct story emitted zero console or
     page errors.

     Loading, empty, retry/error, saved/selected, feedback, navigation,
     carousel, sidebar-filter, brand-theme, and responsive behaviors are
     covered by the focused production-component story matrix. A separate
     permission-gated state is not part of this public destination contract.
     Loaded editorial images preserve their source dimensions and current
     crops; decorative brand marks remain empty-alt, while story media uses
     its production text alternative. The desktop shell intentionally retains
     production’s compact density: several utility links, topic links, Search,
     theme, sign-in, and carousel controls are below 44px even though the main
     card surfaces and mobile action patterns are larger. This is a
     production-level target-size follow-up, not Storybook-only drift, and was
     not broadened into a cross-navigation change during this one-case fix.
     These checks are browser and DOM evidence, not a claim of complete WCAG
     or screen-reader conformance.

     Nine focused Storybook files pass all 41 destination, integrated app,
     navigation, sidebar, carousel, card, feed-state, Story Actions, and theme
     checks. Five focused allocator, presentation, token, personalization, and
     video-model files pass all 32 tests. Focused lint passes. The static
     Storybook rebuild completes, with only its existing module-directive,
     sourcemap, and chunk-size warnings. Only
     `tests/visual-baselines/lifestyle-destination-home-1280.png` was
     regenerated. The inspected 1280×900 baseline SHA-256 is
     `37925cc4fd67a5fe0e6f9353a636866bff0cb0f13957bee3408843453fbaccd3`;
     the focused read-only comparison passes at `0%`, and the fresh complete
     47-case queue passes it at `0%`.

     The complete queue is read-only and reports 9 unresolved cases. The next
     ranked numeric production-backed delta is
     `featured-carousel-mixed-1280` at `23.878%` (tied with
     `featured-carousel-saved-1280`; the mixed state appears first in queue
     order). User impact: Storybook now teaches the actual cross-brand
     Lifestyle filter model instead of incorrectly instructing readers to
     open a publication. Engineering impact: the story and its baseline now
     protect the same production page, destination API, allocator, responsive
     grid, brand runtime, landmarks, keyboard behavior, and deterministic
     content boundary. Effort: small. Confidence: high.
     [Prior/current editorial comparison](../playwright/storybook-reaudit-2026-07-27/184-lifestyle-destination-prior-current-1280.png)
     [Current production Lifestyle route](../playwright/storybook-reaudit-2026-07-27/185-lifestyle-destination-production-current-1280.png)
     [Reviewed final 1280px baseline](../../tests/visual-baselines/lifestyle-destination-home-1280.png)

203. **Mixed-brand Featured Carousel at 1280px — the `23.878%` visual
     difference is deterministic editorial/media fixture churn, while the
     interaction audit exposed and fixed a separate real production
     accessibility defect: automatic rotation continued after keyboard focus
     entered the carousel and user-driven slide changes were not announced.**
     Priority: P1 interaction/accessibility correction plus P2 visual
     classification, resolved in the current checkout. The prior baseline
     opened on House Beautiful’s older hydrangea story, image, summary, and
     derived 16-comment count. The current fixture opens on “I’ve Sold Three
     Fixer-Uppers, and This DIY Project Adds the Most Value Every Time,” its
     current image and summary, and the current derived 11-comment count.
     Frame geometry, image scrim, source icon and label, Video badge, headline
     and summary clamps, slide-position pill, controls, indicators, and action
     surface are otherwise unchanged.

     The direct Storybook state remains production-shaped.
     `HearstPlusFeaturedCarousel.stories.tsx:9-39` takes the first five
     distinct publication records from the checked-in all-destination
     fixture, keeps three editorial anchors, clones one current article, and
     turns the fifth distinct-brand record into a labeled deterministic
     playable-video fixture. The refreshed generated fixture now makes that
     fifth record the current House Beautiful fixer-upper story; the old
     hydrangea record is still checked in farther down the complete source
     inventory but is no longer the first House Beautiful candidate.
     `hearst-plus-story-data.ts:1-32` imports the generated fixture and
     supplies its bounded production-aligned destination records. No
     hand-authored visual placeholder or live-network selection participates
     in this baseline.

     Storybook imports the exact exported production component at
     `featured-story-carousel.tsx:54-471`; there is no parallel carousel.
     The actual `/hearst-plus/` consumer at
     `src/app/hearst-plus/page.tsx:17-33` supplies the current static, blended
     live, video, and onboarding inventories to `HomePageTemplate`.
     `home-page.tsx:2431-2484` rescored eligible stories, protects brand
     diversity, and fills the production mixed-format allocation.
     `home-page.tsx:4697-4719` stabilizes the five-story Today’s Picks edition
     for the local day, and `home-page.tsx:5653-5680` passes those stories,
     saved state, production image renderer, comment resolver, current-feed
     resolver, callbacks, and indicator palette to the same component. The
     live route naturally opens on a different personalized Elle story, but
     it preserves the same five-slide anatomy and production behavior.

     Before the correction, browser focus remained on Save while the active
     selector advanced from story 1 to story 2 after 6.8 seconds. The carousel
     also contained no `aria-live`, status, or alert region. The narrow source
     fix at `featured-story-carousel.tsx:78-117,199-231` now stops the
     6.5-second interval when keyboard focus enters any non-rotation control,
     stops it while the pointer hovers the module, preserves the explicit
     pause/resume control, and exposes a polite atomic “Story N of 5:
     {headline}” status only after rotation has stopped. Automatic rotation
     remains silent while running. The focused regression at
     `HearstPlusFeaturedCarousel.stories.tsx:215-251` confirms that focusing a
     selector changes Pause to Resume, makes the status polite, preserves
     selector focus through Enter activation, exposes exactly one active
     slide, and announces the selected story.

     Fresh direct Storybook measurement at 1280×760 reports a 720×599px
     carousel at x=280, y=24. Each slide is 718×548px with no inter-slide gap;
     adjacent x positions differ by exactly 718px, and the track moves by
     whole-slide `translateX` percentages rather than native scroll snap.
     Document `clientWidth` and `scrollWidth` are both 1280px. The actual
     production route places the same component at x=292, y=358 with a
     636×552px outer box; its five 634×501px slides likewise have zero gap,
     and the document remains 1280px wide without horizontal overflow.

     Production DOM exposes an article named “Today’s Picks” with
     `aria-roledescription="carousel"` and described swipe instructions.
     Exactly one full-slide story button is `aria-hidden="false"`, non-inert,
     and `tabIndex=0`; every inactive slide remains rendered for the transform
     but is hidden, inert, and removed from sequential focus. Every selector
     has the full story title and the active selector has
     `aria-current="true"`. Previous, Pause/Resume, Next, Save/Saved, More like
     this, Follow publication, and slide selectors have complete accessible
     names. The component is cyclic, so it has no terminal first/last disabled
     state; the single-story state intentionally hides rotation/navigation,
     and the empty state omits the component. Reduced motion disables the
     rotation control with an explanatory name, holds the same slide after
     6.8 seconds, and resolves the track transition property to `none`.

     Keyboard Enter on Next retains focus and moves the current selector and
     sole operable slide together. A completed horizontal pointer drag advances
     one slide and does not open a reader dialog; the `touch-pan-y` surface
     preserves vertical scrolling, and a predominantly vertical touch sequence
     leaves the active selector unchanged. Hovering for 6.8 seconds also holds
     the same story. The focused selector remains the active element and keeps
     a visible browser focus outline. Save updates `aria-pressed`, More like this and Follow
     invoke their supplied callbacks, and slide activation invokes both the
     edition-open and story-open callbacks. Opening/closing the reader and
     exact opener restoration belong to the already-verified production reader
     shell; the carousel itself retains focus for in-place controls.

     Current production images load successfully with descriptive
     “{publication}: {headline}” alternatives, intrinsic dimensions, cover
     crops, reviewed object positions, active-image preload, and lazy
     non-active images. Publication source marks are decorative beside their
     visible publication names. The component intentionally delegates image
     rendering to its consumer, so a dedicated broken-image fallback is not a
     Featured Carousel API state and remains an image-renderer coverage gap
     rather than carousel drift. At an effective 640px CSS viewport,
     equivalent to 200% zoom on 1280px, document widths remain 640px, the
     carousel reflows to 608px, and the headline remains within its three-line
     clamp. Direct Storybook and the current route emit zero console or page
     errors. This is current browser/DOM evidence, not a claim of complete
     WCAG or screen-reader conformance.

     Runtime values on the current Hearst+ route resolve to a white surface,
     shared blue primary `#2B6FAF`, Newsreader headline stack, and the
     production strong black image scrim; mixed-brand identity changes only
     source icon, publication label, content, and destination-supported
     palette, not component structure. The existing product-level
     under-44px compact desktop navigation remediation item remains open and
     is not erased by this case. The carousel’s own compact desktop previous,
     pause, and next controls measure 28×28px, while desktop selectors and
     quiet actions are 24px high; mobile carousel controls and selectors
     retain the tested 44×44px treatment. The desktop carousel density is
     recorded beside the navigation target-size follow-up rather than being
     silently accepted or broadened into a cross-product size change during
     this visual case.

     All seven direct Featured Carousel Storybook states pass, covering mixed
     allocation, active-slide semantics, saved state, mobile targets,
     publication treatment, single-story controls, and empty allocation.
     Five focused allocator, personalization, presentation, video-model, and
     token files pass all 32 tests. Focused lint passes. The production
     `test:a11y:carousel` regression passes all five transitions at 1280px and
     all five at 320px with exactly one operable slide and no page overflow.
     The static Storybook build completes with only its existing
     module-directive, sourcemap, and chunk-size warnings.

     Only
     `tests/visual-baselines/featured-carousel-mixed-1280.png` was
     regenerated. Its inspected 1280×760 SHA-256 is
     `7cac6d3ffb476681ca8cc14de411c02ba8c38b890fb50f65692f96ffb345470a`.
     The focused read-only comparison passes within tolerance at `0.001%`,
     and the fresh complete queue passes it at `0%`. The complete 47-case
     queue is read-only and reports 8 unresolved cases. The next ranked
     production-backed case is `featured-carousel-saved-1280` at `23.878%`.
     User impact: carousel content no longer changes underneath a keyboard
     reader, and user-driven slide selection now has a concise announcement.
     Engineering impact: the baseline protects the current deterministic
     mixed-format fixture while the shared production component protects
     pause, focus, live-status, swipe, reduced-motion, active-slide, and
     responsive contracts. Effort: small. Confidence: high.
     [Prior/current Storybook comparison](../playwright/storybook-reaudit-2026-07-27/186-featured-carousel-mixed-prior-current-1280.png)
     [Current production Hearst+ route](../playwright/storybook-reaudit-2026-07-27/187-featured-carousel-production-route-1280.png)
     [Reviewed final 1280px baseline](../../tests/visual-baselines/featured-carousel-mixed-1280.png)

204. **Saved Featured Carousel at 1280px — the `23.878%` visual
     difference is deterministic editorial fixture churn, while the
     production reader interaction exposed and received one narrow
     return-focus correction.** Priority: P1 interaction correction and P2
     visual classification, resolved in the current checkout. The exact prior
     baseline showed House Beautiful’s hydrangea-pruning story, flower image,
     pruning summary, and derived 16-comment count. The current generated
     all-destination fixture selects the checked-in House Beautiful
     fixer-upper story
     `house-beautiful-home-remodeling-a73274534-diy-built-ins-home-value`,
     its built-in shelving image, current summary, and derived 11-comment
     count. Those pixels and their natural headline wrapping are the same
     editorial change already classified for the mixed-carousel state; the
     saved affordance remains visibly selected in both images.

     `HearstPlusFeaturedCarousel.stories.tsx` reduces the generated
     `hearstPlusStoryData.all.stories` fixture to five distinct publication
     stories, promotes the current House Beautiful video-shaped record, and
     initializes only that exact ID in `savedIds`. The story imports the
     exported production `FeaturedStoryCarousel`; it does not recreate its
     markup. The production `/hearst-plus/` page renders the same component
     through `HomePageTemplate`, supplies the ranked mixed-format hero queue,
     `profile.savedIds`, `toggleSaved`, the production image renderer, comment
     resolver, follow/more-like callbacks, and edition analytics.

     The direct 1280×760 story remains horizontally contained with a 720px
     carousel, five full-width zero-gap slides, one current selector, one
     non-inert active slide, and four inert `tabIndex=-1` slides. The reviewed
     active fixture exposes `data-media-kind="video"`, the current-story
     source contract, descriptive House Beautiful image alternative, active
     image preload, five named selectors, and complete Previous, Pause, Next,
     Save/Saved, More like this, Follow, and Open story names. The current
     `/hearst-plus/` consumer remains contained at 1280px with no document
     overflow; in its production three-column layout the carousel measures
     636×552px while preserving the same slide, selector, action, scrim, and
     token anatomy. Current direct and routed browser checks emit zero console
     or page errors; the route has one non-fatal Next development LCP warning
     for a separate above-the-fold image.

     The shared white surface, blue primary action state, Newsreader headline
     stack, black media frame, image scrim, border, and spacing tokens did not
     drift. The selected control continues to expose visible `Saved` text,
     a filled bookmark, primary color, and `aria-pressed="true"`. Keyboard
     Space toggles Save to Saved, preserves the button node and focus as its
     accessible name changes, and passes the active story through the supplied
     callback. Selecting a different slide exposes that story’s independent
     unsaved state; returning to the original story restores its saved state.
     Focus or hover pauses rotation, the control changes to Resume, and the
     active-story status becomes polite; reduced motion suppresses automatic
     movement, and the cyclic component has no terminal disabled state.

     The Storybook wrapper intentionally models only deterministic in-memory
     saved IDs. The production guest flow likewise keeps personalization in
     the current route state. For signed-in readers,
     `ReaderAccountProvider.updatePreferences` persists `savedIds` in the
     browser-local account, mirrors added and removed IDs into the protected
     Read Later collection, retains source-backed story snapshots, and queues
     the optional synchronized-profile merge. The focused account-model tests
     preserve concurrent saves, explicit removals, Read Later membership, and
     legacy snapshot migration.

     A same-story reader-close edge case was real but not responsible for the
     visual delta. When ranking moves an opener to an inactive carousel slide
     while the reader is open, the shell correctly rejects that hidden
     `aria-hidden`/`inert` opener but previously had no precise visible
     fallback and could leave focus on `body`.
     `content-reader-dialog-shell.tsx` now derives the same story title from
     the stored `Open story: …` label and focuses the visible matching
     `Show story N: …` selector only when no visible exact opener exists. The
     new integrated saved-carousel regression covers keyboard save and
     retained focus, opens the real production reader shell, reproduces the
     inactive-opener contract, closes the reader, and requires focus on the
     matching story selector. A fresh production route check with reduced
     motion also saves with Space, focuses the reader Close control, dismisses
     with Escape, restores the exact opener when it remains visible, and
     records zero browser errors.

     Eleven focused Storybook checks pass: all seven direct Featured Carousel
     states plus all four integrated For You, saved-focus, Videos, and Saved
     empty-list states. Five focused saved-model, allocator,
     personalization, presentation, and token files pass all 26 tests.
     Focused lint passes. The production `test:a11y:carousel` gate passes all
     five selector transitions at both 1280px and 320px, with one operable
     slide and no horizontal overflow.

     Only
     `tests/visual-baselines/featured-carousel-saved-1280.png` was
     regenerated. The inspected 1280×760 baseline SHA-256 is
     `aa5972c767539ab93382b706cd664ae40d853061096b10d9994a666c3bd1db4b`.
     Its focused read-only comparison and the subsequent complete read-only
     queue both pass at `0%`. The complete 47-case queue now reports 7
     unresolved cases. The next ranked production-backed case is
     `vertical-video-carousel-390` at `26.735%`.

     The existing product-level target-size remediation remains open:
     compact desktop Previous, Pause, and Next controls are 28×28px and the
     desktop selectors/actions are 24px high, alongside the separate compact
     navigation finding; mobile carousel controls remain 44px. This focused
     case does not broaden those known product changes. User impact: saved
     state stays understandable and keyboard focus returns to the same story
     context even when ranking changes underneath the reader. Engineering
     impact: the baseline protects the current deterministic saved fixture,
     while the shared shell now protects both exact-opener and inactive-slide
     return-focus contracts. Effort: small. Confidence: high, based on exact
     image and DOM inspection, production component/model/route tracing,
     focused interaction and model gates, a `0%` visual rerun, and the fresh
     complete queue.
     [Current deterministic saved state](../playwright/storybook-reaudit-2026-07-27/188-featured-carousel-saved-current-1280.png)
     [Current production Hearst+ consumer](../playwright/storybook-reaudit-2026-07-27/189-featured-carousel-saved-production-route-1280.png)
     [Reviewed final 1280px baseline](../../tests/visual-baselines/featured-carousel-saved-1280.png)

205. **Vertical-video carousel at 390px — the `26.735%` difference is
     deterministic editorial fixture churn, not production component, token,
     layout, media-contract, interaction, or accessibility drift.** The exact
     390×844 prior and current captures retain the same bordered light
     surface, Hearst icon, heading and six-video status, two complete 164px
     cards plus the intended partial next-card affordance, 9:16 poster crop,
     12px gap, play and duration overlays, two-line title clamp, metadata
     position, and whitespace below the module. The changed pixels are the
     first two checked-in Cosmopolitan posters, headlines, topics, and their
     natural text shapes: the former Entertainment records were replaced by
     the current Style Beauty records headed by “Shirt Dresses…” and “The
     Streak-Free Self-Tanner…”.

     `HearstPlusVideoCards.stories.tsx` imports the exported production
     `VerticalVideoCarousel`; it does not recreate the carousel. Its
     `getPortraitVideoStories` fixture reads the current generated,
     checked-in multi-destination story set, preserves the publication,
     headline, topic, poster, and source metadata, and adds the explicit
     `/storybook-vertical-video-fixture.mp4`, five-second duration, and exact
     540×960 transcoding metadata. `isExactPortraitVideo` delegates to the
     production exact-ratio selector, so only playable `9:16` records render.
     The fixture boundary is intentional and documented: the carousel itself
     is a poster/opening surface, while `AdaptiveVideo` and the production
     Delish Shorts viewer own play, pause, mute, loading, retryable error,
     preload, autoplay, and reduced-motion behavior.

     The current `/hearst-plus/videos/` consumer resolves through
     `HearstDestinationCategoryPage`, `getPersonalizeVideoFeed({ destination:
     "all" })`, `HomePageTemplate`, `getPlayableVideoStories`,
     `mergeDelishPortraitStories`, and the same exported carousel. Fresh routed
     DOM exposes the dark Hearst Videos main landmark and a `Delish Shorts`
     region with 25 current portrait recipe videos headed by “Greek Chicken,”
     “Marry Me Chicken,” and “Stuffed Peppers.” Each item retains the exact
     title, duration, Delish/Food metadata, and `Open Delish short: …`
     accessible name. Promoted portrait IDs are removed from standard video
     slots by the production queue model, and the same inventory feeds the
     route-preserving immersive viewer.

     The direct DOM exposes a labelled region, level-two heading, polite
     six-video status, named list, six list items, and complete
     `Open {publication} short: {title}` button names. The horizontal scroller
     retains `overflow-x:auto`, mandatory x-axis snap, 12px gaps, and
     snap-start cards without document-level overflow. The reviewed mobile
     capture preserves the 164px card width and exact 9:16 crop; the complete
     card button is substantially larger than 44×44px, its focus-visible ring
     stays on the tokenized poster frame, and mobile hides the separate
     desktop rotation controls. At desktop those Previous/Next controls remain
     36×36px and therefore stay in the existing product-level under-44px
     remediation queue; this fixture-only classification does not conceal or
     broaden that issue. Image motion and scrolling respect reduced motion,
     native swipe/touch scrolling remains available, and the bounded
     horizontal scroller contains zoom and orientation reflow.

     All four direct Video Cards stories, all five Delish Shorts Viewer
     stories, all four Adaptive Video states, and all four integrated
     Hearst+ app stories pass: 17 Storybook interaction checks covering
     callbacks, keyboard/actions, focus restoration, poster/ready/error media
     states, dark Videos composition, and the saved-reader regression. The
     focused queue, aspect-ratio, Shorts playback, and runtime-token files pass
     all 19 tests, including exact 16:9/9:16 selection, the supported 25-item
     portrait inventory, queue deduplication, promoted-Short exclusion,
     settled snap selection, adjacent preload, muted-only autoplay, outgoing
     event rejection, and reduced-motion scrolling. The focused visual runner
     also completed with zero console or page errors.

     Only
     `tests/visual-baselines/vertical-video-carousel-390.png` was regenerated.
     The inspected 390×844 baseline SHA-256 is
     `b9454f379c087bf0e956ece4e3860bf4a85dfa9e70dcfd787af1a30ead37fd6a`.
     Its focused read-only comparison passes at `0%`. A fresh complete
     read-only 47-case queue reports 6 unresolved cases; the next ranked
     production-backed case is `lifestyle-destination-home-320` at `44.406%`.
     User impact: the specification now protects the current deterministic
     editorial sample without changing production behavior. Engineering
     impact: no component, API, token, queue, media, or test source changed;
     the one reviewed baseline records current checked-in fixture content.
     Effort: small. Confidence: high, based on exact image and DOM comparison,
     production component/fixture/queue/route tracing, focused interaction and
     model gates, a `0%` focused visual rerun, and the fresh complete queue.
     [Prior reviewed 390px baseline content](../playwright/storybook-reaudit-2026-07-26/85-storybook-vertical-video-carousel-current-390.png)
     [Current 390px visual-run capture](../playwright/visual-regression/vertical-video-carousel-390-actual.png)
     [Reviewed final 390px baseline](../../tests/visual-baselines/vertical-video-carousel-390.png)

206. **Lifestyle destination home at 320px — the `44.406%` difference is
     deterministic editorial allocation churn plus the already-reviewed
     shared carousel presentation, not a new mobile layout, token, API,
     interaction, or accessibility defect.** The exact prior and current
     320×844 captures retain the same mobile utility bar, masthead, horizontal
     topic rail, bounded hero frame, selector row, story actions, module
     ordering, and page width. The prior baseline opened with Country Living’s
     “7 Beautiful Old-Fashioned Herbs…” record, a plain `1 of 5` status, its
     older image and summary, and 12 derived comments. The current generated
     fixture opens with the checked-in Country Living record “3 Simple
     Decorating Tricks…”, its current image and summary, 14 derived comments,
     the reviewed `Today’s Picks · 1 of 5` status treatment, and the current
     outlined Follow control. Those pixels and their natural text wrapping
     account for the changed image area.

     `LifestyleDestinationApp.stories.tsx` imports the exact production
     `HomePageTemplate`, applies the `hearst-lifestyle` runtime theme, and
     supplies `hearstPlusStoryData` plus the Lifestyle video fixture. It
     intentionally does not pass an `initialBrandSlug`, preserving the
     destination-mode correction proved in finding 202. Its `DailyHome`
     interaction requires the mobile/desktop destination contract
     `Filter Brands` and “All brands are included in the river,” and rejects
     the publication-only `Global Story Inventory` label. The current hero
     record is sourced from
     `src/stories/generated/hearst-plus-fixtures.ts` and is identical to the
     checked-in production source in
     `src/components/lifestyle-river-data.ts`; the older herb story remains in
     the source inventory but is no longer selected by the current allocator.

     The actual `/hearst-lifestyle/` route uses the same
     `HomePageTemplate` under `ThemeProvider("hearst-lifestyle")`, passing
     production static, live, video, and onboarding data without a publication
     slug. Fresh route and direct-story DOM checks preserve the same
     destination semantics, navigation/landmark hierarchy, river/card
     composition, brand switching boundary, and shared carousel API even
     though the live route can allocate newer editorial records than the
     deterministic Storybook fixture.

     At the exact 320px Storybook viewport, the DOM exposes the destination
     navigation, named mobile menu and Search controls, Hearst Lifestyle
     masthead, horizontally scrollable topic navigation, Continue Reading,
     one `main` landmark named “Personalized lifestyle story river,” its
     screen-reader heading, the `Today’s Picks` article, five named selectors,
     Save, More like this, and Follow controls, varied editorial cards, Brand
     Spotlight, caught-up status, Trending Across Brands complementary
     content, and the footer. The menu and Search controls, topic links,
     carousel selectors and mobile pause control, story actions, drawer close
     control, brand-filter controls, and search results retain the production
     44px minimum target contract. The topic rail’s native horizontal scroll,
     right-edge cue, and partial content affordance are intentional contained
     overflow, not document overflow. The mobile menu and Search dialogs
     retain labelled modal semantics, focus traps, Escape dismissal, opener
     focus restoration, live result/count feedback, and reduced-motion
     handling. Image cover geometry, lazy/eager ownership, loading/error
     fallbacks, saved/selected/personalized and empty/error state boundaries
     remain owned by the exact production components and their focused
     Storybook states. No console or page error was found in the reviewed
     direct or routed state.

     The desktop destination-mode regression remains intact:
     `lifestyle-destination-home-1280` passes its unchanged read-only
     comparison at `0%`. Nine focused destination, navigation, sidebar,
     carousel, editorial-card, feed-state, story-action, and theme Storybook
     files pass all 42 checks. Five focused allocator, presentation, token,
     personalization, and video-destination model files pass all 32 tests.
     The production carousel accessibility gate passes all five selector
     transitions at both 1280px and 320px with one operable slide and no
     horizontal overflow.

     Only
     `tests/visual-baselines/lifestyle-destination-home-320.png` was
     regenerated for this finding. The inspected 320×844 baseline SHA-256 is
     `79fd0e70d6f87e2fca21862a63d523fb23ac93d106c49c6d83f56d2745b41ff6`,
     exactly matching the subsequent current capture. Its focused read-only
     comparison passes at `0%`. The fresh complete 47-case read-only queue now
     reports five unresolved cases:
     `lifestyle-destination-home-390` (height `7154→7143`),
     `videos-feed-dark-390` (`44.891%`),
     `reader-article-body-ready-390` (height `963→899`),
     `featured-carousel-mobile-390` (`48.806%`), and
     `brand-spotlight-production-320` (height `1135→1124`). The next ranked
     production-backed case is `videos-feed-dark-390` at `44.891%`.

     The existing product-level target-size remediation remains open:
     compact desktop navigation, carousel rotation controls, and desktop
     carousel selectors/actions remain below 44px; the reviewed mobile
     controls remain 44px. User impact: the 320px specification now protects
     the current deterministic Lifestyle edition without changing production
     behavior. Engineering impact: no destination component, story,
     allocator, token, model, or test source was changed for this finding; one
     narrowly reviewed baseline records current checked-in fixture content.
     Effort: small. Confidence: high, based on exact image and DOM comparison,
     production component/fixture/allocator/route tracing, focused state and
     accessibility gates, the desktop regression, a `0%` focused visual
     rerun, and the fresh complete queue.
     [Current 320px visual-run capture](../playwright/visual-regression/lifestyle-destination-home-320-actual.png)
     [Reviewed final 320px baseline](../../tests/visual-baselines/lifestyle-destination-home-320.png)

207. **Videos feed at 390px — the `44.891%` visual difference combines the
     approved production dark-header correction, deterministic editorial/media
     churn, and the now-visible reader return-focus state; one separate 40px
     secondary Play target was a real mobile defect and received a narrow
     44px correction.** The exact prior and current 390×844 captures retain
     the same one-column feed, 16:9 lead poster, dark card geometry, eyebrow,
     source metadata, two-line summary, action row, and Delish Shorts placement.
     The prior baseline still showed the obsolete light utility bar and
     masthead plus the older Car and Driver Ferrari Testarossa record, image,
     summary, 17-comment count, and dark Open story control. The current state
     correctly carries the scoped dark Videos shell onto mobile and selects
     the checked-in Car and Driver pink Ford Bronco record, its current image,
     summary, 15-comment count, and dark-theme action treatment.

     The current headline outline is intentional interaction evidence, not
     token noise. `HearstPlusApp.stories.tsx` opens the exact production Story
     reader from the lead heading, closes it, and requires focus to return to
     that same `Open story: …` button; the visual runner captures the completed
     story state. The outline therefore preserves the desktop focus-restoration
     correction rather than masking it.

     The integrated story imports the exact production `HomePageTemplate`,
     wraps it in the production `hearst-all` theme and reader-account boundary,
     supplies the generated all-destination fixture plus
     `hearstPlusVideoStoryData.all`, and starts with `initialFilter="Videos"`.
     The video fixture retains checked-in publication metadata and posters,
     maps every selected record to the explicit five-second 960×540 Storybook
     MP4, maps one Delish record to the explicit 540×960 vertical MP4, and
     records a fixed source timestamp. The visual runner additionally pins the
     production daypart clock to `2026-07-26T20:00:00-07:00`, so the Bronco
     allocation is deterministic. The Bronco fixture in
     `src/stories/generated/hearst-plus-fixtures.ts` is identical to its
     checked-in production source in `src/components/autos-river-data.ts`;
     the former Ferrari record remains later in the production inventory but
     is no longer part of the selected 20-record Autos Storybook slice.

     The actual `/hearst-plus/videos/` route resolves through
     `src/app/hearst-plus/[categorySlug]/page.tsx`,
     `DestinationCategoryRoutePage({ destination: "all" })`,
     `getPersonalizeVideoFeed`, the progressive video resolver, and the same
     `HomePageTemplate`. The route owns live Personalize video recommendations
     with a checked-in local fallback; Storybook intentionally owns a
     deterministic media boundary while preserving the same component, queue,
     callback, and token contracts. Both consumers use
     `buildVideoDestinationQueue` to exclude promoted Delish Shorts from
     standard slots, select one lead, retain remaining videos, and derive four
     popularity/date/title-ranked Trending videos.

     The desktop correction remains intact. `home-page.tsx` derives
     `useVideosDarkHeader` from destination `all`, no selected publication,
     and active filter `Videos`, then passes that state to the exact
     `UtilityBar` and `MainNav`; it does not depend on Storybook pathname
     emulation. The 390px capture preserves the dark utility surface, dark
     Hearst+ masthead, visible 44px menu and Search controls, active Videos
     underline, and the intentionally scrollable topic rail with its partial
     adjacent-label cue. The complete visual harness rejects document
     horizontal overflow. The same responsive production source preserves the
     mobile drawer and Search dialog labels, focus traps, Escape dismissal,
     opener restoration, brand-filter semantics, live result feedback,
     reduced-motion transitions, and orientation reflow. Fresh route DOM
     exposes the same destination and section navigation, `main` named
     “Hearst videos,” lead article, Delish Shorts region/status, Recommended
     videos heading and queue, complementary Trending videos, footer note,
     complete story/video names, and active Videos route.

     Lead poster and dark-card geometry remain contained at 390px: the poster
     uses the bounded 16:9 surface with a blurred cover fill plus contained
     source image, 56px Play control, duration badge, two-line summary, and
     44px mobile Save/comment/Open actions. Secondary feed cards used the same
     production playback surface but exposed a real 40×40px Play target.
     `video-cards.tsx` now changes only that control to `h-11 w-11` (44×44px).
     The focused `Feed video` interaction measures both dimensions, focuses
     the control, activates it with Enter, and requires the resulting
     `AdaptiveVideo` to retain `playsinline`. No queue, token, poster, crop,
     callback, or layout contract changed. Existing product remediation for
     compact desktop navigation and carousel controls/selectors/actions
     remains open and unchanged.

     Fresh production interaction checks open the lead Story reader, dismiss
     it with Escape, and restore the exact lead opener after the asynchronous
     close frame. They open the first Delish Short, confirm its named modal,
     polite “Short 1 of …” status and initially focused Close control, dismiss
     with Escape, and restore the exact `Open Delish short: …` button. Activating
     the live lead poster replaces it with the exact labelled video in
     `data-video-state="ready"` with native controls, `playsinline`, and
     metadata preload. Focused states separately protect direct landscape and
     portrait MP4 playback, retryable error alert, unavailable-source status,
     mute/pause/save actions, bounded adjacent preload, pointer/touch/native
     snap behavior, keyboard navigation, close restoration, and 44px mobile
     viewer controls. The queue tests preserve muted-only autoplay,
     outgoing-event rejection, settled-snap selection, exact 16:9/9:16
     selection, and reduced-motion scrolling. Fresh direct and routed browser
     logs contain no console or page errors.

     Nine focused integrated Videos, Video Cards, Adaptive Video, Delish
     Shorts Viewer, Navigation, Utility Bar, Trending Rails, Feed States, and
     Theme Runtime Storybook files pass all 39 checks. Seven focused queue,
     aspect-ratio, transcoding, Shorts playback, reader-navigation,
     presentation, and token files pass all 37 tests. Focused lint passes.
     The unchanged `videos-feed-dark-1280` baseline remains at `0%`.

     Only `tests/visual-baselines/videos-feed-dark-390.png` was regenerated.
     The inspected 390×844 baseline SHA-256 is
     `abca6829c821e695c771daaecae723cc7caf26680d3fa2f753bc01c79b9a1584`.
     Its focused read-only comparison and subsequent complete queue both pass
     at `0%`. The fresh complete 47-case read-only queue now reports four
     unresolved cases:
     `lifestyle-destination-home-390` (height `7154→7143`),
     `reader-article-body-ready-390` (height `963→899`),
     `featured-carousel-mobile-390` (`48.806%`), and
     `brand-spotlight-production-320` (height `1135→1124`). The next ranked
     production-backed case is `featured-carousel-mobile-390` at `48.806%`.

     User impact: Videos now retains its intentional dark mobile identity,
     exact reader/player return context, deterministic current editorial
     specification, and a compliant secondary Play target. Engineering impact:
     one production target-size utility and one focused Storybook assertion
     changed; queue, media, theme, and route APIs remain stable. Effort: small.
     Confidence: high, based on exact prior/current image inspection,
     production story/fixture/queue/route tracing, current DOM and interaction
     checks, focused tests and lint, the unchanged desktop regression, the
     `0%` focused visual rerun, and the fresh complete queue.
     [Current 390px visual-run capture](../playwright/visual-regression/videos-feed-dark-390-actual.png)
     [Production mobile Videos composition](../playwright/storybook-reaudit-2026-07-27/158-production-videos-mobile-current-390.png)
     [Production mobile play state](../playwright/storybook-reaudit-2026-07-27/159-production-videos-mobile-play-state-390.png)
     [Reviewed final 390px baseline](../../tests/visual-baselines/videos-feed-dark-390.png)

208. **Featured carousel at 390px — the `48.806%` difference is
     deterministic editorial fixture churn plus the already-reviewed shared
     carousel presentation, not a new responsive, token, API, interaction, or
     accessibility defect.** The exact prior and current 390×844 captures
     retain the same bounded card, image/frame split, gradient, source/video
     metadata, clamped headline and summary, five selectors, and three-action
     footer. The prior baseline used House Beautiful’s “The One Thing You
     Should NEVER Do to Hydrangeas…” record and image. The current generated
     fixture selects the newer checked-in House Beautiful record “I've Sold
     Three Fixer-Uppers, and This DIY Project Adds the Most Value Every Time,”
     its current image and summary, and 11 derived comments. The current
     outlined Follow treatment is the same reviewed shared presentation
     already protected by both desktop carousel baselines.

     `HearstPlusFeaturedCarousel.stories.tsx` imports the exact production
     `FeaturedStoryCarousel`, selects five distinct brands from
     `hearstPlusStoryData.all`, promotes the fifth record into a deterministic
     current video with `/storybook-video-fixture.mp4`, and retains
     production-shaped save, open, more-like, follow, active-story, and
     edition-impression callbacks. The new House Beautiful record at
     `src/stories/generated/hearst-plus-fixtures.ts:321` is identical to the
     checked-in production source at
     `src/components/lifestyle-river-data.ts:2865`; the prior hydrangea record
     remains in production inventory at
     `src/components/lifestyle-river-data.ts:2990` but is no longer the first
     distinct-brand selection.

     The actual `/hearst-plus/` consumer resolves through
     `src/app/hearst-plus/page.tsx` into the same `HomePageTemplate` and
     `FeaturedStoryCarousel`. `home-page.tsx` enables Today’s Picks only for
     the unfiltered all-destination For You state, ranks up to 15
     `getPersonalizedLeadSliderStories`, resolves a stable five-story
     `useDailyEditionStories` edition, and passes the exact production image,
     comment, save, preference, follow, reader-open, impression, and token
     contracts to the shared carousel. The routed feed may contain fresher
     live records than Storybook, while Storybook intentionally freezes the
     checked-in editorial/media boundary.

     Fresh exact 390px DOM measurement records a 358×738px article at
     x=`16`, a 356×499px cover image, and document/body scroll widths equal to
     the 390px viewport. All five slides remain full-width with one active
     `aria-hidden="false"`, non-inert, `tabIndex=0` slide and four
     `aria-hidden="true"`, inert, `tabIndex=-1` slides. The media surface keeps
     `touch-action: pan-y`; a horizontal pointer swipe in a touch-enabled
     context advances from story 2 to story 3 without opening the dragged
     slide. Keyboard Enter selects the named second selector, preserves its
     focus and `aria-current`, and exposes the matching active slide.

     Focus pauses rotation and changes the control to “Resume slider”; the
     atomic Featured story status changes to `aria-live="polite"` and
     announces the exact story position/title. Keyboard Space on Save changes
     it to pressed “Saved” while retaining focus. More like this, Follow, and
     Open each update their deterministic callback statuses. The integrated
     `SavedCarouselReaderFocus` story also proves that closing the production
     reader restores focus to the same-story selector when reranking leaves
     the original opener inactive.

     The visible mobile Pause control, all five selectors, Save, More like
     this, and Follow measure at least 44px in both dimensions (44×44px for
     Pause, every selector, and Save; 76.4×44px for More like this; and
     54.9×44px for Follow). At 200% page scale the visual viewport contracts
     to 195px without layout overflow; 844×390 orientation also keeps
     document and body widths contained. Reduced motion disables the rotation
     control, keeps the status polite, removes motion transitions through the
     production utility, and suppresses auto-advance across a 6.7-second
     interval. The focused browser run reports no console or page errors.
     The existing product-level remediation remains explicit: compact desktop
     carousel rotation controls, selectors, and actions remain below 44px;
     this mobile fixture correction does not conceal or broaden that issue.

     Both focused carousel files pass all 11 Storybook checks, including
     active/inert semantics, save/callback behavior, mobile containment,
     reduced states, and reader focus restoration. Five allocator,
     presentation, token, personalization, and video-destination files pass
     all 32 tests. Focused lint passes. The routed production carousel
     accessibility gate passes all five selector transitions at both 1280px
     and 320px, with exactly one operable slide and no page overflow.
     `featured-carousel-mixed-1280` and
     `featured-carousel-saved-1280` both remain at `0%`.

     Only
     `tests/visual-baselines/featured-carousel-mobile-390.png` was
     regenerated. The inspected 390×844 baseline SHA-256 is
     `6e3683d0522e553f6229777cb75daa8eacd6840250179ec326dd164c728d5837`.
     Its immediate focused read-only comparison passes at `0%`; the subsequent
     complete read-only queue passes it at `0.002%`, within the existing
     tolerance. The fresh complete 47-case queue now reports three unresolved
     cases:
     `lifestyle-destination-home-390` (height `7154→7143`),
     `reader-article-body-ready-390` (height `963→899`), and
     `brand-spotlight-production-320` (height `1135→1124`). The next ranked
     production-backed case is `lifestyle-destination-home-390`.

     User impact: the mobile specification now protects the current
     deterministic mixed-brand edition without changing production behavior.
     Engineering impact: no component, API, allocator, token, interaction, or
     test source changed; one narrowly reviewed baseline records the current
     checked-in fixture. Effort: small. Confidence: high, based on exact
     prior/current image inspection, source/fixture/route tracing, measured
     DOM and interaction checks, focused tests and lint, unchanged desktop
     regressions, the focused visual rerun, and the fresh complete queue.
     [Current 390px visual-run capture](../playwright/visual-regression/featured-carousel-mobile-390-actual.png)
     [Reviewed final 390px baseline](../../tests/visual-baselines/featured-carousel-mobile-390.png)

209. **Lifestyle destination home at 390px — the `390×7154→390×7143`
     mismatch is complete-page editorial/module reflow after the verified
     destination-mode correction, not a responsive layout defect, remote-media
     instability, or harness truncation.** The exact prior and current
     full-page images preserve the same utility bar, Hearst Lifestyle masthead,
     horizontal topic navigation, one-column hero and river, Brand Spotlight,
     Trending Across Brands, and footer composition. The prior baseline still
     leads with Country Living’s “7 Beautiful Old-Fashioned Herbs…” and the
     older kitchen, flower-home, Odyssey, olive-oil, and horoscope allocation.
     The current checked-in edition leads with “3 Simple Decorating Tricks…”
     and allocates the current Delish, Cosmopolitan, Pioneer Woman, Prevention,
     and Good Housekeeping stories. Their different headline, byline, recipe,
     guide, metadata, spotlight, and trending-item wraps account for the
     upstream height change.

     The final black footer begins at approximately y=`6051` in the current
     capture versus y=`6061` in the prior image; its own rendered height differs
     by only one rounding pixel. The full document therefore becomes 11px
     shorter before/within the unchanged footer rather than losing content.
     The current DOM reports both document and body heights of `7143`, and the
     visual harness writes the same `390×7143` PNG. It pins the evening clock,
     waits for fonts, every image load/error and decode, resolves CSS background
     images, disables animation and transitions, rejects page overflow, and
     captures with `fullPage: true`. Repeated focused capture returns the same
     dimensions with zero console or page errors.

     `LifestyleDestinationApp.stories.tsx` imports the exact production
     `HomePageTemplate`, applies the `hearst-lifestyle` runtime theme, supplies
     `hearstPlusStoryData` and the deterministic Lifestyle video fixture, and
     deliberately does not pass `initialBrandSlug`. Its focused Home story
     requires the destination contract “Filter Brands” and “All brands are
     included in the river,” while rejecting the publication-only “Global
     Story Inventory” label. This preserves the desktop correction from finding
     202 rather than reintroducing publication/sidebar API drift.

     The actual `/hearst-lifestyle/` route in
     `src/app/hearst-lifestyle/page.tsx` applies the same theme and
     `HomePageTemplate`, then combines checked-in static destination data with
     current Lifestyle live/video feeds and the full onboarding brand
     inventory. Fresh 390px route DOM exposes the same destination and topic
     navigation, “Personalized lifestyle story river” main landmark, Today’s
     Picks carousel, editorial-card family, Brand Spotlight, Trending Across
     Brands complementary region, and footer. Its live stories are newer than
     the deterministic catalog fixture, but its component, allocator, token,
     state, callback, and navigation contracts match. Direct Storybook and
     routed production browser logs contain no errors.

     At the exact 390px catalog state, the current module order is Today’s
     Picks; five river cards (Thai-Inspired Watermelon & Peach Salad, House of
     the Dragon, Frozen S’mores Bars, the self-tanner guide, and mature-skin
     primers); Delish Brand Spotlight; two Good Housekeeping cards; caught-up
     status; Trending Across Brands; and footer. Current top-level geometry is
     a 358×738px carousel, then card heights of `548`, `491`, `520`, `466`, and
     `542`, an `887`px spotlight, two `463`px cards, and a `466`px trending
     region. The main/sidebar reflow is intentionally one column at this
     breakpoint.

     Document and body scroll widths equal the 390px viewport. The destination
     utility navigation (`254→444`) and topic rail (`358→638`) are the only
     meaningful horizontal scrollers; both use intentional `overflow-x:auto`
     containment and partial-content cues, while the carousel track remains
     clipped to its frame. Every reviewed image is complete with nonzero
     intrinsic dimensions. The hero uses a stable 356×499px cover box, river
     media use 356×200px cover boxes, and Brand Spotlight uses a 316×237px
     lead plus fixed 88×88px support crops, so remote media does not determine
     page height.

     The visible Sign in, menu, Search, Pause, five carousel selectors, Save,
     More like this, Follow, and every river Save/more-like/comment/Hide control
     meet the 44px mobile minimum. Search opens a named dialog with labelled
     combobox/listbox results and Escape restores focus to Search. The discovery
     menu opens as “Hearst discovery menu,” exposes Continue Reading, Filter
     Brands and theme controls, initially focuses Close, and Escape restores
     the exact menu opener. Keyboard Space changes hero Save to pressed “Saved”
     and retains focus. The focused carousel, card, Story Actions, feed-state,
     discovery, navigation, and integrated reader stories protect open,
     hide-focus, save, preference, filtering, loading, empty, retryable error,
     unavailable media, and reader-return callbacks. No separate
     permission-gated destination state applies before a reader/account action.

     Reduced motion disables automatic carousel rotation, keeps the exact story
     stable across 6.7 seconds, and exposes the polite Featured story status.
     Equivalent 200% reflow at 195px keeps document/body widths at 195px, the
     main at 163px, and menu/Search targets at 44px. The 844×390 orientation
     keeps document/body widths at 844px with a contained 796px main. The
     current runtime wrapper resolves `data-brand="hearst-lifestyle"` with the
     Lifestyle primary/ring token (`oklch(0.423 0.116 349.7)`); focused token
     validation preserves every supported production component role.

     Nine focused destination, navigation, discovery, carousel, editorial-card,
     feed-state, Story Actions, theme, and integrated app files pass all 42
     Storybook checks. Five allocator, presentation, token, personalization,
     and video-destination files pass all 32 tests. Focused lint passes. The
     routed carousel gate passes all five transitions at both 1280px and 320px
     with exactly one operable slide and no page overflow. The unchanged
     `lifestyle-destination-home-320` and
     `lifestyle-destination-home-1280` baselines both remain at `0%`.

     Only
     `tests/visual-baselines/lifestyle-destination-home-390.png` was
     regenerated. The inspected 390×7143 baseline SHA-256 is
     `f73977801640d62bca1a513154d8b473024d29a5a055ae39673eb32c611368cf`.
     Its focused read-only comparison and subsequent complete queue both pass
     at `0%`. The fresh complete 47-case read-only queue now reports two
     unresolved cases:
     `reader-article-body-ready-390` (height `963→899`) and
     `brand-spotlight-production-320` (height `1135→1124`). The next ranked
     production-backed case is `reader-article-body-ready-390`.

     User impact: the 390px specification now protects the current complete
     Lifestyle destination without changing production behavior. Engineering
     impact: no component, story, allocator, token, interaction, route, or test
     source changed; one narrowly reviewed full-page baseline records the
     corrected destination mode and current checked-in content. Effort: small.
     Confidence: high, based on exact full-page image/dimension comparison,
     fixed-clock harness inspection, source/fixture/route tracing, current DOM
     and interaction measurement, focused tests and lint, unchanged 320px and
     desktop regressions, the focused visual rerun, and the fresh complete
     queue.
     [Current 390px visual-run capture](../playwright/visual-regression/lifestyle-destination-home-390-actual.png)
     [Reviewed final 390px baseline](../../tests/visual-baselines/lifestyle-destination-home-390.png)

210. **Reader article body Ready at 390px — the exact `390×963→390×899`
     mismatch is a deterministic editorial-fixture refresh whose 64px height
     delta is fully explained by two removed 32px summary lines, not typography,
     reader-state, media, responsive-layout, or capture drift.** The reviewed
     prior baseline uses ELLE’s “Gabrielle Union-Wade and Ferragamo Toast the
     Brand’s Hamptons Pop-Up,” whose summary occupies three 32px lines. The
     current checked-in production record is “Inside EDITION’s Chic Montauk
     Takeover at Crow’s Nest,” whose “Elle editors recommend this elleextra
     story.” summary occupies one 32px line. Both headlines occupy the same
     three 36px lines, and the remaining heading, quote, list, figure, caption,
     status copy, padding, and vertical gaps retain the same geometry. The
     changed editorial image does not affect height: the component supplies a
     stable 1200×800 intrinsic frame and the current 5738×3825 source renders
     at 358×239px.

     The direct Ready story obtains its primary ELLE record through
     `getComponentStoryForBrand("elle")` from
     `src/stories/generated/hearst-plus-fixtures.ts`, the compact fixture
     generated from the checked-in `src/components/flux-river-data.ts`. Its
     secondary image likewise comes from the current first Cosmopolitan record
     in the generated Lifestyle fixture. The story constructs the production
     `LiveArticleData` block union and imports the exact public
     `ReaderArticleBody` from
     `src/components/hearst-plus/reader-article-body.tsx`; it does not fork or
     restyle the component. The visual case fixes the ELLE global, 390×844
     viewport, and full-page capture.

     Current direct DOM order is article landmark; specification eyebrow; H2
     story title; ready-state paragraph; H3 “What to know”; blockquote; list
     with three items; figure containing the named fullscreen button and image;
     figcaption; then the polite callback status. Fonts are fully loaded. The
     H2 resolves to Modern MT Pro at 30/36px, body copy to Neue Haas Unica Pro
     at 18/32px, the H3 to Modern MT Pro at 24/30px, and the quote to Modern MT
     Pro at 20/32px. The ready body measures 358×671px, the figure 358×283px,
     the article 390×898.64px, and the harness rounds the full-page PNG to
     390×899. Document scroll width equals the 390px viewport. The image is
     decoded, complete, and has nonzero intrinsic dimensions; direct Storybook
     reports no console or page errors.

     The current `/flux/elle/` consumer exposes the same checked-in story in
     Trending Across Brands and opens the canonical
     `/read/elle-elleextra-events-a73274232-summer-edition-the-crows-nest-montauk-details-photos/?from=%2Fflux%2Felle%2F`
     reader. `src/components/home-page.tsx` renders the same
     `ReaderArticleBody`, passes its current loading/ready/error model from
     `liveArticles`, and wires `onOpenImage` to the production fullscreen
     gallery. In the routed ready state, the article contains the current
     byline/date, 18/32px paragraphs, H3 section headings, decoded lazy images,
     captions/credits, comments, recommendations, and reader actions. The
     current model deliberately supports paragraph, heading, quote, list, and
     image blocks; arbitrary inline-link and embed blocks are not part of this
     component API, so their absence is not a Storybook regression. Dek,
     byline, sticky masthead/close, actions, premium/permission behavior,
     comments, and recommendations remain shell-owned, as the component
     contract states.

     The routed 390px reader is a named dialog with a 390×844 fixed viewport
     and no horizontal overflow. Close, follow, premium, save, comments, and
     inline-media controls meet the 44px mobile height/primary-control
     contract; the previously recorded narrow publication-link, compact
     section-label, and comment-action widths remain in the product-level
     under-44px remediation queue rather than being hidden by this baseline
     review. The close control receives initial focus. Enter opens the exact
     story from its current opener, Escape closes it and restores that opener;
     Enter on an inline article image opens the named fullscreen gallery,
     focuses its Close control, and Escape returns focus to the exact image
     button. The direct Ready story’s named image button measures 358×239px
     and updates the polite callback status.

     Equivalent 200% reflow at a 195px CSS viewport keeps document width at
     195px with no horizontal overflow and scales the article/image fluidly.
     At 844×390 orientation, document width remains 844px and the article is
     contained at its 768px maximum. With reduced motion requested, all three
     loading skeletons compute to `animation-name:none` and `0s`; the ready
     article introduces no autoplay or required motion. The five direct body
     states cover Ready, Loading, Error status, static fallback, and Video.
     Premium and permission fallbacks remain protected by the related reader
     shell/action stories rather than duplicated in the body.

     Five focused reader Storybook files pass all 21 checks across body,
     controls, overlays, Ambient Reader, and fullscreen image viewer. Eight
     reader/model/queue/presentation/token files pass all 33 tests, and focused
     lint passes. The reviewed related visuals
     `reader-success-elle-390`, `reader-action-bar-default-390`,
     `reader-action-bar-premium-ready-1280`,
     `ambient-reader-esquire-390`, and
     `reader-image-viewer-gallery-390` all remain at `0%`.

     Only
     `tests/visual-baselines/reader-article-body-ready-390.png` was
     regenerated. The inspected 390×899 baseline SHA-256 is
     `dfeece06f8998631120cbedc4731db2b9576f6b331601221ded12ca6c3bd000c`.
     Its immediate focused read-only comparison passes at `0%`. The subsequent
     complete 47-case queue was rerun read-only and leaves one unresolved case:
     `brand-spotlight-production-320`, still an exact dimension mismatch from
     `320×1135` to `320×1124`. It is the next ranked production-backed case.

     User impact: the mobile specification now protects the current
     deterministic ELLE edition without changing reader behavior. Engineering
     impact: no component, story, model, token, route, interaction, or test
     source changed; one narrowly reviewed baseline records current checked-in
     editorial content. Effort: small. Confidence: high, based on exact
     prior/current image and dimension comparison, source/fixture/consumer
     tracing, measured DOM and interaction behavior, focused tests and lint,
     unchanged related reader regressions, the focused visual rerun, and the
     fresh complete queue.
     [Current 390px visual-run capture](../playwright/visual-regression/reader-article-body-ready-390-actual.png)
     [Reviewed final 390px baseline](../../tests/visual-baselines/reader-article-body-ready-390.png)

211. **Brand Spotlight at 320px — the exact `320×1135→320×1124`
     mismatch is deterministic editorial-allocation churn, while the same
     review exposed and corrected a separate 200% reflow defect.** The previous
     baseline used Car and Driver’s Testarossa lead, GUIDE label, AEV Super
     Duty and 2001 sports-sedan stories. The current generated fixture and
     production selector allocate the Pink Ford Bronco lead without a format
     label, followed by the lifted Honda Accord Guide and Qvale Mangusta. The
     11px net height change is the offsetting result of the removed lead label
     and current headline/metadata wraps. It is not font-loading, logo,
     4:3-image, spacing-token, remote-asset, or harness drift.

     `src/stories/HearstPlusBrandSpotlight.stories.tsx` calls
     `selectBrandPromotion` with the checked-in generated editorial fixture
     and renders the exact public
     `src/components/hearst-plus/brand-promotion-river-module.tsx`.
     `src/components/home-page.tsx` uses that same selector and renderer on the
     routed `/hearst-plus/` consumer. The direct 320px DOM retains the named
     Brand Spotlight region, heading and description, canonical
     `/autos/car-and-driver/` publication link, exact local Car and Driver
     wordmark, one lead and two secondary story buttons in source order,
     decoded production images, and the shared typography, border, surface,
     radius and shadow tokens. The publication target is 246×44px, the
     wordmark is 180×36px within it, the lead image remains 246×184.5px at
     `object-cover`, and all interactive rows meet the 44px mobile minimum.
     The document is exactly 320px wide with no horizontal overflow and direct
     Storybook emits no console or page errors.

     Keyboard Enter opens the production reader from the focused story,
     Close receives focus, and Escape restores the exact opener after the
     route transition settles. The normal 320px and 844×390 orientation states
     remain contained; reduced motion produces no required animation. At the
     equivalent 200% CSS viewport, however, the prior secondary-card grid still
     reserved an 88px image plus 16px gap inside an 86px content column. Story
     buttons escaped the card and the text columns collapsed to zero width.
     The renderer now makes each secondary row a container: it stacks below
     120px, switches to the 88px media row when space permits, and retains the
     existing `sm` geometry. The new `Zoom200Mobile` direct story asserts every
     story button remains inside the 160px specimen. The corrected state has
     zero document overflow, 86px-wide contained buttons, readable text
     columns, and natural vertical growth; the normal 320px visual is
     unchanged.

     Only
     `tests/visual-baselines/brand-spotlight-production-320.png` was
     regenerated for the proved editorial mismatch. The reviewed 320×1124
     baseline SHA-256 is
     `76d71e1293c668ac7f86a34d2e3c53572e5aee93001f95734b6be34a3606def3`.
     The focused 320px and desktop 1280px comparisons both pass at `0%`.
     Five Brand Spotlight, five Brand Logo, four Theme Runtime and one Story
     Presentation checks pass; the focused model/presentation/token set passes
     12 tests and focused lint passes. The final complete 47-case queue is
     read-only and passes all 47 cases.

     The completion pass also found a hooks-rule violation in the same
     production logo boundary: `BrandLogo` synchronously cleared failed state
     inside its asset-loading effect. The load result is now a source-keyed
     ready/error union, so a new source derives loading state without an
     effect-time reset. All five Brand Logo states and the complete Storybook
     suite preserve loading, ready, decorative, accessible-name and unknown
     asset behavior.

     User impact: the approved 320px baseline now represents current checked-in
     production content, 200% zoom no longer clips the secondary stories, and
     the logo retains stable loading/error semantics. Engineering impact: one
     baseline, one responsive production rule, one direct regression story,
     and one internal logo-state correction; desktop and ordinary mobile
     rendering remain unchanged. Confidence: high, based on exact image,
     dimension, DOM, route, fixture, allocator, token, interaction,
     accessibility, orientation, zoom, error, focused-test and full-queue
     evidence.
     [Current 320px visual-run capture](../playwright/visual-regression/brand-spotlight-production-320-actual.png)
     [Reviewed final 320px baseline](../../tests/visual-baselines/brand-spotlight-production-320.png)

### Completion audit after the visual queue

The visual-regression queue is complete, but that does not close every
design-system risk. The completion gates found and corrected the highest
priority narrow quality regressions that could be proved in the current
checkout:

- the generated component registry was stale and is now current at 100
  production components, with `index:check` passing;
- six increased token-audit fingerprints were removed without changing the
  debt baseline: one editorial `&#038;` entity is now `&amp;`, the Videos dark
  header and continuation surfaces consume their existing component tokens,
  and Product Header focus, active, border and muted states use semantic
  classes;
- the token gate now passes at 630 known violations, 59 resolved since the
  baseline, and zero regressions;
- the Videos Feed story now asserts the semantic background token and its
  computed black production value instead of coupling the contract to a
  literal Tailwind class;
- the complete current catalog is 289 entries: 271 stories, 18 docs and 76
  title groups. All 271 Storybook interaction/accessibility checks and all 113
  unit tests pass. Publication validation, token validation, focused lint,
  component-index freshness, and all 47 visual cases pass.

The broader audit is therefore **visually complete but not organizationally or
architecturally complete**. These evidence-backed items remain:

1. **P1 architecture:** `src/components/home-page.tsx` is still a 6,840-line,
   291,172-byte composition owning reader orchestration and remaining feed
   allocation. Continue responsibility-based extraction with zero-drift
   visual gates.
2. **P1 token debt:** 630 known violations remain even though the
   no-regression gate is green. Continue a measured user-facing-surface
   burn-down; do not refresh the baseline upward.
3. **P1 governance:** review roles are documented but cannot be enforced until
   real team handles are supplied for `CODEOWNERS`; the current quality
   workflow must be merged and required in branch protection.
4. **P1 release and publication:** there is no formal version/release system,
   and the public Storybook remains stale at 99 stories with no
   `/storybook/build-info.json`. Publishing is intentionally not attempted
   without explicit authorization.
5. **P2 accessibility and product remediation:** manual screen-reader,
   forced-colors and broader cross-brand review remain necessary. Compact
   desktop navigation and carousel controls recorded below remain under 44px;
   the mobile controls remain compliant.
6. **Production content requirement:** adaptive-video caption/transcript
   completeness remains a publishing/content-system requirement rather than a
   component-only visual fix.

### Numbered continuation steps

1. Read the governing product, design, style, brand, and design-system
   specification documents before evaluating component fidelity.
2. Read local and deployed Storybook `/index.json` and compare entries, stories,
   documentation pages, and title groups.
3. Regenerate the component registry and validate every structured metadata
   record against current source and story files.
4. Identify routed production modules still lacking an explicit direct,
   integrated, or infrastructure Storybook classification.
5. Inspect all three HOT ROD Events routes and the exact shared production
   exports they render.
6. Compare the event hub in production and Storybook at 1280px.
7. Compare the event hub in production and Storybook at 320px.
8. Exercise calendar/list state and verify pressed-state semantics.
9. Inspect the routed hero image attributes and browser warnings before and
   after the Next.js loading correction.
10. Measure mobile document overflow, active navigation geometry, section
    landmark names, and visible touch targets.
11. Add a direct mobile publication-navigation regression around the exact
    production `MainNav`.
12. Run all 269 Storybook interaction and automated accessibility checks.
13. Build the static catalog, then run all 1,076 story/breakpoint checks and all
    36 documentation checks.
14. Generate immutable build provenance from the built Storybook index.
15. Prove the deployment verifier success path against a locally served
    artifact and its exact dirty-checkout revision.
16. Run the same fail-closed verifier against the public Storybook and record
    its missing provenance artifact as an open release blocker.
17. Run the complete 47-case visual baseline comparison without updating any
    approved image.
18. Inspect the current and prior Lifestyle Home 320px captures and identify
    editorial snapshot changes separately from component behavior.
19. Match the routed Lifestyle production carousel to a fixed mobile state and
    inspect the same production component boundary.
20. Add and validate direct ownership metadata for the Featured Story Carousel,
    then regenerate the machine-readable registry.
21. Inspect the failed Fullscreen Image Viewer gallery capture and separate
    remote editorial pixels from the production viewer chrome.
22. Neutralize only dialog images for the gallery visual case and regenerate
    only the `reader-image-viewer-gallery-390` baseline.
23. Inspect the 390×844 baseline and rerun the same case without update,
    confirming a 0% focused comparison.
24. Run all three direct Fullscreen Image Viewer stories and confirm the
    production interaction/accessibility contract still passes.
25. Run the fresh visual sweep and inspect the next failing case,
    `discovery-sidebar-publication-1280`, without updating it.
26. Compare the prior and current Storybook captures with a fresh 1280×900
    Cosmopolitan production-route capture and current DOM.
27. Classify the Daily Habit title/byline changes as checked-in editorial
    fixture churn and identify the separate House Beautiful count mismatch.
28. Correct the production-shaped count to 62 and add a direct accessible-name
    assertion to the publication inventory story.
29. Rebuild the static Storybook, regenerate only the Discovery Sidebar
    baseline, inspect it, rerun the case at 0%, and rerun all five direct
    Discovery Sidebar stories.
30. Inspect the prior and current 1280px Trending Articles captures before
    changing any file.
31. Trace the direct story through the checked-in Lifestyle fixture,
    production allocator, exported Trending Story Rail, and routed
    `home-page.tsx` usage.
32. Capture and inspect the current Lifestyle production route and current
    direct Storybook story at the exact 1280×900 viewport.
33. Classify the changed titles, topics, bylines, and natural card height as
    editorial fixture churn while confirming stable tokens, geometry,
    semantics, interaction API, and allocator behavior.
34. Regenerate only `trending-articles-lifestyle-1280`, inspect it, rerun the
    case at 0%, and run all six direct Trending Rails stories.
35. Inspect the prior and current `todays-edit-minimal-1280` captures before
    changing any file.
36. Trace the minimal story through the current generated multi-destination
    fixture, production allocator, exported Today’s Edit strip, and routed
    `/hearst-plus/` usage.
37. Classify the two changed headlines, thumbnails, and natural line wraps as
    editorial fixture churn while confirming stable geometry, tokens,
    interaction API, route conditions, and allocator behavior.
38. Regenerate only `todays-edit-minimal-1280`, inspect it, rerun the case at
    0%, and run all seven direct Today’s Edit stories.
39. Inspect the prior and current `trending-videos-1280` captures before
    changing any file.
40. Trace the direct story through the current generated multi-destination
    fixture, deterministic video wrapper, production video-queue allocator,
    exported Trending Videos rail, and routed `/hearst-plus/videos/` usage.
41. Capture and inspect the current production route and direct Storybook story
    at 1280px, then compare their bounded DOM geometry, dark tokens, semantics,
    accessible names, and interaction contract; retain the exact 1280×900
    visual-test capture for the baseline decision.
42. Classify the changed ranked stories, poster images, and natural title wraps
    as editorial/media churn; regenerate only `trending-videos-1280`, inspect
    it, rerun the case at 0%, and run all six direct Trending Rails stories.
43. Inspect the prior and current
    `reader-action-bar-premium-ready-1280` captures before changing any file.
44. Trace the direct story through the current generated Elle fixture, exact
    production Reader Action Bar, Ambient Reader readiness resolver, and routed
    reader consumer.
45. Capture and inspect the current direct Storybook premium-ready state and
    current `/hearst-flux/` production reader at 1280px; compare DOM geometry,
    tokens, accessible names, save/comment semantics, and overflow.
46. Exercise the routed `P` keyboard shortcut and confirm that it opens the
    active story’s named Ambient Reader dialog.
47. Classify the changed headline, author initials, author name, and natural
    wrap as deterministic fixture churn; regenerate only
    `reader-action-bar-premium-ready-1280`, inspect it, rerun the case at 0%,
    and run all five direct Reader Controls stories.
48. Run the complete 47-case visual queue read-only and rank the 21 remaining
    failures after the premium-ready Reader Action Bar correction.
49. Inspect the prior and current `onboarding-mobile-320` images and localize
    the difference to the production-shaped preview stories.
50. Trace the direct story through the generated representative feed fixture,
    exact production Onboarding Modal, `HomePageTemplate`, and the routed
    `/hearst-plus/` consumer.
51. Open the production onboarding consumer, inspect its DOM contract, and
    exercise Home selection to confirm focus, pressed state, preview
    population, Continue enablement, touch targets, and horizontal containment.
52. Classify the changed Country Living headline, image, companion stories, and
    natural wrapping as editorial fixture churn; regenerate only
    `onboarding-mobile-320`, inspect it, rerun the focused visual case within
    tolerance, and run all four direct onboarding stories.
53. Inspect the prior and current `todays-edit-complete-1280` images and confirm
    stable strip geometry, tokens, four-card structure, and natural title
    wrapping.
54. Trace the complete story through the generated multi-destination fixture,
    exact production allocator, exported Today’s Edit strip, and routed
    `/hearst-plus/` consumer.
55. Identify the arbitrary vitamin-D horoscope fallback as a fixture-fidelity
    defect rather than editorial churn.
56. Extend the fixture generator with one explicit source-backed Today’s Edit
    horoscope export and verify it reproduces the checked-in Cosmopolitan
    story ID, title, source URL, image, and metadata.
57. Compare fresh direct-story and production-route DOM for region naming,
    exact geometry, tokens, four equal columns, complete accessible button
    names, and horizontal containment.
58. Exercise the direct Continue Reading card and confirm opened, continued,
    and impression callback state uses the same allocated story ID.
59. Classify the remaining three card changes as allocator-driven editorial
    churn; regenerate only `todays-edit-complete-1280`, inspect it, rerun the
    focused visual case at `0.001%`, rebuild Storybook, and pass all seven
    direct Today’s Edit stories.
60. Inspect the prior and current `story-actions-mobile-390` images and
    localize the difference to the deterministic headline and its natural
    extra line wrap.
61. Trace the direct story through the generated all-brand component fixture,
    exact exported Story Actions component, both production card consumers,
    and the routed `/hearst-plus/` callback contract.
62. Inspect direct-story and current production-route DOM for group naming,
    complete button names, pressed state, token values, 44px mobile touch
    targets, and horizontal containment.
63. Exercise Save with keyboard Space and confirm focus retention,
    `aria-pressed` state, and accessible-name updates; pass all six direct Story
    Actions stories, including focus transfer after Hide.
64. Classify the `5.049%` difference as editorial fixture churn; regenerate
    only `story-actions-mobile-390`, inspect it, rerun it at `0%`, and confirm
    the fresh complete read-only queue contains 18 unresolved cases.
65. Inspect the prior and current `todays-edit-tablet-768` images and localize
    the changed pixels to the allocator-selected continuation and
    followed-brand stories.
66. Trace the tablet state through the generated all-brand fixture, exact
    production allocator and Today’s Edit export, and the current
    `/hearst-plus/` consumer.
67. Compare direct-story and production-route DOM at 768px for strip and card
    geometry, overflow, responsive tokens, heading/region semantics, complete
    card names, and 44px carousel controls.
68. Activate Next with keyboard Enter and confirm the 449px snap scroll,
    reverse-control replacement, immediate focus transfer, and stable
    after-scroll layout.
69. Pass all seven direct Today’s Edit stories and all seven focused allocator
    tests, covering complete, first-visit, minimal, tablet, mobile-omitted, and
    incomplete allocation behavior.
70. Classify the ranked `3.534%` difference as allocator-driven editorial
    churn; regenerate only `todays-edit-tablet-768`, inspect it, rerun it at
    `0%`, and confirm the fresh complete queue contains 17 unresolved cases.
71. Inspect the prior and current `trending-articles-lifestyle-390` images and
    localize the difference to all five allocator-selected stories, their
    metadata, and natural mobile row heights.
72. Trace the direct state through the generated Lifestyle fixture, exact
    production allocator and Trending Story Rail export, and the current
    `/hearst-lifestyle/` consumer.
73. Compare direct-story and production-route DOM at 390px for rail width,
    padding, responsive overflow, token values, ordered-list semantics,
    complete accessible names, and 44px-minimum targets.
74. Focus and activate the first direct story with Enter, confirm the visible
    focus ring, retained focus, and polite opened-story status, then confirm
    routed keyboard activation opens the named Story reader dialog.
75. Pass all six direct Trending Rails stories and all seven focused allocator
    tests, covering cross-brand, publication, video, empty, brand-diversity,
    distinct-inventory, and protected-river behavior.
76. Classify the `8.260%` difference as deterministic editorial allocation
    churn; regenerate only `trending-articles-lifestyle-390`, inspect it,
    rerun it at `0%`, and confirm the fresh complete queue contains 16
    unresolved cases.
77. Inspect the prior and current `brand-spotlight-production-1280` images and
    localize the difference to the three allocator-selected Car and Driver
    stories, their imagery, metadata, and natural wrapping.
78. Trace the direct state through the generated all-destination fixture,
    exact production brand-promotion allocator and component export, and the
    current `/hearst-plus/` consumer.
79. Compare direct-story and production-route DOM at 1280px for module and
    column geometry, responsive containment, surface tokens, canonical
    publication route, intrinsic full-color logo asset, region and target
    names, and minimum target size.
80. Focus the direct featured story and verify its visible primary ring, then
    activate the routed story with Enter and confirm the named Story reader
    dialog opens.
81. Pass all four direct Brand Spotlight stories, all five canonical Brand
    Logo states, and five focused allocator/token tests covering eligibility,
    ranking, brand rotation, publication modes, and runtime token support.
82. Classify the `9.138%` difference as deterministic editorial allocation
    churn; regenerate only `brand-spotlight-production-1280`, inspect it,
    rerun it at `0%`, and confirm the fresh complete queue contains 15
    unresolved cases.
83. Inspect the prior and current `reader-action-bar-default-390` images
    side-by-side and localize the changed pixels to the current Elle headline,
    author initials, byline, and natural vertical reflow.
84. Trace the direct state through the generated Flux fixture, exact exported
    Reader Action Bar, production Ambient Reader readiness resolver, and the
    current `/hearst-flux/` Story reader consumer.
85. Compare direct-story and routed mobile DOM for component width, action-row
    geometry, horizontal containment, surface/text/border tokens, 44px target
    sizes, accessible names, pressed state, comment target, and focus ring.
86. Inspect omitted, loading, ready, and unavailable premium states and verify
    that only the intended premium control presence and enabled state changes.
87. Exercise Save with keyboard Space and confirm pressed-state/name updates,
    focus retention, and containment; exercise routed `P` and confirm the
    current story’s named Ambient Reader dialog opens.
88. Pass all five direct Reader Controls stories, covering default/save,
    saved, ready callback, loading, and unavailable behavior.
89. Classify the `10.092%` difference as deterministic editorial fixture
    churn; regenerate only `reader-action-bar-default-390`, inspect it, rerun
    it at `0%`, and confirm the fresh complete queue contains 14 unresolved
    cases.
90. Inspect the prior and current `trending-videos-390` images side-by-side
    and localize the changed pixels to the four currently ranked stories,
    posters, publication labels, and natural title wraps.
91. Trace the direct state through the checked-in multi-destination video
    fixture, deterministic local media wrapper, exact production video-queue
    allocator and Trending Videos export, and the current
    `/hearst-plus/videos/` consumer.
92. Compare direct-story and production-route DOM at 390px for dark surface
    tokens, rail and row geometry, 96×54 poster sizing, horizontal containment,
    ordered-list semantics, complete accessible names, and 44px-minimum
    targets.
93. Focus and activate the first direct row with Enter, confirming the visible
    focus ring, retained focus, and polite opened-story status with the exact
    allocated title.
94. Exercise the current production mobile lead poster’s named Play control
    and confirm the exact production video enters its controls, autoplay, and
    `playsInline` state.
95. Pass all ten focused Trending Rails and Video Cards stories and all nine
    production video-queue tests, covering callbacks, empty state,
    standard/portrait media, poster/play behavior, ranking, promoted Shorts,
    exclusions, deduplication, and progressive-feed protection.
96. Classify the `10.138%` difference as deterministic editorial/media queue
    churn; regenerate only `trending-videos-390`, inspect it, rerun it at
    `0%`, and confirm the fresh complete queue contains 13 unresolved cases.
97. Inspect prior, fixed-clock current, and live production Videos Feed
    captures at 1280×900; separate changed posters, titles, metadata, and
    natural placement from the mismatched light Storybook header.
98. Trace the integrated story and `/hearst-plus/videos/` route through the
    exact `HomePageTemplate`, progressive video resolver, production queue,
    video cards, Delish Shorts, trending rail, navigation, and footer.
99. Compare direct and routed DOM for 1280px containment, three-column
    geometry, dark tokens, landmarks, active navigation, named controls,
    target sizing, media states, callbacks, and browser errors.
100. Replace pathname-coupled Videos header detection with the exact
     destination/filter/publication state contract and add integrated dark
     utility-bar, masthead, active-link, feed-structure, and footer assertions.
101. Reproduce the routed close-to-body focus failure, confirm the reader
     shell’s explicit label-based return-focus contract, label the exact lead
     story opener, and add an integrated open/close/focus regression.
102. Verify the production `/hearst-plus/videos/` route returns focus to
     `Open story: 2026 Audi Q3 Overview` after reader close with zero browser
     errors; pass 15 focused Storybook checks, 17 queue/media tests, and
     focused lint.
103. Regenerate only `videos-feed-dark-1280`, inspect its final dark and
     focus-visible state, and rerun the focused visual comparison at `0%`.
104. Run the complete 47-case queue read-only, confirm 12 unresolved cases,
     and rank `reader-success-elle-390` next at `18.548%`.
105. Inspect the exact old and current ELLE reader captures side by side and
     localize changed pixels to the Dakota Johnson fixture, current metadata,
     comment count, natural wrapping, and current neutral-outline Close token.
106. Trace the success story through the production `HomePageTemplate`, ELLE
     publication queue, live-article cache, reader shell, masthead, actions,
     article body, comments, recommendations, nested gallery, and Ambient
     Reader boundaries.
107. Open the actual `/flux/elle/` consumer and confirm the same Dakota Johnson
     route, ELLE logo/type/tokens, 390px geometry, white 44px Close control,
     active Culture section, live article body, and zero browser errors.
108. Verify mobile focus order and wrapping, Enter activation, Escape close,
     exact opener restoration, nested-dialog isolation, accessible names,
     state semantics, landmarks, and 44px targets.
109. Verify polite loading and status-error announcements, reduced-motion
     skeleton suppression, ready/loading/error/fallback and premium
     ready/loading/unavailable states, and the absence of an applicable
     permission-gated reader state.
110. Verify 200% zoom reflow at an effective 195px viewport with no document
     or shell overflow and a retained 44px Close target.
111. Pass 30 focused reader/component/brand Storybook checks and 18 focused
     model/navigation/token tests; regenerate only
     `reader-success-elle-390`, inspect it, and rerun the focused case at
     `0%`.
112. Classify the first full-queue network interruption as unrelated harness
     noise, rerun the unchanged 47-case queue read-only, confirm 11 unresolved
     cases, and rank `article-river-card-320` next at `20.932%`.
113. Compare the exact prior/current 320px card images and localize the
     `20.932%` difference to the refreshed Cosmopolitan story, image, metadata,
     natural wrapping, and production Guide/editor-pick modules.
114. Trace the direct story through the generated destination fixture to the
     identical checked-in Lifestyle source record and the exported
     `LifestyleRiverCard` used by `/hearst-lifestyle/`.
115. Inspect the current production route’s equivalent Style Beauty Guide
     card and confirm the same 288px mobile geometry, 16:9 cover media,
     scoped Lifestyle focus token, source metadata, shopping module, and
     action structure.
116. Verify no 320px overflow, all supported 44px targets, semantic reading
     order and accessible names, keyboard focus visibility, save/feedback/open
     and Hide-focus callbacks, reduced-motion image behavior, 200% zoom
     reflow, supported fallback boundaries, and zero browser errors.
117. Pass all 10 focused Editorial Cards, Story Actions, and Story
     Presentation Storybook checks plus all 16 focused allocator,
     presentation-model, and token tests.
118. Classify the delta as editorial fixture churn plus intentional
     production presentation, regenerate only `article-river-card-320`,
     inspect it, and rerun the focused comparison at `0%`.
119. Run the complete 47-case queue read-only, confirm 10 unresolved cases,
     and rank `lifestyle-destination-home-1280` next at `22.904%`.
120. Compare the exact prior/current 1280px destination images and localize
     the large pixel delta to the refreshed hero, daily-habit, trending, and
     river allocations while confirming stable header and grid geometry.
121. Trace Storybook through the generated Lifestyle fixture, exact
     `HomePageTemplate`, production allocator, Lifestyle runtime tokens, and
     the current `/hearst-lifestyle/` route.
122. Identify the story-only `initialBrandSlug` as real destination/publication
     API drift, remove only that prop, and add a focused regression for
     “Filter Brands” destination semantics.
123. Measure 1280px geometry, overflow, tokens, landmarks, headings, media,
     target density, and browser errors; exercise Search/escape/focus return,
     keyboard brand filtering, theme switching, responsive reflow, and
     reduced motion.
124. Pass all 41 focused destination/component Storybook checks, all 32
     allocator/presentation/token/personalization/video-model tests, focused
     lint, and the static Storybook build.
125. Regenerate only `lifestyle-destination-home-1280`, inspect it, and rerun
     the focused comparison at `0%` with matching baseline/current SHA-256.
126. Run the complete 47-case queue read-only, confirm 9 unresolved cases,
     and rank `featured-carousel-mixed-1280` next at `23.878%`.
127. Compare the exact prior/current mixed-carousel images and localize the
     visible change to the refreshed House Beautiful story, image, summary,
     and derived comment count.
128. Trace the direct story through the generated all-destination fixture,
     distinct-brand mixed-format allocation, exact production Featured Story
     Carousel, and the current `/hearst-plus/` consumer.
129. Measure direct and routed 1280px geometry, slide widths, zero-gap
     transform behavior, images, tokens, labels, roles, active/inert states,
     targets, overflow, and browser errors.
130. Exercise pause/resume, selectors, keyboard focus, Save, More like this,
     Follow, horizontal swipe suppression, cyclic navigation, single/empty
     states, reduced motion, and 200% zoom-equivalent reflow.
131. Reproduce autoplay continuing after focus and the missing live status;
     fix the shared production component to pause on keyboard focus and hover
     and announce user-driven slide changes, then add a focused Storybook
     regression.
132. Pass all seven Featured Carousel stories, all 32 focused
     allocator/personalization/presentation/video/token tests, focused lint,
     all ten routed carousel transitions, and the static Storybook build.
133. Regenerate only `featured-carousel-mixed-1280`, inspect it, and rerun the
     focused visual comparison within tolerance.
134. Run the complete 47-case queue read-only, confirm 8 unresolved cases,
     and rank `featured-carousel-saved-1280` next at `23.878%`.
135. Compare the exact prior/current saved-carousel images and localize the
     changed pixels to the refreshed House Beautiful story, image, summary,
     comment count, and natural wrapping.
136. Trace the direct story through the generated all-destination fixture,
     exact production Featured Story Carousel, saved-ID wrapper, production
     profile model, Read Later collection, and current `/hearst-plus/`
     consumer.
137. Measure direct and routed 1280px geometry, active/inert slide semantics,
     pagination, tokens, media state, containment, target sizes, accessible
     names, and browser errors.
138. Verify keyboard save/unsave semantics, focus retention across the
     Save/Saved name change, independent per-story state, callbacks,
     pause-on-focus/hover, polite status, reduced motion, cyclic navigation,
     and signed-in persistence/model merge behavior.
139. Reproduce the reader-close case where ranking leaves the exact opener on
     an inactive slide, add the precise same-story selector fallback to the
     shared production reader shell, and add an integrated regression.
140. Pass all 11 focused carousel and integrated Storybook checks, all 26
     focused saved-model/allocator/personalization/presentation/token tests,
     focused lint, and all ten routed carousel transitions.
141. Regenerate only `featured-carousel-saved-1280`, inspect it, record its
     SHA-256, and rerun the focused comparison at `0%`.
142. Run the complete 47-case queue read-only, confirm 7 unresolved cases,
     and rank `vertical-video-carousel-390` next at `26.735%`.
143. Compare the exact prior/current 390px vertical-carousel images and
     localize the changed pixels to the first two checked-in Cosmopolitan
     posters, titles, topics, and natural text shapes.
144. Trace the direct story through the generated all-destination fixture,
     deterministic portrait MP4 and exact 540×960 metadata, the production
     ratio selector and `VerticalVideoCarousel`, and the current
     `/hearst-plus/videos/` Delish Shorts consumer.
145. Verify mobile card and poster geometry, horizontal snap and containment,
     complete target names, focus-visible treatment, callback wiring,
     reduced-motion behavior, and the separation between the poster carousel
     and the production immersive playback owner.
146. Pass all 17 focused Video Cards, Delish Shorts Viewer, Adaptive Video,
     and integrated Hearst+ Storybook checks plus all 19 focused queue,
     aspect-ratio, playback, and token tests.
147. Regenerate only `vertical-video-carousel-390`, inspect it, record its
     SHA-256, and rerun the focused comparison at `0%`.
148. Run the complete 47-case queue read-only, confirm 6 unresolved cases,
     and rank `lifestyle-destination-home-320` next at `44.406%`.
149. Compare the exact prior/current 320px Lifestyle destination images and
     localize the changed pixels to the allocator-selected Country Living
     hero, its image, summary, comment count, natural wrapping, and the
     already-reviewed shared carousel presentation.
150. Trace the story through the corrected destination-mode
     `LifestyleDestinationApp`, generated fixture, identical checked-in
     Lifestyle source record, production allocator and components, runtime
     tokens, and actual `/hearst-lifestyle/` route.
151. Verify true 320px header, menu, Search, topic rail, hero, module/card
     ordering, intentional horizontal overflow, landmark/name/status
     semantics, 44px mobile targets, focus/Escape restoration, reduced
     motion, state boundaries, and browser-error behavior.
152. Pass all 42 focused destination/component Storybook checks, all 32
     focused allocator/presentation/token/personalization/video-model tests,
     and all ten production carousel accessibility transitions.
153. Regenerate only `lifestyle-destination-home-320`, inspect it, record its
     SHA-256, rerun the focused case at `0%`, and recheck the corrected 1280px
     destination-mode baseline at `0%`.
154. Run the complete 47-case queue read-only, confirm five unresolved cases,
     and rank `videos-feed-dark-390` next at `44.891%`.
155. Compare the exact prior/current 390px Videos Feed captures and separate
     the approved destination-driven dark header, current Ford Bronco
     editorial/media allocation, and focus-visible reader return state from
     component drift.
156. Trace the integrated story through the generated all-destination fixture,
     deterministic landscape/portrait media wrappers, production
     `HomePageTemplate`, progressive resolver, queue model, card family,
     navigation, tokens, and actual `/hearst-plus/videos/` route.
157. Verify the 390px dark utility/masthead/topic navigation, contained lead
     and rail geometry, module ordering, complete accessible names and
     landmarks, mobile menu/Search semantics, media ready/error/unavailable
     states, reduced motion, overflow/reflow, and browser-error behavior.
158. Recheck the live reader and Delish Shorts close flows restore their exact
     openers, native playback enters a ready inline-controls state, and the
     corrected desktop dark-header/focus baseline remains at `0%`.
159. Correct the secondary feed-card Play target from 40×40px to 44×44px and
     add a focused keyboard/size regression without changing queue, token,
     poster, crop, or callback APIs.
160. Pass all 39 focused Videos/component Storybook checks, all 37 focused
     queue/media/navigation/presentation/token tests, and focused lint.
161. Regenerate only `videos-feed-dark-390`, inspect it, record its SHA-256,
     and rerun the focused comparison at `0%`.
162. Run the complete 47-case queue read-only, confirm four unresolved cases,
     and rank `featured-carousel-mobile-390` next at `48.806%`.
163. Compare the exact prior/current 390px carousel images and localize the
     changed pixels to the refreshed House Beautiful story, image, summary,
     comment count, and already-reviewed shared Follow presentation.
164. Trace the direct story through the generated all-destination fixture,
     identical checked-in production record, distinct-brand/video fixture,
     exact production Featured Story Carousel, and current `/hearst-plus/`
     consumer.
165. Measure 390px geometry, image crop, active/inert slides, page overflow,
     and all nine mobile targets; verify swipe, keyboard, saved focus,
     callbacks, pause/status behavior, reduced motion, zoom, orientation, and
     browser errors.
166. Pass all 11 focused carousel/integrated Storybook checks, all 32 focused
     allocator/presentation/token/personalization/video tests, focused lint,
     and all ten routed carousel accessibility transitions.
167. Recheck `featured-carousel-mixed-1280` and
     `featured-carousel-saved-1280` at `0%`; regenerate only
     `featured-carousel-mobile-390`, inspect it, record its SHA-256, and rerun
     the focused comparison at `0%`.
168. Run the complete 47-case queue read-only, confirm three unresolved cases,
     and rank `lifestyle-destination-home-390` next.
169. Compare the exact 390×7154 prior and 390×7143 current full-page images,
     localize the footer boundary and upstream wrapping, and rule out capture
     truncation or remote-media-driven height.
170. Trace the current story through the corrected destination-mode wrapper,
     generated Lifestyle fixture, exact production Home Page Template,
     allocators/tokens, and current `/hearst-lifestyle/` consumer.
171. Measure complete 390px module order, fixed media boxes, intentional rails,
     page containment and 44px targets; verify Search/menu Escape restoration,
     keyboard save, reduced motion, equivalent 200% reflow, orientation, and
     browser errors.
172. Pass all 42 focused destination/component Storybook checks, all 32 focused
     allocator/presentation/token/personalization/video tests, focused lint,
     and all ten routed carousel accessibility transitions.
173. Recheck the reviewed 320px and 1280px destination baselines at `0%`;
     regenerate only `lifestyle-destination-home-390`, inspect it, record its
     SHA-256, and rerun the focused comparison at `0%`.
174. Run the complete 47-case queue read-only, confirm two unresolved cases,
     and rank `reader-article-body-ready-390` next.
175. Compare the exact 390×963 prior and 390×899 current reader-body images,
     localize the entire 64px delta to two removed 32px editorial-summary
     lines, and rule out font, media, state, responsive, and harness drift.
176. Trace the Ready story through the generated ELLE/Cosmopolitan fixtures,
     checked-in Flux/Lifestyle feeds, exact production Reader Article Body,
     live-article model, Home Page Template, and current `/flux/elle/` reader.
177. Measure the direct and routed 390px structure, fonts, media, semantic
     order, targets, overflow and callback state; verify keyboard open, image
     gallery, Escape/focus restoration, reduced motion, 200% reflow,
     orientation, and browser-error behavior.
178. Pass all 21 focused reader Storybook checks, all 33 focused
     reader/model/queue/presentation/token tests, and focused lint.
179. Recheck the reviewed reader shell, action-bar, Ambient Reader, and image
     viewer baselines at `0%`; regenerate only
     `reader-article-body-ready-390`, inspect it, record its SHA-256, and rerun
     the focused comparison at `0%`.
180. Run the complete 47-case queue read-only, confirm one unresolved case,
     and rank `brand-spotlight-production-320` next.
181. Compare the prior/current Brand Spotlight captures and localize the
     `320×1135→320×1124` change to current checked-in Car and Driver editorial
     allocation and wrapping.
182. Trace the direct story through the exact selector, production renderer,
     generated fixture and `/hearst-plus/` consumer; verify canonical brand
     navigation, logo, media, tokens, semantic order, callbacks, keyboard
     reader handoff, focus restoration, 44px targets, reduced motion,
     orientation and browser errors.
183. Correct the secondary-card 200% reflow defect with a container-based stack
     below 120px and add the `Zoom200Mobile` containment regression.
184. Regenerate only `brand-spotlight-production-320`, inspect the 320×1124
     image, record SHA-256
     `76d71e1293c668ac7f86a34d2e3c53572e5aee93001f95734b6be34a3606def3`,
     and recheck desktop and mobile at `0%`.
185. Replace the Brand Logo effect-time error reset with source-keyed load
     results; pass focused lint, 15 related Storybook checks and 12 focused
     model/token checks.
186. Perform the completion audit, refresh the stale generated component
     registry, correct six token-gate regressions without refreshing its
     baseline, and update the Videos Feed semantic-token assertion.
187. Pass all 113 unit tests, all 271 Storybook interaction/accessibility
     checks, publication and token validation, component-index freshness,
     focused lint, the token gate at 630 known/59 resolved/zero regressions,
     and the final read-only 47-of-47 visual queue.

## 14. Audit limitations

- The audit treats the current routed application as component authority. It
  verified the public Storybook deployment for catalog freshness, but it does
  not claim same-state parity with every externally deployed Hearst publication
  site.
- Storybook uses checked-in production-aligned editorial fixtures because a
  static catalog cannot execute all Next.js route handlers.
- Automated accessibility checks cannot prove screen-reader usability,
  cognitive clarity, zoom support, or high-contrast behavior.
- Pixel baselines prove stability against reviewed local images, not correctness
  against every publication or live content combination.
- The latest fresh complete read-only visual run passes all 47 cases after
  the focused `onboarding-mobile-320`, `todays-edit-complete-1280`,
  `story-actions-mobile-390`, `todays-edit-tablet-768`, and
  `trending-articles-lifestyle-390` corrections, plus the
  `brand-spotlight-production-1280` and
  `reader-action-bar-default-390`, `trending-videos-390`, and
  `videos-feed-dark-1280`, `reader-success-elle-390`, and
  `article-river-card-320` and `lifestyle-destination-home-1280`
  corrections, plus `featured-carousel-mixed-1280`,
  `featured-carousel-saved-1280`, `vertical-video-carousel-390`, and
  `lifestyle-destination-home-320`, plus `videos-feed-dark-390`,
  `featured-carousel-mobile-390`, and
  `lifestyle-destination-home-390`, plus
  `reader-article-body-ready-390` and
  `brand-spotlight-production-320` corrections. The
  Button baseline itself remains within tolerance, but shared controls,
  data-sensitive editorial fixtures, and publication surfaces require
  same-state production comparison before any broad baseline refresh.
- The publication-reader focus-boundary failure is no longer open: the focused
  reader suite and the subsequent complete 271-story browser suite pass.
- The under-44px compact desktop navigation controls remain an explicit
  product-level remediation item. This carousel audit also records its 28px
  desktop rotation controls and 24px desktop selectors/actions alongside that
  target-size work; mobile carousel controls remain 44px.
- Campaign images and remote video availability can change independently of
  component code.
- The worktree contains uncommitted, mixed changes. The audit describes the
  current checkout, not a published revision.
- The production Storybook is reachable, but it predates the provenance
  artifact and therefore cannot prove its source revision; the current live
  verifier result is HTTP 404 for `/storybook/build-info.json`.
