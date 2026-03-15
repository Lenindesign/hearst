import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <Alert>
        <AlertTitle>New article published</AlertTitle>
        <AlertDescription>
          Your article has been published and is now visible to readers.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Destructive: Story = {
  render: () => (
    <div className="w-[480px]">
      <Alert variant="destructive">
        <AlertTitle>Error saving draft</AlertTitle>
        <AlertDescription>
          There was a problem saving your draft. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="w-[480px] space-y-4">
      <Alert>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>This is a default informational alert.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>This indicates an error or destructive action.</AlertDescription>
      </Alert>
    </div>
  ),
};
