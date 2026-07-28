import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

import {
  FullscreenImageViewer,
  type FullscreenReaderImage,
} from "@/components/hearst-plus";
import {
  getComponentGalleryImagesForBrand,
  getComponentStoriesForBrand,
  getComponentStoryForBrand,
} from "./hearst-plus-component-fixtures";

function FullscreenImageViewerExample({
  brandSlug = "elle",
  singleImage = false,
}: {
  brandSlug?: string;
  singleImage?: boolean;
}) {
  const [open, setOpen] = React.useState(true);
  const [saved, setSaved] = React.useState(false);
  const [feedback, setFeedback] = React.useState("No gallery action selected.");
  const story = getComponentStoryForBrand(brandSlug);
  const supportingStories = getComponentStoriesForBrand(brandSlug)
    .filter((candidate) => candidate.image !== story.image)
    .slice(0, 3);
  const generatedImages = getComponentGalleryImagesForBrand(brandSlug);
  const candidates: FullscreenReaderImage[] = [
    {
      src: story.image,
      alt: `${story.brand}: ${story.title}`,
      caption: story.summary,
      credit: story.imageCredit ?? story.brand,
    },
    ...generatedImages.map((image) => ({
      ...image,
      caption: `Production-aligned ${story.brand} gallery image`,
    })),
    ...supportingStories.map((candidate) => ({
      src: candidate.image,
      alt: `${candidate.brand}: ${candidate.title}`,
      caption: candidate.summary,
      credit: candidate.imageCredit ?? candidate.brand,
    })),
  ];
  const images = candidates.filter(
    (image, index) =>
      candidates.findIndex((candidate) => candidate.src === image.src) === index,
  );
  const galleryImages = singleImage ? images.slice(0, 1) : images.slice(0, 4);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <p className="text-sm" aria-live="polite">{feedback}</p>
      <button
        type="button"
        className="mt-4 rounded-[4px] border border-white/40 px-4 py-2 disabled:opacity-50"
        onClick={() => setOpen(true)}
        disabled={open}
      >
        Open image viewer
      </button>
      {open ? (
        <FullscreenImageViewer
          gallery={{
            story,
            images: galleryImages,
            initialIndex: 0,
          }}
          saved={saved}
          onClose={() => setOpen(false)}
          onSave={() => {
            setSaved((value) => !value);
            setFeedback(saved ? "Story removed from saved items." : "Story saved.");
          }}
          onMoreLikeThis={() => setFeedback("More stories like this requested.")}
        />
      ) : null}
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Components/Reader Image Viewer",
  component: FullscreenImageViewerExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production fullscreen reader image viewer, extracted from the routed reader without changing its presentation or behavior. It owns modal isolation, focus, keyboard navigation, swipe, pinch/double-tap zoom, slideshow controls, captions, save, and More like this actions.",
      },
    },
  },
  argTypes: {
    brandSlug: { control: "text" },
    singleImage: { control: "boolean" },
  },
} satisfies Meta<typeof FullscreenImageViewerExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: (_args, context) => (
    <FullscreenImageViewerExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
    />
  ),
};

export const GalleryInteraction: Story = {
  name: "Gallery: Keyboard and caption",
  render: (_args, context) => (
    <FullscreenImageViewerExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
    />
  ),
  play: async () => {
    const body = within(document.body);
    const dialog = await body.findByRole("dialog", { name: /Fullscreen gallery for/ });
    await expect(dialog).toBeVisible();
    await expect(body.getByRole("button", { name: "Close fullscreen gallery" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    await expect(await body.findByText("2 of 4")).toBeVisible();
    await userEvent.click(body.getByRole("button", { name: "Show caption and credit" }));
    await expect(body.getByText(/^Photo:/)).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await expect(body.queryByRole("dialog", { name: /Fullscreen gallery for/ })).not.toBeInTheDocument();
    const reopenButton = body.getByRole("button", { name: "Open image viewer" });
    await userEvent.click(reopenButton);
    await expect(await body.findByText("1 of 4")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(reopenButton).toHaveFocus());
  },
};

export const SingleImage: Story = {
  render: (_args, context) => (
    <FullscreenImageViewerExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      singleImage
    />
  ),
  play: async () => {
    const body = within(document.body);
    await expect(await body.findByText("1 of 1")).toBeVisible();
    await expect(body.queryByRole("button", { name: "Next photo" })).not.toBeInTheDocument();
    await expect(body.queryByRole("button", { name: "Play slideshow" })).not.toBeInTheDocument();
  },
};
