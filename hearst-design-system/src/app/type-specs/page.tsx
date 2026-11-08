import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { ButtonStyleLink } from "@/components/cta-specs/button-brand-preview";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Type Metrics | Hearst+",
  description: "One standard for line height, letter spacing and spacing between editorial text roles: headlines, decks, bylines, date stamps, eyebrows, captions and paragraphs, with a dimensional drawing and a motion film.",
};

type Role = {
  code: string;
  role: string;
  family: "headline" | "text";
  size: number;
  lineHeight: number;
  baseSize?: number;
  baseLineHeight?: number;
  weight: number;
  tracking: string;
  trackingCss: string;
  caps?: boolean;
  tabular?: boolean;
  sample: string;
  today: string;
};

/** Standard: LH = 4 · round(FS · R ÷ 4). Text roles use the HDS line-height token for their size; headlines use RH. */
const roles: Role[] = [
  { code: "T1", role: "Display headline · reader H1", family: "headline", size: 48, lineHeight: 52, baseSize: 32, baseLineHeight: 36, weight: 800, tracking: "−0.01em", trackingCss: "-0.01em", sample: "Display headline in balanced lines", today: "48/50.4 · 36/37.8" },
  { code: "T2", role: "Lead headline · feature card", family: "headline", size: 32, lineHeight: 36, baseSize: 24, baseLineHeight: 28, weight: 800, tracking: "0", trackingCss: "0", sample: "Lead headline sets in two lines", today: "31.6/34.1 · 27.2/30.5" },
  { code: "T4", role: "Article subhead", family: "headline", size: 28, lineHeight: 32, baseSize: 22, baseLineHeight: 28, weight: 800, tracking: "0", trackingCss: "0", sample: "Article subhead", today: "30/37.5" },
  { code: "T3", role: "Card headline", family: "headline", size: 24, lineHeight: 28, baseSize: 20, baseLineHeight: 24, weight: 800, tracking: "0", trackingCss: "0", sample: "Card headline line one sets and balances a second", today: "24/30 · 24/33" },
  { code: "T5", role: "Compact headline · rails", family: "headline", size: 16, lineHeight: 20, weight: 800, tracking: "0", trackingCss: "0", sample: "Compact headline for rails and modules", today: "16/20" },
  { code: "T6", role: "List item headline", family: "text", size: 14, lineHeight: 20, weight: 700, tracking: "0.3px", trackingCss: "0.3px", sample: "List item headline in trending and daily habit", today: "12/16.2" },
  { code: "D1", role: "Reader deck", family: "text", size: 20, lineHeight: 28, weight: 400, tracking: "0", trackingCss: "0", sample: "The reader deck states the story in one or two lines under the headline.", today: "—" },
  { code: "B1", role: "Article body", family: "text", size: 18, lineHeight: 28, weight: 400, tracking: "0", trackingCss: "0", sample: "Body paragraphs set at 18/28 on a measure of sixty to seventy-five characters, with kerning on and no manual tracking. A new paragraph starts 24 px below the last line.", today: "18/32" },
  { code: "D2", role: "Card deck", family: "text", size: 16, lineHeight: 24, weight: 400, tracking: "0.2px", trackingCss: "0.2px", sample: "Deck copy runs two lines at most and clamps after the second line.", today: "14/24 · 15.2/24 · 16/28" },
  { code: "B2", role: "UI text · summaries · comments", family: "text", size: 14, lineHeight: 20, weight: 400, tracking: "0.3px", trackingCss: "0.3px", sample: "Interface text, module summaries and comment bodies.", today: "14/20 · 14/24" },
  { code: "M1", role: "Byline · source", family: "text", size: 12, lineHeight: 16, weight: 600, tracking: "0.4px", trackingCss: "0.4px", sample: "Brand · Section · Author Name", today: "11/16.5" },
  { code: "M2", role: "Date · time stamp", family: "text", size: 12, lineHeight: 16, weight: 400, tracking: "0.4px", trackingCss: "0.4px", tabular: true, sample: "Nov 8, 2026 · 6 min read", today: "11/20" },
  { code: "C1", role: "Caption · credit", family: "text", size: 12, lineHeight: 16, weight: 400, tracking: "0.4px", trackingCss: "0.4px", sample: "Caption or photo credit", today: "12/20" },
  { code: "K1", role: "Eyebrow · caps label", family: "text", size: 11, lineHeight: 16, weight: 700, tracking: "+0.1em", trackingCss: "0.1em", caps: true, sample: "Eyebrow · Advertisement", today: "+0.08 to +0.24em" },
];

const spacingRows = [
  ["S1", "8", "Meta row → headline (cards)"],
  ["S2", "8", "Headline → deck (cards)"],
  ["S3", "12", "Eyebrow → display headline (reader)"],
  ["S4", "16", "Display headline → deck (reader)"],
  ["S5", "16", "Deck → byline row (reader)"],
  ["S6", "24", "Byline row → body (reader)"],
  ["S7", "24", "Paragraph gap"],
  ["S8", "40", "Space above an article subhead"],
  ["S9", "12", "Article subhead → body"],
] as const;

const auditRows = [
  ["Line heights", "42", "2 ramps", "leading-6 ×340, leading-relaxed ×165, leading-tight ×153 … plus 25 arbitrary values from 0.82 to 1.9"],
  ["Letter spacings", "40", "4 rules", "tracking-widest ×188, tracking-wider ×101, [0.16em] ×64 … caps labels range from 0.08em to 0.24em"],
  ["Card headline", "24/30 and 24/33", "24/28", "The same role uses two line heights on one page"],
  ["Card deck", "14/24 · 15.2/24 · 16/28", "16/24", "Three sizes and three ratios (1.5 to 1.75)"],
  ["Article body", "18/32", "18/28", "Ratio 1.78; the HDS token for 18 px is 1.45"],
  ["Byline + date", "11/16.5 beside 11/20", "12/16 + 12/16", "Two line boxes in one row put the baselines 1.8 px apart"],
] as const;

const rules = [
  ["Line height comes from the size.", "LH = 4 · round(FS · R ÷ 4). Text roles use the HDS font.line-height token for their size (1.35–1.45); headlines use RH (1.25 at 16 down to 1.08 at 48). No leading-* one-offs."],
  ["Tracking comes from the token.", "Sentence case uses the HDS font.letter-spacing token for its size (0.4 px at 11–13, 0.3 px at 14, 0.2 px at 16, 0 at 18 and up). All-caps labels add +0.1em. Display headlines of 40 px and up use −0.01em. Nothing else."],
  ["One row, one line box.", "Roles that share a row (byline, date, read time, icons) share one line height so their baselines align."],
  ["Spacing between roles is S1–S9.", "Margins between text roles sit on the 4 px grid and are applied as margin above the next role."],
  ["Kerning stays on.", "font-kerning: normal and the font’s default ligatures. No manual kerning or letter-spacing to fit copy."],
  ["Figures line up.", "Dates, times, durations and counts use tabular figures (font-variant-numeric: tabular-nums)."],
  ["Wrap with intent.", "Headlines use text-wrap: balance; decks and body use text-wrap: pretty. Card headlines clamp at three lines, decks at two. Body measure stays at 60–75 characters."],
  ["Brands change faces, not metrics.", "A brand may swap the headline typeface and weight. Size, line height, tracking and spacing stay the same in every brand."],
] as const;

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[.1em] text-muted-foreground">{eyebrow}</p>
      <h2 id={id} className="headline mt-3 text-balance text-3xl leading-tight sm:text-4xl">{title}</h2>
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
              <th key={header} scope="col" className={cn("border-b border-border px-4 py-3 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-[.1em] text-muted-foreground", numeric.includes(index) && "text-right")}>
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

function roleStyle(role: Role): CSSProperties {
  return {
    fontSize: role.size,
    lineHeight: `${role.lineHeight}px`,
    letterSpacing: role.trackingCss,
    fontWeight: role.weight,
    textTransform: role.caps ? "uppercase" : undefined,
    fontVariantNumeric: role.tabular ? "tabular-nums" : undefined,
    textWrap: role.family === "headline" ? "balance" : "pretty",
  } as CSSProperties;
}

const sectionClass = "scroll-mt-24 space-y-6 border-t border-border pt-10";

export default function TypeSpecsPage() {
  return (
    <div className="hearst-plus-theme min-h-screen bg-background font-sans text-foreground">
      <ProductHeader current="type-specs" />
      <main className="mx-auto max-w-[1360px] space-y-14 px-5 py-10 md:px-10 md:py-16">
        <header className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.1em] text-muted-foreground">HDS foundations · Typography</p>
          <h1 className="headline mt-4 text-balance text-4xl leading-[1.08] sm:text-6xl">Type metrics</h1>
          <p className="mt-5 max-w-3xl text-lg leading-7 text-muted-foreground">
            One standard for line height, letter spacing and the space between editorial text roles: headlines, decks, bylines, date stamps, eyebrows, captions and paragraphs. Line height comes from the size and snaps to a 4 px grid, tracking comes from the HDS token, and every brand keeps the same metrics.
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-2">
            {[["Today", "#today"], ["Rule", "#rule"], ["Roles", "#roles"], ["Spacing", "#spacing"], ["Film", "#film"], ["Drawing", "#drawing"], ["Rules", "#rules"]].map(([label, href]) => (
              <ButtonStyleLink key={href} href={href} variant="ghost" className="px-3">{label}</ButtonStyleLink>
            ))}
          </nav>
        </header>

        <section aria-labelledby="today" className={sectionClass}>
          <SectionHeading id="today" eyebrow="01 · Today" title="Line spacing is not standardized yet.">
            HDS defines a line height and a letter spacing for every type size (font.line-height and font.letter-spacing), but they never reached the app&rsquo;s CSS. Components set their own values, so the same role renders differently from module to module. Measured in Chromium on the Hearst+ home river and the reader at 390 and 1440 px.
          </SectionHeading>
          <SpecTable caption="Typography audit" headers={["What", "Today", "Standard", "Notes"]} rows={auditRows} />
        </section>

        <section aria-labelledby="rule" className={sectionClass}>
          <SectionHeading id="rule" eyebrow="02 · The rule" title="Line height comes from the size.">
            Each line sits in a line box of height LH. The font&rsquo;s own content area sits in the middle; whatever LH adds splits evenly above and below. LH is the size times a ratio, rounded to the 4 px grid.
          </SectionHeading>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["LH = 4 · round(FS · R ÷ 4)", "Body: 18 × 1.45 = 26.1 → 28. Card deck: 16 × 1.45 = 23.2 → 24. Byline: 12 × 1.4 = 16.8 → 16."],
              ["R · text ratio 1.35–1.45", "The HDS font.line-height token for the size: 1.35 at 11, 1.4 at 12–13 and 20, 1.45 at 14–18."],
              ["RH · headline ratio 1.25 → 1.08", "1.25 at 16, 1.2 at 20–24, 1.125 at 28–32, 1.08 at 48. Bigger type needs less leading."],
            ].map(([formula, body]) => (
              <div key={formula} className="rounded-card bg-card p-5 shadow-[var(--hp-shadow-card)]">
                <p className="font-semibold tabular-nums">{formula}</p>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="roles" className={sectionClass}>
          <SectionHeading id="roles" eyebrow="03 · Roles" title="Every text role, rendered at its standard metrics.">
            Size / line height at md and up, with the phone value where a headline steps down. Each sample below renders live at the standard values, on a 4 px grid.
          </SectionHeading>
          <div className="divide-y divide-border overflow-hidden rounded-card bg-card shadow-[var(--hp-shadow-card)]">
            {roles.map((role) => (
              <div key={role.code} className="grid gap-4 px-5 py-5 md:grid-cols-[11rem_minmax(0,1fr)_12rem] md:items-start">
                <div>
                  <p className="font-semibold"><code>{role.code}</code> · {role.role}</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{role.family === "headline" ? "Headline face · RH" : "Text face · HDS R"}</p>
                </div>
                <p
                  className={cn("min-w-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,color-mix(in_oklab,var(--border)_70%,transparent)_3px,color-mix(in_oklab,var(--border)_70%,transparent)_4px)]", role.family === "headline" ? "font-[family-name:var(--hp-font-headline)]" : "font-sans")}
                  style={roleStyle(role)}
                >
                  {role.sample}
                </p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm tabular-nums">
                  <dt className="text-muted-foreground">Size / LH</dt>
                  <dd>{role.size}/{role.lineHeight}{role.baseSize ? ` · base ${role.baseSize}/${role.baseLineHeight}` : ""}</dd>
                  <dt className="text-muted-foreground">Ratio</dt>
                  <dd>× {+(role.lineHeight / role.size).toFixed(3)}</dd>
                  <dt className="text-muted-foreground">Tracking</dt>
                  <dd>{role.tracking}</dd>
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd>{role.weight}{role.tabular ? " · tabular" : ""}</dd>
                  <dt className="text-muted-foreground">Today</dt>
                  <dd>{role.today}</dd>
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="spacing" className={sectionClass}>
          <SectionHeading id="spacing" eyebrow="04 · Spacing" title="The space between roles.">
            Applied as margin above the next role, in multiples of 4. Card: M1 → S1 → T3 → S2 → D2. Reader: K1 → S3 → T1 → S4 → D1 → S5 → M1/M2 row → S6 → B1.
          </SectionHeading>
          <SpecTable caption="Spacing between text roles" headers={["Code", "Px", "Between"]} rows={spacingRows} numeric={[1]} />
        </section>

        <section aria-labelledby="film" className={sectionClass}>
          <SectionHeading id="film" eyebrow="05 · Motion film" title="Watch the standard explained.">
            Today&rsquo;s scattered values and the two ramps that replace them, the anatomy of a line and the 4 px snap, every role from 11 to 48 px, tracking and tabular figures, then the story card and the reader moving from today&rsquo;s metrics to the standard, and a tour of the drawing.
          </SectionHeading>
          <figure className="min-w-0">
            <video
              src="/specs/type-film.mp4"
              poster="/specs/type-drawing.svg"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Motion film of the type metrics standard: a scatter plot of today's 15 measured line-height ratios gives way to two ramps, one for text and one for headlines; a line of type at 9 to 1 shows its line box, baseline, x-height, cap height, content area and half-leading, then snaps from 26.1 to 28 on the 4 pixel grid; every role from the 11 pixel eyebrow to the 48 pixel display headline steps through with a live ratio graph; caps tracking moves from 0 to 0.24em and settles at 0.1em, the display headline tightens by 0.01em, and dates switch to tabular figures; the story card headline tightens from 24/30 to 24/28 and its deck from 16/28 to 16/24; the reader headline moves to 48/52, the body from 18/32 to 18/28, and a zoomed byline row shows the byline and date baselines aligning; then the drawing sheet resolves and the camera tours its views."
              className="block aspect-video w-full rounded-card bg-white shadow-[var(--hp-shadow-card)]"
            />
            <figcaption className="mt-3 text-sm text-muted-foreground">Motion film · 78 s · problem 0–7 · anatomy 7–19 · ramp 19–31 · tracking and figures 31–40 · story card 40–52 · reader 52–64 · drawing tour 64–78.</figcaption>
          </figure>
        </section>

        <section aria-labelledby="drawing" className={sectionClass}>
          <SectionHeading id="drawing" eyebrow="06 · Dimensional drawing" title="UI-TYPE-001 · type metrics.">
            Anatomy of a line, the story card and reader stacks with every line box and gap, the headline ramp, the byline row baseline, tracking, tabular figures, the ratio graph and the role tables.
          </SectionHeading>
          <figure className="min-w-0">
            <div className="overflow-x-auto rounded-card bg-white shadow-[var(--hp-shadow-card)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static vector drawing */}
              <img
                src="/specs/type-drawing.svg"
                width={1700}
                height={1060}
                alt="Dimensional drawing of the type metrics standard, revision A: a line of body type at 3.5 to 1 with line height 28, content area 21, half-leading 3.5 and cap height 13.1; a story card stack with meta 12/16, gap 8, two headline lines at 24/28, gap 8 and two deck lines at 16/24; a reader stack with eyebrow 11/16, display headline 48/52, deck 20/28, byline row 12/16 and body 18/28 with its gaps; the byline row before and after baseline alignment; a headline ramp from 48/52 to 16/20; caps tracking at 0, 0.1em and 0.24em; proportional against tabular dates; a graph of line-height ratio against size with today's values; a spacing scale S1 to S9; and role tables."
                className="block h-auto w-full min-w-[960px]"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>Rev A · 2026-11-08 · CSS px · scale noted per view</span>
              <ButtonStyleLink href="/specs/type-drawing.html">Open the full sheet with notes</ButtonStyleLink>
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="rules" className={sectionClass}>
          <SectionHeading id="rules" eyebrow="07 · Rules" title="Eight rules for every surface." />
          <ol className="grid gap-3 md:grid-cols-2">
            {rules.map(([titleText, body], index) => (
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
