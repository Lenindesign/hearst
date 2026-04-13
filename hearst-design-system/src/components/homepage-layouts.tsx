"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { LinkComponent } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { Chip } from "@/components/ui/chip";
import { BigStoryFeedStacked } from "./fre/big-story-feed";
import { BigStoryImageRight, BigStoryTextOnly } from "./fre/big-story";
import { FourAcrossGrid } from "./fre/four-across-grid";
import { SiteFooter } from "./fre/site-footer";
import { AdPlaceholder } from "./fre/ad-placeholder";
import {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardEyebrow,
  ArticleCardTitle,
  ArticleCardDescription,
  ArticleCardMeta,
  ArticleCardAuthor,
  ArticleCardMetaItem,
  ArticleCardMetaDot,
} from "@/components/ui/article-card";
import {
  Mail,
  Search,
  Menu,
  Play,
  TrendingUp,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

import {
  getBrandImages,
  getBaseContent,
  type BaseContentType,
} from "./homepage-data";

// ─── Shared Data (imported from homepage-data.ts) ───

interface ContentType extends BaseContentType {
  categories: string[];
}

const defaultCategories = ["All", "News", "Features", "Culture", "Style", "Health"];

const BRAND_CATEGORIES: Partial<Record<string, string[]>> = {
  cosmopolitan: ["All", "Style", "Beauty", "Love", "Celebs", "Culture"],
  esquire: ["All", "Style", "Culture", "Food & Drink", "Entertainment", "Watches"],
  elle: ["All", "Fashion", "Beauty", "Culture", "Life & Love", "A-List"],
  "good-housekeeping": ["All", "Recipes", "Products", "Cleaning", "Health", "Home"],
  delish: ["All", "Recipes", "Cooking Tips", "Food News", "Drinks", "Holidays"],
  "mens-health": ["All", "Fitness", "Nutrition", "Health", "Style", "Gear"],
  "house-beautiful": ["All", "Rooms", "Decorating", "Gardening", "Renovating", "House Tours"],
  "car-and-driver": ["All", "Reviews", "News", "Comparison Tests", "EV", "Features"],
  "harpers-bazaar": ["All", "Fashion", "Beauty", "Celebrity", "Culture", "Weddings"],
  "country-living": ["All", "Decorating", "Gardening", "Recipes", "Crafts", "Travel"],
  bicycling: ["All", "Bikes", "Gear", "Training", "Racing", "Maintenance"],
  "runners-world": ["All", "Training", "Shoes & Gear", "Health", "Nutrition", "Races"],
  "womens-health": ["All", "Fitness", "Beauty", "Wellness", "Food", "Shopping"],
  "oprah-daily": ["All", "Wellness", "Books", "Beauty", "Health", "Lifestyle"],
  prevention: ["All", "Health", "Wellness", "Nutrition", "Fitness", "Sleep"],
  "road-and-track": ["All", "Cars", "Culture", "Performance", "Racing", "Reviews"],
  "popular-mechanics": ["All", "Science", "Technology", "DIY", "Military", "Space"],
  veranda: ["All", "Decorating", "Gardens", "Travel", "Culture", "Real Estate"],
  "town-and-country": ["All", "Style", "Travel", "Culture", "Society", "Weddings"],
  seventeen: ["All", "Celebs", "Beauty", "Fashion", "Relationships", "Life"],
  "womans-day": ["All", "Food", "Family", "Health", "Lifestyle", "Crafts"],
  redbook: ["All", "Beauty", "Fashion", "Body", "Life", "Love"],
  biography: ["All", "Celebrities", "History", "TV", "Movies", "Music"],
  "the-pioneer-woman": ["All", "Recipes", "Cooking", "Ranch Life", "Holidays", "Shopping"],
  autoweek: ["All", "Cars", "Reviews", "News", "Racing", "Tech"],
  "elle-decor": ["All", "Design", "Rooms", "Gardens", "Travel", "Culture"],
  "best-products": ["All", "Electronics", "Home", "Outdoor", "Style", "Fitness"],
};

function getContent(brandSlug: string): ContentType {
  const base = getBaseContent(brandSlug);
  const categories = BRAND_CATEGORIES[brandSlug] || defaultCategories;
  return { ...base, categories };
}

// ─── Shared Components ───

function UtilityBar() {
  return (
    <div className="h-8 bg-primary text-primary-foreground text-[length:var(--text-token-4xs)] font-semibold">
      <div className="flex items-center justify-between h-full max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {["Shop", "Newsletter", "Sign In"].map((label) => (
            <LinkComponent
              key={label}
              variant="neutral"
              underline={false}
              size="xs"
              className="opacity-90 text-white hover:text-white/80 font-semibold"
            >
              {label}
            </LinkComponent>
          ))}
        </div>
        <Button
          variant="secondary"
          size="xs"
          className="text-[length:var(--text-token-4xs)] font-semibold bg-black text-white hover:bg-black/80"
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
}

function MainNav({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const content = getContent(brandSlug);

  return (
    <div className="border-b border-border py-2">
      <div className="flex items-center justify-between py-2 max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6">
        <div className="w-[var(--width-sidebar-narrow)]" />
        <div className="text-center">
          {logo ? (
            <BrandLogo
              slug={brand.slug}
              className="[&_svg]:h-10 [&_svg]:w-auto mx-auto"
            />
          ) : (
            <h1 className="text-2xl tracking-widest uppercase headline">
              {brand.name}
            </h1>
          )}
        </div>
        <div className="w-[var(--width-sidebar-narrow)] flex justify-end gap-2">
          <Button variant="outline" size="icon-sm">
            <Search className="size-3.5" />
          </Button>
        </div>
      </div>
      <nav className="flex items-center justify-center gap-6 py-2 max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 overflow-x-auto scrollbar-hide">
        {content.navLinks.map((link) => (
          <LinkComponent
            key={link}
            variant="neutral"
            underline={false}
            size="sm"
            className="whitespace-nowrap font-normal"
          >
            {link}
          </LinkComponent>
        ))}
      </nav>
    </div>
  );
}

function FooterSection({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const footerLogo = logo ? (
    <BrandLogo
      slug={brand.slug}
      className="[&_svg]:h-8 [&_svg]:w-auto"
      color="#fff"
    />
  ) : (
    brand.name
  );

  return (
    <div className="pt-12">
      <SiteFooter
        siteName={footerLogo}
        socialLinks={["YouTube", "Facebook", "Instagram", "Pinterest"]}
        legalLinks={["Privacy Notice", "Terms of Use", "Site Map"]}
        copyrightYear={2026}
      />
    </div>
  );
}

// ─── Shared: Sticky Newsletter Bar ───

function StickyNewsletterBar({ brandName }: { brandName: string }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const handleScroll = () => {
      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      setVisible(scrollPercent > 0.3);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg border-t border-primary/20">
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Mail className="size-5 shrink-0" />
          <p className="text-sm font-semibold truncate">
            Get the best of {brandName} in your inbox
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Input
            placeholder="Email address"
            className="w-48 h-8 text-sm bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 [&>div]:h-8"
          />
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs font-bold uppercase"
          >
            Sign Up
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="ml-1 text-primary-foreground/60 hover:text-primary-foreground text-lg leading-none"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared: Inline Newsletter ───

function InlineNewsletter({
  brandName,
  variant = "full-width",
}: {
  brandName: string;
  variant?: "full-width" | "card";
}) {
  if (variant === "card") {
    return (
      <div className="rounded-lg border border-border bg-accent p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="size-5 text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest font-brand-secondary">
            Newsletter
          </p>
        </div>
        <h3 className="text-lg font-semibold headline">
          Get the best of {brandName} delivered daily
        </h3>
        <div className="flex gap-0">
          <Input
            placeholder="Enter your email"
            className="flex-1 [&>div]:rounded-none [&>div]:rounded-l-sm [&>div]:border-border"
          />
          <Button
            size="default"
            className="rounded-none rounded-r-sm text-xs font-bold uppercase tracking-wider"
          >
            Sign Up
          </Button>
        </div>
        <p className="text-[length:var(--text-token-4xs)] text-muted-foreground">
          By signing up, I agree to the Terms of Use and Privacy Notice.
        </p>
      </div>
    );
  }

  return (
    <div className="py-10 px-6 lg:px-12 space-y-6 bg-primary text-primary-foreground">
      <div className="max-w-[var(--width-content-max)] mx-auto flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">
            Sign up for {brandName}&rsquo;s Newsletter
          </p>
          <h3 className="text-2xl lg:text-3xl leading-tight headline">
            Get the stories that matter, delivered to your inbox.
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 w-full lg:w-auto lg:min-w-[400px]">
          <Input
            size="xl"
            placeholder="Enter your email here."
            leadingIcon={Mail}
            className="flex-1 h-14 [&>div]:h-14 [&>div]:rounded-none [&>div]:sm:rounded-l-sm [&>div]:border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
          />
          <Button
            variant="secondary"
            size="lg"
            className="box-content h-14 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap rounded-none sm:rounded-r-sm"
          >
            Sign Me Up
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared: Quick Links Bar ───

function QuickLinksBar({
  topics,
  label = "Trending Now",
}: {
  topics: string[];
  label?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {topics.map((topic) => (
          <Chip key={topic} size="lg" className="shrink-0 cursor-pointer">
            {topic}
          </Chip>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LAYOUT A: "The Curator" — NYT-inspired editorial hierarchy
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function LayoutCurator() {
  const { brand } = useTheme();
  const content = getContent(brand.slug);
  const images = getBrandImages(brand.slug);

  const topStories = content.articles.slice(0, 4).map((a, i) => ({
    title: a.title,
    date: `${a.time} · ${a.readTime}`,
    image: images.articles[i % images.articles.length],
  }));

  const thematicRow1 = content.trending.slice(0, 4).map((t, i) => ({
    title: t.title,
    subtitle: t.time,
    image: images.trending[i % images.trending.length],
  }));

  const thematicRow2 = content.rightRail.slice(0, 3).map((r, i) => ({
    title: r.title,
    subtitle: `By ${r.author}`,
    image: images.rightRail[i % images.rightRail.length],
  }));

  const bigStoryItems = content.articles.map((a, i) => ({
    title: a.title,
    eyebrow: content.rightRail[i % content.rightRail.length]?.eyebrow,
    author:
      content.rightRail[i % content.rightRail.length]?.author || "Staff Writer",
    date: a.time,
    image: images.trending[i % images.trending.length],
  }));

  const trendingTopics = content.navLinks.filter((l) => l !== "Home").slice(0, 8);

  return (
    <div className="min-h-screen font-brand bg-background">
      <div className="flex items-center justify-center py-4 lg:py-6 bg-muted">
        <AdPlaceholder size="leaderboard" />
      </div>

      <UtilityBar />
      <MainNav brandSlug={brand.slug} />

      {/* Hero Zone: 60/40 split */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 pt-8 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch">
          {/* Lead Story (60%) */}
          <div className="lg:w-[60%]">
            <div className="relative overflow-hidden rounded-lg cursor-pointer group h-full">
              <img
                src={images.hero}
                alt={content.hero.title}
                className="w-full h-[300px] lg:h-full lg:min-h-[480px] object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/80 mb-2">
                  {content.hero.eyebrow}
                </span>
                <h2 className="text-2xl lg:text-4xl leading-tight headline text-white mb-3">
                  {content.hero.title}
                </h2>
                <span className="text-xs text-white/50">
                  By {content.hero.author}
                </span>
              </div>
            </div>
          </div>

          {/* Top Stories Stack (40%) */}
          <div className="lg:w-[40%] flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Top Stories
            </h3>
            <div className="flex flex-col flex-1 justify-between">
              {topStories.map((story, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-start gap-4 py-3 cursor-pointer group">
                    <span className="text-2xl font-bold text-black leading-none mt-1 shrink-0 w-6 text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg md:text-xl lg:text-2xl font-semibold leading-snug headline group-hover:text-primary transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {story.date}
                      </p>
                    </div>
                    <img
                      src={story.image}
                      alt=""
                      className="w-16 h-16 rounded object-cover object-[center_20%] shrink-0"
                    />
                  </div>
                  {i < topStories.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thematic Row 1 */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 pt-12 lg:pt-16">
        <div className="border-t-2 border-primary pt-6">
          <h2 className="text-2xl headline mb-6">
            {content.collectionTitle}
          </h2>
          <FourAcrossGrid
            items={thematicRow1}
            columns={4}
            aspectRatio="3/2"
          />
        </div>
      </div>

      {/* Inline Newsletter */}
      <div className="mt-12 lg:mt-16">
        <InlineNewsletter brandName={brand.name} variant="full-width" />
      </div>

      {/* Thematic Row 2 */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 pt-12 lg:pt-16">
        <div className="border-t border-border pt-6">
          <h2 className="text-2xl headline mb-6">Culture & Entertainment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {thematicRow2.map((item, i) => (
              <ArticleCard
                key={i}
                layout="vertical"
              size="sm"
              className="cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent"
            >
              <ArticleCardImage
                src={item.image}
                aspectRatio="3/2"
                className="rounded-lg"
              />
              <ArticleCardContent className="px-0">
                <ArticleCardTitle className="text-base">
                  {item.title}
                </ArticleCardTitle>
                <ArticleCardMeta>
                  <ArticleCardMetaItem>{item.subtitle}</ArticleCardMetaItem>
                </ArticleCardMeta>
              </ArticleCardContent>
            </ArticleCard>
            ))}
          </div>
        </div>
      </div>

      {/* Mid-page ad */}
      <div className="flex justify-center py-8">
        <AdPlaceholder size="billboard" />
      </div>

      {/* Trending Bar */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 py-8">
        <QuickLinksBar topics={trendingTopics} />
      </div>

      {/* Big Story Feed */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 pb-12">
        <div className="border-t-2 border-primary pt-6">
          <h2 className="text-2xl headline mb-6">More Stories</h2>
          <BigStoryFeedStacked
            items={bigStoryItems}
            thumbnailWidth={160}
            thumbnailHeight={120}
            headlineFontSize={16}
            showDividers
          />
        </div>
      </div>

      <FooterSection brandSlug={brand.slug} />
      <StickyNewsletterBar brandName={brand.name} />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LAYOUT B: "The Mosaic" — Verge/TIME-inspired modular grid
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function LayoutMosaic() {
  const { brand } = useTheme();
  const content = getContent(brand.slug);
  const images = getBrandImages(brand.slug);
  const [activeTab, setActiveTab] = useState("All");
  const [showMore, setShowMore] = useState(false);

  const categories = content.categories || defaultCategories;

  const gridCards = [
    ...content.rightRail.map((r, i) => ({
      eyebrow: r.eyebrow,
      title: r.title,
      desc: r.desc,
      author: r.author,
      image: images.rightRail[i % images.rightRail.length],
      readTime: content.articles[i % content.articles.length]?.readTime || "5 Min Read",
    })),
    ...content.articles.slice(3, 5).map((a, i) => ({
      eyebrow: content.rightRail[(i + 2) % content.rightRail.length]?.eyebrow || "FEATURES",
      title: a.title,
      desc: content.rightRail[(i + 2) % content.rightRail.length]?.desc || "",
      author: content.rightRail[(i + 2) % content.rightRail.length]?.author || "Staff Writer",
      image: images.trending[(i + 2) % images.trending.length],
      readTime: a.readTime,
    })),
  ];

  const editorPicks = content.articles.slice(0, 5).map((a, i) => ({
    title: a.title,
    image: images.articles[i % images.articles.length],
    time: a.time,
  }));

  const trendingMosaic = content.trending.map((t, i) => ({
    title: t.title,
    subtitle: t.time,
    image: images.trending[i % images.trending.length],
  }));

  return (
    <div className="min-h-screen font-brand bg-background">
      <div className="flex items-center justify-center py-4 lg:py-6 bg-muted">
        <AdPlaceholder size="leaderboard" />
      </div>

      <UtilityBar />
      <MainNav brandSlug={brand.slug} />

      {/* Bento Hero Grid */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 lg:h-[520px]">
          {/* Feature Story: 2x2 */}
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-lg cursor-pointer group">
            <img
              src={images.hero}
              alt={content.hero.title}
              className="w-full h-[300px] lg:h-full object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                {content.hero.eyebrow}
              </span>
              <h2 className="text-xl lg:text-3xl leading-tight headline text-white mb-2">
                {content.hero.title}
              </h2>
              <p className="text-sm text-white/60 hidden lg:block">
                {content.hero.desc}
              </p>
            </div>
          </div>

          {/* Secondary Story 1: 1x2 */}
          <div className="md:col-span-1 lg:col-span-1 lg:row-span-2 relative overflow-hidden rounded-lg cursor-pointer group">
            <img
              src={images.trending[1]}
              alt={content.articles[0]?.title}
              className="w-full h-[200px] lg:h-full object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/70 mb-1">
                {content.rightRail[0]?.eyebrow}
              </span>
              <h3 className="text-base lg:text-lg leading-snug headline text-white">
                {content.articles[0]?.title}
              </h3>
            </div>
          </div>

          {/* Secondary Story 2: 1x1 */}
          <div className="relative overflow-hidden rounded-lg cursor-pointer group">
            <img
              src={images.trending[2]}
              alt={content.articles[1]?.title}
              className="w-full h-[200px] lg:h-full object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-sm lg:text-base leading-snug headline text-white">
                {content.articles[1]?.title}
              </h3>
            </div>
          </div>

          {/* Secondary Story 3: 1x1 */}
          <div className="relative overflow-hidden rounded-lg cursor-pointer group">
            <img
              src={images.trending[3]}
              alt={content.articles[2]?.title}
              className="w-full h-[200px] lg:h-full object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-sm lg:text-base leading-snug headline text-white">
                {content.articles[2]?.title}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 pt-12 lg:pt-16">
        <div className="border-b border-border">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
                  activeTab === cat
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtered Content Grid */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridCards.map((card, i) => (
            <ArticleCard
              key={i}
              layout="vertical"
              size="sm"
              className="cursor-pointer ring-0 hover:ring-0 bg-transparent group"
            >
              <div className="relative overflow-hidden rounded-lg">
                <ArticleCardImage
                  src={card.image}
                  aspectRatio="3/2"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <ArticleCardContent className="px-0">
                <ArticleCardEyebrow>{card.eyebrow}</ArticleCardEyebrow>
                <ArticleCardTitle className="text-base leading-snug">
                  {card.title}
                </ArticleCardTitle>
                <ArticleCardDescription className="text-sm">
                  {card.desc}
                </ArticleCardDescription>
                <ArticleCardMeta>
                  <ArticleCardAuthor>By {card.author}</ArticleCardAuthor>
                  <ArticleCardMetaDot />
                  <ArticleCardMetaItem>{card.readTime}</ArticleCardMetaItem>
                </ArticleCardMeta>
              </ArticleCardContent>
            </ArticleCard>
          ))}
        </div>
      </div>

      {/* Inline Ad */}
      <div className="flex justify-center py-8">
        <AdPlaceholder size="billboard" />
      </div>

      {/* Editor's Picks Carousel */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl headline">Editor&rsquo;s Picks</h2>
          <Button variant="ghost" size="sm" className="text-sm gap-1">
            View All <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {editorPicks.map((pick, i) => (
            <div
              key={i}
              className="shrink-0 w-[200px] cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-lg mb-2">
                <img
                  src={pick.image}
                  alt={pick.title}
                  className="w-full aspect-video object-cover object-[center_25%] transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h4 className="text-sm font-semibold leading-snug headline group-hover:text-primary transition-colors">
                {pick.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{pick.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Split Newsletter Module */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 py-8">
        <div className="rounded-xl bg-accent border border-border overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-8 lg:p-12 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Newsletter
                </p>
                <h3 className="text-2xl lg:text-3xl leading-tight headline">
                  The best of {brand.name}, curated for you.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Expert journalism, trending stories, and exclusive content
                  delivered to your inbox every morning.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-0">
                <Input
                  size="xl"
                  placeholder="Enter your email"
                  leadingIcon={Mail}
                  className="flex-1 [&>div]:rounded-none [&>div]:sm:rounded-l-sm [&>div]:border-border"
                />
                <Button
                  size="lg"
                  className="h-12 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap rounded-none sm:rounded-r-sm"
                >
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="lg:w-[300px] bg-muted flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <div className="w-32 h-44 bg-background rounded shadow-lg mx-auto flex items-center justify-center">
                  <BrandLogo
                    slug={brand.slug}
                    className="[&_svg]:h-6 [&_svg]:w-auto"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Latest Issue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Mosaic */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-6 py-8">
        <h2 className="text-2xl headline mb-6">Trending</h2>
        <FourAcrossGrid
          items={trendingMosaic.slice(0, showMore ? 5 : 5)}
          columns={5}
          aspectRatio="1/1"
          showNumbers
          
        />
      </div>

      {/* Load More */}
      <div className="flex justify-center py-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowMore(!showMore)}
          className="px-12 font-semibold"
        >
          {showMore ? "Show Less" : "Load More Stories"}
        </Button>
      </div>

      <FooterSection brandSlug={brand.slug} />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LAYOUT C: "The Stream" — Mobile-first engagement feed
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function StickyCompactNav({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 h-14 flex items-center justify-between">
        <Button variant="ghost" size="icon-sm">
          <Menu className="size-5" />
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2">
          {logo ? (
            <BrandLogo
              slug={brand.slug}
              className="[&_svg]:h-7 [&_svg]:w-auto"
            />
          ) : (
            <span className="text-lg font-bold headline">{brand.name}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <Search className="size-5" />
          </Button>
          <Button size="sm" className="text-xs font-bold uppercase">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}

function FloatingSubscribeCTA({
  brandName,
}: {
  brandName: string;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const handleScroll = () => {
      const footerThreshold = document.documentElement.scrollHeight - window.innerHeight - 300;
      setVisible(window.scrollY > 600 && window.scrollY < footerThreshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-primary text-primary-foreground rounded-xl shadow-2xl p-3 flex items-center gap-3">
        <Mail className="size-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">
            Don&rsquo;t miss a story
          </p>
          <p className="text-xs opacity-70">
            Get {brandName} delivered daily
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0 text-xs font-bold"
        >
          Sign Up
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="text-primary-foreground/60 hover:text-primary-foreground text-lg leading-none"
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export function LayoutStream() {
  const { brand } = useTheme();
  const content = getContent(brand.slug);
  const images = getBrandImages(brand.slug);
  const [showMore, setShowMore] = useState(false);

  const trendingTopics = content.navLinks
    .filter((l) => l !== "Home")
    .slice(0, 8);

  return (
    <div className="min-h-screen font-brand bg-background">
      <StickyCompactNav brandSlug={brand.slug} />

      {/* Full-Width Hero */}
      <div className="relative cursor-pointer group max-w-[var(--width-content-max)] mx-auto">
        <img
          src={images.hero}
          alt={content.hero.title}
          className="w-full h-[70vh] min-h-[500px] max-h-[750px] object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-12 max-w-[1280px] mx-auto">
          <Chip size="md" className="mb-3 bg-primary text-primary-foreground border-primary">
            {content.hero.eyebrow}
          </Chip>
          <h1 className="text-3xl lg:text-5xl leading-tight headline text-white mb-3">
            {content.hero.title}
          </h1>
          <p className="text-base text-white/70 mb-4 max-w-xl">
            {content.hero.desc}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50">
              By {content.hero.author}
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs font-bold uppercase"
            >
              Read Now
            </Button>
          </div>
        </div>
      </div>

      {/* Smart Stream */}
      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-0">
        {/* Stream Card 1: Image Right */}
        <div className="py-6 border-b border-border">
          <BigStoryImageRight
            label={content.rightRail[0]?.eyebrow || "NEWS"}
            headline={content.articles[0]?.title || ""}
            description={content.rightRail[0]?.desc || ""}
            author={content.rightRail[0]?.author || "Staff"}
            date={content.articles[0]?.time || ""}
            image={images.articles[0]}
            headlineFontSize={28}
            headlineLineHeight={32}
            imagePosition="right"
            aspectRatio="4/3"
          />
        </div>

        {/* Stream Card 2: Full-Width Image Overlay */}
        <div className="py-6 border-b border-border">
          <div className="relative overflow-hidden rounded-lg cursor-pointer group">
            <img
              src={images.trending[1]}
              alt={content.articles[1]?.title}
              className="w-full aspect-video object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1 block">
                {content.rightRail[1]?.eyebrow}
              </span>
              <h3 className="text-lg leading-snug headline text-white">
                {content.articles[1]?.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Inline Newsletter Card */}
        <div className="py-6 border-b border-border">
          <InlineNewsletter brandName={brand.name} variant="card" />
        </div>

        {/* Stream Card 3: Text Only */}
        <div className="py-6 border-b border-border">
          <BigStoryTextOnly
            label={content.rightRail[2]?.eyebrow || "OPINION"}
            headline={content.articles[2]?.title || ""}
            description={content.rightRail[2]?.desc || ""}
            author={content.rightRail[2]?.author || "Staff"}
            date={content.articles[2]?.time || ""}
            headlineFontSize={28}
            headlineLineHeight={32}
            showBorderTop={false}
            className="py-0 max-w-none"
          />
        </div>

        {/* Native Ad Card */}
        <div className="py-6 border-b border-border">
          <div className="flex items-center justify-center">
            <AdPlaceholder size="inline" className="w-full" />
          </div>
        </div>

        {/* Stream Card 4: Image Right */}
        <div className="py-6 border-b border-border">
          <BigStoryImageRight
            label={content.rightRail[3]?.eyebrow || "FEATURES"}
            headline={content.articles[3]?.title || ""}
            description={content.rightRail[3]?.desc || ""}
            author={content.rightRail[3]?.author || "Staff"}
            date={content.articles[3]?.time || ""}
            image={images.trending[3]}
            headlineFontSize={28}
            headlineLineHeight={32}
            imagePosition="right"
            aspectRatio="4/3"
          />
        </div>
      </div>

      {/* Quick Links Bar */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <QuickLinksBar topics={trendingTopics} label="Most Popular" />
      </div>

      {/* Video Spotlight */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl headline mb-6">Watch Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-lg cursor-pointer group md:col-span-2">
            <img
              src={images.trending[0]}
              alt="Featured video"
              className="w-full aspect-video object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="size-7 text-foreground ml-1" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-lg headline text-white">
                {content.trending[0]?.title}
              </h3>
            </div>
          </div>
          {images.trending.slice(1, 3).map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg cursor-pointer group"
            >
              <img
                src={img}
                alt=""
                className="w-full aspect-video object-cover object-[center_25%]"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                  <Play className="size-4 text-foreground ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping / Special Offers */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            <h2 className="text-2xl headline">Shop Our Picks</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-sm gap-1">
            View All <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {content.articles.slice(0, 5).map((article, i) => (
            <div
              key={i}
              className="shrink-0 w-[160px] cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-lg mb-2">
                <img
                  src={images.articles[i % images.articles.length]}
                  alt={article.title}
                  className="w-full h-[160px] object-cover object-[center_25%] transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h4 className="text-xs font-semibold leading-snug headline group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {article.readTime}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* More Stream Cards */}
      {showMore && (
        <div className="max-w-3xl mx-auto px-4 space-y-0">
          {content.articles.map((article, i) => (
            <div key={`more-${i}`} className="py-6 border-b border-border">
              <BigStoryImageRight
                label={
                  content.rightRail[i % content.rightRail.length]?.eyebrow ||
                  "NEWS"
                }
                headline={article.title}
                description={
                  content.rightRail[i % content.rightRail.length]?.desc || ""
                }
                author={
                  content.rightRail[i % content.rightRail.length]?.author ||
                  "Staff"
                }
                date={article.time}
                image={images.trending[i % images.trending.length]}
                headlineFontSize={18}
                imagePosition="right"
                aspectRatio="4/3"
              />
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      <div className="flex justify-center py-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowMore(!showMore)}
          className="px-12 font-semibold"
        >
          {showMore ? "Show Less" : "Show More Stories"}
        </Button>
      </div>

      <FooterSection brandSlug={brand.slug} />
      <FloatingSubscribeCTA brandName={brand.name} />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Layout Type & Switcher
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type LayoutVariant = "curator" | "mosaic" | "stream";

const LAYOUT_META: Record<
  LayoutVariant,
  { label: string; description: string }
> = {
  curator: {
    label: "The Curator",
    description: "NYT-inspired editorial hierarchy",
  },
  mosaic: {
    label: "The Mosaic",
    description: "Verge/TIME-inspired modular grid",
  },
  stream: {
    label: "The Stream",
    description: "Mobile-first engagement feed",
  },
};

export function LayoutSwitcher({
  value,
  onChange,
}: {
  value: LayoutVariant;
  onChange: (v: LayoutVariant) => void;
}) {
  const variants: LayoutVariant[] = ["curator", "mosaic", "stream"];

  return (
    <div className="flex items-center gap-1 p-1 bg-background/95 backdrop-blur rounded-lg border border-border shadow-lg">
      {variants.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap",
            value === v
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          title={LAYOUT_META[v].description}
        >
          {LAYOUT_META[v].label}
        </button>
      ))}
    </div>
  );
}

export function HomepageByLayout({
  layout,
}: {
  layout: LayoutVariant;
}) {
  switch (layout) {
    case "curator":
      return <LayoutCurator />;
    case "mosaic":
      return <LayoutMosaic />;
    case "stream":
      return <LayoutStream />;
  }
}
