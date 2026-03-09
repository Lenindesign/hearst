/**
 * Sync from Pencil → App
 *
 * Reads the Pencil .pen file variables (exported JSON) and generates:
 *   1. src/lib/brands.ts   — TypeScript brand data
 *   2. src/lib/tokens.css   — CSS custom properties per brand
 *
 * Usage: npx tsx scripts/sync-from-pencil.ts
 */

import * as fs from "fs";
import * as path from "path";

const PENCIL_VARS_PATH = path.resolve(
  __dirname,
  "../src/lib/pencil-variables.json"
);

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
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
}

function getThemedValues(
  variable: PencilVariable,
  themeKey: string
): Map<string, string | number> {
  const result = new Map<string, string | number>();
  if (Array.isArray(variable.value)) {
    for (const entry of variable.value) {
      const brand = entry.theme?.[themeKey];
      if (brand) result.set(brand, entry.value);
    }
  }
  return result;
}

function getDefaultValue(variable: PencilVariable): string | number | null {
  if (Array.isArray(variable.value)) {
    const noTheme = variable.value.find(
      (v) => !v.theme || Object.keys(v.theme).length === 0
    );
    return noTheme?.value ?? variable.value[0]?.value ?? null;
  }
  return variable.value;
}

function main() {
  if (!fs.existsSync(PENCIL_VARS_PATH)) {
    console.error(`Pencil variables file not found at ${PENCIL_VARS_PATH}`);
    console.error(
      "Export variables from Pencil first (get_variables → pencil-variables.json)."
    );
    process.exit(1);
  }

  const raw: Record<string, PencilVariable> = JSON.parse(
    fs.readFileSync(PENCIL_VARS_PATH, "utf-8")
  );

  const brandNames: string[] = [
    "White Label",
    "Autoweek",
    "Best Products",
    "Bicycling",
    "Biography",
    "Car and Driver",
    "Cosmopolitan",
    "Country Living",
    "Delish",
    "ELLE",
    "ELLE Decor",
    "Esquire",
    "Good Housekeeping",
    "Harper's BAZAAR",
    "House Beautiful",
    "Men's Health",
    "Oprah Daily",
    "Popular Mechanics",
    "Prevention",
    "Redbook",
    "Road & Track",
    "Runner's World",
    "Seventeen",
    "The Pioneer Woman",
    "Town & Country",
    "Veranda",
    "Woman's Day",
    "Women's Health",
  ];

  const colorKeys = [
    "brand-1",
    "brand-2",
    "brand-3",
    "brand-4",
    "brand-5",
    "brand-6",
  ];
  const colorMaps: Record<string, Map<string, string | number>> = {};
  for (const key of colorKeys) {
    const variable = raw[key];
    if (variable) {
      colorMaps[key] = getThemedValues(variable, "brand");
    }
  }

  const fontDefaultVar = raw["font-family-default"];
  const fontSecondaryVar = raw["font-family-serif"];
  const fontDefaultMap = fontDefaultVar
    ? getThemedValues(fontDefaultVar, "brand")
    : new Map<string, string | number>();
  const fontSecondaryMap = fontSecondaryVar
    ? getThemedValues(fontSecondaryVar, "brand")
    : new Map<string, string | number>();

  const semanticColorKeys = [
    "background-page",
    "background-default",
    "background-subtle",
    "background-knockout",
    "background-brand",
    "background-error",
    "content-default",
    "content-subtle",
    "content-knockout",
    "content-brand",
    "content-on-brand",
    "content-error",
  ];

  const semanticMaps: Record<string, Map<string, string | number>> = {};
  for (const key of semanticColorKeys) {
    const variable = raw[key];
    if (variable) {
      semanticMaps[key] = getThemedValues(variable, "brand");
    }
  }

  const spacingKeys = Object.keys(raw).filter((k) => k.startsWith("space-"));
  const borderRadiusKeys = Object.keys(raw).filter((k) =>
    k.startsWith("border-radius-")
  );

  const globalSpacing: Record<string, number> = {};
  for (const key of spacingKeys) {
    const val = getDefaultValue(raw[key]);
    if (typeof val === "number") {
      globalSpacing[key.replace("space-", "")] = val;
    }
  }

  const globalBorderRadius: Record<string, number> = {};
  for (const key of borderRadiusKeys) {
    const val = getDefaultValue(raw[key]);
    if (typeof val === "number") {
      globalBorderRadius[key.replace("border-radius-", "")] = val;
    }
  }

  const paletteKeys = Object.keys(raw).filter((k) =>
    k.startsWith("palette-")
  );
  const globalPalette: Record<string, string> = {};
  for (const key of paletteKeys) {
    const val = getDefaultValue(raw[key]);
    if (typeof val === "string") {
      globalPalette[key] = val;
    }
  }

  const shadcnPrefixes = ["A:", "T:", "Y:", "n:"];
  const shadcnVarKeys = Object.keys(raw).filter((k) =>
    shadcnPrefixes.some((p) => k.startsWith(p))
  );

  const brands: BrandData[] = brandNames.map((name) => {
    const colors: Record<string, string> = {};
    for (let i = 1; i <= 6; i++) {
      const key = `brand-${i}`;
      const val = colorMaps[key]?.get(name) || "#ffffff";
      colors[String(i)] = String(val);
    }

    const semanticColors: Record<string, string> = {};
    for (const key of semanticColorKeys) {
      const val = semanticMaps[key]?.get(name);
      if (val) semanticColors[key] = String(val);
    }

    return {
      name,
      slug: slugify(name),
      colors,
      fontDefault: String(fontDefaultMap.get(name) || "SF Pro"),
      fontSecondary: String(fontSecondaryMap.get(name) || "SF Pro"),
      semanticColors,
      spacing: globalSpacing,
      borderRadius: globalBorderRadius,
    };
  });

  const srcDir = path.resolve(__dirname, "../src/lib");

  const brandsTs = generateBrandsTs(brands);
  fs.writeFileSync(path.join(srcDir, "brands.ts"), brandsTs);
  console.log(`Wrote src/lib/brands.ts (${brands.length} brands)`);

  const tokensCss = generateTokensCss(
    brands,
    globalPalette,
    globalSpacing,
    globalBorderRadius,
    raw,
    shadcnVarKeys
  );
  fs.writeFileSync(path.join(srcDir, "tokens.css"), tokensCss);
  console.log(`Wrote src/lib/tokens.css`);

  console.log("\nSync from Pencil complete!");
}

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

    lines.push("  {");
    lines.push(`    name: "${b.name}",`);
    lines.push(`    slug: "${b.slug}",`);
    lines.push(`    colors: { ${colorsStr} },`);
    lines.push(`    fontDefault: "${b.fontDefault}",`);
    lines.push(`    fontSecondary: "${b.fontSecondary}",`);
    lines.push(`    semanticColors: { ${semStr} },`);
    lines.push("  },");
  }

  lines.push("];");
  return lines.join("\n");
}

function generateTokensCss(
  brands: BrandData[],
  palette: Record<string, string>,
  spacing: Record<string, number>,
  borderRadius: Record<string, number>,
  raw: Record<string, PencilVariable>,
  shadcnVarKeys: string[]
): string {
  const lines: string[] = [
    "/* Auto-generated by scripts/sync-from-pencil.ts — do not edit manually */",
    `/* Source: hearst-brands.pen | Synced: ${new Date().toISOString()} */`,
    "",
  ];

  // Global design tokens (shared across all brands)
  lines.push(":root {");

  // Palette
  for (const [k, v] of Object.entries(palette).sort()) {
    lines.push(`  --${k}: ${v};`);
  }

  // Spacing
  for (const [k, v] of Object.entries(spacing).sort()) {
    lines.push(`  --space-${k}: ${v}px;`);
  }

  // Border radius
  for (const [k, v] of Object.entries(borderRadius).sort()) {
    lines.push(`  --radius-${k}: ${v}px;`);
  }

  lines.push("}");
  lines.push("");

  // Per-brand tokens
  for (const b of brands) {
    const primary = b.colors["1"] || "#000000";
    const meaningful = Object.entries(b.colors).filter(
      ([, v]) => v.toLowerCase() !== "#ffffff"
    );

    lines.push(`[data-brand="${b.slug}"] {`);
    lines.push(`  --brand-name: "${b.name}";`);
    lines.push(`  --brand-primary: ${primary};`);

    for (const [k, v] of meaningful) {
      lines.push(`  --brand-${k}: ${v};`);
    }

    // Semantic colors
    for (const [k, v] of Object.entries(b.semanticColors)) {
      lines.push(`  --${k}: ${v};`);
    }

    lines.push(
      `  --font-brand-sans: "${b.fontDefault}", system-ui, sans-serif;`
    );
    lines.push(
      `  --font-brand-serif: "${b.fontSecondary}", Georgia, serif;`
    );

    // shadcn theme variables for this brand
    for (const varKey of shadcnVarKeys) {
      const variable = raw[varKey];
      if (!variable || !Array.isArray(variable.value)) continue;

      const brandEntry = variable.value.find(
        (v: ThemedValue) => v.theme?.brand === b.name
      );
      if (!brandEntry) continue;

      const cssVar = varKey.replace(/^[A-Z]:/, "").replace(/^[a-z]:/, "");
      lines.push(`  ${cssVar}: ${brandEntry.value};`);
    }

    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

main();
