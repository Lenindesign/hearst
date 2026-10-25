import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/fre/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { PageContainer } from "@/components/ui/grid";
import { NewsstandExperience } from "@/components/hearst-plus/newsstand/newsstand-experience";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Newsstand | Hearst+",
  description: "Every Hearst magazine. One subscription.",
  ...socialGraphMetadata("/hearst-plus/opengraph-image/", "Newsstand | Hearst+", "Every Hearst magazine. One subscription."),
};

export default function HearstPlusNewsstandPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <div className="min-h-screen bg-background text-foreground">
        <header className="relative z-30 border-b border-border bg-background">
          <PageContainer className="flex items-center justify-between gap-5 py-4">
            <Link
              href="/hearst-plus/"
              className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Return to Hearst+"
            >
              <BrandLogo
                slug="hearst-all"
                label="Hearst+"
                color="var(--palette-content-knockout)"
                className="block h-[22px] [&_svg]:h-full [&_svg]:w-auto"
              />
            </Link>
            <Link
              href="/hearst-plus/"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Back to For You
            </Link>
          </PageContainer>
        </header>
        <NewsstandExperience />
        <SiteFooter
          siteName={<BrandLogo slug="hearst-all" className="block h-8 max-w-[16rem] [&_svg]:h-full [&_svg]:w-auto" color="#fff" />}
          className="relative z-20"
          copyrightYear={2026}
          finePrintNote="Prototype only. Cover images are sourced from public Hearst brand pages."
        />
      </div>
    </ThemeProvider>
  );
}
