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

// ─── Stories ────────────────────────────────────────────────────────────────

export const Anatomy: Story = {
  name: "1 · Anatomy",
  render: () => (
    <div className="bg-background py-12">
      <PageContainer className="relative">
        <GridOverlay hideOnMobile={false} />
        <div className="relative z-10">
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
          "The default grid: 4 columns on mobile, 8 at `md` (768px), 12 at `lg` (1024px). Use the viewport toolbar to switch sizes. The grid overlay is always shown here so the structure is visible.",
      },
    },
  },
};

export const PlacementRules: Story = {
  name: "2 · Placement Rules",
  render: () => (
    <div className="bg-background py-12 space-y-12">
      <PageContainer>
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
