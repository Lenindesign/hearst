import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { ClubActivityCard, ClubActivityFeed } from "@/components/hearst-plus/club-activity-card";
import {
  sampleClubActivities,
  sampleLongTitleActivity,
  type Activity,
} from "@/components/hearst-plus/club-activity-model";

const [tempoRun, morningWalk, lakefrontRide, strength] = sampleClubActivities as [Activity, Activity, Activity, Activity];

const meta = {
  title: "Hearst Plus/Components/Club Activity Card",
  component: ClubActivityCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Strava-style activity card for the Men’s Health Training Club `Club activity` feed. It shows the athlete, start time, device and coarse location, an activity icon and title, three headline stats, a lazily loaded non-interactive route map, and a kudos/comments footer. The whole card opens the activity detail dialog; kudos and comments are separate 44px buttons above the card target. Without `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` the map is a keyless, illustrative SVG drawn around the route; with a key it is a Google Static Maps image. All data here is labelled sample data.",
      },
    },
  },
  globals: { brand: "mens-health" },
  args: { activity: tempoRun, eagerMap: true },
  decorators: [(Story) => <div className="hearst-plus-theme mx-auto w-full max-w-[640px] rounded-card bg-[var(--hp-background)] p-3 text-[var(--hp-text-primary)] sm:p-4"><Story /></div>],
} satisfies Meta<typeof ClubActivityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMap: Story = {
  name: "With route map",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvasElement.querySelector("[data-map-kind]")).not.toBeNull());
    await expect(canvasElement.querySelector("figcaption")?.textContent).toContain("point-to-point route");
    const kudos = canvas.getByRole("button", { name: /Give kudos to Marcus Bell/ });
    await expect(kudos.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.click(kudos);
    await expect(canvas.getByRole("button", { name: /Remove your kudos/ })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByText("4 kudos")).toBeVisible();
  },
};

export const LoopRoute: Story = {
  name: "Loop route (walk with steps)",
  args: { activity: morningWalk },
};

export const WithoutMap: Story = {
  name: "Without a map (indoor activity)",
  args: { activity: strength },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("figure")).toBeNull();
  },
};

export const MapHidden: Story = {
  name: "Route recorded, map hidden",
  args: { activity: lakefrontRide, showMap: false },
};

export const NoKudos: Story = {
  name: "No kudos or comments",
  args: { activity: { ...tempoRun, id: "sample-activity-no-kudos", kudos: [], comments: [] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Be the first to give kudos")).toBeVisible();
  },
};

export const LongTitle: Story = {
  name: "Long title",
  args: { activity: sampleLongTitleActivity },
};

export const OpensDetail: Story = {
  name: "Opens the activity detail",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Run: Tempo Run/ }));
    const dialog = await waitFor(() => {
      const element = canvasElement.ownerDocument.querySelector("dialog[open]");
      if (!element) throw new Error("dialog not open");
      return element as HTMLElement;
    });
    await expect(within(dialog).getByRole("heading", { name: "Tempo Run" })).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Close activity" }));
    await waitFor(() => expect(canvasElement.ownerDocument.querySelector("dialog[open]")).toBeNull());
  },
};

export const Feed: Story = {
  name: "Club activity feed",
  render: () => (
    <ClubActivityFeed
      activities={sampleClubActivities}
      description="Sample activity from illustrative members, so you can see how the club feed works."
    />
  ),
};

export const Phone: Story = {
  name: "Phone width",
  globals: { brand: "mens-health", viewport: "mobile1" },
  parameters: { viewport: { defaultViewport: "mobile1" } },
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
  },
};
