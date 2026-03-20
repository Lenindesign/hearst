import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AlertStoryProps {
  variant: "default" | "destructive";
  title: string;
  description: string;
}

function AlertRenderer({ variant, title, description }: AlertStoryProps) {
  return (
    <div className="w-[480px]">
      <Alert variant={variant}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
}

const meta: Meta = {
  title: "Components/Alert",
  args: {
    variant: "default",
    title: "New article published",
    description: "Your article has been published and is now visible to readers.",
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
          "Contextual feedback message for user actions. Uses `component-alert-*` tokens. Designers: pair with appropriate icons for scannability.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: "default",
    title: "New article published",
    description: "Your article has been published and is now visible to readers.",
  },
  render: (args) => <AlertRenderer {...(args as AlertStoryProps)} />,
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    title: "Error saving draft",
    description: "There was a problem saving your draft. Please try again.",
  },
  render: (args) => <AlertRenderer {...(args as AlertStoryProps)} />,
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="w-[480px] space-y-4">
      <AlertRenderer {...(args as AlertStoryProps)} variant="default" title="Default Alert" description="This is a default informational alert." />
      <AlertRenderer {...(args as AlertStoryProps)} variant="destructive" title="Destructive Alert" description="This indicates an error or destructive action." />
    </div>
  ),
};
