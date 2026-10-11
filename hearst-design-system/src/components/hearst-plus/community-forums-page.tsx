import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Flame, Newspaper, TrendingUp } from "@/components/ui/icons";
import { MainNav } from "@/components/home-page";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import {
  CommunityComposer,
  CommunityFeed,
  CommunityGroupChips,
  CommunityGroupsDirectory,
  CommunityGroupsToJoin,
  CommunityHelpfulButton,
  CommunityHostBadge,
  CommunityJoinButton,
  CommunityLeftRail,
  CommunityReportButton,
  CommunityThreadReplies,
  COMMUNITY_REVIEWED_POST_COUNT,
  type CommunityFeedThread,
  type CommunityGroupSummary,
} from "@/components/hearst-plus/community-client";
import { getLifestyleCommentCount } from "@/components/hearst-plus/content-reader-model";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { SiteFooter } from "@/components/fre/site-footer";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import { getHearstAllBrands } from "@/lib/hearst-routes";
import {
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

// One job per control (Q2): the header row switches places; the feed keeps its own sort.
const communityNavLinks = [
  { label: "Home", href: "/communities/", view: "home" },
  { label: "My groups", href: "/communities/?view=mine", view: "mine" },
  { label: "All groups", href: "/communities/?view=all", view: "all" },
] as const;

const communitySortTabs = [
  { label: "Hot", value: "hot", icon: Flame },
  { label: "New", value: "new", icon: Newspaper },
  { label: "Top", value: "top", icon: TrendingUp },
] as const;

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
    .filter(() => !activeGroupSlug)
    .map((seed) => {
      const brand = brands.find((candidate) => candidate.brandSlug === seed.brandSlug);
      const isHost = seed.kind === "writer";
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
        ...pickPoster(seed.brandSlug),
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
  return sorted.slice(0, activeBrandSlug ? 14 : 16);
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

export function CommunityForumsPage({ activeBrandSlug, activeGroupSlug, activeThreadId, sortBy = "hot", view = "home" }: CommunityForumsPageProps) {
  const brands = getCommunityBrands();
  const activeBrand = activeBrandSlug ? brands.find((brand) => brand.brandSlug === activeBrandSlug) : undefined;
  const groups = makeGroupSummaries(brands);
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
  const feedPath = activeGroup ? activeGroup.href : view === "mine" ? "/communities/?view=mine" : "/communities/";
  const sortHref = (value: CommunitySort) => `${feedPath}${feedPath.includes("?") ? "&" : "?"}sort=${value}`;
  const activeNavLabel = inGroup ? undefined : communityNavLinks.find((link) => link.view === view)?.label;

  const groupAbout = activeGroup ? (
    <>
      <div className="flex items-start gap-3">
        <BrandSourceIcon brand={activeGroup.brand} brandSlug={activeGroup.brandSlug} className="size-10 shrink-0 rounded-full" imageClassName="object-cover p-0" />
        <div className="min-w-0 flex-1">
          <h2 className="headline text-xl leading-tight">{activeGroup.name}</h2>
          <p className="text-xs font-bold text-[var(--hp-text-secondary)]">
            Hosted by {activeGroup.brand}
            {activeGroup.members ? ` · ${activeGroup.members}` : ""}
          </p>
        </div>
        <CommunityJoinButton brand={activeGroup.brand} groupName={activeGroup.name} />
      </div>
      <p className="hearst-community-copy mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">{activeGroup.description}</p>
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
      <UtilityBar selectedBrand={activeBrand ? { name: activeBrand.brand, slug: activeBrand.brandSlug } : null} />
      <MainNav
        brandSlug="hearst-all"
        activeFilter={activeNavLabel}
        navLinksOverride={communityNavLinks.map((link) => link.label)}
        navLinkHrefOverrides={Object.fromEntries(communityNavLinks.map((link) => [link.label, link.href]))}
        mastheadSlugOverride="hearst-communities"
      />

      <main>
        <div className="mx-auto grid max-w-[1360px] gap-6 bg-[var(--hp-background)] px-5 py-6 md:px-10 md:py-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.58fr)_minmax(280px,0.7fr)]">
          <aside className="hidden min-w-0 lg:sticky lg:top-28 lg:block lg:self-start">
            <CommunityLeftRail groups={groups} activeBrandSlug={activeBrandSlug} activeGroupSlug={activeGroupSlug} />
          </aside>

          <section className="min-w-0 space-y-4" aria-label={activeGroup ? `${activeGroup.name} threads` : "Community threads"}>
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
                  {activeThread.posterImage ? (
                    <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-[8px] border border-[var(--hp-border)] bg-[var(--community-surface-soft)]">
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
                <nav aria-label="Sort threads" className="flex w-fit items-center gap-1 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] p-1">
                  {communitySortTabs.map((item) => {
                    const Icon = item.icon;
                    const active = sortBy === item.value;
                    return (
                      <Link
                        key={item.value}
                        href={sortHref(item.value)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "inline-flex min-h-9 items-center gap-1.5 rounded-[6px] px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                          active ? "bg-[var(--hp-surface)] text-primary" : "text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control-hover)] hover:text-[var(--hp-text-primary)]",
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <CommunityFeed threads={threads.map(toFeedThread)} view={inGroup ? "group" : view === "mine" ? "mine" : "home"} scopeBrandSlug={activeBrandSlug} />
              </>
            )}
          </section>

          <aside className="hidden space-y-5 lg:sticky lg:top-28 lg:block lg:self-start">
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
