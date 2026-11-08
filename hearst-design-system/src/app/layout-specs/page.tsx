import type { Metadata } from "next";

import { ButtonStyleLink } from "@/components/cta-specs/button-brand-preview";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Breakpoints and Grid | Hearst+",
  description: "Which breakpoint applies when, how layouts go from one to three columns, measured column widths, a dimensional drawing and a motion film.",
};

/** Measured with Playwright in Chromium at 320–1920 px on the homepage river and the story reader. */
const breakpointRows = [
  ["base", "0", "—", "One column everywhere. Page padding P1 = 16.", "One column."],
  ["sm", "640", "1,072", "No column change. Type, spacing and small two-up grids.", "Reader padding 32."],
  ["md", "768", "802", "Right rail (300) joins: two columns. Padding P2 = 24.", "Panel insets 24 from the window; still one column."],
  ["lg", "1024", "902", "Left rail (clamp 240–300) joins: three columns.", "Ad rail (300) joins: two columns. Reader padding 40."],
  ["xl", "1280", "69", "Padding P3 = 48. Left rail at its 300 maximum.", "Context rail (280) joins: three columns."],
  ["MX", "1360", "token", "Content stops growing at --width-content-max; extra width becomes margin.", "Panel stops growing at 1360."],
  ["2xl", "1536", "4", "No layout change.", "No layout change."],
] as const;

const riverRows = [
  ["390", "1", "—", "358", "—", "16"],
  ["768", "2", "—", "404", "300", "24"],
  ["1023", "2", "—", "659", "300", "24"],
  ["1024", "3", "246", "398", "300", "24"],
  ["1280", "3", "300", "552", "300", "48"],
  ["1440+", "3", "300", "632", "300", "48"],
] as const;

const readerRows = [
  ["390", "1", "—", "358", "—", "16"],
  ["768", "1", "—", "656", "—", "32"],
  ["1024", "2", "—", "578", "300", "40"],
  ["1280", "3", "280", "536", "300", "40"],
  ["1440+", "3", "280", "664", "300", "40"],
] as const;

const blockRows = [
  ["< 540", "1", "Card fills the block."],
  ["540", "2", "2 · 260 + 20"],
  ["820", "3", "3 · 260 + 2 · 20 · rows hide a 4th card so they never show a partial set"],
  ["1100", "4", "4 · 260 + 3 · 20"],
] as const;

const recommendations = [
  ["Bring the left rail in at xl (1280), not lg.", "At 1024 the river drops from 659 to 398, narrower than at 768. With the rail at xl the river never goes below 404 once the right rail is in, and three columns start with a 552 river."],
  ["One gutter token.", "River 16, reader 18 and block grids 20 today. Pick one (16) as a layout-gap token."],
  ["One pair of rail tokens.", "Left 300 (24vw clamp) and right 300. Retire the 200 / 220 / 260 / 280 one-offs, including the reader's 280 context rail."],
  ["One page container.", "Pages pad 16 · 24 · 48; the reader pads 16 · 32 · 40. Use the same container and padding for both."],
  ["Trim the breakpoint set.", "Retire 2xl (4 uses) and the stray min-[1201px]. Keep sm for type and spacing only, never for column changes."],
  ["Adopt or retire the 4 / 8 / 12 Grid.", "The HDS Grid primitive has no app uses. Either use it inside the river and rails, or document the rail layout as the HDS layout contract."],
] as const;

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{eyebrow}</p>
      <h2 id={id} className="headline mt-3 text-3xl leading-tight sm:text-4xl">{title}</h2>
      {children ? <p className="mt-3 leading-7 text-muted-foreground">{children}</p> : null}
    </div>
  );
}

function SpecTable({ caption, headers, rows, numeric = [] }: { caption: string; headers: string[]; rows: readonly (readonly string[])[]; numeric?: number[] }) {
  return (
    <div className="overflow-x-auto rounded-card bg-card shadow-[var(--hp-shadow-card)]">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={header} scope="col" className={cn("border-b border-border px-4 py-3 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground", numeric.includes(index) && "text-right")}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border last:border-b-0">
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`} className={cn("px-4 py-3 align-top leading-6", index === 0 && "font-semibold", numeric.includes(index) && "text-right tabular-nums")}>
                  {index === 0 ? <code>{cell}</code> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sectionClass = "scroll-mt-24 space-y-6 border-t border-border pt-10";

export default function LayoutSpecsPage() {
  return (
    <div className="hearst-plus-theme min-h-screen bg-background font-sans text-foreground">
      <ProductHeader current="layout-specs" />
      <main className="mx-auto max-w-[1360px] space-y-14 px-5 py-10 md:px-10 md:py-16">
        <header className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">HDS foundations · Layout</p>
          <h1 className="headline mt-4 text-balance text-4xl leading-[1.05] sm:text-6xl">Breakpoints and grid</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Five min-width breakpoints (640, 768, 1024, 1280, 1536) and a 1360 content maximum. Pages go from one column to two at 768 and three at 1024; the reader adds its rails at 1024 and 1280; block grids follow their own width. Every value here was measured in the running app.
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-2">
            {[["Breakpoints", "#breakpoints"], ["Film", "#film"], ["Drawing", "#drawing"], ["Columns", "#columns"], ["Recommendations", "#recommendations"]].map(([label, href]) => (
              <ButtonStyleLink key={href} href={href} variant="ghost" className="px-3">{label}</ButtonStyleLink>
            ))}
          </nav>
        </header>

        <section aria-labelledby="breakpoints" className={sectionClass}>
          <SectionHeading id="breakpoints" eyebrow="01 · Breakpoints" title="What changes at each width.">
            Each breakpoint is a min-width: its layout holds until the next one. Uses counts Tailwind prefixes in the app source.
          </SectionHeading>
          <SpecTable caption="Breakpoints and what changes" headers={["Breakpoint", "Min width", "Uses", "Homepage river", "Story reader"]} rows={breakpointRows} numeric={[1, 2]} />
        </section>

        <section aria-labelledby="film" className={sectionClass}>
          <SectionHeading id="film" eyebrow="02 · Motion film" title="Watch the layout reflow.">
            A window grows from 320 to 1920 and stops at every breakpoint. The columns are drawn from the measured formulas, and the graph traces the main column&rsquo;s width. Then the reader, the block grid and the full sheet.
          </SectionHeading>
          <figure className="min-w-0">
            <video
              src="/specs/layout-film.mp4"
              poster="/specs/layout-drawing.svg"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Motion film of the layout: a viewport frame grows from 320 to 1920 pixels and pauses at each breakpoint while the homepage river goes from one to two to three columns and a graph traces the river width; then the story reader adds its ad and context rails; then a block grid goes from one to four columns by container width; then the full drawing sheet resolves and the camera tours its views."
              className="block aspect-video w-full rounded-card bg-white shadow-[var(--hp-shadow-card)]"
            />
            <figcaption className="mt-3 text-sm text-muted-foreground">Motion film · 66 s · river sweep 0–24 s · reader 24–36 s · block grid 36–46 s · drawing tour 46–66 s.</figcaption>
          </figure>
        </section>

        <section aria-labelledby="drawing" className={sectionClass}>
          <SectionHeading id="drawing" eyebrow="03 · Dimensional drawing" title="UI-LAYOUT-001 · breakpoints and grid.">
            Breakpoint map, river and reader plans at each breakpoint, the river-width graph, the block grid&rsquo;s container query and the page container. Every code on the sheet is listed in its tables.
          </SectionHeading>
          <figure className="min-w-0">
            <div className="overflow-x-auto rounded-card bg-white shadow-[var(--hp-shadow-card)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static vector drawing */}
              <img
                src="/specs/layout-drawing.svg"
                width={1700}
                height={1060}
                alt="Dimensional drawing of the layout: breakpoint map from 0 to 1920 with BP1 640, BP2 768, BP3 1024, BP4 1280, MX 1360 and BP5 1536; river plans at 390 (one column), 768 (river and 300 right rail), 1024 (246 left rail, 398 river, 300 right rail) and 1440 (300, 632, 300 inside a 1360 container); reader plans at 390, 1024 and 1440; a graph of river width against viewport; block grid widths 540, 820 and 1100; the page container at 1920 with 280 margins; and variable tables."
                className="block h-auto w-full min-w-[960px]"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>Rev A · 2026-11-07 · CSS px · scale noted per view</span>
              <ButtonStyleLink href="/specs/layout-drawing.html">Open the full sheet with notes</ButtonStyleLink>
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="columns" className={sectionClass}>
          <SectionHeading id="columns" eyebrow="04 · Columns" title="One, two and three columns, measured.">
            Widths in CSS px at the listed window width. The river and the article take whatever the rails leave.
          </SectionHeading>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Homepage river</h3>
          <SpecTable caption="Homepage river columns" headers={["Window", "Columns", "Left rail", "River", "Right rail", "Padding"]} rows={riverRows} numeric={[1, 2, 3, 4, 5]} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Story reader</h3>
          <SpecTable caption="Story reader columns" headers={["Window", "Columns", "Context rail", "Article", "Ad rail", "Padding"]} rows={readerRows} numeric={[1, 2, 3, 4, 5]} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Block grid (container query)</h3>
          <SpecTable caption="Block grid columns by block width" headers={["Block width", "Columns", "Rule"]} rows={blockRows} numeric={[1]} />
        </section>

        <section aria-labelledby="recommendations" className={sectionClass}>
          <SectionHeading id="recommendations" eyebrow="05 · Recommendations" title="What to change." />
          <ol className="grid gap-3 md:grid-cols-2">
            {recommendations.map(([titleText, body], index) => (
              <li key={titleText} className="flex gap-4 rounded-card bg-card p-5 leading-6 shadow-[var(--hp-shadow-card)]">
                <span className="font-bold tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span><strong className="block">{titleText}</strong><span className="text-muted-foreground">{body}</span></span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
