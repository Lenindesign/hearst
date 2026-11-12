#!/usr/bin/env node
// Story routes regression (APP_RULES.md › Story routes).
// Opens a river story deep in the Hearst+ feed and closes it by the Close
// button, Escape and Back. The page under the reader must not move, the card
// must stay put to the pixel, the address must round-trip through /read/, and
// focus must return to the card's opener.
//
// Usage: HEARST_APP_URL=http://localhost:3000 node scripts/test-reader-return.mjs
import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = (process.env.HEARST_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
const depth = 2600;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${baseUrl}/hearst-plus/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
await page.waitForTimeout(5000);
await page.evaluate((y) => window.scrollTo(0, y), depth);
await page.waitForTimeout(4000);

const cards = page.locator('#hearst-story-river article[data-story-id]:not([data-story-module="featured-story"])');
const index = await cards.evaluateAll((elements) => {
  let best = -1;
  let bestDistance = Infinity;
  elements.forEach((element, i) => {
    if (!element.querySelector('button[aria-label^="Open story:"]')) return;
    const rect = element.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - innerHeight / 2);
    if (distance < bestDistance) { bestDistance = distance; best = i; }
  });
  return best;
});
assert.ok(index >= 0, "a river story card should be near the middle of the viewport");
const card = cards.nth(index);
const storyId = await card.getAttribute("data-story-id");
const opener = card.locator('button[aria-label^="Open story:"]').first();
const openerLabel = await opener.getAttribute("aria-label");

const measure = () => page.evaluate((id) => {
  const element = document.querySelector(`#hearst-story-river [data-story-id="${id}"]:not([data-story-module="featured-story"])`);
  return {
    y: Math.round(window.scrollY),
    top: element ? Math.round(element.getBoundingClientRect().top) : null,
    path: window.location.pathname,
    dialog: Boolean(document.querySelector('[role="dialog"][aria-label="Story reader"]')),
    focus: document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName,
  };
}, storyId);

const before = await measure();
const results = [];

for (const close of ["button", "escape", "back"]) {
  // A real pointer click (no automatic scroll-into-view) on the card.
  const box = await card.boundingBox();
  await page.mouse.click(box.x + box.width * 0.3, box.y + box.height / 2);
  await page.waitForTimeout(1200);
  const open = await measure();
  assert.ok(open.dialog, `${close}: the reader should open`);
  assert.ok(open.path.startsWith("/read/"), `${close}: the address should change to /read/ (got ${open.path})`);
  assert.equal(open.y, before.y, `${close}: opening must not scroll the page`);

  if (close === "button") await page.getByRole("button", { name: "Close story reader" }).click();
  if (close === "escape") await page.keyboard.press("Escape");
  if (close === "back") await page.goBack();
  await page.waitForTimeout(1500);

  const after = await measure();
  assert.equal(after.dialog, false, `${close}: the reader should close`);
  assert.equal(after.path, before.path, `${close}: the address should return to ${before.path}`);
  assert.equal(after.y, before.y, `${close}: scroll must be unchanged (${before.y} → ${after.y})`);
  assert.equal(after.top, before.top, `${close}: the card must not move (${before.top} → ${after.top})`);
  if (close !== "back") assert.equal(after.focus, openerLabel, `${close}: focus should return to the opener`);
  results.push({ close, y: after.y, top: after.top, focus: after.focus === openerLabel });
}

await browser.close();
console.log(JSON.stringify({ storyId, before: { y: before.y, top: before.top }, results }, null, 2));
