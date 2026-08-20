import type { Metadata } from "next";
import Link from "next/link";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";

export const metadata: Metadata = {
  title: "Hearst+ Ad Logic",
  description: "How contextual advertising is selected and placed in the Hearst+ prototype.",
};

const matchingInputs = [
  ["Active context", "The current destination and active section or topic filter scope the available ad set."],
  ["Reader signals", "Followed topics, saved tags and boosted tags add weight when they overlap an ad's topics or tags."],
  ["Time of day", "The selected daypart contributes preferred topics and tags to the match."],
  ["Story neighborhood", "Nearby stories add weight for shared topics and tags, keeping the creative aligned with the surrounding river."],
];

const boundaries = [
  ["Implemented", "Destination-scoped ad catalogs, contextual scoring, recurring river placement, disclosure labels and no-inventory handling."],
  ["Prototype data", "Creative, sponsor, topic, tag, palette and image metadata are defined in the prototype catalog; images come from the configured Hearst CDN set."],
  ["Still required for production", "Ad server integration, consent and privacy controls, campaign management, impression/click measurement, frequency capping and revenue reporting."],
];

const availableAdSet = [
  ["Summer Home Refresh", "Hearst Market", ["Home", "Shopping"]],
  ["Tonight's Dinner Plan", "Delish Selects", ["Food", "Food Drinks"]],
  ["Sleep Better Tonight", "Prevention Wellness", ["Wellness"]],
  ["The 10-Minute Beauty Counter", "Cosmo Beauty Lab", ["Style", "Shopping"]],
  ["Weekend Garden List", "Country Living Finds", ["Home", "Shopping"]],
  ["Hosting Without the Guesswork", "Good Housekeeping Tested", ["Home", "Food"]],
  ["Small-Space Fixes", "House Beautiful Studio", ["Home", "Shopping"]],
  ["Back-to-School Style Drop", "Seventeen Style", ["Style", "Shopping"]],
  ["Family Meal Shortcut", "Woman's Day Kitchen", ["Food", "Family"]],
  ["Cozy Kitchen Collection", "Pioneer Woman Picks", ["Food", "Home"]],
  ["Know the Best Price to Buy", "Car and Driver Marketplace", ["Buying Guides", "Reviews"]],
  ["EV Charging, Matched to Your Garage", "ChargePoint", ["EVs", "Buying Guides"]],
  ["Find the Right Performance Tire", "Michelin Garage", ["Reviews", "Performance"]],
  ["Auction Watchlist", "Collector Watch", ["Classics", "Auctions"]],
  ["Build the Home Garage", "Craftsman Pro", ["Trucks", "Classics"]],
  ["Collector Coverage Check", "Hagerty", ["Classics", "Auctions"]],
  ["Your Racing Weekend", "TrackPass", ["Racing", "Performance"]],
  ["Weekend Detail Kit", "Meguiar's", ["Buying Guides", "Classics"]],
  ["Know Your Monthly Number", "Auto Finance Desk", ["Buying Guides", "Reviews"]],
  ["Truck Bed and Cabin Protection", "WeatherTech", ["Trucks", "Buying Guides"]],
  ["Performance Parts Finder", "Summit Racing", ["Performance", "Racing"]],
  ["The Designer Sale Watch", "Luxury Edit", ["Style", "Shopping"]],
  ["Build a Summer Beauty Wardrobe", "Beauty Counter", ["Beauty", "Style"]],
  ["Your Culture Weekend", "Culture Pass", ["Culture", "Events"]],
  ["A Better Room Starts With Texture", "Design Materials", ["Design", "Shopping"]],
  ["The Long Weekend List", "Town & Country Travel", ["Travel", "Culture"]],
  ["Jewelry and Watch Radar", "Fine Objects", ["Shopping", "Style"]],
  ["Sharper Summer Dressing", "Esquire Shop", ["Style", "Shopping"]],
  ["Garden Party Checklist", "Veranda Entertains", ["Design", "Events"]],
  ["The Event Lookbook", "Red Carpet Desk", ["Events", "Style"]],
  ["Find Your Design Direction", "Elle Decor Studio", ["Design"]],
  ["Find Your Next Running Shoe", "Runner's Lab", ["Fitness", "Gear"]],
  ["Build a Smarter Home Gym", "Garage Gym Builder", ["Fitness", "Gear"]],
  ["Dial In Your Bike Fit", "Bicycling Fit Studio", ["Gear", "Adventure"]],
  ["Recovery That Fits Your Routine", "Recovery Desk", ["Wellness", "Fitness"]],
  ["Gear That Solves the Problem", "Popular Mechanics Tested", ["Tech", "Gear"]],
  ["Nutrition for the Next Goal", "Fuel Plan", ["Nutrition", "Wellness"]],
  ["Weekend Adventure Pack", "Trail Kit", ["Adventure", "Gear"]],
  ["Your Next Health Check", "Health Navigator", ["Wellness", "Life"]],
  ["Track What Actually Matters", "Wearable Lab", ["Tech", "Fitness"]],
  ["A Better Night Routine", "Oprah Daily Life", ["Life", "Wellness"]],
] as const;

export default function AdLogicPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8FAFC] text-[#102A43]">
      <ProductHeader current="ads" />
      <main>
        <section className="border-b border-slate-200 bg-[#102A43] text-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[.22em] text-sky-300">Hearst+ product logic</p>
            <h1 className="mt-6 max-w-4xl font-serif text-6xl leading-[.94] tracking-[-.04em] md:text-8xl">Contextual ads that belong in the reader’s session.</h1>
            <p className="mt-10 max-w-2xl border-t border-white/20 pt-8 text-lg leading-8 text-slate-300">
              This page documents the ad selection and placement behavior currently implemented in the Hearst+ prototype. It is an explainable matching layer, not a connected ad-server integration.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1360px] px-5 py-16 md:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="self-start lg:sticky lg:top-6">
              <p className="mb-5 text-xs font-black uppercase tracking-[.18em] text-[#2D75B9]">On this page</p>
              <nav className="space-y-1" aria-label="Ad logic sections">
                {["How it matches", "Where it appears", "What is connected"].map((label, index) => (
                  <a key={label} href={`#section-${index + 1}`} className="flex gap-3 border-t border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:text-[#2D75B9]">
                    <span className="text-slate-400">0{index + 1}</span>{label}
                  </a>
                ))}
              </nav>
              <Link href="/hearst-plus/" className="mt-8 inline-flex text-sm font-bold text-[#2D75B9]">Open prototype</Link>
            </aside>

            <div className="min-w-0 space-y-20">
              <section id="section-1" className="scroll-mt-8">
                <p className="text-xs font-black uppercase tracking-[.18em] text-[#2D75B9]">01 · How it matches</p>
                <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-[-.03em] md:text-6xl">The strongest contextual signals rise to the top.</h2>
                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">Each destination has an eligible ad set. The prototype scores every eligible unit against the current reader context, then chooses the highest-ranked result with a stable tie-breaker.</p>
                <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-2">
                  {matchingInputs.map(([title, copy]) => (
                    <article key={title} className="bg-white p-6">
                      <h3 className="text-sm font-bold">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section id="section-2" className="scroll-mt-8">
                <p className="text-xs font-black uppercase tracking-[.18em] text-[#2D75B9]">02 · Where it appears</p>
                <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-[-.03em] md:text-6xl">A clear ad slot, spaced through the river.</h2>
                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">Sponsored units enter the river every five cards. The same contextual logic can also select a desktop reader-rail unit when the current story has eligible destination inventory.</p>
                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                  {[
                    ["River placement", "Units enter after editorial cards 5, 10, 15 and so on as the progressive river grows."],
                    ["Reader rail", "Desktop article readers can receive a destination-scoped contextual unit in the right rail."],
                    ["Disclosure", "Rendered units are labeled Advertisement and identify the sponsor or creative treatment."],
                  ].map(([title, copy]) => (
                    <article key={title} className="border border-slate-200 bg-white p-6">
                      <h3 className="text-lg font-bold">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-8 grid gap-8 border border-slate-200 bg-white p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[.18em] text-[#2D75B9]">Next matched ad · example</p>
                    <h3 className="mt-3 text-xl font-bold">Know the Best Price to Buy</h3>
                    <p className="mt-1 text-sm text-slate-500">Car and Driver Marketplace</p>
                    <p className="mt-4 text-sm leading-6 text-slate-600">The selected unit is the highest-ranked eligible creative for the active context. The prototype also explains the score inputs and identifies the image as a dedicated ad creative outside the editorial river.</p>
                  </div>
                  <div className="min-h-36 bg-cover bg-center" role="img" aria-label="Example car and driver ad creative" style={{ backgroundImage: "url(https://hips.hearstapps.com/mtg-prod/68f7e39e42ad0d0002a0414e/003-2026-honda-crv-hybrid-sport-touring.jpg)" }} />
                </div>
                <div className="mt-8 border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-black uppercase tracking-[.18em] text-[#2D75B9]">Available Hearst magazines ad set</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">The prototype catalog contains destination-scoped units across Lifestyle, Autos, Fashion &amp; Luxury, and Enthusiast &amp; Wellness. Each card carries sponsor, topic, tag, creative, and image metadata used by the matcher.</p>
                  <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {availableAdSet.map(([title, sponsor, topics]) => (
                      <article key={title} className="border border-slate-200 bg-white p-3">
                        <h3 className="text-sm font-bold leading-5">{title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{sponsor}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {topics.map((topic) => <span key={topic} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold">{topic}</span>)}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
                <p className="mt-6 border-l-2 border-[#2D75B9] pl-5 text-sm leading-6 text-slate-600">When an eligible ad set is empty, the renderer returns no unit rather than inventing a fallback creative.</p>
              </section>

              <section id="section-3" className="scroll-mt-8">
                <p className="text-xs font-black uppercase tracking-[.18em] text-[#2D75B9]">03 · What is connected</p>
                <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-[-.03em] md:text-6xl">A transparent prototype boundary.</h2>
                <div className="mt-10 grid gap-px bg-slate-200">
                  {boundaries.map(([title, copy]) => (
                    <div key={title} className="grid gap-3 bg-white p-6 md:grid-cols-[12rem_minmax(0,1fr)]">
                      <h3 className="text-sm font-bold">{title}</h3>
                      <p className="text-sm leading-6 text-slate-600">{copy}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <ProductFooter />
    </div>
  );
}
