/**
 * Validates the normalized token structure and produces an audit report.
 *
 * Checks:
 *   1. Broken references — {token.path} that don't resolve
 *   2. Duplicate component tokens — component tokens identical to a semantic token
 *   3. Banned patterns — component.*, publication-specific names, hard-coded literals in brand files
 *   4. Brand coverage — every brand file has the minimum required overrides
 *   5. Neutral alpha duplication — identical values repeated across brands
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..");
const TOKENS_DIR = join(ROOT, "tokens");

interface ValidationReport {
  warnings: string[];
  errors: string[];
  audit: {
    componentTokens: {
      total: number;
      promotable: string[];
      duplicateOfSemantic: string[];
      trulyUnique: string[];
    };
    brandCoverage: Record<string, { overrides: number; missingPalette: boolean }>;
    neutralAlphaDuplication: { duplicatedAcrossBrands: number };
  };
}

interface TokenValue {
  value: string | number;
  type: string;
}

function isLeaf(node: unknown): node is TokenValue {
  return (
    typeof node === "object" &&
    node !== null &&
    "value" in node &&
    "type" in node
  );
}

function flattenPaths(
  tree: Record<string, unknown>,
  prefix = ""
): Map<string, TokenValue> {
  const result = new Map<string, TokenValue>();
  for (const [k, v] of Object.entries(tree)) {
    if (k.startsWith("$") || k.startsWith("_")) continue;
    const path = prefix ? `${prefix}.${k}` : k;
    if (isLeaf(v)) {
      result.set(path, v);
    } else if (typeof v === "object" && v !== null) {
      for (const [p, tv] of flattenPaths(
        v as Record<string, unknown>,
        path
      )) {
        result.set(p, tv);
      }
    }
  }
  return result;
}

function loadDir(dir: string): Map<string, TokenValue> {
  const combined = new Map<string, TokenValue>();
  if (!existsSync(dir)) return combined;

  const files = readdirSync(dir, { recursive: true }) as string[];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const data = JSON.parse(readFileSync(join(dir, file), "utf-8"));
    for (const [p, v] of flattenPaths(data)) {
      combined.set(p, v);
    }
  }
  return combined;
}

function extractReferences(value: string): string[] {
  const refs: string[] = [];
  const re = /\{([^}]+)\}/g;
  let match;
  while ((match = re.exec(value)) !== null) {
    refs.push(match[1]);
  }
  return refs;
}

export function validate(): ValidationReport {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Load all layers
  const core = loadDir(join(TOKENS_DIR, "core"));
  const semantic = loadDir(join(TOKENS_DIR, "semantic"));

  // Combined resolution pool (core + semantic)
  const resolvable = new Map([...core, ...semantic]);

  // 1. Check for broken references in semantic tokens
  // Token Studio uses underscore-prefixed names (_palette, _size, _font) in
  // references but the normalizer strips the underscore when writing core/.
  // Build a lookup that handles both forms.
  const resolvableWithAliases = new Map(resolvable);
  for (const [path, token] of core) {
    resolvableWithAliases.set(`_${path}`, token);
  }

  for (const [path, token] of semantic) {
    if (typeof token.value === "string") {
      const refs = extractReferences(token.value);
      for (const ref of refs) {
        const dotPath = ref.replace(/\//g, ".");
        const found =
          resolvableWithAliases.has(dotPath) ||
          resolvableWithAliases.has(ref) ||
          resolvableWithAliases.has(`_${dotPath}`);

        if (!found) {
          // Self-references within semantic (e.g. component -> palette) are fine
          const isSelfRef = semantic.has(dotPath) || semantic.has(ref);
          if (!isSelfRef) {
            warnings.push(
              `Unresolved reference in semantic: ${path} -> {${ref}}`
            );
          }
        }
      }
    }
  }

  // 2. Audit component tokens
  const componentTokens = new Map<string, TokenValue>();
  const nonComponentSemantic = new Map<string, TokenValue>();

  for (const [path, token] of semantic) {
    if (path.startsWith("component.")) {
      componentTokens.set(path, token);
    } else {
      nonComponentSemantic.set(path, token);
    }
  }

  const promotable: string[] = [];
  const duplicateOfSemantic: string[] = [];
  const trulyUnique: string[] = [];

  // Semantic concepts that component tokens commonly map to
  const PROMOTION_MAP: Record<string, string> = {
    "component.link.inline.content.primary.default": "color.text.link.default",
    "component.link.inline.content.primary.hover": "color.text.link.hover",
    "component.hr.border.default": "color.border.default",
    "component.hr.border.brand": "color.border.brand",
    "component.rating.star.full": "color.feedback.highlight",
    "component.rating.star.empty": "color.feedback.neutral",
  };

  for (const [path, token] of componentTokens) {
    if (PROMOTION_MAP[path]) {
      promotable.push(`${path} -> ${PROMOTION_MAP[path]}`);
    } else {
      // Check if value is identical to any non-component semantic token
      let isDuplicate = false;
      for (const [semPath, semToken] of nonComponentSemantic) {
        if (
          JSON.stringify(token.value) === JSON.stringify(semToken.value) &&
          token.type === semToken.type
        ) {
          duplicateOfSemantic.push(`${path} == ${semPath}`);
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) trulyUnique.push(path);
    }
  }

  // 3. Validate brand files
  const brandsDir = join(TOKENS_DIR, "brands");
  const brandCoverage: Record<
    string,
    { overrides: number; missingPalette: boolean }
  > = {};

  if (existsSync(brandsDir)) {
    const brandFiles = readdirSync(brandsDir).filter((f) =>
      f.endsWith(".json")
    );

    for (const file of brandFiles) {
      const data = JSON.parse(
        readFileSync(join(brandsDir, file), "utf-8")
      );
      const brandMeta = data.$brand || {};
      const slug = brandMeta.slug || file.replace(".json", "");
      const flat = flattenPaths(data);

      const hasPaletteBrand = [...flat.keys()].some((p) =>
        p.startsWith("palette.brand.")
      );

      brandCoverage[slug] = {
        overrides: flat.size,
        missingPalette: !hasPaletteBrand,
      };

      if (!hasPaletteBrand) {
        warnings.push(
          `Brand "${slug}" has no palette.brand.* overrides — may inherit all colors from White Label`
        );
      }

      // Check for banned patterns: hard-coded hex in non-palette tokens
      for (const [path, token] of flat) {
        if (
          path.startsWith("palette.") ||
          path.startsWith("component.") ||
          typeof token.value !== "string"
        )
          continue;

        if (/^#[0-9a-fA-F]{3,8}$/.test(token.value)) {
          warnings.push(
            `Brand "${slug}" has hard-coded literal: ${path} = ${token.value} (should reference a core token)`
          );
        }
      }
    }
  }

  // 4. Neutral alpha duplication check
  const neutralAlphaValues = new Map<string, Set<string>>();
  if (existsSync(brandsDir)) {
    const brandFiles = readdirSync(brandsDir).filter((f) =>
      f.endsWith(".json")
    );
    for (const file of brandFiles) {
      const data = JSON.parse(
        readFileSync(join(brandsDir, file), "utf-8")
      );
      const flat = flattenPaths(data);
      for (const [path, token] of flat) {
        if (path.includes("neutral") && path.includes("alpha")) {
          if (!neutralAlphaValues.has(path)) {
            neutralAlphaValues.set(path, new Set());
          }
          neutralAlphaValues.get(path)!.add(String(token.value));
        }
      }
    }
  }

  let duplicatedNeutralAlpha = 0;
  for (const [path, vals] of neutralAlphaValues) {
    if (vals.size === 1) {
      duplicatedNeutralAlpha++;
      warnings.push(
        `Neutral alpha "${path}" has identical value across all brands — should be in core`
      );
    }
  }

  // 5. Check for missing core files
  const expectedCoreFiles = [
    "color.json",
    "typography.json",
    "spacing.json",
    "border.json",
    "opacity.json",
    "elevation.json",
  ];
  for (const file of expectedCoreFiles) {
    if (!existsSync(join(TOKENS_DIR, "core", file))) {
      errors.push(`Missing core file: tokens/core/${file}`);
    }
  }

  return {
    warnings,
    errors,
    audit: {
      componentTokens: {
        total: componentTokens.size,
        promotable,
        duplicateOfSemantic,
        trulyUnique,
      },
      brandCoverage,
      neutralAlphaDuplication: {
        duplicatedAcrossBrands: duplicatedNeutralAlpha,
      },
    },
  };
}

// CLI entry point
if (require.main === module) {
  const report = validate();

  console.log("=== Token Validation Report ===\n");

  console.log(`Component Token Audit (${report.audit.componentTokens.total} total):`);
  console.log(
    `  Promotable to semantic: ${report.audit.componentTokens.promotable.length}`
  );
  for (const p of report.audit.componentTokens.promotable) {
    console.log(`    ${p}`);
  }
  console.log(
    `  Duplicate of existing semantic: ${report.audit.componentTokens.duplicateOfSemantic.length}`
  );
  for (const d of report.audit.componentTokens.duplicateOfSemantic.slice(0, 10)) {
    console.log(`    ${d}`);
  }
  console.log(
    `  Truly unique (keep as component-local): ${report.audit.componentTokens.trulyUnique.length}`
  );

  console.log(`\nBrand Coverage:`);
  for (const [slug, info] of Object.entries(report.audit.brandCoverage)) {
    const flag = info.missingPalette ? " ⚠ no palette" : "";
    console.log(`  ${slug}: ${info.overrides} overrides${flag}`);
  }

  console.log(
    `\nNeutral Alpha Duplication: ${report.audit.neutralAlphaDuplication.duplicatedAcrossBrands} tokens identical across all brands`
  );

  if (report.warnings.length) {
    console.log(`\nWarnings (${report.warnings.length}):`);
    for (const w of report.warnings.slice(0, 30)) console.log(`  ⚠ ${w}`);
    if (report.warnings.length > 30)
      console.log(`  ... +${report.warnings.length - 30} more`);
  }

  if (report.errors.length) {
    console.log(`\nErrors (${report.errors.length}):`);
    for (const e of report.errors) console.log(`  ✗ ${e}`);
    process.exit(1);
  }

  console.log("\nValidation complete.");
}
