import type { Meta, StoryObj } from "@storybook/react";
import { expect, waitFor, within } from "@storybook/test";

import {
  ArchitectureFlow,
  BrandLogoMarquee,
  BrandPortfolioGrid,
  BrandStyleGuide,
  DemoNav,
  DestinationConvergence,
  JourneyMatrix,
  PaletteSystem,
  ProductFooter,
  ProductHeader,
  RankingExample,
  StoryCard,
} from "@/components/product-story-shell";

function ToolingCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#102A43]">
      {children}
    </div>
  );
}

const meta = {
  title: "Design System Tooling/Product Specification Modules",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Exact production modules used by the four routed Hearst+ stakeholder specification pages. These stories document tooling UI and explanatory diagrams; they are intentionally separate from reader-facing Hearst+ components.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const NavigationShell: Story = {
  name: "Navigation shell",
  render: () => (
    <ToolingCanvas>
      <ProductHeader current="blueprint" />
      <main className="mx-auto min-h-80 max-w-[1360px] px-5 py-16 md:px-10">
        <h1 className="font-serif text-4xl">Product specification content</h1>
      </main>
      <ProductFooter />
    </ToolingCanvas>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banner = canvas.getByRole("banner");
    const navigation = within(banner).getByRole("navigation", {
      name: "Product pages",
    });
    await expect(
      within(navigation).getByRole("link", { name: "Blueprint" })
    ).toHaveAttribute("aria-current", "page");
    await expect(
      within(banner).getByRole("link", { name: "Hearst Magazines" })
    ).toHaveAttribute("href", "/hearst-plus/");
    for (const link of within(navigation).getAllByRole("link")) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  },
};

export const PhoneNavigation: Story = {
  name: "Phone navigation",
  globals: {
    viewport: "mobile1",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => (
    <ToolingCanvas>
      <ProductHeader current="tokens" />
      <main className="px-5 py-12">
        <h1 className="text-4xl font-bold">Token architecture</h1>
      </main>
    </ToolingCanvas>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banner = canvas.getByRole("banner");
    const navigation = within(banner).getByRole("navigation", {
      name: "Product pages",
    });
    await expect(
      within(navigation).getByRole("link", { name: "Tokens" })
    ).toHaveAttribute("aria-current", "page");
    for (const link of within(navigation).getAllByRole("link")) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
    await waitFor(() =>
      expect(document.documentElement.scrollWidth)
        .toBeLessThanOrEqual(document.documentElement.clientWidth)
    );
  },
};

export const IllustrativeNavigation: Story = {
  name: "Illustrative navigation",
  render: () => (
    <ToolingCanvas>
      <div className="mx-auto max-w-5xl p-5 md:p-10">
        <DemoNav />
      </div>
    </ToolingCanvas>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("figure", {
        name: "Illustrative Hearst+ navigation and story treatment",
      })
    ).toBeVisible();
  },
};

export const StoryConcepts: Story = {
  name: "Story concepts",
  render: () => (
    <ToolingCanvas>
      <div className="mx-auto grid max-w-4xl gap-4 p-5 sm:grid-cols-2 md:p-10">
        <StoryCard />
        <StoryCard ad />
      </div>
    </ToolingCanvas>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("article", { name: "Illustrative editorial story card" })
    ).toBeVisible();
    await expect(
      canvas.getByRole("article", { name: "Illustrative commercial concept card" })
    ).toBeVisible();
  },
};

export const PortfolioAndDestinations: Story = {
  name: "Portfolio and destinations",
  render: () => (
    <ToolingCanvas>
      <div className="mx-auto max-w-6xl space-y-8 p-5 md:p-10">
        <BrandPortfolioGrid compact />
        <DestinationConvergence />
      </div>
    </ToolingCanvas>
  ),
};

export const JourneyAndRanking: Story = {
  name: "Journey and ranking",
  render: () => (
    <ToolingCanvas>
      <div className="mx-auto max-w-6xl space-y-8 p-5 md:p-10">
        <JourneyMatrix />
        <RankingExample />
      </div>
    </ToolingCanvas>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table")).toBeVisible();
    await expect(
      canvas.getByRole("article", { name: "Illustrative editorial story card" })
    ).toBeVisible();
  },
};

export const ArchitectureAndPalette: Story = {
  name: "Architecture and palette",
  render: () => (
    <ToolingCanvas>
      <div className="mx-auto max-w-6xl space-y-8 p-5 md:p-10">
        <ArchitectureFlow />
        <PaletteSystem />
      </div>
    </ToolingCanvas>
  ),
};

export const PublicationStyleGuide: Story = {
  name: "Publication style guide",
  render: () => (
    <ToolingCanvas>
      <div className="mx-auto max-w-6xl p-5 md:p-10">
        <BrandStyleGuide />
      </div>
    </ToolingCanvas>
  ),
};

export const PortfolioMarquee: Story = {
  name: "Portfolio marquee",
  render: () => (
    <ToolingCanvas>
      <div className="mx-auto max-w-6xl bg-[#102A43] p-5 text-white md:p-10">
        <BrandLogoMarquee />
      </div>
    </ToolingCanvas>
  ),
};
