import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "@/components/ui/divider";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "subtle"],
      description: "Use `default` for strong section breaks, `subtle` for light separators within a section.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Thickness of the divider line.",
      table: { category: "Appearance", defaultValue: { summary: "md" } },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Horizontal rule for separating content sections. Uses `--palette-neutral-*` tokens for color. Designers: use `sm` between related items, `lg` between major sections.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: { variant: "default", size: "md" },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export const Subtle: Story = {
  args: { variant: "subtle", size: "md" },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="w-80 space-y-6">
      {(["sm", "md", "lg"] as const).map((s) => (
        <div key={s}>
          <p className="text-xs text-muted-foreground mb-2 capitalize">{s}</p>
          <Divider {...args} size={s} />
        </div>
      ))}
    </div>
  ),
};
