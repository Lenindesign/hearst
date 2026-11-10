"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Barbell,
  Clock,
  MessageCircle,
  PersonSimpleBike,
  PersonSimpleHike,
  PersonSimpleRun,
  PersonSimpleTaiChi,
  SneakerMove,
  ThumbsUp,
  TrendingUp,
  X,
} from "@/components/ui/icons";
import {
  activityTypeLabels,
  athleteInitials,
  describeActivityRoute,
  formatActivityStart,
  getActivityStats,
  type Activity,
  type ActivityAthlete,
  type ActivityType,
} from "@/components/hearst-plus/club-activity-model";

const LazyRouteMap = React.lazy(() => import("@/components/hearst-plus/club-activity-route-map"));

const activityIcons: Record<ActivityType, typeof Barbell> = {
  walk: SneakerMove,
  run: PersonSimpleRun,
  ride: PersonSimpleBike,
  hike: PersonSimpleHike,
  strength: Barbell,
  mobility: PersonSimpleTaiChi,
  other: TrendingUp,
};

const YOU: ActivityAthlete = { id: "you", name: "You" };

function AthleteAvatar({ athlete, size = "default", className }: { athlete: ActivityAthlete; size?: "default" | "sm" | "lg"; className?: string }) {
  return (
    <Avatar size={size} className={className}>
      {athlete.avatarUrl ? <AvatarImage src={athlete.avatarUrl} alt="" /> : null}
      <AvatarFallback className="bg-[color-mix(in_oklab,var(--primary)_14%,var(--hp-surface))] font-bold text-[var(--hp-text-primary)] group-data-[size=sm]/avatar:text-[9px] group-data-[size=sm]/avatar:tracking-tight">
        {athleteInitials(athlete.name)}
      </AvatarFallback>
    </Avatar>
  );
}

function MapSkeleton() {
  return <div className="size-full bg-[var(--hp-background)] motion-safe:animate-pulse" aria-hidden />;
}

/**
 * Loads the map module only when the card nears the viewport, so the club page and river stay fast.
 * The text summary is always present; the drawing itself is decorative for assistive technology.
 */
function DeferredRouteMap({ activity, eager = false, className }: { activity: Activity; eager?: boolean; className?: string }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(eager);

  React.useEffect(() => {
    if (visible) return;
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "320px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <figure className={cn("relative m-0 aspect-[2/1] overflow-hidden sm:aspect-[5/2] rounded-card-inner bg-[var(--hp-background)]", className)}>
      <div ref={containerRef} className="pointer-events-none size-full select-none" aria-hidden>
        {visible ? (
          <React.Suspense fallback={<MapSkeleton />}>
            <LazyRouteMap activity={activity} />
          </React.Suspense>
        ) : <MapSkeleton />}
      </div>
      <figcaption className="sr-only">{describeActivityRoute(activity)}</figcaption>
    </figure>
  );
}

function ActivityStats({ activity, size = "card" }: { activity: Activity; size?: "card" | "detail" }) {
  const stats = getActivityStats(activity);
  return (
    <dl className={cn("grid divide-x divide-[var(--hp-border)]", stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
      {stats.map((stat) => (
        <div key={stat.id} className="min-w-0 px-3 first:pl-0 last:pr-0 sm:px-4">
          <dt className="text-xs leading-4 text-[var(--hp-text-secondary)]">{stat.label}</dt>
          <dd className={cn("mt-1 font-bold whitespace-nowrap tabular-nums text-[var(--hp-text-primary)]", size === "detail" ? "text-lg leading-6 sm:text-[28px] sm:leading-8" : "text-lg leading-6 sm:text-2xl sm:leading-7")}>
            <span aria-hidden={stat.spoken ? true : undefined}>{stat.value}</span>
            {stat.spoken ? <span className="sr-only">{stat.spoken}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ActivityMeta({ activity }: { activity: Activity }) {
  const parts = [formatActivityStart(activity), activity.source, activity.location].filter(Boolean);
  return (
    <p className="mt-0.5 text-xs leading-4 tabular-nums text-[var(--hp-text-secondary)]">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index ? <span aria-hidden> · </span> : null}
          {index && part ? <span className="sr-only">, </span> : null}
          {index === 0 ? <time dateTime={activity.startedAt}>{part}</time> : <span>{part}</span>}
        </React.Fragment>
      ))}
    </p>
  );
}

function kudosLabel(count: number) {
  return `${count} kudos`;
}

type KudosState = { given: boolean; toggle: () => void; givers: ActivityAthlete[]; count: number };

function useKudos(activity: Activity): KudosState {
  const [given, setGiven] = React.useState(false);
  const givers = given ? [YOU, ...activity.kudos] : activity.kudos;
  return { given, toggle: () => setGiven((value) => !value), givers, count: givers.length };
}

function KudosSummary({ kudos, isOwn = false }: { kudos: KudosState; isOwn?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {kudos.count ? (
        <AvatarGroup aria-hidden>
          {kudos.givers.slice(0, 3).map((athlete) => <AthleteAvatar key={athlete.id} athlete={athlete} size="sm" className="ring-[var(--hp-surface)]" />)}
        </AvatarGroup>
      ) : null}
      <span className="truncate text-sm leading-5 text-[var(--hp-text-secondary)]">
        {kudos.count ? kudosLabel(kudos.count) : isOwn ? "No kudos yet" : "Be the first to give kudos"}
      </span>
    </div>
  );
}

export type ClubActivityCardProps = {
  activity: Activity;
  className?: string;
  /** Show the route map when the activity has one. Defaults to true. */
  showMap?: boolean;
  /** Load the map immediately instead of when the card nears the viewport (Storybook, detail views). */
  eagerMap?: boolean;
};

export function ClubActivityCard({ activity, className, showMap = true, eagerMap = false }: ClubActivityCardProps) {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);
  const commentsHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const kudos = useKudos(activity);
  const Icon = activityIcons[activity.type] ?? TrendingUp;
  const titleId = `club-activity-${activity.id}-title`;
  const hasMap = showMap && Boolean(activity.route && activity.route.length > 1);
  const isOwn = activity.athlete.id === YOU.id;

  function openDetail(focusComments = false) {
    const dialog = dialogRef.current;
    if (!dialog) return;
    setOpen(true);
    if (!dialog.open) dialog.showModal();
    if (focusComments) window.requestAnimationFrame(() => commentsHeadingRef.current?.focus());
  }

  function closeDetail() {
    dialogRef.current?.close();
  }

  return (
    <>
      <article
        aria-labelledby={titleId}
        className={cn(
          "group relative rounded-card bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] transition-shadow sm:p-5",
          "has-[.club-activity-open:focus-visible]:ring-2 has-[.club-activity-open:focus-visible]:ring-[var(--primary)] has-[.club-activity-open:focus-visible]:ring-offset-2 has-[.club-activity-open:focus-visible]:ring-offset-[var(--hp-background)]",
          className,
        )}
      >
        <header className="flex items-start gap-3">
          <AthleteAvatar athlete={activity.athlete} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-5 font-bold text-[var(--hp-text-primary)]">{activity.athlete.name}</p>
            <ActivityMeta activity={activity} />
          </div>
        </header>

        <div className="mt-3 flex items-start gap-3 sm:mt-4">
          <span className="flex size-10 shrink-0 items-center justify-center text-primary" aria-hidden>
            <Icon className="size-7" weight="regular" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 id={titleId} className="headline text-xl leading-6 text-balance break-words sm:text-2xl sm:leading-7">
              <button
                type="button"
                onClick={() => openDetail()}
                className="club-activity-open text-left underline-offset-4 outline-none group-hover:underline focus-visible:underline after:absolute after:inset-0 after:rounded-card after:content-['']"
                aria-haspopup="dialog"
              >
                <span className="sr-only">{activityTypeLabels[activity.type]}: </span>
                {activity.title}
              </button>
            </h3>
          </div>
        </div>
        <div className="mt-3 sm:pl-[52px]">
          <ActivityStats activity={activity} />
        </div>

        {hasMap ? <DeferredRouteMap activity={activity} eager={eagerMap} className="mt-4" /> : null}

        <footer className="mt-3 flex items-center justify-between gap-3">
          <KudosSummary kudos={kudos} isOwn={isOwn} />
          <div className="relative z-10 flex shrink-0 items-center gap-2">
            {isOwn ? null : <Button
              type="button"
              variant={kudos.given ? "default" : "outline"}
              size="icon-touch"
              aria-pressed={kudos.given}
              aria-label={kudos.given ? `Remove your kudos from ${activity.athlete.name}’s ${activity.title}` : `Give kudos to ${activity.athlete.name}’s ${activity.title}`}
              onClick={kudos.toggle}
              className={kudos.given ? "text-primary-foreground" : undefined}
            >
              <ThumbsUp className="size-5" weight={kudos.given ? "fill" : "regular"} aria-hidden />
            </Button>}
            <Button
              type="button"
              variant="outline"
              size="icon-touch"
              aria-haspopup="dialog"
              aria-label={`Comments on ${activity.title} (${activity.comments.length})`}
              onClick={() => openDetail(true)}
            >
              <MessageCircle className="size-5" aria-hidden />
            </Button>
          </div>
        </footer>
      </article>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${titleId}-detail`}
        onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) closeDetail(); }}
        className="m-auto w-[min(640px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-y-auto overscroll-contain rounded-card bg-[var(--hp-surface)] p-0 text-[var(--hp-text-primary)] shadow-xl backdrop:bg-black/50"
      >
        {open ? (
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <AthleteAvatar athlete={activity.athlete} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-5 font-bold">{activity.athlete.name}</p>
                <ActivityMeta activity={activity} />
              </div>
              <Button type="button" variant="ghost" size="icon-touch" aria-label="Close activity" onClick={closeDetail} className="-mt-2 -mr-2">
                <X className="size-5" aria-hidden />
              </Button>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <Icon className="mt-0.5 size-7 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <p className="type-k1 text-[var(--hp-text-secondary)]">{activityTypeLabels[activity.type]}</p>
                <h2 id={`${titleId}-detail`} className="headline mt-1 text-2xl leading-7 text-balance break-words">{activity.title}</h2>
              </div>
            </div>
            <div className="mt-4">
              <ActivityStats activity={activity} size="detail" />
            </div>
            {activity.route && activity.route.length > 1 ? <DeferredRouteMap activity={activity} eager className="mt-4" /> : null}

            <section className="mt-5 border-t border-[var(--hp-border)] pt-4" aria-labelledby={`${titleId}-kudos`}>
              <h3 id={`${titleId}-kudos`} className="type-k1 text-[var(--hp-text-secondary)]">Kudos</h3>
              {kudos.count ? (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                  {kudos.givers.map((athlete) => (
                    <li key={athlete.id} className="flex items-center gap-2 text-sm leading-5">
                      <AthleteAvatar athlete={athlete} size="sm" /> {athlete.name}
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-2 text-sm leading-5 text-[var(--hp-text-secondary)]">No kudos yet.</p>}
            </section>

            <section className="mt-4 border-t border-[var(--hp-border)] pt-4" aria-labelledby={`${titleId}-comments`}>
              <h3 id={`${titleId}-comments`} ref={commentsHeadingRef} tabIndex={-1} className="type-k1 text-[var(--hp-text-secondary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
                Comments ({activity.comments.length})
              </h3>
              {activity.comments.length ? (
                <ul className="mt-2 space-y-3">
                  {activity.comments.map((comment) => (
                    <li key={comment.id} className="flex items-start gap-2">
                      <AthleteAvatar athlete={comment.author} size="sm" className="mt-0.5" />
                      <p className="min-w-0 text-sm leading-5"><strong>{comment.author.name}</strong> {comment.body}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-2 text-sm leading-5 text-[var(--hp-text-secondary)]">No comments yet.</p>}
              <p className="mt-3 text-xs leading-4 text-[var(--hp-text-secondary)]">
                {activity.isSample ? "Sample activity from an illustrative member. " : ""}Kudos you give aren’t saved in this prototype.
              </p>
            </section>

            {isOwn ? null : <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant={kudos.given ? "outline" : "default"}
                size="touch"
                aria-pressed={kudos.given}
                onClick={kudos.toggle}
                className={kudos.given ? undefined : "text-primary-foreground"}
              >
                <ThumbsUp data-icon="inline-start" className="size-5" aria-hidden />
                {kudos.given ? "Kudos given" : "Give kudos"}
              </Button>
            </div>}
          </div>
        ) : null}
      </dialog>
    </>
  );
}

export type ClubActivityFeedProps = {
  activities: Activity[];
  title?: string;
  description?: React.ReactNode;
  className?: string;
};

/** The Training Club `Club activity` feed: a heading, an honest data note, and activity cards. */
export function ClubActivityFeed({ activities, title = "Club activity", description, className }: ClubActivityFeedProps) {
  const headingId = React.useId();
  return (
    <section aria-labelledby={headingId} className={cn("space-y-3", className)}>
      <div className="px-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 id={headingId} className="headline text-2xl leading-7">{title}</h2>
          <span className="inline-flex items-center gap-1 text-xs leading-4 font-semibold text-[var(--hp-text-secondary)]">
            <Clock className="size-4" aria-hidden /> Latest first
          </span>
        </div>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-5 text-[var(--hp-text-secondary)]">{description}</p> : null}
      </div>
      {activities.length ? (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id}><ClubActivityCard activity={activity} /></li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card bg-[var(--hp-surface)] p-4 text-sm leading-5 text-[var(--hp-text-secondary)] shadow-[var(--hp-shadow-card)]">No club activity yet this week.</p>
      )}
    </section>
  );
}
