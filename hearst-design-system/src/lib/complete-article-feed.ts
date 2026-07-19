import "server-only";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstLiveArticle } from "@/lib/hearst-live-article";
import type { LiveFeedData, LiveFeedSourceNote } from "@/lib/live-feed-types";
import { getPersonalizeLiveFeed } from "@/lib/personalize-live-feed";

const candidateLimit = 60;
const articleLimit = 12;
const validationBatchSize = 4;

function hasCompleteArticleBody(story: LifestyleRiverStory) {
  if (!story.sourceUrl || story.videoUrl || !story.id.startsWith("live-")) return false;

  return getHearstLiveArticle(story.sourceUrl)
    .then((article) => {
      const readableBlocks = article.blocks.filter((block) => block.type !== "image");
      return readableBlocks.length >= 4;
    })
    .catch(() => false);
}

function buildSourceNotes(stories: LifestyleRiverStory[]) {
  const notes = new Map<string, LiveFeedSourceNote>();

  stories.forEach((story) => {
    const current = notes.get(story.brandSlug);
    if (current) {
      current.importedCount += 1;
      current.selectedCount += 1;
      return;
    }

    notes.set(story.brandSlug, {
      brand: story.brand,
      brandSlug: story.brandSlug,
      feedCount: 1,
      importedCount: 1,
      selectedCount: 1,
    });
  });

  return Array.from(notes.values());
}

export async function getCompleteArticleFeed(): Promise<LiveFeedData> {
  const liveFeed = await getPersonalizeLiveFeed({ destination: "all" });
  const candidates = liveFeed.stories
    .filter((story) => story.sourceUrl && !story.videoUrl && story.id.startsWith("live-"))
    .slice(0, candidateLimit);
  const stories: LifestyleRiverStory[] = [];

  // Keep source requests deliberately small. A wide burst can trigger upstream
  // throttling and make otherwise complete articles look unavailable.
  for (let index = 0; index < candidates.length && stories.length < articleLimit; index += validationBatchSize) {
    const batch = candidates.slice(index, index + validationBatchSize);
    const results = await Promise.all(batch.map(hasCompleteArticleBody));
    batch.forEach((story, batchIndex) => {
      if (results[batchIndex] && stories.length < articleLimit) stories.push(story);
    });
  }

  return {
    stories,
    sourceNotes: buildSourceNotes(stories),
    dataSourceCopy: stories.length > 0
      ? `${stories.length} current Hearst articles whose complete body, headings, lists, quotes, and editorial images are available in the in-app reader.`
      : "No current Hearst articles passed the complete-body check. Refresh to check the live feed again.",
    fetchedAt: new Date().toISOString(),
    isFallback: liveFeed.isFallback,
    productName: "Complete Article Viewer",
  };
}
