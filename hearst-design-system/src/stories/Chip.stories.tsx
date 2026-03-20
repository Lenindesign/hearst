import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Chip } from "@/components/ui/chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  args: {
    children: "Chip",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "selected"],
      description: "Use `selected` to indicate an active filter or tag.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["md", "lg"],
      description: "Chip size.",
      table: { category: "Appearance", defaultValue: { summary: "md" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the chip interaction.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    children: {
      control: "text",
      description: "Chip label text.",
      table: { category: "Content" },
    },
    onClick: {
      action: "click",
      description: "Fires when the chip is clicked.",
      table: { category: "Events" },
    },
    onDismiss: {
      action: "dismiss",
      description: "Fires when the dismiss (x) button is clicked. Renders the dismiss icon when provided.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Compact interactive element for filters, tags, or categories. Commonly used in article feeds and search results. Uses `--brand-primary` for the selected state.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: { children: "Fashion", variant: "default", size: "md" },
};

export const Selected: Story = {
  args: { children: "Fashion", variant: "selected" },
};

export const Large: Story = {
  args: { children: "Large Chip", size: "lg" },
};

export const Dismissable: Story = {
  args: { children: "Dismissable", onDismiss: fn() },
};

export const DisabledChip: Story = {
  name: "Disabled",
  args: { children: "Disabled", disabled: true },
};

export const ChipGroup: Story = {
  name: "Filter Group",
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Chip {...args} variant="selected">Fashion</Chip>
      <Chip {...args}>Beauty</Chip>
      <Chip {...args}>Culture</Chip>
      <Chip {...args}>Lifestyle</Chip>
      <Chip {...args}>Health</Chip>
    </div>
  ),
};
