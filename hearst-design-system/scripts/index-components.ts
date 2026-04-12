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

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "fs";
import { join, relative, basename } from "path";

const SRC_DIR = join(__dirname, "..", "src", "components");
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
  lineCount: number;
}

interface ComponentIndex {
  generatedAt: string;
  totalComponents: number;
  byLevel: Record<string, number>;
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
  return [...new Set(exports)];
}

function extractImportedComponents(content: string): string[] {
  const deps: string[] = [];
  const importRe = /from\s+["']@\/components\/([\w/.-]+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(content)) !== null) {
    deps.push(m[1].replace(/\.tsx?$/, ""));
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

function run() {
  const files = collectTsx(SRC_DIR);
  const components: ComponentEntry[] = [];

  for (const f of files) {
    const content = readFileSync(f, "utf-8");
    const rel = relative(SRC_DIR, f).replace(/\.tsx$/, "");
    const deps = extractImportedComponents(content);

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
  for (const c of components) {
    byLevel[c.level] = (byLevel[c.level] || 0) + 1;
  }

  const index: ComponentIndex = {
    generatedAt: new Date().toISOString(),
    totalComponents: components.length,
    byLevel,
    dependencyGraph: depGraph,
    reverseGraph,
    components,
  };

  mkdirSync(join(__dirname, "..", "reports"), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));

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
  console.log(`\n  Most-depended-on components:`);

  const sorted = Object.entries(reverseGraph).sort((a, b) => b[1].length - a[1].length);
  for (const [name, users] of sorted.slice(0, 8)) {
    console.log(`    ${name}: used by ${users.length} components`);
  }

  console.log(`\n  Output: reports/component-index.json\n`);
}

run();
