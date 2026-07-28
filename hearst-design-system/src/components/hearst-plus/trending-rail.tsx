"use client";

import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getLifestyleByline } from "@/components/hearst-plus/story-metadata";
import { VideoRailCard } from "@/components/hearst-plus/video-cards";
import { cn } from "@/lib/utils";

type TrendingRailProps = {
  stories: LifestyleRiverStory[];
  onOpenStory: (story: LifestyleRiverStory) => void;
  className?: string;
};

export function TrendingStoryRail({
  stories,
  onOpenStory,
  className,
  title = "Trending Across Brands",
}: TrendingRailProps & {
  title?: string;
}) {
  const titleId = React.useId();

  if (stories.length === 0) return null;

  return (
    <section
      className={cn(
        "rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]",
        className,
      )}
      aria-labelledby={titleId}
      data-story-module="trending"
    >
      <h2
        id={titleId}
        className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-section-title)]"
      >
        {title}
      </h2>
      <ol className="mt-4 space-y-3">
        {stories.map((story, index) => (
          <li key={story.id}>
            <button
              type="button"
              onClick={() => onOpenStory(story)}
              data-story-id={story.id}
              className="group grid min-h-11 w-full grid-cols-[28px_minmax(0,1fr)] items-center gap-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label={`Open story: ${story.title}`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold leading-none text-primary-foreground">
                {index + 1}
              </span>
              <span>
                <span className="block font-bold leading-snug group-hover:text-primary group-focus-visible:text-primary">
                  {story.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {story.brand} · {story.topic} · {getLifestyleByline(story)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TrendingVideoRail({
  stories,
  onOpenStory,
  className,
  title = "Trending videos",
}: TrendingRailProps & {
  title?: string;
}) {
  const titleId = React.useId();

  if (stories.length === 0) return null;

  return (
    <section
      className={cn(
        "rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]",
        className,
      )}
      aria-labelledby={titleId}
      data-story-module="trending-videos"
    >
      <h2
        id={titleId}
        className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]"
      >
        {title}
      </h2>
      <ol className="mt-4 space-y-4">
        {stories.map((story, index) => (
          <li key={story.id}>
            <VideoRailCard
              story={story}
              onOpen={() => onOpenStory(story)}
              rank={index + 1}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
