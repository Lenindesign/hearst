#!/usr/bin/env npx tsx
/**
 * Codebase Indexer — generates a component relationship map for AI agents.
 *
 * Usage:  npx tsx scripts/index-components.ts
 *
 * Produces: reports/component-index.json
 *
 * The index maps every component's:
 *   - Exports and file path
 *   - Import dependencies (which other components it uses)
 *   - Token references (CSS variables and semantic Tailwind classes)
 *   - Atomic level (atom/molecule/organism/template)
 *   - Brand awareness and responsiveness
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { basename, dirname, join, relative, resolve } from "path";
import { pathToFileURL } from "url";
import type {
  ComponentMetadata,
  StorybookSpecification,
} from "../src/lib/component-metadata";

const SRC_DIR = join(__dirname, "..", "src", "components");
const SRC_ROOT = join(__dirname, "..", "src");
const OUTPUT_PATH = join(__dirname, "..", "reports", "component-index.json");

interface ComponentEntry {
  name: string;
  path: string;
  exports: string[];
  level: "atom" | "molecule" | "organism" | "template";
  dependencies: string[];
  tokens: {
    cssVariables: string[];
    tailwindSemantics: string[];
    classes: string[];
  };
  brandAware: boolean;
  responsive: boolean;
  hasHardcodedColors: boolean;
  metadataPath: string | null;
  applicationUseSites: string[];
  storybookStories: string[];
  storybookSpecification: StorybookSpecification | null;
  lineCount: number;
}

interface ComponentIndex {
  generatedAt: string;
  totalComponents: number;
  byLevel: Record<string, number>;
  byNamespace: Record<string, number>;
  metadataCoverage: {
    componentsWithMetadata: number;
    componentsWithoutMetadata: number;
    coveragePercent: number;
    validMetadata: number;
    invalidMetadata: number;
  };
  metadataValidation: {
    valid: boolean;
    errors: Array<{
      component: string;
      metadataPath: string;
      issues: string[];
    }>;
  };
  storyCoverage: {
    directlySpecifiedComponents: number;
    productionUsedWithoutDirectStory: number;
    integratedSpecifiedComponents: number;
    infrastructureClassifiedComponents: number;
    specifiedComponents: number;
    productionUsedWithoutStorybookSpecification: number;
  };
  dependencyGraph: Record<string, string[]>;
  reverseGraph: Record<string, string[]>;
  components: ComponentEntry[];
}

const SKIP = new Set(["brands.ts", "tokens.css", "utils.ts", "component-metadata.ts"]);

function collectTsx(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (SKIP.has(entry)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectTsx(full));
    } else if (entry.endsWith(".tsx")) {
      if (entry.endsWith(".test.tsx")) continue;
      results.push(full);
    }
  }
  return results;
}

function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (/\.(?:ts|tsx)$/.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

function extractExports(content: string): string[] {
  const exports: string[] = [];
  const patterns = [
    /export\s+(?:default\s+)?function\s+(\w+)/g,
    /export\s+(?:const|let)\s+(\w+)/g,
    /export\s+type\s+(\w+)/g,
    /export\s+interface\s+(\w+)/g,
  ];
  for (const pat of patterns) {
    let m: RegExpExecArray | null;
    while ((m = pat.exec(content)) !== null) {
      exports.push(m[1]);
    }
  }
  const exportBlocks = /export\s*{([\s\S]*?)}/g;
  let exportBlock: RegExpExecArray | null;
  while ((exportBlock = exportBlocks.exec(content)) !== null) {
    for (const entry of exportBlock[1].split(",")) {
      const exportedName = entry
        .trim()
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/)
        .pop();
      if (exportedName && /^\w+$/.test(exportedName)) {
        exports.push(exportedName);
      }
    }
  }
  return [...new Set(exports)];
}

function extractImportSpecifiers(content: string): string[] {
  const specifiers: string[] = [];
  const importRe = /(?:from\s+|import\s*)["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = importRe.exec(content)) !== null) {
    specifiers.push(match[1]);
  }
  return [...new Set(specifiers)];
}

function parseNamedList(block: string): Array<{ imported: string; local: string }> {
  return block
    .split(",")
    .map((entry) => entry.trim().replace(/^type\s+/, ""))
    .filter(Boolean)
    .map((entry) => {
      const [imported, local = imported] = entry.split(/\s+as\s+/);
      return { imported: imported.trim(), local: local.trim() };
    })
    .filter(({ imported, local }) => /^\w+$/.test(imported) && /^\w+$/.test(local));
}

function extractNamedImports(
  content: string,
): Array<{ specifier: string; names: Array<{ imported: string; local: string }> }> {
  const imports: Array<{
    specifier: string;
    names: Array<{ imported: string; local: string }>;
  }> = [];
  const importRe = /import\s*{([\s\S]*?)}\s*from\s*["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = importRe.exec(content)) !== null) {
    imports.push({
      specifier: match[2],
      names: parseNamedList(match[1]),
    });
  }
  return imports;
}

function resolveSourceImport(
  sourceFile: string,
  specifier: string,
  sourceFileSet: Set<string>,
): string | null {
  let basePath: string;
  if (specifier.startsWith("@/")) {
    basePath = join(SRC_ROOT, specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    basePath = resolve(dirname(sourceFile), specifier);
  } else {
    return null;
  }

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    join(basePath, "index.ts"),
    join(basePath, "index.tsx"),
  ];
  return candidates.find((candidate) => sourceFileSet.has(candidate)) ?? null;
}

function resolveReexportedComponent(
  moduleFile: string,
  exportName: string,
  sourceFileSet: Set<string>,
  componentFileSet: Set<string>,
  seen = new Set<string>(),
): string | null {
  const seenKey = `${moduleFile}:${exportName}`;
  if (seen.has(seenKey)) return null;
  seen.add(seenKey);

  if (componentFileSet.has(moduleFile)) {
    const moduleExports = extractExports(readFileSync(moduleFile, "utf-8"));
    if (moduleExports.includes(exportName)) return moduleFile;
  }

  const content = readFileSync(moduleFile, "utf-8");
  const namedReexportRe = /export\s*{([\s\S]*?)}\s*from\s*["']([^"']+)["']/g;
  let namedMatch: RegExpExecArray | null;
  while ((namedMatch = namedReexportRe.exec(content)) !== null) {
    const matchingExport = parseNamedList(namedMatch[1]).find(
      ({ local }) => local === exportName,
    );
    if (!matchingExport) continue;
    const target = resolveSourceImport(moduleFile, namedMatch[2], sourceFileSet);
    if (!target) continue;
    const resolved = resolveReexportedComponent(
      target,
      matchingExport.imported,
      sourceFileSet,
      componentFileSet,
      seen,
    );
    if (resolved) return resolved;
  }

  const starReexportRe = /export\s*\*\s*from\s*["']([^"']+)["']/g;
  let starMatch: RegExpExecArray | null;
  while ((starMatch = starReexportRe.exec(content)) !== null) {
    const target = resolveSourceImport(moduleFile, starMatch[1], sourceFileSet);
    if (!target) continue;
    const resolved = resolveReexportedComponent(
      target,
      exportName,
      sourceFileSet,
      componentFileSet,
      seen,
    );
    if (resolved) return resolved;
  }

  return null;
}

function extractImportedComponents(
  content: string,
  sourceFile: string,
  sourceFileSet: Set<string>,
): string[] {
  const deps: string[] = [];
  for (const specifier of extractImportSpecifiers(content)) {
    const importedFile = resolveSourceImport(sourceFile, specifier, sourceFileSet);
    if (!importedFile || !importedFile.startsWith(SRC_DIR)) {
      continue;
    }
    deps.push(
      relative(SRC_DIR, importedFile)
        .replace(/\.tsx?$/, "")
        .replace(/\/index$/, ""),
    );
  }
  return [...new Set(deps)];
}

function extractCssVariables(content: string): string[] {
  const vars: string[] = [];
  const re = /var\(\s*(--[\w-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    vars.push(m[1]);
  }
  return [...new Set(vars)];
}

function extractTailwindSemantics(content: string): string[] {
  const semantics: string[] = [];
  const re = /(?:^|\s)((?:bg|text|border|ring|from|to|via|fill|stroke)-(?:primary|secondary|accent|foreground|background|muted|destructive|card|popover|border|input|ring)(?:-foreground)?(?:\/\d+)?)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    semantics.push(m[1].trim());
  }
  return [...new Set(semantics)];
}

function extractClasses(content: string): string[] {
  const classes: string[] = [];
  const re = /\.headline|font-brand|font-brand-secondary/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    classes.push(m[0]);
  }
  return [...new Set(classes)];
}

function hasHex(content: string): boolean {
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) continue;
    if (/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/.test(line)) return true;
  }
  return false;
}

function inferLevel(filePath: string, deps: string[]): "atom" | "molecule" | "organism" | "template" {
  const rel = relative(SRC_DIR, filePath);
  if (rel.startsWith("ui/")) return "atom";
  if (rel.includes("-page.tsx") || rel.includes("home-page") || rel.includes("article-page"))
    return "template";
  if (deps.length >= 3) return "organism";
  return "molecule";
}

function isBrandAware(content: string): boolean {
  return content.includes("useTheme") || content.includes("--font-brand") || content.includes("bg-primary");
}

function isResponsive(content: string): boolean {
  return /\b(sm:|md:|lg:|xl:|2xl:)/.test(content) || content.includes("clamp(");
}

function compareStringSets(label: string, actual: string[], documented: string[]): string[] {
  const actualSet = new Set(actual);
  const documentedSet = new Set(documented);
  const missing = actual.filter((value) => !documentedSet.has(value));
  const stale = documented.filter((value) => !actualSet.has(value));
  const issues: string[] = [];

  if (missing.length > 0) {
    issues.push(`${label} missing current values: ${missing.join(", ")}`);
  }
  if (stale.length > 0) {
    issues.push(`${label} contains stale values: ${stale.join(", ")}`);
  }

  return issues;
}

async function run() {
  const checkOnly = process.argv.includes("--check");
  const files = collectTsx(SRC_DIR);
  const sourceFiles = collectSourceFiles(SRC_ROOT);
  const sourceFileSet = new Set(sourceFiles);
  const componentFileSet = new Set(files);
  const importerMap = new Map<string, string[]>();
  for (const sourceFile of sourceFiles) {
    const sourceContent = readFileSync(sourceFile, "utf-8");
    for (const specifier of extractImportSpecifiers(sourceContent)) {
      const importedFile = resolveSourceImport(sourceFile, specifier, sourceFileSet);
      if (!importedFile) continue;
      const importers = importerMap.get(importedFile) ?? [];
      importers.push(sourceFile);
      importerMap.set(importedFile, importers);
    }
  }
  const storyMap = new Map<string, Set<string>>();
  for (const storyFile of sourceFiles.filter((sourceFile) =>
    /\.stories\.(?:ts|tsx)$/.test(sourceFile),
  )) {
    const storyContent = readFileSync(storyFile, "utf-8");
    for (const namedImport of extractNamedImports(storyContent)) {
      const importedModule = resolveSourceImport(
        storyFile,
        namedImport.specifier,
        sourceFileSet,
      );
      if (!importedModule) continue;
      for (const { imported } of namedImport.names) {
        const componentFile = resolveReexportedComponent(
          importedModule,
          imported,
          sourceFileSet,
          componentFileSet,
        );
        if (!componentFile) continue;
        const stories = storyMap.get(componentFile) ?? new Set<string>();
        stories.add(`src/${relative(SRC_ROOT, storyFile)}`);
        storyMap.set(componentFile, stories);
      }
    }
  }
  const components: ComponentEntry[] = [];

  for (const f of files) {
    const content = readFileSync(f, "utf-8");
    const deps = extractImportedComponents(content, f, sourceFileSet);
    const importSites = importerMap.get(f) ?? [];
    const storybookStories = [...(storyMap.get(f) ?? [])].sort();
    const applicationUseSites = importSites
      .filter((sourceFile) => {
        const sourcePath = relative(SRC_ROOT, sourceFile);
        return (
          !sourcePath.startsWith("stories/") &&
          !sourcePath.startsWith("storybook-candidates/") &&
          !/\.test\.[^.]+$/.test(sourcePath) &&
          !sourcePath.endsWith(".metadata.ts")
        );
      })
      .map((sourceFile) => `src/${relative(SRC_ROOT, sourceFile)}`)
      .sort();

    components.push({
      name: basename(f, ".tsx"),
      path: `src/components/${relative(SRC_DIR, f)}`,
      exports: extractExports(content),
      level: inferLevel(f, deps),
      dependencies: deps,
      tokens: {
        cssVariables: extractCssVariables(content),
        tailwindSemantics: extractTailwindSemantics(content),
        classes: extractClasses(content),
      },
      brandAware: isBrandAware(content),
      responsive: isResponsive(content),
      hasHardcodedColors: hasHex(content),
      metadataPath: existsSync(f.replace(/\.tsx$/, ".metadata.ts"))
        ? `src/components/${relative(SRC_DIR, f).replace(/\.tsx$/, ".metadata.ts")}`
        : null,
      applicationUseSites,
      storybookStories,
      storybookSpecification: null,
      lineCount: content.split("\n").length,
    });
  }

  const depGraph: Record<string, string[]> = {};
  const reverseGraph: Record<string, string[]> = {};
  for (const c of components) {
    depGraph[c.name] = c.dependencies;
    for (const d of c.dependencies) {
      const depName = d.split("/").pop()!;
      if (!reverseGraph[depName]) reverseGraph[depName] = [];
      reverseGraph[depName].push(c.name);
    }
  }

  const byLevel: Record<string, number> = {};
  const byNamespace: Record<string, number> = {};
  for (const c of components) {
    byLevel[c.level] = (byLevel[c.level] || 0) + 1;
    const namespace = c.path.replace("src/components/", "").split("/")[0];
    byNamespace[namespace] = (byNamespace[namespace] || 0) + 1;
  }

  const metadataErrors: ComponentIndex["metadataValidation"]["errors"] = [];

  for (const component of components) {
    if (!component.metadataPath) continue;

    const absoluteMetadataPath = join(__dirname, "..", component.metadataPath);
    const imported = await import(
      `${pathToFileURL(absoluteMetadataPath).href}?component-index=${statSync(absoluteMetadataPath).mtimeMs}`
    );
    const metadata = imported.default as ComponentMetadata | undefined;
    const issues: string[] = [];

    if (!metadata) {
      issues.push("default export is missing");
    } else {
      component.storybookSpecification = metadata.storybook ?? null;
      const expectedPath = component.path.replace("src/components/", "");
      if (metadata.path !== expectedPath) {
        issues.push(`path must be ${expectedPath}; received ${metadata.path}`);
      }
      issues.push(...compareStringSets("exports", component.exports, metadata.exports));
      issues.push(...compareStringSets("dependencies", component.dependencies, metadata.dependencies));
      issues.push(
        ...compareStringSets(
          "usedBy",
          reverseGraph[component.name] ?? [],
          metadata.usedBy ?? [],
        ),
      );

      if (metadata.storybook) {
        const { kind, rationale, stories } = metadata.storybook;
        if (!rationale.trim()) {
          issues.push("storybook rationale must not be empty");
        }
        if (kind === "direct") {
          if (component.storybookStories.length === 0) {
            issues.push("storybook kind direct requires a mapped direct story");
          }
          issues.push(
            ...compareStringSets(
              "storybook stories",
              component.storybookStories,
              stories,
            ),
          );
        } else if (kind === "integrated") {
          if (stories.length === 0) {
            issues.push("storybook kind integrated requires at least one story");
          }
        } else if (stories.length > 0) {
          issues.push("storybook kind infrastructure must not list visual stories");
        }

        for (const story of stories) {
          if (!/^src\/stories\/.+\.stories\.(?:ts|tsx)$/.test(story)) {
            issues.push(`storybook story must be an indexed story file: ${story}`);
            continue;
          }
          if (!existsSync(join(__dirname, "..", story))) {
            issues.push(`storybook story does not exist: ${story}`);
          }
        }
      }
    }

    if (issues.length > 0) {
      metadataErrors.push({
        component: component.name,
        metadataPath: component.metadataPath,
        issues,
      });
    }
  }

  const componentsWithMetadata = components.filter((component) => component.metadataPath).length;
  const validMetadata = componentsWithMetadata - metadataErrors.length;
  const directlySpecifiedComponents = components.filter(
    (component) => component.storybookStories.length > 0,
  );
  const integratedSpecifiedComponents = components.filter(
    (component) => component.storybookSpecification?.kind === "integrated",
  );
  const infrastructureClassifiedComponents = components.filter(
    (component) => component.storybookSpecification?.kind === "infrastructure",
  );
  const specifiedComponentPaths = new Set([
    ...directlySpecifiedComponents.map((component) => component.path),
    ...integratedSpecifiedComponents.map((component) => component.path),
  ]);
  const generatedIndex = {
    totalComponents: components.length,
    byLevel,
    byNamespace,
    metadataCoverage: {
      componentsWithMetadata,
      componentsWithoutMetadata: components.length - componentsWithMetadata,
      coveragePercent: Number(((componentsWithMetadata / components.length) * 100).toFixed(1)),
      validMetadata,
      invalidMetadata: metadataErrors.length,
    },
    metadataValidation: {
      valid: metadataErrors.length === 0,
      errors: metadataErrors,
    },
    storyCoverage: {
      directlySpecifiedComponents: directlySpecifiedComponents.length,
      productionUsedWithoutDirectStory: components.filter(
        (component) =>
          component.applicationUseSites.length > 0 &&
          component.storybookStories.length === 0,
      ).length,
      integratedSpecifiedComponents: integratedSpecifiedComponents.length,
      infrastructureClassifiedComponents: infrastructureClassifiedComponents.length,
      specifiedComponents: specifiedComponentPaths.size,
      productionUsedWithoutStorybookSpecification: components.filter(
        (component) =>
          component.applicationUseSites.length > 0
          && !specifiedComponentPaths.has(component.path)
          && component.storybookSpecification?.kind !== "infrastructure",
      ).length,
    },
    dependencyGraph: depGraph,
    reverseGraph,
    components,
  };

  mkdirSync(join(__dirname, "..", "reports"), { recursive: true });
  const existing = existsSync(OUTPUT_PATH)
    ? (JSON.parse(readFileSync(OUTPUT_PATH, "utf-8")) as ComponentIndex)
    : null;
  const { generatedAt: _existingGeneratedAt, ...existingComparable } = existing ?? {
    generatedAt: "",
  };
  const isCurrent =
    existing !== null &&
    JSON.stringify(existingComparable) === JSON.stringify(generatedIndex);

  if (checkOnly && (!isCurrent || metadataErrors.length > 0)) {
    if (!isCurrent) {
      console.error(
        "Component index is stale. Run `npm run index` and commit reports/component-index.json.",
      );
    }
    if (metadataErrors.length > 0) {
      console.error("Component metadata does not match the current source graph:");
      for (const error of metadataErrors) {
        console.error(`  ${error.component}: ${error.issues.join("; ")}`);
      }
    }
    process.exitCode = 1;
    return;
  }

  const index: ComponentIndex = {
    generatedAt: isCurrent ? existing.generatedAt : new Date().toISOString(),
    ...generatedIndex,
  };

  if (!checkOnly && !isCurrent) {
    writeFileSync(OUTPUT_PATH, `${JSON.stringify(index, null, 2)}\n`);
  }

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║       COMPONENT INDEX GENERATED          ║");
  console.log("╚══════════════════════════════════════════╝\n");
  console.log(`  Total components:  ${index.totalComponents}`);
  for (const [level, count] of Object.entries(byLevel)) {
    console.log(`    ${level}: ${count}`);
  }
  console.log(`\n  Brand-aware:       ${components.filter((c) => c.brandAware).length}`);
  console.log(`  Responsive:        ${components.filter((c) => c.responsive).length}`);
  console.log(`  Hardcoded colors:  ${components.filter((c) => c.hasHardcodedColors).length}`);
  console.log(
    `  Metadata coverage: ${index.metadataCoverage.componentsWithMetadata}/${index.totalComponents} (${index.metadataCoverage.coveragePercent}%)`,
  );
  console.log(
    `  Metadata validity: ${index.metadataCoverage.validMetadata}/${index.metadataCoverage.componentsWithMetadata} valid`,
  );
  console.log(
    `  Production specs:  ${index.storyCoverage.specifiedComponents}/${index.totalComponents}`,
  );
  console.log(
    `    Direct: ${index.storyCoverage.directlySpecifiedComponents} · Integrated: ${index.storyCoverage.integratedSpecifiedComponents} · Infrastructure: ${index.storyCoverage.infrastructureClassifiedComponents}`,
  );
  console.log(
    `  Ownership queue:   ${index.storyCoverage.productionUsedWithoutStorybookSpecification}`,
  );
  if (!index.metadataValidation.valid) {
    for (const error of index.metadataValidation.errors) {
      console.log(`    ${error.component}: ${error.issues.join("; ")}`);
    }
  }
  console.log(`\n  Most-depended-on components:`);

  const sorted = Object.entries(reverseGraph).sort((a, b) => b[1].length - a[1].length);
  for (const [name, users] of sorted.slice(0, 8)) {
    console.log(`    ${name}: used by ${users.length} components`);
  }

  console.log(
    `\n  ${checkOnly ? "Verified" : isCurrent ? "Already current" : "Updated"}: reports/component-index.json\n`,
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
