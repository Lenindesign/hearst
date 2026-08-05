import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  BrandPortfolioGrid,
  ProductFooter,
  ProductHeader,
} from "@/components/product-story-shell";
import type { BrandTheme } from "@/lib/brands";
import { themeOptions } from "@/lib/theme-options";

export const metadata: Metadata = {
  title: "HDS Brand Framework | One System, 29 Brands",
  description:
    "A leadership proposal for how the Hearst Design System can support 29 distinct editorial brands through one shared component and token contract.",
};

const contents = [
  ["The decision", "decision"],
  ["System model", "model"],
  ["Ownership", "ownership"],
  ["Brand samples", "samples"],
  ["Portfolio", "portfolio"],
  ["Governance", "governance"],
  ["Agentic layer", "agentic"],
  ["Pilot plan", "pilot"],
] as const;

const sharedLayers = [
  {
    name: "Foundation",
    owner: "HDS",
    detail: "Accessible color roles, type scales, spacing, grids, borders, elevation, motion, and breakpoints.",
  },
  {
    name: "Meaning",
    owner: "HDS",
    detail: "Semantic roles such as text, surface, border, action, emphasis, success, warning, and focus.",
  },
  {
    name: "Components",
    owner: "HDS",
    detail: "Anatomy, behavior, states, accessibility, responsive rules, and supported variants.",
  },
  {
    name: "Brand theme",
    owner: "Brand and HDS",
    detail: "Logos, typefaces, colors, editorial treatments, and approved differences expressed as tokens.",
  },
  {
    name: "Product",
    owner: "Product teams",
    detail: "Content, journeys, ranking, commerce, subscriptions, and product-specific composition.",
  },
];

const ownershipRows = [
  ["Accessibility", "Defines the minimum standard and tests it", "Cannot override the standard", "Applies it to every journey"],
  ["Component anatomy", "Owns structure, states, and supported variants", "Requests a variant when identity requires it", "Chooses a supported variant"],
  ["Color and type", "Defines semantic roles and safe ranges", "Supplies approved values and fonts", "Consumes the active theme"],
  ["Editorial identity", "Provides slots and composition rules", "Owns logo, voice, imagery, and art direction", "Preserves source attribution"],
  ["Product behavior", "Provides accessible primitives", "Advises when identity is affected", "Owns journeys, data, and business rules"],
  ["Exceptions", "Documents, tests, and sets an expiry date", "Explains the brand need", "Avoids local forks"],
];

const sampleConfigs = [
  {
    slug: "cosmopolitan",
    collection: lifestyleRiverStories,
    destination: "Lifestyle",
  },
  {
    slug: "car-and-driver",
    collection: autosRiverStories,
    destination: "Autos",
  },
  {
    slug: "elle",
    collection: fluxRiverStories,
    destination: "Fashion & Luxury",
  },
  {
    slug: "womens-health",
    collection: ewRiverStories,
    destination: "Enthusiast & Wellness",
  },
] as const;

const governanceSteps = [
  {
    title: "Request",
    detail: "A brand team states the reader or editorial need, affected component, and why existing tokens or variants are insufficient.",
    owner: "Brand design",
  },
  {
    title: "Decide",
    detail: "HDS determines whether the need belongs in the shared core, a reusable variant, a brand token, or a time-limited exception.",
    owner: "HDS design and engineering",
  },
  {
    title: "Prove",
    detail: "The change is reviewed in Figma and Storybook across representative brands, breakpoints, states, and accessibility conditions.",
    owner: "Design, engineering, accessibility",
  },
  {
    title: "Release",
    detail: "Versioned tokens and components ship together with migration notes, ownership, and a clear deprecation path when needed.",
    owner: "HDS release owner",
  },
];

const agentRoles = [
  ["Token Architect", "Changes source tokens and rebuilds generated outputs", "Token checks and a scoped source diff", "Generated files by hand"],
  ["Publication Stylist", "Translates brand direction into supported system choices", "Cross-brand visual comparison", "Shared component forks"],
  ["Component Builder", "Builds shared behavior, variants, and metadata", "Stories, states, and responsive coverage", "Hardcoded brand logic"],
  ["Storybook Documenter", "Makes the production contract visible and reviewable", "Production-backed examples", "Storybook-only implementations"],
  ["QA Reviewer", "Checks accessibility, visual parity, and unaffected brands", "A reviewable evidence report", "Approval without visible output"],
  ["Release Agent", "Packages approved changes and verifies delivery", "Exact revision and production checks", "Deployment without authorization"],
] as const;

const agenticWorkflow = [
  ["Route", "Identify the AutoWeek brand token and select the Token Architect workflow."],
  ["Change", "Edit the smallest source value, rebuild generated outputs, and leave unrelated brands untouched."],
  ["Prove", "Render AutoWeek, Car and Driver, and Cosmopolitan; check contrast, focus, and responsive behavior."],
  ["Approve", "Present the proposal and evidence to a designer. Release only after explicit human approval."],
] as const;

const agenticArtifacts = [
  ["DESIGN.md", "Routes intent to the correct source of truth"],
  ["AGENTS.md and runbooks", "Define permissions, required checks, and forbidden actions"],
  ["Tokens and publication manifest", "Give agents structured brand data"],
  ["Component metadata", "Explains purpose, variants, dependencies, and accessibility"],
  ["Storybook and reports", "Provide visible evidence for review"],
] as const;

function getTheme(slug: string) {
  return themeOptions.find((theme) => theme.slug === slug);
}

function getStory(stories: readonly LifestyleRiverStory[], slug: string) {
  return stories.find((story) => story.brandSlug === slug && Boolean(story.image))
    ?? stories.find((story) => Boolean(story.image))
    ?? stories[0];
}

function value(theme: BrandTheme | undefined, key: string, fallback: string) {
  const semanticValue = theme?.semanticColors[key];
  return semanticValue || fallback;
}

function relativeLuminance(color: string) {
  const aliases: Record<string, string> = { white: "#ffffff", black: "#000000" };
  const normalized = aliases[color.toLowerCase()] || color;
  if (!/^#[0-9a-f]{6}$/i.test(normalized)) return null;
  const channels = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(normalized.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function readableColor(candidate: string, background: string, fallback: string) {
  const foregroundLuminance = relativeLuminance(candidate);
  const backgroundLuminance = relativeLuminance(background);
  if (foregroundLuminance === null || backgroundLuminance === null) return fallback;
  const contrast = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
  return contrast >= 4.5 ? candidate : fallback;
}

function SectionHeading({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header id={id} className="scroll-mt-8 border-t-2 border-[#102A43] pt-5">
      <h2 className="max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] text-[#102A43] md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-[72ch] text-pretty text-lg leading-8 text-slate-600">
        {children}
      </p>
    </header>
  );
}

function BrandStorySample({
  theme,
  story,
  destination,
}: {
  theme: BrandTheme;
  story: LifestyleRiverStory;
  destination: string;
}) {
  const primary = value(theme, "palette-content-brand", theme.colors["1"] || "#102A43");
  const page = value(theme, "palette-background-page", "#ffffff");
  const surface = String(
    theme.componentTokens["component-card-collection-4-story-background-default"]
      || theme.componentTokens["component-card-background-default"]
      || "#ffffff",
  );
  const ink = value(theme, "palette-content-default", "#121212");
  const subtle = readableColor(
    value(theme, "palette-content-subtle", "#5F6B7A"),
    surface,
    ink,
  );
  const border = String(theme.componentTokens["component-card-border-default"] || "#d6d6d6");
  const button = String(theme.componentTokens["component-button-background-primary-solid-default"] || primary);
  const buttonText = String(theme.componentTokens["component-button-content-primary-solid-default"] || "#ffffff");
  const sampleStyle = {
    backgroundColor: page,
    color: ink,
    "--sample-primary": primary,
    "--sample-surface": surface,
    "--sample-muted": subtle,
    "--sample-border": border,
    "--sample-button": button,
    "--sample-button-text": buttonText,
    "--sample-headline": `"${theme.fontHeadline}", Georgia, serif`,
    "--sample-body": `"${theme.fontDefault}", Arial, sans-serif`,
  } as CSSProperties;

  return (
    <article className="overflow-hidden border border-[var(--sample-border)]" style={sampleStyle}>
      <div className="flex min-h-16 items-center justify-between gap-4 bg-[var(--sample-surface)] px-5 py-4">
        <BrandLogo slug={theme.slug} className="block h-7 max-w-36 [&_svg]:h-full [&_svg]:w-auto" color={ink} />
        <span className="text-xs font-semibold text-[var(--sample-muted)]" style={{ fontFamily: "var(--sample-body)" }}>
          {destination}
        </span>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
        {story.image ? (
          <Image src={story.image} alt="" fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover" />
        ) : null}
      </div>
      <div className="bg-[var(--sample-surface)] p-5" style={{ fontFamily: "var(--sample-body)" }}>
        <p className="text-xs font-bold text-[var(--sample-primary)]">{story.topic} · {story.readTime}</p>
        <h3
          className="mt-3 text-balance text-3xl leading-[1.02] tracking-[-0.02em]"
          style={{ fontFamily: "var(--sample-headline)", fontWeight: theme.fontHeadlineWeight }}
        >
          {story.title}
        </h3>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--sample-muted)]">{story.summary}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sample-border)] pt-4">
          <span className="inline-flex min-h-11 items-center bg-[var(--sample-button)] px-4 py-2 text-sm font-bold text-[var(--sample-button-text)]">
            Read story
          </span>
          <span className="inline-flex min-h-11 items-center px-3 py-2 text-sm font-semibold text-[var(--sample-primary)]">Save</span>
        </div>
      </div>
    </article>
  );
}

export default function HdsBrandFrameworkPage() {
  const samples = sampleConfigs.flatMap((config) => {
    const theme = getTheme(config.slug);
    const story = getStory(config.collection, config.slug);
    return theme && story ? [{ ...config, theme, story }] : [];
  });

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8FAFC] font-sans text-[#102A43]">
      <ProductHeader current="hds" />
      <main>
        <section className="border-b border-slate-200 bg-[#102A43] text-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <p className="text-sm font-bold text-sky-300">HDS leadership proposal</p>
                <h1 className="mt-5 max-w-4xl text-balance text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                  One system. 29 distinct editorial brands.
                </h1>
                <p className="mt-7 max-w-[68ch] text-pretty text-lg leading-8 text-slate-300">
                  HDS should provide the shared design contract. Each publication should express its identity through governed themes and approved variants, without copying components or creating a separate system.
                </p>
              </div>
              <div className="border-t border-white/25 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="text-sm font-bold text-white">The decision for leadership</p>
                <p className="mt-3 text-pretty text-2xl leading-9 text-slate-200">
                  Build one shared grammar that lets every Hearst brand keep its own voice.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
                  <span className="border border-white/25 px-3 py-2">Shared quality</span>
                  <span className="border border-white/25 px-3 py-2">Brand control</span>
                  <span className="border border-white/25 px-3 py-2">Governed exceptions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1360px] gap-px bg-slate-200 md:grid-cols-4">
            {[
              ["3 min", "Agree on the decision"],
              ["8 min", "Review the system model"],
              ["12 min", "Discuss brand samples"],
              ["7 min", "Choose the pilot and owners"],
            ].map(([time, task]) => (
              <div key={time} className="bg-white px-5 py-6 md:px-7">
                <strong className="text-2xl text-[#2D75B9]">{time}</strong>
                <p className="mt-2 text-sm font-semibold text-slate-600">{task}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-16 md:px-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-24">
          <aside className="self-start lg:sticky lg:top-6">
            <p className="mb-4 text-sm font-bold text-[#2D75B9]">In this proposal</p>
            <nav aria-label="HDS framework sections">
              {contents.map(([label, id]) => (
                <a key={id} href={`#${id}`} className="block border-t border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:text-[#2D75B9]">
                  {label}
                </a>
              ))}
            </nav>
            <Link href="/hearst-plus/" className="mt-7 inline-flex min-h-11 items-center text-sm font-bold text-[#2D75B9]">
              Open Hearst+
            </Link>
          </aside>

          <div className="min-w-0 space-y-24">
            <section>
              <SectionHeading id="decision" title="The scalable choice is a themed component system.">
                HDS owns the shared foundation, behavior, and quality bar. Brand teams own editorial identity. Product teams compose those parts into reader experiences. This gives publications meaningful control without making every website responsible for maintaining its own version of the same component.
              </SectionHeading>
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-3">
                {[
                  ["For readers", "Familiar controls, accessible behavior, faster improvements, and a clear publication identity."],
                  ["For brands", "More room for recognizable typography, color, imagery, and editorial voice without losing platform support."],
                  ["For Hearst", "One place to improve quality, ship standards, and learn across the portfolio while reducing duplicated work."],
                ].map(([title, copy]) => (
                  <article key={title} className="bg-white p-6">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                  </article>
                ))}
              </div>
              <blockquote className="mt-8 border-y border-[#102A43] py-8 text-balance text-3xl font-bold leading-tight text-[#102A43] md:text-4xl">
                “One grammar, 29 voices.”
              </blockquote>
            </section>

            <section>
              <SectionHeading id="model" title="Five layers separate shared quality from brand expression.">
                Each layer has a clear owner. A brand can change how a component feels without rewriting how it works. A product can compose a journey without inventing another design system.
              </SectionHeading>
              <ol className="mt-10 border-t-2 border-[#2D75B9]">
                {sharedLayers.map((layer, index) => (
                  <li key={layer.name} className="grid gap-3 border-b border-slate-200 py-6 md:grid-cols-[3rem_0.7fr_0.7fr_1.6fr] md:items-start">
                    <span className="font-mono text-sm font-bold text-[#2D75B9]">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-lg font-bold">{layer.name}</h3>
                    <p className="text-sm font-semibold text-slate-500">{layer.owner}</p>
                    <p className="text-sm leading-6 text-slate-600">{layer.detail}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 grid gap-4 bg-[#E9F2FA] p-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
                <div>
                  <strong>Shared contract</strong>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Tokens, components, accessibility, responsive behavior</p>
                </div>
                <span aria-hidden="true" className="hidden text-2xl text-[#2D75B9] md:block">→</span>
                <div>
                  <strong>Brand theme</strong>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Logo, type, color, editorial treatments</p>
                </div>
                <span aria-hidden="true" className="hidden text-2xl text-[#2D75B9] md:block">→</span>
                <div>
                  <strong>Reader experience</strong>
                  <p className="mt-2 text-sm leading-6 text-slate-600">A distinct publication built from supported parts</p>
                </div>
              </div>
            </section>

            <section>
              <SectionHeading id="ownership" title="Freedom works when the boundaries are explicit.">
                The framework should make everyday decisions easy. HDS protects usability and maintainability. Brands shape identity. Products own what the experience does.
              </SectionHeading>
              <div
                aria-label="HDS ownership comparison"
                className="mt-10 overflow-x-auto border-y border-slate-300 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D75B9]"
                role="region"
                tabIndex={0}
              >
                <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="p-4 text-[#2D75B9]">Decision</th>
                      <th className="p-4 text-[#2D75B9]">HDS</th>
                      <th className="p-4 text-[#2D75B9]">Brand teams</th>
                      <th className="p-4 text-[#2D75B9]">Product teams</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ownershipRows.map((row) => (
                      <tr key={row[0]} className="border-b border-slate-200 last:border-b-0">
                        {row.map((cell, index) => (
                          <td key={cell} className={`p-4 align-top leading-6 ${index === 0 ? "font-bold text-[#102A43]" : "text-slate-600"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 bg-[#102A43] p-6 text-white md:p-8">
                <h3 className="text-2xl font-bold">The rule for brand requests</h3>
                <p className="mt-3 max-w-[70ch] text-base leading-7 text-slate-300">
                  If a difference changes identity, express it as a theme or supported variant. If it changes usability, accessibility, or behavior, solve it in the shared component. If it serves one product journey, keep it in that product.
                </p>
              </div>
            </section>

            <section>
              <SectionHeading id="samples" title="The component stays familiar. The publication stays recognizable.">
                These examples use one story-card anatomy and the current token themes. Structure, states, and accessibility remain shared while logo, type, color, content, and imagery change by publication.
              </SectionHeading>
              <div className="mt-10 grid gap-6 xl:grid-cols-2">
                {samples.map(({ theme, story, destination }) => (
                  <BrandStorySample key={theme.slug} theme={theme} story={story} destination={destination} />
                ))}
              </div>
              <dl className="mt-8 grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Shared", "Semantic HTML, image ratio, hierarchy, actions, focus, responsive behavior"],
                  ["Themed", "Logo, headline font, body font, primary action, link, border, page surface"],
                  ["Editorial", "Story, image, topic, summary, byline, publication voice"],
                  ["Measured", "Accessibility, visual regression, adoption, exceptions, release health"],
                ].map(([term, detail]) => (
                  <div key={term} className="bg-white p-5">
                    <dt className="font-bold text-[#2D75B9]">{term}</dt>
                    <dd className="mt-2 text-sm leading-6 text-slate-600">{detail}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <SectionHeading id="portfolio" title="The model must work across the full portfolio.">
                Hearst+ currently represents 29 publication brands across four editorial destinations. This is useful proof that one component system can preserve publication identity inside a shared experience, but HDS must remain independent from Hearst+ product logic.
              </SectionHeading>
              <div className="mt-10">
                <BrandPortfolioGrid compact />
              </div>
            </section>

            <section>
              <SectionHeading id="governance" title="Governance should make good decisions faster.">
                A lightweight path gives brand teams a clear way to ask for what they need while protecting the shared system from undocumented forks.
              </SectionHeading>
              <ol className="mt-10 grid gap-px bg-slate-200 md:grid-cols-2">
                {governanceSteps.map((step, index) => (
                  <li key={step.title} className="bg-white p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <span className="font-mono text-sm font-bold text-[#2D75B9]">{index + 1}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{step.detail}</p>
                    <p className="mt-5 border-t border-slate-200 pt-4 text-xs font-bold text-slate-500">Owner: {step.owner}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 grid gap-6 border-y border-slate-300 py-8 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-bold">DESIGN.md is the front door</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    It should explain the principles, ownership, customization model, accessibility rules, and contribution path. It should link to the actual token, component, and Storybook sources.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Code is the enforceable contract</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Tokens carry values, components carry behavior, Storybook demonstrates coverage, and automated checks prevent drift. The document explains the system but does not duplicate generated values.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <SectionHeading id="agentic" title="Agents make the system easier to operate. People keep authority.">
                The agentic layer turns an approved design request into a narrow workflow. It reads the system contract, chooses the correct specialist, changes only the owned source, produces evidence, and pauses for human approval before release.
              </SectionHeading>

              <div className="mt-10 overflow-hidden bg-[#102A43] text-white">
                <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
                  <div className="border-b border-white/20 p-6 md:p-8 lg:border-b-0 lg:border-r">
                    <p className="text-sm font-bold text-sky-300">Example design request</p>
                    <blockquote className="mt-5 text-balance text-3xl font-bold leading-tight md:text-4xl">
                      “Make the AutoWeek primary action easier to read without changing its yellow brand identity.”
                    </blockquote>
                    <p className="mt-6 max-w-[56ch] text-sm leading-6 text-slate-300">
                      The request describes the desired outcome. The agent must discover the correct token and workflow instead of inventing a local fix.
                    </p>
                  </div>
                  <ol>
                    {agenticWorkflow.map(([title, detail], index) => (
                      <li key={title} className="grid gap-3 border-b border-white/15 p-6 last:border-b-0 sm:grid-cols-[2rem_7rem_1fr] sm:items-start md:px-8">
                        <span className="font-mono text-sm font-bold text-sky-300">{index + 1}</span>
                        <h3 className="font-bold text-white">{title}</h3>
                        <p className="text-sm leading-6 text-slate-300">{detail}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold">Specialists work inside narrow boundaries.</h3>
                <p className="mt-3 max-w-[70ch] text-sm leading-6 text-slate-600">
                  No single agent owns the whole system. Each role has a defined responsibility, required evidence, and a clear prohibition.
                </p>
                <div
                  aria-label="Agent roles and responsibilities"
                  className="mt-6 overflow-x-auto border-y border-slate-300 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D75B9]"
                  role="region"
                  tabIndex={0}
                >
                  <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-300">
                        <th className="p-4 text-[#2D75B9]">Agent</th>
                        <th className="p-4 text-[#2D75B9]">Responsibility</th>
                        <th className="p-4 text-[#2D75B9]">Required evidence</th>
                        <th className="p-4 text-[#2D75B9]">Never does</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentRoles.map((row) => (
                        <tr key={row[0]} className="border-b border-slate-200 last:border-b-0">
                          {row.map((cell, index) => (
                            <td key={cell} className={`p-4 align-top leading-6 ${index === 0 ? "font-bold text-[#102A43]" : "text-slate-600"}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-2">
                <div className="bg-white p-6 md:p-8">
                  <h3 className="text-2xl font-bold">People decide</h3>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                    <li>Brand direction and editorial taste</li>
                    <li>Whether a proposal represents the publication</li>
                    <li>Whether a new shared pattern is worth supporting</li>
                    <li>Approval, prioritization, and release authority</li>
                  </ul>
                </div>
                <div className="bg-[#E9F2FA] p-6 md:p-8">
                  <h3 className="text-2xl font-bold">Agents execute</h3>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                    <li>System discovery and workflow selection</li>
                    <li>Scoped token, component, or documentation changes</li>
                    <li>Builds, cross-brand previews, and accessibility checks</li>
                    <li>Review evidence and release verification</li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 border-y border-slate-300 py-8">
                <h3 className="text-2xl font-bold">The system must be readable by people and machines.</h3>
                <dl className="mt-6 divide-y divide-slate-200">
                  {agenticArtifacts.map(([artifact, purpose]) => (
                    <div key={artifact} className="grid gap-2 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                      <dt className="font-mono text-sm font-bold text-[#2D75B9]">{artifact}</dt>
                      <dd className="text-sm leading-6 text-slate-600">{purpose}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold">Leadership measures whether the layer is helping.</h3>
                <p className="mt-3 max-w-[72ch] text-sm leading-6 text-slate-600">
                  Track time to an approved change, shared-component reuse, publication forks, defects caught before release, drift between Git and design tools, and the percentage of agent proposals accepted by human reviewers.
                </p>
              </div>
            </section>

            <section>
              <SectionHeading id="pilot" title="Prove the model with three deliberately different brands.">
                Start with a lifestyle publication, an automotive publication, and a fashion or entertainment publication. Use the same governed agent workflow for each. If the components preserve all three identities without forks, the architecture and operating model are ready to expand.
              </SectionHeading>
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-3">
                {[
                  ["First 30 days", "Agree on ownership, audit the current token layers, select pilot brands, and document the shared component contract."],
                  ["Days 31 to 60", "Theme a focused component set in Figma and code, then review brand fidelity, responsive behavior, and accessibility in Storybook."],
                  ["Days 61 to 90", "Resolve gaps, publish contribution rules, measure exceptions, and decide whether the model is ready for the remaining publications."],
                ].map(([title, copy]) => (
                  <article key={title} className="bg-white p-6">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                  </article>
                ))}
              </div>
              <div className="mt-8 bg-[#102A43] p-7 text-white md:flex md:items-center md:justify-between md:gap-10 md:p-10">
                <div>
                  <p className="text-sm font-bold text-sky-300">Recommended decision</p>
                  <h3 className="mt-3 max-w-3xl text-balance text-3xl font-bold leading-tight md:text-4xl">
                    Approve one shared HDS core, brand themes, governed variants, specialist agents, and a three-brand pilot.
                  </h3>
                </div>
                <Link href="/token-architecture/" className="mt-6 inline-flex min-h-11 shrink-0 items-center border border-white/50 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 md:mt-0">
                  Review token architecture
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <ProductFooter />
    </div>
  );
}
