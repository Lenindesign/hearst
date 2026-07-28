import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronRight, Trash2 } from "@/components/ui/icons";
import { brands } from "@/lib/brands";
import { brandToCssVars } from "@/lib/theme-css-vars";

const meta: Meta<typeof Button> = {
  title: "Hearst Plus/HDS Primitives/Button",
  component: Button,
  args: {
    children: "Save story",
    loading: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
      description: "Visual style variant. Use `default` for primary actions, `outline` for secondary, `destructive` for dangerous operations.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "touch",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
        "icon-touch",
      ],
      description:
        "Dense layout sizes and explicit 44px `touch` / `icon-touch` sizes. Icon-only buttons require an accessible name.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the button and applies muted styling.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    children: {
      control: "text",
      description: "Button label text or child elements.",
      table: { category: "Content" },
    },
    loading: {
      control: "boolean",
      description:
        "Shows the Phosphor loading indicator, exposes `aria-busy`, and disables activation.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    loadingText: {
      control: "text",
      description: "Optional visible and announced label while loading.",
      table: { category: "Content" },
    },
    onClick: {
      action: "click",
      description: "Fires when the button is clicked.",
      table: { category: "Events" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Production action control built on Base UI. The default, secondary, outline, and ghost variants consume each publication's registered component/button default, hover, active, border, content, and radius tokens. Dense sizes support compact tooling; touch and icon-touch provide the 44px production target used on phones. Navigation remains the Link component's responsibility.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button", variant: "default", size: "default" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Button" }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Destructive: Story = {
  args: { children: "Destructive", variant: "destructive" },
};

export const Link: Story = {
  args: { children: "Link Button", variant: "link" },
};

export const Small: Story = {
  args: { children: "Small", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg" },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex max-w-[760px] flex-wrap items-center gap-3">
      {(["default", "outline", "secondary", "ghost", "destructive", "link"] as const).map((v) => (
        <Button key={v} {...args} variant={v}>
          {v === "default" ? "Primary" : v === "link" ? "Link action" : v.charAt(0).toUpperCase() + v.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "default", "lg", "touch"] as const).map((s) => (
        <Button key={s} {...args} size={s}>
          {s === "default" ? "Default" : s === "touch" ? "Touch-safe" : s.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expectations = [
      ["XS", 24],
      ["SM", 28],
      ["Default", 32],
      ["LG", 36],
      ["Touch-safe", 44],
    ] as const;

    for (const [name, height] of expectations) {
      await expect(
        Math.round(canvas.getByRole("button", { name }).getBoundingClientRect().height),
      ).toBe(height);
    }
  },
};

export const InteractionStates: Story = {
  name: "States: Loading, disabled, invalid, expanded",
  render: (args) => (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Loading
        </p>
        <Button {...args} loading loadingText="Saving story">
          Save story
        </Button>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Disabled
        </p>
        <Button {...args} variant="outline" disabled>
          Not available
        </Button>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Invalid
        </p>
        <Button {...args} variant="outline" aria-invalid>
          Review errors
        </Button>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Expanded
        </p>
        <Button {...args} variant="secondary" aria-expanded>
          Filters open
        </Button>
      </div>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const loading = canvas.getByRole("button", { name: "Saving story" });
    const disabled = canvas.getByRole("button", { name: "Not available" });

    await expect(loading).toHaveAttribute("aria-busy", "true");
    await expect(loading).toBeDisabled();
    await expect(disabled).toBeDisabled();
    await expect(getComputedStyle(loading).pointerEvents).toBe("none");
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const IconButtons: Story = {
  name: "Icon buttons: Dense and touch-safe",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
        <Button
          key={size}
          {...args}
          size={size}
          variant="outline"
          aria-label={`Save story, ${size} dense example`}
        >
          <Bookmark aria-hidden />
        </Button>
      ))}
      <Button {...args} size="icon-touch" aria-label="Save story">
        <Bookmark aria-hidden />
      </Button>
      <Button {...args} size="icon-touch" variant="destructive" aria-label="Delete story">
        <Trash2 aria-hidden />
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: "Save story" });
    const remove = canvas.getByRole("button", { name: "Delete story" });

    await expect(save.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    await expect(save.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(remove.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    await expect(canvas.getAllByRole("button")).toHaveLength(6);
  },
};

export const KeyboardAndTouch: Story = {
  name: "Keyboard focus and touch target",
  globals: {
    viewport: "mobile1",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: (args) => (
    <div className="flex max-w-full flex-wrap gap-3 p-4">
      <Button {...args} size="touch">
        Continue
        <ChevronRight data-icon="inline-end" aria-hidden />
      </Button>
      <Button {...args} size="icon-touch" variant="outline" aria-label="Save story">
        <Bookmark aria-hidden />
      </Button>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const continueButton = canvas.getByRole("button", { name: "Continue" });
    const saveButton = canvas.getByRole("button", { name: "Save story" });

    await expect(continueButton).toHaveAttribute("type", "button");
    await expect(continueButton.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(saveButton.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await userEvent.tab();
    await expect(continueButton).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalled();
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

const representativeBrandSlugs = [
  "cosmopolitan",
  "elle",
  "runners-world",
  "good-housekeeping",
] as const;

export const RepresentativeBrandTokens: Story = {
  name: "Brand tokens: Representative themes",
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-[960px]">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Production token evidence
        </p>
        <h1 className="mt-2 text-3xl font-bold">Representative brand button states</h1>
        <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
          Each scope uses the same Button component with the registered publication
          background, border, content, state, and radius variables.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {representativeBrandSlugs.map((slug) => {
            const brand = brands.find((candidate) => candidate.slug === slug);
            if (!brand) return null;
            const styles = brandToCssVars(brand) as CSSProperties;

            return (
              <article
                key={slug}
                data-brand-button-scope={slug}
                style={styles}
                className="border border-border bg-background p-5 text-foreground"
              >
                <h2 className="font-semibold">{brand.name}</h2>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {String(brand.componentTokens["component-button-background-primary-solid-default"])}
                  {" → "}
                  {String(brand.componentTokens["component-button-background-primary-solid-hover"])}
                  {" → "}
                  {String(brand.componentTokens["component-button-background-primary-solid-active"])}
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Default
                    </p>
                    <Button {...args}>Primary default</Button>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Hover
                    </p>
                    <Button {...args} data-preview-state="hover">Primary hover</Button>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Active
                    </p>
                    <Button {...args} data-preview-state="active">Primary active</Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button {...args} variant="secondary">Secondary</Button>
                  <Button {...args} variant="outline">Outline</Button>
                  <Button {...args} variant="ghost">Ghost</Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const slug of representativeBrandSlugs) {
      const scope = canvasElement.querySelector<HTMLElement>(`[data-brand-button-scope="${slug}"]`);
      if (!scope) throw new Error(`Missing brand scope: ${slug}`);
      const scopedCanvas = within(scope);
      const primary = scopedCanvas.getByRole("button", { name: "Primary default" });
      const hover = scopedCanvas.getByRole("button", { name: "Primary hover" });
      const active = scopedCanvas.getByRole("button", { name: "Primary active" });
      const defaultBackground = getComputedStyle(primary).backgroundColor;
      const hoverBackground = getComputedStyle(hover).backgroundColor;
      const activeBackground = getComputedStyle(active).backgroundColor;

      await expect(primary).toHaveAttribute("data-variant", "default");
      await expect(hover).toHaveAttribute("data-preview-state", "hover");
      await expect(active).toHaveAttribute("data-preview-state", "active");
      await expect(hoverBackground).not.toBe(defaultBackground);
      await expect(activeBackground).not.toBe(defaultBackground);
      await expect(activeBackground).not.toBe(hoverBackground);
    }
  },
};
