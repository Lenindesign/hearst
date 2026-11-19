import assert from "node:assert/strict";
import test from "node:test";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getProposedInterest,
  getReaderInterestBySlug,
  getReaderInterestFilterKey,
  getReaderInterestFromFilter,
  getReaderTaxonomyPreviewRoute,
} from "@/lib/reader-taxonomy";
import { insertVideosFilter } from "@/lib/hearst-personalization-model";
import { storyMatchesLifestyleFilter } from "@/lib/story-feed-filter";

function makeStory(overrides: Partial<LifestyleRiverStory> = {}): LifestyleRiverStory {
  return {
    id: "story",
    brand: "Delish",
    brandSlug: "delish",
    topic: "Food Cooking",
    title: "A production-shaped story",
    summary: "A source-backed fixture.",
    image: "https://hips.hearstapps.com/hmg-prod/images/example.jpg",
    readTime: "5 Min Read",
    popularity: 75,
    signal: "Editor Pick",
    tags: [],
    age: 2,
    ...overrides,
  };
}

test("interest keys round-trip through slugs, filters and preview routes", () => {
  assert.equal(getReaderInterestFilterKey("Home & Design"), "interest:home-and-design");
  assert.equal(getReaderInterestFromFilter("interest:home-and-design"), "Home & Design");
  assert.equal(getReaderInterestBySlug("tech-and-gear"), "Tech & Gear");
  assert.equal(getReaderTaxonomyPreviewRoute("Food"), "/hearst-plus/taxonomy/food/");
  assert.equal(getReaderTaxonomyPreviewRoute(), "/hearst-plus/taxonomy/");
  assert.equal(getReaderInterestFromFilter("Food"), undefined);
  assert.equal(getReaderInterestFromFilter("interest:unknown"), undefined);
});

test("every auto-cohort story is Cars, whatever its feed topic", () => {
  assert.equal(getProposedInterest(makeStory({ brand: "Road & Track", brandSlug: "road-and-track", topic: "News" })), "Cars");
  assert.equal(getProposedInterest(makeStory({ brand: "Esquire", brandSlug: "esquire", topic: "News" })), undefined);
});

test("interest filters match the proposed interest across brands", () => {
  const food = makeStory();
  const gear = makeStory({ brand: "Popular Mechanics", brandSlug: "popular-mechanics", topic: "Gear" });
  assert.equal(storyMatchesLifestyleFilter(food, "interest:food"), true);
  assert.equal(storyMatchesLifestyleFilter(gear, "interest:food"), false);
  assert.equal(storyMatchesLifestyleFilter(gear, "interest:tech-and-gear"), true);
});

test("production filters keep their meaning", () => {
  // "Food Cooking" is Food in the proposal, and still matches the production Food tab by prefix.
  assert.equal(storyMatchesLifestyleFilter(makeStory(), "Food"), true);
  // "Kitchen Tools" maps to the Food interest but is not a production Food story.
  assert.equal(storyMatchesLifestyleFilter(makeStory({ topic: "Kitchen Tools" }), "Food"), false);
  assert.equal(storyMatchesLifestyleFilter(makeStory({ topic: "Kitchen Tools" }), "interest:food"), true);
});

test("subtopic and videos keys stay inside their interest", () => {
  const recipe = makeStory({ topic: "Food Cooking" });
  const news = makeStory({ topic: "Food News" });
  assert.equal(storyMatchesLifestyleFilter(recipe, "interest:food/recipes"), true);
  assert.equal(storyMatchesLifestyleFilter(news, "interest:food/recipes"), false);
  assert.equal(storyMatchesLifestyleFilter(news, "interest:food/food-news"), true);
  assert.equal(storyMatchesLifestyleFilter(makeStory({ videoUrl: "https://example.com/v.mp4" }), "interest:food/videos"), true);
  assert.equal(storyMatchesLifestyleFilter(makeStory({ videoUrl: "https://example.com/v.mp4", brand: "Elle", brandSlug: "elle", topic: "Style" }), "interest:food/videos"), false);
  assert.equal(storyMatchesLifestyleFilter(recipe, "interest:food/unknown"), false);
});

test("the Videos tab is not added twice when an interest row has its own", () => {
  assert.deepEqual(insertVideosFilter(["interest:food", "interest:food/videos"]), ["interest:food", "interest:food/videos"]);
  assert.ok(insertVideosFilter(["Food", "Home"]).includes("Videos"));
});
