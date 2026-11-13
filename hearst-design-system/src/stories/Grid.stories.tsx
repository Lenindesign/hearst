import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect } from "@storybook/test";
import {
  BREAKPOINTS,
  Col,
  Grid,
  GridOverlay,
  PageContainer,
  RAIL_LAYOUT,
  useBreakpoint,
} from "@/components/ui/grid";

const meta: Meta = {
  title: "Hearst Plus/Foundation/Grid System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The HDS page-grid primitive and the Hearst+ production river solve different layout needs. Use the Storybook viewport toolbar to compare `mobile1` (320), `mobile2` (414), `tablet` (768), and the default desktop viewport.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

function Block({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "accent";
}) {
  const toneClass =
    tone === "brand"
      ? "bg-primary text-primary-foreground"
      : tone === "accent"
      ? "bg-accent text-accent-foreground"
      : "bg-muted text-muted-foreground border border-border";
  return (
    <div
      className={`flex h-full min-h-24 items-center justify-center rounded-md p-4 text-xs font-semibold uppercase tracking-widest ${toneClass}`}
    >
      {children}
    </div>
  );
}

function StoryCheatSheet({
  kicker,
  title,
  intro,
  leftTitle,
  leftBody,
  rightTitle,
  rightBody,
}: {
  kicker: string;
  title: string;
  intro: React.ReactNode;
  leftTitle: string;
  leftBody: React.ReactNode;
  rightTitle: string;
  rightBody: React.ReactNode;
}) {
  return (
    <div className="mb-8 rounded-xl border border-border bg-background/80 p-5 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {kicker}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {intro}
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
        <div className="min-w-0 rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {leftTitle}
          </p>
          <div className="mt-2 text-sm text-foreground">{leftBody}</div>
        </div>
        <div className="min-w-0 rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {rightTitle}
          </p>
          <div className="mt-2 text-sm text-foreground">{rightBody}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Stories ────────────────────────────────────────────────────────────────

export const Anatomy: Story = {
  name: "1 · HDS Page Grid Primitive",
  render: () => (
    <div className="bg-background py-12">
      <PageContainer className="relative">
        <GridOverlay hideOnMobile={false} />
        <div className="relative z-10">
          <StoryCheatSheet
            kicker="HDS page grid primitive"
            title="The reusable 4 / 8 / 12 foundation"
            intro={
              <>
                <span className="font-medium text-foreground">PageContainer</span>{" "}
                sets outer padding and max content width.{" "}
                <span className="font-medium text-foreground">GridOverlay</span>{" "}
                shows the live column tracks.{" "}
                <span className="font-medium text-foreground">Grid</span> is the
                4/8/12 system.{" "}
                <span className="font-medium text-foreground">Col</span> is a
                slot whose span can change per breakpoint.
              </>
            }
            leftTitle="The rule"
            leftBody={
              <>
                <p>
                  For a simple filled row, spans usually add to 4 (mobile), 8
                  (md), or 12 (lg).
                </p>
                <p className="mt-2 text-muted-foreground">
                  Partial rows, explicit starts, and intentional overlaps are
                  valid when their placement is clear.{" "}
                  Labels use <span className="font-mono">mobile / md / lg</span>
                  . Example: <span className="font-semibold">2 / 4 / 6</span>{" "}
                  means span 2 of 4, then 4 of 8, then 6 of 12.
                </p>
              </>
            }
            rightTitle="Copy/paste patterns"
            rightBody={
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-semibold text-foreground">
                    Full grid width
                  </p>
                  <pre className="mt-1 max-w-full overflow-x-auto rounded-md border border-border bg-background p-2 text-[11px] leading-relaxed text-foreground">
                    <code>{`<Col span="full">...</Col>`}</code>
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Two-up (50/50)</p>
                  <pre className="mt-1 max-w-full overflow-x-auto rounded-md border border-border bg-background p-2 text-[11px] leading-relaxed text-foreground">
                    <code>{`<Col span={2} spanMd={4} spanLg={6}>Left</Col>
<Col span={2} spanMd={4} spanLg={6}>Right</Col>`}</code>
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Three cards (stack, then 3-up)
                  </p>
                  <pre className="mt-1 max-w-full overflow-x-auto rounded-md border border-border bg-background p-2 text-[11px] leading-relaxed text-foreground">
                    <code>{`<Col span="full" spanMd={4} spanLg={4}>Card</Col>
<Col span="full" spanMd={4} spanLg={4}>Card</Col>
<Col span="full" spanMd={8} spanLg={4}>Card</Col>`}</code>
                  </pre>
                </div>
              </div>
            }
          />

          <Grid>
            <Col span="full">
              <Block tone="brand">Full grid width (col-span-full)</Block>
            </Col>
            <Col span={2} spanMd={4} spanLg={6}>
              <Block>2 / 4 / 6</Block>
            </Col>
            <Col span={2} spanMd={4} spanLg={6}>
              <Block>2 / 4 / 6</Block>
            </Col>
            <Col span="full" spanMd={4} spanLg={4}>
              <Block tone="accent">Full / 4 / 4</Block>
            </Col>
            <Col span="full" spanMd={4} spanLg={4}>
              <Block tone="accent">Full / 4 / 4</Block>
            </Col>
            <Col span="full" spanMd={8} spanLg={4}>
              <Block tone="accent">Full / 8 / 4</Block>
            </Col>
          </Grid>
        </div>
      </PageContainer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          [
            "This page documents the reusable **HDS page-grid primitive**. It is one layout tool, not a claim that every production page uses 12 equal tracks.",
            "",
            "### What you’re looking at",
            "- **`PageContainer`**: applies the outer padding (page margins) and caps content at `--width-content-max`.",
            "- **`GridOverlay`** (blue tint): shows the actual column tracks at the current breakpoint.",
            "- **`Grid`**: the column system itself (4 / 8 / 12).",
            "- **`Col`**: a single “slot” on the grid; its span changes per breakpoint via `span`, `spanMd`, `spanLg`.",
            "",
            "### Filled-row convention",
            "For a simple filled row, spans usually add to the column count:",
            "- mobile: **4** columns total",
            "- tablet (`md` ≥ 768): **8** columns total",
            "- desktop (`lg` ≥ 1024): **12** columns total",
            "",
            "### Practical examples (copy/paste patterns)",
            "**Full grid width** (inside the current PageContainer):",
            "```tsx",
            '<Col span=\"full\">...</Col>',
            "```",
            "",
            "**Two-up split** (50/50):",
            "```tsx",
            "<Col span={2} spanMd={4} spanLg={6}>Left</Col>",
            "<Col span={2} spanMd={4} spanLg={6}>Right</Col>",
            "```",
            "",
            "**Three cards** (stack on mobile, 3-up on desktop):",
            "```tsx",
            "<Col span=\"full\" spanMd={4} spanLg={4}>Card</Col>",
            "<Col span=\"full\" spanMd={4} spanLg={4}>Card</Col>",
            "<Col span=\"full\" spanMd={8} spanLg={4}>Card</Col>",
            "```",
            "",
            "### How to read the labels in the blocks",
            "`2 / 4 / 6` means: **span 2 of 4** (mobile), **span 4 of 8** (`md`), **span 6 of 12** (`lg`).",
            "",
            "Use the viewport toolbar to step through mobile/tablet/desktop and watch how the same layout rebalances while keeping the same intent.",
          ].join("\n"),
      },
    },
  },
};

export const ProductionLayoutAnatomy: Story = {
  name: "2 · Hearst+ Rail Layout Contract",
  render: () => (
    <div className="bg-background py-12">
      <PageContainer>
        <StoryCheatSheet
          kicker="Hearst+ page-layout contract · RAIL_LAYOUT"
          title="One gutter, one rail width, one container"
          intro={
            <>
              Hearst+ pages and the story reader are rail layouts. <span className="font-medium text-foreground">PageContainer</span>{" "}
              owns the 1360 cap and the 16 · 24 · 48 padding; inside it the river or article is fluid and the rails are{" "}
              <span className="font-mono">--layout-rail</span> (300) with <span className="font-mono">--layout-gap</span> (16) between them. The left rail starts at{" "}
              <span className="font-mono">--layout-rail-compact</span> (240) from 1140 and widens to 300 at 1200.
              Resize with the viewport toolbar to watch the rails join.
            </>
          }
          leftTitle="When rails join"
          leftBody={
            <div className="space-y-2">
              <p><span className="font-semibold">Base:</span> one fluid track.</p>
              <p><span className="font-semibold">md (768):</span> river + right rail.</p>
              <p><span className="font-semibold">rail (1140):</span> left rail (240) + river + right rail.</p>
              <p><span className="font-semibold">rail-full (1200):</span> left rail widens to 300.</p>
              <p><span className="font-semibold">xl (1280):</span> padding grows to 48; no column change.</p>
              <p className="text-muted-foreground">A left rail holding controls with no fallback (filters, video queue, block sections) may join at lg.</p>
            </div>
          }
          rightTitle="Measured river width"
          rightBody={
            <div className="space-y-2">
              <p>358 at 390 · 404 at 768 · 660 at 1024 · 775 at 1139</p>
              <p>520 at 1140 · 579 at 1199 · 520 at 1200 · 599 at 1279</p>
              <p>552 at 1280 · 632 from 1360 (content cap).</p>
              <p className="text-muted-foreground">The river never drops below 404 once the right rail is in, or below 520 once the left rail is in.</p>
            </div>
          }
        />

        <div
          data-production-grid-contract="hearst-plus-river"
          className={`grid min-w-0 grid-cols-[minmax(0,1fr)] ${RAIL_LAYOUT.classes.gutter} gap-y-6 ${RAIL_LAYOUT.classes.twoColumn} ${RAIL_LAYOUT.classes.threeColumn}`}
        >
          <div className={RAIL_LAYOUT.classes.leftRail}><Block>Left rail<br />240 at rail · 300 at rail-full</Block></div>
          <Block tone="brand">Story river<br />minmax(0, 1fr)</Block>
          <div className={RAIL_LAYOUT.classes.rightRail}><Block>Right rail<br />--layout-rail · md</Block></div>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground">Production classes (from RAIL_LAYOUT)</p>
          <pre className="mt-2 max-w-full overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-foreground">
            <code>{`grid min-w-0 grid-cols-[minmax(0,1fr)] ${RAIL_LAYOUT.classes.gutter} gap-y-6
${RAIL_LAYOUT.classes.twoColumn}
${RAIL_LAYOUT.classes.threeColumn}
left rail: ${RAIL_LAYOUT.classes.leftRail} · right rail: ${RAIL_LAYOUT.classes.rightRail}`}</code>
          </pre>
          <p className="mt-3 text-sm text-muted-foreground">
            The reader follows the same contract: ad rail at <span className="font-mono">lg</span>, context rail at{" "}
            <span className="font-mono">xl</span>, so at 1440 it lines up with the river (300 · 632 · 300).
          </p>
        </div>
      </PageContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector(
      '[data-production-grid-contract="hearst-plus-river"]',
    );
    await expect(grid).not.toBeNull();
    await expect(grid!).toHaveClass(
      "grid-cols-[minmax(0,1fr)]",
      "gap-x-[var(--layout-gap)]",
      "md:grid-cols-[minmax(0,1fr)_var(--layout-rail)]",
      "rail:grid-cols-[var(--layout-rail-compact)_minmax(0,1fr)_var(--layout-rail)]",
      "rail-full:grid-cols-[var(--layout-rail)_minmax(0,1fr)_var(--layout-rail)]",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors the For You river in `home-page.tsx` using the exported `RAIL_LAYOUT` classes. `PageContainer` owns width and padding; the river is fluid and the rails use `--layout-rail` with `--layout-gap` between them. See `7 · Breakpoints & Grid Specs` for measured widths, the drawing and the film.",
      },
    },
  },
};

export const PlacementRules: Story = {
  name: "3 · Placement Rules",
  render: () => (
    <div className="bg-background py-12 space-y-12">
      <PageContainer>
        <StoryCheatSheet
          kicker="Placement rules"
          title="Make the math intentional"
          intro={
            <>
              Most layout bugs come from one thing: spans that don’t add up, or
              rows that shift because starts aren’t explicit. These examples show
              the safe, repeatable patterns.
            </>
          }
          leftTitle="Row math (sum to 12 at lg)"
          leftBody={
            <>
              <p>
                Desktop should feel engineered. Pick spans that add to 12 (e.g.{" "}
                <span className="font-mono">8 + 4</span>,{" "}
                <span className="font-mono">4 + 4 + 4</span>,{" "}
                <span className="font-mono">7 + 5</span>).
              </p>
              <p className="mt-2 text-muted-foreground">
                Mobile is always <span className="font-mono">span=&quot;full&quot;</span>{" "}
                unless you’re doing an explicit two-up mobile pattern.
              </p>
            </>
          }
          rightTitle="When to use start*"
          rightBody={
            <>
              <p>
                Use <span className="font-mono">startMd</span> /{" "}
                <span className="font-mono">startLg</span> when the row isn’t a
                simple left-to-right fill. If the alignment matters, make it
                explicit.
              </p>
              <p className="mt-2 text-muted-foreground">
                If you find yourself “nudging” with random margins, you probably
                need a start value.
              </p>
            </>
          }
        />
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Hero + Sidebar (12 = 8 + 4)
        </h3>
        <Grid>
          <Col span="full" spanLg={8}>
            <Block tone="brand">Hero: span 8 on lg</Block>
          </Col>
          <Col span="full" spanLg={4}>
            <Block>Sidebar: span 4 on lg</Block>
          </Col>
        </Grid>
      </PageContainer>

      <PageContainer>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Three column row (12 = 4 + 4 + 4)
        </h3>
        <Grid>
          <Col span="full" spanMd={4} spanLg={4}>
            <Block>1 / 3</Block>
          </Col>
          <Col span="full" spanMd={4} spanLg={4}>
            <Block>2 / 3</Block>
          </Col>
          <Col span="full" spanMd={8} spanLg={4}>
            <Block>3 / 3 (full row at md)</Block>
          </Col>
        </Grid>
      </PageContainer>

      <PageContainer>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Asymmetric (12 = 7 + 5, with explicit start)
        </h3>
        <Grid>
          <Col span="full" spanLg={7}>
            <Block tone="brand">Span 7</Block>
          </Col>
          <Col span="full" spanLg={5} startLg={8}>
            <Block>Span 5, start at column 8</Block>
          </Col>
        </Grid>
      </PageContainer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Column counts always add to the breakpoint total (4 / 8 / 12). When a row needs to lay out asymmetrically, set `startLg` (or `startMd`) explicitly.",
      },
    },
  },
};

export const OverlapPattern: Story = {
  name: "4 · Overlap Pattern",
  render: () => (
    <div className="bg-background py-12">
      <PageContainer className="relative">
        <GridOverlay />
        <div className="relative z-10">
          <StoryCheatSheet
            kicker="Overlap pattern"
            title="Overlap is a recipe, not a vibe"
            intro={
              <>
                Overlap should be intentional and reproducible. The grid gives
                you the tools to overlap while keeping reading order and
                accessibility intact.
              </>
            }
            leftTitle="The overlap recipe"
            leftBody={
              <div className="space-y-2">
                <p>
                  1) Make both items share a row with{" "}
                  <span className="font-mono">rowStart</span>
                </p>
                <p>
                  2) Place the card with{" "}
                  <span className="font-mono">startMd/startLg</span>
                </p>
                <p>
                  3) Displace with{" "}
                  <span className="font-mono">offsetYMd/offsetYLg</span>
                </p>
                <p>
                  4) Ensure stacking with <span className="font-mono">raised</span>
                </p>
              </div>
            }
            rightTitle="Safety rails"
            rightBody={
              <>
                <p>
                  Keep mobile stacked (reading order wins). Overlap turns on at{" "}
                  <span className="font-mono">md</span> and above.
                </p>
                <p className="mt-2 text-muted-foreground">
                  If you need overlap, prefer using these props over negative
                  margins. Everything stays in the grid system.
                </p>
              </>
            }
          />
          <Grid alignStart>
            <Col span="full" spanMd={6} spanLg={8} rowStart={1}>
              <div className="aspect-[4/3] rounded-md bg-primary/80" />
            </Col>
            <Col
              span="full"
              spanMd={5}
              spanLg={4}
              startMd={4}
              startLg={9}
              rowStart={1}
              offsetYMd={1}
              offsetYLg={2}
              raised
              className="self-end border border-border bg-background p-4 shadow-lg"
            >
              <Block>Overlapping card</Block>
            </Col>
          </Grid>
        </div>
      </PageContainer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `rowStart`, `startMd/startLg`, `offsetY*`, and `raised` to compose intentional overlap. On mobile the card stacks below the hero; at `md` and above it crosses the column edge while the visual hierarchy stays readable.",
      },
    },
  },
};

export const ResponsiveBehavior: Story = {
  name: "5 · Responsive Behavior",
  render: () => {
    return (
      <div className="bg-background py-12">
        <PageContainer>
          <StoryCheatSheet
            kicker="Responsive behavior"
            title="Breakpoints vs column changes"
            intro={
              <>
                Tailwind has many breakpoints, but the grid only changes column
                count at two: <span className="font-mono">md</span> and{" "}
                <span className="font-mono">lg</span>.
              </>
            }
            leftTitle="What changes when"
            leftBody={
              <>
                <p>
                  <span className="font-semibold">Columns</span>: 4 (base) → 8
                  (md) → 12 (lg)
                </p>
                <p className="mt-2 text-muted-foreground">
                  <span className="font-semibold text-foreground">Spacing</span>:
                  padding 16 · 24 · 24 · 48 and gutter 16 · 20 · 24 · 24 at
                  base · md · lg · xl. The track count does not change at xl.
                </p>
              </>
            }
            rightTitle="How to use this"
            rightBody={
              <>
                <p>
                  Use <span className="font-mono">span</span> for mobile,{" "}
                  <span className="font-mono">spanMd</span> for tablet,{" "}
                  <span className="font-mono">spanLg</span> for desktop.
                </p>
                <p className="mt-2 text-muted-foreground">
                  If a component needs responsive logic inside a column, prefer{" "}
                  <span className="font-mono">@container</span> queries over
                  viewport breakpoints.
                </p>
              </>
            }
          />
          <ActiveBreakpoint />
          <p className="mt-4 text-sm text-muted-foreground">
            Resize the canvas. The badge above updates from <code>base</code>{" "}
            (&lt;640) → <code>sm</code> (640) → <code>md</code> (768) →{" "}
            <code>lg</code> (1024) → <code>xl</code> (1280). The 4 / 8 / 12 grid
            changes column count at <code>md</code> and <code>lg</code>; its
            padding grows from 24 to 48 at <code>xl</code>. Rail layouts add
            their right rail at <code>md</code> and left rail at{" "}
            <code>rail</code> (1140, 240 wide), widening it at{" "}
            <code>rail-full</code> (1200, 300 wide). <code>2xl</code> is retired.
          </p>
        </PageContainer>
      </div>
    );
  },
};

export const FixedColumnOverride: Story = {
  name: "6 · Fixed Column Override",
  render: () => (
    <div className="bg-background py-12">
      <PageContainer>
        <StoryCheatSheet
          kicker="Explicit override"
          title="One count means the same count everywhere"
          intro={
            <>
              The default page grid remains 4 / 8 / 12. Pass one supported
              number only when the layout intentionally needs a fixed track
              count from mobile through desktop.
            </>
          }
          leftTitle="Contract"
          leftBody={
            <>
              <span className="font-mono">columns={"{5}"}</span> produces five
              tracks at base, <span className="font-mono">md</span>, and{" "}
              <span className="font-mono">lg</span>.
            </>
          }
          rightTitle="Use sparingly"
          rightBody={
            <>
              Prefer the default grid or breakpoint object for page
              composition. Fixed counts are for bounded patterns whose content
              remains usable at the narrowest supported width.
            </>
          }
        />
        <Grid columns={5} data-grid-contract="fixed-five">
          {Array.from({ length: 5 }, (_, index) => (
            <Block key={index}>{index + 1}</Block>
          ))}
        </Grid>
      </PageContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector(
      '[data-grid-contract="fixed-five"]',
    );
    await expect(grid).not.toBeNull();
    await expect(grid!).toHaveClass(
      "grid-cols-5",
      "md:grid-cols-5",
      "lg:grid-cols-5",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A numeric `columns` override accepts only 1–12 and applies that exact count at base, `md`, and `lg`. Use the responsive object when the track count should change by breakpoint.",
      },
    },
  },
};

function ActiveBreakpoint() {
  const bp = useBreakpoint();
  const min = BREAKPOINTS[bp];
  return (
    <div className="inline-flex items-center gap-3 rounded-md border border-border bg-muted px-4 py-2">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Active breakpoint
      </span>
      <span className="rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
        {bp}
      </span>
      <span className="text-xs text-muted-foreground">≥ {min}px</span>
    </div>
  );
}


const specBreakpoints = [
  ["base", "0", "One column · padding 16", "One column"],
  ["sm", "640", "No column change (type and spacing only)", "No change"],
  ["md", "768", "Right rail joins · padding 24", "Panel insets 24 · one column"],
  ["lg", "1024", "No river change · filter rails may join", "Ad rail joins"],
  ["rail", "1140", "Left rail joins at 240", "No change"],
  ["rail-full", "1200", "Left rail widens to 300", "No change"],
  ["xl", "1280", "Padding 48", "Context rail joins · padding 48"],
  ["MX", "1360", "Content stops growing", "Panel stops growing"],
  ["2xl", "1536", "Retired", "Retired"],
] as const;

const specRiver = [
  ["390", "—", "358", "—"],
  ["768", "—", "404", "300"],
  ["1024", "—", "660", "300"],
  ["1139", "—", "775", "300"],
  ["1140", "240", "520", "300"],
  ["1199", "240", "579", "300"],
  ["1200", "300", "520", "300"],
  ["1279", "300", "599", "300"],
  ["1280", "300", "552", "300"],
  ["1440+", "300", "632", "300"],
] as const;

const specReader = [
  ["390", "—", "358", "—"],
  ["768", "—", "672", "—"],
  ["1024", "—", "612", "300"],
  ["1280", "300", "504", "300"],
  ["1440+", "300", "632", "300"],
] as const;

const specBlocks = [
  ["< 536", "1"],
  ["536", "2 · 2·260 + 16"],
  ["812", "3 · 3·260 + 2·16"],
  ["1088", "4 · 4·260 + 3·16"],
] as const;

function SpecTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: readonly (readonly string[])[] }) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{headers.map((h) => <th key={h} scope="col" className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-border last:border-b-0">
              {r.map((c, i) => <td key={i} className={`px-3 py-2 ${i === 0 ? "font-mono font-semibold" : "tabular-nums"}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const BreakpointsAndGridSpecs: Story = {
  name: "7 · Breakpoints & Grid Specs",
  render: () => (
    <div className="bg-background py-12">
      <PageContainer>
        <StoryCheatSheet
          kicker="UI-LAYOUT-001 · Rev C"
          title="Breakpoints and grid, measured"
          intro={
            <>
              Measured with Playwright in the running app at 320–1920. Breakpoints are min-width: 640 · 768 · 1024 · 1280, plus the rail-layout breakpoints 1140 and 1200; content capped at 1360.
              Tokens: <span className="font-mono">--layout-gap</span> 16, <span className="font-mono">--layout-rail</span> 300, <span className="font-mono">--layout-rail-compact</span> 240, <span className="font-mono">--width-content-max</span> 1360.
            </>
          }
          leftTitle="Pages"
          leftBody={<p>1 column → river + right rail at md → three columns at 1140 (left rail 240) → left rail 300 at 1200. Padding 16 · 24 · 48.</p>}
          rightTitle="Reader and blocks"
          rightBody={<p>Reader: ad rail at lg, context rail at xl. Block grids follow their container: 2 · 3 · 4 columns at 536 · 812 · 1088.</p>}
        />

        <div className="space-y-8">
          <SpecTable caption="Breakpoints" headers={["Breakpoint", "Min width", "Pages", "Reader"]} rows={specBreakpoints} />
          <div className="grid min-w-0 gap-6 lg:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Homepage river</p>
              <SpecTable caption="River columns" headers={["Window", "Left rail", "River", "Right rail"]} rows={specRiver} />
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Story reader</p>
              <SpecTable caption="Reader columns" headers={["Window", "Context", "Article", "Ad rail"]} rows={specReader} />
            </div>
          </div>
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Block grid (container query)</p>
            <SpecTable caption="Block grid columns" headers={["Block width", "Columns"]} rows={specBlocks} />
          </div>

          <figure className="min-w-0">
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <img
                data-layout-spec="drawing"
                src="specs/layout-drawing.svg"
                width={1700}
                height={1060}
                alt="Dimensional drawing UI-LAYOUT-001 revision B: breakpoint map, river and reader plans at each breakpoint, river width graph comparing revisions A and B, block grid container query, page container at 1920 and variable tables."
                className="block h-auto w-full min-w-[960px]"
              />
            </div>
            <figcaption className="mt-2 text-sm text-muted-foreground">
              Dimensional drawing · <a className="underline underline-offset-4" href="specs/layout-drawing.html" target="_blank" rel="noreferrer">open the full sheet with notes<span className="sr-only"> (opens in a new tab)</span></a>
            </figcaption>
          </figure>

          <figure className="min-w-0">
            <video
              data-layout-spec="film"
              src="specs/layout-film.mp4"
              poster="specs/layout-drawing.svg"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Motion film: a viewport grows from 320 to 1920 and pauses at each breakpoint while the river goes from one to two to three columns; then the reader, the block grid and the drawing sheet."
              className="block aspect-video w-full rounded-lg border border-border bg-white"
            />
            <figcaption className="mt-2 text-sm text-muted-foreground">Motion film · 66 s · river 0–24 s · reader 24–36 s · block grid 36–46 s · drawing tour 46–66 s.</figcaption>
          </figure>
        </div>
      </PageContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-layout-spec="drawing"]')).not.toBeNull();
    await expect(canvasElement.querySelector('[data-layout-spec="film"]')).not.toBeNull();
    await expect(canvasElement.querySelectorAll("table")).toHaveLength(4);
  },
  parameters: {
    docs: {
      description: {
        story: "Measured breakpoints and column widths for pages, the reader and block grids, with the UI-LAYOUT-001 dimensional drawing and motion film. The same specs live on the app's /specs/#layout page.",
      },
    },
  },
};
