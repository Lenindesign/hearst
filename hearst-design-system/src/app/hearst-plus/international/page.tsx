import { InternationalFeedPage } from "@/components/hearst-plus/international-feed-page";
import { ThemeProvider } from "@/components/theme-provider";

export default async function InternationalPage({
  searchParams,
}: {
  searchParams: Promise<{ feed?: string }>;
}) {
  const { feed } = await searchParams;

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <InternationalFeedPage initialFeedUrl={feed} />
    </ThemeProvider>
  );
}
