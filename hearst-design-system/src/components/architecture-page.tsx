"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductFooter, ProductHeader } from "./product-story-shell";
import { AdaptiveVideo } from "@/components/adaptive-video";
import {
  Bookmark,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "@/components/ui/icons";

// ─── Global Components Data ───
interface GlobalComponentDoc {
  name: string;
  category: "Navigation & Masthead" | "Theme & Identity" | "Reader & Shell" | "Diagnostics & Controls";
  filePath: string;
  usedInHome: boolean;
  usedInArticle: boolean;
  description: string;
  tokensUsed: string[];
  keyProps: string[];
  accessibilityRole: string;
}

const GLOBAL_COMPONENTS: GlobalComponentDoc[] = [
  {
    name: "UtilityBar",
    category: "Navigation & Masthead",
    filePath: "src/components/hearst-plus/utility-bar.tsx",
    usedInHome: true,
    usedInArticle: false,
    description: "Universal top-level chrome providing destination switching (All, Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness), brand dropdowns with logos, search trigger, theme toggle, and user profile drawer launcher.",
    tokensUsed: ["--utility-bar-background", "--utility-bar-foreground", "--palette-brand-primary"],
    keyProps: ["activeDestination", "activeBrandSlug", "onSearchClick", "onProfileClick"],
    accessibilityRole: "Banner landmark (<header>), contextual dropdowns with keyboard arrow navigation and Escape dismissal.",
  },
  {
    name: "MainNav / NavBar",
    category: "Navigation & Masthead",
    filePath: "src/components/home-page.tsx / src/components/nav-bar.tsx",
    usedInHome: true,
    usedInArticle: true,
    description: "Brand masthead and responsive category pills navigation (e.g. For You, Food & Drink, Home, Style, Tech, Videos, Saved) with smooth horizontal scrolling and mobile hamburger drawer.",
    tokensUsed: ["--color-background", "--color-foreground", "--border-subtle", "--font-brand-headline"],
    keyProps: ["brandSlug", "activeCategory", "onCategoryChange", "showSavedCount"],
    accessibilityRole: "Navigation landmark (<nav aria-label='Primary'>), active tab states marked with aria-current='page' or aria-selected='true'.",
  },
  {
    name: "ThemeProvider",
    category: "Theme & Identity",
    filePath: "src/components/theme-provider.tsx",
    usedInHome: true,
    usedInArticle: true,
    description: "Multi-brand context provider that sets the active data-brand attribute on the DOM, injecting publication-specific typography, color palettes, border radii, and light/dark modes.",
    tokensUsed: ["data-brand attribute", "--font-headline", "--font-body", "--primary", "--secondary"],
    keyProps: ["defaultBrandSlug", "children", "storageKey"],
    accessibilityRole: "Ensures contrast token compliance (WCAG AA) and passes system prefers-color-scheme / prefers-reduced-motion.",
  },
  {
    name: "ReaderAccountProvider & UI",
    category: "Theme & Identity",
    filePath: "src/components/reader-account.tsx / src/components/reader-account-ui.tsx",
    usedInHome: true,
    usedInArticle: true,
    description: "Client-side identity layer managing browser-local preferences, Google One Tap sign-in, reading history, saved bookmarks, custom collections, and followed topics/brands.",
    tokensUsed: ["--surface-elevated", "--border-default", "--color-primary"],
    keyProps: ["user", "savedStories", "history", "onSaveStory", "onFollowBrand"],
    accessibilityRole: "Modal dialog with focus trap, backdrop isolation (aria-hidden on background), and keyboard shortcut binding.",
  },
  {
    name: "ContentReaderDialogShell",
    category: "Reader & Shell",
    filePath: "src/components/hearst-plus/content-reader-dialog-shell.tsx",
    usedInHome: true,
    usedInArticle: true,
    description: "Slide-over and modal reader container that allows readers to open full articles directly from the feed without page reloads, retaining scroll position and seamless return URLs (/read/[storyId]).",
    tokensUsed: ["--reader-background", "--reader-foreground", "--reader-max-width"],
    keyProps: ["storyId", "isOpen", "onClose", "returnHref", "initialLiveArticle"],
    accessibilityRole: "Dialog role (role='dialog' aria-modal='true'), traps keyboard focus, listens for Escape key, and restores scroll position.",
  },
  {
    name: "ReaderActionBar",
    category: "Reader & Shell",
    filePath: "src/components/hearst-plus/reader-action-bar.tsx",
    usedInHome: false,
    usedInArticle: true,
    description: "Compact floating/pinned reading utility row with author byline, publication date, follow brand toggle, bookmark action, social share, text density toggle, and Ambient Reader trigger ('P' shortcut).",
    tokensUsed: ["--surface-neutral-subtle", "--color-accent", "--font-ui"],
    keyProps: ["story", "isSaved", "isFollowed", "onToggleSave", "onOpenAmbient"],
    accessibilityRole: "Toolbar landmark (role='toolbar' aria-label='Story actions'), button tooltips, explicit keyboard shortcuts.",
  },
  {
    name: "SiteFooter / ProductFooter",
    category: "Navigation & Masthead",
    filePath: "src/components/fre/site-footer.tsx / src/components/product-story-shell.tsx",
    usedInHome: true,
    usedInArticle: true,
    description: "Universal multi-column footer displaying publication branding, social links, editorial network portfolio, legal notices (Privacy, Terms), and prototype fine-print.",
    tokensUsed: ["--footer-background", "--footer-foreground", "--footer-link-hover"],
    keyProps: ["siteName", "productLinkGroups", "socialLinks", "legalLinks", "finePrintNote"],
    accessibilityRole: "Contentinfo landmark (<footer role='contentinfo'>) with grouped navigation blocks.",
  },
  {
    name: "StakeholderPersonalizationConsole",
    category: "Diagnostics & Controls",
    filePath: "src/components/hearst-plus/stakeholder-personalization-console.tsx",
    usedInHome: true,
    usedInArticle: true,
    description: "Executive and engineering inspection overlay enabled via ?demo=1 or stakeholder toggle, explaining live feed scoring weights, brand diversity filters, and data pipeline health.",
    tokensUsed: ["--code-background", "--accent-warning", "--surface-card"],
    keyProps: ["isOpen", "onClose", "scoringFactors", "catalogStats"],
    accessibilityRole: "Accessible diagnostic dialog with focus lock and keybinding controls.",
  },
];

// ─── Sidebar Rails Data ───
const SIDEBAR_RAILS = [
  {
    id: "discovery-sidebar",
    name: "DiscoverySidebar",
    location: "Home / Index Page",
    role: "Content Filtering & Exploration",
    description: "Multi-dimensional faceted filtering for the active river feed. Allows readers to filter by publication brands (with live inventory counts), topics, and formats (Articles, Videos, Galleries, Guides).",
    componentsContained: ["BrandFilterList", "CategoryTopicSelector", "FormatPills", "GlobalStoryInventoryCount"],
    mobileTreatment: "Collapses into top filter bar and mobile drawer to preserve vertical reading height.",
  },
  {
    id: "local-news-rail",
    name: "LocalNewsRail",
    location: "Home / Index Page",
    role: "Local Broadcasting & Station Feeds",
    description: "Connects readers with local Hearst TV broadcast news stations (e.g. WCVB Boston, KCRA Sacramento, WBAL Baltimore) with regional weather alerts, live broadcasts, and municipal reporting.",
    componentsContained: ["StationLogoHeader", "LiveStreamBadge", "LocalWeatherWidget", "RegionalStoryList"],
    mobileTreatment: "Renders as a dedicated swipeable carousel or collapsible local briefing module.",
  },
  {
    id: "trending-rail",
    name: "TrendingRail",
    location: "Home & Article Pages",
    role: "Velocity & Popularity Discovery",
    description: "Real-time algorithmic rank of the fastest-growing stories across the Hearst portfolio, calculated from reader engagement, social velocity, and freshness signals.",
    componentsContained: ["NumberedRankBadge", "TrendingStoryCard", "VelocityIndicator", "TimeAgoMeta"],
    mobileTreatment: "Appears between thematic sections in the river or in the article footer queue.",
  },
  {
    id: "your-daily-habit",
    name: "Your Daily Habit / Continue Reading",
    location: "Home Page",
    role: "Retention & Reading Continuity",
    description: "Maintains a persistent queue of stories the reader started but has not finished, alongside a morning digest and curated daily habit recommendations.",
    componentsContained: ["ReadingProgressRing", "UnfinishedStoryList", "DailyChecklist", "EstimatedTimeToFinish"],
    mobileTreatment: "Appears as a compact 1-line top banner directly under category navigation when unfinished history exists.",
  },
  {
    id: "context-rail",
    name: "ContentReaderContextRail",
    location: "Article / Detail Page",
    role: "Editorial Context & Author Bio",
    description: "Displays publication credentials, author biography and headshot, photographer/editor credits, and 'More from this Issue' contextual reading lists.",
    componentsContained: ["AuthorBioCard", "PublicationMissionStatement", "IssueRelatedStories", "SocialFollowLinks"],
    mobileTreatment: "Moves below the article body before comments and recommendations.",
  },
  {
    id: "fact-rail",
    name: "FactRail & Key Takeaways",
    location: "Article / Immersive Template",
    role: "Executive Summary & Key Data",
    description: "Structured, quick-scan card listing key facts, dates, specifications, or key takeaways for complex journalism and vehicle/gear reviews.",
    componentsContained: ["KeyTakeawayList", "SpecGrid", "FactPill", "ExecutiveSummaryBlock"],
    mobileTreatment: "Rendered as an expandable summary accordion directly below the hero deck.",
  },
];

function SectionHead({ label, title, copy }: { label: string; title: string; copy: string }) {
  return (
    <header className="border-t-2 border-[#102A43] pt-6">
      <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">{label}</p>
      <h2 className="mt-3 max-w-4xl text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-[#102A43] md:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{copy}</p>
    </header>
  );
}

export function ArchitecturePageComponent() {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "global" | "home" | "article" | "sidebars" | "content" | "orchestration"
  >("overview");

  const [homeLayoutVariant, setHomeLayoutVariant] = useState<"curator" | "mosaic" | "stream" | "editorial">("curator");
  const [articleModeVariant, setArticleModeVariant] = useState<"standard" | "immersive" | "ambient" | "modal">("standard");

  // Video playback interactive states
  const [isLandscapeVideoPlaying, setIsLandscapeVideoPlaying] = useState(false);
  const [isVerticalVideoPlaying, setIsVerticalVideoPlaying] = useState(false);
  const [isVerticalVideoMuted, setIsVerticalVideoMuted] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#102A43] font-sans antialiased">
      {/* Universal Product Header */}
      <ProductHeader current="architecture" />

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-[#102A43] text-white">
        <div className="mx-auto max-w-[1360px] px-5 py-16 md:px-10 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Hearst Platform Architecture
          </p>

          <h1 className="mt-6 max-w-5xl text-balance font-serif text-5xl font-bold leading-[0.95] tracking-[-0.03em] md:text-7xl lg:text-8xl">
            Two Core Templates. One Editorial System.
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            A comprehensive architectural breakdown of the Hearst platform: defining the two fundamental page archetypes (<strong>Home/Index Pages</strong> &amp; <strong>Article/Detail Pages</strong>), the shared global runtime components, sidebar rail anatomy, and modular content type models across the 29+ publication network.
          </p>

          {/* Stats Grid */}
          <div className="mt-12 grid gap-px bg-slate-700/60 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { number: "2", label: "Core Page Archetypes", sub: "Home/Index & Article/Detail" },
              { number: "8", label: "Global Runtime Modules", sub: "Navigation, state, footer & auth" },
              { number: "6", label: "Sidebar Rail Patterns", sub: "Discovery, trending, local & context" },
              { number: "8+", label: "Content Card Models", sub: "Articles, galleries, video & shorts" },
              { number: "29+", label: "Publication Themes", sub: "Dynamic data-brand tokens" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#102A43] p-5">
                <span className="font-serif text-3xl font-bold text-white md:text-4xl">{stat.number}</span>
                <p className="mt-2 text-xs font-bold text-sky-300">{stat.label}</p>
                <p className="mt-1 text-[11px] text-slate-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Editorial Tab Navigation */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 py-2 md:px-10">
          <nav
            aria-label="Architecture sections"
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-hide py-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[
              { id: "overview", label: "Overview" },
              { id: "global", label: "Global Components" },
              { id: "home", label: "Template 1: Home & Index" },
              { id: "article", label: "Template 2: Article & Detail" },
              { id: "sidebars", label: "Sidebar Rails" },
              { id: "content", label: "Content Types & Cards" },
              { id: "orchestration", label: "Feed Orchestration" },
            ].map((tab) => {
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`inline-flex min-h-9 shrink-0 items-center whitespace-nowrap px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#102A43] text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center border-l border-slate-200 pl-4 lg:flex">
            <Link
              href="/hearst-plus/"
              className="inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap text-xs font-bold text-[#2D75B9] hover:underline"
            >
              Open Live App <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-[1360px] px-5 py-12 md:px-10 lg:py-16">
        {/* ─── TAB 1: OVERVIEW & STACK ─── */}
        {selectedTab === "overview" && (
          <div className="space-y-16">
            <SectionHead
              label="System Hierarchy"
              title="The 5-Layer Architectural Model"
              copy="Every surface in Hearst+ is constructed through a strictly structured 5-layer hierarchy. Primitives never reach across boundaries, and every publication theme inherits from base foundation tokens before applying its brand voice."
            />

            {/* Clean Monochromatic Editorial Layer Grid */}
            <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  step: "01",
                  title: "Design Tokens",
                  subtitle: "Canonical Source of Truth",
                  description: "435 core tokens + 13 semantic JSON sets compiled via Style Dictionary into CSS custom properties and TypeScript theme maps.",
                  location: "tokens/",
                },
                {
                  step: "02",
                  title: "UI Primitives",
                  subtitle: "Accessible Foundations",
                  description: "Buttons, badges, cards, inputs, dialogs, and aspect containers built on accessible shadcn/ui and Radix foundations.",
                  location: "src/components/ui/",
                },
                {
                  step: "03",
                  title: "Global Modules",
                  subtitle: "Universal Runtime Shell",
                  description: "UtilityBar, NavBar, ThemeProvider, ReaderAccountProvider, and SiteFooter maintaining state across all routes.",
                  location: "src/components/hearst-plus/",
                },
                {
                  step: "04",
                  title: "2 Page Archetypes",
                  subtitle: "Core Experience Templates",
                  description: "HomePageTemplate (discovery, feeds, layout variants) and ArticlePageTemplate (longform, immersive, ambient).",
                  location: "src/components/",
                },
                {
                  step: "05",
                  title: "29+ Brands",
                  subtitle: "Publication Identities",
                  description: "Cosmopolitan, Delish, Elle, Car and Driver, Good Housekeeping, etc., applied dynamically via data-brand tokens.",
                  location: "tokens/brands/",
                },
              ].map((layer) => (
                <div key={layer.step} className="flex flex-col justify-between bg-white p-6">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-mono text-xs font-bold text-[#2D75B9]">LAYER {layer.step}</span>
                      <code className="text-[10px] text-slate-500">{layer.location}</code>
                    </div>
                    <h3 className="mt-4 font-bold text-lg text-[#102A43]">{layer.title}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">{layer.subtitle}</p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">{layer.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* The Two Archetypes Side-by-Side Comparison */}
            <div className="border border-slate-200 bg-white p-8">
              <h3 className="font-serif text-2xl font-bold text-[#102A43]">
                The Two Core Page Archetypes at a Glance
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Regardless of the publication or destination, the user experience flows entirely through two master templates:
              </p>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {/* Template 1 Card */}
                <div className="border-t-2 border-[#102A43] bg-[#F8FAFC] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#102A43]">Template 1</span>
                    <span className="text-xs font-semibold text-slate-500">Discovery Engine</span>
                  </div>
                  <h4 className="mt-3 text-2xl font-bold text-[#102A43]">Home Page &amp; Index Pages</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Responsible for discovery, topic navigation, real-time personalization, curated daily editions, video spotlighting, and multi-brand exploration.
                  </p>

                  <div className="mt-6 space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[#102A43]" />
                      <span><strong>Key Routes:</strong> <code>/hearst-plus/</code>, <code>/hearst-lifestyle</code>, <code>/autos/delish</code></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[#102A43]" />
                      <span><strong>Layouts:</strong> Curator (lead hero), Mosaic (visual grid), Stream, Editorial</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[#102A43]" />
                      <span><strong>Feed Engine:</strong> Blends RSS catalog + Personalize live feed + playable Video</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[#102A43]" />
                      <span><strong>Sidebars:</strong> Discovery filter rail, Trending, Local News, Your Daily Habit</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTab("home")}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#2D75B9] hover:underline"
                  >
                    Deep Dive Template 1 <ChevronRight className="size-3.5" />
                  </button>
                </div>

                {/* Template 2 Card */}
                <div className="border-t-2 border-[#2D75B9] bg-[#F8FAFC] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Template 2</span>
                    <span className="text-xs font-semibold text-slate-500">Reading Engine</span>
                  </div>
                  <h4 className="mt-3 text-2xl font-bold text-[#102A43]">Article Page &amp; Detail Pages</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Responsible for distraction-free reading, immersive visual essays, deep author context, commerce product recommendations, and interactive media.
                  </p>

                  <div className="mt-6 space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[#2D75B9]" />
                      <span><strong>Key Routes:</strong> <code>/read/[storyId]</code>, <code>/hearst-article-blueprint</code></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[#2D75B9]" />
                      <span><strong>Reading Modes:</strong> Standard Longform (8+4 grid), Immersive Feature, Ambient Snap Track</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[#2D75B9]" />
                      <span><strong>In-App Dialog Shell:</strong> Reads full article without losing scroll position in the river</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-[#2D75B9]" />
                      <span><strong>Sidebars:</strong> Author bio context rail, Fact sheets, Display ad units, Related stories</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTab("article")}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#2D75B9] hover:underline"
                  >
                    Deep Dive Template 2 <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: GLOBAL COMPONENTS ─── */}
        {selectedTab === "global" && (
          <div className="space-y-12">
            <SectionHead
              label="Component Matrix"
              title="Global Components Shared Across Templates"
              copy="These core modules wrap, bridge, and support both the Home/Index and Article/Detail templates, ensuring consistent state, theme inheritance, authentication, and accessibility across the application."
            />

            {/* Matrix Grid */}
            <div className="grid gap-px bg-slate-200 md:grid-cols-2">
              {GLOBAL_COMPONENTS.map((comp) => (
                <div key={comp.name} className="flex flex-col justify-between bg-white p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D75B9]">{comp.category}</span>
                        <h3 className="mt-1 text-xl font-bold text-[#102A43]">{comp.name}</h3>
                        <code className="mt-1 block text-xs text-slate-500">{comp.filePath}</code>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1 text-[10px] font-semibold text-slate-500">
                        {comp.usedInHome && <span className="border border-slate-300 px-2 py-0.5">Home/Index</span>}
                        {comp.usedInArticle && <span className="border border-slate-300 px-2 py-0.5">Article/Detail</span>}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{comp.description}</p>

                    <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs">
                      <div>
                        <span className="font-bold text-[#102A43]">Tokens: </span>
                        <span className="font-mono text-slate-600">{comp.tokensUsed.join(", ")}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#102A43]">Accessibility: </span>
                        <span className="text-slate-600">{comp.accessibilityRole}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: TEMPLATE 1 (HOME & INDEX) ─── */}
        {selectedTab === "home" && (
          <div className="space-y-16">
            <SectionHead
              label="Template 1 Specification"
              title="Home Page &amp; Index Pages Archetype"
              copy="The Home &amp; Index template orchestrates multiple content sources (RSS inventories, Personalize live feeds, video APIs) into responsive, high-engagement layouts."
            />

            {/* Technical Wireframe Blueprint */}
            <div className="border border-slate-200 bg-white p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#102A43]">Structural Wireframe Architecture</h3>
                  <p className="text-xs text-slate-500">Component boundaries, 12-column grid placement, and feed modules</p>
                </div>

                {/* Layout Variant Switcher */}
                <div className="flex items-center border border-slate-300 bg-white">
                  {(["curator", "mosaic", "stream", "editorial"] as const).map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setHomeLayoutVariant(variant)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                        homeLayoutVariant === variant
                          ? "bg-[#102A43] text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wireframe Diagram */}
              <div className="mt-8 space-y-4 border border-slate-300 bg-[#F8FAFC] p-6">
                {/* Zone: Utility Bar */}
                <div className="border border-slate-300 bg-white p-3 text-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#102A43]">ZONE 1: Utility Bar</span>
                    <code className="text-[10px] text-slate-500">&lt;UtilityBar /&gt;</code>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Destination Switcher (All / Lifestyle / Autos / Flux / EW) • Brand Dropdown • Search • Theme Toggle</p>
                </div>

                {/* Zone: Main Navigation */}
                <div className="border border-slate-300 bg-white p-3 text-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#102A43]">ZONE 2: Masthead &amp; Category Navigation</span>
                    <code className="text-[10px] text-slate-500">&lt;MainNav /&gt;</code>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Hearst+ Brand Logo • Category Tabs (For You / Food / Home / Style / Tech / Videos / Saved)</p>
                </div>

                {/* Zone: Today's Edit & Hero Carousel */}
                <div className="border border-[#102A43] bg-white p-4 text-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#102A43]">ZONE 3: Today's Edit &amp; Featured Carousel</span>
                    <code className="text-[10px] text-[#2D75B9]">&lt;FeaturedStoryCarousel /&gt; &amp; &lt;TodayEditStrip /&gt;</code>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    5-Slide Mixed-Media Lead Hero (3 Editorial Anchors + 1 Live RSS Story + 1 Playable Video)
                  </p>
                </div>

                {/* Zone: Main River & Sidebars (12-Column Grid) */}
                <div className="grid gap-4 lg:grid-cols-12">
                  {/* Left/Main River: 8 Columns */}
                  <div className="border border-slate-300 bg-white p-5 lg:col-span-8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#102A43]">ZONE 4: Main Editorial River (8 Columns)</span>
                      <code className="text-[10px] text-slate-500">&lt;LifestyleRiverCard /&gt;</code>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-600">
                        <strong className="uppercase text-[#102A43]">{homeLayoutVariant} layout mode active:</strong>{" "}
                        {homeLayoutVariant === "curator" && "BigStory Lead Hero + 3-Story Cluster + Delish Shorts 9:16 Carousel + FourAcrossGrid"}
                        {homeLayoutVariant === "mosaic" && "RichPhotoGalleryCard (5-image mosaic) + Asymmetric visual spotlight cards"}
                        {homeLayoutVariant === "stream" && "High-density chronological feed with inline metadata and fast scanning"}
                        {homeLayoutVariant === "editorial" && "Structured magazine front with section dividers, pullquotes, and curated columns"}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-[10px] text-slate-500">
                        <div className="border border-slate-200 bg-white p-2">Standard Article Card</div>
                        <div className="border border-slate-200 bg-white p-2">16:9 Video Card</div>
                        <div className="border border-slate-200 bg-white p-2">Sponsored River Ad</div>
                        <div className="border border-slate-200 bg-white p-2">Photo Gallery Card</div>
                      </div>

                      <div className="border border-dashed border-slate-400 bg-white p-2 text-center text-[10px] font-semibold text-[#102A43]">
                        Demand-Driven Sentinel (Appends 4 Ranked Cards on Proximity)
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar Rails: 4 Columns */}
                  <div className="space-y-3 border border-slate-300 bg-white p-5 lg:col-span-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#102A43]">ZONE 5: Sidebar Rails (4 Cols)</span>
                      <code className="text-[10px] text-slate-500">&lt;RightRail /&gt;</code>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="border border-slate-200 bg-[#F8FAFC] p-2.5">
                        <strong className="text-[#102A43]">DiscoverySidebar</strong>
                        <p className="text-[11px] text-slate-500">Brand filter with inventory counts &amp; format pills</p>
                      </div>
                      <div className="border border-slate-200 bg-[#F8FAFC] p-2.5">
                        <strong className="text-[#102A43]">Your Daily Habit</strong>
                        <p className="text-[11px] text-slate-500">Continue reading in-progress articles</p>
                      </div>
                      <div className="border border-slate-200 bg-[#F8FAFC] p-2.5">
                        <strong className="text-[#102A43]">TrendingRail</strong>
                        <p className="text-[11px] text-slate-500">High-velocity cross-brand stories</p>
                      </div>
                      <div className="border border-slate-200 bg-[#F8FAFC] p-2.5">
                        <strong className="text-[#102A43]">LocalNewsRail</strong>
                        <p className="text-[11px] text-slate-500">Hearst TV station broadcast feeds</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zone: Footer */}
                <div className="border border-slate-300 bg-white p-3 text-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#102A43]">ZONE 6: Universal Footer</span>
                    <code className="text-[10px] text-slate-500">&lt;SiteFooter /&gt;</code>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Brand Portfolio Navigation • Legal Notices • Subscriptions • Prototype Fine-Print</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: TEMPLATE 2 (ARTICLE & DETAIL) ─── */}
        {selectedTab === "article" && (
          <div className="space-y-16">
            <SectionHead
              label="Template 2 Specification"
              title="Article Page &amp; Detail Pages Archetype"
              copy="The Article &amp; Detail template delivers the complete reading experience. It supports 4 distinct reading modes, dynamic hero layouts, structured fact sheets, inline galleries, and verified commerce product blocks."
            />

            {/* Reading Modes Selector */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  id: "standard",
                  title: "Standard Longform",
                  desc: "Classic 8+4 grid with reading column, floating action bar, and context rail.",
                  component: "ArticlePageTemplate",
                },
                {
                  id: "immersive",
                  title: "Cinematic Feature",
                  desc: "Full-bleed hero, visual essay scenes, before/after media, and fact sheet overlays.",
                  component: "ArticleImmersiveTemplate",
                },
                {
                  id: "ambient",
                  title: "Ambient Reader",
                  desc: "Full-screen horizontal snap track with airy typography and zero clutter ('P' key).",
                  component: "AmbientReader",
                },
                {
                  id: "modal",
                  title: "Slide-Over Dialog",
                  desc: "Modal reader layered over the river without losing scroll position or URL context.",
                  component: "ContentReaderDialogShell",
                },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setArticleModeVariant(mode.id as any)}
                  className={`flex flex-col justify-between border p-5 text-left transition-colors ${
                    articleModeVariant === mode.id
                      ? "border-[#102A43] bg-white shadow-xs"
                      : "border-slate-200 bg-[#F8FAFC] hover:border-slate-300"
                  }`}
                >
                  <div>
                    <code className="text-[10px] font-bold text-[#2D75B9]">{mode.component}</code>
                    <h3 className="mt-1 font-bold text-base text-[#102A43]">{mode.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{mode.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Article Blueprint Wireframe */}
            <div className="border border-slate-200 bg-white p-6 md:p-8">
              <h3 className="font-serif text-2xl font-bold text-[#102A43]">
                Article Anatomy Architecture ({articleModeVariant.toUpperCase()} MODE)
              </h3>
              <p className="mt-1 text-xs text-slate-500">Component boundaries, reading column anatomy, and rails</p>

              <div className="mt-6 space-y-4 border border-slate-300 bg-[#F8FAFC] p-6">
                {/* Article Header & Masthead */}
                <div className="border border-slate-300 bg-white p-3 text-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#102A43]">1. Contextual Publication Masthead</span>
                    <code className="text-[10px] text-slate-500">&lt;ContentReaderMasthead /&gt;</code>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Inherited Brand Logo • Destination Switcher Carousel • Back/Close Trigger</p>
                </div>

                {/* Article Hero */}
                <div className="border border-[#102A43] bg-white p-5 text-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#102A43]">2. Dynamic Article Hero Block</span>
                    <code className="text-[10px] text-[#2D75B9]">&lt;ArticleHero /&gt;</code>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Supports Split Cover Spread, Cinematic Widescreen, Standard Grid Crop, or Portrait Cover (Auto-adapts to image aspect ratio)
                  </p>
                </div>

                {/* Action Bar */}
                <div className="border border-slate-300 bg-white p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#102A43]">3. Reader Action Bar</span>
                    <code className="text-[10px] text-slate-500">&lt;ReaderActionBar /&gt;</code>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs">
                    <span>Byline: <strong>Author Name</strong> (Resolved from JSON-LD / RSS)</span>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="border border-slate-300 px-2 py-0.5 font-semibold">+ Follow Brand</span>
                      <span className="border border-slate-300 px-2 py-0.5">Save</span>
                      <span className="border border-slate-300 px-2 py-0.5">Share</span>
                      <span className="bg-[#102A43] px-2 py-0.5 text-white font-bold">Ambient Reader (P)</span>
                    </div>
                  </div>
                </div>

                {/* Grid: Reading Column (8 Cols) vs Context Rail (4 Cols) */}
                <div className="grid gap-4 lg:grid-cols-12">
                  <div className="space-y-3 border border-slate-300 bg-white p-5 lg:col-span-8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#102A43]">4. Editorial Body Column (8 Cols)</span>
                      <code className="text-[10px] text-slate-500">&lt;ArticleBody /&gt;</code>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="border border-slate-200 bg-[#F8FAFC] p-2.5 leading-relaxed">
                        • <strong>Rich Editorial Typography:</strong> Drop caps, calibrated line heights, responsive font scaling.
                      </p>
                      <p className="border border-slate-200 bg-[#F8FAFC] p-2.5 leading-relaxed">
                        • <strong>Embedded Media:</strong> Full-resolution aspect-preserved images, zoomable galleries, embedded HLS video.
                      </p>
                      <p className="border border-slate-200 bg-[#F8FAFC] p-2.5 leading-relaxed">
                        • <strong>Pull Quotes (&lt;PullQuote /&gt;):</strong> Styled quotes inheriting brand display typefaces.
                      </p>
                      <p className="border border-slate-200 bg-[#F8FAFC] p-2.5 leading-relaxed text-[#102A43]">
                        • <strong>Ambient Commerce (&lt;ImmersiveArticleProductReview /&gt;):</strong> Verified products with real photos, prices, pros/cons, and merchant links.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 border border-slate-300 bg-white p-5 lg:col-span-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#102A43]">5. Context Rail (4 Cols)</span>
                      <code className="text-[10px] text-slate-500">&lt;ContentReaderContextRail /&gt;</code>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="border border-slate-200 bg-[#F8FAFC] p-2">
                        <strong>Author Credentials &amp; Headshot</strong>
                      </div>
                      <div className="border border-slate-200 bg-[#F8FAFC] p-2">
                        <strong>Publication Mission Statement</strong>
                      </div>
                      <div className="border border-slate-200 bg-[#F8FAFC] p-2">
                        <strong>Fact Sheet / Takeaways (&lt;FactRail /&gt;)</strong>
                      </div>
                      <div className="border border-slate-200 bg-[#F8FAFC] p-2">
                        <strong>Contextual Display Ad Slot</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Modules */}
                <div className="border border-slate-300 bg-white p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#102A43]">6. Post-Article Engagement Queue</span>
                    <code className="text-[10px] text-slate-500">&lt;ContentReaderRecommendations /&gt;</code>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Community Comments (&lt;ContentReaderComments /&gt;) • Algorithmic "Up Next" Queue • Next Article in Continuous Snap Stream
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: SIDEBAR RAILS ─── */}
        {selectedTab === "sidebars" && (
          <div className="space-y-12">
            <SectionHead
              label="Layout Rails"
              title="Sidebar Rails &amp; Layout Infrastructure"
              copy="The Hearst layout system uses responsive 4-column companion rails on desktop (inside a standard 12-column grid container) that collapse cleanly into drawers, carousels, or inline modules on tablet and mobile viewports."
            />

            <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {SIDEBAR_RAILS.map((rail) => (
                <div key={rail.id} className="flex flex-col justify-between bg-white p-6">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D75B9]">{rail.role}</span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[#102A43]">{rail.name}</h3>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">{rail.location}</p>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">{rail.description}</p>

                    <div className="mt-4 border-t border-slate-100 pt-3 text-xs">
                      <strong className="text-slate-700">Contained Components:</strong>
                      <ul className="mt-1.5 space-y-1 text-[11px] text-slate-600">
                        {rail.componentsContained.map((comp) => (
                          <li key={comp} className="flex items-center gap-1.5">
                            <span className="size-1 rounded-full bg-[#102A43]" />
                            {comp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-semibold text-[#102A43]">Mobile Adaptation:</span>
                    <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{rail.mobileTreatment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 6: CONTENT TYPES & CARDS (EXPANDED DETAILED SPECIMENS) ─── */}
        {selectedTab === "content" && (
          <div className="space-y-20">
            <SectionHead
              label="Content Models"
              title="Content Types &amp; Card Architecture Specimens"
              copy="Every card model in the Hearst Design System is engineered for editorial integrity, responsive balance, and reader trust. Generic type chips ('Article', 'Watch') are strictly eliminated in favor of contextual brand icons, topic kickers, 3-line clamped headlines, and verified media metadata."
            />

            {/* Quick Specimen Jumps */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">Jump to Card Model:</span>
              <a href="#specimen-standard" className="border border-slate-300 bg-white px-2.5 py-1 text-slate-700 hover:border-[#102A43] hover:text-[#102A43]">Standard Article</a>
              <a href="#specimen-gallery" className="border border-slate-300 bg-white px-2.5 py-1 text-slate-700 hover:border-[#102A43] hover:text-[#102A43]">5-Image Photo Gallery</a>
              <a href="#specimen-video" className="border border-slate-300 bg-white px-2.5 py-1 text-slate-700 hover:border-[#102A43] hover:text-[#102A43]">16:9 Adaptive Video</a>
              <a href="#specimen-shorts" className="border border-slate-300 bg-white px-2.5 py-1 text-slate-700 hover:border-[#102A43] hover:text-[#102A43]">9:16 Delish Shorts</a>
              <a href="#specimen-bigstory" className="border border-slate-300 bg-white px-2.5 py-1 text-slate-700 hover:border-[#102A43] hover:text-[#102A43]">Big Story Lead Cover</a>
              <a href="#specimen-commerce" className="border border-slate-300 bg-white px-2.5 py-1 text-slate-700 hover:border-[#102A43] hover:text-[#102A43]">Ambient Commerce Review</a>
            </div>

            {/* ─── SPECIMEN 1: STANDARD ARTICLE CARD ─── */}
            <section id="specimen-standard" className="scroll-mt-16 space-y-8 border-t-2 border-[#102A43] pt-10">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Card Model 01</span>
                  <h3 className="mt-1 font-serif text-3xl font-bold text-[#102A43]">Standard River Article Card</h3>
                  <p className="mt-2 text-sm text-slate-600">The foundational editorial river card utilized across all category feeds, personal For You rivers, and search results.</p>
                </div>
                <code className="self-start rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">src/components/home-page.tsx (&lt;LifestyleRiverCard /&gt;)</code>
              </div>

              <div className="grid gap-10 lg:grid-cols-12">
                {/* Left: Architectural Contract & Rules */}
                <div className="space-y-4 text-xs lg:col-span-5">
                  <div className="border border-slate-200 bg-white p-5">
                    <h4 className="font-bold text-[#102A43] uppercase tracking-wider text-[11px]">Architectural Blueprint</h4>
                    <dl className="mt-4 space-y-3">
                      <div>
                        <dt className="font-semibold text-slate-500">Image Container:</dt>
                        <dd className="font-mono text-slate-800">16:9 standard ratio (3:2 fallback), object-cover, overflow-hidden</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Eyebrow Kicker:</dt>
                        <dd className="text-slate-800">Brand Source Name + Middle Dot + Topic Kicker (Uppercase 10px tracking-wider)</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Headline Rule:</dt>
                        <dd className="text-slate-800">Newsreader Serif, max 3 lines clamp with ellipsis, line-height 1.25</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Dek Summary:</dt>
                        <dd className="text-slate-800">Max 3 lines clamped, 14px leading-6 text-slate-600</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Byline &amp; Action Bar:</dt>
                        <dd className="text-slate-800">Resolved writer name (from JSON-LD/RSS) + relative published timestamp + bookmark toggle</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Right: Full-Scale High-Fidelity UI Sample */}
                <div className="lg:col-span-7">
                  <article className="overflow-hidden border border-slate-200 bg-white shadow-xs transition-all hover:border-slate-400">
                    <div className="relative aspect-[16/9] w-full bg-slate-100">
                      <Image
                        src="https://hips.hearstapps.com/hmg-prod/images/8e24db63-0a89-4b73-b52e-e403f15f4664.jpeg"
                        alt="Vacuum Cleaners Testing"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-[#2D75B9]">Good Housekeeping</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 uppercase tracking-wider text-[10px]">Home &amp; Cleaning</span>
                      </div>

                      <h4 className="mt-3 font-serif text-2xl font-bold leading-snug text-[#102A43]">
                        The 12 Best Vacuum Cleaners of 2026, Tested in Our Labs
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        Our Cleaning Lab experts tested over 80 upright, cordless, and robot vacuums on hardwood, carpet, and pet hair to find the ultimate performers for every home setup.
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <span>By <strong>Carolyn Forte</strong></span>
                        <div className="flex items-center gap-3">
                          <span>2 hours ago</span>
                          <Bookmark className="size-4 text-slate-400 hover:text-[#102A43]" />
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* ─── SPECIMEN 2: RICH PHOTO GALLERY MOSAIC CARD ─── */}
            <section id="specimen-gallery" className="scroll-mt-16 space-y-8 border-t-2 border-[#102A43] pt-10">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Card Model 02</span>
                  <h3 className="mt-1 font-serif text-3xl font-bold text-[#102A43]">Rich Photo Gallery Mosaic Card</h3>
                  <p className="mt-2 text-sm text-slate-600">Upgrades automatically when a photo/gallery story resolves at least 5 distinct high-resolution images, creating an immersive magazine collage.</p>
                </div>
                <code className="self-start rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">src/components/home-page.tsx (&lt;RichPhotoGalleryCard /&gt;)</code>
              </div>

              <div className="grid gap-10 lg:grid-cols-12">
                {/* Left: Architectural Contract */}
                <div className="space-y-4 text-xs lg:col-span-5">
                  <div className="border border-slate-200 bg-white p-5">
                    <h4 className="font-bold text-[#102A43] uppercase tracking-wider text-[11px]">Architectural Blueprint</h4>
                    <dl className="mt-4 space-y-3">
                      <div>
                        <dt className="font-semibold text-slate-500">Composite Grid Anatomy:</dt>
                        <dd className="text-slate-800">6-column CSS grid with 2 rows (Row 1: 2 half-width images at 3 cols each; Row 2: 3 images at 2 cols each)</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Remaining Counter Overlay:</dt>
                        <dd className="text-slate-800">The 5th slot features a dark 50% backdrop with high-contrast count (e.g. "+13") to indicate total album depth</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Interaction Model:</dt>
                        <dd className="text-slate-800">Clicking anywhere opens the interactive fullscreen lightbox viewer with swipe/pan gestures</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Headline Rule:</dt>
                        <dd className="text-slate-800">Large display serif headline placed above the composite image grid</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Right: Full-Scale High-Fidelity UI Sample */}
                <div className="lg:col-span-7">
                  <article className="overflow-hidden border border-slate-200 bg-white shadow-xs">
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-[#2D75B9]">House Beautiful</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 uppercase tracking-wider text-[10px]">Design Inspiration</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                          <Camera className="size-3.5" /> 18 Photos
                        </span>
                      </div>

                      <h4 className="mt-3 font-serif text-2xl font-bold leading-snug text-[#102A43] sm:text-3xl">
                        Inside a Coastal Maine Barn Converted Into a Serene Guest Haven
                      </h4>

                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                        Designer Sarah Richardson transforms a 19th-century timber frame into a sun-drenched coastal retreat filled with natural textures and salvaged heritage wood.
                      </p>
                    </div>

                    {/* 5-Image Real Mosaic Grid */}
                    <div className="grid h-[320px] grid-cols-6 grid-rows-[1.35fr_1fr] gap-px bg-slate-200 sm:h-[400px]">
                      {/* Row 1: 2 Images (3 cols each) */}
                      <div className="relative col-span-3 bg-slate-100">
                        <Image
                          src="https://hips.hearstapps.com/hmg-prod/images/bd62be17-e3bc-47ce-998b-df0fb3603b5b.jpeg"
                          alt="Barn Interior 1"
                          fill
                          sizes="33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative col-span-3 bg-slate-100">
                        <Image
                          src="https://hips.hearstapps.com/hmg-prod/images/ad14fef8-09c7-421e-af6b-71e2dc6f4894.jpeg"
                          alt="Barn Interior 2"
                          fill
                          sizes="33vw"
                          className="object-cover"
                        />
                      </div>
                      {/* Row 2: 3 Images (2 cols each) */}
                      <div className="relative col-span-2 bg-slate-100">
                        <Image
                          src="https://hips.hearstapps.com/hmg-prod/images/824e435b-c480-4cba-92e3-cb4f5f72286e.jpg"
                          alt="Barn Interior 3"
                          fill
                          sizes="22vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative col-span-2 bg-slate-100">
                        <Image
                          src="https://hips.hearstapps.com/hmg-prod/images/body-lotion-opener-691e31beacd6b.png"
                          alt="Barn Interior 4"
                          fill
                          sizes="22vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative col-span-2 bg-slate-100">
                        <Image
                          src="https://hips.hearstapps.com/hmg-prod/images/13cee80d-3684-44b4-b7d4-56465a4730b2.jpeg"
                          alt="Barn Interior 5"
                          fill
                          sizes="22vw"
                          className="object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-2xl font-bold text-white sm:text-3xl">
                          +13
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-5 text-xs text-slate-500">
                      <span>By <strong>Hadley Keller</strong></span>
                      <div className="flex items-center gap-3">
                        <span>Today</span>
                        <Bookmark className="size-4 text-slate-400 hover:text-[#102A43]" />
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* ─── SPECIMEN 3: 16:9 ADAPTIVE VIDEO CARD (INTERACTIVE PLAYABLE PLAYER) ─── */}
            <section id="specimen-video" className="scroll-mt-16 space-y-8 border-t-2 border-[#102A43] pt-10">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Card Model 03</span>
                  <h3 className="mt-1 font-serif text-3xl font-bold text-[#102A43]">16:9 Adaptive Video Card</h3>
                  <p className="mt-2 text-sm text-slate-600">Dedicated card format for playable automotive test drives, masterclasses, and video journalism with inline HLS/MP4 adaptive streaming.</p>
                </div>
                <code className="self-start rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">src/components/hearst-plus/video-cards.tsx</code>
              </div>

              <div className="grid gap-10 lg:grid-cols-12">
                {/* Left: Architectural Contract */}
                <div className="space-y-4 text-xs lg:col-span-5">
                  <div className="border border-slate-200 bg-white p-5">
                    <h4 className="font-bold text-[#102A43] uppercase tracking-wider text-[11px]">Architectural Blueprint</h4>
                    <dl className="mt-4 space-y-3">
                      <div>
                        <dt className="font-semibold text-slate-500">Interactive Player Primitive:</dt>
                        <dd className="text-slate-800">Powered by <code>&lt;AdaptiveVideo /&gt;</code> with direct MP4 playback and native/hls.js adaptive stream switching</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Video Aspect Ratio:</dt>
                        <dd className="text-slate-800">Strict 16:9 widescreen ratio with dark letterbox guardrails</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Timestamp Duration Badge:</dt>
                        <dd className="text-slate-800">Bottom-right absolute badge with exact formatted playback duration (e.g. "0:15 / 14:28")</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Generic 'Watch' Chip Policy:</dt>
                        <dd className="text-slate-800">Strictly prohibited. Brand badge and play button indicate video format without noisy chips</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Right: Full-Scale Interactive Playable UI Video Sample */}
                <div className="lg:col-span-7">
                  <article className="overflow-hidden border border-slate-200 bg-white shadow-xs">
                    <div className="relative aspect-[16/9] w-full bg-black">
                      {isLandscapeVideoPlaying ? (
                        <AdaptiveVideo
                          src="/storybook-video-fixture.mp4"
                          poster="https://hips.hearstapps.com/hmg-prod/images/4cf6b4aa-4f88-469f-a235-545368381794.jpeg"
                          controls
                          autoPlay
                          playsInline
                          className="h-full w-full object-cover"
                          aria-label="Porsche GT3 RS Track Test Video"
                        />
                      ) : (
                        <div
                          onClick={() => setIsLandscapeVideoPlaying(true)}
                          className="group/video relative h-full w-full cursor-pointer"
                        >
                          <Image
                            src="https://hips.hearstapps.com/hmg-prod/images/4cf6b4aa-4f88-469f-a235-545368381794.jpeg"
                            alt="Car and Driver Track Test Video Cover"
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover opacity-90 transition-transform duration-300 group-hover/video:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover/video:bg-black/40">
                            <div className="flex size-16 items-center justify-center rounded-full bg-white text-[#102A43] shadow-xl transition-transform duration-200 group-hover/video:scale-110">
                              <Play className="size-7 ml-1" />
                            </div>
                          </div>
                          <span className="absolute bottom-3 right-3 rounded bg-black/85 px-2.5 py-1 text-xs font-mono font-bold text-white">
                            PLAY VIDEO
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className="text-[#2D75B9]">Car and Driver</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Lightning Lap Series</span>
                        </div>

                        {isLandscapeVideoPlaying && (
                          <button
                            onClick={() => setIsLandscapeVideoPlaying(false)}
                            className="text-[11px] font-bold text-slate-500 hover:text-[#102A43]"
                          >
                            Reset Poster
                          </button>
                        )}
                      </div>

                      <h4 className="mt-3 font-serif text-2xl font-bold leading-snug text-[#102A43]">
                        2026 Porsche 911 GT3 RS Lightning Lap Track Attack at VIR
                      </h4>

                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                        Watch our editors push Porsche's naturally aspirated 518-hp aero weapon to the absolute limit around Virginia International Raceway's 4.1-mile Grand Course.
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <span>Hosted by <strong>Dave VanderWerp</strong></span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-700">Playable H.264 Stream</span>
                          <Bookmark className="size-4 text-slate-400 hover:text-[#102A43]" />
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* ─── SPECIMEN 4: 9:16 DELISH SHORTS REEL CARD (INTERACTIVE PLAYABLE REEL) ─── */}
            <section id="specimen-shorts" className="scroll-mt-16 space-y-8 border-t-2 border-[#102A43] pt-10">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Card Model 04</span>
                  <h3 className="mt-1 font-serif text-3xl font-bold text-[#102A43]">9:16 Delish Shorts Reel Card</h3>
                  <p className="mt-2 text-sm text-slate-600">Vertical portrait video format integrated into the Delish Shorts carousel and full-screen vertical snap reel.</p>
                </div>
                <code className="self-start rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">src/components/hearst-plus/delish-shorts-viewer.tsx</code>
              </div>

              <div className="grid gap-10 lg:grid-cols-12">
                {/* Left: Architectural Contract */}
                <div className="space-y-4 text-xs lg:col-span-5">
                  <div className="border border-slate-200 bg-white p-5">
                    <h4 className="font-bold text-[#102A43] uppercase tracking-wider text-[11px]">Architectural Blueprint</h4>
                    <dl className="mt-4 space-y-3">
                      <div>
                        <dt className="font-semibold text-slate-500">Vertical Aspect Ratio:</dt>
                        <dd className="text-slate-800">Exact 9:16 portrait ratio. Non-portrait aspect ratios are strictly filtered out</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Feed Placement Logic:</dt>
                        <dd className="text-slate-800">Promoted directly after the highest-ranked Delish editorial story in the blended river</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Full-Screen Snap Reel:</dt>
                        <dd className="text-slate-800">Clicking opens the vertical scroll-snap modal reel with instant preloaded video transitions</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Right: Full-Scale Playable Vertical 9:16 Video UI Sample */}
                <div className="flex justify-center lg:col-span-7">
                  <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl border-4 border-slate-800 bg-black shadow-xl">
                    <div className="relative aspect-[9/16] w-full">
                      <AdaptiveVideo
                        src="/storybook-vertical-video-fixture.mp4"
                        poster="https://hips.hearstapps.com/hmg-prod/images/f6b3c525-576e-4b56-a6d3-350a327a4531.jpg"
                        playsInline
                        loop
                        muted={isVerticalVideoMuted}
                        autoPlay={isVerticalVideoPlaying}
                        className="h-full w-full object-cover"
                        aria-label="Delish Smash Potatoes Short"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

                      {/* Top Header Controls */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                        <span className="rounded bg-black/60 px-2 py-0.5 backdrop-blur-xs">Delish Shorts</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsVerticalVideoMuted(!isVerticalVideoMuted)}
                            className="flex size-8 items-center justify-center rounded-full bg-black/60 hover:bg-black/80"
                            aria-label={isVerticalVideoMuted ? "Unmute video" : "Mute video"}
                          >
                            {isVerticalVideoMuted ? <VolumeX className="size-4 text-white" /> : <Volume2 className="size-4 text-white" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsVerticalVideoPlaying(!isVerticalVideoPlaying)}
                            className="flex size-8 items-center justify-center rounded-full bg-black/60 hover:bg-black/80"
                            aria-label={isVerticalVideoPlaying ? "Pause video" : "Play video"}
                          >
                            {isVerticalVideoPlaying ? <Pause className="size-4 text-white" /> : <Play className="size-4 text-white ml-0.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Bottom Info Deck */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Quick Recipe • 9:16 Vertical</span>
                        <h4 className="mt-1 font-serif text-lg font-bold leading-snug">
                          Crispy Garlic Butter Smash Potatoes in 20 Minutes
                        </h4>
                        <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                          The crunchiest, most flavorful potato side dish you will ever make.
                        </p>

                        <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2 text-[10px]">
                          <span>By <strong>June Xie</strong></span>
                          <span className="font-semibold text-amber-300">Open in Reader &rarr;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── SPECIMEN 5: BIG STORY LEAD COVER FEATURE ─── */}
            <section id="specimen-bigstory" className="scroll-mt-16 space-y-8 border-t-2 border-[#102A43] pt-10">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Card Model 05</span>
                  <h3 className="mt-1 font-serif text-3xl font-bold text-[#102A43]">Big Story Lead Cover Card</h3>
                  <p className="mt-2 text-sm text-slate-600">High-impact editorial hero format designed for lead investigative articles, magazine cover features, and major breaking journalism.</p>
                </div>
                <code className="self-start rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">src/components/fre/big-story.tsx</code>
              </div>

              <div className="grid gap-10 lg:grid-cols-12">
                {/* Left: Architectural Contract */}
                <div className="space-y-4 text-xs lg:col-span-5">
                  <div className="border border-slate-200 bg-white p-5">
                    <h4 className="font-bold text-[#102A43] uppercase tracking-wider text-[11px]">Architectural Blueprint</h4>
                    <dl className="mt-4 space-y-3">
                      <div>
                        <dt className="font-semibold text-slate-500">Display Typography:</dt>
                        <dd className="text-slate-800">Newsreader 36px-48px headline scaling with tight letter spacing</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Expanded Dek Summary:</dt>
                        <dd className="text-slate-800">Generous 16px font-size with 3-4 lines of contextual editorial preview</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Split Cover or Widescreen:</dt>
                        <dd className="text-slate-800">Adapts between side-by-side split layout on desktop and stacked full-bleed on mobile</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Right: Full-Scale High-Fidelity UI Sample */}
                <div className="lg:col-span-7">
                  <article className="grid overflow-hidden border border-slate-200 bg-white sm:grid-cols-12">
                    <div className="relative min-h-[260px] sm:col-span-5 bg-slate-100">
                      <Image
                        src="https://hips.hearstapps.com/hmg-prod/images/body-lotion-opener-691e31beacd6b.png"
                        alt="Cosmopolitan Feature"
                        fill
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-6 sm:col-span-7 sm:p-8">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#2D75B9]">
                          <span>Cosmopolitan</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Culture &amp; Ideas</span>
                        </div>

                        <h4 className="mt-3 font-serif text-2xl font-bold leading-tight text-[#102A43] sm:text-3xl">
                          The New Rules of Modern Ambition: How 20-Somethings are Redefining Success
                        </h4>

                        <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                          A landmark investigation into why the next generation is trading traditional career ladders for autonomy, creative ventures, and sustainable well-being.
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <span>By <strong>Jessica Goodman</strong></span>
                        <span className="font-bold text-[#102A43]">Cover Feature</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* ─── SPECIMEN 6: AMBIENT COMMERCE PRODUCT REVIEW ─── */}
            <section id="specimen-commerce" className="scroll-mt-16 space-y-8 border-t-2 border-[#102A43] pt-10">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Card Model 06</span>
                  <h3 className="mt-1 font-serif text-3xl font-bold text-[#102A43]">Ambient Commerce Product Review Card</h3>
                  <p className="mt-2 text-sm text-slate-600">Editorial commerce block used in shopping guides and product reviews, presenting verified lab recommendations with pricing and direct retail links.</p>
                </div>
                <code className="self-start rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">src/components/hearst-plus/ambient-reader.tsx</code>
              </div>

              <div className="grid gap-10 lg:grid-cols-12">
                {/* Left: Architectural Contract */}
                <div className="space-y-4 text-xs lg:col-span-5">
                  <div className="border border-slate-200 bg-white p-5">
                    <h4 className="font-bold text-[#102A43] uppercase tracking-wider text-[11px]">Architectural Blueprint</h4>
                    <dl className="mt-4 space-y-3">
                      <div>
                        <dt className="font-semibold text-slate-500">Verified Product Guarantee:</dt>
                        <dd className="text-slate-800">Must include verified high-res product cutout image, tested award badge, and real merchant link</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Pros &amp; Cons Anatomy:</dt>
                        <dd className="text-slate-800">Structured bullet lists highlighting tested lab strengths and potential drawbacks</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Affiliate Disclosure:</dt>
                        <dd className="text-slate-800">Explicit prototype fine-print noting whether live affiliate attribution is active</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Right: Full-Scale High-Fidelity UI Sample */}
                <div className="lg:col-span-7">
                  <article className="border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="grid gap-6 sm:grid-cols-12 items-center">
                      <div className="relative aspect-square sm:col-span-4 bg-slate-50 p-4 border border-slate-100">
                        <Image
                          src="https://hips.hearstapps.com/hmg-prod/images/8e24db63-0a89-4b73-b52e-e403f15f4664.jpeg"
                          alt="Dyson V15 Detect"
                          fill
                          sizes="(min-width: 1024px) 20vw, 100vw"
                          className="object-contain"
                        />
                      </div>

                      <div className="sm:col-span-8">
                        <span className="border border-emerald-600 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          LAB TEST WINNER • BEST OVERALL
                        </span>
                        <h4 className="mt-2 font-serif text-xl font-bold text-[#102A43]">
                          Dyson V15 Detect Cordless Vacuum
                        </h4>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-lg font-bold text-[#102A43]">$749.99</span>
                          <span className="text-xs text-slate-500">at Amazon &amp; Dyson</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-3">
                          <div>
                            <span className="font-bold text-emerald-700">PROS</span>
                            <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600">
                              <li>• Laser particle illumination</li>
                              <li>• 60-min battery runtime</li>
                            </ul>
                          </div>
                          <div>
                            <span className="font-bold text-rose-700">CONS</span>
                            <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600">
                              <li>• Premium price point</li>
                            </ul>
                          </div>
                        </div>

                        <button className="mt-5 inline-flex items-center gap-1.5 bg-[#102A43] px-4 py-2 text-xs font-bold text-white hover:bg-[#2D75B9]">
                          Shop at Amazon <ExternalLink className="size-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ─── TAB 7: FEED ORCHESTRATION ─── */}
        {selectedTab === "orchestration" && (
          <div className="space-y-12">
            <SectionHead
              label="Data Flow Engine"
              title="Feed Orchestration, Blending &amp; Progressive Delivery"
              copy="Hearst+ runs an advanced multi-feed orchestration engine that blends curated editorial RSS catalogs with read-only Personalize article &amp; video recommendations, applying diversity safeguards and demand-driven progressive loading."
            />

            <div className="grid gap-px bg-slate-200 md:grid-cols-3">
              <div className="bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">01. Allocation</p>
                <h3 className="mt-2 text-lg font-bold text-[#102A43]">Deterministic Allocation</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  To prevent duplicate stories across the interface, high-value modules receive a strictly prioritized inventory allocation:
                </p>
                <div className="mt-4 space-y-1.5 border border-slate-200 bg-[#F8FAFC] p-3 text-xs font-mono text-slate-700">
                  <div>1. Today's Picks (5 Slides)</div>
                  <div>2. Today's Edit Strip</div>
                  <div>3. Your Daily Habit</div>
                  <div>4. Trending Across Brands</div>
                  <div>5. River Feed Sentinel</div>
                </div>
              </div>

              <div className="bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">02. Blending</p>
                <h3 className="mt-2 text-lg font-bold text-[#102A43]">3-Source Blend Logic</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  The feed blends 3 distinct content layers with strict proportion guardrails:
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#102A43]" />
                    <strong>Editorial Snapshot:</strong> Curated high-quality RSS catalog baseline.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#102A43]" />
                    <strong>Personalize Articles:</strong> Ranked by reader signals, capped &lt; 30%.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#102A43]" />
                    <strong>Playable Videos:</strong> Validated H.264 MP4 / HLS streams.
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">03. Delivery</p>
                <h3 className="mt-2 text-lg font-bold text-[#102A43]">Demand-Driven Delivery</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Rather than downloading the complete catalog at once, pages begin with a compact payload and load progressively:
                </p>
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <p className="border border-slate-200 bg-[#F8FAFC] p-2.5">
                    • Appends exactly <strong>4 ranked cards</strong> as the reader approaches the preload sentinel.
                  </p>
                  <p className="border border-slate-200 bg-[#F8FAFC] p-2.5">
                    • Never downloads remaining stories when browser is idle to conserve reader bandwidth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Universal Product Footer */}
      <ProductFooter />
    </div>
  );
}
