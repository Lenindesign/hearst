import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text shown when empty.",
      table: { category: "Content" },
    },
    defaultValue: {
      control: "text",
      description: "Initial text value.",
      table: { category: "Content" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the textarea.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    rows: {
      control: { type: "number", min: 2, max: 20 },
      description: "Number of visible text rows.",
      table: { category: "Appearance", defaultValue: { summary: "3" } },
    },
    onChange: { action: "change", table: { category: "Events" } },
    onFocus: { action: "focus", table: { category: "Events" } },
    onBlur: { action: "blur", table: { category: "Events" } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Multi-line text input for longer content like comments, bios, or article excerpts. Shares styling tokens with Input.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Tell us about yourself..." },
  render: (args) => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: { defaultValue: "This is a great article! I especially loved the section about emerging trends." },
  render: (args) => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="comment">Comment</Label>
      <Textarea id="comment" {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: "This field is disabled.", disabled: true },
  render: (args) => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="disabled">Disabled</Label>
      <Textarea id="disabled" {...args} />
    </div>
  ),
};

export const Tall: Story = {
  name: "Custom Rows",
  args: { placeholder: "Write your article...", rows: 10 },
  render: (args) => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="article">Article Body</Label>
      <Textarea id="article" {...args} />
    </div>
  ),
};
