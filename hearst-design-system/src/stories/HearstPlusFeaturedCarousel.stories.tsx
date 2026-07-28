import React from "react";
import Image from "next/image";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { FeaturedStoryCarousel } from "@/components/hearst-plus";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

const distinctBrandStories = hearstPlusStoryData.all.stories.reduce<
  LifestyleRiverStory[]
>((selected, story) => {
  if (
    selected.length < 5 &&
    !selected.some((item) => item.brandSlug === story.brandSlug)
  ) {
    selected.push(story);
  }
  return selected;
}, []);

const editorialStories = distinctBrandStories.slice(0, 3);
const currentArticle = {
  ...distinctBrandStories[3],
  id: `live-storybook-article-${distinctBrandStories[3].id}`,
} satisfies LifestyleRiverStory;
const currentVideo = {
  ...distinctBrandStories[4],
  id: `live-storybook-video-${distinctBrandStories[4].id}`,
  mediaKind: "video",
  videoUrl: "/storybook-video-fixture.mp4",
  videoDuration: 5,
  videoWidth: 960,
  videoHeight: 540,
} satisfies LifestyleRiverStory;
const mixedStories = [
  currentVideo,
  ...editorialStories,
  currentArticle,
] satisfies LifestyleRiverStory[];

const delishPalette = [
  "var(--palette-brand-1)",
  "var(--palette-brand-2)",
  "var(--palette-brand-3)",
  "var(--palette-brand-4)",
  "var(--palette-brand-5)",
];

function StoryImage({
  story,
  active,
}: {
  story: LifestyleRiverStory;
  active: boolean;
}) {
  return (
    <Image
      src={story.image}
      alt={`${story.brand}: ${story.title}`}
      width={1200}
      height={675}
      sizes="(max-width: 640px) 100vw, 720px"
      className="h-full w-full bg-muted object-cover"
      preload={active}
    />
  );
}

function FeaturedCarouselExample({
  stories = mixedStories,
  editionLabel = "Today’s Picks",
  featuredMode = false,
  initialStoryId,
  initialSavedIds = [],
  indicatorPalette,
}: {
  stories?: LifestyleRiverStory[];
  editionLabel?: string;
  featuredMode?: boolean;
  initialStoryId?: string;
  initialSavedIds?: string[];
  indicatorPalette?: readonly string[];
}) {
  const [savedIds, setSavedIds] = React.useState(initialSavedIds);
  const [openedStoryId, setOpenedStoryId] = React.useState("");
  const [moreLikeStoryId, setMoreLikeStoryId] = React.useState("");
  const [followedBrand, setFollowedBrand] = React.useState("");
  const [activeStoryId, setActiveStoryId] = React.useState("");
  const [impressionCount, setImpressionCount] = React.useState(0);

  const handleSave = React.useCallback((story: LifestyleRiverStory) => {
    setSavedIds((current) =>
      current.includes(story.id)
        ? current.filter((id) => id !== story.id)
        : [...current, story.id],
    );
  }, []);
  const handleOpen = React.useCallback((story: LifestyleRiverStory) => {
    setOpenedStoryId(story.id);
  }, []);
  const handleMoreLikeThis = React.useCallback((story: LifestyleRiverStory) => {
    setMoreLikeStoryId(story.id);
  }, []);
  const handleFollow = React.useCallback((brand: string) => {
    setFollowedBrand(brand);
  }, []);
  const handleActiveStoryChange = React.useCallback(
    (story: LifestyleRiverStory) => {
      setActiveStoryId(story.id);
    },
    [],
  );
  const handleEditionImpression = React.useCallback(() => {
    setImpressionCount((count) => count + 1);
  }, []);

  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-6">
      <div className="mx-auto w-full max-w-[720px]">
        <FeaturedStoryCarousel
          stories={stories}
          editionLabel={featuredMode ? undefined : editionLabel}
          initialStoryId={initialStoryId}
          savedIds={savedIds}
          renderImage={(story, _index, active) => (
            <StoryImage story={story} active={active} />
          )}
          onOpenStory={handleOpen}
          onSave={handleSave}
          onMoreLikeThis={handleMoreLikeThis}
          onFollowBrand={handleFollow}
          onActiveStoryChange={handleActiveStoryChange}
          onEditionImpression={handleEditionImpression}
          indicatorPalette={indicatorPalette}
        />
      </div>
      {stories.length === 0 ? (
        <p
          role="status"
          className="mx-auto max-w-[720px] text-sm text-muted-foreground"
        >
          The featured carousel is omitted when no eligible stories are
          available.
        </p>
      ) : null}
      <div className="sr-only">
        <p role="status" aria-label="Opened story">
          {openedStoryId || "No story opened."}
        </p>
        <p role="status" aria-label="More-like-this story">
          {moreLikeStoryId || "No preference recorded."}
        </p>
        <p role="status" aria-label="Followed brand">
          {followedBrand || "No brand followed."}
        </p>
        <p role="status" aria-label="Active story">
          {activeStoryId || "No active story."}
        </p>
        <p role="status" aria-label="Edition impressions">
          {impressionCount}
        </p>
      </div>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Featured Carousel",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct specification for the production featured-story carousel. The Hearst+ For You route labels the five-story mixed-format edition Today’s Picks; destination and publication routes use the same anatomy as Featured stories. The component owns carousel behavior, active-slide semantics, actions, motion preferences, clamps, and responsive layout while the feed supplies ranked stories and production imagery.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TodaysPicks: Story = {
  name: "Today’s Picks: mixed edition",
  globals: { brand: "hearst-all" },
  render: () => <FeaturedCarouselExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const carousel = canvas.getByRole("article", { name: "Today’s Picks" });
    const slides = carousel.querySelectorAll(
      'button[aria-label^="Open story:"]',
    );
    const selectors = within(carousel).getAllByRole("button", {
      name: /^Show story /,
    });

    await expect(slides).toHaveLength(5);
    await expect(selectors).toHaveLength(5);
    await expect(
      carousel.querySelectorAll(
        'button[aria-label^="Open story:"][aria-hidden="false"]',
      ),
    ).toHaveLength(1);
    await expect(
      carousel.querySelector('[data-media-kind="video"]'),
    ).toHaveAttribute("data-feed-source", "current");
    await waitFor(async () => {
      await expect(
        canvas.getByRole("status", { name: "Edition impressions" }),
      ).toHaveTextContent("1");
    });
  },
};

export const Interactions: Story = {
  name: "Interactions and active-slide semantics",
  globals: { brand: "hearst-all" },
  render: () => <FeaturedCarouselExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const carousel = canvas.getByRole("article", { name: "Today’s Picks" });
    const secondSelector = within(carousel).getByRole("button", {
      name: `Show story 2: ${mixedStories[1].title}`,
    });

    secondSelector.focus();
    await waitFor(async () => {
      await expect(
        within(carousel).getByRole("button", { name: "Resume slider" }),
      ).toBeVisible();
    });
    const featuredStoryStatus = within(carousel).getByRole("status", {
      name: "Featured story status",
    });
    await expect(featuredStoryStatus).toHaveAttribute("aria-live", "polite");
    await userEvent.keyboard("{Enter}");
    await expect(secondSelector).toHaveFocus();
    await expect(secondSelector).toHaveAttribute("aria-current", "true");

    const secondSlide = carousel.querySelector(
      `[data-story-id="${mixedStories[1].id}"]`,
    );
    await expect(secondSlide).toHaveAttribute("aria-hidden", "false");
    await expect(secondSlide).not.toHaveAttribute("inert");
    await expect(secondSlide).toHaveAttribute("tabindex", "0");
    await expect(
      canvas.getByRole("status", { name: "Active story" }),
    ).toHaveTextContent(mixedStories[1].id);
    await expect(featuredStoryStatus).toHaveTextContent(
      `Story 2 of 5: ${mixedStories[1].title}`,
    );

    await userEvent.click(
      within(carousel).getByRole("button", { name: "Save" }),
    );
    await expect(
      within(carousel).getByRole("button", { name: "Saved" }),
    ).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(
      within(carousel).getByRole("button", { name: "More like this" }),
    );
    await expect(
      canvas.getByRole("status", { name: "More-like-this story" }),
    ).toHaveTextContent(mixedStories[1].id);

    await userEvent.click(
      within(carousel).getByRole("button", {
        name: `Follow ${mixedStories[1].brand}`,
      }),
    );
    await expect(
      canvas.getByRole("status", { name: "Followed brand" }),
    ).toHaveTextContent(mixedStories[1].brand);

    await userEvent.click(secondSlide as HTMLElement);
    await expect(
      canvas.getByRole("status", { name: "Opened story" }),
    ).toHaveTextContent(mixedStories[1].id);
  },
};

export const Mobile: Story = {
  name: "Responsive: mobile",
  globals: {
    brand: "hearst-all",
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  render: () => <FeaturedCarouselExample />,
  play: async ({ canvasElement }) => {
    const carousel = within(canvasElement).getByRole("article", {
      name: "Today’s Picks",
    });
    const carouselCanvas = within(carousel);

    await expect(
      carouselCanvas.getByRole("button", { name: "Pause slider" }),
    ).toHaveClass("h-11", "w-11");
    for (const selector of carouselCanvas.getAllByRole("button", {
      name: /^Show story /,
    })) {
      await expect(selector).toHaveClass("h-11", "w-11");
    }
    await expect(document.documentElement.scrollWidth).toBe(
      document.documentElement.clientWidth,
    );
  },
};

export const SavedStory: Story = {
  name: "Selected: saved story",
  globals: { brand: "hearst-all" },
  render: () => (
    <FeaturedCarouselExample initialSavedIds={[mixedStories[0].id]} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: "Saved" }),
    ).toHaveAttribute("aria-pressed", "true");
  },
};

export const PublicationFeaturedStories: Story = {
  name: "Publication: featured stories",
  globals: { brand: "delish" },
  render: () => (
    <FeaturedCarouselExample featuredMode indicatorPalette={delishPalette} />
  ),
  play: async ({ canvasElement }) => {
    const carousel = within(canvasElement).getByRole("article", {
      name: "Featured stories",
    });
    await expect(carousel).toHaveAttribute("data-story-module", "featured");
    await expect(
      within(carousel).getAllByRole("button", { name: /^Show story / }),
    ).toHaveLength(5);
  },
};

export const SingleStory: Story = {
  name: "Fallback: single story",
  globals: { brand: "hearst-all" },
  render: () => <FeaturedCarouselExample stories={[mixedStories[1]]} />,
  play: async ({ canvasElement }) => {
    const carousel = within(canvasElement).getByRole("article", {
      name: "Today’s Picks",
    });
    const carouselCanvas = within(carousel);

    await expect(
      carouselCanvas.queryByRole("button", { name: "Previous featured story" }),
    ).not.toBeInTheDocument();
    await expect(
      carouselCanvas.queryByRole("button", { name: "Pause slider" }),
    ).not.toBeInTheDocument();
    await expect(
      carouselCanvas.queryByRole("button", { name: "Next featured story" }),
    ).not.toBeInTheDocument();
  },
};

export const Empty: Story = {
  name: "Empty: no eligible stories",
  globals: { brand: "hearst-all" },
  render: () => <FeaturedCarouselExample stories={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("article", { name: "Today’s Picks" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByText(
        "The featured carousel is omitted when no eligible stories are available.",
      ),
    ).toBeVisible();
  },
};
