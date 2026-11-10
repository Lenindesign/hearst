import { InternationalFeedPage } from "@/components/hearst-plus/international-feed-page";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstInternationalFeed } from "@/lib/hearst-international-feeds";
import { getHearstInternationalMix, peekHearstInternationalMix } from "@/lib/hearst-international-mix";

export default async function InternationalPage({
  searchParams,
}: {
  searchParams: Promise<{ feed?: string; country?: string }>;
}) {
  const { feed, country } = await searchParams;
  const isMix = !getHearstInternationalFeed(feed);
  // A warm mix renders on first paint. A cold one starts loading now, so the client's request joins it
  // instead of starting after hydration.
  const initialMix = isMix ? peekHearstInternationalMix() : null;
  if (isMix && !initialMix) void getHearstInternationalMix();

  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <InternationalFeedPage
        key={`${feed ?? ""}:${country ?? ""}`}
        initialFeedUrl={feed}
        initialCountry={country}
        initialStories={initialMix?.stories}
      />
    </ThemeProvider>
  );
}
