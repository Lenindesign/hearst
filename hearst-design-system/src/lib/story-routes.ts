import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstBrandRoute } from "@/lib/hearst-routes";

export function getHearstStoryRoute(storyOrId: Pick<LifestyleRiverStory, "id"> | string) {
  const id = typeof storyOrId === "string" ? storyOrId : storyOrId.id;
  return `/read/${encodeURIComponent(id)}/`;
}

export function getHearstStoryReturnHref(story?: Pick<LifestyleRiverStory, "brandSlug"> | null) {
  return story ? getHearstBrandRoute(story.brandSlug) : "/hearst-plus/";
}
