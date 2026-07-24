import assert from "node:assert/strict";
import test from "node:test";
import { getRecommendationReason } from "./recommendation-reason";

test("uses the most immediate return context before preference signals", () => {
  assert.equal(
    getRecommendationReason({
      freshSinceLastVisit: true,
      followedTopic: "Home",
      followedBrand: "House Beautiful",
      daypart: "morning",
    }),
    "New since your last visit"
  );
});

test("names the exact followed topic or brand when it drives the recommendation", () => {
  assert.equal(
    getRecommendationReason({ followedTopic: "Fitness" }),
    "Because you follow Fitness"
  );
  assert.equal(
    getRecommendationReason({ followedBrand: "Car and Driver" }),
    "Because you follow Car and Driver"
  );
});

test("uses concise daypart and editorial explanations", () => {
  assert.equal(getRecommendationReason({ daypart: "lateNight" }), "Late-night pick");
  assert.equal(getRecommendationReason({ editorSelected: true }), "Editor-selected for today");
});

test("falls back to a truthful popularity explanation", () => {
  assert.equal(getRecommendationReason({}), "Popular across Hearst");
});
