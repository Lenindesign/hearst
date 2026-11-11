// Builds system-scene.js from system-scene.src.js by embedding the two drawing sheets (../system-drawing-sheet-1.jpg, -2.jpg).
// Usage: node output/specs/motion/build-system-scene.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url);
const sheets = [1, 2].map(n => "data:image/jpeg;base64," + readFileSync(new URL(`../system-drawing-sheet-${n}.jpg`, here)).toString("base64"));
const out = readFileSync(new URL("system-scene.src.js", here), "utf8").replace("__SHEETS__", () => JSON.stringify(sheets));
writeFileSync(new URL("system-scene.js", here), out);
console.log(`system-scene.js · ${(out.length / 1024).toFixed(0)} KB`);
