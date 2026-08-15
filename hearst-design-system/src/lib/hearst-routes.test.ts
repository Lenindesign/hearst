import assert from "node:assert/strict";
import test from "node:test";

import {
  getHearstDestinationCategoryDisplayLabel,
  getHearstDestinationCategoryLabel,
  getHearstDestinationCategoryRoute,
} from "./hearst-routes";

test("keeps the house category route canonical while rendering a clearer label", () => {
  assert.equal(getHearstDestinationCategoryRoute("all", "Home"), "/hearst-plus/home/");
  assert.equal(getHearstDestinationCategoryLabel("all", "home"), "Home");
  assert.equal(getHearstDestinationCategoryDisplayLabel("all", "Home"), "House & Garden");
});

test("places the house category after Cars in the combined Hearst+ navigation", async () => {
  const { hearstDestinationCategoryLabels } = await import("./hearst-routes");
  assert.deepEqual(hearstDestinationCategoryLabels.all, [
    "For You",
    "Style",
    "Reviews",
    "Fitness",
    "Cars",
    "Home",
    "Videos",
    "Community",
    "Shopping",
    "Streaming",
    "Events",
    "Games",
  ]);
});

test("keeps the legacy plural communities label out of generated destination category routes", () => {
  assert.equal(getHearstDestinationCategoryRoute("all", "Communities"), undefined);
  assert.equal(getHearstDestinationCategoryLabel("all", "communities"), undefined);
});

test("uses the clearer house category label in Lifestyle without changing other categories", () => {
  assert.equal(getHearstDestinationCategoryDisplayLabel("lifestyle", "Home"), "House & Garden");
  assert.equal(getHearstDestinationCategoryDisplayLabel("all", "Style"), "Style");
  assert.equal(getHearstDestinationCategoryDisplayLabel("autos", "Trucks"), "Trucks");
});
