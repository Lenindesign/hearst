import assert from "node:assert/strict";
import test from "node:test";
import { canOptimizeImageSrc } from "./remote-image-patterns";

test("allowed remote hosts and local paths can be resized", () => {
  assert.equal(canOptimizeImageSrc("https://hips.hearstapps.com/hmg-prod/images/a.jpg"), true);
  assert.equal(canOptimizeImageSrc("https://s.hdnux.com/photos/a.jpg"), true);
  assert.equal(canOptimizeImageSrc("https://images.sfgate.com/a.jpg"), true);
  assert.equal(canOptimizeImageSrc("/images/ads/contextual/automotive.jpg"), true);
});

test("hosts and paths outside the allow-list stay unoptimized", () => {
  assert.equal(canOptimizeImageSrc("https://example.com/a.jpg"), false);
  assert.equal(canOptimizeImageSrc("http://hips.hearstapps.com/a.jpg"), false);
  assert.equal(canOptimizeImageSrc("https://bringatrailer.com/elsewhere/a.jpg"), false);
  assert.equal(canOptimizeImageSrc("https://a.b.sfgate.com/a.jpg"), false);
  assert.equal(canOptimizeImageSrc("//hips.hearstapps.com/a.jpg"), false);
  assert.equal(canOptimizeImageSrc(undefined), false);
  assert.equal(canOptimizeImageSrc("not a url"), false);
});
