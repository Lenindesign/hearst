/**
 * Watch Sync — Auto-regenerate code files when pencil-variables.json changes
 *
 * Watches src/lib/pencil-variables.json and automatically runs the
 * Pencil → Code sync whenever the file is modified.
 *
 * Usage: npm run sync-watch
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const WATCH_PATH = path.resolve(__dirname, "../src/lib/pencil-variables.json");
const SYNC_SCRIPT = path.resolve(__dirname, "sync-from-pencil.ts");

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastSize = 0;

function runSync() {
  console.log(`\n[${new Date().toLocaleTimeString()}] Change detected, syncing...`);
  try {
    execSync(`npx tsx "${SYNC_SCRIPT}"`, {
      cwd: path.resolve(__dirname, ".."),
      stdio: "inherit",
    });
    console.log(`[${new Date().toLocaleTimeString()}] Sync complete. Waiting for changes...`);
  } catch (err) {
    console.error("Sync failed:", (err as Error).message);
  }
}

function main() {
  if (!fs.existsSync(WATCH_PATH)) {
    console.error(`File not found: ${WATCH_PATH}`);
    console.error("Run `npm run sync-tokens` first to generate pencil-variables.json.");
    process.exit(1);
  }

  const stat = fs.statSync(WATCH_PATH);
  lastSize = stat.size;

  console.log("Watching for changes to src/lib/pencil-variables.json...");
  console.log("Press Ctrl+C to stop.\n");

  // Initial sync
  runSync();

  fs.watch(WATCH_PATH, (eventType) => {
    if (eventType !== "change") return;

    // Debounce rapid writes
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      try {
        const newStat = fs.statSync(WATCH_PATH);
        if (newStat.size === lastSize) return;
        lastSize = newStat.size;
      } catch {
        return;
      }
      runSync();
    }, 500);
  });
}

main();
