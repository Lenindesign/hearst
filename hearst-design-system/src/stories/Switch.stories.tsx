import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  args: {
    onCheckedChange: fn(),
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "Switch size. Use `sm` in dense layouts like settings panels.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the switch.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    defaultChecked: {
      control: "boolean",
      description: "Initial checked state (uncontrolled).",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    onCheckedChange: {
      action: "checked-change",
      description: "Fires when the switch is toggled. Receives the new boolean value.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Toggle switch for binary settings. Uses `--brand-primary` for the active track color. Pair with a Label for accessibility.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { defaultChecked: false },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch {...args} />
      <Label>Email notifications</Label>
    </div>
  ),
};

export const CheckedByDefault: Story = {
  name: "Checked",
  args: { defaultChecked: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch {...args} />
      <Label>Email notifications</Label>
    </div>
  ),
};

export const Small: Story = {
  args: { size: "sm", defaultChecked: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch {...args} />
      <Label className="text-sm">Compact mode</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch {...args} disabled />
        <Label className="text-muted-foreground">Disabled off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} disabled defaultChecked />
        <Label className="text-muted-foreground">Disabled on</Label>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch {...args} />
        <Label>Default (off)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} defaultChecked />
        <Label>Default (on)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} size="sm" />
        <Label className="text-sm">Small (off)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} size="sm" defaultChecked />
        <Label className="text-sm">Small (on)</Label>
      </div>
    </div>
  ),
};
