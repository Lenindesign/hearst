import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HomePageTemplate } from "@/components/hearst-plus";
import { ThemeProvider } from "@/components/theme-provider";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

function HearstPlusStory() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <ThemeProvider defaultBrandSlug="hearst-all" persistColorMode={false}>
        <HomePageTemplate staticDestinationData={hearstPlusStoryData} />
      </ThemeProvider>
    </div>
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
          "The integrated React and Next.js Hearst+ reader used by `/hearst-plus/`. This Storybook version uses the current checked-in Lifestyle, Autos, Fashion & Luxury, and Enthusiast & Wellness catalogs, the HDS token bridge, and browser-local demo personalization.",
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
