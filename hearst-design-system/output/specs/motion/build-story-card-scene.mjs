// Builds story-card-scene.js from story-card-scene.src.js by embedding ../story-card-drawing.svg.
// Usage: node output/specs/motion/build-story-card-scene.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url);
const svg = readFileSync(new URL("../story-card-drawing.svg", here), "utf8");
const out = readFileSync(new URL("story-card-scene.src.js", here), "utf8").replace("__SHEET__", () => JSON.stringify(svg));
writeFileSync(new URL("story-card-scene.js", here), out);
console.log(`story-card-scene.js · ${(out.length / 1024).toFixed(0)} KB`);
