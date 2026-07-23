import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Button> = {
  title: "Hearst Plus/HDS Primitives/Button",
  component: Button,
  args: {
    children: "Save story",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
      description: "Visual style variant. Use `default` for primary actions, `outline` for secondary, `destructive` for dangerous operations.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon"],
      description: "Button size. `icon` is square for icon-only buttons.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the button and applies muted styling.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    children: {
      control: "text",
      description: "Button label text or child elements.",
      table: { category: "Content" },
    },
    onClick: {
      action: "click",
      description: "Fires when the button is clicked.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Primary interactive element for user actions. The local Hearst component combines Base UI behavior, CVA variants, Tailwind utilities, and HDS semantic component tokens so it inherits the active publication theme.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button", variant: "default", size: "default" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Button" }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Destructive: Story = {
  args: { children: "Destructive", variant: "destructive" },
};

export const Link: Story = {
  args: { children: "Link Button", variant: "link" },
};

export const Small: Story = {
  args: { children: "Small", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg" },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      {(["default", "outline", "secondary", "ghost", "destructive", "link"] as const).map((v) => (
        <Button key={v} {...args} variant={v}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((s) => (
        <Button key={s} {...args} size={s}>
          {s === "default" ? "Default" : s.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
};
