/**
 * Pre-commit safety check for token edits.
 * Ensures no tokens were accidentally removed and all brand files stay consistent.
 *
 * Usage: npx tsx scripts/check-tokens.ts
 */
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const TOKENS_DIR = join(process.cwd(), "tokens");
const BRANDS_DIR = join(TOKENS_DIR, "brands");

let errors: string[] = [];
let warnings: string[] = [];

function loadJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, "utf-8"));
}

// 1. Check that no tokens were removed compared to the last commit
function checkNoRemovals() {
  try {
    const diff = execSync("git diff HEAD -- tokens/", { encoding: "utf-8" });
    const removedLines = diff
      .split("\n")
      .filter((line) => line.startsWith("-") && !line.startsWith("---"))
      .filter((line) => line.includes('"type"') || line.includes('"value"'));

    const removedKeys = diff
      .split("\n")
      .filter((line) => line.startsWith("-") && !line.startsWith("---"))
      .filter((line) => /^\-\s*"[a-z]/.test(line))
      .map((line) => {
        const match = line.match(/"([^"]+)"/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    const addedKeys = diff
      .split("\n")
      .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
      .filter((line) => /^\+\s*"[a-z]/.test(line))
      .map((line) => {
        const match = line.match(/"([^"]+)"/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    const actuallyRemoved = removedKeys.filter(
      (key) => !addedKeys.includes(key)
    );
    if (actuallyRemoved.length > 0) {
      errors.push(
        `Token keys appear to be removed: ${actuallyRemoved.join(", ")}. Removing tokens can break components.`
      );
    }
  } catch {
    warnings.push(
      "Could not check git diff for removals (not in a git repo or no prior commits)."
    );
  }
}

// 2. Check all brand files have the same set of keys
function checkBrandConsistency() {
  const brandFiles = readdirSync(BRANDS_DIR).filter(
    (f) => f.endsWith(".json") && f !== "_meta.json"
  );

  if (brandFiles.length === 0) {
    warnings.push("No brand files found.");
    return;
  }

  const keysByBrand: Record<string, string[]> = {};
  for (const file of brandFiles) {
    const data = loadJson(join(BRANDS_DIR, file));
    keysByBrand[file] = Object.keys(data).sort();
  }

  const reference = brandFiles[0];
  const referenceKeys = new Set(keysByBrand[reference]);

  for (const file of brandFiles.slice(1)) {
    const currentKeys = new Set(keysByBrand[file]);
    const missing = [...referenceKeys].filter((k) => !currentKeys.has(k));
    const extra = [...currentKeys].filter((k) => !referenceKeys.has(k));

    if (missing.length > 0) {
      warnings.push(
        `${file} is missing keys present in ${reference}: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ` (+${missing.length - 5} more)` : ""}`
      );
    }
    if (extra.length > 0) {
      warnings.push(
        `${file} has extra keys not in ${reference}: ${extra.slice(0, 5).join(", ")}${extra.length > 5 ? ` (+${extra.length - 5} more)` : ""}`
      );
    }
  }
}

// 3. Validate hex colors
function checkHexColors() {
  const allFiles = [
    join(TOKENS_DIR, "core", "global.json"),
    ...readdirSync(BRANDS_DIR)
      .filter((f) => f.endsWith(".json") && f !== "_meta.json")
      .map((f) => join(BRANDS_DIR, f)),
  ];

  for (const file of allFiles) {
    try {
      const data = loadJson(file) as Record<
        string,
        { type?: string; value?: unknown }
      >;
      for (const [key, token] of Object.entries(data)) {
        if (
          token.type === "color" &&
          typeof token.value === "string" &&
          !token.value.startsWith("$")
        ) {
          const VALID_COLOR_KEYWORDS = ["transparent", "white", "black", "inherit", "currentColor"];
          if (
            !VALID_COLOR_KEYWORDS.includes(token.value) &&
            !/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(token.value)
          ) {
            errors.push(
              `Invalid hex color in ${file.split("/").pop()}: "${key}" has value "${token.value}"`
            );
          }
        }
      }
    } catch {
      errors.push(`Could not parse ${file}`);
    }
  }
}

// 4. Check for common typos in token names
function checkTypos() {
  const knownTypos: Record<string, string> = {
    backgroud: "background",
    dager: "danger",
    kockout: "knockout",
    defualt: "default",
    primay: "primary",
    seconday: "secondary",
    boarder: "border",
    heigth: "height",
    widht: "width",
  };

  const allFiles = [
    join(TOKENS_DIR, "core", "global.json"),
    ...readdirSync(BRANDS_DIR)
      .filter((f) => f.endsWith(".json") && f !== "_meta.json")
      .map((f) => join(BRANDS_DIR, f)),
  ];

  for (const file of allFiles) {
    try {
      const data = loadJson(file);
      for (const key of Object.keys(data)) {
        for (const [typo, correct] of Object.entries(knownTypos)) {
          if (key.includes(typo)) {
            warnings.push(
              `Possible typo in ${file.split("/").pop()}: "${key}" contains "${typo}" (did you mean "${correct}"?)`
            );
          }
        }
      }
    } catch {
      // already caught above
    }
  }
}

console.log("\n🔍 Checking tokens...\n");

checkNoRemovals();
checkBrandConsistency();
checkHexColors();
checkTypos();

if (warnings.length > 0) {
  console.log("⚠️  Warnings:");
  for (const w of warnings) console.log(`   ${w}`);
  console.log();
}

if (errors.length > 0) {
  console.log("❌ Errors:");
  for (const e of errors) console.log(`   ${e}`);
  console.log(`\n${errors.length} error(s) found. Fix before committing.\n`);
  process.exit(1);
} else {
  console.log("✅ All token checks passed.\n");
}
