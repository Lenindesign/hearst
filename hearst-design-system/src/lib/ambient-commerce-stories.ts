import "server-only";

import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { filterExcludedStories } from "@/lib/content-exclusions";
import {
  verifiedAmbientCommerceCollections,
  type VerifiedAmbientCommerceCollection,
} from "@/lib/ambient-commerce-catalog.generated";

export type AmbientCommerceStory = LifestyleRiverStory & {
  commerceCollection: VerifiedAmbientCommerceCollection;
};

function getStoryIdentity(story: LifestyleRiverStory) {
  return story.sourceUrl?.trim().toLowerCase() || story.id;
}

/**
 * The complete catalog is intentionally resolved server-side. The page only
 * includes stories whose product module passed the source/product/image audit.
 */
export function getAmbientCommerceStories(): AmbientCommerceStory[] {
  const seen = new Set<string>();
  const refreshedStories = filterExcludedStories([
    ...lifestyleRiverStories,
    ...autosRiverStories,
    ...fluxRiverStories,
    ...ewRiverStories,
  ]);

  const refreshedStoriesById = new Map(refreshedStories.map((story) => [story.id, story]));

  return verifiedAmbientCommerceCollections.flatMap((collection) => {
    const refreshedStory = collection.storyIds
      .map((storyId) => refreshedStoriesById.get(storyId))
      .find((story): story is LifestyleRiverStory => Boolean(story));
    const story = refreshedStory ?? collection.story;
    const identity = getStoryIdentity(story);

    if (seen.has(identity) || filterExcludedStories([story]).length === 0) return [];

    seen.add(identity);
    return [{ ...story, commerceCollection: collection }];
  });
}
