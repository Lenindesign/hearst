import type { Metadata } from "next";
import Link from "next/link";
import {
  BrandPortfolioGrid,
  DemoNav,
  DestinationConvergence,
  JourneyMatrix,
  ProductFooter,
  ProductHeader,
  StoryCard,
  journeys,
  prototypeStats,
  streams,
  totalEntertainmentChannels,
  totalMagazineBrands,
  totalNewspapers,
  totalPortfolioSources,
  totalTVStations,
  valueProps,
} from "@/components/product-story-shell";

export const metadata: Metadata = {
  title: "The Hearst+ Product Story",
  description: "The reader promise, current product proof and production path behind Hearst+.",
};

const productProof = [
  {
    title: "Reader experience",
    copy: "Unified daily river, destination pages, brand routes, local-news feeds, A&E Family pages, communities, shopping, video, gallery and reader-modal flows.",
  },
  {
    title: "Source system",
    copy: "Magazine RSS catalogs, TV station feeds, newspaper feed records, channel-story sources, show metadata, source logos and route-aware attribution.",
  },
  {
    title: "Recommendation logic",
    copy: "Current Personalize article and video candidates, explainable ranking, freshness, source diversity, local preference and explicit reader controls.",
  },
  {
    title: "Reusable UI",
    copy: "Shared cards, rivers, nav, source menus, theme colors, logo rendering, reader controls and responsive layouts across the portfolio.",
  },
] as const;

const productionPath = [
  "Production identity, consent, account recovery, cross-device sync and preference services",
  "Scheduled feed ingestion, freshness monitoring, ownership alerts and rollback controls",
  "Analytics, experiments, subscription packaging, entitlement rules and membership conversion measurement",
  "Editorial governance, rights review, local-news QA, channel-source QA and abuse controls",
] as const;

export default function ProductStoryPage() {
  return <div className="hearst-plus-theme min-h-screen overflow-x-clip bg-background text-foreground">
    <ProductHeader current="story" />
    <main>
      <section className="overflow-hidden border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
          <div><p className="mb-6 text-xs font-black uppercase tracking-[0.16em] text-primary">Hearst+ product overview</p><h1 className="max-w-3xl font-serif text-6xl leading-[.96] tracking-[-0.03em] md:text-8xl">One reader product.<br/><em className="text-primary">Distinct sources.</em></h1><p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">The Hearst+ prototype brings magazine stories, local news sources, entertainment channels, video and communities into a shared reader experience. Each card keeps its publication attribution. Reader actions and ranking behavior shown here are prototype behavior, not production measurement.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/hearst-plus/" className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground">Open the prototype</Link><a href="#vision" className="inline-flex min-h-11 items-center rounded-md border border-border px-5 text-sm font-bold">See a sample record</a></div></div>
          <div className="relative py-8"><div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-primary" />{streams.map((s,i)=><div key={s.name} className={`relative z-10 mb-4 flex ${i%2 ? "justify-end" : "justify-start"}`}><div className="w-[78%] border border-t-4 border-border bg-card p-4 shadow-[0_8px_30px_rgba(16,42,67,.1)]" style={{borderTopColor:s.color}}><strong>{s.name}</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">{s.copy}</p></div></div>)}</div>
        </div>
      </section>

      <section id="vision" className="mx-auto max-w-[1360px] px-5 py-16 md:px-10 lg:py-20"><div className="grid items-start gap-8 lg:grid-cols-[.65fr_1.35fr]"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Sample reader experience</p><h2 className="mt-4 font-serif text-4xl leading-tight">A Delish story keeps its source and byline.</h2><p className="mt-5 max-w-[58ch] leading-7 text-muted-foreground">This example uses a public Delish record from the checked-in feed snapshot. It shows the card’s actual headline, topic, image, summary, author and reading time. Selecting it opens the original Delish article, so the example does not imply that article content is reproduced in this card.</p></div><DemoNav /></div></section>

      <section className="border-y border-border bg-card py-20 lg:py-28"><div className="mx-auto max-w-[1360px] px-5 md:px-10"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-primary">How the portfolio unites</p><h2 className="mt-4 font-serif text-5xl leading-none">Six top-level routes organize the portfolio.</h2><p className="mt-6 leading-7 text-muted-foreground">The prototype has routes for Lifestyle, Autos, Fashion &amp; Luxury, Enthusiast &amp; Wellness, Local News and A&amp;E Family. Its reader river ranks eligible stories across configured sources. No discovery or return-visit lift has been measured.</p></div><DestinationConvergence /></div></div></section>

      <section className="border-y border-border bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-5 md:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-primary">Current product proof</p>
              <h2 className="mt-4 font-serif text-5xl leading-none">What Hearst+ can demonstrate now.</h2>
              <p className="mt-6 max-w-[70ch] leading-7 text-muted-foreground">The prototype demonstrates magazine destinations, local-news source routes, entertainment channel pages, communities, shopping, video and an in-app article reader. Some routes open external publisher pages. The sample Delish card above links directly to its source article.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {productProof.map((item) => <article key={item.title} className="border border-border bg-background p-4">
                  <p className="text-sm font-black uppercase tracking-[.12em] text-primary">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.copy}</p>
                </article>)}
              </div>
            </div>
            <div className="border border-border bg-background p-5 md:p-6">
              <p className="text-sm font-black uppercase tracking-[.12em] text-foreground">Production path still required</p>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground">
                {productionPath.map((item) => <li key={item} className="border-t border-border pt-3 first:border-t-0 first:pt-0">{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {prototypeStats.map((stat) => <article key={stat.label} className="bg-background p-5 md:p-6">
                <strong className="font-serif text-5xl leading-none">{stat.value}</strong>
                <p className="mt-3 text-sm font-black uppercase tracking-[.14em] text-primary">{stat.label}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{stat.copy}</p>
              </article>)}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">Counts are derived from the checked-in RSS snapshot and configured source lists. They describe this prototype build, not live inventory or publishing coverage.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-10 lg:grid-cols-[.55fr_1.45fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-primary">Source representation</p><h2 className="mt-4 font-serif text-5xl leading-none">Source identity stays visible on each route.</h2><p className="mt-6 leading-7 text-muted-foreground">Magazine routes display publication logos and themes. Local News routes identify stations and newspaper publications. A&amp;E routes identify the configured channel. Story cards show publication attribution and link to their source where a source URL is available.</p><p className="mt-5 leading-7 text-muted-foreground">The shared navigation groups these sources by reader destination while retaining publication names, logos and source links. The prototype demonstrates this routing; it does not measure downstream discovery between brands.</p></div><BrandPortfolioGrid /></div></section>

      <section className="bg-primary py-20 text-white lg:py-28"><div className="mx-auto max-w-[1360px] px-5 md:px-10"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.2em] text-primary-foreground/80">The daily habit</p><h2 className="mt-4 font-serif text-5xl leading-none md:text-6xl">Three prototype flows reviewers can follow.</h2></div><div className="mt-12 grid gap-px bg-card/20 md:grid-cols-3">{journeys.map((j,i)=><article key={j.title} className="bg-primary p-7"><span className="text-sm text-primary-foreground/80">0{i+1}</span><h3 className="mt-16 text-xl font-bold">{j.title}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/80">{j.copy}</p></article>)}</div></div></section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-primary">User journeys</p><h2 className="mt-4 font-serif text-5xl leading-none">Reader actions and current prototype behavior.</h2><p className="mt-6 leading-7 text-muted-foreground">The table names the route and action represented by each flow. Reader actions shown in the prototype use browser-local state and are not production-account changes.</p></div><JourneyMatrix /></div></section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-12 lg:grid-cols-2 lg:items-start"><div><p className="text-xs font-black uppercase tracking-[.2em] text-primary">Personal by design</p><h2 className="mt-4 max-w-xl font-serif text-5xl leading-none">The reader teaches the river through visible actions.</h2><p className="mt-6 max-w-xl leading-7 text-muted-foreground">The ranking function uses source popularity, publication recency, selected interests, saves, More Like This actions, daypart and return context. The adjacent example shows one calculated case using a stated sample profile. It is prototype logic, not a production ranking outcome.</p><div className="mt-8 space-y-4">{["Cold start uses popularity, freshness and an editorial starting point","Reader signals add explicit points instead of replacing editorial judgment","A final pass prevents one source or topic from dominating the river","The score explanation shows why the current lead won"].map((x,i)=><div key={x} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-border pb-4 text-sm font-semibold"><span className="font-mono text-xs text-primary">0{i+1}</span>{x}</div>)}</div></div><div className="grid gap-4 sm:grid-cols-2"><StoryCard/><StoryCard ad/></div></div></section>

      <section className="border-y border-border bg-card py-20 lg:py-28"><div className="mx-auto max-w-[1360px] px-5 md:px-10"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-primary">Value exchange</p><h2 className="mt-4 font-serif text-5xl leading-none">What each stakeholder can review in this build.</h2></div><div className="grid gap-px bg-border sm:grid-cols-2">{valueProps.map((v,i)=><article key={v.title} className="bg-card p-6"><span className="font-mono text-xs text-primary">0{i+1}</span><h3 className="mt-8 text-lg font-bold">{v.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{v.copy}</p></article>)}</div></div></div></section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-primary">Destination map</p><h2 className="mt-4 font-serif text-5xl leading-none">Routes and configured source entries in this build.</h2><p className="mt-6 leading-7 text-muted-foreground">{totalPortfolioSources} configured or snapshot-backed source entries: {totalMagazineBrands} magazine brands, {totalTVStations} TV station records, {totalNewspapers} newspaper records and {totalEntertainmentChannels} entertainment channel routes. The count is not a count of active live feeds or shows.</p></div><div className="grid gap-px bg-border sm:grid-cols-2">{[["Unified river","/hearst-plus/"],["Lifestyle","/hearst-lifestyle/ · /lifestyle/[brandSlug]/"],["Autos","/hearst-autos/ · /autos/[brandSlug]/"],["Fashion & Luxury","/hearst-flux/ · /flux/[brandSlug]/"],["Enthusiast & Wellness","/hearst-ew/ · /ew/[brandSlug]/"],["Local News","/hearst-plus/local-news/ · /hearst-plus/local-news/newspapers/"],["A&E Family","/hearst-plus/entertainment/ · /hearst-plus/entertainment/stories/[channelSlug]/"],["Communities","/communities/ · /communities/[brandSlug]/"],["Shopping","/hearst-plus/shop/"],["Product strategy","/why-hearst-plus/ · /hearst-product-blueprint/"]].map(([n,r])=><div key={n} className="bg-background p-5"><span className="text-sm font-bold">{n}</span><code className="mt-2 block text-xs text-muted-foreground">{r}</code></div>)}</div></div><div className="mt-16 flex flex-col justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center"><div><h3 className="font-serif text-3xl">Review the product implementation details.</h3><p className="mt-2 text-muted-foreground">Explore architecture, ranking, routes, measurement and delivery.</p></div><Link href="/hearst-product-blueprint/" className="font-bold text-primary">Open the product blueprint</Link></div></section>
    </main><ProductFooter />
  </div>;
}
