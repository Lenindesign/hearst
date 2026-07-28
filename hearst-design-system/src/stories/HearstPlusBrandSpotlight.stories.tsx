import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";

import {
  BrandPromotionRiverModule,
  getBrandPromotionForSlot,
} from "@/components/hearst-plus";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

const productionPromotion = getBrandPromotionForSlot({
  stories: hearstPlusStoryData.all.stories,
  fallbackStories: hearstPlusStoryData.all.stories,
  activeFilter: "For You",
  slotNumber: 4,
});

if (!productionPromotion) {
  throw new Error("The generated production fixture must include an eligible brand spotlight.");
}

function RiverCanvas({
  promotion = productionPromotion,
  onOpenStory,
}: React.ComponentProps<typeof BrandPromotionRiverModule>) {
  return (
    <main className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-8">
      <div className="mx-auto max-w-[636px] space-y-4">
        <div className="rounded-[8px] border border-dashed border-border bg-[var(--hp-surface)] p-4">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Production story river
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Publication discovery stays editorial and separate from personalization diagnostics.
          </p>
        </div>
        <BrandPromotionRiverModule
          promotion={promotion}
          onOpenStory={onOpenStory}
        />
      </div>
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Components/Brand Spotlight",
  component: BrandPromotionRiverModule,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production publication-discovery module inserted between Hearst+ river stories. It keeps selection and ranking in the production model, presents only reader-facing editorial context, uses concise story action names, and omits itself when no publication has enough eligible stories.",
      },
    },
  },
  args: {
    promotion: productionPromotion,
    onOpenStory: fn(),
  },
} satisfies Meta<typeof BrandPromotionRiverModule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Production editorial module",
  render: (args) => <RiverCanvas {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", {
      name: `Brand spotlight: ${productionPromotion.brand}`,
    });
    const storyButtons = within(region).getAllByRole("button", {
      name: /^Open story:/,
    });

    await expect(region).toBeVisible();
    await expect(storyButtons).toHaveLength(productionPromotion.stories.length);
    await expect(
      within(region).queryByText(/ranked by|reader intent|inside this river|Follow /i),
    ).not.toBeInTheDocument();
    await expect(
      within(region).queryByText(/^(Article|Gallery|Watch)$/i),
    ).not.toBeInTheDocument();
    await userEvent.click(storyButtons[0]);
    await expect(args.onOpenStory).toHaveBeenCalledWith(
      productionPromotion.stories[0].id,
    );
    storyButtons[0].blur();
  },
};

export const PublicationNavigation: Story = {
  name: "Publication navigation",
  render: (args) => <RiverCanvas {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const publicationLink = canvas.getByRole("link", {
      name: `Open ${productionPromotion.brand} publication`,
    });

    await expect(publicationLink).toHaveAttribute(
      "href",
      expect.stringContaining(productionPromotion.brandSlug),
    );
    await expect(publicationLink.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
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
    const region = canvas.getByRole("region", {
      name: `Brand spotlight: ${productionPromotion.brand}`,
    });

    await expect(region.getBoundingClientRect().width).toBeLessThanOrEqual(
      window.innerWidth,
    );
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      window.innerWidth,
    );
    await expect(
      canvas.getByRole("link", {
        name: `Open ${productionPromotion.brand} publication`,
      }).getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
  },
};

export const Zoom200Mobile: Story = {
  name: "Responsive: Mobile at 200% zoom",
  render: (args) => (
    <div className="w-[160px]">
      <RiverCanvas {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", {
      name: `Brand spotlight: ${productionPromotion.brand}`,
    });
    const regionRect = region.getBoundingClientRect();
    const contentRight = regionRect.right - 20;
    const storyButtons = within(region).getAllByRole("button", {
      name: /^Open story:/,
    });

    await expect(regionRect.width).toBeLessThanOrEqual(160);
    storyButtons.forEach((button) => {
      const buttonRect = button.getBoundingClientRect();

      expect(buttonRect.right).toBeLessThanOrEqual(contentRight + 1);
    });
  },
};

export const NoEligiblePromotion: Story = {
  name: "No eligible publication",
  render: (args) => <RiverCanvas {...args} promotion={null} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("region", { name: /^Brand spotlight:/ }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByText("Production story river")).toBeVisible();
  },
};
