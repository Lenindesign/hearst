/**
 * Validates the normalized token structure and produces an audit report.
 *
 * Checks:
 *   1. Broken references — {token.path} that don't resolve
 *   2. Component-token promotion safety across every publication mode
 *   3. Duplicate component tokens — component tokens identical to a semantic token
 *   4. Brand-source integrity — canonical flat brand files expose brand-1..14
 *   5. Brand coverage — every publication file has a primary brand color
 *   6. Neutral alpha duplication — identical values repeated across brands
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..");
const TOKENS_DIR = join(ROOT, "tokens");

export interface ValidationReport {
  warnings: string[];
  errors: string[];
  audit: {
    componentTokens: {
      total: number;
      promotable: string[];
      promotionBlocked: string[];
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
  const brandsDir = join(TOKENS_DIR, "brands");
  const brandFiles = existsSync(brandsDir)
    ? readdirSync(brandsDir).filter(
        (file) => file.endsWith(".json") && file !== "_meta.json"
      )
    : [];
  const brandModes = new Map<string, Map<string, TokenValue>>();
  for (const file of brandFiles) {
    brandModes.set(
      file.replace(".json", ""),
      flattenPaths(
        JSON.parse(readFileSync(join(brandsDir, file), "utf-8"))
      )
    );
  }

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
  const promotionBlocked: string[] = [];
  const duplicateOfSemantic: string[] = [];
  const trulyUnique: string[] = [];

  // Semantic concepts that component tokens commonly map to. A mapping is
  // promotable only when its resolved value remains identical in every brand
  // mode. Matching the base semantic source alone can erase intentional
  // component overrides in publication themes.
  const PROMOTION_MAP: Record<string, string> = {
    "component.link.inline.content.primary.default": "palette.content.default",
    "component.link.inline.content.primary.hover":
      "palette.content.default-link-hover",
    "component.hr.border.default": "palette.neutral.400",
    "component.hr.border.brand": "palette.brand.1",
    "component.rating.star.full": "palette.alert.highlight.400",
    "component.rating.star.empty": "palette.neutral.600",
  };

  for (const [path, token] of componentTokens) {
    if (PROMOTION_MAP[path]) {
      const targetPath = PROMOTION_MAP[path];
      const targetToken = nonComponentSemantic.get(targetPath);
      const componentFlatKey = path.replaceAll(".", "-");
      const targetFlatKey = targetPath.replaceAll(".", "-");

      if (!targetToken) {
        promotionBlocked.push(
          `${path} -> ${targetPath} (semantic target does not exist)`
        );
        continue;
      }

      const divergentModes: string[] = [];
      for (const [slug, mode] of brandModes) {
        const componentModeToken =
          mode.get(componentFlatKey) ?? core.get(componentFlatKey) ?? token;
        const targetModeToken =
          mode.get(targetFlatKey) ?? core.get(targetFlatKey) ?? targetToken;
        if (
          componentModeToken.type !== targetModeToken.type ||
          JSON.stringify(componentModeToken.value) !==
            JSON.stringify(targetModeToken.value)
        ) {
          divergentModes.push(slug);
        }
      }

      if (divergentModes.length === 0) {
        promotable.push(`${path} -> ${targetPath}`);
      } else {
        promotionBlocked.push(
          `${path} -> ${targetPath} (diverges in ${divergentModes.join(", ")})`
        );
      }
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
  const brandCoverage: Record<
    string,
    { overrides: number; missingPalette: boolean }
  > = {};

  if (existsSync(brandsDir)) {
    const publications = JSON.parse(
      readFileSync(join(TOKENS_DIR, "publications.json"), "utf-8")
    ) as {
      publications: Array<{ kind: string; slug: string }>;
    };
    const systemBrandSlugs = new Set(
      publications.publications
        .filter((publication) => publication.kind === "system")
        .map((publication) => publication.slug)
    );
    for (const file of brandFiles) {
      const data = JSON.parse(
        readFileSync(join(brandsDir, file), "utf-8")
      );
      const brandMeta = data.$brand || {};
      const slug = brandMeta.slug || file.replace(".json", "");
      const flat = flattenPaths(data);

      const hasPaletteBrand = [...flat.keys()].some((path) =>
        /^brand-(?:[1-9]|1[0-4])$/.test(path)
      );

      brandCoverage[slug] = {
        overrides: flat.size,
        missingPalette: !hasPaletteBrand && !systemBrandSlugs.has(slug),
      };

      if (!hasPaletteBrand && !systemBrandSlugs.has(slug)) {
        warnings.push(
          `Brand "${slug}" has no brand-1..14 source tokens — verify its White Label fallback is intentional`
        );
      }
    }
  }

  // 4. Neutral alpha duplication check
  const neutralAlphaValues = new Map<string, Set<string>>();
  if (existsSync(brandsDir)) {
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
  for (const vals of neutralAlphaValues.values()) {
    if (vals.size === 1) {
      duplicatedNeutralAlpha++;
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
        promotionBlocked,
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
    `  Promotion blocked by brand overrides: ${report.audit.componentTokens.promotionBlocked.length}`
  );
  for (const p of report.audit.componentTokens.promotionBlocked) {
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
