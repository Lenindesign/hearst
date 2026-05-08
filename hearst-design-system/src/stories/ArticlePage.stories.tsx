import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ArticlePageTemplate, type ArticlePageTemplateProps } from "@/components/article-page";
import { useTheme } from "@/components/theme-provider";
import { VisualInspector } from "@/components/visual-inspector";
import { BRAND_ARTICLES } from "./article-data";

function BrandArticlePage(props: Pick<ArticlePageTemplateProps, "showGridOverlay">) {
  const { brand } = useTheme();
  const data = BRAND_ARTICLES[brand.slug] ?? BRAND_ARTICLES["cosmopolitan"];
  return <ArticlePageTemplate content={data.content} showGridOverlay={props.showGridOverlay} />;
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
