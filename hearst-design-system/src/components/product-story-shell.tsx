import Link from "next/link";
import type { CSSProperties } from "react";
import { DraggableBrandLogoMarquee } from "@/components/brand-logo-marquee";
import { SiteFooter } from "@/components/fre/site-footer";
import type { BrandTheme } from "@/lib/brands";
import { brandLogos } from "@/lib/logos";
import { themeOptions } from "@/lib/theme-options";

export const productImage = "https://hips.hearstapps.com/hmg-prod/images/jimmy-tatro-and-zoey-deutch-attend-the-2025-lacma-art-film-news-photo-1762180233.pjpeg";

export function ProductHeader({ current }: { current: "story" | "blueprint" }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-5 px-5 py-4 md:px-10">
        <Link href="/hearst-all/" className="flex items-center" aria-label="Hearst Magazines">
          <LogoMark slug="hearst-all" name="Hearst Magazines" color="#2D75B9" className="h-6 w-40" />
        </Link>
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
  { title: "Discover", copy: "A useful morning briefing brings together trusted stories across brands without asking readers to hunt site by site." },
  { title: "Deepen intent", copy: "Every save, follow, hide and open sharpens the mix while contextual controls keep the reader in charge." },
  { title: "Build a habit", copy: "Freshness, continuity and remembered interests make the river worth returning to throughout the day." },
];

export const valueProps = [
  { title: "For readers", copy: "Less searching, more signal and a single relationship with the brands they already trust. A Good Housekeeping reader can discover Country Living, Delish or Prevention when the intent overlaps." },
  { title: "For editorial", copy: "A new distribution surface that preserves brand authority while creating cross-brand discovery. Logos, voice, color and typography keep every brand legible inside the shared river." },
  { title: "For the business", copy: "More qualified sessions, deeper engagement and relevant commercial moments without breaking trust. Portfolio context creates more inventory without asking readers to start over." },
  { title: "For product teams", copy: "One composable system for sections, brands, cards, signals, ranking and experimentation. The same model powers the unified river and every brand destination." },
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
  { title: "Ingest", copy: "Stories, brands, metadata, commerce and campaigns" },
  { title: "Understand", copy: "Topics, format, quality, freshness and reader signals" },
  { title: "Rank", copy: "Relevance + recency + affinity + utility" },
  { title: "Re-rank", copy: "Diversity, brand balance, safety and business rules" },
];

export function MobileMenuIcon() { return <span aria-hidden="true" className="block h-3 w-5 border-y-2 border-current" />; }

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

export function DestinationConvergence() {
  return (
    <div className="overflow-hidden border border-slate-200 bg-white">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2D75B9]">Destination logic</p>
          <h3 className="mt-4 font-serif text-4xl leading-none">One personalized river, four clear entry points.</h3>
          <p className="mt-5 text-sm leading-6 text-slate-600">Readers can enter through a broad destination, a specific brand, a saved habit, or a topic. The product keeps those paths connected so intent can move across the portfolio without losing brand trust.</p>
        </div>
        <div className="p-6">
          <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] 2xl:items-center">
            <div className="min-w-0 space-y-3">
              {brandSections.map((section) => (
                <Link key={section.name} href={section.route} className="group flex items-center justify-between gap-4 border border-slate-200 bg-[#F8FAFC] p-4 hover:border-slate-400">
                  <span className="flex min-w-0 items-center gap-3">
                    <LogoMark slug={section.logoSlug} name={section.name} color={section.color} className="h-7 w-36" />
                    <span className="sr-only">{section.name}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800">{section.count} stories</span>
                </Link>
              ))}
            </div>
            <div className="hidden h-px w-full bg-[#2D75B9] 2xl:block" />
            <Link href="/hearst-all/" className="flex min-h-56 min-w-0 flex-col justify-center bg-[#102A43] p-6 text-white hover:bg-[#143653]">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">Unified river</span>
              <strong className="mt-4 max-w-sm text-wrap font-serif text-3xl leading-none sm:text-4xl">Personalized daily briefing</strong>
              <span className="mt-5 text-sm leading-6 text-slate-300">A ranked mix that blends followed brands, current intent, freshness, utility and controlled discovery.</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JourneyMatrix() {
  const rows = [
    ["Morning brief", "Open the river", "Scan useful highlights", "Save or follow what matters", "Briefed and ready"],
    ["Intent deepening", "Search or tap a topic", "Explore multi-brand coverage", "Ask for more like this", "Topic mastered"],
    ["Return habit", "Resume where you left off", "See what changed", "Engage and save again", "Habit reinforced"],
  ];

  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.14em] text-[#2D75B9]">
            <th className="w-52 p-5">Journey</th>
            <th className="p-5">Entry</th>
            <th className="p-5">Explore</th>
            <th className="p-5">Signal</th>
            <th className="p-5">Outcome</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-slate-200 last:border-b-0">
              {row.map((cell, index) => (
                <td key={cell} className={`p-5 align-top ${index === 0 ? "font-serif text-2xl leading-tight text-[#102A43]" : "text-slate-600"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RankingExample() {
  const factors = [
    ["Popularity", "18.5", "Strong engagement today"],
    ["Followed topic", "15.1", "Home and design interest"],
    ["Followed brand", "13.4", "House Beautiful affinity"],
    ["Saved tags", "10.1", "Kitchen and small spaces"],
    ["More like this", "8.6", "Similar stories saved"],
    ["Recency", "6.3", "Published recently"],
    ["Daypart", "6.1", "Evening reader session"],
    ["Diversity", "5.1", "Mix across brands"],
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <StoryCard />
      <div className="border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-5 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2D75B9]">Why this ranked here</p>
            <h3 className="mt-3 font-serif text-3xl leading-none">Score breakdown example</h3>
          </div>
          <strong className="font-serif text-4xl leading-none text-[#2D75B9]">84</strong>
        </div>
        <div className="mt-5 space-y-4">
          {factors.map(([name, score, reason]) => (
            <div key={name} className="grid gap-3 sm:grid-cols-[9rem_1fr_3rem] sm:items-center">
              <div>
                <strong className="text-sm">{name}</strong>
                <p className="mt-1 text-xs text-slate-500">{reason}</p>
              </div>
              <div className="h-2 bg-slate-100"><div className="h-2 bg-[#2D75B9]" style={{ width: `${Number(score) * 4}%` }} /></div>
              <span className="text-right text-xs font-bold text-slate-500">{score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArchitectureFlow() {
  const columns = [
    ["Sources", "Public feeds, CMS metadata, images, commerce and campaign payloads"],
    ["Normalize", "Brand, topic, format, freshness, media, canonical URL and eligibility"],
    ["Understand", "Entities, intent, quality, reader profile and session context"],
    ["Decide", "Score, diversify, cap repetition, explain and select modules"],
    ["Deliver", "Render routes, cards, controls, analytics and experiments"],
  ];

  return (
    <div className="border border-slate-200 bg-white p-6">
      <div className="grid gap-3 lg:grid-cols-5">
        {columns.map(([title, copy], index) => (
          <div key={title} className="relative border border-slate-200 bg-[#F8FAFC] p-4">
            <span className="font-mono text-xs text-[#2D75B9]">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-8 font-bold">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-600">{copy}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 text-xs leading-5 text-slate-600 md:grid-cols-3">
        <p><strong className="text-[#102A43]">Server:</strong> ingestion, authentication, rate limits and decision orchestration.</p>
        <p><strong className="text-[#102A43]">Static:</strong> marketing pages, brand assets, logos, images and fonts.</p>
        <p><strong className="text-[#102A43]">Client:</strong> rendering, controls, session signals, accessibility and state.</p>
      </div>
    </div>
  );
}

export function PaletteSystem() {
  const palette = [
    ["Hearst Blue", "#2D75B9", "#74B9F5"],
    ["Deep Ink", "#102A43", "#F2F2F2"],
    ["Lifestyle", "#7A2E57", "#FE8CBC"],
    ["Autos", "#1B5F8A", "#78BDE8"],
    ["Flux", "#121212", "#F2F2F2"],
    ["E&W", "#E50022", "#FF7184"],
  ];

  return (
    <div className="border border-slate-200 bg-white p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2D75B9]">Color system</p>
          <h3 className="mt-4 font-serif text-4xl leading-none">Section color has a light-mode and dark-mode companion.</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">The prototype uses section color for identity and a companion tint when the same identity appears on dark surfaces. This keeps brand recognition without sacrificing contrast.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {palette.map(([name, primary, companion]) => (
            <div key={name} className="border border-slate-200 p-4">
              <div className="flex gap-2">
                <span className="h-12 flex-1 border border-slate-200" style={{ backgroundColor: primary }} />
                <span className="h-12 flex-1 border border-slate-200" style={{ backgroundColor: companion }} />
              </div>
              <strong className="mt-3 block text-sm">{name}</strong>
              <span className="mt-1 block text-xs text-slate-500">{primary} · {companion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandStyleGuide() {
  const sectionThemes = brandSections.map((section) => {
    const theme = themeOptions.find((option) => option.slug === section.logoSlug);
    return { section, theme };
  });

  return (
    <div className="space-y-8">
      <div className="border border-slate-200 bg-white p-6">
        <div className="grid gap-5 border-b border-slate-200 pb-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2D75B9]">Section style guides</p>
            <h3 className="mt-4 font-serif text-4xl leading-none">Destinations set the broad visual voice.</h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">Each destination has a primary color, headline treatment and dark-mode companion. Individual brands inherit the section context when their own brand token is not available.</p>
        </div>
        <div className="mt-6 grid gap-3 xl:grid-cols-2">
          {sectionThemes.map(({ section, theme }) => (
            <StyleTile
              key={section.name}
              name={section.name}
              slug={section.logoSlug}
              href={section.route}
              color={section.color}
              accent={theme?.colors["2"] || "#F2F2F2"}
              headline={theme?.fontHeadline || "Newsreader"}
              body={theme?.fontDefault || "Inter"}
              sample="Distinct editorial rhythm"
            />
          ))}
        </div>
      </div>

      {brandSections.map((section) => (
        <article key={section.name} className="border border-slate-200 bg-white p-6">
          <Link href={section.route} className="group flex flex-wrap items-end justify-between gap-4">
            <div>
              <LogoMark slug={section.logoSlug} name={section.name} color={section.color} className="h-8 w-44" />
              <p className="mt-2 text-sm font-bold text-slate-500 group-hover:text-slate-900">{section.name} brand styles</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{section.brands.length} brands</span>
          </Link>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {section.brands.map(([name, slug]) => {
              const theme = getBrandStyleTheme(slug, section.logoSlug);
              const inherited = theme.slug === section.logoSlug;
              return (
                <StyleTile
                  key={slug}
                  name={name}
                  slug={slug}
                  href={`/brands/${slug}/`}
                  color={theme.colors["1"] || section.color}
                  accent={theme.colors["2"] || "#F2F2F2"}
                  headline={theme.fontHeadline}
                  body={theme.fontDefault}
                  sample={inherited ? "Section inherited theme" : "Brand voice sample"}
                  inherited={inherited}
                />
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}

function getBrandStyleTheme(slug: string, sectionSlug: string): BrandTheme {
  const aliases: Record<string, string> = {
    "pioneer-woman": "the-pioneer-woman",
  };
  return (
    themeOptions.find((option) => option.slug === slug) ||
    themeOptions.find((option) => option.slug === aliases[slug]) ||
    themeOptions.find((option) => option.slug === sectionSlug) ||
    themeOptions[0]
  );
}

function StyleTile({ name, slug, href, color, accent, headline, body, sample, inherited = false }: { name: string; slug: string; href: string; color: string; accent: string; headline: string; body: string; sample: string; inherited?: boolean }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-5 border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-slate-400 sm:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <LogoMark slug={slug} name={name} color="#111111" className="h-8 w-36" />
          <p className="mt-3 text-xs font-bold text-slate-500 group-hover:text-slate-800">{name}</p>
        </div>
        <div className="mt-5">
          <div className="flex gap-2">
            <span className="h-9 flex-1 border border-slate-200" style={{ backgroundColor: color }} />
            <span className="h-9 flex-1 border border-slate-200" style={{ backgroundColor: accent }} />
          </div>
          <p className="mt-2 font-mono text-[11px] text-slate-500">{color} · {accent}</p>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#2D75B9]">Type sample</span>
          {inherited && <span className="border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">section inherited</span>}
        </div>
        <p className="mt-3 max-w-full text-balance text-2xl leading-[1.05] text-[#102A43]" style={{ fontFamily: `"${headline}", Georgia, serif`, fontWeight: 700 }}>{sample}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600" style={{ fontFamily: `"${body}", Inter, system-ui, sans-serif` }}>Body copy uses the brand default font for metadata, controls and explanatory text.</p>
        <dl className="mt-4 grid gap-2 border-t border-slate-200 pt-4 text-xs text-slate-600 sm:grid-cols-2">
          <div><dt className="font-bold text-[#102A43]">Headline</dt><dd className="mt-1">{headline}</dd></div>
          <div><dt className="font-bold text-[#102A43]">Body</dt><dd className="mt-1">{body}</dd></div>
        </dl>
      </div>
    </Link>
  );
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
