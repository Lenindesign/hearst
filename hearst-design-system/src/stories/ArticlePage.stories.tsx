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
  BICYCLING_EDITORIAL_ARTICLE,
  BRAND_ARTICLES,
  CAR_AND_DRIVER_EDITORIAL_ARTICLE,
  COUNTRY_LIVING_EDITORIAL_ARTICLE,
  COSMOPOLITAN_EDITORIAL_ARTICLE,
  COSMOPOLITAN_IMMERSIVE_ARTICLE,
  DELISH_EDITORIAL_ARTICLE,
  ELLE_EDITORIAL_ARTICLE,
  ESQUIRE_EDITORIAL_ARTICLE,
} from "./article-data";

const EDITORIAL_ARTICLES = {
  bicycling: BICYCLING_EDITORIAL_ARTICLE,
  cosmopolitan: COSMOPOLITAN_EDITORIAL_ARTICLE,
  "car-and-driver": CAR_AND_DRIVER_EDITORIAL_ARTICLE,
  "country-living": COUNTRY_LIVING_EDITORIAL_ARTICLE,
  delish: DELISH_EDITORIAL_ARTICLE,
  elle: ELLE_EDITORIAL_ARTICLE,
  esquire: ESQUIRE_EDITORIAL_ARTICLE,
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

function EditorialArticlePage(props: Pick<ArticlePageTemplateProps, "showGridOverlay">) {
  return (
    <ArticleEditorialFeatureTemplate
      content={COSMOPOLITAN_EDITORIAL_ARTICLE}
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

function EditorialArticleStoryFrame({
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
        <EditorialArticlePage showGridOverlay={showGrid} />
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

export const EditorialFeature: Story = {
  name: "Editorial Feature",
  render: () => <EditorialArticleStoryFrame />,
  parameters: {
    forceBrand: "cosmopolitan",
    docs: {
      description: {
        story:
          "Premium Cosmopolitan editorial feature variant for the Towa Bird story, with an immersive hero, visual chapters, poster-like pull quote moments, narrow reading flow, newsletter, and related articles.",
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
