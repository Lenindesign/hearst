import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hearst-flux-headline",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Hearst Flux",
  description: "A personalized daily destination prototype for Hearst fashion, culture, design, and luxury brands.",
};

export default function HearstFluxPage() {
  return (
    <div className={newsreader.variable}>
      <ThemeProvider defaultBrandSlug="hearst-flux" persistColorMode={false}>
        <HomePageTemplate />
      </ThemeProvider>
    </div>
  );
}
