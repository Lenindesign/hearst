/**
 * Builds token-scene.js from token-scene.src.js: embeds the drawing SVG, the 29 brand themes
 * (colors, fonts, guarded button colors, radius, section) and each brand logo as a data URI.
 * Usage: node --import tsx output/specs/motion/build-token-scene.ts
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

import { brands } from "../../../src/lib/brands";
import { getHearstBrandSection } from "../../../src/lib/hearst-routes";
import { getBrandLogoSrc } from "../../../src/lib/logos";
import { brandToCssVars } from "../../../src/lib/theme-css-vars";

const root = path.resolve(__dirname, "../../..");
const specs = path.join(root, "output/specs");
const BASE = new Set(["white-label", "fre"]);
const SECTION: Record<string, string> = { lifestyle: "Lifestyle", autos: "Autos", flux: "Fashion & Luxury", ew: "Enthusiast & Wellness" };

const ordered = [
  ...["lifestyle", "autos", "flux", "ew"].flatMap((section) => brands.filter((b) => !BASE.has(b.slug) && getHearstBrandSection(b.slug) === section)),
  ...brands.filter((b) => BASE.has(b.slug)),
];

const data = ordered.map((b) => {
  const vars = brandToCssVars(b, "light");
  const seen = new Set<string>();
  const colors = Object.values(b.colors).map(String).filter((hex) => {
    const key = hex.toLowerCase();
    if (key === "#ffffff" || seen.has(key) || !/^#[0-9a-f]{6}$/i.test(hex)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
  return {
    slug: b.slug,
    name: b.name,
    colors,
    btn: String(vars["--component-button-background-primary-solid-default"] ?? "#1c1c1c"),
    label: String(vars["--component-button-content-primary-solid-default"] ?? "#ffffff"),
    radius: Number(b.componentTokens["component-button-radius-default"] ?? 0),
    fontDefault: b.fontDefault,
    fontSecondary: b.fontSecondary,
    fontHeadline: b.fontHeadline,
    weight: b.fontHeadlineWeight,
    section: BASE.has(b.slug) ? "Base theme" : SECTION[getHearstBrandSection(b.slug)],
  };
});

const logos: Record<string, string> = {};
for (const b of ordered) {
  const src = getBrandLogoSrc(b.slug);
  const file = src ? path.join(root, "public", src) : "";
  if (!file || !existsSync(file)) continue;
  // Knockout logos paint themselves white through a --primary default; ink them for a white card.
  const svg = readFileSync(file, "utf8").replace(/--primary\s*:\s*#f{3}(?:f{3})?\b/gi, "--primary: #111111");
  logos[b.slug] = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const scene = readFileSync(path.join(specs, "motion/token-scene.src.js"), "utf8")
  .replace("__SHEET__", () => JSON.stringify(readFileSync(path.join(specs, "token-drawing.svg"), "utf8")))
  .replace("__BRANDS__", () => JSON.stringify(data))
  .replace("__LOGOS__", () => JSON.stringify(logos));
writeFileSync(path.join(specs, "motion/token-scene.js"), scene);
console.log(`token-scene.js · ${data.length} brands · ${Object.keys(logos).length} logos · ${(scene.length / 1024).toFixed(0)} KB`);
