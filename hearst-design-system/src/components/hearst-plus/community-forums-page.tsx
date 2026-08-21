import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  Camera,
  ChefHat,
  CheckCircle2,
  ChevronDown,
  ChevronUpIcon,
  CircleUserRound,
  Compass,
  DotsThree,
  Flame,
  Heart,
  ImageIcon,
  MessageCircle,
  Newspaper,
  Plus,
  Search,
  Send,
  Share2,
  Shield,
  Star,
  ThumbsUp,
  TrendingUp,
} from "@/components/ui/icons";
import { MainNav } from "@/components/home-page";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { CommunityJoinedGroupsCard } from "@/components/hearst-plus/community-joined-groups-card";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { getLifestyleCommentCount } from "@/components/hearst-plus/content-reader-model";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { SiteFooter } from "@/components/fre/site-footer";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import {
  getHearstAllBrands,
  getHearstBrandSection,
  type HearstBrandSection,
} from "@/lib/hearst-routes";
import {
  communityGroups,
  communityParticipationThreads,
  getCommunityGroup,
  getCommunityGroupHref,
  getCommunityGroupPostHref,
  getCommunityGroupsForBrand,
  type CommunityGroupIconKey,
} from "@/lib/community-groups";
import { cn } from "@/lib/utils";

type CommunityForumsPageProps = {
  activeBrandSlug?: string;
  activeGroupSlug?: string;
  activeThreadId?: string;
  sortBy?: CommunitySort;
};

export type CommunitySort = "hot" | "new" | "top";

export function getCommunitySort(
  value: string | string[] | undefined,
): CommunitySort {
  const sort = Array.isArray(value) ? value[0] : value;
  return sort === "new" || sort === "top" ? sort : "hot";
}

type CommunityBrand = {
  brand: string;
  brandSlug: string;
  section: HearstBrandSection;
  stories: LifestyleRiverStory[];
};

type CommunityThread = {
  id: string;
  brand: string;
  brandSlug: string;
  groupSlug?: string;
  postSlug?: string;
  title: string;
  body: string;
  meta: string;
  kind: "story" | "post" | "challenge" | "recipe" | "writer" | "reader";
  replies: number;
  author: string;
  action: string;
  href: string;
  storyHref?: string;
  posterImage?: string;
  posterAlt?: string;
};

const communityIconMap: Record<CommunityGroupIconKey, typeof ChefHat> = {
  chef: ChefHat,
  star: Star,
  heart: Heart,
  flame: Flame,
};

const kindLabels: Record<CommunityThread["kind"], string> = {
  story: "Story comments",
  post: "Group post",
  challenge: "Challenge",
  recipe: "Recipe share",
  writer: "Writer thread",
  reader: "Reader question",
};

const communityNavLinks = [
  { label: "Communities", href: "/communities/", active: true },
  { label: "Popular", href: "/communities/#popular", active: false },
  { label: "New", href: "/communities/?sort=new#popular", active: false },
  { label: "Top", href: "/communities/?sort=top#popular", active: false },
  { label: "Groups", href: "/communities/#suggest-group", active: false },
  { label: "Create", href: "/communities/#post-to-group", active: false },
] as const;

const communityFeedShortcuts = [
  {
    id: "home",
    label: "Home",
    href: "/communities/",
    icon: Compass,
  },
  {
    id: "popular",
    label: "Popular",
    href: "/communities/#popular",
    icon: TrendingUp,
  },
  {
    id: "create",
    label: "Create community",
    href: "#suggest-group",
    icon: Plus,
  },
] as const;

const communitySortTabs = [
  { label: "Hot", value: "hot", icon: Flame },
  { label: "New", value: "new", icon: Newspaper },
  { label: "Top", value: "top", icon: TrendingUp },
] as const;

const communityTypographyStyle = {
  "--community-font-ui": "Inter, system-ui, sans-serif",
  "--community-font-display": "var(--font-newsreader), Georgia, serif",
  "--community-font-copy": "Inter, system-ui, sans-serif",
  "--community-surface-soft": "#eef7ff",
  "--community-surface-soft-hover": "#e4f2ff",
  "--font-brand": "var(--community-font-ui)",
  "--font-sans": "var(--community-font-ui)",
} as CSSProperties;

function getCommunityBrands(): CommunityBrand[] {
  const data = getHearstDestinationStaticData({
    storyLimitPerDestination: 10_000,
  });
  const stories = data.all.stories;

  return getHearstAllBrands().map((brand) => {
    const brandStories = stories.filter(
      (story) => story.brandSlug === brand.brandSlug,
    );
    return {
      ...brand,
      section: getHearstBrandSection(brand.brandSlug),
      stories: brandStories,
    };
  });
}

function getTopStories(stories: LifestyleRiverStory[], limit: number) {
  return [...stories]
    .sort((a, b) => b.popularity - a.popularity || a.age - b.age)
    .slice(0, limit);
}

function makeStoryThread(
  story: LifestyleRiverStory,
  readerReturnPath: string,
): CommunityThread {
  return {
    id: story.id,
    brand: story.brand,
    brandSlug: story.brandSlug,
    title: story.title,
    body: story.summary,
    meta: `${story.topic} · ${story.readTime}`,
    kind: "story",
    replies: getLifestyleCommentCount(story),
    author: `${story.brand} readers`,
    action: "Open thread",
    href: `/communities/${story.brandSlug}/threads/${story.id}/`,
    storyHref: `/read/${story.id}/?from=${encodeURIComponent(readerReturnPath)}`,
    posterImage: story.image,
    posterAlt: story.title,
  };
}

function makeThreads(
  brands: CommunityBrand[],
  activeBrandSlug?: string,
  activeGroupSlug?: string,
  sortBy: CommunitySort = "hot",
): CommunityThread[] {
  const selectedBrands = activeBrandSlug
    ? brands.filter((brand) => brand.brandSlug === activeBrandSlug)
    : brands;
  const readerReturnPath = activeBrandSlug
    ? `/communities/${activeBrandSlug}/`
    : "/communities/";
  const storyThreads = activeGroupSlug
    ? []
    : selectedBrands.flatMap((brand) =>
        getTopStories(brand.stories, activeBrandSlug ? 6 : 2).map((story) =>
          makeStoryThread(story, readerReturnPath),
        ),
      );

  const seededThreads = communityGroups
    .filter((seed) => !activeBrandSlug || seed.brandSlug === activeBrandSlug)
    .filter((seed) => !activeGroupSlug || seed.groupSlug === activeGroupSlug)
    .map((seed, index) => {
      const brand = brands.find(
        (candidate) => candidate.brandSlug === seed.brandSlug,
      );
      const posterStory = brand
        ? getTopStories(brand.stories, 1)[0]
        : undefined;
      return {
        id: seed.starterPostSlug,
        brand: brand?.brand ?? seed.name,
        brandSlug: seed.brandSlug,
        groupSlug: seed.groupSlug,
        postSlug: seed.starterPostSlug,
        title: seed.prompt,
        body: seed.description,
        meta: `${seed.name} group · ${seed.members}`,
        kind: index % 2 === 0 ? ("post" as const) : ("challenge" as const),
        replies: 18 + index * 7,
        author: brand?.brand ?? "Hearst+",
        action: "Open discussion",
        href: getCommunityGroupPostHref(seed),
        posterImage: posterStory?.image,
        posterAlt: posterStory?.title,
      };
    });

  const participationThreads = communityParticipationThreads
    .filter((seed) => !activeBrandSlug || seed.brandSlug === activeBrandSlug)
    .filter(() => !activeGroupSlug)
    .map((seed) => {
      const brand = brands.find(
        (candidate) => candidate.brandSlug === seed.brandSlug,
      );
      const posterStory = brand
        ? getTopStories(brand.stories, 1)[0]
        : undefined;
      return {
        id: seed.id,
        brand: brand?.brand ?? seed.author,
        brandSlug: seed.brandSlug,
        title: seed.title,
        body: seed.body,
        meta: seed.meta,
        kind: seed.kind,
        replies: seed.replies,
        author: seed.author,
        action: "Open thread",
        href: `/communities/${seed.brandSlug}/threads/${seed.id}/`,
        posterImage: posterStory?.image,
        posterAlt: posterStory?.title,
      };
    });

  const allThreads = [
    ...participationThreads,
    ...seededThreads,
    ...storyThreads,
  ];
  const sortedThreads =
    sortBy === "new"
      ? allThreads
      : [...allThreads].sort((a, b) =>
          sortBy === "top"
            ? b.replies - a.replies
            : b.replies +
              (b.kind === "story" ? 8 : 0) -
              (a.replies + (a.kind === "story" ? 8 : 0)),
        );

  return sortedThreads.slice(0, activeBrandSlug ? 14 : 16);
}

function getActiveBrand(brands: CommunityBrand[], activeBrandSlug?: string) {
  return activeBrandSlug
    ? brands.find((brand) => brand.brandSlug === activeBrandSlug)
    : undefined;
}

function ThreadVoteRail({ score }: { score: number }) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:w-12 sm:flex-col">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[8px] text-[var(--hp-text-secondary)] transition-colors hover:bg-[var(--hp-control-hover)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:size-8 sm:min-h-8 sm:min-w-8"
        aria-label="Upvote thread"
      >
        <ChevronUpIcon className="size-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center text-sm font-black tabular-nums text-[var(--hp-text-primary)]">
        {score}
      </span>
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[8px] text-[var(--hp-text-secondary)] transition-colors hover:bg-[var(--hp-control-hover)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:size-8 sm:min-h-8 sm:min-w-8"
        aria-label="Downvote thread"
      >
        <ChevronDown className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function CommunityForumsPage({
  activeBrandSlug,
  activeGroupSlug,
  activeThreadId,
  sortBy = "hot",
}: CommunityForumsPageProps) {
  const brands = getCommunityBrands();
  const activeBrand = getActiveBrand(brands, activeBrandSlug);
  const activeGroupSeed =
    activeBrandSlug && activeGroupSlug
      ? getCommunityGroup(activeBrandSlug, activeGroupSlug)
      : undefined;
  const threads = makeThreads(brands, activeBrandSlug, activeGroupSlug, sortBy);
  const activeThreadStory = activeThreadId
    ? activeBrand?.stories.find((story) => story.id === activeThreadId)
    : undefined;
  const activeThread = activeThreadId
    ? (threads.find((thread) => thread.id === activeThreadId) ??
      (activeThreadStory && activeBrand
        ? makeStoryThread(
            activeThreadStory,
            `/communities/${activeBrand.brandSlug}/`,
          )
        : undefined))
    : undefined;
  const featuredCommunities = getCommunityGroupsForBrand(activeBrandSlug)
    .map((seed) => {
      const brand = brands.find(
        (candidate) => candidate.brandSlug === seed.brandSlug,
      );
      return brand ? { ...seed, brand } : null;
    })
    .filter(Boolean)
    .filter(
      (item) => !activeBrandSlug || item?.brand.brandSlug === activeBrandSlug,
    );
  const joinedGroupItems = featuredCommunities.flatMap((item) =>
    item
      ? [
          {
            brand: item.brand.brand,
            brandSlug: item.brand.brandSlug,
            groupSlug: item.groupSlug,
            name: item.name,
            members: item.members,
          },
        ]
      : [],
  );
  const activeGroup = activeGroupSeed
    ? featuredCommunities.find(
        (item) => item?.groupSlug === activeGroupSeed.groupSlug,
      )
    : undefined;
  const activeCommunityName =
    activeGroup?.name ?? activeBrand?.brand ?? "Hearst+ communities";
  const activeCommunityDescription =
    activeGroup?.description ??
    (activeBrand
      ? `Discuss ${activeBrand.brand} stories, ask readers for advice, and follow writer prompts from the group.`
      : "Follow groups, browse reader posts, and keep up with conversations from across Hearst+.");
  const recommendedThreads = threads
    .filter((thread) => thread.replies >= 30)
    .slice(0, 5);
  const feedPath = activeGroup
    ? `/communities/${activeGroup.brand.brandSlug}/groups/${activeGroup.groupSlug}/`
    : activeBrand
      ? `/communities/${activeBrand.brandSlug}/`
      : "/communities/";
  const topBrands = [...brands].sort(
    (a, b) => b.stories.length - a.stories.length,
  );
  const browseBrands = activeBrand
    ? [
        activeBrand,
        ...topBrands.filter(
          (brand) => brand.brandSlug !== activeBrand.brandSlug,
        ),
      ]
    : topBrands;
  const primaryExploreBrands = browseBrands.slice(0, 4);
  const hearstExploreBrands = browseBrands.slice(4, 8);
  const selectedBrandForUtility = activeBrand
    ? { name: activeBrand.brand, slug: activeBrand.brandSlug }
    : null;
  const createActions =
    activeBrand?.section === "autos"
      ? [
          { label: "Ask the group", icon: MessageCircle },
          { label: "Share a garage note", icon: Camera },
          { label: "Start a weekend challenge", icon: Star },
        ]
      : activeBrand?.section === "flux"
        ? [
            { label: "Ask the group", icon: MessageCircle },
            { label: "Share a moodboard", icon: Camera },
            { label: "Start a culture post", icon: Star },
          ]
        : activeBrand?.section === "ew"
          ? [
              { label: "Ask the group", icon: MessageCircle },
              { label: "Share a gear note", icon: Camera },
              { label: "Start a challenge", icon: Star },
            ]
          : [
              { label: "Ask the group", icon: MessageCircle },
              {
                label:
                  activeBrand?.brandSlug === "delish"
                    ? "Share a recipe"
                    : "Share an idea",
                icon: Camera,
              },
              { label: "Start a challenge", icon: Star },
            ];

  return (
    <div
      className="hearst-plus-theme hearst-community-page min-h-screen bg-[var(--hp-background)] text-[var(--hp-text-primary)]"
      style={communityTypographyStyle}
    >
      <UtilityBar selectedBrand={selectedBrandForUtility} />
      <MainNav
        brandSlug="hearst-all"
        activeFilter="Communities"
        navLinksOverride={communityNavLinks.map((link) => link.label)}
        navLinkHrefOverrides={Object.fromEntries(communityNavLinks.map((link) => [link.label, link.href]))}
        mastheadLogoOverride={{
          src: "/logos/h-communities.svg",
          label: "Hearst+ Communities",
        }}
      />

      <main>
        <div className="mx-auto grid max-w-[1360px] gap-6 bg-[var(--hp-background)] px-5 py-8 md:px-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.58fr)_minmax(280px,0.7fr)]">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
                Communities
              </h2>

              <nav className="mt-4 grid gap-1" aria-label="Community feeds">
                {communityFeedShortcuts.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.id === "home" && !activeBrandSlug && !activeGroupSlug;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-[8px] px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                        isActive
                          ? "bg-[var(--hp-action-soft)] text-[var(--hp-action-soft-text)]"
                          : "text-[var(--hp-text-secondary)] hover:bg-[var(--community-surface-soft)] hover:text-[var(--hp-text-primary)]",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 border-t border-[var(--hp-border)] pt-4">
                <h3 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
                  My communities
                </h3>
                <div className="mt-3 grid gap-1">
                  {featuredCommunities.slice(0, 4).map((item) => {
                    if (!item) return null;
                    const isActive =
                      activeGroup?.groupSlug === item.groupSlug ||
                      (!activeGroup &&
                        activeBrand?.brandSlug === item.brand.brandSlug);
                    return (
                      <Link
                        key={`${item.brand.brandSlug}-${item.groupSlug}`}
                        href={getCommunityGroupHref(item)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-14 min-w-0 items-center gap-3 rounded-[8px] px-1.5 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                          isActive
                            ? "bg-[var(--community-surface-soft)] text-[var(--hp-text-primary)]"
                            : "text-[var(--hp-text-secondary)] hover:bg-[var(--community-surface-soft)] hover:text-[var(--hp-text-primary)]",
                        )}
                      >
                        <BrandSourceIcon
                          brand={item.brand.brand}
                          brandSlug={item.brand.brandSlug}
                          className="size-7 shrink-0 rounded-full"
                          imageClassName="object-cover p-0"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-base font-bold">
                            c/{item.name}
                          </span>
                        </span>
                        <CheckCircle2
                          className="size-5 shrink-0 text-primary"
                          aria-label="Joined"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--hp-border)] pt-4">
                <h3 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
                  Explore
                </h3>
                <div className="relative mt-4">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hp-text-secondary)]"
                    aria-hidden
                  />
                  <input
                    type="search"
                    name="community-search"
                    placeholder="Search communities..."
                    className="hearst-community-copy min-h-11 w-full rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] py-2 pl-10 pr-3 text-sm font-normal text-[var(--hp-text-primary)] outline-none transition-colors placeholder:text-[var(--hp-text-secondary)] focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="Search communities"
                  />
                </div>
                <div className="mt-3 grid max-h-[42vh] gap-1 overflow-y-auto pr-1">
                  {primaryExploreBrands.map((brand) => (
                    <Link
                      key={brand.brandSlug}
                      href={`/communities/${brand.brandSlug}/`}
                      className={cn(
                        "flex min-h-14 min-w-0 items-center gap-3 rounded-[8px] px-1.5 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                        activeBrand?.brandSlug === brand.brandSlug &&
                          !activeGroup
                          ? "bg-[var(--community-surface-soft)] text-[var(--hp-text-primary)]"
                          : "text-[var(--hp-text-secondary)] hover:bg-[var(--community-surface-soft)] hover:text-[var(--hp-text-primary)]",
                      )}
                    >
                      <BrandSourceIcon
                        brand={brand.brand}
                        brandSlug={brand.brandSlug}
                        className="size-7 shrink-0 rounded-full"
                        imageClassName="object-cover p-0"
                      />
                      <span className="min-w-0 flex-1 truncate text-base font-bold">
                        c/{brand.brand}
                      </span>
                        <span className="inline-flex min-h-8 shrink-0 items-center rounded-full bg-[var(--hp-text-primary)] px-3 text-xs font-black text-[var(--hp-surface)]">
                        Join
                      </span>
                    </Link>
                  ))}

                  {hearstExploreBrands.length > 0 ? (
                    <h4 className="mt-5 px-1.5 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
                      Hearst
                    </h4>
                  ) : null}

                  {hearstExploreBrands.map((brand) => (
                    <Link
                      key={brand.brandSlug}
                      href={`/communities/${brand.brandSlug}/`}
                      className={cn(
                        "flex min-h-14 min-w-0 items-center gap-3 rounded-[8px] px-1.5 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                        activeBrand?.brandSlug === brand.brandSlug &&
                          !activeGroup
                          ? "bg-[var(--community-surface-soft)] text-[var(--hp-text-primary)]"
                          : "text-[var(--hp-text-secondary)] hover:bg-[var(--community-surface-soft)] hover:text-[var(--hp-text-primary)]",
                      )}
                    >
                      <BrandSourceIcon
                        brand={brand.brand}
                        brandSlug={brand.brandSlug}
                        className="size-7 shrink-0 rounded-full"
                        imageClassName="object-cover p-0"
                      />
                      <span className="min-w-0 flex-1 truncate text-base font-bold">
                        c/{brand.brand}
                      </span>
                        <span className="inline-flex min-h-8 shrink-0 items-center rounded-full bg-[var(--hp-text-primary)] px-3 text-xs font-black text-[var(--hp-surface)]">
                        Join
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </aside>

          <section
            className="min-w-0 space-y-4"
            aria-label={
              activeGroup ? `${activeGroup.name} posts` : "Group posts"
            }
          >
            {activeThread ? (
              <article className="overflow-hidden rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]">
                <section
                  className="p-4 sm:p-5"
                  aria-labelledby="thread-starter-title"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <ThreadVoteRail score={activeThread.replies + 18} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--hp-text-secondary)]">
                        <span className="text-primary">
                          In {activeThread.brand} group
                        </span>
                        <span aria-hidden>·</span>
                        <span>{activeThread.author}</span>
                        <span aria-hidden>·</span>
                        <span>{kindLabels[activeThread.kind]}</span>
                        <span aria-hidden>·</span>
                        <span>{activeThread.meta}</span>
                      </div>
                      <h3
                        id="thread-starter-title"
                        className="hearst-community-display mt-2 max-w-2xl text-2xl font-bold leading-tight text-[var(--hp-text-primary)] md:text-3xl"
                      >
                        {activeThread.title}
                      </h3>
                      {activeThread.storyHref ? (
                        <p className="hearst-community-copy mt-2 max-w-2xl text-sm leading-6 text-[var(--hp-text-secondary)]">
                          This started from a story, then moved into the group.
                          Read the article for context, then add your take.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                    <div
                      className="hidden w-12 shrink-0 sm:block"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <BrandSourceIcon
                          brand={activeThread.brand}
                          brandSlug={activeThread.brandSlug}
                          className="size-9 rounded-full"
                          imageClassName="object-cover p-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[var(--hp-text-primary)]">
                            {activeThread.author}
                          </p>
                          <p className="text-xs font-bold text-[var(--hp-text-secondary)]">
                            Original poster
                          </p>
                        </div>
                      </div>
                      <p className="hearst-community-copy mt-2 max-w-2xl text-base leading-7 text-[var(--hp-text-ui)]">
                        {activeThread.body}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-[var(--hp-text-secondary)]">
                        <span className="inline-flex items-center gap-1.5">
                          <MessageCircle
                            className="size-4 text-primary"
                            aria-hidden
                          />
                          {activeThread.replies} replies
                        </span>
                        <button
                          type="button"
                          className="inline-flex min-h-9 items-center gap-1.5 text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                        >
                          <MessageCircle className="size-4" aria-hidden />
                          Comment
                        </button>
                        <button
                          type="button"
                          className="inline-flex min-h-9 items-center gap-1.5 text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                        >
                          <Share2 className="size-4" aria-hidden />
                          Share
                        </button>
                        <button
                          type="button"
                          className="inline-flex min-h-9 items-center gap-1.5 text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                        >
                          <Bookmark className="size-4" aria-hidden />
                          Save
                        </button>
                        {activeThread.storyHref ? (
                          <Link
                            href={activeThread.storyHref}
                            className="inline-flex min-h-9 items-center text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                          >
                            Read article
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          className="inline-flex min-h-9 items-center text-[var(--hp-text-secondary)] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                          aria-label="More thread actions"
                        >
                          <DotsThree className="size-5" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section
                  className="border-t border-[var(--hp-border)] p-5"
                  aria-labelledby="thread-replies-title"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4
                      id="thread-replies-title"
                      className="text-base font-black leading-tight text-[var(--hp-text-primary)]"
                    >
                      Comments
                    </h4>
                    <div className="flex items-center gap-1 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-1 text-xs font-bold text-[var(--hp-text-secondary)]">
                      {["Best", "Newest", "Top"].map((label) => (
                        <button
                          key={label}
                          type="button"
                          className={cn(
                            "min-h-8 rounded-[6px] px-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                            label === "Best"
                              ? "bg-[var(--hp-surface)] text-primary"
                              : "hover:bg-[var(--hp-control-hover)] hover:text-[var(--hp-text-primary)]",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      {
                        author: "Hearst+ reader",
                        body: "Following this. I want to hear what other readers noticed and what they would ask the writer next.",
                        meta: "Reader reply",
                      },
                      {
                        author: `${activeThread.brand} community`,
                        body: "Add your take, ask a question, or share a related tip.",
                        meta: "Community prompt",
                      },
                    ].map((reply) => (
                      <article
                        key={`${reply.author}-${reply.meta}`}
                        className="grid gap-3 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-4 sm:grid-cols-[40px_minmax(0,1fr)]"
                      >
                        <div className="flex items-center gap-1 sm:flex-col">
                          <button
                            type="button"
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[6px] text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control-hover)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:size-7 sm:min-h-7 sm:min-w-7"
                            aria-label="Upvote comment"
                          >
                            <ChevronUpIcon className="size-4" aria-hidden />
                          </button>
                          <span className="text-xs font-black text-[var(--hp-text-primary)]">
                            {reply.meta === "Reader reply" ? 12 : 4}
                          </span>
                          <button
                            type="button"
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[6px] text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control-hover)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:size-7 sm:min-h-7 sm:min-w-7"
                            aria-label="Downvote comment"
                          >
                            <ChevronDown className="size-4" aria-hidden />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--hp-text-secondary)]">
                            <span>{reply.author}</span>
                            <span aria-hidden>·</span>
                            <span>{reply.meta}</span>
                          </div>
                          <p className="hearst-community-copy mt-2 text-sm leading-6 text-[var(--hp-text-ui)]">
                            {reply.body}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-primary">
                            <button
                              type="button"
                              className="min-h-8 hover:text-primary/80"
                            >
                              Reply
                            </button>
                            <button
                              type="button"
                              className="min-h-8 hover:text-primary/80"
                            >
                              Share
                            </button>
                            <button
                              type="button"
                              className="min-h-8 hover:text-primary/80"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <form
                  id="reply-thread"
                  className="scroll-mt-28 border-t border-[var(--hp-border)] bg-[var(--hp-surface)] p-5"
                  aria-labelledby="reply-thread-title"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4
                        id="reply-thread-title"
                        className="hearst-community-display text-xl font-bold leading-tight"
                      >
                        Join the conversation
                      </h4>
                      <p className="hearst-community-copy mt-1 text-sm leading-6 text-[var(--hp-text-secondary)]">
                        Reply as a reader, or sign in to keep your group history
                        across devices.
                      </p>
                    </div>
                    <span className="rounded-[8px] bg-[var(--community-surface-soft)] px-3 py-1.5 text-xs font-bold text-[var(--hp-text-secondary)]">
                      Reader reply
                    </span>
                  </div>
                  <label className="mt-4 block">
                    <span className="sr-only">Write a reply</span>
                    <Textarea
                      name="reply"
                      placeholder="Add your take, ask a follow-up, or share a related tip."
                      className="hearst-community-copy min-h-28 resize-y border-primary/15 bg-[var(--community-surface-soft)] text-sm leading-6 focus-visible:bg-white"
                    />
                  </label>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]">
                      Keep it useful, kind, and specific to this group.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm">
                        Save draft
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="text-primary-foreground"
                      >
                        <Send className="size-4" aria-hidden />
                        Post reply
                      </Button>
                    </div>
                  </div>
                </form>
              </article>
            ) : (
              <>
                <section
                  className="overflow-hidden rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
                  aria-labelledby="start-thread-title"
                >
                  <div className="border-b border-[var(--hp-border)] p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--community-surface-soft)] text-primary">
                        <CircleUserRound className="size-6" aria-hidden />
                      </span>
                      <Link
                        id="start-thread-title"
                        href="#post-to-group"
                        className="hearst-community-copy flex min-h-11 min-w-0 flex-1 items-center rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] px-3 text-left text-sm font-semibold text-[var(--hp-text-secondary)] transition-colors hover:border-primary/45 hover:bg-[var(--community-surface-soft-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                      >
                        Start a post in {activeCommunityName}
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        aria-label="Add media to a post"
                      >
                        <ImageIcon className="size-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="hidden shrink-0 sm:inline-flex"
                        aria-label="Open community profile"
                      >
                        <CircleUserRound className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>

                  <div
                    id="popular"
                    className="flex flex-wrap items-center justify-between gap-3 p-3"
                  >
                    <nav
                      aria-label="Sort community posts"
                      className="flex items-center gap-1 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-1"
                    >
                      {communitySortTabs.map((item) => {
                        const Icon = item.icon;
                        const isActive = sortBy === item.value;
                        return (
                          <Link
                            key={item.label}
                            href={`${feedPath}?sort=${item.value}#popular`}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "inline-flex min-h-9 items-center gap-1.5 rounded-[6px] px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                              isActive
                                ? "bg-[var(--hp-surface)] text-primary"
                                : "text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control-hover)] hover:text-[var(--hp-text-primary)]",
                            )}
                          >
                            <Icon className="size-4" aria-hidden />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                    <p className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]">
                      {threads.length} active posts
                    </p>
                  </div>
                </section>

                <div
                  role="feed"
                  aria-labelledby="community-feed-title"
                  className="divide-y divide-[var(--hp-border)] rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
                >
                  {threads.map((thread, index) => (
                    <article
                      key={`${thread.kind}-${thread.id}`}
                      id={`thread-${thread.id}`}
                      role="article"
                      aria-labelledby={`thread-${thread.id}-title`}
                      aria-describedby={`thread-${thread.id}-summary`}
                      aria-posinset={index + 1}
                      aria-setsize={threads.length}
                      className="group p-4 transition-colors hover:bg-[var(--community-surface-soft)] sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <ThreadVoteRail score={thread.replies + 12 + index} />
                        <div className="min-w-0 flex-1">
                          <Link
                            href={thread.href}
                            className="block min-w-0 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                            aria-label={`Open thread: ${thread.title}`}
                          >
                            <span className="flex min-w-0 items-center gap-2 overflow-hidden text-[11px] font-bold leading-4 text-[var(--hp-text-secondary)]">
                              <BrandSourceIcon
                                brand={thread.brand}
                                brandSlug={thread.brandSlug}
                                className="size-8 shrink-0 rounded-full"
                                imageClassName="object-cover p-0"
                              />
                              <span className="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap">
                                <span>{thread.author}</span>
                                <span aria-hidden>·</span>
                                <span>{kindLabels[thread.kind]}</span>
                                <span aria-hidden>·</span>
                                <span className="truncate">{thread.meta}</span>
                              </span>
                            </span>
                            <h3
                              id={`thread-${thread.id}-title`}
                              className="hearst-community-display mt-2 text-xl font-bold leading-snug transition-colors group-hover:text-primary md:text-2xl"
                            >
                              {thread.title}
                            </h3>
                            <span
                              id={`thread-${thread.id}-summary`}
                              className="hearst-community-copy mt-2 block line-clamp-2 text-sm leading-6 text-[var(--hp-text-ui)]"
                            >
                              {thread.body}
                            </span>
                            {thread.posterImage ? (
                              <span className="relative mt-4 block aspect-[16/9] w-full overflow-hidden rounded-[8px] border border-[var(--hp-border)] bg-[var(--community-surface-soft)]">
                                <Image
                                  src={thread.posterImage}
                                  alt={thread.posterAlt ?? thread.title}
                                  fill
                                  sizes="(max-width: 1024px) calc(100vw - 112px), 760px"
                                  className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                                />
                              </span>
                            ) : null}
                          </Link>
                          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-[var(--hp-text-secondary)]">
                            <span className="inline-flex items-center gap-1.5">
                              <MessageCircle
                                className="size-4 text-primary"
                                aria-hidden
                              />
                              {thread.replies} replies
                            </span>
                            <button
                              type="button"
                              className="inline-flex min-h-9 items-center gap-1.5 text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                            >
                              <ThumbsUp className="size-4" aria-hidden />
                              Save
                            </button>
                            <Link
                              href={thread.href}
                              className="inline-flex min-h-9 items-center text-primary hover:text-primary/80"
                            >
                              {thread.action}
                            </Link>
                            {thread.storyHref ? (
                              <Link
                                href={thread.storyHref}
                                className="inline-flex min-h-9 items-center text-[var(--hp-text-secondary)] hover:text-primary"
                              >
                                Read article
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              {activeBrand || activeGroup ? (
                <>
                  <h2 className="hearst-community-display text-xl font-bold leading-tight">
                    About {activeCommunityName}
                  </h2>
                  <p className="hearst-community-copy mt-2 text-sm leading-6 text-[var(--hp-text-secondary)]">
                    {activeCommunityDescription}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-[var(--hp-border)] py-3">
                    <div>
                      <p className="text-xl font-black leading-tight text-[var(--hp-text-primary)]">
                        {activeGroup?.members ??
                          `${activeBrand?.stories.length ?? threads.length}`}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[var(--hp-text-secondary)]">
                        {activeGroup ? "Members" : "Stories"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xl font-black leading-tight text-[var(--hp-text-primary)]">
                        {threads.length}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[var(--hp-text-secondary)]">
                        Posts
                      </p>
                    </div>
                  </div>
                  <Link
                    href="#post-to-group"
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--component-button-radius-default)] border bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Plus className="size-4" aria-hidden />
                    Create post
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-text-primary)]">
                    Recommended for you
                  </h2>
                  <div className="mt-4 space-y-3">
                    {recommendedThreads.map((thread) => (
                      <Link
                        key={`${thread.kind}-${thread.id}-recommended`}
                        href={thread.href}
                        className="block rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-3 transition-colors hover:border-primary/45 hover:bg-[var(--community-surface-soft-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--hp-text-secondary)]">
                          <BrandSourceIcon
                            brand={thread.brand}
                            brandSlug={thread.brandSlug}
                            className="size-5 rounded-full"
                            imageClassName="object-cover p-0"
                          />
                          <span className="truncate">{thread.brand}</span>
                        </div>
                        <h3 className="hearst-community-display mt-2 line-clamp-2 text-base font-bold leading-snug text-[var(--hp-text-primary)]">
                          {thread.title}
                        </h3>
                        <p className="mt-2 text-xs font-bold text-primary">
                          {thread.replies} replies
                        </p>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </section>

            <CommunityJoinedGroupsCard groups={joinedGroupItems} />

            <section
              id="post-to-group"
              className="scroll-mt-28 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
            >
              <h2 className="hearst-community-display text-xl font-bold leading-tight">
                Featured groups
              </h2>
              <div className="mt-4 space-y-3">
                {featuredCommunities.map((item) => {
                  if (!item) return null;
                  const Icon = communityIconMap[item.iconKey];
                  return (
                    <Link
                      key={item.brand.brandSlug}
                      href={getCommunityGroupHref(item)}
                      aria-label={`Open ${item.name} group`}
                      className="block rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-3 transition-colors hover:border-primary/45 hover:bg-[var(--community-surface-soft-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-white/70 text-primary">
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <div>
                          <h3 className="hearst-community-display text-lg font-bold leading-snug">
                            {item.name}
                          </h3>
                          <p className="hearst-community-copy mt-1 text-xs leading-5 text-[var(--hp-text-secondary)]">
                            {item.description}
                          </p>
                          <p className="mt-2 text-xs font-bold text-primary">
                            {item.members}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <form
              id="suggest-group"
              className="scroll-mt-28 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
              aria-labelledby="suggest-group-title"
            >
              <h2
                id="suggest-group-title"
                className="hearst-community-display text-xl font-bold leading-tight"
              >
                Suggest a group
              </h2>
              <p className="hearst-community-copy mt-2 text-sm leading-6 text-[var(--hp-text-secondary)]">
                Readers can suggest groups. Editors review them so the community
                stays focused and useful.
              </p>
              <div className="mt-4 grid gap-3">
                <label
                  htmlFor="suggest-group-name"
                  className="grid gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
                >
                  Group name
                  <input
                    id="suggest-group-name"
                    name="groupName"
                    type="text"
                    placeholder={
                      activeBrand
                        ? `${activeBrand.brand} owners`
                        : "Weekend cooking"
                    }
                    className="hearst-community-copy min-h-11 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] px-3 text-sm font-normal text-[var(--hp-text-primary)] outline-none transition-colors placeholder:text-[var(--hp-text-secondary)] focus-visible:border-primary focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </label>
                <label
                  htmlFor="suggest-group-reason"
                  className="grid gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
                >
                  Why it should exist
                  <Textarea
                    id="suggest-group-reason"
                    name="reason"
                    placeholder="What would readers talk about here?"
                    className="hearst-community-copy min-h-24 resize-y border-primary/15 bg-[var(--community-surface-soft)] text-sm font-normal leading-6 focus-visible:bg-white"
                  />
                </label>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  className="text-primary-foreground"
                >
                  <Send className="size-4" aria-hidden />
                  Send suggestion
                </Button>
              </div>
            </form>

            <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <h2 className="hearst-community-display text-xl font-bold leading-tight">
                How groups work
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--hp-text-ui)]">
                {[
                  {
                    icon: Newspaper,
                    title: "Story discussions",
                    body: "Article comments remain attached to the story and also appear inside the related group.",
                  },
                  {
                    icon: Star,
                    title: "Writer participation",
                    body: "Editors and contributors can ask readers what to cover, test, or explain next.",
                  },
                  {
                    icon: MessageCircle,
                    title: "Reader posts",
                    body: "Readers can ask questions, swap advice, and return to conversations by group.",
                  },
                  {
                    icon: Shield,
                    title: "Shared rules",
                    body: "One account, moderation, reporting, and saved-post layer across Hearst+.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex gap-3 border-b border-[var(--hp-border)] pb-3 last:border-0 last:pb-0"
                    >
                      <Icon
                        className="mt-1 size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <div>
                        <h3 className="hearst-community-display text-lg font-bold leading-tight text-[var(--hp-text-primary)]">
                          {item.title}
                        </h3>
                        <p className="hearst-community-copy mt-0.5 text-xs leading-5 text-[var(--hp-text-secondary)]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <h2 className="hearst-community-display text-xl font-bold leading-tight">
                Post to a group
              </h2>
              <div className="mt-4 grid gap-2">
                {createActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.label}
                      variant="outline"
                      size="touch"
                      className="justify-start"
                    >
                      <Icon className="size-4" aria-hidden />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </section>
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
              {
                label: "Car and Driver garage",
                href: "/communities/car-and-driver/",
              },
              { label: "Cosmopolitan", href: "/communities/cosmopolitan/" },
            ],
          },
          {
            title: "Product strategy",
            links: [
              { label: "HDS brand framework", href: "/hds-brand-framework/" },
              {
                label: "Product blueprint",
                href: "/hearst-product-blueprint/",
              },
              { label: "Why Hearst+", href: "/why-hearst-plus/" },
            ],
          },
        ]}
      />
    </div>
  );
}
