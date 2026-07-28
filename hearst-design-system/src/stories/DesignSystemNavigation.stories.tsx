import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

import { DesignSystemNavBar } from "@/components/nav-bar";

const localStorybookHref =
  "http://localhost:6006/?path=/docs/hearst-plus-start-overview--docs";

const meta = {
  title: "Design System Tooling/Navigation",
  component: DesignSystemNavBar,
  args: {
    pathname: "/home",
    storybookHref: localStorybookHref,
  },
  globals: {
    brand: "cosmopolitan",
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production navigation shell used by the routed design-system documentation site. This is tooling UI, not Hearst+ reader navigation. NavBar supplies the live Next.js pathname and Storybook URL; these stories exercise the same renderer with deterministic inputs.",
      },
    },
  },
} satisfies Meta<typeof DesignSystemNavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DocumentationHome: Story = {
  name: "Documentation home",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banner = canvas.getByRole("banner");
    const bannerScope = within(banner);
    await expect(
      bannerScope.getByRole("link", {
        name: "Hearst Design System home, Cosmopolitan preview",
      })
    ).toBeVisible();
    await expect(bannerScope.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    const brandSelect = bannerScope.getByRole("combobox", { name: "Preview brand" });
    await expect(brandSelect).toHaveValue("cosmopolitan");
    await expect(
      bannerScope.getByRole("navigation", { name: "Design system navigation" })
    ).toBeVisible();
    await expect(bannerScope.getByRole("link", { name: "Home Page" }))
      .toHaveAttribute("aria-current", "page");
    await expect(bannerScope.getByRole("link", { name: "Storybook" }))
      .toHaveAttribute("target", "_blank");
    await userEvent.selectOptions(brandSelect, "elle");
    await expect(brandSelect).toHaveValue("elle");
    await expect(
      bannerScope.getByRole("link", {
        name: "Hearst Design System home, ELLE preview",
      })
    ).toBeVisible();
  },
};

export const ComponentDocumentation: Story = {
  name: "Component documentation",
  args: {
    pathname: "/components/card",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banner = canvas.getByRole("banner");
    const scope = within(banner);
    await expect(
      scope.getByRole("navigation", { name: "Component navigation" })
    ).toBeVisible();
    await expect(scope.getByRole("link", { name: "Components" }))
      .toHaveAttribute("aria-current", "location");
    await expect(scope.getByRole("link", { name: "Card" }))
      .toHaveAttribute("aria-current", "page");
  },
};

export const MobileDisclosure: Story = {
  name: "Mobile disclosure",
  args: {
    pathname: "/components/card",
  },
  globals: {
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Open navigation menu" });
    await expect(opener.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(opener.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);

    await userEvent.click(opener);
    await expect(opener).toHaveAttribute("aria-expanded", "true");
    const mobileNav = canvas.getByRole("navigation", {
      name: "Mobile design system navigation",
    });
    await expect(mobileNav).toBeVisible();
    await expect(
      within(mobileNav).getByRole("link", { name: "Style Guide" }).getBoundingClientRect().height
    ).toBeGreaterThanOrEqual(44);
  },
};

export const MobileKeyboardDismissal: Story = {
  name: "Mobile keyboard dismissal",
  args: {
    pathname: "/components/card",
  },
  globals: {
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Open navigation menu" });
    await userEvent.click(opener);
    await expect(
      canvas.getByRole("navigation", { name: "Mobile design system navigation" })
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
    await expect(
      canvas.queryByRole("navigation", { name: "Mobile design system navigation" })
    ).not.toBeInTheDocument();
  },
};
