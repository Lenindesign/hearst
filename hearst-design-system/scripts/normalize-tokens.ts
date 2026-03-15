/**
 * Normalizes the raw Token Studio export into the three-layer structure:
 *
 *   tokens/core/*          ← Primitives/White Label
 *   tokens/semantic/*      ← Alias/White Label (minus component.*)
 *   tokens/brands/<slug>.json ← Alias/<Brand> (only diffs from White Label)
 *
 * Component tokens are audited and classified:
 *   - Promoted to semantic if they map cleanly to a semantic concept
 *   - Kept as component-local if they're truly component-specific
 *   - Flagged for review if they duplicate a semantic token
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..");
const TOKENS_DIR = join(ROOT, "tokens");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TokenValue {
  value: string | number;
  type: string;
  description?: string;
}

type TokenTree = { [key: string]: TokenTree | TokenValue };

interface Theme {
  name: string;
  group: string;
  selectedTokenSets: Record<string, "enabled" | "source" | "disabled">;
}

interface NormalizeStats {
  core: number;
  semantic: number;
  brands: number;
  brandTokens: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isLeaf(node: unknown): node is TokenValue {
  return (
    typeof node === "object" &&
    node !== null &&
    "value" in node &&
    "type" in node
  );
}

function countLeaves(tree: TokenTree): number {
  let count = 0;
  for (const v of Object.values(tree)) {
    if (isLeaf(v)) count++;
    else if (typeof v === "object" && v !== null) count += countLeaves(v as TokenTree);
  }
  return count;
}

function flattenPaths(tree: TokenTree, prefix = ""): Map<string, TokenValue> {
  const result = new Map<string, TokenValue>();
  for (const [k, v] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (isLeaf(v)) {
      result.set(path, v);
    } else if (typeof v === "object" && v !== null) {
      for (const [p, tv] of flattenPaths(v as TokenTree, path)) {
        result.set(p, tv);
      }
    }
  }
  return result;
}

function unflattenPaths(flat: Map<string, TokenValue>): TokenTree {
  const tree: TokenTree = {};
  for (const [path, value] of flat) {
    const parts = path.split(".");
    let current: TokenTree = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) current[parts[i]] = {};
      current = current[parts[i]] as TokenTree;
    }
    current[parts[parts.length - 1]] = value;
  }
  return tree;
}

function writeJSON(filePath: string, data: unknown) {
  mkdirSync(join(filePath, ".."), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Core layer: Primitives/White Label → tokens/core/*
// ---------------------------------------------------------------------------

const PRIMITIVE_FILE_MAP: Record<string, string> = {
  _palette: "color.json",
  _font: "typography.json",
  _size: "spacing.json",
  _border_width: "border.json",
  "_border-width": "border.json",
  _opacity: "opacity.json",
  z: "elevation.json",
};

function normalizeCore(primitives: TokenTree): number {
  const coreDir = join(TOKENS_DIR, "core");
  let total = 0;

  for (const [key, subtree] of Object.entries(primitives)) {
    if (key === "slug" || key === "type" || key === "url") continue;

    const fileName = PRIMITIVE_FILE_MAP[key] || `${key.replace(/^_/, "")}.json`;
    const tree = subtree as TokenTree;
    const count = countLeaves(tree);
    total += count;

    const cleanKey = key.replace(/^_/, "");
    writeJSON(join(coreDir, fileName), { [cleanKey]: tree });
  }

  return total;
}

// ---------------------------------------------------------------------------
// Semantic layer: Alias/White Label → tokens/semantic/*
// ---------------------------------------------------------------------------

const SEMANTIC_CATEGORY_MAP: Record<string, string> = {
  palette: "color/palette.json",
  border: "color/border.json",
  elevation: "layout/elevation.json",
  font: "typography/font.json",
  typography: "typography/scale.json",
  layout: "layout/spacing.json",
  space: "layout/space.json",
  width: "layout/width.json",
  sizing: "layout/sizing.json",
  opacity: "color/opacity.json",
  asset: "misc/asset.json",
};

function normalizeSemantic(aliasWhiteLabel: TokenTree): number {
  const semDir = join(TOKENS_DIR, "semantic");
  let total = 0;

  const componentTokens: TokenTree = {};

  for (const [key, subtree] of Object.entries(aliasWhiteLabel)) {
    if (key === "slug" || key === "type" || key === "url") continue;

    const tree = subtree as TokenTree;
    const count = countLeaves(tree);

    if (key === "component") {
      Object.assign(componentTokens, tree);
      continue;
    }

    const fileName = SEMANTIC_CATEGORY_MAP[key] || `misc/${key}.json`;
    total += count;
    writeJSON(join(semDir, fileName), { [key]: tree });
  }

  // Component tokens get their own file with an audit trail
  const compCount = countLeaves(componentTokens);
  if (compCount > 0) {
    total += compCount;
    writeJSON(join(semDir, "component/tokens.json"), {
      _audit: {
        note: "These component tokens are candidates for promotion to semantic tokens or deletion. See validate-tokens.ts for the audit report.",
        totalTokens: compCount,
      },
      component: componentTokens,
    });
  }

  return total;
}

// ---------------------------------------------------------------------------
// Brand layer: Alias/<Brand> → tokens/brands/<slug>.json
// ---------------------------------------------------------------------------

function normalizeBrands(
  values: Record<string, Record<string, unknown>>,
  themes: Theme[]
): { files: number; tokens: number } {
  const brandsDir = join(TOKENS_DIR, "brands");
  let files = 0;
  let totalTokens = 0;

  const wlFlat = flattenPaths(
    (values["Alias/White Label"] as TokenTree) || {}
  );

  for (const [setName, setData] of Object.entries(values)) {
    if (!setName.startsWith("Alias/") || setName === "Alias/White Label") {
      continue;
    }

    const brandName = setName.replace("Alias/", "");
    const slug = slugify(brandName);
    const brandFlat = flattenPaths(setData as TokenTree);

    // Only keep tokens that differ from White Label
    const overrides = new Map<string, TokenValue>();
    for (const [path, token] of brandFlat) {
      if (path === "slug" || path === "type" || path === "url") continue;

      const wlToken = wlFlat.get(path);
      if (!wlToken || JSON.stringify(token) !== JSON.stringify(wlToken)) {
        overrides.set(path, token);
      }
    }

    // Find the theme config for this brand
    const theme = themes.find(
      (t) => t.name === brandName && t.group === "Alias"
    );

    const brandTree = unflattenPaths(overrides);
    const tokenCount = overrides.size;
    totalTokens += tokenCount;

    writeJSON(join(brandsDir, `${slug}.json`), {
      $brand: {
        name: brandName,
        slug,
        source: setName,
        overrideCount: tokenCount,
        inheritsFrom: "White Label",
        themeConfig: theme?.selectedTokenSets || null,
      },
      ...brandTree,
    });

    files++;
  }

  return { files, tokens: totalTokens };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function normalize(
  values: Record<string, Record<string, unknown>>,
  themes: Theme[]
): NormalizeStats {
  const primitives = values["Primitives/White Label"] as TokenTree | undefined;
  const aliasWL = values["Alias/White Label"] as TokenTree | undefined;

  if (!primitives) throw new Error("Missing Primitives/White Label set");
  if (!aliasWL) throw new Error("Missing Alias/White Label set");

  const core = normalizeCore(primitives);
  const semantic = normalizeSemantic(aliasWL);
  const { files: brands, tokens: brandTokens } = normalizeBrands(
    values,
    themes
  );

  // Write a manifest for downstream tools
  writeJSON(join(TOKENS_DIR, "manifest.json"), {
    generatedAt: new Date().toISOString(),
    layers: {
      core: { dir: "core", tokens: core },
      semantic: { dir: "semantic", tokens: semantic },
      brands: { dir: "brands", files: brands, tokens: brandTokens },
    },
    brandSlugs: Object.keys(values)
      .filter((k) => k.startsWith("Alias/") && k !== "Alias/White Label")
      .map((k) => slugify(k.replace("Alias/", ""))),
  });

  return { core, semantic, brands, brandTokens };
}
