import assert from "node:assert/strict";
import test from "node:test";

import { mixHearstInternationalStories, type HearstInternationalMixStory } from "./hearst-international-mix";

function feed(country: string, brand: string, count: number): HearstInternationalMixStory[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${brand}-${index}`,
    brand,
    title: `${brand} ${index}`,
    url: `https://example.test/${brand}/${index}`,
    description: "",
    publishedAt: null,
    imageUrl: null,
    country,
    feedUrl: `https://example.test/${brand}/`,
  }));
}

test("the international mix alternates countries and takes each edition's newest stories first", () => {
  const mixed = mixHearstInternationalStories([
    feed("ES", "Elle ES", 3),
    feed("ES", "Esquire ES", 3),
    feed("IT", "Elle IT", 3),
    feed("JP", "Elle JP", 3),
    [],
  ]);

  assert.deepEqual(mixed.slice(0, 4).map((story) => story.brand), ["Elle ES", "Elle IT", "Elle JP", "Esquire ES"]);
  assert.deepEqual(mixed.slice(0, 4).map((story) => story.title.endsWith(" 0")), [true, true, true, true]);
  assert.equal(mixed.length, 12);
  assert.notEqual(mixed[0].country, mixed[1].country);
});

test("the international mix drops duplicate URLs and respects the limit", () => {
  const duplicate = feed("NL", "Quest NL", 2);
  const mixed = mixHearstInternationalStories([duplicate, duplicate, feed("UK", "Elle UK", 5)], 4);
  assert.equal(mixed.length, 4);
  assert.equal(new Set(mixed.map((story) => story.url)).size, mixed.length);
});
