import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  LifestyleDiscoverySidebar,
  type AutosOemFilterOption,
} from "@/components/hearst-plus";
import { ThemeProvider } from "@/components/theme-provider";
import type {
  LifestyleRiverProfile,
  LifestyleRiverStory,
} from "@/components/lifestyle-river-types";
import { brandToCssVars } from "@/lib/theme-css-vars";
import { themeOptions } from "@/lib/theme-options";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

type SidebarMode = "destination" | "publication" | "autos" | "videos";

const lifestyleTopics = [
  { name: "Lifestyle", count: 102 },
  { name: "Style", count: 84 },
  { name: "Home", count: 76 },
  { name: "Food", count: 69 },
  { name: "Entertainment", count: 58 },
  { name: "Wellness", count: 52 },
  { name: "Relationships", count: 46 },
  { name: "Shopping", count: 41 },
];

const publicationInventory = [
  { name: "Cosmopolitan", slug: "cosmopolitan", count: 61 },
  { name: "Country Living", slug: "country-living", count: 57 },
  { name: "Delish", slug: "delish", count: 57 },
  { name: "Good Housekeeping", slug: "good-housekeeping", count: 65 },
  { name: "House Beautiful", slug: "house-beautiful", count: 62 },
  { name: "The Pioneer Woman", slug: "the-pioneer-woman", count: 28 },
  { name: "Prevention", slug: "prevention", count: 62 },
  { name: "Redbook", slug: "redbook", count: 50 },
  { name: "Seventeen", slug: "seventeen", count: 64 },
  { name: "Woman's Day", slug: "womans-day", count: 39 },
];

const destinationBrands = publicationInventory.slice(0, 6);

const autosOemOptions: AutosOemFilterOption[] = [
  { name: "Chevrolet", logo: "/logos/oem/chevrolet.svg", count: 21 },
  { name: "Ford", logo: "/logos/oem/ford.svg", count: 18 },
  { name: "Honda", logo: "/logos/oem/honda.svg", count: 12 },
  { name: "Toyota", logo: "/logos/oem/toyota.svg", count: 16 },
];

const baseProfile: LifestyleRiverProfile = {
  followedTopics: ["Home", "Food"],
  followedBrands: ["Cosmopolitan"],
  savedTags: [],
  boostedTags: [],
  savedIds: [],
  hiddenIds: [],
};

function getTopStories(mode: SidebarMode) {
  const source = mode === "autos" ? hearstPlusStoryData.autos : hearstPlusStoryData.lifestyle;
  return source.stories.slice(0, 3);
}

function DiscoverySidebarExample({
  mode = "destination",
}: {
  mode?: SidebarMode;
}) {
  const [profile, setProfile] = React.useState(baseProfile);
  const [activeBrands, setActiveBrands] = React.useState<string[]>(
    mode === "publication" ? ["Cosmopolitan"] : [],
  );
  const [activeMakes, setActiveMakes] = React.useState<string[]>([]);
  const [lastAction, setLastAction] = React.useState("No interaction yet.");
  const topStories = getTopStories(mode);
  const brands = mode === "publication" ? publicationInventory : destinationBrands;
  const baseThemeSlug =
    mode === "publication"
      ? "hearst-lifestyle"
      : mode === "autos"
        ? "hearst-plus"
        : "hearst-all";
  const baseTheme =
    themeOptions.find((theme) => theme.slug === baseThemeSlug) ?? themeOptions[0];
  const selectedTheme =
    themeOptions.find((theme) =>
      theme.slug === (mode === "publication" ? "cosmopolitan" : "hearst-all"),
    ) ?? themeOptions[0];
  const themeStyle = {
    ...brandToCssVars(baseTheme, "light"),
    ...(mode === "publication" ? brandToCssVars(selectedTheme, "light") : {}),
    "--hp-section-title":
      "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
    "--hp-sidebar-heading":
      "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
  } as React.CSSProperties;

  const toggleBrand = (brandName: string) => {
    setActiveBrands((current) =>
      current.includes(brandName) ? [] : [brandName],
    );
    setLastAction(`Selected ${brandName}`);
  };

  const toggleMake = (makeName: string) => {
    setActiveMakes((current) =>
      current.includes(makeName)
        ? current.filter((name) => name !== makeName)
        : [...current, makeName],
    );
    setLastAction(`Toggled ${makeName}`);
  };

  const followTopic = (topic: string) => {
    setProfile((current) => ({
      ...current,
      followedTopics: current.followedTopics.includes(topic)
        ? current.followedTopics.filter((name) => name !== topic)
        : [...current.followedTopics, topic],
    }));
    setLastAction(`Toggled ${topic}`);
  };

  const openStory = (story: LifestyleRiverStory) => {
    setLastAction(`Opened ${story.title}`);
  };

  return (
    <ThemeProvider
      defaultBrandSlug={baseThemeSlug}
      persistColorMode={false}
    >
      <div
        className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-6 text-[var(--hp-text-primary)]"
        data-filter-brand={mode === "publication" ? "cosmopolitan" : undefined}
        data-mode="light"
        style={themeStyle}
      >
        <div className="mx-auto grid max-w-[1184px] grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <LifestyleDiscoverySidebar
            profile={profile}
            topStories={topStories}
            topics={lifestyleTopics}
            brands={brands}
            brandFilterTitle={
              mode === "publication"
                ? "Global Story Inventory"
                : mode === "videos"
                  ? "Videos by brand"
                  : undefined
            }
            brandFilterFirst={mode === "videos"}
            showBrandCounts={mode !== "videos"}
            globalInventory={mode === "publication"}
            activeBrandFilters={activeBrands}
            autosOemOptions={mode === "autos" ? autosOemOptions : []}
            activeAutosOemFilters={activeMakes}
            collectionLabels={["Dinner ideas", "Weekend projects", "Sleep better"]}
            onToggleBrandFilter={toggleBrand}
            onClearBrandFilters={() => {
              setActiveBrands([]);
              setLastAction("Cleared brand filter");
            }}
            onToggleAutosOemFilter={mode === "autos" ? toggleMake : undefined}
            onClearAutosOemFilters={
              mode === "autos"
                ? () => {
                    setActiveMakes([]);
                    setLastAction("Cleared make filters");
                  }
                : undefined
            }
            onFollowTopic={followTopic}
            onOpenStory={openStory}
          />
          <main className="min-h-[720px] rounded-[8px] border border-dashed border-border bg-[var(--hp-surface)] p-8">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
              Production sidebar specification
            </p>
            <h1 className="mt-3 text-2xl font-bold">
              {mode === "publication"
                ? "Publication inventory state"
                : mode === "autos"
                  ? "Autos discovery state"
                  : mode === "videos"
                    ? "Video source state"
                    : "Destination discovery state"}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              The left rail is the exact production component. This adjacent panel only
              reports interactions so selected, cleared, followed, and story-open states
              can be verified without navigating away from the specification.
            </p>
            <p className="mt-6 text-sm font-bold" role="status">
              {lastAction}
            </p>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

const meta = {
  title: "Hearst Plus/Components/Discovery Sidebar",
  component: DiscoverySidebarExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct specification for the production Hearst+ discovery sidebar. Destination, publication, Autos, and Videos routes import this same component for Daily Habit stories, source filters, complete publication inventory, OEM filters, followed topics, and collections. The current production placement is desktop-only.",
      },
    },
  },
} satisfies Meta<typeof DiscoverySidebarExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DestinationDiscovery: Story = {
  name: "Destination: Daily Habit and filters",
  render: () => <DiscoverySidebarExample mode="destination" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstStory = canvas.getAllByRole("button", { name: /^Open story:/ })[0];
    await userEvent.click(firstStory);
    await expect(canvas.getByRole("status")).toHaveTextContent(/^Opened /);

    await userEvent.click(canvas.getByRole("button", { name: "Country Living 57" }));
    await expect(
      canvas.getByRole("button", { name: "Country Living 57" }),
    ).toHaveAttribute("aria-pressed", "true");
  },
};

export const PublicationInventory: Story = {
  name: "Publication: Global Story Inventory",
  globals: {
    brand: "cosmopolitan",
  },
  render: () => <DiscoverySidebarExample mode="publication" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "House Beautiful 62" }),
    ).toBeInTheDocument();
  },
};

export const PublicationInventoryInteractions: Story = {
  name: "Publication: Selection and clear",
  globals: {
    brand: "cosmopolitan",
  },
  render: () => <DiscoverySidebarExample mode="publication" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectedBrand = canvas.getByRole("button", { name: "Cosmopolitan 61" });
    await expect(selectedBrand).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
    await expect(selectedBrand).toHaveAttribute("aria-pressed", "false");
    await expect(canvas.getByRole("status")).toHaveTextContent("Cleared brand filter");
  },
};

export const AutosMakeFilters: Story = {
  name: "Autos: Make filters",
  render: () => <DiscoverySidebarExample mode="autos" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const makeFilter = canvas.getByRole("button", {
      name: "Filter Autos stories by Toyota",
    });

    await userEvent.click(makeFilter);
    await expect(makeFilter).toHaveAttribute("aria-pressed", "true");

    const topic = canvas.getByRole("button", { name: "Lifestyle" });
    await userEvent.click(topic);
    await expect(topic).toHaveAttribute("aria-pressed", "true");
  },
};

export const VideoBrandFilter: Story = {
  name: "Videos: Brand filter first",
  render: () => <DiscoverySidebarExample mode="videos" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const brandFilter = canvas.getByRole("button", { name: "Delish" });

    await userEvent.click(brandFilter);
    await expect(brandFilter).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("status")).toHaveTextContent("Selected Delish");
  },
};
