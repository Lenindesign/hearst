import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";
import {
  getHearstSectionBrand,
  getHearstSectionBrandSlugs,
  hearstSectionThemeSlugs,
  type HearstBrandSection,
} from "@/lib/hearst-routes";

type SectionBrandPageProps = {
  params: Promise<{ brandSlug: string }>;
};

export function generateSectionBrandStaticParams(section: HearstBrandSection) {
  return getHearstSectionBrandSlugs(section).map((brandSlug) => ({ brandSlug }));
}

export async function generateSectionBrandMetadata(
  section: HearstBrandSection,
  { params }: SectionBrandPageProps
): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = getHearstSectionBrand(section, brandSlug);

  if (!brand) return {};

  return {
    title: `${brand.brand} | Hearst ${section === "ew" ? "Enthusiast & Wellness" : section === "flux" ? "Fashion & Luxury" : section}`,
    description: `A personalized ${brand.brand} story feed within the Hearst ${section} destination.`,
  };
}

export async function SectionBrandRoutePage({
  section,
  params,
}: SectionBrandPageProps & { section: HearstBrandSection }) {
  const { brandSlug } = await params;
  const brand = getHearstSectionBrand(section, brandSlug);

  if (!brand) notFound();

  return (
    <ThemeProvider defaultBrandSlug={hearstSectionThemeSlugs[section]}>
      <HomePageTemplate key={brand.brandSlug} initialBrandSlug={brand.brandSlug} />
    </ThemeProvider>
  );
}
