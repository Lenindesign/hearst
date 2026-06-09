import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { HearstPlusApp } from "@/components/hearst-plus-app";
import { ThemeProvider } from "@/components/theme-provider";

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hearst-plus-headline",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Hearst+",
  description: "A cross-brand daily destination prototype for Hearst content.",
};

export default function HearstPlusPage() {
  return (
    <div className={newsreader.variable}>
      <ThemeProvider>
        <HearstPlusApp />
      </ThemeProvider>
    </div>
  );
}
