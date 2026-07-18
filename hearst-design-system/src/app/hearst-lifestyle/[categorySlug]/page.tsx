import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import {
  DestinationCategoryRoutePage,
  generateDestinationCategoryMetadata,
  generateDestinationCategoryStaticParams,
  type DestinationCategoryPageProps,
} from "@/app/hearst-destination-category-page";

const newsreader = Newsreader({ display: "swap", subsets: ["latin"], variable: "--font-hearst-lifestyle-headline", weight: ["400", "500", "600", "700", "800"] });
export const dynamic = "force-dynamic";
export function generateStaticParams() { return generateDestinationCategoryStaticParams("lifestyle"); }
export function generateMetadata(props: DestinationCategoryPageProps): Promise<Metadata> { return generateDestinationCategoryMetadata("lifestyle", props); }
export default function HearstLifestyleCategoryPage(props: DestinationCategoryPageProps) {
  return <DestinationCategoryRoutePage destination="lifestyle" className={newsreader.variable} {...props} />;
}
