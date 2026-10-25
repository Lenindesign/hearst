import type { Metadata } from "next";
import { DesignAgentPageComponent } from "@/components/design-agent-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Design Agent Implementation Review | Hearst Design System",
  description:
    "Repository evidence for what the Design Agent page implements and which proposed capabilities it does not demonstrate.",
  ...socialGraphMetadata(
    "/design-agent/opengraph-image/",
    "Design Agent Implementation Review",
    "Repository evidence for a static workflow illustration and its implementation boundaries."
  ),
};

export default function DesignAgentPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <DesignAgentPageComponent />
    </ThemeProvider>
  );
}
