import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import {
  LifestyleRiverCard,
  RichPhotoGalleryCard,
  type FullscreenReaderImage,
} from "@/components/hearst-plus";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getComponentGalleryImagesForBrand,
  getComponentStoriesForBrand,
  getComponentStoryForBrand,
} from "./hearst-plus-component-fixtures";

function getArticleStory(brandSlug: string) {
  return getComponentStoryForBrand(
    brandSlug,
    (story) => !story.videoUrl && !/photos|gallery/.test(`${story.sourceUrl ?? ""} ${story.tags.join(" ")}`)
  );
}

function getGalleryFixture(brandSlug: string) {
  const brandStories = getComponentStoriesForBrand(brandSlug);
  const story = brandStories.find((candidate) =>
    /photos|gallery/.test(`${candidate.sourceUrl ?? ""} ${candidate.tags.join(" ")}`)
  ) ?? brandStories[0];
  const images: FullscreenReaderImage[] = getComponentGalleryImagesForBrand(story.brandSlug);
  return { story, images };
}

const handlers = {
  onOpen: fn(),
  onSave: fn(),
  onMoreLikeThis: fn(),
  onHide: fn(),
};

function CardFrame({ children, width = 760 }: { children: React.ReactNode; width?: number }) {
  return (
    <div
      className="hearst-plus-theme mx-auto my-4 min-w-0"
      style={{ width: `min(${width}px, calc(100vw - 2rem))` }}
    >
      {children}
    </div>
  );
}

function InteractiveArticleCard({ story, featured = false }: { story: LifestyleRiverStory; featured?: boolean }) {
  const [saved, setSaved] = React.useState(false);

  return (
    <CardFrame>
      <LifestyleRiverCard
        story={story}
        featured={featured}
        saved={saved}
        commentCount={18}
        onOpen={handlers.onOpen}
        onSave={() => {
          setSaved((current) => !current);
          handlers.onSave();
        }}
        onMoreLikeThis={handlers.onMoreLikeThis}
        onHide={handlers.onHide}
      />
    </CardFrame>
  );
}

const meta = {
  title: "Hearst Plus/Components/Editorial Cards",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Production Hearst+ river patterns. These stories render the same components used by the app, with current checked-in Hearst story metadata and semantic HDS tokens.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleRiverCard: Story = {
  name: "Article river card",
  globals: {
    brand: "hearst-lifestyle",
  },
  render: (_args, context) => (
    <InteractiveArticleCard key={context.globals.brand} story={getArticleStory(context.globals.brand)} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const saveButton = canvas.getByRole("button", { name: "Save story" });
    await expect(saveButton).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(saveButton);
    await expect(
      canvas.getByRole("button", { name: "Remove from saved stories" })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(handlers.onSave).toHaveBeenCalled();
  },
};

export const FeaturedArticleCard: Story = {
  name: "Featured article card",
  globals: {
    brand: "hearst-lifestyle",
  },
  render: (_args, context) => (
    <InteractiveArticleCard key={context.globals.brand} story={getArticleStory(context.globals.brand)} featured />
  ),
};

export const RichPhotoGallery: Story = {
  name: "Rich photo gallery",
  globals: {
    brand: "hearst-lifestyle",
  },
  render: (_args, context) => {
    const { story, images } = getGalleryFixture(context.globals.brand);
    const GalleryExample = () => {
      const [saved, setSaved] = React.useState(false);
      return (
        <CardFrame>
          <RichPhotoGalleryCard
            story={story}
            images={images}
            saved={saved}
            commentCount={24}
            onOpen={handlers.onOpen}
            onSave={() => {
              setSaved((current) => !current);
              handlers.onSave();
            }}
            onMoreLikeThis={handlers.onMoreLikeThis}
            onHide={handlers.onHide}
          />
        </CardFrame>
      );
    };

    return <GalleryExample />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gallery = canvas.getByRole("article");
    const galleryImages = within(gallery).getAllByRole("img");
    await expect(galleryImages.length).toBeGreaterThanOrEqual(5);
  },
};
