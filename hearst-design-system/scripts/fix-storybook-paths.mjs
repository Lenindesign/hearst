/**
 * Rewrites relative paths in Storybook's built HTML/JS files to absolute paths
 * so they resolve correctly when served from /_next/static/sb/.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const SB_DIR = join(process.cwd(), ".next", "static", "sb");
const BASE = "/_next/static/sb/";

function fixRootFile(filePath) {
  let content = readFileSync(filePath, "utf-8");
  const original = content;

  content = content.replaceAll('href="./', `href="${BASE}`);
  content = content.replaceAll('src="./', `src="${BASE}`);
  content = content.replaceAll("url('./", `url('${BASE}`);
  content = content.replaceAll('url("./', `url("${BASE}`);
  content = content.replaceAll('"./assets/', `"${BASE}assets/`);
  content = content.replaceAll("'./assets/", `'${BASE}assets/`);
  content = content.replaceAll('"./sb-', `"${BASE}sb-`);
  content = content.replaceAll("'./sb-", `'${BASE}sb-`);

  if (content !== original) {
    writeFileSync(filePath, content);
    console.log(`Fixed paths in ${filePath}`);
  }
}

function fixAssetFile(filePath) {
  let content = readFileSync(filePath, "utf-8");
  const original = content;

  // Inside assets/, sibling imports like "./Welcome-hash.js" need the full path
  content = content.replaceAll('"./assets/', `"${BASE}assets/`);
  content = content.replaceAll("'./assets/", `'${BASE}assets/`);
  content = content.replace(/"\.\/([\w][\w.-]*\.js)"/g, `"${BASE}assets/$1"`);
  content = content.replace(/'\.\/([\w][\w.-]*\.js)'/g, `'${BASE}assets/$1'`);
  content = content.replace(/"\.\/([\w][\w.-]*\.css)"/g, `"${BASE}assets/$1"`);

  if (content !== original) {
    writeFileSync(filePath, content);
    console.log(`Fixed asset paths in ${filePath}`);
  }
}

// Fix root-level HTML and JS files
const rootFiles = readdirSync(SB_DIR).filter(
  (f) => f.endsWith(".html") || f.endsWith(".js")
);
for (const file of rootFiles) {
  fixRootFile(join(SB_DIR, file));
}
console.log(`Processed ${rootFiles.length} root file(s)`);

// Fix JS/CSS files in assets/
const assetsDir = join(SB_DIR, "assets");
if (existsSync(assetsDir)) {
  const assetFiles = readdirSync(assetsDir).filter(
    (f) => f.endsWith(".js") || f.endsWith(".css")
  );
  for (const file of assetFiles) {
    fixAssetFile(join(assetsDir, file));
  }
  console.log(`Processed ${assetFiles.length} asset file(s)`);
}

// Fix JS files in sb-manager/
const sbManagerDir = join(SB_DIR, "sb-manager");
if (existsSync(sbManagerDir)) {
  const managerFiles = readdirSync(sbManagerDir).filter((f) => f.endsWith(".js"));
  for (const file of managerFiles) {
    fixRootFile(join(sbManagerDir, file));
  }
  console.log(`Processed ${managerFiles.length} sb-manager file(s)`);
}
