import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HearstPlusApp } from "@/components/hearst-plus-app";

const meta: Meta<typeof HearstPlusApp> = {
  title: "Apps/Hearst Plus",
  component: HearstPlusApp,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Hearst+ is a cross-brand daily destination prototype. It aggregates every Hearst brand around user intent, followed topics, saved collections, and a personalized feed.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HearstPlusApp>;

export const DailyDestination: Story = {
  name: "Daily Destination",
  globals: {
    brand: "hearst-plus",
  },
  render: () => <HearstPlusApp />,
};
