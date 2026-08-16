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
  totalEntertainmentShows,
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
  return <div className="min-h-screen overflow-x-clip bg-[#F8FAFC] text-[#102A43]">
    <ProductHeader current="story" />
    <main>
      <section className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
          <div><p className="mb-6 text-xs font-black uppercase tracking-[0.22em] text-[#2D75B9]">The product story</p><h1 className="max-w-3xl font-serif text-6xl leading-[.92] tracking-[-0.04em] md:text-8xl">One destination.<br/><em className="text-[#2D75B9]">Every interest.</em></h1><p className="mt-8 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">Hearst+ brings magazine stories, local TV stations, newspapers, A&amp;E Family shows, channel stories and playable video into one reader-facing daily edition. Transparent ranking balances freshness, popularity, reader signals, local source choice and variety while every source keeps its identity.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/hearst-plus/" className="bg-[#2D75B9] px-5 py-3 text-sm font-bold text-white">Experience the prototype</Link><a href="#vision" className="border border-slate-300 px-5 py-3 text-sm font-bold">Read the story</a></div></div>
          <div className="relative py-8"><div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-[#2D75B9]" />{streams.map((s,i)=><div key={s.name} className={`relative z-10 mb-4 flex ${i%2 ? "justify-end" : "justify-start"}`}><div className="w-[78%] border border-t-4 border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(16,42,67,.1)]" style={{borderTopColor:s.color}}><strong>{s.name}</strong><p className="mt-1 text-xs leading-5 text-slate-500">{s.copy}</p></div></div>)}</div>
        </div>
      </section>

      <section id="vision" className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2D75B9]">The opportunity</p><h2 className="mt-4 font-serif text-5xl leading-none">From a portfolio to a daily relationship.</h2><p className="mt-6 max-w-[70ch] leading-7 text-slate-600">Readers arrive with needs, curiosities and ambitions rather than a publisher directory. Hearst+ organizes trusted editorial, local reporting, entertainment discovery, shopping utility and community context around those moments, then keeps the source clear on every story, video and show.</p></div><DemoNav /></div></section>

      <section className="border-y border-slate-200 bg-white py-20 lg:py-28"><div className="mx-auto max-w-[1360px] px-5 md:px-10"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2D75B9]">How the portfolio unites</p><h2 className="mt-4 font-serif text-5xl leading-none">Six sections feed one daily relationship.</h2><p className="mt-6 leading-7 text-slate-600">The product keeps the portfolio legible for stakeholders and useful for readers. Lifestyle, Autos, Fashion &amp; Luxury, Enthusiast &amp; Wellness, Local News and A&amp;E Family each retain source meaning, while the unified river can assemble the best next story, video or show for the reader&apos;s current intent.</p></div><DestinationConvergence /></div></div></section>

      <section className="border-y border-slate-200 bg-white py-20 lg:py-28"><div className="mx-auto max-w-[1360px] px-5 md:px-10"><div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2D75B9]">Current product proof</p><h2 className="mt-4 font-serif text-5xl leading-none">What Hearst+ can demonstrate now.</h2><p className="mt-6 max-w-[70ch] leading-7 text-slate-600">The app is no longer just a magazine feed demo. It now shows how one Hearst+ relationship can connect magazine brands, local TV stations, newspapers, A&amp;E Family channels, show discovery, communities, shopping, video and in-app reading without sending users out to separate destinations.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{productProof.map((item)=><article key={item.title} className="border border-slate-200 bg-[#F8FAFC] p-4"><h3 className="text-sm font-black uppercase tracking-[.12em] text-[#2D75B9]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.copy}</p></article>)}</div><div className="mt-6 border border-slate-200 p-5"><h3 className="text-sm font-black uppercase tracking-[.12em] text-slate-900">Production path still required</h3><ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">{productionPath.map((item)=><li key={item} className="border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">{item}</li>)}</ul></div></div><div><div className="grid gap-px bg-slate-200 sm:grid-cols-2">{prototypeStats.map((stat)=><article key={stat.label} className="bg-[#F8FAFC] p-6"><strong className="font-serif text-5xl leading-none">{stat.value}</strong><p className="mt-3 text-sm font-black uppercase tracking-[.14em] text-[#2D75B9]">{stat.label}</p><p className="mt-3 text-sm leading-6 text-slate-600">{stat.copy}</p></article>)}</div><p className="mt-5 text-sm leading-6 text-slate-500">These counts are read from the same source modules that power the app surfaces, so this page follows the current portfolio inventory instead of a separate hand-written snapshot.</p></div></div></div></section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-10 lg:grid-cols-[.55fr_1.45fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2D75B9]">Source representation</p><h2 className="mt-4 font-serif text-5xl leading-none">Every source stays recognizable inside the larger destination.</h2><p className="mt-6 leading-7 text-slate-600">These sources matter to stakeholders because each one carries its own audience, authority and commercial promise. The prototype uses brand SVG logos on magazine routes, station and newspaper marks on Local News, channel identities across A&amp;E Family, source-aware color and visible attribution on cards so the portfolio feels united without flattening identity.</p><p className="mt-5 leading-7 text-slate-600">The benefit of uniting them is simple: readers can start with a need instead of a site name, while each source gains discovery from adjacent intent. Home, shopping, wellness, style, autos, culture, fitness, local utility and entertainment fandom can cross-pollinate when the reader&apos;s context makes that useful.</p></div><BrandPortfolioGrid /></div></section>

      <section className="bg-[#102A43] py-20 text-white lg:py-28"><div className="mx-auto max-w-[1360px] px-5 md:px-10"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.2em] text-sky-300">The daily habit</p><h2 className="mt-4 font-serif text-5xl leading-none md:text-6xl">A journey that gets more useful, not more demanding.</h2></div><div className="mt-12 grid gap-px bg-white/20 md:grid-cols-3">{journeys.map((j,i)=><article key={j.title} className="bg-[#102A43] p-7"><span className="text-sm text-sky-300">0{i+1}</span><h3 className="mt-16 text-xl font-bold">{j.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{j.copy}</p></article>)}</div></div></section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2D75B9]">User journeys</p><h2 className="mt-4 font-serif text-5xl leading-none">The habit loop is visible, not hidden in a model.</h2><p className="mt-6 leading-7 text-slate-600">The destination should be explainable to product, editorial and business teams. Each journey turns reader action into a clearer next visit, while preserving controls such as save, follow, hide, station choice, newspaper choice, show interest and clear.</p></div><JourneyMatrix /></div></section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-12 lg:grid-cols-2 lg:items-start"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2D75B9]">Personal by design</p><h2 className="mt-4 max-w-xl font-serif text-5xl leading-none">The reader teaches the river through visible actions.</h2><p className="mt-6 max-w-xl leading-7 text-slate-600">The system starts with popularity, source freshness and an editorial baseline, then responds to follows, saves, hides, More Like This choices, local preferences and show interests. Daypart and return context help the edition change without pretending the prototype has a hidden behavioral profile.</p><div className="mt-8 space-y-4">{["Cold start uses popularity, freshness and an editorial starting point","Reader signals add explicit points instead of replacing editorial judgment","A final pass prevents one source or topic from dominating the river","The score explanation shows why the current lead won"].map((x,i)=><div key={x} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-slate-200 pb-4 text-sm font-semibold"><span className="font-mono text-xs text-[#2D75B9]">0{i+1}</span>{x}</div>)}</div></div><div className="grid gap-4 sm:grid-cols-2"><StoryCard/><StoryCard ad/></div></div></section>

      <section className="border-y border-slate-200 bg-white py-20 lg:py-28"><div className="mx-auto max-w-[1360px] px-5 md:px-10"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2D75B9]">Value exchange</p><h2 className="mt-4 font-serif text-5xl leading-none">One experience. Four kinds of value.</h2></div><div className="grid gap-px bg-slate-200 sm:grid-cols-2">{valueProps.map((v,i)=><article key={v.title} className="bg-white p-6"><span className="font-mono text-xs text-[#2D75B9]">0{i+1}</span><h3 className="mt-8 text-lg font-bold">{v.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{v.copy}</p></article>)}</div></div></div></section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2D75B9]">Destination map</p><h2 className="mt-4 font-serif text-5xl leading-none">Many doors. One coherent system.</h2><p className="mt-6 leading-7 text-slate-600">{totalPortfolioSources} represented sources across {totalMagazineBrands} magazine brands, {totalTVStations} TV stations, {totalNewspapers} newspapers, {totalEntertainmentChannels} entertainment channels and {totalEntertainmentShows} promoted show entries.</p></div><div className="grid gap-px bg-slate-200 sm:grid-cols-2">{[["Unified river","/hearst-plus/"],["Lifestyle","/hearst-lifestyle/ · /lifestyle/[brandSlug]/"],["Autos","/hearst-autos/ · /autos/[brandSlug]/"],["Fashion & Luxury","/hearst-flux/ · /flux/[brandSlug]/"],["Enthusiast & Wellness","/hearst-ew/ · /ew/[brandSlug]/"],["Local News","/hearst-plus/local-news/ · /hearst-plus/local-news/newspapers/"],["A&E Family","/hearst-plus/entertainment/ · /hearst-plus/entertainment/stories/[channelSlug]/"],["Communities","/communities/ · /communities/[brandSlug]/"],["Shopping","/hearst-plus/shop/"],["Product strategy","/why-hearst-plus/ · /hearst-product-blueprint/"]].map(([n,r])=><div key={n} className="bg-[#F8FAFC] p-5"><span className="text-sm font-bold">{n}</span><code className="mt-2 block text-xs text-slate-500">{r}</code></div>)}</div></div><div className="mt-16 flex flex-col justify-between gap-6 border-t border-slate-300 pt-8 md:flex-row md:items-center"><div><h3 className="font-serif text-3xl">Ready for the system behind the story?</h3><p className="mt-2 text-slate-600">Explore architecture, ranking, routes, measurement and delivery.</p></div><Link href="/hearst-product-blueprint/" className="font-bold text-[#2D75B9]">Open the product blueprint</Link></div></section>
    </main><ProductFooter />
  </div>;
}
