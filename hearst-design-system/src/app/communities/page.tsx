import type { Metadata } from "next";
import { CommunityForumsPage } from "@/components/hearst-plus/community-forums-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Communities | Hearst+",
  description: "Hearst+ groups for story discussions, writer prompts, and reader posts across brands.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Communities | Hearst+",
    "Hearst+ groups for story discussions, writer prompts, and reader posts across brands.",
  ),
};

export default function Page() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <CommunityForumsPage />
    </ThemeProvider>
  );
}
