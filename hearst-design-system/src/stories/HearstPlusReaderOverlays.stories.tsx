import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import {
  getLifestyleCommentCount,
  getLifestyleSeedComments,
  HomePageTemplate,
} from "@/components/hearst-plus";
import { ThemeProvider } from "@/components/theme-provider";
import {
  getHearstBrandRoute,
  getHearstDestinationRoute,
} from "@/lib/hearst-routes";
import { primeLiveArticleClientCache } from "@/lib/live-article-client-cache";
import type { LiveArticleData } from "@/lib/live-feed-types";
import { hearstPlusStoryData } from "./hearst-plus-story-data";
import { getComponentStoryForBrand } from "./hearst-plus-component-fixtures";

function ReaderOverlayExample({
  brandSlug = "hearst-all",
  articleMode = "success",
  origin = "publication",
}: {
  brandSlug?: string;
  articleMode?: "success" | "error";
  origin?: "publication" | "destination";
}) {
  const sourceStory = getComponentStoryForBrand(brandSlug, (story) => Boolean(story.sourceUrl));
  const readerStory = articleMode === "error" && sourceStory.sourceUrl
    ? {
        ...sourceStory,
        id: `storybook-error-${sourceStory.id}`,
        sourceUrl: (() => {
          const url = new URL(sourceStory.sourceUrl);
          url.searchParams.set("storybook_error", "1");
          return url.toString();
        })(),
      }
    : sourceStory;
  const destinationKey = (["lifestyle", "autos", "flux", "ew"] as const).find(
    (destination) =>
      hearstPlusStoryData[destination].stories.some((story) => story.id === sourceStory.id),
  ) ?? "lifestyle";
  const storyData = {
    ...hearstPlusStoryData,
    all: {
      ...hearstPlusStoryData.all,
      stories: [
        readerStory,
        ...hearstPlusStoryData.all.stories.filter((story) => story.id !== sourceStory.id),
      ],
    },
    [destinationKey]: {
      ...hearstPlusStoryData[destinationKey],
      stories: [
        readerStory,
        ...hearstPlusStoryData[destinationKey].stories.filter(
          (story) => story.id !== sourceStory.id,
        ),
      ],
    },
  };

  if (articleMode === "success") {
    const fixtureStories = [
      readerStory,
      ...hearstPlusStoryData[destinationKey].stories,
    ].filter(
      (story, index, stories) =>
        Boolean(story.sourceUrl)
        && stories.findIndex((candidate) => candidate.id === story.id) === index,
    );

    fixtureStories.forEach((story) => {
      if (!story.sourceUrl) return;
      const articleFixture: LiveArticleData = {
        sourceUrl: story.sourceUrl,
        byline: story.byline,
        publishedAt: story.publishedAt,
        blocks: [
          { type: "paragraph", text: story.summary },
          { type: "heading", text: "What to know" },
          {
            type: "paragraph",
            text: "This deterministic Storybook response exercises the production article-reader layout, typography, actions, and reading flow without calling a live content service.",
          },
          {
            type: "paragraph",
            text: "Publication metadata, imagery, and theme values come from the generated production-aligned fixture.",
          },
        ],
      };
      primeLiveArticleClientCache(story.sourceUrl, articleFixture);
    });
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <ThemeProvider defaultBrandSlug="hearst-all" persistColorMode={false}>
        <HomePageTemplate
          staticDestinationData={storyData}
          initialBrandSlug={readerStory.brandSlug}
          initialOpenStoryId={articleMode === "error" ? readerStory.id : undefined}
          readerReturnHref={origin === "publication"
            ? getHearstBrandRoute(readerStory.brandSlug)
            : getHearstDestinationRoute(destinationKey)}
        />
      </ThemeProvider>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Reader Overlays",
  component: ReaderOverlayExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Integrated coverage for the production Hearst+ content reader modal. Publication and destination entries remain separate contracts. The production masthead owns publication identity, loaded-story status, cross-publication navigation, section filters, and the responsive Close target. The production content-reader model owns source readiness, deterministic comment totals and seed content, contextual grouping, and recommendation ranking. Deterministic article responses exercise the production shell, queue, nested gallery and Ambient Reader handoffs, and static-catalog failure path without a live Next.js route handler.",
      },
    },
  },
} satisfies Meta<typeof ReaderOverlayExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentReader: Story = {
  name: "Publication reader modal",
  render: (_args, context) => <ReaderOverlayExample key={context.globals.brand} brandSlug={context.globals.brand} />,
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const storyTriggers = await canvas.findAllByRole("button", { name: /^Open story:/ });
    const trigger = storyTriggers.find((element) => element.getClientRects().length > 0);

    await expect(trigger).toBeDefined();
    const openedTitle = trigger?.getAttribute("aria-label")?.replace(
      /^Open story:\s*/,
      "",
    );
    const sourceStory = [
      getComponentStoryForBrand(globals.brand),
      ...hearstPlusStoryData.all.stories,
    ].find((story) => story.title === openedTitle);
    await expect(sourceStory).toBeDefined();
    const expectedStory = sourceStory!;
    await userEvent.click(trigger!);

    const dialog = await page.findByRole("dialog", { name: "Story reader" });
    await expect(dialog).toBeVisible();
    await expect(
      within(dialog).getByRole("link", { name: `Go to ${expectedStory.brand} homepage` }),
    ).toBeVisible();
    const publicationScopeName =
      /^(Lifestyle|Autos|Fashion & Luxury|Enthusiast & Wellness) publications$/;
    if (window.innerWidth >= 1024) {
      await expect(
        within(dialog).getByRole("navigation", {
          name: publicationScopeName,
        }),
      ).toBeVisible();
    } else {
      await expect(
        within(dialog).queryByRole("navigation", {
          name: publicationScopeName,
        }),
      ).not.toBeInTheDocument();
    }
    await expect(within(dialog).getByText(`Reading ${expectedStory.brand}`)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        within(dialog).getByRole("button", { name: "Close story reader" }),
      ).toHaveFocus(),
    );
    const closeTarget = within(dialog)
      .getByRole("button", { name: "Close story reader" })
      .getBoundingClientRect();
    const minimumCloseTarget = window.innerWidth < 640 ? 44 : 28;
    await expect(closeTarget.width).toBeGreaterThanOrEqual(minimumCloseTarget);
    await expect(closeTarget.height).toBeGreaterThanOrEqual(minimumCloseTarget);

    if (window.innerWidth >= 1024) {
      await waitFor(() =>
        expect(
          within(dialog).getByRole("button", { name: /^View image fullscreen:/ }),
        ).toBeVisible(),
      );
      await expect(within(dialog).getByText("What to know")).toBeVisible();
      const getFocusableElements = () => Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) =>
        element.getClientRects().length > 0
        && !element.closest('[inert], [aria-hidden="true"]')
      );
      const forwardBoundary = getFocusableElements();
      const firstFocusableElement = forwardBoundary[0];
      const lastFocusableElement = forwardBoundary.at(-1);
      await expect(firstFocusableElement).toBeDefined();
      await expect(lastFocusableElement).toBeDefined();
      lastFocusableElement!.focus();
      await expect(lastFocusableElement).toHaveFocus();
      const forwardTabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      lastFocusableElement!.dispatchEvent(forwardTabEvent);
      await expect(forwardTabEvent.defaultPrevented).toBe(true);
      await waitFor(() =>
        expect(getFocusableElements()[0]).toHaveFocus(),
      );

      const reverseBoundary = getFocusableElements();
      const reverseFirstElement = reverseBoundary[0];
      const reverseLastElement = reverseBoundary.at(-1);
      const reverseLastLabel = reverseLastElement?.getAttribute("aria-label");
      await expect(reverseFirstElement).toBeDefined();
      await expect(reverseLastElement).toBeDefined();
      await expect(reverseLastLabel).toBeTruthy();
      reverseFirstElement!.focus();
      const reverseTabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      reverseFirstElement!.dispatchEvent(reverseTabEvent);
      await expect(reverseTabEvent.defaultPrevented).toBe(true);
      await waitFor(() =>
        expect(document.activeElement).toHaveAttribute(
          "aria-label",
          reverseLastLabel!,
        ),
      );
    }

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());

    await userEvent.click(trigger!);
    const reopenedDialog = await page.findByRole("dialog", { name: "Story reader" });
    await expect(reopenedDialog).toBeVisible();
    await expect(
      within(reopenedDialog).queryByText("This complete article could not be loaded."),
    ).not.toBeInTheDocument();
    await expect(within(reopenedDialog).getByText("What to know")).toBeVisible();
    const commentsRegion = within(reopenedDialog).getByRole("region", {
      name: `Comments for ${expectedStory.title}`,
    });
    const seededComment = getLifestyleSeedComments(expectedStory)[0];
    await expect(
      within(commentsRegion).getByLabelText(
        `${getLifestyleCommentCount(expectedStory)} comments`,
      ),
    ).toBeVisible();
    await expect(within(commentsRegion).getByText(seededComment.body)).toBeVisible();
    await expect(
      within(reopenedDialog).getByRole("region", {
        name: `More in ${expectedStory.topic}`,
      }),
    ).toBeVisible();

    const followButton = within(reopenedDialog).getByRole("button", {
      name: /^(Follow|Unfollow) .* brand$/,
    });
    const minimumTargetSize = window.innerWidth < 640 ? 44 : 28;
    await waitFor(() => {
      const followTarget = followButton.getBoundingClientRect();
      expect(followTarget.width).toBeGreaterThanOrEqual(minimumTargetSize);
      expect(followTarget.height).toBeGreaterThanOrEqual(minimumTargetSize);
    });

    followButton.focus();
    await expect(followButton).toHaveFocus();

    const saveButton = within(reopenedDialog).getByRole("button", { name: "Save story" });
    saveButton.focus();
    await expect(saveButton).toHaveFocus();
    await expect(window.getComputedStyle(saveButton).boxShadow).not.toBe("none");
  },
};

export const DestinationReader: Story = {
  name: "Destination reader modal",
  render: (_args, context) => (
    <ReaderOverlayExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      origin="destination"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const storyTriggers = await canvas.findAllByRole("button", { name: /^Open story:/ });
    const trigger = storyTriggers.find((element) => element.getClientRects().length > 0);

    await expect(trigger).toBeDefined();
    await userEvent.click(trigger!);

    const dialog = await page.findByRole("dialog", { name: "Story reader" });
    await expect(within(dialog).getByText(/^Reading (Lifestyle|Autos|Fashion & Luxury|Enthusiast & Wellness)$/)).toBeVisible();
    await expect(
      within(dialog).getByRole("link", { name: /^Go to (Lifestyle|Autos|Fashion & Luxury|Enthusiast & Wellness) homepage$/ }),
    ).toBeVisible();
    await expect(
      within(dialog).getByRole("navigation", {
        name: "Hearst destinations",
      }),
    ).toBeVisible();
  },
};

export const NestedGallery: Story = {
  name: "Nested gallery and focus",
  render: (_args, context) => <ReaderOverlayExample key={context.globals.brand} brandSlug={context.globals.brand} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const storyTriggers = await canvas.findAllByRole("button", { name: /^Open story:/ });
    const trigger = storyTriggers.find((element) => element.getClientRects().length > 0);

    await expect(trigger).toBeDefined();
    await userEvent.click(trigger!);

    const readerDialog = await page.findByRole("dialog", { name: "Story reader" });
    const imageOpener = within(readerDialog).getByRole("button", {
      name: /^View image fullscreen:/,
    });
    await userEvent.click(imageOpener);

    const galleryDialog = await page.findByRole("dialog", {
      name: /^Fullscreen gallery for/,
    });
    await expect(galleryDialog).toBeVisible();
    await expect(readerDialog).toHaveAttribute("aria-hidden", "true");
    await expect((readerDialog as HTMLElement).inert).toBe(true);
    await expect(
      within(galleryDialog).getByRole("button", { name: "Close fullscreen gallery" }),
    ).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        page.queryByRole("dialog", { name: /^Fullscreen gallery for/ }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(imageOpener).toHaveFocus());
    await expect(readerDialog).toBeVisible();
    await expect(readerDialog).not.toHaveAttribute("aria-hidden");
    await expect((readerDialog as HTMLElement).inert).toBe(false);
  },
};

export const AmbientReaderHandoff: Story = {
  name: "Ambient Reader handoff",
  render: (_args, context) => <ReaderOverlayExample key={context.globals.brand} brandSlug={context.globals.brand} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const storyTriggers = await canvas.findAllByRole("button", { name: /^Open story:/ });
    const trigger = storyTriggers.find((element) => element.getClientRects().length > 0);

    await expect(trigger).toBeDefined();
    await userEvent.click(trigger!);

    const readerDialog = await page.findByRole("dialog", { name: "Story reader" });
    const ambientOpener = within(readerDialog).getByRole("button", {
      name: "Open premium reading experience. Shortcut P",
    });
    await userEvent.click(ambientOpener);

    const ambientDialog = await page.findByRole("dialog", {
      name: /^Ambient Reader:/,
    });
    await expect(ambientDialog).toBeVisible();
    await expect(readerDialog).toHaveAttribute("aria-hidden", "true");
    await expect((readerDialog as HTMLElement).inert).toBe(true);
    await expect(
      within(ambientDialog).getByRole("button", { name: "Close Ambient Reader" }),
    ).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(ambientOpener).toHaveFocus());
    await expect(readerDialog).toBeVisible();
    await expect(readerDialog).not.toHaveAttribute("aria-hidden");
    await expect((readerDialog as HTMLElement).inert).toBe(false);
  },
};

export const ContentReaderError: Story = {
  name: "Error: Article content unavailable",
  beforeEach: () => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      if (
        String(input).includes("/api/live-article/")
        && String(input).includes("storybook_error")
      ) {
        return new Response("Storybook article failure fixture", { status: 503 });
      }
      return originalFetch(input, init);
    };
    return () => {
      window.fetch = originalFetch;
    };
  },
  render: (_args, context) => (
    <ReaderOverlayExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      articleMode="error"
    />
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole("dialog", { name: "Story reader" });
    await expect(
      await within(dialog).findByText(
        "This complete article could not be loaded.",
        undefined,
        { timeout: 3000 },
      ),
    ).toBeVisible();
    await waitFor(() =>
      expect(
        within(dialog).getByRole("button", { name: "Close story reader" }),
      ).toHaveFocus(),
    );
  },
};
