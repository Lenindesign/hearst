import assert from "node:assert/strict";
import test from "node:test";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  normalizeStorySearchText,
  searchLifestyleStories,
  tokenizeStorySearchText,
} from "./story-search";

function story(
  id: string,
  title: string,
  overrides: Partial<LifestyleRiverStory> = {}
): LifestyleRiverStory {
  return {
    id,
    title,
    summary: "Summary",
    brand: "Example",
    brandSlug: "example",
    topic: "News",
    tags: [],
    image: "/image.jpg",
    popularity: 50,
    readTime: "5 min",
    signal: "Trending",
    age: 1,
    ...overrides,
  };
}

test("normalizes accents, punctuation, and Unicode word tokens", () => {
  assert.equal(normalizeStorySearchText("  L’Été Beauty  "), "l'ete beauty");
  assert.deepEqual(tokenizeStorySearchText("L’Été Beauty"), ["l", "ete", "beauty"]);
});

test("Audi does not match words that merely contain those letters", () => {
  const results = searchLifestyleStories([
    story("audi", "2026 Audi Q3 Overview"),
    story("audience", "A Royal Audience"),
    story("saudi", "Travel Across Saudi Arabia"),
    story("audiobooks", "The Best Audiobooks"),
  ], "Audi");

  assert.deepEqual(results.map(({ id }) => id), ["audi"]);
});

test("ranks exact title before title token, brand, topic, and tag matches", () => {
  const results = searchLifestyleStories([
    story("tag", "A summer guide", { tags: ["Fitness"], popularity: 99 }),
    story("topic", "A practical guide", { topic: "Fitness", popularity: 99 }),
    story("brand", "The daily edit", { brand: "Fitness", popularity: 99 }),
    story("token", "The Fitness Edit", { popularity: 99 }),
    story("exact", "Fitness", { popularity: 1 }),
  ], "Fitness");

  assert.deepEqual(results.map(({ id }) => id), ["exact", "token", "brand", "topic", "tag"]);
});

test("supports bounded prefixes for longer queries", () => {
  const results = searchLifestyleStories([
    story("match", "Goodwood Festival Highlights"),
    story("miss", "Good Design Awards"),
  ], "Goodw");

  assert.deepEqual(results.map(({ id }) => id), ["match"]);
});
