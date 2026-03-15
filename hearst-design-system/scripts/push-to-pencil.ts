/**
 * Push Git Tokens → Pencil
 *
 * Reads the canonical token JSON files in tokens/ and writes them
 * to the Pencil .pen file via MCP set_variables.
 *
 * This keeps Pencil in sync with the git source of truth.
 * Run this after modifying token JSON files.
 *
 * Usage: npm run push-pencil
 *
 * NOTE: This script outputs the variable payload to stdout as JSON.
 * The actual MCP call must be done by an LLM agent using set_variables.
 * This script prepares the data; the agent executes the push.
 */

import * as fs from "fs";
import * as path from "path";

const TOKENS_DIR = path.resolve(__dirname, "../tokens");

interface Token {
  type: string;
  value: string | number;
}

interface ThemedEntry {
  theme: { brand: string };
  value: string | number;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function brandNameFromSlug(slug: string): string {
  const special: Record<string, string> = {
    elle: "ELLE",
    "elle-decor": "ELLE Decor",
    "harpers-bazaar": "Harper's BAZAAR",
    hgtv: "HGTV",
    "mens-health": "Men's Health",
    "womens-health": "Women's Health",
    "womans-day": "Woman's Day",
    "road-and-track": "Road & Track",
    "town-and-country": "Town & Country",
    "runners-world": "Runner's World",
    "the-pioneer-woman": "The Pioneer Woman",
    "oprah-daily": "Oprah Daily",
    "good-housekeeping": "Good Housekeeping",
    "popular-mechanics": "Popular Mechanics",
    "car-and-driver": "Car and Driver",
    "country-living": "Country Living",
    "house-beautiful": "House Beautiful",
    "best-products": "Best Products",
    "food-network": "Food Network",
    "white-label": "White Label",
    "marie-claire": "Marie Claire",
  };
  return (
    special[slug] ||
    slug
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function main() {
  const globalTokens: Record<string, Token> = readJson(
    path.join(TOKENS_DIR, "core/global.json")
  );

  const brandsDir = path.join(TOKENS_DIR, "brands");
  const brandFiles = fs
    .readdirSync(brandsDir)
    .filter((f) => f.endsWith(".json") && f !== "_meta.json")
    .sort();

  // Build the Pencil-compatible variable structure
  const variables: Record<string, { type: string; value: string | number | ThemedEntry[] }> = {};

  // Global tokens → simple values
  for (const [name, token] of Object.entries(globalTokens)) {
    variables[name] = { type: token.type, value: token.value };
  }

  // Brand tokens → themed arrays
  const brandData: Record<string, Record<string, Token>> = {};
  for (const file of brandFiles) {
    const slug = file.replace(".json", "");
    brandData[slug] = readJson(path.join(brandsDir, file));
  }

  // Collect all themed token names
  const themedNames = new Set<string>();
  for (const tokens of Object.values(brandData)) {
    for (const name of Object.keys(tokens)) {
      themedNames.add(name);
    }
  }

  for (const name of themedNames) {
    const entries: ThemedEntry[] = [];
    let tokenType = "string";

    for (const [slug, tokens] of Object.entries(brandData)) {
      if (tokens[name]) {
        tokenType = tokens[name].type;
        entries.push({
          theme: { brand: brandNameFromSlug(slug) },
          value: tokens[name].value,
        });
      }
    }

    variables[name] = { type: tokenType, value: entries };
  }

  // Output summary
  const globalCount = Object.keys(globalTokens).length;
  const themedCount = themedNames.size;
  console.error(`Prepared ${globalCount} global + ${themedCount} themed = ${globalCount + themedCount} variables`);
  console.error(`For ${brandFiles.length} brands`);
  console.error("");
  console.error("To push to Pencil, use the MCP set_variables tool with the JSON below.");
  console.error("Or pipe this output: npx tsx scripts/push-to-pencil.ts > pencil-payload.json");

  // Output the payload
  console.log(JSON.stringify(variables, null, 2));
}

main();
