"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { CommunityHomeRiverCard } from "@/components/hearst-plus/community-home-river-card";
import { BrandLogo } from "@/components/brand-logo";
import type { BrandTheme } from "@/lib/brands";
import { getBrandLogoSrc } from "@/lib/logos";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { LifestyleRiverCard } from "@/components/home-page";
import { BrandPromotionRiverModule } from "@/components/hearst-plus/brand-promotion-river-module";
import type { BrandPromotionMatch } from "@/components/hearst-plus/brand-promotion-model";
import { ContextualRiverAdvertisement } from "@/components/hearst-plus/contextual-river-advertisement";
import type { ContextualAdUnit } from "@/components/hearst-plus/content-reader-advertisement";
import { DelishVerticalVideoCarousel } from "@/components/hearst-plus/vertical-video-carousel";
import { useMemo, useState } from "react";
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

function BrandSpotlightSample({ promotion }: { promotion: BrandPromotionMatch | null }) {
  const router = useRouter();
  return (
    <BrandPromotionRiverModule
      promotion={promotion}
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
        <figure key={template.href} className="min-w-0 space-y-3">
          <figcaption>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{template.label}</p>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-[var(--hp-font-headline)] font-bold text-xl leading-tight">{template.title}</h3>
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
  videoSourceCopy,
  riverDemoStories,
}: {
  articleStory: LifestyleRiverStory;
  galleryStory?: LifestyleRiverStory;
  shoppingStory?: LifestyleRiverStory;
  shortsStories: LifestyleRiverStory[];
  brandSpotlight: BrandPromotionMatch | null;
  videoStory?: LifestyleRiverStory;
  communityThread: CommunityFeedThread;
  videoSourceCopy: string;
  riverDemoStories: LifestyleRiverStory[];
}) {
  const router = useRouter();
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
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">The card models behind the river</p>
          <h3 className="mt-3 max-w-3xl font-[var(--hp-font-headline)] font-bold text-balance text-xl leading-tight">Each format keeps its own story clear.</h3>
          <p className="mt-4 max-w-3xl text-base leading-6 text-muted-foreground">The same personalized inventory can pair articles, video, galleries, and community with the right preview and next step.</p>
        </div>
        <div className="grid items-start gap-16">
          <SampleFigure
            label="Article card · real feed story"
            headline="A clear story preview leads into reading."
            description="The river card keeps the publisher visible, gives the headline room, and opens the matching article detail."
            note={`${articleStory.brand} · ${articleStory.topic} · ${articleStory.readTime}`}
          >
            <RiverStorySample story={articleStory} />
          </SampleFigure>

          {videoStory ? (
            <SampleFigure
              label="Video card · configured recommendation"
              headline="A preview that sets up the watch."
              description="Publisher, thumbnail, and runtime identify the video before the reader opens playback."
              note={`${videoStory.brand} · ${videoStory.readTime} · ${videoSourceCopy}`}
            >
              <RiverStorySample story={videoStory} />
            </SampleFigure>
          ) : (
            <SampleFigure
              label="Video card · sample unavailable"
              headline="A preview that sets up the watch."
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
              headline="The gallery signals that images are the story."
              description="A multi-image preview and image count show readers what to expect before opening the gallery detail."
              note={`${galleryStory.brand} · ${galleryStory.topic} · ${galleryStory.readTime}`}
            >
              <RiverStorySample story={galleryStory} />
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
            headline="A vertical run of video brings movement into the river."
            description="Portrait clips form a distinct, swipeable module, with publication identity and playback context kept visible."
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
              headline="Useful picks turn a story into a next step."
              description="A shopping treatment keeps the story and its editorial source visible while signaling product utility."
              note={`${shoppingStory.brand} · ${shoppingStory.topic} · rendered with the shared story card and its shopping treatment.`}
            >
              <RiverStorySample story={shoppingStory} />
            </SampleFigure>
          ) : null}

          {brandSpotlight ? (
            <SampleFigure
              label="Brand spotlight · multi-story module"
              headline="A publication can open a window into more of its coverage."
              description="The spotlight groups several stories under one brand identity, giving readers a clear path into that publication."
              note="Ranked from the current Hearst story inventory and rendered with the existing brand-promotion module."
            >
              <BrandSpotlightSample promotion={brandSpotlight} />
            </SampleFigure>
          ) : null}

          <SampleFigure
            label="Advertisement · sponsored river placement"
            headline="Commercial content stays clearly identified."
            description="A labeled sponsor unit can appear in the river with its own creative, offer, and destination, separate from editorial recommendations."
            note="Representative creative rendered with the existing contextual river advertisement component."
          >
            <ContextualRiverAdvertisement ad={sponsoredSample} />
          </SampleFigure>
        </div>
      </div>
    </section>
  );
}
