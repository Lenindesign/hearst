import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import {
  TodayEditStrip,
  type TodayEditSelection,
  type TodayEditStory,
} from "@/components/hearst-plus";
import { allocateStoryModules } from "@/lib/story-module-allocation";
import { storybookTodayEditHoroscopeStory } from "./generated/hearst-plus-fixtures";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

const sourceInventory = hearstPlusStoryData.all.stories;
const horoscopeSource = sourceInventory.find((story) =>
  [story.title, ...story.tags].join(" ").toLowerCase().includes("horoscope"),
) ?? sourceInventory.find((story) =>
  [story.title, ...story.tags].join(" ").toLowerCase().includes("zodiac"),
) ?? storybookTodayEditHoroscopeStory;
const horoscopeFallback = sourceInventory.at(-1);
if (!horoscopeSource && !horoscopeFallback) {
  throw new Error("The deterministic Today’s Edit fixture requires at least one story.");
}
const horoscopeCandidate = horoscopeSource ?? {
  ...horoscopeFallback!,
  title: "Your daily horoscope",
  tags: [...horoscopeFallback!.tags, "horoscope"],
};
const inventory = horoscopeSource
  ? sourceInventory.some((story) => story.id === horoscopeSource.id)
    ? sourceInventory
    : [...sourceInventory, horoscopeSource]
  : sourceInventory.map((story) =>
      story.id === horoscopeFallback!.id ? horoscopeCandidate : story);
const heroStoryIds = inventory
  .filter((story) => story.id !== horoscopeCandidate?.id)
  .slice(0, 5)
  .map((story) => story.id);
const continueCandidate = inventory.find(
  (story) =>
    !heroStoryIds.includes(story.id)
    && story.id !== horoscopeCandidate?.id,
) ?? inventory[5];
const followedBrandCandidate = inventory.find(
  (story) =>
    !heroStoryIds.includes(story.id)
    && story.id !== continueCandidate.id
    && story.id !== horoscopeCandidate?.id,
) ?? inventory[6];

const completeSelection = allocateStoryModules({
  stories: inventory,
  heroStoryIds,
  continueStoryIds: [continueCandidate.id],
  followedBrands: [followedBrandCandidate.brand],
}).todayEdit;

if (
  !completeSelection.horoscopeStory
  || !completeSelection.continueStory
  || !completeSelection.followedBrandStory
  || !completeSelection.trendingStory
) {
  throw new Error("The deterministic Today’s Edit fixture must allocate all four modules.");
}

const {
  continueStory,
  followedBrandStory,
  trendingStory,
} = completeSelection;

const firstVisitSelection = allocateStoryModules({
  stories: inventory,
  heroStoryIds,
  continueStoryIds: [],
  followedBrands: [followedBrandCandidate.brand],
}).todayEdit;

const minimalSelection = {
  followedBrandStory,
  trendingStory,
} satisfies TodayEditSelection<TodayEditStory>;

function TodayEditExample({
  selection,
}: {
  selection: TodayEditSelection<TodayEditStory>;
}) {
  const [openedStoryId, setOpenedStoryId] = React.useState("");
  const [continuedStoryId, setContinuedStoryId] = React.useState("");
  const [impressionStoryId, setImpressionStoryId] = React.useState("");

  return (
    <div
      className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-6"
      style={{
        "--hp-section-title":
          "color-mix(in oklab, var(--primary) 78%, var(--foreground) 22%)",
      } as React.CSSProperties}
    >
      <div className="mx-auto w-full max-w-[1184px]">
        <TodayEditStrip
          selection={selection}
          onOpenStory={setOpenedStoryId}
          onContinueOpen={setContinuedStoryId}
          onContinueImpression={setImpressionStoryId}
        />
      </div>
      <p className="sr-only" role="status" aria-label="Opened story">
        {openedStoryId || "No story opened."}
      </p>
      <p className="sr-only" role="status" aria-label="Continued story">
        {continuedStoryId || "No story continued."}
      </p>
      <p className="sr-only" role="status" aria-label="Continue impression">
        {impressionStoryId || "No continue impression."}
      </p>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Today’s Edit",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct specification for the production Today’s Edit strip on the unfiltered Hearst+ For You route. The allocation may include Horoscope and genuine Continue Reading stories, but New From Your Brands and Trending Today are required. Production intentionally omits this strip below 768px so it does not duplicate the compact mobile continuation pattern.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteAllocation: Story = {
  name: "Complete allocation",
  globals: { brand: "hearst-all" },
  render: () => <TodayEditExample selection={completeSelection} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: "Today's edit", level: 2 }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("region", { name: "Today's edit" }),
    ).toBeVisible();
    await expect(
      canvasElement.querySelectorAll("button[data-story-id]"),
    ).toHaveLength(4);
  },
};

export const CompleteAllocationInteractions: Story = {
  name: "Complete allocation interactions",
  globals: { brand: "hearst-all" },
  render: () => <TodayEditExample selection={completeSelection} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const continueButton = canvas.getByRole("button", {
      name: new RegExp(`Continue Reading ${continueStory.title}`, "i"),
    });

    await userEvent.tab();
    await expect(canvas.getAllByRole("button")[0]).toHaveFocus();
    await userEvent.click(continueButton);
    await expect(
      canvas.getByRole("status", { name: "Opened story" }),
    ).toHaveTextContent(continueStory.id);
    await expect(
      canvas.getByRole("status", { name: "Continued story" }),
    ).toHaveTextContent(continueStory.id);
    await expect(
      canvas.getByRole("status", { name: "Continue impression" }),
    ).toHaveTextContent(continueStory.id);
  },
};

export const FirstVisitAllocation: Story = {
  name: "First visit: no reading history",
  globals: { brand: "hearst-all" },
  parameters: {
    docs: {
      description: {
        story:
          "A first visit has no genuine Continue Reading item. The strip contracts to three equal production cards without inventing a default history story.",
      },
    },
  },
  render: () => <TodayEditExample selection={firstVisitSelection} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole("button")).toHaveLength(3);
    await expect(
      canvas.queryByText("Continue Reading", { exact: true }),
    ).not.toBeInTheDocument();
  },
};

export const MinimalAllocation: Story = {
  name: "Minimal allocation",
  globals: { brand: "hearst-all" },
  parameters: {
    docs: {
      description: {
        story:
          "When optional Horoscope and Continue Reading inventory are absent, the two required cards fill two equal desktop columns instead of leaving an unexplained empty column.",
      },
    },
  },
  render: () => <TodayEditExample selection={minimalSelection} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: "Today's edit" });
    const cards = within(region).getAllByRole("button");
    const track = cards[0].parentElement;

    await expect(cards).toHaveLength(2);
    await expect(track).not.toBeNull();
    await expect(
      Math.abs(cards[0].getBoundingClientRect().width - cards[1].getBoundingClientRect().width),
    ).toBeLessThan(1);
    await expect(track).toHaveClass("xl:grid-cols-2");
  },
};

export const TabletKeyboardNavigation: Story = {
  name: "Tablet carousel and keyboard focus",
  globals: {
    brand: "hearst-all",
    viewport: "tablet",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard activation scrolls without animation so focus can transfer immediately to the reverse control when the activated arrow disappears. Pointer activation retains the production smooth motion unless reduced motion is requested.",
      },
    },
  },
  render: () => <TodayEditExample selection={completeSelection} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = await canvas.findByRole("button", {
      name: "Next stories in today's edit",
    });

    await expect(nextButton.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    nextButton.focus();
    await userEvent.keyboard("{Enter}");

    await waitFor(async () => {
      const previousButton = canvas.getByRole("button", {
        name: "Previous stories in today's edit",
      });
      await expect(previousButton).toHaveFocus();
      await expect(previousButton.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    });
  },
};

export const MobileOmitted: Story = {
  name: "Mobile: intentionally omitted",
  globals: {
    brand: "hearst-all",
    viewport: "mobile2",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The production mobile For You route omits the full strip. Genuine unfinished history uses the separate compact Continue Reading row instead.",
      },
    },
  },
  render: () => <TodayEditExample selection={completeSelection} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("region", { name: "Today's edit", hidden: true }),
    ).toHaveClass("hidden", "md:block");
  },
};

export const IncompleteCoreAllocation: Story = {
  name: "Empty: incomplete core allocation",
  globals: { brand: "hearst-all" },
  parameters: {
    docs: {
      description: {
        story:
          "If either required core story is missing, production omits the module rather than rendering blank card chrome.",
      },
    },
  },
  render: () => (
    <TodayEditExample selection={{ followedBrandStory }} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("region", { name: "Today's edit" }),
    ).not.toBeInTheDocument();
  },
};
