import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { LifestyleStoryActions } from "@/components/hearst-plus";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getComponentStoriesForBrand,
  getComponentStoryForBrand,
} from "./hearst-plus-component-fixtures";

function ActionsFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-6">
      <div className="mx-auto w-full max-w-[760px]">{children}</div>
    </div>
  );
}

function StoryActionsExample({
  story,
  initialSaved = false,
  commentCount = 17,
}: {
  story: LifestyleRiverStory;
  initialSaved?: boolean;
  commentCount?: number;
}) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [hidden, setHidden] = React.useState(false);
  const [status, setStatus] = React.useState("No action selected.");

  return (
    <ActionsFrame>
      <div className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] sm:p-5">
        <p className="text-sm font-semibold">{story.title}</p>
        {hidden ? (
          <p className="mt-3 text-sm text-muted-foreground">
            This story is hidden from the current river.
          </p>
        ) : (
          <LifestyleStoryActions
            story={story}
            saved={saved}
            commentCount={commentCount}
            onOpen={() =>
              setStatus(`Opened story with ${commentCount} comments.`)
            }
            onSave={() => {
              setSaved((current) => !current);
              setStatus(saved ? "Removed from saved stories." : "Story saved.");
            }}
            onMoreLikeThis={() =>
              setStatus("More-like-this preference recorded.")
            }
            onHide={() => {
              setHidden(true);
              setStatus("Story hidden from the current river.");
            }}
          />
        )}
      </div>
      <p role="status" className="mt-4 text-sm text-muted-foreground">
        {status}
      </p>
    </ActionsFrame>
  );
}

function FocusTransferExample({
  stories,
}: {
  stories: LifestyleRiverStory[];
}) {
  const [visibleStories, setVisibleStories] = React.useState(stories);

  return (
    <ActionsFrame>
      <div className="grid gap-4">
        {visibleStories.map((story) => (
          <article
            key={story.id}
            data-story-module="river"
            data-story-id={story.id}
            className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] sm:p-5"
          >
            <button
              type="button"
              aria-label={`Open story: ${story.title}`}
              className="text-left text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {story.title}
            </button>
            <LifestyleStoryActions
              story={story}
              saved={false}
              commentCount={17}
              onOpen={() => undefined}
              onSave={() => undefined}
              onMoreLikeThis={() => undefined}
              onHide={() =>
                setVisibleStories((current) =>
                  current.filter((item) => item.id !== story.id)
                )
              }
            />
          </article>
        ))}
      </div>
    </ActionsFrame>
  );
}

const meta = {
  title: "Hearst Plus/Components/Story Actions",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct specification for the production river-card action group. Save is a toggle, More like this records a ranking preference, the comment control opens the story with its comment count, Hide removes the story and transfers focus to an adjacent card, and current-feed stories expose their live status. Phone targets remain at least 44px.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default: available actions",
  render: (_args, context) => (
    <StoryActionsExample
      key={context.globals.brand}
      story={getComponentStoryForBrand(context.globals.brand)}
    />
  ),
};

export const Interactions: Story = {
  name: "Interactions and announcements",
  render: (_args, context) => (
    <StoryActionsExample
      key={context.globals.brand}
      story={getComponentStoryForBrand(context.globals.brand)}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: "Save story" });

    await expect(save).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(save);
    await expect(
      canvas.getByRole("button", { name: "Remove from saved stories" })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("status")).toHaveTextContent("Story saved.");

    const actionGroup = canvas.getByRole("group");
    const moreLikeThis = within(actionGroup)
      .getAllByRole("button")
      .find((button) => button.textContent?.includes("More like this"));
    await expect(moreLikeThis).toBeDefined();
    await userEvent.click(moreLikeThis!);
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "More-like-this preference recorded."
    );

    await userEvent.click(
      canvas.getByRole("button", { name: "Open story with 17 comments" })
    );
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Opened story with 17 comments."
    );
  },
};

export const Saved: Story = {
  name: "Selected: saved",
  render: (_args, context) => (
    <StoryActionsExample
      key={context.globals.brand}
      story={getComponentStoryForBrand(context.globals.brand)}
      initialSaved
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", {
        name: "Remove from saved stories",
      })
    ).toHaveAttribute("aria-pressed", "true");
  },
};

export const CurrentFeedStory: Story = {
  name: "Status: current feed story",
  render: (_args, context) => {
    const story = getComponentStoryForBrand(context.globals.brand);
    return (
      <StoryActionsExample
        key={context.globals.brand}
        story={{ ...story, id: `live-story-actions-${story.id}` }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("Current feed story")
    ).toBeInTheDocument();
  },
};

export const Mobile: Story = {
  name: "Responsive: mobile",
  globals: {
    brand: "hearst-all",
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  render: () => (
    <StoryActionsExample story={getComponentStoryForBrand("hearst-all")} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionGroup = canvas.getByRole("group");
    const buttons = within(actionGroup).getAllByRole("button");

    await expect(buttons).toHaveLength(4);
    buttons.forEach((button) => {
      expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    });
    await expect(
      within(actionGroup)
        .getAllByRole("button")
        .find((button) => button.textContent?.includes("Hide"))
    ).toBeVisible();
    await expect(document.documentElement.scrollWidth).toBe(
      document.documentElement.clientWidth
    );
  },
};

export const FocusAfterHide: Story = {
  name: "Focus: adjacent story after Hide",
  render: (_args, context) => {
    const stories = getComponentStoriesForBrand(context.globals.brand).slice(
      0,
      2
    );
    return <FocusTransferExample key={context.globals.brand} stories={stories} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const groups = canvas.getAllByRole("group");
    await expect(groups).toHaveLength(2);

    const firstHide = within(groups[0])
      .getAllByRole("button")
      .find((button) => button.textContent?.includes("Hide"));
    const storyOpeners = canvas.getAllByRole("button", {
      name: /Open story:/,
    });
    await expect(storyOpeners).toHaveLength(2);
    const nextOpener = storyOpeners[1];

    await userEvent.click(firstHide!);
    await waitFor(async () => {
      await expect(nextOpener).toHaveFocus();
    });
  },
};
