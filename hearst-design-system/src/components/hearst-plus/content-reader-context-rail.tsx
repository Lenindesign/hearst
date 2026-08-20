"use client";

import Link from "next/link";
import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  communityParticipationThreads,
  getCommunityGroupHref,
  getCommunityGroupsForBrand,
  joinedBrandGroupsChangeEvent,
  joinedBrandGroupsStorageKey,
} from "@/lib/community-groups";
import { BrandSourceIcon } from "./brand-source-icon";
import { getLifestyleContextStories } from "./content-reader-model";
import {
  getLifestyleCardKind,
  getLifestyleKindLabel,
} from "./story-presentation";

export type ContentReaderContextRailProps = {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  onOpenStory: (storyId: string) => void;
};

function ReaderCommunityModule({
  brand,
  brandSlug,
}: Pick<LifestyleRiverStory, "brand" | "brandSlug">) {
  const [joined, setJoined] = React.useState(false);
  const featuredGroup = getCommunityGroupsForBrand(brandSlug)[0];
  const activeThread = communityParticipationThreads.find(
    (thread) => thread.brandSlug === brandSlug,
  );

  React.useEffect(() => {
    const readMembership = () => {
      try {
        const stored = JSON.parse(
          window.localStorage.getItem(joinedBrandGroupsStorageKey) ?? "[]",
        );
        setJoined(Array.isArray(stored) && stored.includes(brand));
      } catch {
        setJoined(false);
      }
    };

    readMembership();
    window.addEventListener("storage", readMembership);
    window.addEventListener(joinedBrandGroupsChangeEvent, readMembership);
    return () => {
      window.removeEventListener("storage", readMembership);
      window.removeEventListener(joinedBrandGroupsChangeEvent, readMembership);
    };
  }, [brand]);

  const toggleMembership = () => {
    try {
      const stored = JSON.parse(
        window.localStorage.getItem(joinedBrandGroupsStorageKey) ?? "[]",
      );
      const memberships = Array.isArray(stored)
        ? stored.filter((item): item is string => typeof item === "string")
        : [];
      const nextMemberships = joined
        ? memberships.filter((item) => item !== brand)
        : [...new Set([...memberships, brand])];
      window.localStorage.setItem(
        joinedBrandGroupsStorageKey,
        JSON.stringify(nextMemberships),
      );
      window.dispatchEvent(new Event(joinedBrandGroupsChangeEvent));
      setJoined(!joined);
    } catch {
      // Local-only membership is optional; the community link remains usable.
    }
  };

  return (
    <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
      <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
        {joined ? "Your Groups" : "Join Groups"}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {joined
          ? `Your ${brand} group, featured conversations, and reader notes.`
          : `Join the ${brand} group to tune your feed, then open the group when you want the full discussion.`}
      </p>
      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={toggleMembership}
          aria-pressed={joined}
          aria-label={`${joined ? "Leave" : "Join"} ${brand} group`}
          className="flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-[8px] border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-primary/45 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        >
          <span className="flex min-w-0 items-center gap-2">
            <BrandSourceIcon
              brand={brand}
              brandSlug={brandSlug}
              className="h-5 w-5 rounded-[4px]"
            />
            <span className="min-w-0 truncate">{brand}</span>
          </span>
          <span className="shrink-0 text-xs font-bold text-muted-foreground">
            {joined ? "Joined" : "Join"}
          </span>
        </button>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {joined
          ? `You joined the ${brand} group.`
          : `Join the ${brand} group to open its discussions.`}
      </p>
      {joined && featuredGroup ? (
        <Link
          href={getCommunityGroupHref(featuredGroup)}
          className="mt-3 block rounded-[6px] border border-border bg-background px-3 py-2 transition-colors hover:border-primary/45 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        >
          <span className="block text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Featured group
          </span>
          <span className="mt-1 block text-sm font-bold text-[var(--hp-text-primary)]">
            {featuredGroup.name}
          </span>
        </Link>
      ) : null}
      {joined && activeThread ? (
        <Link
          href={`/communities/${activeThread.brandSlug}/threads/${activeThread.id}/`}
          className="mt-2 block rounded-[6px] border border-border bg-background px-3 py-2 transition-colors hover:border-primary/45 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        >
          <span className="block text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Active thread · {activeThread.replies} replies
          </span>
          <span className="mt-1 block text-sm font-bold leading-5 text-[var(--hp-text-primary)]">
            {activeThread.title}
          </span>
        </Link>
      ) : null}
      <Link
        href={`/communities/${brandSlug}/`}
        className="mt-3 flex min-h-9 w-full items-center justify-center rounded-[4px] border border-border px-3 text-xs font-bold text-[var(--hp-text-primary)] transition-colors hover:border-primary/45 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
      >
        {joined ? "Open community" : "Browse groups"}
      </Link>
    </section>
  );
}

export function ContentReaderContextRail({
  currentStory,
  stories,
  onOpenStory,
}: ContentReaderContextRailProps) {
  const recommendations = getLifestyleContextStories(currentStory, stories);
  const modules = [
    {
      label: "Trending",
      description: `More ${currentStory.topic.toLowerCase()} picks with similar reader intent.`,
      stories: recommendations.sharedIntent,
    },
  ].filter((module) => module.stories.length > 0);

  return (
    <aside
      className="hidden xl:block"
      aria-label="Contextual story recommendations"
    >
      <div className="sticky top-32 max-h-[calc(100dvh-10rem)] space-y-4 overflow-y-auto overscroll-contain pb-12 pr-1">
        {modules.map((module) => (
          <React.Fragment key={module.label}>
            <div className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                {module.label}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {module.description}
              </p>
              <div className="mt-4 space-y-3">
                {module.stories.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => onOpenStory(story.id)}
                    aria-label={`Open contextual story: ${story.title}`}
                    className="group w-full border-t border-border pt-3 text-left first:border-t-0 first:pt-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <span className="flex items-center gap-2 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                      <BrandSourceIcon
                        brand={story.brand}
                        brandSlug={story.brandSlug}
                      />
                      {getLifestyleKindLabel(
                        getLifestyleCardKind(story),
                        story,
                      )}
                    </span>
                    <span className="mt-1 block text-sm font-bold leading-5 group-hover:text-primary">
                      {story.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
        <ReaderCommunityModule
          brand={currentStory.brand}
          brandSlug={currentStory.brandSlug}
        />
      </div>
    </aside>
  );
}
