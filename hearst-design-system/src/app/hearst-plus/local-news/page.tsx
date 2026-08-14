import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { HearstTVFeedExperience } from "@/components/hearst-plus/hearst-tv-feed-experience";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Local News | Hearst+",
  description: "Hearst+ local-news prototype powered by reusable Hearst TV RSS and MRSS feed configuration.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Local News | Hearst+",
    "Hearst+ local-news prototype powered by reusable Hearst TV RSS and MRSS feed configuration.",
  ),
};

export default function LocalNewsPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <div className="min-h-screen bg-background text-foreground">
        <LocalNewsHeader current="reader" />
        <HearstTVFeedExperience mode="reader" />
        <SiteFooter
          siteName={<BrandLogo slug="hearst-all" className="h-8 max-w-[16rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
          copyrightYear={2026}
          finePrintNote="Prototype only. Hearst TV station feed URLs remain disabled until a verified RSS or MRSS endpoint is configured."
        />
      </div>
    </ThemeProvider>
  );
}

export function LocalNewsHeader({ current }: { current: "reader" | "admin" }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-3 px-5 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/hearst-plus/"
          className="inline-flex min-h-11 items-center self-start rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Return to Hearst+"
        >
          <span className="text-2xl font-black tracking-[0.2em] text-primary">HEARST+</span>
        </Link>
        <nav aria-label="Local News views" className="-mx-3 flex min-w-0 overflow-x-auto text-sm font-semibold">
          <Link
            href="/hearst-plus/local-news/"
            aria-current={current === "reader" ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              current === "reader" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Local News
          </Link>
          <Link
            href="/hearst-plus/local-news/admin/"
            aria-current={current === "admin" ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              current === "admin" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Feed admin
          </Link>
          <Link
            href="/hearst-plus/"
            className="inline-flex min-h-11 shrink-0 items-center px-3 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            For You
          </Link>
        </nav>
      </div>
    </header>
  );
}
