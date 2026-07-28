import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

export function getStoryIdentity(story: LifestyleRiverStory) {
  const sourceUrl = story.sourceUrl?.trim().toLowerCase();
  if (sourceUrl) return `url:${sourceUrl}`;

  return `story:${story.brandSlug}:${story.title.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

function getStoryVisualIdentity(story: LifestyleRiverStory) {
  return [
    "visual",
    story.brandSlug,
    story.title.trim().toLowerCase().replace(/\s+/g, " "),
    story.image.trim().toLowerCase(),
  ].join(":");
}

export function mergeUniqueStories(...storyGroups: LifestyleRiverStory[][]) {
  const seen = new Set<string>();

  return storyGroups.flat().filter((story) => {
    const identities = [getStoryIdentity(story), getStoryVisualIdentity(story)];
    if (identities.some((identity) => seen.has(identity))) return false;
    identities.forEach((identity) => seen.add(identity));
    return true;
  });
}
