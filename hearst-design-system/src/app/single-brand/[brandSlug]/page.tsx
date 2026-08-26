import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstDestinationStaticData } from "@/lib/hearst-destination-data";
import {
  SINGLE_BRANDS,
  getSingleBrandLiveFeed,
  getSingleBrandMasthead,
  getSingleBrandName,
  isSingleBrand,
} from "@/templates/single-brand-feed";

type PageProps = { params: Promise<{ brandSlug: string }> };

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SINGLE_BRANDS.map(({ slug }) => ({ brandSlug: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  const name = getSingleBrandName(brandSlug);
  if (!name) return { title: "Not found" };
  return { title: name, description: `${name} — a single-brand Hearst+ destination.` };
}

export default async function SingleBrandHomePage({ params }: PageProps) {
  const { brandSlug } = await params;
  if (!isSingleBrand(brandSlug)) notFound();

  return (
    <ThemeProvider defaultBrandSlug={brandSlug} persistColorMode={false}>
      <HomePageTemplate
        initialBrandSlug={brandSlug}
        liveFeedData={getSingleBrandLiveFeed(brandSlug)}
        liveFeedMode="replace"
        mastheadLogoOverride={getSingleBrandMasthead(brandSlug)}
        staticDestinationData={getHearstDestinationStaticData()}
        forceDestinationRiver
        singleBrandName={getSingleBrandName(brandSlug)}
      />
    </ThemeProvider>
  );
}
