"use client";

import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getCommunityGroupsForBrand,
} from "@/lib/community-groups";
import { CommunityJoinedGroupsCard } from "./community-joined-groups-card";
import { getLifestyleContextStories } from "./content-reader-model";
import { SavedItemsModule } from "./saved-items-module";
import { TrendingStoryRail } from "./trending-rail";

export type ContentReaderContextRailProps = {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  savedStories: LifestyleRiverStory[];
  savedIds: string[];
  onOpenStory: (storyId: string) => void;
  /** Saves a suggested story from the Saved Items empty state. */
  onSaveStory?: (story: LifestyleRiverStory) => void;
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
  onSaveStory,
}: ContentReaderContextRailProps) {
  const recommendations = getLifestyleContextStories(currentStory, stories);
  const visibleSavedStories = savedStoryInventory
    .filter((story) => savedIds.includes(story.id))
    .slice(0, 3);
  // Empty-state suggestions: the reader's ranked queue, minus saved stories,
  // the open story and anything already shown in the Trending rail.
  const shownIds = new Set([currentStory.id, ...recommendations.sharedIntent.map((story) => story.id)]);
  const savedSuggestions = visibleSavedStories.length > 0
    ? []
    : stories.filter((story) => !savedIds.includes(story.id) && !shownIds.has(story.id)).slice(0, 3);
  const savedItemsModule = (
    <SavedItemsModule
      savedStories={visibleSavedStories}
      suggestions={savedSuggestions}
      onOpenStory={(story) => onOpenStory(story.id)}
      onSaveSuggestion={onSaveStory ? (story) => onSaveStory(story) : undefined}
    />
  );

  return (
    <aside
      className="hidden xl:block"
      aria-label="Contextual story recommendations"
    >
      {/* Sticks 16px (--layout-gap) below the reader masthead once it collapses to 64px on scroll (STYLE.md › Reader). */}
      <div className="sticky top-20 max-h-[calc(100dvh-9rem)] space-y-4 overflow-y-auto overscroll-contain pb-12 pr-1">
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
