import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  ContentReaderComments,
  type LifestyleStoryComment,
} from "@/components/hearst-plus";
import { getComponentStoryForBrand } from "./hearst-plus-component-fixtures";

function ReaderCommentsExample({
  brandSlug = "elle",
  initialComments = [],
}: {
  brandSlug?: string;
  initialComments?: LifestyleStoryComment[];
}) {
  const story = getComponentStoryForBrand(brandSlug);
  const [comments, setComments] = React.useState(initialComments);

  return (
    <main className="min-h-screen bg-[var(--hp-background)] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Production reader component
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          {story.title}
        </h1>
        <ContentReaderComments
          key={story.id}
          story={story}
          comments={comments}
          onAddComment={(body) =>
            setComments((current) => [
              {
                id: `${story.id}-storybook-comment-${current.length}`,
                author: "You",
                role: "reader",
                body,
                age: "now",
                likes: 0,
              },
              ...current,
            ])
          }
        />
      </div>
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Components/Reader Comments",
  component: ReaderCommentsExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production reader comments boundary combines deterministic story-specific discussion with comments added during the current reader session. The composer has an explicit accessible name and guidance, prevents blank posts, clears after submission, and places the newest reader comment first. Production always provides seeded discussion, so there is intentionally no empty visual state.",
      },
    },
  },
  argTypes: {
    brandSlug: { control: "text" },
  },
} satisfies Meta<typeof ReaderCommentsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (_args, context) => (
    <ReaderCommentsExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
    />
  ),
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const story = getComponentStoryForBrand(globals.brand ?? "elle");
    const comments = canvas.getByRole("region", {
      name: `Comments for ${story.title}`,
    });
    const field = within(comments).getByRole("textbox", {
      name: `Add a comment about ${story.title}`,
    });
    const postButton = within(comments).getByRole("button", { name: "Post" });

    await expect(postButton).toBeDisabled();
    await expect(field).toHaveAttribute(
      "aria-describedby",
      `reader-comment-guidance-${story.id}`,
    );

    await userEvent.type(field, "The production detail makes this useful.");
    await expect(postButton).toBeEnabled();
    await userEvent.click(postButton);

    await expect(field).toHaveValue("");
    await expect(
      within(comments).getByText("The production detail makes this useful."),
    ).toBeVisible();
    await expect(
      within(comments).getByRole("button", {
        name: "Like comment by You. 0 likes",
      }),
    ).toBeVisible();
    await expect(
      within(comments).getByRole("button", { name: "Reply to You" }),
    ).toBeVisible();

    if (window.innerWidth < 640) {
      for (const control of [
        postButton,
        within(comments).getByRole("button", {
          name: "Like comment by You. 0 likes",
        }),
        within(comments).getByRole("button", { name: "Reply to You" }),
      ]) {
        await expect(control.getBoundingClientRect().height).toBeGreaterThanOrEqual(
          44,
        );
      }
    }
  },
};

export const ExistingReaderComment: Story = {
  name: "Existing reader comment",
  render: (_args, context) => (
    <ReaderCommentsExample
      key={context.globals.brand}
      brandSlug={context.globals.brand}
      initialComments={[
        {
          id: "saved-reader-comment",
          author: "Alex Rivera",
          role: "subscriber",
          body: "The source detail is exactly what I needed before saving this.",
          age: "12m ago",
          likes: 8,
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText(
        "The source detail is exactly what I needed before saving this.",
      ),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", {
        name: "Like comment by Alex Rivera. 8 likes",
      }),
    ).toBeVisible();
  },
};
