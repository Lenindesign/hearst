import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import {
  ContentReaderRecommendations,
  getLifestyleArticleRecommendations,
} from "@/components/hearst-plus";
import { getComponentStoriesForBrand } from "./hearst-plus-component-fixtures";

function getRecommendationFixture(brandSlug: string) {
  const stories = getComponentStoriesForBrand("hearst-all");
  const currentStory =
    getComponentStoriesForBrand(brandSlug)[0] ?? stories[0];

  return { currentStory, stories };
}

const defaultFixture = getRecommendationFixture("hearst-all");

const meta = {
  title: "Hearst Plus/Components/Reader Recommendations",
  component: ContentReaderRecommendations,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The production related-content boundary used at the end of a Hearst+ article. It ranks the shared production-aligned story inventory by topic, brand, tags, freshness, and reader intent; opens the selected story in the existing reader; and renders nothing when no eligible related story exists.",
      },
    },
  },
  args: {
    ...defaultFixture,
    productName: "Hearst+",
    onOpenStory: fn(),
  },
} satisfies Meta<typeof ContentReaderRecommendations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RankedRelatedStories: Story = {
  name: "Ranked related stories",
  render: (args, context) => {
    const fixture = getRecommendationFixture(context.globals.brand);
    return (
      <div className="mx-auto max-w-5xl">
        <ContentReaderRecommendations {...args} {...fixture} />
      </div>
    );
  },
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const fixture = getRecommendationFixture(globals.brand);
    const expected = getLifestyleArticleRecommendations(
      fixture.currentStory,
      fixture.stories,
    );
    const region = canvas.getByRole("region", {
      name: `More in ${fixture.currentStory.topic}`,
    });
    const relatedStoryButtons = within(region).getAllByRole("button", {
      name: /^Open related story:/,
    });

    await expect(relatedStoryButtons).toHaveLength(expected.length);
    await expect(relatedStoryButtons[0]).toHaveAccessibleName(
      `Open related story: ${expected[0].title}`,
    );
    await userEvent.click(relatedStoryButtons[0]);
    await expect(args.onOpenStory).toHaveBeenCalledWith(expected[0].id);

    const target = relatedStoryButtons.at(-1)!.getBoundingClientRect();
    if (window.innerWidth < 640) {
      await expect(target.height).toBeGreaterThanOrEqual(44);
    }
  },
};

export const OmittedWithoutEligibleStories: Story = {
  name: "Omitted: No eligible stories",
  render: (args, context) => {
    const { currentStory } = getRecommendationFixture(context.globals.brand);
    return (
      <div data-testid="recommendations-empty-state">
        <ContentReaderRecommendations
          {...args}
          currentStory={currentStory}
          stories={[currentStory]}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("region", { name: /^More in / }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByTestId("recommendations-empty-state")).toBeEmptyDOMElement();
  },
};
