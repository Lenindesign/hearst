/**
 * Push Git Tokens → Figma Variables
 *
 * Reads the canonical token JSON files in tokens/ and pushes them
 * to a Figma file as Figma Variables via the Figma REST API.
 *
 * This keeps Figma in sync with the git source of truth, so designers
 * can use the correct tokens directly in the Figma variable picker.
 *
 * Usage: npm run push-figma
 *
 * Requires:
 *   FIGMA_FILE_KEY  — the Figma file key (from the URL)
 *   FIGMA_TOKEN     — a Figma personal access token with file:write scope
 *
 * The script outputs the Figma API payload to stdout.
 * When run via MCP, the agent can use the `postvariables` tool directly.
 *
 * Architecture:
 *   - One variable collection: "Hearst Design System"
 *   - One mode per brand (29 modes)
 *   - Variables organized by token name
 *   - Colors as Figma RGBA objects, numbers as FLOAT, strings as STRING
 */

import * as fs from "fs";
import * as path from "path";

const TOKENS_DIR = path.resolve(__dirname, "../tokens");

interface Token {
  type: string;
  value: string | number;
}

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function hexToFigmaColor(hex: string): FigmaColor | null {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16) / 255,
    g: parseInt(clean.slice(2, 4), 16) / 255,
    b: parseInt(clean.slice(4, 6), 16) / 255,
    a: clean.length === 8 ? parseInt(clean.slice(6, 8), 16) / 255 : 1,
  };
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

function tokenTypeToFigma(type: string): "COLOR" | "FLOAT" | "STRING" {
  if (type === "color") return "COLOR";
  if (type === "number") return "FLOAT";
  return "STRING";
}

function tokenScopes(name: string, type: string): string[] {
  if (type === "color") {
    if (name.includes("background")) return ["ALL_FILLS"];
    if (name.includes("content") || name.includes("text")) return ["TEXT_FILL"];
    if (name.includes("border") || name.includes("stroke")) return ["STROKE_COLOR"];
    return ["ALL_SCOPES"];
  }
  if (type === "number") {
    if (name.startsWith("space-") || name.includes("gap")) return ["GAP"];
    if (name.includes("radius")) return ["CORNER_RADIUS"];
    if (name.includes("width") || name.includes("height")) return ["WIDTH_HEIGHT"];
    if (name.includes("font-size")) return ["FONT_SIZE"];
    if (name.includes("font-weight")) return ["FONT_WEIGHT"];
    if (name.includes("line-height")) return ["LINE_HEIGHT"];
    if (name.includes("letter-spacing")) return ["LETTER_SPACING"];
    return ["ALL_SCOPES"];
  }
  if (type === "string") {
    if (name.includes("font-family")) return ["FONT_FAMILY"];
    return ["ALL_SCOPES"];
  }
  return ["ALL_SCOPES"];
}

function toFigmaValue(token: Token): boolean | number | string | FigmaColor | null {
  if (token.type === "color") {
    const val = String(token.value);
    if (val.startsWith("#")) return hexToFigmaColor(val);
    if (val === "white") return hexToFigmaColor("#ffffff");
    if (val === "transparent") return hexToFigmaColor("#00000000");
    return null;
  }
  if (token.type === "number") return Number(token.value);
  return String(token.value);
}

function main() {
  const globalTokens: Record<string, Token> = readJson(
    path.join(TOKENS_DIR, "core/global.json")
  );

  const brandsDir = path.join(TOKENS_DIR, "brands");
  const brandFiles = fs
    .readdirSync(brandsDir)
    .filter((f) => f.endsWith(".json") && f !== "_meta.json")
    .sort((a, b) => {
      if (a === "white-label.json") return -1;
      if (b === "white-label.json") return 1;
      return a.localeCompare(b);
    });

  // Collection + modes
  const collectionId = "hearst-ds-collection";
  const defaultModeId = "mode-white-label";

  const variableCollections = [
    {
      action: "CREATE" as const,
      id: collectionId,
      name: "Hearst Design System",
      initialModeId: defaultModeId,
      hiddenFromPublishing: false,
    },
  ];

  const variableModes = brandFiles
    .filter((f) => f !== "white-label.json")
    .map((f) => ({
      action: "CREATE" as const,
      id: `mode-${f.replace(".json", "")}`,
      name: brandNameFromSlug(f.replace(".json", "")),
      variableCollectionId: collectionId,
    }));

  // Collect all unique token names across all brands
  const allTokenNames = new Set<string>();
  const brandData: Record<string, Record<string, Token>> = {};

  for (const file of brandFiles) {
    const slug = file.replace(".json", "");
    const tokens: Record<string, Token> = readJson(path.join(brandsDir, file));
    brandData[slug] = tokens;
    for (const name of Object.keys(tokens)) {
      allTokenNames.add(name);
    }
  }
  for (const name of Object.keys(globalTokens)) {
    allTokenNames.add(name);
  }

  // Create variables
  const variables: Array<{
    action: "CREATE";
    id: string;
    name: string;
    variableCollectionId: string;
    resolvedType: "COLOR" | "FLOAT" | "STRING";
    description: string;
    hiddenFromPublishing: boolean;
    scopes: string[];
    codeSyntax: { WEB: string };
  }> = [];

  const variableModeValues: Array<{
    variableId: string;
    modeId: string;
    value: boolean | number | string | FigmaColor;
  }> = [];

  // Skip composites (JSON blobs, $references, etc.)
  const skipToken = (token: Token): boolean => {
    const val = token.value;
    if (typeof val === "string" && (val.startsWith("{") || val.startsWith("$"))) return true;
    return false;
  };

  let varCount = 0;
  for (const name of Array.from(allTokenNames).sort()) {
    // Determine type from first available token
    let tokenType = "string";
    const sampleToken = globalTokens[name] || Object.values(brandData).find((b) => b[name])?.[name];
    if (!sampleToken || skipToken(sampleToken)) continue;
    tokenType = sampleToken.type;

    const varId = `var-${name}`;
    const figmaType = tokenTypeToFigma(tokenType);

    // Organize name with / separators for Figma grouping
    const figmaName = name.replace(/-/g, "/").replace(/\//g, "/");

    variables.push({
      action: "CREATE",
      id: varId,
      name: figmaName,
      variableCollectionId: collectionId,
      resolvedType: figmaType,
      description: "",
      hiddenFromPublishing: false,
      scopes: tokenScopes(name, tokenType),
      codeSyntax: { WEB: `var(--${name})` },
    });

    // Set values per brand mode
    for (const file of brandFiles) {
      const slug = file.replace(".json", "");
      const modeId = `mode-${slug}`;
      const token = brandData[slug]?.[name] || globalTokens[name];
      if (!token || skipToken(token)) continue;

      const figmaVal = toFigmaValue(token);
      if (figmaVal === null) continue;

      variableModeValues.push({
        variableId: varId,
        modeId,
        value: figmaVal,
      });
    }

    varCount++;
  }

  const payload = {
    variableCollections,
    variableModes,
    variables,
    variableModeValues,
  };

  console.error(`Prepared Figma payload:`);
  console.error(`  ${variableCollections.length} collection`);
  console.error(`  ${variableModes.length + 1} modes (brands)`);
  console.error(`  ${varCount} variables`);
  console.error(`  ${variableModeValues.length} mode values`);
  console.error("");
  console.error("To push to Figma:");
  console.error("  1. Set FIGMA_FILE_KEY and FIGMA_TOKEN environment variables");
  console.error("  2. Use the Figma MCP postvariables tool with file_key and this payload");
  console.error("  3. Or: npx tsx scripts/push-to-figma.ts > figma-payload.json");

  console.log(JSON.stringify(payload, null, 2));
}

main();
