import {
  SectionBrandRoutePage,
  generateSectionBrandMetadata,
  generateSectionBrandStaticParams,
} from "@/app/hearst-section-brand-page";

const section = "flux" as const;
type PageProps = { params: Promise<{ brandSlug: string }> };

export function generateStaticParams() {
  return generateSectionBrandStaticParams(section);
}

export async function generateMetadata(args: PageProps) {
  return generateSectionBrandMetadata(section, args);
}

export default function Page(props: PageProps) {
  return <SectionBrandRoutePage section={section} {...props} />;
}
