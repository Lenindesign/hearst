"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { MainNav } from "@/components/home-page";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Col, Grid, PageContainer } from "@/components/ui/grid";
import {
  CalendarBlank,
  ChevronRight,
  ExternalLink,
  MapPin,
  Menu,
} from "@/components/ui/icons";
import {
  dragWeek2026,
  getHotRodEventStatusLabel,
  hotRodEvents,
  hotRodEventYears,
  powerTour2026,
  type HotRodEvent,
  type HotRodEventStatus,
} from "@/lib/hot-rod-events";
import { cn } from "@/lib/utils";

const eventStatusClass: Record<HotRodEventStatus, string> = {
  "coming-soon": "border-white/45 bg-white/10 text-white",
  "registration-open": "border-[var(--hot-rod-events-red)] bg-[var(--hot-rod-events-red)] text-white",
  "registration-closed": "border-white/45 bg-white/10 text-white",
  "sold-out": "border-white/45 bg-white/10 text-white",
  underway: "border-[var(--hot-rod-events-red)] bg-[var(--hot-rod-events-red)] text-white",
  concluded: "border-white/55 bg-black/55 text-white",
};

function HotRodEventsHeader() {
  const router = useRouter();

  return (
    <>
      <UtilityBar
        selectedBrand={{ name: "HOT ROD", slug: "hot-rod" }}
        onCreateAccount={() => router.push("/hearst-plus/")}
        onOpenProfile={() => router.push("/hearst-plus/")}
      />
      <MainNav
        brandSlug="hearst-plus"
        activeFilter="Events"
        selectedBrand={{ name: "HOT ROD", slug: "hot-rod" }}
        includeVideos
        onFilterChange={(filter) => {
          if (filter === "For You") {
            router.push("/autos/hot-rod/");
            return;
          }
          router.push(`/autos/hot-rod/?section=${encodeURIComponent(filter.toLowerCase())}`);
        }}
      />
    </>
  );
}

function StatusLabel({
  status,
  label,
  dark = false,
}: {
  status: HotRodEventStatus;
  label?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 w-fit items-center border px-2.5 text-[0.6875rem] font-black uppercase tracking-[0.12em]",
        dark
          ? eventStatusClass[status]
          : status === "registration-open" || status === "underway"
            ? "border-[var(--hot-rod-events-red)] bg-[var(--hot-rod-events-red)] text-white"
            : "border-foreground/30 bg-background text-foreground"
      )}
    >
      {label ?? getHotRodEventStatusLabel(status)}
    </span>
  );
}

function Hero({ detailMode }: { detailMode: boolean }) {
  return (
    <section
      className="relative min-h-[530px] overflow-hidden bg-[var(--hot-rod-events-black)] text-white md:min-h-[610px] lg:min-h-[650px]"
      aria-labelledby="hot-rod-power-tour-title"
    >
      <Image
        src={powerTour2026.image}
        alt="Cars completing the 2026 HOT ROD Power Tour"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.93)_0%,rgba(0,0,0,0.7)_42%,rgba(0,0,0,0.13)_76%),linear-gradient(0deg,rgba(0,0,0,0.68)_0%,transparent_50%)]"
        aria-hidden
      />
      <PageContainer className="relative z-10 min-h-[530px] md:min-h-[610px] lg:min-h-[650px]">
        <Grid gap="none" className="min-h-[530px] md:min-h-[610px] lg:min-h-[650px]">
          <Col span="full" spanMd={6} spanLg={7} className="flex min-w-0">
            <div className="flex min-h-full max-w-3xl flex-col justify-end gap-4 py-7 md:gap-5 md:py-10 lg:py-12">
              <p className="inline-flex w-fit bg-[var(--hot-rod-events-red)] px-2 py-1 text-[0.6875rem] font-black uppercase tracking-[0.14em]">
                HOT ROD Events
              </p>
              <p className="border-white text-sm font-bold uppercase tracking-[0.16em] text-white/80">
                {powerTour2026.eyebrow}
              </p>
              <h1
                id="hot-rod-power-tour-title"
                className="headline max-w-[10ch] text-[clamp(3.75rem,10vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.035em]"
              >
                Power Tour
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-[0.08em]">
                <span className="inline-flex items-center gap-2">
                  <CalendarBlank className="size-4" aria-hidden />
                  {powerTour2026.dateLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" aria-hidden />
                  Route 66
                </span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/read/live-hot-rod-1f2d9676-cb40-5990-a4d0-8ecc23b85d89/?from=%2Fautos%2Fhot-rod%2Fevents%2F"
                  className="inline-flex min-h-11 items-center justify-center bg-[var(--hot-rod-events-red)] px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--hot-rod-events-red-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  View 2026 recap
                </Link>
                <a
                  href="https://www.hotrod.com/events/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center border border-white/70 px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Get 2027 updates
                  <ExternalLink className="ml-2 size-4" aria-hidden />
                </a>
              </div>
              {!detailMode ? (
                <Link
                  href={powerTour2026.href}
                  className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore the annual Power Tour hub
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : null}
            </div>
          </Col>
        </Grid>
      </PageContainer>
    </section>
  );
}

function SeriesIntro() {
  return (
    <section className="bg-[var(--hot-rod-events-black)] py-9 text-white md:py-11" aria-labelledby="power-tour-series-title">
      <PageContainer>
        <Grid alignStart>
          <Col span="full" spanMd={5} spanLg={7}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              A yearly HOT ROD tradition
            </p>
            <h2 id="power-tour-series-title" className="headline mt-2 text-4xl font-black uppercase leading-[0.92] md:text-5xl">
              America’s ultimate road trip
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/76">
              Power Tour returns every year with a new route, new host cities, and the same rolling celebration of American car culture. Each edition keeps its schedule, maps, galleries, and stories after the final stop.
            </p>
          </Col>
          <Col span="full" spanMd={3} spanLg={4} startLg={9}>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Choose an edition</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {hotRodEventYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  disabled={year !== "2026"}
                  aria-pressed={year === "2026"}
                  className={cn(
                    "min-h-11 border px-3 text-sm font-black tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    year === "2026"
                      ? "border-[var(--hot-rod-events-red)] bg-[var(--hot-rod-events-red)] text-white"
                      : "border-white/25 text-white/55 disabled:cursor-not-allowed"
                  )}
                  title={year === "2026" ? "Current edition" : `${year} archive coming soon`}
                >
                  {year}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-white/55">
              The 2026 edition is available now. Earlier archives will join this selector as their structured routes are added.
            </p>
          </Col>
        </Grid>
      </PageContainer>
    </section>
  );
}

function RouteAndResources() {
  return (
    <section
      className="border-y border-black/15 bg-[var(--hot-rod-events-cream)] py-10 text-[var(--hot-rod-events-black)] md:py-14"
      aria-labelledby="power-tour-route-title"
    >
      <PageContainer width="content">
        <Grid alignStart>
          <Col span="full" spanMd={5} spanLg={7}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              2026 edition
            </p>
            <h2 id="power-tour-route-title" className="headline mt-2 text-4xl font-black uppercase leading-none md:text-5xl">
              Route and stops
            </h2>
            <ol className="relative mt-7 space-y-0 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-[var(--hot-rod-events-red)]">
              {powerTour2026.schedule?.map((stop, index) => (
                <li key={stop.day} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-b border-black/15 py-4 first:pt-0 last:border-b-0 last:pb-0">
                  <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-[var(--hot-rod-events-red)] text-sm font-black tabular-nums text-white">
                    {index + 1}
                  </span>
                  <div className="grid gap-1 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] sm:gap-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--hot-rod-events-red)]">{stop.date}</p>
                      <p className="headline mt-0.5 text-2xl font-black uppercase leading-none">{stop.location}</p>
                    </div>
                    <div className="pt-1 text-sm leading-6">
                      <p className="font-bold">{stop.venue}</p>
                      {stop.note ? <p className="text-black/60">{stop.note}</p> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Col>
          <Col span="full" spanMd={3} spanLg={4} startLg={9}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              Keep planning
            </p>
            <h2 className="headline mt-2 text-4xl font-black uppercase leading-none">Resources</h2>
            <div className="mt-7 divide-y divide-black/15 border-y border-black/15">
              {powerTour2026.resources?.map((resource) => (
                <a
                  key={resource.label}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hot-rod-events-red)]/45"
                >
                  <span>
                    <span className="block text-sm font-black uppercase tracking-[0.06em] group-hover:text-[var(--hot-rod-events-red)]">
                      {resource.label}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-black/60">{resource.description}</span>
                  </span>
                  <ExternalLink className="size-4 text-[var(--hot-rod-events-red)]" aria-hidden />
                </a>
              ))}
            </div>
            <div className="mt-6 border-l-4 border-[var(--hot-rod-events-red)] bg-white/50 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.12em]">Registration archive</p>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Online registration is closed. TicketSpice remains available for confirmations and the archived event notice.
              </p>
              <a
                href={powerTour2026.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--hot-rod-events-red)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hot-rod-events-red)]/45"
              >
                View TicketSpice archive
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </div>
          </Col>
        </Grid>
      </PageContainer>
    </section>
  );
}

function Coverage() {
  return (
    <section className="bg-[var(--hot-rod-events-black)] py-10 text-white md:py-14" aria-labelledby="power-tour-coverage-title">
      <PageContainer>
        <div className="flex flex-col justify-between gap-4 border-b border-white/20 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              From the road
            </p>
            <h2 id="power-tour-coverage-title" className="headline mt-2 text-4xl font-black uppercase leading-none md:text-5xl">
              2026 recap and coverage
            </h2>
          </div>
          <Link
            href="/read/live-hot-rod-1f2d9676-cb40-5990-a4d0-8ecc23b85d89/?from=%2Fautos%2Fhot-rod%2Fevents%2F"
            className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:self-auto"
          >
            Read the official story
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
        <Grid className="mt-6" alignStart>
          {powerTour2026.coverage?.map((story) => {
            const external = story.href.startsWith("http");
            const content = (
              <>
                <div className="relative aspect-[16/10] overflow-hidden bg-white/10">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                  />
                </div>
                <p className="mt-4 text-[0.6875rem] font-black uppercase tracking-[0.14em] text-[var(--hot-rod-events-red-light)]">
                  {story.label}
                </p>
                <h3 className="headline mt-1 text-2xl font-black uppercase leading-[1.02] group-hover:text-[var(--hot-rod-events-red-light)]">
                  {story.title}
                </h3>
              </>
            );
            const className = "group col-span-4 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:col-span-4 lg:col-span-4";

            return external ? (
              <a key={story.title} href={story.href} target="_blank" rel="noopener noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <Link key={story.title} href={story.href} className={className}>
                {content}
              </Link>
            );
          })}
        </Grid>
      </PageContainer>
    </section>
  );
}

function EventAction({ event }: { event: HotRodEvent }) {
  const external = event.href.startsWith("http");
  const label = !external
    ? event.status === "concluded"
      ? "View event archive"
      : event.status === "coming-soon"
        ? "Follow updates"
        : "View event details"
    : event.status === "concluded"
    ? "View event archive"
    : event.status === "coming-soon"
      ? "Follow updates"
      : event.ticketUrl
        ? `Buy tickets on ${event.ticketProvider}`
        : "Registration details";

  const className =
    "mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black uppercase tracking-[0.06em] text-[var(--hot-rod-events-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hot-rod-events-red)]/45";
  const content = (
    <>
      {label}
      {external ? <ExternalLink className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
    </>
  );

  return external ? (
    <a href={event.ticketUrl ?? event.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={event.href} className={className}>
      {content}
    </Link>
  );
}

function EventList({ events }: { events: HotRodEvent[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {events.map((event) => (
        <article key={event.slug} className="grid gap-5 py-6 sm:grid-cols-[200px_minmax(0,1fr)] md:grid-cols-[260px_minmax(0,1fr)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <Image src={event.image} alt="" fill sizes="260px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <StatusLabel status={event.status} label={event.statusLabel} />
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{event.eyebrow}</span>
            </div>
            <h3 className="headline mt-3 text-3xl font-black uppercase leading-none md:text-4xl">{event.title}</h3>
            <p className="mt-2 text-sm font-semibold text-foreground">{event.dateLabel} · {event.locationLabel}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{event.summary}</p>
            <EventAction event={event} />
          </div>
        </article>
      ))}
    </div>
  );
}

function EventCalendar({ events }: { events: HotRodEvent[] }) {
  const months = [
    { label: "June 2026", events: events.filter((event) => event.dateLabel.startsWith("June")) },
    { label: "September 2026", events: events.filter((event) => event.dateLabel.startsWith("September")) },
    { label: "2027", events: events.filter((event) => event.edition === "2027") },
  ];

  return (
    <Grid alignStart>
      {months.map((month) => (
        <Col key={month.label} span="full" spanMd={4} spanLg={4}>
          <section className="border-t-4 border-[var(--hot-rod-events-red)] bg-[var(--hot-rod-events-cream)] p-5" aria-labelledby={`event-calendar-${month.label.replace(/\s+/g, "-")}`}>
            <h3 id={`event-calendar-${month.label.replace(/\s+/g, "-")}`} className="headline text-3xl font-black uppercase">
              {month.label}
            </h3>
            <div className="mt-5 divide-y divide-black/15 border-y border-black/15">
              {month.events.map((event) => (
                <div key={event.slug} className="py-5">
                  <StatusLabel status={event.status} label={event.statusLabel} />
                  <p className="headline mt-3 text-2xl font-black uppercase leading-none">{event.series}</p>
                  <p className="mt-2 text-sm font-bold">{event.dateLabel}</p>
                  <p className="mt-1 text-sm leading-5 text-black/60">{event.locationLabel}</p>
                  <EventAction event={event} />
                </div>
              ))}
              {month.events.length === 0 ? (
                <p className="py-5 text-sm text-black/60">No events announced.</p>
              ) : null}
            </div>
          </section>
        </Col>
      ))}
    </Grid>
  );
}

function AllEvents() {
  const [view, setView] = React.useState<"calendar" | "list">("calendar");
  const displayEvents = hotRodEvents;

  return (
    <section className="bg-background py-10 md:py-14" aria-labelledby="all-hot-rod-events-title">
      <PageContainer>
        <div className="flex flex-col justify-between gap-5 border-b border-border pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              Plan what’s next
            </p>
            <h2 id="all-hot-rod-events-title" className="headline mt-2 text-4xl font-black uppercase leading-none md:text-5xl">
              HOT ROD event calendar
            </h2>
          </div>
          <div className="inline-flex w-fit border border-border p-1" aria-label="Choose event view">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={view === "calendar"}
              onClick={() => setView("calendar")}
              className={cn(
                "rounded-none",
                view === "calendar" && "bg-[var(--hot-rod-events-red)] text-white hover:bg-[var(--hot-rod-events-red-dark)] hover:text-white"
              )}
            >
              <CalendarBlank className="size-4" aria-hidden />
              Calendar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={cn(
                "rounded-none",
                view === "list" && "bg-[var(--hot-rod-events-red)] text-white hover:bg-[var(--hot-rod-events-red-dark)] hover:text-white"
              )}
            >
              <Menu className="size-4" aria-hidden />
              List
            </Button>
          </div>
        </div>
        <div className="mt-7">
          {view === "calendar" ? <EventCalendar events={displayEvents} /> : <EventList events={displayEvents} />}
        </div>
      </PageContainer>
    </section>
  );
}

function DragWeekHero() {
  return (
    <section
      className="relative min-h-[530px] overflow-hidden bg-[var(--hot-rod-events-black)] text-white md:min-h-[610px] lg:min-h-[650px]"
      aria-labelledby="hot-rod-drag-week-title"
    >
      <Image
        src={dragWeek2026.image}
        alt="The Blasphemi gasser launches with its front wheels raised at HOT ROD Drag Week"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.72)_44%,rgba(0,0,0,0.12)_78%),linear-gradient(0deg,rgba(0,0,0,0.72)_0%,transparent_52%)]"
        aria-hidden
      />
      <PageContainer className="relative z-10 min-h-[530px] md:min-h-[610px] lg:min-h-[650px]">
        <Grid gap="none" className="min-h-[530px] md:min-h-[610px] lg:min-h-[650px]">
          <Col span="full" spanMd={6} spanLg={7} className="flex min-w-0">
            <div className="flex min-h-full max-w-3xl flex-col justify-end gap-4 py-7 md:gap-5 md:py-10 lg:py-12">
              <p className="inline-flex w-fit bg-[var(--hot-rod-events-red)] px-2 py-1 text-[0.6875rem] font-black uppercase tracking-[0.14em]">
                HOT ROD Events
              </p>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                {dragWeek2026.eyebrow}
              </p>
              <h1
                id="hot-rod-drag-week-title"
                className="headline max-w-[10ch] text-[clamp(3.75rem,9vw,6rem)] font-black uppercase leading-[0.82] tracking-[-0.035em]"
              >
                Drag Week
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-[0.08em]">
                <span className="inline-flex items-center gap-2">
                  <CalendarBlank className="size-4" aria-hidden />
                  {dragWeek2026.dateLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" aria-hidden />
                  Illinois and Missouri
                </span>
              </div>
              <StatusLabel status={dragWeek2026.status} label={dragWeek2026.statusLabel} dark />
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={dragWeek2026.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center bg-[var(--hot-rod-events-red)] px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--hot-rod-events-red-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  View tickets on TicketSpice
                  <ExternalLink className="ml-2 size-4" aria-hidden />
                </a>
                <a
                  href={dragWeek2026.waitlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center border border-white/70 px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Join racer waitlist
                  <ExternalLink className="ml-2 size-4" aria-hidden />
                </a>
              </div>
            </div>
          </Col>
        </Grid>
      </PageContainer>
    </section>
  );
}

function DragWeekIntro() {
  return (
    <section className="bg-[var(--hot-rod-events-black)] py-9 text-white md:py-11" aria-labelledby="drag-week-intro-title">
      <PageContainer>
        <Grid alignStart>
          <Col span="full" spanMd={5} spanLg={7}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              Six track days, one street-driven test
            </p>
            <h2 id="drag-week-intro-title" className="headline mt-2 max-w-[16ch] text-4xl font-black uppercase leading-[0.92] md:text-5xl">
              Race, drive, repair, repeat
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              Drag Week combines timed dragstrip runs with the road miles between venues. The 2026 route starts and finishes at Route 66 Raceway, then moves through Byron, Cordova, and Madison before returning to Joliet for the finals.
            </p>
          </Col>
          <Col span="full" spanMd={3} spanLg={4} startLg={9}>
            <div className="divide-y divide-white/20 border-y border-white/20 text-sm">
              <div className="py-4">
                <p className="font-black uppercase tracking-[0.08em] text-[var(--hot-rod-events-red)]">Racer entry</p>
                <p className="mt-1 leading-6 text-white/80">Sold out. A separate racer waitlist remains available.</p>
              </div>
              <div className="py-4">
                <p className="font-black uppercase tracking-[0.08em] text-[var(--hot-rod-events-red)]">Spectators</p>
                <p className="mt-1 leading-6 text-white/80">Advance tickets remain available for selected Route 66 Raceway days.</p>
              </div>
              <div className="py-4">
                <p className="font-black uppercase tracking-[0.08em] text-[var(--hot-rod-events-red)]">Children</p>
                <p className="mt-1 leading-6 text-white/80">Children age 12 and under enter free with their family.</p>
              </div>
            </div>
          </Col>
        </Grid>
      </PageContainer>
    </section>
  );
}

function DragWeekRouteAndResources() {
  return (
    <section
      className="border-y border-black/15 bg-[var(--hot-rod-events-cream)] py-10 text-[var(--hot-rod-events-black)] md:py-14"
      aria-labelledby="drag-week-route-title"
    >
      <PageContainer width="content">
        <Grid alignStart>
          <Col span="full" spanMd={5} spanLg={7}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              2026 schedule
            </p>
            <h2 id="drag-week-route-title" className="headline mt-2 text-4xl font-black uppercase leading-none md:text-5xl">
              Tracks and dates
            </h2>
            <ol className="relative mt-7 space-y-0 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-[var(--hot-rod-events-red)]">
              {dragWeek2026.schedule?.map((stop, index) => (
                <li key={stop.day} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-b border-black/15 py-4 first:pt-0 last:border-b-0 last:pb-0">
                  <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-[var(--hot-rod-events-red)] text-sm font-black tabular-nums text-white">
                    {index}
                  </span>
                  <div className="grid gap-1 sm:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] sm:gap-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--hot-rod-events-red)]">{stop.date}</p>
                      <p className="headline mt-0.5 text-2xl font-black uppercase leading-none">{stop.location}</p>
                    </div>
                    <div className="pt-1 text-sm leading-6">
                      <p className="font-bold">{stop.venue}</p>
                      {stop.note ? <p className="text-black/65">{stop.note}</p> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Col>
          <Col span="full" spanMd={3} spanLg={4} startLg={9}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              Plan your week
            </p>
            <h2 className="headline mt-2 text-4xl font-black uppercase leading-none">Resources</h2>
            <div className="mt-7 divide-y divide-black/15 border-y border-black/15">
              {dragWeek2026.resources?.map((resource) => (
                <a
                  key={resource.label}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hot-rod-events-red)]/45"
                >
                  <span>
                    <span className="block text-sm font-black uppercase tracking-[0.06em] group-hover:text-[var(--hot-rod-events-red)]">
                      {resource.label}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-black/65">{resource.description}</span>
                  </span>
                  <ExternalLink className="size-4 text-[var(--hot-rod-events-red)]" aria-hidden />
                </a>
              ))}
            </div>
            <div className="mt-6 border border-black/15 bg-white/55 p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em]">Travel partner</p>
              <p className="mt-2 text-sm leading-6 text-black/70">
                On Location, through Anthony Travel, lists discounted event accommodations and reservation support for Drag Week.
              </p>
              <a
                href="https://www.anthonytravel.com/hot-rod-drag-week/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--hot-rod-events-red)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hot-rod-events-red)]/45"
              >
                View official hotels
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </div>
          </Col>
        </Grid>
      </PageContainer>
    </section>
  );
}

function DragWeekTickets() {
  const ticketOptions = [
    {
      title: "Drag Pack",
      price: "$350",
      detail:
        "Weeklong access for one vehicle, one driver, and one passenger, with pit or premier parking, suite access where available, lunch at two venues, and one gift per vehicle. This is not a racer ticket.",
    },
    {
      title: "Route 66 spectator days",
      price: "$20 each",
      detail:
        "Advance spectator tickets are listed for Tech Day on September 13, opening race day on September 14, and the finale on September 18.",
    },
    {
      title: "Days 2–4",
      price: "On-site",
      detail:
        "Spectator tickets for Byron Dragway, Cordova Dragway, and World Wide Technology Raceway are available only at the corresponding venue.",
    },
  ];

  return (
    <section className="bg-background py-10 md:py-14" aria-labelledby="drag-week-tickets-title">
      <PageContainer width="content">
        <Grid alignStart>
          <Col span="full" spanMd={5} spanLg={7}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hot-rod-events-red)]">
              Spectator and access options
            </p>
            <h2 id="drag-week-tickets-title" className="headline mt-2 text-4xl font-black uppercase leading-none md:text-5xl">
              Tickets
            </h2>
            <div className="mt-7 divide-y divide-border border-y border-border">
              {ticketOptions.map((option) => (
                <div key={option.title} className="grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_110px] sm:gap-5">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-[0.04em]">{option.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{option.detail}</p>
                  </div>
                  <p className="text-left text-base font-black text-[var(--hot-rod-events-red)] sm:text-right">{option.price}</p>
                </div>
              ))}
            </div>
          </Col>
          <Col span="full" spanMd={3} spanLg={4} startLg={9}>
            <div className="border border-border bg-muted/35 p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--hot-rod-events-red)]">
                Before purchasing
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>Racer tickets are sold out; the waitlist is separate from spectator purchases.</li>
                <li>The Drag Pack has limited availability and does not include racer entry.</li>
                <li>TicketSpice lists Drag Pack purchases as nonrefundable and nontransferable.</li>
                <li>Children age 12 and under enter free with their family.</li>
              </ul>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={dragWeek2026.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center bg-[var(--hot-rod-events-red)] px-4 text-sm font-black uppercase tracking-[0.06em] text-white hover:bg-[var(--hot-rod-events-red-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hot-rod-events-red)]/45"
                >
                  Buy on TicketSpice
                  <ExternalLink className="ml-2 size-4" aria-hidden />
                </a>
                <a
                  href={dragWeek2026.waitlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center border border-border px-4 text-sm font-black uppercase tracking-[0.06em] text-foreground hover:border-[var(--hot-rod-events-red)] hover:text-[var(--hot-rod-events-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hot-rod-events-red)]/45"
                >
                  Join racer waitlist
                  <ExternalLink className="ml-2 size-4" aria-hidden />
                </a>
              </div>
            </div>
          </Col>
        </Grid>
      </PageContainer>
    </section>
  );
}

export function HotRodEventsPage({ detailMode = false }: { detailMode?: boolean }) {
  const { colorMode } = useTheme();

  return (
    <div
      className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] font-brand text-foreground"
      data-mode={colorMode}
      style={{
        "--primary": "#c11b17",
        "--primary-foreground": "#ffffff",
        "--brand-primary": "#c11b17",
        "--hp-section-title": "#c11b17",
        "--font-brand": "Geist, sans-serif",
        "--font-headline": "\"Barlow Condensed\", sans-serif",
        "--hot-rod-events-red": "#c8101e",
        "--hot-rod-events-red-dark": "#991019",
        "--hot-rod-events-red-light": "#ff6a73",
        "--hot-rod-events-black": "#111111",
        "--hot-rod-events-asphalt": "#242424",
        "--hot-rod-events-cream": "#f3ebdd",
      } as React.CSSProperties}
    >
      <HotRodEventsHeader />
      <main>
        <Hero detailMode={detailMode} />
        <SeriesIntro />
        <RouteAndResources />
        <Coverage />
        {!detailMode ? <AllEvents /> : null}
        {detailMode ? (
          <section className="bg-background py-10 md:py-14">
            <PageContainer>
              <div className="border-t border-border pt-8">
                <Link
                  href="/autos/hot-rod/events/"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-black uppercase tracking-[0.06em] text-[var(--hot-rod-events-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hot-rod-events-red)]/45"
                >
                  View all HOT ROD events
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </div>
            </PageContainer>
          </section>
        ) : null}
      </main>
      <SiteFooter
        siteName={
          <BrandLogo
            slug="hot-rod"
            color="#ffffff"
            className="flex h-8 max-w-full items-center [&_svg]:h-full [&_svg]:w-auto"
          />
        }
        copyrightYear={2026}
        finePrintNote="Prototype event information uses public HOT ROD and TicketSpice pages. Confirm dates, availability, and ticket terms with the organizer before attending."
      />
    </div>
  );
}

export function HotRodDragWeekPage() {
  const { colorMode } = useTheme();

  return (
    <div
      className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] font-brand text-foreground"
      data-mode={colorMode}
      style={{
        "--primary": "#c11b17",
        "--primary-foreground": "#ffffff",
        "--brand-primary": "#c11b17",
        "--hp-section-title": "#c11b17",
        "--font-brand": "Geist, sans-serif",
        "--font-headline": "\"Barlow Condensed\", sans-serif",
        "--hot-rod-events-red": "#c8101e",
        "--hot-rod-events-red-dark": "#991019",
        "--hot-rod-events-red-light": "#ff6a73",
        "--hot-rod-events-black": "#111111",
        "--hot-rod-events-asphalt": "#242424",
        "--hot-rod-events-cream": "#f3ebdd",
      } as React.CSSProperties}
    >
      <HotRodEventsHeader />
      <main>
        <DragWeekHero />
        <DragWeekIntro />
        <DragWeekRouteAndResources />
        <DragWeekTickets />
        <section className="bg-[var(--hot-rod-events-black)] py-10 text-white">
          <PageContainer>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-bold text-white/70">Looking for another HOT ROD event?</p>
                <h2 className="headline mt-1 text-3xl font-black uppercase">Explore the complete calendar</h2>
              </div>
              <Link
                href="/autos/hot-rod/events/"
                className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-black uppercase tracking-[0.06em] text-white underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:self-auto"
              >
                View all HOT ROD events
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </div>
          </PageContainer>
        </section>
      </main>
      <SiteFooter
        siteName={
          <BrandLogo
            slug="hot-rod"
            color="#ffffff"
            className="flex h-8 max-w-full items-center [&_svg]:h-full [&_svg]:w-auto"
          />
        }
        copyrightYear={2026}
        finePrintNote="Prototype event information uses public HOT ROD, TicketSpice, and official travel-partner pages. Confirm dates, availability, and ticket terms with the organizer before attending."
      />
    </div>
  );
}
