import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MainNav } from "@/components/home-page";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { CommunityJoinedGroupsCard } from "@/components/hearst-plus/community-joined-groups-card";
import {
  CommunityComposer,
  CommunityFeed,
  CommunityGroupChips,
  CommunityGroupsDirectory,
  CommunityGroupsToJoin,
  CommunityHelpfulButton,
  CommunityHostBadge,
  CommunityJoinButton,
  CommunityReportButton,
  CommunityThreadReplies,
  type CommunityFeedThread,
  type CommunityGroupSummary,
} from "@/components/hearst-plus/community-client";
import { getLifestyleCommentCount } from "@/components/hearst-plus/content-reader-model";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { SiteFooter } from "@/components/fre/site-footer";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllBrands } from "@/lib/hearst-routes";
import {
  COMMUNITY_REVIEWED_POST_COUNT,
  communityGroups,
  communityParticipationThreads,
  getCommunityGroup,
  getCommunityGroupHref,
  getCommunityGroupPostHref,
  getHostPickedStories,
} from "@/lib/community-groups";
import { cn } from "@/lib/utils";

// Hearst+ Communities is brand-hosted conversation (docs/hearst-plus-communities-design.md): every group
// belongs to a Hearst brand, hosts seed and moderate threads, and readers post on a trust ladder.

export type CommunitySort = "hot" | "new" | "top";
export type CommunityView = "home" | "mine" | "all";

type CommunityForumsPageProps = {
  activeBrandSlug?: string;
  activeGroupSlug?: string;
  activeThreadId?: string;
  sortBy?: CommunitySort;
  view?: CommunityView;
};

export function getCommunitySort(value: string | string[] | undefined): CommunitySort {
  const sort = Array.isArray(value) ? value[0] : value;
  return sort === "new" || sort === "top" ? sort : "hot";
}

export function getCommunityView(value: string | string[] | undefined): CommunityView {
  const view = Array.isArray(value) ? value[0] : value;
  return view === "mine" || view === "all" ? view : "home";
}

type CommunityBrand = {
  brand: string;
  brandSlug: string;
  stories: LifestyleRiverStory[];
};

type Thread = CommunityFeedThread & {
  kind: "story" | "post" | "challenge" | "writer" | "reader";
  groupSlug?: string;
};

const kindLabels: Record<Thread["kind"], string> = {
  story: "Story discussion",
  post: "Group post",
  challenge: "Challenge",
  writer: "Host thread",
  reader: "Reader question",
};

// Titles read the theme's headline font (Schibsted Grotesk on Hearst+); only UI and copy are set here.
const communityTypographyStyle = {
  "--community-font-ui": "Inter, system-ui, sans-serif",
  "--community-font-copy": "Inter, system-ui, sans-serif",
  "--community-surface-soft": "#eef7ff",
  "--community-surface-soft-hover": "#e4f2ff",
  "--font-brand": "var(--community-font-ui)",
  "--font-sans": "var(--community-font-ui)",
} as CSSProperties;

const groupRules = [
  "Stay on topic for the group.",
  "Be kind; disagree with ideas, not people.",
  "No selling, spam or self-promotion.",
  `A reader's first ${COMMUNITY_REVIEWED_POST_COUNT} posts are reviewed by the hosts.`,
];

function getCommunityBrands(): CommunityBrand[] {
  const stories = getHearstDestinationStaticData({ storyLimitPerDestination: 10_000 }).all.stories;
  return getHearstAllBrands().map((brand) => ({
    brand: brand.brand,
    brandSlug: brand.brandSlug,
    stories: stories.filter((story) => story.brandSlug === brand.brandSlug),
  }));
}

function makeStoryThread(story: LifestyleRiverStory, readerReturnPath: string): Thread {
  const replies = getLifestyleCommentCount(story);
  return {
    id: story.id,
    kind: "story",
    kindLabel: kindLabels.story,
    brand: story.brand,
    brandSlug: story.brandSlug,
    title: story.title,
    body: story.summary,
    meta: `Host pick · ${story.topic}`,
    replies,
    helpfulBase: replies + 9,
    author: `${story.brand} editors`,
    isHost: true,
    href: `/communities/${story.brandSlug}/threads/${story.id}/`,
    storyHref: `/read/${story.id}/?from=${encodeURIComponent(readerReturnPath)}`,
    posterImage: story.image,
    posterAlt: story.title,
  };
}

// Group and editor threads borrow a photo from their brand's stories, skipping the host-picked story
// threads so the same image is not shown twice in one feed.
function makePosterPicker(brands: CommunityBrand[]) {
  const used = new Map<string, number>();
  return (brandSlug: string) => {
    const brand = brands.find((candidate) => candidate.brandSlug === brandSlug);
    if (!brand) return {};
    const picked = new Set(getHostPickedStories(brand.stories).map((story) => story.id));
    const candidates = [...brand.stories]
      .sort((a, b) => b.popularity - a.popularity || a.age - b.age)
      .filter((story) => story.image && !picked.has(story.id));
    const index = used.get(brandSlug) ?? 0;
    used.set(brandSlug, index + 1);
    const story = candidates[index % Math.max(candidates.length, 1)];
    return story ? { posterImage: story.image, posterAlt: story.title } : {};
  };
}

function makeThreads(brands: CommunityBrand[], activeBrandSlug?: string, activeGroupSlug?: string, sortBy: CommunitySort = "hot"): Thread[] {
  const pickPoster = makePosterPicker(brands);
  const selectedBrands = activeBrandSlug ? brands.filter((brand) => brand.brandSlug === activeBrandSlug) : brands;
  const readerReturnPath = activeBrandSlug ? `/communities/${activeBrandSlug}/` : "/communities/";
  // Story threads exist only where a host attached one (Q6).
  const storyThreads = activeGroupSlug
    ? []
    : selectedBrands.flatMap((brand) => getHostPickedStories(brand.stories).map((story) => makeStoryThread(story, readerReturnPath)));

  const seededThreads: Thread[] = communityGroups
    .filter((seed) => !activeBrandSlug || seed.brandSlug === activeBrandSlug)
    .filter((seed) => !activeGroupSlug || seed.groupSlug === activeGroupSlug)
    .filter((seed) => !activeGroupSlug || seed.brandSlug !== "delish")
    .map((seed, index) => {
      const brand = brands.find((candidate) => candidate.brandSlug === seed.brandSlug);
      const replies = 18 + index * 7;
      return {
        id: seed.starterPostSlug,
        kind: index % 2 === 0 ? "post" : "challenge",
        kindLabel: kindLabels[index % 2 === 0 ? "post" : "challenge"],
        brand: brand?.brand ?? seed.name,
        brandSlug: seed.brandSlug,
        groupSlug: seed.groupSlug,
        title: seed.prompt,
        body: seed.description,
        meta: `${seed.name} · ${seed.members}`,
        replies,
        helpfulBase: replies + 6,
        author: `${brand?.brand ?? "Hearst+"} editors`,
        isHost: true,
        href: getCommunityGroupPostHref(seed),
        ...pickPoster(seed.brandSlug),
      };
    });

  const participationThreads: Thread[] = communityParticipationThreads
    .filter((seed) => !activeBrandSlug || seed.brandSlug === activeBrandSlug)
    .filter((seed) => !activeGroupSlug || seed.groupSlug === activeGroupSlug)
    .map((seed, index) => {
      const brand = brands.find((candidate) => candidate.brandSlug === seed.brandSlug);
      const isHost = seed.kind === "writer";
      const poster = pickPoster(seed.brandSlug);
      const storyImages = (brand?.stories ?? [])
        .filter((story) => story.image)
        .sort((a, b) => b.popularity - a.popularity || a.age - b.age)
        .slice(index % 3, (index % 3) + 3)
        .map((story) => ({ src: story.image, alt: story.title }));
      const galleryImages = seed.mediaType === "gallery"
        ? [
            ...storyImages,
            { src: "/images/delish-cook-everyday.png", alt: "Everyday cooking inspiration from Delish" },
            { src: "/images/delish-cook-everyday.png", alt: "Everyday cooking inspiration from Delish" },
            { src: "/images/delish-newsletter-daily.png", alt: "A daily Delish cooking idea" },
          ].slice(0, 3)
        : undefined;
      return {
        id: seed.id,
        kind: seed.kind,
        kindLabel: kindLabels[seed.kind],
        brand: brand?.brand ?? seed.author,
        brandSlug: seed.brandSlug,
        title: seed.title,
        body: seed.body,
        meta: seed.meta,
        replies: seed.replies,
        helpfulBase: seed.replies + (isHost ? 14 : 4),
        author: isHost ? `${brand?.brand ?? seed.author} editors` : seed.author,
        isHost,
        href: `/communities/${seed.brandSlug}/threads/${seed.id}/`,
        ...poster,
        ...(galleryImages?.length ? { posterImage: galleryImages[0].src, posterAlt: galleryImages[0].alt } : {}),
        mediaType: seed.mediaType,
        videoUrl: seed.videoUrl,
        galleryImages,
      };
    });

  const allThreads = [...participationThreads, ...seededThreads, ...storyThreads];
  // Top ranks by the one positive reaction (Q3); Hot blends replies with a lift for host story threads.
  const sorted =
    sortBy === "new"
      ? allThreads
      : [...allThreads].sort((a, b) =>
          sortBy === "top" ? b.helpfulBase - a.helpfulBase : b.replies + (b.kind === "story" ? 8 : 0) - (a.replies + (a.kind === "story" ? 8 : 0)),
        );
  // Home carries every thread from every brand; a brand page shows its own top 14.
  return activeBrandSlug ? sorted.slice(0, 14) : sorted;
}

function toFeedThread(thread: Thread): CommunityFeedThread {
  // Server-only fields stay on the server; the client gets plain data.
  return {
    id: thread.id,
    brand: thread.brand,
    brandSlug: thread.brandSlug,
    title: thread.title,
    body: thread.body,
    meta: thread.meta,
    kindLabel: thread.kindLabel,
    replies: thread.replies,
    helpfulBase: thread.helpfulBase,
    author: thread.author,
    isHost: thread.isHost,
    href: thread.href,
    storyHref: thread.storyHref,
    posterImage: thread.posterImage,
    posterAlt: thread.posterAlt,
    mediaType: thread.mediaType,
    videoUrl: thread.videoUrl,
    galleryImages: thread.galleryImages,
  };
}

// Named groups first, then a brand-level group for brands that have stories but no named group yet.
function makeGroupSummaries(brands: CommunityBrand[]): CommunityGroupSummary[] {
  const named = communityGroups.map((group) => ({
    brand: brands.find((brand) => brand.brandSlug === group.brandSlug)?.brand ?? group.name,
    brandSlug: group.brandSlug,
    groupSlug: group.groupSlug,
    name: group.name,
    description: group.description,
    members: group.members,
    href: getCommunityGroupHref(group),
  }));
  const brandGroups = [...brands]
    .filter((brand) => brand.stories.length > 0 && !communityGroups.some((group) => group.brandSlug === brand.brandSlug))
    .sort((a, b) => b.stories.length - a.stories.length)
    .slice(0, 10)
    .map((brand) => ({
      brand: brand.brand,
      brandSlug: brand.brandSlug,
      name: brand.brand,
      description: `${brand.brand} editors host story discussions and reader questions here.`,
      members: "",
      href: `/communities/${brand.brandSlug}/`,
    }));
  return [...named, ...brandGroups];
}

function CommunitySectionHeader({
  group,
  isGroup = false,
  headingLevel,
}: {
  group?: CommunityGroupSummary;
  isGroup?: boolean;
  headingLevel: "h1" | "p";
}) {
  const Heading = headingLevel;
  const title = !group
    ? "Hearst+ Communities"
    : isGroup
      ? group.name
      : `${group.brand} Community`;

  return (
    <header className={cn("min-w-0", group && "border-b border-border pb-3")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {group ? (
            <>
              <Heading className="headline text-2xl leading-tight sm:text-3xl">{title}</Heading>
              <p className="mt-1 text-sm font-semibold text-[var(--hp-text-secondary)]">
                Hosted by {group.brand} editors{group.members ? ` · ${group.members}` : ""}
              </p>
            </>
          ) : (
            <h1 className="sr-only">Hearst+ Communities</h1>
          )}
        </div>
        {group ? (
          <CommunityJoinButton brand={group.brand} groupName={group.name} className="min-h-10 px-5 text-sm max-sm:w-full max-sm:justify-center" />
        ) : null}
      </div>
    </header>
  );
}

export function CommunityForumsPage({ activeBrandSlug, activeGroupSlug, activeThreadId, sortBy = "hot", view = "home" }: CommunityForumsPageProps) {
  const brands = getCommunityBrands();
  const activeBrand = activeBrandSlug ? brands.find((brand) => brand.brandSlug === activeBrandSlug) : undefined;
  const groups = makeGroupSummaries(brands);
  const communityWidgetGroups = groups
    .filter((group): group is CommunityGroupSummary & { groupSlug: string } => Boolean(group.groupSlug))
    .slice(0, 3)
    .map((group) => ({
      brand: group.brand,
      brandSlug: group.brandSlug,
      groupSlug: group.groupSlug,
      name: group.name,
      members: group.members,
    }));
  const communitySearchStories = [
    ...(activeBrand?.stories ?? []),
    ...brands.filter((brand) => brand.brandSlug !== activeBrand?.brandSlug).flatMap((brand) => brand.stories.slice(0, 20)),
  ].slice(0, 460);
  const activeGroupSeed = activeBrandSlug && activeGroupSlug ? getCommunityGroup(activeBrandSlug, activeGroupSlug) : undefined;
  const activeGroup =
    (activeGroupSeed && groups.find((group) => group.groupSlug === activeGroupSeed.groupSlug)) ??
    (activeBrand ? groups.find((group) => group.brandSlug === activeBrand.brandSlug) : undefined) ??
    (activeBrand
      ? {
          brand: activeBrand.brand,
          brandSlug: activeBrand.brandSlug,
          name: activeBrand.brand,
          description: `${activeBrand.brand} editors host story discussions and reader questions here.`,
          members: "",
          href: `/communities/${activeBrand.brandSlug}/`,
        }
      : undefined);
  const threads = makeThreads(brands, activeBrandSlug, activeGroupSlug, sortBy);
  const activeThreadStory = activeThreadId ? activeBrand?.stories.find((story) => story.id === activeThreadId) : undefined;
  const activeThread = activeThreadId
    ? (threads.find((thread) => thread.id === activeThreadId) ??
      (activeThreadStory && activeBrand ? makeStoryThread(activeThreadStory, `/communities/${activeBrand.brandSlug}/`) : undefined))
    : undefined;
  const inGroup = Boolean(activeGroup);
  const groupAbout = activeGroup ? (
    <>
      <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest">About</h2>
      <p className="hearst-community-copy mt-2 text-sm leading-6 text-[var(--hp-text-secondary)]">{activeGroup.description}</p>
      <h3 className="mt-4 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest">Hosts</h3>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold">
        {activeGroup.brand} editors
        <CommunityHostBadge brand={activeGroup.brand} />
      </p>
      <h3 className="mt-4 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest">Group rules</h3>
      <ol className="hearst-community-copy mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-[var(--hp-text-secondary)]">
        {groupRules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
    </>
  ) : null;

  return (
    <div className="hearst-plus-theme hearst-community-page min-h-screen bg-[var(--hp-background)] text-[var(--hp-text-primary)]" style={communityTypographyStyle}>
      <UtilityBar
        selectedBrand={activeBrand ? { name: activeBrand.brand, slug: activeBrand.brandSlug } : null}
        overBanner={!activeBrand}
      />
      <MainNav
        brandSlug="hearst-all"
        mastheadDescriptorOverride="Communities"
        activeFilter="Community"
        navLinkLabelOverrides={{ Community: "Communities" }}
        selectedBrand={activeBrand ? { name: activeBrand.brand, slug: activeBrand.brandSlug } : null}
        navLinkHrefOverrides={{ Community: "/communities/" }}
        extendBannerUnderUtilityBar={!activeBrand}
        searchStories={communitySearchStories}
      />

      <main>
        {!activeGroup ? <h1 className="sr-only">Hearst+ Communities</h1> : null}
        <div className="mx-auto grid min-w-0 max-w-[1440px] grid-cols-1 gap-x-4 gap-y-6 px-5 py-6 md:px-8 lg:grid-cols-[256px_minmax(0,1fr)_256px] lg:px-10 lg:py-8 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
          <aside className="hidden min-w-0 lg:sticky lg:top-[86px] lg:block lg:max-h-[calc(100dvh-110px)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <CommunityJoinedGroupsCard groups={communityWidgetGroups} />
          </aside>

          <section className="min-w-0 space-y-4" aria-label={activeGroup ? `${activeGroup.name} threads` : "Community threads"}>
            {activeGroup ? (
              <CommunitySectionHeader
                group={activeGroup}
                isGroup={Boolean(activeGroupSeed)}
                headingLevel={activeThread || view === "all" ? "p" : "h1"}
              />
            ) : null}
            <CommunityGroupChips groups={groups} activeBrandSlug={activeBrandSlug} />

            {activeGroup && !activeThread ? (
              <details className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)] lg:hidden">
                <summary className="cursor-pointer text-sm font-bold">About {activeGroup.name}</summary>
                <div className="mt-3">{groupAbout}</div>
              </details>
            ) : null}

            {activeThread ? (
              <article className="overflow-hidden rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]" aria-labelledby="thread-title">
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--hp-text-secondary)]">
                    <BrandSourceIcon brand={activeThread.brand} brandSlug={activeThread.brandSlug} className="size-8 rounded-full" imageClassName="object-cover p-0" />
                    <span className="text-[var(--hp-text-primary)]">{activeThread.author}</span>
                    {activeThread.isHost ? <CommunityHostBadge brand={activeThread.brand} /> : null}
                    <span aria-hidden>·</span>
                    <span>{activeThread.kindLabel}</span>
                    <span aria-hidden>·</span>
                    <span>{activeThread.meta}</span>
                  </div>
                  <h1 id="thread-title" className="headline mt-3 max-w-2xl text-2xl leading-tight md:text-3xl">
                    {activeThread.title}
                  </h1>
                  <p className="hearst-community-copy mt-3 max-w-2xl text-base leading-7 text-[var(--hp-text-ui)]">{activeThread.body}</p>
                  {activeThread.mediaType === "video" && activeThread.videoUrl ? (
                    <video
                      className="mt-4 aspect-video w-full rounded-[8px] bg-black object-cover"
                      controls
                      playsInline
                      preload="metadata"
                      poster={activeThread.posterImage}
                      aria-label={activeThread.title}
                    >
                      <source src={activeThread.videoUrl} type="video/mp4" />
                    </video>
                  ) : activeThread.mediaType === "gallery" && activeThread.galleryImages?.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-2 overflow-hidden rounded-[8px] sm:grid-cols-3" aria-label="Photo gallery">
                      {activeThread.galleryImages.map((photo, index) => (
                        <div key={`${activeThread.id}-photo-${index}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 45vw, 240px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : activeThread.posterImage ? (
                    <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-[8px] bg-[var(--community-surface-soft)]">
                      <Image
                        src={activeThread.posterImage}
                        alt={activeThread.posterAlt ?? activeThread.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) calc(100vw - 64px), 760px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <CommunityHelpfulButton id={activeThread.id} base={activeThread.helpfulBase} />
                    <span className="text-sm font-bold text-[var(--hp-text-secondary)]">{activeThread.replies} replies</span>
                    {activeThread.storyHref ? (
                      <Link href={activeThread.storyHref} className="inline-flex min-h-9 items-center text-sm font-bold text-primary hover:underline">
                        Read the story
                      </Link>
                    ) : null}
                    <span className="ml-auto">
                      <CommunityReportButton id={activeThread.id} />
                    </span>
                  </div>
                </div>
                <CommunityThreadReplies
                  threadId={activeThread.id}
                  brand={activeThread.brand}
                  seedReplies={[
                    {
                      id: `${activeThread.id}-host-reply`,
                      author: `${activeThread.brand} editors`,
                      body: activeThread.storyHref
                        ? "We picked this story for discussion. What did you take from it, and what should we follow up on?"
                        : "Thanks for jumping in. We read every reply and pick the best questions for upcoming stories.",
                      isHost: true,
                      helpfulBase: 12,
                    },
                    {
                      id: `${activeThread.id}-reader-reply`,
                      author: "Hearst+ reader",
                      body: "Following this. Curious what other readers noticed and what they would ask the editors next.",
                      isHost: false,
                      helpfulBase: 4,
                    },
                  ]}
                />
              </article>
            ) : view === "all" && !inGroup ? (
              <>
                <h1 className="headline px-1 text-2xl leading-tight">All groups</h1>
                <CommunityGroupsDirectory groups={groups} />
              </>
            ) : (
              <>
                <CommunityComposer groups={groups} defaultGroup={activeGroup} />
                <CommunityFeed threads={threads.map(toFeedThread)} view={inGroup ? "group" : view === "mine" ? "mine" : "home"} scopeBrandSlug={activeBrandSlug} />
              </>
            )}
          </section>

          <aside className="hidden min-w-0 space-y-5 lg:sticky lg:top-[86px] lg:block lg:max-h-[calc(100dvh-110px)] lg:self-start lg:overflow-y-auto lg:pr-1">
            {activeGroup ? (
              <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">{groupAbout}</section>
            ) : view === "all" ? null : (
              <CommunityGroupsToJoin groups={groups} />
            )}
          </aside>
        </div>
      </main>

      <SiteFooter
        siteName="Hearst+"
        productLinkGroups={[
          {
            title: "Discover Hearst+",
            links: [
              { label: "Open Hearst+", href: "/hearst-plus/" },
              { label: "Communities", href: "/communities/" },
              { label: "Shop the stories", href: "/hearst-plus/shop/" },
            ],
          },
          {
            title: "Community",
            links: [
              { label: "Delish group", href: "/communities/delish/" },
              { label: "Car and Driver garage", href: "/communities/car-and-driver/" },
              { label: "Cosmopolitan", href: "/communities/cosmopolitan/" },
            ],
          },
          {
            title: "Product strategy",
            links: [
              { label: "HDS brand framework", href: "/hds-brand-framework/" },
              { label: "Product blueprint", href: "/hearst-product-blueprint/" },
              { label: "Why Hearst+", href: "/why-hearst-plus/" },
            ],
          },
        ]}
      />
    </div>
  );
}
