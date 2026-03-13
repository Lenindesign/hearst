"use client";

import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";

const sampleContent: Record<
  string,
  {
    collectionTitle: string;
    articles: { title: string; time: string; readTime: string }[];
    hero: {
      eyebrow: string;
      title: string;
      desc: string;
      author: string;
    };
    rightRail: {
      eyebrow: string;
      title: string;
      desc: string;
      author: string;
    }[];
    trending: { title: string; time: string }[];
    newsletter: { title: string; desc: string };
    navLinks: string[];
    footerCols: string[][];
  }
> = {
  default: {
    collectionTitle: "Latest News",
    articles: [
      { title: "Breaking Story That\nCaptures Attention", time: "Just Now", readTime: "5 Min Read" },
      { title: "Feature Article on\nTrending Topics", time: "2 hours ago", readTime: "4 Min Read" },
      { title: "In-Depth Report on\nCurrent Events and\nTheir Impact", time: "Yesterday", readTime: "7 Min Read" },
      { title: "Exclusive Interview\nWith Industry Leader", time: "Mar 5, 2026", readTime: "6 Min Read" },
      { title: "Analysis: What This\nMeans for the Future", time: "Mar 4, 2026", readTime: "3 Min Read" },
    ],
    hero: {
      eyebrow: "FEATURED",
      title: "The Definitive Guide to This Season's Most Important Story",
      desc: "An in-depth look at the trends, people, and moments that are shaping our world right now.",
      author: "Editorial Staff",
    },
    rightRail: [
      { eyebrow: "TRENDING", title: "Must-Read Story That\nEveryone Is Talking\nAbout Right Now", desc: "The latest on what matters\nmost to our readers.", author: "Staff Writer" },
      { eyebrow: "GUIDE", title: "Everything You Need\nto Know Before\nMaking a Decision", desc: "Our experts break down\nthe essentials.", author: "Senior Editor" },
      { eyebrow: "NEWS", title: "Breaking Development\nChanges the Landscape\nForever", desc: "What this means for\nthe industry going forward.", author: "News Desk" },
      { eyebrow: "FIRST LOOK", title: "Exclusive Preview of\nWhat's Coming Next\nSeason", desc: "A sneak peek at the most\nanticipated releases.", author: "Features Editor" },
    ],
    trending: [
      { title: "Top Story\nEveryone Is\nReading", time: "3 hours ago" },
      { title: "Surprising\nNew Discovery\nRevealed", time: "5 hours ago" },
      { title: "Expert Tips\nfor Better\nResults", time: "8 hours ago" },
      { title: "Behind the\nScenes Look\nat the Process", time: "12 hours ago" },
      { title: "What Experts\nSay About\nthe Future", time: "1 day ago" },
    ],
    newsletter: {
      title: "Get Our Newsletter",
      desc: "Stay ahead with breaking news, features, and the best stories delivered to your inbox.",
    },
    navLinks: ["Home", "News", "Features", "Culture", "Style", "Health", "Food", "Travel", "Videos"],
    footerCols: [
      ["News", "Features", "Culture", "Lifestyle", "Opinion", "Wellness", "Travel"],
      ["Style", "Beauty", "Food", "Home", "Entertainment", "Shopping", "Tech"],
      ["Videos", "Podcasts", "Newsletters", "Events", "Awards", "Archive", "About"],
      ["Contact", "Careers", "Advertise", "Subscribe", "Press", "Privacy", "Terms"],
    ],
  },
};

function getContent(brandSlug: string) {
  return sampleContent[brandSlug] || sampleContent.default;
}

function UtilityBar() {
  return (
    <div className="flex items-center justify-between px-3 h-8 text-[11px] font-semibold"
      style={{ backgroundColor: "var(--brand-primary, #000)", color: "#fff" }}>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 opacity-90">Shop</span>
        <span className="flex items-center gap-1 opacity-90">Newsletter</span>
        <span className="flex items-center gap-1 opacity-90">Sign In</span>
      </div>
      <button className="px-3 py-0.5 rounded-sm text-[11px] font-semibold"
        style={{ backgroundColor: "var(--palette-neutral-lightest, #fff)", color: "var(--brand-primary, #000)" }}>
        Subscribe
      </button>
    </div>
  );
}

function MainNav({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const content = getContent(brandSlug);

  return (
    <div className="border-b py-2 px-6" style={{ borderColor: "var(--palette-neutral-300, #d6d6d6)" }}>
      <div className="flex items-center justify-between py-2 max-w-[1360px] mx-auto">
        <div className="w-[180px]" />
        <div className="text-center">
          {logo ? (
            <BrandLogo slug={brand.slug} className="[&_svg]:h-7 [&_svg]:w-auto mx-auto" />
          ) : (
            <h1 className="text-2xl font-semibold tracking-[6px] uppercase font-headline">
              {brand.name}
            </h1>
          )}
        </div>
        <div className="w-[180px] flex justify-end gap-2">
          <div className="w-7 h-7 rounded border flex items-center justify-center text-xs"
            style={{ borderColor: "var(--palette-neutral-400, #bdbdbd)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 py-2 max-w-[1360px] mx-auto overflow-x-auto scrollbar-hide">
        {content.navLinks.map((link) => (
          <span key={link} className="text-[13px] whitespace-nowrap cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: "var(--palette-neutral-900, #292929)" }}>
            {link}
          </span>
        ))}
      </div>
    </div>
  );
}

function CollectionList({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);

  return (
    <div className="w-full lg:w-[320px] shrink-0 space-y-3">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold uppercase font-headline"
          style={{ color: "var(--brand-primary, #000)" }}>
          {content.collectionTitle}
        </h3>
        <div className="h-[3px] w-full" style={{ backgroundColor: "var(--brand-primary, #000)" }} />
      </div>
      <div className="space-y-5">
        {content.articles.map((article, i) => (
          <div key={i} className="flex gap-3 group cursor-pointer">
            <div className="w-[72px] h-[72px] rounded shrink-0 relative overflow-hidden"
              style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }}>
              <div className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: "var(--brand-primary, #000)" }}>
                {i + 1}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug group-hover:underline whitespace-pre-line font-headline">
                {article.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: "var(--palette-neutral-600, #757575)" }}>
                <span>{article.time}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroCard({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);

  return (
    <div className="flex-1 min-w-0 space-y-2">
      <div className="w-full aspect-[16/10] rounded relative overflow-hidden"
        style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wide font-brand-secondary"
          style={{ color: "var(--brand-primary, #000)" }}>
          {content.hero.eyebrow}
        </span>
        <h2 className="text-2xl lg:text-[32px] font-semibold leading-tight font-headline">
          {content.hero.title}
        </h2>
        <p className="text-base leading-relaxed" style={{ color: "var(--palette-neutral-700, #575757)" }}>
          {content.hero.desc}
        </p>
        <p className="text-[13px] font-semibold">{content.hero.author}</p>
      </div>
    </div>
  );
}

function RightRailCard({
  card,
}: {
  card: { eyebrow: string; title: string; desc: string; author: string };
}) {
  return (
    <div className="flex gap-3 group cursor-pointer">
      <div className="w-[100px] h-[100px] rounded shrink-0"
        style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }} />
      <div className="min-w-0 space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide font-brand-secondary"
          style={{ color: "var(--brand-primary, #000)" }}>
          {card.eyebrow}
        </span>
        <p className="text-sm font-semibold leading-snug group-hover:underline whitespace-pre-line font-headline">
          {card.title}
        </p>
        <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "var(--palette-neutral-600, #757575)" }}>
          {card.desc}
        </p>
        <p className="text-xs font-semibold">{card.author}</p>
      </div>
    </div>
  );
}

function RightRail({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);

  return (
    <div className="w-full lg:w-[321px] shrink-0 space-y-8">
      <div className="space-y-6">
        {content.rightRail.map((card, i) => (
          <RightRailCard key={i} card={card} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 py-4 rounded"
        style={{ backgroundColor: "var(--palette-neutral-100, #f5f5f5)" }}>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--palette-neutral-500, #949494)" }}>
          Advertisement
        </span>
        <div className="w-[300px] h-[250px] rounded flex items-center justify-center text-sm"
          style={{ backgroundColor: "var(--palette-neutral-200, #ededed)", color: "var(--palette-neutral-500, #949494)" }}>
          AD 300 × 250
        </div>
      </div>
    </div>
  );
}

function NewsletterPromo({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);

  return (
    <div className="p-6 rounded border"
      style={{ backgroundColor: "var(--palette-neutral-100, #f5f5f5)", borderColor: "var(--palette-neutral-400, #bdbdbd)" }}>
      <h3 className="text-lg font-semibold font-headline">{content.newsletter.title}</h3>
      <p className="text-sm mt-1" style={{ color: "var(--palette-neutral-600, #757575)" }}>
        {content.newsletter.desc}
      </p>
    </div>
  );
}

function TrendingCard({ card, index }: { card: { title: string; time: string }; index: number }) {
  return (
    <div className="w-[183px] shrink-0 space-y-2 group cursor-pointer">
      <div className="w-full aspect-square rounded relative overflow-hidden"
        style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }}>
        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: "var(--brand-primary, #000)" }}>
          {index + 1}
        </div>
      </div>
      <p className="text-sm font-semibold leading-snug group-hover:underline whitespace-pre-line font-headline">
        {card.title}
      </p>
      <span className="text-xs" style={{ color: "var(--palette-neutral-600, #757575)" }}>
        {card.time}
      </span>
    </div>
  );
}

function TrendingSection({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);

  return (
    <div className="space-y-6">
      <h2 className="text-4xl lg:text-5xl font-semibold font-headline">
        Trending
      </h2>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
        {content.trending.map((card, i) => (
          <TrendingCard key={i} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}

function Footer({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const content = getContent(brandSlug);

  return (
    <footer className="pt-12 pb-8 space-y-8 max-w-[1360px] mx-auto border-t"
      style={{ borderColor: "var(--palette-neutral-300, #d6d6d6)" }}>
      <div className="flex items-center gap-6">
        {logo ? (
          <BrandLogo slug={brand.slug} className="[&_svg]:h-5 [&_svg]:w-auto" />
        ) : (
          <span className="text-xl font-semibold tracking-[4px] uppercase font-headline">
            {brand.name}
          </span>
        )}
        <div className="flex gap-3">
          {["facebook", "twitter", "instagram", "youtube"].map((s) => (
            <div key={s} className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--palette-neutral-200, #ededed)" }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--palette-neutral-500, #949494)" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {content.footerCols.map((col, i) => (
          <div key={i} className="space-y-3">
            {col.map((link) => (
              <p key={link} className="text-sm cursor-pointer hover:underline">{link}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t text-xs"
        style={{ borderColor: "var(--palette-neutral-300, #d6d6d6)", color: "var(--palette-neutral-600, #757575)" }}>
        <div className="flex flex-wrap gap-4">
          <span>© 2026 Hearst Magazine Media, Inc.</span>
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span className="cursor-pointer hover:underline">Terms of Use</span>
        </div>
        <button className="px-3 py-1.5 rounded text-xs font-medium"
          style={{ backgroundColor: "var(--palette-neutral-100, #f5f5f5)" }}>
          Your Privacy Choices
        </button>
      </div>
    </footer>
  );
}

export function BrandHomePage() {
  const { brand } = useTheme();

  return (
    <div className="min-h-screen font-brand" style={{
      backgroundColor: "var(--palette-neutral-lightest, #fff)",
    }}>
      <NavBar />

      <div className="max-w-[1440px] mx-auto">
        {/* Ad Banner */}
        <div className="flex items-center justify-center h-[100px] lg:h-[250px]"
          style={{ backgroundColor: "var(--palette-neutral-100, #f5f5f5)" }}>
          <div className="flex items-center justify-center rounded text-sm"
            style={{ backgroundColor: "var(--palette-neutral-200, #ededed)", color: "var(--palette-neutral-500, #949494)", width: 728, height: 90 }}>
            AD 728 × 90
          </div>
        </div>

        {/* Utility Bar */}
        <UtilityBar />

        {/* Main Nav */}
        <MainNav brandSlug={brand.slug} />

        {/* Page Body */}
        <div className="max-w-[1360px] mx-auto px-4 lg:px-0 pt-8 lg:pt-12 space-y-12 lg:space-y-16">
          {/* Top Section: Collection + Hero + Right Rail */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="flex-1 min-w-0 space-y-8 lg:space-y-12">
              {/* Collection + Hero */}
              <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                <CollectionList brandSlug={brand.slug} />
                <HeroCard brandSlug={brand.slug} />
              </div>

              {/* Newsletter + Trending */}
              <NewsletterPromo brandSlug={brand.slug} />
              <TrendingSection brandSlug={brand.slug} />
            </div>

            {/* Right Rail */}
            <RightRail brandSlug={brand.slug} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 lg:px-0">
          <Footer brandSlug={brand.slug} />
        </div>
      </div>
    </div>
  );
}
