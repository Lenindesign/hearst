export type LifestyleRiverStory = {
  id: string;
  brand: string;
  brandSlug: string;
  topic: string;
  title: string;
  summary: string;
  image: string;
  imageCredit?: string;
  byline?: string;
  readTime: string;
  popularity: number;
  signal: "Most Popular" | "Trending" | "Editor Pick" | "Continue";
  tags: string[];
  age: number;
  publishedAt?: string;
  sourceUrl?: string;
};

export type LifestyleRiverProfile = {
  followedTopics: string[];
  followedBrands: string[];
  savedTags: string[];
  boostedTags: string[];
  savedIds: string[];
  hiddenIds: string[];
  personalizationMode?: "default" | "onboarding";
};
