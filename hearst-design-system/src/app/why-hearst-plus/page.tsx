import type { Metadata } from "next";
import Link from "next/link";
import {
  ProductFooter,
  ProductHeader,
  brandSections,
} from "@/components/product-story-shell";

export const metadata: Metadata = {
  title: "Why Hearst+ Can Work for Hearst",
  description:
    "An honest assessment of the reader value, portfolio advantage, product evidence, risks and validation plan behind Hearst+.",
};

const totalStories = brandSections.reduce((sum, destination) => sum + destination.count, 0);
const totalBrands = brandSections.reduce((sum, destination) => sum + destination.brands.length, 0);
const totalDestinations = brandSections.length;

const advantages = [
  {
    title: "Distinctive editorial supply",
    evidence:
      "Hearst already publishes trusted, specialized reporting across home, food, health, style, entertainment, technology, autos and active living.",
    implication:
      "Hearst+ can organize owned editorial depth around reader intent without depending on anonymous or low-quality inventory.",
  },
  {
    title: "A portfolio with useful adjacency",
    evidence:
      "Many reader needs naturally cross publication boundaries: a home project can lead to shopping, food, wellness or design coverage.",
    implication:
      "A shared river can create discovery among Hearst brands while keeping the source publication explicit.",
  },
  {
    title: "Recognizable brand authority",
    evidence:
      "Each publication contributes a clear subject position, visual identity and editorial voice rather than becoming an interchangeable content source.",
    implication:
      "The product can offer broad relevance while preserving the trust readers associate with individual brands.",
  },
  {
    title: "Reusable product infrastructure",
    evidence:
      "The prototype uses one typed content contract, shared routes, HDS tokens, ranking rules and reader components across unified, destination and brand experiences.",
    implication:
      "New reader treatments can be improved once and applied across the portfolio instead of being rebuilt for every publication.",
  },
  {
    title: "Direct reader signals",
    evidence:
      "Save, follow, hide and More Like This are visible product actions with understandable effects on the next edition.",
    implication:
      "With consent-aware production identity, Hearst could learn from explicit first-party preference signals instead of relying only on page-level traffic.",
  },
];

const stakeholderValue = [
  [
    "Reader",
    "One dependable place to find useful stories across interests.",
    "Less site-by-site searching, clear sources, controllable recommendations and continuity across visits.",
    "Return frequency, useful sessions, saves, follows, hides and completion.",
  ],
  [
    "Editorial brand",
    "Incremental discovery from adjacent reader intent.",
    "Visible attribution, brand-native presentation and a new distribution surface without surrendering source identity.",
    "Cross-brand discovery, qualified reads, brand follows and downstream engagement.",
  ],
  [
    "Hearst portfolio",
    "A direct relationship organized around the reader rather than one publication visit.",
    "Shared product learning, broader session depth and a place to evaluate portfolio-level membership or commercial ideas.",
    "Retained readers, portfolio depth, destination breadth and incremental value versus existing traffic.",
  ],
  [
    "Product and engineering",
    "One application layer for shared reader behavior.",
    "Common content contracts, HDS foundations, reusable cards, readers, media handling and explainable ranking.",
    "Delivery speed, reuse, accessibility, latency, reliability and operating cost.",
  ],
];

const prototypeEvidence = [
  [
    "Unified catalog",
    `${totalStories} validated stories from ${totalBrands} publication brands across ${totalDestinations} editorial destinations.`,
    "The portfolio can be normalized into one eligible content graph.",
    "A current snapshot demonstrates coverage, not continuous production freshness.",
  ],
  [
    "Reader experience",
    "Responsive rivers, publication routes, in-app readers, galleries, video and portrait-video navigation run in the browser.",
    "The core interaction model is technically and experientially testable.",
    "Prototype usability does not establish long-term retention.",
  ],
  [
    "Personalization",
    "Eligibility, additive scoring, daypart context, return freshness, explicit reader signals and a final diversity pass are implemented.",
    "Recommendations can be transparent and governed rather than opaque.",
    "The current model has not been calibrated against production outcomes.",
  ],
  [
    "Brand system",
    "Publication logos, colors, typography and contextual navigation remain visible inside shared templates.",
    "Portfolio unity does not require erasing publication identity.",
    "Editorial and brand-owner review is still needed at production scale.",
  ],
  [
    "Progressive delivery",
    "Routes start with a compact payload and request another catalog page only when the reader approaches the loaded river’s end.",
    "A large portfolio can remain navigable without downloading the full catalog for every visit.",
    "Real-user performance, failure recovery and operating cost still require production measurement.",
  ],
];

const risks = [
  {
    risk: "The destination may not become a habit",
    why: "Readers may prefer direct brand visits, search, newsletters or social discovery.",
    response:
      "Test repeat use with real cohorts. Require measurable lift in useful weekly sessions and return rate before expanding.",
  },
  {
    risk: "Personalization can weaken trust",
    why: "Repetition, unclear ranking or poor adjacency can make the river feel generic or manipulative.",
    response:
      "Keep source attribution, explanations and controls visible. Monitor hides, repetition, brand concentration and trust feedback.",
  },
  {
    risk: "Portfolio optimization can conflict with brand goals",
    why: "A unified experience may redistribute attention in ways individual publications do not support.",
    response:
      "Define editorial controls, attribution standards and incremental measurement with brand stakeholders before launch.",
  },
  {
    risk: "Freshness is operationally demanding",
    why: "A daily habit fails quickly if imports are stale, media breaks or recommendations stop updating.",
    response:
      "Schedule and monitor ingestion, retain the last valid catalog, expose staleness and establish clear incident ownership.",
  },
  {
    risk: "Commercial value is still a hypothesis",
    why: "The prototype does not connect subscriptions, advertising, commerce attribution or production analytics.",
    response:
      "Measure reader value first, then test disclosed commercial models without degrading trust or editorial usefulness.",
  },
  {
    risk: "Identity and consent are not production-ready",
    why: "Current profile and preference state is browser-local and cannot support durable cross-device learning.",
    response:
      "Use an authenticated, consent-aware service with clear retention, deletion and explanation before persisting reader signals.",
  },
];

const validationPhases = [
  {
    phase: "Instrument",
    question: "Can the product be measured and operated responsibly?",
    work:
      "Connect consent-aware identity, candidate and outcome logging, freshness monitoring, accessibility checks and rollback controls.",
    gate:
      "No cohort test until attribution, privacy, reliability and recommendation explanations are observable.",
  },
  {
    phase: "Controlled beta",
    question: "Do invited readers find the combined destination useful enough to return?",
    work:
      "Run a limited beta with a baseline or holdout. Compare unified, destination and direct-brand entry behavior.",
    gate:
      "Proceed only if useful-session and return metrics improve without unacceptable hides, trust concerns or latency.",
  },
  {
    phase: "Portfolio evaluation",
    question: "Is the value incremental for Hearst and its brands?",
    work:
      "Measure cross-brand discovery, source-brand engagement, destination breadth and displacement from existing products.",
    gate:
      "Expand only when portfolio gains are incremental and participating brands have a clear value exchange.",
  },
  {
    phase: "Business experiments",
    question: "Can commercial value support the product without weakening the reader promise?",
    work:
      "Test one disclosed model at a time, such as membership, subscription discovery, commerce utility or portfolio sponsorship.",
    gate:
      "Scale only when reader value and trust remain healthy and the commercial result is incremental.",
  },
];

export default function WhyHearstPlusPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#102A43]">
      <ProductHeader current="value" />
      <main>
        <section className="border-b border-slate-200 bg-[#102A43] text-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
              Value proposition and investment case
            </p>
            <h1 className="mt-6 max-w-5xl text-balance font-serif text-6xl leading-[0.94] tracking-[-0.04em] md:text-8xl">
              Why Hearst+ can work for Hearst.
            </h1>
            <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 lg:grid-cols-[1.05fr_.95fr]">
              <p className="max-w-2xl text-pretty text-lg leading-8 text-slate-300">
                Hearst owns a rare combination of trusted specialist brands and adjacent reader needs. Hearst+ turns that portfolio into one useful daily relationship while keeping every source publication visible.
              </p>
              <p className="max-w-xl text-pretty text-sm leading-6 text-slate-300">
                Honest assessment: the prototype demonstrates a credible product mechanism and reusable architecture. It does not yet prove audience demand, retention, incremental revenue or production readiness. Those claims require an instrumented beta.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/20 pt-6 text-sm">
              <p><strong className="text-xl">{totalStories}</strong><span className="ml-2 text-slate-300">validated stories</span></p>
              <p><strong className="text-xl">{totalBrands}</strong><span className="ml-2 text-slate-300">represented brands</span></p>
              <p><strong className="text-xl">{totalDestinations}</strong><span className="ml-2 text-slate-300">editorial destinations</span></p>
              <p><strong className="text-xl">1</strong><span className="ml-2 text-slate-300">shared reader system</span></p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <h2 className="text-balance font-serif text-5xl leading-none">A strong reason to test, not yet a reason to declare victory.</h2>
            </div>
            <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
              <article className="bg-white p-7">
                <h3 className="text-lg font-bold">What the evidence supports</h3>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                  <li>Hearst has enough differentiated supply to create a broad but coherent daily product.</li>
                  <li>Cross-brand recommendations can preserve attribution, voice and reader control.</li>
                  <li>The shared architecture can support unified, destination and publication experiences.</li>
                  <li>The working prototype is mature enough for instrumented product research.</li>
                </ul>
              </article>
              <article className="bg-[#E9F2FA] p-7">
                <h3 className="text-lg font-bold">What remains unproven</h3>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                  <li>Whether readers will choose Hearst+ often enough to form a durable habit.</li>
                  <li>Whether the product creates incremental value rather than shifting existing traffic.</li>
                  <li>Which commercial model fits without weakening trust or editorial clarity.</li>
                  <li>Whether identity, consent, ingestion and measurement can operate reliably at scale.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-5 md:px-10">
            <div className="max-w-3xl">
              <h2 className="text-balance font-serif text-5xl leading-none">Readers have interests. Hearst has the depth to serve the whole person.</h2>
              <p className="mt-6 max-w-[70ch] text-pretty leading-7 text-slate-600">
                The portfolio is usually experienced as separate publications, even when a reader&apos;s real needs cross several of them. Hearst+ changes the organizing principle from “Which site should I visit?” to “What is useful to me now?” The publication remains visible as the source of authority.
              </p>
            </div>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-[#102A43]">
                    <th className="py-4 pr-6">Hearst advantage</th>
                    <th className="py-4 pr-6">Evidence already present</th>
                    <th className="py-4">Why it matters for Hearst+</th>
                  </tr>
                </thead>
                <tbody>
                  {advantages.map((item) => (
                    <tr key={item.title} className="border-b border-slate-200 align-top">
                      <th className="w-1/5 py-5 pr-6 font-bold">{item.title}</th>
                      <td className="w-2/5 py-5 pr-6 leading-6 text-slate-600">{item.evidence}</td>
                      <td className="w-2/5 py-5 leading-6 text-slate-600">{item.implication}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr]">
            <div>
              <h2 className="text-balance font-serif text-5xl leading-none">One reader promise, several aligned beneficiaries.</h2>
              <p className="mt-6 max-w-[65ch] text-pretty leading-7 text-slate-600">
                The product only works if reader value comes first. Editorial, portfolio and platform benefits should follow from a destination people choose to use, not from forcing more inventory into a feed.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-[#102A43]">
                    <th className="py-4 pr-5">Beneficiary</th>
                    <th className="py-4 pr-5">Job</th>
                    <th className="py-4 pr-5">Value exchange</th>
                    <th className="py-4">Evidence to measure</th>
                  </tr>
                </thead>
                <tbody>
                  {stakeholderValue.map((row) => (
                    <tr key={row[0]} className="border-b border-slate-200 align-top">
                      {row.map((cell, index) => (
                        <td key={cell} className={`py-5 pr-5 leading-6 ${index === 0 ? "font-bold text-[#102A43]" : "text-slate-600"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#E9F2FA] py-20 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-5 md:px-10">
            <div className="max-w-3xl">
              <h2 className="text-balance font-serif text-5xl leading-none">The prototype proves mechanisms, not market outcomes.</h2>
              <p className="mt-6 max-w-[70ch] text-pretty leading-7 text-slate-700">
                Each implemented capability reduces a specific product or delivery risk. None should be interpreted as proof that readers will return or that the business model will be incremental.
              </p>
            </div>
            <div className="mt-12 overflow-x-auto bg-white">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-[#102A43]">
                    <th className="p-5">Capability</th>
                    <th className="p-5">What exists now</th>
                    <th className="p-5">What it demonstrates</th>
                    <th className="p-5">Evidence limit</th>
                  </tr>
                </thead>
                <tbody>
                  {prototypeEvidence.map((row) => (
                    <tr key={row[0]} className="border-b border-slate-200 align-top last:border-0">
                      {row.map((cell, index) => (
                        <td key={cell} className={`p-5 leading-6 ${index === 0 ? "font-bold text-[#102A43]" : "text-slate-600"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr]">
            <div>
              <h2 className="text-balance font-serif text-5xl leading-none">The difficult questions belong in the product case.</h2>
              <p className="mt-6 max-w-[65ch] text-pretty leading-7 text-slate-600">
                These are not reasons to stop. They are conditions the next phase must test directly so the organization can make a grounded investment decision.
              </p>
            </div>
            <div className="divide-y divide-slate-300 border-y border-slate-300">
              {risks.map((item, index) => (
                <article key={item.risk} className="grid gap-4 py-6 md:grid-cols-[2rem_1fr_1fr]">
                  <span className="font-mono text-xs text-[#2D75B9]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-bold">{item.risk}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.why}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Required response</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.response}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-5 md:px-10">
            <div className="max-w-3xl">
              <h2 className="text-balance font-serif text-5xl leading-none">Earn the right to scale through four decision gates.</h2>
              <p className="mt-6 max-w-[70ch] text-pretty leading-7 text-slate-600">
                The sequence below is a recommendation, not an implemented roadmap. Each phase should answer one question and stop if the evidence is weak or the guardrails fail.
              </p>
            </div>
            <ol className="mt-12 border-t-2 border-[#102A43]">
              {validationPhases.map((item, index) => (
                <li key={item.phase} className="grid gap-5 border-b border-slate-200 py-7 md:grid-cols-[3rem_0.7fr_1fr_1fr]">
                  <span className="font-mono text-sm text-[#2D75B9]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-bold">{item.phase}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.question}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Work</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.work}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Decision gate</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.gate}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#2D75B9] py-20 text-white lg:py-24">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 md:px-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-balance font-serif text-5xl leading-none md:text-6xl">
                Move from prototype to measured beta.
              </h2>
              <p className="mt-6 max-w-[70ch] text-pretty leading-7 text-blue-50">
                Hearst+ is strategically credible because it combines assets Hearst already owns: trusted brands, deep editorial supply and direct audience relationships. The next investment should fund evidence, not a broad launch. Connect durable identity and measurement, operate a fresh catalog, invite real readers and use predetermined gates to decide whether to continue.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/hearst-plus/" className="bg-white px-5 py-3 text-sm font-bold text-[#2D75B9]">Open the prototype</Link>
              <Link href="/hearst-product-blueprint/" className="border border-white/50 px-5 py-3 text-sm font-bold">Review the blueprint</Link>
              <Link href="/about-hearst-magazines/" className="border border-white/50 px-5 py-3 text-sm font-bold">Read the product story</Link>
            </div>
          </div>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
