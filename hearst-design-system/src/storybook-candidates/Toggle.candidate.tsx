import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Toggle } from "@/components/ui/toggle";

// Not indexed: Toggle is only imported by the currently unused ToggleGroup primitive.

const meta: Meta<typeof Toggle> = {
  title: "Hearst Plus/HDS Primitives/Toggle",
  component: Toggle,
  args: {
    children: "B",
    onPressedChange: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
      description: "Visual style. `outline` adds a visible border for toolbar-style grouping.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
      description: "Toggle button size.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the toggle.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    defaultPressed: {
      control: "boolean",
      description: "Initial pressed state (uncontrolled).",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    children: {
      control: "text",
      description: "Toggle label (typically a single letter or icon).",
      table: { category: "Content" },
    },
    onPressedChange: {
      action: "pressed-change",
      description: "Fires when the toggle state changes. Receives the new boolean value.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Candidate two-state button using the current semantic muted, input, destructive, and ring roles. Promote only with a production use site and an accessible-name contract for icon-only controls.",
      },
    },
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

export const Pressed: Story = {
  name: "Default Pressed",
  args: { children: "B", defaultPressed: true },
};

export const DisabledToggle: Story = {
  name: "Disabled",
  args: { children: "B", disabled: true },
};

export const ToolbarGroup: Story = {
  name: "Formatting Toolbar",
  render: (args) => (
    <div className="flex gap-1">
      <Toggle {...args} variant="outline" defaultPressed>B</Toggle>
      <Toggle {...args} variant="outline">I</Toggle>
      <Toggle {...args} variant="outline">U</Toggle>
    </div>
  ),
};
