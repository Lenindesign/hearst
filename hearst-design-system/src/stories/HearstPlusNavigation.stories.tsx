import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
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

function NavigationExample({ brandSlug, darkMode = false }: { brandSlug: string; darkMode?: boolean }) {
  const [activeFilter, setActiveFilter] = React.useState("For You");
  const selectedTheme = themeOptions.find((theme) => theme.slug === brandSlug);
  const selectedBrand = selectedTheme && !destinationThemeSlugs.has(brandSlug) && brandSlug !== "white-label"
    ? { name: selectedTheme.name, slug: selectedTheme.slug }
    : null;
  const searchStories = getComponentStoriesForBrand(brandSlug);

  return (
    <div className={darkMode ? "dark min-h-[260px] bg-black" : "min-h-[260px] bg-[var(--hp-page)]"}>
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
          "The shared Hearst+ utility bar, masthead, destination navigation, search, and responsive menu. The dark story covers the scoped Videos exception without changing other destinations.",
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
    <NavigationExample key={context.globals.brand} brandSlug={context.globals.brand} darkMode />
  ),
};
