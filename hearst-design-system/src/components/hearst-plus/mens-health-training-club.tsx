"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { appendReaderReturnHref } from "@/lib/reader-navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarBlank, CheckCircle2, Clock, Plus, TrendingUp } from "@/components/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClubActivityFeed } from "@/components/hearst-plus/club-activity-card";
import { sampleClubActivities, type Activity, type ActivityType } from "@/components/hearst-plus/club-activity-model";

const STORAGE_KEY = "hearst-mens-health-training-club-v1";
const STORE_CHANGE_EVENT = "hearst-mens-health-training-club-change";
const WEEKLY_DAY_GOAL = 3;
// Cover art from the Men’s Health 30-Day Workout Challenge, the plan the club links to.
const TRAINING_CLUB_COVER = "https://hips.hearstapps.com/hmg-prod/images/e121f8cc-f786-4c8c-a1fd-c0d694f73bf2.png?resize=1600:*";
const TRAINING_PLAN_STORY_ID = "mens-health-fitness-a74297441-workout-challenge-30-day";
const TRAINING_CLUB_RETURN_HREF = "/communities/mens-health/groups/training-club/";

type TrainingActivity = {
  id: string;
  type: string;
  date: string;
  minutes: number;
  distance?: number;
  note?: string;
  inGroupPreview: boolean;
};

type TrainingStore = {
  challengeJoined: boolean;
  activities: TrainingActivity[];
};

const emptyStore: TrainingStore = { challengeJoined: false, activities: [] };
const emptyStoreSnapshot = JSON.stringify(emptyStore);
const activityTypes = ["Strength workout", "Run", "Walk", "Ride", "Mobility", "Other"];

function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  return localDateValue(start);
}

function parseStore(raw: string): TrainingStore {
  try {
    const parsed = JSON.parse(raw) as Partial<TrainingStore>;
    return {
      challengeJoined: parsed.challengeJoined === true,
      activities: Array.isArray(parsed.activities) ? parsed.activities.filter((item): item is TrainingActivity =>
        Boolean(item && typeof item.id === "string" && typeof item.type === "string" && typeof item.date === "string" &&
          Number.isFinite(item.minutes) && item.minutes > 0),
      ) : [],
    };
  } catch {
    return emptyStore;
  }
}

function saveStore(store: TrainingStore) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(STORE_CHANGE_EVENT));
  } catch {
    // Keep the current session usable if browser storage is unavailable.
  }
}

function getStoreSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? emptyStoreSnapshot;
  } catch {
    return emptyStoreSnapshot;
  }
}

function subscribeToStore(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(STORE_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORE_CHANGE_EVENT, onChange);
  };
}

const loggedActivityTypes: Record<string, ActivityType> = {
  "Strength workout": "strength",
  Run: "run",
  Walk: "walk",
  Ride: "ride",
  Mobility: "mobility",
};

/** A reader's own check-in, shown in Club activity only when they chose the group preview. */
function toClubActivity(activity: TrainingActivity): Activity {
  return {
    id: `own-${activity.id}`,
    athlete: { id: "you", name: "You" },
    type: loggedActivityTypes[activity.type] ?? "other",
    title: activity.type,
    startedAt: `${activity.date}T12:00:00Z`,
    timeZone: "UTC",
    dateOnly: true,
    source: "Logged in Hearst+",
    distanceMi: activity.distance,
    durationSec: activity.minutes * 60,
    kudos: [],
    comments: [],
  };
}

function formatActivityDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(year, month - 1, day, 12));
}

export function MensHealthTrainingClub() {
  const storeSnapshot = React.useSyncExternalStore(subscribeToStore, getStoreSnapshot, () => emptyStoreSnapshot);
  const store = React.useMemo(() => parseStore(storeSnapshot), [storeSnapshot]);
  const [date, setDate] = React.useState("");
  const [activityType, setActivityType] = React.useState(activityTypes[0]);
  const [minutes, setMinutes] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [note, setNote] = React.useState("");
  const [inGroupPreview, setInGroupPreview] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const weekStart = startOfWeek();
  const thisWeek = store.activities.filter((activity) => activity.date >= weekStart && activity.date <= localDateValue());
  const activeDays = new Set(thisWeek.map((activity) => activity.date)).size;
  const weekMinutes = thisWeek.reduce((total, activity) => total + activity.minutes, 0);
  const distanceEnabled = ["Run", "Walk", "Ride"].includes(activityType);
  const clubActivities = React.useMemo(
    () => [...store.activities.filter((activity) => activity.inGroupPreview).slice(0, 3).map(toClubActivity), ...sampleClubActivities]
      .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt)),
    [store.activities],
  );

  function handleToggleChallenge() {
    const next = { ...store, challengeJoined: !store.challengeJoined };
    saveStore(next);
  }

  function handleRemoveActivity(id: string) {
    saveStore({ ...store, activities: store.activities.filter((activity) => activity.id !== id) });
    setMessage("Activity removed from this device.");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const duration = Number(minutes);
    const miles = distance ? Number(distance) : undefined;
    if (!date || !Number.isFinite(duration) || duration < 1 || duration > 600) {
      setMessage("Enter a date and a duration between 1 and 600 minutes.");
      return;
    }
    if (distanceEnabled && distance && (!Number.isFinite(miles) || (miles ?? 0) < 0)) {
      setMessage("Enter a valid distance, or leave it blank.");
      return;
    }

    const activity: TrainingActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: activityType,
      date,
      minutes: duration,
      ...(distanceEnabled && miles ? { distance: miles } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
      inGroupPreview,
    };
    const next = { ...store, activities: [activity, ...store.activities].slice(0, 50) };
    saveStore(next);
    setMinutes("");
    setDistance("");
    setNote("");
    setInGroupPreview(false);
    setMessage(`${activityType} saved on this device.`);
  }

  return (
    <section className="space-y-4" aria-labelledby="mh-training-club-title">
      <Card className="gap-4 overflow-hidden rounded-card border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] ring-0 sm:p-5">
        <div className="relative -mx-4 -mt-4 aspect-[2/1] overflow-hidden bg-muted sm:-mx-5 sm:-mt-5 md:aspect-[3/1]">
          <Image
            src={TRAINING_CLUB_COVER}
            alt="A Men’s Health trainer mid-exercise over a red calendar collage"
            fill
            priority
            sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="type-k1 text-primary">Men’s Health · Hearst+ community</p>
            <h2 id="mh-training-club-title" className="headline mt-1 text-2xl leading-tight sm:text-3xl">Train together. Build your week.</h2>
            <p className="hearst-community-copy mt-2 max-w-2xl text-sm leading-6 text-[var(--hp-text-secondary)]">
              Log the movement that works for you, share a check-in if you choose, and follow a weekly challenge from Men’s Health.
            </p>
          </div>
          <Link href={appendReaderReturnHref(TRAINING_PLAN_STORY_ID, TRAINING_CLUB_RETURN_HREF)} className="inline-flex min-h-11 shrink-0 items-center font-bold text-primary underline-offset-4 hover:underline">
            Read the Men’s Health plan <span aria-hidden className="ml-1">→</span>
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(230px,0.72fr)]">
          <Card className="gap-3 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-background)] p-4 ring-0">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="type-k1 text-[var(--hp-text-secondary)]">This week’s challenge</p>
                <h3 className="headline mt-1 text-lg leading-snug">Move on three days</h3>
                <p className="hearst-community-copy mt-1 text-sm leading-5 text-[var(--hp-text-secondary)]">
                  Any activity counts. Your check-ins stay on this device unless you add them to the group preview.
                </p>
                <p className="mt-3 text-sm font-bold text-[var(--hp-text-primary)]" aria-live="polite">
                  {activeDays} of {WEEKLY_DAY_GOAL} days logged this week
                </p>
                {store.challengeJoined ? (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--hp-text-primary)]"><CheckCircle2 className="size-5 text-primary" aria-hidden /> You’re in the challenge</span>
                    <button type="button" onClick={handleToggleChallenge} className="min-h-10 rounded px-2 text-sm font-semibold text-[var(--hp-text-secondary)] underline underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Leave challenge</button>
                  </div>
                ) : (
                  <Button type="button" size="touch" className="mt-3 text-primary-foreground" onClick={handleToggleChallenge}>Join this week’s challenge</Button>
                )}
              </div>
            </div>
          </Card>
          <Card className="gap-3 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-background)] p-4 ring-0">
            <h3 className="type-k1 text-[var(--hp-text-secondary)]">Your week</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-[var(--hp-text-secondary)]">Activities</dt>
                <dd className="mt-1 text-2xl font-black tabular-nums">{thisWeek.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--hp-text-secondary)]">Active days</dt>
                <dd className="mt-1 text-2xl font-black tabular-nums">{activeDays}</dd>
              </div>
              <div className="col-span-2 border-t border-[var(--hp-border)] pt-3">
                <dt className="text-xs text-[var(--hp-text-secondary)]">Time moving</dt>
                <dd className="mt-1 text-lg font-bold tabular-nums">{weekMinutes} min</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-5 text-[var(--hp-text-secondary)]">A flexible goal, with no streaks or penalties for taking a rest day.</p>
          </Card>
        </div>
      </Card>

      <Card className="gap-0 rounded-card border border-[var(--hp-border)] bg-[var(--hp-surface)] p-0 shadow-[var(--hp-shadow-card)] ring-0">
      <form onSubmit={handleSubmit} className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Plus className="size-5 text-primary" aria-hidden />
          <h3 className="headline text-xl leading-tight">Log an activity</h3>
        </div>
        <p className="mt-1 text-sm leading-5 text-[var(--hp-text-secondary)]">Your activity is stored locally in this browser for this prototype.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5 text-sm font-semibold">
            <label id="mh-activity-type-label" htmlFor="mh-activity-type">Activity</label>
            <Select value={activityType} onValueChange={(nextValue) => { if (nextValue) setActivityType(nextValue); }}>
              <SelectTrigger id="mh-activity-type" aria-labelledby="mh-activity-type-label" className="h-11 min-h-11 w-full rounded-[6px] border-[var(--hp-border)] bg-[var(--hp-surface)] px-3 text-[var(--hp-text-primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Input type="date" label="Date" required value={date} onChange={(event) => setDate(event.target.value)} size="xl" />
          <Input type="number" label="Duration in minutes" min="1" max="600" required inputMode="numeric" value={minutes} onChange={(event) => setMinutes(event.target.value)} placeholder="e.g. 35" size="xl" />
          {distanceEnabled ? (
            <Input type="number" label="Distance in miles (optional)" min="0" max="1000" step="0.01" inputMode="decimal" value={distance} onChange={(event) => setDistance(event.target.value)} placeholder="e.g. 2.5" size="xl" />
          ) : null}
          <Input type="text" label="Note (optional)" maxLength={120} value={note} onChange={(event) => setNote(event.target.value)} placeholder="A short note for yourself" size="xl" className="sm:col-span-2" />
        </div>
        <label className="mt-4 flex min-h-11 items-start gap-3 text-sm leading-5">
          <input type="checkbox" checked={inGroupPreview} onChange={(event) => setInGroupPreview(event.target.checked)} className="mt-1 size-4 accent-[var(--primary)]" />
          <span><strong>Include this check-in in the group activity preview.</strong><br /><span className="text-xs text-[var(--hp-text-secondary)]">The preview is still local to this browser; it is not sent to other members.</span></span>
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="submit" size="touch" className="text-primary-foreground">Save activity</Button>
          <span className="text-sm text-[var(--hp-text-secondary)]" role="status" aria-live="polite">{message}</span>
        </div>
      </form>
      </Card>

      <ClubActivityFeed
        activities={clubActivities}
        description="Sample activity from illustrative members, so you can see how the club feed works. Check-ins you add to the group preview appear here too and stay in this browser."
      />

      <Card className="gap-3 rounded-card border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] ring-0 sm:p-5">
      <section aria-labelledby="mh-recent-activity-title">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="mh-recent-activity-title" className="headline text-xl leading-tight">Your recent activity</h3>
          <span className="text-xs font-semibold text-[var(--hp-text-secondary)]">Private to this browser</span>
        </div>
        {store.activities.length ? (
          <ul className="mt-3 divide-y divide-[var(--hp-border)]">
            {store.activities.slice(0, 6).map((activity) => (
              <li key={activity.id} className="flex flex-wrap items-start gap-3 py-3 first:pt-0 last:pb-0">
                <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{activity.type} <span className="font-normal text-[var(--hp-text-secondary)]">· {formatActivityDate(activity.date)}</span></p>
                  <p className="mt-0.5 text-sm text-[var(--hp-text-secondary)]">{activity.minutes} min{activity.distance ? ` · ${activity.distance} mi` : ""}{activity.note ? ` · ${activity.note}` : ""}</p>
                </div>
                <span className="inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-[var(--hp-text-secondary)]">
                  {activity.inGroupPreview ? <><CalendarBlank className="size-4" aria-hidden /> Group preview</> : "Only you"}
                </span>
                <button type="button" onClick={() => handleRemoveActivity(activity.id)} className="min-h-10 rounded px-2 text-sm font-semibold text-[var(--hp-text-secondary)] underline underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label={`Remove ${activity.type} from activity log`}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="hearst-community-copy mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">No activities yet. Add one above to try the challenge with your own movement.</p>
        )}
      </section>
      </Card>
    </section>
  );
}
