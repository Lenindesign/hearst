import type { Metadata } from "next";
import { AiInHdsPageComponent } from "@/components/ai-in-hds-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "AI in Design Systems: An HDS Workflow Audit | Hearst Design System",
  description:
    "An evidence-based evaluation of AI agents updating and leveraging the Hearst Design System: utility boundaries, the editorial taste gap, token governance, and multi-brand scaling.",
  ...socialGraphMetadata(
    "/ai-in-hds/opengraph-image/",
    "AI in Design Systems: An HDS Workflow Audit",
    "Evidence-based audit of AI agents in design system workflows: what works, what fails, and the deterministic token boundary."
  ),
};

export default function AiInHdsPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <AiInHdsPageComponent />
    </ThemeProvider>
  );
}
