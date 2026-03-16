/**
 * Rewrites relative paths in Storybook's built HTML files to absolute paths
 * so they resolve correctly when served from /_next/static/sb/ via redirect.
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const SB_DIR = join(process.cwd(), ".next", "static", "sb");
const BASE = "/_next/static/sb/";

function fixFile(filePath) {
  let content = readFileSync(filePath, "utf-8");
  const original = content;

  // Replace href="./  and src="./  with absolute paths
  content = content.replaceAll('href="./', `href="${BASE}`);
  content = content.replaceAll('src="./', `src="${BASE}`);
  // Replace url('./  in CSS (font-face etc.)
  content = content.replaceAll("url('./", `url('${BASE}`);
  content = content.replaceAll('url("./', `url("${BASE}`);

  if (content !== original) {
    writeFileSync(filePath, content);
    console.log(`Fixed paths in ${filePath}`);
  }
}

const htmlFiles = readdirSync(SB_DIR).filter(
  (f) => f.endsWith(".html")
);

for (const file of htmlFiles) {
  fixFile(join(SB_DIR, file));
}

console.log(`Processed ${htmlFiles.length} HTML file(s)`);
