import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hearst-edit-headline",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Hearst Edit",
  description:
    "A personalized Hearst lifestyle destination prototype powered by cross-brand editorial signals.",
};

export default function HearstEditPage() {
  return (
    <div className={newsreader.variable}>
      <ThemeProvider defaultBrandSlug="hearst-lifestyle">
        <HomePageTemplate />
      </ThemeProvider>
    </div>
  );
}
