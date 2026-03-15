#!/usr/bin/env npx tsx
/**
 * Push Figma variable mode values from batch JSON files to Figma via REST API.
 * Bypasses MCP tool schema limitation (value must be boolean|number|string|object).
 *
 * Usage: FIGMA_TOKEN=xxx npx tsx scripts/push-figma-batches.ts
 * Batch files: /tmp/figma-batch-0.json through /tmp/figma-batch-5.json
 */

import * as fs from "fs";

const FILE_KEY = "XFDMnMs6TI0uvAwyJnDZA1";
const API_URL = `https://api.figma.com/v1/files/${FILE_KEY}/variables`;

async function pushBatch(batchIndex: number): Promise<{ success: boolean; error?: string }> {
  const path = `/tmp/figma-batch-${batchIndex}.json`;
  if (!fs.existsSync(path)) {
    return { success: false, error: `File not found: ${path}` };
  }

  const data = JSON.parse(fs.readFileSync(path, "utf-8"));
  const variableModeValues = data.variableModeValues;
  if (!Array.isArray(variableModeValues)) {
    return { success: false, error: "Missing or invalid variableModeValues array" };
  }

  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    return { success: false, error: "FIGMA_TOKEN environment variable not set" };
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Figma-Token": token,
    },
    body: JSON.stringify({ variableModeValues }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { success: false, error: `HTTP ${res.status}: ${errText}` };
  }

  return { success: true };
}

async function main() {
  const results: Array<{ batch: number; success: boolean; error?: string }> = [];

  for (let i = 0; i < 6; i++) {
    process.stderr.write(`Pushing batch ${i}... `);
    const result = await pushBatch(i);
    results.push({ batch: i, ...result });
    if (result.success) {
      process.stderr.write("OK\n");
    } else {
      process.stderr.write(`FAILED: ${result.error}\n`);
    }
  }

  console.log("\n--- Summary ---");
  for (const r of results) {
    console.log(`Batch ${r.batch}: ${r.success ? "SUCCESS" : "FAILED"}${r.error ? ` - ${r.error}` : ""}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
