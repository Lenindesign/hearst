import type { Metadata } from "next";
import { HomePageTemplate } from "@/components/home-page";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Hearst Autos",
  description: "A personalized daily destination prototype for Hearst auto brands.",
};

export default function HearstPlusPage() {
  return (
    <ThemeProvider defaultBrandSlug="hearst-plus">
      <HomePageTemplate />
    </ThemeProvider>
  );
}
