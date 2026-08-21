import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

const brandPromotionPriority = [
  "elle",
  "car-and-driver",
  "delish",
  "good-housekeeping",
  "country-living",
  "cosmopolitan",
  "mens-health",
  "esquire",
  "harpers-bazaar",
  "road-and-track",
  "house-beautiful",
  "prevention",
  "seventeen",
  "bicycling",
  "oprah-daily",
  "popular-mechanics",
  "veranda",
  "elle-decor",
];

export type BrandPromotionMatch = {
  brand: string;
  brandSlug: string;
  href?: string;
  topics: string[];
  stories: LifestyleRiverStory[];
};

export function scoreBrandPromotionStory(
  story: LifestyleRiverStory,
  activeFilter: string,
) {
  const topicScore = activeFilter !== "For You" && story.topic === activeFilter ? 120 : 0;
  const popularityScore = story.popularity ?? 0;
  const freshnessScore = Math.max(0, 40 - story.age);

  return topicScore + popularityScore + freshnessScore;
}

export function getBrandPromotionForSlot({
  stories,
  fallbackStories,
  activeFilter,
  slotNumber,
  excludedBrandSlug,
  excludedBrandSlugs = [],
}: {
  stories: LifestyleRiverStory[];
  fallbackStories: LifestyleRiverStory[];
  activeFilter: string;
  slotNumber: number;
  excludedBrandSlug?: string;
  excludedBrandSlugs?: string[];
}): BrandPromotionMatch | null {
  const groups = new Map<string, BrandPromotionMatch>();
  const excluded = new Set(excludedBrandSlugs);
  if (excludedBrandSlug) excluded.add(excludedBrandSlug);
  const candidateStories = (excluded.size > 0 ? fallbackStories : stories)
    .filter((story) => !excluded.has(story.brandSlug));

  candidateStories.forEach((story) => {
    const existing = groups.get(story.brandSlug);
    if (existing) {
      existing.stories.push(story);
      if (!existing.topics.includes(story.topic)) existing.topics.push(story.topic);
      return;
    }

    groups.set(story.brandSlug, {
      brand: story.brand,
      brandSlug: story.brandSlug,
      topics: [story.topic],
      stories: [story],
    });
  });

  const orderedGroups = Array.from(groups.values())
    .map((group) => {
      const storyPool = [
        ...group.stories,
        ...fallbackStories.filter((story) => story.brandSlug === group.brandSlug),
      ];
      const selectedStories = storyPool
        .filter((story, index, array) =>
          array.findIndex((candidate) => candidate.id === story.id) === index
        )
        .sort((a, b) =>
          scoreBrandPromotionStory(b, activeFilter)
          - scoreBrandPromotionStory(a, activeFilter)
        )
        .slice(0, 4);

      return {
        ...group,
        stories: selectedStories,
        topics: Array.from(new Set(selectedStories.map((story) => story.topic))).slice(0, 4),
      };
    })
    .filter((group) => group.stories.length >= 3)
    .sort((a, b) => {
      const aPriority = brandPromotionPriority.includes(a.brandSlug)
        ? brandPromotionPriority.indexOf(a.brandSlug)
        : brandPromotionPriority.length;
      const bPriority = brandPromotionPriority.includes(b.brandSlug)
        ? brandPromotionPriority.indexOf(b.brandSlug)
        : brandPromotionPriority.length;

      return aPriority - bPriority || a.brand.localeCompare(b.brand);
    });

  if (!orderedGroups.length) return null;

  const promotionIndex = Math.max(0, Math.floor(slotNumber / 2) - 1);
  return orderedGroups[promotionIndex % orderedGroups.length];
}
