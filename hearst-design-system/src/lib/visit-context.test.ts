import assert from "node:assert/strict";
import test from "node:test";
import {
  getVisitDaypart,
  resolveVisitContext,
  upsertVisitRecord,
} from "./visit-context";

test("derives the current daypart from local time", () => {
  assert.equal(getVisitDaypart(new Date(2026, 6, 23, 8)), "morning");
  assert.equal(getVisitDaypart(new Date(2026, 6, 23, 14)), "afternoon");
  assert.equal(getVisitDaypart(new Date(2026, 6, 23, 19)), "evening");
  assert.equal(getVisitDaypart(new Date(2026, 6, 23, 2)), "lateNight");
});

test("treats a missing record as a first visit at the current daypart", () => {
  assert.deepEqual(
    resolveVisitContext([], "all:all-brands", "2026-07-23", new Date(2026, 6, 23, 19)),
    {
      daypart: "evening",
      returnHours: 0,
      contentDay: "today",
    }
  );
});

test("does not turn a quick reload into a return visit", () => {
  const now = new Date(2026, 6, 23, 14);
  const records = [{
    scopeKey: "all:all-brands",
    visitedAt: now.getTime() - 10 * 60 * 1000,
    editionId: "2026-07-23",
    leadStoryId: "lead-one",
  }];

  assert.deepEqual(resolveVisitContext(records, "all:all-brands", "2026-07-23", now), {
    daypart: "afternoon",
    returnHours: 0,
    contentDay: "today",
  });
});

test("restores elapsed time and the previous lead on a same-day return", () => {
  const now = new Date(2026, 6, 23, 19);
  const records = [{
    scopeKey: "all:all-brands",
    visitedAt: now.getTime() - 4 * 60 * 60 * 1000,
    editionId: "2026-07-23",
    leadStoryId: "lead-one",
  }];

  assert.deepEqual(resolveVisitContext(records, "all:all-brands", "2026-07-23", now), {
    daypart: "evening",
    returnHours: 4,
    contentDay: "today",
    previousLeadId: "lead-one",
  });
});

test("recognizes a new edition even shortly after midnight", () => {
  const now = new Date(2026, 6, 24, 0, 5);
  const records = [{
    scopeKey: "autos:all-brands",
    visitedAt: now.getTime() - 10 * 60 * 1000,
    editionId: "2026-07-23",
    leadStoryId: "prior-autos-lead",
  }];

  assert.deepEqual(resolveVisitContext(records, "autos:all-brands", "2026-07-24", now), {
    daypart: "lateNight",
    returnHours: 1,
    contentDay: "nextDay",
    previousLeadId: "prior-autos-lead",
  });
});

test("keeps only the newest record for each destination scope", () => {
  assert.deepEqual(
    upsertVisitRecord(
      [
        { scopeKey: "all:all-brands", visitedAt: 10, editionId: "old", leadStoryId: "old-lead" },
        { scopeKey: "autos:all-brands", visitedAt: 20, editionId: "today" },
      ],
      { scopeKey: "all:all-brands", visitedAt: 30, editionId: "today", leadStoryId: "new-lead" }
    ),
    [
      { scopeKey: "all:all-brands", visitedAt: 30, editionId: "today", leadStoryId: "new-lead" },
      { scopeKey: "autos:all-brands", visitedAt: 20, editionId: "today", leadStoryId: undefined },
    ]
  );
});
