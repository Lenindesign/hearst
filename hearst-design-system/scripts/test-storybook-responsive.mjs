import { createReadStream } from "node:fs";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "playwright";

const staticRoot = resolve("storybook-static");
const reportPath = resolve("reports/storybook-responsive.json");
const viewportWidths = [320, 390, 768, 1280];
const viewportHeight = 900;
const overflowTolerance = 1;

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
        const requestPath = decodeURIComponent(
          new URL(request.url || "/", "http://localhost").pathname,
        );
        const relativePath =
          requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
        const filePath = normalize(join(staticRoot, relativePath));

        if (!filePath.startsWith(staticRoot)) {
          response.writeHead(403).end("Forbidden");
          return;
        }

        await access(filePath);
        response.setHeader(
          "Content-Type",
          mimeTypes[extname(filePath)] || "application/octet-stream",
        );
        createReadStream(filePath).pipe(response);
      } catch {
        response.writeHead(404).end("Not found");
      }
    });

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not resolve the Storybook responsive test server."));
        return;
      }
      resolveServer({
        server,
        origin: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

async function getStoryEntries() {
  const index = JSON.parse(
    await readFile(join(staticRoot, "index.json"), "utf-8"),
  );
  return Object.values(index.entries)
    .filter((entry) => entry.type === "story")
    .sort((a, b) => a.id.localeCompare(b.id));
}

async function inspectStory(page, origin, entry, width) {
  const browserErrors = [];
  const onPageError = (error) => browserErrors.push(error.message);
  page.on("pageerror", onPageError);

  try {
    const storyUrl = new URL("/iframe.html", origin);
    storyUrl.searchParams.set("id", entry.id);
    storyUrl.searchParams.set("viewMode", "story");
    await page.goto(storyUrl.toString(), {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await page.locator("#storybook-root").waitFor({
      state: "visible",
      timeout: 30_000,
    });
    await page.locator("#storybook-root > *").first().waitFor({
      state: "visible",
      timeout: 30_000,
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const pageState = await page.evaluate((tolerance) => {
      const viewportRight = window.innerWidth + tolerance;
      const scrollWidth = document.documentElement.scrollWidth;
      const hasHorizontalOverflow = scrollWidth > viewportRight;
      const overflowElements = hasHorizontalOverflow
        ? [...document.querySelectorAll("body *")]
            .filter((element) => {
              const style = window.getComputedStyle(element);
              if (style.position === "fixed") return false;
              const rect = element.getBoundingClientRect();
              return rect.right > viewportRight || rect.left < -tolerance;
            })
            .slice(0, 5)
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                tag: element.tagName.toLowerCase(),
                className: element.className?.toString().slice(0, 120) || "",
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
              };
            })
        : [];

      return {
        hasErrorDisplay: document.body.classList.contains("sb-show-errordisplay"),
        hasHorizontalOverflow,
        overflowElements,
        scrollWidth,
      };
    }, overflowTolerance);

    const failures = [];
    if (pageState.hasErrorDisplay) {
      failures.push("rendered Storybook's error display");
    }
    if (pageState.hasHorizontalOverflow) {
      failures.push(
        `horizontal overflow (${pageState.scrollWidth}px document): ${JSON.stringify(pageState.overflowElements)}`,
      );
    }
    if (browserErrors.length > 0) {
      failures.push(`browser errors: ${browserErrors.join(" | ")}`);
    }

    return failures.length === 0
      ? null
      : {
          id: entry.id,
          title: entry.title,
          name: entry.name,
          width,
          failures,
        };
  } catch (error) {
    return {
      id: entry.id,
      title: entry.title,
      name: entry.name,
      width,
      failures: [error instanceof Error ? error.message : String(error)],
    };
  } finally {
    page.off("pageerror", onPageError);
  }
}

async function inspectViewport(browser, origin, storyEntries, width) {
  const openPage = () =>
    browser.newPage({
      viewport: { width, height: viewportHeight },
      deviceScaleFactor: 1,
    });
  let page = await openPage();
  const failures = [];
  const recoveredRetries = [];

  try {
    for (const entry of storyEntries) {
      const firstFailure = await inspectStory(page, origin, entry, width);
      if (!firstFailure) continue;

      // A fresh page distinguishes a persistent story failure from state or
      // resource leakage after hundreds of sequential Storybook navigations.
      await page.close();
      page = await openPage();
      const retryFailure = await inspectStory(page, origin, entry, width);
      if (retryFailure) {
        failures.push({
          ...retryFailure,
          failures: [
            ...retryFailure.failures,
            `fresh-page retry also failed; first attempt: ${firstFailure.failures.join(" | ")}`,
          ],
        });
      } else {
        recoveredRetries.push({
          id: entry.id,
          width,
          firstAttempt: firstFailure.failures,
        });
      }
    }
  } finally {
    await page.close();
  }

  return { failures, recoveredRetries };
}

async function run() {
  await access(join(staticRoot, "index.html")).catch(() => {
    throw new Error("storybook-static is missing. Run `npm run build-storybook` first.");
  });

  const storyEntries = await getStoryEntries();
  if (storyEntries.length === 0) {
    throw new Error("No Storybook story entries were found in index.json.");
  }

  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  let failures = [];
  let recoveredRetries = [];

  try {
    const viewportResults = await Promise.all(
      viewportWidths.map((width) =>
        inspectViewport(browser, origin, storyEntries, width),
      ),
    );
    failures = viewportResults.flatMap((result) => result.failures);
    recoveredRetries = viewportResults.flatMap((result) => result.recoveredRetries);
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }

  const report = {
    passed: failures.length === 0,
    stories: storyEntries.length,
    checks: storyEntries.length * viewportWidths.length,
    viewports: viewportWidths,
    recoveredRetries,
    failures,
  };
  await mkdir(resolve("reports"), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
