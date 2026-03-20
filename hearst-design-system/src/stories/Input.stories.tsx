import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Input } from "@/components/ui/input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: {
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xl", "lg", "md"],
      description: "Input field size. Use `md` for forms, `lg` for search bars, `xl` for hero search.",
      table: { category: "Appearance", defaultValue: { summary: "md" } },
    },
    label: {
      control: "text",
      description: "Visible label above the input.",
      table: { category: "Content" },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when empty.",
      table: { category: "Content" },
    },
    helpText: {
      control: "text",
      description: "Helper text below the input for guidance.",
      table: { category: "Content" },
    },
    error: {
      control: "text",
      description: "Error message. When set, the input shows an error state.",
      table: { category: "Validation" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the input field.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    required: {
      control: "boolean",
      description: "Marks the field as required (adds asterisk to label).",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
      description: "HTML input type.",
      table: { category: "Advanced", defaultValue: { summary: "text" } },
    },
    onChange: { action: "change", table: { category: "Events" } },
    onFocus: { action: "focus", table: { category: "Events" } },
    onBlur: { action: "blur", table: { category: "Events" } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Text input field with built-in label, help text, and error states. Uses `component-input-*` tokens for border, background, and focus ring colors.",
      },
    },
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

export const Required: Story = {
  args: { placeholder: "Required field", label: "Full Name", required: true },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled input", label: "Disabled", disabled: true },
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="space-y-4 w-80">
      <Input {...args} size="md" label="Medium" placeholder="Medium input" />
      <Input {...args} size="lg" label="Large" placeholder="Large input" />
      <Input {...args} size="xl" label="Extra Large" placeholder="Extra large input" />
    </div>
  ),
};
