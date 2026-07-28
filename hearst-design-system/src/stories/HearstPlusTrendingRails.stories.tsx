import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  TrendingStoryRail,
  TrendingVideoRail,
} from "@/components/hearst-plus";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  hearstPlusStoryData,
  hearstPlusVideoStoryData,
} from "./hearst-plus-story-data";
import { allocateStoryModules } from "@/lib/story-module-allocation";
import {
  buildVideoDestinationQueue,
  isDelishPortraitShort,
} from "@/lib/hearst-video-destination-model";

type RailKind = "articles" | "videos";

function allocateTrendingStories(
  stories: LifestyleRiverStory[],
  {
    reservePageModules = true,
  }: {
    reservePageModules?: boolean;
  } = {},
) {
  return allocateStoryModules({
    stories,
    heroStoryIds: reservePageModules
      ? stories.slice(0, 5).map((story) => story.id)
      : [],
    continueStoryIds: [],
    followedBrands: [],
    includeTodayEdit: false,
    dailyHabitCount: reservePageModules ? 3 : 0,
    minimumRiverStories: reservePageModules ? 4 : 0,
  }).trendingStories;
}

const crossBrandStories = allocateTrendingStories(
  hearstPlusStoryData.lifestyle.stories,
);

const publicationStories = allocateTrendingStories(
  hearstPlusStoryData.lifestyle.stories.filter(
    (story) => story.brand === "Cosmopolitan",
  ),
  { reservePageModules: false },
);

const videoStories = hearstPlusVideoStoryData.all.stories;
const promotedVideoStoryIds = new Set(
  videoStories
    .filter(isDelishPortraitShort)
    .map((story) => story.id),
);
const trendingVideos = buildVideoDestinationQueue(
  videoStories,
  promotedVideoStoryIds,
).trendingVideoStories;

function TrendingRailExample({
  kind,
  stories,
}: {
  kind: RailKind;
  stories: LifestyleRiverStory[];
}) {
  const [lastOpened, setLastOpened] = React.useState("");
  const dark = kind === "videos";
  const lightThemeStyle = dark
    ? undefined
    : {
        "--hp-section-title":
          "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
        "--hp-sidebar-heading":
          "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
      } as React.CSSProperties;

  return (
    <div
      className={
        dark
          ? "hearst-plus-theme hearst-plus-video-theme min-h-screen bg-black p-4 text-[var(--hp-text-primary)] sm:p-6"
          : "hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-6"
      }
      data-mode={dark ? "dark" : "light"}
      style={lightThemeStyle}
    >
      <div className="mx-auto w-full lg:max-w-[280px]">
        {kind === "videos" ? (
          <TrendingVideoRail
            stories={stories}
            onOpenStory={(story) => setLastOpened(story.title)}
          />
        ) : (
          <TrendingStoryRail
            stories={stories}
            onOpenStory={(story) => setLastOpened(story.title)}
          />
        )}
        <p className="sr-only" role="status">
          {lastOpened ? `Opened ${lastOpened}` : "No story opened."}
        </p>
      </div>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Trending Rails",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct specifications for the exact production right-rail modules. These stories use the same article and video allocation functions as the live Hearst+ app, with deterministic checked-in content. Destination and publication feeds use the ranked article rail; the Hearst+ Videos surface uses the dark video rail. Empty allocations omit the module so the page does not render blank card chrome.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CrossBrandArticles: Story = {
  name: "Cross-brand articles",
  globals: { brand: "hearst-lifestyle" },
  render: () => (
    <TrendingRailExample kind="articles" stories={crossBrandStories} />
  ),
};

export const CrossBrandArticleInteractions: Story = {
  name: "Cross-brand article interactions",
  globals: { brand: "hearst-lifestyle" },
  render: () => (
    <TrendingRailExample kind="articles" stories={crossBrandStories} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      name: "Trending Across Brands",
      level: 2,
    });
    const storyButtons = canvas.getAllByRole("button", {
      name: /^Open story:/,
    });

    await expect(heading).toBeVisible();
    await expect(storyButtons).toHaveLength(5);
    await userEvent.tab();
    await expect(storyButtons[0]).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent(
      `Opened ${crossBrandStories[0].title}`,
    );
  },
};

export const PublicationScopedArticles: Story = {
  name: "Publication-scoped articles",
  globals: { brand: "cosmopolitan" },
  parameters: {
    docs: {
      description: {
        story:
          "Production publication routes retain the shared “Trending Across Brands” title while the allocated stories stay within the selected publication. The compact checked-in fixture supplies three representative Cosmopolitan rows; the production allocator can render up to five.",
      },
    },
  },
  render: () => (
    <TrendingRailExample kind="articles" stories={publicationStories} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const storyButtons = canvas.getAllByRole("button", {
      name: /^Open story:/,
    });
    const brandIcons = canvasElement.querySelectorAll("[data-brand-source-icon]");

    await expect(storyButtons).toHaveLength(publicationStories.length);
    publicationStories.forEach((story) => {
      expect(story.brand).toBe("Cosmopolitan");
    });
    await expect(canvas.getAllByText("Cosmopolitan", { exact: true })).toHaveLength(
      publicationStories.length,
    );
    await expect(brandIcons).toHaveLength(publicationStories.length);
    await expect(canvas.queryByText(/Cosmopolitan ·/)).not.toBeInTheDocument();
  },
};

export const VideoRail: Story = {
  name: "Trending videos",
  globals: { brand: "hearst-all" },
  render: () => (
    <TrendingRailExample kind="videos" stories={trendingVideos} />
  ),
};

export const VideoRailInteractions: Story = {
  name: "Trending video interactions",
  globals: { brand: "hearst-all" },
  render: () => (
    <TrendingRailExample kind="videos" stories={trendingVideos} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      name: "Trending videos",
      level: 2,
    });
    const videoButtons = canvas.getAllByRole("button", {
      name: /^Trending video/,
    });

    await expect(heading).toBeVisible();
    await expect(videoButtons).toHaveLength(4);
    await userEvent.click(videoButtons[0]);
    await expect(canvas.getByRole("status")).toHaveTextContent(
      `Opened ${trendingVideos[0].title}`,
    );
  },
};

export const EmptyAllocation: Story = {
  name: "Empty allocation (omitted)",
  globals: { brand: "hearst-lifestyle" },
  parameters: {
    docs: {
      description: {
        story:
          "When ranking cannot preserve enough inventory for the river, production omits the optional trending module instead of rendering an empty card.",
      },
    },
  },
  render: () => <TrendingRailExample kind="articles" stories={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("heading", { name: "Trending Across Brands" }),
    ).not.toBeInTheDocument();
  },
};
