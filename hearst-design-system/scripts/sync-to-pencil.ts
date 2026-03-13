/**
 * Sync to Pencil — Token Studio API → .pen file (direct write)
 *
 * Fetches the Token Studio API, resolves all references, and writes
 * the complete variable set directly into the hearst-brands.pen file.
 *
 * No MCP dependency — works as a standalone CLI tool.
 *
 * Usage: npm run sync-to-pencil
 */

import * as fs from "fs";
import * as path from "path";

const API_URL =
  "https://figma-connector.kubeprod.hearstapps.com/token-studio/tokens";

const PEN_FILE_PATH = path.resolve(__dirname, "../../hearst-brands.pen");

// ── Types ──────────────────────────────────────────────────────────────

interface FlatToken {
  value: unknown;
  type: string;
}

interface PencilVariable {
  type: "color" | "string" | "number";
  value: unknown;
}

// ── Helpers ────────────────────────────────────────────────────────────

function flattenTokens(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, FlatToken> {
  const result: Record<string, FlatToken> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$")) continue;
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const rec = v as Record<string, unknown>;
      if (rec.value !== undefined) {
        result[p] = {
          value: rec.value,
          type: (rec.type as string) || "unknown",
        };
      }
      Object.assign(result, flattenTokens(rec, p));
    }
  }
  return result;
}

function deepResolve(
  value: unknown,
  allSets: Record<string, FlatToken>[],
  depth = 0
): unknown {
  if (depth > 12) return value;
  if (typeof value === "string") {
    const fullRef = value.match(/^\{(.+)\}$/);
    if (fullRef) {
      const refPath = fullRef[1];
      for (const set of allSets) {
        if (set[refPath]) {
          return deepResolve(set[refPath].value, allSets, depth + 1);
        }
      }
      return value;
    }
    if (value.includes("{")) {
      return value.replace(/\{([^}]+)\}/g, (_, refPath: string) => {
        for (const set of allSets) {
          if (set[refPath]) {
            const resolved = deepResolve(set[refPath].value, allSets, depth + 1);
            return String(resolved);
          }
        }
        return `{${refPath}}`;
      });
    }
    return value;
  }
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepResolve(v, allSets, depth + 1);
    }
    return out;
  }
  return value;
}

function toPencilName(dotName: string): string {
  return dotName.replace(/\./g, "-").replace(/^_/, "").replace(/_/g, "-");
}

const PENCIL_TYPE_MAP: Record<string, "color" | "string" | "number"> = {
  color: "color",
  fontFamilies: "string",
  fontWeights: "string",
  fontSizes: "number",
  lineHeights: "string",
  letterSpacing: "string",
  textCase: "string",
  dimension: "number",
  spacing: "number",
  borderWidth: "number",
  borderRadius: "number",
  opacity: "number",
  sizing: "number",
  number: "number",
  other: "string",
  text: "string",
  unknown: "string",
  typography: "string",
  border: "string",
};

function toPencilValue(
  resolved: unknown,
  pencilType: "color" | "string" | "number"
): string | number | null {
  if (pencilType === "color") {
    return typeof resolved === "string" ? resolved : String(resolved);
  }
  if (pencilType === "number") {
    if (typeof resolved === "number") return resolved;
    if (typeof resolved === "string") {
      const n = parseFloat(resolved);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  }
  if (typeof resolved === "object" && resolved !== null)
    return JSON.stringify(resolved);
  return String(resolved ?? "");
}

// ── Main ───────────────────────────────────────────────────────────────

async function main() {
  // Verify .pen file exists
  if (!fs.existsSync(PEN_FILE_PATH)) {
    console.error(`Pencil file not found at ${PEN_FILE_PATH}`);
    process.exit(1);
  }

  console.log("Fetching tokens from Token Studio API...");
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to fetch tokens: ${res.status}`);
  const data = (await res.json()) as Record<string, unknown>;

  const vals = data.values as Record<string, Record<string, unknown>>;

  console.log("Resolving token references...");
  const primTokens = flattenTokens(vals["Primitives/White Label"] || {});
  const aliasWLTokens = flattenTokens(vals["Alias/White Label"] || {});

  const brandNames: string[] = ["White Label"];
  const brandAliasTokens: Record<string, Record<string, FlatToken>> = {};
  for (const key of Object.keys(vals)) {
    if (key.startsWith("Alias/") && key !== "Alias/White Label") {
      const name = key.replace("Alias/", "");
      brandNames.push(name);
      brandAliasTokens[name] = flattenTokens(vals[key]);
    }
  }

  // Resolve all tokens per brand
  const resolvedBrands: Record<
    string,
    Record<string, FlatToken & { resolved: unknown }>
  > = {};
  for (const brand of brandNames) {
    const brandTokens =
      brand === "White Label" ? {} : (brandAliasTokens[brand] || {});
    const allSets =
      brand === "White Label"
        ? [aliasWLTokens, primTokens]
        : [brandTokens, aliasWLTokens, primTokens];

    const resolved: Record<string, FlatToken & { resolved: unknown }> = {};
    for (const [name, def] of Object.entries(aliasWLTokens)) {
      resolved[name] = { ...def, resolved: deepResolve(def.value, allSets) };
    }
    for (const [name, def] of Object.entries(brandTokens)) {
      resolved[name] = { ...def, resolved: deepResolve(def.value, allSets) };
    }
    resolvedBrands[brand] = resolved;
  }

  // Classify global vs brand-themed
  const skipTokens = new Set(["type", "url", "slug"]);
  const allTokenNames = new Set<string>();
  for (const brand of brandNames) {
    for (const name of Object.keys(resolvedBrands[brand]))
      allTokenNames.add(name);
  }

  const globalTokenNames: string[] = [];
  const brandThemedTokenNames: string[] = [];

  for (const tokenName of allTokenNames) {
    if (skipTokens.has(tokenName)) continue;
    const wlDef = resolvedBrands["White Label"][tokenName];
    if (!wlDef) continue;
    const wlVal = JSON.stringify(wlDef.resolved);
    let differs = false;
    for (const brand of brandNames) {
      if (brand === "White Label") continue;
      const bDef = resolvedBrands[brand][tokenName];
      if (bDef && JSON.stringify(bDef.resolved) !== wlVal) {
        differs = true;
        break;
      }
    }
    if (differs) brandThemedTokenNames.push(tokenName);
    else globalTokenNames.push(tokenName);
  }

  console.log(
    `  ${brandNames.length} brands, ${globalTokenNames.length} global, ${brandThemedTokenNames.length} brand-themed`
  );

  // Build Pencil variables
  console.log("Building Pencil variable definitions...");
  const pencilVars: Record<string, PencilVariable> = {};

  for (const tokenName of globalTokenNames) {
    const def = resolvedBrands["White Label"][tokenName];
    if (!def) continue;
    const pencilType = PENCIL_TYPE_MAP[def.type];
    if (!pencilType) continue;
    const val = toPencilValue(def.resolved, pencilType);
    if (val === null) continue;
    pencilVars[toPencilName(tokenName)] = { type: pencilType, value: val };
  }

  for (const tokenName of brandThemedTokenNames) {
    const wlDef = resolvedBrands["White Label"][tokenName];
    if (!wlDef) continue;
    const pencilType = PENCIL_TYPE_MAP[wlDef.type];
    if (!pencilType) continue;

    const themed: { theme: { brand: string }; value: string | number }[] = [];
    for (const brand of brandNames) {
      const bDef = resolvedBrands[brand][tokenName];
      if (!bDef) continue;
      const val = toPencilValue(bDef.resolved, pencilType);
      if (val === null) continue;
      themed.push({ theme: { brand }, value: val });
    }
    if (themed.length === 0) continue;
    pencilVars[toPencilName(tokenName)] = { type: pencilType, value: themed };
  }

  console.log(`  ${Object.keys(pencilVars).length} Pencil variables prepared`);

  // Read the .pen file, merge variables, write back
  console.log(`Reading ${PEN_FILE_PATH}...`);
  const pen = JSON.parse(fs.readFileSync(PEN_FILE_PATH, "utf-8"));

  if (!pen.variables) pen.variables = {};
  if (!pen.themes) pen.themes = {};

  // Merge new variables (preserves any existing non-Token-Studio variables)
  for (const [name, def] of Object.entries(pencilVars)) {
    pen.variables[name] = def;
  }

  // Ensure all brands are in the theme axis
  if (!pen.themes.brand) pen.themes.brand = [];
  for (const brand of brandNames) {
    if (!pen.themes.brand.includes(brand)) {
      pen.themes.brand.push(brand);
    }
  }

  // Write back
  fs.writeFileSync(PEN_FILE_PATH, JSON.stringify(pen, null, 2));
  const sizeMB = (fs.statSync(PEN_FILE_PATH).size / 1024 / 1024).toFixed(2);
  console.log(`Wrote ${PEN_FILE_PATH} (${sizeMB} MB)`);

  console.log(
    `\n  ${Object.keys(pencilVars).length} variables across ${brandNames.length} brands`
  );
  console.log("Sync to Pencil complete!");
}

main().catch(console.error);
