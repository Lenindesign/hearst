import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Not indexed: Alert has no current application route or application import site.

interface AlertStoryProps {
  variant: "default" | "destructive";
  title: string;
  description: string;
}

function AlertRenderer({ variant, title, description }: AlertStoryProps) {
  return (
    <div className="w-full max-w-[480px] min-w-0">
      <Alert variant={variant}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
}

const meta: Meta = {
  title: "Hearst Plus/HDS Primitives/Alert",
  args: {
    variant: "default",
    title: "Story saved",
    description: "This story was added to your Read Later collection.",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "Use `default` for informational messages, `destructive` for errors or warnings.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    title: {
      control: "text",
      description: "Alert heading text.",
      table: { category: "Content" },
    },
    description: {
      control: "text",
      description: "Alert body text with additional details.",
      table: { category: "Content" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Candidate contextual-feedback primitive using the current semantic card, destructive, border, muted, and ring roles. Promote only with a production use site and verified state requirements.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: "default",
    title: "Story saved",
    description: "This story was added to your Read Later collection.",
  },
  render: (args) => <AlertRenderer {...(args as AlertStoryProps)} />,
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    title: "Couldn’t update your preferences",
    description: "Your feed was not changed. Please try again.",
  },
  render: (args) => <AlertRenderer {...(args as AlertStoryProps)} />,
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="w-full max-w-[480px] min-w-0 space-y-4">
      <AlertRenderer {...(args as AlertStoryProps)} variant="default" title="Story saved" description="This story was added to your Read Later collection." />
      <AlertRenderer {...(args as AlertStoryProps)} variant="destructive" title="Couldn’t update your preferences" description="Your feed was not changed. Please try again." />
    </div>
  ),
};
