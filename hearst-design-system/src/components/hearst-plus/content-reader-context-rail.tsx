"use client";

import Link from "next/link";
import React from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { MessageCircle } from "@/components/ui/icons";
import {
  getCommunityGroupsForBrand,
  getCommunityStoryThreadHref,
  isHostPickedStory,
} from "@/lib/community-groups";
import { CommunityJoinedGroupsCard } from "./community-joined-groups-card";
import { getLifestyleCommentCount, getLifestyleContextStories } from "./content-reader-model";
import { TrendingStoryRail } from "./trending-rail";

export type ContentReaderContextRailProps = {
  currentStory: LifestyleRiverStory;
  stories: LifestyleRiverStory[];
  onOpenStory: (storyId: string) => void;
};

function ReaderCommunityModule({
  brand,
  brandSlug,
}: Pick<LifestyleRiverStory, "brand" | "brandSlug">) {
  const configuredGroups = getCommunityGroupsForBrand(brandSlug);
  const groups = (configuredGroups.length > 0 ? configuredGroups : [{
    brandSlug,
    groupSlug: `${brandSlug}-community`,
    name: `${brand} group`,
    members: "",
  }]).map((group) => ({
    brand,
    brandSlug: group.brandSlug,
    groupSlug: group.groupSlug,
    name: group.name,
    members: group.members,
  }));

  return <CommunityJoinedGroupsCard groups={groups} />;
}

// Only stories a host attached to a thread link to Communities (communities design Q6).
function ReaderConversationLink({ story }: { story: LifestyleRiverStory }) {
  const replies = getLifestyleCommentCount(story);
  return (
    <Link
      href={getCommunityStoryThreadHref(story)}
      className="block rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] transition-colors hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
    >
      <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
        Join the conversation
      </span>
      <span className="mt-2 block text-sm leading-6 text-[var(--hp-text-secondary)]">
        {story.brand} editors picked this story for discussion.
      </span>
      <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
        <MessageCircle className="size-4" aria-hidden />
        {replies} replies
      </span>
    </Link>
  );
}

export function ContentReaderContextRail({
  currentStory,
  stories,
  onOpenStory,
}: ContentReaderContextRailProps) {
  const recommendations = getLifestyleContextStories(currentStory, stories);

  return (
    <aside
      className="hidden xl:block"
      aria-label="Contextual story recommendations"
    >
      <div className="sticky top-32 max-h-[calc(100dvh-10rem)] space-y-4 overflow-y-auto overscroll-contain pb-12 pr-1">
        {recommendations.sharedIntent.length > 0 ? (
          <TrendingStoryRail
            stories={recommendations.sharedIntent.slice(0, 3)}
            onOpenStory={(story) => onOpenStory(story.id)}
            title="Trending"
          />
        ) : null}
        {isHostPickedStory(currentStory, stories) ? (
          <ReaderConversationLink story={currentStory} />
        ) : null}
        <ReaderCommunityModule
          brand={currentStory.brand}
          brandSlug={currentStory.brandSlug}
        />
      </div>
    </aside>
  );
}
