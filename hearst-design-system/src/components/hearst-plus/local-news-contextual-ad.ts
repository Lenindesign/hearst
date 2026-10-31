import type { ContextualAdUnit } from "@/components/hearst-plus/content-reader-advertisement";

export const localNewsContextualAd: ContextualAdUnit = {
  id: "local-news-community-partner",
  sponsor: "Local Market Partner",
  title: "Closer to your community",
  summary: "A contextual sponsorship preview for neighborhood services, events, and local businesses.",
  cta: "Explore local coverage",
  topics: ["Local News", "Community"],
  tags: ["community", "local", "neighborhood"],
  creativeLabel: "COMMUNITY",
  imageUrl: "/images/hearst-local-news-community-ad.png",
  palette: {
    background: "var(--card)",
    foreground: "var(--foreground)",
    accent: "var(--primary)",
    soft: "var(--secondary)",
  },
};
