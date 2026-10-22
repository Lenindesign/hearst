"use client";

import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getCommunityGroupsForBrand,
} from "@/lib/community-groups";
import { CommunityJoinedGroupsCard } from "./community-joined-groups-card";
import { Heart } from "@/components/ui/icons";
import { getLifestyleContextStories } from "./content-reader-model";
import { DiscoverySidebarCard } from "./discovery-sidebar";
import { TrendingStoryRail } from "./trending-rail";

export type ContentReaderContextRailProps = {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  savedStories: LifestyleRiverStory[];
  savedIds: string[];
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
  savedStories: savedStoryInventory,
  savedIds,
  onOpenStory,
}: ContentReaderContextRailProps) {
  const recommendations = getLifestyleContextStories(currentStory, stories);
  const visibleSavedStories = savedStoryInventory
    .filter((story) => savedIds.includes(story.id))
    .slice(0, 3);
  const savedItemsModule = visibleSavedStories.length > 0 ? (
    <TrendingStoryRail
      stories={visibleSavedStories}
      onOpenStory={(story) => onOpenStory(story.id)}
      title="Saved items"
      titleIcon={<Heart className="h-4 w-4 shrink-0" aria-hidden />}
    />
  ) : (
    <DiscoverySidebarCard
      title="Saved items"
      summary="Your saved stories"
      titleIcon={<Heart className="h-4 w-4 shrink-0" aria-hidden />}
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Save stories as you browse and they will appear here.
      </p>
    </DiscoverySidebarCard>
  );

  return (
    <aside
      className="hidden xl:block"
      aria-label="Contextual story recommendations"
    >
      <div className="sticky top-32 max-h-[calc(100dvh-10rem)] space-y-4 overflow-y-auto overscroll-contain pb-12 pr-1">
        {recommendations.sharedIntent.length > 0 ? (
          <TrendingStoryRail
            stories={recommendations.sharedIntent}
            onOpenStory={(story) => onOpenStory(story.id)}
            title="Trending"
          />
        ) : null}
        {savedItemsModule}
        <ReaderCommunityModule
          brand={currentStory.brand}
          brandSlug={currentStory.brandSlug}
        />
      </div>
    </aside>
  );
}
