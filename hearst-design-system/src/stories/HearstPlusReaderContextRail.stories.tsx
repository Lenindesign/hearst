import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import {
  ContentReaderContextRail,
  getLifestyleContextStories,
} from "@/components/hearst-plus";
import { getComponentStoriesForBrand } from "./hearst-plus-component-fixtures";

function getContextRailFixture(brandSlug: string) {
  const stories = getComponentStoriesForBrand("hearst-all");
  const currentStory =
    getComponentStoriesForBrand(brandSlug)[0] ?? stories[0];

  return { currentStory, stories };
}

const defaultFixture = getContextRailFixture("hearst-all");

const meta = {
  title: "Hearst Plus/Components/Reader Context Rail",
  component: ContentReaderContextRail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production desktop context rail used beside the Hearst+ article reader. It allocates each related story to only one intent, publication, or topic group; keeps the current story out of every group; and remains intentionally absent below the xl desktop breakpoint.",
      },
    },
  },
  args: {
    ...defaultFixture,
    onOpenStory: fn(),
  },
} satisfies Meta<typeof ContentReaderContextRail>;

export default meta;
type Story = StoryObj<typeof meta>;

function ContextRailCanvas({
  brandSlug,
  stories,
  onOpenStory,
  forceDesktop = false,
}: {
  brandSlug: string;
  stories?: typeof defaultFixture.stories;
  onOpenStory: (storyId: string) => void;
  forceDesktop?: boolean;
}) {
  const fixture = getContextRailFixture(brandSlug);

  return (
    <div
      className={`hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-6 text-[var(--hp-text-primary)] ${
        forceDesktop ? "md:[&_aside]:!block" : ""
      }`}
    >
      <div
        className={`mx-auto grid max-w-[1184px] gap-8 ${
          forceDesktop
            ? "md:grid-cols-[220px_minmax(0,1fr)]"
            : "xl:grid-cols-[220px_minmax(0,1fr)]"
        }`}
      >
        <ContentReaderContextRail
          currentStory={fixture.currentStory}
          stories={stories ?? fixture.stories}
          onOpenStory={onOpenStory}
        />
        <main className="min-h-[760px] rounded-[8px] border border-dashed border-border bg-[var(--hp-surface)] p-4 sm:p-8">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Production reader column
          </p>
          <h2 className="mt-3 max-w-2xl font-brand-secondary text-2xl font-bold leading-tight sm:text-4xl">
            {fixture.currentStory.title}
          </h2>
        </main>
      </div>
    </div>
  );
}

export const RankedContextGroups: Story = {
  name: "Ranked unique context groups",
  globals: {
    viewport: "desktop",
  },
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
  render: (args, context) => (
    <ContextRailCanvas
      brandSlug={context.globals.brand}
      onOpenStory={args.onOpenStory}
      forceDesktop
    />
  ),
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const fixture = getContextRailFixture(globals.brand);
    const context = getLifestyleContextStories(
      fixture.currentStory,
      fixture.stories,
    );
    const expectedStories = [
      ...context.sharedIntent,
      ...context.sameBrand,
      ...context.sameTopic,
    ];
    const rail = canvas.getByRole("complementary", {
      name: "Contextual story recommendations",
    });
    const storyButtons = within(rail).getAllByRole("button", {
      name: /^Open contextual story:/,
    });

    await expect(storyButtons).toHaveLength(expectedStories.length);
    await expect(
      new Set(expectedStories.map((story) => story.id)).size,
    ).toBe(expectedStories.length);
    await expect(storyButtons[0]).toHaveAccessibleName(
      `Open contextual story: ${expectedStories[0].title}`,
    );
    await userEvent.click(storyButtons[0]);
    await expect(args.onOpenStory).toHaveBeenCalledWith(expectedStories[0].id);
  },
};

export const ReaderIntentOnly: Story = {
  name: "Fallback: Reader intent only",
  globals: {
    viewport: "desktop",
  },
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
  render: (args, context) => {
    const fixture = getContextRailFixture(context.globals.brand);
    return (
      <ContextRailCanvas
        brandSlug={context.globals.brand}
        stories={[fixture.currentStory]}
        onOpenStory={args.onOpenStory}
        forceDesktop
      />
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const fixture = getContextRailFixture(globals.brand);
    const rail = canvas.getByRole("complementary", {
      name: "Contextual story recommendations",
    });

    await expect(
      within(rail).queryByRole("button", {
        name: /^Open contextual story:/,
      }),
    ).not.toBeInTheDocument();
    await expect(within(rail).getByText("Reader Intent")).toBeVisible();
    await expect(within(rail).getByText(fixture.currentStory.topic)).toBeVisible();
  },
};

export const HiddenBelowDesktop: Story = {
  name: "Responsive: Hidden below desktop",
  globals: {
    viewport: "mobile1",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: (args, context) => (
    <ContextRailCanvas
      brandSlug={context.globals.brand}
      onOpenStory={args.onOpenStory}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rail = canvasElement.querySelector<HTMLElement>(
      'aside[aria-label="Contextual story recommendations"]',
    );

    await expect(rail).not.toBeNull();
    await expect(
      canvas.queryByRole("complementary", {
        name: "Contextual story recommendations",
      }),
    ).not.toBeInTheDocument();
    await expect(rail!.getClientRects()).toHaveLength(0);
  },
};
