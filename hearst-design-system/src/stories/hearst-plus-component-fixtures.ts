import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  storybookFixtureData,
  storybookGalleryImagesByBrand,
} from "./generated/hearst-plus-fixtures";

const {
  lifestyle: { stories: lifestyleRiverStories },
  autos: { stories: autosRiverStories },
  flux: { stories: fluxRiverStories },
  ew: { stories: ewRiverStories },
} = storybookFixtureData;

const allComponentStories = [
  ...lifestyleRiverStories,
  ...autosRiverStories,
  ...fluxRiverStories,
  ...ewRiverStories,
];

const destinationStories: Record<string, LifestyleRiverStory[]> = {
  "hearst-all": allComponentStories,
  "hearst-lifestyle": lifestyleRiverStories,
  "hearst-plus": autosRiverStories,
  "hearst-flux": fluxRiverStories,
  "hearst-ew": ewRiverStories,
  "white-label": allComponentStories,
};

const storySlugAliases: Record<string, string> = {
  "the-pioneer-woman": "pioneer-woman",
};

export function getComponentStoriesForBrand(brandSlug = "hearst-all") {
  const destinationMatch = destinationStories[brandSlug];
  if (destinationMatch) return destinationMatch;

  const storyBrandSlug = storySlugAliases[brandSlug] ?? brandSlug;
  const publicationStories = allComponentStories.filter((story) => story.brandSlug === storyBrandSlug);
  return publicationStories.length > 0 ? publicationStories : allComponentStories;
}

export function getComponentStoryForBrand(
  brandSlug = "hearst-all",
  predicate: (story: LifestyleRiverStory) => boolean = () => true
) {
  const brandStories = getComponentStoriesForBrand(brandSlug);
  return brandStories.find(predicate) ?? brandStories[0] ?? allComponentStories[0];
}

export function getComponentGalleryImagesForBrand(brandSlug: string) {
  const storyBrandSlug = storySlugAliases[brandSlug] ?? brandSlug;
  return storybookGalleryImagesByBrand[storyBrandSlug] ?? [];
}
