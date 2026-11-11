import { Suspense, type CSSProperties } from "react";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { LocalNewsGlobalHeader } from "@/components/hearst-plus/local-news-global-header";
import { NewspaperFeedsReaderExperience } from "@/components/hearst-plus/newspaper-feeds-section";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Local News Newspapers | Hearst+",
  description: "Hearst+ local-news prototype for reusable Hearst Newspapers RSS feed configuration.",
  ...socialGraphMetadata(
    "/images/hearst-plus-share.jpg",
    "Local News Newspapers | Hearst+",
    "Hearst+ local-news prototype for reusable Hearst Newspapers RSS feed configuration.",
  ),
};

export default function LocalNewsNewspapersPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-local-news">
      <div
        className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] text-foreground"
        style={{
          "--primary": "#2B6FAF",
          "--hp-primary": "#2B6FAF",
          "--hp-nav": "#2B6FAF",
          "--hp-section-title": "#2B6FAF",
          "--hp-sidebar-heading": "#2B6FAF",
        } as CSSProperties}
      >
        <LocalNewsGlobalHeader />
        <section id="newspapers" className="mx-auto max-w-[1360px] scroll-mt-20 px-5 py-8 md:px-8">
          <Suspense fallback={null}>
            <NewspaperFeedsReaderExperience />
          </Suspense>
        </section>
        <SiteFooter
          siteName={<BrandLogo slug="hearst-local-news" className="block h-4 w-28 [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
          copyrightYear={2026}
          finePrintNote="Prototype only. Newspaper feed URLs remain disabled until a verified RSS endpoint is configured."
        />
      </div>
    </ThemeProvider>
  );
}
