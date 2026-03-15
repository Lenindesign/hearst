import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." />
    </div>
  ),
};

export const WithValue: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="comment">Comment</Label>
      <Textarea
        id="comment"
        defaultValue="This is a great article! I especially loved the section about emerging trends."
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="disabled">Disabled</Label>
      <Textarea id="disabled" disabled defaultValue="This field is disabled." />
    </div>
  ),
};
