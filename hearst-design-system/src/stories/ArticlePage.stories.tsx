import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  ArticleEditorialFeatureTemplate,
  ArticleImmersiveTemplate,
  ArticlePageTemplate,
  type ArticlePageTemplateProps,
} from "@/components/article-page";
import { useTheme } from "@/components/theme-provider";
import { VisualInspector } from "@/components/visual-inspector";
import {
  AUTOWEEK_EDITORIAL_ARTICLE,
  BEST_PRODUCTS_EDITORIAL_ARTICLE,
  BIOGRAPHY_EDITORIAL_ARTICLE,
  BICYCLING_EDITORIAL_ARTICLE,
  BRAND_ARTICLES,
  CAR_AND_DRIVER_EDITORIAL_ARTICLE,
  COUNTRY_LIVING_EDITORIAL_ARTICLE,
  COSMOPOLITAN_EDITORIAL_ARTICLE,
  COSMOPOLITAN_IMMERSIVE_ARTICLE,
  DELISH_EDITORIAL_ARTICLE,
  ELLE_DECOR_EDITORIAL_ARTICLE,
  ELLE_EDITORIAL_ARTICLE,
  ESQUIRE_EDITORIAL_ARTICLE,
  GOOD_HOUSEKEEPING_EDITORIAL_ARTICLE,
  HARPERS_BAZAAR_EDITORIAL_ARTICLE,
  HOUSE_BEAUTIFUL_EDITORIAL_ARTICLE,
  MENS_HEALTH_EDITORIAL_ARTICLE,
  OPRAH_DAILY_EDITORIAL_ARTICLE,
  POPULAR_MECHANICS_EDITORIAL_ARTICLE,
  PREVENTION_EDITORIAL_ARTICLE,
  REDBOOK_EDITORIAL_ARTICLE,
  ROAD_AND_TRACK_EDITORIAL_ARTICLE,
  RUNNERS_WORLD_EDITORIAL_ARTICLE,
  SEVENTEEN_EDITORIAL_ARTICLE,
  THE_PIONEER_WOMAN_EDITORIAL_ARTICLE,
  TOWN_AND_COUNTRY_EDITORIAL_ARTICLE,
  VERANDA_EDITORIAL_ARTICLE,
  WOMANS_DAY_EDITORIAL_ARTICLE,
  WOMENS_HEALTH_EDITORIAL_ARTICLE,
} from "./article-data";

const EDITORIAL_ARTICLES = {
  autoweek: AUTOWEEK_EDITORIAL_ARTICLE,
  "best-products": BEST_PRODUCTS_EDITORIAL_ARTICLE,
  biography: BIOGRAPHY_EDITORIAL_ARTICLE,
  bicycling: BICYCLING_EDITORIAL_ARTICLE,
  cosmopolitan: COSMOPOLITAN_EDITORIAL_ARTICLE,
  "car-and-driver": CAR_AND_DRIVER_EDITORIAL_ARTICLE,
  "country-living": COUNTRY_LIVING_EDITORIAL_ARTICLE,
  delish: DELISH_EDITORIAL_ARTICLE,
  "elle-decor": ELLE_DECOR_EDITORIAL_ARTICLE,
  elle: ELLE_EDITORIAL_ARTICLE,
  esquire: ESQUIRE_EDITORIAL_ARTICLE,
  "good-housekeeping": GOOD_HOUSEKEEPING_EDITORIAL_ARTICLE,
  "harpers-bazaar": HARPERS_BAZAAR_EDITORIAL_ARTICLE,
  "house-beautiful": HOUSE_BEAUTIFUL_EDITORIAL_ARTICLE,
  "mens-health": MENS_HEALTH_EDITORIAL_ARTICLE,
  "oprah-daily": OPRAH_DAILY_EDITORIAL_ARTICLE,
  "popular-mechanics": POPULAR_MECHANICS_EDITORIAL_ARTICLE,
  prevention: PREVENTION_EDITORIAL_ARTICLE,
  redbook: REDBOOK_EDITORIAL_ARTICLE,
  "road-and-track": ROAD_AND_TRACK_EDITORIAL_ARTICLE,
  "runners-world": RUNNERS_WORLD_EDITORIAL_ARTICLE,
  seventeen: SEVENTEEN_EDITORIAL_ARTICLE,
  "the-pioneer-woman": THE_PIONEER_WOMAN_EDITORIAL_ARTICLE,
  "town-and-country": TOWN_AND_COUNTRY_EDITORIAL_ARTICLE,
  veranda: VERANDA_EDITORIAL_ARTICLE,
  "womans-day": WOMANS_DAY_EDITORIAL_ARTICLE,
  "womens-health": WOMENS_HEALTH_EDITORIAL_ARTICLE,
};

function BrandArticlePage(props: Pick<ArticlePageTemplateProps, "showGridOverlay">) {
  const { brand } = useTheme();
  const data = BRAND_ARTICLES[brand.slug] ?? BRAND_ARTICLES["cosmopolitan"];
  return <ArticlePageTemplate content={data.content} showGridOverlay={props.showGridOverlay} />;
}

function ImmersiveArticlePage(props: Pick<ArticlePageTemplateProps, "showGridOverlay">) {
  return (
    <ArticleImmersiveTemplate
      content={COSMOPOLITAN_IMMERSIVE_ARTICLE}
      showGridOverlay={props.showGridOverlay}
    />
  );
}

function BrandEditorialArticlePage(props: Pick<ArticlePageTemplateProps, "showGridOverlay">) {
  const { brand } = useTheme();
  const content =
    EDITORIAL_ARTICLES[brand.slug as keyof typeof EDITORIAL_ARTICLES] ??
    COSMOPOLITAN_EDITORIAL_ARTICLE;

  return (
    <ArticleEditorialFeatureTemplate
      content={content}
      showGridOverlay={props.showGridOverlay}
    />
  );
}

/**
 * Fullscreen stories often hide the add-ons bar, so **Controls** (and any boolean
 * there) is easy to miss. This floating control always toggles the Hearst
 * `GridOverlay` (not Storybook’s toolbar grid icon).
 */
function ArticlePageStoryFrame({
  showGridInitially = true,
}: {
  showGridInitially?: boolean;
}) {
  const [showGrid, setShowGrid] = useState(showGridInitially);

  return (
    <>
      <button
        type="button"
        title="Toggle Hearst 4/8/12 column guides (visible from sm breakpoint up)"
        aria-pressed={showGrid}
        onClick={() => setShowGrid((v) => !v)}
        className="fixed bottom-4 right-4 z-[2147483647] rounded-md border border-border bg-background/95 px-3 py-2 text-left text-xs font-semibold text-foreground shadow-md backdrop-blur-sm hover:bg-muted"
      >
        Hearst column guide:{" "}
        <span className={showGrid ? "text-primary" : "text-muted-foreground"}>
          {showGrid ? "On" : "Off"}
        </span>
      </button>
      <div style={{ margin: "-2rem", minHeight: "100vh" }}>
        <BrandArticlePage showGridOverlay={showGrid} />
      </div>
    </>
  );
}

function ImmersiveArticleStoryFrame({
  showGridInitially = false,
}: {
  showGridInitially?: boolean;
}) {
  const [showGrid, setShowGrid] = useState(showGridInitially);

  return (
    <>
      <button
        type="button"
        title="Toggle Hearst 4/8/12 column guides (visible from sm breakpoint up)"
        aria-pressed={showGrid}
        onClick={() => setShowGrid((v) => !v)}
        className="fixed bottom-4 right-4 z-[2147483647] rounded-md border border-border bg-background/95 px-3 py-2 text-left text-xs font-semibold text-foreground shadow-md backdrop-blur-sm hover:bg-muted"
      >
        Hearst column guide:{" "}
        <span className={showGrid ? "text-primary" : "text-muted-foreground"}>
          {showGrid ? "On" : "Off"}
        </span>
      </button>
      <div style={{ margin: "-2rem", minHeight: "100vh" }}>
        <ImmersiveArticlePage showGridOverlay={showGrid} />
      </div>
    </>
  );
}

function BrandEditorialArticleStoryFrame({
  showGridInitially = false,
}: {
  showGridInitially?: boolean;
}) {
  const [showGrid, setShowGrid] = useState(showGridInitially);

  return (
    <>
      <button
        type="button"
        title="Toggle Hearst 4/8/12 column guides (visible from sm breakpoint up)"
        aria-pressed={showGrid}
        onClick={() => setShowGrid((v) => !v)}
        className="fixed bottom-4 right-4 z-[2147483647] rounded-md border border-border bg-background/95 px-3 py-2 text-left text-xs font-semibold text-foreground shadow-md backdrop-blur-sm hover:bg-muted"
      >
        Hearst column guide:{" "}
        <span className={showGrid ? "text-primary" : "text-muted-foreground"}>
          {showGrid ? "On" : "Off"}
        </span>
      </button>
      <div style={{ margin: "-2rem", minHeight: "100vh" }}>
        <BrandEditorialArticlePage showGridOverlay={showGrid} />
      </div>
    </>
  );
}

const meta: Meta = {
  title: "Templates/Article Page",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-page article template with brand-specific content. Each brand shows contextual articles with real Hearst CDN images, headlines, and sidebar items. Switch brands via the toolbar to see Car and Driver show auto news, Delish show recipes, Elle show fashion, etc.\n\n**Hearst column guide:** use the floating **Hearst column guide: On/Off** control (bottom-right of the canvas). The tinted tracks span the **utility bar, main nav, leaderboard, and article** (one `PageContainer`) from the **`sm`** breakpoint up. The toolbar **grid** icon next to the brand picker is Storybook’s own layout tool, not this overlay. Press **A** to show Storybook add-ons (e.g. **Controls**).",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Full Page",
  render: () => <ArticlePageStoryFrame showGridInitially />,
};

export const WithGridOverlay: Story = {
  name: "With Grid Overlay",
  render: () => <ArticlePageStoryFrame showGridInitially />,
  parameters: {
    docs: {
      description: {
        story:
          "Same as **Full Page** here — the canvas toggle starts with the guide on. Compare with **Templates / Home Page → Overlap Grid**. Use a **tablet or desktop** viewport (`sm+`) so `GridOverlay` is not hidden.",
      },
    },
  },
};

export const ImmersiveFeature: Story = {
  name: "Immersive Feature",
  render: () => <ImmersiveArticleStoryFrame />,
  parameters: {
    docs: {
      description: {
        story:
          "Premium portrait-led article template inspired by the referenced Cosmopolitan profile structure. It keeps the article shell brandable while adding a full-bleed hero, visual chapters, story spine, media pair, interview body, newsletter, and related articles.",
      },
    },
  },
};

export const BrandEditorialVariants: Story = {
  name: "Brand Editorial Variants",
  render: () => <BrandEditorialArticleStoryFrame />,
  parameters: {
    docs: {
      description: {
        story:
          "Brand-contextual editorial feature variants. Switch brands with the toolbar to compare the adaptive layouts for Car and Driver, ELLE, Bicycling, Country Living, Delish, Esquire, and Cosmopolitan.",
      },
    },
  },
};

export const WithInspector: Story = {
  name: "Visual Inspector",
  render: () => (
    <VisualInspector>
      <ArticlePageStoryFrame showGridInitially />
    </VisualInspector>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Visual inspector plus the **Hearst column guide** toggle (bottom-right). Toggle the guide off if it obscures inspection.",
      },
    },
  },
};
