import { InternationalFeedPage } from "@/components/hearst-plus/international-feed-page";
import { ThemeProvider } from "@/components/theme-provider";

export default async function InternationalPage({
  searchParams,
}: {
  searchParams: Promise<{ feed?: string; country?: string }>;
}) {
  const { feed, country } = await searchParams;

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <InternationalFeedPage key={`${feed ?? ""}:${country ?? ""}`} initialFeedUrl={feed} initialCountry={country} />
    </ThemeProvider>
  );
}
