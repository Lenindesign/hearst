import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, userEvent, waitFor, within } from "@storybook/test";

import {
  ReaderAuthDialog,
  ReaderAvatar,
  ReaderProfileDialog,
  type ReaderAuthMode,
} from "@/components/reader-account-ui";
import { Button } from "@/components/ui/button";
import { createStorySnapshot } from "@/lib/reader-account-model";
import { hearstPlusStoryData } from "./hearst-plus-story-data";
import {
  ReaderAccountStoryBoundary,
  type StoredAccountFixture,
} from "./support/reader-account-story-boundary";

const fixtureCreatedAt = "2026-07-27T12:00:00.000Z";
const savedStory =
  hearstPlusStoryData.all.stories.find((story) => story.brandSlug === "country-living")
  ?? hearstPlusStoryData.all.stories[0];
const secondStory =
  hearstPlusStoryData.all.stories.find((story) => story.brandSlug === "car-and-driver")
  ?? hearstPlusStoryData.all.stories[1];
const profileStories = [savedStory, secondStory];
const profileTopics = ["Home", "Style", "Reviews", "Fitness"];
const profileBrands = ["Country Living", "Car and Driver", "The Pioneer Woman"];

const defaultPreferences = {
  followedTopics: ["Home"],
  followedBrands: ["Country Living"],
  savedTags: [],
  boostedTags: [],
  savedIds: [],
  hiddenIds: [],
  personalizationMode: "onboarding" as const,
};

function createAccountFixture({
  empty = false,
  synced = false,
}: {
  empty?: boolean;
  synced?: boolean;
} = {}): StoredAccountFixture {
  const savedIds = empty ? [] : [savedStory.id, "legacy-save-without-details"];
  return {
    id: synced ? "storybook-google-reader" : "storybook-local-reader",
    syncId: synced ? "storybook-sync-id" : undefined,
    firstName: "Ada",
    lastName: "Reader",
    email: "ada.reader@example.test",
    createdAt: fixtureCreatedAt,
    preferences: {
      ...defaultPreferences,
      savedIds,
    },
    commentsByStoryId: empty ? {} : {
      [savedStory.id]: [{
        id: "storybook-reader-comment",
        storyId: savedStory.id,
        storyTitle: savedStory.title,
        author: "Ada Reader",
        role: "reader",
        body: "I saved this for the weekend.",
        age: "now",
        likes: 0,
        createdAt: fixtureCreatedAt,
      }],
    },
    collections: [
      {
        id: "storybook-read-later",
        name: "Read Later",
        storyIds: savedIds,
        createdAt: fixtureCreatedAt,
        updatedAt: fixtureCreatedAt,
      },
      ...(empty ? [] : [{
        id: "storybook-weekend-reads",
        name: "Weekend reads",
        storyIds: [savedStory.id, "legacy-save-without-details"],
        createdAt: fixtureCreatedAt,
        updatedAt: fixtureCreatedAt,
      }]),
    ],
    storySnapshots: empty ? {} : {
      [savedStory.id]: createStorySnapshot(savedStory),
    },
    passwordHash: "storybook-password-hash",
  };
}

function AuthLauncher({ mode }: { mode: ReaderAuthMode }) {
  const [open, setOpen] = React.useState(false);
  const label = mode === "create" ? "Open profile creation" : "Open local sign in";

  return (
    <ReaderAccountStoryBoundary>
      <div className="min-h-screen bg-[var(--hp-background)] p-5">
        <Button className="min-h-11" onClick={() => setOpen(true)}>
          {label}
        </Button>
        <ReaderAuthDialog
          open={open}
          initialMode={mode}
          defaultPreferences={defaultPreferences}
          onClose={() => setOpen(false)}
        />
      </div>
    </ReaderAccountStoryBoundary>
  );
}

function ProfileLauncher({
  account = createAccountFixture(),
}: {
  account?: StoredAccountFixture;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <ReaderAccountStoryBoundary account={account}>
      <div className="min-h-screen bg-[var(--hp-background)] p-5">
        <Button className="min-h-11" onClick={() => setOpen(true)}>
          Open reader profile
        </Button>
        <ReaderProfileDialog
          open={open}
          stories={profileStories}
          topics={profileTopics}
          brands={profileBrands}
          onClose={() => setOpen(false)}
        />
      </div>
    </ReaderAccountStoryBoundary>
  );
}

function bodyWithin(canvasElement: HTMLElement) {
  return within(canvasElement.ownerDocument.body);
}

async function openDialog(canvasElement: HTMLElement, openerName: string) {
  const canvas = within(canvasElement);
  const opener = canvas.getByRole("button", { name: openerName });
  await userEvent.click(opener);
  const dialog = await bodyWithin(canvasElement).findByRole("dialog");
  return { dialog, opener };
}

const meta = {
  title: "Hearst Plus/Components/Reader Account",
  component: ReaderAuthDialog,
  args: {
    open: false,
    defaultPreferences,
    onClose: () => {},
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production account presentation used by the routed Hearst+ app: browser-local sign in and profile creation, optional verified Google synchronization, avatar identity, profile preferences, saved-story library, comments, and destructive account controls. ReaderAccountProvider remains infrastructure and is not presented as invented UI.",
      },
    },
  },
} satisfies Meta<typeof ReaderAuthDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LocalSignIn: Story = {
  name: "Authentication: local sign in",
  render: () => <AuthLauncher mode="signIn" />,
  play: async ({ canvasElement }) => {
    const { dialog, opener } = await openDialog(canvasElement, "Open local sign in");
    const dialogScope = within(dialog);
    await expect(dialogScope.getByRole("heading", { name: "Welcome back to Hearst+." })).toBeVisible();
    const close = dialogScope.getByRole("button", { name: "Close account dialog" });
    await waitFor(() => expect(close).toHaveFocus());

    for (const control of [
      close,
      dialogScope.getByRole("button", { name: "Sign In" }),
      dialogScope.getByRole("button", { name: /Create a local demo profile/ }),
    ]) {
      await expect(control.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
    for (const field of [
      dialogScope.getByLabelText("Email"),
      dialogScope.getByLabelText("Password"),
    ]) {
      await expect(field.parentElement!.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }

    await userEvent.click(dialogScope.getByRole("button", { name: "Sign In" }));
    await expect(dialogScope.getByRole("alert")).toHaveTextContent("Enter your email and password.");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
    await userEvent.click(opener);
    await bodyWithin(canvasElement).findByRole("dialog");
  },
};

export const CreateLocalProfile: Story = {
  name: "Authentication: create local profile",
  globals: {
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  render: () => <AuthLauncher mode="create" />,
  play: async ({ canvasElement }) => {
    const { dialog } = await openDialog(canvasElement, "Open profile creation");
    const scope = within(dialog);
    await expect(scope.getByText("Save your feed, collections, comments, and reading history in this browser.")).toBeVisible();
    const firstName = scope.getByLabelText("First name");
    const lastName = scope.getByLabelText("Last name");
    const email = scope.getByLabelText("Email");
    const password = scope.getByLabelText("Password", { selector: "input" });
    const confirmation = scope.getByLabelText("Confirm password");
    for (const [field, value] of [
      [firstName, "Ada"],
      [lastName, "Reader"],
      [email, "ada@example.test"],
      [password, "prototype123"],
      [confirmation, "prototype123"],
    ] as const) {
      // This story verifies the controlled values and validation contract, not
      // keyboard cadence. A single change event stays deterministic when the
      // complete browser suite runs its stories in parallel.
      fireEvent.change(field, { target: { value } });
      await waitFor(() => expect(field).toHaveValue(value));
    }

    const terms = scope.getByRole("checkbox");
    await expect(terms.closest("label")!.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.click(scope.getByRole("button", { name: "Create Local Profile" }));
    await expect(scope.getByRole("alert")).toHaveTextContent("Accept the terms to create your account.");
  },
};

export const AvatarFallback: Story = {
  name: "Avatar: initials fallback",
  render: () => (
    <div className="min-h-[240px] bg-[var(--hp-background)] p-8">
      <div className="inline-flex items-center gap-3 rounded-[8px] border border-border bg-background p-4">
        <ReaderAvatar account={{ firstName: "Ada", lastName: "Reader" }} size="lg" />
        <span className="font-semibold">Ada Reader</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("AR")).toBeVisible();
  },
};

export const ProfileOverview: Story = {
  name: "Profile: browser-local overview",
  render: () => <ProfileLauncher />,
  play: async ({ canvasElement }) => {
    const { dialog, opener } = await openDialog(canvasElement, "Open reader profile");
    const scope = within(dialog);
    await expect(scope.getByRole("heading", { name: "Ada Reader" })).toBeVisible();
    await expect(scope.getByText("Browser-local demo profile")).toBeVisible();
    await expect(scope.getByText(/1 saved story/)).toBeVisible();
    const close = scope.getByRole("button", { name: "Close profile" });
    await waitFor(() => expect(close).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
    await userEvent.click(opener);
    await bodyWithin(canvasElement).findByRole("dialog");
  },
};

export const ProfilePreferences: Story = {
  name: "Profile: selected preferences",
  render: () => <ProfileLauncher />,
  play: async ({ canvasElement }) => {
    const { dialog } = await openDialog(canvasElement, "Open reader profile");
    const scope = within(dialog);
    await userEvent.click(scope.getByRole("button", { name: "For You" }));
    await expect(scope.getByRole("button", { name: "Home" })).toHaveAttribute("aria-pressed", "true");
    const countryLiving = scope.getByRole("button", { name: /Country Living/ });
    await expect(countryLiving).toHaveAttribute("aria-pressed", "true");
    await expect(
      countryLiving.querySelector("[data-brand-source-icon]"),
    ).toHaveAttribute("data-brand-slug", "country-living");
    await expect(within(countryLiving).getByText("Country Living")).toBeVisible();
  },
};

export const ProfileLibrary: Story = {
  name: "Profile: saved library and collection cleanup",
  render: () => <ProfileLauncher />,
  play: async ({ canvasElement }) => {
    const { dialog } = await openDialog(canvasElement, "Open reader profile");
    const scope = within(dialog);
    await userEvent.click(scope.getByRole("button", { name: "Library" }));
    await expect(scope.getByRole("heading", { name: "Your library" })).toBeVisible();
    await expect(scope.getByRole("heading", { name: "Weekend reads" })).toBeVisible();
    await expect(scope.queryByRole("heading", { name: "Read Later" })).not.toBeInTheDocument();
    const savedStoryLinks = scope.getAllByRole("link", {
      name: `Open ${savedStory.title}`,
    });
    await expect(
      savedStoryLinks.some((link) => link.getAttribute("href")?.includes("/read/")),
    ).toBe(true);
    await expect(scope.getAllByText(/older save/).length).toBeGreaterThan(0);

    const deleteCollection = scope.getByRole("button", { name: "Delete Weekend reads" });
    await expect(deleteCollection.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.click(deleteCollection);
    const confirm = scope.getByRole("button", { name: "Confirm delete Weekend reads" });
    await expect(confirm).toHaveFocus();
    await expect(confirm).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(scope.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(scope.getByRole("button", { name: "Delete Weekend reads" })).toHaveFocus(),
    );
  },
};

export const ProfileComments: Story = {
  name: "Profile: comment deletion confirmation",
  render: () => <ProfileLauncher />,
  play: async ({ canvasElement }) => {
    const { dialog } = await openDialog(canvasElement, "Open reader profile");
    const scope = within(dialog);
    await userEvent.click(scope.getByRole("button", { name: "Comments" }));
    await expect(scope.getByText("I saved this for the weekend.")).toBeVisible();
    const deleteComment = scope.getByRole("button", { name: "Delete comment" });
    await expect(deleteComment.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.click(deleteComment);
    const confirm = scope.getByRole("button", { name: "Confirm delete comment" });
    await expect(confirm).toHaveFocus();
    await userEvent.click(scope.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(scope.getByRole("button", { name: "Delete comment" })).toHaveFocus(),
    );
  },
};

export const ProfileEmptyStates: Story = {
  name: "Profile: empty library and comments",
  render: () => <ProfileLauncher account={createAccountFixture({ empty: true })} />,
  play: async ({ canvasElement }) => {
    const { dialog } = await openDialog(canvasElement, "Open reader profile");
    const scope = within(dialog);
    await userEvent.click(scope.getByRole("button", { name: "Library" }));
    await expect(scope.getByText("Save a story from the feed and it will appear here.")).toBeVisible();
    await userEvent.click(scope.getByRole("button", { name: "Comments" }));
    await expect(scope.getByText("Join a story conversation and your comments will appear here.")).toBeVisible();
    await userEvent.click(scope.getByRole("button", { name: "Library" }));
  },
};

export const ProfileAccountDeletion: Story = {
  name: "Profile: account deletion confirmation",
  render: () => <ProfileLauncher />,
  play: async ({ canvasElement }) => {
    const { dialog } = await openDialog(canvasElement, "Open reader profile");
    const scope = within(dialog);
    await userEvent.click(scope.getByRole("button", { name: "Account" }));
    const deleteAccount = scope.getByRole("button", { name: "Delete account" });
    await userEvent.click(deleteAccount);
    const confirm = scope.getByRole("button", { name: "Confirm delete account" });
    await expect(confirm).toHaveFocus();
    await expect(confirm).toHaveAttribute("aria-expanded", "true");
    await expect(confirm.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.click(scope.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(scope.getByRole("button", { name: "Delete account" })).toHaveFocus(),
    );
    await userEvent.click(scope.getByRole("button", { name: "Delete account" }));
  },
};

export const SyncedProfileError: Story = {
  name: "Profile: retryable sync error",
  render: () => <ProfileLauncher account={createAccountFixture({ synced: true })} />,
  play: async ({ canvasElement }) => {
    const { dialog } = await openDialog(canvasElement, "Open reader profile");
    const scope = within(dialog);
    await expect(scope.getByText("Google-synced prototype profile")).toBeVisible();
    const alert = await scope.findByRole("alert");
    await expect(alert).toHaveTextContent("Cross-device sync is paused.");
    const retry = within(alert).getByRole("button", { name: "Retry sync" });
    await expect(retry.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};
