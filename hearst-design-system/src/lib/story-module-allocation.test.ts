import assert from "node:assert/strict";
import test from "node:test";
import { allocateStoryModules } from "./story-module-allocation";

const stories = Array.from({ length: 24 }, (_, index) => ({
  id: `story-${index + 1}`,
  brand: `Brand ${(index % 6) + 1}`,
  popularity: 100 - index,
  tags: index % 2 === 0 ? ["home"] : ["style"],
}));

test("gives each high-value module distinct inventory before the river", () => {
  const allocation = allocateStoryModules({
    stories,
    heroStoryIds: stories.slice(0, 5).map((story) => story.id),
    continueStoryIds: [stories[5].id],
    followedBrands: ["Brand 1"],
    savedTags: ["home"],
  });
  const todayEditIds = Object.values(allocation.todayEdit)
    .filter(Boolean)
    .map((story) => story.id);
  const allocatedIds = [
    ...stories.slice(0, 5).map((story) => story.id),
    ...todayEditIds,
    ...allocation.dailyHabitStories.map((story) => story.id),
    ...allocation.trendingStories.map((story) => story.id),
    ...allocation.riverStories.map((story) => story.id),
  ];

  assert.equal(new Set(allocatedIds).size, allocatedIds.length);
  assert.equal(allocation.dailyHabitStories.length, 3);
  assert.equal(allocation.trendingStories.length, 5);
});

test("uses a hero story for Continue Reading only when no unused unfinished story exists", () => {
  const heroStory = stories[0];
  const allocation = allocateStoryModules({
    stories,
    heroStoryIds: [heroStory.id],
    continueStoryIds: [heroStory.id],
    followedBrands: [],
    savedTags: [],
  });

  assert.equal(allocation.todayEdit.continueStory?.id, heroStory.id);
  assert.equal(allocation.riverStories.some((story) => story.id === heroStory.id), false);
});

test("prefers different brands in Trending Across Brands", () => {
  const allocation = allocateStoryModules({
    stories,
    heroStoryIds: [],
    continueStoryIds: [],
    followedBrands: [],
    savedTags: [],
    dailyHabitCount: 0,
    trendingCount: 5,
  });
  const trendingBrands = allocation.trendingStories.map((story) => story.brand);

  assert.equal(new Set(trendingBrands).size, trendingBrands.length);
});

test("keeps a useful river when the scoped inventory is small", () => {
  const smallCatalog = stories.slice(0, 9);
  const allocation = allocateStoryModules({
    stories: smallCatalog,
    heroStoryIds: smallCatalog.slice(0, 3).map((story) => story.id),
    continueStoryIds: [],
    followedBrands: ["Brand 4"],
    savedTags: ["home"],
  });

  assert.equal(allocation.riverStories.length, 4);
});
