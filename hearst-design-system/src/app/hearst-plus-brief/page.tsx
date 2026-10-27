import type { Metadata } from "next";
import Link from "next/link";
import { communityParticipationThreads, communityGroups } from "@/lib/community-groups";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import { getLifestyleCardKind, isExplicitGalleryStory } from "@/components/hearst-plus/story-presentation-model";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { ThemeProvider } from "@/components/theme-provider";
import { ProductFooter, ProductHeader, streams, totalMagazineStories } from "@/components/product-story-shell";
import { getPersonalizeAutosVideoFeed } from "@/lib/personalize-live-feed";
import { brands } from "@/lib/brands";
import { getBrandPromotionForSlot } from "@/components/hearst-plus/brand-promotion-model";
import { isDelishPortraitShort } from "@/lib/hearst-video-destination-model";
import { HearstPlusBrandDirectory, HearstPlusBriefSamples, HearstPlusTemplatePreviews } from "@/components/hearst-plus-brief-samples";

const riverDemoTopics = ["Food", "Style", "Home", "Wellness", "Entertainment", "Shopping"];

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hearst+ Executive Brief",
  description: "Hearst+ proposal for cross-brand story discovery, personalization, subscriptions, and pilot measures.",
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
  const shoppingStory = lifestyleRiverStories.find((story) => getLifestyleCardKind(story) === "shopping");
  const shortsStories = videoFeed.stories.filter(isDelishPortraitShort).slice(0, 4);
  const brandSpotlight = getBrandPromotionForSlot({
    stories: lifestyleRiverStories,
    fallbackStories: lifestyleRiverStories,
    activeFilter: "For You",
    slotNumber: 2,
  });
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
        <section className="relative isolate overflow-hidden bg-[var(--hp-utility-bar)] text-primary-foreground">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full opacity-[0.035] md:w-[72%] md:opacity-[0.065]"
            style={{
              backgroundImage: "url('/images/hearst-plus-editorial-watermark.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12% center",
              backgroundSize: "min(74vw, 1180px) auto",
              maskImage: "linear-gradient(to left, black 0%, black 18%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 0%, black 18%, transparent 100%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-[1320px] px-5 py-20 md:px-10 md:py-32">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-foreground/75">Hearst+ · Executive brief</p>
              <h1 className="mt-8 max-w-4xl font-[var(--hp-font-headline)] font-bold text-balance text-5xl leading-[1.02] tracking-[-.025em] md:text-6xl lg:text-[78px]">Bring readers back with a fresh, personalized mix across Hearst brands.</h1>
              <p className="mt-8 max-w-3xl text-base leading-7 text-primary-foreground/80">
                Bring new stories from many Hearst brands into one feed. Use reader choices to shape future recommendations while each publication keeps its identity.
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
          <h2 id="habit-heading" className="mt-8 max-w-3xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">One visit shapes the next.</h2>
          <ol className="mt-14 grid gap-0 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
            <li className="py-10 md:px-8 md:first:pl-0"><span className="font-mono text-xs text-primary">01</span><h3 className="mt-5 text-xl font-semibold md:text-[28px]">Show new stories</h3><p className="mt-5 max-w-sm text-base leading-6 text-muted-foreground">Open with current stories across the subjects, formats, and sources a reader follows.</p></li>
            <li className="border-t border-border py-10 md:border-t-0 md:px-7"><span className="font-mono text-xs text-primary">02</span><h3 className="mt-5 text-xl font-semibold md:text-[28px]">Learn from reader choices</h3><p className="mt-5 max-w-sm text-base leading-6 text-muted-foreground">Use reads, saves, and skips to adjust ranking while keeping a range of sources and topics.</p></li>
            <li className="border-t border-border py-10 md:border-t-0 md:px-7 md:last:pr-0"><span className="font-mono text-xs text-primary">03</span><h3 className="mt-5 text-xl font-semibold md:text-[28px]">Check whether readers return</h3><p className="mt-5 max-w-sm text-base leading-6 text-muted-foreground">Use those signals to rank future stories, then measure useful repeat visits.</p></li>
          </ol>
        </section>

        <section aria-labelledby="daily-habit-heading" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <h2 id="daily-habit-heading" className="mb-12 max-w-5xl font-[var(--hp-font-headline)] text-5xl font-bold leading-[.98] tracking-[-.025em] text-balance md:mb-16 md:text-[78px]">The Daily Habit</h2>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Why the river model</p>
                <h3 id="river-model-heading" className="mt-8 max-w-2xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">Come back to a fresh mix that feels more like yours.</h3>
                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">Each visit opens on new stories. Reader choices then shape what appears next, bringing the experience closer to the topics, sources, and formats each person values.</p>
              </div>
              <ol className="border-y border-border">
                <li className="grid gap-3 border-b border-border py-7 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <h3 className="font-[var(--hp-font-headline)] text-xl font-bold md:text-2xl">Freshness</h3>
                  <p className="text-base leading-7 text-muted-foreground">New reporting and timely updates make the river visibly different between visits, instead of replaying the same lineup.</p>
                </li>
                <li className="grid gap-3 border-b border-border py-7 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <h3 className="font-[var(--hp-font-headline)] text-xl font-bold md:text-2xl">Personal relevance</h3>
                  <p className="text-base leading-7 text-muted-foreground">What readers choose, finish, save, or skip helps shape the next mix, bringing forward more of what has proved useful to them.</p>
                </li>
                <li className="grid gap-3 py-7 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <h3 className="font-[var(--hp-font-headline)] text-xl font-bold md:text-2xl">Discovery</h3>
                  <p className="text-base leading-7 text-muted-foreground">Ranking can introduce relevant sources and formats beyond the brands or topics a reader already knows to seek out.</p>
                </li>
              </ol>
            </div>

            <section aria-labelledby="loop-heading" className="mt-16 border-t border-border pt-10">
              <h2 id="loop-heading" className="mb-10 max-w-5xl font-[var(--hp-font-headline)] text-5xl font-bold leading-[.98] tracking-[-.025em] text-balance md:mb-14 md:text-[78px]">The Loop</h2>
              <div>
                <h3 className="max-w-5xl font-[var(--hp-font-headline)] text-4xl font-bold leading-[1.05] tracking-[-.02em] text-balance md:text-[54px]">Why people return to a fresh-content river</h3>
                <p className="mt-6 max-w-5xl text-xl leading-8 text-muted-foreground md:text-2xl md:leading-9">Readers have a reason to return when the feed has changed and includes stories relevant to their interests.</p>

                <div className="mt-10 border-y border-border py-5 md:py-6">
                  <ol aria-label="The return sequence" className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
                    {["Cue", "Anticipation", "Check in", "Discover something relevant", "Get a payoff", "Expect a reason to return"].map((step, index, steps) => (
                      <li key={step} className="flex items-center gap-3 text-base font-semibold leading-6 md:text-lg">
                        <span>{step}</span>
                        {index < steps.length - 1 ? <span aria-hidden="true" className="text-primary">→</span> : null}
                      </li>
                    ))}
                  </ol>
                </div>

                <ol className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    { title: "Cue", body: "A familiar moment, event, or update prompts a visit." },
                    { title: "Anticipation", body: "The reader expects new content, but doesn’t know exactly what they’ll find." },
                    { title: "Discovery", body: "The feed surfaces something timely, personally relevant, or unexpectedly interesting." },
                    { title: "Payoff", body: "The reader feels informed, entertained, connected, or caught up." },
                    { title: "Return", body: "A satisfying visit makes the next check-in feel worthwhile." },
                  ].map((step, index) => (
                    <li key={step.title} className="border-t border-border pt-5 md:pt-6">
                      <p className="font-mono text-sm font-semibold text-primary">0{index + 1}</p>
                      <h4 className="mt-3 font-[var(--hp-font-headline)] text-2xl font-bold leading-tight md:text-[28px]">{step.title}</h4>
                      <p className="mt-3 text-lg leading-7 text-muted-foreground">{step.body}</p>
                    </li>
                  ))}
                </ol>

                <p className="mt-12 max-w-5xl border-t border-border pt-6 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                  Habit research examines how repeated actions in consistent contexts can become more automatic. Reward-learning research explores how expectations and outcomes shape future behavior. Together, these studies offer a useful framework for designing a return experience around freshness, discovery, and relevance. <a className="font-semibold text-foreground underline underline-offset-4" href="https://onlinelibrary.wiley.com/doi/10.1002/ejsp.674" target="_blank" rel="noreferrer">Lally et al. on habit formation</a> · <a className="font-semibold text-foreground underline underline-offset-4" href="https://www.nature.com/articles/s41593-024-01705-4" target="_blank" rel="noreferrer">Gershman et al. on dopamine and reward prediction</a>
                </p>

                <div className="mt-12 grid gap-4 border-t-2 border-primary pt-7 md:grid-cols-[minmax(220px,.65fr)_minmax(0,1.35fr)] md:gap-12">
                  <p className="text-sm font-bold uppercase tracking-[.16em] text-primary">The product question</p>
                  <p className="max-w-4xl font-[var(--hp-font-headline)] text-3xl font-bold leading-tight tracking-[-.02em] text-balance md:text-[40px]">Did readers find useful stories, and will they return for more?</p>
                </div>

                <div className="mt-12 border-t border-border pt-6">
                  <h4 className="text-sm font-bold uppercase tracking-[.16em] text-primary">Feed-based products audiences already know</h4>
                  <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-lg font-semibold">
                    {[
                      { name: "Yahoo", href: "https://www.yahoo.com/" },
                      { name: "ESPN", href: "https://www.espn.com/" },
                      { name: "TMZ", href: "https://www.tmz.com/" },
                      { name: "BuzzFeed", href: "https://www.buzzfeed.com/" },
                      { name: "X", href: "https://x.com/" },
                      { name: "Instagram", href: "https://www.instagram.com/" },
                      { name: "Facebook", href: "https://www.facebook.com/" },
                    ].map((site) => (
                      <li key={site.name}><a className="underline decoration-border underline-offset-4 hover:decoration-foreground" href={site.href} target="_blank" rel="noreferrer">{site.name}<span className="sr-only"> (opens in a new tab)</span></a></li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">From news and sports to social discovery, people know to check feeds for what is new. Hearst+ can bring that familiar rhythm to trusted magazine brands, with fresh stories across the interests readers care about.</p>
                </div>
              </div>
            </section>

            <div className="mt-14 grid gap-5 border-t-2 border-primary pt-8 md:grid-cols-[minmax(220px,.65fr)_minmax(0,1.35fr)] md:gap-12">
              <h3 className="font-[var(--hp-font-headline)] text-2xl font-bold leading-tight md:text-[32px]">Why this pattern fits Hearst+</h3>
              <div>
                <p className="text-base leading-7 text-muted-foreground">A Hearst+ river can pair timely stories across the magazine portfolio with signals from reader choices, while keeping each source visible. A pilot can measure whether that combination earns useful repeat visits and supports participating titles.</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="evidence-heading" className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
              <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">What we know today</p><h2 id="evidence-heading" className="mt-8 font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">The prototype lets us test the product hypothesis.</h2><p className="mt-5 text-base leading-6 text-muted-foreground">The prototype connects {totalMagazineStories} image-backed public RSS records across four magazine datasets and {streams.length} reader sections, so we can see how a cross-brand river handles stories across interests and formats.</p></div>
              <div className="grid gap-8 border-t border-border pt-5 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div><h3 className="text-xl font-semibold">Already demonstrated</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Cross-source routes, source-aware stories, read-only recommendations, progressive feed delivery, video and gallery surfaces, community examples, and browser-local reader controls.</p></div>
                <div><h3 className="text-xl font-semibold">Pilot measures and production needs</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Measure reader return and perceived usefulness. Prepare production identity, consent, analytics, monitored content refresh, and a commercial model agreed with participating brands.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="system-heading" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">One app · shared content system</p>
            <h2 id="system-heading" className="mt-8 max-w-3xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">One web app for cross-brand discovery and reusable detail pages.</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Use shared navigation, content models, and page templates across brands and formats. Keep each publication’s identity visible.</p>
            <div className="mt-10 grid gap-px bg-border md:grid-cols-[.72fr_1fr_1.2fr]">
              <div className="bg-background p-7 md:p-8"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">One web app</p><h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl">Shared foundation</h3><p className="mt-4 text-base leading-6 text-muted-foreground">Navigation, source identity, reader signals, ranking, and accessible components.</p></div>
              <div className="bg-background p-7 md:p-8"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Index · inventory</p><h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl">The story river</h3><p className="mt-4 text-base leading-6 text-muted-foreground">Rank stories across interests. Show an initial set, then load more as readers browse.</p></div>
              <div className="bg-background p-7 md:p-8"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Detail · shared templates</p><h3 className="mt-4 font-[var(--hp-font-headline)] font-bold text-xl">Pages for each content format</h3><ul className="mt-3 grid gap-x-5 gap-y-1 text-base leading-6 text-muted-foreground sm:grid-cols-2"><li>Articles</li><li>Videos</li><li>Photo galleries</li><li>Community posts</li></ul></div>
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
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Architecture · demonstrated in the app</p><h2 id="samples-heading" className="mt-8 max-w-3xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">One app. Two page templates. One river across brands and formats.</h2></div>
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
              <p className="mt-2 max-w-lg text-base leading-6 text-muted-foreground">Four content models carry publisher, rights, and destination details into their cards and detail pages.</p>
              <ul className="mt-6 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
                {["Article", "Video", "Photo gallery", "Community post"].map((model, index) => (
                  <li key={model} className="bg-background p-3"><span className="font-mono text-xs text-primary">0{index + 1}</span><p className="mt-2 text-base font-semibold">{model}</p></li>
                ))}
              </ul>
            </div>
            <div className="bg-card p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">More river modules · already represented in the app</p>
              <p className="mt-2 max-w-lg text-base leading-6 text-muted-foreground">The river can include reader utilities and labeled commercial placements alongside stories.</p>
              <ul className="mt-6 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
                {["Shorts / vertical video", "Shopping / commerce", "Brand spotlight", "Advertisement"].map((model) => (
                  <li key={model} className="bg-background p-3"><p className="text-base font-semibold">{model}</p></li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">Label ads as sponsored, and keep shopping and brand-promotion links connected to their approved destinations.</p>
            </div>
          </div>
          <p className="mt-8 max-w-5xl text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Five HDS layers:</strong> tokens, accessible primitives, shared modules, the two page templates, and brand themes. Production also needs a shared content record for source and rights data, eligibility, deduplication, ranking, and privacy-aware measurement.</p>
          <HearstPlusBriefSamples articleStory={articleStory} galleryStory={galleryStory} shoppingStory={shoppingStory} shortsStories={shortsStories} brandSpotlight={brandSpotlight} videoStory={videoStory} riverDemoStories={riverDemoStories} communityThread={communityThread} videoSourceCopy={videoSourceCopy} />
        </section>

        <section aria-labelledby="publisher-value-heading" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">A business model that strengthens the brands</p>
            <h2 id="publisher-value-heading" className="mt-8 max-w-4xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">Make Hearst+ a discovery layer that sends value back to brands.</h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">Start with brand-owned previews and direct links that send readers to the original publication. Add licensed in-app access only when a title opts in, with clear attribution and agreed economics. Track source traffic, engagement, revenue, and conversions title by title. <a className="font-semibold text-foreground underline underline-offset-4" href="https://journals.sagepub.com/doi/10.1177/0022243720913029" target="_blank" rel="noreferrer">Research on links between publishers</a> · <a className="font-semibold text-foreground underline underline-offset-4" href="https://www.nber.org/papers/w28746" target="_blank" rel="noreferrer">Research on Google News aggregation</a></p>
            <div className="mt-16 border-t border-border pt-10">
              <h3 className="max-w-3xl font-[var(--hp-font-headline)] text-3xl font-bold leading-tight md:text-[38px]">A subscription ladder to test, from free discovery to premium.</h3>
              <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">Use these options to learn what readers value. Preserve direct brand subscriptions, and let each participating title approve its access, content, and economics.</p>
              <ol className="mt-8 divide-y divide-border border-y border-border">
                <li className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-8">
                  <h4 className="font-[var(--hp-font-headline)] text-2xl font-bold">Free discovery</h4>
                  <p className="max-w-3xl text-base leading-7 text-muted-foreground">Keep the river open with story previews, fresh cross-brand recommendations, and clear links to read at the original site. Labeled advertising can support reach while the experience sends readers back to participating brands.</p>
                </li>
                <li className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-8">
                  <h4 className="font-[var(--hp-font-headline)] text-2xl font-bold">Metered reading</h4>
                  <p className="max-w-3xl text-base leading-7 text-muted-foreground">Offer a limited number of full in-app reads only where a title opts in. Keep meters and conversion prompts title-specific, honor the brand’s existing meter, and route readers to that title when they reach its limit.</p>
                </li>
                <li className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-8">
                  <h4 className="font-[var(--hp-font-headline)] text-2xl font-bold">Choose-your-brands bundle</h4>
                  <p className="max-w-3xl text-base leading-7 text-muted-foreground">Let readers bundle a few brands that match their interests, alongside any portfolio offer worth testing. Carry existing subscriber entitlements forward and agree how revenue and usage credit flow to each title.</p>
                </li>
                <li className="grid gap-3 py-7 sm:grid-cols-[220px_1fr] sm:gap-8">
                  <h4 className="font-[var(--hp-font-headline)] text-2xl font-bold">Premium, ad-free</h4>
                  <p className="max-w-3xl text-base leading-7 text-muted-foreground">Test an ad-free cross-brand experience with approved full access and distinct member utility, such as saved collections or member newsletters. Remove ads only where the economics and brand agreements support it.</p>
                </li>
              </ol>
              <p className="mt-5 max-w-4xl text-sm leading-6 text-muted-foreground">Evaluate each paid option on recurring reader value, subscriber fit, and its effect on direct title relationships.</p>
              <Link href="/hearst-plus-subscription-study/" className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Read the subscription feasibility study</Link>
            </div>
            <ol className="mt-10 grid gap-0 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
              <li className="py-8 md:px-7 md:first:pl-0"><span className="font-mono text-xs text-primary">01</span><h3 className="mt-2 text-xl font-semibold">Preview, then send readers to the brand</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Keep the publisher and author visible. Default to a concise preview with a direct “Continue on [Brand]” link.</p></li>
              <li className="border-t border-border py-8 md:border-t-0 md:px-5"><span className="font-mono text-xs text-primary">02</span><h3 className="mt-2 text-xl font-semibold">License in-app reading with clear value credit</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Full articles, video, or galleries stay in Hearst+ only with brand approval, rights, search rules, and an agreed share of the value they create.</p></li>
              <li className="border-t border-border py-8 md:border-t-0 md:px-5 md:last:pr-0"><span className="font-mono text-xs text-primary">03</span><h3 className="mt-2 text-xl font-semibold">Prove benefit title by title</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Track source-site visits, engagement, revenue, and conversions against a holdout. A portfolio gain must not hide a loss at one brand.</p></li>
            </ol>
            <p className="mt-8 max-w-4xl text-base leading-6 text-muted-foreground"><strong className="text-foreground">Canonical URLs help search engines identify similar pages; they do not send visits or transfer page-view credit.</strong> Google also cautions against relying on canonical tags to handle syndicated copies; search treatment needs to be set for each content mode. <a className="font-semibold text-foreground underline underline-offset-4" href="https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting" target="_blank" rel="noreferrer">Google’s syndicated-content guidance</a></p>
          </div>
        </section>

        <section aria-labelledby="success-heading" className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Executive decision · pilot plan</p>
          <h2 id="success-heading" className="mt-8 max-w-4xl font-[var(--hp-font-headline)] font-bold text-balance text-4xl leading-[1.08] md:text-[54px]">A fresh mix can bring readers back and strengthen Hearst brands.</h2>
          <div className="mt-10 grid gap-px border-y-2 border-primary bg-border sm:grid-cols-2 lg:grid-cols-4">
            <article className="bg-card p-7"><p className="font-mono text-xs text-primary">01</p><h3 className="mt-2 text-xl font-semibold">Reader value</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Do readers value cross-interest discovery enough to choose Hearst+ and return, alongside brand sites and other aggregators?</p></article>
            <article className="bg-card p-7"><p className="font-mono text-xs text-primary">02</p><h3 className="mt-2 text-xl font-semibold">Portfolio value</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Can readers follow a few brands, discover others, and still find value in memberships and bundles?</p></article>
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
