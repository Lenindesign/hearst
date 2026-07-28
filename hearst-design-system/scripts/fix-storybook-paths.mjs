/**
 * Rewrites relative paths in Storybook's built HTML/JS files to absolute paths
 * so they resolve correctly when served from /_next/static/sb/.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "path";

const SB_DIR = process.env.STORYBOOK_OUTPUT_DIR
  ? resolve(process.cwd(), process.env.STORYBOOK_OUTPUT_DIR)
  : join(process.cwd(), ".next", "static", "sb");
const BASE = "/_next/static/sb/";
/** Public Storybook path on Netlify (rewrites to SB_DIR). Fixes relative index.json when URL is /storybook without trailing slash. */
const STORYBOOK_PUBLIC_BASE = "/storybook/";

function injectStorybookBaseHref(filePath) {
  let content = readFileSync(filePath, "utf-8");
  if (content.includes('href="/storybook/"') || content.includes("href='/storybook/'")) {
    return;
  }
  const injected = `<base href="${STORYBOOK_PUBLIC_BASE}" />`;
  const next = content.replace(/<head(\s[^>]*)?>/i, `<head$1>\n    ${injected}\n`);
  if (next !== content) {
    writeFileSync(filePath, next);
    console.log(`Injected <base href> in ${filePath}`);
  }
}

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

function readGitValue(args) {
  try {
    return execFileSync("git", args, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function writeBuildInfo() {
  const indexPath = join(SB_DIR, "index.json");
  if (!existsSync(indexPath)) {
    throw new Error("Storybook index.json is missing; build provenance cannot be generated.");
  }

  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  const entries = Object.values(index.entries ?? {});
  const sourceRevision = process.env.COMMIT_REF || readGitValue(["rev-parse", "HEAD"]) || "unknown";
  const localDirty = process.env.COMMIT_REF
    ? false
    : Boolean(readGitValue(["status", "--porcelain", "--untracked-files=no"]));
  const buildInfo = {
    schemaVersion: 1,
    sourceRevision: localDirty ? `${sourceRevision}+dirty` : sourceRevision,
    buildContext: process.env.CONTEXT || "local",
    builtAt: new Date().toISOString(),
    catalog: {
      entries: entries.length,
      stories: entries.filter((entry) => entry.type === "story").length,
      docs: entries.filter((entry) => entry.type === "docs").length,
      groups: new Set(entries.map((entry) => entry.title)).size,
    },
  };

  writeFileSync(
    join(SB_DIR, "build-info.json"),
    `${JSON.stringify(buildInfo, null, 2)}\n`,
  );
  console.log(
    `Wrote Storybook build provenance for ${buildInfo.sourceRevision} (${buildInfo.catalog.stories} stories)`,
  );
}

// Fix root-level HTML and JS files
const rootFiles = readdirSync(SB_DIR).filter(
  (f) => f.endsWith(".html") || f.endsWith(".js")
);
for (const file of rootFiles) {
  fixRootFile(join(SB_DIR, file));
}
console.log(`Processed ${rootFiles.length} root file(s)`);

for (const name of ["index.html", "iframe.html"]) {
  const p = join(SB_DIR, name);
  if (existsSync(p)) {
    injectStorybookBaseHref(p);
  }
}

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

writeBuildInfo();
