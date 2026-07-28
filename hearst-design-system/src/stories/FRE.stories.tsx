import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useTheme } from "@/components/theme-provider";
import { BigStoryFeedStacked } from "@/components/fre/big-story-feed";
import { BigStoryImageRight, BigStoryTextOnly } from "@/components/fre/big-story";
import { FourAcrossGrid } from "@/components/fre/four-across-grid";
import { SiteFooter } from "@/components/fre/site-footer";
import { getBrandImages } from "@/components/homepage-data";
import { BRAND_ARTICLES } from "./article-data";

function useProductionFixture() {
  const { brand } = useTheme();
  const article = BRAND_ARTICLES[brand.slug] ?? BRAND_ARTICLES.cosmopolitan;
  const images = getBrandImages(brand.slug);
  const sidebarItems = article.content.sidebarItems ?? [];
  const stories = [article.content.headline, ...sidebarItems.map((item) => item.title)];
  const storyImages = [
    article.content.heroImage,
    ...sidebarItems.map((item) => item.image),
    ...images.articles,
    ...images.trending,
  ].filter(Boolean);

  return {
    brand,
    article: article.content,
    cards: Array.from({ length: 4 }, (_, index) => ({
      title: stories[index % stories.length],
      image: storyImages[index % storyImages.length],
      subtitle: `${index + 3} Min Read`,
    })),
    feed: Array.from({ length: 3 }, (_, index) => ({
      eyebrow: index === 0 ? article.content.breadcrumbs.at(-1)?.label : undefined,
      title: stories[(index + 1) % stories.length],
      author: index === 0 ? article.content.author : undefined,
      date: `${index + 3} Min Read`,
      image: storyImages[(index + 1) % storyImages.length],
    })),
  };
}

function StoryFrame({
  children,
  maxWidth = 1200,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <div className="w-full px-4 py-6 sm:px-6" style={{ maxWidth, marginInline: "auto" }}>
      {children}
    </div>
  );
}

const handlers = {
  onActivate: fn(),
  onSelect: fn(),
};

const meta = {
  title: "Hearst Plus/Components/Production Modules",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Production editorial modules from `src/components/fre` that have current application use sites. Every story renders the shipped React component directly with current brand fixtures and semantic tokens; the previous story-local replicas and unused exports are not presented as production.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const River: Story = {
  name: "Article river",
  render: function Render() {
    const { feed } = useProductionFixture();
    return (
      <StoryFrame maxWidth={760}>
        <BigStoryFeedStacked items={feed} onArticleClick={handlers.onSelect} />
      </StoryFrame>
    );
  },
};

export const Feature: Story = {
  name: "Feature",
  render: function Render() {
    const { article } = useProductionFixture();
    return (
      <StoryFrame maxWidth={900}>
        <BigStoryImageRight
          label={article.breadcrumbs.at(-1)?.label ?? "Feature"}
          headline={article.headline}
          description={article.dek ?? ""}
          author={article.author}
          date={article.publishedDate}
          image={article.heroImage}
          onArticleClick={handlers.onActivate}
        />
      </StoryFrame>
    );
  },
};

export const CompactGrid: Story = {
  name: "Compact grid",
  render: function Render() {
    const { cards } = useProductionFixture();
    return (
      <StoryFrame>
        <FourAcrossGrid
          items={cards}
          aspectRatio="3/2"
          onCardClick={handlers.onSelect}
        />
      </StoryFrame>
    );
  },
};

export const TextFeature: Story = {
  name: "Text feature",
  render: function Render() {
    const { article } = useProductionFixture();
    return (
      <StoryFrame maxWidth={760}>
        <BigStoryTextOnly
          label={article.breadcrumbs.at(-1)?.label ?? "Feature"}
          headline={article.headline}
          description={article.dek ?? ""}
          author={article.author}
          date={article.publishedDate}
          onArticleClick={handlers.onActivate}
        />
      </StoryFrame>
    );
  },
};

export const SiteFooterStory: Story = {
  name: "Site footer",
  render: function Render() {
    const { brand } = useProductionFixture();
    return (
      <SiteFooter
        siteName={brand.name}
        onSocialClick={handlers.onSelect}
        onLegalClick={handlers.onSelect}
        onSubscribeClick={handlers.onActivate}
      />
    );
  },
};
