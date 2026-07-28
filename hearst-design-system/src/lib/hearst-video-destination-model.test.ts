import assert from "node:assert/strict";
import test from "node:test";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { LiveFeedData } from "@/lib/live-feed-types";
import {
  buildVideoDestinationQueue,
  getDelishShortsRiverInsertIndex,
  getPlayableVideoStories,
  hasPlayableVideoStories,
  isDelishPortraitShort,
  mergeDelishPortraitStories,
  reconcileVideoBrandFilters,
  resolveProgressiveVideoFeed,
} from "./hearst-video-destination-model";

function makeStory(
  id: string,
  overrides: Partial<LifestyleRiverStory> = {},
): LifestyleRiverStory {
  return {
    id,
    brand: "ELLE",
    brandSlug: "elle",
    topic: "Style",
    title: `Story ${id}`,
    summary: "Summary",
    image: `/images/${id}.jpg`,
    readTime: "3 min",
    popularity: 50,
    signal: "Editor Pick",
    tags: [],
    age: 1,
    ...overrides,
  };
}

function makeFeed(stories: LifestyleRiverStory[]): LiveFeedData {
  return {
    stories,
    sourceNotes: [],
    dataSourceCopy: "Fixture",
    fetchedAt: "2026-07-27T00:00:00.000Z",
    isFallback: false,
  };
}

test("keeps only stories that resolve to production video cards", () => {
  const playable = makeStory("playable", {
    mediaKind: "video",
    videoUrl: "/playable.mp4",
  });
  const article = makeStory("article");
  const explicitGallery = makeStory("gallery", {
    topic: "Photo Gallery",
    title: "A photo gallery with clips",
    mediaKind: "video",
    videoUrl: "/gallery.mp4",
  });

  assert.deepEqual(
    getPlayableVideoStories([article, explicitGallery, playable]).map(
      (story) => story.id,
    ),
    ["playable"],
  );
});

test("drops stale brand filters without changing valid filter order", () => {
  const videos = [
    makeStory("elle", { brand: "ELLE", videoUrl: "/elle.mp4" }),
    makeStory("delish", {
      brand: "Delish",
      brandSlug: "delish",
      videoUrl: "/delish.mp4",
    }),
  ];

  assert.deepEqual(
    reconcileVideoBrandFilters(["Missing", "Delish", "ELLE"], videos),
    ["Delish", "ELLE"],
  );
  assert.deepEqual(reconcileVideoBrandFilters([], videos), []);
});

test("recognizes only playable exact 9:16 Delish videos as Shorts", () => {
  const portrait = makeStory("portrait", {
    brand: "Delish",
    brandSlug: "delish",
    videoUrl: "/portrait.mp4",
    videoWidth: 1080,
    videoHeight: 1920,
  });

  assert.equal(isDelishPortraitShort(portrait), true);
  assert.equal(
    isDelishPortraitShort({ ...portrait, brandSlug: "elle" }),
    false,
  );
  assert.equal(
    isDelishPortraitShort({ ...portrait, videoWidth: 1080, videoHeight: 1080 }),
    false,
  );
  assert.equal(isDelishPortraitShort({ ...portrait, videoUrl: undefined }), false);
});

test("merges the Delish portrait inventory once while preserving source order", () => {
  const portrait = makeStory("portrait", {
    brand: "Delish",
    brandSlug: "delish",
    sourceUrl: "https://www.delish.com/portrait",
    videoUrl: "/portrait.mp4",
    videoWidth: 1080,
    videoHeight: 1920,
  });
  const duplicate = { ...portrait, id: "duplicate" };
  const landscape = makeStory("landscape", {
    brand: "Delish",
    brandSlug: "delish",
    videoUrl: "/landscape.mp4",
    videoWidth: 1920,
    videoHeight: 1080,
  });
  const supplemental = makeStory("supplemental", {
    brand: "Delish",
    brandSlug: "delish",
    videoUrl: "/supplemental.mp4",
    videoWidth: 540,
    videoHeight: 960,
  });

  assert.deepEqual(
    mergeDelishPortraitStories(
      [portrait],
      [duplicate, landscape],
      [supplemental],
    ).map((story) => story.id),
    ["portrait", "supplemental"],
  );
});

test("places the Shorts module after the highest-ranked eligible Delish story", () => {
  const stories = [
    makeStory("elle"),
    makeStory("delish", { brand: "Delish", brandSlug: "delish" }),
    makeStory("later-delish", { brand: "Delish", brandSlug: "delish" }),
  ];

  assert.equal(getDelishShortsRiverInsertIndex(stories), 2);
  assert.equal(getDelishShortsRiverInsertIndex([stories[0]]), -1);
});

test("merges progressive pages without duplicating the initial video feed", () => {
  const initial = makeStory("initial", {
    sourceUrl: "https://example.com/initial",
    videoUrl: "/initial.mp4",
  });
  const duplicate = { ...initial, id: "duplicate" };
  const next = makeStory("next", { videoUrl: "/next.mp4" });
  const resolved = resolveProgressiveVideoFeed(
    makeFeed([initial]),
    [duplicate, next],
  );

  assert.deepEqual(
    resolved?.stories.map((story) => story.id),
    ["initial", "next"],
  );
  assert.equal(resolveProgressiveVideoFeed(undefined, [next]), undefined);
});

test("reports scoped video availability from the same production card resolver", () => {
  assert.equal(hasPlayableVideoStories(makeFeed([makeStory("article")])), false);
  assert.equal(
    hasPlayableVideoStories(makeFeed([
      makeStory("video", { videoUrl: "/video.mp4" }),
    ])),
    true,
  );
  assert.equal(hasPlayableVideoStories(undefined), false);
});

test("builds a deduplicated queue with promoted Shorts excluded from standard slots", () => {
  const featured = makeStory("featured", {
    videoUrl: "/featured.mp4",
    popularity: 70,
    publishedAt: "2026-07-25T00:00:00.000Z",
  });
  const promoted = makeStory("promoted", {
    brand: "Delish",
    brandSlug: "delish",
    videoUrl: "/promoted.mp4",
    videoWidth: 1080,
    videoHeight: 1920,
    popularity: 100,
  });
  const trending = makeStory("trending", {
    videoUrl: "/trending.mp4",
    popularity: 90,
  });
  const queue = buildVideoDestinationQueue(
    [featured, promoted, trending, makeStory("article")],
    new Set([promoted.id]),
  );

  assert.equal(queue.featuredVideo?.id, "featured");
  assert.deepEqual(
    queue.remainingVideoStories.map((story) => story.id),
    ["trending"],
  );
  assert.deepEqual(
    queue.trendingVideoStories.map((story) => story.id),
    ["promoted", "trending"],
  );
});

test("falls back to a promoted video when it is the only playable item", () => {
  const promoted = makeStory("promoted", {
    brand: "Delish",
    brandSlug: "delish",
    videoUrl: "/promoted.mp4",
    videoWidth: 1080,
    videoHeight: 1920,
  });
  const queue = buildVideoDestinationQueue(
    [promoted],
    new Set([promoted.id]),
  );

  assert.equal(queue.featuredVideo?.id, "promoted");
  assert.deepEqual(queue.remainingVideoStories, []);
});
