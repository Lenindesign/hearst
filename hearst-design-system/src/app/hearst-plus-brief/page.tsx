import type { Metadata } from "next";
import Link from "next/link";
import { communityParticipationThreads, communityGroups } from "@/lib/community-groups";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { isExplicitGalleryStory } from "@/components/hearst-plus/story-presentation-model";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { ThemeProvider } from "@/components/theme-provider";
import { ProductFooter, ProductHeader, streams, totalMagazineStories } from "@/components/product-story-shell";
import { getPersonalizeAutosVideoFeed } from "@/lib/personalize-live-feed";
import { HearstPlusBriefSamples } from "@/components/hearst-plus-brief-samples";

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
          <div className="mx-auto grid max-w-[1320px] gap-9 px-5 py-12 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-foreground/75">Hearst+ · Executive brief</p>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-.025em] md:text-7xl">Give readers a reason to come back tomorrow.</h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-primary-foreground/80 md:text-lg">
                Bring fresh stories from many interests into one personal daily experience. Learn from what readers choose, then make the next visit feel more relevant while every source keeps its identity.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/hearst-plus/" className="inline-flex min-h-11 items-center rounded-md bg-background px-5 text-sm font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">Explore Hearst+</Link>
                <Link href="/hearst-plus-reference/" className="inline-flex min-h-11 items-center rounded-md border border-primary-foreground/40 px-5 text-sm font-semibold text-primary-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">Open the full reference</Link>
              </div>
            </div>
            <aside className="border-t border-primary-foreground/30 pt-5 lg:ml-4">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary-foreground/70">The question to answer</p>
              <p className="mt-3 font-serif text-2xl leading-tight md:text-3xl">Will a more relevant daily mix earn repeat visits?</p>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/75">That is the product hypothesis. The prototype makes the experience tangible; readers will tell us whether it is valuable.</p>
            </aside>
          </div>
        </section>

        <section aria-labelledby="habit-heading" className="mx-auto max-w-[1200px] px-5 py-10 md:px-10 md:py-14">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">The reader habit</p>
          <h2 id="habit-heading" className="mt-3 max-w-3xl font-serif text-3xl leading-tight md:text-4xl">Make each visit useful. Make the next one feel even more personal.</h2>
          <ol className="mt-8 grid gap-0 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
            <li className="py-5 md:px-5 md:first:pl-0"><span className="font-mono text-xs text-primary">01</span><h3 className="mt-2 font-semibold">Start with something fresh</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Open with a current mix across the subjects, formats, and sources a reader cares about.</p></li>
            <li className="border-t border-border py-5 md:border-t-0 md:px-5"><span className="font-mono text-xs text-primary">02</span><h3 className="mt-2 font-semibold">Notice what resonates</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Use reader choices and engagement signals to understand what is useful, without losing variety.</p></li>
            <li className="border-t border-border py-5 md:border-t-0 md:px-5 md:last:pr-0"><span className="font-mono text-xs text-primary">03</span><h3 className="mt-2 font-semibold">Improve the next visit</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Bring forward more relevant stories and new interests, giving readers a reason to return.</p></li>
          </ol>
        </section>

        <section aria-labelledby="system-heading" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-10 md:py-14">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">One app · shared content system</p>
            <h2 id="system-heading" className="mt-3 max-w-3xl font-serif text-3xl leading-tight md:text-4xl">One web app, with a river for discovery and reusable pages for every format.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Build around reader needs and content models, not a separate product for every brand or media type. Shared foundations can scale while publication identity remains visible.</p>
            <div className="mt-8 grid gap-px bg-border md:grid-cols-[.72fr_1fr_1.2fr]">
              <div className="bg-background p-5 md:p-6"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">One web app</p><h3 className="mt-2 font-serif text-2xl">Shared foundation</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Navigation, source identity, reader signals, ranking, and accessible components.</p></div>
              <div className="bg-background p-5 md:p-6"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Index · inventory</p><h3 className="mt-2 font-serif text-2xl">The story river</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">A broad, fresh inventory across interests. Show a useful first set, then progressively load and rank more as readers explore.</p></div>
              <div className="bg-background p-5 md:p-6"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Detail · shared templates</p><h3 className="mt-2 font-serif text-2xl">The right way to read, watch, or join</h3><ul className="mt-3 grid gap-x-5 gap-y-1 text-sm leading-6 text-muted-foreground sm:grid-cols-2"><li>Article pages</li><li>Video pages</li><li>Photo galleries</li><li>Community posts</li></ul></div>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Shared content models let the river choose the right card for each story, then open a detail experience designed for that format.</p>
          </div>
        </section>

        <section aria-labelledby="samples-heading" className="mx-auto max-w-[1320px] px-5 py-10 md:px-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Real app examples</p><h2 id="samples-heading" className="mt-3 max-w-3xl font-serif text-3xl leading-tight md:text-4xl">The river can move naturally across formats.</h2></div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">These examples use Hearst+ story and community components with checked-in story records and the configured video feed.</p>
          </div>
          <HearstPlusBriefSamples articleStory={articleStory} galleryStory={galleryStory} videoStory={videoStory} communityThread={communityThread} videoSourceCopy={videoSourceCopy} />
        </section>

        <section aria-labelledby="evidence-heading" className="border-y border-border bg-muted/40">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 md:px-10 md:py-14 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">What we know today</p><h2 id="evidence-heading" className="mt-3 font-serif text-3xl leading-tight md:text-4xl">A working prototype gives us something real to learn from.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">The repository contains {totalMagazineStories} image-backed public RSS records across four magazine datasets and {streams.length} configured reader sections. These are implementation snapshots, not live audience or performance metrics.</p></div>
            <div className="grid gap-8 border-t border-border pt-5 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div><h3 className="font-semibold">Already demonstrated</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Cross-source routes, source-aware stories, read-only recommendations, progressive feed delivery, video and gallery surfaces, community examples, and browser-local reader controls.</p></div>
              <div><h3 className="font-semibold">Still to prove or build for production</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Whether readers return more often, whether personalization improves usefulness, plus production identity, consent, analytics collection, monitored content refresh, and a validated commercial model.</p></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="publisher-value-heading" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-10 md:py-14">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">A business model that strengthens the brands</p>
            <h2 id="publisher-value-heading" className="mt-3 max-w-4xl font-serif text-3xl leading-tight md:text-4xl">Make Hearst+ a discovery layer, not a substitute for the source.</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">Research on news aggregation is mixed: links can help readers discover publishers, while complete in-app content can replace visits to the original site. The results vary across publishers and markets, so they do not prove that all 29 Hearst brands will benefit. <a className="font-semibold text-foreground underline underline-offset-4" href="https://journals.sagepub.com/doi/10.1177/0022243720913029" target="_blank" rel="noreferrer">Research on links between publishers</a> · <a className="font-semibold text-foreground underline underline-offset-4" href="https://www.nber.org/papers/w28746" target="_blank" rel="noreferrer">Research on Google News aggregation</a></p>
            <ol className="mt-7 grid gap-0 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
              <li className="py-5 md:px-5 md:first:pl-0"><span className="font-mono text-xs text-primary">01</span><h3 className="mt-2 font-semibold">Preview, then send readers to the brand</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Keep the publisher and author visible. Default to a concise preview with a direct “Continue on [Brand]” link.</p></li>
              <li className="border-t border-border py-5 md:border-t-0 md:px-5"><span className="font-mono text-xs text-primary">02</span><h3 className="mt-2 font-semibold">License in-app reading with clear value credit</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Full articles, video, or galleries stay in Hearst+ only with brand approval, rights, search rules, and an agreed share of the value they create.</p></li>
              <li className="border-t border-border py-5 md:border-t-0 md:px-5 md:last:pr-0"><span className="font-mono text-xs text-primary">03</span><h3 className="mt-2 font-semibold">Prove benefit title by title</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Track source-site visits, engagement, revenue, and conversions against a holdout. A portfolio gain must not hide a loss at one brand.</p></li>
            </ol>
            <p className="mt-5 max-w-4xl text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Canonical URLs help search engines identify similar pages; they do not send visits or transfer page-view credit.</strong> Google also cautions against relying on canonical tags to handle syndicated copies; search treatment needs to be set for each content mode. <a className="font-semibold text-foreground underline underline-offset-4" href="https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting" target="_blank" rel="noreferrer">Google’s syndicated-content guidance</a></p>
          </div>
        </section>

        <section aria-labelledby="success-heading" className="mx-auto max-w-[1200px] px-5 py-10 md:px-10 md:py-14">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">What success looks like</p>
          <h2 id="success-heading" className="mt-3 max-w-3xl font-serif text-3xl leading-tight md:text-4xl">A habit readers choose, built on useful discovery.</h2>
          <div className="mt-6 grid gap-8 border-t-2 border-primary pt-5 md:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Primary outcome to validate</p><p className="mt-2 text-xl font-semibold">Repeat useful visits</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Agree on a repeat-use measure and threshold before a reader study. This is a proposed measure, not a reported result.</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Quality checks</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Keep content fresh, preserve a range of reader interests and Hearst sources, make story origins clear, and confirm that readers can find something worth their time.</p></div>
          </div>
          <div className="mt-8 border-t border-border pt-5"><p className="max-w-3xl text-sm leading-6 text-muted-foreground">Recommended next step: validate the discovery-to-return loop with readers before committing to a production-scale rollout. Use what they choose, what they finish, and whether they return to guide the next investment decision.</p></div>
          <div className="mt-8 border-t border-border pt-5">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Read the research</p>
            <div className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-2">
              <Link href="/hearst-plus-publisher-study/" className="group bg-background p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span className="text-xs font-bold uppercase tracking-[.12em] text-primary">Publisher impact</span>
                <span className="mt-2 block font-serif text-2xl leading-tight group-hover:underline">Can Hearst+ help the original brands?</span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">Evidence, risks, and a per-brand model for proving value.</span>
              </Link>
              <Link href="/hearst-plus-subscription-study/" className="group bg-background p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span className="text-xs font-bold uppercase tracking-[.12em] text-primary">Subscription feasibility</span>
                <span className="mt-2 block font-serif text-2xl leading-tight group-hover:underline">Would readers pay for Hearst+?</span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">Bundle evidence, offer options, and a reader-research plan.</span>
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
