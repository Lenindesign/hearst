import assert from "node:assert/strict";
import test from "node:test";
import {
  completedReadingProgress,
  getContinueReadingStoryIds,
  normalizeReadingHistory,
  updateReadingHistory,
} from "./reading-history";

test("normalizes, deduplicates, clamps, and sorts reading history", () => {
  assert.deepEqual(
    normalizeReadingHistory([
      { storyId: "older", progress: -1, lastOpenedAt: 10 },
      { storyId: "newer", progress: 2, lastOpenedAt: 20 },
      { storyId: "newer", progress: 0.4, lastOpenedAt: 5 },
      { storyId: "", progress: 0.2, lastOpenedAt: 30 },
      null,
    ]),
    [
      { storyId: "newer", progress: 1, lastOpenedAt: 20 },
      { storyId: "older", progress: 0, lastOpenedAt: 10 },
    ]
  );
});

test("opening an existing story preserves its progress and moves it to the front", () => {
  const history = [
    { storyId: "first", progress: 0.45, lastOpenedAt: 10 },
    { storyId: "second", progress: 0.2, lastOpenedAt: 20 },
  ];

  assert.deepEqual(updateReadingHistory(history, "first", undefined, 30), [
    { storyId: "first", progress: 0.45, lastOpenedAt: 30 },
    { storyId: "second", progress: 0.2, lastOpenedAt: 20 },
  ]);
});

test("continue reading includes only opened stories below the completion threshold", () => {
  assert.deepEqual(
    getContinueReadingStoryIds([
      { storyId: "started", progress: 0.4, lastOpenedAt: 30 },
      { storyId: "completed", progress: completedReadingProgress, lastOpenedAt: 20 },
      { storyId: "unread", progress: 0, lastOpenedAt: 10 },
    ]),
    ["started", "unread"]
  );
});

test("small progress changes do not create a storage update", () => {
  const history = [{ storyId: "story", progress: 0.4, lastOpenedAt: 10 }];
  assert.deepEqual(updateReadingHistory(history, "story", 0.41, 20), history);
});
