import type { Metadata } from "next";
import { DesignAgentPageComponent } from "@/components/design-agent-page";
import { ThemeProvider } from "@/components/theme-provider";
import { socialGraphMetadata } from "@/lib/social-graph-image";

export const metadata: Metadata = {
  title: "Design Agent Architecture & SDLC | Hearst Design System",
  description:
    "Interactive architectural diagram of the Hearst Design Agent: multi-subagent orchestration (HDS, Brand, Surface, Governance), Company Brain, and the end-to-end SDLC lifecycle.",
  ...socialGraphMetadata(
    "/design-agent/opengraph-image/",
    "Design Agent Architecture & SDLC",
    "Interactive whiteboard architecture: Multi-Subagent Engine, FRE UI Kit, 8-Point Governance Firewall, and 4-Track Prototyping Pipeline."
  ),
};

export default function DesignAgentPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <DesignAgentPageComponent />
    </ThemeProvider>
  );
}
