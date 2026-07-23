import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  VerticalVideoCarousel,
  VideoFeedLeadCard,
  VideoIndexCard,
  VideoRailCard,
} from "@/components/hearst-plus";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { themeOptions } from "@/lib/theme-options";
import { getComponentStoriesForBrand, getComponentStoryForBrand } from "./hearst-plus-component-fixtures";

function getVideoStory(brandSlug: string): LifestyleRiverStory {
  const sourceStory = getComponentStoryForBrand(brandSlug);
  return {
    ...sourceStory,
    id: `storybook-video-${sourceStory.id}`,
    mediaKind: "video",
    videoDuration: 93,
    signal: "Editor Pick",
  };
}

function getPortraitVideoStories(brandSlug: string) {
  const brandStories = getComponentStoriesForBrand(brandSlug);
  return Array.from({ length: Math.min(6, brandStories.length * 2) }, (_, index) => {
    const story = brandStories[index % brandStories.length];
    return {
      ...story,
      id: `storybook-short-${index}-${story.id}`,
      mediaKind: "video",
      videoUrl: "/storybook-video-placeholder.mp4",
      videoDuration: 24 + index * 7,
      videoWidth: 720,
      videoHeight: 1280,
    } satisfies LifestyleRiverStory;
  });
}

const handlers = {
  onOpen: fn(),
  onSave: fn(),
  onHide: fn(),
};

function VideoFrame({ children, width = 760, dark = false }: { children: React.ReactNode; width?: number; dark?: boolean }) {
  return (
    <div
      className={dark ? "hearst-plus-theme dark p-5" : "hearst-plus-theme"}
      style={{ width: "100%", maxWidth: width, marginInline: "auto", background: dark ? "#050505" : undefined }}
    >
      {children}
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Video Cards",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production video-card family used by Hearst+ feeds, video indexes, trending rails, and publication-aware vertical video carousels. Poster-state stories intentionally avoid a fake playable URL. The vertical-carousel example uses a checked-in demo clip with current story metadata to demonstrate controls and layout; it is not presented as live feed playback.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeadVideo: Story = {
  name: "Lead video",
  render: (_args, context) => {
    const videoStory = getVideoStory(context.globals.brand);
    const LeadExample = () => {
      const [saved, setSaved] = React.useState(false);
      return (
        <VideoFrame>
          <VideoFeedLeadCard
            story={videoStory}
            saved={saved}
            commentCount={16}
            onOpen={handlers.onOpen}
            onSave={() => {
              setSaved((current) => !current);
              handlers.onSave();
            }}
            variant="hearstPlus"
          />
        </VideoFrame>
      );
    };
    return <LeadExample />;
  },
};

export const FeedVideo: Story = {
  name: "Feed video",
  render: (_args, context) => (
    <VideoFrame>
      <VideoIndexCard
        story={getVideoStory(context.globals.brand)}
        saved={false}
        commentCount={13}
        onOpen={handlers.onOpen}
        onSave={handlers.onSave}
        onHide={handlers.onHide}
        variant="hearstPlus"
      />
    </VideoFrame>
  ),
};

export const TrendingVideo: Story = {
  name: "Trending video row",
  render: (_args, context) => (
    <VideoFrame width={360}>
      <VideoRailCard story={getVideoStory(context.globals.brand)} rank={1} onOpen={handlers.onOpen} />
    </VideoFrame>
  ),
};

export const DelishShorts: Story = {
  name: "Vertical video carousel",
  parameters: {
    docs: {
      description: {
        story:
          "Use the Brand toolbar to review the shared vertical-video carousel across publications. The sample clip is an explicit Storybook interaction fixture; titles, images, sections, and branding come from the generated checked-in Hearst fixture set.",
      },
    },
  },
  render: (_args, context) => {
    const selectedBrand = themeOptions.find((brand) => brand.slug === context.globals.brand) ?? themeOptions[0];
    return (
      <VideoFrame width={900}>
        <VerticalVideoCarousel
          key={selectedBrand.slug}
          stories={getPortraitVideoStories(selectedBrand.slug)}
          onOpen={handlers.onOpen}
          theme="light"
          brandName={selectedBrand.name}
          brandSlug={selectedBrand.slug}
        />
      </VideoFrame>
    );
  },
};
