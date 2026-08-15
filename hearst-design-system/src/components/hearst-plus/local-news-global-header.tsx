"use client";

import { MainNav } from "@/components/home-page";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";

const localNewsNavLinks = [
  "For You",
  "Fitness",
  "Wellness",
  "Gear",
  "Tech",
  "Adventure",
  "Nutrition",
  "Life",
  "Videos",
];

export function LocalNewsGlobalHeader() {
  return (
    <>
      <UtilityBar activeDestinationOverride="Local News" />
      <MainNav
        brandSlug="hearst-local-news"
        activeFilter="For You"
        navLinksOverride={localNewsNavLinks}
      />
    </>
  );
}
