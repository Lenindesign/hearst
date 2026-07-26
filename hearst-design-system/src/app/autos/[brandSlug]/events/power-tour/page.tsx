import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HotRodEventsPage } from "@/components/hot-rod-events-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

type PageProps = {
  params: Promise<{ brandSlug: string }>;
};

const title = "HOT ROD Power Tour";
const description =
  "The annual HOT ROD Power Tour hub, including edition status, routes, schedules, event resources, and coverage.";

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
      <HotRodEventsPage detailMode />
    </ThemeProvider>
  );
}
