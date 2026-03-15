import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch defaultChecked />
      <Label>Email notifications</Label>
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch size="sm" defaultChecked />
      <Label className="text-sm">Compact mode</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch disabled />
        <Label className="text-muted-foreground">Disabled off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch disabled defaultChecked />
        <Label className="text-muted-foreground">Disabled on</Label>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch />
        <Label>Default (off)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked />
        <Label>Default (on)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch size="sm" />
        <Label className="text-sm">Small (off)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch size="sm" defaultChecked />
        <Label className="text-sm">Small (on)</Label>
      </div>
    </div>
  ),
};
