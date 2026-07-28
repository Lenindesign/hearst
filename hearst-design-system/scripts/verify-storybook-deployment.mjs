import { execFileSync } from "node:child_process";

const storybookUrl = process.env.STORYBOOK_URL?.trim();
const requestedTimeout = Number(process.env.STORYBOOK_VERIFY_TIMEOUT_MS ?? 15_000);
const timeoutMs = Number.isFinite(requestedTimeout) && requestedTimeout > 0
  ? requestedTimeout
  : 15_000;

if (!storybookUrl) {
  console.error(
    "STORYBOOK_URL is required. Point it at the published Storybook root, including /storybook/.",
  );
  process.exit(1);
}

function currentRevision() {
  if (process.env.EXPECTED_REVISION?.trim()) {
    return process.env.EXPECTED_REVISION.trim();
  }

  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function artifactUrl(pathname) {
  return new URL(pathname, storybookUrl.endsWith("/") ? storybookUrl : `${storybookUrl}/`);
}

async function readJson(pathname) {
  const controller = new AbortController();
  let timeoutHandle;

  try {
    const response = await Promise.race([
      fetch(artifactUrl(pathname), {
        headers: { accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      }),
      new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => {
          controller.abort();
          reject(new Error(`${pathname} did not respond within ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
    if (!response.ok) {
      throw new Error(`${pathname} returned HTTP ${response.status}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeoutHandle);
  }
}

async function verifyDeployment() {
  const [buildInfo, index] = await Promise.all([
    readJson("build-info.json"),
    readJson("index.json"),
  ]);

  const entries = Object.values(index.entries ?? {});
  const actualCatalog = {
    entries: entries.length,
    stories: entries.filter((entry) => entry.type === "story").length,
    docs: entries.filter((entry) => entry.type === "docs").length,
    groups: new Set(entries.map((entry) => entry.title)).size,
  };
  const expectedRevision = currentRevision();
  const errors = [];

  for (const key of Object.keys(actualCatalog)) {
    if (buildInfo.catalog?.[key] !== actualCatalog[key]) {
      errors.push(
        `Published ${key} count is ${actualCatalog[key]}, but build-info.json records ${buildInfo.catalog?.[key] ?? "missing"}.`,
      );
    }
  }

  if (!expectedRevision) {
    errors.push("The expected source revision could not be resolved.");
  } else if (buildInfo.sourceRevision !== expectedRevision) {
    errors.push(
      `Published revision ${buildInfo.sourceRevision ?? "missing"} does not match expected revision ${expectedRevision}.`,
    );
  }

  if (errors.length > 0) {
    console.error("Storybook deployment verification failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    JSON.stringify(
      {
        passed: true,
        url: storybookUrl,
        sourceRevision: buildInfo.sourceRevision,
        catalog: actualCatalog,
        builtAt: buildInfo.builtAt,
        buildContext: buildInfo.buildContext,
      },
      null,
      2,
    ),
  );
}

try {
  await verifyDeployment();
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(
    `Storybook deployment verification failed after at most ${timeoutMs}ms: ${detail}`,
  );
  process.exit(1);
}
