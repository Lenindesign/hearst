import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const defaultPort = 3111;
const externalBaseUrl = process.env.HEARST_APP_URL?.replace(/\/$/, "");
let baseUrl = externalBaseUrl ?? `http://127.0.0.1:${defaultPort}`;
let appProcess;

async function waitForApp(url, timeoutMs = 60_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The local server may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Hearst+ did not become available at ${url} within ${timeoutMs}ms.`);
}

async function startAppIfNeeded() {
  if (externalBaseUrl) {
    await waitForApp(`${baseUrl}/hearst-plus/`);
    return;
  }

  try {
    const existingAppUrl = "http://127.0.0.1:3000";
    const response = await fetch(`${existingAppUrl}/hearst-plus/`, {
      signal: AbortSignal.timeout(1_000),
    });
    if (response.ok) {
      baseUrl = existingAppUrl;
      return;
    }
  } catch {
    // Start an isolated app when the conventional local port is unavailable.
  }

  appProcess = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(defaultPort)],
    {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: "development" },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let serverOutput = "";
  appProcess.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  appProcess.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  appProcess.once("exit", (code) => {
    if (code && code !== 0) {
      process.stderr.write(serverOutput);
    }
  });

  await waitForApp(`${baseUrl}/hearst-plus/`);
}

async function readSlideState(carousel) {
  return carousel.locator('button[aria-label^="Open story:"]').evaluateAll((slides) =>
    slides.map((slide) => ({
      ariaHidden: slide.getAttribute("aria-hidden"),
      inert: slide.hasAttribute("inert"),
      tabIndex: slide.tabIndex,
    }))
  );
}

async function readActiveSlideIndex(carousel) {
  return carousel.locator('button[aria-label^="Open story:"]').evaluateAll((slides) =>
    slides.findIndex((slide) => slide.getAttribute("aria-hidden") === "false")
  );
}

async function verifyViewport(browser, width) {
  const context = await browser.newContext({
    viewport: { width, height: width <= 390 ? 780 : 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/hearst-plus/`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });

  const carousel = page.locator(
    'article[aria-roledescription="carousel"][aria-label="Today’s Picks"]'
  );
  await carousel.waitFor({ state: "visible" });

  const slides = carousel.locator('button[aria-label^="Open story:"]');
  const indicators = carousel.locator('button[aria-label^="Show story "]');
  const slideCount = await slides.count();
  assert.equal(slideCount, 5, `${width}px should render five Today’s Picks slides.`);
  assert.equal(
    await indicators.count(),
    slideCount,
    `${width}px should provide one named selector for every slide.`
  );

  for (let index = 0; index < slideCount; index += 1) {
    await indicators.nth(index).focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(
      ({ selector, activeIndex }) => {
        const root = document.querySelector(selector);
        const activeSlide = root?.querySelectorAll('button[aria-label^="Open story:"]')[activeIndex];
        return activeSlide?.getAttribute("aria-hidden") === "false";
      },
      {
        selector: 'article[aria-roledescription="carousel"][aria-label="Today’s Picks"]',
        activeIndex: index,
      }
    );

    const states = await readSlideState(carousel);
    const operableSlides = states
      .map((state, slideIndex) => ({ ...state, slideIndex }))
      .filter((state) => state.ariaHidden !== "true" && !state.inert && state.tabIndex === 0);

    assert.deepEqual(
      operableSlides.map((state) => state.slideIndex),
      [index],
      `${width}px transition ${index + 1} should expose only its active slide.`
    );

    states.forEach((state, slideIndex) => {
      if (slideIndex === index) {
        assert.equal(state.ariaHidden, "false");
        assert.equal(state.inert, false);
        assert.equal(state.tabIndex, 0);
        return;
      }
      assert.equal(state.ariaHidden, "true");
      assert.equal(state.inert, true);
      assert.equal(state.tabIndex, -1);
    });

    assert.equal(
      await indicators.nth(index).getAttribute("aria-current"),
      "true",
      `${width}px transition ${index + 1} should identify the current selector.`
    );
  }

  await indicators.first().focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(
    (selector) => {
      const root = document.querySelector(selector);
      const firstSlide = root?.querySelector('button[aria-label^="Open story:"]');
      return firstSlide?.getAttribute("aria-hidden") === "false";
    },
    'article[aria-roledescription="carousel"][aria-label="Today’s Picks"]'
  );

  const swipeStage = carousel.getByTestId("featured-story-track");
  const swipeBox = await swipeStage.boundingBox();
  assert.ok(swipeBox, `${width}px should expose the featured-story swipe track.`);
  await page.mouse.move(swipeBox.x + swipeBox.width * 0.78, swipeBox.y + swipeBox.height * 0.45);
  await page.mouse.down();
  await page.mouse.move(swipeBox.x + swipeBox.width * 0.22, swipeBox.y + swipeBox.height * 0.45, {
    steps: 8,
  });
  await page.mouse.up();
  await page.waitForFunction(
    (selector) => {
      const root = document.querySelector(selector);
      const secondSlide = root?.querySelectorAll('button[aria-label^="Open story:"]')[1];
      return secondSlide?.getAttribute("aria-hidden") === "false";
    },
    'article[aria-roledescription="carousel"][aria-label="Today’s Picks"]'
  );
  assert.equal(
    await readActiveSlideIndex(carousel),
    1,
    `${width}px horizontal drag should snap to the next featured story.`
  );
  await swipeStage.dispatchEvent("pointerdown", {
    pointerId: 7,
    pointerType: "touch",
    isPrimary: true,
    clientX: swipeBox.x + swipeBox.width * 0.78,
    clientY: swipeBox.y + swipeBox.height * 0.45,
    button: 0,
    buttons: 1,
  });
  await swipeStage.dispatchEvent("pointermove", {
    pointerId: 7,
    pointerType: "touch",
    isPrimary: true,
    clientX: swipeBox.x + swipeBox.width * 0.2,
    clientY: swipeBox.y + swipeBox.height * 0.45,
    button: 0,
    buttons: 1,
  });
  await swipeStage.dispatchEvent("pointerup", {
    pointerId: 7,
    pointerType: "touch",
    isPrimary: true,
    clientX: swipeBox.x + swipeBox.width * 0.2,
    clientY: swipeBox.y + swipeBox.height * 0.45,
    button: 0,
    buttons: 0,
  });
  await page.waitForFunction(
    (selector) => {
      const root = document.querySelector(selector);
      const thirdSlide = root?.querySelectorAll('button[aria-label^="Open story:"]')[2];
      return thirdSlide?.getAttribute("aria-hidden") === "false";
    },
    'article[aria-roledescription="carousel"][aria-label="Today’s Picks"]'
  );
  assert.equal(
    await readActiveSlideIndex(carousel),
    2,
    `${width}px touch-pointer swipe should snap to the next featured story without activating the slide.`
  );
  await page.mouse.move(swipeBox.x + swipeBox.width * 0.5, swipeBox.y + swipeBox.height * 0.45);
  await page.mouse.wheel(-220, 0);
  await page.waitForFunction(
    (selector) => {
      const root = document.querySelector(selector);
      const secondSlide = root?.querySelectorAll('button[aria-label^="Open story:"]')[1];
      return secondSlide?.getAttribute("aria-hidden") === "false";
    },
    'article[aria-roledescription="carousel"][aria-label="Today’s Picks"]'
  );
  assert.equal(
    await readActiveSlideIndex(carousel),
    1,
    `${width}px reverse horizontal wheel should move to the previous featured story instead of escaping the carousel.`
  );

  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.equal(documentWidth, width, `${width}px should not introduce horizontal page overflow.`);
  await context.close();

  return { width, slideCount, transitionsChecked: slideCount, swipeChecked: true, touchPointerChecked: true, reverseWheelChecked: true };
}

try {
  await startAppIfNeeded();
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    results.push(await verifyViewport(browser, 1280));
    results.push(await verifyViewport(browser, 320));
  } finally {
    await browser.close();
  }
  process.stdout.write(`${JSON.stringify({ passed: true, results }, null, 2)}\n`);
} finally {
  if (appProcess && !appProcess.killed) {
    appProcess.kill("SIGTERM");
  }
}
