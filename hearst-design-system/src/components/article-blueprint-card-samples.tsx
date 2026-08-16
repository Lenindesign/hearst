"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type ArticleBlueprintCardSample = {
  id: string;
  label: string;
  brand: string;
  topic: string;
  title: string;
  summary: string;
  image: string;
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
    accent: "#7A2E5D",
    surface: "#FFF7FA",
    ink: "#3F1732",
    fontFamily: "var(--font-newsreader), Georgia, serif",
    eyebrow: "Lifestyle story",
  },
  Autos: {
    accent: "#245F86",
    surface: "#F2F8FC",
    ink: "#102A43",
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    eyebrow: "Autos story",
  },
  "Fashion & Luxury": {
    accent: "#292625",
    surface: "#F6F2EE",
    ink: "#292625",
    fontFamily: "var(--font-newsreader), Georgia, serif",
    eyebrow: "Fashion & Luxury story",
  },
  "Enthusiast & Wellness": {
    accent: "#C94B3B",
    surface: "#FFF4F1",
    ink: "#4A221D",
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

function normalizeBlueprintCopy(copy: string) {
  return copy.replace(/\s*\u2014\s*/g, ": ");
}

export function RealAppCardSamples({ stories }: RealAppCardSamplesProps) {
  const [activeTab, setActiveTab] = useState<CardTab>("All");
  const story = useMemo(() => {
    const filtered = activeTab === "All" ? stories : stories.filter((story) => story.label === activeTab);
    return filtered[0] ?? stories[0];
  }, [activeTab, stories]);
  const sectionStyle = sectionStyles[activeTab === "All" ? "All" : story.label as CardTab] ?? sectionStyles.All;

  return (
    <div className="overflow-hidden border bg-white" style={{ borderColor: sectionStyle.accent }}>
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
        <button type="button" className="group grid w-full min-w-0 text-left lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,.95fr)]">
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
              <h3 className="mt-3 max-w-2xl text-balance text-4xl leading-[1.02] tracking-[-0.02em]" style={{ fontFamily: sectionStyle.fontFamily }}>{normalizeBlueprintCopy(story.title)}</h3>
            </div>
          </div>
          <div className="flex min-w-0 flex-col justify-between border-t p-5 lg:border-l lg:border-t-0 lg:p-7" style={{ borderColor: `${sectionStyle.accent}33` }}>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: sectionStyle.accent }}>{sectionStyle.eyebrow} · {story.brand}</p>
              <h3 className="mt-4 hidden text-balance text-4xl leading-[1.02] tracking-[-0.02em] lg:block" style={{ color: sectionStyle.ink, fontFamily: sectionStyle.fontFamily }}>{normalizeBlueprintCopy(story.title)}</h3>
              <p className="mt-4 max-w-xl text-sm leading-6" style={{ color: `${sectionStyle.ink}CC` }}>{normalizeBlueprintCopy(story.summary)}</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: sectionStyle.ink }}>
              <span className="border px-3 py-2" style={{ borderColor: `${sectionStyle.accent}66` }}>Save</span>
              <span className="border px-3 py-2" style={{ borderColor: `${sectionStyle.accent}66` }}>More like this</span>
              <span className="px-3 py-2 text-white" style={{ backgroundColor: sectionStyle.accent }}>Continue</span>
            </div>
          </div>
        </button>
      </article>
      <div className="border-t px-5 py-4 text-sm leading-6" style={{ backgroundColor: sectionStyle.surface, borderColor: `${sectionStyle.accent}33`, color: `${sectionStyle.ink}CC` }}>
        One card, same river pattern: tabs swap source, image, attribution, headline, color, typography and reader actions.
      </div>
    </div>
  );
}
