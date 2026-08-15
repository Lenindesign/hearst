import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { HearstTVLocalNewsReaderExperience } from "@/components/hearst-plus/hearst-tv-feed-experience";
import { LocalNewsGlobalHeader } from "@/components/hearst-plus/local-news-global-header";
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
    <ThemeProvider defaultBrandSlug="hearst-local-news">
      <div
        className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] text-foreground"
        style={{
          "--primary": "#00874D",
          "--hp-primary": "#00874D",
          "--hp-nav": "#00874D",
          "--hp-section-title": "#00874D",
          "--hp-sidebar-heading": "#00874D",
        } as CSSProperties}
      >
        <LocalNewsGlobalHeader />
        <section id="tv-stations" className="mx-auto max-w-[1360px] scroll-mt-20 px-5 py-8 md:px-8">
          <HearstTVLocalNewsReaderExperience />
        </section>
        <SiteFooter
          siteName={<BrandLogo slug="hearst-local-news" className="h-5 max-w-[11rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
          copyrightYear={2026}
          finePrintNote="Prototype only. Local News feed URLs remain disabled until a verified RSS or MRSS endpoint is configured."
        />
      </div>
    </ThemeProvider>
  );
}
