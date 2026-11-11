// Builds layout-scene.js from layout-scene.src.js by embedding the drawing sheet (../layout-drawing.svg).
// Usage: node output/specs/motion/build-layout-scene.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url);
const sheet = readFileSync(new URL("../layout-drawing.svg", here), "utf8");
const out = readFileSync(new URL("layout-scene.src.js", here), "utf8").replace("__SHEET__", () => JSON.stringify(sheet));
writeFileSync(new URL("layout-scene.js", here), out);
console.log(`layout-scene.js · ${(out.length / 1024).toFixed(0)} KB`);
