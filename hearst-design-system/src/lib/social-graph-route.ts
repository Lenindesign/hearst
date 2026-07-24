import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import {
  getHearstDestinationCategoryLabel,
  getHearstSectionBrand,
  type HearstBrandSection,
  type HearstDestinationMode,
} from "@/lib/hearst-routes";
import { socialGraphDestinationConfig } from "@/lib/social-graph-config";

function normalize(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

export function getCategoryPosterData(destination: HearstDestinationMode, categorySlug: string) {
  const categoryLabel = getHearstDestinationCategoryLabel(destination, categorySlug);
  if (!categoryLabel) return undefined;

  const category = normalize(categoryLabel);
  const stories = getHearstDestinationStaticData({ storyLimitPerDestination: 50 })[destination].stories;
  const story = stories.find((candidate) => {
    const searchable = normalize(`${candidate.topic} ${candidate.title} ${candidate.tags.join(" ")}`);
    return searchable.includes(category) || category.split(" ").some((term) => term.length > 3 && searchable.includes(term));
  }) ?? stories[0];

  return { categoryLabel, story, config: socialGraphDestinationConfig[destination] };
}

export function getBrandPosterData(section: HearstBrandSection, brandSlug: string) {
  const brand = getHearstSectionBrand(section, brandSlug);
  if (!brand) return undefined;

  const stories = getHearstDestinationStaticData({ storyLimitPerDestination: 50 })[section].stories;
  const story = stories.find((candidate) => candidate.brandSlug === brand.brandSlug);
  return { brand, story, config: socialGraphDestinationConfig[section] };
}
