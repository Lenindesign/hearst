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

function ArticleCardRenderer({
  layout,
  size,
  eyebrow,
  title,
  description,
  author,
  date,
  image,
  aspectRatio,
  onClick,
}: ArticleCardStoryProps) {
  const width = layout === "horizontal" ? 600 : size === "sm" ? 260 : 340;
  return (
    <div style={{ width }} onClick={onClick} className="cursor-pointer">
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

const meta: Meta = {
  title: "Components/ArticleCard",
  args: {
    layout: "vertical",
    size: "default",
    eyebrow: "Fashion",
    title: "The Bold New Trends You Need to Know About This Season",
    description: "An in-depth look at the styles defining spring 2026.",
    author: "Jane Doe",
    date: "Mar 8, 2026",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop",
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
      description: "Category label above the headline (e.g. Fashion, Automotive, Recipes).",
      table: { category: "Content" },
    },
    title: {
      control: "text",
      description: "Article headline.",
      table: { category: "Content" },
    },
    description: {
      control: "text",
      description: "Article dek / summary. Leave empty to hide.",
      table: { category: "Content" },
    },
    author: {
      control: "text",
      description: "Author name. Leave empty to hide.",
      table: { category: "Content" },
    },
    date: {
      control: "text",
      description: "Publish date or read time.",
      table: { category: "Content" },
    },
    image: {
      control: "text",
      description: "Article image URL.",
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
          "Primary content card used across all Hearst editorial feeds. Supports vertical (grid) and horizontal (feed) layouts. Uses `--font-headline`, `--brand-primary` for eyebrow, and `component-card-*` tokens.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Vertical: Story = {
  args: { layout: "vertical", size: "default" },
  render: (args) => <ArticleCardRenderer {...(args as ArticleCardStoryProps)} />,
};

export const Horizontal: Story = {
  args: {
    layout: "horizontal",
    eyebrow: "Automotive",
    title: "2027 Corvette ZR1 First Drive Review",
    description: "The most powerful Corvette ever made rewrites the American supercar playbook.",
    author: "Tony Quiroga",
    date: "5 Min Read",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
    aspectRatio: "4/3",
  },
  render: (args) => <ArticleCardRenderer {...(args as ArticleCardStoryProps)} />,
};

export const Small: Story = {
  args: {
    size: "sm",
    eyebrow: "Recipes",
    title: "One-Pan Lemon Chicken",
    description: "",
    author: "",
    date: "3 Min Read",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
    aspectRatio: "1/1",
  },
  render: (args) => <ArticleCardRenderer {...(args as ArticleCardStoryProps)} />,
};

export const Large: Story = {
  args: {
    size: "lg",
    eyebrow: "Culture",
    title: "The Renaissance of Independent Cinema in 2026",
    description: "How a new generation of filmmakers is redefining what it means to make a movie outside the studio system.",
    author: "Maria Santos",
    date: "12 Min Read",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=400&fit=crop",
    aspectRatio: "3/2",
  },
  render: (args) => <ArticleCardRenderer {...(args as ArticleCardStoryProps)} />,
};
