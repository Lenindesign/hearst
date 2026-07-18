import type { Metadata } from "next";
import {
  DestinationCategoryRoutePage,
  generateDestinationCategoryMetadata,
  generateDestinationCategoryStaticParams,
  type DestinationCategoryPageProps,
} from "@/app/hearst-destination-category-page";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return generateDestinationCategoryStaticParams("all");
}

export function generateMetadata(props: DestinationCategoryPageProps): Promise<Metadata> {
  return generateDestinationCategoryMetadata("all", props);
}

export default function HearstPlusCategoryPage(props: DestinationCategoryPageProps) {
  return <DestinationCategoryRoutePage destination="all" {...props} />;
}
