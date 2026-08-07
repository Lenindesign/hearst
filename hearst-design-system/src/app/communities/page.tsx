import type { Metadata } from "next";
import { CommunityForumsPage } from "@/components/hearst-plus/community-forums-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Communities | Hearst+",
  description: "A shared Hearst+ forums and comments destination across brands.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Communities | Hearst+",
    "A shared Hearst+ forums and comments destination across brands.",
  ),
};

export default function Page() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <CommunityForumsPage />
    </ThemeProvider>
  );
}
