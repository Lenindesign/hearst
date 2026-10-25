"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ArticleBlueprintCardSample = {
  id: string;
  label: string;
  brand: string;
  topic: string;
  title: string;
  summary: string;
  image: string;
  sourceLabel: string;
  sourceUrl: string;
};

type RealAppCardSamplesProps = {
  stories: ArticleBlueprintCardSample[];
};

const tabs = ["All", "Lifestyle", "Autos", "Fashion & Luxury", "Enthusiast & Wellness", "Local News", "A&E Family"] as const;
type CardTab = (typeof tabs)[number];

const sectionStyles: Record<CardTab, { accent: string; surface: string; ink: string; fontFamily: string; eyebrow: string }> = {
  All: {
    accent: "#102A43",
    surface: "#F8FAFC",
    ink: "#102A43",
    fontFamily: "var(--font-newsreader), Georgia, serif",
    eyebrow: "Today's river",
  },
  Lifestyle: {
    accent: "#A62C37",
    surface: "#FBF4F5",
    ink: "#421216",
    fontFamily: "var(--font-newsreader), Georgia, serif",
    eyebrow: "Lifestyle story",
  },
  Autos: {
    accent: "#5A6627",
    surface: "#F9FAF5",
    ink: "#343A16",
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    eyebrow: "Autos story",
  },
  "Fashion & Luxury": {
    accent: "#12354E",
    surface: "#F3F5F6",
    ink: "#07151F",
    fontFamily: "var(--font-newsreader), Georgia, serif",
    eyebrow: "Fashion & Luxury story",
  },
  "Enthusiast & Wellness": {
    accent: "#34454C",
    surface: "#F5F6F6",
    ink: "#151C1E",
    fontFamily: "var(--font-newsreader), Georgia, serif",
    eyebrow: "Wellness story",
  },
  "Local News": {
    accent: "#087A68",
    surface: "#F0FAF7",
    ink: "#063F37",
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    eyebrow: "Local News story",
  },
  "A&E Family": {
    accent: "#B9913F",
    surface: "#FCF7EA",
    ink: "#3F3115",
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    eyebrow: "A&E Family story",
  },
};

export function RealAppCardSamples({ stories }: RealAppCardSamplesProps) {
  const [activeTab, setActiveTab] = useState<CardTab>("All");
  const story = useMemo(() => {
    const filtered = activeTab === "All" ? stories : stories.filter((story) => story.label === activeTab);
    return filtered[0] ?? stories[0];
  }, [activeTab, stories]);
  const sectionStyle = sectionStyles[activeTab === "All" ? "All" : story.label as CardTab] ?? sectionStyles.All;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--hp-shadow-card)]">
      <div
        className="flex min-w-0 gap-2 overflow-x-auto border-b border-slate-200 px-4 py-3 text-xs font-bold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Article card sample sections"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(tab)}
              className="shrink-0 px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D75B9]"
              style={selected ? { backgroundColor: sectionStyles[tab].accent, color: "white" } : { backgroundColor: sectionStyles[tab].surface, color: sectionStyles[tab].ink }}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <article style={{ backgroundColor: sectionStyle.surface }}>
        <div className="group grid min-w-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,.95fr)]">
          <div className="relative aspect-[16/10] min-h-0 overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[420px]">
            {story.image.includes("cropper.watch.aetnd.com") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={story.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
            ) : (
              <Image src={story.image} alt="" fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent lg:hidden" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white lg:hidden">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/80">{sectionStyle.eyebrow} · {story.brand}</p>
              <h3 className="mt-3 max-w-2xl text-balance text-4xl leading-[1.02] tracking-[-0.02em]" style={{ fontFamily: sectionStyle.fontFamily }}>{story.title}</h3>
            </div>
          </div>
          <div className="flex min-w-0 flex-col justify-between border-t p-5 lg:border-l lg:border-t-0 lg:p-7" style={{ borderColor: `${sectionStyle.accent}33` }}>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionStyle.accent }}>{sectionStyle.eyebrow} · {story.brand}</p>
              <h3 className="mt-4 hidden text-balance text-4xl leading-[1.02] tracking-[-0.02em] lg:block" style={{ color: sectionStyle.ink, fontFamily: sectionStyle.fontFamily }}>{story.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-6" style={{ color: `${sectionStyle.ink}CC` }}>{story.summary}</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">{story.sourceLabel}. This preview shows a content example only; the controls below are not interactive here.</p>
            <Link href={story.sourceUrl} target={story.sourceUrl.startsWith("/") ? undefined : "_blank"} rel={story.sourceUrl.startsWith("/") ? undefined : "noreferrer"} className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Open {story.brand} source <span aria-hidden="true" className="ml-2">↗</span></Link>
            <div aria-label="Illustrative action labels" className="mt-5 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: sectionStyle.ink }}>
              <span className="border px-3 py-2" style={{ borderColor: `${sectionStyle.accent}66` }}>Save</span>
              <span className="border px-3 py-2" style={{ borderColor: `${sectionStyle.accent}66` }}>More like this</span>
              <span className="px-3 py-2 text-white" style={{ backgroundColor: sectionStyle.accent }}>Continue</span>
            </div>
          </div>
        </div>
      </article>
      <div className="border-t px-5 py-4 text-sm leading-6" style={{ backgroundColor: sectionStyle.surface, borderColor: `${sectionStyle.accent}33`, color: `${sectionStyle.ink}CC` }}>
        Tabs switch the sample record and section styling. The four magazine records come from checked-in public RSS snapshots; Local News and A&amp;E are labeled separately because they use curated prototype records. Save and recommendation labels above are examples only. The source link opens the stated publisher or prototype route.
      </div>
    </div>
  );
}
