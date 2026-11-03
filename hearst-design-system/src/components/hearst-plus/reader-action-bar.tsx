"use client";

import type { LiveArticleData } from "@/lib/live-feed-types";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bookmark,
  BookOpenText,
  MessageCircle,
} from "@/components/ui/icons";
import { getLifestyleByline } from "@/components/hearst-plus/story-metadata";
import { cn } from "@/lib/utils";

export type PremiumReaderState = "loading" | "ready" | "unavailable";

export type ReaderActionBarProps = {
  story: LifestyleRiverStory;
  article?: LiveArticleData;
  saved: boolean;
  commentCount: number;
  onSave: () => void;
  premiumReaderState?: PremiumReaderState;
  onOpenPremiumReader?: () => void;
};

export function formatReaderPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  }).format(new Date(value));
}

export function formatReaderUpdatedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(new Date(value));
}

export function isMeaningfulArticleUpdate(
  publishedAt: string | undefined,
  updatedAt: string | undefined
) {
  const publishedTime = Date.parse(publishedAt ?? "");
  const updatedTime = Date.parse(updatedAt ?? "");

  return (
    Number.isFinite(publishedTime) &&
    Number.isFinite(updatedTime) &&
    updatedTime - publishedTime >= 15 * 60 * 1000
  );
}

export function ReaderPublicationDates({
  publishedAt,
  updatedAt,
  className,
}: {
  publishedAt?: string;
  updatedAt?: string;
  className?: string;
}) {
  const hasPublishedDate = Number.isFinite(Date.parse(publishedAt ?? ""));
  const hasUpdatedDate = isMeaningfulArticleUpdate(publishedAt, updatedAt);
  if (!hasPublishedDate) return null;

  return (
    <p
      className={cn(
        "flex flex-wrap gap-x-3 gap-y-1 text-[length:var(--text-token-4xs)] leading-5 text-muted-foreground",
        className
      )}
    >
      <time dateTime={publishedAt}>
        {formatReaderPublishedDate(publishedAt!)}
      </time>
      {hasUpdatedDate ? (
        <span>
          Updated{" "}
          <time dateTime={updatedAt}>{formatReaderUpdatedDate(updatedAt!)}</time>
        </span>
      ) : null}
    </p>
  );
}

export function ReaderActionBar({
  story,
  article,
  saved,
  commentCount,
  onSave,
  premiumReaderState,
  onOpenPremiumReader,
}: ReaderActionBarProps) {
  const byline = getLifestyleByline(story, article);
  const publishedAt = article?.publishedAt ?? story.publishedAt;
  const authorAvatarUrl = article?.authorAvatarUrl;
  const authorInitials = byline
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();

  return (
    <div className="my-6 min-w-0 border-y border-border py-3">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
          <div className="inline-flex min-h-11 max-w-full min-w-0 items-center gap-1.5 text-[length:var(--text-token-4xs)] text-muted-foreground sm:min-h-0">
            <Avatar size="default" className="size-7" aria-hidden>
              {authorAvatarUrl ? (
                <AvatarImage
                  src={authorAvatarUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <AvatarFallback className="bg-foreground text-xs font-bold text-background">
                {authorInitials || "H+"}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 truncate">
              By {byline} · {story.topic}
            </span>
          </div>
          <ReaderPublicationDates
            publishedAt={publishedAt}
            updatedAt={article?.updatedAt}
            className="shrink-0"
          />
        </div>
        <div className="flex w-full shrink-0 items-center justify-center gap-1 sm:w-auto sm:justify-end sm:self-auto sm:gap-2">
          {premiumReaderState === "ready" ||
          premiumReaderState === "loading" ? (
            <button
              type="button"
              onClick={onOpenPremiumReader}
              disabled={premiumReaderState !== "ready"}
              aria-keyshortcuts="P"
              aria-label={
                premiumReaderState === "ready"
                  ? "Open premium reading experience. Shortcut P"
                  : "Preparing premium reading experience"
              }
              title={
                premiumReaderState === "ready"
                  ? "Premium reading experience · Shortcut P"
                  : "Preparing premium reader…"
              }
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center border-0 bg-transparent p-0 shadow-none outline-none ring-0 transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 sm:h-7 sm:w-7",
                premiumReaderState === "ready"
                  ? "text-muted-foreground hover:text-primary"
                  : "cursor-wait text-muted-foreground opacity-65"
              )}
            >
              <BookOpenText
                className={cn(
                  "h-4 w-4",
                  premiumReaderState === "loading" && "animate-pulse"
                )}
                weight="regular"
                aria-hidden
              />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved stories" : "Save story"}
            title={saved ? "Remove from saved stories" : "Save story"}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 sm:h-7 sm:w-7",
              saved
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Bookmark
              className="h-4 w-4"
              weight={saved ? "fill" : "regular"}
              aria-hidden
            />
          </button>
          <a
            href={`#reader-comments-${story.id}`}
            aria-label={`Jump to ${commentCount} comments`}
            title={`${commentCount} comments`}
            className="group inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:h-7 sm:min-w-0"
          >
            <MessageCircle className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5" aria-hidden />
            <span className="tabular-nums">{commentCount}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
