import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  HomePageTemplate,
  type HomePageTemplateProps,
} from "@/components/home-page";
import { VisualInspector } from "@/components/visual-inspector";

function HomePageWrapper(props: HomePageTemplateProps) {
  return (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <HomePageTemplate {...props} />
    </div>
  );
}

const meta: Meta = {
  title: "Templates/Home Page",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-page brand home page template. Switch brands via the toolbar to see how the same layout adapts to each brand's colors, fonts, and tokens. The responsive examples use Tailwind's default breakpoint prefixes: base/mobile, `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), and `2xl` (1536px).",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Full Page",
  render: () => <HomePageWrapper />,
};

export const WithInspector: Story = {
  name: "Visual Inspector",
  render: () => (
    <VisualInspector>
      <HomePageWrapper />
    </VisualInspector>
  ),
};

export const OverlapGrid: Story = {
  name: "Overlap Grid",
  render: () => (
    <HomePageWrapper layout="overlapGrid" showGridOverlay />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Uses Tailwind breakpoint utilities to move from a 4-column mobile grid to 8 columns at `md` and 12 columns at `lg`. The collection module intentionally overlaps the hero at tablet and desktop sizes so the grid behavior is visible.",
      },
    },
  },
};

export const BreakpointSamples: Story = {
  name: "Breakpoint Guide",
  render: () => (
    <HomePageWrapper layout="overlapGrid" showGridOverlay />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use the Storybook viewport toolbar to test this story at mobile, tablet, and desktop widths. Tailwind breakpoints are viewport-based, so nested fixed-width frames do not trigger `md` or `lg` behavior reliably.",
      },
    },
  },
};

export const MobileBreakpoint: Story = {
  name: "Breakpoint: Mobile",
  render: () => <HomePageWrapper layout="overlapGrid" showGridOverlay />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Mobile uses the base 4-column grid. Modules stack vertically and the overlap is removed so the reading order stays clear.",
      },
    },
  },
};

export const TabletBreakpoint: Story = {
  name: "Breakpoint: Tablet",
  render: () => <HomePageWrapper layout="overlapGrid" showGridOverlay />,
  parameters: {
    viewport: { defaultViewport: "tablet" },
    docs: {
      description: {
        story:
          "`md` switches to an 8-column grid and lets the collection card overlap the lower-right side of the hero.",
      },
    },
  },
};

export const DesktopBreakpoint: Story = {
  name: "Breakpoint: Desktop",
  render: () => <HomePageWrapper layout="overlapGrid" showGridOverlay />,
  parameters: {
    docs: {
      description: {
        story:
          "`lg` and wider use a 12-column grid: hero spans 7 columns, the collection card overlaps columns 7-9, and the right rail starts at column 10.",
      },
    },
  },
};
