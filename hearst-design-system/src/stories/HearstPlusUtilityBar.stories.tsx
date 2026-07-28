import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { ReaderAccountStoryBoundary } from "./support/reader-account-story-boundary";

const onCreateAccount = fn();
const onOpenProfile = fn();

const meta = {
  title: "Hearst Plus/Components/Navigation/Utility Bar",
  component: UtilityBar,
  args: {
    selectedBrand: null,
    onCreateAccount,
    onOpenProfile,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production utility bar shared by the routed Hearst+ home experience and HOT ROD events. It owns destination routes, publication discovery, account entry, the scoped dark Videos treatment, and a 44px phone layout that keeps touch targets inside the bar.",
      },
    },
  },
  render: (args) => (
    <ReaderAccountStoryBoundary>
      <div className={args.darkMode ? "min-h-[360px] bg-black" : "min-h-[360px] bg-background"}>
        <UtilityBar {...args} />
        <main className={args.darkMode ? "p-6 text-white" : "p-6 text-foreground"}>
          <p className="text-sm">Representative production content begins below the utility bar.</p>
        </main>
      </div>
    </ReaderAccountStoryBoundary>
  ),
} satisfies Meta<typeof UtilityBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightGuest: Story = {
  name: "Guest: light destination",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const destinationNav = canvas.getByRole("navigation", {
      name: "Hearst destination sections",
    });
    const allLink = within(destinationNav).getByRole("link", { name: "All" });
    await expect(allLink).toHaveAttribute("aria-current", "page");

    const lifestyleLink = within(destinationNav).getByRole("link", {
      name: "Lifestyle",
    });
    lifestyleLink.focus();
    const menu = await canvas.findByRole("menu", { name: "Lifestyle brands" });
    await expect(menu).toBeVisible();
    await expect(within(menu).getByRole("menuitem", { name: /Country Living/ })).toHaveAttribute(
      "href",
      "/lifestyle/country-living/",
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(menu).not.toBeInTheDocument());
    await expect(lifestyleLink).toHaveFocus();

    await userEvent.click(
      canvas.getByRole("button", { name: "Sign in or sign up" }),
    );
    await expect(onCreateAccount).toHaveBeenCalled();
  },
};

export const SelectedPublication: Story = {
  name: "Selected publication menu",
  args: {
    selectedBrand: {
      name: "Country Living",
      slug: "country-living",
    },
  },
  globals: {
    brand: "country-living",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const destinationNav = canvas.getByRole("navigation", {
      name: "Hearst destination sections",
    });
    const lifestyleLink = within(destinationNav).getByRole("link", {
      name: "Lifestyle",
    });
    await expect(lifestyleLink).toHaveAttribute("aria-current", "page");
    lifestyleLink.focus();

    const menu = await canvas.findByRole("menu", { name: "Lifestyle brands" });
    const currentBrand = within(menu).getByRole("menuitem", {
      name: /Country Living Current/,
    });
    await expect(currentBrand).toHaveAttribute("aria-current", "page");
    await expect(
      currentBrand.querySelector("[data-brand-source-icon]"),
    ).toHaveAttribute("data-brand-slug", "country-living");
  },
};

export const DarkVideos: Story = {
  name: "Videos: dark destination",
  args: {
    darkMode: true,
    selectedBrand: {
      name: "Car and Driver",
      slug: "car-and-driver",
    },
  },
  globals: {
    brand: "car-and-driver",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const destinationNav = canvas.getByRole("navigation", {
      name: "Hearst destination sections",
    });
    const autosLink = within(destinationNav).getByRole("link", { name: "Autos" });
    await expect(autosLink).toHaveAttribute("aria-current", "page");
    autosLink.focus();
    await expect(
      await canvas.findByRole("menu", { name: "Autos brands" }),
    ).toBeVisible();
  },
};

export const MobileLayout: Story = {
  name: "Responsive: phone touch targets",
  globals: {
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const destinationNav = canvas.getByRole("navigation", {
      name: "Hearst destination sections",
    });
    const utilityBar = destinationNav.closest(".sticky");
    await expect(utilityBar).not.toBeNull();
    const utilityRect = utilityBar!.getBoundingClientRect();
    await expect(utilityRect.height).toBeGreaterThanOrEqual(44);
    await expect(utilityBar!.scrollHeight).toBeLessThanOrEqual(
      Math.ceil(utilityRect.height),
    );

    for (const control of [
      within(destinationNav).getByRole("link", { name: "All" }),
      canvas.getByRole("button", { name: "Sign in or sign up" }),
    ]) {
      const rect = control.getBoundingClientRect();
      await expect(rect.width).toBeGreaterThanOrEqual(44);
      await expect(rect.height).toBeGreaterThanOrEqual(44);
    }
  },
};
