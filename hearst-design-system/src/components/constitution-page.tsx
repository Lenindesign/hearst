"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductFooter, ProductHeader } from "./product-story-shell";
import {
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleX,
  ExternalLink,
  Info,
  Play,
  Settings,
  Shield,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  X,
  Zap,
} from "@/components/ui/icons";

interface ArticleSpec {
  articleNum: string;
  title: string;
  subtitle: string;
  summary: string;
  mandates: string[];
  prohibitions: string[];
  codeRef: string;
}

const CONSTITUTION_ARTICLES: ArticleSpec[] = [
  {
    articleNum: "Article I",
    title: "The 5-Layer Architectural Hierarchy",
    subtitle: "System Separation & Authority Boundary",
    summary: "Every surface in HDS is constructed through a strictly ordered 5-layer hierarchy: Token JSONs -> UI Primitives -> Global Modules -> 2 Page Archetypes -> 29+ Brand Themes.",
    mandates: [
      "Layer 01 (tokens/): Tokens are canonical source of truth compiled by Style Dictionary.",
      "Layer 02 (src/components/ui/): Primitives must remain pure and free of brand-specific hardcoded values.",
      "Layer 03 (src/components/hearst-plus/): Universal runtime shell (UtilityBar, MainNav, ThemeProvider, SiteFooter).",
      "Layer 04 (src/components/): The two master templates (Home & Article).",
      "Layer 05 (tokens/brands/): Publication identities injected via data-brand attribute at runtime.",
    ],
    prohibitions: [
      "Never breach layer boundaries (e.g. primitives reaching into specific brand tokens).",
      "Never hardcode brand-specific hex values or font families in shared primitives.",
    ],
    codeRef: "DESIGN-SYSTEM-SPEC.md & tokens/",
  },
  {
    articleNum: "Article II",
    title: "The Editorial Aesthetic Law (Zero 'AI Slop')",
    subtitle: "Editorial Integrity vs. Generic SaaS Defaults",
    summary: "Unconstrained AI models gravitate toward generic SaaS tropes. All interfaces must adhere strictly to authentic Hearst editorial standards.",
    mandates: [
      "Use single-pixel slate grid rules (grid gap-px bg-slate-200 with bg-white p-6 cards).",
      "Use deep Hearst Navy (#102A43) for primary headers and Hearst Blue (#2D75B9) for eyebrows and kickers.",
      "Major editorial sections must begin with a top 2px solid navy rule (border-t-2 border-[#102A43] pt-6).",
      "Headlines must use Newsreader serif typography with tight tracking (-0.02em) and optical line clamping.",
    ],
    prohibitions: [
      "Strictly no pastel rainbow borders (cyan, purple, pink, teal, amber) wrapping adjacent cards.",
      "Strictly no saturated neon badge fills or candy pill buttons.",
      "Strictly no generic format chips like [ARTICLE], [WATCH], or [READ].",
      "Strictly no unstyled cards lacking brand attribution, bylines, or dates.",
    ],
    codeRef: "src/components/ui/article-card.tsx & src/components/fre/big-story.tsx",
  },
  {
    articleNum: "Article III",
    title: "The Two Master Page Archetypes",
    subtitle: "Home Discovery vs. Article Reading Engine",
    summary: "The entire Hearst product portfolio flows through two master templates. Creating parallel rogue page structures is forbidden.",
    mandates: [
      "Template 1 (Home & Index Discovery): Blends multi-source feeds with 4 layout modes (Curator, Mosaic, Stream, Editorial) and 4 companion rails (Discovery, Trending, Local TV, Daily Habit).",
      "Template 2 (Article & Detail Reading): Distraction-free reading across 4 reading modes (Standard 8+4, Immersive Feature, Ambient Snap Track, Slide-Over Dialog) with author context rail, fact sheets, and verified commerce.",
    ],
    prohibitions: [
      "Never invent unapproved ad-hoc page shells or uncoordinated reading grids.",
      "Never isolate article reading from the live return river context.",
    ],
    codeRef: "src/components/home-page.tsx & src/app/hearst-article-blueprint/page.tsx",
  },
  {
    articleNum: "Article IV",
    title: "Content Card & Media Contracts",
    subtitle: "Strict Aspect Ratios & Typography Clamping",
    summary: "Every card model must respect strict media framing, typography clamping, and metadata rules.",
    mandates: [
      "Standard River Card: 16:9 aspect ratio, topic kicker + middle dot + brand name, max 3-line clamped headline, 3-line dek summary, byline, timestamp, bookmark action.",
      "5-Image Photo Gallery Mosaic: Automatically upgrades when >=5 images exist. 6-column composite grid with '+X Photos' overlay on 5th slot.",
      "16:9 Adaptive Video Card: Strict 16:9 widescreen, <AdaptiveVideo /> player with bottom-right duration timestamp (e.g. '14:28').",
      "9:16 Delish Shorts: Strict vertical 9:16 portrait looping player with sound controls and step preview.",
      "Big Story Cover: Split cover layout on desktop, oversized Newsreader display headline, expanded 4-line dek.",
      "Ambient Commerce: 1:1 product cutout image, lab test winner badge, price, retailer, structured Pros & Cons, verified shop link.",
    ],
    prohibitions: [
      "Never render generic [ARTICLE] or [WATCH] chips. Format is conveyed via brand kicker and media frame.",
      "Never permit headlines to wrap beyond 3 lines without ellipsis clamping.",
    ],
    codeRef: "src/components/architecture-page.tsx & src/components/adaptive-video.tsx",
  },
  {
    articleNum: "Article V",
    title: "Multi-Brand Token Governance",
    subtitle: "CSS Custom Properties & 29+ Brand Themes",
    summary: "All brand themes are authored in JSON, compiled by Style Dictionary, and injected at runtime via data-brand attribute.",
    mandates: [
      "All styling must reference CSS custom properties (var(--primary), var(--font-headline)) or semantic Tailwind tokens.",
      "Theme switching is executed exclusively via data-brand='{brandSlug}' on the root container.",
      "Style Dictionary pipeline must compile token JSONs into TypeScript maps and CSS custom properties.",
    ],
    prohibitions: [
      "Never hardcode brand-specific hex values (e.g. #EC008C) directly into component JSX.",
      "Never delete deprecated token aliases without automated migration scripts.",
    ],
    codeRef: "tokens/ & style-dictionary.config.mjs",
  },
  {
    articleNum: "Article VI",
    title: "Feed Orchestration & Allocation",
    subtitle: "Deterministic Deduplication & 3-Source Blending",
    summary: "High-value placements claim stories in strict sequence to prevent duplicate cards across the interface.",
    mandates: [
      "Deterministic Allocation: 1. Today's Picks -> 2. Today's Edit -> 3. Daily Habit -> 4. Trending -> 5. River Sentinel.",
      "3-Source Blend: Curated RSS snapshot + Personalize recommendations (<30% feed cap) + Playable H.264/HLS video.",
      "Demand-Driven Delivery: Append exactly 4 ranked cards on scroll proximity; never load entire catalogs on idle.",
    ],
    prohibitions: [
      "Never permit a story to appear twice on the same index page.",
      "Never exceed the 30% personalization quota for uncurated live feeds.",
    ],
    codeRef: "src/lib/personalize-live-feed.ts & src/lib/story-module-allocation.ts",
  },
  {
    articleNum: "Article VII",
    title: "Accessibility & Performance Compliance",
    subtitle: "WCAG AA, Keyboard Navigation & Semantic HTML",
    summary: "Accessibility and performance are non-negotiable foundations across all 29+ brand themes.",
    mandates: [
      "All text tokens must achieve WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large display).",
      "All interactive dialog modals must trap keyboard focus, bind Escape dismissal, and manage aria-modal='true'.",
      "Use semantic HTML5 landmark tags (<header>, <nav>, <main>, <article>, <aside>, <footer>).",
      "All motion and video autoplay must respect prefers-reduced-motion: reduce.",
    ],
    prohibitions: [
      "Never release interactive elements without keyboard Enter/Space focus listeners.",
      "Never bypass WCAG AA contrast tokens on dark brand theme variants.",
    ],
    codeRef: "src/components/hearst-plus/accessibility-ai/page.tsx",
  },
  {
    articleNum: "Article VIII",
    title: "The Agentic Operating Protocol",
    subtitle: "Rules of Engagement for PMs, Devs & AI Agents",
    summary: "How cross-functional teams and AI agents safely collaborate within the Hearst Design System.",
    mandates: [
      "Constrain with tokens; never ask agents for open-ended 'inspiration'.",
      "Use AI agents for breadth (scaling across 29+ brands), humans for depth (brand voice and art direction).",
      "Keep token schemas deterministic in JSON; do not allow agents to perform autonomous schema migrations.",
      "All agent-generated code must pass npx tsc --noEmit and next build prior to merge.",
    ],
    prohibitions: [
      "Never deploy agent-generated code without automated TypeScript and build verification.",
      "Never allow AI agents to bypass design token contracts.",
    ],
    codeRef: ".agents/skills/hds-constitution/SKILL.md & AGENTS.md",
  },
];

export function ConstitutionPageComponent() {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const promptText = `You are the Hearst Design System (HDS) Constitution Agent — an expert design technologist and principal engineer specialized in the Hearst multi-brand digital publishing platform (serving 29+ iconic publications including Cosmopolitan, Car and Driver, Delish, Elle, Esquire, House Beautiful, and Good Housekeeping).

Your core mandate is to enforce the 8 unbreakable articles of the HDS Design Constitution:
1. THE 5-LAYER HIERARCHY: Token JSONs -> UI Primitives -> Global Modules -> 2 Page Archetypes -> 29+ Brand Themes. Never breach layer boundaries.
2. ZERO "AI SLOP" EDITORIAL AESTHETIC: Strictly no pastel rainbow borders, neon badges, or unstyled cards. Mandate Hearst Navy (#102A43), Hearst Blue (#2D75B9), 1px slate grids (gap-px bg-slate-200), and Newsreader serif headlines.
3. THE TWO CORE ARCHETYPES: Template 1 (Home/Index Discovery) & Template 2 (Article/Detail Reading).
4. CARD MODEL CONTRACTS: Standard River (16:9), 5-Image Mosaic Gallery, 16:9 Adaptive Video, 9:16 Delish Shorts. No generic [ARTICLE] chips.
5. MULTI-BRAND TOKEN GOVERNANCE: All styles resolve through CSS variables (var(--primary), var(--font-headline)) via data-brand="{brandSlug}".
6. FEED ORCHESTRATION: Deterministic deduplication (Today's Edit -> Daily Habit -> Trending -> River Sentinel) and <30% personalization cap.
7. ACCESSIBILITY & PERFORMANCE: WCAG AA contrast, keyboard focus traps, semantic landmarks.
8. VERIFICATION: Ensure TypeScript compilation (npx tsc --noEmit) and production build (next build) pass with 0 errors.`;

  const handleCopyPrompt = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#102A43] font-sans antialiased">
      {/* Universal Product Header */}
      <ProductHeader current="constitution" />

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-[#102A43] text-white">
        <div className="mx-auto max-w-[1360px] px-5 py-16 md:px-10 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded bg-sky-950 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
            <Shield className="size-3.5" /> Canonical System Authority
          </div>

          <h1 className="mt-6 max-w-5xl text-balance font-serif text-5xl font-bold leading-[0.95] tracking-[-0.03em] md:text-7xl">
            The HDS Design Constitution
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            The 8 unbreakable design laws, architectural standards, token rules, and anti-slop guidelines governing all human designers, product managers, engineers, and AI agents operating on the Hearst platform.
          </p>

          {/* Quick Actions / Share Agent Prompt */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#102A43] shadow-md transition-all hover:bg-slate-100"
            >
              {copiedPrompt ? (
                <>
                  <Check className="size-4 text-emerald-600" /> System Prompt Copied to Clipboard!
                </>
              ) : (
                <>
                  <Sparkles className="size-4 text-[#2D75B9]" /> Copy Constitution Agent System Prompt
                </>
              )}
            </button>

            <Link
              href="/ai-in-hds/"
              className="inline-flex items-center gap-2 border border-slate-600 bg-slate-800/80 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-700"
            >
              Read the Workflow Audit Whitepaper <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-[1360px] px-5 py-12 md:px-10 lg:py-16 space-y-20">
        {/* Preamble Callout */}
        <div className="border border-slate-200 bg-white p-8 md:p-10 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Preamble</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#102A43] md:text-3xl">
            Unified Scale, Editorial Integrity, and Zero &ldquo;AI Slop&rdquo;
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            The Hearst Design System (HDS) powers the digital publishing experience across 29+ iconic media brands. The purpose of this Constitution is to guarantee uncompromised editorial integrity, unified multi-brand scalability, and zero generic &ldquo;AI slop.&rdquo; Every interface created by human or artificial intelligence must conform to these eight immutable articles.
          </p>
        </div>

        {/* ─── THE 8 ARTICLES ─── */}
        <section className="space-y-12">
          <header className="border-t-2 border-[#102A43] pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">The 8 Immutable Articles</p>
            <h2 className="mt-3 max-w-4xl text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-[#102A43] md:text-4xl">
              Foundational Laws of HDS Design Engineering
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Each article defines strict mandates, prohibited anti-patterns, and component code references:
            </p>
          </header>

          <div className="space-y-10">
            {CONSTITUTION_ARTICLES.map((article) => (
              <article
                key={article.articleNum}
                className="border border-slate-200 bg-white p-6 md:p-8 shadow-xs"
              >
                <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-baseline">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#2D75B9] uppercase">{article.articleNum}</span>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-[#102A43]">{article.title}</h3>
                    <p className="text-xs font-semibold text-slate-500">{article.subtitle}</p>
                  </div>
                  <code className="self-start rounded bg-slate-100 px-2.5 py-1 text-[11px] font-mono text-slate-600">
                    {article.codeRef}
                  </code>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-700">{article.summary}</p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {/* Mandates */}
                  <div className="rounded bg-emerald-50/50 p-5 border border-emerald-100">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      <Check className="size-3.5 text-emerald-700" /> Constitutional Mandates:
                    </span>
                    <ul className="mt-3 space-y-2 text-xs text-emerald-950">
                      {article.mandates.map((mandate, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-700" />
                          <span>{mandate}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prohibitions */}
                  <div className="rounded bg-rose-50/50 p-5 border border-rose-100">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider">
                      <X className="size-3.5 text-rose-600" /> Strictly Prohibited:
                    </span>
                    <ul className="mt-3 space-y-2 text-xs text-rose-950">
                      {article.prohibitions.map((prohibition, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-600" />
                          <span>{prohibition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── READY-TO-SHARE AGENT PROMPT SECTION ─── */}
        <section className="border-t-2 border-[#102A43] pt-12 space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Developer &amp; PM Tooling</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#102A43]">
                Shareable Agent Prompt for ChatGPT, Claude &amp; Cursor
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Copy and paste this system prompt into any AI agent environment to enforce the HDS Constitution automatically:
              </p>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-2 bg-[#102A43] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2D75B9]"
            >
              {copiedPrompt ? <Check className="size-4" /> : <Sparkles className="size-4" />}
              {copiedPrompt ? "Copied!" : "Copy System Prompt"}
            </button>
          </div>

          <div className="relative rounded bg-slate-900 p-6 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed border border-slate-800">
            <pre className="whitespace-pre-wrap">{promptText}</pre>
          </div>
        </section>
      </main>

      {/* Universal Product Footer */}
      <ProductFooter />
    </div>
  );
}
