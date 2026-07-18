import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { filterExcludedStories } from "@/lib/content-exclusions";
import { getHearstBrandRoute } from "@/lib/hearst-routes";

export const staticHearstStories = filterExcludedStories([
  ...lifestyleRiverStories,
  ...autosRiverStories,
  ...fluxRiverStories,
  ...ewRiverStories,
]);

export function getHearstStoryRoute(storyOrId: Pick<LifestyleRiverStory, "id"> | string) {
  const id = typeof storyOrId === "string" ? storyOrId : storyOrId.id;
  return `/read/${encodeURIComponent(id)}/`;
}

export function getStaticHearstStoryById(storyId: string) {
  const decodedStoryId = decodeURIComponent(storyId);
  return staticHearstStories.find((story) => story.id === decodedStoryId);
}

export function getStaticHearstArticleParams() {
  return staticHearstStories.map((story) => ({ storyId: story.id }));
}

export function getHearstStoryReturnHref(story?: Pick<LifestyleRiverStory, "brandSlug"> | null) {
  return story ? getHearstBrandRoute(story.brandSlug) : "/hearst-plus/";
}
