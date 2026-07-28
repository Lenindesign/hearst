import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import {
  ReaderArticleBody,
  type ReaderArticleImage,
  type ReaderArticleLoadState,
} from "@/components/hearst-plus";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { LiveArticleData } from "@/lib/live-feed-types";
import { getComponentStoryForBrand } from "./hearst-plus-component-fixtures";

function ReaderArticleBodyExample({
  brandSlug = "elle",
  state = "ready",
}: {
  brandSlug?: string;
  state?: "ready" | "loading" | "error" | "fallback" | "video";
}) {
  const [openedImage, setOpenedImage] =
    React.useState<ReaderArticleImage | null>(null);
  const productionStory: LifestyleRiverStory =
    getComponentStoryForBrand(brandSlug);
  const secondaryStory: LifestyleRiverStory = getComponentStoryForBrand(
    brandSlug === "elle" ? "cosmopolitan" : "elle",
  );
  const story =
    state === "fallback"
      ? {
          ...productionStory,
          sourceUrl: undefined,
          videoUrl: undefined,
        }
      : state === "video"
        ? {
            ...productionStory,
            videoUrl:
              productionStory.videoUrl ??
              "https://cdn.jwplayer.com/videos/8VZQ1Z0Q-JqLM4FKG.mp4",
            videoDuration: productionStory.videoDuration ?? 92,
          }
        : productionStory;
  const readyArticle: LiveArticleData = {
    sourceUrl: story.sourceUrl ?? "https://www.hearst.com/",
    byline: story.byline ?? "Hearst editors",
    publishedAt: story.publishedAt,
    blocks: [
      { type: "paragraph", text: story.summary },
      { type: "heading", text: "What to know" },
      {
        type: "quote",
        text: "The production reader preserves editorial hierarchy across every publication theme.",
      },
      {
        type: "list",
        items: [
          "Publication typography",
          "Structured article blocks",
          "Fullscreen image affordances",
        ],
      },
      {
        type: "image",
        url: secondaryStory.image,
        alt: `${secondaryStory.brand} editorial reference`,
        caption: "Production-aligned editorial fixture",
        credit: secondaryStory.brand,
      },
    ],
  };
  const liveArticle: ReaderArticleLoadState | undefined =
    state === "ready"
      ? { status: "ready", data: readyArticle }
      : state === "loading"
        ? { status: "loading" }
        : state === "error"
          ? { status: "error" }
          : undefined;

  return (
    <article className="mx-auto w-full max-w-3xl bg-[var(--hp-surface)] p-4 text-foreground sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">
        Production reader article body
      </p>
      <h2 className="headline mt-2 text-3xl">{story.title}</h2>
      <ReaderArticleBody
        story={story}
        liveArticle={liveArticle}
        onOpenImage={setOpenedImage}
      />
      <p className="mt-6 text-xs text-muted-foreground" aria-live="polite">
        {openedImage
          ? `Fullscreen image requested: ${openedImage.alt}`
          : "Image viewer requests appear here for this isolated specification."}
      </p>
    </article>
  );
}

const meta = {
  title: "Hearst Plus/Components/Reader Body",
  component: ReaderArticleBodyExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production reader article body renders video summaries, live-loading skeletons, structured article blocks, load failures, and the deterministic Storybook fallback. Routing, modal isolation, comments, recommendations, and queue selection remain outside this component.",
      },
    },
  },
  argTypes: {
    brandSlug: { control: "text" },
    state: {
      control: "inline-radio",
      options: ["ready", "loading", "error", "fallback", "video"],
    },
  },
} satisfies Meta<typeof ReaderArticleBodyExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  render: (_args, context) => (
    <ReaderArticleBodyExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      state="ready"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("What to know")).toBeVisible();
    await expect(canvas.getByText("Publication typography")).toBeVisible();
    const imageButton = canvas.getByRole("button", {
      name: /View image fullscreen:/,
    });
    await userEvent.click(imageButton);
    await expect(
      canvas.getByText(/Fullscreen image requested:/),
    ).toBeVisible();
  },
};

export const Loading: Story = {
  render: (_args, context) => (
    <ReaderArticleBodyExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      state="loading"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "Loading the full article and photos...",
      ),
    ).toBeVisible();
  },
};

export const Error: Story = {
  name: "Error: Article content unavailable",
  render: (_args, context) => (
    <ReaderArticleBodyExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      state="error"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("status"),
    ).toHaveTextContent("This complete article could not be loaded.");
  },
};

export const FixtureFallback: Story = {
  name: "Fallback: Static editorial fixture",
  render: (_args, context) => (
    <ReaderArticleBodyExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      state="fallback"
    />
  ),
};

export const Video: Story = {
  render: (_args, context) => (
    <ReaderArticleBodyExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      state="video"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(/^Hearst video/),
    ).toBeVisible();
  },
};
