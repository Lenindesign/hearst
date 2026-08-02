"use client";

import Image from "next/image";
import * as React from "react";
import { hearstGrowthPrinciples } from "@/lib/hearst-growth-principles";

export type ArticleBlueprintVariant = {
  id: "lifestyle" | "autos" | "flux" | "ew";
  destination: string;
  publication: string;
  topic: string;
  title: string;
  summary: string;
  image: string;
  accent: string;
  surface: string;
  treatment: string;
  status: "Working today" | "Production opportunity";
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D75B9]";

function BlueprintInlineStatus({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-2 text-xs font-semibold ${className}`}><span aria-hidden="true" className="h-px w-4 bg-current" />{children}</span>;
}

export function ExecutiveJourney() {
  return (
    <figure className="border-y border-white/20 py-7" aria-labelledby="article-journey-title">
      <figcaption id="article-journey-title" className="sr-only">The Hearst growth loop from acquisition through learning</figcaption>
      <ol className="grid gap-px bg-white/20 md:grid-cols-3">
        {hearstGrowthPrinciples.map((step) => (
          <li key={step.title} className="flex min-w-0 flex-col bg-[#102A43] px-5 py-6">
            <span className="font-mono text-[10px] text-sky-300">{step.number}</span>
            <strong className="mt-7 block text-lg text-white">{step.title}</strong>
            <p className="mt-3 text-sm leading-6 text-slate-300">{step.copy}</p>
            <p className="mt-6 border-t border-white/15 pt-4 text-xs leading-5 text-slate-400">
              <span className="font-semibold text-sky-200">Signals:</span> {step.signals}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function PersonalizationDecisionDemo() {
  const [signal, setSignal] = React.useState<"topic" | "brand" | "return">("topic");
  const decisions = {
    topic: {
      label: "Followed topic",
      detail: "Home design",
      result: "A new House Beautiful story leads the eligible set.",
      reason: "Because you follow Home",
      width: "88%",
    },
    brand: {
      label: "Trusted brand",
      detail: "Good Housekeeping",
      result: "A recent Good Housekeeping service story moves forward.",
      reason: "From a brand you follow",
      width: "76%",
    },
    return: {
      label: "Return context",
      detail: "New since last visit",
      result: "Fresh eligible stories outrank items already seen.",
      reason: "New since your last visit",
      width: "94%",
    },
  } as const;
  const active = decisions[signal];

  return (
    <div className="border border-slate-200 bg-white" aria-label="Interactive personalization decision example">
      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
          <p className="text-xs font-bold text-slate-500">Choose one real signal</p>
          <div className="mt-4 grid gap-2">
            {(Object.keys(decisions) as Array<keyof typeof decisions>).map((key) => {
              const item = decisions[key];
              const selected = signal === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSignal(key)}
                  className={`min-h-11 border px-4 py-3 text-left transition-colors ${focusRing} ${
                    selected ? "border-[#2D75B9] bg-[#EAF4FC] text-[#102A43]" : "border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  <strong className="block text-sm">{item.label}</strong>
                  <span className="mt-1 block text-xs">{item.detail}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#2D75B9]">Decision preview</span>
            <BlueprintInlineStatus className="text-[#102A43]">Working today</BlueprintInlineStatus>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_11rem] sm:items-end">
            <div>
              <h3 className="max-w-xl font-serif text-3xl leading-[1.05] text-[#102A43]">{active.result}</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">The article never changes. The signal only helps choose what the reader sees next.</p>
            </div>
            <div className="border-t border-slate-200 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Reader explanation</p>
              <p className="mt-2 text-sm font-semibold text-[#102A43]">{active.reason}</p>
              <div className="mt-4 h-1.5 bg-slate-100"><div className="h-full bg-[#2D75B9] transition-[width] duration-200 motion-reduce:transition-none" style={{ width: active.width }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AmbientVariantExplorer({ variants }: { variants: ArticleBlueprintVariant[] }) {
  const [activeId, setActiveId] = React.useState<ArticleBlueprintVariant["id"]>(variants[0]?.id ?? "lifestyle");
  const active = variants.find((variant) => variant.id === activeId) ?? variants[0];
  if (!active) return null;

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % variants.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + variants.length) % variants.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = variants.length - 1;
    else return;

    event.preventDefault();
    const nextVariant = variants[nextIndex];
    if (!nextVariant) return;
    setActiveId(nextVariant.id);
    document.getElementById(`ambient-tab-${nextVariant.id}`)?.focus();
  }

  return (
    <div className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 pt-4 sm:px-6">
        <div role="tablist" aria-label="Ambient Reader destination variants" className="flex min-w-0 gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {variants.map((variant, index) => {
            const selected = variant.id === active.id;
            return (
              <button
                key={variant.id}
                id={`ambient-tab-${variant.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="ambient-variant-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(variant.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`min-h-11 shrink-0 border-b-2 px-3 text-xs font-bold transition-colors ${focusRing} ${selected ? "border-[#2D75B9] text-[#102A43]" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                {variant.destination}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="ambient-variant-panel"
        role="tabpanel"
        aria-labelledby={`ambient-tab-${active.id}`}
        className="grid min-h-[32rem] lg:grid-cols-[1.2fr_.8fr]"
        style={{ backgroundColor: active.surface }}
      >
        <div className={`relative min-h-80 overflow-hidden ${active.id === "lifestyle" ? "m-5 border border-black/15 sm:m-8" : ""}`}>
          <Image src={active.image} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className={`object-cover ${active.id === "autos" ? "object-center" : "object-top"}`} />
          <div className={`absolute inset-0 ${active.id === "autos" ? "bg-gradient-to-t from-black via-black/10 to-transparent" : active.id === "ew" ? "bg-gradient-to-r from-black/75 via-black/20 to-transparent" : "bg-gradient-to-t from-black/65 via-transparent to-transparent"}`} />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{active.publication} · {active.topic}</span>
            {active.id === "autos" ? <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">Image-first cinematic opener with a structured information deck.</p> : null}
          </div>
        </div>
        <div className={`flex flex-col justify-between p-6 sm:p-9 ${active.id === "lifestyle" || active.id === "autos" ? "text-[#102A43]" : "text-white"}`} style={{ backgroundColor: active.id === "lifestyle" ? active.surface : active.accent }}>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-70">{active.treatment}</span>
              <BlueprintInlineStatus>{active.status}</BlueprintInlineStatus>
            </div>
            <h3 className={`mt-10 text-balance font-serif text-4xl leading-[0.98] sm:text-5xl ${active.id === "ew" ? "font-black uppercase" : ""}`}>{active.title}</h3>
            <p className="mt-5 max-w-md text-sm leading-6 opacity-75">{active.summary}</p>
          </div>
          <div className="mt-10 border-t border-current/20 pt-5">
            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.1em]">
              {["Save", "Continue", "Related stories"].map((control) => <span key={control} className="border border-current/25 px-2.5 py-2">{control}</span>)}
            </div>
            <p className="mt-4 text-xs leading-5 opacity-70">One reader. Four destination expressions. Every publication still feels like itself.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContinuationSequenceDemo() {
  const [active, setActive] = React.useState(0);
  const surfaces = [
    { type: "Article", title: "A useful story", color: "bg-white text-[#102A43]" },
    { type: "Advertisement", title: "Clearly disclosed", color: "bg-[#DCECF8] text-[#102A43]" },
    { type: "Article", title: "The next relevant read", color: "bg-white text-[#102A43]" },
    { type: "Article", title: "Discovery widens silently", color: "bg-white text-[#102A43]" },
  ];

  return (
    <div className="border border-slate-200 bg-[#EEF3F7] p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2D75B9]">Ambient sequence</p>
          <p className="mt-1 text-sm text-slate-600">Select a peer surface to inspect the progression.</p>
        </div>
        <span className="hidden text-xs font-semibold text-slate-500 sm:block">Horizontal snap · bounded preload</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {surfaces.map((surface, index) => {
          const selected = active === index;
          return (
            <button
              key={`${surface.type}-${index}`}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(index)}
              className={`min-h-36 border p-4 text-left transition-[transform,border-color] duration-200 motion-reduce:transition-none ${focusRing} ${surface.color} ${selected ? "-translate-y-1 border-[#2D75B9]" : "border-slate-300 hover:border-slate-500"}`}
            >
              <span className="font-mono text-[10px] text-slate-500">0{index + 1}</span>
              <strong className="mt-8 block text-xs uppercase tracking-[0.1em]">{surface.type}</strong>
              <span className="mt-2 block text-sm font-semibold leading-5">{surface.title}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 grid gap-px bg-slate-300 text-xs sm:grid-cols-3">
        {[
          ["Mounted window", active === 0 ? "Current + next" : "Previous + current + next"],
          ["State update", "After the snap settles"],
          ["Reader promise", surfaces[active]?.type === "Advertisement" ? "Disclosure, control, and separation" : "Complete article before arrival"],
        ].map(([label, value]) => <div key={label} className="bg-white p-4"><span className="block text-slate-500">{label}</span><strong className="mt-2 block text-[#102A43]">{value}</strong></div>)}
      </div>
    </div>
  );
}
