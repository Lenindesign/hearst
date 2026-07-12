import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hearst-ew-headline",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Hearst E&W",
  description: "A personalized daily destination prototype for Hearst health, gear, fitness, and wellness brands.",
};

export default function HearstEWPage() {
  return (
    <div className={newsreader.variable}>
      <ThemeProvider defaultBrandSlug="hearst-ew">
        <HomePageTemplate />
      </ThemeProvider>
    </div>
  );
}
