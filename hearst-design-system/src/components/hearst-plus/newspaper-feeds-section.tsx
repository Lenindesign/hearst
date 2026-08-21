"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentReaderDialogShell, rememberContentReaderReturnFocus } from "@/components/hearst-plus/content-reader-dialog-shell";
import { ContentReaderMasthead } from "@/components/hearst-plus/content-reader-masthead";
import { FeaturedStoryCarousel } from "@/components/hearst-plus/featured-story-carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getHearstNewspaperFeedById,
  getHearstNewspaperPublicationById,
  hearstNewspaperFeeds,
  hearstNewspaperPublications,
  hearstNewspaperSampleContent,
  newspaperFeedUrlTbd,
  type HearstNewspaperContent,
  type HearstNewspaperPublication,
} from "@/lib/hearst-newspaper-feed-framework";
import { LocalNewsSourceToggle } from "@/components/hearst-plus/local-news-source-toggle";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

const allValue = "all";
const defaultNewspaperPublication = "sfgate";
const newspaperHeroStoryLimit = 3;
const newspaperRiverStoryLimit = 12;

type NewspaperFeedResponse = {
  stories: HearstNewspaperContent[];
  status: "connected" | "pending" | "error";
  error?: string;
};

type NewspaperFeedsSectionProps = {
  onOpenStory?: (storyId: string) => void;
  onStoriesChange?: (stories: LifestyleRiverStory[]) => void;
};

function isConnectedFeed(feed: (typeof hearstNewspaperFeeds)[number]) {
  return feed.enabled && feed.status === "connected" && feed.feedUrl !== newspaperFeedUrlTbd;
}

function formatPublicationOption(publication: HearstNewspaperPublication, connectedPublicationIds: Set<string>) {
  return `${connectedPublicationIds.has(publication.id) ? "🟢 " : ""}${publication.publicationName} · ${publication.market}`;
}

function formatContentType(type: HearstNewspaperContent["contentType"]) {
  if (type === "news") return "News";
  if (type === "opinion") return "Opinion";
  return "Other";
}

function publicationInitials(name: string) {
  return name
    .split(/\s+|-/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function NewspaperFeedsSection({
  onOpenStory,
  onStoriesChange,
}: NewspaperFeedsSectionProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPublication = searchParams.get("publication");
  const routedPublication = requestedPublication && getHearstNewspaperPublicationById(requestedPublication)
    ? requestedPublication
    : null;
  const connectedFeeds = hearstNewspaperFeeds.filter(isConnectedFeed);
  const connectedPublicationIds = useMemo(
    () => new Set(connectedFeeds.map((feed) => feed.publicationId)),
    [connectedFeeds],
  );
  const [manualSelectedPublication, setManualSelectedPublication] = useState(defaultNewspaperPublication);
  const selectedPublication = routedPublication ?? manualSelectedPublication;
  const [liveContent, setLiveContent] = useState<HearstNewspaperContent[]>([]);
  const [liveFeedLoading, setLiveFeedLoading] = useState(false);
  const [liveRiverLoading, setLiveRiverLoading] = useState(false);
  const [liveFeedError, setLiveFeedError] = useState<string | null>(null);

  const defaultPublicationRecord = getHearstNewspaperPublicationById(defaultNewspaperPublication);
  const selectedPublicationRecord = selectedPublication === allValue
    ? null
    : getHearstNewspaperPublicationById(selectedPublication);
  const activePublicationRecord = selectedPublicationRecord ?? defaultPublicationRecord;
  const activePublicationFeed = activePublicationRecord
    ? hearstNewspaperFeeds.find((feed) => feed.publicationId === activePublicationRecord.id)
    : null;
  const activeFeed = activePublicationFeed && isConnectedFeed(activePublicationFeed) ? activePublicationFeed : null;

  useEffect(() => {
    let cancelled = false;

    async function loadNewspaperFeed() {
      if (!activeFeed || !activePublicationRecord) {
        setLiveFeedLoading(false);
        setLiveRiverLoading(false);
        setLiveContent([]);
        setLiveFeedError(null);
        return;
      }

      try {
        setLiveFeedLoading(true);
        setLiveRiverLoading(false);
        setLiveContent([]);
        setLiveFeedError(null);

        const params = new URLSearchParams({
          publicationId: activeFeed.publicationId,
          feedId: activeFeed.id,
          feedUrl: activeFeed.feedUrl,
          limit: String(newspaperHeroStoryLimit),
          hydrateImages: "true",
        });
        const response = await fetch(`/api/hearst-newspapers/local-news/?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Newspaper feed returned ${response.status}`);
        const payload = await response.json() as NewspaperFeedResponse;
        if (cancelled) return;
        const heroStories = payload.stories ?? [];
        setLiveContent(heroStories);
        setLiveFeedLoading(false);
        if (payload.status !== "connected") {
          setLiveFeedError(payload.error ?? "Newspaper feed is not connected.");
          return;
        }

        setLiveRiverLoading(true);
        try {
          params.set("limit", String(newspaperRiverStoryLimit));
          params.set("offset", String(newspaperHeroStoryLimit));
          // River items need the same article-image hydration as the hero.
          // Many RSS entries omit media:content but expose an og:image on the article page.
          params.set("hydrateImages", "true");
          const riverResponse = await fetch(`/api/hearst-newspapers/local-news/?${params.toString()}`, { cache: "no-store" });
          if (!riverResponse.ok) throw new Error(`Newspaper feed returned ${riverResponse.status}`);
          const riverPayload = await riverResponse.json() as NewspaperFeedResponse;
          if (cancelled) return;
          setLiveContent(dedupeNewspaperContent([...heroStories, ...(riverPayload.stories ?? [])]));
        } finally {
          if (!cancelled) setLiveRiverLoading(false);
        }
      } catch {
        if (cancelled) return;
        setLiveFeedLoading(false);
        setLiveRiverLoading(false);
        setLiveContent([]);
        setLiveFeedError("Newspaper feed could not be reached. Try again later.");
      }
    }

    void loadNewspaperFeed();

    return () => {
      cancelled = true;
    };
  }, [activeFeed, activePublicationRecord]);

  const filteredContent = useMemo(() => {
    if (liveFeedLoading && activeFeed) return [];

    const livePublicationIds = new Set(liveContent.map((item) => item.publicationId));
    const sampleContent = hearstNewspaperSampleContent.filter((item) => !livePublicationIds.has(item.publicationId));
    const contentPool = selectedPublication !== allValue && activeFeed
      ? liveContent
      : selectedPublication === allValue
      ? [...liveContent, ...sampleContent]
      : liveContent.some((item) => item.publicationId === selectedPublication)
        ? liveContent
        : hearstNewspaperSampleContent.filter((item) => item.publicationId === selectedPublication);

    return contentPool
      .filter((item) => {
        const publication = getHearstNewspaperPublicationById(item.publicationId);
        if (!publication) return false;
        if (selectedPublication !== allValue && item.publicationId !== selectedPublication) return false;
        return true;
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  }, [activeFeed, liveContent, liveFeedLoading, selectedPublication]);
  const readerStories = useMemo(
    () => filteredContent.map(mapNewspaperItemToCarouselStory),
    [filteredContent],
  );
  const readerStoryById = useMemo(
    () => new Map(readerStories.map((story) => [story.id, story])),
    [readerStories],
  );
  const heroItems = filteredContent.slice(0, 3);
  const riverItems = filteredContent.slice(heroItems.length, heroItems.length + 12);

  useEffect(() => {
    onStoriesChange?.(readerStories);
  }, [onStoriesChange, readerStories]);

  useEffect(() => {
    return () => onStoriesChange?.([]);
  }, [onStoriesChange]);

  function handlePublicationChange(value: string) {
    setManualSelectedPublication(value);
    const target = value === allValue
      ? "/hearst-plus/local-news/newspapers/#newspapers"
      : `/hearst-plus/local-news/newspapers/?publication=${encodeURIComponent(value)}#newspapers`;
    router.replace(target, { scroll: false });
  }

  return (
    <div className="space-y-6" data-hearst-plus-newspaper-river aria-labelledby="newspaper-feeds-title">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[200px_minmax(0,1fr)_260px] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-labelledby="newspaper-filter-title">
            <LocalNewsSourceToggle activeSource="newspapers" />
            <h2 id="newspaper-filter-title" className="mt-5 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">Newspapers</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Select a Hearst newspaper feed. Green dots mark publications with a verified RSS endpoint.
            </p>
            <div className="mt-4 grid gap-4">
              <FilterSelect
                id="inline-newspaper-publication-filter"
                label="Newspaper"
                value={selectedPublication}
                onChange={handlePublicationChange}
                options={[
                  { label: "All newspapers", value: allValue },
                  ...hearstNewspaperPublications.map((publication) => ({
                    label: formatPublicationOption(publication, connectedPublicationIds),
                    value: publication.id,
                  })),
                ]}
              />
            </div>
          </section>
        </aside>

        <main id="hearst-story-river" className="min-w-0 scroll-mt-28 space-y-4" aria-label="Hearst Newspapers RSS feeds">
          {liveFeedLoading && activeFeed ? (
            <NewspaperFeaturedSkeleton />
          ) : liveFeedError && selectedPublication !== allValue ? (
            <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--hp-shadow-card)]" role="status">
              <p className="font-bold text-foreground">This newspaper feed is temporarily unavailable.</p>
              <p className="mt-2">{liveFeedError}</p>
            </section>
          ) : heroItems.length > 0 ? (
            <NewspaperFeaturedCarousel
              key={heroItems.map((item) => item.id).join("|")}
              items={heroItems}
              onOpenStory={(story) => {
                if (onOpenStory) {
                  onOpenStory(story.id);
                  return;
                }

                if (story.sourceUrl) window.open(story.sourceUrl, "_blank", "noopener,noreferrer");
              }}
            />
          ) : (
            <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-6 text-sm leading-6 text-muted-foreground shadow-[var(--hp-shadow-card)]">
              No newspaper items match the current newspaper. Clear the newspaper filter to restore the river.
            </section>
          )}

          {riverItems.map((item) => {
            const publication = getHearstNewspaperPublicationById(item.publicationId);
            const feed = getHearstNewspaperFeedById(item.feedId);
            if (!publication || !feed) return null;
            const connected = isConnectedFeed(feed);
            const readerStory = readerStoryById.get(item.id);

            return (
              <article key={item.id} className="group/card relative min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50" data-story-module="river" data-story-id={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (readerStory && onOpenStory) {
                      onOpenStory(readerStory.id);
                      return;
                    }

                    if (item.url && item.url !== "#") {
                      window.open(item.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="block w-full min-w-0 text-left no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50"
                  aria-label={`Open story: ${item.title}`}
                >
                  <span className="relative grid aspect-video min-h-0 w-full place-items-center overflow-hidden bg-[var(--hp-surface-low)] text-center text-sm font-bold text-primary" aria-hidden="true">
                    <NewspaperStoryImage
                      src={item.imageUrl}
                      articleUrl={item.url}
                      alt=""
                      fallbackLabel={publicationInitials(publication.publicationName)}
                      className="h-full w-full"
                      sizes="(max-width: 1024px) 100vw, 640px"
                    />
                  </span>
                  <span className="block min-w-0 p-4 sm:p-5">
                    <span className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">{connected ? "Latest" : "Sample"}</span>
                      <span className="text-[length:var(--text-token-4xs)] text-muted-foreground">{publication.publicationName} · {publication.market}</span>
                      <span className="rounded-full bg-[var(--hp-surface-low)] px-2 py-1 text-primary">{formatContentType(item.contentType)}</span>
                    </span>
                    <span className="headline block break-words text-2xl leading-tight text-foreground transition-colors group-hover/card:text-primary sm:text-[1.7rem]">
                      {item.title}
                    </span>
                    <span className="mt-3 line-clamp-3 block text-sm leading-6 text-muted-foreground">{item.description}</span>
                    <span className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                      <span>{formatDate(item.publishedAt)}</span>
                      <span>{item.isMock ? "Mock sample" : feed.feedName}</span>
                      <span>{connected ? "RSS connected" : "Feed URL TBD"}</span>
                    </span>
                  </span>
                </button>
              </article>
            );
          })}
          {liveRiverLoading && activeFeed ? <NewspaperRiverStorySkeletons /> : null}
          {!liveFeedLoading && !liveRiverLoading && filteredContent.length > 0 && riverItems.length === 0 ? (
            <p className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 text-sm leading-6 text-muted-foreground shadow-[var(--hp-shadow-card)]">
              More newspaper stories will appear here as additional feed items match the selected newspaper.
            </p>
          ) : null}
        </main>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[108px] lg:max-h-[calc(100dvh-132px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
            <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">Feed status</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p><span className="font-bold">{hearstNewspaperPublications.length}</span> Hearst newspapers</p>
              <p><span className="font-bold">{connectedFeeds.length}</span> connected feeds</p>
              <p><span className="font-bold">{hearstNewspaperFeeds.length - connectedFeeds.length}</span> pending</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Publications with a green dot have a verified RSS endpoint. Other records remain pending until a real endpoint is confirmed.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function dedupeNewspaperContent(items: HearstNewspaperContent[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function NewspaperFeaturedCarousel({
  items,
  onOpenStory,
}: {
  items: HearstNewspaperContent[];
  onOpenStory: (story: LifestyleRiverStory) => void;
}) {
  const stories = useMemo(() => items.map(mapNewspaperItemToCarouselStory), [items]);
  const imageByStoryId = useMemo(
    () => new Map(items.map((item) => [item.id, item.imageUrl])),
    [items],
  );

  return (
    <FeaturedStoryCarousel
      stories={stories}
      editionLabel="Latest Local News"
      renderImage={(story, _index, active) => {
        const imageUrl = imageByStoryId.get(story.id);

        return (
          <NewspaperStoryImage
            src={imageUrl}
            articleUrl={story.sourceUrl}
            alt=""
            fallbackLabel={publicationInitials(story.brand)}
            className="h-full w-full"
            loading={active ? "eager" : "lazy"}
          />
        );
      }}
      getCommentCount={() => 0}
      isCurrentStory={() => true}
      onOpenStory={onOpenStory}
      onSave={() => undefined}
      onMoreLikeThis={() => undefined}
      onFollowBrand={() => undefined}
      indicatorPalette={["#087A68", "#3EA391", "#91CFC2"]}
    />
  );
}

function NewspaperStoryImage({
  src: initialSrc,
  articleUrl,
  alt,
  fallbackLabel,
  className,
  loading = "lazy",
  sizes,
}: {
  src?: string | null;
  articleUrl?: string | null;
  alt?: string;
  fallbackLabel: string;
  className?: string;
  loading?: "eager" | "lazy";
  sizes?: string;
}) {
  const [src, setSrc] = useState<string | null>(initialSrc ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (src || failed || !articleUrl || typeof window === "undefined") return;

    let cancelled = false;
    fetch(articleUrl, { mode: "cors" })
      .then((res) => (res.ok ? res.text() : null))
      .then((html) => {
        if (cancelled || !html) return;
        const ogMatch = html.match(/<meta\b[^>]*\b(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/i);
        const contentMatch = ogMatch?.[0]?.match(/content=["']([^"']+)["']/i);
        const extracted = contentMatch?.[1]?.trim();
        if (extracted) {
          const finalUrl = extracted.startsWith("//") ? `https:${extracted}` : extracted;
          setSrc(finalUrl);
        }
      })
      .catch(() => {
        // Silently preserve publication branding fallback
      });

    return () => {
      cancelled = true;
    };
  }, [src, failed, articleUrl]);

  if (failed || !src) {
    return (
      <span
        className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,var(--hp-surface-low)_0%,var(--hp-surface)_100%)] text-lg font-bold tracking-[0.18em] text-primary"
        aria-label="Newspaper story"
      >
        <span className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
          <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            {fallbackLabel}
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground">Hearst Local News</span>
        </span>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={1200}
      height={675}
      sizes={sizes ?? "(max-width: 1024px) 100vw, 640px"}
      className={`h-full w-full object-cover ${className ?? ""}`}
      loading={loading}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

function NewspaperFeaturedSkeleton() {
  return (
    <section
      className="overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
      aria-label="Loading newspaper stories"
      aria-busy="true"
    >
      <div className="relative aspect-[16/9] min-h-[360px] overflow-hidden bg-[var(--hp-surface-low)]">
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(135deg,var(--hp-surface-low)_0%,rgba(255,255,255,0.82)_48%,var(--hp-surface-low)_100%)]" />
        <div className="absolute left-6 top-6 h-8 w-44 animate-pulse rounded-full bg-white/80" />
        <div className="absolute inset-x-6 bottom-8 space-y-4">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/80" />
          <div className="h-10 w-4/5 animate-pulse rounded-full bg-white/90" />
          <div className="h-10 w-2/3 animate-pulse rounded-full bg-white/80" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
        <div className="flex gap-2">
          <span className="h-2 w-8 animate-pulse rounded-full bg-primary/35" />
          <span className="h-2 w-8 animate-pulse rounded-full bg-primary/20" />
          <span className="h-2 w-5 animate-pulse rounded-full bg-primary/20" />
        </div>
        <span className="hidden h-4 w-36 animate-pulse rounded-full bg-[var(--hp-surface-low)] sm:block" />
      </div>
    </section>
  );
}

function NewspaperRiverStorySkeletons() {
  return (
    <div className="space-y-4" aria-label="Loading more newspaper stories" aria-busy="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
        >
          <div className="aspect-video animate-pulse bg-[var(--hp-surface-low)]" />
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2">
              <span className="h-4 w-16 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <span className="h-4 w-44 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
            <div className="space-y-3">
              <div className="h-7 w-11/12 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <div className="h-7 w-2/3 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-[var(--hp-surface-low)]" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function NewspaperFeedsReaderExperience() {
  const [readerStories, setReaderStories] = useState<LifestyleRiverStory[]>([]);
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const returnFocusElementRef = useRef<HTMLElement | null>(null);

  const openStory = (storyId: string) => {
    returnFocusElementRef.current = rememberContentReaderReturnFocus(document.activeElement);
    setOpenStoryId(storyId);
  };

  return (
    <>
      <NewspaperFeedsSection
        onOpenStory={openStory}
        onStoriesChange={setReaderStories}
      />
      {openStoryId ? (
        <NewspaperReaderModal
          key={openStoryId}
          stories={readerStories}
          openStoryId={openStoryId}
          returnFocusElementRef={returnFocusElementRef}
          onClose={() => setOpenStoryId(null)}
        />
      ) : null}
    </>
  );
}

function NewspaperReaderModal({
  stories,
  openStoryId,
  returnFocusElementRef,
  onClose,
}: {
  stories: LifestyleRiverStory[];
  openStoryId: string;
  returnFocusElementRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
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
      destination="local-news"
      mode="light"
      onClose={onClose}
      returnFocusElementRef={returnFocusElementRef}
      style={{
        "--primary": "#087A68",
        "--hp-primary": "#087A68",
        "--hp-section-title": "#087A68",
        "--hp-sidebar-heading": "#087A68",
      } as CSSProperties}
    >
      <ContentReaderMasthead
        logoHref="/hearst-plus/local-news/newspapers/"
        contextLabel="Hearst Local News"
        logoSlug="hearst-local-news"
        visibleStoryCount={visibleStories.length}
        storyCount={queue.length}
        activeMastheadKey="local-news"
        mastheadItems={[{ key: "local-news", label: "Local News", active: true, disabled: true }]}
        mastheadNavigationLabel="Local News"
        filterItems={[{ label: "Newspapers", active: true, disabled: true }]}
        sectionLabel="Newspapers"
        onSelectMastheadItem={() => undefined}
        onSelectFilter={() => undefined}
        onClose={onClose}
      />
      <div className="grid gap-8 px-4 py-6 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-3xl space-y-10">
          {visibleStories.map((story, index) => (
            <article
              key={story.id}
              data-reader-story-id={story.id}
              className="rounded-[8px] border border-border bg-card px-5 py-5 text-foreground sm:px-7 sm:py-7"
            >
              {index > 0 ? (
                <div className="mb-8 flex items-center gap-4" aria-label="Up next">
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                  <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                    Up next
                  </span>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                </div>
              ) : null}
              <div className="aspect-video w-full overflow-hidden rounded-[4px] bg-[var(--hp-surface-low)]">
                <NewspaperStoryImage
                  src={story.image}
                  articleUrl={story.sourceUrl}
                  alt=""
                  fallbackLabel={publicationInitials(story.brand)}
                />
              </div>
              <div className="mx-auto mt-6 max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                  <span>{story.signal}</span>
                  <span>{story.brand}</span>
                  <span>{story.topic}</span>
                </div>
                <h2 className="headline text-4xl leading-[1.05] sm:text-5xl">
                  {story.title}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-border py-3 text-sm text-muted-foreground">
                  <span>{story.byline}</span>
                  {story.publishedAt ? <span>{formatDate(story.publishedAt)}</span> : null}
                  {story.sourceUrl ? (
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-primary underline underline-offset-4"
                    >
                      Original newspaper story
                    </a>
                  ) : null}
                </div>
                <div className="mt-6 space-y-4 text-[18px] leading-8 text-foreground/85">
                  <p>{story.summary}</p>
                  <p>
                    This local-news item is normalized from the configured Hearst newspaper RSS feed and keeps the original publication attribution, timestamp, image, and source link.
                  </p>
                </div>
              </div>
            </article>
          ))}
          <div ref={sentinelRef} className="flex justify-center py-8">
            {visibleCount < queue.length ? (
              <p className="text-sm text-muted-foreground">Loading the next newspaper story...</p>
            ) : (
              <p className="text-sm text-muted-foreground">End of this newspaper river.</p>
            )}
          </div>
        </div>
      </div>
    </ContentReaderDialogShell>
  );
}

function mapNewspaperItemToCarouselStory(item: HearstNewspaperContent): LifestyleRiverStory {
  const publication = getHearstNewspaperPublicationById(item.publicationId);
  const publicationName = publication?.publicationName ?? "Hearst Newspapers";
  const publishedAt = Date.parse(item.publishedAt);
  const age = Number.isNaN(publishedAt)
    ? 0
    : Math.max(0, Math.round((Date.now() - publishedAt) / 36e5));

  return {
    id: item.id,
    brand: publicationName,
    brandSlug: "hearst-local-news",
    topic: formatContentType(item.contentType),
    title: item.title,
    summary: item.description,
    image: item.imageUrl || "",
    byline: `${publicationName} local news`,
    readTime: item.isMock ? "Sample" : "RSS",
    popularity: item.isMock ? 35 : 80,
    signal: item.isMock ? "Editor Pick" : "Trending",
    tags: [
      publicationName,
      publication?.market,
      publication?.state,
      formatContentType(item.contentType),
    ].filter((tag): tag is string => Boolean(tag)),
    age,
    publishedAt: item.publishedAt,
    sourceUrl: item.url === "#" ? undefined : item.url,
  };
}

function FilterSelect({
  id,
  label,
  onChange,
  options,
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <div className="block text-sm font-semibold text-[var(--hp-text-headline)]">
      <label htmlFor={id}>{label}</label>
      <Select value={value} onValueChange={(nextValue) => {
        if (nextValue) onChange(nextValue);
      }}>
        <SelectTrigger
          id={id}
          className="mt-2 h-11 min-h-11 w-full rounded-lg border-input bg-background px-3 text-left text-sm font-semibold text-foreground shadow-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          alignItemWithTrigger={false}
          className="max-h-[min(420px,var(--available-height))] rounded-lg border border-border bg-popover p-1 shadow-xl ring-1 ring-foreground/10"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="min-h-10 px-3 pr-9 text-sm font-semibold text-popover-foreground focus:bg-[var(--hp-control-hover)] focus:text-foreground"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
