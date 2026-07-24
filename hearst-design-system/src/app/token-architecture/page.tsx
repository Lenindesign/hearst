import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";

export const metadata: Metadata = {
  title: "Hearst+ Token Architecture | From Source to Production",
  description:
    "A practical guide to how Hearst+ design tokens move from versioned JSON through validation and Tailwind to every brand in production.",
};

const pipelineStages = [
  {
    number: "01",
    title: "Author the source",
    owner: "Design systems + brand teams",
    file: "tokens/",
    detail:
      "Token JSON is the source of truth. Core scales live in tokens/core, shared meaning lives in tokens/semantic, and publication differences live in tokens/brands/{slug}.json. Figma and Pencil are collaboration and handoff surfaces; they do not release production values.",
    output: "Reviewable token change",
  },
  {
    number: "02",
    title: "Validate the contract",
    owner: "Engineering + CI",
    file: "tokens:validate · tokens:check",
    detail:
      "References, required keys, brand coverage, accidental removals, and structural changes are checked before generated output is trusted. A failed check stops the change before it can alter a product surface.",
    output: "Safe, explainable input",
  },
  {
    number: "03",
    title: "Build the runtime outputs",
    owner: "Design-system build",
    file: "scripts/build-from-tokens.ts",
    detail:
      "The build reads the JSON files and generates the artifacts that Hearst+ imports. Engineers never edit generated files to fix a token; they change the source JSON and rebuild.",
    output: "brands.ts + tokens.css",
  },
  {
    number: "04",
    title: "Resolve a brand at runtime",
    owner: "Hearst+ ThemeProvider",
    file: "src/components/theme-provider.tsx",
    detail:
      "ThemeProvider selects a brand, sets data-brand, applies light or dark mode, maps semantic and component values to CSS custom properties, and loads the brand’s font stack. Components keep the same API while the values change.",
    output: "One themed runtime",
  },
  {
    number: "05",
    title: "Consume through Tailwind",
    owner: "Product engineering",
    file: "src/app/globals.css",
    detail:
      "Tailwind handles layout, responsive behavior, spacing, and simple states. Its @theme inline bridge maps utilities such as bg-primary, text-foreground, border-border, and font-brand to the runtime variables supplied by the token pipeline.",
    output: "Composable product UI",
  },
  {
    number: "06",
    title: "Release the product",
    owner: "Release engineering",
    file: "npm run build → Netlify",
    detail:
      "The Next.js build compiles the same application and generated token outputs that were verified locally. Pushing the approved production commit triggers the configured Netlify deployment, where the branded Hearst+ routes are smoke-tested.",
    output: "Versioned production change",
  },
];

const sourceRows = [
  {
    layer: "Core tokens",
    location: "tokens/core/*.json",
    purpose: "Reusable raw scales: color, spacing, typography, borders, elevation, and opacity.",
    example: "space-md · border-radius-2xs · font-size-md",
  },
  {
    layer: "Semantic tokens",
    location: "tokens/semantic/**/*.json",
    purpose: "Purpose-driven roles that components can understand without knowing a brand’s raw value.",
    example: "palette-content-default · palette-background-page · component-button-*",
  },
  {
    layer: "Brand extensions",
    location: "tokens/brands/{slug}.json",
    purpose: "The smallest set of publication-specific differences. Missing values inherit the shared foundation.",
    example: "cosmopolitan.json · womans-day.json · car-and-driver.json",
  },
  {
    layer: "Brand metadata",
    location: "tokens/brands/_meta.json",
    purpose: "Font family and weight overrides that cannot be expressed as a color or component value.",
    example: "fontHeadline · fontSecondary · fontHeadlineWeight",
  },
];

const outputRows = [
  ["src/lib/brands.ts", "Typed brand metadata, colors, semantic colors, and component tokens consumed by React."],
  ["src/lib/tokens.css", "Generated CSS custom properties for the shared foundation and every brand selector."],
  ["dist/css/", "Optional Style Dictionary delivery files for CSS consumers and legacy integrations."],
  ["dist/js/tokens.mjs", "Optional JavaScript token package generated from the same source graph."],
  ["dist/json/tokens.json", "Optional flat JSON package for tools that cannot consume CSS or TypeScript."],
];

const tailwindRows = [
  {
    owner: "Tokens",
    responsibility: "Decide what a value means and which brand owns the difference.",
    example: "palette-content-brand · font-headline",
    boundary: "Never make a raw hex value the component API.",
  },
  {
    owner: "CSS variables",
    responsibility: "Carry semantic and component values into the browser at runtime.",
    example: "--primary · --foreground · --font-headline",
    boundary: "Variables are generated or supplied by ThemeProvider; do not hand-edit generated CSS.",
  },
  {
    owner: "Tailwind",
    responsibility: "Compose layout, spacing, responsive breakpoints, and simple interaction states.",
    example: "grid · gap-4 · lg:grid-cols-3 · focus-visible:ring-2",
    boundary: "Repeated visual recipes should become named component variants, not longer class strings.",
  },
  {
    owner: "React components",
    responsibility: "Own semantics, behavior, accessibility, and supported variants.",
    example: '<StoryCard variant="hero" /> · <Button variant="primary" />',
    boundary: "Product authors choose intent; the component resolves the token recipe.",
  },
];

const brandFlow = [
  ["Select", "A route or brand switcher selects a theme slug such as cosmopolitan or womans-day."],
  ["Scope", "ThemeProvider writes data-brand and derives the active light or dark token values."],
  ["Bridge", "brandToCssVars maps generated brand data to semantic CSS variables and Tailwind aliases."],
  ["Render", "The same Hearst+ card, navigation, reader, or button renders with the active publication’s identity."],
];

const releaseChecks = [
  "Edit token JSON, never brands.ts or tokens.css directly.",
  "Run npm run build-tokens after source changes.",
  "Run npm run tokens:validate and npm run tokens:check.",
  "Run npx tsc --noEmit and the focused component or accessibility tests.",
  "Verify at least three brands, light and dark mode, keyboard focus, and responsive breakpoints.",
  "Review the generated diff, commit source and generated artifacts together, then release through the normal production branch.",
];

const currentState = [
  {
    title: "Already implemented",
    tone: "light",
    items: [
      "Token JSON is organized into core, semantic, and brand layers.",
      "The build generates typed brand data and CSS custom properties.",
      "ThemeProvider applies brand, font, semantic, component, and color-mode variables at runtime.",
      "Tailwind v4 consumes the semantic bridge through @theme inline.",
      "Hearst+ routes share components while preserving publication identity.",
    ],
  },
  {
    title: "Still requires production hardening",
    tone: "dark",
    items: [
      "Reduce duplicate component decisions and move repeated combinations into named recipes.",
      "Audit hard-coded values in Hearst+ consumers before treating portfolio validator warnings as product defects.",
      "Add CI enforcement for generated-file drift, token removals, contrast, and representative visual parity.",
      "Publish versioned packages and define ownership and deprecation windows for shared roles.",
      "Baseline release lead time, regressions, adoption, and rollback time before claiming business savings.",
    ],
  },
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
      <span aria-hidden="true" className={light ? "font-bold text-sky-300" : "font-bold text-[#2D75B9]"}>
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function SectionIntro({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <div className="max-w-4xl">
      {eyebrow ? <p className="text-sm font-bold text-[#2D75B9]">{eyebrow}</p> : null}
      <h2 className="mt-3 text-balance text-4xl font-bold tracking-[-0.025em]">{title}</h2>
      <p className="mt-5 max-w-[74ch] text-pretty leading-7 text-slate-600">{children}</p>
    </div>
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
              <p className="text-sm font-bold text-sky-300">Hearst+ implementation guide</p>
              <h1 className="mt-5 max-w-3xl text-balance text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                From one token source to every Hearst+ brand in production.
              </h1>
              <p className="mt-7 max-w-[68ch] text-pretty text-lg leading-8 text-slate-300">
                Hearst+ uses versioned token JSON to keep brand identity, shared components, and Tailwind implementation connected. This page explains the real path from a token change to the branded reader a user sees.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="#pipeline" className="bg-white px-5 py-3 text-sm font-bold text-[#2D75B9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  Follow the pipeline
                </Link>
                <Link href="#tailwind" className="border border-white/50 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  See the Tailwind boundary
                </Link>
              </div>
            </div>

            <div className="border border-white/20 bg-[#0B1E2F] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-5 border-b border-white/15 pb-5">
                <div>
                  <p className="text-sm font-bold">The Hearst+ contract</p>
                  <p className="mt-1 text-xs text-slate-400">One decision, generated once, consumed everywhere</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">Traceable</span>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-2 font-mono text-xs leading-6 text-slate-200">
                {[
                  "tokens/*.json",
                  "validate",
                  "build-tokens",
                  "tokens.css + brands.ts",
                  "ThemeProvider",
                  "Tailwind",
                  "Netlify",
                ].map((step, index) => (
                  <span key={step} className="contents">
                    <span className="border border-white/20 bg-white/5 px-3 py-2">{step}</span>
                    {index < 6 ? <span aria-hidden="true" className="text-sky-300">→</span> : null}
                  </span>
                ))}
              </div>
              <p className="mt-7 border-t border-white/15 pt-5 text-sm leading-6 text-slate-300">
                <strong className="text-white">Release authority:</strong> the approved token JSON commit. Figma and Pencil stay valuable for design work and handoff, while the product build consumes generated outputs.
              </p>
            </div>
          </div>
        </section>

        <section id="pipeline" className="scroll-mt-20 border-b border-slate-200 bg-[#E9F2FA]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <SectionIntro eyebrow="The actual Hearst+ path" title="Six stages keep design intent connected to running code.">
              The pipeline is deliberately boring: each stage has an owner, a file or command, and a checkable output. That makes a brand change reviewable instead of relying on a designer, a generated stylesheet, and a product override to stay in sync by memory.
            </SectionIntro>
            <ol className="mt-12 border-t-2 border-[#2D75B9]">
              {pipelineStages.map((stage) => (
                <li key={stage.number} className="grid gap-4 border-b border-slate-200 py-7 md:grid-cols-[3rem_0.8fr_0.8fr_1.7fr_0.8fr] md:items-start">
                  <span className="font-mono text-sm font-bold text-[#2D75B9]">{stage.number}</span>
                  <h3 className="font-bold">{stage.title}</h3>
                  <p className="text-sm font-semibold text-slate-500">{stage.owner}</p>
                  <div>
                    <CodeLabel>{stage.file}</CodeLabel>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{stage.detail}</p>
                  </div>
                  <p className="text-sm font-bold text-[#102A43]">{stage.output}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <SectionIntro eyebrow="1. Source" title="The source of truth is the token graph in Git.">
              A token is not a color swatch copied into a component. It is a named decision with a type, value, ownership boundary, and inheritance relationship. Hearst+ keeps those decisions in versioned JSON so changes are diffable, reviewable, reversible, and available to every consuming tool.
            </SectionIntro>
            <div className="mt-12 overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y-2 border-[#102A43]">
                    <th className="px-4 py-4 font-bold">Layer</th>
                    <th className="px-4 py-4 font-bold">Canonical location</th>
                    <th className="px-4 py-4 font-bold">What it owns</th>
                    <th className="px-4 py-4 font-bold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceRows.map((row) => (
                    <tr key={row.layer} className="border-b border-slate-200 align-top">
                      <th className="px-4 py-5 text-base font-bold text-[#2D75B9]">{row.layer}</th>
                      <td className="px-4 py-5"><CodeLabel>{row.location}</CodeLabel></td>
                      <td className="px-4 py-5 leading-6 text-slate-600">{row.purpose}</td>
                      <td className="px-4 py-5 font-mono text-xs leading-5 text-slate-600">{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 grid gap-px bg-slate-300 lg:grid-cols-2">
              <div className="bg-[#102A43] p-7 text-white">
                <p className="text-xs font-bold text-sky-300">SOURCE EXAMPLE</p>
                <pre className="mt-5 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-7 text-slate-200">{`// tokens/brands/cosmopolitan.json
"palette-brand-1": {
  "type": "color",
  "value": "#E40046"
}`}</pre>
              </div>
              <div className="bg-[#F8FAFC] p-7">
                <h3 className="text-xl font-bold">What does not become the source</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                  <CheckItem>Figma inspection values pasted into JSX</CheckItem>
                  <CheckItem>Generated CSS edited by hand</CheckItem>
                  <CheckItem>One-off Tailwind colors that bypass semantic roles</CheckItem>
                  <CheckItem>Brand overrides hidden inside shared components</CheckItem>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#F8FAFC]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <SectionIntro eyebrow="2–3. Validate and generate" title="The build turns JSON into the files Hearst+ actually imports.">
              The primary Hearst+ workflow is the repository build script, not a manual copy from Figma and not a runtime token fetch. Validation protects the graph; the build creates stable outputs that can be reviewed alongside the source change.
            </SectionIntro>
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="bg-[#102A43] p-7 text-white">
                <p className="text-xs font-bold text-sky-300">COMMANDS</p>
                <pre className="mt-5 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-7 text-slate-200">{`npm run tokens:validate
npm run tokens:check
npm run build-tokens
npx tsc --noEmit
npm run build`}</pre>
                <p className="mt-6 text-sm leading-6 text-slate-300">
                  Style Dictionary remains available for optional delivery files and legacy integrations. It is not the primary Hearst+ source-to-runtime path.
                </p>
              </div>
              <div className="border border-slate-300 bg-white p-7">
                <h3 className="text-xl font-bold">Generated outputs</h3>
                <ul className="mt-5 space-y-4 text-sm leading-6">
                  {outputRows.map(([file, purpose]) => (
                    <li key={file} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                      <CodeLabel>{file}</CodeLabel>
                      <p className="mt-2 text-slate-600">{purpose}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="tailwind" className="scroll-mt-20 border-b border-slate-200 bg-[#E9F2FA]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <SectionIntro eyebrow="4–5. Runtime and Tailwind" title="Tailwind is the delivery mechanism, not the design system.">
              Hearst+ uses Tailwind v4 to compose the interface, while semantic CSS variables carry the design-system decisions. This split gives engineers fast responsive authoring without turning utility classes into an unmanaged second source of truth.
            </SectionIntro>
            <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-[#102A43] p-7 text-white">
                <p className="text-xs font-bold text-sky-300">THE BRIDGE IN globals.css</p>
                <pre className="mt-5 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-7 text-slate-200">{`@theme inline {
  --color-primary: var(--primary);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
}

// component usage
<button className="bg-primary text-primary-foreground">
  Read story
</button>`}</pre>
                <p className="mt-6 text-sm leading-6 text-slate-300">
                  The utility class is stable. The value behind it can change with the active Hearst+ brand or color mode.
                </p>
              </div>
              <div className="overflow-x-auto border border-slate-300 bg-white">
                <table className="min-w-[720px] w-full border-collapse text-left text-sm">
                  <thead><tr className="border-b-2 border-[#102A43]"><th className="px-4 py-4 font-bold">Owner</th><th className="px-4 py-4 font-bold">Responsibility</th><th className="px-4 py-4 font-bold">Boundary</th></tr></thead>
                  <tbody>
                    {tailwindRows.map((row) => (
                      <tr key={row.owner} className="border-b border-slate-200 align-top last:border-0">
                        <th className="px-4 py-5 text-[#2D75B9]">{row.owner}<span className="mt-2 block font-mono text-xs font-normal text-slate-500">{row.example}</span></th>
                        <td className="px-4 py-5 leading-6 text-slate-600">{row.responsibility}</td>
                        <td className="px-4 py-5 leading-6 text-slate-600">{row.boundary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-10 border border-slate-300 bg-white p-7">
              <h3 className="text-xl font-bold">The practical rule for engineers</h3>
              <p className="mt-4 max-w-[76ch] leading-7 text-slate-600">
                Use a Tailwind utility when it describes structure or a one-off layout relationship. Use a semantic token when the value carries product meaning. Use a named component variant when the same combination appears more than once or includes behavior, accessibility, and multiple states.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <SectionIntro eyebrow="6. Brand runtime" title="One component contract, many publication expressions.">
              Brand switching does not fork the Hearst+ component tree. It changes the variables that the shared components read. That is the mechanism that lets Cosmopolitan, Woman’s Day, Car and Driver, and the other supported publications retain identity without maintaining separate button, card, navigation, or reader implementations.
            </SectionIntro>
            <div className="mt-12 grid gap-px bg-slate-300 sm:grid-cols-4">
              {brandFlow.map(([title, copy], index) => (
                <article key={title} className="bg-[#F8FAFC] p-6">
                  <span className="font-mono text-sm font-bold text-[#2D75B9]">0{index + 1}</span>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="border border-slate-300 p-7">
                <h3 className="text-xl font-bold">Shared API</h3>
                <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded bg-slate-50 p-5 font-mono text-sm leading-7 text-slate-700">{`<StoryCard
  variant="hero"
  title={story.title}
  href={story.href}
/>`}</pre>
                <p className="mt-5 text-sm leading-6 text-slate-600">The author chooses content and intent. The component owns markup, behavior, accessibility, responsive rules, and token consumption.</p>
              </div>
              <div className="border border-slate-300 p-7">
                <h3 className="text-xl font-bold">Brand-specific result</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="border-l-4 border-[#E40046] bg-slate-50 p-4"><p className="font-bold">Cosmopolitan</p><p className="mt-2 text-sm text-slate-600">Brand palette, headline font, and editorial tone.</p></div>
                  <div className="border-l-4 border-[#7A2E57] bg-slate-50 p-4"><p className="font-bold">Woman’s Day</p><p className="mt-2 text-sm text-slate-600">Its own color and typography extension over the same foundation.</p></div>
                  <div className="border-l-4 border-[#1B5F8A] bg-slate-50 p-4"><p className="font-bold">Car and Driver</p><p className="mt-2 text-sm text-slate-600">Distinct auto identity with shared Hearst+ interaction contracts.</p></div>
                  <div className="border-l-4 border-[#000000] bg-slate-50 p-4"><p className="font-bold">Fashion &amp; Luxury</p><p className="mt-2 text-sm text-slate-600">A scoped dark presentation without changing global component semantics.</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#102A43] text-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <SectionIntro eyebrow="Production release" title="A token change is not complete until the product is verified.">
              The value of a single source is the evidence it creates. A release should show what changed, which generated outputs moved, which brands were checked, and which production commit is serving the result.
            </SectionIntro>
            <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="border border-white/20 bg-[#0B1E2F] p-7">
                <p className="text-xs font-bold text-sky-300">RELEASE CHECKLIST</p>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                  {releaseChecks.map((item) => <CheckItem key={item} light>{item}</CheckItem>)}
                </ul>
              </div>
              <div className="grid gap-px bg-white/20 sm:grid-cols-2">
                <article className="bg-[#102A43] p-7"><h3 className="text-xl font-bold">What business stakeholders can trust</h3><p className="mt-4 text-sm leading-6 text-slate-300">A brand decision has a visible owner, a reviewable diff, a reproducible build, and a production release reference. Shared improvements can be measured instead of promised.</p></article>
                <article className="bg-[#102A43] p-7"><h3 className="text-xl font-bold">What engineering can debug</h3><p className="mt-4 text-sm leading-6 text-slate-300">A browser value can be traced from a CSS variable to ThemeProvider, generated brand data, the source token, and the commit that released it.</p></article>
                <article className="bg-[#102A43] p-7"><h3 className="text-xl font-bold">What design can review</h3><p className="mt-4 text-sm leading-6 text-slate-300">Figma and Pencil stay connected to approved values without becoming an opaque production handoff. Designers can see the same vocabulary used by the product.</p></article>
                <article className="bg-[#102A43] p-7"><h3 className="text-xl font-bold">What the system still needs</h3><p className="mt-4 text-sm leading-6 text-slate-300">More CI gates, named recipes, consumer-level audits, package versioning, and measured adoption are required before calling the architecture complete.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#E9F2FA]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-24">
            <SectionIntro eyebrow="Where Hearst+ stands today" title="A working foundation, with a clear hardening backlog.">
              This page describes the implemented prototype architecture and separates it from the work still needed for a production design-system platform. That distinction keeps the proposal useful to both the business and the engineering team.
            </SectionIntro>
            <div className="mt-12 grid gap-px bg-slate-300 lg:grid-cols-2">
              {currentState.map((group) => (
                <article key={group.title} className={group.tone === "dark" ? "bg-[#102A43] p-7 text-white" : "bg-white p-7"}>
                  <h3 className="text-2xl font-bold">{group.title}</h3>
                  <ul className={group.tone === "dark" ? "mt-6 space-y-4 text-sm leading-6 text-slate-300" : "mt-6 space-y-4 text-sm leading-6 text-slate-600"}>
                    {group.items.map((item) => <CheckItem key={item} light={group.tone === "dark"}>{item}</CheckItem>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#2D75B9] text-white">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-20 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
            <div>
              <h2 className="max-w-4xl text-balance text-5xl font-bold leading-none tracking-[-0.03em]">Make the token graph the contract Hearst+ can scale.</h2>
              <p className="mt-6 max-w-[70ch] leading-7 text-blue-50">Approve the source-of-truth boundary, keep Tailwind in its implementation role, and invest next in validation, recipes, and release evidence. That is how one Hearst+ improvement reaches every brand safely.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/hearst-product-blueprint/" className="bg-white px-5 py-3 text-sm font-bold text-[#2D75B9]">Review the product blueprint</Link>
              <Link href="/why-hearst-plus/" className="border border-white/60 px-5 py-3 text-sm font-bold text-white">Explore Hearst+</Link>
            </div>
          </div>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
