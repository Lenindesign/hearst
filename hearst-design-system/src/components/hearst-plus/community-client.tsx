"use client";

// Client side of Hearst+ Communities (docs/hearst-plus-communities-design.md). Everything here is a
// browser-local prototype: joined groups, reader posts and replies, Helpful reactions, reports and the
// Activity list live in localStorage until real accounts and a moderation backend exist.

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { useReaderAccount } from "@/components/reader-account";
import { ReaderAuthDialog } from "@/components/reader-account-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Flag, Heart, ImageIcon, MessageCircle, Plus, Send, Shield } from "@/components/ui/icons";
import {
  joinedBrandGroupsChangeEvent,
  joinedBrandGroupsStorageKey,
} from "@/lib/community-groups";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------------------------------
 * Shared types (built on the server, passed down as plain data)
 * ---------------------------------------------------------------------------------------------- */

export type CommunityGroupSummary = {
  brand: string;
  brandSlug: string;
  groupSlug?: string;
  name: string;
  description: string;
  members: string;
  href: string;
};

export type CommunityFeedThread = {
  id: string;
  brand: string;
  brandSlug: string;
  title: string;
  body: string;
  meta: string;
  kindLabel: string;
  replies: number;
  helpfulBase: number;
  author: string;
  isHost: boolean;
  href: string;
  storyHref?: string;
  posterImage?: string;
  posterAlt?: string;
};

type LocalPost = {
  id: string;
  brand: string;
  brandSlug: string;
  groupName: string;
  title: string;
  body: string;
  author: string;
  createdAt: number;
  status: "pending" | "live";
  // A downscaled JPEG data URL; prototype posts live in localStorage, so photos are kept small.
  image?: string;
  imageAlt?: string;
};

type LocalReply = {
  id: string;
  threadId: string;
  author: string;
  body: string;
  createdAt: number;
};

type ActivityItem = {
  id: string;
  text: string;
  href?: string;
  createdAt: number;
};

type CommunityStore = {
  posts: LocalPost[];
  replies: LocalReply[];
  helpful: string[];
  reported: string[];
  activity: ActivityItem[];
  activitySeenAt: number;
  suggestions: { name: string; reason: string; brand?: string; createdAt: number }[];
};

// Trust ladder (Q4): a reader's first posts wait for host review, later posts go live at once.
export const COMMUNITY_REVIEWED_POST_COUNT = 3;
// Prototype stand-in for a host working the review queue.
const SIMULATED_REVIEW_MS = 45_000;
const STORE_KEY = "hearst-plus-community-v1";
const STORE_EVENT = "hearst-plus-community-change";
const emptyStore: CommunityStore = {
  posts: [],
  replies: [],
  helpful: [],
  reported: [],
  activity: [],
  activitySeenAt: 0,
  suggestions: [],
};

/* ------------------------------------------------------------------------------------------------
 * Store
 * ---------------------------------------------------------------------------------------------- */

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(STORE_EVENT, onChange);
  window.addEventListener(joinedBrandGroupsChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORE_EVENT, onChange);
    window.removeEventListener(joinedBrandGroupsChangeEvent, onChange);
  };
}

function readRaw(key: string) {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

// The snapshot is the raw strings, so React compares stable primitives between renders.
const getSnapshot = () => `${readRaw(joinedBrandGroupsStorageKey)}\u0000${readRaw(STORE_KEY)}`;
const getServerSnapshot = () => "\u0000";

function parseStore(raw: string): CommunityStore {
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? { ...emptyStore, ...parsed } : emptyStore;
  } catch {
    return emptyStore;
  }
}

function parseJoined(raw: string): string[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStore(update: (store: CommunityStore) => CommunityStore) {
  try {
    const next = update(parseStore(readRaw(STORE_KEY)));
    window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(STORE_EVENT));
    return true;
  } catch {
    // Storage can be unavailable (private windows) or full; the page still renders without local state.
    return false;
  }
}

const PHOTO_MAX_EDGE = 1200;
const PHOTO_QUALITY = 0.8;

// Shrinks a picked photo to a JPEG data URL so it fits in browser storage.
async function preparePhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, PHOTO_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", PHOTO_QUALITY);
}

function writeJoined(next: string[]) {
  try {
    window.localStorage.setItem(joinedBrandGroupsStorageKey, JSON.stringify([...new Set(next)]));
    window.dispatchEvent(new Event(joinedBrandGroupsChangeEvent));
  } catch {
    // See writeStore.
  }
}

function useCommunityState() {
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return React.useMemo(() => {
    const [joinedRaw, storeRaw] = snapshot.split("\u0000");
    return { joined: parseJoined(joinedRaw), store: parseStore(storeRaw) };
  }, [snapshot]);
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function toggleJoined(brand: string, joined: string[]) {
  writeJoined(joined.includes(brand) ? joined.filter((item) => item !== brand) : [...joined, brand]);
}

/* ------------------------------------------------------------------------------------------------
 * Small controls
 * ---------------------------------------------------------------------------------------------- */

export function CommunityJoinButton({ brand, groupName, className }: { brand: string; groupName: string; className?: string }) {
  const { joined } = useCommunityState();
  const isJoined = joined.includes(brand);
  return (
    <button
      type="button"
      aria-pressed={isJoined}
      aria-label={isJoined ? `Leave ${groupName}` : `Join ${groupName}`}
      onClick={() => toggleJoined(brand, joined)}
      className={cn(
        "inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
        isJoined
          ? "border border-[var(--hp-border)] text-[var(--hp-text-secondary)] hover:text-[var(--hp-text-primary)]"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
    >
      {isJoined ? <CheckCircle2 className="size-3.5" aria-hidden /> : null}
      {isJoined ? "Joined" : "Join"}
    </button>
  );
}

// One positive reaction (Q3): no downvotes.
export function CommunityHelpfulButton({ id, base, label = "thread" }: { id: string; base: number; label?: string }) {
  const { store } = useCommunityState();
  const active = store.helpful.includes(id);
  const count = base + (active ? 1 : 0);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`${active ? "Remove Helpful from" : "Mark Helpful:"} this ${label}, ${count} found it helpful`}
      onClick={() =>
        writeStore((current) => ({
          ...current,
          helpful: active ? current.helpful.filter((item) => item !== id) : [...current.helpful, id],
        }))
      }
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-full px-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
        active ? "text-primary" : "text-[var(--hp-text-secondary)] hover:text-primary",
      )}
    >
      <Heart className={cn("size-4", active && "fill-current")} aria-hidden />
      Helpful
      <span className="tabular-nums">{count}</span>
    </button>
  );
}

export function CommunityReportButton({ id, label = "thread" }: { id: string; label?: string }) {
  const { store } = useCommunityState();
  const reported = store.reported.includes(id);
  if (reported) {
    return (
      <span role="status" className="inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-[var(--hp-text-secondary)]">
        <Shield className="size-3.5" aria-hidden />
        Reported. Hosts will review it.
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-label={`Report this ${label}`}
      onClick={() => writeStore((current) => ({ ...current, reported: [...current.reported, id] }))}
      className="inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-[var(--hp-text-secondary)] transition-colors hover:text-[var(--hp-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
    >
      <Flag className="size-3.5" aria-hidden />
      Report
    </button>
  );
}

export function CommunityHostBadge({ brand }: { brand: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
      <Shield className="size-3" aria-hidden />
      {brand} host
    </span>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Left rail: my groups, Activity and Suggest a group
 * ---------------------------------------------------------------------------------------------- */

// Simulated host review: pending posts older than SIMULATED_REVIEW_MS go live and add an Activity item.
function useSimulatedReview() {
  React.useEffect(() => {
    const review = () => {
      const { posts } = parseStore(readRaw(STORE_KEY));
      const due = posts.filter((post) => post.status === "pending" && Date.now() - post.createdAt >= SIMULATED_REVIEW_MS);
      if (due.length === 0) return;
      writeStore((current) => ({
        ...current,
        posts: current.posts.map((post) => (due.some((item) => item.id === post.id) ? { ...post, status: "live" } : post)),
        activity: [
          ...due.map((post) => ({
            id: newId("activity"),
            text: `A ${post.brand} host approved your post "${post.title}". It is live in ${post.groupName}.`,
            href: `/communities/${post.brandSlug}/`,
            createdAt: Date.now(),
          })),
          ...current.activity,
        ].slice(0, 20),
      }));
    };
    review();
    const timer = window.setInterval(review, 5000);
    return () => window.clearInterval(timer);
  }, []);
}

export function CommunityLeftRail({
  groups,
  activeBrandSlug,
  activeGroupSlug,
}: {
  groups: CommunityGroupSummary[];
  activeBrandSlug?: string;
  activeGroupSlug?: string;
}) {
  const { joined, store } = useCommunityState();
  useSimulatedReview();
  const myGroups = groups.filter((group) => joined.includes(group.brand));
  const unseen = store.activity.filter((item) => item.createdAt > store.activitySeenAt).length;

  return (
    <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
      <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
        My groups
      </h2>
      {myGroups.length > 0 ? (
        <nav className="mt-3 grid gap-1" aria-label="My groups">
          {myGroups.map((group) => {
            const active = group.groupSlug
              ? activeGroupSlug === group.groupSlug
              : !activeGroupSlug && activeBrandSlug === group.brandSlug;
            return (
              <Link
                key={`${group.brandSlug}-${group.groupSlug ?? "brand"}`}
                href={group.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 min-w-0 items-center gap-3 rounded-[8px] px-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                  active
                    ? "bg-[var(--community-surface-soft)] text-[var(--hp-text-primary)]"
                    : "text-[var(--hp-text-secondary)] hover:bg-[var(--community-surface-soft)] hover:text-[var(--hp-text-primary)]",
                )}
              >
                <BrandSourceIcon brand={group.brand} brandSlug={group.brandSlug} className="size-7 shrink-0 rounded-full" imageClassName="object-cover p-0" />
                <span className="min-w-0 flex-1 truncate">{group.name}</span>
              </Link>
            );
          })}
        </nav>
      ) : (
        <p className="hearst-community-copy mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">
          Join a group to keep it here. <Link href="/communities/?view=all" className="font-bold text-primary hover:underline">Browse all groups</Link>
        </p>
      )}

      <details className="group/suggest mt-3 border-t border-[var(--hp-border)] pt-3" id="suggest-group">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-[8px] px-2 text-sm font-bold text-[var(--hp-text-secondary)] hover:bg-[var(--community-surface-soft)] hover:text-[var(--hp-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 [&::-webkit-details-marker]:hidden">
          <Plus className="size-4" aria-hidden />
          Suggest a group
        </summary>
        <SuggestGroupForm />
      </details>

      <div className="mt-3 border-t border-[var(--hp-border)] pt-3">
        <h2 className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
          Activity
          {unseen > 0 ? (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-black text-primary-foreground">
              {unseen}
              <span className="sr-only"> new</span>
            </span>
          ) : null}
        </h2>
        {store.activity.length > 0 ? (
          <ul className="mt-3 space-y-2" onMouseEnter={() => unseen > 0 && writeStore((current) => ({ ...current, activitySeenAt: Date.now() }))}>
            {store.activity.slice(0, 5).map((item) => (
              <li key={item.id} className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]">
                {item.href ? (
                  <Link href={item.href} className="hover:text-[var(--hp-text-primary)]" onFocus={() => writeStore((current) => ({ ...current, activitySeenAt: Date.now() }))}>
                    {item.text}
                  </Link>
                ) : (
                  item.text
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="hearst-community-copy mt-2 text-xs leading-5 text-[var(--hp-text-secondary)]">
            Replies to you, host answers and approved posts show up here.
          </p>
        )}
      </div>
    </section>
  );
}

function SuggestGroupForm() {
  const [sent, setSent] = React.useState(false);
  const [name, setName] = React.useState("");
  const [reason, setReason] = React.useState("");

  if (sent) {
    return (
      <p role="status" className="hearst-community-copy mt-2 px-2 text-sm leading-6 text-[var(--hp-text-secondary)]">
        Thanks. Your suggestion went to the hosts, who review new group ideas.
      </p>
    );
  }
  return (
    <form
      className="mt-2 grid gap-2 px-1"
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim()) return;
        writeStore((current) => ({
          ...current,
          suggestions: [...current.suggestions, { name: name.trim(), reason: reason.trim(), createdAt: Date.now() }],
        }));
        setSent(true);
      }}
    >
      <label className="grid gap-1 text-xs font-bold text-[var(--hp-text-primary)]">
        Group name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Weekend baking"
          className="hearst-community-copy min-h-10 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] px-3 text-sm font-normal outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>
      <label className="grid gap-1 text-xs font-bold text-[var(--hp-text-primary)]">
        What would people talk about?
        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="hearst-community-copy min-h-20 text-sm font-normal"
        />
      </label>
      <Button type="submit" size="sm" className="justify-self-start text-primary-foreground">
        <Send className="size-4" aria-hidden />
        Send to hosts
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Phones: my groups as a chip row above the feed (Q11)
 * ---------------------------------------------------------------------------------------------- */

export function CommunityGroupChips({ groups, activeBrandSlug }: { groups: CommunityGroupSummary[]; activeBrandSlug?: string }) {
  const { joined } = useCommunityState();
  const myGroups = groups.filter((group) => joined.includes(group.brand));
  return (
    <nav aria-label="My groups" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-hide lg:hidden">
      <Link
        href="/communities/"
        aria-current={!activeBrandSlug ? "page" : undefined}
        className={cn(
          "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-bold",
          !activeBrandSlug ? "border-primary bg-primary text-primary-foreground" : "border-[var(--hp-border)] bg-[var(--hp-surface)]",
        )}
      >
        Home
      </Link>
      {myGroups.map((group) => {
        const active = activeBrandSlug === group.brandSlug;
        return (
          <Link
            key={`${group.brandSlug}-${group.groupSlug ?? "brand"}`}
            href={group.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-sm font-bold",
              active ? "border-primary bg-[var(--community-surface-soft)]" : "border-[var(--hp-border)] bg-[var(--hp-surface)]",
            )}
          >
            <BrandSourceIcon brand={group.brand} brandSlug={group.brandSlug} className="size-5 rounded-full" imageClassName="object-cover p-0" />
            {group.name}
          </Link>
        );
      })}
      <Link href="/communities/?view=all" className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-dashed border-[var(--hp-border)] px-4 text-sm font-bold text-[var(--hp-text-secondary)]">
        All groups
      </Link>
    </nav>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Right rail on Home: groups to join (Q10)
 * ---------------------------------------------------------------------------------------------- */

export function CommunityGroupsToJoin({ groups }: { groups: CommunityGroupSummary[] }) {
  const { joined } = useCommunityState();
  const toJoin = groups.filter((group) => !joined.includes(group.brand)).slice(0, 5);
  return (
    <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
      <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
        Groups to join
      </h2>
      {toJoin.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {toJoin.map((group) => (
            <li key={`${group.brandSlug}-${group.groupSlug ?? "brand"}`} className="flex items-start gap-3">
              <BrandSourceIcon brand={group.brand} brandSlug={group.brandSlug} className="mt-0.5 size-8 shrink-0 rounded-full" imageClassName="object-cover p-0" />
              <div className="min-w-0 flex-1">
                <Link href={group.href} className="headline block text-base leading-snug hover:text-primary">
                  {group.name}
                </Link>
                <p className="hearst-community-copy mt-0.5 line-clamp-2 text-xs leading-5 text-[var(--hp-text-secondary)]">{group.description}</p>
                <p className="mt-1 text-xs font-bold text-[var(--hp-text-secondary)]">{group.members}</p>
              </div>
              <CommunityJoinButton brand={group.brand} groupName={group.name} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="hearst-community-copy mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">
          You have joined every group. <Link href="/communities/?view=all" className="font-bold text-primary hover:underline">See all groups</Link>
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Composer (Q4, Q8): posts as the Hearst+ identity, first posts wait for host review
 * ---------------------------------------------------------------------------------------------- */

const emptyProfile = { followedTopics: [], followedBrands: [], savedTags: [], boostedTags: [], savedIds: [], hiddenIds: [] };

export function CommunityComposer({ groups, defaultGroup }: { groups: CommunityGroupSummary[]; defaultGroup?: CommunityGroupSummary }) {
  const { account } = useReaderAccount();
  const { store } = useCommunityState();
  const [open, setOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [groupKey, setGroupKey] = React.useState(defaultGroup ? defaultGroup.brandSlug : "");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [photoAlt, setPhotoAlt] = React.useState("");
  const [photoError, setPhotoError] = React.useState("");
  const photoInputRef = React.useRef<HTMLInputElement | null>(null);
  const myPostCount = store.posts.length;
  const willWait = myPostCount < COMMUNITY_REVIEWED_POST_COUNT;
  const target = groups.find((group) => group.brandSlug === groupKey) ?? defaultGroup;
  const placeName = defaultGroup?.name ?? "a group";

  const start = () => {
    if (!account) {
      setAuthOpen(true);
      return;
    }
    setOpen(true);
  };

  return (
    <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]" aria-label="Start a post">
      {!open ? (
        <button
          type="button"
          onClick={start}
          className="hearst-community-copy flex min-h-11 w-full items-center gap-3 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] px-3 text-left text-sm font-semibold text-[var(--hp-text-secondary)] transition-colors hover:border-primary/45 hover:bg-[var(--community-surface-soft-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        >
          <MessageCircle className="size-4 shrink-0 text-primary" aria-hidden />
          {account ? `Start a post in ${placeName}` : `Sign in to post in ${placeName}`}
        </button>
      ) : (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!account || !target || !title.trim()) return;
            const status = willWait ? "pending" : "live";
            const post: LocalPost = {
              id: newId("post"),
              brand: target.brand,
              brandSlug: target.brandSlug,
              groupName: target.name,
              title: title.trim(),
              body: body.trim(),
              author: account.firstName || "Hearst+ reader",
              createdAt: Date.now(),
              status,
              ...(photo ? { image: photo, imageAlt: photoAlt.trim() || title.trim() } : {}),
            };
            const saved = writeStore((current) => ({
              ...current,
              posts: [post, ...current.posts],
              activity:
                status === "pending"
                  ? [{ id: newId("activity"), text: `Your post "${post.title}" is waiting for a ${post.brand} host to review it.`, createdAt: Date.now() }, ...current.activity].slice(0, 20)
                  : current.activity,
            }));
            if (!saved) {
              setPhotoError("This browser has no room to save the post. Try a smaller photo or remove it.");
              return;
            }
            setPhoto(null);
            setPhotoAlt("");
            setPhotoError("");
            setNotice(
              status === "pending"
                ? `Posted. A ${target.brand} host reviews your first ${COMMUNITY_REVIEWED_POST_COUNT} posts before others can see them; you'll see it in Activity when it's approved.`
                : "Posted. It's live in the group.",
            );
            setTitle("");
            setBody("");
            setOpen(false);
          }}
        >
          <div className="flex items-center gap-2 text-sm font-bold">
            Posting as {account?.firstName || "Hearst+ reader"}
            {!defaultGroup ? (
              <label className="ml-auto flex items-center gap-2 text-xs font-bold text-[var(--hp-text-secondary)]">
                in
                <select
                  value={groupKey}
                  onChange={(event) => setGroupKey(event.target.value)}
                  required
                  className="min-h-9 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] px-2 text-sm text-[var(--hp-text-primary)]"
                >
                  <option value="" disabled>
                    Choose a group
                  </option>
                  {groups.map((group) => (
                    <option key={group.brandSlug} value={group.brandSlug}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            autoFocus
            placeholder="Title"
            aria-label="Post title"
            className="headline min-h-11 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] px-3 text-lg outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Ask a question, share a tip, or start a conversation."
            aria-label="Post text"
            className="hearst-community-copy min-h-28 text-sm leading-6"
          />
          {photo ? (
            <div className="grid gap-2">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- a local data URL preview */}
                <img src={photo} alt={photoAlt || "Photo for your post"} className="max-h-72 w-full rounded-[8px] object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoAlt("");
                    photoInputRef.current?.focus();
                  }}
                  className="absolute right-2 top-2 inline-flex min-h-9 items-center rounded-full bg-black/60 px-3 text-xs font-bold text-white hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Remove photo
                </button>
              </div>
              <input
                value={photoAlt}
                onChange={(event) => setPhotoAlt(event.target.value)}
                placeholder="Describe the photo for people who can't see it"
                aria-label="Photo description"
                className="hearst-community-copy min-h-10 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          ) : null}
          {photoError ? (
            <p role="alert" className="text-xs font-bold text-destructive">
              {photoError}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-[8px] border border-[var(--hp-border)] px-3 text-sm font-bold text-[var(--hp-text-secondary)] hover:text-[var(--hp-text-primary)] focus-within:ring-2 focus-within:ring-primary/35">
              <ImageIcon className="size-4" aria-hidden />
              {photo ? "Change photo" : "Add photo"}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  if (!file.type.startsWith("image/")) {
                    setPhotoError("Choose an image file.");
                    return;
                  }
                  try {
                    setPhoto(await preparePhoto(file));
                    setPhotoError("");
                  } catch {
                    setPhotoError("That photo couldn't be read. Try a JPEG or PNG.");
                  }
                }}
              />
            </label>
            <p className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]">
              {willWait
                ? `Your first ${COMMUNITY_REVIEWED_POST_COUNT} posts are reviewed by the group's hosts before they go live.`
                : "Keep it useful, kind, and specific to this group."}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-primary-foreground">
                <Send className="size-4" aria-hidden />
                Post
              </Button>
            </div>
          </div>
        </form>
      )}
      {notice ? (
        <p role="status" className="hearst-community-copy mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">
          {notice}
        </p>
      ) : null}
      <ReaderAuthDialog
        open={authOpen}
        defaultPreferences={emptyProfile}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={() => {
          setAuthOpen(false);
          setOpen(true);
        }}
      />
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Feed (Q7): my groups first, then suggested; empty state for readers with no groups
 * ---------------------------------------------------------------------------------------------- */

function ThreadCard({ thread }: { thread: CommunityFeedThread }) {
  return (
    <article className="group p-4 sm:p-5" aria-labelledby={`thread-${thread.id}-title`}>
      <Link href={thread.href} className="block min-w-0 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35">
        <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[var(--hp-text-secondary)]">
          <BrandSourceIcon brand={thread.brand} brandSlug={thread.brandSlug} className="size-7 shrink-0 rounded-full" imageClassName="object-cover p-0" />
          <span className="text-[var(--hp-text-primary)]">{thread.author}</span>
          {thread.isHost ? <CommunityHostBadge brand={thread.brand} /> : null}
          <span aria-hidden>·</span>
          <span>{thread.kindLabel}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{thread.meta}</span>
        </span>
        <h3 id={`thread-${thread.id}-title`} className="headline mt-2 text-xl leading-snug transition-colors group-hover:text-primary md:text-2xl">
          {thread.title}
        </h3>
        <span className="hearst-community-copy mt-2 line-clamp-2 block text-sm leading-6 text-[var(--hp-text-ui)]">{thread.body}</span>
        {thread.posterImage ? (
          <span className="relative mt-4 block aspect-[16/9] w-full overflow-hidden rounded-[8px] bg-[var(--community-surface-soft)]">
            <Image
              src={thread.posterImage}
              alt={thread.posterAlt ?? thread.title}
              fill
              sizes="(max-width: 1024px) calc(100vw - 64px), 760px"
              className="object-cover transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          </span>
        ) : null}
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <CommunityHelpfulButton id={thread.id} base={thread.helpfulBase} />
        <Link href={thread.href} className="inline-flex min-h-9 items-center gap-1.5 text-sm font-bold text-[var(--hp-text-secondary)] hover:text-primary">
          <MessageCircle className="size-4" aria-hidden />
          {thread.replies} replies
        </Link>
        {thread.storyHref ? (
          <Link href={thread.storyHref} className="inline-flex min-h-9 items-center text-sm font-bold text-[var(--hp-text-secondary)] hover:text-primary">
            Read the story
          </Link>
        ) : null}
        <span className="ml-auto">
          <CommunityReportButton id={thread.id} />
        </span>
      </div>
    </article>
  );
}

function LocalPostCard({ post }: { post: LocalPost }) {
  return (
    <article className="p-4 sm:p-5" aria-labelledby={`${post.id}-title`}>
      <span className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--hp-text-secondary)]">
        <BrandSourceIcon brand={post.brand} brandSlug={post.brandSlug} className="size-7 shrink-0 rounded-full" imageClassName="object-cover p-0" />
        <span className="text-[var(--hp-text-primary)]">{post.author}</span>
        <span aria-hidden>·</span>
        <span>{post.groupName}</span>
        {post.status === "pending" ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">Waiting for host review · only you can see it</span>
        ) : null}
      </span>
      <h3 id={`${post.id}-title`} className="headline mt-2 text-xl leading-snug md:text-2xl">
        {post.title}
      </h3>
      {post.body ? <p className="hearst-community-copy mt-2 whitespace-pre-line text-sm leading-6 text-[var(--hp-text-ui)]">{post.body}</p> : null}
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- a local data URL from the reader's device
        <img src={post.image} alt={post.imageAlt ?? post.title} className="mt-4 aspect-[16/9] w-full rounded-[8px] object-cover" />
      ) : null}
      {post.status === "live" ? (
        <div className="mt-3">
          <CommunityHelpfulButton id={post.id} base={0} label="post" />
        </div>
      ) : null}
    </article>
  );
}

export function CommunityFeed({
  threads,
  view,
  scopeBrandSlug,
  suggestedLimit = 3,
}: {
  threads: CommunityFeedThread[];
  view: "home" | "mine" | "group";
  scopeBrandSlug?: string;
  suggestedLimit?: number;
}) {
  const { joined, store } = useCommunityState();
  const localPosts = store.posts.filter((post) => !scopeBrandSlug || post.brandSlug === scopeBrandSlug);
  const visibleLocalPosts = view === "mine" ? localPosts.filter((post) => joined.includes(post.brand)) : localPosts;

  let sections: { title?: string; threads: CommunityFeedThread[] }[];
  if (view === "group") {
    sections = [{ threads }];
  } else {
    const mine = threads.filter((thread) => joined.includes(thread.brand));
    const others = threads.filter((thread) => !joined.includes(thread.brand));
    if (view === "mine") {
      sections = [{ threads: mine }];
    } else if (mine.length === 0) {
      sections = [{ title: "Popular across Hearst+", threads: others }];
    } else {
      sections = [{ threads: mine }, { title: "From groups you might like", threads: others.slice(0, suggestedLimit) }];
    }
  }
  const empty = sections.every((section) => section.threads.length === 0) && visibleLocalPosts.length === 0;

  return (
    <div className="space-y-4">
      {view === "home" && joined.length === 0 ? (
        <p className="hearst-community-copy rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-4 text-sm leading-6 text-[var(--hp-text-ui)]">
          Join a few groups and their threads will come first here. Until then, here is what is popular across Hearst+.
        </p>
      ) : null}
      {empty ? (
        <p className="hearst-community-copy rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-6 text-sm leading-6 text-[var(--hp-text-secondary)]">
          {view === "mine" ? (
            <>
              Threads from your groups show up here. <Link href="/communities/?view=all" className="font-bold text-primary hover:underline">Find groups to join</Link>
            </>
          ) : (
            "No threads yet."
          )}
        </p>
      ) : null}
      {visibleLocalPosts.length > 0 ? (
        <div className="divide-y divide-[var(--hp-border)] rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
          {visibleLocalPosts.map((post) => (
            <LocalPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}
      {sections.map((section, index) =>
        section.threads.length > 0 ? (
          <section key={section.title ?? index} aria-label={section.title ?? "Threads"} className="space-y-2">
            {section.title ? (
              <h2 className="px-1 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">{section.title}</h2>
            ) : null}
            <div className="divide-y divide-[var(--hp-border)] rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
              {section.threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * All groups directory
 * ---------------------------------------------------------------------------------------------- */

export function CommunityGroupsDirectory({ groups }: { groups: CommunityGroupSummary[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {groups.map((group) => (
        <li key={`${group.brandSlug}-${group.groupSlug ?? "brand"}`} className="flex flex-col rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
          <div className="flex items-start gap-3">
            <BrandSourceIcon brand={group.brand} brandSlug={group.brandSlug} className="size-9 shrink-0 rounded-full" imageClassName="object-cover p-0" />
            <div className="min-w-0 flex-1">
              <Link href={group.href} className="headline block text-lg leading-snug hover:text-primary">
                {group.name}
              </Link>
              <p className="text-xs font-bold text-[var(--hp-text-secondary)]">
                Hosted by {group.brand}
                {group.members ? ` · ${group.members}` : ""}
              </p>
            </div>
          </div>
          <p className="hearst-community-copy mt-3 flex-1 text-sm leading-6 text-[var(--hp-text-ui)]">{group.description}</p>
          <div className="mt-3">
            <CommunityJoinButton brand={group.brand} groupName={group.name} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Thread replies with Helpful, Report and a working reply box
 * ---------------------------------------------------------------------------------------------- */

export function CommunityThreadReplies({
  threadId,
  brand,
  seedReplies,
}: {
  threadId: string;
  brand: string;
  seedReplies: { id: string; author: string; body: string; isHost: boolean; helpfulBase: number }[];
}) {
  const { account } = useReaderAccount();
  const { store } = useCommunityState();
  const [authOpen, setAuthOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const localReplies = store.replies.filter((reply) => reply.threadId === threadId);

  return (
    <>
      <section className="border-t border-[var(--hp-border)] p-5" aria-labelledby="thread-replies-title">
        <h2 id="thread-replies-title" className="text-base font-black leading-tight">
          Replies
        </h2>
        <ul className="mt-4 space-y-3">
          {[...seedReplies, ...localReplies.map((reply) => ({ id: reply.id, author: reply.author, body: reply.body, isHost: false, helpfulBase: 0 }))].map((reply) => (
            <li key={reply.id} className="rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--hp-text-secondary)]">
                <span className="text-[var(--hp-text-primary)]">{reply.author}</span>
                {reply.isHost ? <CommunityHostBadge brand={brand} /> : null}
              </div>
              <p className="hearst-community-copy mt-2 whitespace-pre-line text-sm leading-6 text-[var(--hp-text-ui)]">{reply.body}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <CommunityHelpfulButton id={reply.id} base={reply.helpfulBase} label="reply" />
                <span className="ml-auto">
                  <CommunityReportButton id={reply.id} label="reply" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <form
        className="border-t border-[var(--hp-border)] p-5"
        aria-labelledby="reply-thread-title"
        onSubmit={(event) => {
          event.preventDefault();
          if (!account) {
            setAuthOpen(true);
            return;
          }
          if (!text.trim()) return;
          writeStore((current) => ({
            ...current,
            replies: [...current.replies, { id: newId("reply"), threadId, author: account.firstName || "Hearst+ reader", body: text.trim(), createdAt: Date.now() }],
          }));
          setText("");
        }}
      >
        <h2 id="reply-thread-title" className="headline text-xl leading-tight">
          Add a reply
        </h2>
        <label className="mt-3 block">
          <span className="sr-only">Write a reply</span>
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={account ? `Reply as ${account.firstName || "Hearst+ reader"}` : "Sign in to reply"}
            className="hearst-community-copy min-h-24 text-sm leading-6"
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]">Keep it useful, kind, and specific to this group.</p>
          <Button type="submit" size="sm" className="text-primary-foreground">
            <Send className="size-4" aria-hidden />
            {account ? "Post reply" : "Sign in to reply"}
          </Button>
        </div>
        <ReaderAuthDialog open={authOpen} defaultPreferences={emptyProfile} onClose={() => setAuthOpen(false)} onAuthenticated={() => setAuthOpen(false)} />
      </form>
    </>
  );
}
