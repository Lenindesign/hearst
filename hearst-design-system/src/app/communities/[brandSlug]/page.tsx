import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommunityForumsPage } from "@/components/hearst-plus/community-forums-page";
import { ThemeProvider } from "@/components/theme-provider";
import {
  getHearstAllBrands,
  getHearstBrandRoute,
} from "@/lib/hearst-routes";
import { socialGraphMetadata } from "@/lib/social-graph-image";

type PageProps = {
  params: Promise<{ brandSlug: string }>;
};

export function generateStaticParams() {
  return getHearstAllBrands().map((brand) => ({ brandSlug: brand.brandSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = getHearstAllBrands().find((candidate) => candidate.brandSlug === brandSlug);
  if (!brand) return {};

  const title = `${brand.brand} Community | Hearst+`;
  const description = `Forum threads, story comments, and community prompts for ${brand.brand}.`;
  return {
    title,
    description,
    ...socialGraphMetadata(getHearstBrandRoute(brand.brandSlug), title, description),
  };
}

export default async function Page({ params }: PageProps) {
  const { brandSlug } = await params;
  const brand = getHearstAllBrands().find((candidate) => candidate.brandSlug === brandSlug);
  if (!brand) notFound();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <CommunityForumsPage activeBrandSlug={brandSlug} />
    </ThemeProvider>
  );
}
