import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Hearst Magazines",
  description:
    "A combined personalized Hearst destination prototype across Lifestyle, Autos, Flux, and E&W brands.",
};

export default function HearstAllPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <HomePageTemplate />
    </ThemeProvider>
  );
}
