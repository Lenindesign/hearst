import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  HomePageTemplate,
  type HomePageTemplateProps,
} from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { VisualInspector } from "@/components/visual-inspector";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

function HomePageWrapper(props: HomePageTemplateProps) {
  return (
    <div style={{ margin: "-2rem", minHeight: "100vh" }}>
      <ThemeProvider defaultBrandSlug="hearst-all" persistColorMode={false}>
        <HomePageTemplate staticDestinationData={hearstPlusStoryData} {...props} />
      </ThemeProvider>
    </div>
  );
}

const meta: Meta = {
  title: "Hearst Plus/Templates/Feed",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The current Hearst+ feed template rendered with React, Tailwind CSS 4, HDS semantic tokens, and shared shadcn-style primitives. These stories show the same responsive reader experience used by the product; no retired homepage layout variants are included.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Full Page",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HomePageWrapper />,
};

export const WithInspector: Story = {
  name: "Visual Inspector",
  globals: {
    brand: "hearst-all",
  },
  render: () => (
    <VisualInspector>
      <HomePageWrapper />
    </VisualInspector>
  ),
};

export const Mobile: Story = {
  name: "Responsive: Mobile",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HomePageWrapper />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "The current Hearst+ feed at the Storybook mobile viewport. Modules follow the production reading order and collapse to the supported single-column experience.",
      },
    },
  },
};

export const Tablet: Story = {
  name: "Responsive: Tablet",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HomePageWrapper />,
  parameters: {
    viewport: { defaultViewport: "tablet" },
    docs: {
      description: {
        story:
          "The current Hearst+ feed at the Storybook tablet viewport, using the same responsive Tailwind composition and HDS tokens as the application.",
      },
    },
  },
};

export const Desktop: Story = {
  name: "Responsive: Desktop",
  globals: {
    brand: "hearst-all",
  },
  render: () => <HomePageWrapper />,
  parameters: {
    docs: {
      description: {
        story:
          "The current desktop Hearst+ feed with its personalized river, supporting rails, and production component hierarchy.",
      },
    },
  },
};
