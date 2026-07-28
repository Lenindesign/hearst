import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useTheme } from "@/components/theme-provider";
import { BigStoryFeedStacked } from "@/components/fre/big-story-feed";
import { BigStoryImageRight } from "@/components/fre/big-story";
import { FourAcrossGrid } from "@/components/fre/four-across-grid";
import {
  ArticleCard,
  ArticleCardAuthor,
  ArticleCardContent,
  ArticleCardDescription,
  ArticleCardEyebrow,
  ArticleCardFooter,
  ArticleCardImage,
  ArticleCardMeta,
  ArticleCardMetaDot,
  ArticleCardMetaItem,
  ArticleCardTitle,
} from "@/components/ui/article-card";
import { BRAND_ARTICLES } from "./article-data";
import { getBrandImages } from "@/components/homepage-data";

interface BrandCardContent {
  eyebrow: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image: string;
  secondaryImage: string;
  sidebarImage: string;
}

function useBrandCardContent(): BrandCardContent {
  const { brand } = useTheme();
  const articleData = BRAND_ARTICLES[brand.slug] ?? BRAND_ARTICLES["cosmopolitan"];
  const images = getBrandImages(brand.slug);
  const content = articleData.content;
  const sidebar = content.sidebarItems?.[0];

  return {
    eyebrow: content.breadcrumbs.map((b) => b.label).join(" / "),
    title: content.headline,
    description: content.dek || "",
    author: content.author,
    date: content.publishedDate,
    image: content.heroImage,
    secondaryImage: images.articles[0] || content.heroImage,
    sidebarImage: sidebar?.image || images.trending[0] || content.heroImage,
  };
}

interface ArticleCardStoryProps {
  onClick: () => void;
}

function PrimitiveArticleCard({
  layout = "vertical",
  size = "default",
  image = true,
  onClick,
}: Partial<ArticleCardStoryProps> & {
  layout?: "vertical" | "horizontal";
  size?: "default" | "sm" | "lg";
  image?: boolean;
}) {
  const brand = useBrandCardContent();

  return (
    <div
      className={
        layout === "horizontal"
          ? "mx-auto my-4 w-[calc(100%-2rem)] max-w-[680px]"
          : "mx-auto my-4 w-[calc(100%-2rem)] max-w-[360px]"
      }
    >
      <ArticleCard
        layout={layout}
        size={size}
        onClick={onClick}
        aria-label={onClick ? `Open story: ${brand.title}` : undefined}
        className={onClick ? "cursor-pointer" : undefined}
      >
        <ArticleCardImage
          src={image ? brand.image : undefined}
          alt={image ? "" : undefined}
          aspectRatio={layout === "horizontal" ? "4/3" : "3/2"}
        />
        <ArticleCardContent>
          <ArticleCardEyebrow>{brand.eyebrow}</ArticleCardEyebrow>
          <ArticleCardTitle>{brand.title}</ArticleCardTitle>
          <ArticleCardDescription>{brand.description}</ArticleCardDescription>
          <ArticleCardMeta>
            <ArticleCardAuthor>By {brand.author}</ArticleCardAuthor>
            <ArticleCardMetaDot />
            <ArticleCardMetaItem>5 Min Read</ArticleCardMetaItem>
          </ArticleCardMeta>
        </ArticleCardContent>
        {layout === "vertical" && (
          <ArticleCardFooter>
            <span className="text-xs text-muted-foreground">Editorial feature</span>
            <span className="text-xs font-semibold text-primary">Read story</span>
          </ArticleCardFooter>
        )}
      </ArticleCard>
    </div>
  );
}

function BrandHorizontalCard(props: Partial<ArticleCardStoryProps>) {
  const brand = useBrandCardContent();
  const data = BRAND_ARTICLES[useTheme().brand.slug] ?? BRAND_ARTICLES["cosmopolitan"];
  const sidebar = data.content.sidebarItems?.[0];

  return (
    <div className="mx-auto my-4 w-[calc(100%-2rem)] max-w-[680px]">
      <BigStoryFeedStacked
        items={[
          {
            eyebrow: sidebar?.eyebrow ?? brand.eyebrow,
            title: sidebar?.title ?? brand.title,
            author: brand.author,
            date: "5 Min Read",
            image: brand.sidebarImage,
          },
        ]}
        thumbnailWidth={200}
        thumbnailHeight={140}
        showDividers={false}
        onArticleClick={() => props.onClick?.()}
      />
    </div>
  );
}

function BrandSmallCard(props: Partial<ArticleCardStoryProps>) {
  const brand = useBrandCardContent();
  const data = BRAND_ARTICLES[useTheme().brand.slug] ?? BRAND_ARTICLES["cosmopolitan"];
  const sidebar = data.content.sidebarItems?.[1];

  return (
    <div className="mx-auto my-4 w-[calc(100%-2rem)] max-w-[320px]">
      <FourAcrossGrid
        items={[
          {
            title: sidebar?.title ?? "Latest Story",
            subtitle: "3 Min Read",
            image: sidebar?.image ?? brand.secondaryImage,
          },
        ]}
        columns={1}
        aspectRatio="3/2"
        responsive={false}
        onCardClick={() => props.onClick?.()}
      />
    </div>
  );
}

function BrandLargeCard(props: Partial<ArticleCardStoryProps>) {
  const brand = useBrandCardContent();
  return (
    <div className="mx-auto my-4 w-[calc(100%-2rem)] max-w-[720px]">
      <BigStoryImageRight
        label={brand.eyebrow}
        headline={brand.title}
        description={brand.description}
        author={brand.author}
        date={brand.date}
        image={brand.image}
        imagePosition="top"
        aspectRatio="3/2"
        onArticleClick={() => props.onClick?.()}
      />
    </div>
  );
}

const meta: Meta = {
  title: "Hearst Plus/HDS Primitives/Article Card",
  component: ArticleCard,
  args: {
    onClick: fn(),
  },
  argTypes: {
    onClick: {
      action: "card-click",
      description: "Fires when the card is clicked (navigate to article).",
      table: { category: "Events" },
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composable article-card primitives used by production editorial modules. These stories render the same production compositions used by the application rather than parallel showcase markup. " +
          "Content and images adapt to the selected brand; switch brands via the toolbar to verify the production token inheritance.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const CompleteAnatomy: Story = {
  name: "Primitive: Complete anatomy",
  render: (args) => (
    <PrimitiveArticleCard {...(args as Partial<ArticleCardStoryProps>)} />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("button");
    await expect(card).toHaveAttribute("aria-label");
    card.focus();
    await userEvent.keyboard("{Enter}");
    await expect(
      (args as ArticleCardStoryProps).onClick,
    ).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The exact production compound primitive with image, eyebrow, headline, description, author metadata, and footer. Enter activates the same shared click contract used by production FRE compositions.",
      },
    },
  },
};

export const HorizontalPrimitive: Story = {
  name: "Primitive: Horizontal compact",
  render: (args) => (
    <PrimitiveArticleCard
      {...(args as Partial<ArticleCardStoryProps>)}
      layout="horizontal"
      size="sm"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The compact horizontal primitive used underneath production river and sidebar compositions. The thumbnail remains capped so the text retains the majority of the row.",
      },
    },
  },
};

export const ImageFallback: Story = {
  name: "Primitive: Missing image",
  render: () => <PrimitiveArticleCard image={false} />,
  parameters: {
    docs: {
      description: {
        story:
          "The production missing-image boundary renders the official Phosphor image placeholder without making a non-interactive article focusable.",
      },
    },
  },
};

export const Horizontal: Story = {
  name: "Production River",
  render: (args) => <BrandHorizontalCard {...(args as Partial<ArticleCardStoryProps>)} />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Renders the production `BigStoryFeedStacked` component used by Hearst destination collections and rails.",
      },
    },
  },
};

export const Small: Story = {
  name: "Production Compact Grid",
  render: (args) => <BrandSmallCard {...(args as Partial<ArticleCardStoryProps>)} />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Renders the production `FourAcrossGrid` composition: transparent surface, no card ring, rounded image, and compact metadata.",
      },
    },
  },
};

export const Large: Story = {
  name: "Production Feature",
  render: (args) => <BrandLargeCard {...(args as Partial<ArticleCardStoryProps>)} />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Renders the production `BigStoryImageRight` feature composition used by brand homepages.",
      },
    },
  },
};
