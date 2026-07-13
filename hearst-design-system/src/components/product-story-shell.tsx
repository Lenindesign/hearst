import Link from "next/link";
import type { CSSProperties } from "react";
import { BookOpen, Compass, Database, Gauge, Heart, Layers3, Menu, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { DraggableBrandLogoMarquee } from "@/components/brand-logo-marquee";
import { SiteFooter } from "@/components/fre/site-footer";
import { brandLogos } from "@/lib/logos";

export const productImage = "https://hips.hearstapps.com/hmg-prod/images/jimmy-tatro-and-zoey-deutch-attend-the-2025-lacma-art-film-news-photo-1762180233.pjpeg";

export function ProductHeader({ current }: { current: "story" | "blueprint" }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-5 px-5 py-4 md:px-10">
        <Link href="/hearst-all/" className="text-sm font-black tracking-[0.28em] text-[#2D75B9]">HEARST <span className="font-serif font-normal italic tracking-normal">Magazines</span></Link>
        <nav aria-label="Product pages" className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <Link className={current === "story" ? "text-[#2D75B9]" : "text-slate-600 hover:text-slate-950"} href="/about-hearst-magazines/">Product story</Link>
          <Link className={current === "blueprint" ? "text-[#2D75B9]" : "text-slate-600 hover:text-slate-950"} href="/hearst-product-blueprint/">Blueprint</Link>
          <Link className="text-slate-600 hover:text-slate-950" href="/hearst-all/">Open prototype</Link>
        </nav>
        <Link href={current === "story" ? "/hearst-product-blueprint/" : "/about-hearst-magazines/"} className="text-sm font-bold text-[#2D75B9] md:hidden">{current === "story" ? "Blueprint" : "Story"}</Link>
      </div>
    </header>
  );
}

export function ProductFooter() {
  return <SiteFooter siteName={<span className="text-lg font-black tracking-[0.24em]">HEARST <span className="font-serif font-normal italic tracking-normal">Magazines</span></span>} copyrightYear={2026} />;
}

export const streams = [
  { name: "Lifestyle", color: "#7A2E57", copy: "Home, food, style, wellness and entertainment" },
  { name: "Autos", color: "#1B5F8A", copy: "Reviews, EVs, ownership and enthusiast culture" },
  { name: "Flux", color: "#121212", copy: "Fashion, design, culture, travel and ideas" },
  { name: "E&W", color: "#E50022", copy: "Fitness, health, gear and active living" },
];

export const prototypeStats = [
  { value: "859", label: "real-image stories", copy: "Current prototype inventory from public Hearst RSS metadata and canonical image URLs." },
  { value: "29", label: "represented brands", copy: "Each brand keeps its own logo, route, color, typography and contextual navigation." },
  { value: "4", label: "portfolio destinations", copy: "Unified, Lifestyle, Autos, Flux and E&W views organize the same system around reader intent." },
];

export const brandSections = [
  {
    name: "Lifestyle",
    logoSlug: "hearst-lifestyle",
    route: "/hearst-edit/",
    count: 259,
    color: "#7A2E57",
    brands: [
      ["Cosmopolitan", "cosmopolitan", 28],
      ["Country Living", "country-living", 28],
      ["Delish", "delish", 28],
      ["Good Housekeeping", "good-housekeeping", 28],
      ["House Beautiful", "house-beautiful", 28],
      ["The Pioneer Woman", "pioneer-woman", 28],
      ["Prevention", "prevention", 27],
      ["Redbook", "redbook", 30],
      ["Seventeen", "seventeen", 30],
      ["Woman's Day", "womans-day", 4],
    ],
  },
  {
    name: "Autos",
    logoSlug: "hearst-plus",
    route: "/hearst-plus/",
    count: 200,
    color: "#1B5F8A",
    brands: [
      ["Autoweek", "autoweek", 36],
      ["Bring a Trailer", "bring-a-trailer", 20],
      ["Car and Driver", "car-and-driver", 36],
      ["HOT ROD", "hot-rod", 36],
      ["MotorTrend", "motortrend", 36],
      ["Road & Track", "road-and-track", 36],
    ],
  },
  {
    name: "Flux",
    logoSlug: "hearst-flux",
    route: "/hearst-flux/",
    count: 200,
    color: "#121212",
    brands: [
      ["Elle", "elle", 34],
      ["Elle Decor", "elle-decor", 34],
      ["Esquire", "esquire", 33],
      ["Harper's Bazaar", "harpers-bazaar", 33],
      ["Town & Country", "town-and-country", 33],
      ["Veranda", "veranda", 33],
    ],
  },
  {
    name: "E&W",
    logoSlug: "hearst-ew",
    route: "/hearst-ew/",
    count: 200,
    color: "#E50022",
    brands: [
      ["Best Products", "best-products", 29],
      ["Bicycling", "bicycling", 29],
      ["Men's Health", "mens-health", 29],
      ["Oprah Daily", "oprah-daily", 29],
      ["Popular Mechanics", "popular-mechanics", 28],
      ["Runner's World", "runners-world", 28],
      ["Women's Health", "womens-health", 28],
    ],
  },
] as const;

export const portfolioBrands = brandSections.flatMap((section) =>
  section.brands.map(([name, slug, count]) => ({
    name,
    slug,
    count,
    section: section.name,
  }))
);

export const journeys = [
  { icon: Compass, title: "Discover", copy: "A useful morning briefing brings together trusted stories across brands without asking readers to hunt site by site." },
  { icon: Target, title: "Deepen intent", copy: "Every save, follow, hide and open sharpens the mix while contextual controls keep the reader in charge." },
  { icon: Heart, title: "Build a habit", copy: "Freshness, continuity and remembered interests make the river worth returning to throughout the day." },
];

export const valueProps = [
  { icon: Users, title: "For readers", copy: "Less searching, more signal and a single relationship with the brands they already trust. A Good Housekeeping reader can discover Country Living, Delish or Prevention when the intent overlaps." },
  { icon: BookOpen, title: "For editorial", copy: "A new distribution surface that preserves brand authority while creating cross-brand discovery. Logos, voice, color and typography keep every brand legible inside the shared river." },
  { icon: Gauge, title: "For the business", copy: "More qualified sessions, deeper engagement and relevant commercial moments without breaking trust. Portfolio context creates more inventory without asking readers to start over." },
  { icon: Layers3, title: "For product teams", copy: "One composable system for sections, brands, cards, signals, ranking and experimentation. The same model powers the unified river and every brand destination." },
];

export function DemoNav() {
  return (
    <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_20px_70px_rgba(16,42,67,0.12)]">
      <div className="flex items-center justify-between bg-[#2D75B9] px-4 py-2 text-[11px] font-semibold text-white">
        <span>Shop &nbsp; Newsletter &nbsp; Sign In</span><span>All &nbsp; Lifestyle &nbsp; Autos &nbsp; Flux &nbsp; E&amp;W</span><span>Subscribe</span>
      </div>
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-xs text-slate-400">Mode</span><strong className="text-sm tracking-[0.28em] text-[#2D75B9]">HEARST <span className="font-serif font-normal italic tracking-normal">Magazines</span></strong><span className="text-xs text-slate-400">Search</span>
      </div>
      <div className="flex gap-5 overflow-hidden border-y border-slate-200 px-5 py-3 text-xs font-semibold"><span className="text-[#2D75B9]">For You</span><span>Lifestyle</span><span>Autos</span><span>Flux</span><span>E&amp;W</span><span>Saved</span></div>
      <div className="grid gap-0 md:grid-cols-[1.3fr_1fr]">
        <div
          className="min-h-64 bg-[#E9F2FA] bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${productImage})` }}
        />
        <div className="flex flex-col justify-center p-6">
          <span className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#2D75B9]">Most popular · Culture</span>
          <h3 className="font-serif text-3xl leading-[1.02] text-[#102A43]">A river built around what matters to you now.</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">Trusted reporting, useful context and relevant discoveries, ranked across the Hearst portfolio.</p>
        </div>
      </div>
    </div>
  );
}

export function StoryCard({ ad = false }: { ad?: boolean }) {
  return (
    <article className={`border-t-4 bg-white p-5 shadow-sm ${ad ? "border-[#7A2E57]" : "border-[#2D75B9]"}`}>
      <div className="mb-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-slate-500"><span>{ad ? "Contextual ad" : "Editor pick"}</span><span>{ad ? "Matched to intent" : "Country Living · Home"}</span></div>
      <h3 className="font-serif text-2xl leading-tight text-[#102A43]">{ad ? "Summer home refresh" : "The ideas worth making time for today"}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{ad ? "Commercial utility appears when it adds value to the reader's current mission." : "A complete content model carries brand, topic, format, freshness and trust signals."}</p>
      <div className="mt-5 flex gap-2 text-xs font-bold"><span className="border border-slate-200 px-3 py-2">{ad ? "Shop the edit" : "Save"}</span><span className="border border-slate-200 px-3 py-2">{ad ? "Why this ad" : "More like this"}</span></div>
    </article>
  );
}

export const systemSteps = [
  { icon: Database, title: "Ingest", copy: "Stories, brands, metadata, commerce and campaigns" },
  { icon: Sparkles, title: "Understand", copy: "Topics, format, quality, freshness and reader signals" },
  { icon: Gauge, title: "Rank", copy: "Relevance + recency + affinity + utility" },
  { icon: ShieldCheck, title: "Re-rank", copy: "Diversity, brand balance, safety and business rules" },
];

export function MobileMenuIcon() { return <Menu className="size-5" aria-hidden="true" />; }

export function BrandPortfolioGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-4">
      {brandSections.map((section) => (
        <article key={section.name} className="border border-slate-200 bg-white p-5">
          <Link href={section.route} className="group flex flex-wrap items-end justify-between gap-3">
            <div>
              <LogoMark slug={section.logoSlug} name={section.name} color={section.color} className="h-8 w-44" />
              <p className="sr-only">{section.name}</p>
              <span className="mt-1 block text-sm font-bold text-slate-500 group-hover:text-slate-950">{section.count} stories in this destination</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">{section.brands.length} brands</span>
          </Link>
          <div className={`mt-5 grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
            {section.brands.map(([name, slug, count]) => (
              <Link
                key={slug}
                href={`/brands/${slug}/`}
                className="group flex min-h-16 items-center justify-between gap-3 border border-slate-200 bg-[#F8FAFC] px-3 py-3 hover:border-slate-400"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <LogoMark slug={slug} name={name} color={section.color} />
                  <span className="truncate text-xs font-semibold text-slate-500 group-hover:text-slate-700">{name}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-slate-500">{count}</span>
              </Link>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function BrandLogoMarquee() {
  return <DraggableBrandLogoMarquee brands={portfolioBrands} />;
}

function LogoMark({ slug, name, className = "h-8 w-32", color = "#111111", position = "left center" }: { slug: string; name: string; className?: string; color?: string; position?: string }) {
  const src = brandLogos[slug];
  if (!src || src.startsWith("http")) {
    return <span className="w-32 shrink-0 text-sm font-black uppercase tracking-[0.08em]" style={{ color }}>{name}</span>;
  }

  const style: CSSProperties = {
    backgroundColor: color,
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: position,
    maskPosition: position,
    WebkitMaskSize: "contain",
    maskSize: "contain",
  };

  return <span aria-hidden="true" className={`block shrink-0 ${className}`} style={style} />;
}
