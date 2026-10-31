import "server-only";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { filterExcludedStories } from "@/lib/content-exclusions";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import type { LiveFeedData, LiveFeedSourceNote } from "@/lib/live-feed-types";

type EditorialDestination = "all" | "lifestyle" | "autos" | "flux" | "ew";

type LocalFeedOptions = {
  destination?: EditorialDestination;
  brandSlug?: string;
  sizePerBrand?: number;
};

function normalizeBrandSlug(brandSlug?: string) {
  return brandSlug === "the-pioneer-woman" ? "pioneer-woman" : brandSlug;
}

function selectPerBrand(stories: LifestyleRiverStory[], sizePerBrand: number) {
  const counts = new Map<string, number>();
  return stories.filter((story) => {
    const count = counts.get(story.brandSlug) ?? 0;
    if (count >= sizePerBrand) return false;
    counts.set(story.brandSlug, count + 1);
    return true;
  });
}

function buildSourceNotes(
  stories: LifestyleRiverStory[],
  inventoryNotes: readonly LiveFeedSourceNote[],
): LiveFeedSourceNote[] {
  const counts = new Map<string, number>();
  stories.forEach((story) => counts.set(story.brandSlug, (counts.get(story.brandSlug) ?? 0) + 1));
  const notesByBrand = new Map(inventoryNotes.map((note) => [note.brandSlug, note]));

  return Array.from(counts, ([brandSlug, selectedCount]) => {
    const inventoryNote = notesByBrand.get(brandSlug);
    const story = stories.find((item) => item.brandSlug === brandSlug)!;
    return {
      brand: inventoryNote?.brand ?? story.brand,
      brandSlug,
      feedCount: inventoryNote?.feedCount ?? 1,
      importedCount: inventoryNote?.importedCount ?? selectedCount,
      selectedCount,
    };
  });
}

function toLocalFeedData(
  stories: LifestyleRiverStory[],
  inventoryNotes: readonly LiveFeedSourceNote[],
  dataSourceCopy: string,
  productName?: string,
): LiveFeedData {
  const fetchedAt = stories.reduce<string | undefined>((latest, story) => {
    if (!story.publishedAt) return latest;
    if (!latest || Date.parse(story.publishedAt) > Date.parse(latest)) return story.publishedAt;
    return latest;
  }, undefined);

  return {
    stories,
    sourceNotes: buildSourceNotes(stories, inventoryNotes),
    dataSourceCopy,
    fetchedAt: fetchedAt ?? "",
    isFallback: false,
    productName,
  };
}

function getLocalInventory({ destination = "all", brandSlug }: LocalFeedOptions = {}) {
  const localBrandSlug = normalizeBrandSlug(brandSlug);
  const data = getHearstDestinationStaticData({
    storyLimitPerDestination: 10_000,
    includeBrandSlug: localBrandSlug,
  })[destination];
  const stories = filterExcludedStories(data.stories).filter((story) =>
    !localBrandSlug || story.brandSlug === localBrandSlug
  );
  return { stories, sourceNotes: data.sourceNotes };
}

export function getLocalStoryFeed({
  destination = "all",
  brandSlug,
  sizePerBrand = 10,
}: LocalFeedOptions = {}): LiveFeedData {
  const inventory = getLocalInventory({ destination, brandSlug });
  const stories = selectPerBrand(inventory.stories, Math.max(1, sizePerBrand));

  return toLocalFeedData(
    stories,
    inventory.sourceNotes,
    "the latest validated Hearst RSS story snapshot, ranked locally using reader context.",
  );
}

export function getLocalLifestyleStoryFeed(): LiveFeedData {
  const inventory = getLocalInventory({ destination: "lifestyle", brandSlug: "cosmopolitan" });
  const stories = selectPerBrand(inventory.stories, 40);

  return toLocalFeedData(
    stories,
    inventory.sourceNotes,
    "the latest validated Cosmopolitan RSS story snapshot, ranked locally using reader context.",
  );
}
