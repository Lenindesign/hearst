import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  LayoutCurator,
  LayoutMosaic,
  LayoutStream,
  LayoutEditorial,
  HomepageByLayout,
  type HomepageLayoutProps,
  type LayoutVariant,
} from "@/components/homepage-layouts";

const sectionControls = {
  showUtilityBar: {
    control: "boolean",
    description: "Show the top utility bar (Shop / Newsletter / Sign In).",
    table: { category: "Sections" },
  },
  showLeaderboardAd: {
    control: "boolean",
    description: "Show the leaderboard ad above the nav.",
    table: { category: "Sections" },
  },
  showNewsletter: {
    control: "boolean",
    description: "Show the inline newsletter module.",
    table: { category: "Sections" },
  },
  showTrendingBar: {
    control: "boolean",
    description: "Show the trending topics chip bar.",
    table: { category: "Sections" },
  },
  showBigStoryFeed: {
    control: "boolean",
    description: 'Show the "More Stories" stacked feed.',
    table: { category: "Sections" },
  },
  showFooter: {
    control: "boolean",
    description: "Show the site footer.",
    table: { category: "Sections" },
  },
  showStickyNewsletter: {
    control: "boolean",
    description: "Show the sticky/floating newsletter CTA.",
    table: { category: "Sections" },
  },
  showMidPageAd: {
    control: "boolean",
    description: "Show the mid-page billboard ad slot.",
    table: { category: "Sections" },
  },
  showShoppingCarousel: {
    control: "boolean",
    description: "Show the shopping carousel (Stream only).",
    table: { category: "Sections" },
  },
  showVideoSpotlight: {
    control: "boolean",
    description: "Show the video spotlight section (Stream only).",
    table: { category: "Sections" },
  },
  topStoriesCount: {
    control: { type: "range", min: 1, max: 10, step: 1 },
    description: "Number of stories in the hero sidebar.",
    table: { category: "Content Density" },
  },
  thematicRowCount: {
    control: { type: "range", min: 2, max: 6, step: 1 },
    description: "Number of items per thematic content row.",
    table: { category: "Content Density" },
  },
  editorPicksCount: {
    control: { type: "range", min: 2, max: 8, step: 1 },
    description: "Number of editor's picks in carousel (Mosaic).",
    table: { category: "Content Density" },
  },
  heroTitle: {
    control: "text",
    description: "Override the hero headline (blank = use brand default).",
    table: { category: "Content Override" },
  },
  heroEyebrow: {
    control: "text",
    description: "Override the hero eyebrow label.",
    table: { category: "Content Override" },
  },
  heroAuthor: {
    control: "text",
    description: "Override the hero byline.",
    table: { category: "Content Override" },
  },
  collectionTitle: {
    control: "text",
    description: 'Override the collection section heading (e.g. "Editor\'s Picks").',
    table: { category: "Content Override" },
  },
  newsletterVariant: {
    control: { type: "inline-radio" },
    options: ["full-width", "card"],
    description: "Newsletter module style.",
    table: { category: "Appearance" },
  },
} as const;

const defaultArgs: HomepageLayoutProps = {
  showUtilityBar: true,
  showLeaderboardAd: true,
  showNewsletter: true,
  showTrendingBar: true,
  showBigStoryFeed: true,
  showFooter: true,
  showStickyNewsletter: true,
  showMidPageAd: true,
  showShoppingCarousel: true,
  showVideoSpotlight: true,
  topStoriesCount: 5,
  thematicRowCount: 4,
  editorPicksCount: 5,
  heroTitle: "",
  heroEyebrow: "",
  heroAuthor: "",
  collectionTitle: "",
  newsletterVariant: "full-width",
};

const meta: Meta<HomepageLayoutProps> = {
  title: "Templates/Homepage Layouts",
  args: defaultArgs,
  argTypes: sectionControls,
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
          "Switch brands via the toolbar to see how each layout adapts to brand tokens. " +
          "Use the controls panel to toggle sections, adjust content density, and override headline text.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<HomepageLayoutProps>;

export const Curator: Story = {
  name: "A: The Curator",
  render: (args) => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutCurator {...args} />
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
  render: (args) => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutMosaic {...args} />
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
  render: (args) => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutStream {...args} />
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
  render: (args) => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutEditorial {...args} />
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

export const AllLayouts: Story = {
  name: "Layout Switcher",
  args: { ...defaultArgs },
  argTypes: {
    ...sectionControls,
    layout: {
      control: { type: "select" },
      options: ["curator", "mosaic", "stream", "editorial"],
      description: "Choose which homepage layout variant to render.",
      table: { category: "Layout" },
    },
  },
  render: (args) => {
    const { layout: _layout, ...layoutProps } = args as HomepageLayoutProps & {
      layout?: LayoutVariant;
    };
    const variant = _layout || "curator";
    return (
      <div style={{ margin: "-2rem", minHeight: "100vh" }}>
        <HomepageByLayout layout={variant} {...layoutProps} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Compare all four layout variants from a single story using the Layout control. " +
          "Combine with the brand switcher in the toolbar to evaluate layout x brand combinations.",
      },
    },
  },
};
