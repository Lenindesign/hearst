// Builds river-scene.js from river-scene.src.js by embedding the drawing sheet (../river-drawing-sheet-1.jpg).
// Usage: node output/specs/motion/build-river-scene.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url);
const sheet = "data:image/jpeg;base64," + readFileSync(new URL("../river-drawing-sheet-1.jpg", here)).toString("base64");
const out = readFileSync(new URL("river-scene.src.js", here), "utf8").replace("__SHEET__", () => JSON.stringify(sheet));
writeFileSync(new URL("river-scene.js", here), out);
console.log(`river-scene.js · ${(out.length / 1024).toFixed(0)} KB`);
