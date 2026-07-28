import { createReadStream } from "node:fs";
import { access, mkdir, readdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const updateBaselines = process.argv.includes("--update");
const requestedCaseName = process.argv
  .find((argument) => argument.startsWith("--case="))
  ?.slice("--case=".length);
const staticRoot = resolve("storybook-static");
const baselineRoot = resolve("tests/visual-baselines");
const failureRoot = resolve("output/playwright/visual-regression");
const pixelThreshold = 32;
const maxChangedRatio = 0.02;

const cases = [
  {
    name: "button-all-variants-720",
    id: "hearst-plus-hds-primitives-button--all-variants",
    viewport: { width: 720, height: 520 },
  },
  {
    name: "input-error-480",
    id: "hearst-plus-hds-primitives-input--with-error",
    viewport: { width: 480, height: 360 },
  },
  {
    name: "special-offers-390",
    id: "hearst-plus-hds-primitives-special-offers--default",
    viewport: { width: 390, height: 420 },
  },
  {
    name: "feed-retry-error-600",
    id: "hearst-plus-components-feed-states--error-state",
    viewport: { width: 600, height: 420 },
  },
  {
    name: "onboarding-docs-390",
    id: "hearst-plus-product-onboarding-journey--docs",
    viewMode: "docs",
    viewport: { width: 390, height: 844 },
    settleMs: 500,
  },
  {
    name: "onboarding-interests-1280",
    id: "hearst-plus-product-onboarding--interests",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 900 },
    readySelector: '[role="dialog"][aria-labelledby="hearst-onboarding-title"]',
    settleMs: 300,
  },
  {
    name: "onboarding-brands-1280",
    id: "hearst-plus-product-onboarding--trusted-brands",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 900 },
    readySelector: '[role="dialog"][aria-labelledby="hearst-onboarding-title"]',
    settleMs: 300,
  },
  {
    name: "onboarding-mobile-320",
    id: "hearst-plus-product-onboarding--responsive-mobile",
    globals: "brand:hearst-all",
    viewport: { width: 320, height: 844 },
    readySelector: '[role="dialog"][aria-labelledby="hearst-onboarding-title"]',
    settleMs: 300,
  },
  {
    name: "article-card-production-compact-390",
    id: "hearst-plus-hds-primitives-article-card--small",
    viewport: { width: 390, height: 844 },
    fullPage: true,
  },
  {
    name: "article-river-card-320",
    id: "hearst-plus-components-editorial-cards--article-river-card",
    globals: "brand:hearst-lifestyle",
    viewport: { width: 320, height: 844 },
    fullPage: true,
  },
  {
    name: "story-actions-mobile-390",
    id: "hearst-plus-components-story-actions--mobile",
    globals: "brand:hearst-all",
    viewport: { width: 390, height: 420 },
  },
  {
    name: "story-actions-focus-after-hide-1280",
    id: "hearst-plus-components-story-actions--focus-after-hide",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 520 },
  },
  {
    name: "production-modules-compact-grid-320",
    id: "hearst-plus-components-production-modules--compact-grid",
    globals: "brand:cosmopolitan",
    viewport: { width: 320, height: 844 },
    fullPage: true,
  },
  {
    name: "lifestyle-destination-home-390",
    id: "apps-lifestyle-destination--daily-home",
    viewport: { width: 390, height: 844 },
    fullPage: true,
  },
  {
    name: "lifestyle-destination-home-320",
    id: "apps-lifestyle-destination--daily-home",
    viewport: { width: 320, height: 844 },
  },
  {
    name: "production-modules-feature-768",
    id: "hearst-plus-components-production-modules--feature",
    viewport: { width: 768, height: 900 },
    fullPage: true,
  },
  {
    name: "lifestyle-destination-home-1280",
    id: "apps-lifestyle-destination--daily-home",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "vertical-video-carousel-390",
    id: "hearst-plus-components-video-cards--delish-shorts",
    viewport: { width: 390, height: 844 },
    fullPage: true,
  },
  {
    name: "delish-shorts-viewer-mobile-390",
    id: "hearst-plus-components-delish-shorts-viewer--open-viewer",
    globals: "brand:delish",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "delish-shorts-viewer-single-1280",
    id: "hearst-plus-components-delish-shorts-viewer--single-short",
    globals: "brand:delish",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "videos-navigation-dark-390",
    id: "hearst-plus-components-navigation--videos-navigation",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "videos-feed-dark-390",
    id: "hearst-plus-product-for-you-feed--videos-feed",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "videos-feed-dark-1280",
    id: "hearst-plus-product-for-you-feed--videos-feed",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "reader-success-elle-390",
    id: "hearst-plus-components-reader-overlays--content-reader",
    globals: "brand:elle",
    viewport: { width: 390, height: 844 },
    readySelector: '[role="dialog"][aria-label="Story reader"]',
    settleMs: 800,
  },
  {
    name: "reader-action-bar-default-390",
    id: "hearst-plus-components-reader-controls--default",
    globals: "brand:elle",
    viewport: { width: 390, height: 420 },
  },
  {
    name: "reader-action-bar-premium-ready-1280",
    id: "hearst-plus-components-reader-controls--premium-ready",
    globals: "brand:elle",
    viewport: { width: 1280, height: 420 },
  },
  {
    name: "reader-article-body-ready-390",
    id: "hearst-plus-components-reader-body--ready",
    globals: "brand:elle",
    viewport: { width: 390, height: 844 },
    fullPage: true,
  },
  {
    name: "reader-image-viewer-gallery-390",
    id: "hearst-plus-components-reader-image-viewer--gallery",
    globals: "brand:elle",
    viewport: { width: 390, height: 844 },
    neutralizeSelectors: ['[role="dialog"] img'],
  },
  {
    name: "ambient-reader-esquire-390",
    id: "hearst-plus-components-ambient-reader--default",
    globals: "brand:esquire",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "discovery-sidebar-publication-1280",
    id: "hearst-plus-components-discovery-sidebar--publication-inventory",
    globals: "brand:cosmopolitan",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "trending-articles-lifestyle-1280",
    id: "hearst-plus-components-trending-rails--cross-brand-articles",
    globals: "brand:hearst-lifestyle",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "trending-articles-lifestyle-390",
    id: "hearst-plus-components-trending-rails--cross-brand-articles",
    globals: "brand:hearst-lifestyle",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "trending-videos-1280",
    id: "hearst-plus-components-trending-rails--video-rail",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "trending-videos-390",
    id: "hearst-plus-components-trending-rails--video-rail",
    globals: "brand:hearst-all",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "todays-edit-complete-1280",
    id: "hearst-plus-components-today-s-edit--complete-allocation",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 500 },
  },
  {
    name: "todays-edit-tablet-768",
    id: "hearst-plus-components-today-s-edit--complete-allocation",
    globals: "brand:hearst-all",
    viewport: { width: 768, height: 500 },
  },
  {
    name: "todays-edit-minimal-1280",
    id: "hearst-plus-components-today-s-edit--minimal-allocation",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 500 },
  },
  {
    name: "featured-carousel-mixed-1280",
    id: "hearst-plus-components-featured-carousel--todays-picks",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 760 },
  },
  {
    name: "featured-carousel-mobile-390",
    id: "hearst-plus-components-featured-carousel--mobile",
    globals: "brand:hearst-all",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "featured-carousel-saved-1280",
    id: "hearst-plus-components-featured-carousel--saved-story",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 760 },
  },
  {
    name: "river-advertisement-prototype-1280",
    id: "hearst-plus-components-river-advertisement--prototype-creative",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 520 },
  },
  {
    name: "river-advertisement-prototype-320",
    id: "hearst-plus-components-river-advertisement--prototype-creative",
    globals: "brand:hearst-all",
    viewport: { width: 320, height: 720 },
    fullPage: true,
  },
  {
    name: "brand-spotlight-production-1280",
    id: "hearst-plus-components-brand-spotlight--default",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "brand-spotlight-production-320",
    id: "hearst-plus-components-brand-spotlight--default",
    globals: "brand:hearst-all",
    viewport: { width: 320, height: 844 },
    fullPage: true,
  },
  {
    name: "typography-elle-390",
    id: "hearst-plus-foundation-typography--font-families",
    globals: "brand:elle",
    viewport: { width: 390, height: 844 },
  },
  {
    name: "stakeholder-personalization-console-1280",
    id: "hearst-plus-product-stakeholder-personalization-console--desktop-open",
    globals: "brand:hearst-all",
    viewport: { width: 1280, height: 900 },
    readySelector:
      '[role="dialog"][aria-labelledby="stakeholder-personalization-console-title"]',
  },
  {
    name: "stakeholder-personalization-console-320",
    id: "hearst-plus-product-stakeholder-personalization-console--responsive-mobile",
    globals: "brand:hearst-all",
    viewport: { width: 320, height: 844 },
    readySelector:
      '[role="dialog"][aria-labelledby="stakeholder-personalization-console-title"]',
  },
];
const selectedCases = requestedCaseName
  ? cases.filter((visualCase) => visualCase.name === requestedCaseName)
  : cases;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function startStaticServer() {
  return new Promise((resolveServer, reject) => {
    const server = createServer(async (request, response) => {
      try {
        const requestPath = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
        const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
        const filePath = normalize(join(staticRoot, relativePath));

        if (!filePath.startsWith(staticRoot)) {
          response.writeHead(403).end("Forbidden");
          return;
        }

        await access(filePath);
        response.setHeader("Content-Type", mimeTypes[extname(filePath)] || "application/octet-stream");
        createReadStream(filePath).pipe(response);
      } catch {
        response.writeHead(404).end("Not found");
      }
    });

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not resolve the Storybook test server address."));
        return;
      }
      resolveServer({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function comparePngs(baselinePath, actualBuffer) {
  const baseline = await sharp(baselinePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const actual = await sharp(actualBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  if (baseline.info.width !== actual.info.width || baseline.info.height !== actual.info.height) {
    return {
      changedRatio: 1,
      reason: `dimensions changed from ${baseline.info.width}x${baseline.info.height} to ${actual.info.width}x${actual.info.height}`,
    };
  }

  let changedPixels = 0;
  const pixelCount = baseline.info.width * baseline.info.height;
  for (let offset = 0; offset < baseline.data.length; offset += 4) {
    const red = Math.abs(baseline.data[offset] - actual.data[offset]);
    const green = Math.abs(baseline.data[offset + 1] - actual.data[offset + 1]);
    const blue = Math.abs(baseline.data[offset + 2] - actual.data[offset + 2]);
    const alpha = Math.abs(baseline.data[offset + 3] - actual.data[offset + 3]);
    if (Math.max(red, green, blue, alpha) > pixelThreshold) changedPixels++;
  }

  return { changedRatio: changedPixels / pixelCount };
}

async function captureCase(browser, origin, visualCase) {
  const context = await browser.newContext({
    viewport: visualCase.viewport,
    deviceScaleFactor: 1,
    timezoneId: "America/Los_Angeles",
  });
  const page = await context.newPage();
  // Production personalization is daypart-aware. Pin the review clock to the
  // evening state represented by the approved baselines so a run crossing
  // 10 p.m. cannot silently change ranked content.
  await page.clock.setFixedTime(new Date("2026-07-26T20:00:00-07:00"));
  const browserErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  const viewMode = visualCase.viewMode || "story";
  const storyUrl = new URL("/iframe.html", origin);
  storyUrl.searchParams.set("id", visualCase.id);
  storyUrl.searchParams.set("viewMode", viewMode);
  if (viewMode === "story") storyUrl.searchParams.set("instrument", "true");
  if (visualCase.globals) storyUrl.searchParams.set("globals", visualCase.globals);
  await page.goto(storyUrl.toString(), {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  const rootSelector = viewMode === "docs" ? "#storybook-docs" : "#storybook-root";
  await page.locator(rootSelector).waitFor({ state: "visible", timeout: 30_000 });
  await page.locator(`${rootSelector} > *`).first().waitFor({ state: "visible", timeout: 30_000 });
  if (viewMode === "story") {
    await page.waitForFunction(
      (storyId) =>
        globalThis.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__?.[storyId]
          ?.renderPhase === "finished",
      visualCase.id,
      { timeout: 30_000 },
    );
  }
  if (visualCase.readySelector) {
    await page.locator(visualCase.readySelector).waitFor({
      state: "visible",
      timeout: 30_000,
    });
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolveImage) => {
              image.addEventListener("load", resolveImage, { once: true });
              image.addEventListener("error", resolveImage, { once: true });
            }),
      ),
    );
    await Promise.all(
      [...document.images].map((image) => image.decode?.().catch(() => undefined)),
    );

    const backgroundImageUrls = new Set();
    const collectBackgroundImageUrls = (backgroundImage) => {
      for (const match of backgroundImage.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
        if (match[2]) backgroundImageUrls.add(match[2]);
      }
    };

    for (const element of document.querySelectorAll("*")) {
      collectBackgroundImageUrls(getComputedStyle(element).backgroundImage);
      collectBackgroundImageUrls(getComputedStyle(element, "::before").backgroundImage);
      collectBackgroundImageUrls(getComputedStyle(element, "::after").backgroundImage);
    }

    await Promise.all(
      [...backgroundImageUrls].map(async (source) => {
        const image = new Image();
        await new Promise((resolveImage) => {
          image.addEventListener("load", resolveImage, { once: true });
          image.addEventListener("error", resolveImage, { once: true });
          image.src = source;
          if (image.complete) resolveImage();
        });
        image.src = source;
        await image.decode?.().catch(() => undefined);
      }),
    );
    await new Promise((resolveFrame) =>
      requestAnimationFrame(() => requestAnimationFrame(resolveFrame)),
    );
  });
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;caret-color:transparent!important;transition:none!important}",
  });
  await page.waitForTimeout(visualCase.settleMs ?? 100);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  if (hasHorizontalOverflow) {
    throw new Error(`${visualCase.name} has horizontal overflow at ${visualCase.viewport.width}px.`);
  }

  for (const selector of visualCase.neutralizeSelectors ?? []) {
    await page.locator(selector).evaluateAll((elements) => {
      for (const element of elements) {
        element.style.visibility = "hidden";
      }
    });
  }

  const screenshot = await page.screenshot({
    animations: "disabled",
    fullPage: Boolean(visualCase.fullPage),
  });
  await context.close();

  if (browserErrors.length > 0) {
    throw new Error(`${visualCase.name} emitted browser errors:\n${browserErrors.join("\n")}`);
  }

  return screenshot;
}

async function run() {
  if (requestedCaseName && selectedCases.length === 0) {
    throw new Error(`Unknown visual case: ${requestedCaseName}`);
  }

  await access(join(staticRoot, "index.html")).catch(() => {
    throw new Error("storybook-static is missing. Run `npm run build-storybook` first.");
  });
  await mkdir(baselineRoot, { recursive: true });
  const expectedBaselineFiles = new Set(cases.map((visualCase) => `${visualCase.name}.png`));
  const orphanedBaselines = (await readdir(baselineRoot))
    .filter((file) => file.endsWith(".png") && !expectedBaselineFiles.has(file));
  if (orphanedBaselines.length > 0) {
    throw new Error(
      `Orphaned visual baselines are not tied to a current production-backed case:\n${orphanedBaselines.join("\n")}`,
    );
  }
  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const visualCase of selectedCases) {
      let actual = await captureCase(browser, origin, visualCase);
      const baselinePath = join(baselineRoot, `${visualCase.name}.png`);

      if (updateBaselines) {
        await writeFile(baselinePath, actual);
        results.push({ name: visualCase.name, status: "updated" });
        continue;
      }

      await access(baselinePath).catch(() => {
        throw new Error(`Missing baseline ${baselinePath}. Run \`npm run test:visual:update\`.`);
      });
      let comparison = await comparePngs(baselinePath, actual);
      for (
        let retry = 0;
        retry < 2 && comparison.changedRatio > maxChangedRatio;
        retry++
      ) {
        const retryActual = await captureCase(browser, origin, visualCase);
        const retryComparison = await comparePngs(baselinePath, retryActual);
        if (retryComparison.changedRatio < comparison.changedRatio) {
          actual = retryActual;
          comparison = retryComparison;
        }
      }
      const passed = comparison.changedRatio <= maxChangedRatio;
      results.push({
        name: visualCase.name,
        status: passed ? "passed" : "failed",
        changedPercent: Number((comparison.changedRatio * 100).toFixed(3)),
        reason: comparison.reason,
      });

      if (!passed) {
        await mkdir(failureRoot, { recursive: true });
        await writeFile(join(failureRoot, `${visualCase.name}-actual.png`), actual);
      }
    }
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }

  console.log(JSON.stringify({ passed: results.every((result) => result.status !== "failed"), results }, null, 2));
  if (results.some((result) => result.status === "failed")) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
