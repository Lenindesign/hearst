"use client";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { BrandSourceIcon } from "./brand-source-icon";
import { getLifestyleArticleRecommendations } from "./content-reader-model";
import {
  getLifestyleCardKind,
  getLifestyleKindLabel,
  LifestyleRiverImage,
} from "./story-presentation";
import { getLifestyleByline } from "./story-metadata";

export type ContentReaderRecommendationsProps = {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  onOpenStory: (storyId: string) => void;
};

export function ContentReaderRecommendations({
  currentStory,
  stories,
  onOpenStory,
}: ContentReaderRecommendationsProps) {
  const recommendations = getLifestyleArticleRecommendations(currentStory, stories);
  const [featuredStory, ...secondaryStories] = recommendations;

  if (!featuredStory) return null;

  return (
    <section
      className="mt-8 border-t border-border py-6"
      aria-label="Recommended For You"
    >
      <div className="mb-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          Recommended For You
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
        <button
          type="button"
          onClick={() => onOpenStory(featuredStory.id)}
          aria-label={`Open related story: ${featuredStory.title}`}
          className="group min-w-0 self-start text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <LifestyleRiverImage
            story={featuredStory}
            className="aspect-[4/3] w-full rounded-[8px]"
          />
          <span className="mt-4 flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            <BrandSourceIcon
              brand={featuredStory.brand}
              brandSlug={featuredStory.brandSlug}
            />
            {featuredStory.brand}
          </span>
          <span className="mt-2 block font-brand-secondary text-2xl font-bold leading-tight text-foreground group-hover:text-primary">
            {featuredStory.title}
          </span>
          <span className="mt-2 line-clamp-3 [display:-webkit-box] text-sm leading-6 text-muted-foreground">
            {featuredStory.summary}
          </span>
        </button>

        <div className="divide-y divide-border">
          {secondaryStories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => onOpenStory(story.id)}
              aria-label={`Open related story: ${story.title}`}
              className="group grid min-h-11 w-full grid-cols-[96px_minmax(0,1fr)] gap-4 py-4 text-left first:pt-0 last:pb-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:grid-cols-[128px_minmax(0,1fr)]"
            >
              <LifestyleRiverImage
                story={story}
                className="aspect-square w-full rounded-[8px]"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                  <BrandSourceIcon
                    brand={story.brand}
                    brandSlug={story.brandSlug}
                  />
                  {getLifestyleKindLabel(getLifestyleCardKind(story), story)}
                </span>
                <span className="mt-1 block text-base font-bold leading-snug text-foreground group-hover:text-primary">
                  {story.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {story.brand} · {story.topic} · {getLifestyleByline(story)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
