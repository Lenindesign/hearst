/**
 * Style Dictionary configuration for the Hearst Design System.
 *
 * Generates per-brand CSS custom properties from the normalized token structure.
 *
 * Usage:
 *   npx style-dictionary build --config style-dictionary.config.mjs
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = join(__dirname, "tokens");
const BRANDS_DIR = join(TOKENS_DIR, "brands");

function getBrandSlugs() {
  try {
    return readdirSync(BRANDS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}

function getConfig() {
  const brandSlugs = getBrandSlugs();

  const platforms = {
    "css/base": {
      transformGroup: "css",
      buildPath: "dist/css/",
      files: [
        {
          destination: "base.css",
          format: "css/variables",
          options: {
            selector: ":root",
            outputReferences: true,
          },
        },
      ],
    },
  };

  for (const slug of brandSlugs) {
    platforms[`css/${slug}`] = {
      transformGroup: "css",
      buildPath: "dist/css/brands/",
      files: [
        {
          destination: `${slug}.css`,
          format: "css/variables",
          options: {
            selector: `[data-brand="${slug}"]`,
            outputReferences: true,
          },
        },
      ],
    };
  }

  // Also generate a combined file
  platforms["css/combined"] = {
    transformGroup: "css",
    buildPath: "dist/css/",
    files: [
      {
        destination: "tokens.css",
        format: "css/variables",
        options: {
          selector: ":root",
          outputReferences: true,
        },
      },
    ],
  };

  // JS/TS output for the component library
  platforms["js/esm"] = {
    transformGroup: "js",
    buildPath: "dist/js/",
    files: [
      {
        destination: "tokens.mjs",
        format: "javascript/es6",
      },
    ],
  };

  // Tailwind-compatible JSON
  platforms["json/flat"] = {
    transformGroup: "js",
    buildPath: "dist/json/",
    files: [
      {
        destination: "tokens.json",
        format: "json/flat",
      },
    ],
  };

  return {
    source: [
      "tokens/core/**/*.json",
      "tokens/semantic/**/*.json",
    ],
    platforms,
  };
}

export default getConfig();
