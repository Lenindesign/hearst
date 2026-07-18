import type { Metadata } from "next";
import { DestinationCategoryRoutePage, generateDestinationCategoryMetadata, generateDestinationCategoryStaticParams, type DestinationCategoryPageProps } from "@/app/hearst-destination-category-page";
export const dynamic = "force-dynamic";
export function generateStaticParams() { return generateDestinationCategoryStaticParams("autos"); }
export function generateMetadata(props: DestinationCategoryPageProps): Promise<Metadata> { return generateDestinationCategoryMetadata("autos", props); }
export default function HearstAutosCategoryPage(props: DestinationCategoryPageProps) { return <DestinationCategoryRoutePage destination="autos" {...props} />; }
