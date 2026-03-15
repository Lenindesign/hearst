import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "success", "warning", "highlight", "danger", "neutral-dark", "neutral-light"],
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
  args: { children: "Success", variant: "success" },
};

export const Warning: Story = {
  args: { children: "Warning", variant: "warning" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["default", "secondary", "destructive", "outline", "ghost", "success", "warning", "highlight", "danger", "neutral-dark", "neutral-light"] as const).map(
        (v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        )
      )}
    </div>
  ),
};
