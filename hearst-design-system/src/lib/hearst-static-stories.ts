import "server-only";

import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { filterExcludedStories } from "@/lib/content-exclusions";

const staticHearstStories = filterExcludedStories([
  ...lifestyleRiverStories,
  ...autosRiverStories,
  ...fluxRiverStories,
  ...ewRiverStories,
]);

export function getStaticHearstStoryById(storyId: string) {
  const decodedStoryId = decodeURIComponent(storyId);
  return staticHearstStories.find((story) => story.id === decodedStoryId);
}

export function getStaticHearstArticleParams() {
  return staticHearstStories.map((story) => ({ storyId: story.id }));
}
