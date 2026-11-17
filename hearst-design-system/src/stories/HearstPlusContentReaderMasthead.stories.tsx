import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  ContentReaderMasthead,
  type ContentReaderFilterItem,
  type ContentReaderMastheadItem,
} from "@/components/hearst-plus";
import {
  getHearstBrandRoute,
  getHearstBrandSection,
  getHearstDestinationRoute,
  hearstDestinationCategoryLabels,
  hearstReaderSectionLabels,
  hearstReaderSections,
  hearstSectionThemeSlugs,
  type HearstBrandSection,
} from "@/lib/hearst-routes";
import { storyMatchesLifestyleFilter } from "@/lib/story-feed-filter";
import {
  getComponentStoriesForBrand,
  getComponentStoryForBrand,
} from "./hearst-plus-component-fixtures";
import { hearstPlusStoryData } from "./hearst-plus-story-data";
import { setReaderEndOfArticle, setReaderPresentation } from "@/components/hearst-plus/reader-presentation";

interface ContentReaderMastheadExampleProps {
  brandSlug?: string;
  destination?: HearstBrandSection;
  origin?: "publication" | "destination";
  showLoadingState?: boolean;
  showEndOfArticleToggle?: boolean;
}

function getReaderFilters(destination: HearstBrandSection) {
  return hearstDestinationCategoryLabels[destination].filter(
    (filter) => filter !== "Videos" && filter !== "Saved",
  );
}

function ContentReaderMastheadExample({
  brandSlug = "delish",
  destination = "lifestyle",
  origin = "publication",
  showLoadingState = false,
  showEndOfArticleToggle = false,
}: ContentReaderMastheadExampleProps) {
  const sourceStory = getComponentStoryForBrand(brandSlug);
  const activeDestination = origin === "publication"
    ? getHearstBrandSection(sourceStory.brandSlug)
    : destination;
  const readerFilters = getReaderFilters(activeDestination);
  const initialFilter = readerFilters.find(
    (filter) =>
      filter !== "For You"
      && storyMatchesLifestyleFilter(sourceStory, filter),
  ) ?? "For You";
  const initialMastheadKey = origin === "publication"
    ? sourceStory.brandSlug
    : activeDestination;
  const [activeMastheadKey, setActiveMastheadKey] = React.useState(
    initialMastheadKey,
  );
  const [activeFilter, setActiveFilter] = React.useState(initialFilter);
  const [lastAction, setLastAction] = React.useState("No action selected");
  const publicationStories = getComponentStoriesForBrand(sourceStory.brandSlug);
  const scopedStories = origin === "publication"
    ? publicationStories
    : hearstPlusStoryData[activeDestination].stories;
  const loadingKey = showLoadingState
    ? hearstPlusStoryData[activeDestination].sourceNotes.find(
        (note) => note.brandSlug !== sourceStory.brandSlug,
      )?.brandSlug
    : undefined;
  const mastheadItems: ContentReaderMastheadItem[] = origin === "publication"
    ? hearstPlusStoryData[activeDestination].sourceNotes.map((note) => ({
        key: note.brandSlug,
        label: note.brand,
        active: activeMastheadKey === note.brandSlug,
        disabled: loadingKey === note.brandSlug,
        loading: loadingKey === note.brandSlug,
      }))
    : hearstReaderSections.map((section) => ({
        key: section.mode,
        label: section.label,
        active: activeMastheadKey === section.mode,
        disabled: false,
      }));
  const filterItems: ContentReaderFilterItem[] = readerFilters.map((filter) => ({
    label: filter,
    active: activeFilter === filter,
    disabled:
      filter !== "For You"
      && !scopedStories.some((story) =>
        storyMatchesLifestyleFilter(story, filter)
      ),
  }));
  const contextLabel = origin === "publication"
    ? sourceStory.brand
    : hearstReaderSectionLabels[activeDestination];
  const logoSlug = origin === "publication"
    ? sourceStory.brandSlug
    : hearstSectionThemeSlugs[activeDestination];
  const logoHref = origin === "publication"
    ? getHearstBrandRoute(sourceStory.brandSlug)
    : getHearstDestinationRoute(activeDestination);
  const readerMode = activeDestination === "flux" ? "dark" : "light";

  return (
    <div
      className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-foreground"
      data-mode={readerMode}
    >
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[8px] border border-border bg-background shadow-sm">
        <ContentReaderMasthead
          showEndOfArticleToggle={showEndOfArticleToggle}
          logoHref={logoHref}
          contextLabel={contextLabel}
          logoSlug={logoSlug}
          logoColor={
            activeDestination === "flux"
              ? "#ffffff"
              : logoSlug === "motortrend"
                ? "#E90C17"
                : undefined
          }
          visibleStoryCount={1}
          storyCount={Math.max(1, scopedStories.length)}
          activeMastheadKey={activeMastheadKey}
          mastheadItems={mastheadItems}
          mastheadNavigationLabel={
            origin === "publication"
              ? `${hearstReaderSectionLabels[activeDestination]} publications`
              : "Hearst destinations"
          }
          filterItems={filterItems}
          sectionLabel={hearstReaderSectionLabels[activeDestination]}
          onSelectMastheadItem={(key) => {
            setActiveMastheadKey(key);
            setLastAction(`Selected masthead item: ${key}`);
          }}
          onSelectFilter={(filter) => {
            setActiveFilter(filter);
            setLastAction(`Selected filter: ${filter}`);
          }}
          onClose={() => setLastAction("Close reader")}
        />
        <div className="p-5 text-sm text-muted-foreground" aria-live="polite">
          {lastAction}
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Reader Masthead",
  component: ContentReaderMastheadExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct specification for the production Content Reader masthead. Publication identity, destination identity, loaded-story status, ordered scope navigation, contextual filters, loading feedback, link naming, and responsive dismissal all use the same component rendered by the routed reader.",
      },
    },
  },
} satisfies Meta<typeof ContentReaderMastheadExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicationScope: Story = {
  name: "Publication scope",
  render: (_args, context) => (
    <ContentReaderMastheadExample
      key={context.globals.brand}
      brandSlug={
        context.globals.brand === "hearst-all"
          ? "delish"
          : context.globals.brand
      }
    />
  ),
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const expectedStory = getComponentStoryForBrand(
      globals.brand === "hearst-all" ? "delish" : globals.brand,
    );
    const expectedDestination = getHearstBrandSection(expectedStory.brandSlug);
    const expectedDestinationLabel =
      hearstReaderSectionLabels[expectedDestination];
    await expect(
      canvas.getByRole("link", {
        name: `Go to ${expectedStory.brand} homepage`,
      }),
    ).toHaveAttribute(
      "href",
      getHearstBrandRoute(expectedStory.brandSlug),
    );
    await expect(
      canvas.getByText(/^Reading \d+ of \d+ stories$/),
    ).toBeVisible();
    await expect(
      canvas.getByRole("navigation", {
        name: `${expectedDestinationLabel} publications`,
      }),
    ).toBeVisible();
    const activeBrand = canvasElement.querySelector<HTMLButtonElement>(
      `[data-reader-masthead-key="${expectedStory.brandSlug}"]`,
    );
    await expect(activeBrand).not.toBeNull();
    await expect(activeBrand).toHaveAttribute("aria-current", "page");
    const siblingBrand = Array.from(
      canvasElement.querySelectorAll<HTMLButtonElement>(
        "[data-reader-masthead-key]",
      ),
    ).find((button) => button !== activeBrand && !button.disabled);
    await expect(siblingBrand).toBeDefined();
    const defaultFilter = canvas.getByRole("button", { name: "For You" });
    await userEvent.click(defaultFilter);
    await expect(defaultFilter).toHaveAttribute("aria-current", "page");
    const contextualFilter = Array.from(
      canvasElement.querySelectorAll<HTMLButtonElement>(
        `nav[aria-label="${expectedDestinationLabel} reader sections"] button`,
      ),
    ).find((button) => button.textContent !== "For You" && !button.disabled);
    if (contextualFilter) {
      await userEvent.click(contextualFilter);
      await expect(contextualFilter).toHaveAttribute("aria-current", "page");
    }
  },
};

export const DestinationScope: Story = {
  name: "Destination scope: Fashion & Luxury",
  render: () => (
    <ContentReaderMastheadExample
      destination="flux"
      origin="destination"
    />
  ),
  globals: {
    brand: "hearst-flux",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("link", {
        name: "Go to Fashion & Luxury homepage",
      }),
    ).toHaveAttribute("href", "/hearst-flux/");
    await expect(
      canvas.getByRole("navigation", {
        name: "Fashion & Luxury reader sections",
      }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("navigation", {
        name: "Hearst destinations",
      }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", {
        name: "Show Fashion & Luxury stories in reader",
      }),
    ).toHaveAttribute("aria-current", "page");
  },
};

export const LoadingPublication: Story = {
  name: "Loading sibling publication",
  render: () => (
    <ContentReaderMastheadExample
      brandSlug="delish"
      showLoadingState
    />
  ),
  globals: {
    brand: "delish",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loadingButton = canvas.getByRole("button", {
      name: /^Loading .* stories$/,
    });
    await expect(loadingButton).toBeDisabled();
    await expect(loadingButton).toHaveAttribute("aria-busy", "true");
    await expect(
      within(loadingButton).getByRole("status"),
    ).toHaveTextContent(/^Loading .* stories$/);
  },
};

export const MobilePublication: Story = {
  name: "Responsive: Mobile publication",
  render: () => <ContentReaderMastheadExample brandSlug="delish" />,
  globals: {
    brand: "delish",
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const closeButton = canvas.getByRole("button", {
      name: "Close story reader",
    });
    const closeTarget = closeButton.getBoundingClientRect();
    await expect(closeTarget.width).toBeGreaterThanOrEqual(44);
    await expect(closeTarget.height).toBeGreaterThanOrEqual(44);
    await userEvent.click(closeButton);
    await expect(canvas.getByText("Close reader")).toBeVisible();
  },
};

export const PresentationToggle: Story = {
  name: "Modal or full-page toggle",
  render: () => <ContentReaderMastheadExample brandSlug="delish" />,
  globals: {
    brand: "delish",
  },
  play: async ({ canvasElement }) => {
    setReaderPresentation("modal");
    const canvas = within(canvasElement);
    const toggle = await canvas.findByRole("button", {
      name: "View stories on a full page",
    });
    await expect(toggle).toHaveAttribute("title", "Full page");
    // The toggle sits directly left of Close.
    await expect(toggle.nextElementSibling).toHaveAttribute(
      "aria-label",
      "Close story reader",
    );
    await userEvent.click(toggle);
    const modalToggle = await canvas.findByRole("button", {
      name: "View stories in a modal",
    });
    await expect(modalToggle).toHaveAttribute("title", "Modal");
    await userEvent.click(modalToggle);
    await expect(
      await canvas.findByRole("button", { name: "View stories on a full page" }),
    ).toBeVisible();
  },
};

export const EndOfArticleToggle: Story = {
  name: "Next story or related stories toggle",
  render: () => (
    <ContentReaderMastheadExample brandSlug="delish" showEndOfArticleToggle />
  ),
  globals: {
    brand: "delish",
  },
  play: async ({ canvasElement }) => {
    setReaderEndOfArticle("next");
    setReaderPresentation("modal");
    const canvas = within(canvasElement);
    const toggle = await canvas.findByRole("button", {
      name: "Show related stories at the end of each article",
    });
    await expect(toggle).toHaveAttribute("title", "Related stories");
    // The toggle sits directly left of the modal / full-page toggle.
    await expect(toggle.nextElementSibling).toHaveAttribute(
      "aria-label",
      "View stories on a full page",
    );
    await userEvent.click(toggle);
    const nextToggle = await canvas.findByRole("button", {
      name: "Show the next story at the end of each article",
    });
    await expect(nextToggle).toHaveAttribute("title", "Next story");
    await userEvent.click(nextToggle);
  },
};
