import type { Metadata } from "next";
import { EntertainmentWatchPage } from "@/components/hearst-plus/entertainment/entertainment-watch-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "A&E | Hearst+ Entertainment",
  description: "A dark streaming-style Hearst+ prototype for A&E shows.",
  ...socialGraphMetadata(
    "/hearst-plus/opengraph-image/",
    "A&E | Hearst+ Entertainment",
    "A dark streaming-style Hearst+ prototype for A&E shows.",
  ),
};

export default function HearstPlusAandEPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <EntertainmentWatchPage activeChannel="A&E" />
    </ThemeProvider>
  );
}
