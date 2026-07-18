import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

const excludedContentTitles = new Set([
  "i didn t let chronic pain stop me from losing 115 pounds here s how i did it",
  "qualcomm s dynamic electric vehicle charging an innovation story",
]);

function normalizeContentTitle(value?: string | null) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isExcludedContentTitle(value?: string | null) {
  return excludedContentTitles.has(normalizeContentTitle(value));
}

export function filterExcludedStories<T extends Pick<LifestyleRiverStory, "title">>(stories: readonly T[]) {
  return stories.filter((story) => !isExcludedContentTitle(story.title));
}
