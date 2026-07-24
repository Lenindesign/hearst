# Hearst+ Daily Habit Audit

Date: July 23, 2026
Scope: `/hearst-plus/`, onboarding, mobile navigation, search, Saved, article reader, personalization behavior, account persistence, feed refresh, analytics readiness, and implementation risk.
Target: A useful, reader-controlled daily habit—not compulsive engagement.

## Executive verdict

Hearst+ already has a strong foundation for a daily product: broad trusted inventory, a scheduled and validated daily feed refresh, cross-brand ranking, daypart scoring, return-freshness logic, saves, follows, hides, collections, full readers, and explicit prototype boundaries.

The main weakness is not the recommendation engine. It is the reader-facing habit loop.

The current experience presents itself primarily as an infinite personalized homepage. The most valuable daily behaviors—what is new, what changed since the last visit, what can be finished in five minutes, and where the reader left off—are either simulated, hidden in a stakeholder console, desktop-only, or mislabeled. As a result, a reader can consume content, but the product does not yet make a compelling promise about why they should return tomorrow.

The highest-leverage product direction is a bounded **Your Daily Edit** placed above the open-ended river:

- 5–8 useful stories selected for the current moment.
- A clear time promise, such as “5 minutes.”
- “New since your last visit” and genuine resume state.
- A visible end state: “You’re caught up.”
- The infinite river remains available below as optional exploration.

This creates a predictable ritual while preserving the breadth and serendipity already working well.

## Product and user understanding

### What the application does

Hearst+ is a cross-brand editorial discovery and reading experience. It combines public Hearst story inventory and current Personalize recommendations, then ranks content using reader interests, followed brands, saves, hides, recency, popularity, daypart, return context, and diversity.

### Intended users

Readers who want useful content organized around needs and interests—food, home, wellness, shopping, entertainment, technology, cars, style, and culture—without visiting individual publication sites one at a time.

### Main journeys

1. Open For You and scan featured/current stories.
2. Read an article, gallery, or video inside the app.
3. Save, follow, hide, or request more similar content.
4. Search by title, brand, topic, or tag.
5. Create a local demo profile and choose interests and brands.
6. Return to Saved, collections, or the mobile Continue Reading menu.
7. Revisit later and receive a differently ranked feed.

### Intended success actions

- Complete a useful read.
- Save or collect a story for later.
- Follow a topic or brand.
- Return for a later or next-day edition.
- Resume an unfinished article.

### Current value proposition

The interface communicates “one personalized feed across Hearst” well. It communicates “a reason to return every day” much less clearly.

### Confirmed implementation boundaries

- Account and preference data is browser-local demo state.
- Production identity, consent, cross-device sync, analytics, and experimentation are not integrated.
- A GitHub workflow now refreshes, validates, builds, and publishes the daily story catalog at 10:15 UTC.
- Daypart and return-visit ranking are implemented, but the active return state is controlled by the stakeholder demo rather than real visit history.

## Audit evidence and flow health

### Step 1 — Desktop For You

Health: **Good content foundation; weak daily framing**

![Desktop Hearst+ For You](output/playwright/daily-habit-audit-2026-07-23/01-home-desktop.png)

The page establishes Hearst+ as a premium editorial destination. Source brands, imagery, bylines, current stories, topic actions, and cross-brand breadth are visible. However:

- “Your Daily Habit,” Today’s Edit, featured stories, and Trending Across Brands repeat much of the same content.
- The page does not state how many stories are in today’s edition, how long it takes, what is new, or what the reader already saw.
- The page immediately becomes an open-ended feed rather than a bounded ritual.
- “Your Daily Habit” is a three-story sidebar list, not a differentiated habit product.

### Step 2 — Mobile For You at 375px

Health: **Visually strong; habit value disappears**

![Mobile Hearst+ For You](output/playwright/daily-habit-audit-2026-07-23/02-home-mobile-375.png)

The mobile hero is legible and visually engaging. The content itself remains the strongest acquisition asset. But the desktop habit modules are absent above the fold. A returning reader sees essentially the same hero-first experience as a first-time visitor.

The horizontally scrolling topic navigation places Saved at the far end. At narrow widths, only For You, Home, Style, and part of Reviews/Fitness are initially visible, so a major continuity feature has low discoverability.

### Step 3 — Onboarding entry

Health: **Clear value statement; premature commitment**

![Onboarding introduction](output/playwright/daily-habit-audit-2026-07-23/03-profile-mobile.png)

Strengths:

- The headline is benefit-led.
- The product explains what the profile saves.
- “Skip for now” preserves user control.

Risks:

- The first line says “Create Account” and “Step 1 of 5” before the reader has experienced personalized value.
- The primary action says “Personalize My Feed,” which conflicts slightly with the account-creation framing.
- Five steps create perceived effort during a moment that should feel lightweight.
- The modal’s fixed footer leaves supporting copy partially cut off in the mobile viewport.

### Step 4 — Interest selection

Health: **Understandable; asks too much too soon**

![Onboarding interests](output/playwright/daily-habit-audit-2026-07-23/04-onboarding-interests-mobile.png)

The selection controls are clear and the minimum is explicit. Requiring at least three interests improves cold-start relevance, but it also delays the first reward. The product could learn one or two interests, show the result immediately, and continue tuning through real behavior.

### Step 5 — Mobile reader

Health: **Strong reading destination; no durable resume model**

![Mobile article reader](output/playwright/daily-habit-audit-2026-07-23/05-reader-mobile.png)

The reader preserves publication identity, keeps the experience inside Hearst+, exposes save/follow actions, and provides a complete article body. These are strong retention foundations.

However, the account data model does not store:

- Last opened story.
- Article scroll position.
- Reading completion.
- Last visit time.
- Recently read story IDs.
- Edition completion.

The reader calculates progress visually during the current session, but that state is not part of the persistent reader profile. Closing and returning cannot reliably resume the actual place the reader left.

### Step 6 — Saved empty state

Health: **Dead end**

![Saved empty state](output/playwright/daily-habit-audit-2026-07-23/06-saved-empty-mobile.png)

The empty state says:

> No stories in Saved yet. Clear a brand filter or switch back to For You to keep exploring.

No brand filter was active in this test. The message therefore diagnoses the wrong problem. It also provides no direct action button and no suggested stories to save.

Below it, reader-facing space is dominated by Story Source and ranking-model details. This conflicts with the product rule that the experience should feel like a tuned magazine app rather than a dashboard.

### Step 7 — Search

Health: **Functionally solid; visually noisy**

![Mobile search](output/playwright/daily-habit-audit-2026-07-23/07-search-mobile.png)

Search has a clear label, popular suggestions, structured source metadata, and semantic combobox/listbox behavior. The translucent overlay allows unrelated Saved-page content to compete with the results, reducing clarity. Search also does not learn from successful result opens because production analytics are absent.

### Step 8 — Return-visit model

Health: **Strong model; hidden from readers**

![Personalization console](output/playwright/daily-habit-audit-2026-07-23/08-personalization-console-mobile.png)

The implementation includes:

- Morning, afternoon, evening, and late-night missions.
- Freshness since the last visit.
- A penalty preventing the previous lead from repeating.
- Next-day novelty.
- Behavior presets.
- Explanations for why a story ranked.

This is one of the strongest parts of the prototype, but it is accessible primarily through a stakeholder console. The floating console button also overlays reader content on narrow screens. Consumer and stakeholder modes should be separated.

### Step 9 — Mobile Continue Reading menu

Health: **Promising placement; misleading data**

![Mobile Continue Reading](output/playwright/daily-habit-audit-2026-07-23/09-mobile-menu-continue-reading.png)

The menu is a good location for continuity. The current queue is not based on reading history. In code, it selects the first available video, then the second and first catalog stories. This means “Continue Reading” can show stories the reader never started.

This is a trust problem, not just a missing enhancement.

### Step 10 — Narrow mobile at 320px

Health: **Core content fits; secondary habit actions are hidden**

![Hearst+ at 320px](output/playwright/daily-habit-audit-2026-07-23/10-home-mobile-320.png)

The hero remains usable and the page avoids obvious horizontal overflow. The masthead and navigation consume significant vertical space, while Saved and later categories require horizontal discovery. The reader-facing daypart, return, and daily-edition signals remain absent.

## What is already working and should be preserved

1. **Editorial trust is visible.** Publication identity, bylines, imagery, timestamps, and source context are consistently present.
2. **The reading experience stays inside the product.** Complete readers, galleries, videos, and related content reduce context loss.
3. **Readers have control.** Save, follow, hide, More Like This, collections, and preference editing are preferable to opaque personalization.
4. **Cold-start ranking is useful.** Popularity, freshness, editorial defaults, topic and brand signals create a viable first visit.
5. **The ranking architecture supports return behavior.** Return freshness, dayparts, repeat-lead suppression, and next-day novelty are already implemented.
6. **Daily catalog refresh exists.** The scheduled workflow imports, enriches, validates, builds, and publishes.
7. **Progressive delivery protects performance.** The river requests more inventory near the sentinel rather than downloading the full catalog on idle.
8. **Responsive content quality is high.** The editorial hero remains strong at 320px and 375px.
9. **Prototype boundaries are disclosed.** The product does not falsely claim production identity or cross-device behavior.

## Prioritized findings

| ID | Area | Page or component | Finding | Evidence | User impact | Recommendation | Severity | Effort | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| HAB-01 | Habit loop | For You | The product has no bounded daily edition or completion state. | Screens 1, 2, 10; the river immediately becomes infinite. | Readers get content but no predictable ritual or reason to feel “done.” | Add a 5–8 story Your Daily Edit above the river with a time promise, progress, and caught-up state. | P1 | Large | High confidence |
| HAB-02 | Trust and continuity | Today’s Edit; mobile menu | “Continue Reading” is not based on actual reading history. | `home-page.tsx:8043–8047` and `11215–11227`. | Readers may be shown unfamiliar stories as if they started them, weakening trust. | Persist genuine open/progress/completion state; hide the module when no unfinished story exists. | P1 | Medium | Confirmed |
| HAB-03 | Personalization | Return visits | Daypart and return behavior reset to a fixed simulated morning state. | `home-page.tsx:301–305`; demo changes at `10038–10045`. | Real return visits do not receive the value demonstrated by the stakeholder console. | Derive visit context from timestamps and edition IDs; persist last visit and previous lead. | P1 | Medium | Confirmed |
| HAB-04 | Mobile UX | For You | Daily Habit and Today’s Edit are desktop-only; Saved is offscreen in navigation. | Screens 2 and 10; sidebars hidden below `lg`, dashboard hidden below `md`. | Mobile readers miss the product’s strongest retention features. | Place Daily Edit and genuine resume directly below the mobile masthead; keep Saved persistently reachable. | P1 | Medium | Confirmed |
| HAB-05 | Saved | Saved empty state | Empty state gives incorrect filter advice and no direct recovery action. | Screen 6. | A reader interested in saving reaches a dead end before forming the behavior. | Use “Save stories to build your reading list,” add Browse For You, and show 3 personalized save suggestions. | P1 | Small | Confirmed |
| HAB-06 | Measurement | App-wide | Production analytics and experiments are not integrated. | `PRODUCT.md:30`; blueprint measurement section. | The team cannot distinguish novelty from durable habit formation. | Instrument useful sessions, edition completion, real resumes, D1/D7 returns, and negative signals before optimizing. | P1 | Large | Confirmed |
| HAB-07 | Product modes | App-wide | Stakeholder panels and the floating demo control appear in the reader product. | Screens 1, 6, 8, 10. | Technical detail competes with editorial value and makes the app feel like a dashboard. | Add a stakeholder/demo feature flag; keep reader mode content-first. | P1 | Medium | Confirmed |
| HAB-08 | Accessibility | Featured carousel | DOM evidence exposes all five carousel slides as buttons/headings, not only the active slide. | Current browser accessibility snapshot. | Keyboard and screen-reader users may traverse hidden or inactive content repeatedly. | Re-verify `inert`, `aria-hidden`, and tab order after every slide transition; add an automated accessibility test. | P1 | Small | High confidence |
| HAB-09 | Onboarding | Profile onboarding | Five-step account framing precedes experienced personalization value. | Screens 3 and 4. | Readers may abandon before seeing why personalization matters. | Ask for 1–2 interests, render a preview immediately, and defer account creation until save/sync value exists. | P2 | Medium | High confidence |
| HAB-10 | Explainability | Feed cards | Ranking reasons exist but are mostly in the stakeholder console. | Screen 8; strategy reasons at `home-page.tsx:924–950`. | Personalization can feel arbitrary even though the model is explainable. | Add one restrained reason per recommendation: “New since yesterday,” “Because you follow Home,” or “5-minute morning pick.” | P2 | Medium | Confirmed |
| HAB-11 | Information architecture | For You | Daily Habit, Today’s Edit, Featured, and Trending often repeat the same stories. | Screen 1 and desktop DOM. | Repetition reduces perceived freshness and wastes high-value space. | Give each module a distinct job and deduplicate across modules. | P2 | Medium | High confidence |
| HAB-12 | Account continuity | Profile | Preferences and collections are local to one browser. | `reader-account.tsx:86–116`; explicit prototype disclosure. | Readers cannot build a durable habit across phone, desktop, or a cleared browser. | Connect authenticated, consent-aware identity only after the reader-facing loop proves value. | P2 | Large | Confirmed |
| HAB-13 | Re-engagement | Utility navigation | Newsletter is a generic external destination; no personalized digest or controlled reminder exists. | Utility navigation and code search. | The product has no deliberate off-site cue to restart the loop. | Offer an opt-in edition digest with timing/frequency controls after users demonstrate value. | P2 | Large | Confirmed |
| HAB-14 | Search visual design | Search dialog | Background content remains visually prominent through the overlay. | Screen 7. | Results are harder to scan and the modal feels less focused. | Increase panel/background opacity and simplify the visible backdrop. | P2 | Small | Confirmed |
| HAB-15 | Architecture | `home-page.tsx` | Habit logic, ranking, reader, navigation, overlays, and feed rendering remain in an 11,469-line file. | Current file length and component locations. | Daily-habit experiments will be slow and regression-prone. | Incrementally extract edition state, reading history, Today’s Edit, and habit telemetry modules; do not rewrite the page. | P2 | Large | Confirmed |
| HAB-16 | Documentation | Product truth | `PRODUCT.md` says scheduled refresh is still required, but a daily publishing workflow exists. | `PRODUCT.md:30`; `.github/workflows/refresh-hearst-story-feed.yml`. | Stakeholders can make decisions using stale delivery assumptions. | Update product truth and add monitoring status rather than describing refresh as unscheduled. | P3 | Small | Confirmed |

## Implementation log

### 2026-07-23 — HAB-01 resolved

- Turned the existing five-story featured carousel into `Today’s Picks` on unfiltered destination `For You` views instead of adding a second, duplicative daily module.
- The five mixed-format picks remain stable for the local calendar day while preserving the carousel&rsquo;s ranking and source-diversity rules.
- The carousel stays intentionally editorial: `Today’s Picks` sits inside the existing slide-position pill beside `1 of 5`, with no separate header, explanatory row, or progress bar.
- Affected files: `src/components/home-page.tsx`, `src/lib/daily-edition.ts`, `src/lib/daily-edition.test.ts`, and `APP_RULES.md`.
- Verification: 20 unit tests passed; focused lint passed; production build passed; live UI checked at 320px, 390px, and 1280px with five slides, no counter or progress bar, centered black header styling, and no page or header overflow.

### 2026-07-23 — HAB-02 resolved

- Replaced catalog-derived Continue Reading placeholders with browser-local opened-story history.
- Reader scroll position now updates bounded progress records; stories at or above 90% are removed from Continue Reading.
- The mobile discovery menu remains available with a truthful empty state when no unfinished stories exist.
- The desktop Today&rsquo;s Edit omits Continue Reading when history is empty and switches to a balanced three-column layout.
- Affected files: `src/components/home-page.tsx`, `src/lib/reading-history.ts`, `src/lib/reading-history.test.ts`, and `APP_RULES.md`.
- Verification: 15 unit tests passed; focused lint passed; production build passed; live UI checked at 320px and 1280px for empty and genuine-history states.

### 2026-07-23 — HAB-03 resolved

- Replaced the fixed morning-first-visit default with browser-local visit context derived from the reader&rsquo;s actual local time, last visit timestamp, edition date, and previous featured lead.
- Reloads within thirty minutes remain part of the same visit. Genuine returns activate elapsed-time freshness and suppress the previous lead; a new local date activates next-edition novelty against the current catalog.
- The five `Today’s Picks` stories remain stable for the day, but a return visit opens the carousel on a different pick when the previous lead is still present.
- Stakeholder time and return controls are temporary simulations and no longer overwrite the reader&rsquo;s real visit record. Generated next-day story transformations remain simulation-only.
- Affected files: `src/components/home-page.tsx`, `src/lib/visit-context.ts`, `src/lib/visit-context.test.ts`, and `APP_RULES.md`.
- Verification: 26 unit tests passed; focused lint passed; production build passed. Live browser QA confirmed that a quick reload preserves the lead, a simulated four-hour real return opens on a different pick, the stakeholder panel reports the local visit context, simulation controls do not overwrite the real visit record, and the 320px page has no horizontal overflow.

### 2026-07-23 — HAB-04 resolved

- Added one compact mobile Continue Reading strip directly below the category navigation when genuine unfinished reading history exists. It opens the same in-app reader, while the hamburger menu retains the complete queue.
- Pinned `Saved` to the right edge of the mobile category row so it remains visible while the other categories scroll horizontally.
- Empty history does not render a placeholder strip. Desktop retains its existing Today&rsquo;s Edit and navigation structure.
- Affected files: `src/components/home-page.tsx` and `APP_RULES.md`.
- Verification: 26 unit tests passed; focused lint passed; production build passed. Live QA at 320px and 390px confirmed a 66px genuine-history strip with a one-line headline, visible keyboard focus, working in-app reader navigation, persistent Saved routing and active state, no horizontal overflow, and no strip when history is empty. The scoped dark Videos view was also checked at 320px.

### 2026-07-23 — HAB-05 resolved

- Replaced the dead-end Saved message with `Save stories to build your reading list.`, concise explanatory copy, and a direct `Browse For You` action.
- Added exactly three personalized, unsaved, non-hidden story suggestions with independent open and save controls. Saving one immediately replaces the empty state with the real Saved feed.
- When saved stories exist but a brand filter excludes them, the state explains the mismatch and offers Clear brand filter. The empty Trending Across Brands card is omitted.
- Affected files: `src/components/home-page.tsx` and `APP_RULES.md`.
- Verification: 26 unit tests passed; focused lint passed; production build passed. Live QA at 320px and 1280px confirmed three open actions, three save actions, keyboard focus, no horizontal overflow, immediate transition to a real Saved feed after saving, and `Browse For You` routing to the active For You view.

### 2026-07-23 — HAB-06 measurement foundation implemented

- Added a typed, vendor-neutral browser event contract for return sessions, Today’s Picks impressions and opens, genuine resume impressions and opens, Saved empty-state recovery, saves, hides, More Like This, and useful sessions.
- Useful sessions are intentionally conservative: only an explicit Save or More Like This action qualifies in this first pass. Story opens and page views do not.
- Event properties are bounded and limited to approved product metadata. The contract excludes article text, search terms, comment bodies, email addresses, account IDs, source URLs, and other direct personal identifiers.
- Events are dispatched only inside the browser as `hearst-product-analytics`; no production vendor, network collector, consent system, retention policy, dashboard, or experiment assignment has been added.
- Primary KPI: useful-session rate (`useful_session` / `return_session`). Drivers: Today’s Picks open rate, resume open rate, and save activation. Retention cohorts derive from `return_window`. Guardrails: hide and unsave rates.
- Affected files: `src/lib/product-analytics.ts`, `src/lib/product-analytics.test.ts`, `src/components/home-page.tsx`, `PRODUCT.md`, and `APP_RULES.md`.
- Verification: 29 unit tests passed; focused lint passed; production build passed. Live checks at 1280px and 320px confirmed no horizontal overflow, Today’s Picks impression/open events, return-session events, Saved empty-state and Browse For You events, and the save funnel (`saved_suggestion_save`, `story_save_toggle`, `useful_session`). Opening the reader does not record covered underlay modules as impressions.
- Remaining evidence required before HAB-06 can be fully resolved: privacy review, consent design, production collector selection, data-quality validation, dashboard definitions, and baseline measurement before setting targets.

### 2026-07-23 — HAB-07 resolved

- Made destination and publication routes content-first by default.
- Removed the floating personalization controls, source inventories, ranking-debug panels, simulation details, and Behavior Model section from the ordinary reader experience without changing ranking or editorial content.
- Stakeholder tools remain available through `?demo=1` or `NEXT_PUBLIC_HEARST_STAKEHOLDER_TOOLS=true`.
- Demo mode persists through category, publication, and reader-return navigation.
- Affected files: `src/components/home-page.tsx`, `PRODUCT.md`, and `APP_RULES.md`.
- Verification: 29 unit tests passed; focused lint passed; production build passed. Live checks at 1280px and 320px confirmed that the default route exposes no stakeholder control, Story Source, or Behavior Model content; `?demo=1` restores all three and opens the personalization dialog; both modes have no horizontal overflow. Opening and closing a story preserves `?demo=1` through the encoded reader return route.

### 2026-07-23 — HAB-08 resolved

- Added a repeatable Chromium accessibility regression for the five-slide Today’s Picks carousel.
- The test keyboard-activates every named slide selector at 1280px and 320px with reduced motion enabled.
- After each transition it requires exactly one active slide with `aria-hidden="false"`, no `inert` attribute, and `tabIndex=0`. Every inactive slide must keep `aria-hidden="true"`, `inert`, and `tabIndex=-1`.
- The test also verifies one named selector per slide, the correct `aria-current` state, and no horizontal page overflow.
- The command reuses a running local app when available and otherwise starts an isolated Next.js server: `npm run test:a11y:carousel`.
- Affected files: `scripts/test-featured-carousel-a11y.mjs`, `package.json`, and `APP_RULES.md`.
- Verification: script lint passed; 29 unit tests passed; all 10 carousel transition checks passed across 1280px and 320px; production build passed.

### 2026-07-23 — HAB-09 resolved

- Replaced the visible five-step, account-first journey with one optional personalization screen.
- Readers choose one or two interests and see real matching story cards update immediately before applying the preference.
- Applying the preference changes the browser-local For You profile without opening sign-in or account creation. The utility action now says `Personalize` instead of `Demo Profile` for readers without a local profile.
- On phones, the interest picker scrolls horizontally so the preview begins in the first modal viewport. The modal preserves its two-choice limit, has no horizontal overflow, closes with Escape, and restores focus to the Personalize opener.
- Affected files: `src/components/home-page.tsx`, `src/components/hearst-plus/utility-bar.tsx`, `PRODUCT.md`, and `APP_RULES.md`.
- Verification: 29 unit tests passed; focused lint passed; production build passed. Live QA at 1280px and 320px confirmed the disabled initial action, an immediate three-story preview, enforced two-interest maximum, no modal overflow, successful preference application, no account prompt, Escape dismissal, and correct focus restoration.

### 2026-07-24 — HAB-10 resolved

- Added one quiet, reader-facing explanation to every `For You` river card, including standard articles, rich galleries, and video cards.
- Each explanation is derived from the same ranking inputs as the card order. The supported reasons are new since the last visit, new in today&rsquo;s edition, an exact followed topic, an exact followed brand, the current daypart, editor selection, or broad Hearst popularity.
- Reasons are plain metadata text rather than badges or scoring details. Category and Saved views do not show them.
- Added a tested reason-selection helper so precedence and copy cannot silently drift from the documented contract.
- Affected files: `src/components/home-page.tsx`, `src/lib/recommendation-reason.ts`, `src/lib/recommendation-reason.test.ts`, `PRODUCT.md`, and `APP_RULES.md`.
- Verification: 33 unit tests passed; focused lint passed; production build passed. Live QA at desktop and 320px confirmed readable placement, one reason per For You card, no reason labels on the Style category route, and no added card or badge treatment.

### 2026-07-24 — HAB-11 resolved

- Added one deterministic allocation step for the high-value `For You` surfaces instead of letting each module independently select from the same ranked array.
- Today&rsquo;s Picks reserves its five-story edition first, followed by Today&rsquo;s Edit, Daily Habit, Trending Across Brands, and the river. Trending prefers different brands, and small scoped catalogs retain at least four river stories by omitting optional modules before the feed is emptied.
- Genuine Continue Reading remains the only permitted overlap, and only when the reader has no alternative unfinished story outside Today&rsquo;s Picks.
- Added stable module and story attributes to support live duplicate detection without coupling checks to visible copy or layout.
- Affected files: `src/components/home-page.tsx`, `src/lib/story-module-allocation.ts`, `src/lib/story-module-allocation.test.ts`, `PRODUCT.md`, and `APP_RULES.md`.
- Verification: 37 unit tests passed; focused lint passed; production build passed. Live QA at 1203px found five Today&rsquo;s Picks, four Today&rsquo;s Edit, three Daily Habit, five Trending Across Brands, and nine river stories with zero cross-module duplicate IDs and zero page overflow. At an exact 320px content viewport, five picks and nine river stories remained visible with zero duplicates and zero horizontal overflow.

### 2026-07-24 — HAB-12 and HAB-13 deferred

- HAB-12 was intentionally skipped. The repository has no production identity provider, account database, or sync API, so the browser-local demo cannot honestly provide authenticated cross-device continuity.
- HAB-13 was also deferred because the prototype has no consent-aware email delivery or notification service. A preference control without a working delivery path would create a false promise.
- No identity, credential, newsletter, notification, or delivery code was added.

### 2026-07-24 — HAB-14 resolved

- Fixed the light search dialog&rsquo;s transparent panel. Because search is portaled to the document body, the destination-scoped `--hp-surface` variable was unavailable and the feed visibly bled through the results.
- The search panel now uses the global background token, remains opaque in light and dark themes, and sits over a quieter 70% black backdrop with a restrained blur.
- Added stable search-panel and backdrop attributes for focused visual regression checks.
- Affected files: `src/components/home-page.tsx`, `APP_RULES.md`, and `DAILY_HABIT_AUDIT.md`.
- Verification: 37 unit tests passed; focused lint passed; production build passed. Live desktop QA confirmed an opaque white panel in Hearst+ and an opaque dark panel in Fashion & Luxury, immediate input focus, zero horizontal overflow, and clear result separation. At an exact 320px content viewport, the panel remained within the viewport, the close control measured 44px, and Escape closed the dialog and returned focus to Search.

## Recommended daily habit model

### 1. Cue

Give the reader a reason to open:

- Optional morning or evening digest.
- “6 new since your last visit.”
- A real unfinished story.
- A collection that changed: “2 new recipes for Weekend Plans.”

Do not use default push permissions, fear of missing out, or guilt-based streak loss.

### 2. Routine

Create a bounded five-minute session:

**Your Daily Edit**

- 1 important or broadly useful lead.
- 2 stories from followed topics.
- 1 story from a followed brand.
- 1 serendipitous/diversity story.
- Optional resume card before the edit when an unfinished read exists.

Each item should explain its role with short language:

- New since last night
- Because you follow Home
- Continue at 42%
- Popular across Hearst
- A different perspective

### 3. Reward

The reward should be usefulness and control:

- “You’re caught up.”
- A compact recap of what was read/saved.
- “Your next edition refreshes this evening.”
- Optional “Keep exploring” entry to the infinite river.

Avoid points, coins, forced sharing, or a punitive streak.

### 4. Investment

Let real actions improve the next visit:

- Save.
- Follow.
- Hide.
- More Like This.
- Add to a project-oriented collection.
- Choose digest timing.

Show the effect immediately: “We’ll show more home organization stories.”

### 5. Return

On the next session:

- Preserve completed edition state.
- Resume unfinished stories at the exact position.
- Suppress previously completed stories unless materially updated.
- Label new and updated items.
- Adapt the mission to the current time without pretending every visit is morning.

## Proposed reader-facing experience

### New top module

**Good morning**
**Your Daily Edit**
6 stories · about 5 minutes · 4 new since yesterday

1. Continue: article title · 42%
2. New for Home
3. From a followed brand
4. Trending across Hearst
5. Useful wildcard
6. One visual/video item

Primary action: **Start your edit**
Secondary action: **See why these**

After completion:

**You’re caught up**
Saved 2 stories · followed 1 topic
Next refresh: 6 PM

Below: **Keep exploring** opens the current river.

### Mobile navigation

Keep four persistent destinations:

- For You
- Daily Edit
- Saved
- Profile/Search

Secondary topics can remain horizontally scrollable or live inside the menu. Daily continuity should not be the tenth item in a scrolling category row.

### Saved empty state rewrite

Heading: **Save stories for later**

Body: **Tap Save on any story to build a reading list you can return to.**

Primary action: **Browse For You**

Secondary content: **Good places to start** with three personalized stories.

## Measurement plan

### North-star metric

**Weekly useful sessions**

A useful session includes at least one of:

- 50%+ of a substantive article read.
- A completed Daily Edit.
- A save or collection action.
- A follow or explicit More Like This action.
- A successful resume followed by meaningful reading.

This is better than raw visits or time spent because it measures delivered reader value.

### Supporting metrics

- Daily Edit start rate.
- Daily Edit completion rate.
- Median time to first useful action.
- D1, D7, and D28 return rate.
- Three-useful-days-per-week rate.
- Resume success rate.
- Save-to-revisit rate within 7 days.
- Follow-to-return lift.
- Search success rate.
- Collection revisit rate.
- Digest open-to-useful-session rate.

### Guardrails

- Hides per 100 impressions.
- Repeated-story exposure rate.
- Brand concentration in the first eight items.
- Stale-edition rate.
- Broken-media rate.
- Time to first content.
- Feed error/retry rate.
- Unsubscribe and notification-disable rate.
- Keyboard and screen-reader completion rates.
- Reader trust complaints.

### Core event taxonomy

| Event | Trigger | Important properties | Why |
|---|---|---|---|
| `edition_impression` | Daily Edit is visible | edition_id, daypart, new_count, story_count, estimated_minutes | Establish denominator |
| `edition_start` | Start your edit is activated | edition_id, entry_point, return_days | Measure intent |
| `edition_story_open` | Story opens from Daily Edit | edition_id, position, reason, format, brand, topic | Evaluate selection quality |
| `edition_complete` | Last required item is completed | edition_id, elapsed_seconds, read_count, save_count | Measure ritual completion |
| `story_read_progress` | Reader crosses 25/50/90% | story_id, source, format, session_id | Define meaningful reads |
| `story_resume` | A persisted unfinished story is reopened | story_id, saved_progress, entry_point | Validate continuity |
| `story_save_toggle` | Save state changes | story_id, state, surface, position | Measure investment |
| `more_like_this` | Reader requests similar content | story_id, tags, surface | Measure explicit preference |
| `story_hide` | Reader hides a story | story_id, reason_if_collected, surface | Negative-quality guardrail |
| `follow_toggle` | Topic/brand follow changes | entity_type, entity, state, surface | Measure personalization investment |
| `onboarding_step` | Step shown/completed/skipped | step, selected_count, elapsed_seconds | Find onboarding friction |
| `saved_empty_view` | Empty Saved page appears | active_filters, account_state | Detect dead-end exposure |
| `search_submitted` | Query changes to a meaningful search | normalized_query_length, result_count | Measure discovery demand |
| `search_result_open` | Search result opens | result_position, match_type, query_length | Measure search success |
| `return_session` | Session begins after a prior visit | hours_since_last, new_count, unfinished_count | Measure return value |
| `digest_preference_changed` | Reader opts in/out or changes time | channel, frequency, daypart | Consent and relevance |
| `feed_health` | Edition build/serve completes | edition_id, age_minutes, status, item_count | Protect freshness |

Do not send article text, comment bodies, email addresses, or raw personal identifiers in analytics properties.

## Recommended experiments

1. **Bounded Daily Edit vs. current hero-first feed**
   - Primary: useful sessions per exposed reader.
   - Secondary: D7 return and edition completion.
   - Guardrails: hides, diversity, time to first content.

2. **Real resume card vs. no resume card**
   - Primary: successful resumed reads reaching 50%.
   - Guardrail: false-resume rate must be zero.

3. **Progressive onboarding vs. five-step onboarding**
   - Variant: choose two interests, preview immediately, defer account.
   - Primary: first useful session and onboarding completion.
   - Guardrail: downstream recommendation quality.

4. **Visible recommendation reason**
   - Test “New since yesterday” / “Because you follow Home.”
   - Primary: story open and hide rates.
   - Guardrail: visual clutter and perceived creepiness.

5. **Opt-in digest timing**
   - Ask only after two useful sessions.
   - Primary: digest-driven useful sessions.
   - Guardrails: unsubscribe, notification disable, complaint rate.

## 30-day plan

### Week 1 — Make the habit measurable

- Define useful session and edition completion.
- Add event schema and privacy review.
- Persist last visit, recent reads, article progress, completion, and edition ID.
- Fix the false Continue Reading module immediately.
- Fix the Saved empty state.

### Week 2 — Build the Daily Edit state model

- Generate a stable edition ID by destination, date, and daypart.
- Select a bounded, deduplicated 5–8 story set.
- Preserve state across refreshes and tabs.
- Suppress completed stories and repeat leads.
- Add real “new since last visit” logic.

### Week 3 — Make the habit visible

- Add the Daily Edit above the river on desktop and mobile.
- Show time estimate, new count, reason labels, and progress.
- Add caught-up state and Keep Exploring transition.
- Move stakeholder controls behind a demo-only flag.

### Week 4 — Test before scaling

- Run moderated mobile usability sessions.
- Run keyboard and screen-reader tests.
- Validate edition consistency across refresh, multiple tabs, offline recovery, and stale feeds.
- Launch the Daily Edit experiment to a controlled audience.

## 60–90-day plan

- Connect consent-aware identity and cross-device continuity if the Daily Edit proves useful.
- Add opt-in personalized email or push timing.
- Build collection updates such as “3 new recipes for Weekend Plans.”
- Add editorial tools for pinning/guardrails without bypassing relevance.
- Add feed health monitoring and stale-edition alerts.
- Extract edition state, reading history, telemetry, and Daily Edit components from `home-page.tsx`.
- Establish experimentation holdouts and long-term retention cohorts.

## Required tests for P1 changes

### Real reading history

- Open an article, scroll to 42%, close, refresh, and resume at the same story and approximate position.
- Verify completed stories do not appear as unfinished.
- Verify unknown stories never appear under Continue Reading.
- Verify history is isolated correctly across accounts and signed-out state.
- Verify multiple tabs reconcile without corrupting progress.

### Today’s Picks

- Edition remains stable during one session.
- New edition appears only at the defined refresh boundary.
- Previously completed items do not reappear unless updated.
- Offline state keeps the last valid edition with a clear stale label.
- Feed failure does not erase the prior valid edition.
- Keyboard order follows visible story order.
- Screen readers announce progress and completion once.
- Reduced motion removes nonessential transitions.

### Mobile navigation

- Today’s Picks and Saved are reachable at 320px without horizontal discovery.
- Fixed controls do not cover story actions or text.
- Zoom to 200% and verify reflow.
- Test Safari iOS and Chrome Android with browser chrome expanded/collapsed.

### Saved empty state

- No filters: show save guidance and Browse For You.
- Active filter: explain the filter and offer Clear Filter.
- Signed out: explain browser-local behavior without implying sync.
- API/feed failure: do not mislabel it as empty.

### Carousel accessibility

- Only the active slide is exposed and focusable.
- Auto-rotation pauses on focus and pointer hover.
- Pause state persists while interacting.
- Slide changes are not over-announced.
- Previous/next controls have visible focus and correct disabled state.

## Risks and regression areas

- Persisting progress can create privacy concerns if retention and deletion are unclear.
- Edition stability can conflict with urgent editorial updates; define a safe replacement rule.
- Bounded editions can reduce total page views if the success model rewards volume rather than useful sessions.
- Aggressive “new since last visit” filtering can produce a weak edition for frequent visitors.
- Cross-device identity increases consent, account recovery, and security scope.
- Notifications can damage trust quickly if timing or relevance is wrong.
- Extracting the large page component can regress routing, modal focus, feed pagination, and destination theming; do it incrementally behind tests.

## Conclusions that require more evidence

1. **The ideal edition size is unknown.** Test 5, 8, and 10-item editions with real readers.
2. **Daypart missions are plausible, not validated.** Research whether readers actually want different morning/evening mixes.
3. **Digest demand is unknown.** Do not build push or email before testing willingness and timing.
4. **The right amount of explanation is unknown.** Recommendation reasons may build trust or feel intrusive.
5. **Cross-brand breadth may overwhelm some readers.** Test whether readers prefer a single blended edit or section-specific editions.
6. **A caught-up state may reduce exploration.** Measure whether it improves return without reducing useful depth.
7. **No full WCAG conformance claim is possible from this audit.** The carousel issue needs keyboard and assistive-technology verification.

## Final recommendation

Do not add a streak first.

Build **Your Daily Edit**, real reading continuity, and measurement first. A daily habit should form because Hearst+ reliably saves time and remembers the reader—not because the interface pressures them to maintain a number.
