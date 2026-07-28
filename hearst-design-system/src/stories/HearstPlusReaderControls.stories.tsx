import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  ReaderActionBar,
  type PremiumReaderState,
} from "@/components/hearst-plus";
import type { LiveArticleData } from "@/lib/live-feed-types";
import { getComponentStoryForBrand } from "./hearst-plus-component-fixtures";

function ReaderActionBarExample({
  brandSlug = "elle",
  initialSaved = false,
  premiumReaderState,
}: {
  brandSlug?: string;
  initialSaved?: boolean;
  premiumReaderState?: PremiumReaderState;
}) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [premiumOpenCount, setPremiumOpenCount] = React.useState(0);
  const story = getComponentStoryForBrand(brandSlug);
  const article: LiveArticleData = {
    sourceUrl: story.sourceUrl ?? "https://www.hearst.com/",
    byline: story.byline ?? "Hearst editors",
    publishedAt: "2026-07-20T16:00:00.000Z",
    updatedAt: "2026-07-21T18:30:00.000Z",
    blocks: [{ type: "paragraph", text: story.summary }],
  };

  return (
    <section className="mx-auto max-w-3xl bg-[var(--hp-surface)] p-4 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">
        Production reader control
      </p>
      <h2 className="mt-2 text-2xl font-bold text-foreground">{story.title}</h2>
      <ReaderActionBar
        story={story}
        article={article}
        saved={saved}
        commentCount={12}
        onSave={() => setSaved((current) => !current)}
        premiumReaderState={premiumReaderState}
        onOpenPremiumReader={() =>
          setPremiumOpenCount((current) => current + 1)
        }
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {premiumOpenCount > 0
          ? "Premium reader requested."
          : "Use the controls to review their production states."}
      </p>
    </section>
  );
}

const meta = {
  title: "Hearst Plus/Components/Reader Controls",
  component: ReaderActionBarExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production reader action bar owns source byline and dates, save state, comment navigation, and premium-reader readiness. Phone controls retain 44px targets; desktop controls remain compact.",
      },
    },
  },
  argTypes: {
    brandSlug: { control: "text" },
    initialSaved: { control: "boolean" },
    premiumReaderState: {
      control: "inline-radio",
      options: [undefined, "loading", "ready", "unavailable"],
    },
  },
} satisfies Meta<typeof ReaderActionBarExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args, context) => (
    <ReaderActionBarExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const saveButton = canvas.getByRole("button", { name: "Save story" });
    const commentLink = canvas.getByRole("link", {
      name: "Jump to 12 comments",
    });

    await expect(saveButton).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(saveButton);
    await expect(
      canvas.getByRole("button", { name: "Remove from saved stories" })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(commentLink).toHaveAttribute(
      "href",
      expect.stringMatching(/^#reader-comments-/)
    );

    if (window.innerWidth < 640) {
      const target = commentLink.getBoundingClientRect();
      await expect(target.width).toBeGreaterThanOrEqual(44);
      await expect(target.height).toBeGreaterThanOrEqual(44);
    }
  },
};

export const Saved: Story = {
  render: (_args, context) => (
    <ReaderActionBarExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      initialSaved
    />
  ),
};

export const PremiumReady: Story = {
  name: "Premium reader: Ready",
  render: (_args, context) => (
    <ReaderActionBarExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      premiumReaderState="ready"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const premiumButton = canvas.getByRole("button", {
      name: "Open premium reading experience. Shortcut P",
    });

    await expect(premiumButton).toBeEnabled();
    await expect(premiumButton).toHaveAttribute("aria-keyshortcuts", "P");
    await userEvent.click(premiumButton);
    await expect(canvas.getByText("Premium reader requested.")).toBeVisible();
  },
};

export const PremiumLoading: Story = {
  name: "Premium reader: Loading",
  render: (_args, context) => (
    <ReaderActionBarExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      premiumReaderState="loading"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", {
        name: "Preparing premium reading experience",
      })
    ).toBeDisabled();
  },
};

export const PremiumUnavailable: Story = {
  name: "Premium reader: Unavailable",
  render: (_args, context) => (
    <ReaderActionBarExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      premiumReaderState="unavailable"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("button", {
        name: /premium reading experience/i,
      })
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Save story" })
    ).toBeEnabled();
  },
};
