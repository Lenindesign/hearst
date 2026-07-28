import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

import {
  HearstOnboardingModal,
  type HearstOnboardingConfig,
  type HearstOnboardingResult,
} from "@/components/hearst-plus";
import { Button } from "@/components/ui/button";
import { hearstPlusStoryData } from "./hearst-plus-story-data";

const sourceNotes = hearstPlusStoryData.all.sourceNotes.filter(
  (note, index, notes) =>
    notes.findIndex((candidate) => candidate.brandSlug === note.brandSlug)
      === index,
);

const onboardingConfig = {
  mode: "all",
  filters: [
    "For You",
    "Home",
    "Style",
    "Reviews",
    "Fitness",
    "Cars",
    "Videos",
    "Shopping",
    "Games",
  ],
  stories: hearstPlusStoryData.all.stories,
  sourceNotes,
} satisfies HearstOnboardingConfig;

const brandInventory = Object.fromEntries(
  sourceNotes.map((note) => [note.brandSlug, note.selectedCount]),
);

function OnboardingExample() {
  const [open, setOpen] = React.useState(true);
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [event, setEvent] = React.useState("Onboarding opened.");
  const [result, setResult] = React.useState<HearstOnboardingResult | null>(null);

  const recordResult = React.useCallback(
    (nextResult: HearstOnboardingResult) => {
      setResult(nextResult);
      setEvent("Preferences applied.");
    },
    [],
  );

  return (
    <main className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-6 text-[var(--hp-text-primary)]">
      <div className="mx-auto max-w-xl rounded-[8px] border border-border bg-[var(--hp-surface)] p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Production onboarding
        </p>
        <h1 className="headline mt-2 text-3xl">Personalization setup</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This canvas mounts the same onboarding component used by the live
          Hearst+ destination.
        </p>
        <Button
          className="mt-5 min-h-11"
          onClick={() => {
            setOpen(true);
            setEvent("Onboarding opened.");
          }}
        >
          Reopen onboarding
        </Button>
        <div className="sr-only">
          <p role="status" aria-label="Onboarding event">
            {event}
          </p>
          <p role="status" aria-label="Onboarding step">
            {step}
          </p>
          <p role="status" aria-label="Onboarding interests">
            {result?.interests.join(", ") || "No preferences applied."}
          </p>
        </div>
      </div>

      <HearstOnboardingModal
        open={open}
        config={onboardingConfig}
        allBrandConfig={onboardingConfig}
        brandInventory={brandInventory}
        onClose={() => {
          setOpen(false);
          setEvent("Onboarding closed.");
        }}
        onComplete={recordResult}
        onCreateProfile={(nextResult) => {
          setResult(nextResult);
          setEvent("Profile handoff requested.");
        }}
        onSignIn={() => {
          setOpen(false);
          setEvent("Sign-in handoff requested.");
        }}
        onStepChange={setStep}
      />
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Product/Onboarding",
  component: HearstOnboardingModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The production Hearst+ personalization modal. One or two interests are required, brand selection is optional, and the account handoff never blocks browser-local reading.",
      },
    },
  },
  args: {
    open: true,
    config: onboardingConfig,
    allBrandConfig: onboardingConfig,
    brandInventory,
    onClose: fn(),
    onComplete: fn(),
    onCreateProfile: fn(),
    onSignIn: fn(),
  },
} satisfies Meta<typeof HearstOnboardingModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function getPage(canvasElement: HTMLElement) {
  return within(canvasElement.ownerDocument.body);
}

async function openBrandStep(canvasElement: HTMLElement) {
  const page = getPage(canvasElement);
  const dialog = await page.findByRole("dialog", {
    name: "Pick what you want to see more often.",
  });

  await userEvent.click(
    within(dialog).getByRole("button", { name: "Home" }),
  );
  await userEvent.click(
    within(dialog).getByRole("button", { name: "Continue" }),
  );

  return page.findByRole("dialog", {
    name: "Follow brands you trust.",
  });
}

export const Interests: Story = {
  name: "Interests: empty and preview",
  render: () => <OnboardingExample />,
  play: async ({ canvasElement }) => {
    const page = getPage(canvasElement);
    const dialog = await page.findByRole("dialog", {
      name: "Pick what you want to see more often.",
    });
    const dialogCanvas = within(dialog);
    const heading = dialogCanvas.getByRole("heading", {
      name: "Pick what you want to see more often.",
    });
    const closeButton = dialogCanvas.getByRole("button", {
      name: "Close onboarding",
    });
    const continueButton = dialogCanvas.getByRole("button", {
      name: "Continue",
    });
    const homeButton = dialogCanvas.getByRole("button", { name: "Home" });

    await waitFor(() => expect(heading).toHaveFocus());
    await expect(continueButton).toBeDisabled();
    await expect(
      dialogCanvas.getByText("Choose an interest to preview your feed."),
    ).toBeVisible();
    await expect(closeButton.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    await expect(closeButton.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(homeButton.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);

    await userEvent.click(homeButton);
    await expect(homeButton).toHaveAttribute("aria-pressed", "true");
    await expect(dialogCanvas.getByText("1 of 2 selected")).toBeVisible();
    await expect(continueButton).toBeEnabled();
    await expect(
      dialogCanvas.queryByText("Choose an interest to preview your feed."),
    ).not.toBeInTheDocument();

    const styleButton = dialogCanvas.getByRole("button", { name: "Style" });
    await userEvent.click(styleButton);
    await expect(dialogCanvas.getByText("2 of 2 selected")).toBeVisible();
    await expect(
      dialogCanvas.getByRole("button", { name: "Reviews" }),
    ).toBeDisabled();

    await userEvent.keyboard("{Escape}");
    const reopenButton = within(canvasElement).getByRole("button", {
      name: "Reopen onboarding",
    });
    await userEvent.click(reopenButton);
    const reopenedDialog = await page.findByRole("dialog", {
      name: "Pick what you want to see more often.",
    });
    await expect(
      within(reopenedDialog).getByText("0 of 2 selected"),
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(reopenButton).toHaveFocus());
    await userEvent.click(reopenButton);
    await expect(
      await page.findByRole("dialog", {
        name: "Pick what you want to see more often.",
      }),
    ).toBeVisible();
  },
};

export const TrustedBrands: Story = {
  name: "Brands: optional selection",
  render: () => <OnboardingExample />,
  play: async ({ canvasElement }) => {
    const dialog = await openBrandStep(canvasElement);
    const dialogCanvas = within(dialog);
    const brandRegion = dialogCanvas.getByRole("region", {
      name: `Choose from ${sourceNotes.length} Hearst brands`,
    });
    const useFeedButton = dialogCanvas.getByRole("button", {
      name: "Use this feed",
    });
    const firstAvailableBrand = within(brandRegion)
      .getAllByRole("button")
      .find((button) => !button.hasAttribute("disabled"));

    await expect(dialogCanvas.getByText(/Optional: choose the publications/)).toBeVisible();
    await expect(useFeedButton).toBeEnabled();
    await expect(firstAvailableBrand).toBeDefined();
    await expect(
      firstAvailableBrand!.getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
    await expect(firstAvailableBrand!.scrollWidth).toBeLessThanOrEqual(
      firstAvailableBrand!.clientWidth,
    );

    await userEvent.click(firstAvailableBrand!);
    await expect(firstAvailableBrand!).toHaveAttribute("aria-pressed", "true");
    await expect(dialogCanvas.getByText("1 selected")).toBeVisible();
  },
};

export const Completion: Story = {
  name: "Completion and account handoff",
  render: () => <OnboardingExample />,
  play: async ({ canvasElement }) => {
    const page = getPage(canvasElement);
    const brandDialog = await openBrandStep(canvasElement);
    await userEvent.click(
      within(brandDialog).getByRole("button", { name: "Use this feed" }),
    );
    const dialog = await page.findByRole("dialog", {
      name: "Your feed is ready.",
    });
    const dialogCanvas = within(dialog);
    const continueWithoutAccount = dialogCanvas.getByRole("button", {
      name: "Continue without an account",
    });
    const saveFeedButton = dialogCanvas.getByRole("button", {
      name: "Save my feed",
    });

    const eventStatus = canvasElement.querySelector(
      '[aria-label="Onboarding event"]',
    );
    await expect(eventStatus).toHaveTextContent("Preferences applied.");
    await expect(
      continueWithoutAccount.getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
    await expect(saveFeedButton.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.click(saveFeedButton);
    await expect(eventStatus).toHaveTextContent("Profile handoff requested.");
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
  render: () => <OnboardingExample />,
  play: async ({ canvasElement }) => {
    const page = getPage(canvasElement);
    const dialog = await page.findByRole("dialog", {
      name: "Pick what you want to see more often.",
    });
    const dialogCanvas = within(dialog);

    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(
      window.innerWidth,
    );
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      window.innerWidth,
    );
    await expect(
      dialogCanvas.getByRole("button", { name: "Close onboarding" })
        .getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
    await expect(
      dialogCanvas.getByRole("button", { name: "Home" })
        .getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
    await userEvent.click(
      dialogCanvas.getByRole("button", { name: "Home" }),
    );
    await expect(
      dialogCanvas.getByText("1 of 2 selected"),
    ).toBeVisible();
  },
};
