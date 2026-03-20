import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
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

interface SelectStoryProps {
  label: string;
  placeholder: string;
  options: string[];
  disabled: boolean;
  size: "default" | "sm";
  onValueChange: (value: string | null) => void;
  onOpenChange: (open: boolean) => void;
}

function SelectRenderer({ label: lbl, placeholder, options, disabled, size, onValueChange, onOpenChange }: SelectStoryProps) {
  const triggerProps = size === "sm" ? { size: "sm" as const } : {};
  return (
    <div className="w-[280px] space-y-2">
      <Label>{lbl}</Label>
      <Select onValueChange={onValueChange as never} onOpenChange={onOpenChange as never} disabled={disabled}>
        <SelectTrigger {...triggerProps}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt.toLowerCase().replace(/\s+/g, "-")}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const meta: Meta = {
  title: "Components/Select",
  args: {
    label: "Category",
    placeholder: "Select a category",
    options: ["Fashion", "Beauty", "Lifestyle", "Entertainment", "Health"],
    disabled: false,
    size: "default",
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    label: {
      control: "text",
      description: "Visible label above the select.",
      table: { category: "Content" },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no option is selected.",
      table: { category: "Content" },
    },
    options: {
      control: "object",
      description: "Array of option labels.",
      table: { category: "Content" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the select.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "Trigger size. Use `sm` for compact layouts.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    onValueChange: {
      action: "value-change",
      description: "Fires when a new option is selected. Receives the value string.",
      table: { category: "Events" },
    },
    onOpenChange: {
      action: "open-change",
      description: "Fires when the dropdown opens or closes. Receives a boolean.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown select for choosing from a list of options. Supports groups, separators, and search. Uses `component-select-*` tokens for styling.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => <SelectRenderer {...(args as SelectStoryProps)} />,
};

export const SmallSize: Story = {
  name: "Small",
  args: {
    label: "Sort by",
    placeholder: "Sort...",
    options: ["Newest", "Oldest", "Most Popular"],
    size: "sm",
  },
  render: (args) => <SelectRenderer {...(args as SelectStoryProps)} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <SelectRenderer {...(args as SelectStoryProps)} />,
};

export const WithGroups: Story = {
  render: (args) => (
    <div className="w-[280px] space-y-2">
      <Label>Section</Label>
      <Select onValueChange={(args as SelectStoryProps).onValueChange} onOpenChange={(args as SelectStoryProps).onOpenChange}>
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
