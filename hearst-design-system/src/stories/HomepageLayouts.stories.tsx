import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  LayoutCurator,
  LayoutMosaic,
  LayoutStream,
  LayoutEditorial,
} from "@/components/homepage-layouts";

const meta: Meta = {
  title: "Templates/Homepage Layouts",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Four homepage layout variants optimized for different brand types. " +
          "**The Curator** (NYT-inspired) uses strong editorial hierarchy with a 60/40 hero split. " +
          "**The Mosaic** (Verge/TIME-inspired) uses a bento grid hero with category tabs. " +
          "**The Stream** (mobile-first) uses a single-column feed with alternating card formats. " +
          "**The Editorial** (magazine-style) uses a dominant hero with stacked secondary cards. " +
          "Switch brands via the toolbar to see how each layout adapts to brand tokens.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Curator: Story = {
  name: "A: The Curator",
  render: () => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutCurator />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "NYT-inspired editorial hierarchy. Best for news-forward brands like Esquire, Cosmopolitan, Elle, and Harper's Bazaar. " +
          "Features a 60/40 hero split, numbered top stories, thematic content rows, inline newsletter, trending chips bar, and a sticky bottom newsletter CTA.",
      },
    },
  },
};

export const Mosaic: Story = {
  name: "B: The Mosaic",
  render: () => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutMosaic />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Verge/TIME-inspired modular grid. Best for visual-first brands like Elle, Harper's Bazaar, House Beautiful, Veranda, and Delish. " +
          "Features a bento grid hero (2x2 + 1x2 + 2x 1x1), category filter tabs, 3-column content grid, editor's picks carousel, split newsletter module, and load-more pagination.",
      },
    },
  },
};

export const Stream: Story = {
  name: "C: The Stream",
  render: () => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutStream />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mobile-first engagement feed. Best for lifestyle/utility brands like Good Housekeeping, Delish, Prevention, Women's Health, and Men's Health. " +
          "Features a sticky compact nav, full-viewport hero, alternating stream cards (image-right, overlay, text-only, newsletter, native ad), " +
          "quick links bar, video spotlight, shopping carousel, and a floating subscribe CTA.",
      },
    },
  },
};

export const Editorial: Story = {
  name: "D: The Editorial",
  render: () => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutEditorial />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Magazine-style hero with stacked secondary cards. Best for editorial-forward brands like Cosmopolitan, Elle, Harper's Bazaar, and Town & Country. " +
          "Features a dominant 4:5 portrait hero on the left with eyebrow, headline, description, and byline, " +
          "paired with two stacked article cards on the right, each with a landscape image and metadata. " +
          "Below the fold includes a thematic content row, inline newsletter, trending bar, and big story feed.",
      },
    },
  },
};
