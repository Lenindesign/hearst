import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    size: { control: "select", options: ["xl", "lg", "md"] },
    label: { control: "text" },
    helpText: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text...", label: "Label", size: "md" },
};

export const WithHelp: Story = {
  args: { placeholder: "email@example.com", label: "Email", helpText: "We'll never share your email." },
};

export const WithError: Story = {
  args: { placeholder: "Enter text...", label: "Username", error: "Username is already taken" },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled input", label: "Disabled", disabled: true },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input size="md" label="Medium" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
      <Input size="xl" label="Extra Large" placeholder="Extra large input" />
    </div>
  ),
};
