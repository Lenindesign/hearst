import "server-only";

import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { getAmbientCommerceStories } from "@/lib/ambient-commerce-stories";
import { filterExcludedStories } from "@/lib/content-exclusions";
import { todayEditLocalNewsStory } from "@/lib/hearst-plus-today-edit-stories";

const currentFeedStories = filterExcludedStories([
  ...lifestyleRiverStories,
  ...autosRiverStories,
  ...fluxRiverStories,
  ...ewRiverStories,
]);

// Verified commerce guides retain a snapshot after natural RSS rotation so a
// reader can still open a guide that remains in Shop the stories.
const staticHearstStories = Array.from(
  new Map(
    [...currentFeedStories, ...getAmbientCommerceStories(), todayEditLocalNewsStory].map((story) => [story.id, story]),
  ).values(),
);

export function getStaticHearstStoryById(storyId: string) {
  const decodedStoryId = decodeURIComponent(storyId);
  return staticHearstStories.find((story) => story.id === decodedStoryId);
}

export function getStaticHearstArticleParams() {
  return staticHearstStories.map((story) => ({ storyId: story.id }));
}
