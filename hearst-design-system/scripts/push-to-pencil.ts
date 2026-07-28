/**
 * Generate Git Tokens → Pencil variables payload
 *
 * Reads the canonical token JSON files in tokens/ and prints a
 * Pencil-compatible variables payload. This script does not write a .pen file
 * or invoke an external tool.
 *
 * This prepares a payload from the Git source of truth.
 * Run this after an approved token change, then perform and verify the
 * destination write separately.
 *
 * Usage: npm run push-pencil
 *
 * An authorized Pencil tool call and destination-side verification are still
 * required after generating the payload.
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
  console.error("To write these variables to Pencil:");
  console.error("  1. Save the payload: npx tsx scripts/push-to-pencil.ts > pencil-payload.json");
  console.error("  2. Use an authorized Pencil variables tool call");
  console.error("  3. Verify names, themes, values, and the destination file");

  // Output the payload
  console.log(JSON.stringify(variables, null, 2));
}

main();
