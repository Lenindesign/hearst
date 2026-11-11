// Builds carousel-scene.js from carousel-scene.src.js by embedding the two drawing sheets (../carousel-drawing-sheet-1.jpg, -2.jpg).
// Usage: node output/specs/motion/build-carousel-scene.mjs
import { readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url);
const sheets = [1, 2].map(n => "data:image/jpeg;base64," + readFileSync(new URL(`../carousel-drawing-sheet-${n}.jpg`, here)).toString("base64"));
const out = readFileSync(new URL("carousel-scene.src.js", here), "utf8").replace("__SHEETS__", () => JSON.stringify(sheets));
writeFileSync(new URL("carousel-scene.js", here), out);
console.log(`carousel-scene.js · ${(out.length / 1024).toFixed(0)} KB`);
