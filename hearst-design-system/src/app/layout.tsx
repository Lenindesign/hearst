import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Livvic, Newsreader, Petrona, Schibsted_Grotesk } from "next/font/google";
import { AmplitudeAnalyticsBridge } from "@/components/hearst-plus/amplitude-analytics-bridge";
import { EntertainmentRouteFallback } from "@/components/hearst-plus/entertainment-route-fallback";
import { ReaderAccountProvider } from "@/components/reader-account";
import { socialGraphMetadata } from "@/lib/social-graph-image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  // Variable font (weights 200–800). Listing discrete weights makes Google return the same file for each,
  // and Turbopack's next/font resolver fails on the duplicate URLs ("queries have exactly one entry").
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

// Hearst+ headline face.
const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  preload: false,
});

const livvic = Livvic({
  variable: "--font-livvic",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const petrona = Petrona({
  variable: "--font-petrona",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hearst-design-system.netlify.app"
  ),
  title: "Hearst Design System",
  description:
    "Brand themes and component showcase for Hearst brands, built with shadcn/ui",
  ...socialGraphMetadata("/opengraph-image/", "Hearst+", "A reader-first daily destination across the Hearst portfolio."),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${newsreader.variable} ${schibstedGrotesk.variable} ${livvic.variable} ${petrona.variable} antialiased`}
      >
        <AmplitudeAnalyticsBridge />
        <EntertainmentRouteFallback />
        <ReaderAccountProvider>{children}</ReaderAccountProvider>
      </body>
    </html>
  );
}
