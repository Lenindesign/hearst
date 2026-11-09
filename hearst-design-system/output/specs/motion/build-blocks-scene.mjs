// Builds blocks-scene.js from blocks-scene.src.js by embedding blocks-data.json
// (pattern rectangles measured in /hearst-plus/blocks/library/ at viewports 390–1600).
// Usage: node output/specs/motion/build-blocks-scene.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url);
const data = readFileSync(new URL("blocks-data.json", here), "utf8");
const out = readFileSync(new URL("blocks-scene.src.js", here), "utf8").replace("__DATA__", () => data);
writeFileSync(new URL("blocks-scene.js", here), out);
console.log(`blocks-scene.js · ${(out.length / 1024).toFixed(0)} KB`);
