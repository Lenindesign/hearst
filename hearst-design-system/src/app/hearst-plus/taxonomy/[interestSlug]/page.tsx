import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getReaderInterestBySlug } from "@/lib/reader-taxonomy";

import { TaxonomyPreviewPage } from "../taxonomy-preview-page";

type Props = { params: Promise<{ interestSlug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const interest = getReaderInterestBySlug((await params).interestSlug);
  if (!interest) return {};
  return {
    title: `${interest} | Hearst+ taxonomy preview`,
    description: `${interest} stories from every Hearst brand, in the proposed reader taxonomy. A proposal, not the live navigation.`,
    robots: { index: false, follow: false },
  };
}

export default async function TaxonomyInterestRoute({ params }: Props) {
  const interest = getReaderInterestBySlug((await params).interestSlug);
  if (!interest) notFound();
  return <TaxonomyPreviewPage interest={interest} />;
}
