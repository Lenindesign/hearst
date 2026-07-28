import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import {
  LifestyleRiverLoadingState,
  ProgressiveFeedSentinelStatus,
} from "@/components/hearst-plus";

function FeedStateFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="hearst-plus-theme min-h-[240px] w-full bg-[var(--hp-background)] p-6">
      {children}
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Feed States",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Production loading, progressive-delivery error, retry, and completion states used by the Hearst+ story river.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  name: "Loading: Personalized feed",
  render: () => (
    <FeedStateFrame>
      <LifestyleRiverLoadingState pageHeading="Hearst Magazines personalized story feed" />
    </FeedStateFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loadingState = canvas.getByLabelText("Loading your personalized feed");

    await expect(loadingState).toHaveAttribute("aria-busy", "true");
    await expect(
      within(loadingState).getByRole("heading", {
        name: "Hearst Magazines personalized story feed",
      })
    ).toBeInTheDocument();
  },
};

export const ErrorWithRetry: Story = {
  name: "Error: More stories with retry",
  render: () => {
    const ErrorExample = () => {
      const [retried, setRetried] = React.useState(false);
      return (
        <FeedStateFrame>
          {retried ? (
            <p role="status">Retry requested.</p>
          ) : (
            <ProgressiveFeedSentinelStatus
              error="The next story page could not be loaded."
              hasLoadedStories
              hasMore
              isLoading={false}
              noun="stories"
              onRetry={() => setRetried(true)}
            />
          )}
        </FeedStateFrame>
      );
    };

    return <ErrorExample />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("More stories could not be loaded.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("Retry requested.");
  },
};

export const ErrorState: Story = {
  name: "Error: More stories",
  render: () => (
    <FeedStateFrame>
      <ProgressiveFeedSentinelStatus
        error="The next story page could not be loaded."
        hasLoadedStories
        hasMore
        isLoading={false}
        noun="stories"
        onRetry={fn()}
      />
    </FeedStateFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("More stories could not be loaded.")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Retry" })).toBeEnabled();
  },
};

export const EndOfRiver: Story = {
  name: "Empty: End of river",
  render: () => (
    <FeedStateFrame>
      <ProgressiveFeedSentinelStatus
        error={null}
        hasLoadedStories={false}
        hasMore={false}
        isLoading={false}
        noun="stories"
        onRetry={fn()}
      />
    </FeedStateFrame>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("You’re caught up on this river.")
    ).toBeVisible();
  },
};
