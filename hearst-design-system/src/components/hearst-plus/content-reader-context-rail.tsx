"use client";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { BrandSourceIcon } from "./brand-source-icon";
import { getLifestyleContextStories } from "./content-reader-model";
import {
  getLifestyleCardKind,
  getLifestyleKindLabel,
} from "./story-presentation";
import { getLifestyleByline } from "./story-metadata";

export type ContentReaderContextRailProps = {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  onOpenStory: (storyId: string) => void;
};

export function ContentReaderContextRail({
  currentStory,
  stories,
  onOpenStory,
}: ContentReaderContextRailProps) {
  const recommendations = getLifestyleContextStories(currentStory, stories);
  const kind = getLifestyleCardKind(currentStory);
  const intentLabel = {
    article: "Read next",
    gallery: "Visual ideas",
    video: "Watch next",
    recipe: "Cook next",
    shopping: "Shop the edit",
  }[kind];

  const modules = [
    {
      label: intentLabel,
      description: `More ${currentStory.topic.toLowerCase()} picks with similar reader intent.`,
      stories: recommendations.sharedIntent,
    },
    {
      label: `More from ${currentStory.brand}`,
      description: "Keep the session inside the same trusted brand voice.",
      stories: recommendations.sameBrand,
    },
    {
      label: `${currentStory.topic} signal`,
      description: "Related stories gaining momentum in this topic.",
      stories: recommendations.sameTopic,
    },
  ].filter((module) => module.stories.length > 0);

  return (
    <aside
      className="hidden xl:block"
      aria-label="Contextual story recommendations"
    >
      <div className="sticky top-32 max-h-[calc(100dvh-10rem)] space-y-4 overflow-y-auto overscroll-contain pb-12 pr-1">
        {modules.map((module) => (
          <div
            key={module.label}
            className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
          >
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              {module.label}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {module.description}
            </p>
            <div className="mt-4 space-y-3">
              {module.stories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => onOpenStory(story.id)}
                  aria-label={`Open contextual story: ${story.title}`}
                  className="group w-full border-t border-border pt-3 text-left first:border-t-0 first:pt-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <span className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                    <BrandSourceIcon
                      brand={story.brand}
                      brandSlug={story.brandSlug}
                    />
                    {getLifestyleKindLabel(getLifestyleCardKind(story), story)}
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-5 group-hover:text-primary">
                    {story.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {story.brand} · {getLifestyleByline(story)} · Popularity{" "}
                    {story.popularity}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-4 shadow-[var(--hp-shadow-card)]">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Reader Intent
          </p>
          <p className="mt-3 text-sm font-bold leading-5">
            {currentStory.topic}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recommendations.intentTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-2 py-1 text-[length:var(--text-token-4xs)] font-semibold text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
