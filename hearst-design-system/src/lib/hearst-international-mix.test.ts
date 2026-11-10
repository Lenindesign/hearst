import assert from "node:assert/strict";
import test from "node:test";

import {
  loadHearstInternationalMix,
  mixHearstInternationalStories,
  type HearstInternationalMixStory,
} from "./hearst-international-mix";

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

test("a slow edition misses the first response but joins the complete mix", async () => {
  const editions = [
    { name: "Elle ES", country: "ES", url: "https://example.test/Elle ES/" },
    { name: "Elle IT", country: "IT", url: "https://example.test/Elle IT/" },
    { name: "Slow JP", country: "JP", url: "https://example.test/Slow JP/" },
  ];
  const { first, complete } = loadHearstInternationalMix(editions, {
    deadlineMs: 20,
    load: async (edition) => {
      if (edition.name === "Slow JP") await new Promise((resolve) => setTimeout(resolve, 60));
      return feed(edition.country, edition.name, 8).slice(0, 6);
    },
  });

  const early = await first;
  assert.equal(early.connectedFeeds, 2);
  assert.equal(early.stories.length, 12);
  assert.ok(early.stories.every((story) => story.brand !== "Slow JP"));

  const full = await complete;
  assert.equal(full.connectedFeeds, 3);
  assert.equal(full.stories.length, 18);
});

test("an edition that fails is skipped without failing the mix", async () => {
  const { first } = loadHearstInternationalMix(
    [
      { name: "Elle UK", country: "UK", url: "https://example.test/Elle UK/" },
      { name: "Broken", country: "NL", url: "https://example.test/Broken/" },
    ],
    { load: async (edition) => (edition.name === "Broken" ? Promise.reject(new Error("timeout")) : feed("UK", "Elle UK", 6)) },
  );
  const mix = await first;
  assert.equal(mix.connectedFeeds, 1);
  assert.equal(mix.totalFeeds, 2);
});

test("once nine in ten editions have answered, stragglers get only the grace period", async () => {
  const editions = Array.from({ length: 10 }, (_, index) => ({ name: `Edition ${index}`, country: `C${index}`, url: `https://example.test/${index}/` }));
  const started = Date.now();
  const { first } = loadHearstInternationalMix(editions, {
    deadlineMs: 2000,
    graceMs: 20,
    load: async (edition) => {
      if (edition.name === "Edition 9") await new Promise((resolve) => setTimeout(resolve, 500));
      return feed(edition.country, edition.name, 6);
    },
  });
  const mix = await first;
  assert.ok(Date.now() - started < 400);
  assert.equal(mix.connectedFeeds, 9);
});
