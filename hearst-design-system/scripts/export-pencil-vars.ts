/**
 * Exports the current Pencil variables into pencil-variables.json
 * so that sync-from-pencil.ts can consume them.
 *
 * This script reads the raw JSON output from Pencil's get_variables
 * and writes only the brand-relevant variables to the JSON file.
 *
 * Usage: Pipe the get_variables output, or paste it into the input file.
 *   npx tsx scripts/export-pencil-vars.ts < pencil-raw.json
 */

import * as fs from "fs";
import * as path from "path";

const OUTPUT_PATH = path.resolve(__dirname, "../src/lib/pencil-variables.json");

const VARIABLE_KEYS = [
  "brand-1", "brand-2", "brand-3", "brand-4", "brand-5", "brand-6",
  "font-family-default", "font-family-serif",
];

async function main() {
  const input = fs.readFileSync(0, "utf-8");
  const data = JSON.parse(input);

  const variables = data.variables || data;

  const output: Record<string, unknown> = {};
  for (const key of VARIABLE_KEYS) {
    if (variables[key]) {
      output[key] = variables[key];
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Exported ${Object.keys(output).length} variables to ${OUTPUT_PATH}`);
}

main().catch(console.error);
