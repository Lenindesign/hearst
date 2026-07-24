import assert from "node:assert/strict";
import test from "node:test";
import {
  createProductAnalyticsEvent,
  getReturnWindow,
  sanitizeAnalyticsProperties,
} from "./product-analytics";

test("getReturnWindow assigns stable retention cohorts", () => {
  assert.equal(getReturnWindow(0), "first_visit");
  assert.equal(getReturnWindow(8), "same_day");
  assert.equal(getReturnWindow(24), "d1");
  assert.equal(getReturnWindow(72), "d2_d6");
  assert.equal(getReturnWindow(168), "d7_plus");
});

test("sanitizeAnalyticsProperties removes unusable values and bounds strings", () => {
  const result = sanitizeAnalyticsProperties({
    blank: "   ",
    infinite: Number.POSITIVE_INFINITY,
    kept: "  article-123  ",
    count: 3,
    returning: false,
    long: "x".repeat(200),
  });

  assert.deepEqual(result, {
    kept: "article-123",
    count: 3,
    returning: false,
    long: "x".repeat(160),
  });
});

test("createProductAnalyticsEvent creates a vendor-neutral event envelope", () => {
  const event = createProductAnalyticsEvent(
    "story_resume",
    {
      destination: "all",
      story_id: "story-123",
      entry_point: "mobile_strip",
    },
    "session-123",
    new Date("2026-07-23T12:00:00.000Z")
  );

  assert.deepEqual(event, {
    eventName: "story_resume",
    occurredAt: "2026-07-23T12:00:00.000Z",
    sessionId: "session-123",
    properties: {
      destination: "all",
      story_id: "story-123",
      entry_point: "mobile_strip",
    },
  });
});
