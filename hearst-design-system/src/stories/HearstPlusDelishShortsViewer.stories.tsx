import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

import { DelishShortsImmersiveViewer } from "@/components/hearst-plus";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getComponentStoriesForBrand } from "./hearst-plus-component-fixtures";

const STORYBOOK_VERTICAL_VIDEO_FIXTURE =
  "/storybook-vertical-video-fixture.mp4";

function getViewerStories(count = 3): LifestyleRiverStory[] {
  const delishStories = getComponentStoriesForBrand("delish");

  return Array.from({ length: count }, (_, index) => {
    const story = delishStories[index % delishStories.length];
    return {
      ...story,
      id: `storybook-delish-short-${index}-${story.id}`,
      mediaKind: "video",
      videoUrl: STORYBOOK_VERTICAL_VIDEO_FIXTURE,
      videoDuration: 5,
      videoWidth: 540,
      videoHeight: 960,
    };
  });
}

function getBodyLayer(element: HTMLElement) {
  let layer = element;
  while (layer.parentElement && layer.parentElement !== document.body) {
    layer = layer.parentElement;
  }
  return layer;
}

function ViewerExample({
  initialIndex = 0,
  startOpen = true,
  storyCount = 3,
}: {
  initialIndex?: number;
  startOpen?: boolean;
  storyCount?: number;
}) {
  const stories = React.useMemo(() => getViewerStories(storyCount), [storyCount]);
  const openerRef = React.useRef<HTMLButtonElement | null>(null);
  const [openStoryId, setOpenStoryId] = React.useState<string | null>(
    startOpen ? stories[initialIndex]?.id ?? null : null
  );
  const [savedIds, setSavedIds] = React.useState<string[]>([]);
  const [event, setEvent] = React.useState("No viewer action selected.");

  const closeViewer = React.useCallback(() => {
    setOpenStoryId(null);
    setEvent("Viewer closed.");
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  return (
    <main className="min-h-screen bg-[var(--hp-background)] p-6">
      <div className="mx-auto max-w-xl rounded-[8px] border border-border bg-[var(--hp-surface)] p-5">
        <p className="mb-3 text-sm text-muted-foreground">
          The viewer is rendered by the same production component used on the
          Delish publication route and the Hearst+ Videos destination.
        </p>
        <button
          ref={openerRef}
          type="button"
          className="inline-flex min-h-11 items-center rounded-[6px] bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          onClick={() => {
            setOpenStoryId(stories[initialIndex]?.id ?? null);
            setEvent("Viewer opened.");
          }}
        >
          Open Delish Shorts viewer
        </button>
        <p
          className="mt-3 text-sm text-muted-foreground"
          role="status"
          aria-label="Viewer event"
        >
          {event}
        </p>
      </div>

      <DelishShortsImmersiveViewer
        stories={stories}
        openStoryId={openStoryId}
        savedIds={savedIds}
        onClose={closeViewer}
        onSelectStory={setOpenStoryId}
        onOpenStory={(storyId) => {
          setEvent(`Read story: ${storyId}`);
          setOpenStoryId(null);
        }}
        onSave={(story) => {
          setSavedIds((currentIds) =>
            currentIds.includes(story.id)
              ? currentIds.filter((storyId) => storyId !== story.id)
              : [...currentIds, story.id]
          );
          setEvent(`Save toggled: ${story.id}`);
        }}
      />
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Components/Delish Shorts Viewer",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production route-preserving Delish Shorts viewer. It uses one native vertical scroll-snap reel, preloads adjacent videos, isolates the page behind the modal, restores focus through its caller, respects reduced motion, and keeps save, mute, playback, keyboard, swipe, and Read story actions available.",
      },
    },
  },
  globals: {
    brand: "delish",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenViewer: Story = {
  name: "Open viewer",
  render: () => <ViewerExample />,
  play: async ({ canvasElement }) => {
    const body = within(document.body);
    const dialog = await body.findByRole("dialog");
    const storybookLayer = getBodyLayer(canvasElement);

    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(
      body.getByRole("status", {
        name: /Short 1 of 3:/,
      })
    ).toBeInTheDocument();
    await waitFor(async () => {
      await expect(
        body.getByRole("button", { name: "Close Delish Shorts viewer" })
      ).toHaveFocus();
    });
    await expect(storybookLayer).toHaveAttribute("inert");
    await expect(storybookLayer).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelectorAll("video")).toHaveLength(2);
    await userEvent.click(body.getByRole("button", { name: "Pause short" }));
  },
};

export const KeyboardAndActions: Story = {
  name: "Keyboard and actions",
  render: () => <ViewerExample />,
  play: async () => {
    const body = within(document.body);
    const nextButton = await body.findByRole("button", {
      name: "Next Delish Short",
    });

    await userEvent.click(nextButton);
    await waitFor(async () => {
      await expect(
        body.getByRole("status", { name: /Short 2 of 3:/ })
      ).toBeInTheDocument();
    });
    expect(document.querySelectorAll("video")).toHaveLength(3);

    const saveButton = body.getByRole("button", { name: "Save short" });
    await userEvent.click(saveButton);
    await expect(
      body.getByRole("button", { name: "Remove saved short" })
    ).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(body.getByRole("button", { name: "Unmute short" }));
    await expect(
      body.getByRole("button", { name: "Mute short" })
    ).toHaveAttribute("aria-pressed", "true");

    const readButton = body.getByRole("button", {
      name: /Read the full story:/,
    });
    readButton.focus();
    await waitFor(() => {
      expect(
        readButton.closest('[data-testid="delish-short-story-chrome"]')
      ).toHaveClass("pointer-events-auto");
    });
    await userEvent.click(readButton);
    await expect(
      body.getByRole("status", { name: "Viewer event" })
    ).toHaveTextContent("Read story:");
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
  },
};

export const MobileControls: Story = {
  name: "Responsive: mobile controls",
  globals: {
    brand: "delish",
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  render: () => <ViewerExample />,
  play: async () => {
    const body = within(document.body);
    const controlNames = [
      "Close Delish Shorts viewer",
      "Save short",
      "Unmute short",
      "Pause short",
    ];

    for (const name of controlNames) {
      const control = await body.findByRole("button", { name });
      expect(control.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
      expect(control.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    }

    const readButton = body.getByRole("button", {
      name: /Read the full story:/,
    });
    expect(readButton.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    expect(
      body.getByTestId("delish-short-swipe-surface").getBoundingClientRect()
        .width
    ).toBe(window.innerWidth);
    expect(document.documentElement.scrollWidth).toBe(
      document.documentElement.clientWidth
    );
  },
};

export const SingleShort: Story = {
  name: "Boundary: one short",
  render: () => <ViewerExample storyCount={1} />,
  play: async () => {
    const body = within(document.body);
    await expect(
      await body.findByRole("button", { name: "Previous Delish Short" })
    ).toBeDisabled();
    await expect(
      body.getByRole("button", { name: "Next Delish Short" })
    ).toBeDisabled();
    await expect(
      body.getByRole("status", { name: /Short 1 of 1:/ })
    ).toBeInTheDocument();
    await userEvent.click(body.getByRole("button", { name: "Pause short" }));
  },
};

export const DismissalAndFocus: Story = {
  name: "Dismissal and focus restoration",
  render: () => <ViewerExample startOpen={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const opener = canvas.getByRole("button", {
      name: "Open Delish Shorts viewer",
    });

    await userEvent.click(opener);
    await expect(await body.findByRole("dialog")).toBeInTheDocument();
    const closeButton = body.getByRole("button", {
      name: "Close Delish Shorts viewer",
    });
    await waitFor(() => expect(closeButton).toHaveFocus());
    await userEvent.tab({ shift: true });
    await expect(
      body.getByRole("button", { name: "Pause short" })
    ).toHaveFocus();
    await userEvent.tab();
    await expect(closeButton).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(async () => {
      await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
      await expect(opener).toHaveFocus();
    });
    const storybookLayer = getBodyLayer(canvasElement);
    await expect(storybookLayer).not.toHaveAttribute("inert");
    await expect(storybookLayer).not.toHaveAttribute("aria-hidden");
  },
};
