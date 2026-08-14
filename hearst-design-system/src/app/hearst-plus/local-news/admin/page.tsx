import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { HearstTVFeedExperience } from "@/components/hearst-plus/hearst-tv-feed-experience";
import { ThemeProvider } from "@/components/theme-provider";
import { LocalNewsHeader } from "../page";

export const metadata: Metadata = {
  title: "Local News Feed Admin | Hearst+",
  description: "Configure reusable Hearst TV RSS and MRSS feed records for the Hearst+ local-news prototype.",
};

export default function LocalNewsAdminPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <div className="min-h-screen bg-background text-foreground">
        <LocalNewsHeader current="admin" />
        <HearstTVFeedExperience mode="admin" />
        <SiteFooter
          siteName={<BrandLogo slug="hearst-all" className="h-8 max-w-[16rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
          copyrightYear={2026}
          finePrintNote="Prototype only. Feed configuration edits are stored in the current browser until a production feed-management service is connected."
        />
      </div>
    </ThemeProvider>
  );
}
