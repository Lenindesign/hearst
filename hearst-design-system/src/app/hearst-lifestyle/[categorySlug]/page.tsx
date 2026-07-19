import type { Metadata } from "next";
import {
  DestinationCategoryRoutePage,
  generateDestinationCategoryMetadata,
  generateDestinationCategoryStaticParams,
  type DestinationCategoryPageProps,
} from "@/app/hearst-destination-category-page";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return generateDestinationCategoryStaticParams("lifestyle"); }
export function generateMetadata(props: DestinationCategoryPageProps): Promise<Metadata> { return generateDestinationCategoryMetadata("lifestyle", props); }
export default function HearstLifestyleCategoryPage(props: DestinationCategoryPageProps) {
  return <DestinationCategoryRoutePage destination="lifestyle" {...props} />;
}
