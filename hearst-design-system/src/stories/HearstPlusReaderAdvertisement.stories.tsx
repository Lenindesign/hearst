import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import {
  ContentReaderAdvertisement,
  type ContextualAdUnit,
} from "@/components/hearst-plus";

const productionPrototypeAd: ContextualAdUnit = {
  id: "flux-beauty-wardrobe",
  sponsor: "Beauty Counter",
  title: "Build a Summer Beauty Wardrobe",
  summary:
    "Fragrance, skin, and makeup picks aligned to beauty and style behavior.",
  cta: "Open beauty",
  topics: ["Beauty", "Style"],
  tags: ["beauty", "style", "shopping", "fashion"],
  creativeLabel: "Beauty",
  imageUrl:
    "https://hips.hearstapps.com/hmg-prod/images/a52e5ed3-b530-41c3-a9e1-457d122763f8.jpg",
  palette: {
    background: "#fff6fa",
    foreground: "#1c1016",
    accent: "#000000",
    soft: "#f1d9e3",
  },
};

const verifiedCampaignAd: ContextualAdUnit = {
  ...productionPrototypeAd,
  id: "flux-beauty-wardrobe-verified",
  ctaHref: "/hearst-plus/shop/",
};

function AdvertisementCanvas({
  ad,
  currentTopic = "Style",
}: {
  ad?: ContextualAdUnit | null;
  currentTopic?: string;
}) {
  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-8">
      <div className="mx-auto grid max-w-[1160px] gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-h-[760px] rounded-[8px] border border-dashed border-border bg-[var(--hp-surface)] p-5 sm:p-8">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Production reader column
          </p>
          <h2 className="mt-3 max-w-2xl font-brand-secondary text-2xl font-bold leading-tight sm:text-4xl">
            How to Shop the Nordstrom Anniversary Sale Like a Fashion Editor
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            The advertisement is a complementary desktop surface. It does not
            interrupt the article column or appear below the desktop breakpoint.
          </p>
        </main>
        <ContentReaderAdvertisement
          ad={ad}
          currentTopic={currentTopic}
        />
      </div>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Reader Advertisement",
  component: ContentReaderAdvertisement,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production complementary advertisement used beside the standard article reader. Campaigns stay inside the active story destination, disclose advertising visibly and semantically, require a verified destination before exposing an actionable CTA, and remain intentionally absent below the desktop breakpoint.",
      },
    },
  },
  args: {
    ad: productionPrototypeAd,
    currentTopic: "Style",
  },
} satisfies Meta<typeof ContentReaderAdvertisement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrototypeCreative: Story = {
  name: "Prototype creative: CTA unavailable",
  globals: {
    viewport: "desktop",
  },
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
  render: (args) => <AdvertisementCanvas {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ad = canvas.getByRole("complementary", {
      name: "Advertisement: Beauty Counter — Build a Summer Beauty Wardrobe",
    });

    await expect(within(ad).getByText("Advertisement")).toBeVisible();
    await expect(
      within(ad).getByLabelText("Prototype CTA unavailable: Open beauty"),
    ).toBeVisible();
    await expect(
      within(ad).queryByRole("button", { name: "Open beauty" }),
    ).not.toBeInTheDocument();
    await expect(
      within(ad).queryByRole("link", {
        name: "Open beauty: Build a Summer Beauty Wardrobe",
      }),
    ).not.toBeInTheDocument();
  },
};

export const VerifiedCampaignDestination: Story = {
  name: "Verified campaign destination",
  globals: {
    viewport: "desktop",
  },
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
  render: () => (
    <AdvertisementCanvas ad={verifiedCampaignAd} currentTopic="Style" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campaignLink = canvas.getByRole("link", {
      name: "Open beauty: Build a Summer Beauty Wardrobe",
    });

    await expect(campaignLink).toHaveAttribute("href", "/hearst-plus/shop/");
    await expect(campaignLink.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const HiddenBelowDesktop: Story = {
  name: "Responsive: Hidden below desktop",
  globals: {
    viewport: "mobile1",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: (args) => <AdvertisementCanvas {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ad = canvasElement.querySelector<HTMLElement>(
      'aside[aria-label^="Advertisement:"]',
    );

    await expect(ad).not.toBeNull();
    await expect(
      canvas.queryByRole("complementary", { name: /^Advertisement:/ }),
    ).not.toBeInTheDocument();
    await expect(ad!.getClientRects()).toHaveLength(0);
  },
};

export const NoEligibleAdvertisement: Story = {
  name: "No eligible advertisement",
  render: () => <AdvertisementCanvas ad={null} currentTopic="Style" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("complementary", { name: /^Advertisement:/ }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByText("Production reader column")).toBeVisible();
  },
};
