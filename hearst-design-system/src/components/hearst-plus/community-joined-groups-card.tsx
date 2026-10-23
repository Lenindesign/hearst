"use client";

import Link from "next/link";
import React from "react";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { UsersThree } from "@/components/ui/icons";
import {
  communityParticipationThreads,
  getCommunityGroupHref,
  joinedBrandGroupsChangeEvent,
  joinedBrandGroupsStorageKey,
} from "@/lib/community-groups";

export type CommunityJoinedGroupItem = {
  brand: string;
  brandSlug: string;
  groupSlug: string;
  name: string;
  members: string;
};

type CommunityJoinedGroupsCardProps = {
  groups: CommunityJoinedGroupItem[];
};

const emptyJoinedGroups: string[] = [];

function readJoinedGroups() {
  if (typeof window === "undefined") return emptyJoinedGroups;
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(joinedBrandGroupsStorageKey) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : emptyJoinedGroups;
  } catch {
    return emptyJoinedGroups;
  }
}

function writeJoinedGroups(next: string[]) {
  try {
    window.localStorage.setItem(
      joinedBrandGroupsStorageKey,
      JSON.stringify([...new Set(next)]),
    );
    window.dispatchEvent(new Event(joinedBrandGroupsChangeEvent));
  } catch {
    // Local-only membership is optional; the browse link remains usable.
  }
}

export function CommunityJoinedGroupsCard({
  groups,
}: CommunityJoinedGroupsCardProps) {
  const [joinedBrandNames, setJoinedBrandNames] =
    React.useState(emptyJoinedGroups);

  React.useEffect(() => {
    const updateJoinedGroups = () => setJoinedBrandNames(readJoinedGroups());
    updateJoinedGroups();
    window.addEventListener("storage", updateJoinedGroups);
    window.addEventListener(joinedBrandGroupsChangeEvent, updateJoinedGroups);
    return () => {
      window.removeEventListener("storage", updateJoinedGroups);
      window.removeEventListener(joinedBrandGroupsChangeEvent, updateJoinedGroups);
    };
  }, []);

  const contextualBrand = groups.length === 1 ? groups[0].brand : undefined;
  const browseHref = contextualBrand
    ? `/communities/${groups[0].brandSlug}/`
    : "/communities/";
  const toggleMembership = (brand: string) => {
    const next = joinedBrandNames.includes(brand)
      ? joinedBrandNames.filter((item) => item !== brand)
      : [...joinedBrandNames, brand];
    setJoinedBrandNames(next);
    writeJoinedGroups(next);
  };

  const joinedGroups = groups.filter((group) =>
    joinedBrandNames.includes(group.brand),
  );
  return (
    <section className="rounded-[8px] border border-border bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex min-w-0 items-center gap-1.5 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
            <UsersThree className="h-4 w-4 shrink-0" aria-hidden />
            Explore Communities
          </h2>
          <Link
            href={browseHref}
            className="shrink-0 text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          >
            All
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {groups.length > 0 ? groups.map((group) => {
            const joined = joinedBrandNames.includes(group.brand);
            return (
            <div
              key={`${group.brandSlug}-${group.groupSlug}`}
              className="flex min-h-11 min-w-0 items-center justify-between gap-3 border-b border-border/70 py-2 last:border-0"
            >
              <span className="flex min-w-0 items-center gap-2">
                <BrandSourceIcon
                  brand={group.brand}
                  brandSlug={group.brandSlug}
                  className="h-5 w-5 rounded-[4px]"
                />
                <Link
                  href={getCommunityGroupHref(group)}
                  className="min-w-0 line-clamp-4 text-[12px] font-bold leading-[1.35] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                >
                  {group.name}
                </Link>
              </span>
              <button
                type="button"
                onClick={() => toggleMembership(group.brand)}
                aria-pressed={joined}
                className="shrink-0 px-2 py-1 text-xs font-bold text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
              >
                {joined ? "Joined" : "Join"}
              </button>
            </div>
          );
          }) : (
            <p className="rounded-md bg-muted/50 px-3 py-3 text-sm leading-5 text-[var(--hp-text-secondary)]">
              {contextualBrand
                ? `You’re part of the ${contextualBrand} community.`
                : "You’ve joined all the communities shown here."}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <h2 className="flex items-center gap-1.5 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
          <UsersThree className="h-4 w-4 shrink-0" aria-hidden />
          My Communities
        </h2>
        {joinedGroups.length > 0 ? (
          <div className="mt-3 space-y-3">
            {joinedGroups.map((group) => {
              const conversation = communityParticipationThreads.find(
                (thread) => thread.brandSlug === group.brandSlug,
              );
              return (
                <div
                  key={`${group.brandSlug}-${group.groupSlug}`}
                  className="min-w-0 border-t border-border pt-3 first:border-0 first:pt-0"
                >
                  <Link
                    href={getCommunityGroupHref(group)}
                    className="flex min-w-0 items-center gap-2 text-sm font-semibold hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                  >
                    <BrandSourceIcon
                      brand={group.brand}
                      brandSlug={group.brandSlug}
                      className="h-5 w-5 rounded-[4px]"
                    />
                    <span className="truncate">{group.name}</span>
                  </Link>
                  {conversation ? (
                    <Link
                      href={`/communities/${conversation.brandSlug}/threads/${conversation.id}/`}
                      className="mt-2 block px-2 py-2 text-xs leading-5 text-[var(--hp-text-secondary)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    >
                      <span className="font-normal">
                        Conversation
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[12px] font-bold leading-[1.35] text-[var(--hp-text-primary)]">
                        {conversation.title}
                      </span>
                      <span className="mt-1 block text-[length:var(--text-token-4xs)]">
                        {conversation.replies} replies · Open discussion
                      </span>
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-md bg-muted/50 px-3 py-3 text-sm leading-5 text-[var(--hp-text-secondary)]">
            Join a community to see its conversations here.
          </p>
        )}
      </div>
    </section>
  );
}
