import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HomePageTemplate } from "@/components/home-page";

function HomePageWrapper() {
  return (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <HomePageTemplate />
    </div>
  );
}

const meta: Meta = {
  title: "Templates/Home Page",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <HomePageWrapper />,
};
