import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { DestinationCategoryRoutePage, generateDestinationCategoryMetadata, generateDestinationCategoryStaticParams, type DestinationCategoryPageProps } from "@/app/hearst-destination-category-page";
const newsreader = Newsreader({ display: "swap", subsets: ["latin"], variable: "--font-hearst-flux-headline", weight: "700" });
export const dynamic = "force-dynamic";
export function generateStaticParams() { return generateDestinationCategoryStaticParams("flux"); }
export function generateMetadata(props: DestinationCategoryPageProps): Promise<Metadata> { return generateDestinationCategoryMetadata("flux", props); }
export default function HearstFluxCategoryPage(props: DestinationCategoryPageProps) { return <DestinationCategoryRoutePage destination="flux" className={newsreader.variable} {...props} />; }
