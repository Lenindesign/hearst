import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { SpecialOffers } from "@/components/special-offers";

const productionOffers = [
  { label: "$3,000 cash off", expires: "4/1/2026" },
  { label: "2.9% through 60 months", expires: "4/1/2026" },
  { label: "$369 /mo | 36 months", expires: "4/1/2026" },
];

const meta = {
  title: "Hearst Plus/HDS Primitives/Special Offers",
  component: SpecialOffers,
  args: {
    title: "Special Offers and Incentives",
    offers: productionOffers,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Production promotional-offer composition used by `/components/special-offers`. Its shared semantic component tokens preserve the shipped automotive offer treatment without embedding Tailwind palette colors in the component.",
      },
    },
  },
} satisfies Meta<typeof SpecialOffers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleOffer: Story = {
  args: {
    offers: [{ label: "0% APR for 72 months", expires: "5/31/2026" }],
  },
};

export const NoExpiration: Story = {
  args: {
    title: "Limited Time Deals",
    offers: [
      { label: "Free scheduled maintenance" },
      { label: "$500 loyalty bonus" },
    ],
  },
};

export const Empty: Story = {
  name: "Empty: No offers",
  args: {
    offers: [],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole("region", {
        name: "Special Offers and Incentives",
      }),
    ).not.toBeInTheDocument();
  },
};
