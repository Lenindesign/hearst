import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstBrandSection } from "@/lib/hearst-routes";

export const ambientReaderDiscoveryBatchSize = 12;
export const ambientReaderDiscoveryBuffer = 4;

export type AmbientReaderDiscoveryScope = {
  key: string;
  destination: "all" | "lifestyle" | "autos" | "flux" | "ew";
  brandSlug?: string;
  category?: string;
};

function getStorySection(story: LifestyleRiverStory) {
  return getHearstBrandSection(story.brandSlug);
}

function sharedTagCount(anchor: LifestyleRiverStory, candidate: LifestyleRiverStory) {
  const anchorTags = new Set(anchor.tags.map((tag) => tag.toLowerCase()));
  return candidate.tags.reduce(
    (count, tag) => count + (anchorTags.has(tag.toLowerCase()) ? 1 : 0),
    0,
  );
}

export function getAmbientReaderDiscoveryTier(
  anchor: LifestyleRiverStory,
  candidate: LifestyleRiverStory,
) {
  const sameBrand = candidate.brandSlug === anchor.brandSlug;
  const sameCategory = candidate.topic === anchor.topic;
  const sameSection = getStorySection(candidate) === getStorySection(anchor);

  if (sameBrand && sameCategory) return 0;
  if (sameCategory && sameSection) return 1;
  if (sameBrand) return 2;
  if (sameSection) return 3;
  return 4;
}

export function rankAmbientReaderDiscoveryStories(
  anchor: LifestyleRiverStory,
  candidates: LifestyleRiverStory[],
) {
  return [...candidates]
    .filter((story) => Boolean(story.sourceUrl) && !story.videoUrl)
    .sort((first, second) =>
      getAmbientReaderDiscoveryTier(anchor, first)
        - getAmbientReaderDiscoveryTier(anchor, second)
      || sharedTagCount(anchor, second) - sharedTagCount(anchor, first)
      || second.popularity - first.popularity
      || first.age - second.age
      || first.id.localeCompare(second.id)
    );
}

export function appendAmbientReaderDiscoveryStoryIds(
  currentIds: string[],
  anchor: LifestyleRiverStory,
  candidates: LifestyleRiverStory[],
) {
  const seen = new Set(currentIds);
  const nextIds = [...currentIds];

  rankAmbientReaderDiscoveryStories(anchor, candidates).forEach((story) => {
    if (seen.has(story.id)) return;
    seen.add(story.id);
    nextIds.push(story.id);
  });

  return nextIds;
}

export function getAmbientReaderDiscoveryScopes(
  anchor: LifestyleRiverStory,
): AmbientReaderDiscoveryScope[] {
  const destination = getStorySection(anchor);

  return [
    {
      key: "brand-category",
      destination,
      brandSlug: anchor.brandSlug,
      category: anchor.topic,
    },
    {
      key: "section-category",
      destination,
      category: anchor.topic,
    },
    {
      key: "brand",
      destination,
      brandSlug: anchor.brandSlug,
    },
    {
      key: "section",
      destination,
    },
    {
      key: "all-sections",
      destination: "all",
    },
  ];
}
