// Copies the current daily feed snapshot into tests/visual-fixtures/ so the
// Storybook visual regression test renders a story set that the daily feed
// workflow never rewrites. Run it only when you mean to move the visual test
// to a new edition, then re-record the baselines with `npm run test:visual:update`.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

export const visualFixtureFiles = [
  "src/stories/generated/hearst-plus-fixtures.ts",
  "src/components/lifestyle-river-data.ts",
  "src/components/autos-river-data.ts",
  "src/components/flux-river-data.ts",
  "src/components/ew-river-data.ts",
];

const fixtureRoot = resolve("tests/visual-fixtures");

// The test clock sits on the edition's evening (8 p.m. Los Angeles), so the
// newest stories are hours old, inside the 72-hour freshness window, and the
// daypart-aware ranking stays on its evening state.
function eveningAfter(isoTimestamp) {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(isoTimestamp));
  const offsetName = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(isoTimestamp))
    .find((part) => part.type === "timeZoneName").value;
  const offset = offsetName.replace("GMT", "") || "+00:00";
  return `${day}T20:00:00${offset}`;
}

async function run() {
  await mkdir(fixtureRoot, { recursive: true });
  let editionAt = "";
  for (const sourcePath of visualFixtureFiles) {
    const source = await readFile(sourcePath, "utf8");
    const generatedAt = source.match(/on (\d{4}-\d{2}-\d{2}T[\d:.]+Z)/)?.[1];
    if (generatedAt && generatedAt > editionAt) editionAt = generatedAt;
    // The frozen copy lives outside src/components, so sibling imports must
    // use the @/ alias to keep resolving and type-checking.
    const frozen = source.replace(/from "\.\/([^"]+)"/g, 'from "@/components/$1"');
    const fileName = sourcePath.split("/").pop();
    await writeFile(join(fixtureRoot, fileName), frozen);
  }
  if (!editionAt) throw new Error("Could not read the edition time from the feed files.");

  const manifest = {
    note: "Frozen feed edition for the Storybook visual regression test. Written by scripts/freeze-visual-fixtures.mjs; the daily feed workflow never touches this folder.",
    editionAt,
    clock: eveningAfter(editionAt),
    files: visualFixtureFiles,
  };
  await writeFile(join(fixtureRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Froze the ${editionAt} edition; visual test clock ${manifest.clock}.`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
