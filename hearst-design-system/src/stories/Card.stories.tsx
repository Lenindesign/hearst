import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const meta: Meta<typeof Card> = {
  title: "Hearst Plus/HDS Primitives/Card",
  component: Card,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production surface primitive used by component reference pages and token tooling. Card owns structure, semantic surfaces, size density, and optional header, action, content, and footer slots; editorial story meaning belongs to ArticleCard and Hearst+ editorial patterns.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const CompleteAnatomy: Story = {
  name: "Complete anatomy",
  args: {
    size: "default",
  },
  render: (args) => {
    const onOpenSpecification = fn();

    return (
      <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center p-4">
        <Card {...args} className="w-full max-w-[380px]">
          <CardHeader>
            <CardTitle>
              <h2>Component inventory</h2>
            </CardTitle>
            <CardDescription>
              Production ownership and current specification evidence.
            </CardDescription>
            <CardAction>
              <Badge variant="success">Production</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
              <div className="min-w-0">
                <dt className="text-muted-foreground">Implementation</dt>
                <dd className="break-words font-semibold [overflow-wrap:anywhere]">
                  src/components/ui/card.tsx
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">Metadata</dt>
                <dd className="font-semibold">Current</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={onOpenSpecification}>Open specification</Button>
          </CardFooter>
        </Card>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Component inventory" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Open specification" }));
  },
};

export const Compact: Story = {
  args: {
    size: "sm",
  },
  render: (args) => (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center p-4">
      <Card {...args} className="w-full max-w-[320px]">
        <CardHeader>
          <CardTitle>
            <h2>Compact status</h2>
          </CardTitle>
          <CardDescription>Use the small density only inside bounded utility surfaces.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <span>Token validation</span>
          <Badge variant="success">Passing</Badge>
        </CardContent>
      </Card>
    </div>
  ),
};

export const ContentOnly: Story = {
  render: (args) => (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center p-4">
      <Card {...args} className="w-full max-w-[360px]">
        <CardContent>
          <p>
            Card can provide a token-driven surface without inventing header or footer chrome.
            Use a plain layout container when visual grouping is not required.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};
