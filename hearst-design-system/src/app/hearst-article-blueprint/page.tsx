import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AmbientVariantExplorer,
  ExecutiveJourney,
  PersonalizationDecisionDemo,
  type ArticleBlueprintVariant,
} from "@/components/article-blueprint-experience";
import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";
import { getAmbientCommerceStories } from "@/lib/ambient-commerce-stories";

export const metadata: Metadata = {
  title: "Hearst Article Experience",
  description: "How Hearst can turn every article into a trusted, personalized reading relationship.",
};

const contents = [
  ["The opportunity", "opportunity"],
  ["How it works", "how-it-works"],
  ["Two ways to read", "reading-modes"],
  ["Revenue with trust", "revenue"],
  ["What comes next", "next"],
] as const;

type BlueprintStatus = "Working today" | "Build next" | "Guardrail";

const statusStyles: Record<BlueprintStatus, { marker: string; text: string }> = {
  "Working today": { marker: "bg-[#102A43]", text: "text-[#102A43]" },
  "Build next": { marker: "bg-[#2D75B9]", text: "text-[#2D75B9]" },
  Guardrail: { marker: "bg-slate-500", text: "text-slate-600" },
};

function Status({ children }: { children: ReactNode }) {
  const label = String(children) as BlueprintStatus;
  const style = statusStyles[label];
  return <span className={`inline-flex min-h-7 items-center gap-2 text-xs font-semibold ${style.text}`}><span aria-hidden="true" className={`h-px w-4 ${style.marker}`} />{children}</span>;
}

function SectionHead({ label, title, copy }: { label: string; title: string; copy: string }) {
  return (
    <header className="border-t-2 border-[#102A43] pt-5">
      <p className="text-sm font-bold text-[#2D75B9]">{label}</p>
      <h2 className="mt-4 max-w-4xl text-balance font-serif text-4xl leading-[1.02] tracking-[-0.025em] text-[#102A43] md:text-5xl">{title}</h2>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">{copy}</p>
    </header>
  );
}

function findStory(stories: LifestyleRiverStory[], preferredBrands: string[]) {
  return preferredBrands
    .map((slug) => stories.find((story) => story.brandSlug === slug && Boolean(story.image)))
    .find((story): story is LifestyleRiverStory => Boolean(story)) ?? stories.find((story) => Boolean(story.image)) ?? stories[0];
}

function normalizeBlueprintCopy(copy: string) {
  return copy.replace(/\s*\u2014\s*/g, ": ");
}

function buildVariant(
  id: ArticleBlueprintVariant["id"],
  destination: string,
  story: LifestyleRiverStory,
  style: Pick<ArticleBlueprintVariant, "accent" | "surface" | "treatment">,
): ArticleBlueprintVariant {
  return {
    id,
    destination,
    publication: story.brand,
    topic: story.topic,
    title: normalizeBlueprintCopy(story.title),
    summary: normalizeBlueprintCopy(story.summary),
    image: story.image,
    ...style,
    status: "Working today",
  };
}

export default function HearstArticleBlueprintPage() {
  const lifestyleStory = findStory(lifestyleRiverStories, ["good-housekeeping", "house-beautiful"]);
  const autosStory = findStory(autosRiverStories, ["car-and-driver", "autoweek"]);
  const fluxStory = findStory(fluxRiverStories, ["elle", "harpers-bazaar"]);
  const ewStory = findStory(ewRiverStories, ["runners-world", "womens-health"]);
  const commerceStory = getAmbientCommerceStories()[0];
  const ambientVariants = [
    buildVariant("lifestyle", "Lifestyle", lifestyleStory, { accent: "#7B2F5F", surface: "#F7F4F0", treatment: "Spacious magazine story" }),
    buildVariant("autos", "Autos", autosStory, { accent: "#D7A900", surface: "#111820", treatment: "Cinematic story" }),
    buildVariant("flux", "Fashion & Luxury", fluxStory, { accent: "#351E2C", surface: "#F3E8EC", treatment: "Immersive cover story" }),
    buildVariant("ew", "Enthusiast & Wellness", ewStory, { accent: "#123D35", surface: "#DCEBE3", treatment: "High-energy story" }),
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8FAFC] text-[#102A43]">
      <ProductHeader current="articles" />
      <main>
        <section className="border-b border-slate-200 bg-[#102A43] text-white">
          <div className="mx-auto max-w-[1360px] px-5 py-20 md:px-10 lg:py-28">
            <p className="text-sm font-bold text-sky-300">The Hearst article experience</p>
            <h1 className="mt-6 max-w-5xl text-balance font-serif text-6xl leading-[0.94] tracking-[-0.035em] md:text-8xl">One article. A longer relationship.</h1>
            <p className="mt-8 max-w-3xl text-xl leading-8 text-slate-300">Every story should deliver its full editorial value, then make the next useful step easy: keep reading, save, shop, or return.</p>
            <div className="mt-10"><ExecutiveJourney /></div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-16 md:px-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:py-24">
          <aside className="self-start lg:sticky lg:top-6">
            <p className="mb-4 text-sm font-bold text-[#2D75B9]">In this brief</p>
            <nav className="border-y border-slate-200" aria-label="Article experience sections">
              {contents.map(([title, id]) => (
                <a key={id} href={`#${id}`} className="flex min-h-11 items-center border-b border-slate-200 py-2 text-sm font-semibold text-slate-600 last:border-b-0 hover:text-[#2D75B9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D75B9]">{title}</a>
              ))}
            </nav>
            <Link href="/hearst-plus/" className="mt-7 inline-flex min-h-11 items-center text-sm font-bold text-[#2D75B9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D75B9]">Open Hearst+</Link>
          </aside>

          <div className="min-w-0 space-y-24">
            <section id="opportunity" className="scroll-mt-8">
              <SectionHead label="The opportunity" title="Readers should not have to search for the right story. Hearst brings it to them." copy="Personalization brings the most useful story forward, then makes the next step easy. Readers get more value, brands keep their voice, and Hearst builds stronger relationships." />
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-3">
                {[
                  ["For readers", "Right story, right moment", "They spend less time searching and more time reading what matters."],
                  ["For brands", "More reach", "Shared technology carries each publication's voice and identity."],
                  ["For Hearst", "More value", "Longer sessions create better opportunities for ads and commerce."],
                ].map(([label, title, copy]) => <article key={label} className="bg-white p-6"><p className="text-sm font-semibold text-[#2D75B9]">{label}</p><h3 className="mt-4 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p></article>)}
              </div>
            </section>

            <section id="how-it-works" className="scroll-mt-8">
              <SectionHead label="How it works" title="Personalize the path, not the journalism" copy="The article stays complete and unchanged. Reader choices only shape which story appears next and why it was recommended." />
              <div className="mt-10"><PersonalizationDecisionDemo /></div>
              <div className="mt-6 grid gap-px bg-slate-200 sm:grid-cols-3">
                {[
                  ["Find", "Start with complete, relevant stories."],
                  ["Order", "Use interests, brands, freshness, and popularity."],
                  ["Explain", "Give one clear reason for the recommendation."],
                ].map(([title, copy]) => <div key={title} className="bg-white p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></div>)}
              </div>
            </section>

            <section id="reading-modes" className="scroll-mt-8">
              <SectionHead label="Two ways to read" title="A dependable article and an immersive reader" copy="Most stories use the standard article. Ambient Reader gives each destination a more expressive opening while keeping the same content, controls, and recommendations." />
              <div className="mt-10 overflow-hidden border border-slate-300 bg-white">
                <div className="flex min-h-14 items-center justify-between border-b border-slate-300 px-5 text-sm font-semibold"><span className="font-black tracking-[0.08em] text-[#2D75B9]">HEARST</span><span>Standard article</span><Status>Working today</Status></div>
                <div className="grid lg:grid-cols-[minmax(0,1fr)_15rem]">
                  <article className="min-w-0 p-5 sm:p-8">
                    <div className="relative aspect-[16/8] overflow-hidden bg-slate-100"><Image src={autosStory.image} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" /></div>
                    <p className="mt-6 text-sm font-semibold text-[#2D75B9]">{autosStory.brand} · {autosStory.topic}</p>
                    <h3 className="mt-3 text-balance font-serif text-4xl leading-[1.02] sm:text-5xl">{normalizeBlueprintCopy(autosStory.title)}</h3>
                    <p className="mt-5 max-w-[65ch] text-base leading-7 text-slate-600">{normalizeBlueprintCopy(autosStory.summary)}</p>
                  </article>
                  <aside className="hidden border-l border-slate-300 bg-[#EEF3F7] p-5 lg:block"><p className="text-sm font-bold">Useful context</p><p className="mt-3 text-sm leading-6 text-slate-600">Related stories and a clearly labeled ad stay available without interrupting the article.</p></aside>
                </div>
              </div>
              <div className="mt-8"><AmbientVariantExplorer variants={ambientVariants} /></div>
            </section>

            <section id="revenue" className="scroll-mt-8">
              <SectionHead label="Revenue with trust" title="Commercial value belongs around the story, not in its way" copy="Ads appear between complete reading moments. Products appear only when the editorial recommendation is real and the destination is verified." />
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-3">
                {[
                  ["Related stories", "Continue the reader's intent. Omit the module when nothing is strong enough."],
                  ["Advertising", "Label it clearly, control frequency, and never interrupt a paragraph."],
                  ["Commerce", "Show named products with real images, valid links, and editorial context."],
                ].map(([title, copy]) => <article key={title} className="bg-white p-6"><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p><div className="mt-5"><Status>Guardrail</Status></div></article>)}
              </div>
              {commerceStory ? (
                <div className="mt-8 grid overflow-hidden border border-slate-200 bg-white lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="relative min-h-72 bg-slate-100"><Image src={commerceStory.image} alt="" fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" /></div>
                  <div className="p-6 sm:p-8">
                    <Status>Working today</Status>
                    <h3 className="mt-5 text-balance font-serif text-4xl leading-[1.02]">{normalizeBlueprintCopy(commerceStory.title)}</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">Products appear because the story supports them, not because space is available.</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {commerceStory.commerceCollection.products.slice(0, 2).map((product) => <article key={`${product.name}-${product.amazonUrl}`} className="grid grid-cols-[72px_1fr] items-center gap-3 border-t border-slate-200 pt-3"><div className="relative aspect-square bg-white"><Image src={product.imageUrl} alt="" fill sizes="72px" className="object-contain" /></div><h4 className="text-sm font-bold leading-5">{normalizeBlueprintCopy(product.name)}</h4></article>)}
                    </div>
                  </div>
                </div>
              ) : null}
            </section>

            <section id="next" className="scroll-mt-8">
              <SectionHead label="What comes next" title="The experience works. Now connect the systems that let it scale" copy="The product direction is clear. The next investment is reliable identity, fresh content operations, ad decisioning, commerce attribution, and privacy-aware measurement." />
              <div className="mt-10 grid gap-px bg-slate-200 md:grid-cols-2">
                <article className="bg-white p-6"><Status>Working today</Status><h3 className="mt-5 text-2xl font-bold">Proven in the prototype</h3><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600"><li>Complete articles and brand identity</li><li>Personalized recommendations</li><li>Standard and Ambient Reader experiences</li><li>Related stories, ads, and product examples</li></ul></article>
                <article className="bg-white p-6"><Status>Build next</Status><h3 className="mt-5 text-2xl font-bold">Required for production</h3><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600"><li>Identity, consent, and preference sync</li><li>Scheduled content refresh and monitoring</li><li>Ad delivery, frequency, and attribution</li><li>Analytics, testing, privacy, and governance</li></ul></article>
              </div>
            </section>
          </div>
        </div>
      </main>
      <ProductFooter />
    </div>
  );
}
