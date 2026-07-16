import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getHearstAllBrands, getHearstBrandRoute } from "@/lib/hearst-routes";

const uniqueBrandRoutes = Array.from(new Map(getHearstAllBrands().map((brand) => [brand.brandSlug, brand])).values());

export function generateStaticParams() {
  return uniqueBrandRoutes.map((brand) => ({ brandSlug: brand.brandSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = uniqueBrandRoutes.find((item) => item.brandSlug === brandSlug);

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
  const brand = uniqueBrandRoutes.find((item) => item.brandSlug === brandSlug);

  if (!brand) notFound();

  redirect(getHearstBrandRoute(brandSlug));
}
