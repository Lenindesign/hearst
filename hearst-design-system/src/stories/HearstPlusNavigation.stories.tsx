import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "@storybook/test";
import { MainNav } from "@/components/hearst-plus";
import { themeOptions } from "@/lib/theme-options";
import { hearstPlusStoryData } from "./hearst-plus-story-data";
import { getComponentStoriesForBrand } from "./hearst-plus-component-fixtures";

const mobileBrands = [
  { name: "Cosmopolitan", slug: "cosmopolitan", count: 20 },
  { name: "Car and Driver", slug: "car-and-driver", count: 20 },
  { name: "Delish", slug: "delish", count: 20 },
  { name: "Men's Health", slug: "mens-health", count: 20 },
];

const destinationThemeSlugs = new Set(["hearst-all", "hearst-plus", "hearst-lifestyle", "hearst-flux", "hearst-ew"]);

function NavigationExample({
  brandSlug,
  darkMode = false,
  initialActiveFilter = "For You",
  selectedBrandOverride,
}: {
  brandSlug: string;
  darkMode?: boolean;
  initialActiveFilter?: string;
  selectedBrandOverride?: { name: string; slug: string };
}) {
  const [activeFilter, setActiveFilter] = React.useState(initialActiveFilter);
  const selectedTheme = themeOptions.find((theme) => theme.slug === brandSlug);
  const selectedBrand = selectedBrandOverride ?? (
    selectedTheme && !destinationThemeSlugs.has(brandSlug) && brandSlug !== "white-label"
      ? { name: selectedTheme.name, slug: selectedTheme.slug }
      : null
  );
  const searchStories = getComponentStoriesForBrand(brandSlug);

  return (
    <div className={darkMode ? "dark min-h-screen bg-black" : "min-h-screen bg-[var(--hp-page)]"}>
      <MainNav
        brandSlug={brandSlug}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        selectedBrand={selectedBrand}
        includeVideos
        darkMode={darkMode}
        mobileContinueStories={hearstPlusStoryData.all.stories.slice(0, 3)}
        mobileBrands={mobileBrands}
        searchStories={searchStories}
        activeBrandFilters={[]}
        onMobileStoryOpen={fn()}
        onMobileBrandToggle={fn()}
        onMobileBrandClear={fn()}
      />
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Navigation",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production `MainNav` masthead, topic navigation, search, and responsive menu. The application-level destination switcher is specified separately in Navigation / Utility Bar. The dark story covers the scoped Videos exception without changing other destinations.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DestinationNavigation: Story = {
  name: "Destination navigation",
  render: (_args, context) => <NavigationExample key={context.globals.brand} brandSlug={context.globals.brand} />,
};

export const VideosNavigation: Story = {
  name: "Videos dark navigation",
  render: (_args, context) => (
    <NavigationExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      darkMode
      initialActiveFilter="Videos"
    />
  ),
};

export const MobilePublicationNavigation: Story = {
  name: "Responsive: Mobile publication sections",
  render: () => (
    <div className="w-[320px] max-w-full overflow-hidden">
      <NavigationExample
        brandSlug="hot-rod"
        initialActiveFilter="Events"
        selectedBrandOverride={{ name: "HOT ROD", slug: "hot-rod" }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "The production publication rail with a later active section. The rail reveals the complete preceding label instead of opening on clipped text, keeps the active Events link visible, and retains horizontal access to every section.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sectionNav = canvas.getByRole("navigation", {
      name: "HOT ROD sections",
    });
    const eventsLink = within(sectionNav).getByRole("link", { name: "Events" });
    const scroller = sectionNav.querySelector<HTMLElement>(
      "[data-topic-navigation-scroll]"
    );
    const previousItem = eventsLink.previousElementSibling as HTMLElement | null;
    const leftOverflowCue = sectionNav.querySelector<HTMLElement>(
      '[data-navigation-overflow="left"]'
    );

    await expect(scroller).not.toBeNull();
    await expect(previousItem).not.toBeNull();
    await expect(leftOverflowCue).not.toBeNull();
    await waitFor(() => {
      const scrollerRect = scroller!.getBoundingClientRect();
      const previousRect = previousItem!.getBoundingClientRect();
      const eventsRect = eventsLink.getBoundingClientRect();

      expect(previousRect.left).toBeGreaterThanOrEqual(scrollerRect.left);
      expect(eventsRect.right).toBeLessThanOrEqual(scrollerRect.right);
      expect(leftOverflowCue).toHaveAttribute("data-visible", "true");
    });
  },
};

export const EmptySearchResults: Story = {
  name: "Empty: Search results",
  render: (_args, context) => (
    <NavigationExample key={context.globals.brand} brandSlug={context.globals.brand} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const searchTrigger = canvas.getByRole("button", { name: "Search" });

    await userEvent.click(searchTrigger);
    const dialog = await page.findByRole("dialog", { name: "Search Hearst+" });
    const searchInput = within(dialog).getByRole("combobox", { name: "Search Hearst stories" });
    await waitFor(() => expect(searchInput).toHaveFocus());

    fireEvent.change(searchInput, { target: { value: "no matching hearst story" } });
    await waitFor(() =>
      expect(within(dialog).getByRole("status")).toHaveTextContent(
        "No stories match “no matching hearst story”",
      ),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(searchTrigger).toHaveFocus());
  },
};
