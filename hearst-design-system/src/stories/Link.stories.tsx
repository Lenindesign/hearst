import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { LinkComponent } from "@/components/ui/link";

const meta: Meta<typeof LinkComponent> = {
  title: "Components/Link",
  component: LinkComponent,
  args: {
    children: "Link Text",
    href: "#",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "neutral"],
      description: "Color variant. `primary` uses the brand accent color, `neutral` uses default text color.",
      table: { category: "Appearance", defaultValue: { summary: "primary" } },
    },
    size: {
      control: "select",
      options: ["inherit", "xs", "sm", "base", "lg", "xl", "2xl"],
      description: "Font size. Use `inherit` to match the parent context.",
      table: { category: "Appearance", defaultValue: { summary: "inherit" } },
    },
    underline: {
      control: "boolean",
      description: "Show a persistent underline (vs. hover-only).",
      table: { category: "Appearance", defaultValue: { summary: "false" } },
    },
    external: {
      control: "boolean",
      description: "Opens in a new tab and shows an external link icon.",
      table: { category: "Behavior", defaultValue: { summary: "false" } },
    },
    href: {
      control: "text",
      description: "Link destination URL.",
      table: { category: "Content" },
    },
    children: {
      control: "text",
      description: "Link text.",
      table: { category: "Content" },
    },
    onClick: {
      action: "click",
      description: "Fires when the link is clicked.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Styled anchor element. Uses `--palette-content-default-link` and `--palette-content-default-link-hover` tokens for color. Designers: use `primary` for in-content links, `neutral` for navigation.",
      },
    },
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
  render: (args) => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "base", "lg", "xl", "2xl"] as const).map((s) => (
        <LinkComponent key={s} {...args} size={s}>
          {s}
        </LinkComponent>
      ))}
    </div>
  ),
};
