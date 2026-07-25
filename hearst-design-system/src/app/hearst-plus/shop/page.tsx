import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { getAmbientCommerceStories } from "@/lib/ambient-commerce-stories";
import { getHearstStoryRoute } from "@/lib/story-routes";
import { socialGraphMetadata } from "@/lib/social-graph-image";

/* Product images are third-party source assets that have been verified in the
 * source article. They are intentionally not sent through the limited Next
 * image allowlist. */
/* eslint-disable @next/next/no-img-element */

export const metadata: Metadata = {
  title: "Shop the stories | Hearst+",
  description: "Editorial stories with verified, source-backed product collections.",
  ...socialGraphMetadata(
    "/hearst-plus/shop/opengraph-image/",
    "Shop the stories | Hearst+",
    "Editorial stories with verified, source-backed product collections.",
  ),
};

function getReaderHref(storyId: string) {
  const searchParams = new URLSearchParams({
    from: "/hearst-plus/shop/",
    ambient: "1",
  });

  return `${getHearstStoryRoute(storyId)}?${searchParams.toString()}`;
}

export default function HearstPlusShopPage() {
  const stories = getAmbientCommerceStories();
  const brandCount = new Set(stories.map((story) => story.brandSlug)).size;

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-5 px-5 py-5 md:px-8">
            <Link
              href="/hearst-plus/"
              className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Return to Hearst+"
            >
              <span className="text-2xl font-black tracking-[0.2em] text-primary">HEARST+</span>
            </Link>
            <Link
              href="/hearst-plus/"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Back to For You
            </Link>
          </div>
        </header>

        <main>
          <section className="border-b border-border bg-muted/30">
            <div className="mx-auto max-w-[1360px] px-5 py-12 md:px-8 md:py-16">
              <p className="text-sm font-semibold text-primary">Hearst+ shopping guides</p>
              <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
                <div>
                  <h1 className="headline max-w-4xl text-balance text-5xl leading-[0.96] tracking-[-0.035em] md:text-7xl">
                    Shop the stories.
                  </h1>
                  <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                    Guides with useful product recommendations, each checked against the source article and shown with a real product image before appearing here.
                  </p>
                </div>
                <p className="border-t border-border pt-4 text-sm leading-6 text-muted-foreground lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  {stories.length} editorial guides from {brandCount} Hearst brands. Product links open Amazon directly. Prices, sellers, and availability can change.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="shop-story-list" className="mx-auto max-w-[1360px] px-5 py-10 md:px-8 md:py-14">
            <h2 id="shop-story-list" className="sr-only">Shop the stories</h2>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => {
                const leadProduct = story.commerceCollection.products[0];
                return (
                  <article key={story.id} className="group flex min-w-0 flex-col border-t border-border pt-4">
                    <Link
                      href={getReaderHref(story.id)}
                      className="block overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                      aria-label={`Read ${story.title}`}
                    >
                      <img
                        src={story.image}
                        alt=""
                        className="aspect-[16/10] w-full object-cover transition-transform duration-200 motion-reduce:transition-none group-hover:scale-[1.015]"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col pt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                        {story.brand} · {story.topic}
                      </p>
                      <h3 className="headline mt-2 text-balance text-2xl leading-tight">
                        <Link
                          href={getReaderHref(story.id)}
                          className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {story.title}
                        </Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{story.summary}</p>
                      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                        <img
                          src={leadProduct.imageUrl}
                          alt=""
                          className="h-14 w-14 shrink-0 object-contain"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Featured in this guide</p>
                          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5">{leadProduct.name}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        <SiteFooter
          siteName={<BrandLogo slug="hearst-all" className="h-8 max-w-[16rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
          copyrightYear={2026}
          finePrintNote="Prototype only. Stories and products are sourced from public Hearst pages. Amazon affiliate tracking is not enabled."
        />
      </div>
    </ThemeProvider>
  );
}
