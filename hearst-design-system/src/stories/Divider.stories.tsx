import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "@/components/ui/divider";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  argTypes: {
    variant: { control: "select", options: ["default", "subtle"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
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
  render: () => (
    <div className="w-80 space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Small</p>
        <Divider size="sm" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Medium</p>
        <Divider size="md" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Large</p>
        <Divider size="lg" />
      </div>
    </div>
  ),
};
