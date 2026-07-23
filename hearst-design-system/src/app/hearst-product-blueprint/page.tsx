import type { Metadata } from "next";
import Link from "next/link";
import packageJson from "../../../package.json";
import { ArchitectureFlow, BrandLogoMarquee, BrandPortfolioGrid, BrandStyleGuide, DestinationConvergence, JourneyMatrix, PaletteSystem, ProductFooter, ProductHeader, RankingExample, StoryCard, prototypeStats, systemSteps } from "@/components/product-story-shell";

export const metadata: Metadata = {
  title: "Hearst Magazines Product Blueprint",
  description: "The implemented architecture, product boundaries and production requirements behind Hearst+.",
};

const contents = [
  ["01", "Prototype truth", "scope"],
  ["02", "Feed architecture", "system"],
  ["03", "Eligibility & ranking", "ranking"],
  ["04", "Content treatments", "models"],
  ["05", "Routes & navigation", "routes"],
  ["06", "Experience map", "journeys"],
  ["07", "Design system", "design-system"],
  ["08", "Technology", "technology"],
  ["09", "Success framework", "measurement"],
  ["10", "Production readiness", "delivery"],
];

const dependencyVersion = (dependency: keyof typeof packageJson.dependencies) =>
  packageJson.dependencies[dependency].replace(/^[^0-9]*/, "");
const devDependencyVersion = (dependency: keyof typeof packageJson.devDependencies) =>
  packageJson.devDependencies[dependency].replace(/^[^0-9]*/, "");

const technology = [
  {
    label: "Application",
    title: `Next.js ${dependencyVersion("next")} + React ${dependencyVersion("react")}`,
    copy: "App Router pages, server-rendered entry points, route handlers, image optimization and React interaction.",
  },
  {
    label: "Language",
    title: `TypeScript ${devDependencyVersion("typescript")}`,
    copy: "Typed story, video, profile and personalization contracts across server and browser code.",
  },
  {
    label: "Interface",
    title: `Tailwind CSS ${devDependencyVersion("tailwindcss")} + HDS tokens`,
    copy: "Responsive composition from Tailwind with Hearst semantic surfaces, typography, spacing and brand themes.",
  },
  {
    label: "Components",
    title: `shadcn ${dependencyVersion("shadcn")} + Base UI ${dependencyVersion("@base-ui/react")}`,
    copy: "Reusable controls follow shadcn composition conventions and accessible Base UI primitives.",
  },
  {
    label: "Content",
    title: "Hearst RSS + Personalize",
    copy: "Validated public story metadata is combined with current read-only Personalize recommendations.",
  },
  {
    label: "Delivery",
    title: `Netlify Next.js plugin ${dependencyVersion("@netlify/plugin-nextjs")}`,
    copy: "The official integration packages Next.js server functions and optimized static assets for Netlify.",
  },
];

export default function BlueprintPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#102A43]">
      <ProductHeader current="blueprint" />
      <main>
        <section className="border-b border-slate-200 bg-[#102A43] text-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[.22em] text-sky-300">Product and engineering blueprint</p>
            <h1 className="mt-6 max-w-5xl font-serif text-6xl leading-[.94] tracking-[-.04em] md:text-8xl">The personalized front door to Hearst Magazines.</h1>
            <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 md:grid-cols-[1fr_1fr]">
              <p className="max-w-xl text-lg leading-8 text-slate-300">A source-of-truth reference for product managers, designers, editors and engineers. It documents what works today, how decisions are made, and what still requires production integration.</p>
              <div className="flex flex-wrap gap-2 self-start">{["Working prototype", "Explainable ranking", "Cross-brand", "Progressive delivery", "Reader controlled"].map((x) => <span key={x} className="border border-white/25 px-3 py-2 text-xs font-bold">{x}</span>)}</div>
            </div>
            <p className="mt-8 max-w-4xl border-t border-white/20 pt-5 text-sm leading-6 text-slate-300">
              Prototype boundary: public story metadata and read-only recommendations power the content experience. Reader identity, preferences and stakeholder controls are browser-local demo state. Production identity, publishing, consent, analytics and experimentation are not represented as completed integrations.
            </p>
            <BrandLogoMarquee />
          </div>
        </section>

        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-16 md:px-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-24">
          <aside className="self-start lg:sticky lg:top-6">
            <p className="mb-5 text-xs font-black uppercase tracking-[.18em] text-[#2D75B9]">On this page</p>
            <nav className="space-y-1">
              {contents.map(([n, t, id]) => (
                <a key={id} href={`#${id}`} className="flex gap-3 border-t border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:text-[#2D75B9]"><span className="text-slate-400">{n}</span>{t}</a>
              ))}
            </nav>
            <Link href="/hearst-plus/" className="mt-8 inline-flex text-sm font-bold text-[#2D75B9]">Open prototype</Link>
          </aside>

          <div className="min-w-0 space-y-24">
            <section id="scope" className="scroll-mt-8">
              <SectionHead label="01 · Prototype truth" title="A working reader product, not a static presentation" copy="The current catalog contains 859 validated stories across 29 publication brands and four editorial destinations. The interface, ranking, progressive river, readers, galleries, short-form video and route transitions are implemented. Browser-local identity and unscheduled catalog refresh remain explicit prototype boundaries." />
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-3">
                {prototypeStats.map((stat) => (
                  <article key={stat.label} className="bg-white p-6">
                    <strong className="font-serif text-5xl leading-none">{stat.value}</strong>
                    <p className="mt-3 text-xs font-black uppercase tracking-[.14em] text-[#2D75B9]">{stat.label}</p>
                    <p className="mt-3 text-xs leading-5 text-slate-600">{stat.copy}</p>
                  </article>
                ))}
              </div>
              <div className="mt-6 grid gap-px bg-slate-200 md:grid-cols-3">
                {[
                  ["Implemented", "Ranking, route transitions, responsive layouts, progressive loading, in-app readers and adaptive video playback."],
                  ["Current data", "A validated RSS snapshot plus read-only Personalize article and video recommendations through server routes."],
                  ["Not yet integrated", "Production identity, cross-device preference sync, consent, CMS publishing, live analytics and experiments."],
                ].map(([title, copy]) => (
                  <article key={title} className="bg-white p-5">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{copy}</p>
                  </article>
                ))}
              </div>
              <div className="mt-8"><BrandPortfolioGrid compact /></div>
            </section>

            <section id="system" className="scroll-mt-8">
              <SectionHead label="02 · Feed architecture" title="Validated catalogs enter once; stories arrive progressively" copy="The system separates source validation, eligibility, ranking and rendering. A compact server payload starts each route quickly, cached catalog pages append during browser idle time, and the river sentinel mounts ranked cards in small batches until every eligible story is available." />
              <div className="mt-10 grid gap-3 md:grid-cols-4">
                {systemSteps.map((s, i) => (
                  <article key={s.title} className="border border-slate-200 bg-white p-5">
                    <span className="font-mono text-xs text-slate-400">0{i + 1}</span>
                    <h3 className="mt-10 font-bold">{s.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{s.copy}</p>
                  </article>
                ))}
              </div>
              <div className="mt-6"><ArchitectureFlow /></div>
              <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
                Freshness has two clocks. Personalize recommendations are requested through dynamic server routes with short cache revalidation. The larger RSS catalog changes only after the import, byline enrichment and validation workflow succeeds. A production scheduler for the daily morning refresh remains required.
              </p>
            </section>

            <section id="ranking" className="scroll-mt-8">
              <SectionHead label="03 · Eligibility and ranking" title="An additive score, followed by an explicit diversity pass" copy="The app does not use the percentage formula previously shown here. It filters ineligible and hidden items, adds implemented point signals, orders candidates by total score, and then prevents the same brand or topic from occupying three consecutive positions." />
              <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
                <div className="bg-[#102A43] p-6 text-white">
                  <code className="text-xs text-sky-300">story_score = additive points</code>
                  <div className="mt-6 divide-y divide-white/15">
                    {[
                      ["Base signals", "Source popularity plus publication recency."],
                      ["Reader signals", "Followed topic, followed brand, saved tags, saved story and More Like This tags."],
                      ["Context", "Morning, afternoon, evening or late-night fit; return freshness; next-day novelty."],
                      ["Editorial baseline", "A modest first-morning lead boost when the profile has not yet personalized the edition."],
                      ["Exclusions", "Hidden items are removed; the previous lead receives a strong return-visit penalty."],
                    ].map(([name, copy]) => (
                      <div key={name} className="grid gap-2 py-4 first:pt-0 sm:grid-cols-[9rem_minmax(0,1fr)]">
                        <strong className="text-sm">{name}</strong>
                        <p className="text-xs leading-5 text-slate-300">{copy}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[.16em] text-[#2D75B9]">Eligibility and final pass</h3>
                  <div className="mt-5 space-y-3">
                    {["Respect the active destination and brand scope", "Require real imagery for editorial cards and playable media for video cards", "Remove hidden, duplicate and explicitly excluded items", "Prevent three consecutive cards from sharing one brand or topic", "Explain the strongest implemented reasons for the current lead"].map((x, i) => (
                      <div key={x} className="grid grid-cols-[2rem_minmax(0,1fr)] border-b border-slate-200 pb-3 text-sm"><span className="font-mono text-xs text-[#2D75B9]">0{i + 1}</span>{x}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8"><RankingExample /></div>
            </section>

            <section id="models" className="scroll-mt-8">
              <SectionHead label="04 · Content treatments" title="One editorial contract supports several reader treatments" copy="Shared story metadata carries source identity, topic, writer, publication date, canonical URL and media eligibility. The renderer chooses a treatment without changing the source story or its ranked position." />
              <div className="mt-10"><StoryCard /></div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead><tr className="border-b-2 border-[#102A43]"><th className="py-3">Treatment</th><th>Eligibility</th><th>Reader behavior</th><th>Shared contract</th></tr></thead>
                  <tbody>
                    {[
                      ["Article river card", "Valid story, source image and active scope", "Open, save, hide, More Like This", "Brand, topic, writer, date, URL and image"],
                      ["Featured story", "Top ranked eligible story in the active edition", "Swipe, save, follow and More Like This", "Same source story with a lead presentation"],
                      ["Rich photo gallery", "Explicit gallery with at least five distinct source images", "Open the in-app gallery reader", "Story metadata plus resolved gallery images"],
                      ["Video card", "Direct or adaptive playable media passes compatibility rules", "Play or open the in-app reader", "Story metadata plus duration and transcodings"],
                      ["Vertical video carousel", "Portrait media in an eligible brand context", "Swipe vertically in the immersive viewer", "Video contract plus orientation metadata"],
                    ].map((r) => (
                      <tr key={r[0]} className="border-b border-slate-200">{r.map((c, i) => <td key={c} className={`py-4 pr-5 ${i === 0 ? "font-bold" : "text-slate-600"}`}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="routes" className="scroll-mt-8">
              <SectionHead label="05 · Routes & navigation" title="Destination first, brand fluent" copy="Top-level sections answer broad intent. Brand pages retain their identity, SVG logo, color, typography and contextual subnavigation. The same content can be discovered through either mental model." />
              <div className="mt-10"><DestinationConvergence /></div>
              <div className="mt-8 border-l-2 border-[#2D75B9] pl-6">
                <RouteRow route="/hearst-plus/" title="Unified personalized river" items={["/hearst-lifestyle/  Lifestyle", "/hearst-autos/  Autos", "/hearst-flux/  Fashion & Luxury", "/hearst-ew/  Enthusiast & Wellness"]} />
                <RouteRow route="/lifestyle/[brandSlug]/ · /autos/[brandSlug]/ · /flux/[brandSlug]/ · /ew/[brandSlug]/" title="Publication destination" items={["Contextual publication categories", "Publication-scoped story inventory", "Brand logo, color and type system"]} />
                <RouteRow route="/about-hearst-magazines/" title="Stakeholder product story" />
                <RouteRow route="/why-hearst-plus/" title="Value proposition and validation case" />
                <RouteRow route="/hearst-product-blueprint/" title="PM and engineering reference" />
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["Global nav", "Move among the four destinations without losing the portfolio context"],
                  ["Contextual subnav", "Adapt categories to the active destination or brand"],
                  ["Filter and state", "Active destination, publication and topic context stays visible and clearable"],
                ].map(([a, b]) => <div key={a} className="border border-slate-200 bg-white p-5"><strong>{a}</strong><p className="mt-2 text-xs leading-5 text-slate-600">{b}</p></div>)}
              </div>
            </section>

            <section id="journeys" className="scroll-mt-8">
              <SectionHead label="06 · Experience map" title="Journeys show how the habit forms" copy="The prototype supports three common behavior loops: a fast morning brief, a deeper topic session and a return visit that resumes what the reader already started." />
              <div className="mt-10"><JourneyMatrix /></div>
            </section>

            <section id="design-system" className="scroll-mt-8">
              <SectionHead label="07 · Design system" title="One HDS application layer, many recognizable publications" copy="Hearst+ composes HDS semantic tokens, typography roles, icons and brand themes with product-specific reader patterns. It does not create a parallel design system. Destination themes establish context; publication tokens preserve logo, color and headline voice." />
              <div className="mt-10"><PaletteSystem /></div>
              <div className="mt-10"><BrandStyleGuide /></div>
            </section>

            <section id="technology" className="scroll-mt-8">
              <SectionHead label="08 · Technology" title="A modern web stack grounded in the installed build" copy="Version labels below are read from the project manifest so the blueprint remains precise. The stack supports the working prototype; it does not imply that production identity, publishing, analytics or consent systems are connected." />
              <dl className="mt-10 grid gap-px bg-slate-200 md:grid-cols-2 xl:grid-cols-3">
                {technology.map((item) => (
                  <div key={item.label} className="bg-white p-5">
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#2D75B9]">{item.label}</dt>
                    <dd>
                      <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{item.copy}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section id="measurement" className="scroll-mt-8">
              <SectionHead label="09 · Success framework" title="Define durable reader value before connecting telemetry" copy="The prototype does not currently report production analytics. These are proposed evaluation measures for a future instrumented release, included so product, editorial and engineering can agree on success before implementation." />
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-3">
                {[
                  ["North star", "Weekly useful sessions", "A proposed session definition based on a meaningful read, save, follow or successful return."],
                  ["Leading signals", "Return rate · saves · follows", "Proposed cohort measures for habit formation, discovery and destination usefulness."],
                  ["Guardrails", "Diversity · hides · trust", "Proposed checks for repetition, brand concentration, latency and accessibility."],
                ].map(([a, b, c]) => <div key={a} className="bg-white p-6"><span className="text-xs font-black uppercase tracking-[.14em] text-[#2D75B9]">{a}</span><h3 className="mt-5 text-xl font-bold">{b}</h3><p className="mt-3 text-xs leading-5 text-slate-600">{c}</p></div>)}
              </div>
            </section>

            <section id="delivery" className="scroll-mt-8">
              <SectionHead label="10 · Production readiness" title="Keep prototype truth separate from production requirements" copy="The working prototype proves the reader experience and architecture. A production release still needs durable services, operational monitoring and a governed data contract." />
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {[
                  ["Schedule and monitor refresh", "Run the validated RSS import before each morning edition, monitor staleness and keep the last valid catalog when a refresh fails."],
                  ["Connect identity and consent", "Move browser-local profile state into an authenticated, consent-aware service with clear retention and cross-device behavior."],
                  ["Instrument decisions", "Log eligible candidates, score components, diversity constraints, outcomes and failures without exposing private reader data."],
                  ["Release safely", "Add feature flags, holdouts, accessibility regression checks, media monitoring and rollback paths before broad rollout."],
                ].map(([t, c], i) => <article key={t} className="border-t border-slate-300 pt-5"><span className="font-mono text-xs text-[#2D75B9]">0{i + 1}</span><h3 className="mt-8 font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{c}</p></article>)}
              </div>
              <div className="mt-14 flex flex-col justify-between gap-6 bg-[#2D75B9] p-7 text-white md:flex-row md:items-center">
                <div><h3 className="font-serif text-3xl">See the blueprint become a product.</h3><p className="mt-2 text-sm text-blue-100">Open the working river or return to the stakeholder narrative.</p></div>
                <div className="flex flex-wrap gap-3"><Link href="/hearst-plus/" className="bg-white px-4 py-3 text-sm font-bold text-[#2D75B9]">Open prototype</Link><Link href="/about-hearst-magazines/" className="border border-white/40 px-4 py-3 text-sm font-bold">Product story</Link></div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <ProductFooter />
    </div>
  );
}

function SectionHead({ label, title, copy }: { label: string; title: string; copy: string }) {
  return <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.18em] text-[#2D75B9]">{label}</p><h2 className="mt-4 font-serif text-4xl leading-none md:text-5xl">{title}</h2><p className="mt-5 max-w-2xl leading-7 text-slate-600">{copy}</p></div>;
}

function RouteRow({ route, title, items = [] }: { route: string; title: string; items?: string[] }) {
  return <div className="mb-8"><code className="text-sm font-bold text-[#2D75B9]">{route}</code><h3 className="mt-1 font-bold">{title}</h3>{items.length > 0 && <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">{items.map((x) => <span key={x} className="border-l border-slate-300 pl-3">{x}</span>)}</div>}</div>;
}
