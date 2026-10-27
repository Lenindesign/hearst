import type { Metadata } from "next";
import Link from "next/link";
import {
  ArchitectureFlow,
  BrandLogoMarquee,
  BrandPortfolioGrid,
  ProductFooter,
  ProductHeader,
  StoryCard,
  brandSections,
  streams,
} from "@/components/product-story-shell";
import { entertainmentWebsiteFeedConfigs } from "@/lib/hearst-entertainment-story-feeds";
import { hearstNewspaperPublications } from "@/lib/hearst-newspaper-feed-framework";
import { hearstTVStations } from "@/lib/hearst-tv-feed-framework";
import { hearstGrowthPrinciples } from "@/lib/hearst-growth-principles";

export const metadata: Metadata = {
  title: "Hearst+ | Reader Experience and Validation Case",
  description:
    "Review the Hearst+ reader proposition, prototype evidence, evaluation questions, and production requirements.",
};

const totalStories = brandSections.reduce((sum, destination) => sum + destination.count, 0);
const totalBrands = brandSections.reduce((sum, destination) => sum + destination.brands.length, 0);
const totalTVStations = hearstTVStations.length;
const totalNewspapers = hearstNewspaperPublications.length;
const totalEntertainmentChannels = entertainmentWebsiteFeedConfigs.length;

const heroStrategy = [
  {
    label: "Problem",
    copy: "Strategic question: will readers choose to return to one Hearst experience after discovering stories, local reporting, or shows across separate properties? The current prototype demonstrates a possible flow; it does not establish a traffic or retention result.",
  },
  {
    label: "Prototype behavior",
    copy: "The first product test is daily return behavior: can one compact edition make a large Hearst portfolio feel personal enough to become a repeat habit?",
  },
  {
    label: "Commercial hypothesis",
    copy: "A future model could keep discovery open, use registration for persistent preferences, and reserve additional utility for members. None of those entitlements or payment flows is implemented here.",
  },
] as const;

const habitSteps = [
  {
    title: "Return to a fresh edition",
    copy: "The prototype has a cross-source river and destination routes. Checked-in magazine records are a snapshot; Personalize recommendations are read-only, and local source routes use configured feeds.",
  },
  {
    title: "Find value quickly",
    copy: "A concise lead package helps readers scan across lifestyle, autos, fashion, wellness, local news, and A&E Family without hunting site by site.",
  },
  {
    title: "Shape what comes next",
    copy: "Save, follow, hide, More Like This, station preferences, newspaper choices, and show interests give readers direct control over future recommendations.",
  },
  {
    title: "Build continuity",
    copy: "Local email demo profiles keep preferences and saved items in this browser. When verified Google credentials are configured, Google prototype profiles can sync supported demo state through the server profile store. This is prototype sync, not a production account service.",
  },
];

const principles = hearstGrowthPrinciples.map((principle) => ({
  ...principle,
  evidence: `Signals: ${principle.signals.charAt(0).toLowerCase()}${principle.signals.slice(1)}`,
}));

function formatPrincipleNumber(number: string) {
  return String(Number(number));
}

const destinationPromises = streams.map((stream) => ({
  ...stream,
  copy: stream.name === "Local News"
    ? `${totalTVStations} TV station records and ${totalNewspapers} newspaper records in the configured source lists.`
    : stream.name === "A&E Family"
      ? `${totalEntertainmentChannels} configured channel routes. This is not a show inventory.`
      : stream.copy,
}));

const stack = [
  ["Experience", "Next.js 16, React 19, TypeScript, and Tailwind CSS 4"],
  ["Design system", "Hearst Design System foundations, semantic tokens, publication themes, and shared components"],
  ["Editorial supply", "Checked-in image-backed magazine RSS snapshots, configured TV and newspaper source frameworks, channel-story sources, canonical URLs, source dates, images, and bylines"],
  ["Recommendations", "Read-only Personalize article and video candidates with explainable additive ranking"],
  ["Media", "Responsive editorial images, galleries, native HLS, and an hls.js fallback for adaptive video"],
  ["Delivery", "Progressive server payloads, demand-driven catalog pages, cached article resolution, and Netlify"],
  ["Quality", "Type checks, Node unit tests, Storybook, feed validation, accessibility checks, and production smoke tests"],
  ["Prototype state", "Browser-local interests, saves, history, return context, and vendor-neutral product events"],
];

const stakeholderValue = [
  {
    audience: "Readers",
    value: "One dependable place for useful stories, local updates, shows, and communities across the interests they already have.",
    evidence: "Return behavior, useful sessions, saves, follows, station and newspaper choices, show opens, completion, and recommendation feedback.",
  },
  {
    audience: "Editorial brands",
    value: "Qualified discovery from adjacent intent while each magazine, station, newspaper, and channel keeps visible source authority.",
    evidence: "Cross-source discovery, follows, downstream reading, local source selection, show-page opens, and repeat engagement by source.",
  },
  {
    audience: "Hearst",
    value: "A direct portfolio relationship organized around reader needs rather than isolated publication, station, newspaper, or channel visits.",
    evidence: "Source breadth, retained readers, portfolio depth, registrations, membership conversion, and incremental value versus existing traffic.",
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
      `${totalStories} image-backed public story records in the checked-in snapshot across ${totalBrands} publication brands`,
      `${totalTVStations} Hearst TV station records, ${totalNewspapers} newspaper publication records, and ${totalEntertainmentChannels} configured entertainment channel routes`,
      "Destination and brand routes, saved items, search, video, gallery, and in-app reader flows",
      "A typed browser event contract; this prototype does not send these events to an analytics vendor",
    ],
  },
  {
    title: "Required for production",
    items: [
      "Production identity, consent, retention, deletion, and cross-device preference services",
      "Scheduled magazine, TV, newspaper, and channel-story ingestion with freshness monitoring, incident ownership, and rollback controls",
      "Production analytics collection, experiments, dashboards, and calibrated ranking outcomes across sources, local markets, and shows",
      "Editorial governance, brand-owner review, local-news review, abuse controls, rights checks, and a proven commercial model",
    ],
  },
];

function DailyEditionPreview() {
  return <StoryCard storyId="delish-food-news-a74237374-jimmy-johns-picklewich-pickle-pals-2026" />;
}

function PrincipleCycle() {
  return (
    <div className="grid gap-8 bg-card p-5 shadow-sm lg:grid-cols-[0.86fr_1.14fr] lg:p-8">
      <div className="bg-[var(--hp-utility-bar)] p-5 text-primary-foreground sm:p-7">
        <div
          className="relative mx-auto aspect-square max-w-[430px]"
          aria-label="Hearst+ principle loop: acquire and understand, activate and engage, learn and expand, then repeat"
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 420 420"
          >
            <circle
              cx="210"
              cy="210"
              fill="none"
              r="135"
              stroke="currentColor" strokeOpacity="0.16"
              strokeWidth="2"
            />
            <path
              d="M210 75 A135 135 0 0 1 327 277"
              fill="none"
              stroke="var(--hp-logo)"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path
              d="M327 277 A135 135 0 0 1 93 277"
              fill="none"
              stroke="var(--hp-logo)"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path
              d="M93 277 A135 135 0 0 1 210 75"
              fill="none"
              stroke="var(--hp-logo)"
              strokeLinecap="round"
              strokeWidth="12"
            />
          </svg>
          {principles.map((principle, index) => {
            const positions = [
              "left-1/2 top-[12%] -translate-x-1/2",
              "right-[15%] top-[66%] -translate-y-1/2",
              "left-[15%] top-[66%] -translate-y-1/2",
            ];
            return (
              <div key={principle.number} className={`absolute z-10 ${positions[index]}`}>
                <span
                  className="grid h-16 w-16 place-items-center rounded-full border-4 border-primary-foreground/80 bg-primary-foreground text-base font-black text-[var(--hp-utility-bar)] shadow-lg"
                >
                  {formatPrincipleNumber(principle.number)}
                </span>
              </div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/15 bg-primary-foreground/10 p-5 text-center shadow-[var(--hp-shadow-card)] backdrop-blur-sm">
            <div>
              <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-[var(--hp-logo)]">
                Reader loop
              </span>
              <p className="mt-2 text-sm font-bold leading-5 text-primary-foreground">
                1 to 2 to 3, then back smarter.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-px bg-primary-foreground/15 sm:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.number} className="bg-primary-foreground/10 p-3">
              <span className="block text-xs font-black text-primary-foreground">
                {formatPrincipleNumber(principle.number)}
              </span>
              <span className="mt-1 block text-[11px] font-bold uppercase leading-4 tracking-[0.1em] text-primary-foreground/80">
                {principle.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ol className="grid gap-px bg-border">
        {principles.map((principle) => (
          <li key={principle.number} className="bg-muted p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--hp-utility-bar)] text-xs font-black text-primary-foreground"
              >
                {formatPrincipleNumber(principle.number)}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-2xl leading-none">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{principle.copy}</p>
                <p className="mt-4 border-t border-border pt-3 text-xs font-semibold leading-5 text-muted-foreground">
                  {principle.evidence}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function WhyHearstPlusPage() {
  return (
    <div className="min-h-screen overflow-x-clip hearst-plus-theme hearst-plus-strategy-document bg-background text-foreground">
      <ProductHeader current="value" />
      <main>
        <section className="overflow-hidden bg-[var(--hp-utility-bar)] text-primary-foreground">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-16 md:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-x-12 lg:gap-y-10 lg:py-24">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--hp-logo)]">
                Direct relationship. Daily habit. Paid upgrade path.
              </p>
              <h1 className="mt-6 max-w-3xl text-balance font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                A cross-brand reader product, with source attribution intact.
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-primary-foreground/80">
                The product hypothesis is that readers may return more often when stories, local sources and entertainment are available in one reader experience. The prototype demonstrates parts of that experience. It does not establish retention, registration lift, or willingness to pay.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/hearst-plus/"
                  className="bg-card px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
                >
                  Open today&apos;s edition
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-primary-foreground/50 px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:border-primary-foreground hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
                >
                  See how it works
                </Link>
              </div>
            </div>
            <div className="min-w-0 self-center border border-primary-foreground/15 bg-primary-foreground/5 p-3 sm:p-5">
              <DailyEditionPreview />
            </div>
            <div className="grid min-w-0 gap-px bg-primary-foreground/15 md:grid-cols-3 lg:col-span-2">
              {heroStrategy.map((item) => (
                <article key={item.label} className="min-w-0 bg-primary-foreground/10 p-5 md:p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--hp-logo)]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-primary-foreground/80">{item.copy}</p>
                </article>
              ))}
            </div>
            <div className="grid min-w-0 gap-px bg-primary-foreground/15 md:grid-cols-3 lg:col-span-2">
              {[
                ["Browse", "Open discovery in the prototype"],
                ["Demo profile", "Interests and saved items in this browser"],
                ["Membership", "Possible offer; payment and entitlements are not implemented"],
              ].map(([tier, value]) => (
                <div key={tier} className="min-w-0 bg-primary-foreground/10 px-5 py-4">
                  <span className="block text-sm font-bold text-primary-foreground">{tier}</span>
                  <span className="mt-1 block text-xs leading-5 text-primary-foreground/80">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-b border-border bg-card">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <h2 className="max-w-xl text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                  Example reader flow
                </h2>
                <p className="mt-6 max-w-[62ch] text-pretty leading-7 text-muted-foreground">
                  This is a product hypothesis, not a measured outcome. The prototype lets reviewers inspect the river, open a source story, and change browser-local interests or saved items. It does not establish daily return behavior.
                </p>
              </div>
              <ol className="border-t-2 border-primary">
                {habitSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_0.75fr_1.25fr] sm:items-start"
                  >
                    <span className="text-sm font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{step.copy}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">The Hearst+ principles</p>
                <h2 className="mt-5 max-w-xl text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                  A relationship that compounds, not a feed that forgets.
                </h2>
              </div>
              <p className="max-w-[70ch] text-pretty leading-7 text-muted-foreground">
                The principles below are design goals. No retention result or portfolio-wide learning loop has been measured in this prototype. Reader controls currently change local demo state; analytics events are not sent to a vendor.
              </p>
            </div>
            <div className="mt-12">
              <PrincipleCycle />
            </div>
            <div className="mt-6 border border-border bg-card px-6 py-5 text-sm leading-6 text-foreground/80 shadow-sm">
              <strong className="text-primary">The guardrail:</strong> Hearst+ should become more useful because readers choose to return—not because the product creates pressure, hides control, or treats every interaction as a conversion.
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="max-w-4xl">
              <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                Interests cross publication, local, and entertainment lines. Hearst has the depth to follow them.
              </h2>
              <p className="mt-6 max-w-[70ch] text-pretty leading-7 text-foreground/80">
                A reader planning dinner may also need shopping advice, wellness guidance, a local update, or a show to watch tonight. Hearst+ organizes that breadth around the reader while keeping every source unmistakable.
              </p>
            </div>
            <div className="mt-12 grid gap-px bg-border md:grid-cols-2 xl:grid-cols-3">
              {destinationPromises.map((destination) => (
                <article key={destination.name} className="bg-card p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: destination.color }}>Configured section</p>
                  <h3 className="mt-3 font-serif text-3xl leading-none">{destination.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{destination.copy}</p>
                </article>
              ))}
            </div>
            <BrandLogoMarquee />
          </div>
        </section>

        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                Magazine brands, local sources, newspapers, and channels stay visible inside one system.
              </h2>
              <p className="max-w-[70ch] text-pretty leading-7 text-muted-foreground">
                Shared product infrastructure does not require generic presentation. Logos, typography, colors, routes, bylines, station identity, newspaper mastheads, channel branding, show pages, and source links preserve the trust each source has earned.
              </p>
            </div>
            <div className="mt-12">
              <BrandPortfolioGrid compact />
            </div>
            <div className="mt-8 grid gap-px bg-border md:grid-cols-4">
              {[
                [`${totalBrands}`, "magazine brands"],
                [`${totalTVStations}`, "TV stations"],
                [`${totalNewspapers}`, "newspapers"],
                [`${totalEntertainmentChannels}`, "entertainment channels"],
              ].map(([value, label]) => (
                <div key={label} className="bg-muted p-5">
                  <strong className="font-serif text-4xl leading-none">{value}</strong>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-primary">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="max-w-4xl">
              <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                A working reader product, built on reusable foundations.
              </h2>
              <p className="mt-6 max-w-[72ch] text-pretty leading-7 text-muted-foreground">
                The prototype combines a validated magazine catalog, local TV and newspaper feed frameworks, entertainment channel-story sources, current recommendation candidates, explainable ranking, progressive delivery, accessible interaction patterns, and source-aware theming. The architecture is designed to improve once across the portfolio.
              </p>
            </div>
            <div className="mt-12">
              <ArchitectureFlow />
            </div>
            <div className="mt-6 grid gap-px bg-border md:grid-cols-2">
              {stack.map(([title, copy]) => (
                <div key={title} className="grid gap-3 bg-card p-5 sm:grid-cols-[8rem_1fr]">
                  <h3 className="text-sm font-bold text-primary">{title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
              <div>
                <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                  What stakeholders can evaluate.
                </h2>
                <p className="mt-6 max-w-[62ch] text-pretty leading-7 text-muted-foreground">
                  These are candidate measures for a future instrumented release. The prototype does not collect production analytics or establish outcomes against them.
                </p>
              </div>
              <div className="border-t-2 border-primary">
                {stakeholderValue.map((item) => (
                  <article
                    key={item.audience}
                    className="grid gap-4 border-b border-border py-6 md:grid-cols-[9rem_1fr_1fr]"
                  >
                    <h3 className="font-bold">{item.audience}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{item.value}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      <strong className="text-primary">Proposed measure, not instrumented: </strong>
                      {item.evidence}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <div className="max-w-4xl">
              <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em]">
                Clear about what exists, and what must come next.
              </h2>
              <p className="mt-6 max-w-[72ch] text-pretty leading-7 text-foreground/80">
                Hearst+ is a working reader prototype, not a claim of production readiness. This distinction matters for identity, privacy, measurement, editorial operations, and investment decisions.
              </p>
            </div>
            <div className="mt-12 grid gap-px bg-border lg:grid-cols-2">
              {prototypeTruth.map((group, index) => (
                <article key={group.title} className={index === 0 ? "bg-card p-7" : "bg-[var(--hp-utility-bar)] p-7 text-primary-foreground"}>
                  <h3 className="font-serif text-3xl leading-none">{group.title}</h3>
                  <ul className={`mt-6 space-y-4 text-sm leading-6 ${index === 0 ? "text-muted-foreground" : "text-primary-foreground/80"}`}>
                    {group.items.map((item) => (
                      <li key={item} className="grid grid-cols-[1rem_1fr] gap-3">
                        <span aria-hidden="true" className={index === 0 ? "text-primary" : "text-[var(--hp-logo)]"}>●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--hp-utility-bar)] text-primary-foreground">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-20 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
            <div>
              <h2 className="max-w-4xl text-balance font-serif text-5xl leading-none tracking-[-0.03em] sm:text-6xl">
                Review the current prototype flows.
              </h2>
              <p className="mt-6 max-w-[68ch] text-pretty leading-7 text-primary-foreground/80">
                Open the prototype to inspect destination routes, the story river, browser-local reader actions, and stakeholder controls. A linked source story opens on its publisher site.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/hearst-plus/" className="bg-card px-5 py-3 text-sm font-bold text-primary">
                Open Hearst+
              </Link>
              <Link href="/hearst-plus/?demo=1" className="border border-primary-foreground/60 px-5 py-3 text-sm font-bold text-primary-foreground">
                Open stakeholder demo
              </Link>
              <Link href="/hearst-product-blueprint/" className="border border-primary-foreground/60 px-5 py-3 text-sm font-bold text-primary-foreground">
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
