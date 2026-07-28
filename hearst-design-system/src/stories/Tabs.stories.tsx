import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function SpecificationTabs({
  orientation = "horizontal",
  variant = "default",
  disabled = false,
}: {
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "line";
  disabled?: boolean;
}) {
  return (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center p-4">
      <Tabs
        aria-label="Component evidence"
        className="w-full max-w-[560px] min-w-0"
        defaultValue="implementation"
        orientation={orientation}
      >
        <TabsList variant={variant}>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger disabled={disabled} value="ownership">
            Ownership
          </TabsTrigger>
        </TabsList>
        <TabsContent className="rounded-lg border border-border p-4" value="implementation">
          Production React source and application import sites define the component boundary.
        </TabsContent>
        <TabsContent className="rounded-lg border border-border p-4" value="tokens">
          Semantic HDS tokens supply brand-aware appearance without changing behavior.
        </TabsContent>
        <TabsContent className="rounded-lg border border-border p-4" value="ownership">
          Storybook documents the shipped component; rendering alone does not establish ownership.
        </TabsContent>
      </Tabs>
    </div>
  );
}

const meta: Meta<typeof Tabs> = {
  title: "Hearst Plus/HDS Primitives/Tabs",
  component: Tabs,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production tab primitive used by the token dashboard and routed component reference pages. Base UI owns selection, roving focus, disabled state, and orientation-aware keyboard behavior; the local wrapper supplies token-driven default and line treatments.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => <SpecificationTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tokens = canvas.getByRole("tab", { name: "Tokens" });
    await userEvent.click(tokens);
    await expect(tokens).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByText("Semantic HDS tokens supply brand-aware appearance without changing behavior."),
    ).toBeVisible();
  },
};

export const Line: Story = {
  render: () => <SpecificationTabs variant="line" />,
};

export const Vertical: Story = {
  render: () => <SpecificationTabs orientation="vertical" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const implementation = canvas.getByRole("tab", { name: "Implementation" });
    const tokens = canvas.getByRole("tab", { name: "Tokens" });

    implementation.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(tokens).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(tokens).toHaveAttribute("aria-selected", "true");
  },
};

export const Disabled: Story = {
  render: () => <SpecificationTabs disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tokens = canvas.getByRole("tab", { name: "Tokens" });
    const ownership = canvas.getByRole("tab", { name: "Ownership" });
    await expect(ownership).toHaveAttribute("aria-disabled", "true");
    tokens.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(ownership).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(ownership).toHaveAttribute("aria-selected", "false");
  },
};
