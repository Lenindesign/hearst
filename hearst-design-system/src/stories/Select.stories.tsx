import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const meta: Meta = {
  title: "Components/Select",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-[280px] space-y-2">
      <Label>Category</Label>
      <Select defaultValue="fashion">
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fashion">Fashion</SelectItem>
          <SelectItem value="beauty">Beauty</SelectItem>
          <SelectItem value="lifestyle">Lifestyle</SelectItem>
          <SelectItem value="entertainment">Entertainment</SelectItem>
          <SelectItem value="health">Health</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <div className="w-[280px] space-y-2">
      <Label>Section</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a section" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Editorial</SelectLabel>
            <SelectItem value="features">Features</SelectItem>
            <SelectItem value="opinion">Opinion</SelectItem>
            <SelectItem value="reviews">Reviews</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Lifestyle</SelectLabel>
            <SelectItem value="food">Food &amp; Drink</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="wellness">Wellness</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div className="w-[200px] space-y-2">
      <Label className="text-sm">Sort by</Label>
      <Select defaultValue="newest">
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
