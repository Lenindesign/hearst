import type { Metadata } from "next";
import { EntertainmentWatchPage } from "@/components/hearst-plus/entertainment/entertainment-watch-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Entertainment | Hearst+",
  description: "A dark streaming-style Hearst+ prototype for A&E family entertainment brands.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "Entertainment | Hearst+",
    "A dark streaming-style Hearst+ prototype for A&E family entertainment brands.",
  ),
};

export default function HearstPlusEntertainmentPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <EntertainmentWatchPage />
    </ThemeProvider>
  );
}
