import assert from "node:assert/strict";
import test from "node:test";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { buildReaderQueue } from "@/components/hearst-plus/reader-queue";

function story(
  id: string,
  brandSlug: string,
  topic = "Design",
): LifestyleRiverStory {
  return {
    id,
    brand: brandSlug,
    brandSlug,
    topic,
    title: id,
    summary: id,
    image: "/placeholder.jpg",
    readTime: "5 min",
    popularity: 50,
    signal: "Trending",
    tags: [topic.toLowerCase()],
    age: 1,
    sourceUrl: `https://example.com/${id}`,
  };
}

test("keeps a publication-scoped queue and rotates the opened story first", () => {
  const stories = [
    story("elle-one", "elle"),
    story("elle-two", "elle"),
    story("bazaar-one", "harpers-bazaar"),
  ];

  const model = buildReaderQueue({
    stories,
    activeBrandSlug: "elle",
    openStoryId: "elle-two",
  });

  assert.deepEqual(
    model.queue.map(({ id }) => id),
    ["elle-two", "elle-one"],
  );
  assert.equal(model.currentStory?.id, "elle-two");
});

test("lets an explicit destination override take precedence over publication scope", () => {
  const stories = [
    story("elle-one", "elle"),
    story("cad-one", "car-and-driver", "Reviews"),
    story("road-track-one", "road-and-track", "Cars"),
  ];

  const model = buildReaderQueue({
    stories,
    activeBrandSlug: "elle",
    destinationOverride: "autos",
    openStoryId: "cad-one",
  });

  assert.deepEqual(
    model.stories.map(({ id }) => id),
    ["cad-one", "road-track-one"],
  );
});

test("includes a requested story that is outside the rendered river window", () => {
  const renderedStories = [story("elle-one", "elle")];
  const availableStory = story("elle-later", "elle");

  const model = buildReaderQueue({
    stories: renderedStories,
    availableStories: [availableStory],
    activeBrandSlug: "elle",
    openStoryId: "elle-later",
  });

  assert.deepEqual(
    model.queue.map(({ id }) => id),
    ["elle-later", "elle-one"],
  );
});

test("deduplicates fetched stories before building the queue", () => {
  const original = story("elle-one", "elle");
  const duplicate = { ...original, id: "duplicate-id" };

  const model = buildReaderQueue({
    stories: [original],
    fetchedStories: [duplicate],
    activeBrandSlug: "elle",
    openStoryId: "elle-one",
  });

  assert.equal(model.availableStories.length, 1);
  assert.equal(model.queue.length, 1);
});

test("returns an empty queue when the requested story is unavailable", () => {
  const model = buildReaderQueue({
    stories: [story("elle-one", "elle")],
    activeBrandSlug: "elle",
    openStoryId: "missing-story",
  });

  assert.equal(model.openIndex, -1);
  assert.deepEqual(model.queue, []);
  assert.equal(model.currentStory, undefined);
});
