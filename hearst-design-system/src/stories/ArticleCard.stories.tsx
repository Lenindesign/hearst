import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardEyebrow,
  ArticleCardTitle,
  ArticleCardDescription,
  ArticleCardMeta,
  ArticleCardMetaItem,
  ArticleCardMetaDot,
  ArticleCardAuthor,
} from "@/components/ui/article-card";
import { useTheme } from "@/components/theme-provider";
import { BRAND_ARTICLES } from "./article-data";
import { getBrandImages } from "@/components/homepage-data";

const H = "https://hips.hearstapps.com/hmg-prod/images/";
function cardImg(id: string) {
  return `${H}${id}?crop=0.666xw:1xh;center,top&resize=600:*`;
}

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
  layout: "vertical" | "horizontal";
  size: "default" | "sm" | "lg";
  eyebrow: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image: string;
  aspectRatio: "16/9" | "4/3" | "1/1" | "3/2";
  onClick: () => void;
}

function BrandVerticalCard(props: Partial<ArticleCardStoryProps>) {
  const brand = useBrandCardContent();
  const layout = props.layout ?? "vertical";
  const size = props.size ?? "default";
  const eyebrow = props.eyebrow || brand.eyebrow;
  const title = props.title || brand.title;
  const description = props.description ?? brand.description;
  const author = props.author || brand.author;
  const date = props.date || brand.date;
  const image = props.image || brand.image;
  const aspectRatio = props.aspectRatio ?? "16/9";

  const width = layout === "horizontal" ? 600 : size === "sm" ? 260 : 340;
  return (
    <div style={{ width }} onClick={props.onClick} className="cursor-pointer">
      <ArticleCard layout={layout} size={size}>
        <ArticleCardImage src={image} alt={title} aspectRatio={aspectRatio} />
        <ArticleCardContent>
          <ArticleCardEyebrow>{eyebrow}</ArticleCardEyebrow>
          <ArticleCardTitle>{title}</ArticleCardTitle>
          {description && <ArticleCardDescription>{description}</ArticleCardDescription>}
          <ArticleCardMeta>
            <ArticleCardMetaItem>{date}</ArticleCardMetaItem>
            {author && (
              <>
                <ArticleCardMetaDot />
                <ArticleCardAuthor>{author}</ArticleCardAuthor>
              </>
            )}
          </ArticleCardMeta>
        </ArticleCardContent>
      </ArticleCard>
    </div>
  );
}

function BrandHorizontalCard(props: Partial<ArticleCardStoryProps>) {
  const brand = useBrandCardContent();
  const data = BRAND_ARTICLES[useTheme().brand.slug] ?? BRAND_ARTICLES["cosmopolitan"];
  const sidebar = data.content.sidebarItems?.[0];

  return (
    <BrandVerticalCard
      layout="horizontal"
      size={props.size ?? "default"}
      eyebrow={sidebar?.eyebrow || brand.eyebrow}
      title={sidebar?.title || brand.title}
      description=""
      author={brand.author}
      date="5 Min Read"
      image={brand.sidebarImage}
      aspectRatio="4/3"
      onClick={props.onClick}
    />
  );
}

function BrandSmallCard(props: Partial<ArticleCardStoryProps>) {
  const brand = useBrandCardContent();
  const data = BRAND_ARTICLES[useTheme().brand.slug] ?? BRAND_ARTICLES["cosmopolitan"];
  const sidebar = data.content.sidebarItems?.[1];

  return (
    <BrandVerticalCard
      layout="vertical"
      size="sm"
      eyebrow={sidebar?.eyebrow || brand.eyebrow}
      title={sidebar?.title || "Latest Story"}
      description=""
      author=""
      date="3 Min Read"
      image={sidebar?.image || brand.secondaryImage}
      aspectRatio="1/1"
      onClick={props.onClick}
    />
  );
}

function BrandLargeCard(props: Partial<ArticleCardStoryProps>) {
  const brand = useBrandCardContent();
  return (
    <BrandVerticalCard
      layout="vertical"
      size="lg"
      eyebrow={brand.eyebrow}
      title={brand.title}
      description={brand.description}
      author={brand.author}
      date={brand.date}
      image={brand.image}
      aspectRatio="3/2"
      onClick={props.onClick}
    />
  );
}

const meta: Meta = {
  title: "Components/ArticleCard",
  args: {
    layout: "vertical",
    size: "default",
    eyebrow: "",
    title: "",
    description: "",
    author: "",
    date: "",
    image: "",
    aspectRatio: "16/9",
    onClick: fn(),
  },
  argTypes: {
    layout: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Card layout direction. Use `vertical` in grids, `horizontal` in feeds.",
      table: { category: "Appearance", defaultValue: { summary: "vertical" } },
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
      description: "Card size preset. Affects padding and font sizes.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    eyebrow: {
      control: "text",
      description: "Category label above the headline. Leave empty to use brand default.",
      table: { category: "Content" },
    },
    title: {
      control: "text",
      description: "Article headline. Leave empty to use brand default.",
      table: { category: "Content" },
    },
    description: {
      control: "text",
      description: "Article dek / summary. Leave empty to use brand default.",
      table: { category: "Content" },
    },
    author: {
      control: "text",
      description: "Author name. Leave empty to use brand default.",
      table: { category: "Content" },
    },
    date: {
      control: "text",
      description: "Publish date or read time. Leave empty to use brand default.",
      table: { category: "Content" },
    },
    image: {
      control: "text",
      description: "Article image URL. Leave empty to use brand default.",
      table: { category: "Content" },
    },
    aspectRatio: {
      control: "select",
      options: ["1/1", "4/3", "3/2", "16/9"],
      description: "Image aspect ratio.",
      table: { category: "Appearance", defaultValue: { summary: "16/9" } },
    },
    onClick: {
      action: "card-click",
      description: "Fires when the card is clicked (navigate to article).",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Primary content card used across all Hearst editorial feeds. Supports vertical (grid) and horizontal (feed) layouts. " +
          "Content and images automatically adapt to the selected brand — switch brands via the toolbar to see Car and Driver show auto news, Delish show recipes, Elle show fashion, etc. " +
          "Override any field via the controls panel.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Vertical: Story = {
  args: { layout: "vertical", size: "default" },
  render: (args) => <BrandVerticalCard {...(args as Partial<ArticleCardStoryProps>)} />,
};

export const Horizontal: Story = {
  args: { layout: "horizontal" },
  render: (args) => <BrandHorizontalCard {...(args as Partial<ArticleCardStoryProps>)} />,
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => <BrandSmallCard {...(args as Partial<ArticleCardStoryProps>)} />,
};

export const Large: Story = {
  args: { size: "lg" },
  render: (args) => <BrandLargeCard {...(args as Partial<ArticleCardStoryProps>)} />,
};
