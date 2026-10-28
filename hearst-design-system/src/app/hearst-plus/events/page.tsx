import type { Metadata } from "next";
import { HearstEventsIndex } from "@/components/hearst-plus/events/hearst-events-experience";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstAllBrands } from "@/lib/hearst-routes";

export const metadata: Metadata = {
  title: "Events | Hearst+",
  description: "Discover experiences from Hearst brands and follow the events our editors cover.",
};

export default async function HearstEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedBrand = Array.isArray(params.brand) ? params.brand[0] : params.brand;
  const initialBrand = requestedBrand && getHearstAllBrands().some(({ brandSlug }) => brandSlug === requestedBrand)
    ? requestedBrand
    : "all";

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HearstEventsIndex initialBrand={initialBrand} />
    </ThemeProvider>
  );
}
