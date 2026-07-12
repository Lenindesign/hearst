import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { lifestyleRiverSourceNotes } from "@/components/lifestyle-river-data";
import { autosRiverSourceNotes } from "@/components/autos-river-data";
import { fluxRiverSourceNotes } from "@/components/flux-river-data";
import { ewRiverSourceNotes } from "@/components/ew-river-data";

const brandRoutes = [
  ...lifestyleRiverSourceNotes,
  ...autosRiverSourceNotes,
  ...fluxRiverSourceNotes,
  ...ewRiverSourceNotes,
];

const uniqueBrandRoutes = Array.from(
  new Map(brandRoutes.map((brand) => [brand.brandSlug, brand])).values()
);

function getBrand(brandSlug: string) {
  return uniqueBrandRoutes.find((brand) => brand.brandSlug === brandSlug);
}

export function generateStaticParams() {
  return uniqueBrandRoutes.map((brand) => ({ brandSlug: brand.brandSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = getBrand(brandSlug);

  if (!brand) return {};

  return {
    title: `${brand.brand} | Hearst Magazines`,
    description: `A personalized ${brand.brand} story feed within the Hearst Magazines destination.`,
  };
}

export default async function BrandRoutePage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const brand = getBrand(brandSlug);

  if (!brand) notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate key={brand.brandSlug} initialBrandSlug={brand.brandSlug} />
    </ThemeProvider>
  );
}
