"use client";

import Image from "next/image";
import Link from "next/link";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstBrandSection, getHearstDestinationCategoryRoute } from "@/lib/hearst-routes";

export type ReaderAdvertisementDestination =
  | "lifestyle"
  | "autos"
  | "flux"
  | "ew";

export type ContextualAdUnit = {
  id: string;
  sponsor: string;
  title: string;
  summary: string;
  cta: string;
  ctaHref?: string;
  topics: string[];
  tags: string[];
  creativeLabel: string;
  imageUrl: string;
  palette: {
    background: string;
    foreground: string;
    accent: string;
    soft: string;
  };
};

export type ContentReaderAdvertisementProps = {
  ad?: ContextualAdUnit | null;
  currentTopic: string;
};

const adTopicRoutes: Record<string, { mode: "lifestyle" | "autos" | "flux" | "ew"; label: string }> = {
  beauty: { mode: "flux", label: "Beauty" },
  style: { mode: "flux", label: "Style" },
  culture: { mode: "flux", label: "Culture" },
  events: { mode: "flux", label: "Events" },
  travel: { mode: "flux", label: "Travel" },
  shopping: { mode: "flux", label: "Shopping" },
  food: { mode: "lifestyle", label: "Food" },
  "food drinks": { mode: "lifestyle", label: "Food" },
  "food news": { mode: "lifestyle", label: "Food" },
  home: { mode: "lifestyle", label: "Home" },
  family: { mode: "lifestyle", label: "Family" },
  entertainment: { mode: "lifestyle", label: "Entertainment" },
  design: { mode: "flux", label: "Design" },
  wellness: { mode: "ew", label: "Wellness" },
  fitness: { mode: "ew", label: "Fitness" },
  gear: { mode: "ew", label: "Gear" },
  tech: { mode: "ew", label: "Tech" },
  adventure: { mode: "ew", label: "Adventure" },
  nutrition: { mode: "ew", label: "Nutrition" },
  life: { mode: "ew", label: "Life" },
  cars: { mode: "autos", label: "Reviews" },
  reviews: { mode: "autos", label: "Reviews" },
  "research cars": { mode: "autos", label: "Research Cars" },
  evs: { mode: "autos", label: "EVs" },
};

function getAdTopicHref(topic: string) {
  const target = adTopicRoutes[topic.trim().toLowerCase()];
  return target ? getHearstDestinationCategoryRoute(target.mode, target.label) : undefined;
}

export function getContextualAdvertisementImage(ad: ContextualAdUnit) {
  // Keep paid/demo creative separate from editorial story imagery. Replacing an
  // ad image with a nearby story image can make the sponsor and creative feel
  // unrelated, especially on section index pages.
  return ad.imageUrl;
}

export function selectContentReaderAdvertisement(
  currentStory: LifestyleRiverStory,
  adsByDestination: Record<ReaderAdvertisementDestination, ContextualAdUnit[]>,
  slotIndex = 0,
) {
  const destination = getHearstBrandSection(currentStory.brandSlug);
  const eligibleAds = adsByDestination[destination];
  if (eligibleAds.length === 0) return null;

  const rankedAds = eligibleAds
    .map((ad) => {
      const topicScore = ad.topics.includes(currentStory.topic) ? 40 : 0;
      const tagScore =
        ad.tags.filter((tag) => currentStory.tags.includes(tag)).length * 18;
      const brandKeyword =
        currentStory.brand.toLowerCase().split(" ")[0] ?? "";
      const brandSignalScore =
        brandKeyword &&
        ad.sponsor.toLowerCase().includes(brandKeyword)
          ? 28
          : 0;

      return {
        ad,
        score: topicScore + tagScore + brandSignalScore,
      };
    })
    .sort((first, second) =>
      second.score - first.score || first.ad.id.localeCompare(second.ad.id)
    );

  const selectedAd = rankedAds[slotIndex % rankedAds.length]?.ad ?? rankedAds[0]?.ad ?? null;
  return selectedAd;
}

export function ContentReaderAdvertisement({
  ad,
  currentTopic,
}: ContentReaderAdvertisementProps) {
  if (!ad) return null;

  return (
    <aside
      className="hidden lg:block"
      aria-label={`Advertisement: ${ad.sponsor} — ${ad.title}`}
    >
      <div
        className="sticky top-32 flex h-[600px] max-h-[calc(100dvh-10rem)] w-[300px] flex-col overflow-hidden rounded-[8px] border border-border bg-background"
        style={{
          backgroundColor: ad.palette.background,
          color: ad.palette.foreground,
        }}
      >
        <div className="relative h-[268px] overflow-hidden border-b border-black/10">
          <Image
            src={ad.imageUrl}
            alt=""
            width={600}
            height={536}
            sizes="300px"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/5 to-black/45"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-0 flex items-center p-5 text-white">
            <span className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-[0.24em]">
              Advertisement
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">
              {ad.sponsor}
            </p>
            <p className="mt-1 font-brand-secondary text-3xl font-bold leading-none text-white">
              {ad.title}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <p
              className="text-sm leading-6"
              style={{ color: ad.palette.foreground }}
            >
              {ad.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {ad.topics.slice(0, 2).map((topic) => (
                (() => {
                  const href = getAdTopicHref(topic);
                  const className = "rounded-full border px-2.5 py-1 text-xs font-semibold";
                  const style = {
                    borderColor: ad.palette.soft,
                    backgroundColor: ad.palette.soft,
                    color: ad.palette.foreground,
                  };
                  return href ? (
                    <Link
                      key={topic}
                      href={href}
                      className={`${className} cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                      style={style}
                    >
                      {topic}
                    </Link>
                  ) : (
                    <span key={topic} className={className} style={style}>
                      {topic}
                    </span>
                  );
                })()
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {ad.ctaHref ? (
              <a
                href={ad.ctaHref}
                aria-label={`${ad.cta}: ${ad.title}`}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 py-3 text-center text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:translate-y-0"
                style={{ backgroundColor: ad.palette.accent, color: "#fff" }}
              >
                {ad.cta}
              </a>
            ) : null}
            <p
              className="text-center text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest"
              style={{ color: ad.palette.foreground }}
            >
              Matched to {currentTopic} intent
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
