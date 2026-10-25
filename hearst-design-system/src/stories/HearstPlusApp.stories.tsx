import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { HomePageTemplate } from "@/components/hearst-plus";
import { ThemeProvider } from "@/components/theme-provider";
import {
  hearstPlusStoryData,
  hearstPlusVideoStoryData,
} from "./hearst-plus-story-data";
import { ReaderAccountStoryBoundary } from "./support/reader-account-story-boundary";

function HearstPlusStory({ initialFilter }: { initialFilter?: string }) {
  return (
    <ReaderAccountStoryBoundary>
      <div style={{ minHeight: "100vh" }}>
        <ThemeProvider defaultBrandSlug="hearst-all" persistColorMode={false}>
          <HomePageTemplate
            staticDestinationData={hearstPlusStoryData}
            videoFeedData={hearstPlusVideoStoryData.all}
            initialFilter={initialFilter}
          />
        </ThemeProvider>
      </div>
    </ReaderAccountStoryBoundary>
  );
}

const meta: Meta<typeof HearstPlusStory> = {
  title: "Hearst Plus/Product/For You Feed",
  component: HearstPlusStory,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production React feed template used by `/hearst-plus/`, shown here with generated Lifestyle, Autos, Fashion & Luxury, and Enthusiast & Wellness fixtures, the HDS token bridge, and browser-local demo personalization. This Storybook composition does not invoke the route's live feed or recommendation endpoints. The Videos destination uses the labeled deterministic Storybook clip.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HearstPlusStory>;

export const ForYouFeed: Story = {
  name: "For You Feed",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HearstPlusStory />,
};

export const CarouselReaderFocusRestoration: Story = {
  name: "Carousel reader focus restoration",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HearstPlusStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const carousel = await canvas.findByRole("article", {
      name: "Today’s Picks",
    });
    const firstSelector = carousel.querySelector<HTMLButtonElement>(
      'button[aria-label^="Open story:"][aria-hidden="false"]'
    );

    await expect(firstSelector).not.toBeNull();
    firstSelector!.focus();
    await userEvent.keyboard("{Enter}");

    const opener = carousel.querySelector<HTMLButtonElement>(
      'button[aria-label^="Open story:"][aria-hidden="false"]'
    );
    await expect(opener).not.toBeNull();
    const openerLabel = opener!.getAttribute("aria-label");
    const storyTitle = openerLabel?.slice("Open story: ".length);
    await expect(storyTitle).toBeTruthy();

    const reader = await within(document.body).findByRole("dialog", {
      name: "Story reader",
    });
    // Preserve the production trigger state while the reader is open so the
    // close action can restore focus to the original story.
    await userEvent.click(
      within(reader).getByRole("button", { name: "Close story reader" })
    );

    await waitFor(() => {
      const matchingSelector = Array.from(
        carousel.querySelectorAll<HTMLButtonElement>(
          'button[aria-label^="Open story:"][aria-hidden="false"]'
        )
      ).find((element) =>
        element.getAttribute("aria-label")?.endsWith(`: ${storyTitle}`)
      );
        expect(matchingSelector).toHaveFocus();
    }, { timeout: 3500 });
  },
};

export const RiverReaderReturnContext: Story = {
  name: "River reader return context",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HearstPlusStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("main", { name: /Hearst/ });

    const getRiverCards = () =>
      Array.from(
        canvasElement.querySelectorAll<HTMLElement>(
          "#hearst-story-river article[data-story-id]"
        )
      );
    await waitFor(() => expect(getRiverCards().length).toBeGreaterThan(2));

    const targetCard = getRiverCards()[2];
    const targetStoryId = targetCard.dataset.storyId;
    const opener = targetCard.querySelector<HTMLButtonElement>(
      'button[aria-label^="Open story:"], button[aria-label^="Open photo gallery:"]'
    );

    await expect(targetStoryId).toBeTruthy();
    await expect(opener).not.toBeNull();
    targetCard.scrollIntoView({ block: "center" });
    const beforeTop = Math.round(targetCard.getBoundingClientRect().top);
    const beforeIndex = getRiverCards().findIndex(
      (card) => card.dataset.storyId === targetStoryId
    );

    await userEvent.click(opener!);
    const reader = await within(document.body).findByRole("dialog", {
      name: "Story reader",
    });
    await userEvent.click(
      within(reader).getByRole("button", { name: "Close story reader" })
    );

    await waitFor(() => {
      const returnedCards = getRiverCards();
      const returnedCard = returnedCards.find(
        (card) => card.dataset.storyId === targetStoryId
      );
      expect(returnedCard).toBeTruthy();
      expect(returnedCards.findIndex((card) => card.dataset.storyId === targetStoryId))
        .toBe(beforeIndex);
      expect(Math.abs(Math.round(returnedCard!.getBoundingClientRect().top) - beforeTop))
        .toBeLessThanOrEqual(2);
      expect(opener!).toHaveFocus();
    }, { timeout: 3500 });
  },
};

export const VideosFeed: Story = {
  name: "Videos Feed",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HearstPlusStory initialFilter="Videos" />,
  parameters: {
    docs: {
      description: {
        story:
          "The production Videos destination with its scoped dark theme, deterministic landscape and portrait video fixtures, responsive river, supporting rails, and shared reader overlay. The story runs through the same production queue model that reconciles source filters, promotes Delish Shorts without duplication, and selects the lead, recommended, and trending video sets.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const videoMain = await canvas.findByRole("main", { name: "Hearst videos" });
    const theme = videoMain.closest("[data-mode='dark']");
    const sectionNavigation = canvas.getByRole("navigation", {
      name: "Hearst Magazines sections",
    });
    const videoSurface = theme;
    const videosLink = sectionNavigation.querySelector<HTMLAnchorElement>(
      'a[href="/hearst-plus/videos/"]'
    );

    await expect(theme).not.toBeNull();
    await expect(theme!).toHaveClass("hearst-plus-video-theme");
    await expect(videoSurface).not.toBeNull();
    await expect(videoSurface!).toHaveClass("bg-black");
    await expect(getComputedStyle(videoSurface!).backgroundColor).toBe("rgb(0, 0, 0)");
    await expect(videosLink).not.toBeNull();
    await expect(videosLink!).toHaveAttribute("aria-current", "page");
    await expect(
      canvas.getByRole("heading", { name: "Recommended videos" })
    ).toBeVisible();
    await expect(
      canvas.getByRole("heading", { name: "Delish Shorts" })
    ).toBeVisible();
    await expect(canvas.getByTestId("vertical-video-carousel")).toBeVisible();
    await expect(
      canvas.getByText(
        "Prototype note: videos use available source media in this demo; caption and transcript coverage remains a production content requirement."
      )
    ).toBeInTheDocument();

    const leadStoryHeading = canvas.getAllByRole("heading", { level: 1 })[0];
    const leadStoryTrigger = leadStoryHeading.closest("button");

    await expect(leadStoryTrigger).not.toBeNull();
    await expect(leadStoryTrigger!).toHaveAccessibleName(/^Open story: /);
    await userEvent.click(leadStoryTrigger!);

    const reader = await within(document.body).findByRole("dialog", {
      name: "Story reader",
    });
    await userEvent.click(
      within(reader).getByRole("button", { name: "Close story reader" })
    );
    await waitFor(() => expect(leadStoryTrigger!).toHaveFocus(), {
      timeout: 3500,
    });
  },
};

export const EmptySavedState: Story = {
  name: "Empty: Saved reading list",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HearstPlusStory initialFilter="Saved" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = await canvas.findByRole("heading", {
      name: "Save stories to build your reading list.",
    });
    const emptyState = heading.closest("section");

    await expect(emptyState).not.toBeNull();
    const emptyStateCanvas = within(emptyState!);
    await expect(emptyStateCanvas.getByRole("button", { name: "Browse For You" })).toBeVisible();
    await expect(emptyStateCanvas.getAllByRole("article")).toHaveLength(3);

    await userEvent.click(emptyStateCanvas.getAllByRole("button", { name: /^Save / })[0]);
    await expect(
      canvas.queryByRole("heading", { name: "Save stories to build your reading list." })
    ).not.toBeInTheDocument();
  },
};
