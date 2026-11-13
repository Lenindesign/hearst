"use client";

import React from "react";
import { Trophy } from "@/components/ui/icons";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getFeaturedCardColors } from "@/lib/brand-banners";
import type { HearstDestinationMode } from "@/lib/hearst-routes";
import type { StoryAward } from "@/lib/story-awards";
import { cn } from "@/lib/utils";
import { BrandSourceIcon } from "./brand-source-icon";
import { getLifestyleByline } from "./story-metadata";
import { LifestyleRiverImage } from "./story-presentation";

/**
 * Award colors are the awarding publication's card colors, the same pair the
 * featured carousel uses (getFeaturedCardColors): the brand color, darkened
 * until white text reaches 5.5:1, or dark text on a light brand color.
 */
function useAwardColors(award: StoryAward, destination: HearstDestinationMode) {
  return React.useMemo(
    () => getFeaturedCardColors(destination, award.awardingBrandSlug),
    [award.awardingBrandSlug, destination],
  );
}

/** Round award seal: publication, year and award name, in the publication's colors. Decorative. */
export function StoryAwardSeal({
  award,
  destination = "autos",
  className,
}: {
  award: StoryAward;
  destination?: HearstDestinationMode;
  className?: string;
}) {
  const colors = useAwardColors(award, destination);
  return (
    <span
      aria-hidden
      data-story-award-seal
      className={cn("grid size-28 shrink-0 place-items-center rounded-full text-center shadow-[var(--hp-shadow-modal)]", className)}
      style={{
        background: colors.foreground,
        color: colors.background,
        boxShadow: `inset 0 0 0 4px ${colors.foreground}, inset 0 0 0 6px ${colors.background}`,
      }}
    >
      <span className="px-4">
        <span className="type-k1 block text-[0.625rem] tracking-[0.06em]">{award.awardingBrand}</span>
        <span className="headline block text-[1.75rem] leading-8 sm:text-[2rem] sm:leading-9">{award.year}</span>
        <span className="type-k1 block text-[0.625rem] leading-3 tracking-[0.06em]">{award.name}</span>
      </span>
    </span>
  );
}

/** Small award label for the winning story's standard cards (photo, top left). */
export function StoryAwardRibbon({
  award,
  destination = "autos",
  className,
}: {
  award: StoryAward;
  destination?: HearstDestinationMode;
  className?: string;
}) {
  const colors = useAwardColors(award, destination);
  return (
    <span
      data-story-award-ribbon
      className={cn("pointer-events-none inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 type-k1 shadow-[var(--hp-shadow-card)]", className)}
      style={{ background: colors.background, color: colors.foreground }}
    >
      <Trophy aria-hidden weight="fill" className="size-3.5 shrink-0" />
      {award.year} {award.name}
    </span>
  );
}

/**
 * Award announcement card (APP_RULES.md › Award announcements): a full-width
 * river card that opens the river while the award is active. The photo carries
 * the seal; the panel in the publication's colors carries the award eyebrow,
 * headline, deck, byline and the CTA. The whole card opens the winning story;
 * a related story from the award package is its own link.
 */
export function StoryAwardCard({
  award,
  story,
  relatedStories = [],
  destination = "autos",
  onOpenStory,
}: {
  award: StoryAward;
  story: LifestyleRiverStory;
  relatedStories?: LifestyleRiverStory[];
  destination?: HearstDestinationMode;
  onOpenStory: (storyId: string) => void;
}) {
  const colors = useAwardColors(award, destination);
  const headingId = `story-award-${award.id}`;
  const related = relatedStories[0];

  return (
    <section
      aria-labelledby={headingId}
      data-story-module="award"
      data-story-id={story.id}
      className="group/award @container/story-award relative min-w-0 overflow-hidden rounded-card shadow-[var(--hp-shadow-card)]"
      style={{ background: colors.background, color: colors.foreground }}
    >
      <button
        type="button"
        onClick={() => onOpenStory(story.id)}
        className="absolute inset-0 z-10 rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        aria-label={`Open story: ${story.title}`}
      />
      <div className="grid @min-[720px]/story-award:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="relative aspect-[3/2] min-w-0 overflow-hidden @min-[720px]/story-award:aspect-auto @min-[720px]/story-award:min-h-[25rem]">
          <LifestyleRiverImage
            story={story}
            alt=""
            sizes="(max-width: 768px) 100vw, 520px"
            className="absolute inset-0 h-full w-full transition-transform duration-250 ease-out group-hover/award:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/award:scale-100"
          />
          {/* A photo that already shows the publication's award mark gets no second seal. */}
          {award.photoCarriesMark ? null : (
            <StoryAwardSeal award={award} destination={destination} className="absolute left-4 top-4 sm:left-5 sm:top-5" />
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6 lg:p-8">
          <p className="type-k1 flex items-center gap-2">
            <Trophy aria-hidden weight="fill" className="size-4 shrink-0" />
            {award.awardingBrand} {award.year} {award.name}
          </p>
          <h2 id={headingId} className="type-t2 headline mt-3 line-clamp-4 underline-offset-4 group-hover/award:underline group-focus-within/award:underline">
            {story.title}
          </h2>
          <p className="type-d2 mt-2 line-clamp-3 opacity-90">{story.summary}</p>
          <p className="type-m1 mt-4 flex items-center gap-2 opacity-90">
            <BrandSourceIcon brand={story.brand} brandSlug={story.brandSlug} />
            <span>{getLifestyleByline(story)} · {story.readTime}</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            {/* The whole card is the link; this is its visible label. */}
            <span
              aria-hidden
              className="inline-flex min-h-11 items-center rounded-[var(--component-button-radius-default,4px)] px-5 text-sm font-semibold"
              style={{ background: colors.foreground, color: colors.background }}
            >
              Read why it won
            </span>
            {related ? (
              <button
                type="button"
                onClick={() => onOpenStory(related.id)}
                className="relative z-20 inline-flex min-h-11 max-w-full items-center text-left text-sm font-semibold underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="line-clamp-2">Also: {related.title}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
