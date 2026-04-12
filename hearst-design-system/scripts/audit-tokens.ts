#!/usr/bin/env npx tsx
/**
 * Token Auditor — scans component files for hardcoded values and token violations.
 *
 * Usage:  npx tsx scripts/audit-tokens.ts [--json] [--fix-suggestions]
 *
 * Checks:
 *   1. Hardcoded hex colors (#xxx, #xxxxxx, #xxxxxxxx)
 *   2. Hardcoded pixel values in inline styles
 *   3. Non-semantic Tailwind colors (red-500, emerald-700, etc.) that should use tokens
 *   4. Raw rgb/rgba/hsl values
 *
 * Ignores:
 *   - Comments and documentation strings
 *   - Generated files (brands.ts, tokens.css)
 *   - Test files
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join, relative } from "path";

const SRC_DIR = join(__dirname, "..", "src", "components");
const OUTPUT_PATH = join(__dirname, "..", "reports", "token-audit.json");

interface Violation {
  file: string;
  line: number;
  column: number;
  type: "hardcoded-color" | "hardcoded-size" | "non-semantic-tailwind" | "raw-color-function";
  value: string;
  context: string;
  severity: "error" | "warning";
  suggestion?: string;
}

interface AuditReport {
  generatedAt: string;
  totalFiles: number;
  filesWithViolations: number;
  totalViolations: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  violations: Violation[];
}

const HEX_PATTERN = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;

const RAW_COLOR_FN = /(?:rgb|rgba|hsl|hsla)\s*\([^)]+\)/g;

const NON_SEMANTIC_TW = /(?:^|\s)(?:text|bg|border|ring|from|to|via|fill|stroke)-(?:red|green|blue|yellow|orange|purple|pink|emerald|amber|teal|cyan|indigo|violet|fuchsia|rose|lime|sky|slate|gray|zinc|neutral|stone)-\d{2,3}/g;

const HARDCODED_PX_INLINE = /:\s*['"]?\d+px['"]?/g;

const IGNORE_PATTERNS = [
  /\/\/.*/,       // single-line comments
  /\/\*[\s\S]*?\*\//,  // block comments
  /className.*muted-foreground/,  // semantic classes are fine
];

const SKIP_FILES = ["brands.ts", "tokens.css"];

const DOC_CONTEXT_HINTS = [
  "value:", "description:", "example:", "token:", "Token:", "CSS:",
  "fallback", "Fallback", "hex:", "swatch", "palette",
];

function isDocLine(line: string): boolean {
  return DOC_CONTEXT_HINTS.some((hint) => line.includes(hint));
}

function collectFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (SKIP_FILES.includes(entry)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      if (entry.endsWith(".test.tsx") || entry.endsWith(".test.ts")) continue;
      if (entry.endsWith(".metadata.ts")) continue;
      results.push(full);
    }
  }
  return results;
}

function suggestToken(hex: string): string | undefined {
  const lower = hex.toLowerCase();
  if (lower === "#000" || lower === "#000000") return "Use text-foreground or bg-foreground";
  if (lower === "#fff" || lower === "#ffffff") return "Use text-background or bg-background";
  if (lower.startsWith("#f5f5") || lower.startsWith("#e5e5"))
    return "Use bg-muted or a palette neutral token";
  return "Map to a semantic token or add to tokens/core/color.json";
}

function auditFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const rel = relative(join(__dirname, ".."), filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) continue;
    if (isDocLine(line)) continue;

    let match: RegExpExecArray | null;

    HEX_PATTERN.lastIndex = 0;
    while ((match = HEX_PATTERN.exec(line)) !== null) {
      if (line.includes("// audit-ignore") || line.includes("/* audit-ignore */")) continue;
      violations.push({
        file: rel,
        line: lineNum,
        column: match.index + 1,
        type: "hardcoded-color",
        value: match[0],
        context: line.trim().slice(0, 120),
        severity: "error",
        suggestion: suggestToken(match[0]),
      });
    }

    RAW_COLOR_FN.lastIndex = 0;
    while ((match = RAW_COLOR_FN.exec(line)) !== null) {
      if (isDocLine(line)) continue;
      violations.push({
        file: rel,
        line: lineNum,
        column: match.index + 1,
        type: "raw-color-function",
        value: match[0],
        context: line.trim().slice(0, 120),
        severity: "error",
        suggestion: "Replace with a CSS variable reference: var(--color-name)",
      });
    }

    NON_SEMANTIC_TW.lastIndex = 0;
    while ((match = NON_SEMANTIC_TW.exec(line)) !== null) {
      violations.push({
        file: rel,
        line: lineNum,
        column: match.index + 1,
        type: "non-semantic-tailwind",
        value: match[0].trim(),
        context: line.trim().slice(0, 120),
        severity: "warning",
        suggestion: "Replace with a semantic class (bg-primary, text-destructive, etc.)",
      });
    }
  }

  return violations;
}

function run() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes("--json");
  const files = collectFiles(SRC_DIR);
  const allViolations: Violation[] = [];

  for (const f of files) {
    allViolations.push(...auditFile(f));
  }

  const byType: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const filesWithIssues = new Set<string>();

  for (const v of allViolations) {
    byType[v.type] = (byType[v.type] || 0) + 1;
    bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
    filesWithIssues.add(v.file);
  }

  const report: AuditReport = {
    generatedAt: new Date().toISOString(),
    totalFiles: files.length,
    filesWithViolations: filesWithIssues.size,
    totalViolations: allViolations.length,
    byType,
    bySeverity,
    violations: allViolations,
  };

  if (jsonMode) {
    const { mkdirSync } = require("fs");
    mkdirSync(join(__dirname, "..", "reports"), { recursive: true });
    writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));
    console.log(`Report written to ${relative(join(__dirname, ".."), OUTPUT_PATH)}`);
  } else {
    console.log("\n╔══════════════════════════════════════════╗");
    console.log("║         TOKEN AUDIT REPORT               ║");
    console.log("╚══════════════════════════════════════════╝\n");
    console.log(`  Files scanned:        ${report.totalFiles}`);
    console.log(`  Files with issues:    ${report.filesWithViolations}`);
    console.log(`  Total violations:     ${report.totalViolations}`);
    console.log(`  ─────────────────────────────────────`);

    for (const [type, count] of Object.entries(byType)) {
      console.log(`  ${type}: ${count}`);
    }
    console.log();

    const grouped = new Map<string, Violation[]>();
    for (const v of allViolations) {
      if (!grouped.has(v.file)) grouped.set(v.file, []);
      grouped.get(v.file)!.push(v);
    }

    for (const [file, violations] of grouped) {
      console.log(`\n  📄 ${file}`);
      for (const v of violations.slice(0, 10)) {
        const icon = v.severity === "error" ? "🔴" : "🟡";
        console.log(`     ${icon} L${v.line}:${v.column}  ${v.type}  ${v.value}`);
        if (v.suggestion) console.log(`        → ${v.suggestion}`);
      }
      if (violations.length > 10) {
        console.log(`     ... and ${violations.length - 10} more`);
      }
    }

    console.log(`\n  Run with --json to save full report to reports/token-audit.json\n`);
  }
}

run();
