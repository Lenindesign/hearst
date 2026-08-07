import Link from "next/link";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  Camera,
  ChefHat,
  ChevronDown,
  ChevronUpIcon,
  DotsThree,
  Flame,
  Heart,
  MessageCircle,
  Newspaper,
  Send,
  Share2,
  Shield,
  Star,
  ThumbsUp,
} from "@/components/ui/icons";
import { BrandLogo } from "@/components/brand-logo";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { getLifestyleCommentCount } from "@/components/hearst-plus/content-reader-model";
import { UtilityBar } from "@/components/hearst-plus/utility-bar";
import { SiteFooter } from "@/components/fre/site-footer";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import {
  getHearstAllBrands,
  getHearstBrandSection,
  getHearstBrandRoute,
  type HearstBrandSection,
} from "@/lib/hearst-routes";
import { cn } from "@/lib/utils";

type CommunityForumsPageProps = {
  activeBrandSlug?: string;
  activeThreadId?: string;
};

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
  title: string;
  body: string;
  meta: string;
  kind: "story" | "forum" | "challenge" | "recipe" | "writer" | "reader";
  replies: number;
  author: string;
  action: string;
  href: string;
  storyHref?: string;
};

const sectionLabels: Record<HearstBrandSection, string> = {
  lifestyle: "Lifestyle",
  autos: "Autos",
  flux: "Fashion & Luxury",
  ew: "Enthusiast & Wellness",
};

const featuredCommunitySeeds = [
  {
    brandSlug: "delish",
    name: "Italian Weeknights",
    description: "Pantry pastas, red sauce questions, and low-stress dinners.",
    icon: ChefHat,
    members: "18.4K cooks",
    prompt: "What sauce saves dinner when time is short?",
  },
  {
    brandSlug: "cosmopolitan",
    name: "Cosmo Watch Party",
    description: "Celeb reads, dating debates, entertainment reactions.",
    icon: Star,
    members: "22.8K readers",
    prompt: "What story should everyone be talking about today?",
  },
  {
    brandSlug: "good-housekeeping",
    name: "Home Fix Club",
    description:
      "Tested routines, cleaning saves, meal prep, and family systems.",
    icon: Heart,
    members: "31.2K members",
    prompt: "What household fix actually worked this week?",
  },
  {
    brandSlug: "car-and-driver",
    name: "Garage Talk",
    description: "Buying advice, road tests, EV notes, and weekend drives.",
    icon: Flame,
    members: "16.5K drivers",
    prompt: "What would you test before buying?",
  },
];

const kindLabels: Record<CommunityThread["kind"], string> = {
  story: "Story comments",
  forum: "Forum thread",
  challenge: "Challenge",
  recipe: "Recipe share",
  writer: "Writer thread",
  reader: "Reader question",
};

const participationThreadSeeds = [
  {
    brandSlug: "delish",
    id: "writers-test-kitchen",
    title: "Ask the test kitchen: what should we solve next?",
    body: "Delish editors are collecting reader questions for weeknight dinners, shortcuts, and recipes that need troubleshooting.",
    meta: "Editors in the kitchen",
    kind: "writer" as const,
    replies: 44,
    author: "Delish writers",
  },
  {
    brandSlug: "good-housekeeping",
    id: "readers-home-routines",
    title: "Readers: what home routine actually stuck?",
    body: "Share the small cleaning, meal prep, or family routine you kept doing after the first week.",
    meta: "Reader exchange",
    kind: "reader" as const,
    replies: 38,
    author: "Good Housekeeping readers",
  },
  {
    brandSlug: "cosmopolitan",
    id: "writers-watch-list",
    title: "From the writers: what should we watch together?",
    body: "Cosmo writers are looking for the shows, celebrity moments, and group-chat debates readers want covered next.",
    meta: "Culture desk",
    kind: "writer" as const,
    replies: 35,
    author: "Cosmopolitan writers",
  },
  {
    brandSlug: "car-and-driver",
    id: "reader-buying-advice",
    title: "Reader garage: what would you ask before buying?",
    body: "Bring your shortlist, tradeoffs, or test-drive questions and compare notes with other drivers.",
    meta: "Reader advice",
    kind: "reader" as const,
    replies: 31,
    author: "Car and Driver readers",
  },
  {
    brandSlug: "elle-decor",
    id: "writers-design-questions",
    title: "Ask the editors: what design question is on your mind?",
    body: "Elle Decor editors are collecting reader questions about rooms, materials, color, collecting, and what makes a space feel personal.",
    meta: "Design editors",
    kind: "writer" as const,
    replies: 27,
    author: "Elle Décor writers",
  },
];

const communityNavLinks = [
  { label: "For You", href: "/hearst-plus/", active: false },
  { label: "Communities", href: "/communities/", active: true },
] as const;

const communityTypographyStyle = {
  "--community-font-ui": "Inter, system-ui, sans-serif",
  "--community-font-display": "var(--font-newsreader), Georgia, serif",
  "--community-font-copy": "Inter, system-ui, sans-serif",
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
  };
}

function makeThreads(
  brands: CommunityBrand[],
  activeBrandSlug?: string,
): CommunityThread[] {
  const selectedBrands = activeBrandSlug
    ? brands.filter((brand) => brand.brandSlug === activeBrandSlug)
    : brands;
  const readerReturnPath = activeBrandSlug
    ? `/communities/${activeBrandSlug}/`
    : "/communities/";
  const storyThreads = selectedBrands.flatMap((brand) =>
    getTopStories(brand.stories, activeBrandSlug ? 6 : 2).map((story) =>
      makeStoryThread(story, readerReturnPath),
    ),
  );

  const seededThreads = featuredCommunitySeeds
    .filter((seed) => !activeBrandSlug || seed.brandSlug === activeBrandSlug)
    .map((seed, index) => {
      const brand = brands.find(
        (candidate) => candidate.brandSlug === seed.brandSlug,
      );
      return {
        id: `seed-${seed.brandSlug}`,
        brand: brand?.brand ?? seed.name,
        brandSlug: seed.brandSlug,
        title: seed.prompt,
        body: seed.description,
        meta: `${seed.name} · ${seed.members}`,
        kind: index % 2 === 0 ? ("forum" as const) : ("challenge" as const),
        replies: 18 + index * 7,
        author: brand?.brand ?? "Hearst+",
        action: "Open thread",
        href: `/communities/${seed.brandSlug}/threads/seed-${seed.brandSlug}/`,
      };
    });

  const participationThreads = participationThreadSeeds
    .filter((seed) => !activeBrandSlug || seed.brandSlug === activeBrandSlug)
    .map((seed) => {
      const brand = brands.find(
        (candidate) => candidate.brandSlug === seed.brandSlug,
      );
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
      };
    });

  return [...participationThreads, ...seededThreads, ...storyThreads]
    .sort((a, b) => b.replies - a.replies)
    .slice(0, activeBrandSlug ? 14 : 16);
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
        className="inline-flex size-8 items-center justify-center rounded-[8px] text-[var(--hp-text-secondary)] transition-colors hover:bg-[var(--hp-control-hover)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        aria-label="Upvote thread"
      >
        <ChevronUpIcon className="size-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center text-sm font-black tabular-nums text-[var(--hp-text-primary)]">
        {score}
      </span>
      <button
        type="button"
        className="inline-flex size-8 items-center justify-center rounded-[8px] text-[var(--hp-text-secondary)] transition-colors hover:bg-[var(--hp-control-hover)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        aria-label="Downvote thread"
      >
        <ChevronDown className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function CommunityForumsPage({
  activeBrandSlug,
  activeThreadId,
}: CommunityForumsPageProps) {
  const brands = getCommunityBrands();
  const activeBrand = getActiveBrand(brands, activeBrandSlug);
  const visibleBrands = activeBrand ? [activeBrand] : brands;
  const threads = makeThreads(brands, activeBrandSlug);
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
  const featuredCommunities = featuredCommunitySeeds
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
  const totalStories = visibleBrands.reduce(
    (total, brand) => total + brand.stories.length,
    0,
  );
  const totalBrands = visibleBrands.length;
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
  const sectionSummary = activeBrand
    ? sectionLabels[activeBrand.section]
    : "All sections";
  const heroTitle = activeThread
    ? activeThread.title
    : activeBrand
      ? `${activeBrand.brand} community`
      : "Talk through what you are reading";
  const heroDescription = activeThread
    ? "Join the conversation, follow the thread, or open the original story for full context."
    : "Story comments, writer prompts, reader questions, and forum threads share one community layer. Follow a brand, continue a story conversation, or start a topic people can come back to later.";
  const selectedBrandForUtility = activeBrand
    ? { name: activeBrand.brand, slug: activeBrand.brandSlug }
    : null;
  const createActions =
    activeBrand?.section === "autos"
      ? [
          { label: "Ask buying advice", icon: MessageCircle },
          { label: "Share a garage note", icon: Camera },
          { label: "Start a weekend challenge", icon: Star },
        ]
      : activeBrand?.section === "flux"
        ? [
            { label: "Ask a style question", icon: MessageCircle },
            { label: "Share a moodboard", icon: Camera },
            { label: "Start a culture thread", icon: Star },
          ]
        : activeBrand?.section === "ew"
          ? [
              { label: "Ask for advice", icon: MessageCircle },
              { label: "Share a gear note", icon: Camera },
              { label: "Start a challenge", icon: Star },
            ]
          : [
              { label: "Ask a question", icon: MessageCircle },
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

      <header className="sticky top-8 z-40 border-b border-[var(--hp-border)] bg-[var(--hp-surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--hp-surface)]/88">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 py-4 md:px-10">
          <Link
            href="/hearst-plus/"
            className="flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            aria-label="Hearst+"
          >
            <BrandLogo
              slug="hearst-all"
              decorative
              className="flex h-[22.079px] max-w-[280px] items-center [&_svg]:block [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full"
            />
          </Link>
          <nav
            aria-label="Community navigation"
            className="flex min-w-0 flex-1 justify-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max items-center gap-1 rounded-[8px] border border-primary/15 bg-[#eef7ff] p-1">
              {communityNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-[6px] px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                    link.active
                      ? "bg-primary text-primary-foreground"
                      : "text-[var(--hp-text-secondary)] hover:bg-[#e4f2ff] hover:text-[var(--hp-text-primary)]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-[var(--hp-border)] bg-[var(--hp-surface)]">
          <div className="mx-auto max-w-[1360px] px-5 py-8 md:px-10 lg:py-10">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.46fr)] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--hp-text-secondary)]">
                  <Link href="/hearst-plus/" className="hover:text-primary">
                    Hearst+
                  </Link>
                  <span aria-hidden>/</span>
                  <Link href="/communities/" className="hover:text-primary">
                    Communities
                  </Link>
                  {activeBrand ? (
                    <>
                      <span aria-hidden>/</span>
                      <span>{activeBrand.brand}</span>
                    </>
                  ) : null}
                </div>
                <div className="mt-6">
                  <p className="text-sm font-bold text-primary">
                    {sectionSummary}
                  </p>
                  <h1 className="hearst-community-display mt-2 max-w-3xl text-4xl font-extrabold leading-[1.06] tracking-normal text-balance md:text-5xl">
                    {heroTitle}
                  </h1>
                  <p className="hearst-community-copy mt-4 max-w-2xl text-base leading-7 text-[var(--hp-text-ui)] md:text-lg">
                    {heroDescription}
                  </p>
                </div>
              </div>

              <div className="rounded-[8px] border border-primary/15 bg-[#eef7ff] p-4">
                <p className="text-sm font-bold text-[var(--hp-text-primary)]">
                  Community is not a separate product.
                </p>
                <p className="hearst-community-copy mt-2 text-sm leading-6 text-[var(--hp-text-ui)]">
                  Comments stay with articles. Writers and readers can also
                  start threads worth revisiting.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Brands", value: totalBrands },
                    { label: "Stories", value: totalStories },
                    { label: "Mode", value: activeBrand ? "Brand" : "All" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[8px] bg-[var(--hp-surface)] px-2 py-3"
                    >
                      <p className="hearst-community-display text-xl font-bold leading-none">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[var(--hp-text-secondary)]">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={
                  activeBrand
                    ? getHearstBrandRoute(activeBrand.brandSlug)
                    : "/hearst-plus/"
                }
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--component-button-radius-default)] border border-transparent bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {activeBrand
                  ? `Back to ${activeBrand.brand}`
                  : "Back to Hearst+"}
              </Link>
              {activeBrand ? (
                <Link
                  href={
                    activeThread
                      ? `/communities/${activeBrand.brandSlug}/`
                      : "/communities/"
                  }
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--component-button-radius-default)] border border-[var(--hp-border)] bg-[var(--hp-surface)] px-4 text-sm font-medium transition-colors hover:bg-[var(--hp-control-hover)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {activeThread
                    ? `Back to ${activeBrand.brand}`
                    : "View all communities"}
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1360px] gap-6 bg-[var(--hp-background)] px-5 py-8 md:px-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.58fr)_minmax(280px,0.7fr)]">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="hearst-community-display text-xl font-bold leading-tight">
                  Browse brands
                </h2>
                <Link
                  href="/communities/"
                  className="text-sm font-bold text-primary"
                >
                  All
                </Link>
              </div>
              <div className="mt-4 grid max-h-[60vh] gap-2 overflow-y-auto pr-1">
                {browseBrands.map((brand) => (
                  <Link
                    key={brand.brandSlug}
                    href={`/communities/${brand.brandSlug}/`}
                    className={cn(
                      "flex min-h-12 min-w-0 items-center gap-3 rounded-[8px] border px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                      activeBrand?.brandSlug === brand.brandSlug
                        ? "border-primary bg-[var(--hp-action-soft)] text-[var(--hp-action-soft-text)]"
                        : "border-primary/15 bg-[#eef7ff] text-[var(--hp-text-primary)] hover:border-primary/45 hover:bg-[#e4f2ff]",
                    )}
                  >
                    <BrandSourceIcon
                      brand={brand.brand}
                      brandSlug={brand.brandSlug}
                      className="h-7 w-7 rounded-[6px]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{brand.brand}</span>
                      <span className="mt-0.5 block text-xs font-semibold text-[var(--hp-text-secondary)]">
                        {sectionLabels[brand.section]}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-[var(--hp-text-secondary)]">
                      {brand.stories.length}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </aside>

          <section
            className="min-w-0 space-y-4"
            aria-labelledby="community-feed-title"
          >
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--hp-border)] pb-4">
              <div>
                <h2
                  id="community-feed-title"
                  className="hearst-community-display text-3xl font-bold leading-tight"
                >
                  Latest conversations
                </h2>
                <p className="hearst-community-copy mt-1 text-sm leading-6 text-[var(--hp-text-secondary)]">
                  A mix of article comments, writer prompts, reader questions,
                  and club threads.
                </p>
              </div>
              <Link
                href={activeThread ? "#reply-thread" : "#start-thread"}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--component-button-radius-default)] border border-[var(--hp-border)] bg-[var(--hp-surface)] px-4 text-sm font-medium transition-colors hover:bg-[var(--hp-control-hover)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-controls={activeThread ? "reply-thread" : "start-thread"}
              >
                <MessageCircle className="size-4" aria-hidden />
                {activeThread ? "Reply to thread" : "Start a thread"}
              </Link>
            </div>

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
                          c/{activeThread.brand}
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
                          This started from a story, but the conversation lives
                          here. Read the article for context, then add your
                          take.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                    <div
                      className="hidden w-12 shrink-0 sm:block"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-background)] p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <BrandSourceIcon
                          brand={activeThread.brand}
                          brandSlug={activeThread.brandSlug}
                          className="h-9 w-9 rounded-[8px]"
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
                          {activeThread.replies} comments
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
                    <div className="flex items-center gap-1 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-control)] p-1 text-xs font-bold text-[var(--hp-text-secondary)]">
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
                        className="grid gap-3 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-control)] p-4 sm:grid-cols-[40px_minmax(0,1fr)]"
                      >
                        <div className="flex items-center gap-1 sm:flex-col">
                          <button
                            type="button"
                            className="inline-flex size-7 items-center justify-center rounded-[6px] text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control-hover)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                            aria-label="Upvote comment"
                          >
                            <ChevronUpIcon className="size-4" aria-hidden />
                          </button>
                          <span className="text-xs font-black text-[var(--hp-text-primary)]">
                            {reply.meta === "Reader reply" ? 12 : 4}
                          </span>
                          <button
                            type="button"
                            className="inline-flex size-7 items-center justify-center rounded-[6px] text-[var(--hp-text-secondary)] hover:bg-[var(--hp-control-hover)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
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
                        Reply as a reader, or sign in to keep your thread
                        history across devices.
                      </p>
                    </div>
                    <span className="rounded-[8px] bg-[var(--hp-control)] px-3 py-1.5 text-xs font-bold text-[var(--hp-text-secondary)]">
                      Reader reply
                    </span>
                  </div>
                  <label className="mt-4 block">
                    <span className="sr-only">Write a reply</span>
                    <Textarea
                      name="reply"
                      placeholder="Add your take, ask a follow-up, or share a related tip."
                      className="hearst-community-copy min-h-28 resize-y bg-[var(--hp-background)] text-sm leading-6"
                    />
                  </label>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]">
                      Keep it useful, kind, and specific to this thread.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm">
                        Save draft
                      </Button>
                      <Button type="button" size="sm">
                        <Send className="size-4" aria-hidden />
                        Post reply
                      </Button>
                    </div>
                  </div>
                </form>
              </article>
            ) : (
              <>
                <form
                  id="start-thread"
                  className="scroll-mt-28 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
                  aria-labelledby="start-thread-title"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3
                        id="start-thread-title"
                        className="hearst-community-display text-2xl font-bold leading-tight"
                      >
                        Start a thread
                      </h3>
                      <p className="hearst-community-copy mt-1 text-sm leading-6 text-[var(--hp-text-secondary)]">
                        Ask a question, invite writer input, or share something
                        other readers can answer.
                      </p>
                    </div>
                    <span className="rounded-[8px] bg-[var(--hp-control)] px-3 py-1.5 text-xs font-bold text-[var(--hp-text-secondary)]">
                      Reader started
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <label
                      htmlFor="community-thread-title"
                      className="grid gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
                    >
                      Thread title
                      <input
                        id="community-thread-title"
                        name="title"
                        type="text"
                        placeholder="What do you want to ask or share?"
                        className="hearst-community-copy min-h-11 rounded-[8px] border border-primary/15 bg-[#eef7ff] px-3 text-sm font-normal text-[var(--hp-text-primary)] outline-none transition-colors placeholder:text-[var(--hp-text-secondary)] focus-visible:border-primary focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.42fr)]">
                      <label
                        htmlFor="community-thread-body"
                        className="grid gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
                      >
                        Opening post
                        <Textarea
                          id="community-thread-body"
                          name="body"
                          placeholder="Give people enough context to reply."
                          className="hearst-community-copy min-h-28 resize-y border-primary/15 bg-[#eef7ff] text-sm font-normal leading-6 focus-visible:bg-white"
                        />
                      </label>
                      <label
                        htmlFor="community-thread-type"
                        className="grid content-start gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
                      >
                        Thread type
                        <select
                          id="community-thread-type"
                          name="type"
                          className="hearst-community-copy min-h-11 rounded-[8px] border border-primary/15 bg-[#eef7ff] px-3 text-sm font-normal text-[var(--hp-text-primary)] outline-none transition-colors focus-visible:border-primary focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-ring/50"
                          defaultValue="reader"
                        >
                          <option value="reader">Reader question</option>
                          <option value="writer">Ask the writers</option>
                          <option value="forum">Open discussion</option>
                          <option value="challenge">Community challenge</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]">
                      Sign in to publish across devices. Drafts can start here.
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
                        Publish thread
                      </Button>
                    </div>
                  </div>
                </form>

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
                      className="group p-4 transition-colors hover:bg-[#eef7ff] sm:p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <Link
                            href={thread.href}
                            className="flex min-w-0 items-start gap-4 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                            aria-label={`Open thread: ${thread.title}`}
                          >
                            <BrandSourceIcon
                              brand={thread.brand}
                              brandSlug={thread.brandSlug}
                              className="h-11 w-11 shrink-0 rounded-[8px]"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[var(--hp-text-secondary)]">
                                <span>{thread.author}</span>
                                <span aria-hidden>·</span>
                                <span>{kindLabels[thread.kind]}</span>
                                <span aria-hidden>·</span>
                                <span>{thread.meta}</span>
                              </span>
                              <h3
                                id={`thread-${thread.id}-title`}
                                className="hearst-community-display mt-2 text-2xl font-bold leading-snug transition-colors group-hover:text-primary"
                              >
                                {thread.title}
                              </h3>
                              <span
                                id={`thread-${thread.id}-summary`}
                                className="hearst-community-copy mt-2 block line-clamp-2 text-sm leading-6 text-[var(--hp-text-ui)]"
                              >
                                {thread.body}
                              </span>
                            </span>
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
                              Follow
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
              <h2 className="hearst-community-display text-xl font-bold leading-tight">
                Featured clubs
              </h2>
              <div className="mt-4 space-y-3">
                {featuredCommunities.map((item) => {
                  if (!item) return null;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.brand.brandSlug}
                      href={`/communities/${item.brand.brandSlug}/`}
                      className="block rounded-[8px] border border-primary/15 bg-[#eef7ff] p-3 transition-colors hover:border-primary/45 hover:bg-[#e4f2ff]"
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

            <section className="rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]">
              <h2 className="hearst-community-display text-xl font-bold leading-tight">
                Community model
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--hp-text-ui)]">
                {[
                  {
                    icon: Newspaper,
                    title: "Article comments",
                    body: "Attached to a story and surfaced again in the community feed.",
                  },
                  {
                    icon: Star,
                    title: "Writer prompts",
                    body: "Editors and contributors can ask readers what to cover, test, or explain next.",
                  },
                  {
                    icon: MessageCircle,
                    title: "Reader threads",
                    body: "Readers can ask questions, swap advice, and return to conversations by brand.",
                  },
                  {
                    icon: Shield,
                    title: "Shared rules",
                    body: "One account, moderation, reporting, and saved-thread layer.",
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
                Create
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
              { label: "Delish clubs", href: "/communities/delish/" },
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
