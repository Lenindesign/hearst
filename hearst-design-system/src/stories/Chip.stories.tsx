import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "@/components/ui/chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    variant: { control: "select", options: ["default", "selected"] },
    size: { control: "select", options: ["md", "lg"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: { children: "Chip", variant: "default", size: "md" },
};

export const Selected: Story = {
  args: { children: "Selected", variant: "selected" },
};

export const Large: Story = {
  args: { children: "Large Chip", size: "lg" },
};

export const WithDismiss: Story = {
  args: { children: "Dismissable", onDismiss: () => alert("dismissed") },
};

export const ChipGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="selected">Fashion</Chip>
      <Chip>Beauty</Chip>
      <Chip>Culture</Chip>
      <Chip>Lifestyle</Chip>
      <Chip>Health</Chip>
    </div>
  ),
};
