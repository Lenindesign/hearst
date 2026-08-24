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

interface WorkflowAuditItem {
  id: string;
  title: string;
  category: "High Leverage (🟢)" | "Conditional (🟡)" | "Fragile / Limited (🔴)";
  score: string;
  verdict: "High Utility" | "Moderate Utility" | "Fragile / High Risk";
  statusColor: "emerald" | "amber" | "rose";
  summary: string;
  whatWorks: string[];
  whatFails: string[];
  hdsRecommendation: string;
}

const WORKFLOW_AUDITS: WorkflowAuditItem[] = [
  {
    id: "docs",
    title: "01. Architecture Synthesis & Living Documentation",
    category: "High Leverage (🟢)",
    score: "9.5 / 10",
    verdict: "High Utility",
    statusColor: "emerald",
    summary: "Compiling complex cross-template rules, 5-layer hierarchy matrices, sidebar rail behaviors, and component contracts into interactive, living documentation.",
    whatWorks: [
      "Translates complex markdown specs (DESIGN-SYSTEM-SPEC.md, APP_RULES.md) into interactive React documentation pages in minutes.",
      "Maintains 100% fidelity with codebase contracts without manual copy-pasting.",
      "Synthesizes multi-page state matrices (Home vs Article, reading modes, layout switchers).",
    ],
    whatFails: [
      "Can omit edge cases if context window doesn't capture all dependent sub-components.",
      "Requires explicit instructions to avoid defaulting to generic SaaS documentation styles.",
    ],
    hdsRecommendation: "Use AI agents to maintain and generate living architectural reference hubs for every major design system release.",
  },
  {
    id: "tokens-multi-brand",
    title: "02. Multi-Brand Token Propagation (29+ Brands)",
    category: "High Leverage (🟢)",
    score: "9.0 / 10",
    verdict: "High Utility",
    statusColor: "emerald",
    summary: "Translating brand design decisions into Style Dictionary token mappings and applying them across 29+ publication identities.",
    whatWorks: [
      "Propagates token variable changes across all brand directories (Cosmopolitan, Car and Driver, Delish, etc.) without human fatigue.",
      "Generates type-safe TypeScript maps and CSS custom properties matching JSON schemas.",
      "Accurately maps semantic aliases (e.g. --font-headline -> Newsreader for editorial vs Livvic for tech).",
    ],
    whatFails: [
      "Cannot visually verify optical contrast anomalies across rare brand color combinations without automated CI checks.",
      "Can introduce subtle typos in token naming if unconstrained by strict TypeScript interfaces.",
    ],
    hdsRecommendation: "Pair agent token expansion with deterministic Style Dictionary builds and automated contrast validation tests.",
  },
  {
    id: "scaffolding",
    title: "03. Component & Layout Scaffolding",
    category: "High Leverage (🟢)",
    score: "8.5 / 10",
    verdict: "High Utility",
    statusColor: "emerald",
    summary: "Assembling responsive multi-column layouts, 5-image composite grids, aspect ratio containers, and accessible Radix/shadcn primitives from design specs.",
    whatWorks: [
      "Rapidly generates complex responsive layouts (8+4 reading grids, 5-image mosaic layouts, 9:16 vertical shorts containers).",
      "Correctly hooks up ARIA attributes, focus traps, keyboard shortcuts, and semantic landmarks.",
      "Eliminates hours of boilerplate construction for new card models and sidebar rails.",
    ],
    whatFails: [
      "Tendency to inject ad-hoc utility classes rather than using canonical design tokens unless strictly prompted.",
      "May misinterpret mobile collapse rules without explicit responsive breakpoint specs.",
    ],
    hdsRecommendation: "Feed agents explicit design system token contracts and component schemas as part of the system prompt.",
  },
  {
    id: "guardrails",
    title: "04. Pattern Auditing & Rule Enforcement",
    category: "Conditional (🟡)",
    score: "7.5 / 10",
    verdict: "Moderate Utility",
    statusColor: "amber",
    summary: "Scanning codebase components to flag anti-patterns, banned generic chips ('Watch', 'Article'), aspect ratio violations, or missing byline metadata.",
    whatWorks: [
      "Excellent at grep/pattern scanning for deprecated utility classes, non-token colors, or unauthorized UI chips.",
      "Verifies that required metadata zones (brand kicker, byline, timestamp, action bar) exist on all card models.",
    ],
    whatFails: [
      "Lacks contextual understanding of intentional editorial exceptions (e.g. a breaking news live badge).",
      "Can produce false positives if rules are ambiguously defined in markdown docs.",
    ],
    hdsRecommendation: "Express design system rules as clear, boolean linting rules and test suites rather than loose conversational guidelines.",
  },
  {
    id: "token-governance",
    title: "05. Autonomous Token Governance & Versioning",
    category: "Fragile / Limited (🔴)",
    score: "3.0 / 10",
    verdict: "Fragile / High Risk",
    statusColor: "rose",
    summary: "Allowing AI agents to autonomously migrate token schemas, rename legacy variables, or manage bi-directional Figma-to-code token sync.",
    whatWorks: [
      "Generating pull request diffs for human review when migrating deprecated tokens.",
    ],
    whatFails: [
      "Can silently hallucinate semantic token bindings or alter inheritance chains across brand overrides.",
      "Breaks backwards compatibility if legacy token aliases are unintentionally deleted.",
      "Cannot resolve merge conflicts between Figma Token Studio variables and production CSS custom properties autonomously.",
    ],
    hdsRecommendation: "Never permit autonomous token schema migrations. Keep the token source of truth governed by deterministic JSON schemas and human sign-off.",
  },
  {
    id: "taste",
    title: "06. Autonomous Aesthetic Judgment & Optical Pacing",
    category: "Fragile / Limited (🔴)",
    score: "2.0 / 10",
    verdict: "Fragile / High Risk",
    statusColor: "rose",
    summary: "Relying on AI models to generate editorial aesthetics, color palettes, optical typography spacing, or editorial visual hierarchy from scratch.",
    whatWorks: [
      "Executing human-defined typographic hierarchies (e.g. applying Newsreader 32px with -0.02em tracking).",
    ],
    whatFails: [
      "Standard LLMs default to generic 'AI slop' aesthetics: pastel rainbow borders, neon badges, candy pills, and generic SaaS card styles.",
      "Zero optical perception of typographic weight balance, serif kerning, or editorial pacing.",
      "Cannot make nuanced editorial judgments on image crop compositions or visual tone.",
    ],
    hdsRecommendation: "Designers must strictly author the aesthetic vision, typography tokens, and brand palettes. AI agents should only implement and scale that vision.",
  },
];

const BRAND_THEME_SPECIMENS = [
  {
    slug: "cosmopolitan",
    name: "Cosmopolitan",
    primary: "#EC008C",
    fontHeadline: "Playfair Display, serif",
    category: "Style & Culture",
    title: "The Subtle Art of Boundary Setting in High-Stakes Relationships",
    dek: "Why modern psychologists say learning to pause before agreeing is the ultimate act of self-preservation.",
    author: "Emma S. Gross",
    image: "https://hips.hearstapps.com/hmg-prod/images/body-lotion-opener-691e31beacd6b.png",
  },
  {
    slug: "car-and-driver",
    name: "Car and Driver",
    primary: "#D0021B",
    fontHeadline: "Livvic, sans-serif",
    category: "Performance Testing",
    title: "Track Attack: 2026 Porsche 911 GT3 RS Shatters VIR Grand Course Record",
    dek: "With 518 naturally aspirated horsepower and radical active aero, Porsche's weapon sets a blistering new benchmark.",
    author: "Dave VanderWerp",
    image: "https://hips.hearstapps.com/hmg-prod/images/4cf6b4aa-4f88-469f-a235-545368381794.jpeg",
  },
  {
    slug: "delish",
    name: "Delish",
    primary: "#FF4A00",
    fontHeadline: "Newsreader, serif",
    category: "Weeknight Dinners",
    title: "Crispy Garlic Butter Smash Potatoes in Under 20 Minutes",
    dek: "The secret to restaurant-quality crispiness lies in double boiling and a splash of malt vinegar before searing.",
    author: "June Xie",
    image: "https://hips.hearstapps.com/hmg-prod/images/f6b3c525-576e-4b56-a6d3-350a327a4531.jpg",
  },
  {
    slug: "house-beautiful",
    name: "House Beautiful",
    primary: "#1A5276",
    fontHeadline: "Newsreader, serif",
    category: "Design Inspiration",
    title: "Inside a Coastal Maine Barn Converted Into a Serene Guest Haven",
    dek: "A 19th-century timber frame becomes a sun-drenched coastal retreat filled with natural textures and salvaged heritage wood.",
    author: "Hadley Keller",
    image: "https://hips.hearstapps.com/hmg-prod/images/bd62be17-e3bc-47ce-998b-df0fb3603b5b.jpeg",
  },
  {
    slug: "good-housekeeping",
    name: "Good Housekeeping",
    primary: "#0072CE",
    fontHeadline: "Newsreader, serif",
    category: "Lab Tested & Approved",
    title: "The 12 Best Vacuum Cleaners of 2026, Tested in Our Labs",
    dek: "Our Cleaning Lab experts tested over 80 upright, cordless, and robot vacuums on hardwood, carpet, and pet hair.",
    author: "Carolyn Forte",
    image: "https://hips.hearstapps.com/hmg-prod/images/8e24db63-0a89-4b73-b52e-e403f15f4664.jpeg",
  },
];

export function AiInHdsPageComponent() {
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("cosmopolitan");
  const [slopViewMode, setSlopViewMode] = useState<"comparison" | "ai-default" | "hds-standard">("comparison");

  const activeBrand = BRAND_THEME_SPECIMENS.find((b) => b.slug === selectedBrandSlug) ?? BRAND_THEME_SPECIMENS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#102A43] font-sans antialiased">
      {/* Universal Product Header */}
      <ProductHeader current="ai-in-hds" />

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-[#102A43] text-white">
        <div className="mx-auto max-w-[1360px] px-5 py-16 md:px-10 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded bg-sky-950 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
            <Zap className="size-3.5" /> HDS Design Engineering Whitepaper
          </div>

          <h1 className="mt-6 max-w-5xl text-balance font-serif text-5xl font-bold leading-[0.95] tracking-[-0.03em] md:text-7xl">
            State of AI in Design Systems: The HDS Reality
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            An evidence-based evaluation of AI agents updating and leveraging the Hearst Design System: utility boundaries, the editorial taste gap, token governance, and multi-brand scaling.
          </p>

          {/* Question Box Callout */}
          <div className="mt-10 border-l-4 border-sky-400 bg-slate-800/80 p-6 text-sm md:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-300">The Question from Design Leadership:</p>
            <blockquote className="mt-3 font-serif text-lg italic text-slate-100 md:text-xl">
              &ldquo;How would you characterize the current state of AI integration for designers updating/leveraging agents within HDS workflows? Is it: 1) Tools don&apos;t do what design systems need accurately yet? 2) Limited utility in some workflows while useful in others? 3) Something else entirely?&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-[1360px] px-5 py-12 md:px-10 lg:py-16 space-y-24">
        {/* ─── SECTION 1: THE EXECUTIVE VERDICT ─── */}
        <section className="space-y-8">
          <header className="border-t-2 border-[#102A43] pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Executive Verdict</p>
            <h2 className="mt-3 max-w-4xl text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-[#102A43] md:text-4xl">
              The Definitive Answer: A High-Utility Accelerator for Deterministic Systems
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              The reality is neither &ldquo;AI is completely broken&rdquo; nor &ldquo;AI can autonomously run design systems.&rdquo; It is a <strong>disciplined co-pilot model</strong>: extraordinarily powerful for scaffolding and multi-brand scaling, but strictly limited when it comes to autonomous aesthetic taste and token schema governance.
            </p>
          </header>

          {/* The 3 Pillars Matrix */}
          <div className="grid gap-px bg-slate-200 md:grid-cols-3">
            <div className="flex flex-col justify-between bg-white p-7">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold text-emerald-700">PILLAR 01</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">10x ACCELERATOR</span>
                </div>
                <h3 className="mt-4 font-bold text-xl text-[#102A43]">Scale &amp; Scaffolding are Solved</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Agents excel at taking human-defined token JSONs and component rules, instantly generating complex responsive grids (5-image mosaics, 9:16 shorts, 16:9 video cards), accessibility wrappers, and propagating tokens across <strong>29+ publication themes</strong> without manual toil.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <strong>Where it shines:</strong> Code generation, living documentation, token maps.
              </div>
            </div>

            <div className="flex flex-col justify-between bg-white p-7">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold text-amber-700">PILLAR 02</span>
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">THE TASTE GAP</span>
                </div>
                <h3 className="mt-4 font-bold text-xl text-[#102A43]">The &ldquo;AI Slop&rdquo; Default</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Unconstrained LLMs possess zero aesthetic taste. They gravitate toward generic SaaS &ldquo;AI slop&rdquo; (pastel rainbow cards, candy badges, unstyled cards). Authentic editorial design (Newsreader typography, 1px slate grids, restrained navy hierarchy) requires <strong>strict human token constraints</strong>.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <strong>Where it fails:</strong> Autonomous visual design, optical kerning, brand voice.
              </div>
            </div>

            <div className="flex flex-col justify-between bg-white p-7">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold text-rose-700">PILLAR 03</span>
                  <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-800">DETERMINISTIC BOUNDARY</span>
                </div>
                <h3 className="mt-4 font-bold text-xl text-[#102A43]">Tokens Must Remain Deterministic</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  AI agents cannot autonomously own token versioning, bidirectional Figma sync, or schema migrations. They hallucinate aliases and break legacy bindings. The token source-of-truth must remain in deterministic JSON schemas (Style Dictionary, Tokens Studio) verified by CI.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <strong>Where it fails:</strong> Autonomous schema migration, conflict resolution.
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 2: INTERACTIVE TASTE GAP DEMONSTRATION ─── */}
        <section className="space-y-8">
          <header className="border-t-2 border-[#102A43] pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Case Study: The Taste Gap</p>
            <h2 className="mt-3 max-w-4xl text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-[#102A43] md:text-4xl">
              Default Unconstrained AI vs. Constrained HDS Editorial Design
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              When an AI agent is asked to build a card without strict design token constraints, it produces generic, saturated &ldquo;AI slop.&rdquo; When constrained by HDS tokens and rules, it delivers high-fidelity editorial journalism.
            </p>
          </header>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">View Specimen:</span>
            <button
              onClick={() => setSlopViewMode("comparison")}
              className={`px-3 py-1 text-xs font-bold transition-colors ${
                slopViewMode === "comparison" ? "bg-[#102A43] text-white" : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setSlopViewMode("ai-default")}
              className={`px-3 py-1 text-xs font-bold transition-colors ${
                slopViewMode === "ai-default" ? "bg-rose-700 text-white" : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              Unconstrained AI Default (Anti-Pattern)
            </button>
            <button
              onClick={() => setSlopViewMode("hds-standard")}
              className={`px-3 py-1 text-xs font-bold transition-colors ${
                slopViewMode === "hds-standard" ? "bg-emerald-800 text-white" : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              Constrained HDS Editorial Standard
            </button>
          </div>

          {/* Specimen Render Area */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: AI Slop Default */}
            {(slopViewMode === "comparison" || slopViewMode === "ai-default") && (
              <div className="border-2 border-dashed border-rose-300 bg-rose-50/40 p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                    <CircleX className="size-4 text-rose-600" /> What AI Generates by Default
                  </div>
                  <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                    &ldquo;AI SLOP&rdquo; ANTI-PATTERN
                  </span>
                </div>

                <ul className="mt-4 space-y-1.5 text-xs text-rose-900">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-rose-600" />
                    Pastel rainbow borders (cyan, purple, pink, teal, amber)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-rose-600" />
                    Generic noisy chips: <code>[ARTICLE]</code> <code>[WATCH]</code> <code>[READ]</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-rose-600" />
                    System browser sans-serif without optical line clamping
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-rose-600" />
                    Candy-style pill buttons with heavy drop shadows
                  </li>
                </ul>

                {/* Rendered Mock AI Slop Card */}
                <div className="mt-6 rounded-2xl border-2 border-cyan-400 bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 p-5 shadow-lg">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-200">
                    <Image
                      src="https://hips.hearstapps.com/hmg-prod/images/8e24db63-0a89-4b73-b52e-e403f15f4664.jpeg"
                      alt="Vacuum Cleaners Testing"
                      fill
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-bold uppercase text-white shadow">
                      ARTICLE
                    </span>
                    <span className="absolute top-2 right-2 rounded-full bg-cyan-500 px-3 py-1 text-[10px] font-bold uppercase text-white shadow">
                      HOT STORY 🔥
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex gap-2">
                      <span className="rounded-md bg-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-800">Cleaning</span>
                      <span className="rounded-md bg-teal-200 px-2 py-0.5 text-[10px] font-bold text-teal-800">Reviews</span>
                    </div>

                    <h4 className="mt-2 text-lg font-bold text-slate-900 leading-snug">
                      The 12 Best Vacuum Cleaners of 2026, Tested in Our Labs!
                    </h4>

                    <p className="mt-2 text-xs text-slate-600">
                      Our experts tested over 80 vacuums to find the top performers for every home setup!
                    </p>

                    <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 py-2 text-xs font-bold text-white shadow-md">
                      Read Full Story &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Right: Constrained HDS Standard */}
            {(slopViewMode === "comparison" || slopViewMode === "hds-standard") && (
              <div className="border-2 border-emerald-300 bg-emerald-50/40 p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="size-4 text-emerald-700" /> What HDS Tokens Constrain
                  </div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    HEARST EDITORIAL STANDARD
                  </span>
                </div>

                <ul className="mt-4 space-y-1.5 text-xs text-emerald-950">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-700" />
                    Crisp 1px slate grid rules (`gap-px bg-slate-200`) and pure white cards
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-700" />
                    Strict prohibition of generic &ldquo;Article&rdquo; or &ldquo;Watch&rdquo; chips
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-700" />
                    Newsreader serif headlines with 3-line clamp and calibrated leading
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-700" />
                    Resolved journalist bylines, exact relative dates, and bookmark actions
                  </li>
                </ul>

                {/* Rendered Genuine HDS Editorial Card */}
                <div className="mt-6 overflow-hidden border border-slate-200 bg-white shadow-xs">
                  <div className="relative aspect-[16/9] w-full bg-slate-100">
                    <Image
                      src="https://hips.hearstapps.com/hmg-prod/images/8e24db63-0a89-4b73-b52e-e403f15f4664.jpeg"
                      alt="Vacuum Cleaners Testing"
                      fill
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-[#2D75B9]">Good Housekeeping</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 uppercase tracking-wider text-[10px]">Home &amp; Cleaning</span>
                    </div>

                    <h4 className="mt-2 font-serif text-xl font-bold leading-snug text-[#102A43]">
                      The 12 Best Vacuum Cleaners of 2026, Tested in Our Labs
                    </h4>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      Our Cleaning Lab experts tested over 80 upright, cordless, and robot vacuums on hardwood, carpet, and pet hair to find the ultimate performers for every home setup.
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <span>By <strong>Carolyn Forte</strong></span>
                      <div className="flex items-center gap-3">
                        <span>2 hours ago</span>
                        <Bookmark className="size-3.5 text-slate-400 hover:text-[#102A43]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── SECTION 3: MULTI-BRAND TOKEN PROPAGATION DEMO ─── */}
        <section className="space-y-8">
          <header className="border-t-2 border-[#102A43] pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Where AI Excels: 29+ Brand Scaling</p>
            <h2 className="mt-3 max-w-4xl text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-[#102A43] md:text-4xl">
              Live Token Propagation Across Publication Themes
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              When given a strict token system, an AI agent can deterministically restyle the entire component architecture across 29+ distinct brands in seconds. Select a publication below to see the token mapping in real time:
            </p>
          </header>

          {/* Brand Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
            {BRAND_THEME_SPECIMENS.map((brand) => (
              <button
                key={brand.slug}
                onClick={() => setSelectedBrandSlug(brand.slug)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedBrandSlug === brand.slug
                    ? "bg-[#102A43] text-white shadow-xs"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: brand.primary }} />
                {brand.name}
              </button>
            ))}
          </div>

          {/* Live Card Specimen + Token Inspector */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left: Rendered Card */}
            <div className="lg:col-span-7">
              <article className="overflow-hidden border border-slate-200 bg-white shadow-xs">
                <div className="relative aspect-[16/9] w-full bg-slate-100">
                  <Image
                    src={activeBrand.image}
                    alt={activeBrand.title}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span style={{ color: activeBrand.primary }}>{activeBrand.name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">{activeBrand.category}</span>
                  </div>

                  <h4
                    className="mt-3 text-2xl font-bold leading-snug text-[#102A43]"
                    style={{ fontFamily: activeBrand.fontHeadline }}
                  >
                    {activeBrand.title}
                  </h4>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {activeBrand.dek}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <span>By <strong>{activeBrand.author}</strong></span>
                    <div className="flex items-center gap-3">
                      <span>Published Today</span>
                      <Bookmark className="size-4 text-slate-400 hover:text-[#102A43]" />
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Right: Real-Time Token Map Inspector */}
            <div className="space-y-4 text-xs lg:col-span-5">
              <div className="border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold text-[#2D75B9]">ACTIVE TOKEN INJECTION</span>
                  <code className="text-[10px] text-slate-500">data-brand=&quot;{activeBrand.slug}&quot;</code>
                </div>

                <dl className="mt-4 space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <dt className="text-slate-500">--brand-primary:</dt>
                    <dd className="font-bold" style={{ color: activeBrand.primary }}>{activeBrand.primary}</dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <dt className="text-slate-500">--font-headline:</dt>
                    <dd className="font-bold text-slate-800">{activeBrand.fontHeadline}</dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <dt className="text-slate-500">--card-border-radius:</dt>
                    <dd className="text-slate-800">0px (Editorial Flat)</dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <dt className="text-slate-500">--dek-line-clamp:</dt>
                    <dd className="text-slate-800">3 lines</dd>
                  </div>
                </dl>

                <div className="mt-5 rounded bg-slate-50 p-3 text-[11px] text-slate-600">
                  <strong className="text-[#102A43]">Agentic Leverage:</strong> An AI agent can propagate this token schema to all 29 publications, generate TypeScript type definitions, and verify CSS compilation across the entire repo in under 2 minutes.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: THE 3-TIER OPERATING MODEL ─── */}
        <section className="space-y-8">
          <header className="border-t-2 border-[#102A43] pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">System Architecture</p>
            <h2 className="mt-3 max-w-4xl text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-[#102A43] md:text-4xl">
              The 3-Tier Operating Boundary: Where Agents Live
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              To prevent token hallucinations and maintain design integrity, HDS establishes clear separation between human design governance, agentic execution, and deterministic CI validation:
            </p>
          </header>

          <div className="grid gap-px bg-slate-200 md:grid-cols-3">
            <div className="bg-white p-6">
              <span className="font-mono text-xs font-bold text-slate-500">TIER 01: DESIGN AUTHORITY</span>
              <h3 className="mt-2 text-lg font-bold text-[#102A43]">Human Governance</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Designers define brand voice, token hierarchies, core color sets, typography pairings, and responsive layout constraints in Figma and JSON schema.
              </p>
              <div className="mt-4 rounded bg-slate-50 p-2.5 text-[11px] font-mono text-slate-700">
                Figma Variables &bull; Tokens Studio &bull; tokens/
              </div>
            </div>

            <div className="bg-white p-6 border-t-2 border-[#2D75B9]">
              <span className="font-mono text-xs font-bold text-[#2D75B9]">TIER 02: AGENTIC SCALE</span>
              <h3 className="mt-2 text-lg font-bold text-[#102A43]">AI Agent Leverage</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Agents execute within strict token guardrails: assembling responsive wireframes, generating documentation, writing unit tests, and propagating tokens across 29+ themes.
              </p>
              <div className="mt-4 rounded bg-sky-50 p-2.5 text-[11px] font-mono text-[#102A43]">
                Code Scaffolding &bull; Living Docs &bull; Multi-Brand
              </div>
            </div>

            <div className="bg-white p-6">
              <span className="font-mono text-xs font-bold text-slate-500">TIER 03: VERIFICATION</span>
              <h3 className="mt-2 text-lg font-bold text-[#102A43]">Deterministic CI &amp; Review</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Style Dictionary compiles tokens, TypeScript verifies type compliance, linters check rules, and design leaders perform final visual optical review.
              </p>
              <div className="mt-4 rounded bg-slate-50 p-2.5 text-[11px] font-mono text-slate-700">
                Style Dictionary &bull; TypeScript &bull; Visual QA
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: COMPREHENSIVE WORKFLOW AUDIT SCORECARD ─── */}
        <section className="space-y-8">
          <header className="border-t-2 border-[#102A43] pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Scorecard &amp; Audit</p>
            <h2 className="mt-3 max-w-4xl text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-[#102A43] md:text-4xl">
              HDS Workflow Audit: What Works vs. What Fails
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              A breakdown of 6 specific design system workflows evaluated for accuracy, risk, and utility:
            </p>
          </header>

          <div className="space-y-6">
            {WORKFLOW_AUDITS.map((item) => (
              <div key={item.id} className="border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D75B9]">{item.category}</span>
                    <h3 className="mt-1 text-xl font-bold text-[#102A43]">{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded px-2.5 py-1 text-xs font-bold ${
                        item.statusColor === "emerald"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.statusColor === "amber"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      Utility: {item.score}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{item.summary}</p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded bg-emerald-50/50 p-4 border border-emerald-100">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      <Check className="size-3.5 text-emerald-700" /> What Works Reliably:
                    </span>
                    <ul className="mt-3 space-y-1.5 text-xs text-emerald-950">
                      {item.whatWorks.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-700" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded bg-rose-50/50 p-4 border border-rose-100">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider">
                      <X className="size-3.5 text-rose-600" /> What Fails / Risks:
                    </span>
                    <ul className="mt-3 space-y-1.5 text-xs text-rose-950">
                      {item.whatFails.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-600" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <strong className="text-[#102A43]">HDS Policy: </strong>
                  {item.hdsRecommendation}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 6: THE 4 DESIGNER RULES OF ENGAGEMENT ─── */}
        <section className="border-t-2 border-[#102A43] pt-12 space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Actionable Playbook</p>
            <h2 className="mt-3 max-w-4xl text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-[#102A43] md:text-4xl">
              The 4 Rules of Engagement for HDS Designers
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              How designers and design technologists at Hearst can safely maximize AI agent leverage without sacrificing design quality:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                num: "01",
                rule: "Constrain with Tokens, Never Ask for 'Inspiration'",
                detail: "Never ask an AI agent to 'make it look modern.' Provide explicit token contracts, typography roles (Newsreader for serif, Livvic for sans), and palette constraints (#102A43 / #2D75B9).",
              },
              {
                num: "02",
                rule: "Keep the Token Source of Truth Deterministic",
                detail: "Token schemas, aliases, and theme definitions must be stored in structured JSON files compiled by Style Dictionary, with CI pull request validation.",
              },
              {
                num: "03",
                rule: "Use Agents for Breadth, Humans for Depth",
                detail: "Designers should craft the signature hero layout and brand personality in high fidelity; AI agents should then be tasked with scaling it to the remaining 28 publication themes.",
              },
              {
                num: "04",
                rule: "Always Validate with Zero-Tolerance Visual QA",
                detail: "Treat AI-generated components as junior engineering PRs: verify optical kerning, headline line-clamping, contrast compliance, and responsive collapse before production release.",
              },
            ].map((rule) => (
              <div key={rule.num} className="border border-slate-200 bg-white p-6">
                <span className="font-mono text-xs font-bold text-[#2D75B9]">RULE {rule.num}</span>
                <h3 className="mt-2 font-bold text-lg text-[#102A43]">{rule.rule}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{rule.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Universal Product Footer */}
      <ProductFooter />
    </div>
  );
}
