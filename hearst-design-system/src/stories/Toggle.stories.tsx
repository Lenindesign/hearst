import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "@/components/ui/toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { children: "B", variant: "default", size: "default" },
};

export const Outline: Story = {
  args: { children: "I", variant: "outline" },
};

export const Small: Story = {
  args: { children: "S", size: "sm" },
};

export const Large: Story = {
  args: { children: "U", size: "lg" },
};

export const ToggleGroup: Story = {
  render: () => (
    <div className="flex gap-1">
      <Toggle variant="outline">B</Toggle>
      <Toggle variant="outline">I</Toggle>
      <Toggle variant="outline">U</Toggle>
    </div>
  ),
};
