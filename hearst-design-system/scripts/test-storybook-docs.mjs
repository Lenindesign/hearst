import { createReadStream } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "playwright";

const staticRoot = resolve("storybook-static");
const viewportWidths = [390, 1280];
const viewportHeight = 900;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
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
        reject(new Error("Could not resolve the Storybook docs test server."));
        return;
      }
      resolveServer({
        server,
        origin: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

async function getDocsEntries() {
  const index = JSON.parse(
    await readFile(join(staticRoot, "index.json"), "utf-8"),
  );
  return Object.values(index.entries)
    .filter((entry) => entry.type === "docs")
    .sort((a, b) => a.id.localeCompare(b.id));
}

async function inspectDocsPage(browser, origin, entry, width) {
  const page = await browser.newPage({
    viewport: { width, height: viewportHeight },
    deviceScaleFactor: 1,
  });
  const browserErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  try {
    const docsUrl = new URL("/iframe.html", origin);
    docsUrl.searchParams.set("id", entry.id);
    docsUrl.searchParams.set("viewMode", "docs");
    await page.goto(docsUrl.toString(), {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await page.locator("#storybook-docs").waitFor({
      state: "visible",
      timeout: 30_000,
    });
    await page.locator("#storybook-docs > *").first().waitFor({
      state: "visible",
      timeout: 30_000,
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const pageState = await page.evaluate(() => {
      const hasHorizontalOverflow =
        document.documentElement.scrollWidth > window.innerWidth;
      const overflowElements = hasHorizontalOverflow
        ? [...document.querySelectorAll("body *")]
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              return rect.right > window.innerWidth + 1;
            })
            .slice(0, 5)
            .map((element) => ({
              tag: element.tagName.toLowerCase(),
              className: element.className?.toString().slice(0, 100) || "",
              width: Math.round(element.getBoundingClientRect().width),
              right: Math.round(element.getBoundingClientRect().right),
            }))
        : [];

      return {
        hasErrorDisplay: document.body.classList.contains("sb-show-errordisplay"),
        hasHorizontalOverflow,
        overflowElements,
        title: document.querySelector("h1")?.textContent?.trim() || "",
      };
    });

    const failures = [];
    if (pageState.hasErrorDisplay) failures.push("rendered Storybook's error display");
    if (pageState.hasHorizontalOverflow) {
      failures.push(
        `has horizontal page overflow: ${JSON.stringify(pageState.overflowElements)}`,
      );
    }
    if (!pageState.title) failures.push("has no page heading");
    if (browserErrors.length > 0) {
      failures.push(`emitted browser errors: ${browserErrors.join(" | ")}`);
    }

    return {
      id: entry.id,
      title: entry.title,
      width,
      status: failures.length === 0 ? "passed" : "failed",
      failures,
    };
  } catch (error) {
    return {
      id: entry.id,
      title: entry.title,
      width,
      status: "failed",
      failures: [error instanceof Error ? error.message : String(error)],
    };
  } finally {
    await page.close();
  }
}

async function run() {
  await access(join(staticRoot, "index.html")).catch(() => {
    throw new Error("storybook-static is missing. Run `npm run build-storybook` first.");
  });

  const docsEntries = await getDocsEntries();
  if (docsEntries.length === 0) {
    throw new Error("No Storybook documentation entries were found in index.json.");
  }

  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const entry of docsEntries) {
      for (const width of viewportWidths) {
        results.push(await inspectDocsPage(browser, origin, entry, width));
      }
    }
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }

  const failures = results.filter((result) => result.status === "failed");
  console.log(
    JSON.stringify(
      {
        passed: failures.length === 0,
        docs: docsEntries.length,
        checks: results.length,
        viewports: viewportWidths,
        failures,
      },
      null,
      2,
    ),
  );
  if (failures.length > 0) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
