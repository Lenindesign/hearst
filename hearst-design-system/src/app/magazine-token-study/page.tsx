import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";
import { InterpretationHarnessDemo } from "@/components/magazine-token-study/interpretation-harness-demo";

export const metadata: Metadata = {
  title: "Magazine Token Study | Hearst+",
  description:
    "An evidence-based comparison of token documentation for Hearst magazine brands and the Hearst+ design-system prototype.",
};

const storybookSources = [
  {
    label: "Token Structure",
    href: "https://hearst-design-system.kubefeature.hearstapps.net/?path=/docs/design-tokens-token-structure--docs",
    note: "The two Figma Variables layouts are proposals. They describe possible organization, not the current production source of truth.",
  },
  {
    label: "Token Scripts",
    href: "https://hearst-design-system.kubefeature.hearstapps.net/?path=/docs/design-tokens-token-scripts--docs",
    note: "Validation, CSS generation, CI checks, and the one-way Git-to-Figma push workflow.",
  },
  {
    label: "Tokens for Engineers",
    href: "https://hearst-design-system.kubefeature.hearstapps.net/?path=/docs/design-tokens-tokens-for-engineers--docs",
    note: "JSON source files, generated package CSS, ConfigDS runtime values, and the Storybook theme provider.",
  },
  {
    label: "Role mapping · Type tokens",
    href: "https://hearst-design-system.kubefeature.hearstapps.net/?path=/story/design-tokens-role-mapping--type-tokens&globals=theme:biography",
    note: "Component typography keys mapped to type roles, with theme selection and responsive examples.",
  },
  {
    label: "Role mapping · Color tokens",
    href: "https://hearst-design-system.kubefeature.hearstapps.net/?path=/story/design-tokens-role-mapping--color-tokens&globals=theme:biography",
    note: "Component color keys mapped through semantic roles to resolved palette values.",
  },
  {
    label: "Design Token Catalog · All tokens",
    href: "https://hearst-design-system.kubefeature.hearstapps.net/?path=/docs/design-tokens-design-token-catalog-all-tokens--docs&globals=theme:biography",
    note: "Token catalog, coverage labels, and current work-in-progress status.",
  },
  {
    label: "Design Token Catalog · Semantic colors",
    href: "https://hearst-design-system.kubefeature.hearstapps.net/?path=/story/design-tokens-design-token-catalog--semantic-color-tokens&globals=theme:biography",
    note: "Semantic color token groups with the Biography theme selected.",
  },
];

const magazineSources = [
  {
    label: "HDS technical architecture",
    href: "https://github.com/Media-Platforms/hearst-design-system/blob/main/memory-bank/technical-architecture.md",
    note: "Describes the three independent outputs from Git token files and the production/runtime boundaries.",
  },
  {
    label: "HDS token merge-stage contract",
    href: "https://github.com/Media-Platforms/hearst-design-system/blob/main/memory-bank/token-merge-stage.md",
    note: "Documents ConfigDS draft-set promotion, release rebuilds, and what happens when a merge publishes no staged configs.",
  },
  {
    label: "Figma Connector deployment workflow",
    href: "https://github.com/Media-Platforms/figma-connector/blob/main/docs/token-deployment-workflow.md",
    note: "Describes the webhook-owned PR draft-set and merge process.",
  },
  {
    label: "FRE styles endpoint",
    href: "https://github.com/Media-Platforms/fre/blob/main/apps/fre/scopes/hdm/pages/api/styles/index.js",
    note: "Serves HDS utility CSS with runtime ConfigDS brand/site variables and White Label token fallback.",
  },
  {
    label: "FRE application architecture",
    href: "https://github.com/Media-Platforms/fre/blob/main/apps/fre/README.md#architecture",
    note: "Explains engine routing, renderers, and the FRE request path.",
  },
];

const magazineJourney = {
  title: "Magazines",
  summary: "Git is the canonical token source. The documented build creates shared White Label CSS defaults, while brand/site values reach FRE through ConfigDS.",
  steps: [
    { title: "Canonical token JSON", detail: "HDS · packages/design-tokens/tokens/ — the versioned token source." },
    { title: "Generate HDS CSS + White Label defaults", detail: "generate-index-css.mjs writes index.css with @theme static White Label values and shared utilities. White Label is the package fallback; it is not a publication’s ConfigDS theme." },
    { title: "Sync the design variables to Figma", detail: "push-to-figma.mjs sends Git token values to Figma Variables. This documented handoff runs Git → Figma." },
    { title: "Publish brand/site config to ConfigDS", detail: "Figma Connector publishes the selected brand and site values as runtime CSS configuration. ConfigDS is delivered separately from the HDS package stylesheet." },
    { title: "FRE’s HDM styles handler joins the inputs", detail: "apps/fre/scopes/hdm/pages/api/styles/index.js serves HDS utilities with runtime ConfigDS values and White Label fallback." },
    { title: "Render the publication site", detail: "FRE routes the request to its site renderer, which applies the returned styles and selected publication values." },
  ],
  implementation: [
    { name: "HDS React components", use: "Shared component library consuming the HDS styling contract." },
    { name: "Tailwind", use: "HDS utility styles are built into the shared stylesheet." },
    { name: "Emotion", use: "Used in FRE theme and component styling; separate from token generation." },
    { name: "Base UI", use: "Not established in the reviewed magazine evidence." },
    { name: "shadcn", use: "Not established in the reviewed magazine evidence." },
  ],
};

const hearstPlusJourney = {
  title: "Hearst+",
  summary: "Hearst+ validates its Git JSON and generates app-local theme files before the Next.js app is deployed.",
  steps: [
    { title: "Canonical token JSON", detail: "Hearst+ · tokens/core, tokens/semantic, tokens/brands — checked into this application repository." },
    { title: "Resolve", detail: "npm run build-tokens reads core, semantic, and brand JSON, resolves aliases, and fixes known source typos. Validation is a separate step: npm run tokens:validate (scripts/validate-tokens.ts) and the token-validation unit test; neither runs inside build-tokens." },
    { title: "Generate app-local artifacts", detail: "scripts/build-from-tokens.ts writes src/lib/brands.ts and src/lib/tokens.css for the app to consume." },
    { title: "Apply the selected brand", detail: "ThemeProvider sets data-brand and writes the theme's runtime variables inline (brandToCssVars, 282 per brand, after contrast guards); the nearest scope wins over tokens.css. Seven section themes (Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, Local News, A&E, Hearst+) are authored in theme-options.ts, outside tokens/." },
    { title: "Build and deploy Hearst+", detail: "Next.js builds the cross-brand reader app and the configured Netlify deployment serves it." },
  ],
  implementation: [
    { name: "Tailwind", use: "Styles application layouts and components." },
    { name: "Base UI", use: "Provides runtime accessible UI primitives." },
    { name: "shadcn", use: "CLI supports component scaffolding/adaptation; it is not a runtime library." },
    { name: "Emotion", use: "Not declared as a dependency in this repo." },
  ],
};

function JourneyLane({
  title,
  summary,
  steps,
  implementation,
}: {
  title: string;
  summary: string;
  steps: { title: string; detail: string }[];
  implementation: { name: string; use: string }[];
}) {
  return (
    <section className="min-w-0 border border-border bg-background p-5 md:p-6" aria-label={`${title} token build`}>
      <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{title}</p>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{summary}</p>
      <ol className="mt-5 space-y-0">
        {steps.map((step, index) => (
          <li key={step.title} className="relative grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 pb-3 last:pb-0">
            {index < steps.length - 1 ? <span aria-hidden="true" className="absolute bottom-0 left-[.9rem] top-8 w-px bg-border" /> : null}
            <span className="relative z-10 flex size-8 items-center justify-center rounded-full border border-primary/30 bg-background font-mono text-[10px] font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0 border border-border bg-card p-3">
              <h4 className="text-sm font-semibold leading-5">{step.title}</h4>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 border-t border-border pt-3">
        <h4 className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">UI implementation layer</h4>
        <dl className="mt-2 grid gap-x-3 gap-y-2 sm:grid-cols-2">
          {implementation.map((item) => (
            <div key={item.name} className="min-w-0 text-xs leading-5">
              <dt className="inline font-semibold text-foreground">{item.name}: </dt>
              <dd className="inline text-muted-foreground">{item.use}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function TokenBuildComparison() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <JourneyLane {...magazineJourney} />
        <JourneyLane {...hearstPlusJourney} />
      </div>

      <section className="border-t-2 border-[var(--hp-utility-bar)] bg-[var(--hp-utility-bar)] p-5 text-primary-foreground md:p-6" aria-label="Production destinations">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary-foreground/75">Production · shared destination layer</p>
        <h3 className="mt-2 text-xl font-semibold">Two independently built systems reach Hearst readers.</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <p className="border border-primary-foreground/20 p-3 text-sm leading-6"><strong>Magazines:</strong> publication websites rendered through FRE</p>
          <p className="border border-primary-foreground/20 p-3 text-sm leading-6"><strong>Hearst+:</strong> the cross-brand reader app</p>
        </div>
        <p className="mt-4 text-xs leading-5 text-primary-foreground/75">The systems reach production independently. This is a shared destination row, not a merge of their token sources or build pipelines.</p>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <p className="border-l-2 border-primary bg-muted/40 p-4 text-xs leading-5 text-muted-foreground"><strong>Figma + HDM in Magazines:</strong> Git token JSON is pushed to Figma Variables for design use. The Figma Connector publishes brand/site configuration into ConfigDS. FRE’s HDM styles handler serves ConfigDS values alongside HDS utilities, using White Label as the package fallback. HDM is the delivery scope in this path, not a token source.</p>
        <p className="border-l-2 border-primary bg-muted/40 p-4 text-xs leading-5 text-muted-foreground"><strong>Figma in Hearst+:</strong> A Token Studio export can be imported through Figma Connector, but the documented app build consumes checked-in JSON and generated local files. Figma is not in the deploy-time token build path.</p>
      </div>
    </div>
  );
}

const comparisonRows = [
  {
    topic: "What the documentation shows",
    magazine: "The Storybook pages show actual mapping views: component token paths resolve through role aliases to theme palette values. Theme switching demonstrates that a shared role can resolve differently across publications.",
    hearst: "This checkout describes canonical JSON in core, semantic, and brand layers, then generates TypeScript and CSS variables for runtime use.",
    reading: "Both describe layered reuse with publication-level variation. The token names and authoring surfaces differ, and no shared identifier or automated synchronization was verified.",
  },
  {
    topic: "Brand and locale",
    magazine: "The Storybook theme selector includes publication themes and locale editions. The reviewed selector showed 86 theme choices; that is a theme-menu count, not a count of brands or live websites.",
    hearst: "The documented local schema has publication JSON files and shared metadata. Its current source layout does not show a separate locale-token layer.",
    reading: "The Storybook documentation makes localized theme variants visible. The local prototype schema is brand-oriented; locale inheritance and fallback are not established here.",
  },
  {
    topic: "Component mappings",
    magazine: "The reviewed Biography theme showed 1,350 color mappings across 39 components and 157 type mappings across 20 components. These are mapping-view counts, not the number of unique tokens in every brand.",
    hearst: "Semantic and component token JSON provides app-facing values; React components consume those through generated variables and shared variants.",
    reading: "The Storybook role maps are especially useful for understanding how components consume design roles. The local pipeline emphasizes the editable source and runtime bridge.",
  },
  {
    topic: "Catalog coverage",
    magazine: "The All Tokens page displayed 4,685 White Label tokens and explicitly said brand-theme values are currently viewed in individual catalog sections through the Theme Switcher. The page is marked work in progress.",
    hearst: "This checkout has 624 core tokens in 7 files, 13 semantic JSON files, and 29 theme files: 27 publications plus the White Label and FRE base themes. These counts use different grains and should not be compared as a single total.",
    reading: "The catalog is broad, but the all-brand rollup is not yet represented on that page. A theme-by-theme view remains necessary for brand-value inspection.",
  },
  {
    topic: "Naming",
    magazine: "Mapping paths use compact slash-delimited names such as comp/btn/primary/solid/color/bg and color/palette/brand/1. The catalog also uses shortened terms such as nwsltr.",
    hearst: "Canonical local JSON uses full semantic kebab-case keys such as palette-background-page and component-button-background-primary-solid-default.",
    reading: "The supplied Figma diagram proposes abbreviations such as button → btn and background → bg. Those examples resemble Storybook paths, but a formal crosswalk to local canonical keys has not been demonstrated.",
  },
  {
    topic: "Design-tool relationship",
    magazine: "The supplied architecture graphic presents two Figma distribution options: one shared Variables file with brand overrides, or shared foundations plus separate brand files. It is a design proposal, not proof of the current production setup.",
    hearst: "The local specification identifies Git token JSON as canonical and Figma/Pencil as downstream design consumers. Its build script generates application artifacts.",
    reading: "Keep the diagram labeled as a proposed Figma organization. Confirm the production Figma source, publishing path, and ownership with the HDS team before adopting either option.",
  },
];

const repoFacts = [
  ["Canonical sources", "tokens/core/, tokens/semantic/, tokens/brands/ (section themes: src/lib/theme-options.ts)"],
  ["Generator", "scripts/build-from-tokens.ts"],
  ["Runtime outputs", "src/lib/brands.ts and src/lib/tokens.css"],
  ["Theme application", "ThemeProvider sets data-brand and inline runtime variables from brandToCssVars; the nearest scope wins"],
];

const recommendations = [
  {
    title: "Publish a crosswalk, not a second naming scheme",
    body: "Give each canonical token a stable identifier and show its Storybook display path, Figma variable path, type, role, and resolved theme value. This will make differences inspectable without treating display labels as a second source of truth.",
  },
  {
    title: "Document locale inheritance explicitly",
    body: "Show which locale themes inherit the publication base, which values they may override, and what fallback applies when a locale has no override. The Storybook selector exposes locale variants, while the local schema reviewed here does not define that layer.",
  },
  {
    title: "Close the catalog coverage gap",
    body: "Keep the White Label all-token view, then add a documented brand comparison or export so reviewers can see value coverage across themes without opening every theme manually. Clearly mark generated, inherited, and overridden values.",
  },
  {
    title: "Treat the Figma diagram as a decision to validate",
    body: "Before choosing shared-file overrides or separate brand files, verify how production variables are organized today, how permissions and releases work, and whether locale editions need independent ownership. Record the decision and its sync path in the canonical HDS documentation.",
  },
];

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h2 className="mt-5 font-[var(--hp-font-headline)] text-4xl font-bold leading-[1.05] tracking-[-.02em] text-balance text-foreground md:text-[54px]">{title}</h2>
      {children ? <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">{children}</div> : null}
    </div>
  );
}

export default function MagazineTokenStudyPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
    <div className="hearst-plus-theme hearst-plus-strategy-document min-h-screen overflow-x-clip bg-background text-foreground">
      <ProductHeader current="magazine-token-study" appearance="navy" />
      <main>
        <section className="relative isolate overflow-hidden bg-[var(--hp-utility-bar)] text-primary-foreground">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full opacity-[0.035] md:w-[72%] md:opacity-[0.065]"
            style={{
              backgroundImage: "url('/images/hearst-plus-editorial-watermark.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12% center",
              backgroundSize: "min(74vw, 1180px) auto",
              maskImage: "linear-gradient(to left, black 0%, black 18%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 0%, black 18%, transparent 100%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-[1320px] px-5 py-20 md:px-10 md:py-32">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-foreground/75">Hearst+ · Design systems study</p>
            <h1 className="mt-8 max-w-4xl font-[var(--hp-font-headline)] text-balance text-5xl font-bold leading-[1.02] tracking-[-.025em] md:text-6xl lg:text-[78px]">
              How magazine brands use design tokens.
            </h1>
            <p className="mt-8 max-w-3xl text-base leading-7 text-primary-foreground/80 md:text-lg">
              A comparison of current Hearst Design System documentation, the Hearst+ prototype token pipeline, and the supplied Figma Variables architecture proposal.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/70">
              <span>Reviewed October 31, 2026 · Hearst+ facts corrected November 9, 2026</span>
              <span>Storybook theme reviewed: Biography</span>
              <span>Sources: internal docs, local repo, supplied diagram</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Executive read" title="The systems share a layered idea, but their source contracts are not yet shown to be the same.">
              <p>The individual-brand Storybook documentation shows component color and type tokens mapping to role aliases, then resolving through a selected publication theme. That is strong evidence of a shared component contract with brand-specific values.</p>
              <p>The local Hearst+ repo documents a separate, explicit Git-based source: core, semantic, and brand JSON files generate runtime TypeScript and CSS. The supplied Figma diagram describes possible Variables-file organization. Neither source proves the Storybook catalog is generated from this repo, or that its abbreviated paths map one-to-one to the repo’s canonical keys.</p>
            </SectionHeading>
            <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
              <article className="bg-background p-5">
                <p className="font-mono text-3xl font-semibold">4,685</p>
                <h3 className="mt-2 text-sm font-semibold">White Label catalog entries</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">The current All Tokens documentation’s displayed total; it says brand-theme values are reviewed in individual catalog sections.</p>
              </article>
              <article className="bg-background p-5">
                <p className="font-mono text-3xl font-semibold">1,350</p>
                <h3 className="mt-2 text-sm font-semibold">Color role mappings</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Across 39 components in the reviewed Storybook mapping view.</p>
              </article>
              <article className="bg-background p-5">
                <p className="font-mono text-3xl font-semibold">157</p>
                <h3 className="mt-2 text-sm font-semibold">Type role mappings</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Across 20 components in the reviewed Storybook mapping view.</p>
              </article>
            </div>
          </div>
          <p className="mt-6 max-w-4xl text-xs leading-5 text-muted-foreground">Storybook counts are observations from the selected Biography theme and documentation views at review time. Mapping counts are not unique-token counts; the All Tokens total is explicitly White Label. The local repo’s 624 core-token, 13 semantic-file, and 29 theme-file counts use different categories and grains.</p>
        </section>

        <section aria-labelledby="changed-since-review" className="mx-auto max-w-[1200px] px-5 pb-16 md:px-10">
          <div className="border-l-2 border-primary bg-muted/40 p-5 md:p-6">
            <p className="type-k1 text-primary">Changed since review</p>
            <h2 id="changed-since-review" className="headline type-t3 mt-2">Hearst+ added to its token contract in November.</h2>
            <ul className="type-b2 mt-3 grid gap-2 text-muted-foreground md:grid-cols-2">
              <li><strong className="text-foreground">Runtime guards.</strong> Button labels are kept at 4.5:1 or better, ad headlines use the CTA color only at 3:1 or better, missing ghost tokens fall back to transparent, and dark mode lifts the primary color.</li>
              <li><strong className="text-foreground">CTA typography tokens.</strong> component-button-font-family, -font-weight, -text-transform, and -letter-spacing carry each publication&rsquo;s live CTA type into the shared Button.</li>
              <li><strong className="text-foreground">Theme scope for overlays.</strong> Dialogs portaled to &lt;body&gt; copy the nearest theme scope, so they keep the brand.</li>
              <li><strong className="text-foreground">Type and layout standards.</strong> Line height, tracking, and spacing roles (UI-TYPE-001) and the rail layout contract (UI-LAYOUT-001) are CSS utilities and custom properties, not yet token JSON.</li>
            </ul>
            <p className="type-c1 mt-3 text-muted-foreground">The magazine-side Storybook and repository observations above are unchanged from October 31. Current Hearst+ detail: <Link href="/specs/#tokens" className="font-semibold text-foreground underline underline-offset-2">Tokens and brand guides</Link>.</p>
          </div>
        </section>

        <section id="architecture" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <SectionHeading eyebrow="From Git to the reader" title="Two Git-to-production paths, shown side by side.">
              <p>Each path starts with JSON in Git and ends in its own production surface. The UI libraries and styling tools sit alongside the token flow as implementation details; they do not create or merge the token sources.</p>
            </SectionHeading>
            <div className="mt-10">
              <TokenBuildComparison />
            </div>
            <div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-2">
              <div className="bg-background p-5 md:p-6">
                <h3 className="font-semibold">What carries across both</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Versioned JSON and brand-specific values feed shared components through runtime theme selection. Components should consume intent and roles, rather than carry publication colors directly.</p>
              </div>
              <div className="bg-background p-5 md:p-6">
                <h3 className="font-semibold">What remains distinct</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Magazine brands use the published HDS CSS package plus ConfigDS values, while Hearst+ generates local TypeScript and CSS and selects a brand through ThemeProvider. The documentation does not establish a shared key-for-key token graph.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="recommended-journey" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <SectionHeading eyebrow="Recommendation · proposed future state" title="Use production HTML and browser rendering as the design contract.">
              <p>This is a recommendation, not a description of the current magazine implementation. It deliberately avoids creating a separate design-token registry: production HTML, components, and CSS remain the implementation contract. If Figma frames and font rendering do not represent browser behavior accurately, don’t make Figma tokens or pixel measurements a required production input. Anchor interpretation to the live HTML, production CSS, loaded fonts, and rendered pages instead.</p>
            </SectionHeading>

            <InterpretationHarnessDemo />

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)]">
              <section aria-label="Recommended browser-native interpretation journey">
                <h3 className="text-xs font-bold uppercase tracking-[.14em] text-primary">Interpretation-to-production path · sequential</h3>
                <ol className="mt-5 space-y-0">
                  {[
                    ["Capture a real publication reference", "Choose representative live pages and record their semantic DOM, computed browser styles, loaded fonts, assets, and screenshots at the widths they actually support."],
                    ["Interpret structure before appearance", "Map content to semantic elements and roles such as h1, p, img, figure, navigation, and article. Preserve accessible hierarchy and identify which existing publication component fits."],
                    ["Reuse code-owned patterns", "Have the harness and agent map that structure to existing React components, CSS, and Tailwind patterns. Keep genuine brand differences in the production code that owns them; do not create a parallel token registry or translate through Figma token graphs."],
                    ["Infer responsive behavior between references", "Treat observed page widths as samples, not the only supported layouts. Use the existing responsive rules and test intermediate widths so typography, spacing, and grids adapt continuously."],
                    ["Render with browser fonts and assets loaded", "Review the implementation in the actual browser engine. Figma canvas metrics are not used as final proof of type size, spacing, or font appearance."],
                    ["Validate and ship the rendered result", "Check semantic/accessibility structure, responsive behavior, and screenshot diffs at agreed viewports; review the code change, then release through the normal Git and deployment path."],
                  ].map(([title, detail], index, steps) => (
                    <li key={title} className="relative grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 pb-3 last:pb-0">
                      {index < steps.length - 1 ? <span aria-hidden="true" className="absolute bottom-0 left-[.9rem] top-8 w-px bg-border" /> : null}
                      <span className="relative z-10 flex size-8 items-center justify-center rounded-full border border-primary/30 bg-background font-mono text-[10px] font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0 border border-border bg-background p-4">
                        <h4 className="text-sm font-semibold leading-5">{title}</h4>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <aside className="space-y-4">
                <section className="border border-border bg-background p-5" aria-labelledby="figma-recommendation-title">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Figma’s place · optional reference</p>
                  <h3 id="figma-recommendation-title" className="mt-3 text-lg font-semibold">No Figma token round trip in the production path.</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">Figma can still communicate art direction or a proposed composition when useful. Its pixel dimensions, limited frame widths, and canvas font rendering should not be treated as authoritative browser values or mirrored into production tokens.</p>
                </section>
                <section className="border border-border bg-background p-5" aria-labelledby="harness-contract-title">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Harness contract</p>
                  <h3 id="harness-contract-title" className="mt-3 text-lg font-semibold">Ground AI interpretation in the browser and code.</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">Provide the agent with accessible DOM, computed styles, source components, fonts, assets, and real browser captures. Ask it to explain the mapping from semantic elements to production components and to verify its result at multiple widths.</p>
                </section>
                <section className="border border-border bg-background p-5" aria-labelledby="production-dom-title">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Production DOM · observed November 5, 2026</p>
                  <h3 id="production-dom-title" className="mt-3 text-lg font-semibold">A live link resolves through component and color tokens.</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">On <a href="https://www.caranddriver.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2">caranddriver.com</a>, a story link uses <code>--comp-link-inline-txt-primary-txt</code> and its hover counterpart. The loaded brand stylesheet maps them to <code>--color-link-txt</code> and <code>--color-link-txt-hover</code>. In the inspected page, those values resolve to <code>#121212</code> and <code>#1b5f8a</code>; hovering changes the rendered link to the blue value.</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">The “Latest News” heading maps the same link tokens to block-title color tokens, showing a contextual override. The page loads an <code>/api/styles.css</code> response tagged <code>type=brand</code> and <code>source=section:custom</code>. Its story links also carry separate <code>data-vars-*</code> tracking attributes.</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">This confirms a component-to-color token chain with a context-specific override on this production page, consistent with the diagram’s layered model. It does not establish Figma as the source, a key-for-key mapping to the proposal, or the upstream authoring and delivery path.</p>
                </section>
                <section className="border-l-2 border-primary bg-muted/40 p-5" aria-labelledby="reported-history-title">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Reported history · needs confirmation</p>
                  <h3 id="reported-history-title" className="mt-3 text-lg font-semibold">Why the current path became complex</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">Based on context provided for this study: the original Token Studio idea was to create Figma designs/components and push them toward production. The route may have gone through ConfigDS or the HDS package stylesheet; that detail is uncertain. A later attempt created Figma Variables and tried to control the push from Figma into GitHub, but Figma did not reliably support the production-ready workflow the team needed. The current architecture was the final practical option.</p>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">The production DOM confirms the layered token pattern exists, but not this historical sequence or why the team chose it. This history remains stakeholder-provided context, not independently verified by the technical documents reviewed here.</p>
                </section>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <SectionHeading eyebrow="Side-by-side analysis" title="Where the documentation aligns, and where it diverges">
            <p>The table keeps direct observations separate from interpretation. “Magazine Storybook” refers to the internal URLs supplied for this review; “Hearst+ repo” refers to the current local checkout.</p>
          </SectionHeading>
          <div className="mt-10 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-muted/60 text-foreground">
                <tr><th scope="col" className="w-44 p-4 font-semibold">Topic</th><th scope="col" className="p-4 font-semibold">Magazine Storybook</th><th scope="col" className="p-4 font-semibold">Hearst+ repo</th><th scope="col" className="p-4 font-semibold">What the difference means</th></tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                {comparisonRows.map((row) => (
                  <tr key={row.topic} className="align-top">
                    <th scope="row" className="p-4 font-semibold text-foreground">{row.topic}</th>
                    <td className="p-4 leading-6">{row.magazine}</td>
                    <td className="p-4 leading-6">{row.hearst}</td>
                    <td className="p-4 leading-6">{row.reading}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">On narrow screens, scroll the comparison table horizontally. The page itself remains within the viewport.</p>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Local implementation" title="The local prototype has an inspectable authoring and runtime contract.">
              <p>The repo specification says JSON is canonical, Figma and Pencil are downstream, and generated files should not be hand-edited. The table summarizes the implementation this study reviewed; it should not be mistaken for proof of the internal publication sites’ release process.</p>
            </SectionHeading>
            <dl className="divide-y divide-border border-y border-border">
              {repoFacts.map(([term, detail]) => (
                <div key={term} className="grid gap-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
                  <dt className="font-semibold">{term}</dt><dd className="font-mono text-sm leading-6 text-muted-foreground">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <SectionHeading eyebrow="Design-tool proposal" title="The supplied graphic offers two ways to organize Figma Variables.">
            <p>Option A keeps primitives, semantic roles, components, and brand overrides in one shared Variables file. Option B keeps shared foundations in one file and puts custom brand values in separate brand files, adding resource metadata to identify each file’s contents.</p>
            <p>The graphic also proposes abbreviations for token path segments. These are useful design-tool conventions to evaluate, but no evidence in the supplied links establishes that either file layout is the current production setup.</p>
          </SectionHeading>
          <details className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
            <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              View the supplied Figma Variables architecture diagram
              <span aria-hidden="true" className="text-muted-foreground">＋</span>
            </summary>
            <figure className="border-t border-border p-3 md:p-5">
              <Image
                src="/images/reference/figma-variables-structure.jpg"
                alt="Figma Variables architecture diagram comparing one shared Griffin Design System file with brand overrides against shared foundations plus separate brand files, followed by token abbreviation rules."
                width={970}
                height={3104}
                sizes="(max-width: 768px) 100vw, 1100px"
                className="mx-auto h-auto w-full max-w-5xl"
              />
              <figcaption className="mx-auto mt-3 max-w-5xl text-xs leading-5 text-muted-foreground">Reference supplied for this study. The two structures are presented as options, not verified production architecture.</figcaption>
            </figure>
          </details>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <SectionHeading eyebrow="Recommended next steps" title="Make the relationship between the maps explicit.">
              <p>These recommendations close the evidence gaps without replacing the current magazine token system with the Hearst+ prototype pipeline.</p>
            </SectionHeading>
            <ol className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
              {recommendations.map((item, index) => (
                <li key={item.title} className="bg-background p-5 md:p-7">
                  <span className="font-mono text-xs text-primary">0{index + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <SectionHeading eyebrow="Evidence and sources" title="Read the source documentation">
            <p>Storybook links open the current internal documentation in the Biography theme. The HDS and FRE links below are checked-in technical references for the production token path; the local Hearst+ claims come from this checkout.</p>
          </SectionHeading>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {storybookSources.map((source) => (
              <li key={source.href} className="grid gap-2 py-4 md:grid-cols-[minmax(14rem,.55fr)_1fr_auto] md:items-center md:gap-6">
                <Link href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{source.label}<span className="sr-only"> (opens in a new tab)</span></Link>
                <p className="text-sm leading-6 text-muted-foreground">{source.note}</p>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Internal source</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 border-t border-border pt-6 text-sm font-semibold">Production token pipeline</h3>
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {magazineSources.map((source) => (
              <li key={source.href} className="grid gap-2 py-4 md:grid-cols-[minmax(14rem,.55fr)_1fr_auto] md:items-center md:gap-6">
                <Link href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{source.label}<span className="sr-only"> (opens in a new tab)</span></Link>
                <p className="text-sm leading-6 text-muted-foreground">{source.note}</p>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">GitHub source</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="border border-border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Local repo evidence</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">AIDLC-docs/DESIGN-SYSTEM-SPEC.md · tokens/core, tokens/semantic, tokens/brands · scripts/build-from-tokens.ts · ThemeProvider and theme-css-vars.</p>
            </article>
            <article className="border border-border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Scope note</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">This is a documentation and source-path review, not an audit of private Figma files, CI credentials, or each publication application’s own deploy schedule and rollout controls.</p>
            </article>
          </div>
          <p className="mt-8 text-xs leading-5 text-muted-foreground">Individual publication websites demonstrate distinct editorial identities and navigation, but rendered visual differences alone do not prove how their tokens are authored or shipped. This study bases token architecture claims on the internal Storybook documentation and checked-in repo sources above.</p>
        </section>
      </main>
      <ProductFooter />
    </div>
    </ThemeProvider>
  );
}
