"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "@/components/ui/icons";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { useRiverLayout } from "@/lib/river-layout";
import { cn } from "@/lib/utils";

export function CommunityHomeRiverCard({ thread }: { thread: CommunityFeedThread }) {
  const isList = useRiverLayout() === "list";

  return (
    <article
      className={cn(
        "group/card min-w-0 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/50",
        isList && "grid grid-cols-[112px_minmax(0,1fr)] items-center sm:grid-cols-[168px_minmax(0,1fr)]",
      )}
      data-story-module="community"
      data-content-type="community"
      data-story-id={thread.id}
      aria-labelledby={`community-river-${thread.id}-title`}
    >
      <Link
        href={thread.href}
        className={cn(
          "block min-w-0 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
          isList && "col-span-full grid grid-cols-[112px_minmax(0,1fr)] items-center gap-4 p-4 sm:grid-cols-[168px_minmax(0,1fr)] sm:p-5",
        )}
      >
        {thread.posterImage ? (
          <span className={cn(
            "relative block w-full overflow-hidden bg-muted",
            isList ? "aspect-[4/3] rounded-[6px]" : "aspect-[16/9]",
          )}>
            <Image
              src={thread.posterImage}
              alt={thread.posterAlt ?? thread.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 760px"
              className="object-cover transition-transform duration-200 group-hover/card:scale-[1.02] motion-reduce:transition-none"
            />
          </span>
        ) : null}
        <span className={cn("block p-4 sm:p-5", isList && "min-w-0")}>
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[var(--hp-text-secondary)]">
            <BrandSourceIcon brand={thread.brand} brandSlug={thread.brandSlug} className="size-5 shrink-0 rounded-full" imageClassName="object-cover p-0" />
            <span className="text-[var(--hp-text-primary)]">{thread.author}</span>
            <span aria-hidden>·</span>
            <span className="uppercase tracking-wide text-[var(--hp-section-title)]">Community</span>
            <span aria-hidden>·</span>
            <span>{thread.kindLabel}</span>
            <span aria-hidden>·</span>
            <span className="truncate">{thread.meta}</span>
          </span>
          <h2 id={`community-river-${thread.id}-title`} className="headline mt-2 line-clamp-3 text-xl leading-snug transition-colors group-hover/card:text-primary sm:text-2xl">
            {thread.title}
          </h2>
          <span className="mt-2 line-clamp-3 block text-sm leading-6 text-muted-foreground">{thread.body}</span>
        </span>
      </Link>
      <div className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5",
        isList && "col-span-full",
      )}>
        <span className="inline-flex min-h-9 items-center gap-1.5 text-sm font-bold text-[var(--hp-text-secondary)]">
          <MessageCircle className="size-4" aria-hidden />
          {thread.replies.toLocaleString()} {thread.replies === 1 ? "reply" : "replies"}
        </span>
        <Link
          href={thread.href}
          className="inline-flex min-h-9 items-center gap-1.5 text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        >
          Join the conversation
        </Link>
      </div>
    </article>
  );
}
