import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  HomePageTemplate,
  type HomePageTemplateProps,
} from "@/components/hearst-plus";
import { ThemeProvider } from "@/components/theme-provider";
import { VisualInspector } from "./support/visual-inspector";
import {
  hearstPlusStoryData,
  hearstPlusVideoStoryData,
} from "./hearst-plus-story-data";

function HomePageWrapper(props: HomePageTemplateProps) {
  return (
    <div className="min-h-screen">
      <ThemeProvider defaultBrandSlug="hearst-all" persistColorMode={false}>
        <HomePageTemplate
          staticDestinationData={hearstPlusStoryData}
          videoFeedData={hearstPlusVideoStoryData.all}
          {...props}
        />
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
          "The production Hearst+ feed template rendered with React, Tailwind CSS 4, HDS semantic tokens, and shared UI primitives. Storybook supplies a checked-in, generated editorial fixture; it does not call the production personalization endpoints or reproduce a reader's live ranked feed. Playable video uses the labeled deterministic Storybook clip. Use the routed app to review current feed data and personalization behavior.",
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
          "The production feed template with deterministic Storybook fixture data at the mobile viewport. This checks the component's responsive layout; it does not verify live feed ranking or API behavior.",
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
          "The production feed template with deterministic Storybook fixture data at the tablet viewport. This checks the component's responsive layout; it does not verify live feed ranking or API behavior.",
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
          "The production feed template with deterministic Storybook fixture data at the desktop viewport. This checks the component composition and layout; it does not represent a reader-specific ranked river.",
      },
    },
  },
};
