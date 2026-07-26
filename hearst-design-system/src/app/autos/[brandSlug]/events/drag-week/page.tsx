import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HotRodDragWeekPage } from "@/components/hot-rod-events-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

type PageProps = {
  params: Promise<{ brandSlug: string }>;
};

const title = "HOT ROD Drag Week 2026";
const description =
  "Plan for HOT ROD Drag Week 2026 with the complete track schedule, racer waitlist, spectator tickets, official rules, hotels, and vendor information.";

export const metadata: Metadata = {
  title,
  description,
  ...socialGraphMetadata(
    "/autos/hot-rod/opengraph-image/",
    title,
    description
  ),
};

export default async function Page({ params }: PageProps) {
  const { brandSlug } = await params;
  if (brandSlug !== "hot-rod") notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-plus">
      <HotRodDragWeekPage />
    </ThemeProvider>
  );
}
