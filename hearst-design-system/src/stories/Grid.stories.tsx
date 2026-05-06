import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  BREAKPOINTS,
  Col,
  Grid,
  GridOverlay,
  PageContainer,
  useBreakpoint,
} from "@/components/ui/grid";

const meta: Meta = {
  title: "Foundation/Grid System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The grid is the spatial contract every page obeys. Use the Storybook viewport toolbar to step through `mobile1` (320), `mobile2` (414), `tablet` (768), and the default desktop viewport. The blue tinted columns are the grid overlay; gray boxes are content placeholders.",
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

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {leftTitle}
          </p>
          <div className="mt-2 text-sm text-foreground">{leftBody}</div>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-4">
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
  name: "1 · Anatomy",
  render: () => (
    <div className="bg-background py-12">
      <PageContainer className="relative">
        <GridOverlay hideOnMobile={false} />
        <div className="relative z-10">
          <StoryCheatSheet
            kicker="Grid Anatomy (4 / 8 / 12)"
            title="How to read what’s on screen"
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
                  At each breakpoint, a row should{" "}
                  <span className="font-semibold">sum to the column total</span>
                  : 4 (mobile), 8 (md), 12 (lg).
                </p>
                <p className="mt-2 text-muted-foreground">
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
                    Full-bleed section
                  </p>
                  <pre className="mt-1 overflow-x-auto rounded-md border border-border bg-background p-2 text-[11px] leading-relaxed text-foreground">
                    <code>{`<Col span="full">...</Col>`}</code>
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Two-up (50/50)</p>
                  <pre className="mt-1 overflow-x-auto rounded-md border border-border bg-background p-2 text-[11px] leading-relaxed text-foreground">
                    <code>{`<Col span={2} spanMd={4} spanLg={6}>Left</Col>
<Col span={2} spanMd={4} spanLg={6}>Right</Col>`}</code>
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Three cards (stack → 3-up)
                  </p>
                  <pre className="mt-1 overflow-x-auto rounded-md border border-border bg-background p-2 text-[11px] leading-relaxed text-foreground">
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
              <Block tone="brand">Full bleed (col-span-full)</Block>
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
            "This page is the **mental model** for the Hearst grid.",
            "",
            "### What you’re looking at",
            "- **`PageContainer`**: applies the outer padding (page margins) and caps content at `--width-content-max`.",
            "- **`GridOverlay`** (blue tint): shows the actual column tracks at the current breakpoint.",
            "- **`Grid`**: the column system itself (4 / 8 / 12).",
            "- **`Col`**: a single “slot” on the grid; its span changes per breakpoint via `span`, `spanMd`, `spanLg`.",
            "",
            "### The one rule that prevents chaos",
            "At each breakpoint, a row should **sum to the column count**:",
            "- mobile: **4** columns total",
            "- tablet (`md` ≥ 768): **8** columns total",
            "- desktop (`lg` ≥ 1024): **12** columns total",
            "",
            "### Practical examples (copy/paste patterns)",
            "**Full-bleed section** (always):",
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

export const PlacementRules: Story = {
  name: "2 · Placement Rules",
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
                Mobile is always <span className="font-mono">span="full"</span>{" "}
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
            <Block tone="brand">Hero — span 8 on lg</Block>
          </Col>
          <Col span="full" spanLg={4}>
            <Block>Sidebar — span 4 on lg</Block>
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
  name: "3 · Overlap Pattern",
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
                  margins—everything stays in the grid system.
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
  name: "4 · Responsive Behavior",
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
                  <span className="font-semibold text-foreground">Spacing</span>{" "}
                  (outer padding + gutter) can still change at other breakpoints
                  via tokens, but the track count stays the same.
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
            Resize the canvas — the badge above updates from <code>base</code>{" "}
            (&lt;640) → <code>sm</code> (640) → <code>md</code> (768) →{" "}
            <code>lg</code> (1024) → <code>xl</code> (1280) → <code>2xl</code>{" "}
            (1536). The grid only changes column count at <code>md</code> and{" "}
            <code>lg</code>.
          </p>
        </PageContainer>
      </div>
    );
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
