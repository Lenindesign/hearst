import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import packageJson from "../../../package.json";
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
  ["Token source", "token-source"],
  ["Tech stack", "tech-stack"],
  ["Component build", "component-build"],
  ["Operating guide", "operating-guide"],
  ["Prompted playbook", "prompted-playbook"],
  ["Ownership", "ownership"],
  ["Brand samples", "samples"],
  ["Portfolio", "portfolio"],
  ["Governance", "governance"],
  ["Agents and skills", "agentic"],
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

const dependencyVersion = (dependency: keyof typeof packageJson.dependencies) =>
  packageJson.dependencies[dependency].replace(/^[^0-9]*/, "");
const devDependencyVersion = (dependency: keyof typeof packageJson.devDependencies) =>
  packageJson.devDependencies[dependency].replace(/^[^0-9]*/, "");

const techStack = [
  {
    layer: "Runtime",
    name: `Next.js ${dependencyVersion("next")}`,
    owner: "Application platform",
    detail: "Routes, server rendering, static generation, middleware, metadata, and production application builds.",
    evidence: "src/app",
  },
  {
    layer: "Runtime",
    name: `React ${dependencyVersion("react")}`,
    owner: "UI runtime",
    detail: "Component composition, state, portals, hooks, accessibility behavior, and product interaction surfaces.",
    evidence: "react",
  },
  {
    layer: "Experience",
    name: "FRE",
    owner: "Hearst product",
    detail: "Reader-facing page shell, editorial routes, footer, product-story pages, and publication composition patterns.",
    evidence: "src/components/fre",
  },
  {
    layer: "System",
    name: "HDS",
    owner: "Design system",
    detail: "Shared components, semantic tokens, brand themes, accessibility rules, and Storybook review surfaces.",
    evidence: "src/components/ui",
  },
  {
    layer: "Primitives",
    name: `Base UI ${dependencyVersion("@base-ui/react")}`,
    owner: "Interaction foundation",
    detail: "Headless behavior for controls that need robust state, focus, keyboard, and accessibility mechanics.",
    evidence: "@base-ui/react",
  },
  {
    layer: "Component conventions",
    name: `shadcn ${dependencyVersion("shadcn")}`,
    owner: "Local source pattern",
    detail: "Composition conventions, aliases, and CSS-variable patterns adapted into Hearst-owned components.",
    evidence: "components.json",
  },
  {
    layer: "Token pipeline",
    name: `Style Dictionary ${devDependencyVersion("style-dictionary")}`,
    owner: "Token build",
    detail: "The design dictionary layer that transforms canonical token JSON into platform output consumed by CSS variables and themed components.",
    evidence: "style-dictionary.config.mjs",
  },
  {
    layer: "Styling",
    name: `Tailwind CSS ${devDependencyVersion("tailwindcss")}`,
    owner: "Implementation",
    detail: "Responsive layout and state composition while HDS semantic variables carry design decisions.",
    evidence: "src/app/globals.css",
  },
  {
    layer: "Review",
    name: `Storybook ${devDependencyVersion("@storybook/react")}`,
    owner: "System documentation",
    detail: "Production-backed component examples, states, accessibility checks, responsive review, and stakeholder signoff.",
    evidence: "src/stories",
  },
  {
    layer: "Delivery",
    name: "GitHub Actions, Docker, S3, DeepCLI, Kubernetes",
    owner: "FRE release platform",
    detail: "FRE-style delivery: CI builds Docker images, publishes static assets to S3, orchestrates releases through DeepCLI, and runs services on Kubernetes.",
    evidence: "Media-Platforms/fre workflows and k8s/fre",
  },
] as const;

const deploymentArchitecture = [
  ["GitHub Actions", "Owns pull request, main, and release workflows for build, release, and verification."],
  ["Docker", "Packages FRE runtime images so the same deployable artifact can move through environments."],
  ["AWS S3", "Stores and promotes static assets from development paths into production release paths."],
  ["DeepCLI", "Creates releases, runs deployment commands, coordinates environment promotion, and supports operational checks."],
  ["Kubernetes", "Runs the FRE service using manifests, health checks, startup probes, environment config, and rolling updates."],
] as const;

const tokenSourceRows = [
  {
    source: "Design intent",
    authority: "Head of design, HDS design, brand design",
    output: "Approved principle, brand need, or component decision",
    rule: "Capture the decision before changing values.",
  },
  {
    source: "Canonical docs",
    authority: "Repository Markdown",
    output: "PRODUCT.md, DESIGN.md, DESIGN-SYSTEM-SPEC.md, STYLE.md, BRAND_STYLES.md, APP_RULES.md",
    rule: "Each durable rule has one owner document.",
  },
  {
    source: "Canonical tokens",
    authority: "tokens/",
    output: "Core, semantic, component, typography, and publication JSON",
    rule: "Edit source tokens only. Generated outputs are not editing surfaces.",
  },
  {
    source: "Token build",
    authority: "Style Dictionary and token scripts",
    output: "dist/css/brands, src/lib/tokens.css, src/lib/brands.ts",
    rule: "Build and validate after token changes.",
  },
  {
    source: "Components",
    authority: "Production React",
    output: "Accessible anatomy, behavior, variants, states, and responsive rules",
    rule: "Shared behavior belongs in shared components.",
  },
  {
    source: "Evidence",
    authority: "Storybook, tests, production routes",
    output: "Reviewable examples, checks, and deployment verification",
    rule: "A change is not done until the evidence is visible.",
  },
] as const;

const tokenFlow = [
  ["1", "Decision", "Leadership and HDS agree whether the change is a core rule, semantic role, component variant, brand token, or exception."],
  ["2", "Source", "The owned source changes: canonical docs for rules, tokens for values, components for behavior, product code for journeys."],
  ["3", "Build", "Token scripts and application builds regenerate outputs. Generated CSS and TypeScript are reviewed but not hand-authored."],
  ["4", "Prove", "Storybook, route checks, accessibility, responsive coverage, and brand comparisons show the result."],
  ["5", "Release", "A human approves scope, the release is deployed, the exact revision is verified, and exceptions are recorded."],
] as const;

const operatingDocs = [
  ["PRODUCT.md", "Product purpose and the reader-facing principles the system must support."],
  ["DESIGN.md", "A routing bridge that tells designers and agents which canonical source owns a question."],
  ["DESIGN-SYSTEM-SPEC.md", "HDS authority, token architecture, component contract, Storybook role, and delivery evidence."],
  ["STYLE.md", "Shared visual, responsive, accessibility, theme, and interaction styling rules."],
  ["BRAND_STYLES.md", "Brand identity, inheritance, routes, colors, typography, logos, and scoped brand exceptions."],
  ["APP_RULES.md", "Product behavior: personalization, feeds, reader rules, navigation, state, loading, and exceptions."],
  ["AGENTS.md", "How agents read the repo, choose the right source, preserve scope, and avoid parallel systems."],
  ["CONTRIBUTING.md", "Contribution process, versioning, quality checks, release notes, and pull request expectations."],
] as const;

const componentBuildSteps = [
  {
    step: "Need",
    owner: "Product, brand, or HDS",
    title: "Define the user need and system level",
    detail: "Decide whether this is a new primitive, a shared HDS component, a variant, a brand theme value, or product-only composition.",
  },
  {
    step: "Contract",
    owner: "HDS",
    title: "Write the component contract",
    detail: "Name anatomy, states, accessibility requirements, responsive behavior, token roles, slots, variants, and unsupported uses.",
  },
  {
    step: "Behavior",
    owner: "Base UI when needed",
    title: "Use headless primitives for complex interactions",
    detail: "Reach for Base UI when focus management, keyboard control, popovers, menus, dialogs, tabs, or selection state need proven accessibility mechanics.",
  },
  {
    step: "Composition",
    owner: "shadcn-style local source",
    title: "Own the source code pattern",
    detail: "Use shadcn conventions for composable props, variants, class merging, CSS variables, and local ownership. Do not treat shadcn as an external design system.",
  },
  {
    step: "Styling",
    owner: "Tailwind plus HDS tokens",
    title: "Implement layout with semantic design decisions",
    detail: "Tailwind handles spacing, layout, breakpoints, and state selectors. HDS tokens carry color, type, surface, border, motion, and brand meaning.",
  },
  {
    step: "Proof",
    owner: "Storybook and tests",
    title: "Document, test, and release with evidence",
    detail: "Ship stories for states and brands, verify keyboard and responsive behavior, run token and build checks, then release only after review.",
  },
] as const;

const componentStackRoles = [
  ["HDS", "Owns the component contract: anatomy, accessibility, states, variants, tokens, brand expression, and quality bar."],
  ["Base UI", "Supplies headless behavior for complex controls. It is interaction infrastructure, not visual styling."],
  ["shadcn", "Provides the local composition vocabulary: source-owned components, variant patterns, class merging, and CSS-variable conventions."],
  ["Tailwind", "Authors implementation detail: layout, responsive rules, spacing, states, and utility composition."],
  ["Design Dictionary", "Compiles token decisions into runtime outputs that components consume through semantic variables."],
  ["Storybook", "Makes the contract reviewable across states, brands, breakpoints, accessibility, and product examples."],
] as const;

const promptedPlaybookRows = [
  {
    audience: "Designers",
    prompt: "Audit a component for brand expression",
    when: "A component works functionally but does not feel distinct enough for a publication.",
    inputs: "Brand, component, route or Storybook story, reference states, and relevant brand tokens.",
    output: "Brand-fit notes, token recommendations, variant request, and screenshots to review.",
    guardrail: "Do not request a component fork until token and supported-variant options are exhausted.",
  },
  {
    audience: "Designers",
    prompt: "Prepare a variant request",
    when: "A repeated brand or editorial need cannot be met by existing variants.",
    inputs: "Reader need, affected component, brands affected, examples, accessibility constraints, and expiry if it is an exception.",
    output: "Variant brief with anatomy, states, token roles, sample brands, and acceptance criteria.",
    guardrail: "Do not describe only visual taste. Tie the request to a reusable reader or brand need.",
  },
  {
    audience: "Product managers",
    prompt: "Write a component brief",
    when: "A product journey needs a new shared pattern or a change to an existing one.",
    inputs: "User goal, business goal, affected routes, success metric, constraints, risks, and target date.",
    output: "Brief with scope, non-goals, owners, pilot brands, decision gates, and launch evidence.",
    guardrail: "Do not collapse product behavior, brand identity, and component behavior into one request.",
  },
  {
    audience: "Product managers",
    prompt: "Prepare leadership decision notes",
    when: "A tradeoff needs approval from design, product, engineering, or brand leadership.",
    inputs: "Decision needed, options, impact, timeline, cost, risks, and recommended path.",
    output: "One-page decision note with recommendation, alternatives, evidence, and unresolved questions.",
    guardrail: "Do not ask leadership to approve implementation detail without stating the system impact.",
  },
  {
    audience: "Developers",
    prompt: "Find the source of truth",
    when: "A request could belong to tokens, components, brand config, route composition, or documentation.",
    inputs: "User request, affected UI, route, component names, and any browser evidence.",
    output: "Owned source path, files to inspect, expected validation, and out-of-scope files.",
    guardrail: "Do not edit generated token outputs or unrelated brand files.",
  },
  {
    audience: "Developers",
    prompt: "Implement a governed component change",
    when: "A shared component or variant has been approved.",
    inputs: "Component contract, token roles, Base UI needs, supported states, Storybook coverage, and acceptance criteria.",
    output: "Scoped code change, stories or tests, responsive checks, accessibility notes, and diff summary.",
    guardrail: "Do not hardcode a publication value in a shared component.",
  },
  {
    audience: "Agents",
    prompt: "Run a scoped system workflow",
    when: "A designer, PM, or developer wants repeatable execution with evidence.",
    inputs: "Goal, source-of-truth docs, allowed files, forbidden actions, validation commands, and release authority.",
    output: "Narrow diff, checks run, evidence, risks, and handoff-ready summary.",
    guardrail: "Do not deploy, broaden scope, or rewrite ownership rules without explicit approval.",
  },
] as const;

const playbookTemplate = [
  ["Purpose", "What decision or workflow this prompt supports."],
  ["Use when", "The exact situation where the prompt is appropriate."],
  ["Inputs", "Routes, components, brand, screenshots, docs, tokens, constraints, and success criteria."],
  ["Output", "The shape of the answer: brief, audit, variant request, implementation plan, or evidence report."],
  ["Guardrails", "What the prompt must not do, including forbidden files, scope expansion, and release authority."],
  ["Checks", "What proof is required before the work can be considered ready."],
] as const;

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

const skillRows = [
  ["$impeccable audit", "Run technical quality checks across accessibility, performance, theming, responsive behavior, and anti-patterns.", "Prioritized P0-P3 report with evidence."],
  ["$impeccable shape", "Plan a new system pattern before implementation.", "Decision model, component anatomy, constraints, and acceptance criteria."],
  ["$impeccable polish", "Tighten a built surface after the main architecture is correct.", "Focused UI fixes with build and visual evidence."],
  ["$impeccable document", "Turn implementation into durable design-system documentation.", "Updated docs that point to canonical source files."],
  ["$figma", "Sync or inspect one brand token branch without broad token churn.", "Scoped token JSON diff and validation."],
  ["$playwright", "Verify real routes, keyboard behavior, responsive states, and interaction flows.", "Screenshots, DOM evidence, and route assertions."],
  ["$deploy", "Release approved changes only after explicit authorization.", "Commit, push, deploy, exact revision verification, and smoke tests."],
  ["handoff", "Prepare continuation context when another agent or session needs to pick up the work.", "Compact summary of goals, constraints, files, checks, and next steps."],
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

const implementationPlan = [
  {
    phase: "Phase 0",
    timing: "1 week",
    title: "Leadership alignment",
    work: "Confirm the system decision, name accountable owners, agree on the pilot brands, and approve the exception policy.",
    evidence: "Signed decision, pilot scope, owner map, and meeting-ready guide.",
  },
  {
    phase: "Phase 1",
    timing: "2 weeks",
    title: "Source-of-truth cleanup",
    work: "Audit canonical docs, token layers, brand files, generated outputs, Storybook coverage, and known exceptions.",
    evidence: "Gap report, token health report, component inventory, and prioritized backlog.",
  },
  {
    phase: "Phase 2",
    timing: "3 weeks",
    title: "Three-brand pilot",
    work: "Theme one lifestyle, one automotive, and one fashion or entertainment brand across the selected component set.",
    evidence: "Figma review, Storybook examples, route screenshots, responsive checks, and accessibility notes.",
  },
  {
    phase: "Phase 3",
    timing: "3 weeks",
    title: "Governed rollout",
    work: "Resolve pilot gaps, document supported variants, add quality gates, and migrate the next group of brands.",
    evidence: "Versioned components, migration notes, tests, and exception register.",
  },
  {
    phase: "Phase 4",
    timing: "2 weeks",
    title: "Organization enablement",
    work: "Publish the guide, train brand and product partners, establish office hours, and formalize agent workflows.",
    evidence: "Published docs, training recording, contribution templates, and release checklist.",
  },
  {
    phase: "Phase 5",
    timing: "1 week",
    title: "Launch decision",
    work: "Review metrics, confirm remaining risks, approve the broader portfolio plan, and set the next quarterly roadmap.",
    evidence: "Executive readout, adoption metrics, risk log, and funded roadmap.",
  },
] as const;

const guideMetrics = [
  ["Reuse", "Percentage of publication surfaces using shared HDS components instead of local forks."],
  ["Brand fidelity", "Design approval rate for themed components across the pilot brands."],
  ["Quality", "Accessibility, responsive, visual, and token checks passing before release."],
  ["Speed", "Median time from approved request to reviewed Storybook evidence."],
  ["Drift", "Number of undocumented token, component, Figma, and production mismatches."],
  ["Exceptions", "Open exceptions by owner, expiry date, and migration path."],
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
              <SectionHeading id="token-source" title="Tokens are the single source of truth for system values.">
                The source of truth is not a slide, a screenshot, or a generated CSS file. Durable decisions live in canonical docs, canonical values live in token JSON, behavior lives in production components, and evidence lives in Storybook, tests, and verified routes.
              </SectionHeading>
              <div className="mt-10 overflow-x-auto border-y border-slate-300 bg-white" role="region" tabIndex={0} aria-label="Token source of truth architecture">
                <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="p-4 text-[#2D75B9]">Layer</th>
                      <th className="p-4 text-[#2D75B9]">Authority</th>
                      <th className="p-4 text-[#2D75B9]">Output</th>
                      <th className="p-4 text-[#2D75B9]">Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenSourceRows.map((row) => (
                      <tr key={row.source} className="border-b border-slate-200 last:border-b-0">
                        <td className="p-4 align-top font-bold text-[#102A43]">{row.source}</td>
                        <td className="p-4 align-top leading-6 text-slate-600">{row.authority}</td>
                        <td className="p-4 align-top font-mono text-xs leading-6 text-slate-600">{row.output}</td>
                        <td className="p-4 align-top leading-6 text-slate-600">{row.rule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ol className="mt-8 grid gap-px bg-slate-200 lg:grid-cols-5">
                {tokenFlow.map(([number, title, detail]) => (
                  <li key={title} className="bg-white p-5">
                    <span className="font-mono text-sm font-bold text-[#2D75B9]">{number}</span>
                    <h3 className="mt-3 text-lg font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 bg-[#E9F2FA] p-6 md:p-8">
                <h3 className="text-2xl font-bold">The practical rule</h3>
                <p className="mt-3 max-w-[80ch] text-sm leading-6 text-slate-700">
                  Edit `tokens/` for values, `src/components/ui/` for shared component behavior, route/product files for product composition, and canonical Markdown for durable rules. Do not hand-edit generated token outputs, and do not solve a brand need by forking a shared component when a token or supported variant can carry it.
                </p>
              </div>
            </section>

            <section>
              <SectionHeading id="tech-stack" title="The stack separates ownership from implementation.">
                FRE composes reader experiences and gives us the deployment model. HDS defines the system contract. Base UI, shadcn conventions, Style Dictionary, and Tailwind support that contract without becoming competing design systems.
              </SectionHeading>
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-2 xl:grid-cols-3">
                {techStack.map((item) => (
                  <article key={item.name} className="bg-white p-6">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2D75B9]">
                      {item.layer}
                    </p>
                    <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-[#102A43]">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">{item.owner}</p>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{item.detail}</p>
                    <p className="mt-5 border-t border-slate-200 pt-4 font-mono text-xs font-bold text-slate-500">
                      {item.evidence}
                    </p>
                  </article>
                ))}
              </div>
              <div className="mt-8 grid gap-4 bg-[#102A43] p-6 text-white md:grid-cols-[0.75fr_1.25fr] md:items-start md:p-8">
                <h3 className="text-2xl font-bold">How to read the stack</h3>
                <p className="text-sm leading-6 text-slate-300">
                  HDS owns the reusable decisions: tokens, components, accessibility, and brand themes. FRE owns the product composition and production delivery pattern that turns those pieces into a reader journey. Tailwind is the authoring layer, Style Dictionary is the token compiler, shadcn is the local component convention, and Base UI supplies accessible headless behavior.
                </p>
              </div>
              <div className="mt-8 bg-white p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2D75B9]">
                      Recommended delivery model
                    </p>
                    <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-[#102A43]">
                      Use the FRE release architecture
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      The system should follow the FRE production path: GitHub Actions for automation, Docker for deployable images, S3 for static assets, DeepCLI for release orchestration, and Kubernetes for runtime. Vercel can exist as configuration, but it is not the primary production deployment model.
                    </p>
                  </div>
                  <dl className="grid gap-px bg-slate-200 sm:grid-cols-2">
                    {deploymentArchitecture.map(([name, detail]) => (
                      <div key={name} className="bg-slate-50 p-5">
                        <dt className="font-bold text-[#102A43]">{name}</dt>
                        <dd className="mt-2 text-sm leading-6 text-slate-600">{detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </section>

            <section>
              <SectionHeading id="component-build" title="How an HDS component is made.">
                A component starts with a user need and ends as a governed contract. HDS decides what the component means, Base UI supplies behavior when the interaction is complex, shadcn conventions shape the source pattern, Tailwind handles implementation detail, and tokens carry brand expression.
              </SectionHeading>
              <ol className="mt-10 border-t-2 border-[#2D75B9]">
                {componentBuildSteps.map((item, index) => (
                  <li key={item.step} className="grid gap-3 border-b border-slate-200 py-6 md:grid-cols-[3rem_0.55fr_0.75fr_1.7fr] md:items-start">
                    <span className="font-mono text-sm font-bold text-[#2D75B9]">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-lg font-bold">{item.step}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{item.owner}</p>
                    </div>
                    <p className="text-base font-bold text-[#102A43]">{item.title}</p>
                    <p className="text-sm leading-6 text-slate-600">{item.detail}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 grid gap-px bg-slate-200 md:grid-cols-2 xl:grid-cols-3">
                {componentStackRoles.map(([name, detail]) => (
                  <article key={name} className="bg-white p-6">
                    <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#102A43]">{name}</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{detail}</p>
                  </article>
                ))}
              </div>
              <div className="mt-8 bg-[#102A43] p-6 text-white md:p-8">
                <h3 className="text-2xl font-bold">Example: a dropdown or menu</h3>
                <p className="mt-3 max-w-[80ch] text-sm leading-6 text-slate-300">
                  HDS defines anatomy, states, density, token roles, and when the pattern should be used. Base UI handles focus, escape behavior, keyboard navigation, and ARIA. The shadcn-style wrapper gives Hearst-owned props and variants. Tailwind composes layout and state classes. Tokens theme the surface, border, text, focus, and brand accent. Storybook proves default, hover, focus, selected, disabled, mobile, and brand-themed states.
                </p>
              </div>
            </section>

            <section>
              <SectionHeading id="operating-guide" title="The guide needs durable operating documents.">
                Leadership should share the story, but teams need the working map. The repo already separates product intent, design-system architecture, visual rules, brand identity, app behavior, agent rules, and contribution process into specific documents.
              </SectionHeading>
              <dl className="mt-10 divide-y divide-slate-200 border-y border-slate-300 bg-white">
                {operatingDocs.map(([documentName, purpose]) => (
                  <div key={documentName} className="grid gap-2 p-5 sm:grid-cols-[15rem_1fr] sm:gap-6">
                    <dt className="font-mono text-sm font-bold text-[#2D75B9]">{documentName}</dt>
                    <dd className="text-sm leading-6 text-slate-600">{purpose}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 grid gap-6 bg-white p-6 md:grid-cols-3 md:p-8">
                <div>
                  <h3 className="text-xl font-bold">For designers</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Start with the decision model, brand identity rules, token roles, and Storybook evidence before requesting a new variant.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold">For engineers</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Change the lowest owned layer, preserve generated outputs as outputs, and validate routes, states, breakpoints, and accessibility.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold">For agents</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Read the canonical owner, make the narrow change, produce evidence, and stop before release unless deployment is explicitly authorized.</p>
                </div>
              </div>
            </section>

            <section>
              <SectionHeading id="prompted-playbook" title="The prompted operating playbook makes the system usable.">
                Prompts should be reusable workflows, not casual snippets. Each prompt needs a clear audience, required inputs, expected output, source-of-truth rules, and guardrails so designers, product managers, developers, and agents make compatible decisions.
              </SectionHeading>
              <div className="mt-10 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
                <div className="bg-[#102A43] p-6 text-white md:p-8">
                  <h3 className="text-2xl font-bold">Every prompt follows one template</h3>
                  <dl className="mt-6 divide-y divide-white/15">
                    {playbookTemplate.map(([term, detail]) => (
                      <div key={term} className="grid gap-2 py-3 sm:grid-cols-[7rem_1fr]">
                        <dt className="font-mono text-xs font-bold text-sky-300">{term}</dt>
                        <dd className="text-sm leading-6 text-slate-300">{detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="bg-white p-6 md:p-8">
                  <h3 className="text-2xl font-bold">The operating rule</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    A reusable prompt must point to the same system architecture as the code. It should tell someone what to read, what to provide, what output to expect, what evidence is required, and where authority stops.
                  </p>
                  <div className="mt-6 border-y border-slate-200 py-5">
                    <p className="text-sm font-bold text-[#2D75B9]">Recommended storage</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Keep the playbook in the HDS documentation set, then mirror selected prompts into team tools only as copies that link back to the canonical source.
                    </p>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    This prevents teams from reusing stale prompts that reference old token names, old governance, or outdated release rules.
                  </p>
                </div>
              </div>
              <div className="mt-10 grid gap-px bg-slate-200 xl:grid-cols-2">
                {promptedPlaybookRows.map((item) => (
                  <article key={`${item.audience}-${item.prompt}`} className="bg-white p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2D75B9]">
                        {item.audience}
                      </p>
                      <span className="border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500">
                        Reusable prompt
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-[#102A43]">
                      {item.prompt}
                    </h3>
                    <dl className="mt-5 divide-y divide-slate-200 text-sm">
                      <div className="grid gap-2 py-3 sm:grid-cols-[7rem_1fr]">
                        <dt className="font-bold text-[#102A43]">Use when</dt>
                        <dd className="leading-6 text-slate-600">{item.when}</dd>
                      </div>
                      <div className="grid gap-2 py-3 sm:grid-cols-[7rem_1fr]">
                        <dt className="font-bold text-[#102A43]">Inputs</dt>
                        <dd className="leading-6 text-slate-600">{item.inputs}</dd>
                      </div>
                      <div className="grid gap-2 py-3 sm:grid-cols-[7rem_1fr]">
                        <dt className="font-bold text-[#102A43]">Output</dt>
                        <dd className="leading-6 text-slate-600">{item.output}</dd>
                      </div>
                      <div className="grid gap-2 py-3 sm:grid-cols-[7rem_1fr]">
                        <dt className="font-bold text-[#102A43]">Guardrail</dt>
                        <dd className="leading-6 text-slate-600">{item.guardrail}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
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

              <div className="mt-10">
                <h3 className="text-2xl font-bold">Skills are the repeatable runbooks.</h3>
                <p className="mt-3 max-w-[72ch] text-sm leading-6 text-slate-600">
                  A skill is a named workflow with rules, checks, and boundaries. The point is not to replace design judgment; it is to make common system work repeatable, scoped, and reviewable.
                </p>
                <div className="mt-6 grid gap-px bg-slate-200 md:grid-cols-2">
                  {skillRows.map(([skill, purpose, output]) => (
                    <article key={skill} className="bg-white p-5">
                      <h4 className="font-mono text-sm font-bold text-[#2D75B9]">{skill}</h4>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{purpose}</p>
                      <p className="mt-4 border-t border-slate-200 pt-3 text-xs font-bold text-slate-500">
                        Output: {output}
                      </p>
                    </article>
                  ))}
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
              <SectionHeading id="pilot" title="A realistic plan is twelve weeks from alignment to launch decision.">
                Start with a lifestyle publication, an automotive publication, and a fashion or entertainment publication. Use the same governed component, token, Storybook, and agent workflow for each. If the components preserve all three identities without forks, the architecture and operating model are ready to expand.
              </SectionHeading>
              <ol className="mt-10 border-t-2 border-[#2D75B9]">
                {implementationPlan.map((item) => (
                  <li key={item.phase} className="grid gap-3 border-b border-slate-200 py-6 md:grid-cols-[6rem_6rem_0.9fr_1.7fr] md:items-start">
                    <div>
                      <p className="font-mono text-sm font-bold text-[#2D75B9]">{item.phase}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{item.timing}</p>
                    </div>
                    <h3 className="text-lg font-bold md:col-span-1">{item.title}</h3>
                    <p className="text-sm leading-6 text-slate-600">{item.work}</p>
                    <p className="text-sm leading-6 text-slate-600">
                      <strong className="text-[#102A43]">Evidence:</strong> {item.evidence}
                    </p>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <h3 className="text-2xl font-bold">What leadership should measure</h3>
                <dl className="mt-6 grid gap-px bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
                  {guideMetrics.map(([metric, detail]) => (
                    <div key={metric} className="bg-white p-5">
                      <dt className="font-bold text-[#2D75B9]">{metric}</dt>
                      <dd className="mt-2 text-sm leading-6 text-slate-600">{detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-8 grid gap-px bg-slate-200 md:grid-cols-3">
                {[
                  ["Pilot component set", "Card, button, link, form control, navigation item, modal, carousel, newsletter/onboarding panel, and one editorial media treatment."],
                  ["Pilot brands", "One lifestyle brand, one automotive brand, and one fashion or entertainment brand with meaningfully different typography and color needs."],
                  ["Decision gates", "End of Phase 1: architecture gaps. End of Phase 2: brand fidelity. End of Phase 5: scale or pause."],
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
