"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Play } from "@/components/ui/icons";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { CommunityHomeRiverCard } from "@/components/hearst-plus/community-home-river-card";
import { BrandLogo } from "@/components/brand-logo";
import type { BrandTheme } from "@/lib/brands";
import { getBrandLogoSrc } from "@/lib/logos";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { LifestyleRiverCard, RichPhotoGalleryCard } from "@/components/home-page";
import { getFullscreenReaderImages } from "@/components/hearst-plus/fullscreen-image-viewer";
import type { FullscreenReaderImage } from "@/components/hearst-plus/fullscreen-image-viewer";
import { loadLiveArticle } from "@/lib/live-article-client-cache";
import { BrandPromotionRiverModule } from "@/components/hearst-plus/brand-promotion-river-module";
import type { BrandPromotionMatch } from "@/components/hearst-plus/brand-promotion-model";
import { ContextualRiverAdvertisement } from "@/components/hearst-plus/contextual-river-advertisement";
import type { ContextualAdUnit } from "@/components/hearst-plus/content-reader-advertisement";
import { DelishVerticalVideoCarousel } from "@/components/hearst-plus/vertical-video-carousel";
import { EventTile } from "@/components/hearst-plus/events/hearst-events-experience";
import type { HearstEventRecord } from "@/lib/hearst-events";
import { getHearstAutoResearchCarRating } from "@/lib/hearst-auto-research-cars";
import { useEffect, useMemo, useState } from "react";
import {
  applyOnboardingPreferences,
  baseDestinationConfigs,
  getLifestyleRecommendationReason,
  rankLifestyleRiver,
} from "@/lib/hearst-personalization-model";


export function HearstPlusBrandDirectory({ brands }: { brands: BrandTheme[] }) {
  return (
    <details className="group min-w-0 border-y border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-[var(--hp-font-headline)] text-xl font-bold">Explore the Hearst magazine identities</span>
          <span className="mt-2 block text-base leading-6 text-muted-foreground">Expand to see each registered logo, color palette, headline type, and body type.</span>
        </span>
        <span className="flex shrink-0 items-center gap-3 text-base font-semibold text-primary">
          <span>{brands.length} brands</span>
          <svg aria-hidden="true" className="h-5 w-5 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="none">
            <path d="m4 7 6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </summary>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => {
          const headlineColor = brand.semanticColors["palette-content-brand"] || brand.colors["1"];
          const primaryColor = brand.colors["1"];
          const secondaryColor = brand.colors["2"];
          const hasLogo = Boolean(getBrandLogoSrc(brand.slug));

          return (
            <article key={brand.slug} className="min-w-0 bg-background p-6 md:p-7">
              <div className="flex min-h-12 items-center">
                {hasLogo ? (
                  <BrandLogo slug={brand.slug} className="block h-9 w-44 [&_svg]:h-full [&_svg]:w-auto" color={headlineColor} />
                ) : (
                  <span className="font-[var(--hp-font-headline)] text-xl font-bold" style={{ color: headlineColor }}>{brand.name}</span>
                )}
              </div>
              {!hasLogo ? <p className="mt-2 text-xs text-muted-foreground">Wordmark not registered</p> : null}
              <p className="mt-5 text-xl font-bold leading-tight" style={{ color: headlineColor, fontFamily: `"${brand.fontHeadline}", Georgia, serif`, fontWeight: brand.fontHeadlineWeight }}>Brand voice sample</p>
              <p className="mt-3 text-base leading-6 text-muted-foreground" style={{ fontFamily: `"${brand.fontDefault}", Inter, sans-serif` }}>Body type sample for {brand.name}.</p>
              <div className="mt-5 grid grid-cols-2 gap-3" aria-label={`${brand.name} palette samples`}>
                {[primaryColor, secondaryColor].map((color, index) => (
                  <div key={`${brand.slug}-${index}`}>
                    <span className="block h-8 border border-border" style={{ backgroundColor: color }} />
                    <span className="mt-2 block font-mono text-xs text-muted-foreground">{color}</span>
                  </div>
                ))}
              </div>
              <dl className="mt-5 grid gap-3 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                <div><dt className="font-bold text-foreground">Headline</dt><dd>{brand.fontHeadline}</dd></div>
                <div><dt className="font-bold text-foreground">Body</dt><dd>{brand.fontDefault}</dd></div>
              </dl>
            </article>
          );
        })}
      </div>
    </details>
  );
}

function RiverStorySample({ story }: { story: LifestyleRiverStory }) {
  const router = useRouter();
  const openStory = () => router.push(`/read/${encodeURIComponent(story.id)}/?from=%2Fhearst-plus-brief%2F`);

  return <LifestyleRiverCard story={story} onOpen={openStory} />;
}

function PhotoGalleryStorySample({ story }: { story: LifestyleRiverStory }) {
  const router = useRouter();
  const [images, setImages] = useState<FullscreenReaderImage[]>(() => getFullscreenReaderImages(story));

  useEffect(() => {
    if (!story.sourceUrl) return;
    let active = true;
    void loadLiveArticle(story.sourceUrl)
      .then((article) => {
        if (active) setImages(getFullscreenReaderImages(story, { status: "ready", data: article }));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [story]);

  return (
    <RichPhotoGalleryCard
      story={story}
      images={images}
      onOpen={() => router.push(`/read/${encodeURIComponent(story.id)}/?from=%2Fhearst-plus-brief%2F`)}
    />
  );
}

function SampleFigure({
  label,
  headline,
  description,
  note,
  headlineClassName = "text-[28px] sm:text-[38px]",
  children,
}: {
  label: string;
  headline: string;
  description: string;
  note: string;
  headlineClassName?: string;
  children: ReactNode;
}) {
  return (
    <figure className="grid min-w-0 gap-8 border-b border-border pb-10 sm:grid-cols-[1.08fr_.92fr] sm:items-center">
      <div className="min-w-0">{children}</div>
      <figcaption className="min-w-0 sm:px-2">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{label}</p>
        <h3 className={`mt-3 font-[var(--hp-font-headline)] font-bold leading-tight tracking-[-.02em] ${headlineClassName}`}>{headline}</h3>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">{note}</p>
      </figcaption>
    </figure>
  );
}

type MightyCardFormat =
  | "article"
  | "video"
  | "gallery"
  | "vehicle"
  | "event"
  | "community"
  | "shorts"
  | "shopping"
  | "spotlight"
  | "advertisement";

const MIGHTY_CARD_FORMATS: { id: MightyCardFormat; label: string }[] = [
  { id: "article", label: "Article" },
  { id: "video", label: "Video" },
  { id: "gallery", label: "Photo gallery" },
  { id: "vehicle", label: "Make & model" },
  { id: "event", label: "Event" },
  { id: "community", label: "Community" },
  { id: "shorts", label: "Shorts" },
  { id: "shopping", label: "Shopping" },
  { id: "spotlight", label: "Brand spotlight" },
  { id: "advertisement", label: "Advertisement" },
];

const MIGHTY_CARD_ELEMENTS = [
  { id: "media", label: "Media" },
  { id: "identity", label: "Brand and category" },
  { id: "summary", label: "Summary" },
  { id: "byline", label: "Byline and details" },
  { id: "next-step", label: "Primary link or action" },
] as const;

type MightyCardElement = (typeof MIGHTY_CARD_ELEMENTS)[number]["id"];

function MightyCardWorkbench({
  articleStory,
  galleryStory,
  shoppingStory,
  shortsStories,
  brandSpotlight,
  videoStory,
  communityThread,
  vehicleStory,
  eventSample,
  sponsoredSample,
  brands,
  brandStorySamples,
}: {
  articleStory: LifestyleRiverStory;
  galleryStory?: LifestyleRiverStory;
  shoppingStory?: LifestyleRiverStory;
  shortsStories: LifestyleRiverStory[];
  brandSpotlight: BrandPromotionMatch | null;
  videoStory?: LifestyleRiverStory;
  communityThread: CommunityFeedThread;
  vehicleStory?: LifestyleRiverStory;
  eventSample?: HearstEventRecord;
  sponsoredSample: ContextualAdUnit;
  brands: BrandTheme[];
  brandStorySamples: LifestyleRiverStory[];
}) {
  const [format, setFormat] = useState<MightyCardFormat>("article");
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("cosmopolitan");
  const [visibleElements, setVisibleElements] = useState<MightyCardElement[]>([
    "media",
    "identity",
    "summary",
    "byline",
    "next-step",
  ]);
  const [layout, setLayout] = useState<"feature" | "horizontal" | "text-only">("feature");
  const story = articleStory;
  const selectedBrand = brands.find((brand) => brand.slug === selectedBrandSlug) ?? brands[0];
  const brandStory = brandStorySamples.find((candidate) => candidate.brandSlug === selectedBrand?.slug) ?? story;
  const featureStory = videoStory ?? shortsStories[0] ?? articleStory;
  const selectedGallery = galleryStory ?? articleStory;
  const selectedVehicle = vehicleStory ?? articleStory;
  const selectedSpotlightStory = brandSpotlight?.stories[0] ?? articleStory;
  const vehicleRating = getHearstAutoResearchCarRating(selectedVehicle.id);

  const cardContent = (() => {
    switch (format) {
      case "video":
        return {
          brand: featureStory.brand,
          category: `${featureStory.topic} · Video`,
          title: featureStory.title,
          summary: featureStory.summary,
          image: featureStory.image,
          byline: featureStory.byline ?? featureStory.brand,
          detail: featureStory.videoDuration ? `${Math.floor(featureStory.videoDuration / 60)}:${String(featureStory.videoDuration % 60).padStart(2, "0")}` : "Video",
          nextStep: "Watch video",
          contentKind: "video",
        };
      case "gallery":
        return {
          brand: selectedGallery.brand,
          category: `${selectedGallery.topic} · Photo gallery`,
          title: selectedGallery.title,
          summary: selectedGallery.summary,
          image: selectedGallery.image,
          byline: selectedGallery.byline ?? selectedGallery.brand,
          detail: "Photo gallery",
          nextStep: "Open gallery",
          contentKind: "gallery",
        };
      case "vehicle":
        return {
          brand: selectedVehicle.brand,
          category: "Research Cars · Vehicle overview",
          title: selectedVehicle.title,
          summary: selectedVehicle.summary,
          image: selectedVehicle.image,
          byline: selectedVehicle.byline ?? selectedVehicle.brand,
          detail: "Car and Driver source",
          nextStep: "View vehicle details",
          contentKind: "vehicle",
        };
      case "event":
        return {
          brand: eventSample?.brandNames.join(" + ") ?? "Hearst Events",
          category: eventSample?.eyebrow ?? "Event",
          title: eventSample?.heroHeadline ?? eventSample?.title ?? "Hearst event",
          summary: eventSample?.summary ?? "Event details, venue, and dates appear together.",
          image: eventSample?.image.src ?? story.image,
          byline: eventSample?.venue ?? "Event details",
          detail: eventSample?.dateLabel ?? "Date and venue",
          nextStep: eventSample?.primaryAction.label ?? "See event details",
          contentKind: "event",
        };
      case "community":
        return {
          brand: communityThread.brand,
          category: `${communityThread.meta} · ${communityThread.kindLabel}`,
          title: communityThread.title,
          summary: communityThread.body,
          image: communityThread.posterImage ?? story.image,
          byline: communityThread.author,
          detail: `${communityThread.replies} replies`,
          nextStep: "Join the conversation",
          contentKind: "community",
        };
      case "shorts": {
        const short = shortsStories[0] ?? featureStory;
        return {
          brand: short.brand,
          category: `${short.topic} · Shorts`,
          title: short.title,
          summary: short.summary,
          image: short.image,
          byline: short.byline ?? short.brand,
          detail: "Vertical video",
          nextStep: "Play short",
          contentKind: "shorts",
        };
      }
      case "shopping": {
        const shopping = shoppingStory ?? story;
        return {
          brand: shopping.brand,
          category: `${shopping.topic} · Shopping`,
          title: shopping.title,
          summary: shopping.summary,
          image: shopping.image,
          byline: shopping.byline ?? shopping.brand,
          detail: "Editors’ picks",
          nextStep: "Explore the edit",
          contentKind: "shopping",
        };
      }
      case "spotlight":
        return {
          brand: brandSpotlight?.brand ?? selectedSpotlightStory.brand,
          category: "Brand spotlight",
          title: selectedSpotlightStory.title,
          summary: selectedSpotlightStory.summary,
          image: selectedSpotlightStory.image,
          byline: selectedSpotlightStory.byline ?? selectedSpotlightStory.brand,
          detail: brandSpotlight?.topics.join(" · ") ?? selectedSpotlightStory.topic,
          nextStep: "Explore this brand",
          contentKind: "spotlight",
        };
      case "advertisement":
        return {
          brand: sponsoredSample.sponsor,
          category: "Sponsored placement",
          title: sponsoredSample.title,
          summary: sponsoredSample.summary,
          image: sponsoredSample.imageUrl,
          byline: "Advertisement",
          detail: "Sponsored",
          nextStep: sponsoredSample.cta,
          contentKind: "advertisement",
        };
      case "article":
      default:
        return {
          brand: brandStory.brand,
          category: brandStory.topic,
          title: brandStory.title,
          summary: brandStory.summary,
          image: brandStory.image,
          byline: brandStory.byline ?? brandStory.brand,
          detail: brandStory.readTime,
          nextStep: "Open story",
          contentKind: "article",
        };
    }
  })();

  const hasElement = (element: MightyCardElement) => visibleElements.includes(element);
  const toggleElement = (element: MightyCardElement) => {
    setVisibleElements((current) => current.includes(element)
      ? current.filter((candidate) => candidate !== element)
      : [...current, element]);
  };
  const isPortrait = format === "shorts";
  const isHorizontal = layout === "horizontal" && !isPortrait;
  const showImage = hasElement("media") && layout !== "text-only";
  const supportsCardAction = ["vehicle", "event", "community", "shopping", "spotlight", "advertisement"].includes(format);

  return (
    <section aria-label="Mighty Card workbench" className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="grid md:grid-cols-[minmax(230px,280px)_minmax(0,1fr)]">
        <aside aria-label="Mighty Card options" className="border-b border-border bg-muted/30 p-5 md:border-r md:border-b-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Card builder</p>
              <h4 className="mt-1 text-base font-semibold">Choose a format</h4>
            </div>
            <span className="font-mono text-xs text-muted-foreground">10 types</span>
          </div>

          <nav aria-label="Card formats" className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-1">
            {MIGHTY_CARD_FORMATS.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={format === option.id ? "secondary" : "ghost"}
                size="touch"
                aria-pressed={format === option.id}
                onClick={() => setFormat(option.id)}
                className={`w-full justify-start ${format === option.id ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
              >
                {option.label}
              </Button>
            ))}
          </nav>

          <fieldset className="mt-6 border-t border-border pt-4">
            <legend className="text-sm font-semibold">Card elements</legend>
            <div className="mt-3 space-y-3">
              {MIGHTY_CARD_ELEMENTS.map((element) => (
                <label key={element.id} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm">
                  <span>{element.label}</span>
                  <Switch
                    checked={hasElement(element.id)}
                    onCheckedChange={() => toggleElement(element.id)}
                    disabled={element.id === "next-step" && !supportsCardAction}
                    aria-label={`Show ${element.label.toLowerCase()}`}
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6 border-t border-border pt-4">
            <legend className="text-sm font-semibold">Media layout</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["feature", "horizontal", "text-only"] as const).map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={layout === option ? "outline" : "ghost"}
                  aria-pressed={layout === option}
                  onClick={() => setLayout(option)}
                  className={layout === option ? "border-primary text-primary" : ""}
                >
                  {option === "text-only" ? "Text only" : option === "feature" ? "Feature" : "Horizontal"}
                </Button>
              ))}
            </div>
            {isPortrait ? <p className="mt-2 text-xs leading-5 text-muted-foreground">Shorts keep their portrait card proportions. Text-only hides media for every format.</p> : null}
          </fieldset>
        </aside>

        <div className="min-w-0 p-5 md:p-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Live preview</p>
              <h4 className="mt-1 text-lg font-semibold">{MIGHTY_CARD_FORMATS.find((option) => option.id === format)?.label} card</h4>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-56">
              <label htmlFor="mighty-card-brand" className="text-xs font-semibold text-muted-foreground">Brand theme</label>
              <Select value={selectedBrandSlug} onValueChange={(value) => { if (value) setSelectedBrandSlug(value); }}>
                <SelectTrigger id="mighty-card-brand" className="h-10 min-h-10 w-full bg-background px-3 text-sm sm:min-w-56">
                  <SelectValue>{selectedBrand?.name ?? "Choose a brand"}</SelectValue>
                </SelectTrigger>
                <SelectContent align="end" className="max-h-[min(420px,var(--available-height))] rounded-lg border border-border bg-popover p-1 shadow-xl">
                  {brands.map((brand) => (
                    <SelectItem key={brand.slug} value={brand.slug} className="min-h-10 px-3 pr-9 text-sm font-medium">
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mb-5 text-xs text-muted-foreground">One shared card shell. The sample story and registered type and accent update with the selected brand when available.</p>

          <div className={`mx-auto w-full ${isPortrait ? "max-w-[310px]" : "max-w-[680px]"}`}>
            <Card className={`hp-shadow-card gap-0 overflow-hidden p-0 ${isHorizontal ? "sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""}`}>
              {showImage ? (
                <div className={`relative overflow-hidden bg-muted ${isPortrait ? "aspect-[9/16]" : isHorizontal ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
                  <Image
                    src={cardContent.image}
                    alt={format === "community" && communityThread.posterAlt ? communityThread.posterAlt : cardContent.title}
                    fill
                    sizes={isPortrait ? "310px" : "(min-width: 768px) 45vw, 100vw"}
                    className="object-cover"
                  />
                  {format === "video" || format === "shorts" ? (
                    <span className="absolute inset-0 grid place-items-center bg-foreground/10 text-background" aria-hidden="true">
                      <span className="grid size-12 place-items-center rounded-full bg-background/90 text-foreground shadow-sm"><Play className="size-5" weight="fill" /></span>
                    </span>
                  ) : null}
                  {format === "gallery" ? <span className="absolute bottom-3 right-3 rounded-md bg-foreground/85 px-2.5 py-1.5 text-xs font-semibold text-background">Photo gallery</span> : null}
                  {format === "advertisement" ? <span className="absolute left-3 top-3 rounded-sm bg-background/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">Advertisement</span> : null}
                </div>
              ) : null}

              <div className="min-w-0 p-5 sm:p-6">
                {hasElement("identity") ? (
                  <p className="text-xs font-bold uppercase tracking-[.12em]" style={{ color: selectedBrand?.colors["1"] }}>
                    {cardContent.brand}<span className="px-2 text-muted-foreground">·</span><span className="text-muted-foreground">{cardContent.category}</span>
                  </p>
                ) : null}
                {format === "vehicle" && vehicleRating ? (
                  <div className="mt-4 flex items-center justify-between gap-3 border-y border-border py-3 text-sm">
                    <span className="text-muted-foreground">Car and Driver rating</span>
                    <span className="font-bold">{vehicleRating}</span>
                  </div>
                ) : null}
                <h5 className={`mt-3 font-bold leading-tight text-balance text-foreground ${isPortrait ? "text-xl" : "text-2xl"}`} style={{ fontFamily: selectedBrand ? `"${selectedBrand.fontHeadline}", Inter, sans-serif` : undefined }}>
                  {cardContent.title}
                </h5>
                {hasElement("summary") ? <p className="mt-3 text-sm leading-6 text-muted-foreground" style={{ fontFamily: selectedBrand ? `"${selectedBrand.fontDefault}", Inter, sans-serif` : undefined }}>{cardContent.summary}</p> : null}
                {hasElement("byline") ? (
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                    <span>{cardContent.byline}</span>
                    <span>{cardContent.detail}</span>
                  </div>
                ) : null}
                {hasElement("next-step") && supportsCardAction ? (
                  <div className="mt-4 border-t border-border pt-4">
                    <span className="text-sm font-semibold text-primary">{cardContent.nextStep}<span aria-hidden="true"> →</span></span>
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandSpotlightSample({ promotion }: { promotion: BrandPromotionMatch | null }) {
  const router = useRouter();
  const samplePromotion = promotion
    ? {
        ...promotion,
        stories: promotion.stories.map((story) => ({
          ...story,
          title: story.title.replaceAll("—", ":"),
        })),
      }
    : promotion;

  return (
    <BrandPromotionRiverModule
      promotion={samplePromotion}
      onOpenStory={(storyId) => router.push(`/read/${encodeURIComponent(storyId)}/?from=%2Fhearst-plus-brief%2F`)}
    />
  );
}

export function HearstPlusTemplatePreviews({ articleStory }: { articleStory: LifestyleRiverStory }) {
  const templates = [
    {
      label: "Template 01 · Index / inventory",
      title: "A river across Hearst sources",
      href: "/hearst-plus/",
      frameTitle: "Scaled preview of the Hearst+ index and story river",
    },
    {
      label: "Template 02 · Detail",
      title: "A story in the shared reader",
      href: `/read/${encodeURIComponent(articleStory.id)}/?from=%2Fhearst-plus-brief%2F`,
      frameTitle: `Scaled preview of the Hearst+ detail page for ${articleStory.title}`,
    },
  ];

  return (
    <div className="mt-14 grid gap-14">
      {templates.map((template) => (
        <figure key={template.href} className="mx-auto w-full max-w-[780px] min-w-0 space-y-3">
          <figcaption>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{template.label}</p>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-[var(--hp-font-headline)] font-bold text-xl leading-tight md:text-[32px]">{template.title}</h3>
              <Link href={template.href} target="_blank" rel="noreferrer" className="text-base font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Open full page</Link>
            </div>
          </figcaption>
          <div className="relative aspect-[1.55] overflow-hidden border border-border bg-background">
            <iframe
              title={template.frameTitle}
              src={template.href}
              loading="lazy"
              className="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}

const personalizationTopics = ["Food", "Style", "Home", "Wellness", "Entertainment", "Shopping"];
const initialInterests = ["Food", "Style"];
const personalizationConfig = baseDestinationConfigs.lifestyle;
const personalizationDemoState = { daypart: "morning" as const, returnHours: 0, contentDay: "today" as const, isSimulated: false };
const previewProfile = {
  followedTopics: [],
  followedBrands: [],
  savedTags: [],
  boostedTags: [],
  savedIds: [],
  hiddenIds: [],
  personalizationMode: "onboarding" as const,
};

function PersonalizationRiverDemo({ stories }: { stories: LifestyleRiverStory[] }) {
  const [interests, setInterests] = useState(initialInterests);
  const profile = useMemo(
    () => applyOnboardingPreferences(previewProfile, stories, { interests, brands: [], tags: [] }),
    [interests, stories],
  );
  const rankedStories = useMemo(
    () => rankLifestyleRiver(stories, profile, personalizationDemoState, personalizationConfig).slice(0, 3),
    [profile, stories],
  );
  const toggleInterest = (interest: string) => {
    setInterests((current) => {
      if (current.includes(interest)) return current.length > 1 ? current.filter((item) => item !== interest) : current;
      return current.length < 2 ? [...current, interest] : [current[1], interest];
    });
  };

  const router = useRouter();

  return (
    <div className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[minmax(260px,.8fr)_minmax(0,1.2fr)] lg:items-start">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Personalization · interactive demo</p>
        <h3 id="river-demo-heading" className="mt-2 font-[var(--hp-font-headline)] font-bold text-xl leading-tight">Your interests reshape the river.</h3>
        <p className="mt-3 text-base leading-6 text-muted-foreground">Choose up to two interests. The preview re-ranks real stories using those choices, freshness, time of day, and source and topic variety.</p>
        <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Choose interests for the river preview">
          {personalizationTopics.map((topic) => {
            const selected = interests.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleInterest(topic)}
                className={`min-h-11 rounded-full border px-4 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selected ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:border-foreground"}`}
              >
                {topic}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground" aria-live="polite">Following {interests.join(" + ")} · preview only; this choice is not saved to a reader profile.</p>
      </div>

      <div className="min-w-0" role="region" aria-live="polite" aria-label="Personalized story river preview">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">River preview · ranked for {interests.join(" + ")}</p>
        <div className="grid min-w-0 gap-6">
          {rankedStories.map((story, index) => (
            <div key={story.id} className="min-w-0 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground"><span className="font-mono text-primary">0{index + 1}</span> · {getLifestyleRecommendationReason(story, profile, personalizationDemoState, personalizationConfig)}</p>
              <LifestyleRiverCard
                story={story}
                layoutOverride="list"
                onOpen={() => router.push(`/read/${encodeURIComponent(story.id)}/?from=%2Fhearst-plus-brief%2F`)}
              />
            </div>
          ))}
          {rankedStories.length === 0 ? <p className="text-base text-muted-foreground">No sample stories are available for this preview.</p> : null}
        </div>
      </div>
    </div>
  );
}

export function HearstPlusBriefSamples({
  articleStory,
  galleryStory,
  shoppingStory,
  shortsStories,
  brandSpotlight,
  videoStory,
  communityThread,
  vehicleStory,
  videoSourceCopy,
  riverDemoStories,
  eventSample,
  brands,
  brandStorySamples,
}: {
  articleStory: LifestyleRiverStory;
  galleryStory?: LifestyleRiverStory;
  shoppingStory?: LifestyleRiverStory;
  shortsStories: LifestyleRiverStory[];
  brandSpotlight: BrandPromotionMatch | null;
  videoStory?: LifestyleRiverStory;
  communityThread: CommunityFeedThread;
  vehicleStory?: LifestyleRiverStory;
  videoSourceCopy: string;
  riverDemoStories: LifestyleRiverStory[];
  eventSample?: HearstEventRecord;
  brands: BrandTheme[];
  brandStorySamples: LifestyleRiverStory[];
}) {
  const router = useRouter();
  const [showMightyCard, setShowMightyCard] = useState(false);
  const sponsoredSample: ContextualAdUnit = {
    id: "brief-sponsored-sample",
    sponsor: "Hearst Market",
    title: "A more useful kitchen, picked for you",
    summary: "A clearly labeled sponsored placement can sit alongside stories while preserving its own destination and disclosure.",
    cta: "Explore the edit",
    topics: ["Food", "Home", "Shopping"],
    tags: ["kitchen", "products", "shopping"],
    creativeLabel: "Kitchen",
    imageUrl: articleStory.image,
    palette: {
      background: "var(--card)",
      foreground: "var(--foreground)",
      accent: "var(--primary)",
      soft: "var(--secondary)",
    },
  };

  return (
    <section aria-labelledby="river-demo-heading" className="my-16 border-y border-border py-16">
      <PersonalizationRiverDemo stories={riverDemoStories} />
      <div className="grid gap-14 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">The card models behind the river</p>
            <h3 className="mt-3 max-w-3xl font-[var(--hp-font-headline)] font-bold text-balance text-xl leading-tight md:text-5xl">Each format needs its own preview.</h3>
            <p className="mt-4 max-w-3xl text-base leading-6 text-muted-foreground">The river can show articles, video, galleries, community, and events. Each card previews what it is and gives readers a clear next step.</p>
          </div>
          <Button
            type="button"
            size="touch"
            variant={showMightyCard ? "secondary" : "default"}
            aria-expanded={showMightyCard}
            aria-controls={showMightyCard ? "mighty-card-workbench" : undefined}
            onClick={() => setShowMightyCard((current) => !current)}
          >
            Mighty Card
          </Button>
        </div>
        {showMightyCard ? (
          <div id="mighty-card-workbench">
            <MightyCardWorkbench
              articleStory={articleStory}
              galleryStory={galleryStory}
              shoppingStory={shoppingStory}
              shortsStories={shortsStories}
              brandSpotlight={brandSpotlight}
              videoStory={videoStory}
              communityThread={communityThread}
              vehicleStory={vehicleStory}
              eventSample={eventSample}
              sponsoredSample={sponsoredSample}
              brands={brands}
              brandStorySamples={brandStorySamples}
            />
          </div>
        ) : (
          <div className="grid items-start gap-16">
          <SampleFigure
            label="Article card · real feed story"
              headline="See the source and headline before opening a story."
              description="The article card shows its publisher, headline, summary, and link to the full story."
            note={`${articleStory.brand} · ${articleStory.topic} · ${articleStory.readTime}`}
          >
            <RiverStorySample story={articleStory} />
          </SampleFigure>

          {videoStory ? (
            <SampleFigure
              label="Video card · configured recommendation"
              headline="See the publisher and runtime before playback."
              description="Publisher, thumbnail, and runtime identify the video before the reader opens playback."
              note={`${videoStory.brand} · ${videoStory.readTime} · ${videoSourceCopy}`}
            >
              <RiverStorySample story={videoStory} />
            </SampleFigure>
          ) : (
            <SampleFigure
              label="Video card · sample unavailable"
              headline="See the publisher and runtime before playback."
              description="Publisher, thumbnail, and runtime identify the video before the reader opens playback."
              note={videoSourceCopy}
            >
              <div className="flex min-h-48 flex-col justify-end bg-[var(--hp-utility-bar)] p-5 text-primary-foreground">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-primary-foreground/70">Video detail experience</p>
                <p className="mt-2 max-w-md font-[var(--hp-font-headline)] font-bold text-xl leading-tight">Browse the current Hearst+ video feed.</p>
                <Link className="mt-4 inline-flex min-h-11 w-fit items-center font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground" href="/hearst-plus/motortrend-videos/">Open video feed</Link>
              </div>
            </SampleFigure>
          )}

          {galleryStory ? (
            <SampleFigure
              label="Photo gallery card · real gallery story"
              headline="Preview the images before opening the gallery."
              description="A multi-image preview and image count show readers what to expect before opening the gallery detail."
              note={`${galleryStory.brand} · ${galleryStory.topic} · ${galleryStory.readTime}`}
            >
              <PhotoGalleryStorySample story={galleryStory} />
            </SampleFigure>
          ) : null}

          {eventSample ? (
            <SampleFigure
              label="Event card · organized by Hearst brands"
              headline="Make the event and the next step easy to see."
              description="The event card brings the organizers, dates, venue, and event details together in one preview."
              note={`${eventSample.brandNames.join(" + ")} · ${eventSample.dateLabel} · ${eventSample.venue}`}
            >
              <EventTile event={eventSample} />
            </SampleFigure>
          ) : null}

          <SampleFigure
            label="Community card · prototype conversation"
            headline="A conversation has a host, a group, and a next step."
            description="The card surfaces publication identity, thread context, and a clear invitation to join."
            note="This uses the real community card component and seeded demo content, not a reader-submitted post."
          >
            <CommunityHomeRiverCard thread={communityThread} />
          </SampleFigure>

          <SampleFigure
            label="Shorts · vertical video river module"
            headline="Browse vertical clips in one swipeable module."
            description="The Delish carousel shows portrait clips with publication identity and playback controls."
            note="Uses the same Delish Shorts carousel as the Delish feed and loads its scoped portrait-video inventory."
          >
            <DelishVerticalVideoCarousel
              stories={shortsStories}
              onOpen={(story) => router.push(`/read/${encodeURIComponent(story.id)}/?from=%2Fhearst-plus-brief%2F`)}
              theme="light"
            />
          </SampleFigure>

          {shoppingStory ? (
            <SampleFigure
              label="Shopping · editorial commerce card"
              headline="Show related products beside the story."
              description="Keep the publisher visible and label shopping links so readers know where they lead."
              note={`${shoppingStory.brand} · ${shoppingStory.topic} · rendered with the shared story card and its shopping treatment.`}
            >
              <RiverStorySample story={shoppingStory} />
            </SampleFigure>
          ) : null}

          {brandSpotlight ? (
            <SampleFigure
              label="Brand spotlight · multi-story module"
              headline="Show several stories from one publication."
              description="The spotlight groups stories under a brand name and opens the selected story."
              note="Ranked from the current Hearst story inventory and rendered with the existing brand-promotion module."
            >
              <BrandSpotlightSample promotion={brandSpotlight} />
            </SampleFigure>
          ) : null}

          <SampleFigure
            label="Advertisement · sponsored river placement"
            headline="Label sponsored placements clearly."
            description="Keep the sponsor name, offer, and destination visible beside the sponsored creative."
            note="Representative creative rendered with the existing contextual river advertisement component."
          >
            <ContextualRiverAdvertisement ad={sponsoredSample} />
          </SampleFigure>
          </div>
        )}
      </div>
    </section>
  );
}
