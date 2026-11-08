"use client";

import Image from "next/image";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { getHearstBrandSection, getHearstDestinationCategoryRoute } from "@/lib/hearst-routes";
import { buttonVariants, capAlignButtonLabel } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  /**
   * `reader` (default): desktop-only sticky 300 × 600 unit beside an article.
   * `rail`: the same unit in an index-page right rail. It shows at every
   * width, leaves stickiness to the rail column, and is 600px tall from the
   * large breakpoint, hugging its content when the rail stacks on phones.
   */
  layout?: "reader" | "rail";
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

export function getAdTopicHref(topic: string) {
  const target = adTopicRoutes[topic.trim().toLowerCase()];
  return target ? getHearstDestinationCategoryRoute(target.mode, target.label) : undefined;
}

const contextualAdArtworkByCampaign: Record<string, string> = {
  "lifestyle-home-refresh": "/images/ads/contextual/home.jpg",
  "lifestyle-dinner-planner": "/images/ads/contextual/food.jpg",
  "lifestyle-sleep-reset": "/images/ads/contextual/wellness.jpg",
  "lifestyle-beauty-counter": "/images/ads/contextual/beauty.jpg",
  "lifestyle-garden-weekend": "/images/ads/contextual/garden.jpg",
  "lifestyle-hosting-kit": "/images/ads/contextual/home.jpg",
  "lifestyle-small-space": "/images/ads/contextual/home.jpg",
  "lifestyle-teen-style": "/images/ads/contextual/fashion.jpg",
  "lifestyle-family-meal-kit": "/images/ads/contextual/food.jpg",
  "lifestyle-cozy-collection": "/images/ads/contextual/food.jpg",
  "autos-cd-deal-score": "/images/ads/contextual/automotive.jpg",
  "autos-ev-home-charge": "/images/ads/contextual/automotive.jpg",
  "autos-tire-finder": "/images/ads/contextual/automotive.jpg",
  "autos-auction-alert": "/images/ads/contextual/automotive.jpg",
  "autos-tool-chest": "/images/ads/contextual/technology.jpg",
  "autos-insurance": "/images/ads/contextual/automotive.jpg",
  "autos-racing-weekend": "/images/ads/contextual/automotive.jpg",
  "autos-detail-kit": "/images/ads/contextual/automotive.jpg",
  "autos-finance": "/images/ads/contextual/automotive.jpg",
  "autos-truck-cargo": "/images/ads/contextual/automotive.jpg",
  "autos-performance-parts": "/images/ads/contextual/technology.jpg",
  "flux-designer-sale": "/images/ads/contextual/fashion.jpg",
  "flux-beauty-wardrobe": "/images/ads/contextual/beauty.jpg",
  "flux-art-weekend": "/images/ads/contextual/travel.jpg",
  "flux-interior-materials": "/images/ads/contextual/home.jpg",
  "flux-travel-club": "/images/ads/contextual/travel.jpg",
  "flux-watch-jewelry": "/images/ads/contextual/objects.jpg",
  "flux-mens-style": "/images/ads/contextual/fashion.jpg",
  "flux-garden-party": "/images/ads/contextual/garden.jpg",
  "flux-red-carpet": "/images/ads/contextual/fashion.jpg",
  "flux-design-consult": "/images/ads/contextual/home.jpg",
  "ew-running-shoe": "/images/ads/contextual/outdoor.jpg",
  "ew-home-gym": "/images/ads/contextual/fitness.jpg",
  "ew-bike-fit": "/images/ads/contextual/outdoor.jpg",
  "ew-recovery-kit": "/images/ads/contextual/wellness.jpg",
  "ew-tech-kit": "/images/ads/contextual/technology.jpg",
  "ew-nutrition-plan": "/images/ads/contextual/food.jpg",
  "ew-adventure-pack": "/images/ads/contextual/outdoor.jpg",
  "ew-health-check": "/images/ads/contextual/wellness.jpg",
  "ew-smartwatch": "/images/ads/contextual/technology.jpg",
  "ew-book-club": "/images/ads/contextual/wellness.jpg",
  "local-news-community-partner": "/images/hearst-local-news-community-ad.png",
};

export function getContextualAdvertisementImage(ad: Pick<ContextualAdUnit, "id">) {
  if (ad.id.startsWith("autos-shop-")) {
    return contextualAdArtworkByCampaign["autos-cd-deal-score"];
  }
  return contextualAdArtworkByCampaign[ad.id] ?? "/images/ads/contextual/home.jpg";
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
  layout = "reader",
}: ContentReaderAdvertisementProps) {
  if (!ad) return null;
  const isRail = layout === "rail";

  return (
    <aside
      className={isRail ? "mx-auto w-full max-w-[300px] min-w-0" : "hidden lg:block"}
      aria-label={`Advertisement: ${ad.sponsor} — ${ad.title}`}
      data-ad-format={isRail ? "rail-contextual" : "reader-contextual"}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-[8px] border border-border bg-background",
          isRail
            ? "w-full lg:h-[600px]"
            : "sticky top-32 h-[600px] max-h-[calc(100dvh-10rem)] w-[300px]",
        )}
        style={{
          backgroundColor: ad.palette.background,
          color: ad.palette.foreground,
        }}
      >
        <div className="relative h-[268px] overflow-hidden border-b border-black/10">
          <Image
            src={getContextualAdvertisementImage(ad)}
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
            <span className="type-k1">
              Advertisement
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="font-brand-secondary text-3xl font-bold leading-none text-white">
              {ad.title}
            </p>
          </div>
        </div>

        <div className={cn("flex flex-1 flex-col justify-between p-6", isRail && "gap-6")}>
          <div>
            <p
              className="text-sm leading-5"
              style={{ color: ad.palette.foreground }}
            >
              {ad.summary}
            </p>
          </div>

          <div className="space-y-3">
            {/* CTA: HDS primary button (touch size) rendered as a link; sponsor colors stay on the creative. */}
            {ad.ctaHref ? (
              <a
                href={ad.ctaHref}
                rel="sponsored"
                aria-label={`${ad.cta}: ${ad.title}`}
                data-slot="button"
                data-variant="default"
                data-size="touch"
                className={buttonVariants({ variant: "default", size: "touch", className: "w-full" })}
              >
                {capAlignButtonLabel(ad.cta)}
              </a>
            ) : null}
            <p
              className="text-center type-k1"
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
