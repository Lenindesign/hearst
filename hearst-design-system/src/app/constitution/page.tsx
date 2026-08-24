import type { Metadata } from "next";
import { ConstitutionPageComponent } from "@/components/constitution-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "The HDS Design Constitution | Hearst Design System",
  description:
    "The 8 unbreakable articles of the Hearst Design System: system hierarchy, anti-slop editorial laws, template archetypes, card contracts, and token governance for PMs, developers, and AI agents.",
  ...socialGraphMetadata(
    "/constitution/opengraph-image/",
    "The HDS Design Constitution",
    "Foundational design laws, architectural standards, and anti-slop guidelines across the 29+ Hearst brand network."
  ),
};

export default function ConstitutionPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <ConstitutionPageComponent />
    </ThemeProvider>
  );
}
