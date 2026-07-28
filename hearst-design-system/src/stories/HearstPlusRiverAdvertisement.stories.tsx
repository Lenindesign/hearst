import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

import {
  ContextualRiverAdvertisement,
  type ContextualAdUnit,
} from "@/components/hearst-plus";

const productionPrototypeAd: ContextualAdUnit = {
  id: "flux-red-carpet",
  sponsor: "Red Carpet Desk",
  title: "The Event Lookbook",
  summary:
    "Dresses, beauty, accessories, and editor context for celebrity and event-led browsing.",
  cta: "Open lookbook",
  topics: ["Events", "Style", "Beauty"],
  tags: ["celebrity", "events", "style", "beauty"],
  creativeLabel: "Event",
  imageUrl:
    "https://hips.hearstapps.com/hmg-prod/images/7984ffdf-0689-4cd5-a2fc-966eb9187dba.jpeg",
  palette: {
    background: "#fff1f1",
    foreground: "#241010",
    accent: "#000000",
    soft: "#f0cccc",
  },
};

const verifiedCampaignAd: ContextualAdUnit = {
  ...productionPrototypeAd,
  id: "flux-red-carpet-verified",
  ctaHref: "/hearst-plus/shop/",
};

function RiverCanvas({ ad }: { ad?: ContextualAdUnit | null }) {
  return (
    <main className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-8">
      <div className="mx-auto max-w-[720px] space-y-4">
        <div className="rounded-[8px] border border-dashed border-border bg-[var(--hp-surface)] p-4">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Production story river
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Advertising remains visibly separate from editorial story cards.
          </p>
        </div>
        <ContextualRiverAdvertisement ad={ad} />
      </div>
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Components/River Advertisement",
  component: ContextualRiverAdvertisement,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production advertisement inserted between Hearst+ river stories. It preserves a clear advertising disclosure and sponsor identity, never exposes internal targeting scores or slot data, and becomes actionable only when campaign data includes a verified destination.",
      },
    },
  },
  args: {
    ad: productionPrototypeAd,
  },
} satisfies Meta<typeof ContextualRiverAdvertisement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrototypeCreative: Story = {
  name: "Prototype creative: CTA unavailable",
  render: (args) => <RiverCanvas {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const advertisement = canvas.getByRole("article", {
      name: "Advertisement: Red Carpet Desk — The Event Lookbook",
    });

    await expect(advertisement).toBeVisible();
    await expect(
      within(advertisement).getByLabelText(
        "Prototype CTA unavailable: Open lookbook",
      ),
    ).toBeVisible();
    await expect(
      within(advertisement).queryByRole("button", { name: "Open lookbook" }),
    ).not.toBeInTheDocument();
    await expect(
      within(advertisement).queryByRole("link", {
        name: "Open lookbook: The Event Lookbook",
      }),
    ).not.toBeInTheDocument();
    await expect(
      within(advertisement).queryByText(/Contextual Ad|Slot \d|intent score|Matched to/i),
    ).not.toBeInTheDocument();
  },
};

export const VerifiedCampaignDestination: Story = {
  name: "Verified campaign destination",
  render: () => <RiverCanvas ad={verifiedCampaignAd} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campaignLink = canvas.getByRole("link", {
      name: "Open lookbook: The Event Lookbook",
    });

    await expect(campaignLink).toHaveAttribute("href", "/hearst-plus/shop/");
    await expect(campaignLink.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const ResponsiveMobile: Story = {
  name: "Responsive: Mobile river",
  globals: {
    viewport: "mobile1",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: (args) => <RiverCanvas {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const advertisement = canvas.getByRole("article", {
      name: "Advertisement: Red Carpet Desk — The Event Lookbook",
    });
    const cardBounds = advertisement.getBoundingClientRect();

    await expect(cardBounds.width).toBeLessThanOrEqual(window.innerWidth);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      window.innerWidth,
    );
    await expect(
      within(advertisement).getByLabelText(
        "Prototype CTA unavailable: Open lookbook",
      ).getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
  },
};

export const NoEligibleAdvertisement: Story = {
  name: "No eligible advertisement",
  render: () => <RiverCanvas ad={null} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("article", { name: /^Advertisement:/ }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByText("Production story river")).toBeVisible();
  },
};
