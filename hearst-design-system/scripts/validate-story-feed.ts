import { autosRiverStories } from "../src/components/autos-river-data";
import { ewRiverStories } from "../src/components/ew-river-data";
import { fluxRiverStories } from "../src/components/flux-river-data";
import { lifestyleRiverStories } from "../src/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "../src/components/lifestyle-river-types";

const feeds = [
  { name: "Lifestyle", stories: lifestyleRiverStories, minimum: 259 },
  { name: "Autos", stories: autosRiverStories, minimum: 200 },
  { name: "Fashion & Luxury", stories: fluxRiverStories, minimum: 200 },
  { name: "Enthusiast & Wellness", stories: ewRiverStories, minimum: 200 },
] as const;

const now = Date.now();
const maximumNewestStoryAgeMs = 72 * 60 * 60 * 1000;
const maximumFutureSkewMs = 15 * 60 * 1000;
const minimumBylineCoverage = 0.75;

function assertValidStory(story: LifestyleRiverStory, feedName: string) {
  if (!story.id || !story.title || !story.brandSlug || !story.sourceUrl || !story.image) {
    throw new Error(`${feedName} contains an incomplete story: ${story.id || story.title || "unknown"}`);
  }

  if (!story.publishedAt || !Number.isFinite(Date.parse(story.publishedAt))) {
    throw new Error(`${feedName} story ${story.id} has no valid publication date`);
  }

  if (Date.parse(story.publishedAt) > now + maximumFutureSkewMs) {
    throw new Error(`${feedName} story ${story.id} has a publication date more than 15 minutes in the future`);
  }

  if (!Number.isFinite(story.age) || story.age < 0) {
    throw new Error(`${feedName} story ${story.id} has an invalid age`);
  }
}

for (const feed of feeds) {
  if (feed.stories.length < feed.minimum) {
    throw new Error(`${feed.name} imported ${feed.stories.length} stories; expected at least ${feed.minimum}`);
  }

  const sourceUrls = new Set<string>();
  for (const story of feed.stories) {
    assertValidStory(story, feed.name);
    if (sourceUrls.has(story.sourceUrl!)) {
      throw new Error(`${feed.name} contains duplicate source URL ${story.sourceUrl}`);
    }
    sourceUrls.add(story.sourceUrl!);
  }

  const newestPublishedAt = Math.max(...feed.stories.map((story) => Date.parse(story.publishedAt!)));
  const newestAgeMs = now - newestPublishedAt;
  if (newestAgeMs > maximumNewestStoryAgeMs) {
    throw new Error(`${feed.name}'s newest story is more than 72 hours old`);
  }

  const bylineCount = feed.stories.filter((story) => story.byline?.trim()).length;
  const bylineCoverage = bylineCount / feed.stories.length;
  if (bylineCoverage < minimumBylineCoverage) {
    throw new Error(`${feed.name} has source bylines for only ${bylineCount}/${feed.stories.length} stories`);
  }

  console.log(`${feed.name}: ${feed.stories.length} valid stories; ${bylineCount} source bylines; newest ${new Date(newestPublishedAt).toISOString()}`);
}

console.log(`Validated ${feeds.reduce((total, feed) => total + feed.stories.length, 0)} real-image stories.`);
