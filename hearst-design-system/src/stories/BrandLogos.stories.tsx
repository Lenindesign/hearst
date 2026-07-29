import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, waitFor, within } from "@storybook/test";

import { BrandLogo } from "@/components/brand-logo";
import { brandLogoLabels, brandLogos } from "@/lib/logos";

const destinationSlugs = [
  "hearst-all",
  "hearst-lifestyle",
  "hearst-autos",
  "hearst-flux",
  "hearst-ew",
] as const;

const aliasSlugs = new Set([
  "hearst-plus",
  "hearst-flux-compact",
  "hearst-eandw",
  "pioneer-woman",
]);

const publicationSlugs = Object.keys(brandLogos).filter(
  (slug) => !destinationSlugs.includes(slug as (typeof destinationSlugs)[number])
    && !aliasSlugs.has(slug),
);

function LogoSpecimen({
  slug,
  treatment = "native",
}: {
  slug: string;
  treatment?: "native" | "light";
}) {
  const light = treatment === "light";

  return (
    <article
      className={`grid min-h-40 grid-rows-[1fr_auto] border border-border ${
        light ? "bg-foreground text-background" : "bg-card text-foreground"
      }`}
    >
      <div className="flex min-w-0 items-center justify-center p-6">
        <BrandLogo
          slug={slug}
          className="flex max-w-full items-center justify-center [&_svg]:h-16 [&_svg]:w-auto [&_svg]:max-w-full"
          color={light ? "currentColor" : undefined}
        />
      </div>
      <dl className="grid gap-1 border-t border-current/15 px-4 py-3 text-xs">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="font-semibold">Canonical name</dt>
          <dd className="text-right">{brandLogoLabels[slug]}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="font-semibold">Registry key</dt>
          <dd className="break-all font-mono">{slug}</dd>
        </div>
      </dl>
    </article>
  );
}

function SpecPage({
  eyebrow,
  title,
  guidance,
  children,
}: {
  eyebrow: string;
  title: string;
  guidance: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[1120px]">
        <header className="max-w-[72ch]">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">{guidance}</p>
        </header>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

const meta = {
  title: "Hearst Plus/Foundation/Brand Logos",
  component: BrandLogo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The exact production BrandLogo renderer and canonical local SVG registry. Wordmarks preserve their intrinsic proportions; consumers control visual cap height, while the component owns loading, sanitization, monochrome treatment, and the accessible brand name.",
      },
    },
  },
  args: {
    slug: "hearst-all",
  },
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DestinationMastheads: Story = {
  name: "Destination mastheads",
  render: () => (
    <SpecPage
      eyebrow="Production identity"
      title="Destination mastheads"
      guidance="Use these registered wordmarks for destination-level identity. Normalize by visual cap height and preserve each mark's intrinsic width; never stretch marks to a common box."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {destinationSlugs.map((slug) => <LogoSpecimen key={slug} slug={slug} />)}
      </div>
    </SpecPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getAllByRole("img")).toHaveLength(destinationSlugs.length),
    );
    for (const slug of destinationSlugs) {
      const logo = canvas.getByRole("img", { name: brandLogoLabels[slug] });
      await waitFor(() => expect(logo).toHaveAttribute("data-state", "ready"));
      const svg = logo.querySelector("svg");
      await expect(svg).toHaveAttribute("aria-hidden", "true");
      await expect(svg).toHaveAttribute("focusable", "false");
      await expect(svg?.querySelector("title, desc")).toBeNull();
    }
  },
};

export const PublicationWordmarks: Story = {
  name: "Publication wordmarks",
  render: () => (
    <SpecPage
      eyebrow="Production identity"
      title="Publication wordmarks"
      guidance="This is the complete local publication-wordmark registry used by production mastheads, reader context, editorial modules, and stakeholder specifications. Compact source icons are a separate component and are not interchangeable with these wordmarks."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {publicationSlugs.map((slug) => <LogoSpecimen key={slug} slug={slug} />)}
      </div>
    </SpecPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getAllByRole("img")).toHaveLength(publicationSlugs.length),
    );
    for (const slug of publicationSlugs) {
      await waitFor(() =>
        expect(canvas.getByRole("img", { name: brandLogoLabels[slug] }))
          .toHaveAttribute("data-state", "ready"),
      );
    }
  },
};

export const LightOnDark: Story = {
  name: "Light treatment on dark surfaces",
  render: () => (
    <SpecPage
      eyebrow="Documented treatment"
      title="Light wordmarks on dark surfaces"
      guidance="The color override converts a registered monochrome wordmark to the surrounding semantic text color. It does not recolor compact publication icons or replace multicolor identity artwork."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {["hearst-flux", "hearst-all", "esquire", "elle"].map((slug) => (
          <LogoSpecimen key={slug} slug={slug} treatment="light" />
        ))}
      </div>
    </SpecPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const slug of ["hearst-flux", "hearst-all", "esquire", "elle"]) {
      const logo = canvas.getByRole("img", { name: brandLogoLabels[slug] });
      await waitFor(() => expect(logo).toHaveAttribute("data-state", "ready"));
      await expect(logo.querySelector("svg")).toHaveAttribute("color", "currentColor");
    }
  },
};

export const AccessibilityContract: Story = {
  name: "Accessible and decorative usage",
  render: () => (
    <SpecPage
      eyebrow="Implementation contract"
      title="Accessible and decorative usage"
      guidance="A standalone wordmark exposes its canonical name. When adjacent visible text already names the brand, mark the logo decorative to avoid repetitive screen-reader output. Unknown registry keys intentionally render nothing instead of approximating a brand."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <section className="border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Standalone identity
          </p>
          <BrandLogo
            slug="elle"
            className="mt-5 flex min-h-16 items-center [&_svg]:h-14 [&_svg]:w-auto [&_svg]:max-w-full"
          />
        </section>
        <section className="border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Visible name with decorative mark
          </p>
          <div className="mt-5 flex min-h-16 items-center gap-4">
            <BrandLogo
              slug="road-and-track"
              decorative
              className="[&_svg]:h-10 [&_svg]:w-auto [&_svg]:max-w-40"
            />
            <p className="font-semibold">Road &amp; Track</p>
          </div>
        </section>
      </div>
      <BrandLogo slug="unregistered-publication" />
    </SpecPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const elle = canvas.getByRole("img", { name: "ELLE" });

    await waitFor(() => expect(elle).toHaveAttribute("data-state", "ready"));
    await expect(canvas.getAllByRole("img")).toHaveLength(1);
    await expect(
      canvasElement.querySelector('[data-brand-logo="road-and-track"]'),
    ).toHaveAttribute("aria-hidden", "true");
    await expect(
      canvasElement.querySelector('[data-brand-logo="unregistered-publication"]'),
    ).toBeNull();
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
  render: () => (
    <SpecPage
      eyebrow="Responsive identity"
      title="Mobile masthead fit"
      guidance="The consumer sets cap height and available width. The logo keeps its intrinsic aspect ratio and must not create document-level horizontal overflow."
    >
      <div className="flex min-h-24 items-center justify-center border border-border bg-card p-4">
        <BrandLogo
          slug="hearst-lifestyle"
          className="flex max-w-full items-center justify-center [&_svg]:h-7 [&_svg]:w-auto [&_svg]:max-w-full"
        />
      </div>
    </SpecPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const logo = canvas.getByRole("img", { name: "Hearst Lifestyle" });

    await waitFor(() => expect(logo).toHaveAttribute("data-state", "ready"));
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    const svg = logo.querySelector("svg");
    await expect(svg?.getBoundingClientRect().width).toBeLessThanOrEqual(
      logo.parentElement?.getBoundingClientRect().width ?? window.innerWidth,
    );
  },
};
