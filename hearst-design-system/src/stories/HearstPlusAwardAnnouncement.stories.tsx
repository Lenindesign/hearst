import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";

import { autosRiverStories } from "@/components/autos-river-data";
import { StoryAwardCard, StoryAwardRibbon } from "@/components/hearst-plus/story-award";
import { storyAwards } from "@/lib/story-awards";

const award = storyAwards[0];
const winner = autosRiverStories.find((story) => story.id === award.storyId)!;
const related = award.relatedStoryIds.flatMap((id) => autosRiverStories.find((story) => story.id === id) ?? []);

function RiverCanvas({ width, children }: { width: number; children: React.ReactNode }) {
  return (
    <main className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-8">
      <div className="mx-auto" style={{ maxWidth: width }}>{children}</div>
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Components/Award Announcement",
  component: StoryAwardCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Opens the river of the awarding publication's page and its destination while an award is active (APP_RULES.md › Award announcements). Editorial, not advertising: no disclosure. Colors are the publication's card colors (the featured carousel pair). The whole card opens the winning story; the related story is its own 44px link. Below a 720px card width the photo stacks above the panel. A photo that already shows the publication's award mark gets no seal.",
      },
    },
  },
  args: {
    award,
    story: winner,
    relatedStories: related,
    destination: "autos",
    onOpenStory: fn(),
  },
} satisfies Meta<typeof StoryAwardCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const River: Story = {
  name: "River width (632px)",
  render: (args) => <RiverCanvas width={632}><StoryAwardCard {...args} /></RiverCanvas>,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: winner.title })).toBeVisible();
    await expect(canvas.getByText("MotorTrend 2027 SUV of the Year")).toBeVisible();
    await expect(canvasElement.querySelector("[data-story-award-seal]")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: `Open story: ${winner.title}` }));
    await expect(args.onOpenStory).toHaveBeenCalledWith(winner.id);
    const relatedLink = canvas.getByRole("button", { name: /^Also:/ });
    await expect(relatedLink.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.click(relatedLink);
    await expect(args.onOpenStory).toHaveBeenCalledWith(related[0].id);
  },
};

export const Phone: Story = {
  name: "Phone (343px)",
  render: (args) => <RiverCanvas width={343}><StoryAwardCard {...args} /></RiverCanvas>,
};

export const Wide: Story = {
  name: "Wide, photo beside panel (960px)",
  render: (args) => <RiverCanvas width={960}><StoryAwardCard {...args} /></RiverCanvas>,
};

export const WithSeal: Story = {
  name: "Photo without the award mark (seal)",
  args: { award: { ...award, photoCarriesMark: false } },
  render: (args) => <RiverCanvas width={632}><StoryAwardCard {...args} /></RiverCanvas>,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-story-award-seal]")).not.toBeNull();
  },
};

export const Ribbon: Story = {
  name: "Ribbon on the winner's other cards",
  render: () => (
    <RiverCanvas width={420}>
      <div className="relative overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- story fixture */}
        <img src={winner.image} alt="" className="aspect-[3/2] w-full object-cover" />
        <StoryAwardRibbon award={award} className="absolute left-3 top-3" />
        <p className="type-t3 headline p-4">{winner.title}</p>
      </div>
    </RiverCanvas>
  ),
};
