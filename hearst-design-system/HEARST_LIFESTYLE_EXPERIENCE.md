---
status: historical
superseded_by:
  - VAULT_HOME.md
  - APP_RULES.md
---

# Hearst Lifestyle Experience POC

> [!warning] Historical POC reference
> This note records an earlier prototype state. Routes, card behavior, and product rules in this file may be outdated. Use `VAULT_HOME.md` and its canonical references for current implementation decisions.

## Purpose

Hearst Lifestyle is a destination homepage prototype for lifestyle discovery across Hearst brands. The POC demonstrates how an editorial river can feel personal, current, and habit-forming without building production personalization infrastructure yet.

The experience combines:

- Real Hearst lifestyle RSS metadata and real Hearst CDN images.
- A cross-brand story river across Cosmopolitan, Country Living, Delish, Good Housekeeping, House Beautiful, The Pioneer Woman, Prevention, Redbook, Seventeen, and Woman's Day.
- Local React state that simulates reader behavior.
- A deterministic ranking model that can be explained in the UI.
- A reader modal with lazy-loaded story continuation and contextual recommendations.
- A demo personalization layer that shows how the feed changes through the day.

## How To Run

From the design-system workspace:

```bash
cd /Users/leninaviles/Projects/hearst/hearst-design-system
npm run dev
```

Open:

```text
http://localhost:3000/hearst-edit/
```

Storybook version:

```bash
npm run storybook
```

Open:

```text
http://localhost:6006/?path=/story/templates-home-page--default&globals=brand:hearst-lifestyle
```

Production POC:

```text
https://hearst-design-system.netlify.app/hearst-edit/
```

## Core Experience

The homepage is organized around a personalized popular river:

- Top utility/nav with the Hearst Lifestyle logo.
- Active navigation filters for topic sections.
- Today's Edit module that summarizes what changed since the reader last visited.
- Floating Personalization Demo console for stakeholder walkthroughs.
- Left rail with daily edit, brand filters, followed topics, and collections.
- Center river with five card formats.
- Right rail with trending stories, data source notes, and the personalization explanation.
- Story reader modal with lazy-loading next stories.

## Card System

The river uses one atomic card structure with five content modules:

- Article: editorial read signal.
- Gallery: photo count and visual story framing.
- Video: 16:9 inline player treatment with play state.
- Recipe: prep time, servings, and difficulty.
- Shopping: editor-pick count and lab/service signal.

The card type is derived from story topic, title, and tags. This keeps the POC flexible while using one normalized story shape.

## Story Data

Stories come from `src/components/lifestyle-river-data.ts`.

Each story uses:

- `id`
- `brand`
- `brandSlug`
- `topic`
- `title`
- `summary`
- `image`
- `readTime`
- `popularity`
- `signal`
- `tags`
- `age`
- `publishedAt`
- `sourceUrl`

The import is intentionally static for this phase. It supports a shareable POC without requiring authentication, tracking, backend services, or live feed dependency during demos.

The demo console can also switch to a next-day edition. In this mode, the POC derives a refreshed story pool from the same imported source by rotating the available stories, refreshing their age, shifting popularity signals, and penalizing the previous lead story so the top story changes. This is deterministic and local, but it lets stakeholders see how a return visit could feel like a new daily edition.

## Personalization Model

The POC ranking is deterministic and local. It is not a production recommendation engine.

The score is built from visible signals:

- Popularity: the story's existing popularity value.
- Followed topic: lift when the story topic matches the reader profile.
- Followed brand: lift when the story comes from a followed brand.
- Saved tag: lift when story tags match saved interests.
- More-like-this: stronger lift when a user asks for more stories like something.
- Saved story: smaller lift for stories already saved.
- Recency: fresh stories receive a freshness boost.
- Return-visit freshness: stories fresh since the simulated last visit receive another boost.
- Time of day: daypart-specific topics, formats, and tags receive a contextual lift.
- Hidden story: hidden stories are removed from the ranked pool.
- Diversity: after scoring, the river avoids more than two consecutive stories from the same brand or topic.

## Demo Dayparts

The demo has four daypart scenarios:

- Morning Brief, 8 AM: service, food, home, wellness, recipes, and fresh daily utility.
- Afternoon Momentum, 1 PM: shopping, style, entertainment, galleries, videos, and stories gaining popularity.
- Evening Return, 6 PM: dinner, home, continue-reading, saved signals, and relaxed browsing.
- Late Night Wind Down, 10 PM: wellness, style, relationships, beauty, and save-for-later behavior.

Changing the daypart re-ranks the same story pool so stakeholders can see how the destination changes across the day.

## Behavior Presets

The demo panel includes three behavior presets:

- Home cook: follows food/home brands and boosts dinner, cookout, recipe, and decorating signals.
- Shops picks: follows shopping/style brands and boosts products, editor picks, beauty, and style signals.
- Wellness: follows wellness-adjacent brands and boosts sleep, health, wellness, and beauty signals.

These presets simulate a reader's behavior without persistence or tracking.

## Return Visit Demo

The "Return visit" controls simulate a user coming back later:

- +4 hours: shifts to afternoon context.
- Evening return: shifts to dinner/home context.
- Late night: shifts to wind-down content.
- Next day: loads a refreshed story pool first, then applies the morning daypart ranking rules.

When a return visit is simulated, the model lifts stories that are fresh since the last session and relevant to the new moment.

## Explanation UX

Every card shows:

- A reason chip, such as "Because you saved dinner ideas" or "New from Good Housekeeping."
- A total score.

The floating demo console shows the current top story's score breakdown:

- Popularity
- Recency
- Behavior
- Daypart
- Total score

The right rail explains the current river state:

- Demo moment
- Followed topics
- Followed brands
- Active brand filters
- Saved signals

This is meant to make personalization explainable for stakeholders.

## Reader Modal

Clicking a story opens a modal reader. The modal:

- Shows the selected story.
- Lazy-loads the next ranked stories as the reader scrolls.
- Uses a 16:9 image/video treatment.
- Adds a contextual recommendation rail on wide screens.
- Keeps a right-side 300 x 600 sponsored module for monetization context.

The contextual rail is based on:

- Same topic
- Same brand
- Shared tags and intent
- Current story format

## Stakeholder Demo Script

1. Open `http://localhost:3000/hearst-edit/`.
2. Start in Morning Brief and point to Today's Edit.
3. Click the lower-right controls icon to open the stakeholder demo console.
4. Show the first story's score breakdown in the console.
5. Click "Home cook" and show how food/home stories move up.
6. Click "Evening return" and show how dinner and home intent becomes stronger.
7. Click "Next day" to show a refreshed edition, then change the daypart to show the same next-day pool re-ranked by time of day.
8. Save a story or click "More like this" on a card.
9. Point to the reason chips changing on the cards.
10. Open a story and show the lazy-loading modal reader.
11. On a wide screen, show the contextual recommendation rail inside the modal.
12. Use Reset demo to return to the baseline story river.

## Current Implementation Files

- `src/components/home-page.tsx`: Hearst Lifestyle homepage, ranking, demo state, card rendering, modal reader.
- `src/components/lifestyle-river-data.ts`: imported story data and source notes.
- `src/components/lifestyle-river-types.ts`: normalized story/profile types.
- `src/app/hearst-edit/page.tsx`: app route for the standalone POC.
- `src/components/theme-provider.tsx`: brand theme support.
- `src/components/brand-logo.tsx`: logo rendering.

## Phase 1 Constraints

This POC intentionally does not include:

- Real user identity.
- Authentication.
- Persistent tracking.
- Backend recommendations.
- Live ad serving.
- API/database integration.

All behavior is local React state. This keeps the prototype safe to demo while making the desired product behavior tangible.

## Next Production Questions

Before moving beyond POC, the team should define:

- Which behavioral events are allowed to influence ranking.
- How much editorial control is required over the algorithm.
- How to balance brand priority against personalization.
- Which explanations are user-facing versus internal-only.
- What privacy and consent requirements apply.
- Which modules are monetizable and where ads or commerce modules should appear.
- Whether the destination should be a logged-out habit experience, logged-in membership feature, or both.
