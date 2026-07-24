import assert from "node:assert/strict";
import test from "node:test";
import {
  getLocalEditionDate,
  normalizeDailyEditionRecords,
  resolveDailyEdition,
  selectDailyEditionStoryIds,
} from "./daily-edition";

const stories = [
  { id: "lead", brand: "Elle", topic: "Style" },
  { id: "same-brand", brand: "Elle", topic: "Culture" },
  { id: "home", brand: "House Beautiful", topic: "Home" },
  { id: "fitness", brand: "Men's Health", topic: "Fitness" },
  { id: "cars", brand: "Car and Driver", topic: "Reviews" },
  { id: "food", brand: "Delish", topic: "Food" },
  { id: "wellness", brand: "Prevention", topic: "Wellness" },
];

test("builds a bounded edition that keeps the lead and favors brand and topic variety", () => {
  assert.deepEqual(selectDailyEditionStoryIds(stories, [], 5), [
    "lead",
    "home",
    "fitness",
    "cars",
    "food",
  ]);
});

test("preserves an existing edition while its stories remain available", () => {
  const existingStoryIds = ["fitness", "lead", "food"];
  assert.deepEqual(
    selectDailyEditionStoryIds(stories, existingStoryIds, 3),
    existingStoryIds
  );
});

test("fills missing persisted stories without changing the surviving order", () => {
  assert.deepEqual(
    selectDailyEditionStoryIds(stories, ["missing", "food", "lead"], 4),
    ["food", "lead", "home", "fitness"]
  );
});

test("resolves one record per edition key and preserves its creation time", () => {
  const records = resolveDailyEdition(
    [{ editionKey: "2026-07-23:all", storyIds: ["food"], createdAt: 10 }],
    "2026-07-23:all",
    stories,
    20,
    3
  );

  assert.deepEqual(records[0], {
    editionKey: "2026-07-23:all",
    storyIds: ["food", "lead", "home"],
    createdAt: 10,
  });
});

test("normalizes duplicate edition records and local calendar dates", () => {
  assert.equal(getLocalEditionDate(new Date(2026, 6, 3, 23, 30)), "2026-07-03");
  assert.deepEqual(
    normalizeDailyEditionRecords([
      { editionKey: "today", storyIds: ["a", "a", ""], createdAt: 20 },
      { editionKey: "today", storyIds: ["b"], createdAt: 10 },
    ]),
    [{ editionKey: "today", storyIds: ["a"], createdAt: 20 }]
  );
});
