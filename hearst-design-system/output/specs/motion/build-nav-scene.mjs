// Builds nav-scene.js from nav-scene.src.js by embedding the two drawing sheets (../nav-drawing-sheet-1.jpg, -2.jpg).
// Usage: node output/specs/motion/build-nav-scene.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url);
const sheets = [1, 2].map(n => "data:image/jpeg;base64," + readFileSync(new URL(`../nav-drawing-sheet-${n}.jpg`, here)).toString("base64"));
const out = readFileSync(new URL("nav-scene.src.js", here), "utf8").replace("__SHEETS__", () => JSON.stringify(sheets));
writeFileSync(new URL("nav-scene.js", here), out);
console.log(`nav-scene.js · ${(out.length / 1024).toFixed(0)} KB`);
