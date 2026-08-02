import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArchitectureFlow,
  BrandLogoMarquee,
  BrandPortfolioGrid,
  ProductFooter,
  ProductHeader,
  brandSections,
} from "@/components/product-story-shell";
import { hearstGrowthPrinciples } from "@/lib/hearst-growth-principles";

export const metadata: Metadata = {
  title: "Hearst+ | A Daily Reading Habit Across Hearst",
  description:
    "See how Hearst+ combines trusted editorial brands, a personalized daily edition, reusable technology, and transparent reader controls.",
};

const totalStories = brandSections.reduce((sum, destination) => sum + destination.count, 0);
const totalBrands = brandSections.reduce((sum, destination) => sum + destination.brands.length, 0);
const dailyEditionPreviewImage = "https://hips.hearstapps.com/hmg-prod/images/457d25d9-6587-43a2-bf62-c9269692f6e7.jpg";

const habitSteps = [
  {
    title: "Return to a fresh edition",
    copy: "Today’s Picks stays stable for the day, then makes room for a genuinely new edition tomorrow.",
  },
  {
    title: "Find value quickly",
    copy: "Five useful stories lead the experience. Continue Reading, Saved, and destination rails preserve momentum.",
  },
  {
    title: "Shape what comes next",
    copy: "Save, follow, hide, and More Like This give readers direct control over future recommendations.",
  },
  {
    title: "Build continuity",
    copy: "The next visit remembers unfinished stories, interests, and what changed since the reader last returned.",
  },
];

const principleColors = ["#6D45D8", "#169DB4", "#70B52C"] as const;
const principles = hearstGrowthPrinciples.map((principle, index) => ({
  ...principle,
  evidence: `Signals: ${principle.signals.charAt(0).toLowerCase()}${principle.signals.slice(1)}`,
  color: principleColors[index],
}));

const destinationPromises = [
  {
    name: "Lifestyle",
    color: "#7A2E57",
    copy: "Food, home, entertainment, style, shopping, and everyday wellness.",
  },
  {
    name: "Autos",
    color: "#1B5F8A",
    copy: "News, reviews, buying guidance, EVs, racing, trucks, and enthusiast culture.",
  },
  {
    name: "Fashion & Luxury",
    color: "#121212",
    copy: "Fashion, beauty, design, culture, travel, and considered living.",
  },
  {
    name: "Enthusiast & Wellness",
    color: "#E50022",
    copy: "Health, fitness, gear, science, active living, and practical expertise.",
  },
];

const stack = [
  ["Experience", "Next.js 16, React 19, TypeScript, and Tailwind CSS 4"],
  ["Design system", "Hearst Design System foundations, semantic tokens, publication themes, and shared components"],
  ["Editorial supply", "Validated public RSS snapshots with canonical URLs, source dates, images, and enriched bylines"],
  ["Recommendations", "Read-only Personalize article and video candidates with explainable additive ranking"],
  ["Media", "Responsive editorial images, galleries, native HLS, and an hls.js fallback for adaptive video"],
  ["Delivery", "Progressive server payloads, demand-driven catalog pages, cached article resolution, and Netlify"],
  ["Quality", "Type checks, Node unit tests, Storybook, feed validation, accessibility checks, and production smoke tests"],
  ["Prototype state", "Browser-local interests, saves, history, return context, and vendor-neutral product events"],
];

const stakeholderValue = [
  {
    audience: "Readers",
    value: "One dependable place for useful stories across the interests they already have.",
    evidence: "Return behavior, useful sessions, saves, follows, hides, completion, and recommendation feedback.",
  },
  {
    audience: "Editorial brands",
    value: "Qualified discovery from adjacent intent while the source logo, voice, byline, and route remain visible.",
    evidence: "Cross-brand discovery, brand follows, downstream reading, and repeat engagement by source.",
  },
  {
    audience: "Hearst",
    value: "A direct portfolio relationship organized around reader needs rather than isolated publication visits.",
    evidence: "Destination breadth, retained readers, portfolio depth, and incremental value versus existing traffic.",
  },
  {
    audience: "Product teams",
    value: "One shared reader architecture that can improve across destinations without flattening brand identity.",
    evidence: "Delivery speed, component reuse, accessibility, reliability, latency, and operating cost.",
  },
];

const prototypeTruth = [
  {
    title: "Working now",
    items: [
      `${totalStories} validated real-image stories across ${totalBrands} publication brands`,
      "Responsive destination, publication, Saved, search, video, gallery, and in-app reader experiences",
      "Stable daily picks, reading continuity, explainable recommendations, and progressive delivery",
      "A typed browser event contract for measuring explicit value actions without sending personal data",
    ],
  },
  {
    title: "Required for production",
    items: [
      "Production identity, consent, retention, deletion, and cross-device preference services",
      "Scheduled ingestion with freshness monitoring, incident ownership, and rollback controls",
      "Production analytics collection, experiments, dashboards, and calibrated ranking outcomes",
      "Editorial governance, brand-owner review, abuse controls, and a proven commercial model",
    ],
  },
];

function DailyEditionPreview() {
  return (
    <div className="overflow-hidden bg-white text-[#102A43]">
      <div className="flex items-center justify-between bg-[#2D75B9] px-4 py-2 text-[11px] font-bold text-white">
        <span>HEARST+</span>
        <span className="text-blue-100">For You · Saved</span>
      </div>
      <div className="relative min-h-[390px] sm:min-h-[440px]">
        <Image
          src={dailyEditionPreviewImage}
          alt="Historical action films featured in the Hearst+ daily edition preview"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 bg-black/75 px-3 py-2 text-xs font-bold text-white">
          <span>Today&apos;s Picks</span>
          <span aria-hidden="true">·</span>
          <span>1 of 5</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
          <p className="text-xs font-bold text-blue-100">Entertainment · Editor selected</p>
          <h2 className="mt-3 max-w-xl text-balance font-serif text-4xl leading-[0.98] tracking-[-0.03em] sm:text-5xl">
            Five stories worth making time for today.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200">
            A concise daily mix that balances relevance, freshness, trusted sources, and useful discovery.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs">
        <div className="flex gap-2" aria-label="Five daily picks">
          <span className="h-1.5 w-8 bg-[#2D75B9]" />
          <span className="h-1.5 w-4 bg-slate-300" />
          <span className="h-1.5 w-4 bg-slate-300" />
          <span className="h-1.5 w-4 bg-slate-300" />
          <span className="h-1.5 w-4 bg-slate-300" />
        </div>
        <span className="font-semibold text-slate-600">Save · More like this · Follow</span>
      </div>
    </div>
  );
}

export default function WhyHearstPlusPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8FAFC] text-[#102A43]">
      <ProductHeader current="value" />
      <main>
        <section className="overflow-hidden bg-[#102A43] text-white">
          <div className="mx-auto grid max-w-[1360px] gap-12 px-5 py-16 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                One portfolio. One useful daily relationship.
              </p>
              <h1 className="mt-6 max-w-3xl text-balance font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                Make the depth of Hearst worth returning to every day.
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-300">
                Hearst+ brings trusted stories from across the portfolio into a personal daily edition. Readers get relevance, continuity, and control. Every publication keeps its identity and authority.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/hearst-plus/"
                  className="bg-white px-5 py-3 text-sm font-bold text-[#2D75B9] transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Open today&apos;s edition
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-white/50 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  See how it works
                </Link>
              </div>
              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/20 pt-7 sm:grid-cols-4">
                {[
                  [String(totalStories), "validated stories"],
                  [String(totalBrands), "publication brands"],
                  [String(brandSections.length), "destinations"],
                  ["1", "shared reader"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="text-xs text-slate-400">{label}</dt>
                    <dd className="mt-1 text-2xl font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="border border-white/15 bg-white/5 p-3 sm:p-5">
              <DailyEditionPreview />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <h2 className="max-w-xl text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                  A habit built on usefulness, not pressure.
                </h2>
                <p className="mt-6 max-w-[62ch] text-pretty leading-7 text-slate-600">
                  The daily loop is intentionally calm. There are no punitive streaks, points, false urgency, or endless background loading. The reason to return is a compact edition that feels current, relevant, and easy to shape.
                </p>
              </div>
              <ol className="border-t-2 border-[#2D75B9]">
                {habitSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="grid gap-3 border-b border-slate-200 py-6 sm:grid-cols-[3rem_0.75fr_1.25fr] sm:items-start"
                  >
                    <span className="text-sm font-bold text-[#2D75B9]">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="text-sm leading-6 text-slate-600">{step.copy}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#F7F8FC]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2D75B9]">The Hearst+ principles</p>
                <h2 className="mt-5 max-w-xl text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                  A relationship that compounds, not a feed that forgets.
                </h2>
              </div>
              <p className="max-w-[70ch] text-pretty leading-7 text-slate-600">
                Hearst+ turns a reader&apos;s first useful visit into a measurable, reader-controlled loop. Each principle protects the experience: value before data collection, engagement without pressure, and learning that improves the whole portfolio without flattening its brands.
              </p>
            </div>
            <div className="relative mt-12 grid gap-px bg-slate-200 md:grid-cols-3">
              {principles.map((principle) => (
                <article key={principle.number} className="relative bg-white p-7 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      aria-hidden="true"
                      className="grid h-12 w-12 place-items-center rounded-full text-sm font-black text-white"
                      style={{ backgroundColor: principle.color }}
                    >
                      {principle.number}
                    </span>
                    <span aria-hidden="true" className="hidden h-px flex-1 bg-slate-200 md:block" />
                  </div>
                  <h3 className="mt-8 max-w-[14ch] font-serif text-3xl leading-[0.98] tracking-[-0.02em]">{principle.title}</h3>
                  <p className="mt-5 text-sm leading-6 text-slate-600">{principle.copy}</p>
                  <p className="mt-7 border-t border-slate-200 pt-4 text-xs font-semibold leading-5 text-slate-500">{principle.evidence}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 border-l-4 border-[#2D75B9] bg-white px-6 py-5 text-sm leading-6 text-slate-700 shadow-sm">
              <strong className="text-[#102A43]">The guardrail:</strong> Hearst+ should become more useful because readers choose to return—not because the product creates pressure, hides control, or treats every interaction as a conversion.
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#E9F2FA]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="max-w-4xl">
              <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                Interests cross publication lines. Hearst has the depth to follow them.
              </h2>
              <p className="mt-6 max-w-[70ch] text-pretty leading-7 text-slate-700">
                A reader planning dinner may also need shopping advice, wellness guidance, or a home idea. Hearst+ organizes that breadth around the reader while keeping every source publication unmistakable.
              </p>
            </div>
            <div className="mt-12 grid gap-px bg-slate-300 md:grid-cols-2 xl:grid-cols-4">
              {destinationPromises.map((destination) => (
                <article key={destination.name} className="bg-white p-6">
                  <span className="block h-2 w-12" style={{ backgroundColor: destination.color }} />
                  <h3 className="mt-7 font-serif text-3xl leading-none">{destination.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{destination.copy}</p>
                </article>
              ))}
            </div>
            <BrandLogoMarquee />
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                29 brands stay visible inside one system.
              </h2>
              <p className="max-w-[70ch] text-pretty leading-7 text-slate-600">
                Shared product infrastructure does not require generic presentation. Logos, typography, colors, routes, bylines, contextual navigation, and source links preserve the trust each publication has earned.
              </p>
            </div>
            <div className="mt-12">
              <BrandPortfolioGrid compact />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#F8FAFC]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="max-w-4xl">
              <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                A working reader product, built on reusable foundations.
              </h2>
              <p className="mt-6 max-w-[72ch] text-pretty leading-7 text-slate-600">
                The prototype combines a validated content catalog, current recommendation candidates, explainable ranking, progressive delivery, accessible interaction patterns, and publication-aware theming. The architecture is designed to improve once across the portfolio.
              </p>
            </div>
            <div className="mt-12">
              <ArchitectureFlow />
            </div>
            <div className="mt-6 grid gap-px bg-slate-200 md:grid-cols-2">
              {stack.map(([title, copy]) => (
                <div key={title} className="grid gap-3 bg-white p-5 sm:grid-cols-[8rem_1fr]">
                  <h3 className="text-sm font-bold text-[#2D75B9]">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
              <div>
                <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                  What stakeholders can evaluate.
                </h2>
                <p className="mt-6 max-w-[62ch] text-pretty leading-7 text-slate-600">
                  The strongest case begins with reader value. Portfolio, editorial, and platform benefits should follow from a destination people choose to use.
                </p>
              </div>
              <div className="border-t-2 border-[#102A43]">
                {stakeholderValue.map((item) => (
                  <article
                    key={item.audience}
                    className="grid gap-4 border-b border-slate-200 py-6 md:grid-cols-[9rem_1fr_1fr]"
                  >
                    <h3 className="font-bold">{item.audience}</h3>
                    <p className="text-sm leading-6 text-slate-600">{item.value}</p>
                    <p className="text-sm leading-6 text-slate-600">
                      <strong className="text-[#102A43]">Measure: </strong>
                      {item.evidence}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#E9F2FA]">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="max-w-4xl">
              <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                Clear about what exists, and what must come next.
              </h2>
              <p className="mt-6 max-w-[72ch] text-pretty leading-7 text-slate-700">
                Hearst+ is a working reader prototype, not a claim of production readiness. This distinction matters for identity, privacy, measurement, editorial operations, and investment decisions.
              </p>
            </div>
            <div className="mt-12 grid gap-px bg-slate-300 lg:grid-cols-2">
              {prototypeTruth.map((group, index) => (
                <article key={group.title} className={index === 0 ? "bg-white p-7" : "bg-[#102A43] p-7 text-white"}>
                  <h3 className="font-serif text-3xl leading-none">{group.title}</h3>
                  <ul className={`mt-6 space-y-4 text-sm leading-6 ${index === 0 ? "text-slate-600" : "text-slate-300"}`}>
                    {group.items.map((item) => (
                      <li key={item} className="grid grid-cols-[1rem_1fr] gap-3">
                        <span aria-hidden="true" className={index === 0 ? "text-[#2D75B9]" : "text-sky-300"}>●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#2D75B9] text-white">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-20 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
            <div>
              <h2 className="max-w-4xl text-balance font-serif text-5xl leading-none tracking-[-0.03em] sm:text-6xl">
                See the daily habit in the product.
              </h2>
              <p className="mt-6 max-w-[68ch] text-pretty leading-7 text-blue-50">
                Open Hearst+ to explore Today&apos;s Picks, return continuity, personalized recommendations, the full brand portfolio, and the stakeholder demo tools.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/hearst-plus/" className="bg-white px-5 py-3 text-sm font-bold text-[#2D75B9]">
                Open Hearst+
              </Link>
              <Link href="/hearst-plus/?demo=1" className="border border-white/60 px-5 py-3 text-sm font-bold text-white">
                Open stakeholder demo
              </Link>
              <Link href="/hearst-product-blueprint/" className="border border-white/60 px-5 py-3 text-sm font-bold text-white">
                Review the blueprint
              </Link>
            </div>
          </div>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
