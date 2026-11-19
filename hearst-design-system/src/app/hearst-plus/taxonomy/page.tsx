import type { Metadata } from "next";

import { TaxonomyPreviewPage } from "./taxonomy-preview-page";

export const metadata: Metadata = {
  title: "Taxonomy preview | Hearst+",
  description: "Hearst+ with the proposed reader taxonomy: interests lead the navigation and brand families group the brands. A proposal, not the live navigation.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function TaxonomyPreviewRoute() {
  return <TaxonomyPreviewPage />;
}
