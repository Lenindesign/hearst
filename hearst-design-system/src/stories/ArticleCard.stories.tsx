import type { Meta, StoryObj } from "@storybook/react";
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

const meta: Meta<typeof ArticleCard> = {
  title: "Components/ArticleCard",
  component: ArticleCard,
  argTypes: {
    layout: { control: "select", options: ["vertical", "horizontal"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof ArticleCard>;

export const Vertical: Story = {
  args: { layout: "vertical", size: "default" },
  render: (args) => (
    <div className="w-[340px]">
      <ArticleCard {...args}>
        <ArticleCardImage
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop"
          alt="Fashion"
          aspectRatio="16/9"
        />
        <ArticleCardContent>
          <ArticleCardEyebrow>Fashion</ArticleCardEyebrow>
          <ArticleCardTitle>The Bold New Trends You Need to Know About This Season</ArticleCardTitle>
          <ArticleCardDescription>An in-depth look at the styles defining spring 2026.</ArticleCardDescription>
          <ArticleCardMeta>
            <ArticleCardMetaItem>Mar 8, 2026</ArticleCardMetaItem>
            <ArticleCardMetaDot />
            <ArticleCardAuthor>Jane Doe</ArticleCardAuthor>
          </ArticleCardMeta>
        </ArticleCardContent>
      </ArticleCard>
    </div>
  ),
};

export const Horizontal: Story = {
  args: { layout: "horizontal", size: "default" },
  render: (args) => (
    <div className="w-[600px]">
      <ArticleCard {...args}>
        <ArticleCardImage
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
          alt="Car"
          aspectRatio="4/3"
        />
        <ArticleCardContent>
          <ArticleCardEyebrow>Automotive</ArticleCardEyebrow>
          <ArticleCardTitle>2027 Corvette ZR1 First Drive Review</ArticleCardTitle>
          <ArticleCardDescription>The most powerful Corvette ever made rewrites the American supercar playbook.</ArticleCardDescription>
          <ArticleCardMeta>
            <ArticleCardMetaItem>5 Min Read</ArticleCardMetaItem>
            <ArticleCardMetaDot />
            <ArticleCardAuthor>Tony Quiroga</ArticleCardAuthor>
          </ArticleCardMeta>
        </ArticleCardContent>
      </ArticleCard>
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div className="w-[260px]">
      <ArticleCard size="sm">
        <ArticleCardImage
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop"
          alt="Food"
          aspectRatio="1/1"
        />
        <ArticleCardContent>
          <ArticleCardEyebrow>Recipes</ArticleCardEyebrow>
          <ArticleCardTitle>One-Pan Lemon Chicken</ArticleCardTitle>
          <ArticleCardMeta>
            <ArticleCardMetaItem>3 Min Read</ArticleCardMetaItem>
          </ArticleCardMeta>
        </ArticleCardContent>
      </ArticleCard>
    </div>
  ),
};
