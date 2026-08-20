"use client";

import Link from "next/link";
import React from "react";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import {
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

  return (
    <section className="rounded-[8px] border border-[#e8c9db] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
      <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[#8d3566]">
        Join groups
      </p>
      <p className="mt-2 text-xs leading-5 text-[var(--hp-text-secondary)]">
        {contextualBrand
          ? `Join the ${contextualBrand} group to tune your feed, then open the group when you want the full discussion.`
          : "Pick the brand groups you want in your feed, then open the group when you want the full discussion."}
      </p>
      <div className="mt-4 space-y-2">
        {groups.map((group) => {
          const joined = joinedBrandNames.includes(group.brand);
          return (
            <div
              key={`${group.brandSlug}-${group.groupSlug}`}
              className="flex min-h-11 min-w-0 items-center justify-between gap-3 rounded-[8px] border border-[#e8c9db] bg-[#fbf6f8] px-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-2">
                <BrandSourceIcon
                  brand={group.brand}
                  brandSlug={group.brandSlug}
                  className="h-5 w-5 rounded-[4px]"
                />
                <span className="min-w-0 truncate text-sm">{group.brand}</span>
              </span>
              <button
                type="button"
                onClick={() => toggleMembership(group.brand)}
                aria-pressed={joined}
                className="shrink-0 text-xs font-bold text-[#8d3566] transition-colors hover:text-[var(--hp-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
              >
                {joined ? "Joined" : "Join"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--hp-text-secondary)]">
        {contextualBrand
          ? `Join the ${contextualBrand} group to open its discussions.`
          : "Join a brand group to tune your feed and open its discussions."}
      </p>
      <Link
        href={browseHref}
        className="mt-3 flex min-h-9 w-full items-center justify-center rounded-[4px] border border-[#e8c9db] px-3 text-xs font-bold text-[var(--hp-text-primary)] transition-colors hover:border-[#8d3566] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
      >
        Browse groups
      </Link>
    </section>
  );
}
