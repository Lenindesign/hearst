"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { MainNav } from "@/components/home-page";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { ContentReaderDialogShell, rememberContentReaderReturnFocus } from "@/components/hearst-plus/content-reader-dialog-shell";
import { ContentReaderMasthead } from "@/components/hearst-plus/content-reader-masthead";
import { FeaturedStoryCarousel } from "@/components/hearst-plus/featured-story-carousel";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { ExternalLink } from "@/components/ui/icons";
import {
  entertainmentWebsiteFeedConfigs,
  getEntertainmentWebsiteFeedConfig,
  type EntertainmentWebsiteChannelSlug,
  type EntertainmentWebsiteStory,
} from "@/lib/hearst-entertainment-story-feeds";

type EntertainmentWebsiteFeedResponse = {
  stories: EntertainmentWebsiteStory[];
  status: "connected" | "pending" | "error";
  error?: string;
};

const storyNavLinks = ["Shows", "Stories"];

export function EntertainmentChannelStoriesPage({
  channelSlug,
}: {
  channelSlug: EntertainmentWebsiteChannelSlug;
}) {
  const config = getEntertainmentWebsiteFeedConfig(channelSlug) ?? entertainmentWebsiteFeedConfigs[0];
  const [stories, setStories] = useState<EntertainmentWebsiteStory[]>([]);
  const [status, setStatus] = useState<EntertainmentWebsiteFeedResponse["status"]>("pending");
  const [error, setError] = useState<string | null>(null);
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const returnFocusElementRef = React.useRef<HTMLElement | null>(null);
  const heroItems = stories.slice(0, 3);
  const riverItems = stories.slice(heroItems.length, heroItems.length + 12);
  const readerStories = useMemo(() => stories.map((story) => mapEntertainmentStoryToRiverStory(story, config.logo)), [config.logo, stories]);
  const heroStories = readerStories.slice(0, 3);
  const feedMode = config.slug === "vice-tv" ? "API" : config.rssUrl ? "RSS" : config.articlePathPrefixes.length > 0 ? "Website" : "Pending";
  const mastheadLogo = useMemo(() => ({
    src: config.logo,
    label: config.brand,
    tone: "white" as const,
    className: config.slug === "history" ? "h-[56px] max-w-[400px]" : undefined,
  }), [config.brand, config.logo, config.slug]);

  useEffect(() => {
    let cancelled = false;

    async function loadStories() {
      setStatus("pending");
      setError(null);
      const response = await fetch(`/api/hearst-entertainment/stories?channel=${encodeURIComponent(config.slug)}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Entertainment story feed returned ${response.status}`);
      const payload = await response.json() as EntertainmentWebsiteFeedResponse;
      if (cancelled) return;
      setStories(payload.stories ?? []);
      setStatus(payload.status);
      setError(payload.error ?? null);
    }

    loadStories().catch((loadError) => {
      if (cancelled) return;
      setStories([]);
      setStatus("error");
      setError(loadError instanceof Error ? loadError.message : "Entertainment story feed failed.");
    });

    return () => {
      cancelled = true;
    };
  }, [config.slug]);

  function openStory(storyId: string) {
    returnFocusElementRef.current = rememberContentReaderReturnFocus(document.activeElement);
    setOpenStoryId(storyId);
  }

  return (
    <div
      className="min-h-screen bg-[#050608] text-white"
      style={{
        "--primary": "#B9913F",
        "--hp-primary": "#B9913F",
        "--hp-nav": "#B9913F",
        "--hp-section-title": "#B9913F",
        "--hp-sidebar-heading": "#B9913F",
        "--component-navigation-utility-background-knockout": "#050608",
        "--component-navigation-utility-megamenu-background-knockout": "#101216",
        "--component-navigation-utility-content-knockout": "#FFFFFF",
        "--component-navigation-utility-content-accent": "#B9913F",
        "--component-navigation-utility-content-accent-hover": "#D5B869",
      } as React.CSSProperties}
    >
      <UtilityBar activeDestinationOverride="A&E Family" darkMode />
      <MainNav
        brandSlug="hearst-all"
        selectedBrand={{ name: config.brand, slug: "hearst-entertainment" }}
        activeFilter="Stories"
        navLinksOverride={storyNavLinks}
        navLinkHrefOverrides={{
          Shows: config.showHref,
          Stories: config.storyHref,
        }}
        mastheadLogoOverride={mastheadLogo}
        darkMode
      />

      <main className="bg-[#050608] px-5 py-8 md:px-8 lg:px-10">
        <section className="mx-auto grid max-w-[1440px] min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
          <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <section className="rounded-[8px] border border-white/15 bg-white/[0.04] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]" aria-labelledby="entertainment-story-controls">
              <h2 id="entertainment-story-controls" className="text-xs font-bold uppercase tracking-[0.16em] text-[#B9913F]">
                Entertainment
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={config.showHref} className="inline-flex min-h-10 items-center justify-center rounded-[6px] border border-white/15 px-3 text-sm font-bold text-white no-underline hover:bg-white/10">
                  Shows
                </a>
                <a href={config.storyHref} aria-current="page" className="inline-flex min-h-10 items-center justify-center rounded-[6px] bg-[#B9913F] px-3 text-sm font-bold text-black no-underline hover:bg-[#D5B869]">
                  Stories
                </a>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/64">
                Choose a channel story feed. The river uses the same hero-and-sidebar layout as the rest of Hearst+.
              </p>
              <nav className="mt-4 grid gap-1" aria-label="Entertainment story channels">
                {entertainmentWebsiteFeedConfigs.map((item) => (
                  <a
                    key={item.slug}
                    href={item.storyHref}
                    aria-current={item.slug === config.slug ? "page" : undefined}
                    className={`rounded-[6px] px-3 py-2 text-sm font-bold no-underline ${item.slug === config.slug ? "bg-white text-black" : "text-white/78 hover:bg-white/10 hover:text-white"}`}
                  >
                    {item.brand}
                  </a>
                ))}
              </nav>
            </section>
          </aside>

          <section id="hearst-story-river" className="min-w-0 scroll-mt-28 space-y-4" aria-label={`${config.brand} entertainment story river`}>
            {heroStories.length > 0 ? (
              <EntertainmentStoryHeroCarousel
                key={heroStories.map((story) => story.id).join("|")}
                stories={heroStories}
                onOpenStory={(story) => openStory(story.id)}
              />
            ) : (
              <section className="rounded-[8px] border border-white/15 bg-white/[0.04] p-6 text-sm leading-6 text-white/64 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
                {status === "pending" ? `Loading ${config.brand} stories...` : `No ${config.brand} stories are available for this feed yet.`}
              </section>
            )}

            {error ? (
              <p className="rounded-[8px] border border-white/15 bg-white/[0.04] p-4 text-xs leading-5 text-white/64 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
                {error}
              </p>
            ) : null}

            {riverItems.map((story) => (
              <article key={story.id} className="group/card relative min-w-0 overflow-hidden rounded-[8px] border border-white/15 bg-white/[0.04] shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition-colors hover:border-[#B9913F]/60">
                <button type="button" onClick={() => openStory(story.id)} className="grid w-full min-w-0 gap-0 text-left text-white no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B9913F]/60 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-4 sm:p-4" aria-label={`Open story: ${story.title}`}>
                  <span className="relative grid aspect-[16/9] min-h-0 place-items-center overflow-hidden rounded-[6px] bg-white/10 text-center text-sm font-bold text-[#B9913F] sm:aspect-[4/3]" aria-hidden="true">
                    {story.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={story.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={config.logo} alt="" className="h-full w-full object-contain p-8" loading="lazy" />
                    )}
                  </span>
                  <span className="block min-w-0 p-4 sm:p-0">
                    <span className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#B9913F]">{status === "connected" ? "Latest" : "Pending"}</span>
                      <span className="text-xs text-white/54">{config.brand}</span>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-[#B9913F]">{feedMode}</span>
                    </span>
                    <span className="headline block break-words text-xl leading-tight text-white transition-colors group-hover/card:text-[#B9913F] sm:text-2xl">
                      {story.title}
                    </span>
                    <span className="mt-3 line-clamp-3 block text-sm leading-6 text-white/64">{story.description}</span>
                    <span className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/54">
                      <span>{formatDate(story.publishedAt)}</span>
                      <span>Official channel source</span>
                      <span className="inline-flex items-center gap-1.5 font-bold text-white/78">
                        Source story <ExternalLink className="size-3.5" aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                </button>
              </article>
            ))}
          </section>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <section className="rounded-[8px] border border-white/15 bg-white/[0.04] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#B9913F]">Feed Status</h2>
              <div className="mt-4 space-y-3 text-sm text-white/72">
                <p><span className="font-bold text-white">{entertainmentWebsiteFeedConfigs.length}</span> channel websites</p>
                <p><span className="font-bold text-white">{entertainmentWebsiteFeedConfigs.filter((item) => item.rssUrl).length}</span> RSS endpoints</p>
                <p><span className="font-bold text-white">{entertainmentWebsiteFeedConfigs.filter((item) => item.articlePathPrefixes.length > 0).length}</span> website sources</p>
                <p><span className="font-bold text-white">1</span> official API source</p>
                <p><span className="font-bold text-white">{status === "connected" ? "Connected" : status === "error" ? "Error" : "Pending"}</span> current feed</p>
              </div>
              <p className="mt-4 text-xs leading-5 text-white/54">
                {config.description}
              </p>
            </section>
            <section className="rounded-[8px] border border-white/15 bg-white/[0.04] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#B9913F]">Current Source</h2>
              <div className="mt-4 space-y-3 text-sm text-white/72">
                <p><span className="font-bold text-white">{config.brand}</span></p>
                <p>{feedMode === "Pending" ? "Feed source pending" : `${feedMode} source`}</p>
                <p>{stories.length} stories loaded</p>
              </div>
            </section>
          </aside>
        </section>
      </main>

      <SiteFooter
        siteName={<BrandLogo slug="hearst-all" className="h-8 max-w-[16rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
        copyrightYear={2026}
        finePrintNote="Prototype only. Entertainment story feeds use checked-in channel website RSS configuration when a verified endpoint is available."
      />
      {openStoryId ? (
        <EntertainmentStoryReaderModal
          key={openStoryId}
          brand={config.brand}
          openStoryId={openStoryId}
          returnFocusElementRef={returnFocusElementRef}
          stories={readerStories}
          onClose={() => setOpenStoryId(null)}
        />
      ) : null}
    </div>
  );
}

function EntertainmentStoryReaderModal({
  brand,
  stories,
  openStoryId,
  returnFocusElementRef,
  onClose,
}: {
  brand: string;
  stories: LifestyleRiverStory[];
  openStoryId: string;
  returnFocusElementRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const openIndex = Math.max(0, stories.findIndex((story) => story.id === openStoryId));
  const queue = stories.length > 0
    ? [...stories.slice(openIndex), ...stories.slice(0, openIndex)]
    : [];
  const visibleStories = queue.slice(0, visibleCount);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [openStoryId]);

  useEffect(() => {
    const root = contentRef.current;
    const node = sentinelRef.current;
    if (!root || !node || visibleCount >= queue.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) => Math.min(count + 1, queue.length));
        }
      },
      { root, rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [queue.length, visibleCount]);

  return (
    <ContentReaderDialogShell
      contentRef={contentRef}
      destination="entertainment"
      mode="dark"
      onClose={onClose}
      returnFocusElementRef={returnFocusElementRef}
      style={{
        "--primary": "#B9913F",
        "--hp-primary": "#B9913F",
        "--hp-section-title": "#B9913F",
        "--hp-sidebar-heading": "#B9913F",
        "--content-reader-active-label": "#B9913F",
      } as React.CSSProperties}
    >
      <ContentReaderMasthead
        logoHref="/hearst-plus/entertainment/"
        contextLabel={`${brand} Stories`}
        logoSlug="hearst-all"
        logoColor="#fff"
        visibleStoryCount={visibleStories.length}
        storyCount={queue.length}
        activeMastheadKey="stories"
        mastheadItems={[{ key: "stories", label: "Stories", active: true, disabled: true }]}
        mastheadNavigationLabel="Entertainment stories"
        filterItems={[{ label: brand, active: true, disabled: true }]}
        sectionLabel="Entertainment"
        onSelectMastheadItem={() => undefined}
        onSelectFilter={() => undefined}
        onClose={onClose}
      />
      <div className="grid gap-8 bg-[#050608] px-4 py-6 text-white sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-3xl space-y-10">
          {visibleStories.map((story, index) => (
            <article
              key={story.id}
              data-reader-story-id={story.id}
              className="rounded-[8px] border border-white/15 bg-white/[0.04] px-5 py-5 text-white sm:px-7 sm:py-7"
            >
              {index > 0 ? (
                <div className="mb-8 flex items-center gap-4" aria-label="Up next">
                  <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#B9913F]">
                    Up next
                  </span>
                  <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
                </div>
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.image}
                alt=""
                className="aspect-video w-full rounded-[4px] bg-white/10 object-cover"
              />
              <div className="mx-auto mt-6 max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B9913F]">
                  <span>{story.signal}</span>
                  <span>{story.brand}</span>
                  <span>{story.topic}</span>
                </div>
                <h2 className="headline text-4xl leading-[1.05] sm:text-5xl">
                  {story.title}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-white/15 py-3 text-sm text-white/60">
                  <span>{story.byline}</span>
                  {story.publishedAt ? <span>{formatDate(story.publishedAt)}</span> : null}
                  {story.sourceUrl ? (
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#B9913F] underline underline-offset-4"
                    >
                      Original story
                    </a>
                  ) : null}
                </div>
                <div className="mt-6 space-y-4 text-[18px] leading-8 text-white/78">
                  <p>{story.summary}</p>
                  <p>
                    This item is normalized from the official channel source and presented inside the Hearst+ reader.
                  </p>
                </div>
              </div>
            </article>
          ))}
          <div ref={sentinelRef} className="flex justify-center py-8">
            {visibleCount < queue.length ? (
              <p className="text-sm text-white/54">Loading the next entertainment story...</p>
            ) : (
              <p className="text-sm text-white/54">End of this entertainment river.</p>
            )}
          </div>
        </div>
      </div>
    </ContentReaderDialogShell>
  );
}

function EntertainmentStoryHeroCarousel({
  stories,
  onOpenStory,
}: {
  stories: LifestyleRiverStory[];
  onOpenStory: (story: LifestyleRiverStory) => void;
}) {
  return (
    <FeaturedStoryCarousel
      stories={stories}
      editionLabel="Latest Entertainment Stories"
      renderImage={(story, _index, active) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.image}
          alt=""
          className="h-full w-full object-cover"
          loading={active ? "eager" : "lazy"}
        />
      )}
      getCommentCount={() => 0}
      isCurrentStory={() => true}
      onOpenStory={onOpenStory}
      onSave={() => undefined}
      onMoreLikeThis={() => undefined}
      onFollowBrand={() => undefined}
      indicatorPalette={["#B9913F", "#80652C", "#D5B869"]}
    />
  );
}

function mapEntertainmentStoryToRiverStory(
  story: EntertainmentWebsiteStory,
  fallbackImage: string,
): LifestyleRiverStory {
  const publishedAt = Date.parse(story.publishedAt ?? "");
  const age = Number.isNaN(publishedAt)
    ? 0
    : Math.max(0, Math.round((Date.now() - publishedAt) / 36e5));

  return {
    id: story.id,
    brand: story.brand,
    brandSlug: "hearst-entertainment",
    topic: "Stories",
    title: story.title,
    summary: story.description,
    image: story.imageUrl || fallbackImage,
    byline: `${story.brand} official channel`,
    readTime: "Source",
    popularity: 78,
    signal: "Trending",
    tags: [story.brand, "Entertainment", "Stories"],
    age,
    publishedAt: story.publishedAt ?? undefined,
    sourceUrl: story.url,
  };
}

function formatDate(value: string | null) {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
