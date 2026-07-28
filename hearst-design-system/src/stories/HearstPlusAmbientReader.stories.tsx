import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import {
  AmbientArticleReader,
  type AmbientInterstitialAdvertiser,
} from "@/components/hearst-plus";
import { ThemeProvider } from "@/components/theme-provider";
import { fluxRiverStories } from "@/components/flux-river-data";
import type { LiveArticleData } from "@/lib/live-feed-types";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { hearstPlusStoryData } from "./hearst-plus-story-data";
import { getComponentStoryForBrand } from "./hearst-plus-component-fixtures";

function getDestinationStories(story: LifestyleRiverStory) {
  if (fluxRiverStories.some((candidate) => candidate.id === story.id)) {
    return fluxRiverStories.filter(
      (candidate, index, stories) =>
        Boolean(candidate.sourceUrl)
        && stories.findIndex((other) => other.id === candidate.id) === index
    );
  }

  const destination = (["lifestyle", "autos", "flux", "ew"] as const).find(
    (key) => hearstPlusStoryData[key].stories.some((candidate) => candidate.id === story.id)
  ) ?? "lifestyle";

  const candidates = hearstPlusStoryData[destination].stories.filter(
    (candidate, index, stories) =>
      Boolean(candidate.sourceUrl)
      && stories.findIndex((other) => other.id === candidate.id) === index
  );

  return candidates.length >= 3
    ? candidates
    : hearstPlusStoryData.all.stories.filter((candidate) => Boolean(candidate.sourceUrl));
}

function getAmbientArticleFixture(story: LifestyleRiverStory): LiveArticleData {
  return {
    sourceUrl: story.sourceUrl ?? `https://example.com/${story.id}`,
    byline: story.byline,
    publishedAt: story.publishedAt,
    blocks: [
      {
        type: "paragraph",
        text: story.summary,
      },
      {
        type: "heading",
        text: "The production reading rhythm",
      },
      {
        type: "paragraph",
        text: "This deterministic specification renders the same Ambient Reader component used by the routed Hearst+ product. It keeps publication typography, destination layouts, reading controls, and modal behavior reviewable without a live article request.",
      },
      {
        type: "image",
        url: story.image,
        alt: `${story.brand} editorial detail`,
        caption: "Production-aligned editorial imagery from the generated Storybook fixture.",
        credit: story.imageCredit,
      },
      {
        type: "quote",
        text: "Storybook is the specification; the routed product remains the source of truth.",
      },
      {
        type: "paragraph",
        text: "Use the previous and next controls, arrow keys, reading-density control, theme switch, related stories, and close action to review the complete interaction contract.",
      },
      {
        type: "list",
        items: [
          "Publication identity and destination layout",
          "Keyboard, focus, swipe, and reading progress",
          "Nested image viewing and sponsored interstitial states",
        ],
      },
    ],
  };
}

function AmbientReaderExample({
  brandSlug = "esquire",
  initiallyOpen = true,
  initialInterstitial = false,
  advertiser = "van-cleef",
}: {
  brandSlug?: string;
  initiallyOpen?: boolean;
  initialInterstitial?: boolean;
  advertiser?: AmbientInterstitialAdvertiser;
}) {
  const productionComparisonStory = brandSlug === "esquire"
    ? fluxRiverStories.find(
        (story) => story.title === "The 18 Best Colognes You Can Buy on Amazon"
      )
    : undefined;
  const sourceStory = productionComparisonStory ?? getComponentStoryForBrand(
    brandSlug,
    (story) => Boolean(story.sourceUrl)
  );
  const stories = getDestinationStories(sourceStory);
  const initialIndex = Math.max(
    0,
    stories.findIndex((story) => story.id === sourceStory.id)
  );
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [open, setOpen] = React.useState(initiallyOpen);
  const [showInterstitial, setShowInterstitial] = React.useState(initialInterstitial);
  const currentStory = stories[currentIndex] ?? sourceStory;
  const previousStory = currentIndex > 0 ? stories[currentIndex - 1] : undefined;
  const nextStory = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : undefined;

  const openReader = () => {
    setCurrentIndex(initialIndex);
    setShowInterstitial(initialInterstitial);
    setOpen(true);
  };

  return (
    <ThemeProvider defaultBrandSlug="hearst-all" persistColorMode={false}>
      <main className="flex min-h-screen items-center justify-center bg-[var(--hp-background)] p-6">
        <button
          type="button"
          onClick={openReader}
          className="inline-flex min-h-11 items-center justify-center rounded-[4px] bg-primary px-5 text-sm font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Open Ambient Reader
        </button>
        {open ? (
          <AmbientArticleReader
            story={currentStory}
            article={getAmbientArticleFixture(currentStory)}
            previousStory={previousStory}
            nextStory={nextStory}
            previousArticle={previousStory ? getAmbientArticleFixture(previousStory) : undefined}
            nextArticle={nextStory ? getAmbientArticleFixture(nextStory) : undefined}
            previousInterstitialAdvertiser={previousStory ? advertiser : null}
            nextInterstitialAdvertiser={nextStory ? advertiser : null}
            discoveryStatus="complete"
            discoveryScope="brand-category"
            discoveryCount={stories.length}
            relatedStories={stories
              .filter((story) => story.id !== currentStory.id)
              .slice(0, 3)}
            onClose={() => setOpen(false)}
            onNavigateStory={(storyId) => {
              const nextIndex = stories.findIndex((story) => story.id === storyId);
              if (nextIndex >= 0) setCurrentIndex(nextIndex);
            }}
            onOpenImage={() => undefined}
            showInterstitialAd={showInterstitial}
            interstitialAdvertiser={advertiser}
            onDismissInterstitialAd={() => setShowInterstitial(false)}
          />
        ) : null}
      </main>
    </ThemeProvider>
  );
}

const meta = {
  title: "Hearst Plus/Components/Ambient Reader",
  component: AmbientReaderExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct specification for the production Hearst+ Ambient Reader. The component retains publication branding, destination-specific editorial openings, article-to-article snap navigation, reading density and theme controls, progress, related stories, nested image requests, focus isolation, and sponsored interstitial behavior.",
      },
    },
  },
} satisfies Meta<typeof AmbientReaderExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Publication article",
  globals: {
    brand: "esquire",
  },
  render: (_args, context) => (
    <AmbientReaderExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
    />
  ),
};

export const KeyboardAndPreferences: Story = {
  name: "Keyboard, theme, density, and focus",
  globals: {
    brand: "esquire",
  },
  render: (_args, context) => (
    <AmbientReaderExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      initiallyOpen={false}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const opener = canvas.getByRole("button", { name: "Open Ambient Reader" });

    await userEvent.click(opener);

    const dialog = await page.findByRole("dialog", { name: /^Ambient Reader:/ });
    const closeButton = within(dialog).getByRole("button", { name: "Close Ambient Reader" });
    await expect(closeButton).toHaveFocus();

    const targetControls = [
      within(dialog).getByRole("button", { name: /^Previous article:/ }),
      within(dialog).getByRole("button", { name: /^Next article:/ }),
      within(dialog).getByRole("button", { name: /^Reading density:/ }),
      within(dialog).getByRole("button", { name: "Use dark reader theme" }),
      closeButton,
    ];
    targetControls.forEach((control) => {
      const target = control.getBoundingClientRect();
      expect(target.width).toBeGreaterThanOrEqual(44);
      expect(target.height).toBeGreaterThanOrEqual(44);
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Reading density: airy. Change density" })
    );
    await expect(
      within(dialog).getByRole("button", { name: "Reading density: compact. Change density" })
    ).toBeVisible();

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Use dark reader theme" })
    );
    await expect(
      within(dialog).getByRole("button", { name: "Use light reader theme" })
    ).toBeVisible();

    const initialDialogName = dialog.getAttribute("aria-label");
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(dialog.getAttribute("aria-label")).not.toBe(initialDialogName)
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(page.queryByRole("dialog", { name: /^Ambient Reader:/ })).not.toBeInTheDocument()
    );
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

export const SponsoredInterstitial: Story = {
  name: "Sponsored interstitial",
  globals: {
    brand: "esquire",
  },
  render: (_args, context) => (
    <AmbientReaderExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      initiallyOpen={false}
      initialInterstitial
      advertiser="van-cleef"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      canvas.getByRole("button", { name: "Open Ambient Reader" })
    );

    const dialog = await page.findByRole("dialog", { name: /^Ambient Reader:/ });
    const closeAdvertisement = within(dialog).getByRole("button", {
      name: "Close advertisement",
    });
    await expect(closeAdvertisement).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await expect(
      within(dialog).getByRole("button", { name: "Close Ambient Reader" })
    ).toHaveFocus();
    await expect(
      within(dialog).getByRole("heading", { level: 1 })
    ).toBeVisible();
  },
};
