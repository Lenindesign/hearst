import type { Metadata } from "next";
import { Geist, Geist_Mono, Livvic, Newsreader, Petrona } from "next/font/google";
import { AmplitudeAnalyticsBridge } from "@/components/hearst-plus/amplitude-analytics-bridge";
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

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${livvic.variable} ${petrona.variable} antialiased`}
      >
        <AmplitudeAnalyticsBridge />
        <ReaderAccountProvider>{children}</ReaderAccountProvider>
      </body>
    </html>
  );
}
