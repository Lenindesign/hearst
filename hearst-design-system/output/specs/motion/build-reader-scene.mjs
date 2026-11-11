// Builds reader-scene.js from reader-scene.src.js by embedding the two drawing sheets (../reader-drawing-sheet-1.jpg, -2.jpg).
// Usage: node output/specs/motion/build-reader-scene.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url);
const sheets = [1, 2].map(n => "data:image/jpeg;base64," + readFileSync(new URL(`../reader-drawing-sheet-${n}.jpg`, here)).toString("base64"));
const out = readFileSync(new URL("reader-scene.src.js", here), "utf8").replace("__SHEETS__", () => JSON.stringify(sheets));
writeFileSync(new URL("reader-scene.js", here), out);
console.log(`reader-scene.js · ${(out.length / 1024).toFixed(0)} KB`);
