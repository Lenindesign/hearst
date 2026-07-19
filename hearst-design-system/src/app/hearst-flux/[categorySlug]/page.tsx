import type { Metadata } from "next";
import { DestinationCategoryRoutePage, generateDestinationCategoryMetadata, generateDestinationCategoryStaticParams, type DestinationCategoryPageProps } from "@/app/hearst-destination-category-page";
export const dynamic = "force-dynamic";
export function generateStaticParams() { return generateDestinationCategoryStaticParams("flux"); }
export function generateMetadata(props: DestinationCategoryPageProps): Promise<Metadata> { return generateDestinationCategoryMetadata("flux", props); }
export default function HearstFluxCategoryPage(props: DestinationCategoryPageProps) { return <DestinationCategoryRoutePage destination="flux" {...props} />; }
