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

export function DesignAgentPageComponent() {
  const [selectedSubagent, setSelectedSubagent] = useState<"all" | "hds" | "brand" | "surface" | "governance">("all");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const promptText = `You are the Hearst Design Agent — an expert multi-subagent orchestration system operating on the Hearst Design System (HDS).

SYSTEM ROLE & ARCHITECTURE:
- HDS Subagent: Manages Whitelabel Tokens, Existing/Extended Components, Interaction/Motion, and the FRE UI Kit.
- Brand Subagent: Enforces Strategy - MKT and the 7 Style Dimensions (Typography, Color, Photography, Voice/Tone, CTAs, Space, Graphics) across 29+ publication themes.
- Surface Subagent: Tailors UI for 10 distribution channels (Web, Native Apps, Newsletters, 16:9/9:16 Video, Ads, Commerce).
- Governance Subagent (8-Point Firewall): Enforces Accessibility (WCAG AA), Mobile-First Density, Token Versioning, Realistic Content (NO LOREM IPSUM), Character Limits, Ad Ratio Guardrails, Core Web Vitals (CLS), and SEO.
- Delivery Model: Generates 4 candidate prototype tracks (Exploratory UX, Branded Concept, Tech Spike, Delivery Candidate) triaged through Dual Review into production Jira tickets.`;

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
      <ProductHeader current="design-agent" />

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-[#102A43] text-white">
        <div className="mx-auto max-w-[1360px] px-5 py-14 md:px-10 lg:py-18">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded bg-sky-950 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
              <Zap className="size-3.5" /> Engineering Whiteboard Architecture
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/design-agent-architecture.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Open Standalone HTML <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <h1 className="mt-5 max-w-5xl text-balance font-serif text-4xl font-bold leading-[0.95] tracking-[-0.03em] md:text-6xl lg:text-7xl">
            Hearst Design Agent Architecture &amp; Workflow
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            Interactive system architecture diagram synthesized from the engineering whiteboard: mapping the multi-subagent fan-out engine, FRE UI kit stack, 8-point governance firewall, and end-to-end SDLC prototyping lifecycle.
          </p>

          {/* Quick Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-700/80 pt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Focus Subagent:</span>
            {[
              { id: "all", label: "Full System Canvas" },
              { id: "hds", label: "HDS Subagent" },
              { id: "brand", label: "Brand Subagent" },
              { id: "surface", label: "Surface Subagent" },
              { id: "governance", label: "Governance Subagent" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedSubagent(filter.id as any)}
                className={`px-3 py-1 text-xs font-bold transition-colors ${
                  selectedSubagent === filter.id
                    ? "bg-sky-400 text-slate-950 shadow-xs"
                    : "bg-slate-800/90 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Interactive Diagram Canvas */}
      <main className="mx-auto max-w-[1360px] px-5 py-10 md:px-10 lg:py-14 space-y-16">
        
        {/* The 2-Column Canvas Layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* ════════════════════ LEFT COLUMN: DESIGN AGENT ENGINE (7 COLS) ════════════════════ */}
          <section className="border-2 border-[#102A43] bg-white p-6 md:p-8 shadow-md rounded-2xl lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#2D75B9] uppercase">CORE ENGINE CONTAINER</span>
                <h2 className="font-serif text-2xl font-bold text-[#102A43]">DESIGN AGENT MULTI-SUBAGENT ENGINE</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Active Co-Pilot
              </span>
            </div>

            {/* Top Node: Context + Intake Gateway */}
            <div className="mx-auto max-w-sm rounded-lg border-2 border-[#2D75B9] bg-[#102A43] p-3.5 text-center text-white shadow-sm">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-300">Intake Gateway</span>
              <h3 className="text-base font-bold">Context + Intake</h3>
            </div>

            {/* FRE UI Kit Lateral Band */}
            <div className="rounded-lg border border-[#2D75B9] bg-sky-50/70 p-4">
              <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                <span className="font-mono text-xs font-bold text-[#2D75B9] uppercase">FRE UI KIT (Foundations)</span>
                <span className="text-[10px] font-semibold text-slate-500">ShadCN + Base UI FX + Tailwind</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-700">
                <div>&bull; <strong>Base Primitives:</strong> ShadCN + Base UI FX</div>
                <div>&bull; <strong>Token Reactivity:</strong> Style Dictionary</div>
                <div>&bull; <strong>Editorial Nav Modes:</strong> Slim, Search, Standard, Mega</div>
                <div>&bull; <strong>Homepage Archetypes:</strong> Newsy, Photo, Utility</div>
              </div>
            </div>

            {/* 3 Domain Subagents Fan-Out Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Subagent 1: HDS */}
              <div
                className={`rounded-lg border p-4 transition-all ${
                  selectedSubagent === "all" || selectedSubagent === "hds"
                    ? "border-[#2D75B9] bg-[#F8FAFC] shadow-xs"
                    : "border-slate-200 bg-slate-50 opacity-40"
                }`}
              >
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[10px] font-bold text-[#2D75B9] uppercase">01. SYSTEM</span>
                  <h4 className="font-bold text-sm text-[#102A43]">HDS Subagent</h4>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                  <li className="flex justify-between items-center">
                    <span>① Whitelabel Tokens</span>
                    <span className="text-[10px] font-bold text-emerald-700">● HAVE</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>② Existing Components</span>
                    <span className="text-[10px] font-bold text-emerald-700">● HAVE</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>③ Extended Components</span>
                    <span className="text-[10px] font-bold text-emerald-700">● HAVE</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>④ Pattern Library</span>
                    <span className="text-[10px] font-bold text-amber-600">○ NEED</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>⑤ Interaction / Motion</span>
                    <span className="text-[10px] font-bold text-emerald-700">● HAVE</span>
                  </li>
                </ul>
              </div>

              {/* Subagent 2: Brand */}
              <div
                className={`rounded-lg border p-4 transition-all ${
                  selectedSubagent === "all" || selectedSubagent === "brand"
                    ? "border-amber-600 bg-amber-50/40 shadow-xs"
                    : "border-slate-200 bg-slate-50 opacity-40"
                }`}
              >
                <div className="border-b border-amber-200 pb-2">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">02. STORYBOOK</span>
                  <h4 className="font-bold text-sm text-[#102A43]">Brand Subagent</h4>
                </div>
                <div className="mt-3 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span>① Strategy - MKT</span>
                    <span className="text-[10px] font-bold text-emerald-700">● HAVE</span>
                  </div>
                  <div className="rounded bg-white p-2 border border-amber-200 text-[11px] text-slate-600 space-y-0.5">
                    <strong className="text-amber-800 block text-[10px]">② 7 Style Dimensions:</strong>
                    <div>↳ Typography &bull; Color</div>
                    <div>↳ Photo &bull; Voice/Tone</div>
                    <div>↳ CTAs &bull; Space &bull; Icons</div>
                  </div>
                </div>
              </div>

              {/* Subagent 3: Surface */}
              <div
                className={`rounded-lg border p-4 transition-all ${
                  selectedSubagent === "all" || selectedSubagent === "surface"
                    ? "border-emerald-600 bg-emerald-50/40 shadow-xs"
                    : "border-slate-200 bg-slate-50 opacity-40"
                }`}
              >
                <div className="border-b border-emerald-200 pb-2">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">03. CHANNELS</span>
                  <h4 className="font-bold text-sm text-[#102A43]">Surface Subagent</h4>
                </div>
                <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                  <li>&bull; Newsletters</li>
                  <li>&bull; Websites &amp; Portals</li>
                  <li>&bull; Native Apps (iOS/Android)</li>
                  <li>&bull; Checkout &amp; 3PP</li>
                  <li>&bull; Ads &amp; Video (16:9/9:16) *</li>
                  <li>&bull; Commerce &amp; Lift *</li>
                  <li>&bull; Interruptions &amp; Sticky UI</li>
                </ul>
              </div>
            </div>

            {/* Governance Subagent 8-Point Compliance Firewall */}
            <div
              className={`rounded-xl border-2 p-5 transition-all ${
                selectedSubagent === "all" || selectedSubagent === "governance"
                  ? "border-rose-600 bg-rose-50/50 shadow-xs"
                  : "border-slate-200 bg-slate-50 opacity-40"
              }`}
            >
              <div className="flex items-center justify-between border-b border-rose-200 pb-2.5">
                <div>
                  <span className="font-mono text-[10px] font-bold text-rose-700 uppercase">AUTOMATED QUALITY GATE</span>
                  <h4 className="font-bold text-base text-rose-900">Governance Subagent (8-Point Firewall)</h4>
                </div>
                <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                  Zero AI Slop
                </span>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 text-xs">
                <div className="rounded bg-white p-2.5 border border-rose-200 flex items-start gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">1</span>
                  <span><strong>Accessibility:</strong> WCAG AA contrast &ge; 4.5:1, keyboard traps</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-rose-200 flex items-start gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">2</span>
                  <span><strong>Mobile First:</strong> Touch targets &ge; 44px, responsive density</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-rose-200 flex items-start gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">3</span>
                  <span><strong>Versioning:</strong> Style Dictionary schema, zero hardcoded hex</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-rose-200 flex items-start gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">4</span>
                  <span><strong>Realistic Content:</strong> NO LOREM IPSUM, NO GRAY BOXES</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-rose-200 flex items-start gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">5</span>
                  <span><strong>Character Limits:</strong> 3-line max headline clamping with ellipsis</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-rose-200 flex items-start gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">6</span>
                  <span><strong>Ad Ratio Guardrails:</strong> Non-interruptive feed density</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-rose-200 flex items-start gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">7</span>
                  <span><strong>CLS &amp; Performance:</strong> Aspect ratio media containers</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-rose-200 flex items-start gap-2">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">8</span>
                  <span><strong>SEO &amp; A11Y:</strong> Semantic landmarks, OpenGraph, JSON-LD</span>
                </div>
              </div>
            </div>

            {/* Human Reviewer Sign-Off Node */}
            <div className="rounded-lg border-2 border-slate-400 bg-[#102A43] p-3.5 text-center text-white">
              <span className="font-bold text-xs uppercase tracking-wider">
                👤 Human Reviewer (Design &amp; Engineering Sign-Off)
              </span>
            </div>
          </section>

          {/* ════════════════════ RIGHT COLUMN: SDLC LIFECYCLE (5 COLS) ════════════════════ */}
          <section className="border-2 border-slate-300 bg-white p-6 md:p-8 shadow-md rounded-2xl lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#2D75B9] uppercase">END-TO-END PIPELINE</span>
                <h2 className="font-serif text-2xl font-bold text-[#102A43]">PRODUCT TO PRODUCTION</h2>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                SDLC Flow
              </span>
            </div>

            {/* Company Brain Memory Banner */}
            <div className="rounded-xl border-2 border-dashed border-orange-500 bg-orange-50/70 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-orange-700 uppercase tracking-wider">Company Brain</span>
                <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">Memory Layer</span>
              </div>
              <p className="mt-1 text-xs text-slate-700">
                Wiki of skills &bull; LLM managing &bull; Cross-disciplinary knowledge vault
              </p>
            </div>

            {/* Step 1: Discovery */}
            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 text-xs">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">STEP 01: DISCOVERY</span>
              <h4 className="font-bold text-sm text-[#102A43] mt-0.5">User / Business Needs &rarr; North Stars &rarr; Roadmap &rarr; Problem / JTBD</h4>
            </div>

            {/* Step 2: Workbench & Design Constitution */}
            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">STEP 02: STRATEGY WORKBENCH</span>
              </div>
              <h4 className="font-bold text-sm text-[#102A43]">Strategy Synthesis &amp; Design Constitution (.md)</h4>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                <div className="bg-white p-1.5 rounded border border-slate-200">&bull; Comp Analysis</div>
                <div className="bg-white p-1.5 rounded border border-slate-200">&bull; Data Reporting</div>
                <div className="bg-white p-1.5 rounded border border-slate-200">&bull; Integrations / Svc</div>
                <div className="bg-white p-1.5 rounded border border-slate-200">&bull; Research &amp; Needs</div>
              </div>
              <div className="rounded bg-sky-50 p-2 text-[11px] font-semibold text-[#102A43]">
                Design Constitution (.md): DX Laws &bull; Principles &bull; Editorial Guardrails
              </div>
            </div>

            {/* Step 3: PRD */}
            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 text-xs">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">STEP 03: PRD ALIGNMENT</span>
              <h4 className="font-bold text-sm text-[#102A43] mt-0.5">Product Requirements Document (PRD)</h4>
              <p className="mt-1 text-[11px] text-slate-600">
                Benchmark Metrics &bull; OKRs &bull; Design Review Gates &bull; Eng Rewards &bull; Scope Estimate
              </p>
            </div>

            {/* Step 4: Prototype Engine (Calls Design Agent) */}
            <div className="rounded-xl border-2 border-amber-600 bg-amber-50/60 p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="font-bold text-xs text-amber-800 uppercase tracking-wider">PROTOTYPE ENGINE</span>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">Calls Design Agent</span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 text-xs">
                <div className="rounded bg-white p-2.5 border border-amber-300">
                  <strong className="block text-[#102A43]">Track 1: Exploratory UX - 01</strong>
                  <span className="text-[10px] text-slate-600">Multi-layout alternatives</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-amber-300">
                  <strong className="block text-[#102A43]">Track 2: Branded Concept</strong>
                  <span className="text-[10px] text-slate-600">29+ brand token application</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-amber-300">
                  <strong className="block text-[#102A43]">Track 3: Tech Spike</strong>
                  <span className="text-[10px] text-slate-600">Benchmarks &amp; video streams</span>
                </div>
                <div className="rounded bg-white p-2.5 border border-amber-300">
                  <strong className="block text-[#102A43]">Track 4: Delivery Candidate</strong>
                  <span className="text-[10px] text-slate-600">Production TypeScript code</span>
                </div>
              </div>
            </div>

            {/* Step 5: Dual Review */}
            <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
              <div className="rounded-lg border border-slate-300 bg-slate-50 p-3 text-[#102A43]">
                🎨 Designer Review
              </div>
              <div className="rounded-lg border border-slate-300 bg-slate-50 p-3 text-[#102A43]">
                ⚙️ Eng Review
              </div>
            </div>

            {/* Step 6: User Validation -> Ship */}
            <div className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-around text-xs font-bold text-slate-600">
              <span className="text-emerald-700">User Validation</span>
              <span>&rarr;</span>
              <span className="text-emerald-700">Build</span>
              <span>&rarr;</span>
              <span className="text-emerald-700">UAT</span>
              <span>&rarr;</span>
              <span className="text-emerald-700">Ship</span>
            </div>

            {/* Step 7: Jira Tickets Execution */}
            <div className="rounded-lg border-2 border-emerald-600 bg-emerald-50 p-4 text-center text-emerald-800">
              <strong className="block text-sm uppercase tracking-wider">INTAKE APPROVED &rarr; SCOPED BY 3 DISCIPLINES</strong>
              <span className="text-xs text-slate-600 mt-1 block">Design Lead + PM + Tech Lead &rarr; Production Jira Tickets</span>
            </div>
          </section>

        </div>

        {/* ─── PROMPT & SPEC EXPORT SECTION ─── */}
        <section className="border-t-2 border-[#102A43] pt-10 space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2D75B9]">Export &amp; Integration</p>
              <h3 className="font-serif text-2xl font-bold text-[#102A43]">
                Copy Design Agent System Prompt
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Use this prompt to initialize the multi-subagent orchestration model in any AI tool or pair-programming agent:
              </p>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-2 bg-[#102A43] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2D75B9]"
            >
              {copiedPrompt ? <Check className="size-4" /> : <Sparkles className="size-4" />}
              {copiedPrompt ? "Copied Prompt!" : "Copy System Prompt"}
            </button>
          </div>

          <div className="rounded-xl bg-slate-900 p-5 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
            <pre className="whitespace-pre-wrap">{promptText}</pre>
          </div>
        </section>
      </main>

      {/* Universal Product Footer */}
      <ProductFooter />
    </div>
  );
}
