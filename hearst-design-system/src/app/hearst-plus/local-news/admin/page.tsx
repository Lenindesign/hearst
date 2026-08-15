import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { HearstTVFeedExperience } from "@/components/hearst-plus/hearst-tv-feed-experience";
import { LocalNewsGlobalHeader } from "@/components/hearst-plus/local-news-global-header";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Local News Feed Admin | Hearst+",
  description: "Configure reusable Hearst TV RSS and MRSS feed records for the Hearst+ local-news prototype.",
};

export default function LocalNewsAdminPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-local-news">
      <div className="hearst-plus-theme min-h-screen bg-background text-foreground">
        <LocalNewsGlobalHeader />
        <HearstTVFeedExperience mode="admin" />
        <SiteFooter
          siteName={<BrandLogo slug="hearst-local-news" className="h-8 max-w-[16rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
          copyrightYear={2026}
          finePrintNote="Prototype only. Feed configuration edits are stored in the current browser until a production feed-management service is connected."
        />
      </div>
    </ThemeProvider>
  );
}
