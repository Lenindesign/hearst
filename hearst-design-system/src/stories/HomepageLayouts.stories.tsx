import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  LayoutCurator,
  LayoutMosaic,
  LayoutStream,
  LayoutEditorial,
  HomepageByLayout,
  HomepageByMode,
  EDITORIAL_MODES,
  type HomepageLayoutProps,
  type LayoutVariant,
  type EditorialMode,
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

// ─── Layout Stories ──────────────────────────────────────────

const meta: Meta<HomepageLayoutProps> = {
  title: "Templates/Homepage Layouts",
  args: defaultArgs,
  argTypes: sectionControls,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Homepage layouts are the **structural** templates; **editorial modes** (Live, Feature, Service) are the **behavioral** layer \u2014 section visibility, density, and defaults. " +
          "A brand *enters* a mode; it does not *own* one.\n\n" +
          "### Mode \u00d7 Layout (fit, not a cage)\n" +
          "Any mode can use any layout; the mode configures *what* shows and *how dense* it is, the layout arranges it. " +
          "Default / good / possible / poor:\n\n" +
          "| Mode | Curator | Mosaic | Stream | Editorial |\n" +
          "| --- | --- | --- | --- | --- |\n" +
          "| **Live** | \u2605 default | Good | Possible | Poor |\n" +
          "| **Feature** | Possible | Good | Poor | \u2605 default |\n" +
          "| **Service** | Poor | Good | \u2605 default | Poor |\n\n" +
          "Use **Mode: Live / Feature / Service** or **Editorial Modes** stories for presets, or these layouts for manual section controls.\n\n" +
          "### Layout templates (structure only)\n" +
          "**The Curator** \u2014 NYT-inspired editorial hierarchy (60/40 hero split, numbered top stories)\n" +
          "**The Mosaic** \u2014 Verge/TIME modular grid (bento hero, category tabs, content grid)\n" +
          "**The Stream** \u2014 Mobile-first engagement feed (single-column, alternating cards)\n" +
          "**The Editorial** \u2014 Magazine-style hero with stacked secondary cards\n\n" +
          "Use the **Editorial Modes** stories below to see how modes configure layouts automatically, " +
          "or use the individual layout stories with manual controls.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<HomepageLayoutProps>;

export const Curator: Story = {
  name: "Layout: Curator",
  render: (args) => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutCurator {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Best for: Live Mode** \u2014 NYT-inspired editorial hierarchy optimized for recency and scanning. " +
          "60/40 hero split, numbered top stories, thematic content rows, trending chips. " +
          "Use this layout when the editorial goal is high information density and rapid story triage. " +
          "Brands: Esquire (M\u2013F), Cosmopolitan, Elle, Harper\u2019s Bazaar.",
      },
    },
  },
};

export const Mosaic: Story = {
  name: "Layout: Mosaic",
  render: (args) => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutMosaic {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Serves: Live + Feature + Service** \u2014 The most versatile layout. " +
          "Bento grid hero, category filter tabs, 3-column content grid, editor\u2019s picks carousel. " +
          "In Live Mode: dense grid, more cards. In Feature Mode: fewer, larger cards. In Service Mode: category tabs front and center. " +
          "Brands: Elle, Harper\u2019s Bazaar, House Beautiful, Veranda, Delish.",
      },
    },
  },
};

export const Stream: Story = {
  name: "Layout: Stream",
  render: (args) => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutStream {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Best for: Service Mode** \u2014 Mobile-first feed optimized for task completion and structured browsing. " +
          "Sticky compact nav, alternating card formats, quick links bar, shopping carousel, video spotlight. " +
          "Use this layout when users arrive with a specific goal. " +
          "Brands: Good Housekeeping, Delish, Prevention, Women\u2019s Health, Best Products.",
      },
    },
  },
};

export const Editorial: Story = {
  name: "Layout: Editorial",
  render: (args) => (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <LayoutEditorial {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Best for: Feature Mode** \u2014 Magazine-style layout optimized for storytelling and visual immersion. " +
          "Dominant 4:5 portrait hero, stacked secondary cards, reduced ad density, prominent newsletter. " +
          "Use this layout for weekend editions, editorial showcases, or when the goal is deep engagement. " +
          "Brands: Cosmopolitan, Elle, Harper\u2019s Bazaar, Town & Country, Esquire (weekends).",
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
  } as Story["argTypes"],
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
          "Compare all four layout templates from a single story. " +
          "Combine with the brand switcher in the toolbar to evaluate layout \u00d7 brand combinations.",
      },
    },
  },
};

// ─── Editorial Mode Stories ──────────────────────────────────

export const LiveMode: Story = {
  name: "Mode: Live",
  args: EDITORIAL_MODES.live.presets as HomepageLayoutProps,
  render: (args) => {
    return (
      <div style={{ margin: "-2rem", minHeight: "100vh" }}>
        <HomepageByMode mode="live" {...args} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Live Mode \u2014 \u201CWhat\u2019s happening now\u201D**\n\n" +
          "Recency \u00b7 Density \u00b7 Scanning\n\n" +
          "High story count (7 top stories), prominent trending bar, frequent ad slots, " +
          "no inline newsletter (sticky CTA instead). Newsletter is suppressed to maximize " +
          "content density. Default layout: **Curator**.\n\n" +
          "Use for: Weekday mornings, breaking news cycles, real-time editorial coverage.\n\n" +
          "Example schedule: Esquire M\u2013F, Cosmopolitan during awards season.",
      },
    },
  },
};

export const FeatureMode: Story = {
  name: "Mode: Feature",
  args: EDITORIAL_MODES.feature.presets as HomepageLayoutProps,
  render: (args) => {
    return (
      <div style={{ margin: "-2rem", minHeight: "100vh" }}>
        <HomepageByMode mode="feature" {...args} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Feature Mode \u2014 \u201CStories worth your time\u201D**\n\n" +
          "Storytelling \u00b7 Visual \u00b7 Immersive\n\n" +
          "Fewer stories (3 top stories), no leaderboard ad, no trending bar, " +
          "prominent newsletter, video spotlight enabled. Reduced density lets " +
          "hero imagery and longform content breathe. Default layout: **Editorial**.\n\n" +
          "Use for: Weekend editions, editorial showcases, magazine-style brand moments.\n\n" +
          "Example schedule: Esquire Sat/Sun, Elle during Fashion Week, Harper\u2019s Bazaar always.",
      },
    },
  },
};

export const ServiceMode: Story = {
  name: "Mode: Service",
  args: EDITORIAL_MODES.service.presets as HomepageLayoutProps,
  render: (args) => {
    return (
      <div style={{ margin: "-2rem", minHeight: "100vh" }}>
        <HomepageByMode mode="service" {...args} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Service Mode \u2014 \u201CFind what you need\u201D**\n\n" +
          "Task \u00b7 Search \u00b7 Structured\n\n" +
          "Shopping carousel enabled, high thematic row count (6), more editor\u2019s picks (8), " +
          "no big story feed (replaced by structured categories). Newsletter uses compact " +
          "card variant. Default layout: **Stream**.\n\n" +
          "Use for: Product-driven brands, recipe sites, goal-oriented user journeys.\n\n" +
          "Example schedule: Good Housekeeping always, Delish always, Best Products always.",
      },
    },
  },
};

export const ModeSwitcher: Story = {
  name: "Mode Switcher",
  args: { ...defaultArgs },
  argTypes: {
    ...sectionControls,
    mode: {
      control: { type: "select" },
      options: ["live", "feature", "service"],
      description: "Editorial mode — the 'job to be done' for this homepage state.",
      table: { category: "Editorial Mode" },
    },
    layoutOverride: {
      control: { type: "select" },
      options: ["", "curator", "mosaic", "stream", "editorial"],
      description: "Override the mode's default layout (blank = use mode default).",
      table: { category: "Editorial Mode" },
    },
  } as Story["argTypes"],
  render: (args) => {
    const {
      mode: _mode,
      layoutOverride: _layoutOverride,
      ...propOverrides
    } = args as HomepageLayoutProps & {
      mode?: EditorialMode;
      layoutOverride?: LayoutVariant | "";
    };
    const mode = _mode || "live";
    const layoutOverride = _layoutOverride || undefined;
    return (
      <div style={{ margin: "-2rem", minHeight: "100vh" }}>
        <HomepageByMode
          mode={mode}
          layoutOverride={layoutOverride}
          {...propOverrides}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "**The full editorial modes playground.** Select a mode to apply its behavioral presets, " +
          "then optionally override the layout. The mode configures *what* sections appear and *how dense* " +
          "the content is; the layout determines *how* it\u2019s arranged. " +
          "Combine with the brand switcher to test real scenarios like \u201CEsquire in Live Mode on a Tuesday\u201D " +
          "vs. \u201CEsquire in Feature Mode on a Saturday.\u201D\n\n" +
          "| Mode | Default Layout | Key Behavior |\n" +
          "| --- | --- | --- |\n" +
          "| Live | Curator | 7 stories, trending bar, no newsletter, sticky CTA |\n" +
          "| Feature | Editorial | 3 stories, no ads, newsletter prominent, video on |\n" +
          "| Service | Stream | Shopping on, 6 thematic rows, 8 picks, no big feed |",
      },
    },
  },
};
