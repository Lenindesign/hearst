import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureFlow, BrandLogoMarquee, BrandPortfolioGrid, BrandStyleGuide, DestinationConvergence, JourneyMatrix, PaletteSystem, ProductFooter, ProductHeader, RankingExample, StoryCard, prototypeStats, systemSteps } from "@/components/product-story-shell";

export const metadata: Metadata = {
  title: "Hearst Magazines Product Blueprint",
  description: "Architecture, personalization, content models, routes and measurement for the Hearst Magazines destination.",
};

const contents = [
  ["01", "Prototype scope", "scope"],
  ["02", "System map", "system"],
  ["03", "Ranking logic", "ranking"],
  ["04", "Content models", "models"],
  ["05", "Routes & navigation", "routes"],
  ["06", "Experience map", "journeys"],
  ["07", "Color system", "color"],
  ["08", "Brand style guides", "style-guides"],
  ["09", "Measurement", "measurement"],
  ["10", "Delivery principles", "delivery"],
];

export default function BlueprintPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#102A43]">
      <ProductHeader current="blueprint" />
      <main>
        <section className="border-b border-slate-200 bg-[#102A43] text-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[.22em] text-sky-300">Product & engineering blueprint</p>
            <h1 className="mt-6 max-w-5xl font-serif text-6xl leading-[.94] tracking-[-.04em] md:text-8xl">The personalized front door to Hearst Magazines.</h1>
            <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 md:grid-cols-[1fr_1fr]">
              <p className="max-w-xl text-lg leading-8 text-slate-300">A working reference for product managers, designers, editors, data teams and engineers: what the destination does, how its decisions are made, and how the system evolves safely.</p>
              <div className="flex flex-wrap gap-2 self-start">{["Destination-driven", "Explainable ranking", "Cross-brand", "Composable", "Reader controlled"].map((x) => <span key={x} className="border border-white/25 px-3 py-2 text-xs font-bold">{x}</span>)}</div>
            </div>
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
              <SectionHead label="01 · Prototype scope" title="Realistic enough for product, editorial and stakeholder decisions" copy="The prototype currently models 859 real-image stories across 29 represented brands. It uses public RSS metadata, brand-level routes, SVG logo assets, color and type tokens, and topic-specific destinations so teams can evaluate the product as a system rather than a static concept." />
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-3">
                {prototypeStats.map((stat) => (
                  <article key={stat.label} className="bg-white p-6">
                    <strong className="font-serif text-5xl leading-none">{stat.value}</strong>
                    <p className="mt-3 text-xs font-black uppercase tracking-[.14em] text-[#2D75B9]">{stat.label}</p>
                    <p className="mt-3 text-xs leading-5 text-slate-600">{stat.copy}</p>
                  </article>
                ))}
              </div>
              <div className="mt-8"><BrandPortfolioGrid compact /></div>
            </section>

            <section id="system" className="scroll-mt-8">
              <SectionHead label="02 · System map" title="From many sources to one useful river" copy="The system separates content understanding, reader understanding and presentation. That makes the product easier to explain, test and evolve without coupling every decision to the interface." />
              <div className="mt-10 grid gap-3 md:grid-cols-4">
                {systemSteps.map((s, i) => (
                  <article key={s.title} className="border-t-4 border-[#2D75B9] bg-white p-5 shadow-sm">
                    <span className="font-mono text-xs text-slate-400">0{i + 1}</span>
                    <h3 className="mt-10 font-bold">{s.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{s.copy}</p>
                  </article>
                ))}
              </div>
              <div className="mt-6"><ArchitectureFlow /></div>
            </section>

            <section id="ranking" className="scroll-mt-8">
              <SectionHead label="03 · Ranking logic" title="Relevant, fresh, trusted and never monotonous" copy="Ranking is a transparent weighted decision, followed by editorial and experience constraints. The goal is useful variety, not maximum clicks at any cost." />
              <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
                <div className="bg-[#102A43] p-6 text-white">
                  <code className="text-xs text-sky-300">story_score =</code>
                  <div className="mt-6 space-y-5">
                    {[
                      ["Affinity", "35%", "What the reader follows, saves and spends time with"],
                      ["Freshness", "25%", "How timely the item is for its content type"],
                      ["Editorial value", "20%", "Quality, authority and priority signals"],
                      ["Context & utility", "15%", "Fit for session, time, destination and current intent"],
                      ["Exploration", "5%", "A controlled chance to discover something new"],
                    ].map(([n, p, c]) => (
                      <div key={n}>
                        <div className="flex justify-between text-sm font-bold"><span>{n}</span><span>{p}</span></div>
                        <div className="mt-2 h-1 bg-white/15"><div className="h-1 bg-sky-300" style={{ width: p }} /></div>
                        <p className="mt-2 text-xs text-slate-400">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[.16em] text-[#2D75B9]">Then re-rank with guardrails</h3>
                  <div className="mt-5 space-y-3">
                    {["No single brand dominates a view", "Avoid repeated topics and near-duplicate stories", "Respect hides, sensitivity and content eligibility", "Reserve editorial and commercial placements intentionally", "Explain the strongest reason for every recommendation"].map((x, i) => (
                      <div key={x} className="grid grid-cols-[2rem_minmax(0,1fr)] border-b border-slate-200 pb-3 text-sm"><span className="font-mono text-xs text-[#2D75B9]">0{i + 1}</span>{x}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8"><RankingExample /></div>
            </section>

            <section id="models" className="scroll-mt-8">
              <SectionHead label="04 · Content models" title="Cards are views of structured decisions" copy="Editorial stories and commercial units use distinct models and disclosure, while sharing layout primitives, topic metadata, interaction events and accessibility requirements." />
              <div className="mt-10 grid gap-5 md:grid-cols-2"><StoryCard /><StoryCard ad /></div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead><tr className="border-b-2 border-[#102A43]"><th className="py-3">Field</th><th>Editorial content</th><th>Contextual ad</th><th>Used by</th></tr></thead>
                  <tbody>
                    {[
                      ["Identity", "story_id, brand, logo, canonical URL", "campaign_id, advertiser, disclosure", "routing, analytics"],
                      ["Meaning", "topics, format, entities, intent", "categories, offer, eligibility", "candidate generation"],
                      ["Quality", "editorial priority, trust, freshness", "creative quality, policy status", "ranking + safety"],
                      ["Actions", "open, save, follow, hide", "click, dismiss, why this ad", "learning loop"],
                      ["Presentation", "headline, dek, image, badge", "headline, image, CTA, label", "card renderer"],
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
                <RouteRow route="/hearst-plus/" title="Unified personalized river" items={["/hearst-lifestyle/  Lifestyle", "/hearst-autos/  Autos", "/hearst-flux/  Flux", "/hearst-ew/  E&W"]} />
                <RouteRow route="/lifestyle/[brandSlug]/ · /autos/[brandSlug]/" title="Brand-specific destination" items={["Contextual brand categories", "Single active brand filter", "Brand logo, color and type system"]} />
                <RouteRow route="/about-hearst-magazines/" title="Stakeholder product story" />
                <RouteRow route="/hearst-product-blueprint/" title="PM and engineering reference" />
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["Global nav", "Move among the four destinations without losing the portfolio context"],
                  ["Contextual subnav", "Adapt categories to the active destination or brand"],
                  ["Filter & state", "One brand at a time, clearable, route-addressable and visible"],
                ].map(([a, b]) => <div key={a} className="border-t-4 border-[#2D75B9] bg-white p-5"><strong>{a}</strong><p className="mt-2 text-xs leading-5 text-slate-600">{b}</p></div>)}
              </div>
            </section>

            <section id="journeys" className="scroll-mt-8">
              <SectionHead label="06 · Experience map" title="Journeys show how the habit forms" copy="The prototype supports three common behavior loops: a fast morning brief, a deeper topic session and a return visit that resumes what the reader already started." />
              <div className="mt-10"><JourneyMatrix /></div>
            </section>

            <section id="color" className="scroll-mt-8">
              <SectionHead label="07 · Color and theming" title="Brand color stays useful in light and dark surfaces" copy="The design system keeps the main destination colors, then maps each one to a contrast-safe companion for dark-mode contexts and section-specific pages." />
              <div className="mt-10"><PaletteSystem /></div>
            </section>

            <section id="style-guides" className="scroll-mt-8">
              <SectionHead label="08 · Brand style guides" title="Each brand keeps its own logo, color and type behavior" copy="These samples show the section themes and the individual brand themes used by the prototype. The guide makes clear which brands have dedicated theme tokens and which currently inherit the section treatment." />
              <div className="mt-10"><BrandStyleGuide /></div>
            </section>

            <section id="measurement" className="scroll-mt-8">
              <SectionHead label="09 · Measurement" title="Optimize for durable reader value" copy="A daily destination succeeds when readers return because it reliably saves time and expands discovery, not because a single session was artificially prolonged." />
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-3">
                {[
                  ["North star", "Weekly useful sessions", "A session with a meaningful open, save, follow or qualified commercial action"],
                  ["Leading signals", "Return rate · saves · follows", "Measure habit formation and depth by cohort and destination"],
                  ["Guardrails", "Diversity · hides · trust", "Watch repetition, brand concentration, ad load, latency and accessibility"],
                ].map(([a, b, c]) => <div key={a} className="bg-white p-6"><span className="text-xs font-black uppercase tracking-[.14em] text-[#2D75B9]">{a}</span><h3 className="mt-5 text-xl font-bold">{b}</h3><p className="mt-3 text-xs leading-5 text-slate-600">{c}</p></div>)}
              </div>
            </section>

            <section id="delivery" className="scroll-mt-8">
              <SectionHead label="10 · Delivery principles" title="Build the trust contract into the platform" copy="The experience should remain fast, accessible, inspectable and reversible as its intelligence grows." />
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {[
                  ["Privacy by design", "Prefer first-party behavioral signals, make controls obvious, and define retention deliberately."],
                  ["Reader agency", "Save, follow, hide, clear and explanation controls are product primitives, not settings afterthoughts."],
                  ["Observable decisions", "Log candidates, score components, constraints and outcomes so teams can debug the whole funnel."],
                  ["Progressive delivery", "Feature flags, holdouts and cohort experiments let the team validate value before broad rollout."],
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
