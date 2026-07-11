import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  LifestyleDestinationApp,
  type LifestyleDestinationProps,
} from "@/components/lifestyle-destination-app";

const meta: Meta<LifestyleDestinationProps> = {
  title: "Apps/Lifestyle Destination",
  component: LifestyleDestinationApp,
  args: {
    readerMode: "morning",
    topicFocus: "For You",
    showPersonalization: true,
  },
  argTypes: {
    readerMode: {
      control: { type: "inline-radio" },
      options: ["morning", "weekend", "shopping"],
      description: "Preset reader behavior profile for the mock ranking model.",
    },
    topicFocus: {
      control: { type: "select" },
      options: [
        "For You",
        "Dinner",
        "Home",
        "Wellness",
        "Style",
        "Shopping",
        "Family",
        "Entertainment",
        "Trending",
      ],
      description: "Initial topic chip used to bias the deterministic prototype ranking.",
    },
    showPersonalization: {
      control: "boolean",
      description: "Show or hide the visible recommendation explanations on story cards.",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Storybook-first prototype for a personalized Hearst lifestyle destination. It aggregates Cosmopolitan, Country Living, Delish, Good Housekeeping, House Beautiful, The Pioneer Woman, Prevention, Redbook, Seventeen, and Woman's Day into an editorial feed with visible recommendation reasons and local interaction state.",
      },
    },
  },
  globals: {
    brand: "hearst-lifestyle",
  },
};

export default meta;
type Story = StoryObj<LifestyleDestinationProps>;

export const DailyHome: Story = {
  name: "Daily Home",
  render: (args) => <LifestyleDestinationApp {...args} />,
};

export const DestinationHomepagePlan: Story = {
  name: "Destination Homepage Plan",
  args: {
    readerMode: "morning",
    topicFocus: "For You",
    showPersonalization: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Canonical plan prototype for the Lifestyle destination homepage: brand-neutral product shell, Phase 1 lifestyle sources, ranked hero stack, personalized feed, right rail, and visible recommendation reasons.",
      },
    },
  },
  render: (args) => <LifestyleDestinationApp {...args} />,
};

export const WeekendDiscovery: Story = {
  name: "Weekend Discovery",
  args: {
    readerMode: "weekend",
    topicFocus: "Home",
  },
  render: (args) => <LifestyleDestinationApp {...args} />,
};

export const ShoppingMode: Story = {
  name: "Shopping Mode",
  args: {
    readerMode: "shopping",
    topicFocus: "Shopping",
  },
  render: (args) => <LifestyleDestinationApp {...args} />,
};
