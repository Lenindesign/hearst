import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ArticlePageTemplate } from "@/components/article-page";
import { useTheme } from "@/components/theme-provider";
import { VisualInspector } from "@/components/visual-inspector";
import { BRAND_ARTICLES } from "./article-data";

function BrandArticlePage() {
  const { brand } = useTheme();
  const data = BRAND_ARTICLES[brand.slug] ?? BRAND_ARTICLES["cosmopolitan"];
  return <ArticlePageTemplate content={data.content} />;
}

function ArticlePageWrapper() {
  return (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <BrandArticlePage />
    </div>
  );
}

const meta: Meta = {
  title: "Templates/Article Page",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-page article template with brand-specific content. Each brand shows contextual articles with real Hearst CDN images, headlines, and sidebar items. Switch brands via the toolbar to see Car and Driver show auto news, Delish show recipes, Elle show fashion, etc.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Full Page",
  render: () => <ArticlePageWrapper />,
};

export const WithInspector: Story = {
  name: "Visual Inspector",
  render: () => (
    <VisualInspector>
      <ArticlePageWrapper />
    </VisualInspector>
  ),
};
