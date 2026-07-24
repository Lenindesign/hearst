import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";

export const metadata: Metadata = {
  title: "Hearst Token Architecture | Business and Engineering Guide",
  description:
    "A source-backed guide to the proposed Hearst design-token architecture, its business value, engineering model, migration path, and governance.",
};

const architectureStages = [
  {
    number: "01",
    title: "Author and import",
    owner: "Design systems",
    detail:
      "Designers explore in Figma. Approved variables enter through the Token Studio import or a controlled Git change. Figma is a design surface, not the production release authority.",
    output: "Raw versioned snapshot",
  },
  {
    number: "02",
    title: "Normalize",
    owner: "Design systems engineering",
    detail:
      "The normalizer separates reusable foundations, semantic intent, component decisions, and brand differences. Naming corrections and inheritance metadata are applied consistently.",
    output: "Canonical token JSON",
  },
  {
    number: "03",
    title: "Validate",
    owner: "CI and reviewers",
    detail:
      "Automated checks find broken references, accidental removals, duplicated decisions, invalid values, weak brand coverage, and structural changes that require review.",
    output: "Reviewable evidence",
  },
  {
    number: "04",
    title: "Build",
    owner: "Platform engineering",
    detail:
      "Style Dictionary and repository generators create CSS variables, JavaScript, flat JSON, React brand metadata, and theme bridges from the same approved source.",
    output: "Platform-ready packages",
  },
  {
    number: "05",
    title: "Consume and sync",
    owner: "Product teams",
    detail:
      "Web products consume semantic contracts. Figma and Pencil receive synchronized variables for design and handoff. Generated files are outputs, never competing sources.",
    output: "One decision across tools",
  },
];

const layerRows = [
  {
    layer: "Core",
    question: "What values exist?",
    examples: "palette.blue.600, space.md, radius.sm, font.size.300",
    ownership: "Global design-system foundation",
    rule: "Components should not choose raw values directly.",
  },
  {
    layer: "Semantic",
    question: "What does the value mean?",
    examples: "color.action.primary, color.text.default, surface.page, border.subtle",
    ownership: "Cross-product experience contract",
    rule: "This is the preferred component API.",
  },
  {
    layer: "Component",
    question: "Is the decision truly local?",
    examples: "button.primary.background.hover, card.collection.gap",
    ownership: "Component maintainers",
    rule: "Create only when a semantic token cannot express the decision.",
  },
  {
    layer: "Brand extension",
    question: "What must this publication change?",
    examples: "brand.primary, font.headline, action.primary",
    ownership: "Brand and design-system owners",
    rule: "Override the smallest possible set and inherit the rest.",
  },
];

const comparisonRows = [
  {
    dimension: "Source of truth",
    inherited: "Values can be distributed across design files, exported payloads, generated code, and product overrides.",
    proposed: "Git token JSON is the release authority. Figma and Pencil remain synchronized design and handoff surfaces.",
    business: "Clear accountability and fewer disputes about which value is current.",
  },
  {
    dimension: "Brand scale",
    inherited: "Large brand collections can repeat the full component matrix even when most decisions are shared.",
    proposed: "A base semantic theme carries shared behavior; each publication stores only meaningful differences.",
    business: "A shared improvement can reach every brand without 29 parallel edits.",
  },
  {
    dimension: "Change safety",
    inherited: "Broad exports make a small visual change difficult to review and easy to ship with unrelated differences.",
    proposed: "Focused diffs, schema checks, reference validation, visual tests, and pull-request approval gate each release.",
    business: "Lower regression risk and faster approval for routine changes.",
  },
  {
    dimension: "Component contracts",
    inherited: "Component-specific tokens can duplicate semantic values and make product code depend on implementation details.",
    proposed: "Components consume purpose-driven tokens. Component tokens are reserved for decisions that are genuinely local.",
    business: "Teams can update brand expression without rebuilding component logic.",
  },
  {
    dimension: "Multi-platform delivery",
    inherited: "Each consumer may translate values independently, creating drift between design and implementation.",
    proposed: "One approved graph generates CSS, JavaScript, JSON, React metadata, and design-tool variables.",
    business: "One decision travels farther with less manual coordination.",
  },
  {
    dimension: "Audit and rollback",
    inherited: "It can be difficult to connect a live visual difference to an approved token decision.",
    proposed: "Commits, pull requests, generated artifacts, and release versions create a traceable chain from request to product.",
    business: "Faster incident response and clearer governance.",
  },
];

const evidence = [
  {
    value: "29",
    label: "brand collections",
    copy: "The earlier Figma audit found a base architecture plus publication extensions across the portfolio.",
  },
  {
    value: "71,981",
    label: "Figma variables",
    copy: "The June 2026 research snapshot shows why compact inventories and file-based processing are required.",
  },
  {
    value: "18,180",
    label: "shared token leaves",
    copy: "The shared token workspace contains 590 core, 2 semantic, and 17,588 brand-layer leaves. These are not all confirmed Hearst+ consumers.",
  },
  {
    value: "192",
    label: "shared token duplicates",
    copy: "The repository validator found 192 shared component-token definitions matching an existing semantic value. Hearst+ consumer usage has not yet been audited.",
  },
];

const workflowRows = [
  {
    change: "Change an existing brand color or font",
    design: "Confirm the intended brand result and affected states.",
    engineering: "Edit the brand override, rebuild outputs, and compare the focused diff.",
    proof: "Token checks, affected components, light and dark themes, representative routes.",
  },
  {
    change: "Add a new semantic role",
    design: "Document the user-facing purpose and state model.",
    engineering: "Add the semantic token, map platform outputs, and migrate consumers incrementally.",
    proof: "Reference resolution, API review, cross-brand contrast, backward compatibility.",
  },
  {
    change: "Add a new component token",
    design: "Show why existing semantic roles cannot express the decision.",
    engineering: "Keep the token scoped, typed, documented, and owned by the component.",
    proof: "Component states, Storybook coverage, duplication audit, deprecation plan.",
  },
  {
    change: "Onboard a publication",
    design: "Identify authentic brand differences, not a copy of the base system.",
    engineering: "Extend the base theme with a minimal override file and font metadata.",
    proof: "Coverage report, route smoke tests, visual comparison, accessibility checks.",
  },
];

const migrationPhases = [
  {
    title: "Baseline the real system",
    outcome: "A trusted inventory of production tokens, consumers, duplicate values, and ownership.",
    work: [
      "Export production Figma collections and code packages without flattening inheritance.",
      "Map every generated artifact and identify which products consume it.",
      "Classify hard-coded values, aliases, component tokens, and publication overrides.",
      "Record current release frequency, lead time, rollback time, and defect rate.",
    ],
  },
  {
    title: "Define the contract",
    outcome: "A versioned schema and naming model that design and engineering both approve.",
    work: [
      "Ratify core, semantic, component, and brand-extension responsibilities.",
      "Define token types, state naming, deprecation rules, and compatibility policy.",
      "Choose Git as release authority and document how Figma proposals enter review.",
      "Turn validator warnings into an owned remediation backlog.",
    ],
  },
  {
    title: "Prove it with two brands",
    outcome: "One base theme and two intentionally different publications running through the full pipeline.",
    work: [
      "Choose brands with distinct typography, palette, and component behavior.",
      "Reduce their files to meaningful overrides while preserving production output.",
      "Generate CSS, JavaScript, JSON, and design-tool variables from one commit.",
      "Compare screenshots, accessibility, bundle impact, and authoring effort.",
    ],
  },
  {
    title: "Expand without a flag day",
    outcome: "Brands migrate in controlled cohorts while existing products continue to ship.",
    work: [
      "Publish versioned compatibility aliases for existing consumers.",
      "Move shared decisions upward only after visual and behavioral equivalence.",
      "Track brand exceptions explicitly instead of hiding them in component code.",
      "Provide codemods and migration guides for common token replacements.",
    ],
  },
  {
    title: "Enforce and operate",
    outcome: "The architecture becomes the normal release process, not a parallel experiment.",
    work: [
      "Block broken references, accidental removals, unapproved literals, and generated-file drift in CI.",
      "Assign owners for foundations, semantic roles, components, and publication extensions.",
      "Version packages, publish release notes, and retain one-step rollback.",
      "Review usage, duplication, accessibility, and adoption every quarter.",
    ],
  },
];

const implementationComparisons = [
  {
    product: "Car and Driver",
    model: "CSS-in-JS with generated production classes",
    strength:
      "Semantic variables and centralized component styling create a strong multi-brand design-system contract.",
    tradeoff:
      "Generated class names are opaque in production debugging, and some CSS-in-JS systems can add runtime work.",
    lesson: "Preserve the semantic contract and centralized ownership.",
  },
  {
    product: "MotorTrend production",
    model: "Utility-first Tailwind in component markup",
    strength:
      "Layout and responsive decisions are visible, direct, and fast for engineers who know the utility vocabulary.",
    tradeoff:
      "Long class strings can distribute typography, brand, responsive, and state decisions across many templates.",
    lesson: "Preserve the authoring speed, but constrain it with approved tokens and recipes.",
  },
  {
    product: "Hearst prototype",
    model: "Tailwind plus semantic classes and brand variables",
    strength:
      "Tailwind owns structure while semantic CSS variables preserve brand identity and reusable component meaning.",
    tradeoff:
      "Repeated arbitrary values and multi-class visual recipes still need to move into named variants and components.",
    lesson: "Use this as the foundation, then complete its governance and accessibility contracts.",
  },
];

const implementationResponsibilities = [
  {
    owner: "CSS variables",
    responsibility: "Brand identity and semantic decisions",
    examples: "--font-headline, --color-text-primary, --surface-card",
    boundary: "Do not expose raw brand values as the component API.",
  },
  {
    owner: "Tailwind",
    responsibility: "Layout, spacing, responsive behavior, and simple states",
    examples: "grid, gap-4, sm:grid-cols-2, focus-visible:ring-2",
    boundary: "Do not let one-off utilities become an undocumented visual recipe.",
  },
  {
    owner: "Semantic recipes",
    responsibility: "Complete recurring treatments",
    examples: "typography-hero-title, surface-story-card, action-primary",
    boundary: "A recipe should describe intent, not one publication's implementation.",
  },
  {
    owner: "React components",
    responsibility: "Variants, behavior, semantics, and accessibility",
    examples: '<StoryCard variant="hero" href="/story" />',
    boundary: "Authors choose a supported variant instead of rebuilding behavior from class strings.",
  },
];

const productionPriorities = [
  {
    priority: "1",
    title: "Turn repeated combinations into named recipes",
    detail:
      "Fluid type, line height, wrapping, width, and truncation form one hero-title decision. Product templates should consume that decision through a named recipe.",
  },
  {
    priority: "2",
    title: "Replace recurring arbitrary values with tokens or variants",
    detail:
      "Values such as card radii, media heights, and grid tracks are useful during exploration. Once repeated, they belong to the system contract.",
  },
  {
    priority: "3",
    title: "Make component semantics match the user action",
    detail:
      "Article navigation should be an anchor. Buttons should perform actions on the current page. The component owns that distinction.",
  },
  {
    priority: "4",
    title: "Enforce carousel accessibility by state",
    detail:
      "Only inactive slides should receive inert or aria-hidden. The active slide must remain visible to keyboard and assistive-technology users.",
  },
];

const measures = [
  ["Adoption", "Share of production component styles resolved through approved semantic tokens", "Increase without growing exception count"],
  ["Change speed", "Median time from approved token request to verified product release", "Decrease while review quality remains stable"],
  ["Consistency", "Number of unintended cross-brand value differences", "Decrease"],
  ["Safety", "Token-caused regressions and median rollback time", "Decrease"],
  ["Efficiency", "Average override count per publication", "Decrease as shared decisions move to the base layer"],
  ["Quality", "Contrast, broken-reference, and invalid-value failures caught before merge", "Increase pre-merge, approach zero post-release"],
];

function CodeLabel({ children }: { children: ReactNode }) {
  return (
    <code className="inline-flex rounded-[4px] bg-slate-100 px-2 py-1 font-mono text-[0.78rem] font-semibold text-slate-700">
      {children}
    </code>
  );
}

function CheckItem({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <li className="grid grid-cols-[1.1rem_1fr] gap-3">
      <span
        aria-hidden="true"
        className={light ? "font-bold text-sky-300" : "font-bold text-[#2D75B9]"}
      >
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function TokenArchitecturePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#102A43]">
      <ProductHeader current="tokens" />
      <main>
        <section className="overflow-hidden bg-[#102A43] text-white">
          <div className="mx-auto grid max-w-[1360px] gap-14 px-5 py-20 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-28">
            <div>
              <p className="text-sm font-bold text-sky-300">Hearst Design System</p>
              <h1 className="mt-5 max-w-3xl text-balance text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                One token decision, carried safely across every brand.
              </h1>
              <p className="mt-7 max-w-[68ch] text-pretty text-lg leading-8 text-slate-300">
                This architecture gives the business one governed way to scale brand expression and gives engineering one typed, testable pipeline from an approved decision to production code.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="#executive-decision"
                  className="bg-white px-5 py-3 text-sm font-bold text-[#2D75B9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Read the recommendation
                </Link>
                <Link
                  href="#engineering-model"
                  className="border border-white/50 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Inspect the engineering model
                </Link>
              </div>
            </div>

            <div className="border border-white/20 bg-[#0B1E2F] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-5 border-b border-white/15 pb-5">
                <div>
                  <p className="text-sm font-bold">Release path</p>
                  <p className="mt-1 text-xs text-slate-400">Design intent becomes governed product code</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                  Traceable
                </span>
              </div>
              <ol className="mt-6 space-y-3">
                {["Figma proposal", "Git token review", "Automated validation", "Generated packages", "Product themes"].map(
                  (step, index) => (
                    <li key={step} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold">{step}</span>
                      <span className="font-mono text-xs text-slate-500">
                        {index === 0 ? "design" : index === 1 ? "source" : index === 2 ? "gate" : index === 3 ? "build" : "runtime"}
                      </span>
                    </li>
                  )
                )}
              </ol>
              <div className="mt-6 border-t border-white/15 pt-5 text-sm leading-6 text-slate-300">
                <strong className="text-white">Release authority:</strong> versioned token JSON in Git.
                Figma and Pencil remain essential, synchronized tools for design and handoff.
              </div>
            </div>
          </div>
        </section>

        <section id="executive-decision" className="scroll-mt-20 border-b border-slate-200 bg-[#E9F2FA]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <h2 className="text-balance text-4xl font-bold leading-tight tracking-[-0.025em]">
                  The decision in plain language
                </h2>
                <p className="mt-5 max-w-[62ch] text-pretty leading-7 text-slate-700">
                  Adopt a layered, Git-governed token graph as the production contract. Preserve Figma for exploration and collaboration, then generate every delivery format from one approved source.
                </p>
              </div>
              <div className="grid gap-px bg-slate-300 sm:grid-cols-2">
                <article className="bg-white p-6">
                  <h3 className="text-lg font-bold">For the business</h3>
                  <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                    <CheckItem>Improve once and distribute the result across the portfolio.</CheckItem>
                    <CheckItem>Keep publication identity without funding separate systems.</CheckItem>
                    <CheckItem>Review, approve, audit, and reverse every production change.</CheckItem>
                    <CheckItem>Measure delivery speed and risk instead of relying on anecdote.</CheckItem>
                  </ul>
                </article>
                <article className="bg-[#102A43] p-6 text-white">
                  <h3 className="text-lg font-bold">For engineering</h3>
                  <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                    <CheckItem light>Consume semantic APIs instead of brand-specific literals.</CheckItem>
                    <CheckItem light>Generate CSS, JavaScript, JSON, and metadata from one graph.</CheckItem>
                    <CheckItem light>Catch broken references and drift before merge.</CheckItem>
                    <CheckItem light>Migrate incrementally with compatibility aliases and versioning.</CheckItem>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                  What the portfolio evidence says
                </h2>
                <p className="mt-5 max-w-[60ch] leading-7 text-slate-600">
                  The scale is already real. The opportunity is to replace repeated decisions with inheritance, clear ownership, and automated release evidence.
                </p>
              </div>
              <p className="max-w-[72ch] text-sm leading-6 text-slate-500">
                Scope note: the Figma figures come from the June 2026 research snapshot. Repository figures come from the current local token files and validator. The implementation comparison comes from the 13-page “Tailwind Usage Comparison” research PDF shared on July 24, 2026. Production performance and savings still require direct baselines.
              </p>
            </div>
            <dl className="mt-12 grid gap-px bg-slate-300 sm:grid-cols-2 xl:grid-cols-4">
              {evidence.map((item) => (
                <div key={item.label} className="bg-[#F8FAFC] p-6">
                  <dt className="text-sm font-bold text-[#2D75B9]">{item.label}</dt>
                  <dd className="mt-3 text-4xl font-bold tracking-[-0.03em]">{item.value}</dd>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{item.copy}</p>
                </div>
              ))}
            </dl>
            <div className="mt-6 border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
              <strong>Important:</strong> the shared token validator currently reports 8,027 warnings, including broad hard-coded brand literals and thin semantic coverage. These are portfolio migration signals, not confirmed Hearst+ defects. Consumer-level usage must be audited before attributing a warning to the prototype.
            </div>
          </div>
        </section>

        <section id="engineering-model" className="scroll-mt-20 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="max-w-4xl">
              <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                The engineering model from proposal to runtime
              </h2>
              <p className="mt-5 max-w-[72ch] text-pretty leading-7 text-slate-600">
                Each stage has one responsibility, one accountable owner, and a concrete output. That separation prevents a design file, generated stylesheet, or product override from quietly becoming a competing source of truth.
              </p>
            </div>
            <ol className="mt-12 border-t-2 border-[#2D75B9]">
              {architectureStages.map((stage) => (
                <li
                  key={stage.number}
                  className="grid gap-4 border-b border-slate-200 py-7 md:grid-cols-[3rem_0.8fr_0.8fr_1.6fr_0.8fr] md:items-start"
                >
                  <span className="font-mono text-sm font-bold text-[#2D75B9]">{stage.number}</span>
                  <h3 className="font-bold">{stage.title}</h3>
                  <p className="text-sm font-semibold text-slate-500">{stage.owner}</p>
                  <p className="text-sm leading-6 text-slate-600">{stage.detail}</p>
                  <p className="text-sm font-bold text-[#102A43]">{stage.output}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              <div className="bg-[#102A43] p-6 text-white lg:col-span-2">
                <h3 className="text-xl font-bold">Current repository path</h3>
                <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                  <CodeLabel>import-token-studio.ts</CodeLabel>
                  <span aria-hidden="true" className="text-sky-300">→</span>
                  <CodeLabel>normalize-tokens.ts</CodeLabel>
                  <span aria-hidden="true" className="text-sky-300">→</span>
                  <CodeLabel>validate-tokens.ts</CodeLabel>
                  <span aria-hidden="true" className="text-sky-300">→</span>
                  <CodeLabel>Style Dictionary</CodeLabel>
                  <span aria-hidden="true" className="text-sky-300">→</span>
                  <CodeLabel>ThemeProvider</CodeLabel>
                </div>
                <p className="mt-6 max-w-[75ch] text-sm leading-6 text-slate-300">
                  The repository already implements import, normalization, validation, multi-format generation, brand metadata, CSS variables, and runtime theming. The migration work is to simplify the graph and enforce the contract, not replace the entire toolchain.
                </p>
              </div>
              <div className="border border-slate-300 bg-white p-6">
                <h3 className="text-lg font-bold">Generated outputs</h3>
                <ul className="mt-5 space-y-3 font-mono text-xs leading-5 text-slate-600">
                  <li>dist/css/base.css</li>
                  <li>dist/css/brands/*.css</li>
                  <li>dist/css/tokens.css</li>
                  <li>dist/js/tokens.mjs</li>
                  <li>dist/json/tokens.json</li>
                  <li>src/lib/brands.ts</li>
                  <li>src/lib/tokens.css</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="max-w-4xl">
              <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                Four layers, four different questions
              </h2>
              <p className="mt-5 max-w-[72ch] leading-7 text-slate-600">
                A token name should reveal the level of decision it represents. Mixing the layers creates duplication, unclear ownership, and component code that cannot scale across brands.
              </p>
            </div>
            <div className="mt-12 overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y-2 border-[#102A43]">
                    <th className="px-4 py-4 font-bold">Layer</th>
                    <th className="px-4 py-4 font-bold">Question</th>
                    <th className="px-4 py-4 font-bold">Examples</th>
                    <th className="px-4 py-4 font-bold">Ownership</th>
                    <th className="px-4 py-4 font-bold">Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {layerRows.map((row) => (
                    <tr key={row.layer} className="border-b border-slate-200 align-top">
                      <th className="px-4 py-5 text-base font-bold text-[#2D75B9]">{row.layer}</th>
                      <td className="px-4 py-5 font-semibold">{row.question}</td>
                      <td className="px-4 py-5 font-mono text-xs leading-5 text-slate-600">{row.examples}</td>
                      <td className="px-4 py-5 leading-6 text-slate-600">{row.ownership}</td>
                      <td className="px-4 py-5 leading-6 text-slate-600">{row.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 grid gap-px bg-slate-300 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="bg-[#E9F2FA] p-7">
                <h3 className="text-2xl font-bold">Inheritance is the scaling mechanism</h3>
                <p className="mt-5 leading-7 text-slate-700">
                  A publication starts with the base semantic theme. It changes only the tokens that make its identity or behavior meaningfully different. Everything else remains connected to the shared system.
                </p>
              </div>
              <div className="bg-white p-7">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                  <div className="border border-slate-300 p-4">
                    <p className="text-xs font-bold text-slate-500">Core</p>
                    <p className="mt-2 font-mono text-sm">blue.600</p>
                    <div className="mt-3 h-8 bg-[#2D75B9]" />
                  </div>
                  <span aria-hidden="true" className="hidden text-xl font-bold text-slate-400 sm:block">→</span>
                  <div className="border border-slate-300 p-4">
                    <p className="text-xs font-bold text-slate-500">Semantic</p>
                    <p className="mt-2 font-mono text-sm">action.primary</p>
                    <div className="mt-3 h-8 bg-[#2D75B9]" />
                  </div>
                  <span aria-hidden="true" className="hidden text-xl font-bold text-slate-400 sm:block">→</span>
                  <div className="border border-slate-300 p-4">
                    <p className="text-xs font-bold text-slate-500">Component</p>
                    <p className="mt-2 font-mono text-sm">Button primary</p>
                    <span className="mt-3 flex h-8 w-full items-center justify-center bg-[#2D75B9] px-3 text-xs font-bold text-white">
                      Read story
                    </span>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-600">
                  A brand can redirect <CodeLabel>action.primary</CodeLabel> without changing the button contract. Engineering keeps one component API while each publication retains its own expression.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#E9F2FA]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-sm font-bold text-[#2D75B9]">Implementation research</p>
                <h2 className="mt-4 text-balance text-4xl font-bold tracking-[-0.025em]">
                  Tailwind is the delivery mechanism, not the design system
                </h2>
              </div>
              <p className="max-w-[76ch] leading-7 text-slate-600">
                The research compared three real patterns. Car and Driver provides the stronger semantic architecture. MotorTrend provides the faster, more transparent authoring workflow. The Hearst prototype combines both advantages and is the best foundation for a shared platform, provided the remaining decisions are pulled into governed recipes and components.
              </p>
            </div>

            <div className="mt-12 grid gap-px bg-slate-300 lg:grid-cols-3">
              {implementationComparisons.map((item) => (
                <article key={item.product} className="bg-white p-6">
                  <p className="text-xs font-bold text-[#2D75B9]">{item.model}</p>
                  <h3 className="mt-3 text-2xl font-bold">{item.product}</h3>
                  <dl className="mt-6 space-y-5 text-sm leading-6">
                    <div>
                      <dt className="font-bold">Main strength</dt>
                      <dd className="mt-1 text-slate-600">{item.strength}</dd>
                    </div>
                    <div>
                      <dt className="font-bold">Main tradeoff</dt>
                      <dd className="mt-1 text-slate-600">{item.tradeoff}</dd>
                    </div>
                    <div className="border-t border-slate-200 pt-5">
                      <dt className="font-bold text-[#2D75B9]">What Hearst should keep</dt>
                      <dd className="mt-1 font-semibold text-slate-700">{item.lesson}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-8 bg-[#102A43] p-6 text-white lg:grid-cols-[0.8fr_1.2fr] lg:p-8">
              <div>
                <h3 className="text-3xl font-bold">The recommended division of responsibility</h3>
                <p className="mt-5 max-w-[58ch] leading-7 text-slate-300">
                  Each tool should solve the problem it is best at. This boundary preserves Tailwind’s speed without allowing utilities to become an unmanaged parallel design system.
                </p>
                <div className="mt-8 border border-white/20 bg-[#0B1E2F] p-5">
                  <p className="text-xs font-bold text-sky-300">AUTHORING CONTRACT</p>
                  <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-slate-200">{`<StoryCard
  variant="hero"
  href="/reviews/..."
  title="2025 Toyota Land Cruiser..."
/>`}</pre>
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    The product author selects meaning and behavior. The component resolves approved tokens, recipes, responsive rules, and accessible markup.
                  </p>
                </div>
              </div>
              <div className="grid gap-px bg-white/20 sm:grid-cols-2">
                {implementationResponsibilities.map((item) => (
                  <article key={item.owner} className="bg-[#102A43] p-5">
                    <p className="text-xs font-bold text-sky-300">{item.owner}</p>
                    <h4 className="mt-2 font-bold">{item.responsibility}</h4>
                    <p className="mt-4 font-mono text-xs leading-5 text-slate-300">{item.examples}</p>
                    <p className="mt-4 border-t border-white/15 pt-4 text-sm leading-6 text-slate-400">
                      {item.boundary}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <div className="max-w-3xl">
                <h3 className="text-3xl font-bold">What must be completed before production</h3>
                <p className="mt-4 leading-7 text-slate-600">
                  These are not reasons to abandon the prototype. They are the work required to turn a strong technical direction into a durable product contract.
                </p>
              </div>
              <ol className="mt-8 grid gap-px bg-slate-300 md:grid-cols-2 xl:grid-cols-4">
                {productionPriorities.map((item) => (
                  <li key={item.priority} className="bg-white p-6">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2D75B9] font-mono text-sm font-bold text-white">
                      {item.priority}
                    </span>
                    <h4 className="mt-5 font-bold">{item.title}</h4>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#102A43] text-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="max-w-4xl">
              <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                Why this model is better than the inherited production pattern
              </h2>
              <p className="mt-5 max-w-[72ch] leading-7 text-slate-300">
                The advantage is operational, not cosmetic. It reduces the number of independent decisions, narrows each change, and makes the path to production visible.
              </p>
            </div>
            <div className="mt-12 overflow-x-auto border border-white/20">
              <table className="min-w-[1050px] w-full border-collapse text-left text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-5 py-4 font-bold">Dimension</th>
                    <th className="px-5 py-4 font-bold">Inherited pattern</th>
                    <th className="px-5 py-4 font-bold">Proposed architecture</th>
                    <th className="px-5 py-4 font-bold">Business result</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.dimension} className="border-t border-white/15 align-top">
                      <th className="px-5 py-5 font-bold text-sky-300">{row.dimension}</th>
                      <td className="px-5 py-5 leading-6 text-slate-400">{row.inherited}</td>
                      <td className="px-5 py-5 leading-6 text-white">{row.proposed}</td>
                      <td className="px-5 py-5 leading-6 text-slate-300">{row.business}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 max-w-[80ch] text-sm leading-6 text-slate-400">
              Comparison boundary: these inherited-pattern findings are supported by the current repository structure, validator results, and the earlier Figma inventory. A production-repository audit is still required before assigning financial savings or claiming a specific defect reduction.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#F8FAFC]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                  How teams make changes
                </h2>
                <p className="mt-5 max-w-[62ch] leading-7 text-slate-600">
                  Routine value updates should be easy. Structural changes should require stronger evidence because they alter the contract used by many products.
                </p>
              </div>
              <div className="border-t-2 border-[#2D75B9]">
                {workflowRows.map((row) => (
                  <article key={row.change} className="border-b border-slate-200 py-7">
                    <h3 className="text-lg font-bold">{row.change}</h3>
                    <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="font-bold text-[#2D75B9]">Design</dt>
                        <dd className="mt-2 leading-6 text-slate-600">{row.design}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[#2D75B9]">Engineering</dt>
                        <dd className="mt-2 leading-6 text-slate-600">{row.engineering}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[#2D75B9]">Required proof</dt>
                        <dd className="mt-2 leading-6 text-slate-600">{row.proof}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="max-w-4xl">
              <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                A migration plan without a flag day
              </h2>
              <p className="mt-5 max-w-[72ch] leading-7 text-slate-600">
                Products can continue shipping while the token graph is simplified. Each phase produces evidence and a usable deliverable before the next cohort begins.
              </p>
            </div>
            <ol className="mt-12 grid gap-px bg-slate-300 lg:grid-cols-5">
              {migrationPhases.map((phase, index) => (
                <li key={phase.title} className="bg-[#F8FAFC] p-6">
                  <span className="font-mono text-sm font-bold text-[#2D75B9]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-lg font-bold">{phase.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{phase.outcome}</p>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                    {phase.work.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#E9F2FA]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                  Governance that keeps the graph healthy
                </h2>
                <p className="mt-5 max-w-[62ch] leading-7 text-slate-700">
                  Tokens are product APIs. They need ownership, compatibility rules, release notes, and retirement paths just like code.
                </p>
              </div>
              <div className="grid gap-px bg-slate-300 sm:grid-cols-2">
                {[
                  ["Foundations owner", "Owns core scales, token types, naming grammar, and platform transforms."],
                  ["Semantic council", "Approves new purpose-driven roles and prevents overlapping concepts."],
                  ["Component maintainers", "Own local state contracts, usage documentation, and migration coverage."],
                  ["Brand stewards", "Approve authentic publication differences and review visual equivalence."],
                  ["Platform engineering", "Owns packages, CI gates, release versions, and consumer compatibility."],
                  ["Product teams", "Consume approved contracts, report gaps, and remove local literals during migration."],
                ].map(([title, copy]) => (
                  <article key={title} className="bg-white p-6">
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <article className="border border-slate-300 bg-white p-7">
                <h3 className="text-xl font-bold">Pull-request gates</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                  <CheckItem>No broken or circular references</CheckItem>
                  <CheckItem>No accidental key deletion or rename</CheckItem>
                  <CheckItem>No generated-file drift</CheckItem>
                  <CheckItem>Contrast and required state coverage</CheckItem>
                  <CheckItem>Versioning decision for contract changes</CheckItem>
                  <CheckItem>Representative visual and component tests</CheckItem>
                </ul>
              </article>
              <article className="bg-[#102A43] p-7 text-white">
                <h3 className="text-xl font-bold">Release contract</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                  <CheckItem light>Every package points to the same source commit</CheckItem>
                  <CheckItem light>Generated formats publish as one version</CheckItem>
                  <CheckItem light>Deprecations include replacement and removal dates</CheckItem>
                  <CheckItem light>Brand exceptions have an owner and reason</CheckItem>
                  <CheckItem light>Rollback restores the token graph and generated outputs together</CheckItem>
                  <CheckItem light>Figma and Pencil sync after the release is approved</CheckItem>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="max-w-4xl">
              <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                Measure whether the architecture is working
              </h2>
              <p className="mt-5 max-w-[72ch] leading-7 text-slate-600">
                Do not promise a percentage improvement before baselining production. Track the operating system directly, then use the results to justify expansion.
              </p>
            </div>
            <div className="mt-12 overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y-2 border-[#102A43]">
                    <th className="px-4 py-4 font-bold">Outcome</th>
                    <th className="px-4 py-4 font-bold">Measure</th>
                    <th className="px-4 py-4 font-bold">Desired direction</th>
                  </tr>
                </thead>
                <tbody>
                  {measures.map(([outcome, measure, direction]) => (
                    <tr key={outcome} className="border-b border-slate-200">
                      <th className="px-4 py-5 font-bold text-[#2D75B9]">{outcome}</th>
                      <td className="px-4 py-5 leading-6 text-slate-600">{measure}</td>
                      <td className="px-4 py-5 font-semibold">{direction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#F8FAFC]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <h2 className="text-balance text-4xl font-bold tracking-[-0.025em]">
                  Questions stakeholders usually ask
                </h2>
              </div>
              <div className="border-t-2 border-[#102A43]">
                {[
                  [
                    "Does this replace Figma?",
                    "No. Figma remains the collaborative design and prototyping environment. The change is that production values are released from a reviewable Git source and synchronized back to design tools.",
                  ],
                  [
                    "Does every brand become visually identical?",
                    "No. The base layer standardizes shared behavior and accessibility. Brand extensions preserve meaningful differences in palette, typography, shape, and approved component decisions.",
                  ],
                  [
                    "Are we choosing Tailwind instead of design tokens?",
                    "No. Tailwind is the implementation mechanism for layout, responsive behavior, spacing, and simple states. Semantic variables, named recipes, and components remain the governed design-system API.",
                  ],
                  [
                    "Why not keep a full token copy for every brand?",
                    "Full copies make shared improvements expensive and hide whether a difference is intentional. Minimal extensions make the brand contract legible while preserving an escape hatch for real exceptions.",
                  ],
                  [
                    "Can designers change tokens without engineering?",
                    "Routine value changes can use an assisted branch and pull-request workflow. New roles, key deletion, naming changes, and structural changes require design-system engineering review because they affect consumer APIs.",
                  ],
                  [
                    "Is the current repository already finished?",
                    "No. It has a strong pipeline and a documented target model, but the current validator exposes duplicated component decisions, broad hard-coded brand literals, and insufficient semantic coverage. Those are explicit migration items.",
                  ],
                  [
                    "What should be approved first?",
                    "Approve the source-of-truth decision, the four-layer contract, two pilot brands, and the baseline metrics. Do not approve portfolio-wide migration until the pilot proves visual parity, accessibility, package compatibility, and operational improvement.",
                  ],
                ].map(([question, answer]) => (
                  <article key={question} className="grid gap-4 border-b border-slate-200 py-7 md:grid-cols-[0.8fr_1.2fr]">
                    <h3 className="font-bold">{question}</h3>
                    <p className="text-sm leading-6 text-slate-600">{answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#2D75B9] text-white">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-20 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
            <div>
              <h2 className="max-w-4xl text-balance text-5xl font-bold leading-none tracking-[-0.03em]">
                Approve the contract before scaling the migration.
              </h2>
              <p className="mt-6 max-w-[70ch] leading-7 text-blue-50">
                The next decision is not whether tokens are useful. It is whether Hearst will operate them as a governed product API with one release authority, minimal brand extensions, and measurable outcomes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/hearst-product-blueprint/" className="bg-white px-5 py-3 text-sm font-bold text-[#2D75B9]">
                Review the product blueprint
              </Link>
              <Link href="/why-hearst-plus/" className="border border-white/60 px-5 py-3 text-sm font-bold text-white">
                Explore Hearst+
              </Link>
            </div>
          </div>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
