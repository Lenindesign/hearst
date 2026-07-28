"use client";

import type { LiveArticleData } from "@/lib/live-feed-types";
import { getHearstBrandRoute } from "@/lib/hearst-routes";
import { cn } from "@/lib/utils";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";

export function getLifestyleByline(
  story: LifestyleRiverStory,
  article?: LiveArticleData
) {
  return article?.byline || story.byline || `${story.brand} editors`;
}

export function LifestyleBrandSource({
  story,
}: {
  story: LifestyleRiverStory;
}) {
  const byline = getLifestyleByline(story);

  return (
    <a
      href={getHearstBrandRoute(story.brandSlug)}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      className="relative z-20 inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-[4px] text-[length:var(--text-token-4xs)] text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:min-h-0"
      aria-label={`Open ${story.brand} brand page`}
    >
      <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
      <span className="min-w-0 truncate">
        {story.brand} · {story.topic} · {byline}
      </span>
    </a>
  );
}

export function LiveStoryBadge({
  story,
  className,
}: {
  story: LifestyleRiverStory;
  className?: string;
}) {
  if (!story.id.startsWith("live-")) return null;

  return (
    <span className="inline-flex shrink-0 items-center" title="Current feed story">
      <span
        className={cn(
          "block h-1.5 w-1.5 rounded-full bg-[var(--palette-alert-success-600)] ring-1 ring-white",
          className
        )}
        aria-hidden="true"
      />
      <span className="sr-only">Current feed story</span>
    </span>
  );
}

export function LifestyleRecommendationReason({
  reason,
}: {
  reason?: string;
}) {
  if (!reason) return null;

  return (
    <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
      {reason}
    </p>
  );
}
