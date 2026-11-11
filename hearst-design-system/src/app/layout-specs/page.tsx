import type { Metadata } from "next";

import { ButtonStyleLink } from "@/components/cta-specs/button-brand-preview";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Breakpoints and Grid | Hearst+",
  description: "The rail layout contract: which breakpoint applies when, how layouts go from one to three columns, measured column widths, a dimensional drawing and a motion film.",
};

/** Re-measured with Playwright in Chromium at 320–1920 px after the layout contract (Rev C, 2026-11-11) was applied. */
const breakpointRows = [
  ["base", "0", "—", "One column. Page padding P1 = 16.", "One column, padding 16."],
  ["sm", "640", "1,073", "No column change. Type, spacing and small two-up grids only.", "No change."],
  ["md", "768", "811", "Right rail (300) joins: two columns. Padding P2 = 24.", "Panel insets 24 from the window; padding 24; one column."],
  ["lg", "1024", "864", "No river change: two columns keep widening. Filter rails and block sections may go to three columns.", "Ad rail (300) joins: two columns."],
  ["rail", "1140", "rail layouts", "Left rail joins at 240 (--layout-rail-compact): three columns, river 520.", "No change."],
  ["rail-full", "1200", "rail layouts", "Left rail widens to 300: river back to 520.", "No change."],
  ["xl", "1280", "108", "Padding P3 = 48.", "Context rail (300) joins: three columns. Padding 48."],
  ["MX", "1360", "token", "Content stops growing at --width-content-max; extra width becomes margin.", "Panel stops growing at 1360."],
  ["2xl", "1536", "0", "Retired.", "Retired."],
] as const;

const riverRows = [
  ["390", "1", "—", "358", "—", "16"],
  ["768", "2", "—", "404", "300", "24"],
  ["1024", "2", "—", "660", "300", "24"],
  ["1139", "2", "—", "775", "300", "24"],
  ["1140", "3", "240", "520", "300", "24"],
  ["1199", "3", "240", "579", "300", "24"],
  ["1200", "3", "300", "520", "300", "24"],
  ["1279", "3", "300", "599", "300", "24"],
  ["1280", "3", "300", "552", "300", "48"],
  ["1440+", "3", "300", "632", "300", "48"],
] as const;

const readerRows = [
  ["390", "1", "—", "358", "—", "16"],
  ["768", "1", "—", "672", "—", "24"],
  ["1024", "2", "—", "612", "300", "24"],
  ["1280", "3", "300", "504", "300", "48"],
  ["1440+", "3", "300", "632", "300", "48"],
] as const;

const blockRows = [
  ["< 536", "1", "Card fills the block."],
  ["536", "2", "2 · 260 + 16"],
  ["812", "3", "3 · 260 + 2 · 16 · rows hide a 4th card so they never show a partial set"],
  ["1088", "4", "4 · 260 + 3 · 16"],
] as const;

const contractRows = [
  ["--layout-gap", "16", "The gutter between rail-layout columns: river, reader, block sections and block grids. The 4 / 8 / 12 Grid keeps its own 16 · 20 · 24 gutter."],
  ["--layout-rail", "300", "The standard rail width, left and right, including the reader's context and ad rails."],
  ["--layout-rail-compact", "240", "The left rail between 1140 and 1199 only."],
  ["--width-content-max", "1360", "Container cap for pages and the reader panel; extra width becomes margin."],
  ["padding", "16 · 24 · 48", "Container padding at base · md · xl, for pages and the reader."],
  ["right rail", "md", "Joins at 768."],
  ["left rail", "rail · rail-full", "Joins at 1140 at 240 and widens to 300 at 1200. A left rail that holds controls with no fallback elsewhere (brand and topic filters, the video queue, block sections) may join at lg."],
] as const;

const changes = [
  ["Rev C · left rail at 1140.", "A 1280 laptop at 150% scaling has about 1265 of page width, so the left rail now joins at 1140 at 240 wide and widens to 300 at 1200. The river is 520 at both joins and widens to 599 just below 1280. Applies to the For You river, local news, TV, events discovery, games and the loading skeleton."],
  ["Rev B · left rail moved off lg.", "The river keeps two columns from 768 and never drops to 398 at 1024 (Rev A)."],
  ["One gutter.", "--layout-gap (16) replaces 16, 18 and 20. Block grids now break at 536, 812 and 1088."],
  ["One rail width.", "--layout-rail (300) replaces the 200, 220, 240, 260 and 280 rails, including the reader's context rail."],
  ["One container.", "The reader now pads 16 · 24 · 48 like every page, so at 1440 it lines up with the river: 300 · 632 · 300."],
  ["Breakpoints trimmed.", "2xl and min-[1201px] are gone. The featured river card stays stacked at every width (content is capped at 1360 anyway). sm is for type and spacing only."],
  ["Contract documented.", "RAIL_LAYOUT in ui/grid.tsx is the HDS page-layout contract; the 4 / 8 / 12 Grid is for columns inside a region."],
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
              <th key={header} scope="col" className={cn("border-b border-border px-4 py-3 type-k1 text-muted-foreground", numeric.includes(index) && "text-right")}>
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
            Four min-width breakpoints (640, 768, 1024, 1280), two rail-layout breakpoints (1140, 1200) and a 1360 content maximum. Pages go from one column to two at 768 and three at 1140, where the left rail joins at 240 before widening to 300 at 1200; the reader adds its rails at 1024 and 1280; block grids follow their own width. Rail layouts share one gutter (16) and a 300 rail width, and every page uses one container padding (16 · 24 · 48). Every value here was measured in the running app.
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-2">
            {[["Breakpoints", "#breakpoints"], ["Contract", "#contract"], ["Film", "#film"], ["Drawing", "#drawing"], ["Columns", "#columns"], ["Changes", "#changes"]].map(([label, href]) => (
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

        <section aria-labelledby="contract" className={sectionClass}>
          <SectionHeading id="contract" eyebrow="02 · Layout contract" title="One gutter, one rail, one container.">
            Defined as CSS custom properties in globals.css and exported as <code className="text-foreground">RAIL_LAYOUT</code> from <code className="text-foreground">ui/grid.tsx</code>. New layouts use these instead of fixed pixel tracks.
          </SectionHeading>
          <SpecTable caption="Layout contract tokens" headers={["Token", "Value", "Use"]} rows={contractRows} />
        </section>

        <section aria-labelledby="film" className={sectionClass}>
          <SectionHeading id="film" eyebrow="03 · Motion film" title="Watch the layout reflow.">
            A window grows from 320 to 1920 and stops at every breakpoint. The columns are drawn from the measured formulas, and the graph traces the main column&rsquo;s width. The dashed line is the previous layout (Rev B, left rail at 1280). Then the reader, the block grid and the full sheet.
          </SectionHeading>
          <figure className="min-w-0">
            <video
              src="/specs/layout-film.mp4"
              poster="/specs/layout-drawing.svg"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Motion film of the layout: a viewport frame grows from 320 to 1920 pixels and pauses at each breakpoint while the homepage river goes from one to two to three columns, the left rail joining at 240 at 1140 and widening to 300 at 1200, and a graph traces the river width; then the story reader adds its ad and context rails; then a block grid goes from one to four columns by container width; then the full drawing sheet resolves and the camera tours its views."
              className="block aspect-video w-full rounded-card bg-white shadow-[var(--hp-shadow-card)]"
            />
            <figcaption className="mt-3 text-sm text-muted-foreground">Motion film · 66 s · river sweep 0–24 s · reader 24–36 s · block grid 36–46 s · drawing tour 46–66 s.</figcaption>
          </figure>
        </section>

        <section aria-labelledby="drawing" className={sectionClass}>
          <SectionHeading id="drawing" eyebrow="04 · Dimensional drawing" title="UI-LAYOUT-001 · breakpoints and grid.">
            Breakpoint map, river and reader plans at each breakpoint, the river-width graph, the block grid&rsquo;s container query and the page container. Every code on the sheet is listed in its tables.
          </SectionHeading>
          <figure className="min-w-0">
            <div className="overflow-x-auto rounded-card bg-white shadow-[var(--hp-shadow-card)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static vector drawing */}
              <img
                src="/specs/layout-drawing.svg"
                width={1700}
                height={1060}
                alt="Dimensional drawing of the layout, revision C: breakpoint map from 0 to 1920 with BP1 640, BP2 768, BP3 1024, the rail breakpoints at 1140 (240 left rail) and 1200 (300 left rail), BP4 1280 and MX 1360; river plans at 390 (one column), 768 (404 river and 300 right rail), 1024 (660 river and 300 right rail) and 1440 (300, 632, 300 inside a 1360 container); reader plans at 390, 1024 (612 article, 300 ad rail) and 1440 (300, 632, 300); a graph of river width against viewport comparing revisions B and C; block grid widths 536, 812 and 1088; the page container at 1920 with 280 margins; and variable tables."
                className="block h-auto w-full min-w-[960px]"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>Rev C · 2026-11-11 · CSS px · scale noted per view</span>
              <ButtonStyleLink href="/specs/layout-drawing.html">Open the full sheet with notes</ButtonStyleLink>
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="columns" className={sectionClass}>
          <SectionHeading id="columns" eyebrow="05 · Columns" title="One, two and three columns, measured.">
            Widths in CSS px at the listed window width. The river and the article take whatever the rails leave.
          </SectionHeading>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Homepage river</h3>
          <SpecTable caption="Homepage river columns" headers={["Window", "Columns", "Left rail", "River", "Right rail", "Padding"]} rows={riverRows} numeric={[1, 2, 3, 4, 5]} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Story reader</h3>
          <SpecTable caption="Story reader columns" headers={["Window", "Columns", "Context rail", "Article", "Ad rail", "Padding"]} rows={readerRows} numeric={[1, 2, 3, 4, 5]} />
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Block grid (container query)</h3>
          <SpecTable caption="Block grid columns by block width" headers={["Block width", "Columns", "Rule"]} rows={blockRows} numeric={[1]} />
        </section>

        <section aria-labelledby="changes" className={sectionClass}>
          <SectionHeading id="changes" eyebrow="06 · Changes in Rev C" title="What changed." />
          <ol className="grid gap-3 md:grid-cols-2">
            {changes.map(([titleText, body], index) => (
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
