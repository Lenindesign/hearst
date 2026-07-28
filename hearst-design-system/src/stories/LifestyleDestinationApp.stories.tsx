import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { HomePageTemplate } from "@/components/hearst-plus";
import { ThemeProvider } from "@/components/theme-provider";
import {
  hearstPlusStoryData,
  hearstPlusVideoStoryData,
} from "./hearst-plus-story-data";

function LifestyleDestinationStory({ initialFilter }: { initialFilter?: string }) {
  return (
    <ThemeProvider defaultBrandSlug="hearst-lifestyle" persistColorMode={false}>
      <HomePageTemplate
        initialFilter={initialFilter}
        readerReturnHref="/hearst-lifestyle/"
        staticDestinationData={hearstPlusStoryData}
        videoFeedData={hearstPlusVideoStoryData.lifestyle}
      />
    </ThemeProvider>
  );
}

const meta = {
  id: "apps-lifestyle-destination",
  title: "Hearst Plus/Product/Lifestyle Destination",
  component: LifestyleDestinationStory,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    docs: {
      description: {
        component:
          "The production `HomePageTemplate` composition used by `/hearst-lifestyle/`, rendered with the generated production-aligned destination fixture. The production Videos destination remains present using the labeled deterministic Storybook clip. The former parallel lifestyle prototype and mock ranking controls were removed so this catalog has one production source.",
      },
    },
  },
  globals: {
    brand: "hearst-lifestyle",
  },
} satisfies Meta<typeof LifestyleDestinationStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DailyHome: Story = {
  name: "Home",
  render: () => <LifestyleDestinationStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const brandFilterHeadings = await canvas.findAllByText("Filter Brands");
    const brandFilterDescriptions = await canvas.findAllByText(
      "All brands are included in the river.",
    );

    await expect(brandFilterHeadings.length).toBeGreaterThan(0);
    await expect(brandFilterDescriptions.length).toBeGreaterThan(0);
    await expect(
      canvas.queryByText("Global Story Inventory"),
    ).not.toBeInTheDocument();
  },
};

export const WeekendDiscovery: Story = {
  name: "Home filter",
  render: () => <LifestyleDestinationStory initialFilter="Home" />,
};

export const ShoppingMode: Story = {
  name: "Shopping filter",
  render: () => <LifestyleDestinationStory initialFilter="Shopping" />,
};

export const Mobile: Story = {
  name: "Responsive: Mobile",
  render: () => <LifestyleDestinationStory />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Tablet: Story = {
  name: "Responsive: Tablet",
  render: () => <LifestyleDestinationStory />,
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};
