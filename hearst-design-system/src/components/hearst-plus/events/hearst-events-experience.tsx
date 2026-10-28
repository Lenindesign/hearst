"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { ContentReaderDialogShell } from "@/components/hearst-plus/content-reader-dialog-shell";
import { ContentReaderMasthead } from "@/components/hearst-plus/content-reader-masthead";
import { DiscoverySidebarCard } from "@/components/hearst-plus/discovery-sidebar";
import { LocalNewsRail } from "@/components/hearst-plus/local-news-rail";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { MainNav } from "@/components/home-page";
import { CalendarBlank, ChevronRight, MapPin } from "@/components/ui/icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArticleCard,
  ArticleCardContent,
  ArticleCardDescription,
  ArticleCardEyebrow,
  ArticleCardFooter,
  ArticleCardImage,
  ArticleCardMeta,
  ArticleCardMetaItem,
  ArticleCardTitle,
} from "@/components/ui/article-card";
import {
  getHearstEventRelationshipLabel,
  hearstEvents,
  type HearstEventRecord,
  type HearstEventRelationship,
} from "@/lib/hearst-events";
import { getHearstAllBrands } from "@/lib/hearst-routes";

type RelationshipFilter = "all" | HearstEventRelationship;
type EventDisplayMode = "stories" | "calendar";

const HearstEventsCalendar = dynamic(
  () => import("@/components/hearst-plus/events/hearst-events-calendar").then((module) => module.HearstEventsCalendar),
  { ssr: false, loading: () => <p className="border-y border-border py-8 text-sm text-muted-foreground">Loading calendar…</p> },
);

const relationshipNavItems = [
  { value: "all", label: "All events" },
  { value: "organized", label: "Hearst events" },
  { value: "covered", label: "Editorial coverage" },
] as const;

const eventBrandOptions = [
  { value: "all", label: "All brands" },
  ...getHearstAllBrands()
    .map(({ brand, brandSlug }) => ({ value: brandSlug, label: brand }))
    .sort((a, b) => a.label.localeCompare(b.label)),
];

function EventHeader({
  relationship = "all",
  onRelationshipChange,
  brand,
  onBrandChange,
  brandOptions = eventBrandOptions,
}: {
  relationship?: RelationshipFilter;
  onRelationshipChange?: (relationship: RelationshipFilter) => void;
  brand?: string;
  onBrandChange?: (brand: string) => void;
  brandOptions?: { value: string; label: string }[];
}) {
  const headerNavItems = onRelationshipChange ? relationshipNavItems : [relationshipNavItems[0]];
  const navTrailingContent = onBrandChange ? (
    <div className="flex min-h-10 shrink-0 items-center gap-2 border-l border-border pl-3 text-xs md:text-sm">
      <span className="font-bold">Brand</span>
      <Select value={brand ?? "all"} onValueChange={(nextBrand) => {
        if (nextBrand) onBrandChange(nextBrand);
      }}>
        <SelectTrigger
          aria-label="Filter events by brand"
          className="h-10 min-h-10 w-[156px] rounded-lg border-input bg-background px-3 text-left text-sm font-medium text-foreground shadow-xs sm:w-[184px]"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="end"
          alignItemWithTrigger={false}
          className="max-h-[min(420px,var(--available-height))] rounded-lg border border-border bg-popover p-1 shadow-xl ring-1 ring-foreground/10"
        >
          {brandOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="min-h-10 px-3 pr-9 text-sm font-medium"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : undefined;
  const navLinkHrefOverrides = onRelationshipChange ? undefined : Object.fromEntries(
    headerNavItems.map((item) => [item.label, "/hearst-plus/events/"]),
  );

  return (
    <>
      <UtilityBar activeDestinationOverride="All" />
      <header>
        <MainNav
          brandSlug="hearst-all"
          mastheadDescriptorOverride="Events"
          navLinksOverride={headerNavItems.map((item) => item.label)}
          activeFilter={headerNavItems.find((item) => item.value === relationship)?.label}
          onFilterChange={onRelationshipChange ? (label) => {
            const selected = relationshipNavItems.find((item) => item.label === label);
            if (selected) onRelationshipChange(selected.value);
          } : undefined}
          navLinkHrefOverrides={navLinkHrefOverrides}
          navTrailingContent={navTrailingContent}
        />
      </header>
    </>
  );
}

function EventBrandMarks({ event }: { event: HearstEventRecord }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-3" role="group" aria-label={`Presented by ${event.brandNames.join(" and ")}`}>
      {event.brandSlugs.map((slug) => (
        <span key={slug} className="flex items-center">
          <BrandLogo
            slug={slug}
            className="block h-6 max-w-36 [&_svg]:h-full [&_svg]:w-auto"
            decorative
          />
        </span>
      ))}
    </div>
  );
}

function EventFacts({ event }: { event: HearstEventRecord }) {
  return (
    <ArticleCardMeta className="flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3 text-sm">
      <ArticleCardMetaItem className="inline-flex items-center gap-1.5 font-semibold text-foreground">
        <CalendarBlank className="size-4 shrink-0 text-primary" aria-hidden />
        {event.dateLabel}
      </ArticleCardMetaItem>
      <ArticleCardMetaItem className="inline-flex items-center gap-1.5">
        <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
        {event.venue}, {event.location}
      </ArticleCardMetaItem>
    </ArticleCardMeta>
  );
}

function RelationshipLabel({ relationship }: { relationship: HearstEventRelationship }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
      {getHearstEventRelationshipLabel(relationship)}
    </p>
  );
}

export function EventTile({ event }: { event: HearstEventRecord }) {
  const href = `/hearst-plus/events/${event.slug}/`;

  return (
    <ArticleCard size="lg" className="min-w-0">
      <Link href={href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary" aria-label={`Open event: ${event.title}`}>
        <ArticleCardImage
          src={event.image.src}
          alt={event.image.alt}
          aspectRatio="16/9"
          className="transition-transform duration-300 group-hover/article-card:scale-[1.015] motion-reduce:transition-none"
        />
      </Link>
      <ArticleCardContent>
        <ArticleCardEyebrow>{getHearstEventRelationshipLabel(event.relationship)}</ArticleCardEyebrow>
        <ArticleCardTitle className="text-2xl leading-tight sm:text-3xl">
          <Link href={href} className="hover:underline focus-visible:underline">{event.title}</Link>
        </ArticleCardTitle>
        <ArticleCardDescription className="line-clamp-4 text-sm sm:text-base">{event.summary}</ArticleCardDescription>
        <div className="pt-2"><EventBrandMarks event={event} /></div>
        <EventFacts event={event} />
      </ArticleCardContent>
      <ArticleCardFooter>
        <span className="text-sm text-muted-foreground">{event.status === "upcoming" ? "Plan your visit" : "Explore the coverage"}</span>
        <Link href={href} className="inline-flex min-h-11 items-center gap-1 font-bold text-primary underline-offset-4 hover:underline focus-visible:underline">
          {event.relationship === "organized" ? "Explore event" : "Read coverage"}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </ArticleCardFooter>
    </ArticleCard>
  );
}

function EventRailLink({ event, rank }: { event: HearstEventRecord; rank?: number }) {
  return (
    <Link
      href={`/hearst-plus/events/${event.slug}/`}
      className="group grid min-h-16 grid-cols-[48px_minmax(0,1fr)] items-start gap-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="relative block h-12 w-12 overflow-hidden rounded-[6px] border border-border bg-muted">
        <Image src={event.image.src} alt="" fill sizes="48px" className="object-cover" />
        {rank ? (
          <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-background text-[11px] font-bold leading-none text-foreground ring-1 ring-border">
            {rank}
          </span>
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="line-clamp-3 block text-xs font-bold leading-[1.35] group-hover:text-primary group-focus-visible:text-primary">
          {event.title}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {event.relationship === "organized" ? "Hearst event" : event.brandNames[0]}
        </span>
      </span>
    </Link>
  );
}

function EventSidebars({
  events,
  upcomingEvent,
  onFilterRelationship,
}: {
  events: HearstEventRecord[];
  upcomingEvent?: HearstEventRecord;
  onFilterRelationship: (relationship: RelationshipFilter) => void;
}) {
  const coveredEvents = events.filter((event) => event.relationship === "covered");

  return (
    <>
      <aside className="hidden min-w-0 space-y-5 lg:col-start-1 lg:row-start-1 lg:sticky lg:top-[86px] lg:block lg:max-h-[calc(100dvh-110px)] lg:self-start lg:overflow-y-auto lg:pr-1" aria-label="Event discovery sidebar">
        <DiscoverySidebarCard title="Trending across events" summary="Experiences and stories from Hearst brands">
          <ol className="-mb-3 divide-y divide-border/70">
            {events.slice(0, 5).map((event, index) => (
              <li key={event.slug}><EventRailLink event={event} rank={index + 1} /></li>
            ))}
          </ol>
        </DiscoverySidebarCard>
        <DiscoverySidebarCard title="Browse event types" summary="Choose Hearst events or editorial coverage">
          <div className="divide-y divide-border/70">
            <button type="button" onClick={() => onFilterRelationship("organized")} className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left text-sm font-semibold hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <span>Organized by Hearst brands</span><span className="text-xs tabular-nums text-muted-foreground">{events.filter((event) => event.relationship === "organized").length}</span>
            </button>
            <button type="button" onClick={() => onFilterRelationship("covered")} className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left text-sm font-semibold hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <span>Covered by our editors</span><span className="text-xs tabular-nums text-muted-foreground">{coveredEvents.length}</span>
            </button>
          </div>
        </DiscoverySidebarCard>
      </aside>

      <aside className="hidden min-w-0 space-y-5 md:col-start-2 md:row-start-1 md:sticky md:top-[86px] md:block md:max-h-[calc(100dvh-110px)] md:self-start md:overflow-y-auto md:pr-1 lg:col-start-3" aria-label="Event planning and local news">
        {upcomingEvent ? (
          <DiscoverySidebarCard title="Plan your visit" summary={`${upcomingEvent.dateLabel} · ${upcomingEvent.venue}`}>
            <p className="text-sm font-bold">{upcomingEvent.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{upcomingEvent.dateLabel}<br />{upcomingEvent.venue}<br />{upcomingEvent.location}</p>
            <a href={upcomingEvent.primaryAction.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center font-bold text-primary underline-offset-4 hover:underline">
              {upcomingEvent.primaryAction.label}<ChevronRight className="ml-1 h-4 w-4" aria-hidden />
            </a>
          </DiscoverySidebarCard>
        ) : null}
        {coveredEvents.length ? (
          <DiscoverySidebarCard title="From our editors" summary="Stories connected to the events we cover">
            <div className="divide-y divide-border/70">
              {coveredEvents.slice(0, 5).map((event) => <EventRailLink key={event.slug} event={event} />)}
            </div>
          </DiscoverySidebarCard>
        ) : null}
        <LocalNewsRail />
      </aside>
    </>
  );
}

export function HearstEventsIndex({ initialBrand = "all" }: { initialBrand?: string }) {
  const [relationship, setRelationship] = useState<RelationshipFilter>("all");
  const [brand, setBrand] = useState(initialBrand);
  const [displayMode, setDisplayMode] = useState<EventDisplayMode>("stories");
  const visibleEvents = useMemo(() => hearstEvents.filter((event) => {
    const matchesRelationship = relationship === "all" || event.relationship === relationship;
    const matchesBrand = brand === "all" || event.brandSlugs.includes(brand);
    return matchesRelationship && matchesBrand;
  }), [relationship, brand]);
  const selectedBrandHasEvents = brand === "all" || hearstEvents.some((event) => event.brandSlugs.includes(brand));

  const brandOptions = eventBrandOptions;

  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] text-foreground">
      <EventHeader
        relationship={relationship}
        onRelationshipChange={setRelationship}
        brand={brand}
        onBrandChange={setBrand}
        brandOptions={brandOptions}
      />
      <main>
        <section className="mx-auto grid max-w-[1360px] gap-x-4 gap-y-6 px-5 pt-4 pb-8 md:grid-cols-[minmax(0,1fr)_300px] md:px-8 md:pt-4 md:pb-10 lg:grid-cols-[clamp(240px,24vw,300px)_minmax(0,1fr)_300px]" aria-label="Events discovery">
          <EventSidebars
            events={hearstEvents}
            upcomingEvent={hearstEvents.find((event) => event.status === "upcoming")}
            onFilterRelationship={(value) => setRelationship(value)}
          />
          <section aria-live="polite" aria-labelledby="events-results-heading" className="min-w-0 space-y-6 md:col-start-1 md:row-start-1 lg:col-start-2">
            <div className="overflow-hidden rounded-[8px] border border-border bg-card">
              <div className="flex flex-col gap-3 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Across Hearst brands</p>
                  <h1 id="events-results-heading" className="headline mt-2 text-2xl font-bold md:text-3xl">Events and coverage</h1>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Upcoming experiences and stories from events our editors follow.</p>
              </div>
              {visibleEvents.length ? (
                <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-muted-foreground">Browse event stories or find dates on the calendar.</p>
                <ToggleGroup
                  value={[displayMode]}
                  onValueChange={(value) => {
                    const selected = value[0];
                    if (selected === "stories" || selected === "calendar") setDisplayMode(selected);
                  }}
                  variant="outline"
                  aria-label="Choose event view"
                  className="overflow-hidden rounded-md"
                >
                  <ToggleGroupItem value="stories" className="min-h-10 px-4 text-sm font-semibold data-[state=on]:bg-foreground data-[state=on]:text-background">Stories</ToggleGroupItem>
                  <ToggleGroupItem value="calendar" className="min-h-10 px-4 text-sm font-semibold data-[state=on]:bg-foreground data-[state=on]:text-background">Calendar</ToggleGroupItem>
                </ToggleGroup>
              </div>
              ) : null}
            </div>
            {visibleEvents.length ? (
              displayMode === "calendar" ? (
                <HearstEventsCalendar events={visibleEvents} />
              ) : (
                <div className="space-y-5">
                  {visibleEvents.map((event) => <EventTile key={event.slug} event={event} />)}
                </div>
              )
            ) : (
              <div className="border-y border-border py-12">
                <p className="headline text-2xl font-bold">
                  {selectedBrandHasEvents
                    ? "No events match those filters."
                    : `No events are listed yet for ${eventBrandOptions.find((option) => option.value === brand)?.label ?? "this brand"}.`}
                </p>
                <button type="button" className="mt-4 min-h-11 font-bold text-primary underline" onClick={() => { setRelationship("all"); setBrand("all"); }}>
                  Show all events
                </button>
              </div>
            )}
          </section>
        </section>
      </main>
      <SiteFooter
        siteName={<BrandLogo slug="hearst-all" className="block h-5 w-32 [&_svg]:h-full [&_svg]:w-auto" color="white" />}
        copyrightYear={2026}
        finePrintNote="Event details and registration are maintained by the organizer. Editorial coverage remains attributed to its publishing brand."
      />
    </div>
  );
}

function ProgramList({ event }: { event: HearstEventRecord }) {
  if (event.relationship === "organized" && event.program?.length) {
    return (
      <div className="divide-y divide-border border-y border-border">
        {event.program.map((item) => (
          <article key={item.title} className="grid gap-3 py-6 md:grid-cols-[minmax(10rem,0.42fr)_minmax(0,1fr)] md:gap-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{item.stage}</p>
            <div>
              <h3 className="headline text-2xl font-bold">{item.title}</h3>
              <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-border border-y border-border">
      {event.coverage?.map((story) => (
        <article key={story.href} className="grid gap-3 py-6 md:grid-cols-[minmax(10rem,0.42fr)_minmax(0,1fr)] md:gap-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{story.publishedLabel}</p>
          <div>
            <h3 className="headline text-2xl font-bold">
              <a href={story.href} target="_blank" rel="noreferrer">{story.title}</a>
            </h3>
            <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{story.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function HearstEventDetail({ event }: { event: HearstEventRecord }) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const returnFocusElementRef = useRef<HTMLElement | null>(null);
  const isOrganized = event.relationship === "organized";
  const hasProgram = isOrganized && Boolean(event.program?.length);
  const hasCoverage = Boolean(event.coverage?.length);
  const eventSections = [
    { label: "Overview", id: "event-overview", disabled: false },
    ...(hasProgram
      ? [{ label: "Program", id: "event-program", disabled: false }]
      : hasCoverage
        ? [{ label: "Coverage", id: "event-coverage", disabled: false }]
        : []),
    ...(event.featuredGuests?.length || event.makerSpotlights?.length
      ? [{ label: "People and makers", id: "event-people", disabled: false }]
      : []),
    ...(event.practicalLinks?.length && isOrganized
      ? [{ label: "Plan your visit", id: "event-visit", disabled: false }]
      : []),
  ];
  const closeEvent = () => router.push("/hearst-plus/events/");

  return (
    <ContentReaderDialogShell
      contentRef={contentRef}
      destination="all"
      mode="light"
      ariaLabel={`${event.title} event details`}
      onClose={closeEvent}
      returnFocusElementRef={returnFocusElementRef}
    >
      <ContentReaderMasthead
        logoHref="/hearst-plus/events/"
        contextLabel={`${event.brandNames[0] ?? "Hearst"} Events`}
        logoSlug={event.brandSlugs[0] ?? "hearst-all"}
        visibleStoryCount={1}
        storyCount={1}
        activeMastheadKey="events"
        mastheadItems={[{ key: "events", label: "Events", active: true, disabled: true }]}
        mastheadNavigationLabel="Event details"
        filterItems={eventSections.map((section) => ({
          label: section.label,
          active: section.id === "event-overview",
          disabled: false,
        }))}
        sectionLabel="Event"
        onSelectMastheadItem={() => undefined}
        onSelectFilter={(label) => {
          const section = eventSections.find((item) => item.label === label);
          if (section) {
            contentRef.current?.querySelector(`#${section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        onClose={closeEvent}
        closeLabel="Close event details"
        statusLabel="Event details"
        sectionNavigationLabel="Event details sections"
      />
      <div className="min-h-full bg-[var(--hp-background)] text-foreground">
        <main className="mx-auto grid min-w-0 max-w-[1360px] grid-cols-1 items-start gap-5 px-4 pt-4 pb-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:gap-5 lg:px-6 lg:pt-4 lg:pb-6">
          <aside className="order-2 min-w-0 space-y-5 lg:order-1 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-5rem)] lg:overflow-y-auto lg:pr-1" aria-label="Event discovery">
            <DiscoverySidebarCard title="Presented by" summary="The Hearst brands behind this event">
              <EventBrandMarks event={event} />
              <p className="mt-3 text-xs leading-5 text-muted-foreground">Event information and registration come from the organizer.</p>
            </DiscoverySidebarCard>
            <DiscoverySidebarCard title="Trending across events" summary="More experiences and stories from Hearst brands">
              <ol className="-mb-3 divide-y divide-border/70">
                {hearstEvents.filter((item) => item.slug !== event.slug).slice(0, 5).map((item, index) => (
                  <li key={item.slug}><EventRailLink event={item} rank={index + 1} /></li>
                ))}
              </ol>
              <Link href="/hearst-plus/events/" className="mt-3 block border-t border-border pt-3 text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                Explore all events
              </Link>
            </DiscoverySidebarCard>
          </aside>

          <div className="order-1 min-w-0 space-y-5 lg:order-2">
          <section id="event-overview" className="scroll-mt-28 overflow-hidden rounded-[8px] border border-border bg-card shadow-[var(--hp-shadow-card)]">
            <div className="relative aspect-[4/3] min-h-[280px] overflow-hidden bg-muted sm:aspect-[16/10]">
                <Image src={event.image.src} alt={event.image.alt} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden />
                {event.image.credit ? (
                  <p className="absolute bottom-5 left-5 max-w-[80%] text-sm font-semibold text-white">{event.image.credit}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-8 p-5 sm:p-7">
                <div>
                  <RelationshipLabel relationship={event.relationship} />
                  <p className="mt-4 text-sm font-semibold text-muted-foreground">{event.eyebrow}</p>
                  <h1 className="headline mt-3 text-3xl font-bold leading-[1.04] tracking-tight sm:text-4xl">{event.title}</h1>
                  {event.heroHeadline ? <p className="mt-4 text-lg font-semibold leading-snug">{event.heroHeadline}</p> : null}
                  <p className="mt-5 text-base leading-7 text-muted-foreground">{event.summary}</p>
                </div>
                <div className="space-y-5 border-t border-border pt-5">
                  <EventFacts event={event} />
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <a
                      href={event.primaryAction.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center justify-center border border-primary bg-primary px-5 text-sm font-bold text-primary-foreground hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {event.primaryAction.label} <ChevronRight className="ml-2 h-4 w-4" aria-hidden />
                    </a>
                    {event.program?.length ? (
                      <a href="#event-program" className="inline-flex min-h-11 items-center font-bold text-primary underline-offset-4 hover:underline focus-visible:underline">
                        Explore what’s on <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                      </a>
                    ) : null}
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Event details and tickets are provided by the organizer. <a href={event.eventUrl} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">Visit the official event site</a>.
                  </p>
                </div>
              </div>
          </section>

          {hasProgram || hasCoverage ? (
            <section id={hasProgram ? "event-program" : "event-coverage"} className="scroll-mt-28 rounded-[8px] border border-border bg-card p-5 shadow-[var(--hp-shadow-card)] sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{hasProgram ? "Make a day of it" : "The event, through our lens"}</p>
                <h2 className="headline mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                  {hasProgram ? "Four days of festive ideas and finds." : "The moments worth following."}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {hasProgram
                    ? "Move between conversations, cooking and home stages, then explore the Country Living Christmas Market."
                    : "Follow the results and reporting from the publication closest to the event, with each story linked to its original source."}
                </p>
              </div>
              <ProgramList event={event} />
            </section>
          ) : null}

        {event.featuredGuests?.length || event.makerSpotlights?.length ? (
          <section id="event-people" className="scroll-mt-28 rounded-[8px] border border-border bg-card p-5 shadow-[var(--hp-shadow-card)] sm:p-7">
            <div className="grid gap-10">
              {event.featuredGuests?.length ? (
                <section aria-labelledby="event-guests-heading">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Announced for 2026</p>
                  <h2 id="event-guests-heading" className="headline mt-3 text-3xl font-bold leading-tight md:text-4xl">Meet the guests and writers</h2>
                  <ul className="mt-6 grid grid-cols-2 gap-x-6 border-y border-border sm:grid-cols-3">
                    {event.featuredGuests.map((guest) => (
                      <li key={guest} className="flex min-h-14 items-center border-b border-border py-2 text-sm font-semibold last:border-b-0">{guest}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {event.makerSpotlights?.length ? (
                <section aria-labelledby="event-makers-heading">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Country Living Christmas Market</p>
                  <h2 id="event-makers-heading" className="headline mt-3 text-3xl font-bold leading-tight md:text-4xl">Discover independent makers</h2>
                  <p className="mt-3 max-w-xl leading-7 text-muted-foreground">A first look at some of the artisan businesses featured by the event organizer.</p>
                  <ul className="mt-6 divide-y divide-border border-y border-border">
                    {event.makerSpotlights.map((maker) => (
                      <li key={maker} className="flex min-h-14 items-center py-2 font-semibold">{maker}</li>
                    ))}
                  </ul>
                  {event.makerDirectoryUrl ? (
                    <a href={event.makerDirectoryUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center font-bold text-primary underline-offset-4 hover:underline focus-visible:underline">
                      Meet the 2026 makers <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                    </a>
                  ) : null}
                </section>
              ) : null}
            </div>
          </section>
        ) : null}

        {isOrganized && event.practicalLinks?.length ? (
          <section id="event-visit" className="scroll-mt-28 rounded-[8px] border border-border bg-card p-5 shadow-[var(--hp-shadow-card)] sm:p-7">
            <div className="grid gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Before you go</p>
                <h2 className="headline mt-3 text-3xl font-bold md:text-4xl">Plan your visit</h2>
              </div>
              <nav aria-label="Event planning links" className="divide-y divide-border border-y border-border">
                {event.practicalLinks.map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between gap-4 font-semibold hover:text-primary">
                    {item.label}<ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
                  </a>
                ))}
              </nav>
            </div>
          </section>
        ) : null}

          </div>

          <aside className="order-3 min-w-0 space-y-5 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-5rem)] lg:overflow-y-auto lg:pr-1" aria-label="Event information and related coverage">
            <DiscoverySidebarCard title="Plan your visit" summary={`${event.dateLabel} · ${event.venue}`}>
              <p className="text-sm font-bold">{event.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{event.dateLabel}<br />{event.venue}<br />{event.location}</p>
              <a href={event.primaryAction.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center font-bold text-primary underline-offset-4 hover:underline">
                {event.primaryAction.label}<ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </a>
            </DiscoverySidebarCard>
            {event.coverage?.length ? (
              <DiscoverySidebarCard title="From our editors" summary="Original reporting connected to this event">
                <div className="divide-y divide-border/70">
                  {event.coverage.slice(0, 5).map((story) => (
                    <a key={story.href} href={story.href} target="_blank" rel="noreferrer" className="block py-3 text-sm font-bold leading-5 hover:text-primary first:pt-0 last:pb-0">
                      {story.title}<span className="mt-1 block text-xs font-normal text-muted-foreground">{story.publishedLabel}</span>
                    </a>
                  ))}
                </div>
              </DiscoverySidebarCard>
            ) : null}
            <LocalNewsRail />
          </aside>
        </main>
      </div>
    </ContentReaderDialogShell>
  );
}
