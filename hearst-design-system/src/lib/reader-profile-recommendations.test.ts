import assert from "node:assert/strict";
import test from "node:test";

import type { LifestyleRiverProfile, LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getReaderProfileRecommendationReason,
  getReaderProfileRecommendations,
  rankReaderProfileOptions,
} from "./reader-profile-recommendations";

const profile: LifestyleRiverProfile = {
  followedTopics: ["Home"],
  followedBrands: ["Country Living"],
  savedTags: [],
  boostedTags: [],
  savedIds: ["saved"],
  hiddenIds: ["hidden"],
};

function makeStory(id: string, updates: Partial<LifestyleRiverStory> = {}): LifestyleRiverStory {
  return {
    id,
    brand: "Cosmopolitan",
    brandSlug: "cosmopolitan",
    topic: "Style",
    title: id,
    summary: `${id} summary`,
    image: "/placeholder.svg",
    readTime: "4 min read",
    popularity: 50,
    signal: "Trending",
    tags: [],
    age: 12,
    ...updates,
  };
}

test("ranks profile options from their strongest popular and recent stories", () => {
  const stories = [
    makeStory("home", { topic: "Home", popularity: 95 }),
    makeStory("style", { topic: "Style", popularity: 70 }),
  ];

  assert.deepEqual(rankReaderProfileOptions(["Style", "Home", "Cars"], stories, "topic"), [
    "Home",
    "Style",
    "Cars",
  ]);
});

test("recommends only fresh unsaved and visible stories using real preference signals", () => {
  const stories = [
    makeStory("followed", { brand: "Country Living", topic: "Home", popularity: 60, age: 30 }),
    makeStory("popular", { popularity: 99, age: 12 }),
    makeStory("saved", { popularity: 100 }),
    makeStory("hidden", { popularity: 100 }),
    makeStory("old", { popularity: 100, age: 24 * 8 }),
  ];

  assert.deepEqual(
    getReaderProfileRecommendations(stories, profile).map((story) => story.id),
    ["followed", "popular"],
  );
  assert.equal(getReaderProfileRecommendationReason(stories[0], profile), "Because you follow Home");
  assert.equal(getReaderProfileRecommendationReason(stories[1], profile), "New today");
});
