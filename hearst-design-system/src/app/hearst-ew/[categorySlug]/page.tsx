import type { Metadata } from "next";
import { DestinationCategoryRoutePage, generateDestinationCategoryMetadata, generateDestinationCategoryStaticParams, type DestinationCategoryPageProps } from "@/app/hearst-destination-category-page";
export const dynamic = "force-dynamic";
export function generateStaticParams() { return generateDestinationCategoryStaticParams("ew"); }
export function generateMetadata(props: DestinationCategoryPageProps): Promise<Metadata> { return generateDestinationCategoryMetadata("ew", props); }
export default function HearstEWCategoryPage(props: DestinationCategoryPageProps) { return <DestinationCategoryRoutePage destination="ew" {...props} />; }
