import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  HotRodDragWeekPage,
  HotRodEventsPage,
} from "@/components/hot-rod-events-page";

function HotRodEventsStory({
  page = "event-hub",
}: {
  page?: "event-hub" | "power-tour" | "drag-week";
}) {
  if (page === "drag-week") {
    return <HotRodDragWeekPage />;
  }

  return <HotRodEventsPage detailMode={page === "power-tour"} />;
}

const meta = {
  title: "Hearst Plus/Product/HOT ROD Events",
  component: HotRodEventsStory,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Direct specifications for the exact HOT ROD Events templates routed by the production app. The event hub, Power Tour detail, and Drag Week detail use the same checked-in event data, navigation, responsive composition, ticket states, and scoped HOT ROD visual treatment as their application routes.",
      },
    },
  },
  globals: {
    brand: "hot-rod",
  },
} satisfies Meta<typeof HotRodEventsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EventHub: Story = {
  name: "Event hub",
  render: () => <HotRodEventsStory page="event-hub" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { level: 1, name: "Power Tour" })
    ).toBeVisible();
    await expect(
      canvas.getByRole("heading", { name: "HOT ROD event calendar" })
    ).toBeVisible();

    const listButton = canvas.getByRole("button", { name: "List" });
    await userEvent.click(listButton);
    await expect(listButton).toHaveAttribute("aria-pressed", "true");
    await expect(
      canvas.getByRole("button", { name: "Calendar" })
    ).toHaveAttribute("aria-pressed", "false");
  },
};

export const PowerTourDetail: Story = {
  name: "Power Tour detail",
  render: () => <HotRodEventsStory page="power-tour" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { level: 1, name: "Power Tour" })
    ).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: /View all HOT ROD events/i })
    ).toBeVisible();
    await expect(
      canvas.queryByRole("heading", { name: "HOT ROD event calendar" })
    ).not.toBeInTheDocument();
  },
};

export const DragWeekDetail: Story = {
  name: "Drag Week detail",
  render: () => <HotRodEventsStory page="drag-week" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { level: 1, name: "Drag Week" })
    ).toBeVisible();
    await expect(
      canvas.getByText("Racer entry", { selector: "p" })
    ).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: /View tickets on TicketSpice/i })
    ).toBeVisible();
  },
};

export const MobileEventHub: Story = {
  name: "Responsive: Mobile event hub",
  render: () => <HotRodEventsStory page="event-hub" />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const MobileDragWeek: Story = {
  name: "Responsive: Mobile Drag Week",
  render: () => <HotRodEventsStory page="drag-week" />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
