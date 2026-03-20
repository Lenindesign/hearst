import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Badge } from "@/components/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default", "secondary", "destructive", "outline", "ghost",
        "success", "warning", "highlight", "danger", "neutral-dark", "neutral-light",
      ],
      description: "Visual style. Use semantic variants (`success`, `warning`, `danger`) for status indicators.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    children: {
      control: "text",
      description: "Badge label text.",
      table: { category: "Content" },
    },
    onClick: {
      action: "click",
      description: "Fires when the badge is clicked (useful for filter chips).",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Small status descriptor or label. Uses `component-badge-*` tokens for padding, radius, and color. Designers: use the semantic variants to convey meaning, not just color.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Badge", variant: "default" },
};

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};

export const Destructive: Story = {
  args: { children: "Destructive", variant: "destructive" },
};

export const Success: Story = {
  args: { children: "Published", variant: "success" },
};

export const Warning: Story = {
  args: { children: "Draft", variant: "warning" },
};

export const Danger: Story = {
  args: { children: "Expired", variant: "danger" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {([
        "default", "secondary", "destructive", "outline", "ghost",
        "success", "warning", "highlight", "danger", "neutral-dark", "neutral-light",
      ] as const).map((v) => (
        <Badge key={v} {...args} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};
