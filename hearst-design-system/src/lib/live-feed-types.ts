import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

export type LiveFeedSourceNote = {
  brand: string;
  brandSlug: string;
  feedCount: number;
  importedCount: number;
  selectedCount: number;
};

export type LiveFeedData = {
  stories: LifestyleRiverStory[];
  sourceNotes: LiveFeedSourceNote[];
  dataSourceCopy: string;
  fetchedAt: string;
  isFallback: boolean;
  productName?: string;
};

export type LiveArticleBlock =
  | { type: "paragraph" | "heading" | "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; url: string; alt: string; caption?: string; credit?: string };

export type LiveArticleData = {
  blocks: LiveArticleBlock[];
  sourceUrl: string;
  byline?: string;
  authorAvatarUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
};
