import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

export const lifestyleDefaultLeadStoryId =
  "cosmopolitan-entertainment-celebs-a71899516-margaret-qualley-rep-denies-jack-antonoff-cheating";

export type LifestyleCardKind =
  | "article"
  | "gallery"
  | "video"
  | "recipe"
  | "shopping";

export function getLifestyleImagePosition(story: LifestyleRiverStory) {
  const peopleForwardBrands = new Set([
    "cosmopolitan",
    "seventeen",
    "elle",
    "harpers-bazaar",
    "town-country",
    "esquire",
    "redbook",
    "oprah-daily",
  ]);
  const peopleForwardTopics = new Set([
    "Beauty",
    "Culture",
    "Entertainment",
    "Events",
    "Food News",
    "Lifestyle",
    "Pleasure",
    "Relationships",
    "Style",
    "Style Beauty",
  ]);
  const headCropRiskTerms = [
    "actor",
    "actress",
    "bob haircut",
    "boyfriend",
    "cast",
    "celebrity",
    "characters",
    "dating",
    "fiancé",
    "girlfriend",
    "joining",
    "looks",
    "relationship",
    "spotted",
    "style",
    "taylor swift",
    "wedding",
  ];
  const peopleForwardCredits = [
    "dave benett",
    "getty images",
    "gc images",
    "wireimage",
  ];
  const title = story.title.toLowerCase();
  const imageCredit = story.imageCredit?.toLowerCase() ?? "";

  if (story.id === lifestyleDefaultLeadStoryId) return "center 22%";
  if (story.id === "delish-food-news-a73359231-meg-stalter-knorr") return "center 14%";
  if (
    story.title
    === "Is Dee Valladares Joining BB28? Here’s Why Fans Are Convinced She’s Another ‘Survivor’ Alum-Turned-Houseguest"
  ) {
    return "center 6%";
  }
  if (story.title === "Are Corbin and Parmida Still Together? Corbin Speaks Out") {
    return "center 18%";
  }
  if (story.title === "All About Zoey Deutch’s Fiancé, Jimmy Tatro") return "center 10%";
  if (story.title === "Inside Adéla’s Night Out in Paris With Wardrobe.NYC and H&M") {
    return "center 8%";
  }
  if (story.title === "Kate Middleton’s Style at Wimbledon Throughout the Years") {
    return "center 5%";
  }
  if (story.title === "Minka Kelly and Dan Reynolds’s Complete Relationship Timeline") {
    return "center 18%";
  }
  if (
    peopleForwardBrands.has(story.brandSlug)
    && peopleForwardTopics.has(story.topic)
  ) {
    return "center 16%";
  }
  if (
    peopleForwardCredits.some((credit) => imageCredit.includes(credit))
    && peopleForwardTopics.has(story.topic)
  ) {
    return "center 16%";
  }
  if (headCropRiskTerms.some((term) => title.includes(term))) return "center 16%";
  return "center";
}

export function isExplicitGalleryStory(story: LifestyleRiverStory) {
  const searchable = [
    story.id,
    story.topic,
    story.title,
    story.sourceUrl ?? "",
    ...story.tags,
  ].join(" ").toLowerCase();

  return /\b(?:photos?|photo-gallery|gallery|galleries)\b|\/photos\//.test(searchable);
}

export function storyHasPlayableVideo(story: LifestyleRiverStory) {
  return Boolean(story.videoUrl);
}

export function isYearMakeModelStory(story: LifestyleRiverStory) {
  const autosBrandSlugs = new Set([
    "autoweek",
    "bring-a-trailer",
    "car-and-driver",
    "hot-rod",
    "motortrend",
    "road-and-track",
  ]);
  const autosTopics = new Set(["Reviews", "EVs", "Performance", "Buying Guides"]);

  if (!autosBrandSlugs.has(story.brandSlug) && !autosTopics.has(story.topic)) {
    return false;
  }

  return /^(?:19|20)\d{2}\s+[A-Z0-9][A-Za-z0-9-]*(?:\s+[A-Z0-9][A-Za-z0-9-]*){1,6}\b/.test(
    story.title,
  );
}

export function getLifestyleCardKind(
  story: LifestyleRiverStory,
): LifestyleCardKind {
  const searchable = `${story.topic} ${story.title}`.toLowerCase();

  if (isExplicitGalleryStory(story)) return "gallery";
  if (storyHasPlayableVideo(story)) return "video";
  if (story.topic.startsWith("Food")) return "recipe";
  if (isYearMakeModelStory(story)) return "recipe";
  if (/shopping|products|tested|best|buy|sale|deals|favorite|picks/.test(searchable)) {
    return "shopping";
  }
  if (story.topic === "Buying Guides" || story.topic === "Auctions") {
    return "shopping";
  }
  if (
    /photos|gallery|style|jeans|rooms|decorating|porch|garden|designers|living room|classic|collector|auction/.test(
      searchable,
    )
    || story.age % 5 === 0
  ) {
    return "gallery";
  }

  return "article";
}

export function getLifestyleKindLabel(
  kind: LifestyleCardKind,
  story?: LifestyleRiverStory,
) {
  if (story && kind === "recipe" && isYearMakeModelStory(story)) return "Specs";
  if (story && kind === "shopping" && !["Shopping", "Style"].includes(story.topic)) {
    return "Guide";
  }

  const labels = {
    article: "Article",
    gallery: "Gallery",
    video: "Watch",
    recipe: "Recipe",
    shopping: "Shop",
  };

  return labels[kind];
}
