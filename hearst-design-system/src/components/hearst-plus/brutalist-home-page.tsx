"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LifestyleRiverImage } from "@/components/hearst-plus/story-presentation";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { SiteFooter } from "@/components/fre/site-footer";
import { getLifestyleImagePosition } from "@/components/hearst-plus/story-presentation";
import { Menu, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { getHearstStoryRoute } from "@/lib/story-routes";

const homeHref = "/hearst-plus/brutalist-home/";

const sections = [
  { label: "Style", href: "/hearst-flux/style/" },
  { label: "Wellness", href: "/hearst-ew/wellness/" },
  { label: "Food", href: "/hearst-lifestyle/food/" },
  { label: "Home & Garden", href: "/hearst-lifestyle/home/" },
  { label: "Travel", href: "/hearst-lifestyle/" },
  { label: "Cars", href: "/hearst-autos/" },
  { label: "Culture", href: "/hearst-plus/entertainment/" },
  { label: "Shopping", href: "/hearst-lifestyle/shopping/" },
];

const topicTiles = [
  { label: "At Home", description: "Make it cozy this season", href: "/hearst-lifestyle/home/", color: "bg-[#ffec00] text-black" },
  { label: "Food", description: "Comfort meals and easy recipes", href: "/hearst-lifestyle/food/", color: "bg-[#ef272c] text-white" },
  { label: "Wellness", description: "Feel your best this fall", href: "/hearst-ew/wellness/", color: "bg-[#ffec00] text-black" },
  { label: "Style", description: "The pieces you’ll wear now", href: "/hearst-flux/style/", color: "bg-[#071a30] text-white" },
  { label: "Cars", description: "Road trips worth taking", href: "/hearst-autos/", color: "bg-[#1675dc] text-white" },
];

function storyHref(story: LifestyleRiverStory) {
  return `${getHearstStoryRoute(story)}?from=${encodeURIComponent(homeHref)}`;
}

function storyDate(story: LifestyleRiverStory) {
  if (!story.publishedAt) return story.readTime;
  const timestamp = Date.parse(story.publishedAt);
  if (!Number.isFinite(timestamp)) return story.readTime;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(timestamp);
}

function SectionHeading({ id, children, href }: { id: string; children: React.ReactNode; href: string }) {
  return (
    <div className="flex items-end justify-between gap-3 border-b-4 border-black pb-2">
      <h2 id={id} className="font-[family-name:var(--font-brutalist)] text-[clamp(2.5rem,4vw,4.2rem)] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        {children}
      </h2>
      <Link href={href} className="mb-1 shrink-0 text-xs font-black uppercase tracking-wide text-[#075db6] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075db6]">
        View all <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function StoryRow({ story, rank }: { story: LifestyleRiverStory; rank?: number }) {
  const isRanked = typeof rank === "number";

  return (
    <Link
      href={storyHref(story)}
      className={`group grid min-w-0 items-center gap-2 border-b border-black/45 py-2.5 text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075db6] sm:gap-3 ${isRanked ? "grid-cols-[52px_88px_minmax(0,1fr)] sm:grid-cols-[56px_112px_minmax(0,1fr)]" : "grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[88px_minmax(0,1fr)]"}`}
    >
      {isRanked ? (
        <span className={`flex aspect-square items-center justify-center font-[family-name:var(--font-brutalist)] text-4xl font-black leading-none ${rank === 1 ? "bg-[#ffec00] text-black" : rank === 2 ? "bg-[#ef272c] text-white" : "bg-[#1675dc] text-white"}`}>
          {rank}
        </span>
      ) : (
        <span className="relative aspect-square overflow-hidden bg-black/10">
          <LifestyleRiverImage story={story} className="h-full w-full" sizes="112px" objectPosition={getLifestyleImagePosition(story)} />
        </span>
      )}
      {isRanked ? (
        <span className="relative aspect-[4/3] overflow-hidden bg-black/10">
          <LifestyleRiverImage story={story} className="h-full w-full" sizes="112px" objectPosition={getLifestyleImagePosition(story)} />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block truncate text-[10px] font-black uppercase tracking-[0.12em] text-[#075db6]">{story.topic || story.brand}</span>
        <span className="mt-0.5 line-clamp-3 font-[family-name:var(--font-brutalist)] text-2xl font-bold leading-[0.9] tracking-[-0.025em] group-hover:underline sm:text-[1.75rem]">
          {story.title}
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-black/65">{story.brand} · {storyDate(story)}</span>
      </span>
    </Link>
  );
}

function TopicTile({
  tile,
  story,
}: {
  tile: (typeof topicTiles)[number];
  story?: LifestyleRiverStory;
}) {
  return (
    <Link href={tile.href} className={`group relative flex h-[104px] min-w-[218px] items-stretch overflow-hidden ${tile.color} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:min-w-0`}>
      <span className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <span className="font-[family-name:var(--font-brutalist)] text-2xl font-black uppercase leading-[0.86] tracking-[-0.04em] sm:text-3xl">{tile.label}</span>
        <span className="max-w-36 text-xs font-bold leading-tight">{tile.description}</span>
      </span>
      {story ? (
        <span className="relative my-2 mr-2 block w-[34%] shrink-0 overflow-hidden">
          <LifestyleRiverImage story={story} className="h-full w-full" sizes="160px" objectPosition={getLifestyleImagePosition(story)} />
        </span>
      ) : null}
      <span aria-hidden="true" className="absolute bottom-2 right-2 text-xl font-black">→</span>
    </Link>
  );
}

export function BrutalistHomePage({ stories }: { stories: LifestyleRiverStory[] }) {
  const heroStories = React.useMemo(() => stories.slice(0, Math.min(5, stories.length)), [stories]);
  const [activeHeroIndex, setActiveHeroIndex] = React.useState(0);
  const activeStory = heroStories[activeHeroIndex];

  const heroIds = React.useMemo(() => new Set(heroStories.map((story) => story.id)), [heroStories]);
  const discoveryStories = React.useMemo(() => stories.filter((story) => !heroIds.has(story.id)), [heroIds, stories]);
  const trendingStories = React.useMemo(
    () => [...discoveryStories].sort((a, b) => b.popularity - a.popularity).slice(0, 5),
    [discoveryStories],
  );
  const usedStoryIds = React.useMemo(() => new Set([...heroStories, ...trendingStories].map((story) => story.id)), [heroStories, trendingStories]);
  const latestStories = React.useMemo(() => {
    const remaining = discoveryStories.filter((story) => !usedStoryIds.has(story.id));
    return [...remaining].sort((a, b) => {
      const aTime = a.publishedAt ? Date.parse(a.publishedAt) : Number.NaN;
      const bTime = b.publishedAt ? Date.parse(b.publishedAt) : Number.NaN;
      if (Number.isFinite(aTime) && Number.isFinite(bTime)) return bTime - aTime;
      return a.age - b.age;
    }).slice(0, 4);
  }, [discoveryStories, usedStoryIds]);
  const finalUsedIds = React.useMemo(() => new Set([...usedStoryIds, ...latestStories.map((story) => story.id)]), [latestStories, usedStoryIds]);
  const editorPicks = React.useMemo(() => {
    const remaining = discoveryStories.filter((story) => !finalUsedIds.has(story.id));
    return [...remaining].sort((a, b) => {
      const aEditor = a.signal === "Editor Pick" ? 1 : 0;
      const bEditor = b.signal === "Editor Pick" ? 1 : 0;
      return bEditor - aEditor || b.popularity - a.popularity;
    }).slice(0, 4);
  }, [discoveryStories, finalUsedIds]);

  const topicStories = React.useMemo(() => topicTiles.map((tile) =>
    stories.find((story) => `${story.topic} ${story.title} ${story.tags.join(" ")}`.toLowerCase().includes(tile.label.toLowerCase().replace("at ", "")))
      ?? stories.find((story) => story.topic.toLowerCase().includes(tile.label.toLowerCase().replace("at ", "")))
      ?? stories[0],
  ), [stories]);

  const changeHero = (direction: -1 | 1) => {
    setActiveHeroIndex((index) => (index + direction + heroStories.length) % heroStories.length);
  };

  return (
    <div className="hearst-plus-theme hearst-brutalist-home min-h-screen bg-white text-[#090d14] [--font-brutalist:'Barlow_Condensed',var(--font-schibsted-grotesk),sans-serif]" data-brutalist-home>
      <header className="relative z-20 border-b-4 border-black bg-[#ffec00] text-black">
        <div className="mx-auto grid min-h-[82px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:px-6">
          <details className="group relative justify-self-start">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 border-2 border-black bg-black px-3 text-sm font-black uppercase tracking-wide text-[#ffec00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075db6]">
              <Menu className="h-6 w-6" aria-hidden />
              <span className="hidden sm:inline">Sections</span>
              <span className="sr-only">Explore Hearst sections</span>
            </summary>
            <nav aria-label="Explore Hearst sections" className="absolute left-0 top-full z-30 hidden w-64 border-4 border-black bg-[#ffec00] p-2 shadow-[8px_8px_0_#071a30] group-open:block">
              {sections.map((section) => (
                <Link key={section.label} href={section.href} className="block border-b-2 border-black bg-white px-3 py-2 font-[family-name:var(--font-brutalist)] text-xl font-bold uppercase hover:bg-[#071a30] hover:text-white focus-visible:outline-2 focus-visible:outline-[#075db6]">
                  {section.label}
                </Link>
              ))}
            </nav>
          </details>

          <div className="flex min-w-0 flex-col items-center">
            <Link href={homeHref} aria-label="Hearst+ brutalist editorial home" className="inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075db6]">
              <Image src="/logos/hearst-plus.svg" alt="Hearst+" width={220} height={24} priority className="h-auto w-[150px] sm:w-[210px]" />
            </Link>
            <div className="mt-1 hidden max-w-[70vw] items-center gap-3 overflow-hidden text-[8px] font-bold uppercase tracking-[0.15em] text-[#1d2937]/65 md:flex">
              <span>Good Housekeeping</span><span>ELLE</span><span>Country Living</span><span>Veranda</span><span>Prevention</span><span>Woman’s Day</span><span>Seventeen</span>
            </div>
          </div>

          <Link href="/hearst-plus/" className="min-h-11 justify-self-end border-2 border-black bg-black px-2 py-2 text-[10px] font-black uppercase tracking-wide text-[#ffec00] hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075db6] sm:px-4 sm:text-xs">
            Open Hearst+
          </Link>
        </div>
        <nav aria-label="Hearst+ topics" className="mx-auto hidden min-h-12 max-w-[1600px] items-center justify-center border-t-2 border-black bg-[#071a30] px-4 py-1 text-xs font-black uppercase tracking-[0.12em] text-white md:flex">
          {sections.map((section) => (
            <Link key={section.label} href={section.href} className="border-r border-white/40 px-3 py-2 last:border-r-0 hover:bg-[#ffec00] hover:text-black focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#ffec00]">{section.label}</Link>
          ))}
        </nav>
      </header>

      <main>
        {activeStory ? (
          <section aria-label="Today on Hearst+" className="relative isolate min-h-[500px] overflow-hidden bg-[#071a30] sm:min-h-[520px] lg:min-h-[min(44vw,560px)]">
            <Link href={storyHref(activeStory)} aria-label={`Read ${activeStory.title}`} className="absolute inset-0 block focus-visible:outline-4 focus-visible:outline-inset focus-visible:outline-[#1675dc]">
              <LifestyleRiverImage
                key={activeStory.id}
                story={activeStory}
                className="h-full w-full"
                sizes="100vw"
                priority
                objectPosition={getLifestyleImagePosition(activeStory)}
                alt={`${activeStory.brand}: ${activeStory.title}`}
              />
            </Link>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.35),transparent_75%)]" />
            <div className="absolute bottom-4 left-3 z-10 max-w-[min(780px,94vw)] sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8">
              <div className="mb-2 inline-flex bg-[#ef272c] px-2 py-1 font-[family-name:var(--font-brutalist)] text-lg font-black uppercase leading-none text-white sm:text-xl">
                {activeStory.topic || "Today"}
              </div>
              <div className="max-w-[760px] bg-[#ffec00] p-3 text-black sm:p-5 lg:p-6">
                <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] sm:text-xs">Today on Hearst+ · {activeHeroIndex + 1} of {heroStories.length}</p>
                <h1 className="font-[family-name:var(--font-brutalist)] text-[clamp(2.7rem,7.2vw,6.8rem)] font-black uppercase leading-[0.77] tracking-[-0.055em] [text-wrap:balance]">
                  {activeStory.title}
                </h1>
                {activeStory.summary ? <p className="mt-3 max-w-2xl text-xs font-bold leading-tight sm:text-base">{activeStory.summary}</p> : null}
                <p className="mt-3 border-t-2 border-black pt-2 text-[9px] font-black uppercase tracking-[0.12em] sm:text-[11px]">
                  {activeStory.brand} <span aria-hidden="true">·</span> {activeStory.byline || "Hearst Editors"} <span aria-hidden="true">·</span> {activeStory.readTime}
                </p>
              </div>
            </div>
            {heroStories.length > 1 ? (
              <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 sm:bottom-6 sm:right-6 sm:top-auto">
                <button type="button" onClick={() => changeHero(-1)} aria-label="Previous featured story" className="flex h-11 w-11 items-center justify-center border-2 border-black bg-[#ffec00] text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <span className="flex h-11 items-center border-y-2 border-black bg-black px-3 font-[family-name:var(--font-brutalist)] text-xl font-bold uppercase text-white" aria-live="polite">{activeHeroIndex + 1} / {heroStories.length}</span>
                <button type="button" onClick={() => changeHero(1)} aria-label="Next featured story" className="flex h-11 w-11 items-center justify-center border-2 border-black bg-[#1675dc] text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="flex min-h-80 items-center justify-center bg-[#ffec00] p-8 text-center">
            <h1 className="font-[family-name:var(--font-brutalist)] text-6xl font-black uppercase">Stories are loading</h1>
          </section>
        )}

        <nav aria-label="Explore topics" className="mx-auto grid max-w-[1600px] grid-flow-col auto-cols-[minmax(218px,1fr)] gap-1 overflow-x-auto p-2 sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-5 sm:overflow-visible sm:p-3 lg:gap-2">
          {topicTiles.map((tile, index) => (
            <TopicTile key={tile.label} tile={tile} story={topicStories[index]} />
          ))}
        </nav>

        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-x-5 px-3 pb-12 sm:px-6 lg:grid-cols-2 lg:gap-x-6 xl:grid-cols-[minmax(260px,.95fr)_minmax(0,1.2fr)_minmax(260px,.95fr)]">
          <section aria-labelledby="brutalist-trending" className="min-w-0 border-b-4 border-black pb-5 lg:border-b-0 lg:border-r-2 lg:pr-5 xl:border-r-2">
            <SectionHeading id="brutalist-trending" href="/hearst-plus/">Trending</SectionHeading>
            <div className="mt-2">
              {trendingStories.map((story, index) => <StoryRow key={story.id} story={story} rank={index + 1} />)}
            </div>
          </section>

          <section aria-labelledby="brutalist-latest" className="min-w-0 border-b-4 border-black py-5 lg:border-b-0 lg:border-r-0 lg:px-5 lg:py-0 xl:border-r-2">
            <SectionHeading id="brutalist-latest" href="/hearst-plus/">Latest Stories</SectionHeading>
            {latestStories[0] ? (
              <Link href={storyHref(latestStories[0])} className="group mt-3 block border-b-2 border-black pb-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075db6]">
                <div className="relative aspect-[16/9] overflow-hidden bg-black/10">
                  <LifestyleRiverImage story={latestStories[0]} className="h-full w-full" sizes="(max-width: 1024px) 100vw, 42vw" objectPosition={getLifestyleImagePosition(latestStories[0])} />
                  <span className="absolute left-0 top-0 bg-[#ffec00] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-black">{latestStories[0].topic}</span>
                </div>
                <h3 className="mt-2 font-[family-name:var(--font-brutalist)] text-3xl font-black uppercase leading-[0.9] tracking-[-0.04em] group-hover:underline sm:text-4xl">{latestStories[0].title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase text-black/65">{latestStories[0].brand} · {storyDate(latestStories[0])}</p>
              </Link>
            ) : null}
            <div>
              {latestStories.slice(1).map((story) => <StoryRow key={story.id} story={story} />)}
            </div>
          </section>

          <section aria-labelledby="brutalist-editors-picks" className="min-w-0 pt-5 lg:col-span-2 lg:pl-5 lg:pt-5 xl:col-span-1 xl:pt-0">
            <SectionHeading id="brutalist-editors-picks" href="/hearst-plus/">Editor’s Picks</SectionHeading>
            <div className="mt-2">
              {editorPicks.map((story) => <StoryRow key={story.id} story={story} />)}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter siteName="Hearst+" />
    </div>
  );
}
