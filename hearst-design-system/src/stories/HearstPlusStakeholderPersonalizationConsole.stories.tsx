import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

import {
  StakeholderPersonalizationConsole,
  type StakeholderDemoDaypart,
  type StakeholderDemoState,
} from "@/components/hearst-plus/stakeholder-personalization-console";
import {
  LifestylePersonalizationRulesGuide,
  LifestyleTechnologyGuide,
} from "@/components/hearst-plus/lifestyle-technology-guide";
import { Button } from "@/components/ui/button";
import {
  baseDestinationConfigs,
  demoDaypartReturnHours,
  getLifestyleScoreBreakdown,
  getLifestyleStrategyReason,
  rankLifestyleRiver,
} from "@/lib/hearst-personalization-model";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

const fixtureStories = hearstPlusStoryData.all.stories.slice(0, 24);
const topStory = fixtureStories[0];

if (!topStory) {
  throw new Error("The stakeholder console story requires at least one generated story fixture.");
}

const productionConfig = {
  ...baseDestinationConfigs.all,
  stories: fixtureStories,
};
const dayparts = productionConfig.dayparts;

const initialDemoState: StakeholderDemoState = {
  daypart: "morning",
  returnHours: 0,
  contentDay: "today",
  isSimulated: false,
};

function ConsoleExample({
  emptyScore = false,
}: {
  emptyScore?: boolean;
}) {
  const [open, setOpen] = React.useState(true);
  const [demoState, setDemoState] =
    React.useState<StakeholderDemoState>(initialDemoState);
  const [activeProfile, setActiveProfile] = React.useState(
    productionConfig.initialProfile,
  );
  const [event, setEvent] = React.useState("Console opened.");
  const rankedStories = rankLifestyleRiver(
    fixtureStories,
    activeProfile,
    demoState,
    productionConfig,
  );
  const activeTopStory = rankedStories[0] ?? topStory;
  const topBreakdown = getLifestyleScoreBreakdown(
    activeTopStory,
    activeProfile,
    demoState,
    productionConfig,
  );
  const topStrategyReason = getLifestyleStrategyReason(
    activeTopStory,
    topBreakdown,
    demoState,
    productionConfig,
  );

  const setDaypart = (daypart: StakeholderDemoDaypart) => {
    const returnHours = demoDaypartReturnHours[daypart];

    setDemoState({
      daypart,
      returnHours,
      contentDay: "today",
      previousLeadId: activeTopStory.id,
      isSimulated: true,
    });
    setEvent(`${dayparts[daypart].label} selected.`);
  };

  return (
    <main className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-6 text-[var(--hp-text-primary)]">
      <div className="mx-auto max-w-xl rounded-[8px] border border-border bg-[var(--hp-surface)] p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Stakeholder-only production tool
        </p>
        <h1 className="headline mt-2 text-3xl">
          Personalization console
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This canvas mounts the same console renderer used by the routed
          Hearst+ application when explicit demo mode is enabled.
        </p>
        <Button
          className="mt-5 min-h-11"
          onClick={() => {
            setOpen(true);
            setEvent("Console opened.");
          }}
        >
          Open stakeholder console
        </Button>
        <p role="status" className="sr-only" aria-label="Console event">
          {event}
        </p>
      </div>

      <StakeholderPersonalizationConsole
        open={open}
        onClose={() => {
          setOpen(false);
          setEvent("Console closed.");
        }}
        demoState={demoState}
        profile={activeProfile}
        topStory={emptyScore ? undefined : activeTopStory}
        topBreakdown={emptyScore ? null : topBreakdown}
        topStrategyReason={emptyScore ? null : topStrategyReason}
        config={{
          productName: "Hearst Magazines",
          dayparts,
          liveFeedStatus: {
            fetchedAt: "2026-07-27T12:00:00.000Z",
            isFallback: false,
          },
        }}
        activeFilter={emptyScore ? "No matching stories" : "For You"}
        inventoryStories={fixtureStories}
        eligibleStories={emptyScore ? [] : rankedStories.slice(0, 12)}
        scopeLabel="Hearst Magazines"
        onDaypartChange={setDaypart}
        onSimulateReturn={(hours, daypart, contentDay, previousLeadId) => {
          setDemoState({
            daypart,
            returnHours: hours,
            contentDay: contentDay ?? "today",
            previousLeadId,
            isSimulated: true,
          });
          setEvent(
            contentDay === "nextDay"
              ? "Next day edition selected."
              : `Return after ${hours} hours selected.`,
          );
        }}
        onApplyBehaviorPreset={(preset) => {
          const presetSignals = {
            homeCook: {
              followedTopics: ["Food", "Home"],
              boostedTags: ["dinner ideas", "kitchen", "home"],
            },
            shoppingBrowser: {
              followedTopics: ["Shopping", "Style"],
              boostedTags: ["shopping", "products", "deals"],
            },
            wellnessReader: {
              followedTopics: ["Wellness", "Fitness"],
              boostedTags: ["wellness", "health", "sleep"],
            },
          }[preset];
          setActiveProfile((current) => ({
            ...current,
            followedTopics: presetSignals.followedTopics,
            boostedTags: presetSignals.boostedTags,
          }));
          setEvent(`${preset} behavior preset applied.`);
        }}
        onResetDemo={() => {
          setDemoState(initialDemoState);
          setActiveProfile(productionConfig.initialProfile);
          setEvent("Demo reset.");
        }}
      >
        <LifestylePersonalizationRulesGuide />
        <LifestyleTechnologyGuide />
      </StakeholderPersonalizationConsole>
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Product/Stakeholder Personalization Console",
  component: StakeholderPersonalizationConsole,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact modal renderer used by the routed Hearst+ application when `?demo=1` or the stakeholder-tools environment flag is active. These direct stories import the same destination configuration and additive ranking model as production, then apply deterministic story inventory to specify interaction, responsive, empty-score, and accessibility behavior without importing the full page composition.",
      },
    },
  },
  args: {
    open: true,
    onClose: fn(),
    demoState: initialDemoState,
    profile: productionConfig.initialProfile,
    topStory,
    topBreakdown: getLifestyleScoreBreakdown(
      topStory,
      productionConfig.initialProfile,
      initialDemoState,
      productionConfig,
    ),
    topStrategyReason: getLifestyleStrategyReason(
      topStory,
      getLifestyleScoreBreakdown(
        topStory,
        productionConfig.initialProfile,
        initialDemoState,
        productionConfig,
      ),
      initialDemoState,
      productionConfig,
    ),
    config: {
      productName: "Hearst Magazines",
      dayparts,
    },
    activeFilter: "For You",
    inventoryStories: fixtureStories,
    eligibleStories: fixtureStories.slice(0, 12),
    scopeLabel: "Hearst Magazines",
    onDaypartChange: fn(),
    onSimulateReturn: fn(),
    onApplyBehaviorPreset: fn(),
    onResetDemo: fn(),
  },
} satisfies Meta<typeof StakeholderPersonalizationConsole>;

export default meta;
type Story = StoryObj<typeof meta>;

function getPage(canvasElement: HTMLElement) {
  return within(canvasElement.ownerDocument.body);
}

export const DesktopOpen: Story = {
  name: "Desktop: open production console",
  render: () => <ConsoleExample />,
};

export const Default: Story = {
  name: "Interactions: production controls and evidence",
  render: () => <ConsoleExample />,
  play: async ({ canvasElement }) => {
    const page = getPage(canvasElement);
    const dialog = await page.findByRole("dialog", {
      name: "Stakeholder Demo Console",
    });
    const dialogCanvas = within(dialog);
    const closeButton = dialogCanvas.getByRole("button", {
      name: "Close personalization demo",
    });

    await waitFor(() => expect(closeButton).toHaveFocus());
    await expect(closeButton.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    await expect(closeButton.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(
      dialogCanvas.getByRole("button", { name: "8 AM" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      dialogCanvas.getByText("Facts from the running experience, not a static presentation."),
    ).toBeVisible();

    await userEvent.click(
      dialogCanvas.getByRole("button", { name: "1 PM" }),
    );
    await expect(
      dialogCanvas.getByText("Afternoon Momentum"),
    ).toBeVisible();
    await expect(
      dialogCanvas.getByRole("button", { name: "1 PM" }),
    ).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(
      dialogCanvas.getByRole("button", { name: "Next day" }),
    );
    await expect(dialogCanvas.getByText("Next day edition")).toBeVisible();
    await expect(
      dialogCanvas.getByText(/Strategy link:/i),
    ).toHaveTextContent(/fresh since last visit|new edition novelty/i);

    await userEvent.click(
      dialogCanvas.getByRole("button", { name: "Home cook" }),
    );
    await expect(
      canvasElement.querySelector('[aria-label="Console event"]'),
    ).toHaveTextContent("homeCook behavior preset applied.");

    await userEvent.click(
      dialogCanvas.getByRole("button", { name: "Reset demo" }),
    );
    await expect(
      dialogCanvas.getByRole("button", { name: "8 AM" }),
    ).toHaveAttribute("aria-pressed", "true");

    await userEvent.keyboard("{Escape}");
    const opener = within(canvasElement).getByRole("button", {
      name: "Open stakeholder console",
    });
    opener.focus();
    await userEvent.click(opener);
    await expect(
      await page.findByRole("dialog", { name: "Stakeholder Demo Console" }),
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
    await userEvent.click(opener);
    await expect(
      await page.findByRole("dialog", { name: "Stakeholder Demo Console" }),
    ).toBeVisible();
  },
};

export const EmptyScore: Story = {
  name: "Empty: no eligible story",
  render: () => <ConsoleExample emptyScore />,
  play: async ({ canvasElement }) => {
    const dialog = await getPage(canvasElement).findByRole("dialog", {
      name: "Stakeholder Demo Console",
    });
    const dialogCanvas = within(dialog);

    await expect(
      dialogCanvas.getByText("No story selected in the current filter."),
    ).toBeVisible();
    await expect(
      dialogCanvas.getByText(/0 items are currently eligible/),
    ).toBeVisible();
    await expect(
      dialogCanvas.queryByText(/Total score/),
    ).not.toBeInTheDocument();
  },
};

export const ResponsiveMobile: Story = {
  name: "Responsive: Mobile",
  globals: {
    viewport: "mobile1",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <ConsoleExample />,
  play: async ({ canvasElement }) => {
    const dialog = await getPage(canvasElement).findByRole("dialog", {
      name: "Stakeholder Demo Console",
    });
    const dialogCanvas = within(dialog);
    const primaryControls = [
      "Close personalization demo",
      "Reset demo",
      "8 AM",
      "+4 hours",
      "Home cook",
    ];

    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(
      window.innerWidth,
    );
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      window.innerWidth,
    );

    for (const name of primaryControls) {
      await expect(
        dialogCanvas.getByRole("button", { name }).getBoundingClientRect().height,
      ).toBeGreaterThanOrEqual(44);
    }
  },
};
