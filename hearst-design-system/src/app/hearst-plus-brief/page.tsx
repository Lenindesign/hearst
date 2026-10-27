import type { Metadata } from "next";
import Link from "next/link";
import { communityParticipationThreads, communityGroups } from "@/lib/community-groups";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { isExplicitGalleryStory } from "@/components/hearst-plus/story-presentation-model";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { ThemeProvider } from "@/components/theme-provider";
import { ProductFooter, ProductHeader, streams, totalMagazineStories } from "@/components/product-story-shell";
import { getPersonalizeAutosVideoFeed } from "@/lib/personalize-live-feed";
import { brands } from "@/lib/brands";
import { HearstPlusBrandDirectory, HearstPlusBriefSamples, HearstPlusTemplatePreviews } from "@/components/hearst-plus-brief-samples";

const riverDemoTopics = ["Food", "Style", "Home", "Wellness", "Entertainment", "Shopping"];

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hearst+ Executive Brief",
  description: "How Hearst+ can turn fresh stories across reader interests into a more personal daily habit, and the scalable system behind it.",
};

function getCommunitySample(): CommunityFeedThread {
  const seed = communityParticipationThreads[0];
  const group = communityGroups.find((candidate) => candidate.brandSlug === seed.brandSlug && candidate.groupSlug === seed.groupSlug);

  return {
    id: seed.id,
    brand: "Delish",
    brandSlug: seed.brandSlug,
    title: seed.title,
    body: seed.body,
    meta: `${group?.name ?? "Delish"}${group?.members ? ` · ${group.members}` : ""}`,
    kindLabel: seed.kind === "writer" ? "Host thread" : "Reader post",
    replies: seed.replies,
    helpfulBase: seed.replies + 14,
    author: seed.author,
    isHost: seed.kind === "writer",
    href: `/communities/${seed.brandSlug}/threads/${seed.id}/`,
    posterImage: "/images/delish-community-feature.png",
    posterAlt: seed.title,
    mediaType: seed.mediaType,
    videoUrl: seed.videoUrl,
  };
}

export default async function HearstPlusBriefPage() {
  const videoFeed = await getPersonalizeAutosVideoFeed();
  const articleStory = lifestyleRiverStories.find((story) => story.sourceUrl && !story.videoUrl && !isExplicitGalleryStory(story)) ?? lifestyleRiverStories[0];
  const galleryStory = lifestyleRiverStories.find(isExplicitGalleryStory);
  const riverDemoStories = riverDemoTopics.flatMap((topic) =>
    lifestyleRiverStories
      .filter((story) => story.topic === topic || story.topic.startsWith(`${topic} `))
      .slice(0, 2),
  ).filter((story, index, stories) => stories.findIndex((candidate) => candidate.id === story.id) === index);
  const videoStory = videoFeed.stories
    .filter((story) => Boolean(story.videoUrl))
    .sort((first, second) => Date.parse(second.publishedAt ?? "") - Date.parse(first.publishedAt ?? ""))[0];
  const videoSourceCopy = videoFeed.isFallback
    ? "Using the local snapshot fallback for this preview."
    : "From Hearst+ configured video recommendations.";
  const communityThread = getCommunitySample();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
    <div className="hearst-plus-theme min-h-screen overflow-x-clip bg-background text-foreground">
      <ProductHeader current="reference" appearance="navy" />
      <main>
        <section className="bg-[var(--hp-utility-bar)] text-primary-foreground">
          <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-10 md:py-32">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-foreground/75">Hearst+ · Executive brief</p>
              <h1 className="mt-8 max-w-4xl font-[var(--hp-font-headline)] font-bold text-balance text-5xl leading-[1.02] tracking-[-.025em] md:text-6xl lg:text-[78px]">Give readers a reason to come back tomorrow.</h1>
              <p className="mt-8 max-w-3xl text-base leading-7 text-primary-foreground/80">
                Bring fresh stories from many interests into one personal daily experience. Learn from what readers choose, then make the next visit feel more relevant while every source keeps its identity.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/hearst-plus/" className="inline-flex min-h-11 items-center rounded-md bg-background px-5 text-base font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">Explore Hearst+</Link>
                <Link href="/hearst-plus-reference/" className="inline-flex min-h-11 items-center rounded-md border border-primary-foreground/40 px-5 text-base font-semibold text-primary-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">Open the full reference</Link>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="habit-heading" className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">The reader habit</p>
          <h2 id="habit-heading" className="mt-8 max-w-3xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">Make each visit useful. Make the next one feel even more personal.</h2>
          <ol className="mt-14 grid gap-0 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
            <li className="py-10 md:px-8 md:first:pl-0"><span className="font-mono text-xs text-primary">01</span><h3 className="mt-5 text-xl font-semibold md:text-[28px]">Start with something fresh</h3><p className="mt-5 max-w-sm text-base leading-6 text-muted-foreground">Open with a current mix across the subjects, formats, and sources a reader cares about.</p></li>
            <li className="border-t border-border py-10 md:border-t-0 md:px-7"><span className="font-mono text-xs text-primary">02</span><h3 className="mt-5 text-xl font-semibold md:text-[28px]">Notice what resonates</h3><p className="mt-5 max-w-sm text-base leading-6 text-muted-foreground">Use reader choices and engagement signals to understand what is useful, without losing variety.</p></li>
            <li className="border-t border-border py-10 md:border-t-0 md:px-7 md:last:pr-0"><span className="font-mono text-xs text-primary">03</span><h3 className="mt-5 text-xl font-semibold md:text-[28px]">Improve the next visit</h3><p className="mt-5 max-w-sm text-base leading-6 text-muted-foreground">Bring forward more relevant stories and new interests, giving readers a reason to return.</p></li>
          </ol>
        </section>

        <section aria-labelledby="system-heading" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">One app · shared content system</p>
            <h2 id="system-heading" className="mt-8 max-w-3xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">One web app, with a river for discovery and reusable pages for every format.</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Build around reader needs and content models, not a separate product for every brand or media type. Shared foundations can scale while publication identity remains visible.</p>
            <div className="mt-10 grid gap-px bg-border md:grid-cols-[.72fr_1fr_1.2fr]">
              <div className="bg-background p-7 md:p-8"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">One web app</p><h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl">Shared foundation</h3><p className="mt-4 text-base leading-6 text-muted-foreground">Navigation, source identity, reader signals, ranking, and accessible components.</p></div>
              <div className="bg-background p-7 md:p-8"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Index · inventory</p><h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl">The story river</h3><p className="mt-4 text-base leading-6 text-muted-foreground">A broad, fresh inventory across interests. Show a useful first set, then progressively load and rank more as readers explore.</p></div>
              <div className="bg-background p-7 md:p-8"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Detail · shared templates</p><h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl">The right way to read, watch, or join</h3><ul className="mt-3 grid gap-x-5 gap-y-1 text-base leading-6 text-muted-foreground sm:grid-cols-2"><li>Article pages</li><li>Video pages</li><li>Photo galleries</li><li>Community posts</li></ul></div>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Shared content models let the river choose the right card for each story, then open a detail experience designed for that format.</p>
            <div className="mt-14 border-t border-border pt-12">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Shared system · distinct brands</p>
                <h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl leading-tight">One component library, with each magazine’s identity intact.</h3>
                <p className="mt-4 text-base leading-6 text-muted-foreground">The same river cards, navigation, and article, video, gallery, and community templates use each publication’s registered logo, palette, headline font, and body font. Structure and behavior stay shared; color and typography follow the source brand.</p>
              </div>
              <div className="mt-8">
                <HearstPlusBrandDirectory brands={brands.filter((brand) => brand.slug !== "white-label")} />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="samples-heading" className="mx-auto max-w-[1320px] px-5 py-20 md:px-10 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Architecture · demonstrated in the app</p><h2 id="samples-heading" className="mt-8 max-w-3xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">One app. Two page templates. A flexible river.</h2></div>
            <p className="max-w-md text-base leading-6 text-muted-foreground">A single route-based Next.js app uses client-side navigation and shareable URLs. The scaled live previews below show the index and detail templates in context.</p>
          </div>
          <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
            <article className="bg-card p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Template 01 · Index / inventory</p>
              <h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl">Discover in the story river</h3>
              <p className="mt-2 text-base leading-6 text-muted-foreground">A ranked, diverse inventory filters and progressively loads cards as readers explore.</p>
            </article>
            <article className="bg-card p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Template 02 · Detail</p>
              <h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl">Open the right experience</h3>
              <p className="mt-2 text-base leading-6 text-muted-foreground">One shared detail framework selects reading, playback, gallery, or conversation by content type.</p>
            </article>
          </div>
          <HearstPlusTemplatePreviews articleStory={articleStory} />
          <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
            <div className="bg-card p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Story formats · canonical content</p>
              <p className="mt-2 max-w-lg text-base leading-6 text-muted-foreground">Four source-backed records can power many presentations. Each keeps its publisher, rights, and destination attached.</p>
              <ul className="mt-6 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
                {["Article", "Video", "Photo gallery", "Community post"].map((model, index) => (
                  <li key={model} className="bg-background p-3"><span className="font-mono text-xs text-primary">0{index + 1}</span><p className="mt-2 text-base font-semibold">{model}</p></li>
                ))}
              </ul>
            </div>
            <div className="bg-card p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">More river modules · already represented in the app</p>
              <p className="mt-2 max-w-lg text-base leading-6 text-muted-foreground">The inventory can also place useful services and clearly labeled commercial units alongside stories.</p>
              <ul className="mt-6 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
                {["Shorts / vertical video", "Shopping / commerce", "Brand spotlight", "Advertisement"].map((model) => (
                  <li key={model} className="bg-background p-3"><p className="text-base font-semibold">{model}</p></li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">Ads remain visibly labeled and separately governed; shopping and brand promotions retain their destination and disclosure context.</p>
            </div>
          </div>
          <p className="mt-8 max-w-5xl text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Five HDS layers:</strong> tokens, accessible primitives, shared modules, the two page templates, and brand themes. For production, add a canonical content contract that carries source and rights metadata through normalization, eligibility, deduplication, ranking, and privacy-aware measurement.</p>
          <HearstPlusBriefSamples articleStory={articleStory} galleryStory={galleryStory} videoStory={videoStory} riverDemoStories={riverDemoStories} communityThread={communityThread} videoSourceCopy={videoSourceCopy} />
        </section>

        <section aria-labelledby="evidence-heading" className="border-y border-border bg-muted/40">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">What we know today</p><h2 id="evidence-heading" className="mt-8 font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">A working prototype gives us something real to learn from.</h2><p className="mt-5 text-base leading-6 text-muted-foreground">The repository contains {totalMagazineStories} image-backed public RSS records across four magazine datasets and {streams.length} configured reader sections. These are implementation snapshots, not live audience or performance metrics.</p></div>
            <div className="grid gap-8 border-t border-border pt-5 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div><h3 className="text-xl font-semibold">Already demonstrated</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Cross-source routes, source-aware stories, read-only recommendations, progressive feed delivery, video and gallery surfaces, community examples, and browser-local reader controls.</p></div>
              <div><h3 className="text-xl font-semibold">Still to prove or build for production</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Whether readers return more often, whether personalization improves usefulness, plus production identity, consent, analytics collection, monitored content refresh, and a validated commercial model.</p></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="publisher-value-heading" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">A business model that strengthens the brands</p>
            <h2 id="publisher-value-heading" className="mt-8 max-w-4xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">Make Hearst+ a discovery layer, not a substitute for the source.</h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">Research on news aggregation is mixed: links can help readers discover publishers, while complete in-app content can replace visits to the original site. The results vary across publishers and markets, so they do not prove that all 29 Hearst brands will benefit. <a className="font-semibold text-foreground underline underline-offset-4" href="https://journals.sagepub.com/doi/10.1177/0022243720913029" target="_blank" rel="noreferrer">Research on links between publishers</a> · <a className="font-semibold text-foreground underline underline-offset-4" href="https://www.nber.org/papers/w28746" target="_blank" rel="noreferrer">Research on Google News aggregation</a></p>
            <ol className="mt-10 grid gap-0 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
              <li className="py-8 md:px-7 md:first:pl-0"><span className="font-mono text-xs text-primary">01</span><h3 className="mt-2 text-xl font-semibold">Preview, then send readers to the brand</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Keep the publisher and author visible. Default to a concise preview with a direct “Continue on [Brand]” link.</p></li>
              <li className="border-t border-border py-8 md:border-t-0 md:px-5"><span className="font-mono text-xs text-primary">02</span><h3 className="mt-2 text-xl font-semibold">License in-app reading with clear value credit</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Full articles, video, or galleries stay in Hearst+ only with brand approval, rights, search rules, and an agreed share of the value they create.</p></li>
              <li className="border-t border-border py-8 md:border-t-0 md:px-5 md:last:pr-0"><span className="font-mono text-xs text-primary">03</span><h3 className="mt-2 text-xl font-semibold">Prove benefit title by title</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Track source-site visits, engagement, revenue, and conversions against a holdout. A portfolio gain must not hide a loss at one brand.</p></li>
            </ol>
            <p className="mt-8 max-w-4xl text-base leading-6 text-muted-foreground"><strong className="text-foreground">Canonical URLs help search engines identify similar pages; they do not send visits or transfer page-view credit.</strong> Google also cautions against relying on canonical tags to handle syndicated copies; search treatment needs to be set for each content mode. <a className="font-semibold text-foreground underline underline-offset-4" href="https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting" target="_blank" rel="noreferrer">Google’s syndicated-content guidance</a></p>
          </div>
        </section>

        <section aria-labelledby="success-heading" className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Executive decision · what we need to prove</p>
          <h2 id="success-heading" className="mt-8 max-w-4xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">Can a more useful daily mix create value for readers and brands?</h2>
          <div className="mt-10 grid gap-px border-y-2 border-primary bg-border sm:grid-cols-2 lg:grid-cols-4">
            <article className="bg-card p-7"><p className="font-mono text-xs text-primary">01</p><h3 className="mt-2 text-xl font-semibold">Reader value</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Do readers value cross-interest discovery enough to choose Hearst+ and return, alongside brand sites and other aggregators?</p></article>
            <article className="bg-card p-7"><p className="font-mono text-xs text-primary">02</p><h3 className="mt-2 text-xl font-semibold">Portfolio value</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Can people follow a few brands and interests while discovering others—and does this complement memberships and bundles?</p></article>
            <article className="bg-card p-7"><p className="font-mono text-xs text-primary">03</p><h3 className="mt-2 text-xl font-semibold">Brand impact</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Does discovery create incremental source-site visits, engagement, or conversions for participating brands?</p></article>
            <article className="bg-card p-7"><p className="font-mono text-xs text-primary">04</p><h3 className="mt-2 text-xl font-semibold">Repeat use</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Do readers make repeat useful visits? Set the measure and success threshold before the pilot.</p></article>
          </div>
          <div className="mt-10 grid gap-8 border-b border-border pb-6 md:grid-cols-2">
            <div><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Guardrails</p><p className="mt-2 text-base leading-6 text-muted-foreground">Review results by brand, preserve fresh and varied discovery, and watch reader feedback alongside source-site outcomes.</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Recommended next step</p><p className="mt-2 text-base leading-6 text-muted-foreground">Run a bounded reader pilot against a baseline or holdout. Use return behavior, brand-level outcomes, and reader feedback to decide whether to refine or expand.</p></div>
          </div>
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Read the research</p>
            <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
              <Link href="/hearst-plus-publisher-study/" className="group bg-background p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span className="text-xs font-bold uppercase tracking-[.12em] text-primary">Publisher impact</span>
                <span className="mt-2 block font-[var(--hp-font-headline)] font-bold text-xl leading-tight group-hover:underline">Can Hearst+ help the original brands?</span>
                <span className="mt-2 block text-base leading-6 text-muted-foreground">Evidence, risks, and a per-brand model for proving value.</span>
              </Link>
              <Link href="/hearst-plus-subscription-study/" className="group bg-background p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span className="text-xs font-bold uppercase tracking-[.12em] text-primary">Subscription feasibility</span>
                <span className="mt-2 block font-[var(--hp-font-headline)] font-bold text-xl leading-tight group-hover:underline">Would readers pay for Hearst+?</span>
                <span className="mt-2 block text-base leading-6 text-muted-foreground">Bundle evidence, offer options, and a reader-research plan.</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <ProductFooter />
    </div>
    </ThemeProvider>
  );
}
