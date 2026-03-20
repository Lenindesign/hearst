import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "@/components/ui/avatar";

interface AvatarStoryProps {
  size: "sm" | "default" | "lg";
  src: string;
  fallback: string;
  showBadge: boolean;
  onClick: () => void;
}

function AvatarRenderer({ size, src, fallback, showBadge, onClick }: AvatarStoryProps) {
  return (
    <Avatar size={size} onClick={onClick} style={{ cursor: "pointer" }}>
      <AvatarImage src={src} alt="User" />
      <AvatarFallback>{fallback}</AvatarFallback>
      {showBadge && <AvatarBadge />}
    </Avatar>
  );
}

const meta: Meta = {
  title: "Components/Avatar",
  args: {
    size: "default",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    fallback: "JD",
    showBadge: false,
    onClick: fn(),
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Avatar size. Use `sm` in bylines, `default` in cards, `lg` in profiles.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    src: {
      control: "text",
      description: "Image URL. When the image fails to load, the fallback is shown.",
      table: { category: "Content" },
    },
    fallback: {
      control: "text",
      description: "Fallback initials shown when no image is available.",
      table: { category: "Content" },
    },
    showBadge: {
      control: "boolean",
      description: "Show an online/status badge indicator.",
      table: { category: "Appearance", defaultValue: { summary: "false" } },
    },
    onClick: {
      action: "click",
      description: "Fires when the avatar is clicked (e.g. to open a profile).",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "User or author avatar with image, fallback initials, and optional status badge. Supports grouping for multi-author bylines. Uses `--brand-primary` for the fallback background.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const WithImage: Story = {
  render: (args) => <AvatarRenderer {...(args as AvatarStoryProps)} />,
};

export const FallbackOnly: Story = {
  name: "Fallback",
  args: { src: "" },
  render: (args) => <AvatarRenderer {...(args as AvatarStoryProps)} />,
};

export const WithBadge: Story = {
  args: { showBadge: true, size: "lg" },
  render: (args) => <AvatarRenderer {...(args as AvatarStoryProps)} />,
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {(["sm", "default", "lg"] as const).map((s) => (
        <AvatarRenderer key={s} {...(args as AvatarStoryProps)} size={s} />
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: (args) => (
    <AvatarGroup>
      <Avatar onClick={(args as AvatarStoryProps).onClick} style={{ cursor: "pointer" }}>
        <AvatarImage
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
          alt="User 1"
        />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar onClick={(args as AvatarStoryProps).onClick} style={{ cursor: "pointer" }}>
        <AvatarImage
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
          alt="User 2"
        />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar onClick={(args as AvatarStoryProps).onClick} style={{ cursor: "pointer" }}>
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
};
