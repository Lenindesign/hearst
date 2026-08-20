"use client";

import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getCommunityGroupsForBrand } from "@/lib/community-groups";
import { BrandSourceIcon } from "./brand-source-icon";
import { CommunityJoinedGroupsCard } from "./community-joined-groups-card";
import { getLifestyleContextStories } from "./content-reader-model";
import {
  getLifestyleCardKind,
  getLifestyleKindLabel,
} from "./story-presentation";

export type ContentReaderContextRailProps = {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  onOpenStory: (storyId: string) => void;
};

function ReaderCommunityModule({
  brand,
  brandSlug,
}: Pick<LifestyleRiverStory, "brand" | "brandSlug">) {
  const groups = getCommunityGroupsForBrand(brandSlug).map((group) => ({
    brand,
    brandSlug: group.brandSlug,
    groupSlug: group.groupSlug,
    name: group.name,
    members: group.members,
  }));

  return <CommunityJoinedGroupsCard groups={groups} />;
}

export function ContentReaderContextRail({
  currentStory,
  stories,
  onOpenStory,
}: ContentReaderContextRailProps) {
  const recommendations = getLifestyleContextStories(currentStory, stories);
  const modules = [
    {
      label: "Trending",
      description: `More ${currentStory.topic.toLowerCase()} picks with similar reader intent.`,
      stories: recommendations.sharedIntent,
    },
  ].filter((module) => module.stories.length > 0);

  return (
    <aside
      className="hidden xl:block"
      aria-label="Contextual story recommendations"
    >
      <div className="sticky top-32 max-h-[calc(100dvh-10rem)] space-y-4 overflow-y-auto overscroll-contain pb-12 pr-1">
        {modules.map((module) => (
          <React.Fragment key={module.label}>
            <div className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
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
                      {getLifestyleKindLabel(
                        getLifestyleCardKind(story),
                        story,
                      )}
                    </span>
                    <span className="mt-1 block text-sm font-bold leading-5 group-hover:text-primary">
                      {story.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
        <ReaderCommunityModule
          brand={currentStory.brand}
          brandSlug={currentStory.brandSlug}
        />
      </div>
    </aside>
  );
}
