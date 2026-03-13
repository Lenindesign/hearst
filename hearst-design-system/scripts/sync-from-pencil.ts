/**
 * Sync from Pencil → App
 *
 * Reads the Pencil .pen file variables (exported JSON) and generates:
 *   1. src/lib/brands.ts   — TypeScript brand data
 *   2. src/lib/tokens.css   — CSS custom properties per brand
 *
 * Usage: npm run sync-pencil
 *
 * The pencil-variables.json file can come from:
 *   - Running `npm run sync-tokens` (which generates it from Token Studio API)
 *   - Exporting from Pencil via `get_variables` MCP tool
 */

import * as fs from "fs";
import * as path from "path";

const PENCIL_VARS_PATH = path.resolve(
  __dirname,
  "../src/lib/pencil-variables.json"
);

// ── Types ──────────────────────────────────────────────────────────────

interface ThemedValue {
  theme?: Record<string, string>;
  value: string | number;
}

interface PencilVariable {
  type: string;
  value: string | number | ThemedValue[];
}

interface BrandData {
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

function getBrandValue(
  variable: PencilVariable,
  brandName: string
): string | number | null {
  if (Array.isArray(variable.value)) {
    const entry = variable.value.find((v) => v.theme?.brand === brandName);
    if (entry) return entry.value;
    const fallback = variable.value.find(
      (v) => !v.theme || Object.keys(v.theme).length === 0
    );
    return fallback?.value ?? variable.value[0]?.value ?? null;
  }
  return variable.value;
}

function getGlobalValue(variable: PencilVariable): string | number | null {
  if (Array.isArray(variable.value)) {
    const noTheme = variable.value.find(
      (v) => !v.theme || Object.keys(v.theme).length === 0
    );
    return noTheme?.value ?? variable.value[0]?.value ?? null;
  }
  return variable.value;
}

const INTERNAL_PREFIXES = ["A:", "T:", "Y:", "n:"];

function isInternalVar(name: string): boolean {
  return INTERNAL_PREFIXES.some((p) => name.startsWith(p));
}

function isThemedVar(variable: PencilVariable): boolean {
  return (
    Array.isArray(variable.value) &&
    variable.value.some((v) => v.theme?.brand !== undefined)
  );
}

// ── Main ───────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(PENCIL_VARS_PATH)) {
    console.error(`Pencil variables file not found at ${PENCIL_VARS_PATH}`);
    console.error(
      "Run `npm run sync-tokens` first, or export from Pencil via get_variables MCP."
    );
    process.exit(1);
  }

  const raw: Record<string, PencilVariable> = JSON.parse(
    fs.readFileSync(PENCIL_VARS_PATH, "utf-8")
  );

  // Discover brand names from themed variables (no hardcoded list)
  const brandNameSet = new Set<string>();
  for (const variable of Object.values(raw)) {
    if (Array.isArray(variable.value)) {
      for (const entry of variable.value) {
        if (entry.theme?.brand) brandNameSet.add(entry.theme.brand);
      }
    }
  }
  const brandNames = Array.from(brandNameSet).sort((a, b) => {
    if (a === "White Label") return -1;
    if (b === "White Label") return 1;
    return a.localeCompare(b);
  });
  console.log(`Discovered ${brandNames.length} brands`);

  // Separate Hearst tokens from Pencil internal UI tokens
  const hearstVars: Record<string, PencilVariable> = {};
  for (const [name, def] of Object.entries(raw)) {
    if (!isInternalVar(name)) {
      hearstVars[name] = def;
    }
  }

  // Classify: global (same across brands) vs brand-themed
  const globalVars: Record<string, PencilVariable> = {};
  const themedVars: Record<string, PencilVariable> = {};
  for (const [name, def] of Object.entries(hearstVars)) {
    if (isThemedVar(def)) {
      themedVars[name] = def;
    } else {
      globalVars[name] = def;
    }
  }

  console.log(
    `  ${Object.keys(hearstVars).length} Hearst tokens (${Object.keys(globalVars).length} global, ${Object.keys(themedVars).length} brand-themed)`
  );

  // Build brand data for brands.ts
  const brands: BrandData[] = brandNames.map((name) => {
    const colors: Record<string, string> = {};
    for (let i = 1; i <= 14; i++) {
      const key = `palette-brand-${i}`;
      if (themedVars[key]) {
        const val = getBrandValue(themedVars[key], name);
        if (val && typeof val === "string" && val.startsWith("#")) {
          colors[String(i)] = val;
        }
      }
    }
    // Fallback to legacy brand-1..6 keys
    if (Object.keys(colors).length === 0) {
      for (let i = 1; i <= 6; i++) {
        const key = `brand-${i}`;
        if (themedVars[key]) {
          const val = getBrandValue(themedVars[key], name);
          if (val) colors[String(i)] = String(val);
        }
      }
    }

    const fontDefaultVar = themedVars["font-family-default"];
    const fontSerifVar = themedVars["font-family-serif"];
    const fontDefault = fontDefaultVar
      ? String(getBrandValue(fontDefaultVar, name) || "system-ui")
      : "system-ui";
    const fontSecondary = fontSerifVar
      ? String(getBrandValue(fontSerifVar, name) || "Georgia")
      : "Georgia";

    // Semantic colors
    const semanticColors: Record<string, string> = {};
    const semanticPrefixes = [
      "palette-background-",
      "palette-content-",
    ];
    for (const [key, def] of Object.entries(themedVars)) {
      if (
        def.type === "color" &&
        semanticPrefixes.some((p) => key.startsWith(p))
      ) {
        const val = getBrandValue(def, name);
        if (val && typeof val === "string") semanticColors[key] = val;
      }
    }

    // Component tokens
    const componentTokens: Record<string, string | number> = {};
    for (const [key, def] of Object.entries(themedVars)) {
      if (!key.startsWith("component-")) continue;
      const val = getBrandValue(def, name);
      if (val === null) continue;
      if (def.type === "color" && typeof val === "string") {
        componentTokens[key] = val;
      } else if (def.type === "number" && typeof val === "number") {
        componentTokens[key] = val;
      }
    }

    return {
      name,
      slug: slugify(name),
      colors,
      fontDefault,
      fontSecondary,
      semanticColors,
      componentTokens,
    };
  });

  const srcDir = path.resolve(__dirname, "../src/lib");

  // Generate brands.ts
  const brandsTs = generateBrandsTs(brands);
  fs.writeFileSync(path.join(srcDir, "brands.ts"), brandsTs);
  console.log(`Wrote src/lib/brands.ts (${brands.length} brands)`);

  // Generate tokens.css
  const tokensCss = generateTokensCss(brands, globalVars, themedVars, brandNames);
  fs.writeFileSync(path.join(srcDir, "tokens.css"), tokensCss);
  console.log(`Wrote src/lib/tokens.css`);

  console.log("\nSync from Pencil complete!");
}

// ── Generators ─────────────────────────────────────────────────────────

function generateBrandsTs(brands: BrandData[]): string {
  const lines: string[] = [
    "// Auto-generated by scripts/sync-from-pencil.ts — do not edit manually",
    `// Source: hearst-brands.pen | Synced: ${new Date().toISOString()}`,
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
      .map(([k, v]) =>
        typeof v === "number" ? `"${k}": ${v}` : `"${k}": "${v}"`
      )
      .join(", ");

    lines.push("  {");
    lines.push(`    name: ${JSON.stringify(b.name)},`);
    lines.push(`    slug: "${b.slug}",`);
    lines.push(`    colors: { ${colorsStr} },`);
    lines.push(`    fontDefault: ${JSON.stringify(b.fontDefault)},`);
    lines.push(`    fontSecondary: ${JSON.stringify(b.fontSecondary)},`);
    lines.push(`    semanticColors: { ${semStr} },`);
    lines.push(`    componentTokens: { ${compEntries} },`);
    lines.push("  },");
  }

  lines.push("];");
  return lines.join("\n");
}

function generateTokensCss(
  brands: BrandData[],
  globalVars: Record<string, PencilVariable>,
  themedVars: Record<string, PencilVariable>,
  brandNames: string[]
): string {
  const lines: string[] = [
    "/* Auto-generated by scripts/sync-from-pencil.ts — do not edit manually */",
    `/* Source: hearst-brands.pen | Synced: ${new Date().toISOString()} */`,
    "",
  ];

  // :root — global tokens
  lines.push(":root {");
  for (const [name, def] of Object.entries(globalVars).sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    const val = getGlobalValue(def);
    if (val === null) continue;

    // Skip typography/border composites (JSON blobs)
    if (typeof val === "string" && val.startsWith("{")) continue;

    let cssValue: string;
    if (def.type === "color") {
      cssValue = String(val);
    } else if (def.type === "number") {
      const isSpacing = name.startsWith("space-");
      const isBorderWidth = name.startsWith("border-width-");
      const isBorderRadius = name.startsWith("border-radius-");
      const isLayout = name.startsWith("layout-");
      const isSizing = name.startsWith("sizing-");
      const isWidth = name.startsWith("width-");
      if (isSpacing || isBorderWidth || isBorderRadius || isLayout || isSizing || isWidth) {
        cssValue = `${val}px`;
      } else {
        cssValue = String(val);
      }
    } else {
      cssValue = String(val);
    }

    lines.push(`  --${name}: ${cssValue};`);
  }
  lines.push("}");
  lines.push("");

  // Per-brand overrides
  for (const brand of brands) {
    lines.push(`[data-brand="${brand.slug}"] {`);
    lines.push(`  --brand-name: ${JSON.stringify(brand.name)};`);

    // Brand primary shorthand
    const primary = brand.colors["1"] || Object.values(brand.colors)[0];
    if (primary) lines.push(`  --brand-primary: ${primary};`);

    // Font stacks
    lines.push(
      `  --font-brand-sans: "${brand.fontDefault}", system-ui, sans-serif;`
    );
    lines.push(
      `  --font-brand-serif: "${brand.fontSecondary}", Georgia, serif;`
    );

    // All brand-themed tokens
    for (const [name, def] of Object.entries(themedVars).sort(([a], [b]) =>
      a.localeCompare(b)
    )) {
      const val = getBrandValue(def, brand.name);
      if (val === null) continue;

      // Skip typography/border composites
      if (typeof val === "string" && val.startsWith("{")) continue;

      let cssValue: string;
      if (def.type === "color") {
        cssValue = String(val);
      } else if (def.type === "number") {
        const needsPx =
          name.startsWith("space-") ||
          name.startsWith("border-width-") ||
          name.startsWith("border-radius-") ||
          name.startsWith("component-") ||
          name.startsWith("sizing-") ||
          name.startsWith("layout-");
        cssValue = needsPx ? `${val}px` : String(val);
      } else if (def.type === "string") {
        // Font families get quoted
        if (name.startsWith("font-family-")) {
          cssValue = `"${val}"`;
        } else {
          cssValue = String(val);
        }
      } else {
        cssValue = String(val);
      }

      lines.push(`  --${name}: ${cssValue};`);
    }

    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

main();
