import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { DestinationCategoryRoutePage, generateDestinationCategoryMetadata, generateDestinationCategoryStaticParams, type DestinationCategoryPageProps } from "@/app/hearst-destination-category-page";
const newsreader = Newsreader({ display: "swap", subsets: ["latin"], variable: "--font-hearst-ew-headline", weight: "700" });
export const dynamic = "force-dynamic";
export function generateStaticParams() { return generateDestinationCategoryStaticParams("ew"); }
export function generateMetadata(props: DestinationCategoryPageProps): Promise<Metadata> { return generateDestinationCategoryMetadata("ew", props); }
export default function HearstEWCategoryPage(props: DestinationCategoryPageProps) { return <DestinationCategoryRoutePage destination="ew" className={newsreader.variable} {...props} />; }
