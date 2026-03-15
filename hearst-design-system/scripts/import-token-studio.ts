/**
 * Fetches the live Token Studio export, saves a raw snapshot,
 * and triggers normalization into core / semantic / brands.
 *
 * Usage:
 *   npx tsx scripts/import-token-studio.ts
 *   npx tsx scripts/import-token-studio.ts --snapshot-only
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { normalize } from "./normalize-tokens";
import { validate } from "./validate-tokens";

const API_URL =
  "https://figma-connector.kubeprod.hearstapps.com/token-studio/tokens";

const ROOT = join(__dirname, "..");
const RAW_DIR = join(ROOT, "sources/token-studio/raw");
const SNAP_DIR = join(ROOT, "sources/token-studio/snapshots");

interface TokenStudioExport {
  $themes: Theme[];
  values: Record<string, Record<string, unknown>>;
  version: string;
  updatedAt: string;
}

interface Theme {
  name: string;
  group: string;
  selectedTokenSets: Record<string, "enabled" | "source" | "disabled">;
}

async function fetchTokens(): Promise<TokenStudioExport> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Token Studio API returned ${res.status}`);
  return res.json() as Promise<TokenStudioExport>;
}

function snapshot(data: TokenStudioExport): string {
  const date = new Date().toISOString().slice(0, 10);
  mkdirSync(SNAP_DIR, { recursive: true });
  mkdirSync(RAW_DIR, { recursive: true });

  const rawPath = join(RAW_DIR, "tokens.json");
  const snapPath = join(SNAP_DIR, `${date}.json`);

  const json = JSON.stringify(data, null, 2);
  writeFileSync(rawPath, json);
  writeFileSync(snapPath, json);

  return rawPath;
}

async function main() {
  const snapshotOnly = process.argv.includes("--snapshot-only");

  console.log("Fetching Token Studio export...");
  const data = await fetchTokens();
  console.log(
    `  version: ${data.version}  |  updatedAt: ${data.updatedAt}  |  sets: ${Object.keys(data.values).length}`
  );

  console.log("Saving snapshot...");
  const rawPath = snapshot(data);
  console.log(`  -> ${rawPath}`);

  if (snapshotOnly) {
    console.log("Done (snapshot only).");
    return;
  }

  console.log("\nNormalizing tokens...");
  const stats = normalize(data.values, data.$themes);
  console.log(`  core:     ${stats.core} tokens`);
  console.log(`  semantic: ${stats.semantic} tokens`);
  console.log(`  brands:   ${stats.brands} files (${stats.brandTokens} tokens total)`);

  console.log("\nValidating...");
  const report = validate();
  console.log(`  warnings: ${report.warnings.length}`);
  console.log(`  errors:   ${report.errors.length}`);

  if (report.warnings.length) {
    console.log("\n  Warnings:");
    for (const w of report.warnings.slice(0, 20)) console.log(`    - ${w}`);
    if (report.warnings.length > 20)
      console.log(`    ... +${report.warnings.length - 20} more`);
  }

  if (report.errors.length) {
    console.log("\n  Errors:");
    for (const e of report.errors) console.log(`    ✗ ${e}`);
    process.exit(1);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
