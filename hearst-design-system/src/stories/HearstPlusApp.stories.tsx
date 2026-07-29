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
          "The integrated React and Next.js Hearst+ reader used by `/hearst-plus/`. This Storybook version uses the generated production-aligned Lifestyle, Autos, Fashion & Luxury, and Enthusiast & Wellness fixture, the HDS token bridge, and browser-local demo personalization. The Videos destination remains present using the labeled deterministic Storybook clip.",
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

export const SavedCarouselReaderFocus: Story = {
  name: "Saved carousel reader focus",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HearstPlusStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const carousel = await canvas.findByRole("article", {
      name: "Today’s Picks",
    });
    const carouselCanvas = within(carousel);
    const firstSelector = carousel.querySelector<HTMLButtonElement>(
      'button[aria-label^="Show story 1:"]'
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

    const saveButton = carouselCanvas.getByRole("button", { name: "Save" });
    saveButton.focus();
    await userEvent.keyboard(" ");
    const savedButton = carouselCanvas.getByRole("button", { name: "Saved" });
    await expect(savedButton).toHaveAttribute("aria-pressed", "true");
    await expect(savedButton).toHaveFocus();

    opener!.focus();
    await userEvent.keyboard("{Enter}");
    const reader = await within(document.body).findByRole("dialog", {
      name: "Story reader",
    });
    // Production ranking can move the opener to an inactive slide while the
    // reader is open. Reproduce that DOM contract and keep the return target
    // tied to the same story selector.
    Array.from(document.querySelectorAll<HTMLElement>("[aria-label]"))
      .filter((element) => element.getAttribute("aria-label") === openerLabel)
      .forEach((element) => {
        element.setAttribute("aria-hidden", "true");
        element.setAttribute("inert", "");
      });
    await userEvent.click(
      within(reader).getByRole("button", { name: "Close story reader" })
    );

    await waitFor(() => {
      const matchingSelector = Array.from(
        carousel.querySelectorAll<HTMLButtonElement>(
          'button[aria-label^="Show story "]'
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
    const utilityBar = canvasElement.querySelector<HTMLElement>(
      '[class*="component-navigation-utility-background-knockout"]'
    );
    const sectionNavigation = canvas.getByRole("navigation", {
      name: "Hearst Magazines sections",
    });
    const masthead = sectionNavigation.parentElement?.previousElementSibling;
    const videosLink = sectionNavigation.querySelector<HTMLAnchorElement>(
      'a[href="/hearst-plus/videos/"]'
    );

    await expect(theme).not.toBeNull();
    await expect(theme!).toHaveClass("hearst-plus-video-theme");
    await expect(utilityBar).not.toBeNull();
    await expect(utilityBar!).toHaveClass(
      "bg-[var(--component-navigation-utility-background-knockout)]"
    );
    await expect(masthead).not.toBeNull();
    await expect(masthead!).toHaveClass(
      "bg-[var(--component-video-feed-background-default)]",
    );
    await expect(getComputedStyle(masthead!).backgroundColor).toBe("rgb(0, 0, 0)");
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
