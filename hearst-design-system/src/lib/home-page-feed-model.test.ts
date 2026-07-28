import assert from "node:assert/strict";
import test from "node:test";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  applyContextualFeedCadence,
  getAutosOemMatchesForStory,
  isCurrentFeedStory,
  usesNativePublicationLogoColor,
} from "./home-page-feed-model";

function makeStory(
  id: string,
  overrides: Partial<LifestyleRiverStory> = {},
): LifestyleRiverStory {
  return {
    id,
    brand: "Hearst",
    brandSlug: "hearst-all",
    topic: "News",
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

test("recognizes current feed stories by their stable live id prefix", () => {
  assert.equal(isCurrentFeedStory(makeStory("live-article")), true);
  assert.equal(isCurrentFeedStory(makeStory("editorial-article")), false);
});

test("blends current feed stories after the editorial lead while alternating media", () => {
  const stories = [
    ...Array.from({ length: 9 }, (_, index) => makeStory(`editorial-${index + 1}`)),
    makeStory("live-video-1", { videoUrl: "/video-1.mp4" }),
    makeStory("live-video-2", { videoUrl: "/video-2.mp4" }),
    makeStory("live-article-1"),
  ];

  assert.deepEqual(
    applyContextualFeedCadence(stories).map((story) => story.id),
    [
      "editorial-1",
      "editorial-2",
      "editorial-3",
      "editorial-4",
      "editorial-5",
      "live-video-1",
      "editorial-6",
      "live-article-1",
      "editorial-7",
      "editorial-8",
      "editorial-9",
      "live-video-2",
    ],
  );
});

test("does not rearrange feeds that lack enough editorial context", () => {
  const stories = [
    makeStory("editorial-1"),
    makeStory("editorial-2"),
    makeStory("live-article-1"),
  ];

  assert.equal(applyContextualFeedCadence(stories), stories);
});

test("matches OEM aliases as complete tokens instead of substrings", () => {
  assert.deepEqual(
    getAutosOemMatchesForStory(makeStory("chevy", {
      title: "The new Chevy truck arrives",
    })),
    ["Chevrolet"],
  );
  assert.deepEqual(
    getAutosOemMatchesForStory(makeStory("ramble", {
      title: "A long ramble about road trips",
    })),
    [],
  );
});

test("uses native logo color only for the documented Car and Driver exception", () => {
  assert.equal(usesNativePublicationLogoColor("car-and-driver"), true);
  assert.equal(usesNativePublicationLogoColor("road-and-track"), false);
});
