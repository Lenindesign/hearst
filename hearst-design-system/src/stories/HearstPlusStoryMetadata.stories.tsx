import type { Meta, StoryObj } from "@storybook/react";
import {
  expect,
  fireEvent,
  waitFor,
  within,
} from "@storybook/test";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import {
  getLifestyleByline,
  LifestyleBrandSource,
  LifestyleRecommendationReason,
  LiveStoryBadge,
} from "@/components/hearst-plus/story-metadata";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { LiveArticleData } from "@/lib/live-feed-types";
import { getHearstAllBrands } from "@/lib/hearst-routes";
import { getComponentStoryForBrand } from "./hearst-plus-component-fixtures";

const countryLivingStory = getComponentStoryForBrand("country-living");

function StoryFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] p-4 text-[var(--hp-text-primary)] sm:p-6">
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </div>
  );
}

const meta = {
  title: "Hearst Plus/Components/Story Metadata",
  component: BrandSourceIcon,
  args: {
    brand: "Elle",
    brandSlug: "elle",
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Production source identity and supporting story metadata. Brand icons resolve from the same canonical logo registry used by the routed app, degrade to initials if an asset is missing, and remain decorative beside an accessible publication label. The companion metadata utilities specify publication links, live-feed status, recommendation reasons, and byline precedence.",
      },
    },
  },
} satisfies Meta<typeof BrandSourceIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicationIconInventory: Story = {
  name: "All 29 publication icons",
  render: () => (
    <StoryFrame>
      <h2 className="text-lg font-semibold">Production publication identity</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The canonical reader inventory; unavailable assets retain identifiable initials.
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {getHearstAllBrands().map(({ brand, brandSlug }) => (
          <div
            key={brandSlug}
            className="flex min-h-11 items-center gap-3 rounded-[6px] border border-border bg-[var(--hp-surface)] px-3 py-2"
          >
            <BrandSourceIcon
              brand={brand}
              brandSlug={brandSlug}
              className="h-6 w-6 rounded-[4px]"
            />
            <span className="min-w-0 truncate text-sm font-medium">{brand}</span>
          </div>
        ))}
      </div>
    </StoryFrame>
  ),
  play: async ({ canvasElement }) => {
    const icons = canvasElement.querySelectorAll("[data-brand-source-icon]");
    await expect(icons).toHaveLength(29);
    await expect(
      new Set(Array.from(icons, (icon) => icon.getAttribute("data-brand-slug"))).size
    ).toBe(29);
  },
};

export const FailedAssetFallback: Story = {
  name: "Fallback: unavailable icon asset",
  render: () => (
    <StoryFrame>
      <div className="flex min-h-11 items-center gap-3">
        <BrandSourceIcon
          brand="Elle Décor"
          brandSlug="elle-decor"
          className="h-8 w-8 text-xs"
        />
        <span className="text-sm font-medium">Elle Décor</span>
      </div>
    </StoryFrame>
  ),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector<HTMLElement>(
      '[data-brand-slug="elle-decor"]'
    );
    await expect(icon).not.toBeNull();
    const image = icon?.querySelector("img");
    await expect(image).not.toBeNull();
    fireEvent.error(image!);
    await waitFor(() => {
      expect(icon).toHaveAttribute("data-image-state", "fallback");
      expect(icon).toHaveTextContent("ED");
      expect(icon?.querySelector("img")).toBeNull();
    });
  },
};

export const PublicationSourceLink: Story = {
  name: "Publication link: mobile target",
  globals: {
    brand: "hearst-lifestyle",
    viewport: "mobile2",
  },
  parameters: {
    viewport: { defaultViewport: "mobile2" },
  },
  render: () => (
    <StoryFrame>
      <LifestyleBrandSource story={countryLivingStory} />
    </StoryFrame>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: `Open ${countryLivingStory.brand} brand page`,
    });
    await expect(link).toHaveAttribute(
      "href",
      `/lifestyle/${countryLivingStory.brandSlug}/`
    );
    const rect = link.getBoundingClientRect();
    await expect(rect.width).toBeGreaterThanOrEqual(44);
    await expect(rect.height).toBeGreaterThanOrEqual(44);
  },
};

export const LiveAndRecommendationStates: Story = {
  name: "Live, standard, and recommendation states",
  render: () => {
    const liveStory = {
      ...countryLivingStory,
      id: `live-${countryLivingStory.id}`,
    };
    return (
      <StoryFrame>
        <div className="grid gap-4 rounded-[6px] border border-border bg-[var(--hp-surface)] p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current feed item</span>
            <LiveStoryBadge story={liveStory} />
          </div>
          <div data-standard-story className="flex items-center gap-2">
            <span className="text-sm font-medium">Standard catalog item</span>
            <LiveStoryBadge story={countryLivingStory} />
          </div>
          <LifestyleRecommendationReason reason="Because you read Home stories" />
          <div data-empty-reason>
            <LifestyleRecommendationReason />
          </div>
        </div>
      </StoryFrame>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Current feed story")).toBeInTheDocument();
    await expect(
      canvas.getByText("Because you read Home stories")
    ).toBeInTheDocument();
    await expect(
      canvasElement.querySelector("[data-standard-story] [title]")
    ).toBeNull();
    await expect(
      canvasElement.querySelector("[data-empty-reason] p")
    ).toBeNull();
  },
};

export const BylinePrecedence: Story = {
  name: "Byline precedence",
  render: () => {
    const liveArticle = {
      byline: "Live API Author",
    } as LiveArticleData;
    const storyByline = {
      ...countryLivingStory,
      byline: "Checked-in Story Author",
    } as LifestyleRiverStory;
    const fallbackStory = {
      ...countryLivingStory,
      byline: undefined,
    } as LifestyleRiverStory;

    const rows = [
      ["Live article", getLifestyleByline(storyByline, liveArticle)],
      ["Story fixture", getLifestyleByline(storyByline)],
      ["Publication fallback", getLifestyleByline(fallbackStory)],
    ];

    return (
      <StoryFrame>
        <dl className="grid gap-4 rounded-[6px] border border-border bg-[var(--hp-surface)] p-4">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </StoryFrame>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Live API Author")).toBeInTheDocument();
    await expect(canvas.getByText("Checked-in Story Author")).toBeInTheDocument();
    await expect(
      canvas.getByText(`${countryLivingStory.brand} editors`)
    ).toBeInTheDocument();
  },
};
