"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MainNav } from "@/components/home-page";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { getHearstNewspaperPublicationById, hearstNewspaperPublications } from "@/lib/hearst-newspaper-feed-framework";
import { getHearstTVStationById, hearstTVStations } from "@/lib/hearst-tv-feed-framework";

const allStationsLabel = "All stations";
const allNewspapersLabel = "All newspapers";

function getStationNavLabel(station: (typeof hearstTVStations)[number]) {
  return `${station.callSign} · ${station.market}`;
}

function getNewspaperNavLabel(publication: (typeof hearstNewspaperPublications)[number]) {
  return `${publication.publicationName} · ${publication.market}`;
}

const localNewsStationNavLinks = [
  allStationsLabel,
  ...hearstTVStations.map(getStationNavLabel),
];

const localNewsNewspaperNavLinks = [
  allNewspapersLabel,
  ...hearstNewspaperPublications.map(getNewspaperNavLabel),
];

const localNewsStationNavHrefs: Partial<Record<string, string>> = {
  [allStationsLabel]: "/hearst-plus/local-news/#tv-stations",
  ...Object.fromEntries(
    hearstTVStations.map((station) => [
      getStationNavLabel(station),
      `/hearst-plus/local-news/?station=${encodeURIComponent(station.id)}#tv-stations`,
    ]),
  ),
};

const localNewsNewspaperNavHrefs: Partial<Record<string, string>> = {
  [allNewspapersLabel]: "/hearst-plus/local-news/newspapers/#newspapers",
  ...Object.fromEntries(
    hearstNewspaperPublications.map((publication) => [
      getNewspaperNavLabel(publication),
      `/hearst-plus/local-news/newspapers/?publication=${encodeURIComponent(publication.id)}#newspapers`,
    ]),
  ),
};

export function LocalNewsGlobalHeader() {
  return (
    <Suspense fallback={<LocalNewsGlobalHeaderContent mastheadLogoOverride={null} />}>
      <LocalNewsGlobalHeaderWithRouteLogo />
    </Suspense>
  );
}

function LocalNewsGlobalHeaderWithRouteLogo() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNewspaperPage = pathname.includes("/local-news/newspapers");
  const publication = getHearstNewspaperPublicationById(searchParams.get("publication") ?? "");
  const station = getHearstTVStationById(searchParams.get("station") ?? "");
  const mastheadLogoOverride = isNewspaperPage
    ? publication?.mastheadLogo
      ? { src: publication.mastheadLogo, label: publication.publicationName }
      : null
    : station?.logo
      ? { src: station.logo, label: station.stationName, surface: "station" as const }
      : null;

  return (
    <LocalNewsGlobalHeaderContent
      activeLabel={
        isNewspaperPage
          ? publication ? getNewspaperNavLabel(publication) : allNewspapersLabel
          : station ? getStationNavLabel(station) : allStationsLabel
      }
      mastheadLogoOverride={mastheadLogoOverride}
      navLinkHrefOverrides={isNewspaperPage ? localNewsNewspaperNavHrefs : localNewsStationNavHrefs}
      navLinksOverride={isNewspaperPage ? localNewsNewspaperNavLinks : localNewsStationNavLinks}
    />
  );
}

function LocalNewsGlobalHeaderContent({
  activeLabel = allStationsLabel,
  mastheadLogoOverride,
  navLinkHrefOverrides = localNewsStationNavHrefs,
  navLinksOverride = localNewsStationNavLinks,
}: {
  activeLabel?: string;
  mastheadLogoOverride: { src: string; label: string; surface?: "default" | "station" } | null;
  navLinkHrefOverrides?: Partial<Record<string, string>>;
  navLinksOverride?: string[];
}) {
  return (
    <>
      <UtilityBar activeDestinationOverride="Local News" />
      <MainNav
        brandSlug="hearst-local-news"
        activeFilter={activeLabel}
        navLinksOverride={navLinksOverride}
        navLinkHrefOverrides={navLinkHrefOverrides}
        navCarouselMode="compact"
        mastheadLogoOverride={mastheadLogoOverride}
      />
    </>
  );
}
