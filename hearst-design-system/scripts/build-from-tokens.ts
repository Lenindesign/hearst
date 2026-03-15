/**
 * Build from Git Tokens → App
 *
 * Reads the canonical token JSON files in tokens/ and generates:
 *   1. src/lib/brands.ts   — TypeScript brand data
 *   2. src/lib/tokens.css   — CSS custom properties per brand
 *
 * The tokens/ directory is the SINGLE SOURCE OF TRUTH:
 *   tokens/core/global.json       — global tokens (same for all brands)
 *   tokens/semantic/aliases.json   — semantic aliases (e.g. $brand-1)
 *   tokens/brands/{slug}.json      — per-brand overrides
 *   tokens/brands/_meta.json       — font overrides (headline, secondary)
 *
 * Usage: npm run build-tokens
 */

import * as fs from "fs";
import * as path from "path";

const TOKENS_DIR = path.resolve(__dirname, "../tokens");

// ── Types ──────────────────────────────────────────────────────────────

interface Token {
  type: string;
  value: string | number;
}

interface BrandMeta {
  fontHeadline?: string;
  fontHeadlineWeight?: number;
  fontSecondary?: string;
}

interface BrandData {
  name: string;
  slug: string;
  colors: Record<string, string>;
  fontDefault: string;
  fontSecondary: string;
  fontHeadline: string;
  fontHeadlineWeight: number;
  semanticColors: Record<string, string>;
  componentTokens: Record<string, string | number>;
}

// ── Helpers ────────────────────────────────────────────────────────────

const TYPO_CORRECTIONS: Record<string, string> = {
  dager: "danger",
  kockout: "knockout",
  backgroud: "background",
  netural: "neutral",
};

function fixTypos(name: string): string {
  let fixed = name;
  for (const [typo, correct] of Object.entries(TYPO_CORRECTIONS)) {
    fixed = fixed.replaceAll(typo, correct);
  }
  return fixed;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function brandNameFromSlug(slug: string): string {
  const special: Record<string, string> = {
    "elle": "ELLE",
    "elle-decor": "ELLE Decor",
    "harpers-bazaar": "Harper's BAZAAR",
    "hgtv": "HGTV",
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
  return special[slug] || slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function needsPxUnit(name: string): boolean {
  return (
    name.startsWith("space-") ||
    name.startsWith("border-width-") ||
    name.startsWith("border-radius-") ||
    name.startsWith("component-") ||
    name.startsWith("sizing-") ||
    name.startsWith("layout-") ||
    name.startsWith("width-")
  );
}

function toCssValue(token: Token, name: string): string | null {
  const val = token.value;
  if (typeof val === "string" && val.startsWith("{")) return null;
  if (typeof val === "string" && val.startsWith("$")) return null;

  if (token.type === "color") return String(val);
  if (token.type === "number") {
    return needsPxUnit(name) ? `${val}px` : String(val);
  }
  if (token.type === "string") {
    return name.startsWith("font-family-") ? `"${val}"` : String(val);
  }
  return String(val);
}

// ── Main ───────────────────────────────────────────────────────────────

function main() {
  const coreFile = path.join(TOKENS_DIR, "core/global.json");
  if (!fs.existsSync(coreFile)) {
    console.error(`Token files not found at ${TOKENS_DIR}`);
    console.error("Expected tokens/core/global.json to exist.");
    process.exit(1);
  }

  const globalTokens: Record<string, Token> = readJson(coreFile);
  console.log(`Read ${Object.keys(globalTokens).length} global tokens`);

  const metaFile = path.join(TOKENS_DIR, "brands/_meta.json");
  const meta: { overrides: Record<string, BrandMeta> } = fs.existsSync(metaFile)
    ? readJson(metaFile)
    : { overrides: {} };

  // Discover brands from tokens/brands/*.json
  const brandsDir = path.join(TOKENS_DIR, "brands");
  const brandFiles = fs
    .readdirSync(brandsDir)
    .filter((f) => f.endsWith(".json") && f !== "_meta.json")
    .sort((a, b) => {
      if (a === "white-label.json") return -1;
      if (b === "white-label.json") return 1;
      return a.localeCompare(b);
    });

  console.log(`Found ${brandFiles.length} brand files`);

  const brands: BrandData[] = [];

  for (const file of brandFiles) {
    const slug = file.replace(".json", "");
    const brandTokens: Record<string, Token> = readJson(path.join(brandsDir, file));
    const brandMeta = meta.overrides[slug] || {};

    // Extract colors
    const colors: Record<string, string> = {};
    for (let i = 1; i <= 14; i++) {
      const key = `palette-brand-${i}`;
      if (brandTokens[key]?.type === "color") {
        const val = String(brandTokens[key].value);
        if (val.startsWith("#")) colors[String(i)] = val;
      }
    }
    if (Object.keys(colors).length === 0) {
      for (let i = 1; i <= 6; i++) {
        const key = `brand-${i}`;
        if (brandTokens[key]) colors[String(i)] = String(brandTokens[key].value);
      }
    }

    // Extract fonts
    const fontDefault = brandTokens["font-family-default"]
      ? String(brandTokens["font-family-default"].value)
      : "system-ui";
    const fontSerifRaw = brandTokens["font-family-serif"]
      ? String(brandTokens["font-family-serif"].value)
      : "Georgia";
    const fontSecondary = brandMeta.fontSecondary || fontSerifRaw;
    const fontHeadline = brandMeta.fontHeadline || fontDefault;
    const fontHeadlineWeight = brandMeta.fontHeadlineWeight || 700;

    // Semantic colors
    const semanticColors: Record<string, string> = {};
    for (const [key, token] of Object.entries(brandTokens)) {
      if (token.type === "color" && (key.startsWith("palette-background-") || key.startsWith("palette-content-"))) {
        semanticColors[key] = String(token.value);
      }
    }

    // Component tokens
    const componentTokens: Record<string, string | number> = {};
    for (const [key, token] of Object.entries(brandTokens)) {
      if (!key.startsWith("component-")) continue;
      if (token.type === "color") componentTokens[key] = String(token.value);
      else if (token.type === "number") componentTokens[key] = Number(token.value);
    }

    brands.push({
      name: brandNameFromSlug(slug),
      slug,
      colors,
      fontDefault,
      fontSecondary,
      fontHeadline,
      fontHeadlineWeight,
      semanticColors,
      componentTokens,
    });
  }

  const srcDir = path.resolve(__dirname, "../src/lib");

  const brandsTs = generateBrandsTs(brands);
  fs.writeFileSync(path.join(srcDir, "brands.ts"), brandsTs);
  console.log(`Wrote src/lib/brands.ts (${brands.length} brands)`);

  const tokensCss = generateTokensCss(brands, globalTokens);
  fs.writeFileSync(path.join(srcDir, "tokens.css"), tokensCss);
  console.log(`Wrote src/lib/tokens.css`);

  console.log("\nBuild from tokens complete!");
}

// ── Generators ─────────────────────────────────────────────────────────

function generateBrandsTs(brands: BrandData[]): string {
  const lines: string[] = [
    "// Auto-generated by scripts/build-from-tokens.ts — do not edit manually",
    `// Source: tokens/ | Built: ${new Date().toISOString()}`,
    "",
    "export interface BrandTheme {",
    "  name: string;",
    "  slug: string;",
    "  colors: Record<string, string>;",
    "  fontDefault: string;",
    "  fontSecondary: string;",
    "  fontHeadline: string;",
    "  fontHeadlineWeight: number;",
    "  semanticColors: Record<string, string>;",
    "  componentTokens: Record<string, string | number>;",
    "}",
    "",
    "export const brands: BrandTheme[] = [",
  ];

  for (const b of brands) {
    const colorsStr = Object.entries(b.colors)
      .sort(([a], [bk]) => parseInt(a) - parseInt(bk))
      .map(([k, v]) => `"${k}": "${v}"`)
      .join(", ");

    const semStr = Object.entries(b.semanticColors)
      .map(([k, v]) => `"${k}": "${v}"`)
      .join(", ");

    const compEntries = Object.entries(b.componentTokens)
      .slice(0, 50)
      .map(([k, v]) => (typeof v === "number" ? `"${k}": ${v}` : `"${k}": "${v}"`))
      .join(", ");

    lines.push("  {");
    lines.push(`    name: ${JSON.stringify(b.name)},`);
    lines.push(`    slug: "${b.slug}",`);
    lines.push(`    colors: { ${colorsStr} },`);
    lines.push(`    fontDefault: ${JSON.stringify(b.fontDefault)},`);
    lines.push(`    fontSecondary: ${JSON.stringify(b.fontSecondary)},`);
    lines.push(`    fontHeadline: ${JSON.stringify(b.fontHeadline)},`);
    lines.push(`    fontHeadlineWeight: ${b.fontHeadlineWeight},`);
    lines.push(`    semanticColors: { ${semStr} },`);
    lines.push(`    componentTokens: { ${compEntries} },`);
    lines.push("  },");
  }

  lines.push("];");
  return lines.join("\n");
}

function generateTokensCss(brands: BrandData[], globalTokens: Record<string, Token>): string {
  const lines: string[] = [
    "/* Auto-generated by scripts/build-from-tokens.ts — do not edit manually */",
    `/* Source: tokens/ | Built: ${new Date().toISOString()} */`,
    "",
  ];

  // :root — global tokens
  lines.push(":root {");
  for (const [name, token] of Object.entries(globalTokens).sort(([a], [b]) => a.localeCompare(b))) {
    const cssVal = toCssValue(token, name);
    if (cssVal === null) continue;
    lines.push(`  --${fixTypos(name)}: ${cssVal};`);
  }
  lines.push("}");
  lines.push("");

  // Per-brand blocks
  for (const brand of brands) {
    const brandFile = path.join(TOKENS_DIR, `brands/${brand.slug}.json`);
    if (!fs.existsSync(brandFile)) continue;
    const brandTokens: Record<string, Token> = readJson(brandFile);

    lines.push(`[data-brand="${brand.slug}"] {`);
    lines.push(`  --brand-name: ${JSON.stringify(brand.name)};`);

    const primary = brand.colors["1"] || Object.values(brand.colors)[0];
    if (primary) lines.push(`  --brand-primary: ${primary};`);

    lines.push(`  --font-brand-sans: "${brand.fontDefault}", system-ui, sans-serif;`);
    lines.push(`  --font-brand-serif: "${brand.fontSecondary}", Georgia, serif;`);

    for (const [name, token] of Object.entries(brandTokens).sort(([a], [b]) => a.localeCompare(b))) {
      const cssVal = toCssValue(token, name);
      if (cssVal === null) continue;
      lines.push(`  --${fixTypos(name)}: ${cssVal};`);
    }

    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

main();
