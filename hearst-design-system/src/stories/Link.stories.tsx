import type { Meta, StoryObj } from "@storybook/react";
import { LinkComponent } from "@/components/ui/link";

const meta: Meta<typeof LinkComponent> = {
  title: "Components/Link",
  component: LinkComponent,
  argTypes: {
    variant: { control: "select", options: ["primary", "neutral"] },
    size: { control: "select", options: ["inherit", "xs", "sm", "base", "lg", "xl", "2xl"] },
    underline: { control: "boolean" },
    external: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof LinkComponent>;

export const Primary: Story = {
  args: { children: "Primary Link", variant: "primary", href: "#" },
};

export const Neutral: Story = {
  args: { children: "Neutral Link", variant: "neutral", href: "#" },
};

export const Underlined: Story = {
  args: { children: "Underlined Link", underline: true, href: "#" },
};

export const External: Story = {
  args: { children: "External Link", external: true, href: "https://example.com" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "base", "lg", "xl", "2xl"] as const).map((s) => (
        <LinkComponent key={s} href="#" size={s}>
          {s}
        </LinkComponent>
      ))}
    </div>
  ),
};
