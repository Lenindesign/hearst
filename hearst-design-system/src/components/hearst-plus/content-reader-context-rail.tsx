"use client";

import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getCommunityGroupsForBrand } from "@/lib/community-groups";
import { CommunityJoinedGroupsCard } from "./community-joined-groups-card";
import { getLifestyleContextStories } from "./content-reader-model";
import { TrendingStoryRail } from "./trending-rail";

export type ContentReaderContextRailProps = {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  onOpenStory: (storyId: string) => void;
};

function ReaderCommunityModule({
  brand,
  brandSlug,
}: Pick<LifestyleRiverStory, "brand" | "brandSlug">) {
  const configuredGroups = getCommunityGroupsForBrand(brandSlug);
  const groups = (configuredGroups.length > 0 ? configuredGroups : [{
    brandSlug,
    groupSlug: `${brandSlug}-community`,
    name: `${brand} group`,
    members: "",
  }]).map((group) => ({
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

  return (
    <aside
      className="hidden xl:block"
      aria-label="Contextual story recommendations"
    >
      <div className="sticky top-32 max-h-[calc(100dvh-10rem)] space-y-4 overflow-y-auto overscroll-contain pb-12 pr-1">
        {recommendations.sharedIntent.length > 0 ? (
          <TrendingStoryRail
            stories={recommendations.sharedIntent.slice(0, 3)}
            onOpenStory={(story) => onOpenStory(story.id)}
            title="Trending"
          />
        ) : null}
        <ReaderCommunityModule
          brand={currentStory.brand}
          brandSlug={currentStory.brandSlug}
        />
      </div>
    </aside>
  );
}
