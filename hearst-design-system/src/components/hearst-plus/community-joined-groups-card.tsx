"use client";

import Link from "next/link";
import React from "react";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import {
  getCommunityGroupHref,
  joinedBrandGroupsChangeEvent,
  joinedBrandGroupsStorageKey,
} from "@/lib/community-groups";

type JoinedGroupItem = {
  brand: string;
  brandSlug: string;
  groupSlug: string;
  name: string;
  members: string;
};

type CommunityJoinedGroupsCardProps = {
  groups: JoinedGroupItem[];
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

  const joinedGroups = groups.filter((group) =>
    joinedBrandNames.includes(group.brand),
  );

  return (
    <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="hearst-community-display text-xl font-bold leading-tight">
          Your groups
        </h2>
        <span className="rounded-[8px] bg-[var(--community-surface-soft)] px-2.5 py-1 text-xs font-bold text-primary">
          {joinedGroups.length > 0 ? `${joinedGroups.length} joined` : "Not joined"}
        </span>
      </div>
      {joinedGroups.length > 0 ? (
        <div className="mt-4 space-y-2">
          {joinedGroups.map((group) => (
            <Link
              key={`joined-${group.brandSlug}-${group.groupSlug}`}
              href={getCommunityGroupHref(group)}
              aria-label={`Open ${group.name} group`}
              className="flex min-h-12 items-center gap-3 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] px-3 py-2 transition-colors hover:border-primary/45 hover:bg-[var(--community-surface-soft-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            >
              <BrandSourceIcon
                brand={group.brand}
                brandSlug={group.brandSlug}
                className="h-8 w-8 rounded-[8px]"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-[var(--hp-text-primary)]">
                  {group.name}
                </span>
                <span className="block text-xs font-semibold text-[var(--hp-text-secondary)]">
                  {group.members}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="hearst-community-copy mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">
          Join brand groups from Hearst+ or a brand page, then open them here.
        </p>
      )}
    </section>
  );
}
