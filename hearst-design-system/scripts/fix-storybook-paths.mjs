/**
 * Rewrites relative paths in Storybook's built HTML/JS files to absolute paths
 * so they resolve correctly when served from /_next/static/sb/.
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const SB_DIR = join(process.cwd(), ".next", "static", "sb");
const BASE = "/_next/static/sb/";

function fixFile(filePath) {
  let content = readFileSync(filePath, "utf-8");
  const original = content;

  content = content.replaceAll('href="./', `href="${BASE}`);
  content = content.replaceAll('src="./', `src="${BASE}`);
  content = content.replaceAll("url('./", `url('${BASE}`);
  content = content.replaceAll('url("./', `url("${BASE}`);

  // Fix dynamic import paths in JS chunks
  content = content.replaceAll('"./assets/', `"${BASE}assets/`);
  content = content.replaceAll("'./assets/", `'${BASE}assets/`);

  if (content !== original) {
    writeFileSync(filePath, content);
    console.log(`Fixed paths in ${filePath}`);
  }
}

const files = readdirSync(SB_DIR).filter(
  (f) => f.endsWith(".html") || f.endsWith(".js")
);

for (const file of files) {
  fixFile(join(SB_DIR, file));
}

// Also fix JS files in assets/
try {
  const assetsDir = join(SB_DIR, "assets");
  const assetFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
  for (const file of assetFiles) {
    fixFile(join(assetsDir, file));
  }
  console.log(`Processed ${assetFiles.length} asset JS file(s)`);
} catch {
  // assets dir may not exist
}

console.log(`Processed ${files.length} root file(s)`);
