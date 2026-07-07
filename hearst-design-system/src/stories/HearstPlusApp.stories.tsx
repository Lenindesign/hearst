import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HearstPlusApp } from "@/components/hearst-plus-app";

const meta: Meta<typeof HearstPlusApp> = {
  title: "Apps/AUTOS",
  component: HearstPlusApp,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "AUTOS is a focused daily destination prototype for Autoweek, MotorTrend, Car and Driver, Road & Track, and Hot Rod. It ranks auto stories around user intent, followed topics, saved collections, and a personalized feed.",
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
