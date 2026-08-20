"use client";

import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { LifestyleRiverImage } from "@/components/hearst-plus/story-presentation";
import { VideoRailCard } from "@/components/hearst-plus/video-cards";
import { getLifestyleByline } from "@/components/hearst-plus/story-metadata";
import { getLifestyleCardKind, getLifestyleKindLabel } from "@/components/hearst-plus/story-presentation";
import { cn } from "@/lib/utils";

type TrendingRailProps = {
  stories: LifestyleRiverStory[];
  onOpenStory: (story: LifestyleRiverStory) => void;
  className?: string;
  variant?: "default" | "contextual";
};

export function TrendingStoryRail({
  stories,
  onOpenStory,
  className,
  variant = "default",
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
      {variant === "contextual" ? (
        <>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            More picks with similar reader intent.
          </p>
          <div className="mt-4 space-y-3">
            {stories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => onOpenStory(story)}
                aria-label={`Open trending story: ${story.title}`}
                className="group w-full border-t border-border pt-3 text-left first:border-t-0 first:pt-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <span className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                  <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
                  {getLifestyleKindLabel(getLifestyleCardKind(story), story)}
                </span>
                <span className="mt-1 block text-sm font-bold leading-5 group-hover:text-primary group-focus-visible:text-primary">
                  {story.title}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {story.brand} · {getLifestyleByline(story)} · Popularity {story.popularity}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
      <ol className="-mb-3 mt-3 divide-y divide-border/70">
        {stories.map((story, index) => (
          <li key={story.id}>
            <button
              type="button"
              onClick={() => onOpenStory(story)}
              data-story-id={story.id}
              className="group grid min-h-20 w-full grid-cols-[56px_minmax(0,1fr)] items-start gap-3 rounded-[6px] py-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label={`Open story: ${story.title}`}
            >
              <span className="relative block h-14 w-14 overflow-hidden rounded-[6px] border border-border bg-muted">
                <LifestyleRiverImage
                  story={story}
                  alt=""
                  className="h-full w-full transition-transform duration-200 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
                <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--hp-surface)] text-[11px] font-bold leading-none text-primary ring-1 ring-border">
                  <span className="translate-y-px tabular-nums leading-none">
                    {index + 1}
                  </span>
                </span>
              </span>
              <span className="min-w-0">
                <span className="line-clamp-3 block font-bold leading-snug group-hover:text-primary group-focus-visible:text-primary">
                  {story.title}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <BrandSourceIcon
                    brand={story.brand}
                    brandSlug={story.brandSlug}
                    className="h-3.5 w-3.5"
                  />
                  <span>{story.brand}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      )}
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
