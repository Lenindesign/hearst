"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { LifestyleRiverImage } from "@/components/hearst-plus/story-presentation";
import { CommunityHomeRiverCard } from "@/components/hearst-plus/community-home-river-card";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { EventTile } from "@/components/hearst-plus/events/hearst-events-experience";
import type { HearstEventRecord } from "@/lib/hearst-events";
import { VerticalVideoCarousel } from "@/components/hearst-plus/vertical-video-carousel";
import { ContextualRiverAdvertisement } from "@/components/hearst-plus/contextual-river-advertisement";
import type { ContextualAdUnit } from "@/components/hearst-plus/content-reader-advertisement";
import { BrandPromotionRiverModule } from "@/components/hearst-plus/brand-promotion-river-module";
import type { BrandPromotionMatch } from "@/components/hearst-plus/brand-promotion-model";
import { EditorialHomepageSection, LifestyleRiverCard } from "@/components/home-page";
import { MainNav } from "@/components/home-page";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { ProductFooter } from "@/components/product-story-shell";
import { DiscoverySidebarCard } from "@/components/hearst-plus/discovery-sidebar";
import { TrendingStoryRail } from "@/components/hearst-plus/trending-rail";
import { SavedItemsModule } from "@/components/hearst-plus/saved-items-module";
import { CommunityJoinedGroupsCard } from "@/components/hearst-plus/community-joined-groups-card";
import { communityGroups } from "@/lib/community-groups";
import { brands } from "@/lib/brands";
import { hearstEvents } from "@/lib/hearst-events";
import { todayEditLocalNewsStory } from "@/lib/hearst-plus-today-edit-stories";
import { Play } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const patterns = [
  { id: "featured-four", name: "Featured + Row", description: "A full-width lead story followed by a row of up to four cards. Columns follow the block width (1, 2, 3 or 4) and the row never leaves a partial line.", wireframe: "featured-four" },
  { id: "four-card-row", name: "Card Row", description: "A row of up to four compact cards (4:3 image, no summary) at 1, 2, 3 or 4 columns depending on the block width. Cards share the row height.", wireframe: "four-card-row" },
  { id: "feature-sidebar", name: "Feature + Sidebar", description: "A lead story beside a stack of four horizontal stories that stretches to the lead’s height once the block is 820px wide.", wireframe: "feature-sidebar" },
  { id: "hero-three-horizontal", name: "River with Hero", description: "A section heading and full-width lead story followed by three horizontal story cards in a vertical river.", wireframe: "hero-three-horizontal" },
  { id: "three-column-feature", name: "Three-Column Feature Row", description: "A discovery rail, central feature and contextual ad. Three columns from a 1100px block; from 820px the ad stacks under the rail beside the feature; stacked below that.", wireframe: "three-column-feature" },
  { id: "featured-video-four", name: "Featured Video + Four", description: "A featured playable video followed by four video cards at 1, 2 or 4 columns.", wireframe: "featured-video-four" },
  { id: "four-card-grid", name: "Grid", description: "Editorial cards in a grid that wraps at 1, 2 or 4 columns, so sets of four always fill their rows.", wireframe: "four-card-grid" },
  { id: "horizontal-story-list", name: "River", description: "A vertical river of image-led horizontal story cards with consistent text alignment.", wireframe: "horizontal-story-list" },
] as const;

type PatternId = (typeof patterns)[number]["id"];

const cardTypes = [
  { id: "article", name: "Article", description: "Editorial story card with publisher, headline, summary, and image." },
  { id: "video", name: "Video", description: "Playable story card with a video thumbnail, play affordance, and runtime." },
  { id: "community", name: "Community", description: "Conversation card with its host, group context, reply count, and action." },
  { id: "event", name: "Event", description: "Event card with date, venue, organizers, and a clear next step." },
  { id: "vehicle", name: "Make, Model & Year", description: "Automotive card that identifies the vehicle and shows its verified rating when available." },
  { id: "gallery", name: "Photo Gallery", description: "Image-led story card that previews a gallery before readers open it." },
  { id: "shorts", name: "Shorts", description: "A vertical-video card for quick, mobile-first clips." },
  { id: "advertisement", name: "Advertisement", description: "Clearly disclosed sponsored creative with its own message and destination." },
  { id: "brand-spotlight", name: "Brand Spotlight", description: "A publication feature with one lead story and supporting stories from that brand." },
] as const;

type CardTypeId = (typeof cardTypes)[number]["id"];

function CardWireframe({ type, active }: { type: CardTypeId; active: boolean }) {
  const panel = cn("rounded-[2px] border", active ? "border-primary/50 bg-primary/10" : "border-border bg-muted");
  return (
    <span aria-hidden className="flex h-12 w-[82px] shrink-0 items-center rounded-[3px] border border-border bg-background p-1.5">
      {type === "article" || type === "video" || type === "vehicle" || type === "gallery" || type === "shorts" ? (
        <span className="grid w-full grid-cols-[1fr_1.1fr] gap-1"><span className={cn(panel, "h-8")} /><span className="flex flex-col justify-center gap-1"><span className={cn(panel, "h-2")} /><span className={cn(panel, "h-1.5")} /><span className={cn(panel, "h-1.5")} /></span></span>
      ) : type === "brand-spotlight" ? (
        <span className="grid w-full grid-cols-[1.2fr_1fr] gap-1"><span className={cn(panel, "h-8")} /><span className="flex flex-col gap-1">{[0, 1, 2].map((item) => <span key={item} className={cn(panel, "h-2 flex-1")} />)}</span></span>
      ) : type === "community" ? (
        <span className="flex w-full flex-col gap-1"><span className={cn(panel, "h-2 w-2/3")} /><span className={cn(panel, "h-2 w-full")} /><span className={cn(panel, "h-2 w-4/5")} /><span className={cn(panel, "h-2 w-1/2")} /></span>
      ) : (
        <span className="flex w-full flex-col gap-1"><span className={cn(panel, "h-5")} /><span className={cn(panel, "h-2 w-2/3")} /><span className={cn(panel, "h-2 w-full")} /></span>
      )}
    </span>
  );
}

function CardLibrary({
  stories,
  videoStories,
  communityThread,
  eventSample,
  vehicleStory,
  galleryStory,
  shortsStories,
  sponsoredAd,
  brandSpotlight,
}: {
  stories: LifestyleRiverStory[];
  videoStories: LifestyleRiverStory[];
  communityThread: CommunityFeedThread;
  eventSample: HearstEventRecord;
  vehicleStory: LifestyleRiverStory;
  galleryStory: LifestyleRiverStory;
  shortsStories: LifestyleRiverStory[];
  sponsoredAd: ContextualAdUnit;
  brandSpotlight: BrandPromotionMatch | null;
}) {
  const [selectedType, setSelectedType] = React.useState<CardTypeId>("article");
  const selected = cardTypes.find((type) => type.id === selectedType) ?? cardTypes[0];
  const article = stories.find((story) => !story.videoUrl && story.id !== galleryStory.id) ?? stories[0];
  const video = videoStories.find((story) => Boolean(story.videoUrl)) ?? videoStories[0] ?? article;

  let sample: React.ReactNode;
  if (selectedType === "community") sample = <div className="mx-auto w-full max-w-2xl"><CommunityHomeRiverCard thread={communityThread} /></div>;
  else if (selectedType === "event") sample = <div className="mx-auto w-full max-w-2xl"><EventTile event={eventSample} /></div>;
  else if (selectedType === "shorts") sample = shortsStories.length > 0
    ? <div className="mx-auto w-full max-w-4xl"><VerticalVideoCarousel stories={shortsStories} onOpen={() => undefined} theme="light" title="Hearst Shorts" summaryLabel="vertical" /></div>
    : <div className="mx-auto w-full max-w-[320px]"><article className="overflow-hidden rounded-card border border-border bg-card shadow-[var(--hp-shadow-card)]"><div className="relative aspect-[9/16] overflow-hidden bg-black"><LifestyleRiverImage story={video} className="h-full w-full object-cover" /><span className="absolute inset-0 grid place-items-center"><span className="grid size-12 place-items-center rounded-full bg-white text-black"><Play className="size-5 fill-current" aria-hidden /></span></span><span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white">Shorts</span></div><div className="p-4"><p className="text-xs text-muted-foreground">{video.brand} · Vertical video</p><h4 className="headline mt-2 text-lg font-bold leading-tight">{video.title}</h4></div></article></div>;
  else if (selectedType === "advertisement") sample = <div className="mx-auto w-full max-w-2xl"><ContextualRiverAdvertisement ad={sponsoredAd} /></div>;
  else if (selectedType === "brand-spotlight") sample = <div className="mx-auto w-full max-w-5xl"><BrandPromotionRiverModule promotion={brandSpotlight} onOpenStory={() => undefined} /></div>;
  else {
    const story = selectedType === "video" ? video : selectedType === "vehicle" ? vehicleStory : selectedType === "gallery" ? galleryStory : article;
    sample = <div className="mx-auto w-full max-w-2xl"><LifestyleRiverCard story={story} onOpen={() => undefined} layoutOverride="blocks" compactGallery={selectedType === "gallery"} /></div>;
  }

  return (
    <section className="mt-16 border-t border-primary pt-8 sm:mt-20 sm:pt-10" aria-labelledby="card-library-heading">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Reusable content components</p>
        <h2 id="card-library-heading" className="headline mt-3 text-3xl font-bold leading-tight sm:text-4xl">Card Library</h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Blocks use these card types to promote different kinds of content. Select a type to see its real card UI and the content fields it carries.</p>
      </header>

      <div className="mt-7 grid min-w-0 gap-7 border-t border-border pt-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-2" aria-label="Card type index">
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3"><h3 className="text-xs font-bold uppercase tracking-[0.14em]">Card types</h3><span className="font-mono text-xs text-muted-foreground">{String(cardTypes.length).padStart(2, "0")}</span></div>
          <nav aria-label="Select a card type" className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] lg:flex-col lg:overflow-visible lg:pb-0">
            {cardTypes.map((type, index) => {
              const active = type.id === selectedType;
              return <button key={type.id} type="button" aria-pressed={active} onClick={() => setSelectedType(type.id)} className={cn("group flex w-[190px] shrink-0 items-center gap-3 rounded-[6px] border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:w-full", active ? "border-primary/40 bg-primary/5" : "border-transparent hover:border-border hover:bg-card")}>
                <CardWireframe type={type.id} active={active} />
                <span className="min-w-0"><span className="block font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="mt-1 block text-xs font-semibold leading-snug sm:text-sm">{type.name}</span></span>
              </button>;
            })}
          </nav>
        </aside>

        <div className="min-w-0" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
            <div><p className="font-mono text-xs font-semibold text-primary">CARD TYPE {String(cardTypes.findIndex((type) => type.id === selectedType) + 1).padStart(2, "0")}</p><h3 className="headline mt-2 text-2xl font-bold leading-tight sm:text-3xl">{selected.name}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{selected.description}</p></div>
            <span className="text-xs font-semibold text-muted-foreground">Rendered Hearst+ UI</span>
          </div>
          <div className="mt-5 rounded-[8px] bg-muted/60 p-3 sm:p-5 lg:p-7">{sample}</div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">Card content is a representative sample. Blocks determine where the card appears; the card type determines the content and actions shown.</p>
        </div>
      </div>
    </section>
  );
}

const sidebarWidgets = [
  { id: "trending", name: "Trending Stories", description: "Ranked stories for quick discovery across brands." },
  { id: "saved", name: "Saved Items", description: "A reader’s saved stories. When none are saved, it explains the value, offers Browse For You and suggests three stories to save." },
  { id: "communities", name: "Explore Communities", description: "Relevant brand groups with join actions and member context." },
  { id: "events", name: "Event Discovery", description: "Upcoming experiences with dates, locations, and event links." },
  { id: "local-news", name: "Local News", description: "Station-attributed headlines with market context." },
  { id: "advertisement", name: "Advertisement", description: "A clearly labeled sponsored placement sized for the sidebar." },
] as const;

type SidebarWidgetId = (typeof sidebarWidgets)[number]["id"];

function SidebarWidgetWireframe({ type, active }: { type: SidebarWidgetId; active: boolean }) {
  const panel = cn("rounded-[2px] border", active ? "border-primary/50 bg-primary/10" : "border-border bg-muted");
  return <span aria-hidden className="flex h-12 w-[82px] shrink-0 items-center rounded-[3px] border border-border bg-background p-1.5">
    {type === "advertisement" ? <span className={cn(panel, "h-full w-full")} /> : type === "communities" ? <span className="flex w-full flex-col gap-1">{["a", "b", "c"].map((item) => <span key={item} className="flex items-center gap-1"><span className={cn(panel, "size-2 shrink-0")} /><span className={cn(panel, "h-2 flex-1")} /><span className={cn(panel, "h-2 w-3")} /></span>)}</span> : <span className="flex w-full flex-col gap-1">{["a", "b", "c"].map((item) => <span key={item} className="grid grid-cols-[13px_1fr] gap-1"><span className={cn(panel, "h-3")} /><span className={cn(panel, "h-3")} /></span>)}</span>}
  </span>;
}

function SidebarWidgetLibrary({ stories, eventSample }: { stories: LifestyleRiverStory[]; eventSample: HearstEventRecord }) {
  const [selectedId, setSelectedId] = React.useState<SidebarWidgetId>(sidebarWidgets[0].id);
  const [savedState, setSavedState] = React.useState<"saved" | "empty">("saved");
  const selected = sidebarWidgets.find((widget) => widget.id === selectedId) ?? sidebarWidgets[0];
  const communityWidgetGroups = communityGroups.slice(0, 3).map((group) => ({
    brand: brands.find((brand) => brand.slug === group.brandSlug)?.name ?? group.brandSlug,
    brandSlug: group.brandSlug,
    groupSlug: group.groupSlug,
    name: group.name,
    members: group.members,
  }));
  const events = [eventSample, ...hearstEvents.filter((event) => event.slug !== eventSample.slug)].slice(0, 3);

  let sample: React.ReactNode;
  if (selectedId === "trending") {
    sample = <TrendingStoryRail stories={stories.slice(0, 5)} onOpenStory={() => undefined} />;
  } else if (selectedId === "saved") {
    sample = <div className="space-y-3">
      <div role="group" aria-label="Saved Items state" className="flex gap-2">{(["saved", "empty"] as const).map((state) => <button key={state} type="button" aria-pressed={savedState === state} onClick={() => setSavedState(state)} className={cn("inline-flex min-h-9 items-center rounded-[5px] border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", savedState === state ? "border-primary/40 bg-primary/5 text-primary" : "border-border bg-card hover:bg-muted")}>{state === "saved" ? "With saves" : "Empty"}</button>)}</div>
      <SavedItemsModule savedStories={savedState === "saved" ? stories.slice(1, 4) : []} suggestions={stories.slice(4, 7)} onOpenStory={() => undefined} onSaveSuggestion={() => undefined} onBrowseForYou={() => undefined} />
    </div>;
  } else if (selectedId === "communities") {
    sample = <CommunityJoinedGroupsCard groups={communityWidgetGroups} />;
  } else if (selectedId === "events") {
    sample = <DiscoverySidebarCard title="Explore Events" summary="Upcoming experiences from Hearst brands">
      <div className="divide-y divide-border/70">{events.map((event) => <Link key={event.slug} href={`/hearst-plus/events/${event.slug}/`} className="grid min-h-16 grid-cols-[48px_minmax(0,1fr)] items-center gap-3 py-3 focus-visible:outline-2 focus-visible:outline-primary"><span className="relative block size-12 overflow-hidden rounded-[5px] bg-muted"><Image src={event.image.src} alt="" fill sizes="48px" className="object-cover" /></span><span className="min-w-0"><span className="block line-clamp-2 text-xs font-bold leading-snug">{event.title}</span><span className="mt-1 block text-[11px] text-muted-foreground">{event.dateLabel}</span></span></Link>)}</div>
    </DiscoverySidebarCard>;
  } else if (selectedId === "local-news") {
    sample = <DiscoverySidebarCard title="Local News" summary="Station headlines for a selected market">
      <div className="flex items-center justify-between gap-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-primary"><span>Local News</span><span className="font-normal normal-case tracking-normal text-muted-foreground">Baltimore</span></div>
      <StoryRow story={todayEditLocalNewsStory} rank={1} />
      <Link href="/hearst-plus/local-news/" className="mt-3 block border-t border-border pt-3 text-xs font-bold text-primary hover:underline">View all local news</Link>
    </DiscoverySidebarCard>;
  } else {
    sample = <AdSample />;
  }

  return <section className="mt-16 border-t border-primary pt-8 sm:mt-20 sm:pt-10" aria-labelledby="sidebar-widget-library-heading">
    <header className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Reusable sidebar modules</p><h2 id="sidebar-widget-library-heading" className="headline mt-3 text-3xl font-bold leading-tight sm:text-4xl">Sidebar Widget Library</h2><p className="mt-3 text-base leading-7 text-muted-foreground">Browse modules that can be placed in sidebar columns. Select a widget to inspect its UI and the information it presents.</p></header>
    <div className="mt-7 grid min-w-0 gap-7 border-t border-border pt-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10">
      <aside className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-2" aria-label="Sidebar widget index">
        <div className="mb-3 flex items-center justify-between border-b border-border pb-3"><h3 className="text-xs font-bold uppercase tracking-[0.14em]">Widgets</h3><span className="font-mono text-xs text-muted-foreground">{String(sidebarWidgets.length).padStart(2, "0")}</span></div>
        <nav aria-label="Select a sidebar widget" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">{sidebarWidgets.map((widget, index) => {
          const active = widget.id === selectedId;
          return <button key={widget.id} type="button" aria-pressed={active} onClick={() => setSelectedId(widget.id)} className={cn("group flex min-w-0 items-center gap-3 rounded-[6px] border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", active ? "border-primary/40 bg-primary/5" : "border-transparent hover:border-border hover:bg-card")}><SidebarWidgetWireframe type={widget.id} active={active} /><span className="min-w-0"><span className="block font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="mt-1 block text-xs font-semibold leading-snug sm:text-sm">{widget.name}</span></span></button>;
        })}</nav>
      </aside>
      <div className="min-w-0" aria-live="polite"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4"><div><p className="font-mono text-xs font-semibold text-primary">WIDGET {String(sidebarWidgets.findIndex((widget) => widget.id === selectedId) + 1).padStart(2, "0")}</p><h3 className="headline mt-2 text-2xl font-bold leading-tight sm:text-3xl">{selected.name}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{selected.description}</p></div><span className="text-xs font-semibold text-muted-foreground">Sidebar preview</span></div><div className="mt-5 rounded-[8px] bg-muted/60 p-4 sm:p-6"><div className="mx-auto w-full max-w-[360px]">{sample}</div></div><p className="mt-4 text-xs leading-5 text-muted-foreground">Widgets can be combined and ordered to fit the section, brand, and reader context.</p></div>
    </div>
  </section>;
}

function Wireframe({ type, active = false }: { type: string; active?: boolean }) {
  const surface = cn("rounded-[2px] border", active ? "border-primary/50 bg-primary/10" : "border-border bg-muted");
  const block = (key: string, className: string) => <span key={key} className={cn(surface, "block", className)} />;

  if (type === "featured-four" || type === "featured-video-four") {
    return <div className="w-full space-y-1"><div className={cn(surface, "h-5 w-full")} /><div className="grid grid-cols-4 gap-1">{Array.from({ length: 4 }, (_, i) => block(`c${i}`, "h-4"))}</div></div>;
  }
  if (type === "four-card-row") {
    return <div className="flex w-full gap-1">{Array.from({ length: 4 }, (_, i) => block(`row-${i}`, "h-8 min-w-0 flex-1"))}</div>;
  }
  if (type === "feature-sidebar") {
    return <div className="grid w-full grid-cols-[1.3fr_1fr] gap-1"><span className={cn(surface, "h-9")} /><span className="grid grid-rows-4 gap-1">{Array.from({ length: 4 }, (_, i) => block(`r${i}`, "h-2"))}</span></div>;
  }
  if (type === "hero-three-horizontal") {
    return <div className="w-full space-y-1"><span className={cn(surface, "block h-2 w-2/3")} /><span className={cn(surface, "block h-7 w-full")} />{Array.from({ length: 3 }, (_, i) => <span key={i} className="grid grid-cols-[18px_1fr] gap-1"><span className={cn(surface, "h-3")} /><span className="flex flex-col justify-center gap-1"><span className={cn(surface, "h-1.5 w-full")} /><span className={cn(surface, "h-1 w-2/3")} /></span></span>)}</div>;
  }
  if (type === "three-column-feature") {
    return <div className="grid w-full grid-cols-[.8fr_1.5fr_.8fr] gap-1">{block("left", "h-9")}{block("mid", "h-9")}{block("right", "h-9")}</div>;
  }
  if (type === "horizontal-story-list") {
    return <div className="w-full space-y-1">{Array.from({ length: 3 }, (_, i) => <span key={i} className="grid grid-cols-[20px_1fr] gap-1">{block(`im${i}`, "h-3")}{block(`tx${i}`, "h-3")}</span>)}</div>;
  }
  return <div className="grid w-full grid-cols-2 gap-1">{Array.from({ length: 4 }, (_, i) => block(`g${i}`, "h-4"))}</div>;
}

function StoryRow({ story, rank }: { story: LifestyleRiverStory; rank?: number }) {
  return <div className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)] items-center gap-2 border-b border-border/70 py-2 last:border-0"><div className="relative aspect-square overflow-hidden rounded-[4px] bg-muted"><LifestyleRiverImage story={story} className="h-full w-full object-cover" priority />{rank ? <span className="absolute left-1 top-1 grid size-4 place-items-center rounded-full bg-[var(--hp-surface)] text-[9px] font-bold">{rank}</span> : null}</div><div className="min-w-0"><p className="line-clamp-2 text-[11px] font-bold leading-snug">{story.title}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">{story.brand}</p></div></div>;
}

function AdSample() {
  return <article className="overflow-hidden rounded-card bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"><div className="relative aspect-[16/9] bg-slate-700"><div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-500 to-slate-800"/><span className="absolute left-3 top-3 text-[9px] font-bold uppercase tracking-widest text-white">Advertisement</span><span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white">Demo creative</span></div><div className="p-3"><p className="text-[9px] font-bold uppercase tracking-widest text-primary">Contextual placement</p><h3 className="headline mt-1 text-base font-bold">A message for this audience</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Sponsor copy adapts to the surrounding editorial context.</p></div></article>;
}

const noop = () => undefined;
const noSavedIds: string[] = [];

/** Library previews render the production block (`EditorialHomepageSection`) so each pattern shows what ships. */
function ProductionBlock({ title, stories, mode }: { title: string; stories: LifestyleRiverStory[]; mode: "featuredRow" | "cardRow" | "featureSidebar" | "riverWithHero" | "grid" | "river" | "lead" }) {
  return <EditorialHomepageSection
    section={{ title, stories }}
    selectionLabel="Hearst+ Selection"
    onOpen={noop}
    savedIds={noSavedIds}
    onSave={noop}
    featureFirstGrid={mode === "featuredRow"}
    cardGrid={mode === "cardRow"}
    featureSidebar={mode === "featureSidebar"}
    riverWithHero={mode === "riverWithHero"}
    grid={mode === "grid"}
    river={mode === "river"}
  />;
}

function PatternPreview({ patternId, stories, videos, sponsoredAd }: { patternId: PatternId; stories: LifestyleRiverStory[]; videos: LifestyleRiverStory[]; sponsoredAd: ContextualAdUnit }) {
  const sample = stories.slice(0, 9);
  const videoSamples = videos.length >= 5 ? videos.slice(0, 5) : [...videos, ...videos, ...videos].slice(0, 5);

  if (patternId === "featured-four") return <ProductionBlock title="Style & Beauty" stories={sample.slice(0, 5)} mode="featuredRow" />;
  if (patternId === "four-card-row") return <ProductionBlock title="Cars & Reviews" stories={sample.slice(0, 4)} mode="cardRow" />;
  if (patternId === "feature-sidebar") return <ProductionBlock title="Fitness & Wellness" stories={sample.slice(0, 5)} mode="featureSidebar" />;
  if (patternId === "hero-three-horizontal") return <ProductionBlock title="Style & Beauty" stories={sample.slice(0, 4)} mode="riverWithHero" />;
  if (patternId === "four-card-grid") return <ProductionBlock title="Food & Home" stories={sample.slice(0, 8)} mode="grid" />;
  if (patternId === "horizontal-story-list") return <ProductionBlock title="Entertainment" stories={sample.slice(0, 5)} mode="river" />;
  if (patternId === "three-column-feature") return <div className="@container/hp-block min-w-0">
    <div className="grid min-w-0 items-start gap-5 @min-[820px]/hp-block:grid-cols-[minmax(240px,.8fr)_minmax(0,1.6fr)] @min-[1100px]/hp-block:grid-cols-[minmax(240px,.75fr)_minmax(0,1.6fr)_minmax(240px,.75fr)]">
      <TrendingStoryRail stories={sample.slice(0, 5)} onOpenStory={noop} />
      <div className="min-w-0 @min-[820px]/hp-block:col-start-2 @min-[820px]/hp-block:row-span-2 @min-[820px]/hp-block:row-start-1 @min-[1100px]/hp-block:row-span-1"><ProductionBlock title="Style & Beauty" stories={sample.slice(5, 6)} mode="lead" /></div>
      <div className="min-w-0 @min-[1100px]/hp-block:col-start-3 @min-[1100px]/hp-block:row-start-1"><ContextualRiverAdvertisement ad={sponsoredAd} /></div>
    </div>
  </div>;
  if (patternId === "featured-video-four") return <div className="@container/hp-block min-w-0 space-y-5">
    <LifestyleRiverCard story={videoSamples[0]} onOpen={noop} layoutOverride="cards" featured />
    <div className="hp-block-grid min-w-0">{videoSamples.slice(1, 5).map((story, index) => <LifestyleRiverCard key={`${story.id}-${index}`} story={story} onOpen={noop} layoutOverride="cards" />)}</div>
  </div>;
  return null;
}

export function BlocksLibraryExperience({
  stories,
  videoStories,
  communityThread,
  eventSample,
  vehicleStory,
  galleryStory,
  shortsStories,
  sponsoredAd,
  brandSpotlight,
}: {
  stories: LifestyleRiverStory[];
  videoStories: LifestyleRiverStory[];
  communityThread: CommunityFeedThread;
  eventSample: HearstEventRecord;
  vehicleStory: LifestyleRiverStory;
  galleryStory: LifestyleRiverStory;
  shortsStories: LifestyleRiverStory[];
  sponsoredAd: ContextualAdUnit;
  brandSpotlight: BrandPromotionMatch | null;
}) {
  const [selectedId, setSelectedId] = React.useState<PatternId>(patterns[0].id);
  const selected = patterns.find((pattern) => pattern.id === selectedId) ?? patterns[0];
  const usableStories = stories.filter((story) => story.image && story.title).slice(0, 32);
  const usableVideos = videoStories.filter((story) => story.image && story.title && story.videoUrl).slice(0, 12);
  const previewStories = usableStories.length >= 9 ? usableStories : [...usableStories, ...usableStories, ...usableStories].slice(0, 9);
  const previewVideos = usableVideos.length ? usableVideos : previewStories;

  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] text-foreground">
      <UtilityBar activeDestinationOverride="All" />
      <header>
        <MainNav
          brandSlug="hearst-all"
          mastheadDescriptorOverride="Blocks Library"
          searchStories={stories}
        />
      </header>
      <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
        <Link href="/hearst-plus/blocks/" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">← Blocks layout</Link>
        <header className="mt-5 border-b-2 border-primary pb-6 sm:pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Hearst+ · Product strategy</p>
          <h1 className="headline mt-3 text-4xl font-bold leading-tight sm:text-5xl">Building Blocks Library</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">A visual guide to the reusable layouts behind Hearst+ blocks. Choose a pattern to inspect a realistic sample built from Hearst stories.</p>
        </header>

        <nav aria-label="Building blocks library sections" className="sticky top-16 z-40 -mx-5 mt-4 border-y border-border bg-background/95 px-5 py-2 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <a href="#patterns" className="inline-flex min-h-10 shrink-0 items-center rounded-[5px] px-3 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary">Patterns</a>
            <a href="#cards" className="inline-flex min-h-10 shrink-0 items-center rounded-[5px] px-3 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary">Cards</a>
            <a href="#widgets" className="inline-flex min-h-10 shrink-0 items-center rounded-[5px] px-3 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary">Widgets</a>
          </div>
        </nav>

        <div id="patterns" className="mt-6 grid min-w-0 scroll-mt-28 gap-7 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10">
          <aside className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-2" aria-label="Block pattern index">
            <div className="mb-3 flex items-center justify-between border-b border-border pb-3"><h2 className="text-xs font-bold uppercase tracking-[0.14em]">Patterns</h2><span className="font-mono text-xs text-muted-foreground">{String(patterns.length).padStart(2, "0")}</span></div>
            <nav aria-label="Select a block pattern" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
              {patterns.map((pattern, index) => {
                const active = pattern.id === selectedId;
                return <button key={pattern.id} type="button" aria-pressed={active} onClick={() => setSelectedId(pattern.id)} className={cn("group flex min-w-0 items-center gap-3 rounded-[6px] border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", active ? "border-primary/40 bg-primary/5" : "border-transparent hover:border-border hover:bg-card")}>
                  <span className="flex h-12 w-[82px] shrink-0 items-center rounded-[3px] border border-border bg-background p-1.5"><Wireframe type={pattern.wireframe} active={active} /></span>
                  <span className="min-w-0"><span className="block font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="mt-1 block text-xs font-semibold leading-snug sm:text-sm">{pattern.name}</span></span>
                </button>;
              })}
            </nav>
          </aside>

          <section className="min-w-0" aria-labelledby="selected-pattern-title">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
              <div><p className="font-mono text-xs font-semibold text-primary">PATTERN {String(patterns.findIndex((item) => item.id === selectedId) + 1).padStart(2, "0")}</p><h2 id="selected-pattern-title" className="headline mt-2 text-3xl font-bold leading-tight sm:text-4xl">{selected.name}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{selected.description}</p></div>
              <span className="text-xs font-semibold text-muted-foreground">Responsive preview · Hearst+ stories</span>
            </div>
            <div className="mt-5 rounded-[8px] bg-muted/60 p-3 sm:p-5 lg:p-7">
              <PatternPreview patternId={selectedId} stories={previewStories} videos={previewVideos} sponsoredAd={sponsoredAd} />
            </div>
            <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Layout rule</p><p className="mt-1 text-sm leading-6">The pattern sets placement and card proportions. Editorial content and brand styling remain contextual.</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">In practice</p><p className="mt-1 text-sm leading-6">The sample uses current Hearst story records to show image crops, brand identity, headlines, and summaries at working sizes.</p></div>
            </div>
          </section>
        </div>

        <div id="cards" className="scroll-mt-28">
        <CardLibrary
          stories={previewStories}
          videoStories={previewVideos}
          communityThread={communityThread}
          eventSample={eventSample}
          vehicleStory={vehicleStory}
          galleryStory={galleryStory}
          shortsStories={shortsStories}
          sponsoredAd={sponsoredAd}
          brandSpotlight={brandSpotlight}
        />
        </div>
        <div id="widgets" className="scroll-mt-28">
          <SidebarWidgetLibrary stories={previewStories} eventSample={eventSample} />
        </div>
      </div>
      </main>
      <ProductFooter />
    </div>
  );
}
