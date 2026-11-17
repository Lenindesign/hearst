// Renders a dimensional drawing HTML to one image per sheet (sheet + footer) at the
// size the specs page uses: 1760 css px wide at 1.1x = 1936 px.
// Usage: node output/specs/shoot-drawing.mjs output/specs/reader-drawing.html output/specs/reader-drawing
import { chromium } from "playwright";
import path from "node:path";

const [, , file, out] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1792, height: 1200 }, deviceScaleFactor: 1.1 });
await page.goto("file://" + path.resolve(file));
await page.waitForSelector("body[data-ready='1']");
await page.evaluate(() => document.fonts.ready);
const sheets = await page.$$(".sheetwrap");
for (let i = 0; i < sheets.length; i++) {
  await sheets[i].screenshot({ path: `${out}-sheet-${i + 1}.jpg`, type: "jpeg", quality: 90 });
}
await page.screenshot({ path: `${out}.png`, fullPage: true });
console.log(JSON.stringify(await sheets[0].boundingBox()));
await browser.close();
