// Records each /specs/ chapter's Live reference as a 1920x1080 clip.
// Usage: BASE_URL=http://localhost:3000 node record-live.mjs <workDir>/live [chapterId...]
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(new URL("../../../package.json", import.meta.url));
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL ?? "http://localhost:3101";
const outDir = process.argv[2];
const only = process.argv.slice(3);
fs.mkdirSync(outDir, { recursive: true });

const W = 1920, H = 1080;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function hideDevBadge(context) {
  await context.addInitScript(() => {
    const add = () => {
      const s = document.createElement("style");
      s.textContent = "nextjs-portal{display:none!important}";
      document.head.appendChild(s);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add);
    else add();
  });
}

async function smoothScrollBy(page, dy, ms) {
  const steps = Math.max(1, Math.round(ms / 16));
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => window.scrollBy(0, d), dy / steps);
    await sleep(16);
  }
}

/** Puts the section's first radiogroup (or the section top) just under the sticky header. */
async function position(page, id, offset = 110) {
  await page.evaluate(({ id, offset }) => {
    const section = document.getElementById(id);
    const anchor = section.querySelector('[role="radiogroup"]') ?? section;
    window.scrollTo(0, anchor.getBoundingClientRect().top + window.scrollY - offset);
  }, { id, offset });
}

async function pick(page, id, name, wait) {
  await page.locator(`#${id}`).getByRole("radio", { name, exact: true }).first().click();
  await sleep(wait);
}

function frameOf(page, part) {
  return page.frames().find((f) => f.url().includes(part));
}

async function scrollFrame(page, part, top) {
  const frame = frameOf(page, part);
  if (frame) await frame.evaluate((t) => window.scrollTo({ top: t, behavior: "smooth" }), top).catch(() => {});
}

const brands = ["Cosmopolitan", "Esquire", "Car and Driver", "Hearst+"];

const chapters = {
  cta: { id: "cta-live", run: async (p) => { await sleep(1500); for (const b of ["Esquire", "Car and Driver", "Hearst+", "Cosmopolitan"]) await pick(p, "cta-live", b, 2600); await smoothScrollBy(p, 520, 2500); await sleep(2000); } },
  layout: {
    id: "layout-live", iframe: "/hearst-plus/", offset: 96,
    run: async (p) => { await sleep(2000); for (const w of ["390", "768 md", "1024 lg", "1140 rail", "1280 xl", "1440"]) await pick(p, "layout-live", w, 3200); },
  },
  type: { id: "type-live", run: async (p) => { await sleep(1500); for (const b of ["Cosmopolitan", "Esquire", "Car and Driver"]) await pick(p, "type-live", b, 3000); await smoothScrollBy(p, 500, 2500); await sleep(2000); } },
  tokens: { id: "tokens-live", run: async (p) => { await sleep(1500); for (const b of brands) await pick(p, "tokens-live", b, 2800); } },
  blocks: { id: "blocks-live", run: async (p) => { await sleep(1500); for (const b of ["Cosmopolitan", "Esquire"]) await pick(p, "blocks-live", b, 2800); await smoothScrollBy(p, 1100, 5000); await sleep(1500); await pick(p, "blocks-live", "Car and Driver", 300); await sleep(2500); } },
  nav: {
    id: "nav-live", iframe: "/hearst-plus/", offset: 96,
    run: async (p) => {
      await sleep(2000);
      await scrollFrame(p, "/hearst-plus/", 400); await sleep(2500);
      await scrollFrame(p, "/hearst-plus/", 0); await sleep(2000);
      for (const w of ["768 md", "390 phone"]) await pick(p, "nav-live", w, 3000);
      await scrollFrame(p, "/hearst-plus/", 400); await sleep(2500);
      await pick(p, "nav-live", "1280 xl", 2000);
    },
  },
  reader: {
    id: "reader-live", iframe: "/read/", offset: 96,
    run: async (p) => {
      await sleep(2000);
      await scrollFrame(p, "/read/", 500); await sleep(3000);
      for (const w of ["1440", "1024 lg", "390 phone"]) await pick(p, "reader-live", w, 3000);
      await pick(p, "reader-live", "1280 xl", 2000);
    },
  },
  carousel: {
    id: "carousel-live",
    run: async (p) => {
      await sleep(1500);
      const next = p.locator("#carousel-live").getByRole("button", { name: /next/i }).first();
      for (let i = 0; i < 2; i++) { await next.click().catch(() => {}); await sleep(1800); }
      for (const b of ["Esquire", "Cosmopolitan"]) await pick(p, "carousel-live", b, 3000);
      await next.click().catch(() => {}); await sleep(2000);
    },
  },
  system: { id: "system-live", offset: 96, run: async (p) => { await sleep(2500); await smoothScrollBy(p, 560, 5000); await sleep(3000); } },
  river: {
    id: "river-live", iframe: "/hearst-plus/", offset: 96,
    run: async (p) => { await sleep(3000); for (const w of ["1280 xl", "390 phone", "1440"]) await pick(p, "river-live", w, 3600); },
  },
};

const browser = await chromium.launch();

// Warm up dev compilation so recordings do not show loading states.
{
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage();
  for (const url of ["/specs/", "/hearst-plus/"]) await page.goto(BASE + url, { waitUntil: "load", timeout: 180000 });
  await ctx.close();
}

const result = {};
for (const [key, ch] of Object.entries(chapters)) {
  if (only.length && !only.includes(key)) continue;
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, recordVideo: { dir: path.join(outDir, "raw"), size: { width: W, height: H } } });
  await hideDevBadge(ctx);
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(`${BASE}/specs/#${ch.id}`, { waitUntil: "load", timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  await position(page, ch.id, ch.offset);
  if (ch.iframe) {
    // Lazy iframe loads once in view; wait for it.
    for (let i = 0; i < 60 && !frameOf(page, ch.iframe); i++) await sleep(500);
    const f = frameOf(page, ch.iframe);
    if (f) await f.waitForLoadState("load", { timeout: 180000 }).catch(() => {});
    await sleep(6000);
  } else {
    await sleep(3000);
  }
  await position(page, ch.id, ch.offset);
  await sleep(500);
  const start = (Date.now() - t0) / 1000;
  await ch.run(page);
  const end = (Date.now() - t0) / 1000;
  const video = page.video();
  await ctx.close();
  const src = await video.path();
  const dest = path.join(outDir, `${key}.webm`);
  fs.renameSync(src, dest);
  result[key] = { file: dest, start, end };
  console.log(key, start.toFixed(2), end.toFixed(2));
}
await browser.close();
const metaPath = path.join(outDir, "clips.json");
const prev = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, "utf8")) : {};
fs.writeFileSync(metaPath, JSON.stringify({ ...prev, ...result }, null, 2));
