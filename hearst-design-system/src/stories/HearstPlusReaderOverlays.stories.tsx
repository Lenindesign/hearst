import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { HomePageTemplate } from "@/components/hearst-plus";
import { ThemeProvider } from "@/components/theme-provider";
import { hearstPlusStoryData } from "./hearst-plus-story-data";
import { getComponentStoryForBrand } from "./hearst-plus-component-fixtures";

function ReaderOverlayExample({ brandSlug = "hearst-all" }: { brandSlug?: string }) {
  const readerStory = getComponentStoryForBrand(brandSlug, (story) => Boolean(story.sourceUrl));
  const storyData = {
    ...hearstPlusStoryData,
    all: {
      ...hearstPlusStoryData.all,
      stories: [readerStory, ...hearstPlusStoryData.all.stories.filter((story) => story.id !== readerStory.id)],
    },
  };
  return (
    <div style={{ minHeight: "100vh" }}>
      <ThemeProvider defaultBrandSlug="hearst-all" persistColorMode={false}>
        <HomePageTemplate
          staticDestinationData={storyData}
          initialBrandSlug={readerStory.brandSlug}
          initialOpenStoryId={readerStory.id}
          readerReturnHref="/hearst-plus/"
        />
      </ThemeProvider>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Reader Overlays",
  component: ReaderOverlayExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Integrated coverage for the Hearst+ content reader modal. The Hearst+ destination provider stays active while the selected publication controls the article theme, queue, related content, focus restoration, and source-article loading.",
      },
    },
  },
} satisfies Meta<typeof ReaderOverlayExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentReader: Story = {
  name: "Content reader modal",
  render: (_args, context) => <ReaderOverlayExample key={context.globals.brand} brandSlug={context.globals.brand} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole("dialog", { name: "Story reader" })).toBeVisible();
  },
};
