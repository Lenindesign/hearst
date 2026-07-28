import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import {
  getLifestyleCardKind,
  getLifestyleKindLabel,
  LifestyleCardModule,
  LifestyleRiverImage,
} from "@/components/hearst-plus/story-presentation";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  hearstPlusStoryData,
  hearstPlusVideoStoryData,
} from "./hearst-plus-story-data";

const presentationLabels = [
  "Article",
  "Gallery",
  "Watch",
  "Recipe",
  "Specs",
  "Shop",
  "Guide",
] as const;

const presentationStories = [
  ...hearstPlusStoryData.all.stories,
  ...hearstPlusVideoStoryData.all.stories,
];

function getPresentationStory(label: typeof presentationLabels[number]) {
  const story = presentationStories.find((candidate) => {
    const kind = getLifestyleCardKind(candidate);
    return getLifestyleKindLabel(kind, candidate) === label;
  });

  if (!story) {
    throw new Error(`Missing production-aligned ${label} story fixture`);
  }

  return story;
}

function StoryPresentationSpecimen({
  story,
}: {
  story: LifestyleRiverStory;
}) {
  const kind = getLifestyleCardKind(story);
  const label = getLifestyleKindLabel(kind, story);
  const hasSupplementalModule = kind === "recipe" || kind === "shopping";

  return (
    <article
      data-story-presentation={label}
      className="min-w-0 rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
    >
      <LifestyleRiverImage
        story={story}
        className="aspect-video w-full rounded-[4px]"
      />
      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Resolved presentation: {label}
          </p>
          <code className="rounded bg-muted px-2 py-1 text-xs text-foreground">
            resolver: {kind}
          </code>
        </div>
        <h2 className="headline mt-2 text-2xl leading-tight">{story.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {story.brand} · {story.topic}
        </p>
        <LifestyleCardModule story={story} kind={kind} />
        {!hasSupplementalModule ? (
          <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-foreground">
            No supplemental metadata block. The production card keeps its
            standard article, gallery, or video anatomy.
          </p>
        ) : null}
      </div>
    </article>
  );
}

function StoryPresentationMatrix() {
  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-6">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Production rules
          </p>
          <h1 className="headline mt-2 text-3xl">Story presentation matrix</h1>
          <p className="mt-2 text-sm leading-6 text-foreground">
            Each specimen uses checked-in production-aligned editorial metadata.
            The shared resolver decides the card meaning once; the river,
            reader, filters, and stakeholder counts consume the same result.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {presentationLabels.map((label) => (
            <StoryPresentationSpecimen
              key={label}
              story={getPresentationStory(label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Story Presentation",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct specification for the production story-presentation resolver and its supplemental recipe, vehicle-specification, shopping, and guide metadata. The same pure rules are consumed by the river, reader, video filtering, and stakeholder inventory; Storybook does not maintain a second classification model.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClassificationMatrix: Story = {
  name: "Classification and metadata matrix",
  render: () => <StoryPresentationMatrix />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const label of presentationLabels) {
      const specimen = canvasElement.querySelector(
        `[data-story-presentation="${label}"]`,
      );
      await expect(specimen).toBeInTheDocument();
    }

    await expect(canvas.getByText("0-60")).toBeVisible();
    await expect(canvas.getAllByText(/editor picks/)[0]).toBeVisible();
    await expect(canvas.getAllByRole("img")).toHaveLength(presentationLabels.length);
  },
};
