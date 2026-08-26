# Technical Environment: Single-Brand Destinations — Hearst+ Platform

> **Brownfield project.** The existing stack is the baseline. New code must fit
> into the established patterns. Where a choice is not listed below, follow the
> existing codebase — do not introduce new patterns without justification.

---

## Existing Stack (must be preserved)

| Layer              | Current Technology            | Version   | Notes                                                                             |
| ------------------ | ----------------------------- | --------- | --------------------------------------------------------------------------------- |
| Language           | TypeScript                    | 5.x       | Strict mode (`strict: true`, target ES2017). Do not introduce JavaScript files.   |
| Framework          | Next.js (App Router)          | 16.1.6    | RSC-first. Route handlers under `src/app/api/*`. Do not add another framework.    |
| UI library         | React                         | 19.2.3    |                                                                                   |
| Styling            | Tailwind CSS                  | v4        | Token-backed CSS variables. No CSS-in-JS.                                          |
| Design tokens      | Style Dictionary              | 5.x       | Source of brand theming. `tokens:audit:ci` gate. Do not bypass.                   |
| Component workshop | Storybook                     | 8.6.x     | Published alongside the app; also the test harness.                               |
| Hosting            | Netlify                       | —         | Next via `@netlify/plugin-nextjs`. Persistence via Netlify Blobs. Not AWS.        |
| Runtime            | Node.js                       | 22 (CI)   | No `engines` field pinned in `package.json`.                                      |
| Test frameworks    | Vitest + Playwright           | 3.2.x     | Storybook stories run in Chromium via the Vitest browser project.                 |
| Icons              | @phosphor-icons/react         | 2.x       | Use `/dist/ssr` entry in server components.                                       |

---

## What to Add (new for this module)

- `src/templates/single-brand-feed.ts` — a thin adapter: `SINGLE_BRANDS`,
  `getSingleBrandLiveFeed(slug)` (filters `lifestyleRiverStories` to one brand and
  returns a `LiveFeedData`), and `getSingleBrandMasthead(slug)`.
- `src/app/single-brand/page.tsx`, `src/app/single-brand/[brandSlug]/page.tsx`, and
  `src/app/single-brand/[brandSlug]/article/[storyId]/page.tsx` — the new routes.
- One **additive** prop on the existing `HomePageTemplate`:
  `forceDestinationRiver?: boolean` (default `false`), OR-ed into the internal
  `isDestinationRiver` check so a single brand can render the river-with-reader
  layout. This is the only edit to `home-page.tsx` and changes no existing behavior.

---

## What to Keep Unchanged

- `src/components/home-page.tsx` — only the additive `forceDestinationRiver` prop was
  added. Do not refactor this file or change its default (river layout stays gated to
  destination slugs unless the prop is passed). Reuse the template; do not fork it.
- `personalize-live-feed.ts`, the `api/*` route handlers, and `LiveFeedData` — consume
  as-is; do not change the feed schema.
- The token pipeline (`tokens/`, `style-dictionary.config.mjs`, `tokens:audit:ci`) —
  additive tokens only.
- `src/components/ui/` primitives, `ThemeProvider`, and the built-in story reader
  (`LifestyleStoryReaderModal`) — reuse, do not modify.
- `netlify.toml`, Storybook build config, and existing routes (`/hearst-plus`,
  `/read/*`, brand pages).

---

## What to Remove / Not Introduce

| Prohibited                              | Reason                                                                 | Use Instead                                                        |
| --------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| A new/custom single-brand layout        | The product decision is to reuse the Hearst+ template, not rebuild it. | `HomePageTemplate` with `forceDestinationRiver` + single-brand feed |
| Forking or copying `home-page.tsx`      | Divergence from the real template; double maintenance.                 | The additive `forceDestinationRiver` prop                          |
| A second component library / CSS-in-JS  | Fragments the design system; conflicts with Tailwind v4 + tokens.      | `src/components/ui/` + Tailwind + token CSS vars                   |
| Hardcoded hex colors / inline styles    | Bypasses the token pipeline this repo exists to enforce.               | Brand tokens via `ThemeProvider` / `brandToCssVars`                |
| A new state library (Redux/Zustand)     | Not warranted; template manages its own state.                         | The template's existing React state                                |
| A parallel story/article type           | `LifestyleRiverStory` already models the story.                        | `LifestyleRiverStory` from `lifestyle-river-types`                 |

---

## Security Basics

- Authentication: reuse the existing optional Google Sign-In (`api/auth/google`,
  server-side ID-token verification). Do not build a new auth layer for single-brand.
- Secrets: server-only keys (`PERSONALIZE_API_KEY`, `GOOGLE_CLIENT_ID`) stay in
  Netlify env; never expose them to the client. Only `NEXT_PUBLIC_*` are public.
- Input validation: `brandSlug` and `storyId` route params are validated against the
  known single-brand set / feed before rendering (`notFound()` otherwise).
- Injection / SSRF: images render via `next/image` against hosts already pinned in
  `next.config.ts remotePatterns`; do not fetch arbitrary URLs from feed content.
- PII: do not log reader identifiers or profile fields.

---

## Example Code Patterns

Follow these patterns from this module. Do not invent alternatives.

**The single-brand feed adapter (`src/templates/single-brand-feed.ts`):**

```typescript
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { getBrandLogoSrc, getBrandLogoLabel } from "@/lib/logos";
import type { LiveFeedData } from "@/lib/live-feed-types";

export const SINGLE_BRANDS = [
  { slug: "delish", name: "Delish" },
  { slug: "cosmopolitan", name: "Cosmopolitan" },
  { slug: "redbook", name: "Redbook" },
] as const;

export function getSingleBrandLiveFeed(slug: string): LiveFeedData {
  const stories = lifestyleRiverStories.filter((s) => s.brandSlug === slug);
  const brandName = SINGLE_BRANDS.find((b) => b.slug === slug)?.name ?? slug;
  return {
    stories,
    sourceNotes: [{ brand: brandName, brandSlug: slug, feedCount: 1, importedCount: stories.length, selectedCount: stories.length }],
    dataSourceCopy: `${brandName} RSS metadata.`,
    fetchedAt: new Date().toISOString(),
    isFallback: false,
    productName: `${brandName} Live`,
  };
}

export function getSingleBrandMasthead(slug: string): { src: string; label: string } | null {
  const src = getBrandLogoSrc(slug);
  return src ? { src, label: getBrandLogoLabel(slug) ?? slug } : null;
}
```

**The single-brand home route (`src/app/single-brand/[brandSlug]/page.tsx`):**

```tsx
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SINGLE_BRANDS.map(({ slug }) => ({ brandSlug: slug }));
}

export default async function SingleBrandHomePage({ params }: PageProps) {
  const { brandSlug } = await params;
  if (!isSingleBrand(brandSlug)) notFound();
  return (
    <ThemeProvider defaultBrandSlug={brandSlug} persistColorMode={false}>
      <HomePageTemplate
        initialBrandSlug={brandSlug}
        liveFeedData={getSingleBrandLiveFeed(brandSlug)}
        liveFeedMode="replace"
        mastheadLogoOverride={getSingleBrandMasthead(brandSlug)}
        staticDestinationData={getHearstDestinationStaticData()}
        forceDestinationRiver
      />
    </ThemeProvider>
  );
}
```

**The additive prop in `home-page.tsx` (the only edit to the shared template):**

```tsx
// Props: forceDestinationRiver?: boolean  (default false — existing callers unaffected)
const isDestinationRiver =
  forceDestinationRiver ||
  brand.slug === "hearst-all" ||
  brand.slug === "hearst-lifestyle" ||
  brand.slug === "hearst-plus" ||
  brand.slug === "hearst-flux" ||
  brand.slug === "hearst-ew";
```

**The article deep-link route** opens the built-in modal reader on load by passing
`initialOpenStoryId={storyId}` and `readerReturnHref={/single-brand/${brandSlug}}`
to the same `HomePageTemplate` (with `forceDestinationRiver`).
