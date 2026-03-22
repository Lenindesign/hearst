import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HomePageTemplate } from "@/components/home-page";
import { VisualInspector } from "@/components/visual-inspector";

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
    docs: {
      description: {
        component:
          "Full-page brand home page template. Switch brands via the toolbar to see how the same layout adapts to each brand's colors, fonts, and tokens. This template uses `--font-headline`, `--font-brand`, `--brand-primary`, and all semantic background/content tokens.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Full Page",
  render: () => <HomePageWrapper />,
};

export const WithInspector: Story = {
  name: "Visual Inspector",
  render: () => (
    <VisualInspector>
      <HomePageWrapper />
    </VisualInspector>
  ),
};
