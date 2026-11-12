#!/usr/bin/env node
// Loading skeleton regression (STYLE.md › Loading states).
// Renders /hearst-plus/ twice per width: once with JavaScript off (the server
// render, which is the loading skeleton) and once loaded. Every box the
// skeleton draws must match the content that replaces it, so the page does
// not jump when the feed arrives.
//
// Usage: HEARST_APP_URL=http://localhost:3000 node scripts/test-skeleton-match.mjs
import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = (process.env.HEARST_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
const url = `${baseUrl}/hearst-plus/`;
const widths = [390, 768, 1140, 1280, 1440];
const tolerance = 1;

const measure = (page, loaded) => page.evaluate((loaded) => {
  const box = (element) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return [Math.round(rect.left), Math.round(rect.top + window.scrollY), Math.round(rect.width), Math.round(rect.height)];
  };
  if (!loaded) {
    const grid = document.querySelector('[aria-label="Loading your personalized feed"] .grid');
    const columns = grid ? [...grid.children] : [];
    const main = columns.find((column) => column.tagName === "MAIN");
    const carousel = main?.children[1];
    const rightCards = [...(columns[2]?.firstElementChild?.children ?? [])];
    return {
      trending: box(columns[0]?.firstElementChild?.firstElementChild),
      carousel: box(carousel),
      photo: box(carousel?.querySelector(".aspect-\\[5\\/3\\]")),
      panel: box(carousel?.querySelector(".z-10")),
      firstCard: box(main?.children[2]),
      railAd: box(rightCards.find((card) => card.getBoundingClientRect().height >= 500)),
    };
  }
  const carousel = document.querySelector('[data-story-module="todays-picks"], [data-story-module="featured"]');
  const active = carousel && [...carousel.querySelectorAll('article[data-story-module="featured-story"]')].find((slide) => !slide.inert);
  return {
    trending: box(document.querySelector('[data-story-module="trending"]')),
    carousel: box(carousel),
    photo: box(active?.querySelector(".featured-carousel-photo")),
    panel: box(active?.querySelector("[data-slider-content]")),
    firstCard: box(document.querySelector('#hearst-story-river article[data-story-id]:not([data-story-module="featured-story"])')),
    railAd: box(document.querySelector('aside[aria-label^="Advertisement"]')),
  };
}, loaded);

const browser = await chromium.launch();
const failures = [];
for (const width of widths) {
  const skeletonContext = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled: false });
  const skeletonPage = await skeletonContext.newPage();
  await skeletonPage.goto(url, { waitUntil: "load", timeout: 120_000 });
  const skeleton = await measure(skeletonPage, false);
  await skeletonContext.close();

  const loadedContext = await browser.newContext({ viewport: { width, height: 900 } });
  const loadedPage = await loadedContext.newPage();
  await loadedPage.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await loadedPage.waitForTimeout(5000);
  const loaded = await measure(loadedPage, true);
  await loadedContext.close();

  for (const key of Object.keys(loaded)) {
    const a = skeleton[key];
    const b = loaded[key];
    if (a === null && b === null) continue;
    const same = a && b && a.every((value, i) => Math.abs(value - b[i]) <= tolerance);
    if (!same) failures.push(`${width}px ${key}: skeleton ${JSON.stringify(a)} vs loaded ${JSON.stringify(b)}`);
  }
  console.log(`${width}px`, JSON.stringify(loaded));
}
await browser.close();

assert.deepEqual(failures, [], `Skeleton boxes differ from the loaded layout:\n${failures.join("\n")}`);
console.log(`Skeleton matches the loaded layout at ${widths.join(", ")}px (±${tolerance}px).`);
