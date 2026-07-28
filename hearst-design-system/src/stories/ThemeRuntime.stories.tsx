import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

import { ThemeProvider, useTheme } from "@/components/theme-provider";

function ThemeContractProbe() {
  const { brand, colorMode, setBrand, toggleColorMode } = useTheme();

  return (
    <main className="min-h-[22rem] bg-background p-6 text-foreground">
      <p className="text-sm text-muted-foreground">Production theme runtime</p>
      <h1 className="mt-2 text-3xl font-semibold">Theme contract</h1>
      <dl className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
        <div className="border border-border bg-card p-4">
          <dt className="text-sm text-muted-foreground">Brand</dt>
          <dd data-testid="brand-name" className="mt-1 font-semibold">{brand.name}</dd>
        </div>
        <div className="border border-border bg-card p-4">
          <dt className="text-sm text-muted-foreground">Color mode</dt>
          <dd data-testid="color-mode" className="mt-1 font-semibold">{colorMode}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="min-h-11 border border-border bg-primary px-4 text-primary-foreground"
          onClick={toggleColorMode}
        >
          Switch to {colorMode === "dark" ? "light" : "dark"} mode
        </button>
        <button
          type="button"
          className="min-h-11 border border-border bg-background px-4"
          onClick={() => setBrand("elle")}
        >
          Preview ELLE
        </button>
      </div>
    </main>
  );
}

function ThemeRuntime({
  defaultBrandSlug,
}: {
  defaultBrandSlug: string;
}) {
  return (
    <ThemeProvider defaultBrandSlug={defaultBrandSlug} persistColorMode={false}>
      <ThemeContractProbe />
    </ThemeProvider>
  );
}

const meta = {
  title: "Hearst Plus/Foundation/Theme Runtime",
  component: ThemeRuntime,
  args: {
    defaultBrandSlug: "cosmopolitan",
  },
  parameters: {
    layout: "fullscreen",
    themeRootSync: false,
    docs: {
      description: {
        component:
          "Direct specification of the exact production ThemeProvider. This infrastructure story verifies the runtime contract behind Storybook's brand previews; it is not a replacement product surface.",
      },
    },
  },
} satisfies Meta<typeof ThemeRuntime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicationTheme: Story = {
  name: "Publication theme",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("brand-name")).toHaveTextContent("Cosmopolitan");
    await expect(canvas.getByTestId("color-mode")).toHaveTextContent("light");
    const runtime = canvas.getByTestId("brand-name").closest("[data-brand]");
    await expect(runtime).toHaveAttribute("data-brand", "cosmopolitan");
    await expect(getComputedStyle(runtime as Element).getPropertyValue("--font-brand"))
      .toContain("Basis Grotesque Pro");
  },
};

export const RuntimeBrandSwitch: Story = {
  name: "Runtime brand switch",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Preview ELLE" }));
    await expect(canvas.getByTestId("brand-name")).toHaveTextContent("ELLE");
    const runtime = canvas.getByTestId("brand-name").closest("[data-brand]");
    await expect(runtime).toHaveAttribute("data-brand", "elle");
  },
};

export const FluxDarkDefault: Story = {
  name: "Hearst Flux dark default",
  args: {
    defaultBrandSlug: "hearst-flux",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("brand-name")).toHaveTextContent("Hearst Flux");
    await expect(canvas.getByTestId("color-mode")).toHaveTextContent("dark");
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    await expect(document.documentElement.style.colorScheme).toBe("dark");
  },
};

export const FluxModeToggle: Story = {
  name: "Hearst Flux mode toggle",
  args: {
    defaultBrandSlug: "hearst-flux",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("color-mode")).toHaveTextContent("dark");
    await userEvent.click(canvas.getByRole("button", { name: "Switch to light mode" }));
    await expect(canvas.getByTestId("color-mode")).toHaveTextContent("light");
    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
    await expect(document.documentElement.style.colorScheme).toBe("light");
  },
};
