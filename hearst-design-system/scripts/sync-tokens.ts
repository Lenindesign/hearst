/**
 * Token Sync Script — Full Token Studio API → Code + Pencil
 *
 * Single source of truth: Figma Token Studio API
 * Outputs:
 *   1. src/lib/brands.ts             — TypeScript brand theme data
 *   2. src/lib/tokens.css             — CSS custom properties (:root + per-brand)
 *   3. src/lib/pencil-variables.json  — Pencil variable definitions (for set_variables MCP)
 *
 * Usage:
 *   npm run sync-tokens
 */

import * as fs from "fs";
import * as path from "path";

const API_URL =
  "https://figma-connector.kubeprod.hearstapps.com/token-studio/tokens";

// ── Types ──────────────────────────────────────────────────────────────

interface FlatToken {
  value: unknown;
  type: string;
  description?: string;
}

interface PencilVariable {
  type: "color" | "string" | "number";
  value: unknown;
}

interface BrandOutput {
  name: string;
  slug: string;
  colors: Record<string, string>;
  fontDefault: string;
  fontSecondary: string;
  semanticColors: Record<string, string>;
  componentTokens: Record<string, string | number>;
}

// ── Helpers ────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
}

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
          description: rec.description as string | undefined,
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

// ── Fetch & Parse ──────────────────────────────────────────────────────

async function fetchTokens(): Promise<Record<string, unknown>> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to fetch tokens: ${res.status}`);
  return res.json();
}

function processTokenStudio(data: Record<string, unknown>) {
  const vals = data.values as Record<string, Record<string, unknown>>;

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
  const resolvedBrands: Record<string, Record<string, FlatToken & { resolved: unknown }>> = {};
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
    for (const name of Object.keys(resolvedBrands[brand])) allTokenNames.add(name);
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

  return {
    brandNames,
    resolvedBrands,
    globalTokenNames,
    brandThemedTokenNames,
    aliasWLTokens,
  };
}

// ── Generators ─────────────────────────────────────────────────────────

function generatePencilVariables(
  brandNames: string[],
  resolvedBrands: Record<string, Record<string, FlatToken & { resolved: unknown }>>,
  globalTokenNames: string[],
  brandThemedTokenNames: string[]
): Record<string, PencilVariable> {
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

  return pencilVars;
}

function generateBrandsTs(
  brandNames: string[],
  resolvedBrands: Record<string, Record<string, FlatToken & { resolved: unknown }>>
): string {
  const lines: string[] = [
    "// Auto-generated by scripts/sync-tokens.ts — do not edit manually",
    `// Source: Token Studio API | Synced: ${new Date().toISOString()}`,
    "",
    "export interface BrandTheme {",
    "  name: string;",
    "  slug: string;",
    "  colors: Record<string, string>;",
    "  fontDefault: string;",
    "  fontSecondary: string;",
    "  semanticColors: Record<string, string>;",
    "  componentTokens: Record<string, string | number>;",
    "}",
    "",
    "export const brands: BrandTheme[] = [",
  ];

  for (const brand of brandNames) {
    const resolved = resolvedBrands[brand];
    const slug = slugify(brand);

    // Brand palette colors
    const colors: Record<string, string> = {};
    for (let i = 1; i <= 14; i++) {
      const key = `palette.brand.${i}`;
      const def = resolved[key];
      if (def && typeof def.resolved === "string" && def.resolved.startsWith("#")) {
        colors[String(i)] = def.resolved;
      }
    }

    // Fonts
    const fontDef = resolved["font.family.default"];
    const fontDefault =
      fontDef && typeof fontDef.resolved === "string"
        ? fontDef.resolved
        : "system-ui";
    const serifDef = resolved["font.family.serif"];
    const fontSecondary =
      serifDef && typeof serifDef.resolved === "string"
        ? serifDef.resolved
        : "Georgia";

    // Semantic colors
    const semanticColors: Record<string, string> = {};
    const semanticKeys = [
      "palette.background.default",
      "palette.background.default-hover",
      "palette.background.on-brand",
      "palette.background.knockout-subtle",
      "palette.content.default",
      "palette.content.subtle",
      "palette.content.brand",
      "palette.content.knockout",
      "palette.content.on-brand",
      "palette.content.error-default",
    ];
    for (const key of semanticKeys) {
      const def = resolved[key];
      if (def && typeof def.resolved === "string") {
        semanticColors[toPencilName(key)] = def.resolved;
      }
    }

    // Component tokens (non-color values useful in code)
    const componentTokens: Record<string, string | number> = {};
    for (const [key, def] of Object.entries(resolved)) {
      if (!key.startsWith("component.")) continue;
      if (def.type === "color" && typeof def.resolved === "string") {
        componentTokens[toPencilName(key)] = def.resolved;
      } else if (def.type === "dimension" || def.type === "number") {
        const n = typeof def.resolved === "number" ? def.resolved : parseFloat(String(def.resolved));
        if (!isNaN(n)) componentTokens[toPencilName(key)] = n;
      }
    }

    const colorsStr = Object.entries(colors)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([k, v]) => `"${k}": "${v}"`)
      .join(", ");

    const semStr = Object.entries(semanticColors)
      .map(([k, v]) => `"${k}": "${v}"`)
      .join(", ");

    const compEntries = Object.entries(componentTokens)
      .slice(0, 50)
      .map(([k, v]) => (typeof v === "number" ? `"${k}": ${v}` : `"${k}": "${v}"`))
      .join(", ");

    lines.push("  {");
    lines.push(`    name: ${JSON.stringify(brand)},`);
    lines.push(`    slug: "${slug}",`);
    lines.push(`    colors: { ${colorsStr} },`);
    lines.push(`    fontDefault: ${JSON.stringify(fontDefault)},`);
    lines.push(`    fontSecondary: ${JSON.stringify(fontSecondary)},`);
    lines.push(`    semanticColors: { ${semStr} },`);
    lines.push(`    componentTokens: { ${compEntries} },`);
    lines.push("  },");
  }

  lines.push("];");
  return lines.join("\n");
}

function generateTokensCss(
  brandNames: string[],
  resolvedBrands: Record<string, Record<string, FlatToken & { resolved: unknown }>>,
  globalTokenNames: string[],
  brandThemedTokenNames: string[]
): string {
  const lines: string[] = [
    "/* Auto-generated by scripts/sync-tokens.ts — do not edit manually */",
    `/* Source: Token Studio API | Synced: ${new Date().toISOString()} */`,
    "",
  ];

  // :root — global tokens shared across all brands
  lines.push(":root {");
  const wl = resolvedBrands["White Label"];
  const globalByGroup: Record<string, [string, string][]> = {};

  for (const tokenName of globalTokenNames.sort()) {
    const def = wl[tokenName];
    if (!def) continue;
    const cssName = toPencilName(tokenName);
    const resolved = def.resolved;

    // Skip typography composites and meta tokens in CSS (they're JSON blobs)
    if (def.type === "typography" || def.type === "border") continue;

    let cssValue: string;
    if (def.type === "color") {
      cssValue = String(resolved);
    } else if (
      def.type === "dimension" ||
      def.type === "spacing" ||
      def.type === "borderWidth" ||
      def.type === "sizing"
    ) {
      const n = typeof resolved === "number" ? resolved : parseFloat(String(resolved));
      cssValue = isNaN(n) ? String(resolved) : `${n}px`;
    } else if (def.type === "borderRadius") {
      const n = typeof resolved === "number" ? resolved : parseFloat(String(resolved));
      cssValue = isNaN(n) ? String(resolved) : `${n}px`;
    } else if (def.type === "opacity") {
      cssValue = String(resolved);
    } else if (def.type === "number") {
      cssValue = String(resolved);
    } else {
      cssValue = String(resolved);
    }

    const group = cssName.split("-").slice(0, 2).join("-");
    if (!globalByGroup[group]) globalByGroup[group] = [];
    globalByGroup[group].push([cssName, cssValue]);
  }

  for (const [, entries] of Object.entries(globalByGroup).sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    for (const [name, value] of entries) {
      lines.push(`  --${name}: ${value};`);
    }
  }
  lines.push("}");
  lines.push("");

  // Per-brand overrides
  for (const brand of brandNames) {
    const slug = slugify(brand);
    const resolved = resolvedBrands[brand];
    lines.push(`[data-brand="${slug}"] {`);
    lines.push(`  --brand-name: ${JSON.stringify(brand)};`);

    // Brand primary shorthand
    const brand1 = resolved["palette.brand.1"];
    if (brand1 && typeof brand1.resolved === "string") {
      lines.push(`  --brand-primary: ${brand1.resolved};`);
    }

    // Font stacks
    const fontDef = resolved["font.family.default"];
    const serifDef = resolved["font.family.serif"];
    const fontDefault =
      fontDef && typeof fontDef.resolved === "string"
        ? fontDef.resolved
        : "system-ui";
    const fontSerif =
      serifDef && typeof serifDef.resolved === "string"
        ? serifDef.resolved
        : "Georgia";
    lines.push(
      `  --font-brand-sans: "${fontDefault}", system-ui, sans-serif;`
    );
    lines.push(`  --font-brand-serif: "${fontSerif}", Georgia, serif;`);

    // All brand-themed tokens
    for (const tokenName of brandThemedTokenNames.sort()) {
      const def = resolved[tokenName];
      if (!def) continue;
      if (def.type === "typography" || def.type === "border") continue;

      const cssName = toPencilName(tokenName);
      const val = def.resolved;

      let cssValue: string;
      if (def.type === "color") {
        cssValue = String(val);
      } else if (
        def.type === "dimension" ||
        def.type === "spacing" ||
        def.type === "borderWidth" ||
        def.type === "sizing" ||
        def.type === "borderRadius"
      ) {
        const n = typeof val === "number" ? val : parseFloat(String(val));
        cssValue = isNaN(n) ? String(val) : `${n}px`;
      } else if (def.type === "fontFamilies") {
        cssValue = `"${val}"`;
      } else {
        cssValue = String(val);
      }

      lines.push(`  --${cssName}: ${cssValue};`);
    }

    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

// ── Main ───────────────────────────────────────────────────────────────

async function main() {
  console.log("Fetching tokens from Token Studio API...");
  const data = await fetchTokens();

  console.log("Processing tokens...");
  const {
    brandNames,
    resolvedBrands,
    globalTokenNames,
    brandThemedTokenNames,
  } = processTokenStudio(data as Record<string, unknown>);

  console.log(
    `  ${brandNames.length} brands, ${globalTokenNames.length} global tokens, ${brandThemedTokenNames.length} brand-themed tokens`
  );

  const srcDir = path.resolve(__dirname, "../src/lib");

  // 1. pencil-variables.json
  const pencilVars = generatePencilVariables(
    brandNames,
    resolvedBrands,
    globalTokenNames,
    brandThemedTokenNames
  );
  const pencilPath = path.join(srcDir, "pencil-variables.json");
  fs.writeFileSync(pencilPath, JSON.stringify(pencilVars, null, 2));
  console.log(
    `Wrote src/lib/pencil-variables.json (${Object.keys(pencilVars).length} variables)`
  );

  // 2. brands.ts
  const brandsTs = generateBrandsTs(brandNames, resolvedBrands);
  fs.writeFileSync(path.join(srcDir, "brands.ts"), brandsTs);
  console.log(`Wrote src/lib/brands.ts (${brandNames.length} brands)`);

  // 3. tokens.css
  const tokensCss = generateTokensCss(
    brandNames,
    resolvedBrands,
    globalTokenNames,
    brandThemedTokenNames
  );
  fs.writeFileSync(path.join(srcDir, "tokens.css"), tokensCss);
  console.log(`Wrote src/lib/tokens.css`);

  console.log("\nSync complete!");
  console.log(
    "To update Pencil, run: npm run sync-to-pencil"
  );
}

main().catch(console.error);
