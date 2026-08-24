import type { Metadata } from "next";
import { ArchitecturePageComponent } from "@/components/architecture-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "App Architecture & Core Templates | Hearst Design System",
  description:
    "A comprehensive architectural blueprint explaining the two core page templates (Home/Index vs. Article/Detail), global runtime components, sidebar rails, and content type card models across Hearst.",
  ...socialGraphMetadata(
    "/architecture/opengraph-image/",
    "App Architecture & Core Templates",
    "Comprehensive architectural breakdown of Home/Index and Article/Detail templates, global components, and sidebar rails in the Hearst Design System."
  ),
};

export default function ArchitecturePage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <ArchitecturePageComponent />
    </ThemeProvider>
  );
}
