import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Separator } from "@/components/ui/separator";

const meta: Meta<typeof Separator> = {
  title: "Hearst Plus/HDS Primitives/Separator",
  component: Separator,
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description:
        "Sets both the visual axis and the separator’s screen-reader orientation.",
      table: {
        category: "Layout",
        defaultValue: { summary: "horizontal" },
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Accessible one-pixel boundary used throughout production layouts. It renders Base UI’s `role=\"separator\"` contract and the semantic `bg-border` color. Use `Divider` instead when a horizontal rule needs thickness or emphasis variants.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="mx-auto w-full max-w-lg space-y-4 p-4">
      <p className="text-sm font-semibold text-foreground">Section one</p>
      <Separator {...args} />
      <p className="text-sm text-muted-foreground">
        Section two begins after the production semantic border.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole("separator");
    await expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    await expect(separator).toHaveAttribute("data-orientation", "horizontal");
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex h-24 items-stretch gap-4 p-4">
      <div className="flex items-center text-sm font-semibold text-foreground">
        Editorial
      </div>
      <Separator {...args} />
      <div className="flex items-center text-sm text-muted-foreground">
        Updated today
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole("separator");
    await expect(separator).toHaveAttribute("aria-orientation", "vertical");
    await expect(separator).toHaveAttribute("data-orientation", "vertical");
  },
};

export const RepeatedContentBoundaries: Story = {
  render: (args) => (
    <div className="mx-auto w-full max-w-lg px-4">
      {["Design", "Culture", "Reviews"].map((label, index) => (
        <div key={label}>
          {index > 0 && <Separator {...args} />}
          <div className="py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {label}
            </p>
            <p className="mt-1 text-sm text-foreground">
              A production content group separated without changing thickness.
            </p>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Repeated semantic boundaries in the same pattern used by production lists, footers, and component-reference pages.",
      },
    },
  },
};
